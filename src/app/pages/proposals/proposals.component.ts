import { Component, DestroyRef, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';
import {
  AiPricingRecommendationResponse,
  ApiService,
  CreateProposalLineItemRequest,
  EnquiryDetailResponse,
  EnquirySustainabilityResponse,
  EnquiryListItemDto,
  ProposalComparisonResponse,
  ProposalDetailResponse,
  ProposalListItemDto,
  ProposalListResponse,
  ProposalSectionDto,
  ProposalSignatureEnvelopeDto,
  ProposalTemplateSettingDto,
  ProposalTemplateOptionDto,
  TermsDocumentSettingDto,
  VenueProfileDto
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

const DEFAULT_BUILDER_SECTIONS: ProposalSectionDto[] = [
  { key: 'coverPage', title: 'Cover Page', isEnabled: true, sortOrder: 1 },
  { key: 'eventDetails', title: 'Event Details', isEnabled: true, sortOrder: 2 },
  { key: 'menuPackages', title: 'Menu / Package Selection', isEnabled: true, sortOrder: 3 },
  { key: 'additionalServices', title: 'Additional Services', isEnabled: true, sortOrder: 4 },
  { key: 'pricingSummary', title: 'Pricing Summary', isEnabled: true, sortOrder: 5 },
  { key: 'sustainabilityImpact', title: 'Sustainability Impact', isEnabled: false, sortOrder: 6 },
  { key: 'termsConditions', title: 'Terms & Conditions', isEnabled: true, sortOrder: 7 },
  { key: 'acceptanceBlock', title: 'Acceptance Block', isEnabled: true, sortOrder: 8 }
];

type LineSectionType = 'MenuPackage' | 'AdditionalServices';

@Component({
  selector: 'app-proposals',
  imports: [DatePipe, DecimalPipe, ReactiveFormsModule, FormsModule],
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.scss'
})
export class ProposalsComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private formBuilder = new FormBuilder();

  loadingList = false;
  loadingDetail = false;
  listResponse: ProposalListResponse | null = null;
  proposals: ProposalListItemDto[] = [];
  selectedProposalId: string | null = null;
  selectedProposal: ProposalDetailResponse | null = null;
  signatureEnvelope: ProposalSignatureEnvelopeDto | null = null;
  signatureLoading = false;
  signatureBusy = false;
  comparison: ProposalComparisonResponse | null = null;
  compareWithProposalId = '';
  lastActionMessage = '';
  selectedEnquiryIdFilter: string | null = null;

  isBuilderOpen = false;
  builderMode: 'create' | 'edit' = 'create';
  builderSaving = false;
  builderError = '';
  builderNotice = '';
  builderSubtotalExclVat = 0;
  builderServiceChargeAmount = 0;
  builderTotalVat = 0;
  builderTotalInclVat = 0;
  aiPricingRecommendation: AiPricingRecommendationResponse | null = null;
  aiPricingLoading = false;
  aiPricingMessage = '';
  builderVatBreakdown: Array<{ vatRate: number; vatAmount: number }> = [];
  builderSectionSubtotals: Record<LineSectionType, number> = {
    MenuPackage: 0,
    AdditionalServices: 0
  };
  builderSections: ProposalSectionDto[] = [...DEFAULT_BUILDER_SECTIONS];
  draggedLineIndex: number | null = null;
  savingTemplate = false;
  builderEnquiryDetail: EnquiryDetailResponse | null = null;
  builderEnquirySustainability: EnquirySustainabilityResponse | null = null;
  venueProfile: VenueProfileDto | null = null;
  sendEmailDraft = '';
  private pendingManualSignedProposalId: string | null = null;
  @ViewChild('manualSignedFileInput')
  private manualSignedFileInput?: ElementRef<HTMLInputElement>;
  readonly lineSectionOptions: Array<{ value: LineSectionType; label: string }> = [
    { value: 'MenuPackage', label: 'Menu / Package Selection' },
    { value: 'AdditionalServices', label: 'Additional Services' }
  ];

  enquiryOptions: EnquiryListItemDto[] = [];
  templateOptions: ProposalTemplateOptionDto[] = [];
  termsDocuments: TermsDocumentSettingDto[] = [];
  private applyingTemplate = false;

  statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'viewed', label: 'Viewed' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'declined', label: 'Declined' },
    { value: 'expired', label: 'Expired' },
    { value: 'superseded', label: 'Superseded' }
  ];

  filtersForm = this.formBuilder.group({
    status: ['all'],
    enquiryId: [''],
    eventType: [''],
    sortBy: ['createdAt'],
    sortDirection: ['desc'],
    pageSize: [25]
  });

  builderForm = this.formBuilder.group({
    enquiryId: ['', Validators.required],
    templateKey: [''],
    title: [''],
    validUntilDate: [this.defaultValidUntilDate(), Validators.required],
    introduction: [''],
    termsVersion: [''],
    currencyCode: ['GBP', [Validators.required, Validators.maxLength(8)]],
    serviceChargePercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    preparedFor: [''],
    eventDate: [''],
    eventTime: [''],
    guestCount: [0],
    eventStyle: [''],
    assignedSpace: [''],
    acceptanceSignature: [''],
    lineItems: this.formBuilder.array([])
  });

  get venueId(): string | null {
    return this.auth.selectedVenueId;
  }

  get lineItemsArray(): FormArray {
    return this.builderForm.get('lineItems') as FormArray;
  }

  get lineItemControls() {
    return this.lineItemsArray.controls;
  }

  get orderedBuilderSections(): ProposalSectionDto[] {
    return [...this.builderSections].sort((left, right) => left.sortOrder - right.sortOrder);
  }

  get selectedProposalCanEdit(): boolean {
    return !!this.selectedProposal?.isEditable;
  }

  get aiPricingTone(): 'above' | 'at' | 'below' | 'unknown' {
    const recommendation = this.aiPricingRecommendation;
    if (!recommendation || !recommendation.hasSufficientData || recommendation.suggestedPrice <= 0) {
      return 'unknown';
    }

    const delta = this.builderTotalInclVat - recommendation.suggestedPrice;
    const threshold = recommendation.suggestedPrice * 0.03;
    if (delta > threshold) {
      return 'above';
    }

    if (delta < -threshold) {
      return 'below';
    }

    return 'at';
  }

  get canCounterSignSelectedProposal(): boolean {
    const status = (this.signatureEnvelope?.status ?? '').toLowerCase();
    return !!this.selectedProposalId && !!this.signatureEnvelope && (status === 'clientsigned' || status === 'viewed');
  }

  ngOnInit(): void {
    this.ensureBuilderHasAtLeastOneLine();
    this.auth.session$
      .pipe(
        map((session) => session?.venueId ?? null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((venueId) => {
        this.handleVenueChange(venueId);
      });

    this.filtersForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.loadProposals(1);
    });

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const proposalId = params.get('proposal');
      const enquiryId = params.get('enquiry');
      const createRequested = params.get('create') === '1';

      if (enquiryId && this.filtersForm.value.enquiryId !== enquiryId) {
        this.filtersForm.patchValue({ enquiryId }, { emitEvent: false });
      }

      if (proposalId && proposalId !== this.selectedProposalId) {
        this.selectProposal(proposalId);
      }

      if (createRequested) {
        this.openBuilderForCreate(enquiryId ?? undefined);
      }
    });

    this.builderForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.recalculateBuilderTotals();
    });

    this.builderForm.controls.enquiryId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((enquiryId) => {
      this.onBuilderEnquiryChanged(enquiryId || '');
    });

    this.builderForm.controls.templateKey.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((templateKey) => {
      if (!this.applyingTemplate) {
        this.applyTemplate(templateKey || '');
      }
    });
  }

  setStatus(status: string): void {
    this.filtersForm.patchValue({ status }, { emitEvent: true });
  }

  selectProposal(proposalId: string): void {
    this.selectedProposalId = proposalId;
    this.selectedEnquiryIdFilter = null;
    this.signatureEnvelope = null;
    this.loadProposalDetail(proposalId);
  }

  duplicateSelectedProposal(): void {
    if (!this.selectedProposal) {
      return;
    }

    this.api
      .duplicateProposal(this.selectedProposal.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.lastActionMessage = 'Proposal duplicated as a new draft version.';
          this.loadProposals(this.listResponse?.page.page ?? 1);
        },
        error: (error) => {
          this.lastActionMessage = error?.error ?? 'Unable to duplicate proposal.';
        }
      });
  }

  sendSelectedProposal(): void {
    if (!this.selectedProposalId) {
      return;
    }

    const suggestedEmail = this.builderEnquiryDetail?.contactEmail;
    this.sendProposalByPrompt(this.selectedProposalId, suggestedEmail ?? undefined);
  }

  sendSelectedProposalForSignature(): void {
    if (!this.selectedProposalId) {
      return;
    }

    const defaultEmail = this.builderEnquiryDetail?.contactEmail ?? '';
    this.sendProposalForSignatureByPrompt(this.selectedProposalId, defaultEmail);
  }

  sendProposalFromList(proposalId: string, event: Event): void {
    event.stopPropagation();
    this.sendProposalByPrompt(proposalId, this.builderEnquiryDetail?.contactEmail ?? undefined);
  }

  sendProposalForSignatureFromList(proposalId: string, event: Event): void {
    event.stopPropagation();
    this.sendProposalForSignatureByPrompt(proposalId, this.builderEnquiryDetail?.contactEmail ?? undefined);
  }

  viewProposalFromList(proposalId: string, event: Event): void {
    event.stopPropagation();
    this.selectProposal(proposalId);
  }

  editProposalFromList(proposalId: string, event: Event): void {
    event.stopPropagation();
    if (proposalId === this.selectedProposalId && this.selectedProposal) {
      this.openBuilderForEdit();
      return;
    }

    this.api
      .getProposal(proposalId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (proposal) => {
          this.selectedProposalId = proposal.id;
          this.selectedProposal = proposal;
          this.selectedEnquiryIdFilter = proposal.enquiryId;
          this.openBuilderForEdit();
        },
        error: (error) => {
          this.lastActionMessage = error?.error ?? 'Unable to load proposal for editing.';
        }
      });
  }

  duplicateProposalFromList(proposalId: string, event: Event): void {
    event.stopPropagation();
    this.api
      .duplicateProposal(proposalId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.lastActionMessage = `Proposal duplicated as ${result.version}.`;
          this.loadProposals(this.listResponse?.page.page ?? 1);
          this.selectProposal(result.proposalId);
        },
        error: (error) => {
          this.lastActionMessage = error?.error ?? 'Unable to duplicate proposal.';
        }
      });
  }

  generatePdfFromList(proposalId: string, event: Event): void {
    event.stopPropagation();
    this.api
      .generateProposalPdf(proposalId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.lastActionMessage = `Generated PDF ${result.fileName}.`;
          if (this.selectedProposalId === proposalId) {
            this.loadProposalDetail(proposalId);
          }
        },
        error: (error) => {
          this.lastActionMessage = error?.error ?? 'Unable to generate proposal PDF.';
        }
      });
  }

  generatePdfForSelectedProposal(): void {
    if (!this.selectedProposalId) {
      return;
    }

    this.api
      .generateProposalPdf(this.selectedProposalId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.lastActionMessage = `Generated PDF ${result.fileName}.`;
          this.loadProposalDetail(this.selectedProposalId!);
        },
        error: (error) => {
          this.lastActionMessage = error?.error ?? 'Unable to generate proposal PDF.';
        }
      });
  }

  counterSignSelectedProposal(): void {
    if (!this.selectedProposalId || !this.signatureEnvelope) {
      return;
    }

    const fullLegalName = window.prompt('Counter-sign full legal name', this.auth.session?.fullName ?? '');
    if (!fullLegalName || !fullLegalName.trim()) {
      return;
    }

    const company = window.prompt('Counter-sign company (optional)', '') ?? '';
    this.signatureBusy = true;
    this.api
      .counterSignProposal(this.selectedProposalId, this.signatureEnvelope.id, {
        fullLegalName: fullLegalName.trim(),
        company: this.trimOptional(company),
        notes: 'Counter-signed from Proposal Maker'
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (envelope) => {
          this.signatureBusy = false;
          this.signatureEnvelope = envelope;
          this.lastActionMessage = 'Counter-signature recorded and proposal accepted.';
          this.loadProposalDetail(this.selectedProposalId!);
          this.loadProposals(this.listResponse?.page.page ?? 1);
        },
        error: (error) => {
          this.signatureBusy = false;
          this.lastActionMessage = error?.error?.message ?? error?.error ?? 'Unable to counter-sign proposal.';
        }
      });
  }

  openManualMarkSignedPicker(): void {
    if (!this.selectedProposalId || this.signatureBusy) {
      return;
    }

    this.pendingManualSignedProposalId = this.selectedProposalId;
    if (this.manualSignedFileInput?.nativeElement) {
      this.manualSignedFileInput.nativeElement.value = '';
      this.manualSignedFileInput.nativeElement.click();
    }
  }

  onManualSignedFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.pendingManualSignedProposalId) {
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      this.lastActionMessage = 'Signed document must be under 25MB.';
      return;
    }

    const fullLegalName = window.prompt('Client full legal name for this signed file', this.selectedProposal?.clientName ?? '');
    if (!fullLegalName || !fullLegalName.trim()) {
      return;
    }

    const email = window.prompt('Client email', this.builderEnquiryDetail?.contactEmail ?? '');
    if (!email || !email.trim()) {
      return;
    }

    const company = window.prompt('Client company (optional)', '') ?? '';
    const proposalId = this.pendingManualSignedProposalId;
    this.pendingManualSignedProposalId = null;
    this.signatureBusy = true;

    this.fileToBase64(file)
      .then((base64Content) => {
        this.api
          .markProposalSigned(proposalId, {
            fullLegalName: fullLegalName.trim(),
            email: email.trim(),
            company: this.trimOptional(company),
            fileName: file.name,
            mimeType: file.type || 'application/pdf',
            base64Content,
            notes: 'Manual wet-signed upload'
          })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (envelope) => {
              this.signatureBusy = false;
              this.signatureEnvelope = envelope;
              this.lastActionMessage = 'Manual signed contract recorded and proposal accepted.';
              this.loadProposalDetail(proposalId);
              this.loadProposals(this.listResponse?.page.page ?? 1);
            },
            error: (error) => {
              this.signatureBusy = false;
              this.lastActionMessage = error?.error?.message ?? error?.error ?? 'Unable to mark proposal as signed.';
            }
          });
      })
      .catch(() => {
        this.signatureBusy = false;
        this.lastActionMessage = 'Unable to read the signed file.';
      });
  }

  saveBuilderAsTemplate(): void {
    const venueId = this.venueId;
    if (!venueId) {
      this.builderError = 'Select a venue before saving a template.';
      return;
    }

    const lineItems = this.toLineItemPayload();
    if (lineItems.length === 0) {
      this.builderError = 'Add at least one line item before saving a template.';
      return;
    }

    const label = window.prompt('Template name');
    if (!label || !label.trim()) {
      return;
    }

    const eventType = this.builderEnquiryDetail?.eventType
      ?? this.enquiryOptions.find((x) => x.id === this.builderForm.controls.enquiryId.value)?.eventType
      ?? 'Other';

    this.savingTemplate = true;

    this.api
      .getVenueProposalTemplates(venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (existingTemplates) => {
          const keyBase = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'template';
          let key = keyBase;
          let suffix = 2;
          while (existingTemplates.some((template) => template.key === key)) {
            key = `${keyBase}-${suffix}`;
            suffix += 1;
          }

          const today = new Date();
          const validUntilRaw = this.builderForm.controls.validUntilDate.value;
          const validUntil = validUntilRaw ? new Date(validUntilRaw) : today;
          const defaultValidityDays = Math.max(
            1,
            Math.round((validUntil.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

          const template: ProposalTemplateSettingDto = {
            key,
            label: label.trim(),
            eventType,
            defaultLineItems: lineItems.map((line) => ({
              sectionType: line.sectionType,
              sortOrder: line.sortOrder ?? null,
              category: line.category,
              description: line.description,
              quantity: line.quantity,
              unit: line.unit ?? 'Flat rate',
              unitPriceExclVat: line.unitPriceExclVat,
              vatRate: line.vatRate,
              discountPercent: line.discountPercent ?? 0,
              discountAmount: line.discountAmount ?? 0
            })),
            defaultIntroduction: this.trimOptional(this.builderForm.controls.introduction.value),
            defaultTermsVersion: this.trimOptional(this.builderForm.controls.termsVersion.value),
            defaultValidityDays
          };

          this.api
            .upsertVenueProposalTemplates(venueId, [...existingTemplates, template])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.savingTemplate = false;
                this.builderNotice = `Saved template "${template.label}".`;
                this.onBuilderEnquiryChanged(this.builderForm.controls.enquiryId.value ?? '');
              },
              error: (error) => {
                this.savingTemplate = false;
                this.builderError = error?.error ?? 'Unable to save template.';
              }
            });
        },
        error: (error) => {
          this.savingTemplate = false;
          this.builderError = error?.error ?? 'Unable to load existing templates.';
        }
      });
  }

  addLineItemForSection(sectionType: LineSectionType): void {
    this.addLineItem({ sectionType }, sectionType);
  }

  moveSection(index: number, offset: number): void {
    const ordered = this.orderedBuilderSections;
    const target = index + offset;
    if (target < 0 || target >= ordered.length) {
      return;
    }

    const current = ordered[index];
    ordered[index] = ordered[target];
    ordered[target] = current;
    this.builderSections = ordered.map((section, i) => ({ ...section, sortOrder: i + 1 }));
  }

  toggleSection(sectionKey: string): void {
    this.builderSections = this.builderSections.map((section) =>
      section.key === sectionKey
        ? { ...section, isEnabled: !section.isEnabled }
        : section);
  }

  sectionEnabled(sectionKey: string): boolean {
    return this.builderSections.some((section) => section.key === sectionKey && section.isEnabled);
  }

  sectionSubtotal(section: LineSectionType): number {
    return this.builderSectionSubtotals[section] ?? 0;
  }

  selectedTermsContent(): string {
    const selectedVersion = this.builderForm.controls.termsVersion.value;
    if (!selectedVersion) {
      return 'No terms content available for this version.';
    }

    const match = this.termsDocuments.find((document) => document.version === selectedVersion);
    return match?.content ?? 'No terms content available for this version.';
  }

  onLineDragStart(index: number, event: DragEvent): void {
    this.draggedLineIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(index));
    }
  }

  onLineDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onLineDrop(targetIndex: number, event: DragEvent): void {
    event.preventDefault();
    const sourceIndex = this.draggedLineIndex ?? Number(event.dataTransfer?.getData('text/plain'));
    this.draggedLineIndex = null;

    if (!Number.isFinite(sourceIndex) || sourceIndex < 0 || sourceIndex >= this.lineItemsArray.length) {
      return;
    }

    if (sourceIndex === targetIndex) {
      return;
    }

    const sourceControl = this.lineItemsArray.at(sourceIndex);
    this.lineItemsArray.removeAt(sourceIndex);
    const adjustedTarget = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
    this.lineItemsArray.insert(adjustedTarget, sourceControl);
    this.recalculateBuilderTotals();
  }

  openBuilderForCreate(enquiryId?: string): void {
    this.builderMode = 'create';
    this.isBuilderOpen = true;
    this.builderError = '';
    this.builderNotice = '';
    this.comparison = null;
    this.sendEmailDraft = '';
    this.builderSections = [...DEFAULT_BUILDER_SECTIONS];

    const initialEnquiryId = enquiryId
      ?? this.selectedProposal?.enquiryId
      ?? this.selectedEnquiryIdFilter
      ?? this.enquiryOptions[0]?.id
      ?? '';

    this.applyingTemplate = true;
    this.builderForm.reset({
      enquiryId: initialEnquiryId,
      templateKey: '',
      title: '',
      validUntilDate: this.defaultValidUntilDate(),
      introduction: '',
      termsVersion: this.termsDocuments.find((doc) => doc.isActive)?.version ?? '',
      currencyCode: this.resolveDefaultCurrency(initialEnquiryId),
      serviceChargePercent: 0,
      preparedFor: '',
      eventDate: '',
      eventTime: '',
      guestCount: 0,
      eventStyle: '',
      assignedSpace: '',
      acceptanceSignature: ''
    });
    this.applyingTemplate = false;

    this.lineItemsArray.clear();
    this.addLineItem({ sectionType: 'MenuPackage' });
    this.recalculateBuilderTotals();
    this.onBuilderEnquiryChanged(initialEnquiryId);
  }

  openBuilderForEdit(): void {
    if (!this.selectedProposal || !this.selectedProposal.isEditable) {
      return;
    }

    const proposal = this.selectedProposal;
    const serviceChargePercent = proposal.subtotalExclVat > 0
      ? this.round2((proposal.serviceChargeAmount / proposal.subtotalExclVat) * 100)
      : 0;

    this.builderMode = 'edit';
    this.isBuilderOpen = true;
    this.builderError = '';
    this.builderNotice = '';
    this.comparison = null;
    this.sendEmailDraft = this.builderEnquiryDetail?.contactEmail ?? this.sendEmailDraft;
    this.builderSections = proposal.sections.length > 0
      ? [...proposal.sections].sort((left, right) => left.sortOrder - right.sortOrder)
      : [...DEFAULT_BUILDER_SECTIONS];

    this.applyingTemplate = true;
    this.builderForm.patchValue({
      enquiryId: proposal.enquiryId,
      templateKey: '',
      title: proposal.title ?? '',
      validUntilDate: proposal.validUntilDate ?? this.defaultValidUntilDate(),
      introduction: proposal.introduction ?? '',
      termsVersion: proposal.termsVersion,
      currencyCode: proposal.currencyCode,
      serviceChargePercent,
      preparedFor: proposal.clientName,
      eventDate: this.builderEnquiryDetail ? this.toDateOnlyLocal(this.builderEnquiryDetail.eventStartUtc) : '',
      eventTime: this.builderEnquiryDetail ? this.toTimeOnlyLocal(this.builderEnquiryDetail.eventStartUtc) : '',
      guestCount: this.builderEnquiryDetail?.guestsExpected ?? 0,
      eventStyle: this.builderEnquiryDetail?.eventStyle ?? '',
      assignedSpace: this.builderEnquiryDetail ? this.resolveSpaceFromEnquiry(this.builderEnquiryDetail) : '',
      acceptanceSignature: proposal.acceptedByName ?? ''
    });
    this.applyingTemplate = false;

    this.lineItemsArray.clear();
    for (const line of proposal.lineItems) {
      const fixedDiscountAmount = this.resolveFixedDiscountAmount(line.quantity, line.unitPriceExclVat, line.discountPercent, line.discountAmount);
      this.lineItemsArray.push(this.createLineItemGroup({
        category: line.category,
        description: line.description,
        quantity: line.quantity,
        unit: line.unit,
        unitPriceExclVat: line.unitPriceExclVat,
        vatRate: line.vatRate,
        discountPercent: line.discountPercent,
        discountAmount: fixedDiscountAmount,
        sectionType: (line.sectionType as LineSectionType) ?? 'MenuPackage'
      }));
    }

    this.ensureBuilderHasAtLeastOneLine();
    this.onBuilderEnquiryChanged(proposal.enquiryId);
    this.recalculateBuilderTotals();
  }

  closeBuilder(): void {
    this.isBuilderOpen = false;
    this.builderError = '';
    this.builderNotice = '';
    this.draggedLineIndex = null;
  }

  addLineItem(seed?: Partial<CreateProposalLineItemRequest>, sectionType?: LineSectionType): void {
    const resolvedSectionType = (seed?.sectionType as LineSectionType | undefined) ?? sectionType ?? 'MenuPackage';
    this.lineItemsArray.push(this.createLineItemGroup(seed));
    const line = this.lineItemsArray.at(this.lineItemsArray.length - 1);
    line.patchValue({ sectionType: resolvedSectionType }, { emitEvent: false });
    this.recalculateBuilderTotals();
  }

  removeLineItem(index: number): void {
    if (this.lineItemsArray.length <= 1) {
      return;
    }

    this.lineItemsArray.removeAt(index);
    this.recalculateBuilderTotals();
  }

  saveBuilder(sendAfterSave: boolean): void {
    if (!this.venueId) {
      this.builderError = 'Select a venue before saving a proposal.';
      return;
    }

    if (this.builderForm.invalid) {
      this.builderForm.markAllAsTouched();
      this.builderError = 'Complete the required fields before saving.';
      return;
    }

    const enquiryId = this.builderForm.controls.enquiryId.value ?? '';
    if (!enquiryId) {
      this.builderError = 'Choose an enquiry for this proposal.';
      return;
    }

    const lineItems = this.toLineItemPayload();
    if (lineItems.length === 0) {
      this.builderError = 'Add at least one line item to continue.';
      return;
    }

    this.builderSaving = true;
    this.builderError = '';
    this.builderNotice = '';

    const value = this.builderForm.getRawValue();
    const payload = {
      title: this.trimOptional(value.title),
      validUntilDate: this.trimOptional(value.validUntilDate),
      introduction: this.trimOptional(value.introduction),
      termsVersion: this.trimOptional(value.termsVersion),
      currencyCode: (value.currencyCode ?? 'GBP').toUpperCase(),
      serviceChargePercent: Number(value.serviceChargePercent ?? 0),
      sections: this.orderedBuilderSections,
      lineItems
    };

    const request$ = this.builderMode === 'edit' && this.selectedProposal
      ? this.api.updateProposal(this.selectedProposal.id, payload)
      : this.api.createProposal(enquiryId, payload);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (proposal) => {
          this.builderSaving = false;
          this.builderNotice = this.builderMode === 'edit'
            ? `Proposal ${proposal.version} updated.`
            : `Proposal ${proposal.version} created.`;
          this.lastActionMessage = this.builderNotice;
          this.isBuilderOpen = false;

          this.loadProposals(this.listResponse?.page.page ?? 1);
          this.selectProposal(proposal.id);

          if (sendAfterSave) {
            this.sendProposalByPrompt(
              proposal.id,
              this.trimOptional(this.sendEmailDraft)
                ?? this.builderEnquiryDetail?.contactEmail
                ?? undefined);
          }
        },
        error: (error) => {
          this.builderSaving = false;
          this.builderError = error?.error ?? 'Unable to save proposal.';
        }
      });
  }

  getStatusCount(statusKey: string, list: ProposalListResponse): number {
    if (statusKey === 'all') {
      return list.page.totalCount;
    }

    const key = statusKey.trim().toLowerCase();
    const matches = Object.entries(list.statusCounts).find(([entryKey]) => entryKey.trim().toLowerCase() === key);
    return matches ? matches[1] : 0;
  }

  getEnquiryLabel(enquiry: EnquiryListItemDto): string {
    return `${enquiry.reference} · ${enquiry.contactName} · ${enquiry.eventType}`;
  }

  lineSubtotal(index: number): number {
    const line = this.lineItemsArray.at(index).value;
    return this.calculateLine(line).subtotalExclVat;
  }

  lineVat(index: number): number {
    const line = this.lineItemsArray.at(index).value;
    return this.calculateLine(line).vatAmount;
  }

  lineTotal(index: number): number {
    const line = this.lineItemsArray.at(index).value;
    return this.calculateLine(line).totalInclVat;
  }

  trackByEnquiryId(index: number, enquiry: EnquiryListItemDto): string {
    return enquiry.id;
  }

  trackByTemplateKey(index: number, template: ProposalTemplateOptionDto): string {
    return template.key;
  }

  openEnquiry(enquiryId: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/enquiries'], {
      queryParams: {
        enquiry: enquiryId,
        statusTab: 'proposals'
      }
    });
  }

  statusToken(status: string | null | undefined): string {
    const normalized = (status ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    return normalized || 'unknown';
  }

  private sendProposalByPrompt(proposalId: string, suggestedEmail?: string): void {
    const promptValue = suggestedEmail ?? '';
    const email = window.prompt('Send proposal to email address', promptValue);
    if (!email || !email.trim()) {
      return;
    }

    this.api
      .sendProposal(proposalId, {
        clientEmail: email.trim(),
        portalBaseUrl: `${window.location.origin}/portal`
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.lastActionMessage = `Proposal sent. Portal link: ${result.portalLink}`;
          this.loadProposalDetail(proposalId);
          this.loadProposals(this.listResponse?.page.page ?? 1);
        },
        error: (error) => {
          this.lastActionMessage = error?.error ?? 'Unable to send proposal.';
        }
      });
  }

  private sendProposalForSignatureByPrompt(proposalId: string, suggestedEmail?: string): void {
    const email = window.prompt('Send e-sign request to email address', suggestedEmail ?? '');
    if (!email || !email.trim()) {
      return;
    }

    const clientName = window.prompt('Client full legal name (optional)', this.selectedProposal?.clientName ?? '') ?? '';
    const clientCompany = window.prompt('Client company (optional)', '') ?? '';

    this.signatureBusy = true;
    this.api
      .sendProposalForSignature(proposalId, {
        clientEmail: email.trim(),
        clientName: this.trimOptional(clientName),
        clientCompany: this.trimOptional(clientCompany),
        provider: null,
        message: null,
        publicSigningBaseUrl: `${window.location.origin}/signature`,
        requireCounterSignature: true,
        fieldMappings: [
          { sectionKey: 'termsConditions', requirementType: 'full-signature' },
          { sectionKey: 'pricingSummary', requirementType: 'initials' },
          { sectionKey: 'acceptanceBlock', requirementType: 'full-signature' }
        ]
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.signatureBusy = false;
          this.lastActionMessage = `Signature request sent. Link: ${result.signingUrl}`;
          this.loadSignatureEnvelope(proposalId);
          this.loadProposalDetail(proposalId);
          this.loadProposals(this.listResponse?.page.page ?? 1);
        },
        error: (error) => {
          this.signatureBusy = false;
          this.lastActionMessage = error?.error?.message ?? error?.error ?? 'Unable to send signature request.';
        }
      });
  }

  compareSelectedProposal(): void {
    if (!this.selectedProposal || !this.compareWithProposalId) {
      return;
    }

    this.api
      .compareProposals(this.selectedProposal.id, this.compareWithProposalId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (comparison) => {
          this.comparison = comparison;
        },
        error: (error) => {
          this.lastActionMessage = error?.error ?? 'Unable to compare versions.';
        }
      });
  }

  private loadProposals(page: number): void {
    const venueId = this.venueId;
    if (!venueId) {
      return;
    }

    const filters = this.filtersForm.getRawValue();
    this.loadingList = true;

    this.api
      .getProposals({
        venueId,
        status: filters.status || 'all',
        eventType: this.trimOptional(filters.eventType),
        sortBy: filters.sortBy || undefined,
        sortDirection: (filters.sortDirection as 'asc' | 'desc') || 'desc',
        page,
        pageSize: Number(filters.pageSize) || 25,
        ...(filters.enquiryId
          ? {
              // TODO: CLARIFY add first-class enquiryId filter support in API to avoid client-side filtering.
            }
          : {})
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.loadingList = false;

          const enquiryFilter = this.trimOptional(filters.enquiryId);
          const scopedItems = enquiryFilter
            ? response.page.items.filter((item) => item.enquiryId === enquiryFilter)
            : response.page.items;

          this.listResponse = {
            ...response,
            page: {
              ...response.page,
              items: scopedItems,
              totalCount: enquiryFilter ? scopedItems.length : response.page.totalCount
            }
          };
          this.proposals = scopedItems;

          if (this.proposals.length === 0) {
            this.selectedProposal = null;
            this.selectedProposalId = null;
            return;
          }

          const routeProposalId = this.route.snapshot.queryParamMap.get('proposal');
          const selectedStillVisible = this.selectedProposalId && this.proposals.some((item) => item.id === this.selectedProposalId);
          const routeProposalVisible = routeProposalId && this.proposals.some((item) => item.id === routeProposalId);
          const proposalId = routeProposalVisible
            ? routeProposalId!
            : selectedStillVisible
              ? this.selectedProposalId!
              : this.proposals[0].id;
          this.selectProposal(proposalId);
        },
        error: () => {
          this.loadingList = false;
          this.proposals = [];
          this.selectedProposal = null;
          this.selectedProposalId = null;
        }
      });
  }

  private loadProposalDetail(proposalId: string): void {
    this.loadingDetail = true;
    this.comparison = null;
    this.compareWithProposalId = '';

    this.api
      .getProposal(proposalId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (proposal) => {
          this.loadingDetail = false;
          this.selectedProposal = proposal;
          this.selectedEnquiryIdFilter = proposal.enquiryId;
          this.loadSignatureEnvelope(proposal.id);

          this.api
            .getEnquiry(proposal.enquiryId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (detail) => {
                this.builderEnquiryDetail = detail;
                this.sendEmailDraft = detail.contactEmail;
              }
            });
        },
        error: () => {
          this.loadingDetail = false;
          this.selectedProposal = null;
          this.signatureEnvelope = null;
        }
      });
  }

  private loadBuilderSources(): void {
    const venueId = this.venueId;
    if (!venueId) {
      return;
    }

    this.api
      .getVenueProfile(venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.venueProfile = profile;
          if (this.builderMode === 'create') {
            this.builderForm.patchValue(
              {
                currencyCode: profile.currencyCode,
                serviceChargePercent: Number(this.builderForm.controls.serviceChargePercent.value || 0)
              },
              { emitEvent: false }
            );
          }
        },
        error: () => {
          this.venueProfile = null;
        }
      });

    this.api
      .getEnquiries({
        venueId,
        statusTab: 'all',
        period: 'this-year',
        page: 1,
        pageSize: 100
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.enquiryOptions = [...response.page.items].sort((left, right) =>
            left.reference.localeCompare(right.reference, undefined, { numeric: true, sensitivity: 'base' }));

          if (!this.builderForm.controls.enquiryId.value && this.enquiryOptions.length > 0) {
            const enquiryIdFromRoute = this.route.snapshot.queryParamMap.get('enquiry');
            const fallbackEnquiryId = enquiryIdFromRoute ?? this.enquiryOptions[0].id;
            this.builderForm.patchValue({
              enquiryId: fallbackEnquiryId,
              currencyCode: this.resolveDefaultCurrency(fallbackEnquiryId)
            });
            this.onBuilderEnquiryChanged(fallbackEnquiryId);
          }
        }
      });

    this.api
      .getTermsDocuments(venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (documents) => {
          this.termsDocuments = documents;
          if (!this.builderForm.controls.termsVersion.value) {
            const active = documents.find((document) => document.isActive);
            if (active) {
              this.builderForm.patchValue({ termsVersion: active.version }, { emitEvent: false });
            }
          }
        }
      });
  }

  private onBuilderEnquiryChanged(enquiryId: string): void {
    if (!enquiryId || !this.venueId) {
      this.templateOptions = [];
      this.builderEnquiryDetail = null;
      this.builderEnquirySustainability = null;
      this.aiPricingRecommendation = null;
      this.aiPricingLoading = false;
      this.aiPricingMessage = 'Select an enquiry with a space assignment to unlock AI pricing suggestions.';
      return;
    }

    const selected = this.enquiryOptions.find((enquiry) => enquiry.id === enquiryId);
    if (selected && this.builderMode === 'create') {
      this.builderForm.patchValue(
        {
          title: this.builderForm.controls.title.value || `${selected.reference} Proposal`,
          currencyCode: this.resolveDefaultCurrency(enquiryId),
          eventDate: this.toDateOnlyLocal(selected.eventStartUtc),
          eventTime: this.toTimeOnlyLocal(selected.eventStartUtc),
          eventStyle: selected.eventStyle ?? '',
          guestCount: selected.guestsExpected
        },
        { emitEvent: false }
      );
    }

    this.api
      .getEnquiry(enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.builderEnquiryDetail = detail;
          this.sendEmailDraft = detail.contactEmail;
          this.builderForm.patchValue(
            {
              preparedFor: `${detail.contactFirstName} ${detail.contactLastName}`.trim(),
              eventDate: this.toDateOnlyLocal(detail.eventStartUtc),
              eventTime: this.toTimeOnlyLocal(detail.eventStartUtc),
              guestCount: detail.guestsExpected,
              eventStyle: detail.eventStyle ?? '',
              assignedSpace: this.resolveSpaceFromEnquiry(detail),
              title: this.builderMode === 'create'
                ? this.builderForm.controls.title.value || `${detail.reference} Proposal`
                : this.builderForm.controls.title.value
            },
            { emitEvent: false }
          );
          this.loadBuilderSustainability(detail.id);
          this.loadAiPricingRecommendation(detail);
        },
        error: () => {
          this.builderEnquiryDetail = null;
          this.builderEnquirySustainability = null;
          this.aiPricingRecommendation = null;
          this.aiPricingLoading = false;
          this.aiPricingMessage = 'Unable to load AI pricing guidance for this enquiry.';
        }
      });

    this.api
      .getProposalTemplateOptions(this.venueId, selected?.eventType)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (templates) => {
          this.templateOptions = templates;
          const selectedTemplate = this.builderForm.controls.templateKey.value;
          if (selectedTemplate && !templates.some((template) => template.key === selectedTemplate)) {
            this.builderForm.patchValue({ templateKey: '' }, { emitEvent: false });
          }
        },
        error: () => {
          this.templateOptions = [];
        }
      });
  }

  private loadBuilderSustainability(enquiryId: string): void {
    this.builderEnquirySustainability = null;
    this.api
      .getEnquirySustainability(enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.builderEnquirySustainability = profile;
        },
        error: () => {
          this.builderEnquirySustainability = null;
        }
      });
  }

  private loadSignatureEnvelope(proposalId: string): void {
    this.signatureLoading = true;
    this.api
      .getProposalSignatureEnvelope(proposalId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (envelope) => {
          this.signatureLoading = false;
          this.signatureEnvelope = envelope;
        },
        error: (error) => {
          this.signatureLoading = false;
          if (error?.status === 404) {
            this.signatureEnvelope = null;
            return;
          }

          this.signatureEnvelope = null;
        }
      });
  }

  private applyTemplate(templateKey: string): void {
    if (!templateKey) {
      return;
    }

    const template = this.templateOptions.find((item) => item.key === templateKey);
    if (!template) {
      return;
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + Math.max(template.defaultValidityDays || 14, 1));

    this.applyingTemplate = true;
    this.builderForm.patchValue(
      {
        introduction: template.defaultIntroduction ?? this.builderForm.controls.introduction.value ?? '',
        termsVersion: template.defaultTermsVersion ?? this.builderForm.controls.termsVersion.value ?? '',
        validUntilDate: this.toDateOnly(validUntil),
        title: this.builderForm.controls.title.value || `${template.label} Proposal`
      },
      { emitEvent: false }
    );
    this.applyingTemplate = false;

    this.lineItemsArray.clear();
    for (const line of template.defaultLineItems) {
      this.addLineItem(line);
    }

    this.ensureBuilderHasAtLeastOneLine();
    this.recalculateBuilderTotals();
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error ?? new Error('Unable to read file'));
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        const commaIndex = result.indexOf(',');
        const base64 = commaIndex >= 0 ? result.slice(commaIndex + 1) : result;
        if (!base64) {
          reject(new Error('Unable to decode file data'));
          return;
        }

        resolve(base64);
      };
      reader.readAsDataURL(file);
    });
  }

  private toLineItemPayload(): CreateProposalLineItemRequest[] {
    return this.lineItemsArray.controls
      .map((control) => control.getRawValue())
      .map((line, index) => ({
        sectionType: this.normalizeLineSectionType(line.sectionType),
        sortOrder: index,
        category: this.requiredText(line.category, 'Miscellaneous'),
        description: this.requiredText(line.description, 'Untitled item'),
        quantity: this.numberOrDefault(line.quantity, 1),
        unit: this.requiredText(line.unit, 'Flat rate'),
        unitPriceExclVat: this.numberOrDefault(line.unitPriceExclVat, 0),
        vatRate: this.numberOrDefault(line.vatRate, 20),
        discountPercent: this.numberOrDefault(line.discountPercent, 0),
        discountAmount: this.numberOrDefault(line.discountAmount, 0)
      }))
      .filter((line) => line.quantity > 0 && line.description.trim().length > 0);
  }

  private createLineItemGroup(seed?: Partial<CreateProposalLineItemRequest>) {
    return this.formBuilder.group({
      sectionType: [this.normalizeLineSectionType(seed?.sectionType), Validators.required],
      category: [seed?.category ?? 'Room Hire', Validators.required],
      description: [seed?.description ?? '', Validators.required],
      quantity: [seed?.quantity ?? 1, [Validators.required, Validators.min(0.01)]],
      unit: [seed?.unit ?? 'Flat rate', Validators.required],
      unitPriceExclVat: [seed?.unitPriceExclVat ?? 0, [Validators.required, Validators.min(0)]],
      vatRate: [seed?.vatRate ?? 20, [Validators.required, Validators.min(0)]],
      discountPercent: [seed?.discountPercent ?? 0, [Validators.min(0), Validators.max(100)]],
      discountAmount: [seed?.discountAmount ?? 0, [Validators.min(0)]]
    });
  }

  private ensureBuilderHasAtLeastOneLine(): void {
    if (this.lineItemsArray.length === 0) {
      this.addLineItem({ sectionType: 'MenuPackage' });
    }
  }

  private recalculateBuilderTotals(): void {
    const lines = this.toLineItemPayload().map((line) => ({
      sectionType: this.normalizeLineSectionType(line.sectionType),
      ...this.calculateLine(line)
    }));
    const subtotal = this.round2(lines.reduce((acc, line) => acc + line.subtotalExclVat, 0));
    const totalVat = this.round2(lines.reduce((acc, line) => acc + line.vatAmount, 0));
    const serviceChargePercent = this.numberOrDefault(this.builderForm.controls.serviceChargePercent.value, 0);
    const serviceChargeAmount = this.round2(subtotal * (Math.max(serviceChargePercent, 0) / 100));
    const total = this.round2(subtotal + totalVat + serviceChargeAmount);

    const vatMap = new Map<number, number>();
    for (const line of lines) {
      const current = vatMap.get(line.vatRate) ?? 0;
      vatMap.set(line.vatRate, this.round2(current + line.vatAmount));
    }

    this.builderSubtotalExclVat = subtotal;
    this.builderTotalVat = totalVat;
    this.builderServiceChargeAmount = serviceChargeAmount;
    this.builderTotalInclVat = total;
    this.builderVatBreakdown = [...vatMap.entries()]
      .sort(([left], [right]) => left - right)
      .map(([vatRate, vatAmount]) => ({ vatRate, vatAmount }));
    this.builderSectionSubtotals = {
      MenuPackage: this.round2(lines
        .filter((line) => line.sectionType === 'MenuPackage')
        .reduce((acc, line) => acc + line.subtotalExclVat, 0)),
      AdditionalServices: this.round2(lines
        .filter((line) => line.sectionType === 'AdditionalServices')
        .reduce((acc, line) => acc + line.subtotalExclVat, 0))
    };
  }

  private loadAiPricingRecommendation(detail: EnquiryDetailResponse): void {
    if (!this.venueId) {
      this.aiPricingRecommendation = null;
      this.aiPricingLoading = false;
      this.aiPricingMessage = 'Select a venue to load AI pricing suggestions.';
      return;
    }

    const spaceId = this.resolvePrimarySpaceId(detail);
    if (!spaceId) {
      this.aiPricingRecommendation = null;
      this.aiPricingLoading = false;
      this.aiPricingMessage = 'Assign a space to this enquiry to unlock AI pricing suggestions.';
      return;
    }

    const eventDate = this.toDateOnlyLocal(detail.eventStartUtc);
    if (!eventDate) {
      this.aiPricingRecommendation = null;
      this.aiPricingLoading = false;
      this.aiPricingMessage = 'Event date is required for AI pricing suggestions.';
      return;
    }

    this.aiPricingLoading = true;
    this.aiPricingMessage = '';
    this.api
      .getAiPricingRecommendation({
        venueId: this.venueId,
        spaceId,
        date: eventDate,
        eventType: detail.eventType
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (recommendation) => {
          this.aiPricingRecommendation = recommendation;
          this.aiPricingLoading = false;
          this.aiPricingMessage =
            recommendation.hasSufficientData
              ? ''
              : recommendation.message || 'Gathering data...';
        },
        error: () => {
          this.aiPricingRecommendation = null;
          this.aiPricingLoading = false;
          this.aiPricingMessage = 'AI pricing guidance is currently unavailable.';
        }
      });
  }

  private calculateLine(line: Partial<CreateProposalLineItemRequest>) {
    const quantity = this.round2(this.numberOrDefault(line.quantity, 0));
    const unitPriceExclVat = this.round2(this.numberOrDefault(line.unitPriceExclVat, 0));
    const gross = this.round2(quantity * unitPriceExclVat);
    const discountPercent = Math.min(Math.max(this.numberOrDefault(line.discountPercent, 0), 0), 100);
    const discountFromPercent = this.round2(gross * (discountPercent / 100));
    const discountAmount = Math.max(this.numberOrDefault(line.discountAmount, 0), 0);
    const totalDiscount = Math.min(gross, this.round2(discountFromPercent + discountAmount));
    const subtotalExclVat = this.round2(gross - totalDiscount);
    const vatRate = Math.max(this.numberOrDefault(line.vatRate, 0), 0);
    const vatAmount = this.round2(subtotalExclVat * (vatRate / 100));
    const totalInclVat = this.round2(subtotalExclVat + vatAmount);

    return {
      subtotalExclVat,
      vatRate,
      vatAmount,
      totalInclVat
    };
  }

  private normalizeLineSectionType(value: string | null | undefined): LineSectionType {
    return value === 'AdditionalServices' ? 'AdditionalServices' : 'MenuPackage';
  }

  private resolveFixedDiscountAmount(
    quantity: number,
    unitPriceExclVat: number,
    discountPercent: number,
    persistedDiscountAmount: number
  ): number {
    const gross = this.round2(this.numberOrDefault(quantity, 0) * this.numberOrDefault(unitPriceExclVat, 0));
    const percentDiscount = this.round2(gross * (Math.min(Math.max(this.numberOrDefault(discountPercent, 0), 0), 100) / 100));
    const explicitDiscount = this.round2(this.numberOrDefault(persistedDiscountAmount, 0) - percentDiscount);
    return explicitDiscount > 0 ? explicitDiscount : 0;
  }

  private resolveDefaultCurrency(enquiryId: string): string {
    const enquiry = this.enquiryOptions.find((option) => option.id === enquiryId);
    return (enquiry?.currencyCode || 'GBP').toUpperCase();
  }

  private trimOptional(value: string | null | undefined): string | undefined {
    const normalized = (value ?? '').trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  private requiredText(value: string | null | undefined, fallback: string): string {
    const normalized = (value ?? '').trim();
    return normalized.length > 0 ? normalized : fallback;
  }

  private defaultValidUntilDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return this.toDateOnlyLocal(date.toISOString());
  }

  private toDateOnly(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toDateOnlyLocal(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toTimeOnlyLocal(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${hour}:${minute}`;
  }

  private resolveSpaceFromEnquiry(detail: EnquiryDetailResponse): string {
    const firstSubEvent = detail.subEvents[0];
    if (!firstSubEvent) {
      return 'To be confirmed';
    }

    if (firstSubEvent.spaceIds.length > 0) {
      return `${firstSubEvent.spaceIds.length} space${firstSubEvent.spaceIds.length === 1 ? '' : 's'} selected`;
    }

    return firstSubEvent.name;
  }

  private resolvePrimarySpaceId(detail: EnquiryDetailResponse): string | null {
    const firstWithSpace = detail.subEvents.find((subEvent) => subEvent.spaceIds.length > 0);
    if (!firstWithSpace) {
      return null;
    }

    return firstWithSpace.spaceIds[0] ?? null;
  }

  private numberOrDefault(value: unknown, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private round2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private handleVenueChange(venueId: string | null): void {
    this.resetVenueScopedState();
    if (!venueId) {
      this.lastActionMessage = 'Select a venue to manage proposals.';
      return;
    }

    this.loadBuilderSources();
    this.loadProposals(1);
  }

  private resetVenueScopedState(): void {
    this.loadingList = false;
    this.loadingDetail = false;
    this.listResponse = null;
    this.proposals = [];
    this.selectedProposalId = null;
    this.selectedProposal = null;
    this.selectedEnquiryIdFilter = null;
    this.signatureEnvelope = null;
    this.comparison = null;
    this.compareWithProposalId = '';
    this.enquiryOptions = [];
    this.templateOptions = [];
    this.termsDocuments = [];
    this.venueProfile = null;
    this.builderEnquiryDetail = null;
    this.builderEnquirySustainability = null;
    this.aiPricingRecommendation = null;
    this.aiPricingMessage = '';
    this.closeBuilder();
  }
}
