import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ApiService,
  CreateProposalLineItemRequest,
  EnquiryListItemDto,
  ProposalComparisonResponse,
  ProposalDetailResponse,
  ProposalListItemDto,
  ProposalListResponse,
  ProposalTemplateOptionDto,
  TermsDocumentSettingDto
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

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
  builderVatBreakdown: Array<{ vatRate: number; vatAmount: number }> = [];

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

  get selectedProposalCanEdit(): boolean {
    return !!this.selectedProposal?.isEditable;
  }

  ngOnInit(): void {
    this.ensureBuilderHasAtLeastOneLine();
    this.loadBuilderSources();
    this.loadProposals(1);

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

    this.sendProposalByPrompt(this.selectedProposalId);
  }

  openBuilderForCreate(enquiryId?: string): void {
    this.builderMode = 'create';
    this.isBuilderOpen = true;
    this.builderError = '';
    this.builderNotice = '';
    this.comparison = null;

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
      serviceChargePercent: 0
    });
    this.applyingTemplate = false;

    this.lineItemsArray.clear();
    this.addLineItem();
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

    this.applyingTemplate = true;
    this.builderForm.patchValue({
      enquiryId: proposal.enquiryId,
      templateKey: '',
      title: proposal.title ?? '',
      validUntilDate: proposal.validUntilDate ?? this.defaultValidUntilDate(),
      introduction: proposal.introduction ?? '',
      termsVersion: proposal.termsVersion,
      currencyCode: proposal.currencyCode,
      serviceChargePercent
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
        discountAmount: fixedDiscountAmount
      }));
    }

    this.ensureBuilderHasAtLeastOneLine();
    this.onBuilderEnquiryChanged(proposal.enquiryId);
    this.recalculateBuilderTotals();
  }

  closeBuilder(): void {
    this.isBuilderOpen = false;
    this.builderError = '';
  }

  addLineItem(seed?: Partial<CreateProposalLineItemRequest>): void {
    this.lineItemsArray.push(this.createLineItemGroup(seed));
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
            this.sendProposalByPrompt(proposal.id);
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

  private sendProposalByPrompt(proposalId: string): void {
    const email = window.prompt('Send proposal to email address');
    if (!email) {
      return;
    }

    this.api
      .sendProposal(proposalId, {
        clientEmail: email.trim(),
        portalBaseUrl: 'https://portal.creventaflow.com'
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
        },
        error: () => {
          this.loadingDetail = false;
          this.selectedProposal = null;
        }
      });
  }

  private loadBuilderSources(): void {
    const venueId = this.venueId;
    if (!venueId) {
      return;
    }

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
      return;
    }

    const selected = this.enquiryOptions.find((enquiry) => enquiry.id === enquiryId);
    if (selected && this.builderMode === 'create') {
      this.builderForm.patchValue(
        {
          title: this.builderForm.controls.title.value || `${selected.reference} Proposal`,
          currencyCode: this.resolveDefaultCurrency(enquiryId)
        },
        { emitEvent: false }
      );
    }

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

  private toLineItemPayload(): CreateProposalLineItemRequest[] {
    return this.lineItemsArray.controls
      .map((control) => control.getRawValue())
      .map((line) => ({
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
      this.addLineItem();
    }
  }

  private recalculateBuilderTotals(): void {
    const lines = this.toLineItemPayload().map((line) => this.calculateLine(line));
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
    return this.toDateOnly(date);
  }

  private toDateOnly(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private numberOrDefault(value: unknown, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private round2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
