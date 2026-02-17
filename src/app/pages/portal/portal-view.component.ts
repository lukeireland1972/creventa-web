import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, PortalDocumentDto, PortalMessageDto, PortalViewResponse } from '../../services/api.service';

type PortalTab = 'proposal' | 'payments' | 'documents' | 'messages' | 'event-summary';

@Component({
  selector: 'app-portal-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './portal-view.component.html',
  styleUrl: './portal-view.component.scss'
})
export class PortalViewComponent implements AfterViewInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('signatureCanvas')
  private signatureCanvas?: ElementRef<HTMLCanvasElement>;

  loading = true;
  submittingAccept = false;
  submittingDecline = false;
  submittingRequestChanges = false;
  creatingPaymentLinkId: string | null = null;
  uploadingDocument = false;
  sendingMessage = false;
  errorMessage = '';
  successMessage = '';
  documentErrorMessage = '';
  showConfetti = false;

  rawToken = '';
  activeToken = '';
  activeTab: PortalTab = 'proposal';
  model: PortalViewResponse | null = null;

  acceptTerms = false;
  termsScrolledToBottom = false;
  fullLegalName = '';
  signatureMode: 'typed' | 'drawn' = 'typed';
  typedSignature = '';

  declineReason = '';
  requestChangesComment = '';
  messageDraft = '';
  uploadCategory = 'Other';

  private signatureContext: CanvasRenderingContext2D | null = null;
  private isDrawing = false;
  private hasDrawnSignature = false;

  readonly tabs: ReadonlyArray<{ key: PortalTab; label: string }> = [
    { key: 'proposal', label: 'Proposal' },
    { key: 'payments', label: 'Payments' },
    { key: 'documents', label: 'Documents' },
    { key: 'messages', label: 'Messages' },
    { key: 'event-summary', label: 'Event Summary' }
  ];

  readonly documentCategories = ['Contract', 'Floor Plan', 'Menu', 'BEO', 'Invoice', 'Other'];
  readonly supportedDocumentMimeTypes = new Set([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'text/csv'
  ]);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const token = params.get('token') ?? '';
      const tab = this.normalizeTab(params.get('tab'));

      if (!token) {
        this.loading = false;
        this.errorMessage = 'Portal link is invalid.';
        return;
      }

      const tokenChanged = token !== this.rawToken;
      this.rawToken = token;
      this.activeToken = token;
      this.activeTab = tab;

      if (tokenChanged) {
        this.termsScrolledToBottom = false;
        this.acceptTerms = false;
      }

      if (tokenChanged || !this.model) {
        this.loadPortal();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
  }

  get canSubmitAccept(): boolean {
    if (!this.termsScrolledToBottom || !this.acceptTerms || !this.fullLegalName.trim()) {
      return false;
    }

    if (this.signatureMode === 'drawn') {
      return this.hasDrawnSignature;
    }

    return !!this.typedSignature.trim();
  }

  get resolvedTokenExpiry(): string {
    return this.model?.refreshedTokenExpiresAtUtc ?? this.model?.tokenExpiresAtUtc ?? '';
  }

  get canPerformPortalActions(): boolean {
    const status = (this.model?.proposal.status ?? '').toLowerCase();
    return status === 'sent' || status === 'viewed';
  }

  get activeTabLabel(): string {
    return this.tabs.find((x) => x.key === this.activeTab)?.label ?? 'Proposal';
  }

  get portalMessages(): PortalMessageDto[] {
    return this.model?.messages ?? [];
  }

  get portalDocuments(): PortalDocumentDto[] {
    return this.model?.documents ?? [];
  }

  navigateTab(tab: PortalTab): void {
    if (this.activeToken === '') {
      return;
    }

    this.router.navigate(['/portal', this.activeToken, tab]);
  }

  onAccept(): void {
    if (!this.model || !this.canSubmitAccept || this.submittingAccept) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.submittingAccept = true;

    const signatureData = this.signatureMode === 'drawn'
      ? this.signatureCanvas?.nativeElement.toDataURL('image/png') ?? ''
      : this.typedSignature.trim();

    this.api.acceptPortalProposalByToken(this.activeToken, {
      acceptTerms: true,
      fullLegalName: this.fullLegalName.trim(),
      signatureType: this.signatureMode,
      signatureData,
      browserUserAgent: navigator.userAgent
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.submittingAccept = false;
        this.successMessage = 'Proposal accepted successfully.';
        this.showConfetti = true;
        window.setTimeout(() => {
          this.showConfetti = false;
        }, 4000);
        this.bindPortalResponse(response);
      },
      error: (error) => {
        this.submittingAccept = false;
        this.errorMessage = this.resolvePortalError(error, 'Unable to accept proposal.');
      }
    });
  }

  onDecline(): void {
    if (!this.model || this.submittingDecline || !this.canPerformPortalActions) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.submittingDecline = true;

    this.api.declinePortalProposalByToken(this.activeToken, {
      reason: this.declineReason.trim() || null
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.submittingDecline = false;
        this.successMessage = 'Proposal declined. The venue has been notified.';
        this.loadPortal();
      },
      error: (error) => {
        this.submittingDecline = false;
        this.errorMessage = this.resolvePortalError(error, 'Unable to decline proposal.');
      }
    });
  }

  onRequestChanges(): void {
    if (!this.model || this.submittingRequestChanges || !this.canPerformPortalActions) {
      return;
    }

    if (!this.requestChangesComment.trim()) {
      this.errorMessage = 'Please provide a comment before requesting changes.';
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.submittingRequestChanges = true;

    this.api.requestPortalProposalChanges(this.activeToken, {
      comment: this.requestChangesComment.trim()
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.submittingRequestChanges = false;
        this.successMessage = 'Change request sent to the venue team.';
        this.requestChangesComment = '';
        this.loadPortal();
      },
      error: (error) => {
        this.submittingRequestChanges = false;
        this.errorMessage = this.resolvePortalError(error, 'Unable to request changes.');
      }
    });
  }

  onCreatePaymentLink(milestoneId: string): void {
    if (!milestoneId || this.creatingPaymentLinkId) {
      return;
    }

    this.creatingPaymentLinkId = milestoneId;
    this.errorMessage = '';
    const returnUrl = window.location.href;
    this.api.createPortalPaymentLink(this.activeToken, milestoneId, { returnUrl, cancelUrl: returnUrl })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.creatingPaymentLinkId = null;
          window.open(result.url, '_blank', 'noopener');
          this.loadPortal();
        },
        error: (error) => {
          this.creatingPaymentLinkId = null;
          this.errorMessage = this.resolvePortalError(error, 'Unable to create payment link.');
        }
      });
  }

  onDocumentChosen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) {
      return;
    }

    this.documentErrorMessage = '';
    if (file.size <= 0 || file.size > 25 * 1024 * 1024) {
      this.documentErrorMessage = 'Document must be between 1 byte and 25MB.';
      return;
    }

    if (!this.supportedDocumentMimeTypes.has(file.type)) {
      this.documentErrorMessage = 'Unsupported file type. Allowed: PDF, DOCX, XLSX, JPG, PNG, CSV.';
      return;
    }

    this.uploadingDocument = true;
    this.api.uploadPortalDocument(this.activeToken, file, this.uploadCategory)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.uploadingDocument = false;
          this.successMessage = 'Document uploaded successfully.';
          this.loadPortal();
        },
        error: (error) => {
          this.uploadingDocument = false;
          this.documentErrorMessage = this.resolvePortalError(error, 'Unable to upload document.');
        }
      });
  }

  onSendMessage(): void {
    const message = this.messageDraft.trim();
    if (!message || this.sendingMessage) {
      return;
    }

    this.sendingMessage = true;
    this.errorMessage = '';
    this.api.postPortalMessage(this.activeToken, { message })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.sendingMessage = false;
          this.messageDraft = '';
          this.successMessage = 'Message sent to the venue team.';
          this.loadPortal();
        },
        error: (error) => {
          this.sendingMessage = false;
          this.errorMessage = this.resolvePortalError(error, 'Unable to send message.');
        }
      });
  }

  onTermsScrolled(event: Event): void {
    const target = event.target as HTMLElement;
    const threshold = 16;
    this.termsScrolledToBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - threshold;
  }

  onCanvasPointerDown(event: PointerEvent): void {
    if (this.signatureMode !== 'drawn') {
      return;
    }

    const canvas = this.signatureCanvas?.nativeElement;
    if (!canvas || !this.signatureContext) {
      return;
    }

    canvas.setPointerCapture(event.pointerId);
    const { x, y } = this.resolveCanvasCoordinates(event, canvas);
    this.signatureContext.beginPath();
    this.signatureContext.moveTo(x, y);
    this.isDrawing = true;
  }

  onCanvasPointerMove(event: PointerEvent): void {
    if (!this.isDrawing || this.signatureMode !== 'drawn') {
      return;
    }

    const canvas = this.signatureCanvas?.nativeElement;
    if (!canvas || !this.signatureContext) {
      return;
    }

    const { x, y } = this.resolveCanvasCoordinates(event, canvas);
    this.signatureContext.lineTo(x, y);
    this.signatureContext.stroke();
    this.hasDrawnSignature = true;
  }

  onCanvasPointerUp(event: PointerEvent): void {
    const canvas = this.signatureCanvas?.nativeElement;
    if (!canvas) {
      return;
    }

    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }

    this.isDrawing = false;
  }

  clearDrawnSignature(): void {
    const canvas = this.signatureCanvas?.nativeElement;
    if (!canvas || !this.signatureContext) {
      return;
    }

    this.signatureContext.clearRect(0, 0, canvas.width, canvas.height);
    this.hasDrawnSignature = false;
  }

  useSignatureMode(mode: 'typed' | 'drawn'): void {
    this.signatureMode = mode;
    this.errorMessage = '';
  }

  openDownload(url?: string | null): void {
    const resolved = this.resolvePortalDocumentUrl(url);
    if (!resolved) {
      return;
    }

    window.open(resolved, '_blank', 'noopener');
  }

  openDocument(documentId: string): void {
    const url = `/api/portal/documents/${documentId}?token=${encodeURIComponent(this.activeToken)}`;
    window.open(url, '_blank', 'noopener');
  }

  private loadPortal(): void {
    if (!this.activeToken) {
      this.loading = false;
      this.errorMessage = 'Portal link is invalid.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.api.getPortalView(this.activeToken).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.loading = false;
        this.bindPortalResponse(response);
      },
      error: (error) => {
        this.loading = false;
        this.model = null;
        this.errorMessage = this.resolvePortalError(error, 'Unable to load portal data.');
      }
    });
  }

  private bindPortalResponse(response: PortalViewResponse): void {
    this.model = response;

    const refreshed = response.refreshedToken?.trim();
    if (refreshed && refreshed !== this.activeToken) {
      this.activeToken = refreshed;
      this.router.navigate(['/portal', refreshed, this.activeTab], { replaceUrl: true });
    }

    if (!this.fullLegalName.trim()) {
      this.fullLegalName = response.proposal.clientName;
    }

    if (!this.typedSignature.trim()) {
      this.typedSignature = this.fullLegalName;
    }
  }

  private initializeCanvas(): void {
    const canvas = this.signatureCanvas?.nativeElement;
    if (!canvas) {
      return;
    }

    this.signatureContext = canvas.getContext('2d');
    if (!this.signatureContext) {
      return;
    }

    this.signatureContext.strokeStyle = '#0f172a';
    this.signatureContext.lineWidth = 2;
    this.signatureContext.lineCap = 'round';
    this.signatureContext.lineJoin = 'round';
  }

  private resolveCanvasCoordinates(event: PointerEvent, canvas: HTMLCanvasElement): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  private resolvePortalDocumentUrl(url?: string | null): string {
    if (!url) {
      return '';
    }

    const normalized = url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `${window.location.origin}${url}`;

    if (!this.activeToken || normalized.includes('token=')) {
      return normalized;
    }

    const separator = normalized.includes('?') ? '&' : '?';
    return `${normalized}${separator}token=${encodeURIComponent(this.activeToken)}`;
  }

  private normalizeTab(rawTab: string | null): PortalTab {
    const value = (rawTab ?? '').trim().toLowerCase();
    if (value === 'proposal' || value === 'payments' || value === 'documents' || value === 'messages' || value === 'event-summary') {
      return value;
    }

    return 'proposal';
  }

  private resolvePortalError(error: unknown, fallback: string): string {
    const response = error as { status?: number; error?: unknown };
    const payload = response?.error as { code?: string; message?: string } | string | undefined;

    if (response?.status === 401 || response?.status === 410) {
      if (typeof payload === 'object' && payload?.message) {
        return payload.message;
      }

      return 'This proposal link has expired or is invalid. Please request a new link from the venue.';
    }

    if (typeof payload === 'string' && payload.trim()) {
      return payload;
    }

    if (typeof payload === 'object' && payload?.message) {
      return payload.message;
    }

    return fallback;
  }
}
