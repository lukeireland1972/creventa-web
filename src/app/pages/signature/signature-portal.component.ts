import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, PublicSignatureViewResponse } from '../../services/api.service';

@Component({
  selector: 'app-signature-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe],
  templateUrl: './signature-portal.component.html',
  styleUrl: './signature-portal.component.scss'
})
export class SignaturePortalComponent implements AfterViewInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('signatureCanvas')
  private signatureCanvas?: ElementRef<HTMLCanvasElement>;

  loading = true;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  token = '';
  model: PublicSignatureViewResponse | null = null;
  fullLegalName = '';
  companyName = '';
  signatureMode: 'typed' | 'drawn' = 'typed';
  typedSignature = '';

  private signatureContext: CanvasRenderingContext2D | null = null;
  private isDrawing = false;
  private hasDrawnSignature = false;

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const token = params.get('token') ?? '';
      this.token = token;
      if (!token) {
        this.loading = false;
        this.errorMessage = 'Signature link is invalid.';
        return;
      }

      this.load();
    });
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
  }

  get canSubmit(): boolean {
    if (!this.model || this.submitting) {
      return false;
    }

    const status = (this.model.status ?? '').toLowerCase();
    if (status === 'completed' || status === 'expired' || status === 'declined' || status === 'clientsigned') {
      return false;
    }

    if (!this.fullLegalName.trim()) {
      return false;
    }

    if (this.signatureMode === 'drawn') {
      return this.hasDrawnSignature;
    }

    return !!this.typedSignature.trim();
  }

  useSignatureMode(mode: 'typed' | 'drawn'): void {
    this.signatureMode = mode;
  }

  onSign(): void {
    if (!this.model || !this.canSubmit || !this.token) {
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const signatureData = this.signatureMode === 'drawn'
      ? this.signatureCanvas?.nativeElement.toDataURL('image/png') ?? ''
      : this.typedSignature.trim();

    this.api
      .signPublicProposal(this.token, {
        fullLegalName: this.fullLegalName.trim(),
        company: this.companyName.trim() || null,
        signatureType: this.signatureMode,
        signatureData,
        browserUserAgent: navigator.userAgent
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.submitting = false;
          this.successMessage = response.awaitingCounterSignature
            ? 'Signature captured. The venue manager must now counter-sign.'
            : 'Signature captured successfully. This proposal is now accepted.';
          this.load();
        },
        error: (error) => {
          this.submitting = false;
          const payload = error?.error as { message?: string } | string | undefined;
          if (typeof payload === 'string' && payload.trim()) {
            this.errorMessage = payload;
            return;
          }

          if (payload && typeof payload === 'object' && typeof payload.message === 'string' && payload.message.trim()) {
            this.errorMessage = payload.message;
            return;
          }

          this.errorMessage = 'Unable to submit signature. Please try again.';
        }
      });
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

  private load(): void {
    if (!this.token) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.api.getPublicSignatureView(this.token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (view) => {
          this.loading = false;
          this.model = view;
          if (!this.fullLegalName.trim()) {
            this.fullLegalName = view.clientName;
          }

          if (!this.typedSignature.trim()) {
            this.typedSignature = this.fullLegalName;
          }
        },
        error: (error) => {
          this.loading = false;
          this.model = null;
          const payload = error?.error as { message?: string } | string | undefined;
          if (typeof payload === 'string' && payload.trim()) {
            this.errorMessage = payload;
            return;
          }

          if (payload && typeof payload === 'object' && typeof payload.message === 'string' && payload.message.trim()) {
            this.errorMessage = payload.message;
            return;
          }

          this.errorMessage = 'Unable to load signature request.';
        }
      });
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
}
