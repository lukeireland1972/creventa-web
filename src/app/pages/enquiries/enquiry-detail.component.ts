import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, firstValueFrom, forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ApiService,
  ActivityFeedEntryDto,
  AppointmentDetailDto,
  ConnectTimelineItemDto,
  EnquiryDetailResponse,
  EnquiryDocumentDto,
  LostReasonSettingDto,
  PaymentScheduleResponse,
  ProposalListItemDto,
  SpaceSummaryDto,
  TaskItemDto,
  UserSummaryDto
} from '../../services/api.service';

type EnquiryDetailTab =
  | 'overview'
  | 'events'
  | 'appointments'
  | 'proposals'
  | 'communications'
  | 'payments'
  | 'documents'
  | 'activity'
  | 'tasks';

type CanonicalStatus =
  | 'New'
  | 'Tentative'
  | 'OpenProposal'
  | 'Provisional'
  | 'Confirmed'
  | 'Completed'
  | 'Lost'
  | 'Archived';

type AppointmentFormStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'NoShow';

interface SubEventDraft {
  id?: string;
  name: string;
  type: string;
  status: string;
  date: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  spaceId: string;
  setupStyle: string;
  specialRequirements: string;
  priceAmount: string;
  currencyCode: string;
}

interface AppointmentDraft {
  id?: string;
  title: string;
  type: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  spaceId: string;
  attendees: string;
  relatedEnquiryIds: string[];
  assignedToUserId: string;
  notes: string;
  status: AppointmentFormStatus;
}

interface RelatedEnquiryOption {
  id: string;
  reference: string;
  contactName: string;
  eventType: string;
  eventDate: string;
  status: string;
}

interface ActivityChangeRow {
  label: string;
  before: string | null;
  after: string | null;
  value: string | null;
}

interface EnquiryEditDraft {
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhoneNumberE164: string;
  companyName: string;
  eventType: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventEndDate: string;
  eventEndTime: string;
  guestsExpected: number;
  eventStyle: string;
  setupStyle: string;
  sourceType: string;
  sourceDetail: string;
  specialRequirements: string;
  eventManagerUserId: string;
  marketingConsent: boolean;
}

type EnquiryEditField =
  | 'contactFirstName'
  | 'contactLastName'
  | 'contactEmail'
  | 'contactPhoneNumberE164'
  | 'companyName'
  | 'eventType'
  | 'eventName'
  | 'eventDate'
  | 'eventTime'
  | 'eventEndDate'
  | 'eventEndTime'
  | 'guestsExpected'
  | 'eventStyle'
  | 'setupStyle'
  | 'sourceType'
  | 'sourceDetail'
  | 'specialRequirements'
  | 'eventManagerUserId'
  | 'marketingConsent';

@Component({
  selector: 'app-enquiry-detail',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './enquiry-detail.component.html',
  styleUrl: './enquiry-detail.component.scss'
})
export class EnquiryDetailComponent implements OnInit {
  private readonly allowedDocumentExtensions = new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'csv']);
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly statusTransitionMap: Record<CanonicalStatus, CanonicalStatus[]> = {
    New: ['Tentative', 'OpenProposal', 'Lost', 'Archived'],
    Tentative: ['OpenProposal', 'Lost', 'Archived'],
    OpenProposal: ['Provisional', 'Lost', 'Archived'],
    Provisional: ['Confirmed', 'OpenProposal', 'Tentative', 'Lost'],
    Confirmed: ['Completed', 'Lost'],
    Completed: ['Archived'],
    Lost: ['New', 'Archived'],
    Archived: ['New']
  };

  readonly tabs: Array<{ key: EnquiryDetailTab; label: string }> = [
    { key: 'overview', label: 'Overview' },
    { key: 'events', label: 'Events' },
    { key: 'appointments', label: 'Appointments' },
    { key: 'proposals', label: 'Proposals' },
    { key: 'communications', label: 'Communications' },
    { key: 'payments', label: 'Payments' },
    { key: 'documents', label: 'Documents' },
    { key: 'activity', label: 'Activity Log' },
    { key: 'tasks', label: 'Tasks' }
  ];

  readonly subEventTypeOptions = ['Ceremony', 'Reception', 'Dinner', 'After-Party', 'Meeting', 'Custom'];
  readonly appointmentTypeOptions = ['Meeting', 'Menu Tasting', 'Site Visit', 'Rehearsal', 'Other'];
  readonly appointmentStatusOptions: AppointmentFormStatus[] = ['Scheduled', 'Completed', 'Cancelled', 'NoShow'];

  enquiryId = '';
  enquiry: EnquiryDetailResponse | null = null;
  loading = false;
  errorMessage = '';
  activeTab: EnquiryDetailTab = 'overview';

  statusAllowedTransitions: CanonicalStatus[] = [];
  statusChangeTarget = '';
  statusChangeBusy = false;
  statusChangeError = '';
  statusChangeSuccess = '';
  statusHoldDaysOverride = '';
  statusLostReason = '';
  statusLostReasonDetail = '';
  statusLostDate = '';
  lostReasonOptions: string[] = [];
  private loadedLostReasonsVenueId = '';

  spaces: SpaceSummaryDto[] = [];
  users: UserSummaryDto[] = [];
  relatedEnquiryOptions: RelatedEnquiryOption[] = [];
  lookupsLoading = false;
  private loadedLookupVenueId = '';

  sameDateAvailabilityExpanded = true;
  sameDateAvailabilityLoading = false;
  sameDateAvailabilityError = '';

  overviewEditMode = false;
  overviewEditSaving = false;
  overviewEditError = '';
  overviewEditFieldErrors: Partial<Record<EnquiryEditField, string>> = {};
  overviewEditDraft: EnquiryEditDraft = this.createOverviewEditDraft();
  overviewEditBaseline = '';
  overviewToastMessage = '';
  overviewPhonePrefixSelection = '+44';
  readonly phonePrefixOptions = ['+44', '+1', '+353', '+33', '+49', '+34', '+39', '+61', '+971'];

  subEventFormVisible = false;
  subEventFormMode: 'create' | 'edit' = 'create';
  subEventSaving = false;
  subEventError = '';
  subEventConflictWarning = '';
  subEventCanOverrideConflict = false;
  subEventDraft: SubEventDraft = this.createSubEventDraft();

  appointmentFormVisible = false;
  appointmentFormMode: 'create' | 'edit' = 'create';
  appointmentSaving = false;
  appointmentError = '';
  appointmentConflictWarning = '';
  appointmentCanOverrideConflict = false;
  appointmentSearchTerm = '';
  appointmentDraft: AppointmentDraft = this.createAppointmentDraft();

  proposals: ProposalListItemDto[] = [];
  proposalsLoading = false;
  proposalsError = '';
  private proposalsLoadedFor = '';

  communications: ConnectTimelineItemDto[] = [];
  communicationsLoading = false;
  communicationsError = '';
  communicationsFilter: 'all' | 'emails' | 'notes' | 'system' = 'all';
  composeMode: 'note' | 'email' = 'note';
  noteDraft = '';
  emailDraft = {
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: ''
  };
  communicationsSubmitting = false;
  communicationsActionError = '';
  communicationsActionSuccess = '';
  private communicationsLoadedFor = '';

  paymentSchedule: PaymentScheduleResponse | null = null;
  paymentsLoading = false;
  paymentsError = '';
  paymentActionMilestoneId = '';
  paymentActionError = '';
  paymentActionSuccess = '';
  private paymentsLoadedFor = '';

  activityEntries: ActivityFeedEntryDto[] = [];
  activityLoading = false;
  activityLoadingMore = false;
  activityError = '';
  activityHasMore = false;
  activityPage = 1;
  activityActionCategory: 'all' | 'status' | 'communication' | 'document' | 'payment' = 'all';
  activityFromDate = '';
  activityToDate = '';
  activityChangesByEntryId: Record<string, ActivityChangeRow[]> = {};
  private activityLoadedFor = '';

  documents: EnquiryDocumentDto[] = [];
  documentsLoading = false;
  documentsError = '';
  documentsUploading = false;
  documentsUploadError = '';
  documentsDropActive = false;
  private documentsLoadedFor = '';

  tasks: TaskItemDto[] = [];
  tasksLoading = false;
  tasksError = '';
  taskSaving = false;
  taskActionError = '';
  taskActionSuccess = '';
  taskDraft = {
    title: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    category: 'General',
    assigneeId: ''
  };
  private tasksLoadedFor = '';

  get communicationThreadGroups(): Array<{ key: string; items: ConnectTimelineItemDto[] }> {
    const source = this.communications.filter((item) => this.communicationMatchesFilter(item));
    if (source.length === 0) {
      return [];
    }

    const groups = new Map<string, ConnectTimelineItemDto[]>();
    for (const item of source) {
      const key = (item.threadId ?? item.subject ?? item.id ?? 'thread').trim() || 'thread';
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    }

    return Array.from(groups.entries()).map(([key, items]) => ({
      key,
      items: [...items].sort((left, right) =>
        new Date(right.occurredAtUtc).getTime() - new Date(left.occurredAtUtc).getTime())
    }));
  }

  get primaryContactName(): string {
    if (!this.enquiry) {
      return '';
    }

    return `${this.enquiry.contactFirstName} ${this.enquiry.contactLastName}`.trim();
  }

  get guestCountLabel(): string {
    if (!this.enquiry) {
      return '';
    }

    if (this.enquiry.guestsConfirmed && this.enquiry.guestsConfirmed > 0) {
      return `${this.enquiry.guestsConfirmed} confirmed / ${this.enquiry.guestsExpected} expected`;
    }

    return `${this.enquiry.guestsExpected} expected`;
  }

  get totalSubEventGuests(): number {
    return (this.enquiry?.subEvents ?? []).reduce((total, item) => total + Math.max(0, item.guestCount || 0), 0);
  }

  get totalSubEventValue(): number {
    return (this.enquiry?.subEvents ?? []).reduce((total, item) => total + this.numberOrZero(item.priceAmount), 0);
  }

  get filteredRelatedEnquiryOptions(): RelatedEnquiryOption[] {
    const term = this.appointmentSearchTerm.trim().toLowerCase();
    if (!term) {
      return this.relatedEnquiryOptions;
    }

    return this.relatedEnquiryOptions.filter((option) => {
      return option.reference.toLowerCase().includes(term)
        || option.contactName.toLowerCase().includes(term)
        || option.eventType.toLowerCase().includes(term);
    });
  }

  get selectedStatusTargetIsLost(): boolean {
    return this.toCanonicalStatus(this.statusChangeTarget) === 'Lost';
  }

  get selectedStatusTargetIsProvisional(): boolean {
    return this.toCanonicalStatus(this.statusChangeTarget) === 'Provisional';
  }

  get isOverviewEditDirty(): boolean {
    if (!this.overviewEditMode) {
      return false;
    }

    return this.serializeOverviewEditDraft(this.overviewEditDraft) !== this.overviewEditBaseline;
  }

  get canSaveOverviewEdit(): boolean {
    if (!this.overviewEditMode || this.overviewEditSaving || !this.isOverviewEditDirty || !this.enquiry) {
      return false;
    }

    const errors = this.validateOverviewEditDraft(this.overviewEditDraft, this.enquiry);
    return Object.keys(errors).length === 0;
  }

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([params, query]) => {
        const requestedId = (params.get('id') ?? '').trim();
        const requestedTab = this.normalizeTab(query.get('tab'));
        this.activeTab = requestedTab;

        if (!requestedId) {
          this.errorMessage = 'Enquiry id is missing.';
          this.enquiry = null;
          return;
        }

        if (requestedId !== this.enquiryId) {
          this.enquiryId = requestedId;
          this.resetLazyTabData();
          this.loadEnquiryDetail(requestedId);
          return;
        }

        if (this.enquiry) {
          this.loadTabData(requestedTab);
        }
      });
  }

  backToList(): void {
    if (!this.confirmDiscardOverviewEditsIfNeeded()) {
      return;
    }

    this.router.navigate(['/enquiries'], {
      queryParams: {
        enquiry: null,
        tab: null
      },
      queryParamsHandling: 'merge'
    });
  }

  setTab(tab: EnquiryDetailTab): void {
    if (this.activeTab === tab) {
      return;
    }

    if (tab !== 'overview' && !this.confirmDiscardOverviewEditsIfNeeded()) {
      return;
    }

    this.activeTab = tab;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab === 'overview' ? null : tab },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
    this.loadTabData(tab);
  }

  openOverviewEditor(): void {
    if (!this.enquiryId || !this.enquiry) {
      return;
    }
    this.activeTab = 'overview';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
    this.overviewEditMode = true;
    this.overviewEditSaving = false;
    this.overviewEditError = '';
    this.overviewEditFieldErrors = {};
    this.overviewEditDraft = this.mapEnquiryToOverviewEditDraft(this.enquiry);
    this.overviewEditBaseline = this.serializeOverviewEditDraft(this.overviewEditDraft);
    this.overviewPhonePrefixSelection = this.detectPhonePrefix(this.overviewEditDraft.contactPhoneNumberE164);
  }

  cancelOverviewEdit(): void {
    if (!this.confirmDiscardOverviewEditsIfNeeded()) {
      return;
    }

    this.overviewEditMode = false;
    this.overviewEditSaving = false;
    this.overviewEditError = '';
    this.overviewEditFieldErrors = {};
    this.overviewEditDraft = this.createOverviewEditDraft();
    this.overviewEditBaseline = '';
  }

  updateOverviewEditField<K extends EnquiryEditField>(field: K, value: EnquiryEditDraft[K]): void {
    this.overviewEditDraft = {
      ...this.overviewEditDraft,
      [field]: value
    };
    this.overviewEditError = '';
    this.refreshOverviewEditValidation();
  }

  overviewEditFieldError(field: EnquiryEditField): string {
    return this.overviewEditFieldErrors[field] ?? '';
  }

  applyOverviewPhonePrefix(): void {
    if (!this.overviewEditMode) {
      return;
    }

    const selectedPrefix = (this.overviewPhonePrefixSelection || '').trim();
    if (!selectedPrefix.startsWith('+')) {
      return;
    }

    const rawValue = (this.overviewEditDraft.contactPhoneNumberE164 || '')
      .replace(/[^0-9+]/g, '')
      .replace(/^\+/, '');

    let localDigits = rawValue;
    for (const prefix of [...this.phonePrefixOptions].sort((left, right) => right.length - left.length)) {
      const prefixDigits = prefix.replace(/^\+/, '');
      if (localDigits.startsWith(prefixDigits)) {
        localDigits = localDigits.slice(prefixDigits.length);
        break;
      }
    }

    if (!localDigits) {
      this.updateOverviewEditField('contactPhoneNumberE164', `${selectedPrefix}`);
      return;
    }

    this.updateOverviewEditField('contactPhoneNumberE164', `${selectedPrefix}${localDigits}`);
  }

  saveOverviewEdit(): void {
    if (!this.enquiryId || !this.enquiry || this.overviewEditSaving) {
      return;
    }

    const fieldErrors = this.validateOverviewEditDraft(this.overviewEditDraft, this.enquiry);
    this.overviewEditFieldErrors = fieldErrors;
    if (Object.keys(fieldErrors).length > 0) {
      this.overviewEditError = 'Please fix the highlighted fields.';
      return;
    }

    this.overviewEditSaving = true;
    this.overviewEditError = '';

    const payload = this.buildOverviewUpdatePayload(this.overviewEditDraft, this.enquiry);
    this.api.updateEnquiry(this.enquiryId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.overviewEditSaving = false;
          this.overviewEditMode = false;
          this.overviewEditBaseline = '';
          this.overviewEditFieldErrors = {};
          this.overviewEditDraft = this.createOverviewEditDraft();
          this.showOverviewToast('Enquiry updated');
          this.loadEnquiryDetail(this.enquiryId);
        },
        error: (error) => {
          this.overviewEditSaving = false;
          this.overviewEditError = this.extractOverviewEditSaveError(error);
          this.applyOverviewFieldErrorsFromServer(error);
        }
      });
  }

  openProposalBuilder(): void {
    if (!this.enquiryId) {
      return;
    }

    this.router.navigate(['/proposals'], {
      queryParams: {
        enquiryId: this.enquiryId
      }
    });
  }

  openProposalVersion(proposalId: string): void {
    if (!this.enquiryId || !proposalId) {
      return;
    }

    this.router.navigate(['/proposals'], {
      queryParams: {
        enquiryId: this.enquiryId,
        proposalId
      }
    });
  }

  compareProposalVersions(proposalAId: string, proposalBId: string): void {
    if (!this.enquiryId || !proposalAId || !proposalBId) {
      return;
    }

    this.router.navigate(['/proposals'], {
      queryParams: {
        enquiryId: this.enquiryId,
        compareFrom: proposalAId,
        compareTo: proposalBId
      }
    });
  }

  openCommunicationTab(): void {
    this.setTab('communications');
  }

  openEmailComposer(): void {
    this.composeMode = 'email';
    if (this.enquiry?.contactEmail) {
      this.emailDraft = {
        ...this.emailDraft,
        to: this.enquiry.contactEmail
      };
    }
    this.setTab('communications');
  }

  openNoteComposer(): void {
    this.setTab('communications');
  }

  openTasksTab(): void {
    this.setTab('tasks');
  }

  openContactRecord(): void {
    if (!this.enquiry) {
      return;
    }

    const search = this.enquiry.contactEmail || this.primaryContactName;
    this.router.navigate(['/contacts'], {
      queryParams: {
        search: search || null
      }
    });
  }

  openReturningClientHistory(): void {
    if (!this.enquiry?.contactEmail) {
      return;
    }

    this.router.navigate(['/enquiries'], {
      queryParams: {
        search: this.enquiry.contactEmail,
        statusTab: 'all'
      }
    });
  }

  setCommunicationsFilter(filter: 'all' | 'emails' | 'notes' | 'system'): void {
    this.communicationsFilter = filter;
  }

  setComposeMode(mode: 'note' | 'email'): void {
    this.composeMode = mode;
    this.communicationsActionError = '';
    this.communicationsActionSuccess = '';
  }

  sendInternalNote(): void {
    if (!this.enquiryId || this.communicationsSubmitting) {
      return;
    }

    const body = this.noteDraft.trim();
    if (!body) {
      this.communicationsActionError = 'Note body is required.';
      this.communicationsActionSuccess = '';
      return;
    }

    this.communicationsSubmitting = true;
    this.communicationsActionError = '';
    this.communicationsActionSuccess = '';
    this.api.addInternalNote(this.enquiryId, { body })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.communicationsSubmitting = false;
          this.noteDraft = '';
          this.communicationsActionSuccess = 'Internal note added.';
          this.communicationsLoadedFor = '';
          this.loadCommunications();
        },
        error: (error) => {
          this.communicationsSubmitting = false;
          this.communicationsActionError = typeof error?.error?.message === 'string'
            ? error.error.message
            : 'Unable to add note right now.';
        }
      });
  }

  sendEmailMessage(): void {
    if (!this.enquiryId || !this.enquiry || this.communicationsSubmitting) {
      return;
    }

    const to = this.emailDraft.to.trim();
    const subject = this.emailDraft.subject.trim();
    const body = this.emailDraft.body.trim();
    if (!to || !subject || !body) {
      this.communicationsActionError = 'To, subject, and message are required.';
      this.communicationsActionSuccess = '';
      return;
    }

    this.communicationsSubmitting = true;
    this.communicationsActionError = '';
    this.communicationsActionSuccess = '';
    this.api.sendConnectEmail(this.enquiryId, {
      venueId: this.enquiry.venueId,
      to,
      cc: this.emailDraft.cc.trim() || undefined,
      bcc: this.emailDraft.bcc.trim() || undefined,
      subject,
      body
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.communicationsSubmitting = false;
          this.emailDraft = { to: '', cc: '', bcc: '', subject: '', body: '' };
          this.communicationsActionSuccess = 'Email sent.';
          this.communicationsLoadedFor = '';
          this.loadCommunications();
        },
        error: (error) => {
          this.communicationsSubmitting = false;
          this.communicationsActionError = typeof error?.error?.message === 'string'
            ? error.error.message
            : 'Unable to send email right now.';
        }
      });
  }

  scrollToStatusPanel(): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.getElementById('status-panel')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  onDocumentDragOver(event: DragEvent): void {
    event.preventDefault();
    this.documentsDropActive = true;
  }

  onDocumentDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.documentsDropActive = false;
  }

  onDocumentDrop(event: DragEvent): void {
    event.preventDefault();
    this.documentsDropActive = false;
    const file = event.dataTransfer?.files?.item(0);
    if (file) {
      this.uploadDocument(file);
    }
  }

  onDocumentFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.item(0);
    if (file) {
      this.uploadDocument(file);
    }

    if (input) {
      input.value = '';
    }
  }

  statusBadgeClass(status: string | null | undefined): string {
    const token = this.normalizeStatus(status);
    switch (token) {
      case 'new':
        return 'status-new';
      case 'tentative':
        return 'status-tentative';
      case 'openproposal':
        return 'status-open-proposal';
      case 'provisional':
        return 'status-provisional';
      case 'confirmed':
        return 'status-confirmed';
      case 'completed':
        return 'status-completed';
      case 'lost':
        return 'status-lost';
      case 'archived':
        return 'status-archived';
      case 'scheduled':
      case 'inprogress':
        return 'status-open-proposal';
      case 'cancelled':
      case 'noshow':
        return 'status-lost';
      default:
        return 'status-default';
    }
  }

  proposalStatusClass(status: string | null | undefined): string {
    const token = this.normalizeStatus(status);
    switch (token) {
      case 'draft':
        return 'status-draft';
      case 'sent':
        return 'status-sent';
      case 'viewed':
        return 'status-viewed';
      case 'accepted':
        return 'status-accepted';
      case 'declined':
        return 'status-declined';
      case 'expired':
        return 'status-expired';
      case 'superseded':
        return 'status-superseded';
      default:
        return 'status-default';
    }
  }

  eventTypeClass(eventType: string | null | undefined): string {
    const token = (eventType ?? '').trim().toLowerCase();
    if (token.includes('wedding')) {
      return 'type-wedding';
    }
    if (token.includes('corporate') || token.includes('conference')) {
      return 'type-corporate';
    }
    return 'type-generic';
  }

  milestoneStatus(milestone: { status: string; isOverdue: boolean; isDueSoon: boolean }): string {
    if (milestone.isOverdue) {
      return 'Overdue';
    }
    if (milestone.status.toLowerCase().includes('paid')) {
      return 'Paid';
    }
    if (milestone.isDueSoon) {
      return 'Due';
    }
    return 'Upcoming';
  }

  milestoneStatusClass(milestone: { status: string; isOverdue: boolean; isDueSoon: boolean }): string {
    if (milestone.isOverdue) {
      return 'status-lost';
    }
    if (milestone.status.toLowerCase().includes('paid')) {
      return 'status-confirmed';
    }
    if (milestone.isDueSoon) {
      return 'status-provisional';
    }
    return 'status-archived';
  }

  paymentProgressClass(): string {
    const token = (this.paymentSchedule?.paymentProgress?.statusColor ?? '').trim().toLowerCase();
    if (token === 'green') {
      return 'status-confirmed';
    }
    if (token === 'amber' || token === 'yellow') {
      return 'status-provisional';
    }
    if (token === 'red') {
      return 'status-lost';
    }
    return 'status-archived';
  }

  paymentProgressPercent(): number {
    const value = Number(this.paymentSchedule?.paymentProgress?.percent ?? 0);
    return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  }

  planningProgressPercent(): number {
    const value = Number(this.paymentSchedule?.planningProgress?.percent ?? 0);
    return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  }

  createPaymentLinkForMilestone(milestoneId: string): void {
    if (!milestoneId || this.paymentActionMilestoneId) {
      return;
    }

    this.paymentActionMilestoneId = milestoneId;
    this.paymentActionError = '';
    this.paymentActionSuccess = '';
    const returnUrl = typeof window !== 'undefined' ? window.location.href : undefined;
    const cancelUrl = returnUrl;
    this.api.createPaymentLink(milestoneId, { returnUrl, cancelUrl })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.paymentActionMilestoneId = '';
          this.paymentActionSuccess = `Payment link created: ${response.paymentUrl}`;
          this.paymentsLoadedFor = '';
          this.loadPayments();
        },
        error: (error) => {
          this.paymentActionMilestoneId = '';
          this.paymentActionError = typeof error?.error?.message === 'string'
            ? error.error.message
            : 'Unable to create payment link.';
        }
      });
  }

  recordPaymentForMilestone(milestone: PaymentScheduleResponse['milestones'][number]): void {
    if (!milestone || this.paymentActionMilestoneId) {
      return;
    }

    const defaultAmount = Math.max(0, Number(milestone.balanceRemaining || 0));
    const amountInput = window.prompt('Record payment amount', defaultAmount.toFixed(2));
    if (amountInput === null) {
      return;
    }

    const amount = Number(amountInput.trim());
    if (!Number.isFinite(amount) || amount <= 0) {
      this.paymentActionError = 'Enter a valid payment amount.';
      this.paymentActionSuccess = '';
      return;
    }

    this.paymentActionMilestoneId = milestone.id;
    this.paymentActionError = '';
    this.paymentActionSuccess = '';
    this.api.recordPayment(milestone.id, {
      amount,
      currencyCode: milestone.currencyCode,
      method: 'Bank Transfer',
      reference: 'Manual Entry',
      receivedAtUtc: new Date().toISOString(),
      notes: 'Recorded from enquiry detail payments tab.',
      applyOverpaymentToNextMilestone: true
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.paymentActionMilestoneId = '';
          this.paymentSchedule = response;
          this.paymentsLoadedFor = this.enquiryId;
          this.paymentActionSuccess = 'Payment recorded.';
        },
        error: (error) => {
          this.paymentActionMilestoneId = '';
          this.paymentActionError = typeof error?.error?.message === 'string'
            ? error.error.message
            : 'Unable to record payment.';
        }
      });
  }

  activityUserInitials(name: string | null | undefined): string {
    const normalized = (name ?? '').trim();
    if (!normalized) {
      return 'SY';
    }

    const parts = normalized.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  activityActionLabel(actionType: string): string {
    const normalized = (actionType || 'system.event')
      .replace(/[._]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!normalized) {
      return 'System event';
    }

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  activityChangesFor(entryId: string): ActivityChangeRow[] {
    return this.activityChangesByEntryId[entryId] ?? [];
  }

  applyActivityFilters(): void {
    this.loadActivity(true);
  }

  loadMoreActivity(): void {
    if (!this.activityHasMore || this.activityLoading || this.activityLoadingMore) {
      return;
    }

    this.loadActivity(false);
  }

  displayStatus(value: string | null | undefined): string {
    const canonical = this.toCanonicalStatus(value);
    switch (canonical) {
      case 'OpenProposal':
        return 'Open Proposal';
      default:
        return canonical || (value ?? '');
    }
  }

  holdCountdownLabel(holdExpiresAtUtc?: string | null): string {
    const parsed = holdExpiresAtUtc ? new Date(holdExpiresAtUtc) : null;
    if (!parsed || Number.isNaN(parsed.getTime())) {
      return 'No hold expiry';
    }

    const remainingMs = parsed.getTime() - Date.now();
    if (remainingMs <= 0) {
      return 'Expired';
    }

    const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
    return `${remainingDays} day${remainingDays === 1 ? '' : 's'} remaining`;
  }

  holdCountdownClass(holdExpiresAtUtc?: string | null): string {
    const parsed = holdExpiresAtUtc ? new Date(holdExpiresAtUtc) : null;
    if (!parsed || Number.isNaN(parsed.getTime())) {
      return 'status-archived';
    }

    const remainingMs = parsed.getTime() - Date.now();
    if (remainingMs <= 0) {
      return 'status-lost';
    }

    const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
    if (remainingDays <= 1) {
      return 'status-lost';
    }
    if (remainingDays <= 4) {
      return 'status-provisional';
    }

    return 'status-confirmed';
  }

  statusOptionLabel(status: CanonicalStatus): string {
    return this.displayStatus(status);
  }

  onStatusTargetChanged(value: string): void {
    this.statusChangeTarget = this.toCanonicalStatus(value);
    this.statusChangeError = '';
    this.statusChangeSuccess = '';
    if (this.selectedStatusTargetIsLost && !this.statusLostDate) {
      this.statusLostDate = this.todayDateInputValue();
    }
  }

  applyStatusChange(): void {
    if (!this.enquiryId || !this.enquiry || this.statusChangeBusy) {
      return;
    }

    const targetStatus = this.toCanonicalStatus(this.statusChangeTarget);
    if (!targetStatus) {
      this.statusChangeError = 'Select a target status.';
      return;
    }

    if (!this.statusAllowedTransitions.includes(targetStatus)) {
      this.statusChangeError = 'Selected status transition is not allowed.';
      return;
    }

    let holdDaysOverride: number | undefined;
    if (targetStatus === 'Provisional' && this.statusHoldDaysOverride.trim()) {
      const parsed = Number.parseInt(this.statusHoldDaysOverride.trim(), 10);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        this.statusChangeError = 'Hold override must be a positive whole number.';
        return;
      }

      holdDaysOverride = parsed;
    }

    if (targetStatus === 'Lost' && !this.statusLostReason.trim()) {
      this.statusChangeError = 'Lost reason is required.';
      return;
    }

    this.statusChangeBusy = true;
    this.statusChangeError = '';
    this.statusChangeSuccess = '';

    this.api.transitionEnquiryStatus(this.enquiryId, {
      targetStatus,
      holdDaysOverride,
      lostReason: targetStatus === 'Lost' ? this.statusLostReason.trim() : undefined,
      lostReasonDetail: targetStatus === 'Lost'
        ? (this.statusLostReasonDetail.trim() || undefined)
        : undefined,
      lostAtUtc: targetStatus === 'Lost' ? this.toLostDateUtcIso(this.statusLostDate) : undefined
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.statusChangeBusy = false;
          this.statusAllowedTransitions = (response.allowedTransitions ?? [])
            .map((item) => this.toCanonicalStatus(item))
            .filter((item): item is CanonicalStatus => !!item);
          this.statusChangeTarget = '';
          this.statusHoldDaysOverride = '';
          this.statusLostReason = '';
          this.statusLostReasonDetail = '';
          this.statusLostDate = '';
          this.statusChangeSuccess = response.generatedTaskCount > 0
            ? `Status changed to ${this.displayStatus(response.status)}. ${response.generatedTaskCount} task(s) auto-generated.`
            : `Status changed to ${this.displayStatus(response.status)}.`;
          this.loadEnquiryDetail(this.enquiryId);
        },
        error: (error) => {
          this.statusChangeBusy = false;
          this.statusChangeError = typeof error?.error?.message === 'string'
            ? error.error.message
            : (typeof error?.error?.error === 'string'
              ? error.error.error
              : 'Unable to change status right now.');
        }
      });
  }

  toggleSameDateAvailability(): void {
    this.sameDateAvailabilityExpanded = !this.sameDateAvailabilityExpanded;
  }

  refreshSameDateAvailability(): void {
    if (!this.enquiry) {
      return;
    }

    const date = this.toDateOnly(this.enquiry.eventStartUtc);
    if (!date) {
      this.sameDateAvailabilityError = 'Unable to determine event date for availability.';
      return;
    }

    this.sameDateAvailabilityLoading = true;
    this.sameDateAvailabilityError = '';
    this.api.getAvailability(this.enquiry.venueId, date)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (availability) => {
          this.sameDateAvailabilityLoading = false;
          if (this.enquiry) {
            this.enquiry = { ...this.enquiry, sameDateAvailability: availability };
          }
        },
        error: () => {
          this.sameDateAvailabilityLoading = false;
          this.sameDateAvailabilityError = 'Unable to load same-date availability.';
        }
      });
  }

  hasSpaceEvents(spaceId: string): boolean {
    return (this.enquiry?.sameDateAvailability?.spaces ?? []).some((space) => space.spaceId === spaceId && space.events.length > 0);
  }

  spaceName(spaceId: string): string {
    const fromLookup = this.spaces.find((item) => item.id === spaceId);
    if (fromLookup) {
      return fromLookup.name;
    }

    return spaceId;
  }

  spaceNameList(spaceIds: string[]): string {
    if (!spaceIds.length) {
      return 'Unassigned';
    }

    return spaceIds.map((id) => this.spaceName(id)).join(', ');
  }

  openCreateSubEventForm(): void {
    this.subEventFormVisible = true;
    this.subEventFormMode = 'create';
    this.subEventSaving = false;
    this.subEventError = '';
    this.subEventConflictWarning = '';
    this.subEventCanOverrideConflict = false;
    this.subEventDraft = this.createSubEventDraft(this.enquiry ?? undefined);
  }

  openEditSubEventForm(subEventId: string): void {
    const subEvent = this.enquiry?.subEvents.find((item) => item.id === subEventId);
    if (!subEvent) {
      return;
    }

    this.subEventFormVisible = true;
    this.subEventFormMode = 'edit';
    this.subEventSaving = false;
    this.subEventError = '';
    this.subEventConflictWarning = '';
    this.subEventCanOverrideConflict = false;
    this.subEventDraft = this.mapSubEventToDraft(subEvent);
  }

  cancelSubEventForm(): void {
    this.subEventFormVisible = false;
    this.subEventSaving = false;
    this.subEventError = '';
    this.subEventConflictWarning = '';
    this.subEventCanOverrideConflict = false;
    this.subEventDraft = this.createSubEventDraft(this.enquiry ?? undefined);
  }

  updateSubEventDraftField(patch: Partial<SubEventDraft>): void {
    this.subEventDraft = { ...this.subEventDraft, ...patch };
    this.subEventError = '';
  }

  saveSubEvent(allowConflictOverride = false): void {
    if (!this.enquiryId || !this.enquiry || this.subEventSaving) {
      return;
    }

    const validationError = this.validateSubEventDraft(this.subEventDraft);
    if (validationError) {
      this.subEventError = validationError;
      return;
    }

    this.subEventSaving = true;
    this.subEventError = '';
    this.subEventConflictWarning = '';
    this.subEventCanOverrideConflict = false;

    const payload = this.buildSubEventPayload(this.subEventDraft, this.enquiry.currencyCode, allowConflictOverride);
    const isEditing = this.subEventFormMode === 'edit' && !!this.subEventDraft.id;
    const request$ = isEditing
      ? this.api.updateSubEvent(this.enquiryId, this.subEventDraft.id!, payload)
      : this.api.createSubEvent(this.enquiryId, payload);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.subEventSaving = false;
          this.cancelSubEventForm();
          this.loadEnquiryDetail(this.enquiryId);
        },
        error: (error) => {
          this.subEventSaving = false;
          if (error?.status === 409) {
            this.subEventCanOverrideConflict = true;
            this.subEventError = typeof error?.error?.message === 'string'
              ? error.error.message
              : 'Sub-event conflicts with existing bookings.';
            const conflicts = Array.isArray(error?.error?.conflicts) ? error.error.conflicts : [];
            this.subEventConflictWarning = conflicts
              .slice(0, 3)
              .map((conflict: any) => conflict?.label ?? 'Existing booking')
              .join(', ');
            return;
          }

          this.subEventError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to save sub-event.';
        }
      });
  }

  deleteSubEvent(subEventId: string, name: string): void {
    if (!this.enquiryId || !subEventId) {
      return;
    }

    const confirmed = window.confirm(`Delete sub-event "${name}"?`);
    if (!confirmed) {
      return;
    }

    this.api.deleteSubEvent(this.enquiryId, subEventId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadEnquiryDetail(this.enquiryId);
        },
        error: () => {
          this.subEventError = 'Unable to delete sub-event.';
        }
      });
  }

  openCreateAppointmentForm(): void {
    this.appointmentFormVisible = true;
    this.appointmentFormMode = 'create';
    this.appointmentSaving = false;
    this.appointmentError = '';
    this.appointmentConflictWarning = '';
    this.appointmentCanOverrideConflict = false;
    this.appointmentSearchTerm = '';
    this.appointmentDraft = this.createAppointmentDraft(this.enquiry ?? undefined);
  }

  openEditAppointmentForm(appointmentId: string): void {
    if (!appointmentId || !this.enquiry?.venueId) {
      return;
    }

    this.appointmentFormVisible = true;
    this.appointmentFormMode = 'edit';
    this.appointmentSaving = false;
    this.appointmentError = '';
    this.appointmentConflictWarning = '';
    this.appointmentCanOverrideConflict = false;
    this.appointmentSearchTerm = '';

    this.api.getAppointment(appointmentId, this.enquiry.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.appointmentDraft = this.mapAppointmentToDraft(detail);
        },
        error: () => {
          this.appointmentError = 'Unable to load appointment.';
        }
      });
  }

  cancelAppointmentForm(): void {
    this.appointmentFormVisible = false;
    this.appointmentSaving = false;
    this.appointmentError = '';
    this.appointmentConflictWarning = '';
    this.appointmentCanOverrideConflict = false;
    this.appointmentSearchTerm = '';
    this.appointmentDraft = this.createAppointmentDraft(this.enquiry ?? undefined);
  }

  updateAppointmentDraftField(patch: Partial<AppointmentDraft>): void {
    this.appointmentDraft = { ...this.appointmentDraft, ...patch };
    this.appointmentError = '';
  }

  isRelatedEnquirySelected(enquiryId: string): boolean {
    return this.appointmentDraft.relatedEnquiryIds.includes(enquiryId);
  }

  toggleRelatedEnquiry(enquiryId: string): void {
    const selected = new Set(this.appointmentDraft.relatedEnquiryIds);
    if (selected.has(enquiryId)) {
      selected.delete(enquiryId);
    } else {
      selected.add(enquiryId);
    }

    this.appointmentDraft = {
      ...this.appointmentDraft,
      relatedEnquiryIds: Array.from(selected)
    };
    this.appointmentError = '';
  }

  saveAppointment(allowConflictOverride = false): void {
    if (!this.enquiry || !this.enquiry.venueId || this.appointmentSaving) {
      return;
    }

    const validationError = this.validateAppointmentDraft(this.appointmentDraft);
    if (validationError) {
      this.appointmentError = validationError;
      return;
    }

    this.appointmentSaving = true;
    this.appointmentError = '';
    this.appointmentConflictWarning = '';
    this.appointmentCanOverrideConflict = false;

    const startUtc = this.combineDateAndTimeToIso(this.appointmentDraft.date, this.appointmentDraft.startTime);
    const payload = {
      venueId: this.enquiry.venueId,
      title: this.appointmentDraft.title.trim(),
      type: this.appointmentDraft.type.trim(),
      startUtc,
      durationMinutes: Math.max(15, Math.floor(this.numberOrZero(this.appointmentDraft.durationMinutes))),
      spaceId: this.appointmentDraft.spaceId || null,
      attendees: this.appointmentDraft.attendees.trim() || null,
      relatedEnquiryIds: this.appointmentDraft.relatedEnquiryIds.filter((id) => !!id),
      assignedToUserId: this.appointmentDraft.assignedToUserId || null,
      notes: this.appointmentDraft.notes.trim() || null,
      status: this.appointmentDraft.status,
      allowConflictOverride
    };

    const request$ = this.appointmentFormMode === 'edit' && this.appointmentDraft.id
      ? this.api.updateAppointment(this.appointmentDraft.id, payload)
      : this.api.createAppointment(payload);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.appointmentSaving = false;
          this.cancelAppointmentForm();
          this.loadEnquiryDetail(this.enquiryId);
        },
        error: (error) => {
          this.appointmentSaving = false;
          if (error?.status === 409) {
            this.appointmentCanOverrideConflict = true;
            this.appointmentError = typeof error?.error?.message === 'string'
              ? error.error.message
              : 'Appointment conflicts with existing bookings.';
            this.appointmentConflictWarning = 'Space/time conflict detected. You can save anyway.';
            return;
          }

          this.appointmentError = typeof error?.error?.message === 'string'
            ? error.error.message
            : 'Unable to save appointment.';
        }
      });
  }

  updateAppointmentStatus(appointmentId: string, status: AppointmentFormStatus): void {
    if (!appointmentId || !this.enquiry?.venueId) {
      return;
    }

    this.api.getAppointment(appointmentId, this.enquiry.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          const payload = {
            title: detail.title,
            type: detail.type,
            startUtc: detail.startUtc,
            durationMinutes: detail.durationMinutes,
            spaceId: detail.spaceId ?? null,
            attendees: detail.attendees ?? null,
            relatedEnquiryIds: (detail.relatedEnquiries ?? []).map((item) => item.enquiryId),
            assignedToUserId: detail.assignedToUserId ?? null,
            notes: detail.notes ?? null,
            status
          };

          this.api.updateAppointment(appointmentId, payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => this.loadEnquiryDetail(this.enquiryId),
              error: () => {
                this.appointmentError = `Unable to mark appointment as ${status}.`;
              }
            });
        },
        error: () => {
          this.appointmentError = 'Unable to load appointment for status change.';
        }
      });
  }

  deleteAppointment(appointmentId: string): void {
    if (!appointmentId || !this.enquiry?.venueId) {
      return;
    }

    const confirmed = window.confirm('Delete this appointment?');
    if (!confirmed) {
      return;
    }

    this.api.deleteAppointment(appointmentId, this.enquiry.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (this.appointmentDraft.id === appointmentId) {
            this.cancelAppointmentForm();
          }
          this.loadEnquiryDetail(this.enquiryId);
        },
        error: () => {
          this.appointmentError = 'Unable to delete appointment.';
        }
      });
  }

  appointmentStatusLabel(value: string): string {
    if ((value || '').trim().toLowerCase() === 'noshow') {
      return 'No-Show';
    }

    return value;
  }

  documentTypeToken(document: EnquiryDocumentDto): string {
    const mime = (document.mimeType || '').toLowerCase();
    const fileName = (document.fileName || '').toLowerCase();
    if (mime.includes('pdf') || fileName.endsWith('.pdf')) {
      return 'PDF';
    }
    if (mime.includes('word') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      return 'DOC';
    }
    if (mime.includes('sheet') || fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || fileName.endsWith('.csv')) {
      return 'XLS';
    }
    if (mime.startsWith('image/') || fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      return 'IMG';
    }
    return 'FILE';
  }

  formatFileSize(bytes: number): string {
    const size = Number(bytes);
    if (!Number.isFinite(size) || size <= 0) {
      return '0 B';
    }
    if (size < 1024) {
      return `${Math.round(size)} B`;
    }
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  taskStatusLabel(value: string): string {
    const normalized = (value || '').trim().toLowerCase();
    switch (normalized) {
      case 'todo':
      case 'to do':
        return 'To Do';
      case 'inprogress':
      case 'in_progress':
      case 'in progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
      case 'canceled':
        return 'Cancelled';
      default:
        return value;
    }
  }

  taskPriorityLabel(value: string): string {
    const normalized = (value || '').trim().toLowerCase();
    switch (normalized) {
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      case 'urgent':
        return 'Urgent';
      default:
        return value;
    }
  }

  taskIsCompleted(task: TaskItemDto): boolean {
    return (task.status || '').trim().toLowerCase() === 'completed';
  }

  createTask(): void {
    if (!this.enquiryId || this.taskSaving) {
      return;
    }

    if (!this.taskDraft.title.trim()) {
      this.taskActionError = 'Task title is required.';
      return;
    }

    this.taskSaving = true;
    this.taskActionError = '';
    this.taskActionSuccess = '';
    this.api.createTask(this.enquiryId, {
      title: this.taskDraft.title.trim(),
      description: null,
      status: this.taskDraft.status,
      priority: this.taskDraft.priority,
      category: this.taskDraft.category || 'General',
      assigneeId: this.taskDraft.assigneeId || null,
      dueDate: this.taskDraft.dueDate || null,
      dueTime: null,
      notes: null
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.taskSaving = false;
          this.taskActionSuccess = 'Task created.';
          this.taskDraft = {
            title: '',
            dueDate: '',
            priority: this.taskDraft.priority,
            status: 'todo',
            category: this.taskDraft.category || 'General',
            assigneeId: this.taskDraft.assigneeId
          };
          this.tasksLoadedFor = '';
          this.loadTasks();
        },
        error: (error) => {
          this.taskSaving = false;
          this.taskActionError = typeof error?.error?.message === 'string'
            ? error.error.message
            : 'Unable to create task.';
        }
      });
  }

  toggleTaskComplete(task: TaskItemDto): void {
    if (!this.enquiryId || this.taskSaving) {
      return;
    }

    this.taskSaving = true;
    this.taskActionError = '';
    this.taskActionSuccess = '';

    const request$ = this.taskIsCompleted(task)
      ? this.api.reopenTask(this.enquiryId, task.id)
      : this.api.completeTask(this.enquiryId, task.id, null);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.taskSaving = false;
          this.taskActionSuccess = this.taskIsCompleted(task) ? 'Task reopened.' : 'Task completed.';
          this.tasksLoadedFor = '';
          this.loadTasks();
        },
        error: () => {
          this.taskSaving = false;
          this.taskActionError = 'Unable to update task status.';
        }
      });
  }

  deleteTask(task: TaskItemDto): void {
    if (!this.enquiryId || this.taskSaving) {
      return;
    }

    const confirmed = window.confirm(`Delete task "${task.title}"?`);
    if (!confirmed) {
      return;
    }

    this.taskSaving = true;
    this.taskActionError = '';
    this.taskActionSuccess = '';

    this.api.deleteTask(this.enquiryId, task.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.taskSaving = false;
          this.taskActionSuccess = 'Task deleted.';
          this.tasksLoadedFor = '';
          this.loadTasks();
        },
        error: () => {
          this.taskSaving = false;
          this.taskActionError = 'Unable to delete task.';
        }
      });
  }

  private confirmDiscardOverviewEditsIfNeeded(): boolean {
    if (!this.overviewEditMode || !this.isOverviewEditDirty) {
      return true;
    }

    return window.confirm('You have unsaved edits. Discard your changes?');
  }

  private refreshOverviewEditValidation(): void {
    if (!this.overviewEditMode || !this.enquiry) {
      this.overviewEditFieldErrors = {};
      return;
    }

    this.overviewEditFieldErrors = this.validateOverviewEditDraft(this.overviewEditDraft, this.enquiry);
  }

  private createOverviewEditDraft(): EnquiryEditDraft {
    return {
      contactFirstName: '',
      contactLastName: '',
      contactEmail: '',
      contactPhoneNumberE164: '',
      companyName: '',
      eventType: '',
      eventName: '',
      eventDate: '',
      eventTime: '09:00',
      eventEndDate: '',
      eventEndTime: '',
      guestsExpected: 1,
      eventStyle: '',
      setupStyle: '',
      sourceType: '',
      sourceDetail: '',
      specialRequirements: '',
      eventManagerUserId: '',
      marketingConsent: false
    };
  }

  private mapEnquiryToOverviewEditDraft(detail: EnquiryDetailResponse): EnquiryEditDraft {
    const eventStart = new Date(detail.eventStartUtc);
    const eventEnd = detail.eventEndUtc ? new Date(detail.eventEndUtc) : null;
    return {
      contactFirstName: detail.contactFirstName ?? '',
      contactLastName: detail.contactLastName ?? '',
      contactEmail: detail.contactEmail ?? '',
      contactPhoneNumberE164: detail.contactPhoneNumberE164 ?? '',
      companyName: detail.companyName ?? '',
      eventType: detail.eventType ?? '',
      eventName: detail.eventName ?? '',
      eventDate: this.toDateOnly(detail.eventStartUtc),
      eventTime: this.toTimeOnly(eventStart),
      eventEndDate: eventEnd ? this.toDateOnly(detail.eventEndUtc ?? undefined) : '',
      eventEndTime: eventEnd ? this.toTimeOnly(eventEnd) : '',
      guestsExpected: Math.max(1, Math.round(this.numberOrZero(detail.guestsExpected) || 1)),
      eventStyle: detail.eventStyle ?? '',
      setupStyle: detail.setupStyle ?? '',
      sourceType: detail.sourceType ?? '',
      sourceDetail: detail.sourceDetail ?? '',
      specialRequirements: detail.specialRequirements ?? '',
      eventManagerUserId: detail.eventManagerUserId ?? '',
      marketingConsent: !!detail.marketingConsent
    };
  }

  private serializeOverviewEditDraft(draft: EnquiryEditDraft): string {
    const normalized = {
      contactFirstName: draft.contactFirstName.trim(),
      contactLastName: draft.contactLastName.trim(),
      contactEmail: draft.contactEmail.trim().toLowerCase(),
      contactPhoneNumberE164: draft.contactPhoneNumberE164.trim(),
      companyName: draft.companyName.trim(),
      eventType: draft.eventType.trim(),
      eventName: draft.eventName.trim(),
      eventDate: draft.eventDate.trim(),
      eventTime: draft.eventTime.trim(),
      eventEndDate: draft.eventEndDate.trim(),
      eventEndTime: draft.eventEndTime.trim(),
      guestsExpected: Math.max(1, Math.round(this.numberOrZero(draft.guestsExpected))),
      eventStyle: draft.eventStyle.trim(),
      setupStyle: draft.setupStyle.trim(),
      sourceType: draft.sourceType.trim(),
      sourceDetail: draft.sourceDetail.trim(),
      specialRequirements: draft.specialRequirements.trim(),
      eventManagerUserId: draft.eventManagerUserId.trim(),
      marketingConsent: !!draft.marketingConsent
    };
    return JSON.stringify(normalized);
  }

  private detectPhonePrefix(value: string): string {
    const compact = (value || '').trim();
    const knownPrefix = this.phonePrefixOptions.find((prefix) => compact.startsWith(prefix));
    return knownPrefix ?? '+44';
  }

  private validateOverviewEditDraft(
    draft: EnquiryEditDraft,
    source: EnquiryDetailResponse
  ): Partial<Record<EnquiryEditField, string>> {
    const errors: Partial<Record<EnquiryEditField, string>> = {};

    const firstName = draft.contactFirstName.trim();
    const lastName = draft.contactLastName.trim();
    const email = draft.contactEmail.trim();
    const phone = draft.contactPhoneNumberE164.trim();
    const company = draft.companyName.trim();
    const eventType = draft.eventType.trim();
    const eventName = draft.eventName.trim();
    const eventDate = draft.eventDate.trim();
    const eventTime = draft.eventTime.trim();
    const eventEndDate = draft.eventEndDate.trim();
    const eventEndTime = draft.eventEndTime.trim();
    const guestsExpected = Math.round(this.numberOrZero(draft.guestsExpected));

    if (!firstName) {
      errors.contactFirstName = 'First name is required.';
    } else if (firstName.length > 50) {
      errors.contactFirstName = 'First name cannot exceed 50 characters.';
    }

    if (!lastName) {
      errors.contactLastName = 'Last name is required.';
    } else if (lastName.length > 50) {
      errors.contactLastName = 'Last name cannot exceed 50 characters.';
    }

    if (!email) {
      errors.contactEmail = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.contactEmail = 'Enter a valid email address.';
    }

    if (!phone) {
      errors.contactPhoneNumberE164 = 'Phone number is required.';
    } else if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
      errors.contactPhoneNumberE164 = 'Use E.164 format, e.g. +447700900123.';
    }

    if (company.length > 200) {
      errors.companyName = 'Company cannot exceed 200 characters.';
    }

    if (!eventType) {
      errors.eventType = 'Event type is required.';
    }

    if (eventName.length > 200) {
      errors.eventName = 'Event name cannot exceed 200 characters.';
    }

    if (!eventDate) {
      errors.eventDate = 'Event date is required.';
    }

    if (!eventTime) {
      errors.eventTime = 'Event time is required.';
    }

    if (!Number.isInteger(guestsExpected) || guestsExpected <= 0) {
      errors.guestsExpected = 'Expected guests must be a positive whole number.';
    }

    if (eventDate) {
      const parsedEventDate = new Date(`${eventDate}T00:00:00Z`);
      if (Number.isNaN(parsedEventDate.getTime())) {
        errors.eventDate = 'Enter a valid event date.';
      } else if (this.toCanonicalStatus(source.status) === 'New') {
        const today = new Date();
        const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
        if (parsedEventDate.getTime() < todayUtc) {
          errors.eventDate = 'Event date cannot be in the past for new enquiries.';
        }
      }
    }

    if (eventDate && eventTime) {
      const eventStartIso = this.combineDateAndTimeToIso(eventDate, eventTime);
      const eventStartMs = new Date(eventStartIso).getTime();
      if (!Number.isFinite(eventStartMs)) {
        errors.eventTime = 'Enter a valid event time.';
      }

      if (eventEndDate || eventEndTime) {
        if (!eventEndDate || !eventEndTime) {
          errors.eventEndDate = 'End date and end time are required together.';
          errors.eventEndTime = 'End date and end time are required together.';
        } else {
          const eventEndIso = this.combineDateAndTimeToIso(eventEndDate, eventEndTime);
          const eventEndMs = new Date(eventEndIso).getTime();
          if (!Number.isFinite(eventEndMs)) {
            errors.eventEndTime = 'Enter a valid end time.';
          } else if (Number.isFinite(eventStartMs) && eventEndMs <= eventStartMs) {
            errors.eventEndTime = 'End date/time must be after the event start.';
          }
        }
      }
    }

    return errors;
  }

  private buildOverviewUpdatePayload(draft: EnquiryEditDraft, source: EnquiryDetailResponse) {
    const startIso = this.combineDateAndTimeToIso(
      draft.eventDate.trim(),
      draft.eventTime.trim() || this.toTimeOnly(new Date(source.eventStartUtc))
    );

    const hasEnd = draft.eventEndDate.trim() && draft.eventEndTime.trim();
    const endIso = hasEnd
      ? this.combineDateAndTimeToIso(draft.eventEndDate.trim(), draft.eventEndTime.trim())
      : null;

    return {
      eventType: draft.eventType.trim(),
      eventName: draft.eventName.trim() || null,
      eventStartUtc: startIso,
      eventEndUtc: endIso,
      hasFlexibleDates: source.hasFlexibleDates,
      flexibleDateNotes: source.flexibleDateNotes ?? null,
      guestsExpected: Math.max(1, Math.round(this.numberOrZero(draft.guestsExpected))),
      guestsConfirmed: source.guestsConfirmed ?? null,
      eventStyle: draft.eventStyle.trim() || null,
      setupStyle: draft.setupStyle.trim() || null,
      budgetMinAmount: source.budgetMinAmount ?? null,
      budgetMaxAmount: source.budgetMaxAmount ?? null,
      currencyCode: source.currencyCode,
      sourceType: draft.sourceType.trim() || source.sourceType,
      sourceDetail: draft.sourceDetail.trim() || null,
      leadQuality: source.leadQuality,
      specialRequirements: draft.specialRequirements.trim() || null,
      internalNotes: source.internalNotes ?? null,
      eventManagerUserId: draft.eventManagerUserId.trim() || null,
      contactFirstName: draft.contactFirstName.trim(),
      contactLastName: draft.contactLastName.trim(),
      contactEmail: draft.contactEmail.trim(),
      contactPhoneNumberE164: draft.contactPhoneNumberE164.trim(),
      companyName: draft.companyName.trim() || null,
      marketingConsent: !!draft.marketingConsent
    };
  }

  private applyOverviewFieldErrorsFromServer(error: any): void {
    const errors = error?.error?.errors;
    if (!errors || typeof errors !== 'object') {
      return;
    }

    const fieldMap: Partial<Record<string, EnquiryEditField>> = {
      contactfirstname: 'contactFirstName',
      contactlastname: 'contactLastName',
      contactemail: 'contactEmail',
      contactphonenumbere164: 'contactPhoneNumberE164',
      companyname: 'companyName',
      eventtype: 'eventType',
      eventname: 'eventName',
      eventstartutc: 'eventDate',
      eventdate: 'eventDate',
      guestsexpected: 'guestsExpected'
    };

    const nextErrors: Partial<Record<EnquiryEditField, string>> = { ...this.overviewEditFieldErrors };
    for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
      const mappedField = fieldMap[key.replace(/[\s._-]+/g, '').toLowerCase()];
      if (!mappedField) {
        continue;
      }

      if (Array.isArray(value) && value.length > 0) {
        nextErrors[mappedField] = String(value[0]);
        continue;
      }

      if (typeof value === 'string' && value.trim()) {
        nextErrors[mappedField] = value.trim();
      }
    }

    this.overviewEditFieldErrors = nextErrors;
  }

  private extractOverviewEditSaveError(error: any): string {
    if (typeof error?.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message.trim();
    }

    if (typeof error?.error?.error === 'string' && error.error.error.trim()) {
      return error.error.error.trim();
    }

    return 'Failed to save. Please try again.';
  }

  private showOverviewToast(message: string): void {
    this.overviewToastMessage = message;
    setTimeout(() => {
      if (this.overviewToastMessage === message) {
        this.overviewToastMessage = '';
      }
    }, 5000);
  }

  private normalizeTab(value: string | null): EnquiryDetailTab {
    switch ((value ?? '').trim().toLowerCase()) {
      case 'events':
      case 'appointments':
      case 'proposals':
      case 'communications':
      case 'payments':
      case 'documents':
      case 'activity':
      case 'tasks':
        return value!.trim().toLowerCase() as EnquiryDetailTab;
      default:
        return 'overview';
    }
  }

  private normalizeStatus(value: string | null | undefined): string {
    return (value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, '');
  }

  private resetLazyTabData(): void {
    this.proposals = [];
    this.proposalsError = '';
    this.proposalsLoading = false;
    this.proposalsLoadedFor = '';

    this.communications = [];
    this.communicationsError = '';
    this.communicationsLoading = false;
    this.communicationsFilter = 'all';
    this.composeMode = 'note';
    this.noteDraft = '';
    this.emailDraft = {
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      body: ''
    };
    this.communicationsSubmitting = false;
    this.communicationsActionError = '';
    this.communicationsActionSuccess = '';
    this.communicationsLoadedFor = '';

    this.paymentSchedule = null;
    this.paymentsError = '';
    this.paymentsLoading = false;
    this.paymentActionMilestoneId = '';
    this.paymentActionError = '';
    this.paymentActionSuccess = '';
    this.paymentsLoadedFor = '';

    this.activityEntries = [];
    this.activityLoading = false;
    this.activityLoadingMore = false;
    this.activityError = '';
    this.activityHasMore = false;
    this.activityPage = 1;
    this.activityChangesByEntryId = {};
    this.activityLoadedFor = '';

    this.documents = [];
    this.documentsError = '';
    this.documentsLoading = false;
    this.documentsUploading = false;
    this.documentsUploadError = '';
    this.documentsDropActive = false;
    this.documentsLoadedFor = '';

    this.tasks = [];
    this.tasksError = '';
    this.tasksLoading = false;
    this.taskSaving = false;
    this.taskActionError = '';
    this.taskActionSuccess = '';
    this.tasksLoadedFor = '';
  }

  private loadEnquiryDetail(enquiryId: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.enquiry = null;

    this.api.getEnquiry(enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.loading = false;
          this.enquiry = detail;
          this.statusAllowedTransitions = this.computeAllowedTransitions(detail.status);
          this.statusChangeTarget = '';
          this.statusChangeError = '';
          this.statusChangeSuccess = '';
          this.statusHoldDaysOverride = '';
          this.statusLostReason = '';
          this.statusLostReasonDetail = '';
          this.statusLostDate = '';
          this.sameDateAvailabilityError = '';
          this.sameDateAvailabilityLoading = false;
          this.subEventFormVisible = false;
          this.subEventError = '';
          this.subEventConflictWarning = '';
          this.subEventCanOverrideConflict = false;
          this.subEventDraft = this.createSubEventDraft(detail);
          this.appointmentFormVisible = false;
          this.appointmentError = '';
          this.appointmentConflictWarning = '';
          this.appointmentCanOverrideConflict = false;
          this.appointmentDraft = this.createAppointmentDraft(detail);
          this.appointmentSearchTerm = '';
          this.taskActionError = '';
          this.taskActionSuccess = '';
          this.overviewEditError = '';
          this.overviewEditFieldErrors = {};
          if (!this.overviewEditMode) {
            this.overviewEditDraft = this.mapEnquiryToOverviewEditDraft(detail);
            this.overviewEditBaseline = this.serializeOverviewEditDraft(this.overviewEditDraft);
            this.overviewPhonePrefixSelection = this.detectPhonePrefix(this.overviewEditDraft.contactPhoneNumberE164);
          }
          this.taskDraft = {
            title: '',
            dueDate: this.toDateOnly(detail.eventStartUtc),
            priority: 'medium',
            status: 'todo',
            category: 'General',
            assigneeId: detail.eventManagerUserId ?? ''
          };
          this.loadLookups(detail.venueId);
          this.loadLostReasons(detail.venueId);
          this.loadTabData(this.activeTab);
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Unable to load enquiry details.';
        }
      });
  }

  private loadTabData(tab: EnquiryDetailTab): void {
    if (!this.enquiryId || !this.enquiry) {
      return;
    }

    switch (tab) {
      case 'proposals':
        this.loadProposals();
        break;
      case 'communications':
        this.loadCommunications();
        break;
      case 'payments':
        this.loadPayments();
        break;
      case 'documents':
        this.loadDocuments();
        break;
      case 'activity':
        this.loadActivity(true);
        break;
      case 'tasks':
        this.loadTasks();
        break;
      default:
        break;
    }
  }

  private loadLookups(venueId: string): void {
    if (!venueId || this.loadedLookupVenueId === venueId) {
      return;
    }

    this.lookupsLoading = true;
    forkJoin({
      spaces: this.api.getVenueSpaces(venueId),
      users: this.api.getUsers(venueId),
      enquiries: this.api.getEnquiries({ venueId, statusTab: 'all', page: 1, pageSize: 100 })
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ spaces, users, enquiries }) => {
          this.lookupsLoading = false;
          this.spaces = [...(spaces ?? [])]
            .filter((item) => item.isActive !== false)
            .sort((left, right) => left.name.localeCompare(right.name));
          this.users = [...(users ?? [])].sort((left, right) =>
            this.userDisplayName(left).localeCompare(this.userDisplayName(right)));
          this.relatedEnquiryOptions = (enquiries?.page?.items ?? [])
            .map((item) => ({
              id: item.id,
              reference: item.reference,
              contactName: item.contactName,
              eventType: item.eventType,
              eventDate: item.eventStartUtc,
              status: this.displayStatus(item.status)
            }))
            .sort((left, right) => left.reference.localeCompare(right.reference));
          this.loadedLookupVenueId = venueId;
        },
        error: () => {
          this.lookupsLoading = false;
          this.spaces = [];
          this.users = [];
          this.relatedEnquiryOptions = [];
        }
      });
  }

  private loadLostReasons(venueId: string): void {
    if (!venueId || this.loadedLostReasonsVenueId === venueId) {
      return;
    }

    this.api.getLostReasons(venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows: LostReasonSettingDto[]) => {
          this.lostReasonOptions = (rows ?? [])
            .filter((item) => item.isActive)
            .sort((left, right) => left.sortOrder - right.sortOrder)
            .map((item) => item.label.trim())
            .filter((label) => !!label);
          this.loadedLostReasonsVenueId = venueId;
        },
        error: () => {
          this.lostReasonOptions = [
            'Price Too High',
            'Date Not Available',
            'No Response',
            'Booked Elsewhere',
            'Requirements Not Met'
          ];
          this.loadedLostReasonsVenueId = venueId;
        }
      });
  }

  private loadProposals(): void {
    if (this.proposalsLoadedFor === this.enquiryId || this.proposalsLoading) {
      return;
    }

    this.proposalsLoading = true;
    this.proposalsError = '';
    this.api.getEnquiryProposals(this.enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          this.proposalsLoading = false;
          this.proposals = [...(rows ?? [])].sort((left, right) => {
            const leftVersion = Number(left.versionNumber ?? 0);
            const rightVersion = Number(right.versionNumber ?? 0);
            return rightVersion - leftVersion;
          });
          this.proposalsLoadedFor = this.enquiryId;
        },
        error: () => {
          this.proposalsLoading = false;
          this.proposalsError = 'Unable to load proposals.';
        }
      });
  }

  private loadCommunications(): void {
    if (this.communicationsLoadedFor === this.enquiryId || this.communicationsLoading || !this.enquiry) {
      return;
    }

    this.communicationsLoading = true;
    this.communicationsError = '';
    this.api.getConnectTimeline({
      venueId: this.enquiry.venueId,
      enquiryId: this.enquiryId,
      type: 'all',
      page: 1,
      pageSize: 50
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.communicationsLoading = false;
          this.communications = [...(response.page.items ?? [])].sort((left, right) =>
            new Date(right.occurredAtUtc).getTime() - new Date(left.occurredAtUtc).getTime());
          if (!this.emailDraft.to.trim() && this.enquiry?.contactEmail) {
            this.emailDraft = {
              ...this.emailDraft,
              to: this.enquiry.contactEmail
            };
          }
          this.communicationsLoadedFor = this.enquiryId;
        },
        error: () => {
          this.communicationsLoading = false;
          this.communicationsError = 'Unable to load communications.';
        }
      });
  }

  private loadPayments(): void {
    if (this.paymentsLoadedFor === this.enquiryId || this.paymentsLoading) {
      return;
    }

    this.paymentsLoading = true;
    this.paymentsError = '';
    this.api.getPaymentSchedule(this.enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.paymentsLoading = false;
          this.paymentSchedule = response;
          this.paymentsLoadedFor = this.enquiryId;
        },
        error: () => {
          this.paymentsLoading = false;
          this.paymentsError = 'Unable to load payment schedule.';
        }
      });
  }

  private loadActivity(reset: boolean): void {
    if (!this.enquiryId) {
      return;
    }

    if (reset) {
      if (this.activityLoading) {
        return;
      }
      if (this.activityLoadedFor === this.enquiryId && this.activityEntries.length > 0 && !this.activityError) {
        return;
      }
      this.activityPage = 1;
      this.activityEntries = [];
      this.activityHasMore = false;
      this.activityError = '';
      this.activityLoading = true;
    } else {
      if (this.activityLoadingMore || this.activityLoading || !this.activityHasMore) {
        return;
      }
      this.activityLoadingMore = true;
      this.activityPage += 1;
    }

    this.api.getEnquiryActivity(this.enquiryId, {
      actionCategory: this.activityActionCategory === 'all' ? undefined : this.activityActionCategory,
      fromDate: this.activityFromDate || undefined,
      toDate: this.activityToDate || undefined,
      page: this.activityPage,
      pageSize: 20
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const rows = response.items ?? [];
          this.activityEntries = reset ? rows : [...this.activityEntries, ...rows];
          const nextChanges = reset ? {} : { ...this.activityChangesByEntryId };
          for (const entry of rows) {
            nextChanges[entry.id] = this.parseActivityChanges(entry.changeSummaryJson);
          }
          this.activityChangesByEntryId = nextChanges;
          this.activityHasMore = !!response.hasMore;
          this.activityLoadedFor = this.enquiryId;
          this.activityLoading = false;
          this.activityLoadingMore = false;
        },
        error: () => {
          if (!reset) {
            this.activityPage = Math.max(1, this.activityPage - 1);
          }
          this.activityLoading = false;
          this.activityLoadingMore = false;
          this.activityError = 'Unable to load activity.';
        }
      });
  }

  private loadDocuments(): void {
    if (this.documentsLoadedFor === this.enquiryId || this.documentsLoading) {
      return;
    }

    this.documentsLoading = true;
    this.documentsError = '';
    this.api.getEnquiryDocuments(this.enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          this.documentsLoading = false;
          this.documents = [...(rows ?? [])].sort((left, right) =>
            new Date(right.uploadedAtUtc).getTime() - new Date(left.uploadedAtUtc).getTime());
          this.documentsLoadedFor = this.enquiryId;
        },
        error: () => {
          this.documentsLoading = false;
          this.documentsError = 'Unable to load documents.';
        }
      });
  }

  private uploadDocument(file: File): void {
    if (!this.enquiryId || this.documentsUploading) {
      return;
    }

    this.documentsUploadError = '';
    if (file.size > 25 * 1024 * 1024) {
      this.documentsUploadError = 'File is too large. Maximum size is 25MB.';
      return;
    }

    if (!this.isAllowedDocumentFile(file)) {
      this.documentsUploadError = 'Unsupported file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, CSV.';
      return;
    }

    this.documentsUploading = true;
    this.fileToBase64(file)
      .then((base64Content) => {
        const mimeType = file.type?.trim() || 'application/octet-stream';
        return firstValueFrom(this.api.uploadEnquiryDocument(this.enquiryId, {
          fileName: file.name,
          mimeType,
          category: 'Other',
          base64Content
        }));
      })
      .then((document) => {
        this.documentsUploading = false;
        if (!document) {
          return;
        }

        this.documents = [document, ...this.documents];
        this.documentsLoadedFor = this.enquiryId;
      })
      .catch(() => {
        this.documentsUploading = false;
        this.documentsUploadError = 'Unable to upload document.';
      });
  }

  private isAllowedDocumentFile(file: File): boolean {
    const fileName = (file.name || '').trim().toLowerCase();
    const extension = fileName.includes('.') ? fileName.split('.').pop() ?? '' : '';
    if (this.allowedDocumentExtensions.has(extension)) {
      return true;
    }

    const mime = (file.type || '').trim().toLowerCase();
    if (!mime) {
      return false;
    }

    return mime === 'application/pdf'
      || mime === 'text/csv'
      || mime === 'application/msword'
      || mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      || mime === 'application/vnd.ms-excel'
      || mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      || mime === 'image/jpeg'
      || mime === 'image/png';
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Unable to read file.'));
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        const markerIndex = result.indexOf(',');
        if (markerIndex < 0) {
          reject(new Error('Unable to parse file data.'));
          return;
        }

        resolve(result.slice(markerIndex + 1));
      };
      reader.readAsDataURL(file);
    });
  }

  private loadTasks(): void {
    if (this.tasksLoadedFor === this.enquiryId || this.tasksLoading) {
      return;
    }

    this.tasksLoading = true;
    this.tasksError = '';
    this.api.getEnquiryTasks(this.enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.tasksLoading = false;
          this.tasks = [...(response.items ?? [])].sort((left, right) =>
            new Date(left.dueDate ?? left.updatedAtUtc).getTime() - new Date(right.dueDate ?? right.updatedAtUtc).getTime());
          this.tasksLoadedFor = this.enquiryId;
        },
        error: () => {
          this.tasksLoading = false;
          this.tasksError = 'Unable to load tasks.';
        }
      });
  }

  private toCanonicalStatus(value: string | null | undefined): CanonicalStatus {
    const compact = (value ?? '')
      .trim()
      .replace(/[\s_-]+/g, '')
      .toLowerCase();

    switch (compact) {
      case 'new':
        return 'New';
      case 'tentative':
        return 'Tentative';
      case 'openproposal':
        return 'OpenProposal';
      case 'provisional':
        return 'Provisional';
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'lost':
        return 'Lost';
      case 'archived':
        return 'Archived';
      default:
        return 'New';
    }
  }

  private computeAllowedTransitions(currentStatus: string): CanonicalStatus[] {
    const canonical = this.toCanonicalStatus(currentStatus);
    return [...(this.statusTransitionMap[canonical] ?? [])];
  }

  private createSubEventDraft(enquiry?: EnquiryDetailResponse): SubEventDraft {
    const start = enquiry ? new Date(enquiry.eventStartUtc) : new Date();
    const end = enquiry?.eventEndUtc ? new Date(enquiry.eventEndUtc) : new Date(start.getTime() + 60 * 60 * 1000);

    return {
      name: '',
      type: 'Custom',
      status: this.toCanonicalStatus(enquiry?.status).toString(),
      date: this.toDateOnly(start.toISOString()),
      startTime: this.toTimeOnly(start),
      endTime: this.toTimeOnly(end > start ? end : new Date(start.getTime() + 60 * 60 * 1000)),
      guestCount: enquiry?.guestsExpected ?? 1,
      spaceId: this.spaces[0]?.id ?? '',
      setupStyle: enquiry?.setupStyle ?? '',
      specialRequirements: '',
      priceAmount: '',
      currencyCode: enquiry?.currencyCode ?? 'GBP'
    };
  }

  private mapSubEventToDraft(subEvent: EnquiryDetailResponse['subEvents'][number]): SubEventDraft {
    const start = new Date(subEvent.startUtc);
    const end = new Date(subEvent.endUtc);
    return {
      id: subEvent.id,
      name: subEvent.name ?? '',
      type: subEvent.type ?? 'Custom',
      status: this.toCanonicalStatus(subEvent.status).toString(),
      date: this.toDateOnly(subEvent.startUtc),
      startTime: this.toTimeOnly(start),
      endTime: this.toTimeOnly(end),
      guestCount: Math.max(1, Math.round(this.numberOrZero(subEvent.guestCount))),
      spaceId: subEvent.spaceIds?.[0] ?? '',
      setupStyle: subEvent.setupStyle ?? '',
      specialRequirements: subEvent.specialRequirements ?? '',
      priceAmount: subEvent.priceAmount === null || subEvent.priceAmount === undefined
        ? ''
        : String(subEvent.priceAmount),
      currencyCode: subEvent.currencyCode || this.enquiry?.currencyCode || 'GBP'
    };
  }

  private validateSubEventDraft(draft: SubEventDraft): string | null {
    if (!draft.name.trim()) {
      return 'Sub-event title is required.';
    }

    if (!draft.date || !draft.startTime || !draft.endTime) {
      return 'Date, start, and end times are required.';
    }

    const startIso = this.combineDateAndTimeToIso(draft.date, draft.startTime);
    const endIso = this.combineDateAndTimeToIso(draft.date, draft.endTime);
    const start = new Date(startIso).getTime();
    const end = new Date(endIso).getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      return 'End time must be later than start time.';
    }

    const guests = Math.floor(this.numberOrZero(draft.guestCount));
    if (guests <= 0) {
      return 'Guest count must be greater than zero.';
    }

    if (!draft.spaceId) {
      return 'Select a space.';
    }

    return null;
  }

  private buildSubEventPayload(draft: SubEventDraft, currencyCodeFallback: string, allowConflictOverride: boolean) {
    const priceAmount = draft.priceAmount.trim()
      ? Math.max(0, this.numberOrZero(draft.priceAmount))
      : null;

    return {
      name: draft.name.trim(),
      type: draft.type.trim() || 'Custom',
      status: this.toCanonicalStatus(draft.status),
      startUtc: this.combineDateAndTimeToIso(draft.date, draft.startTime),
      endUtc: this.combineDateAndTimeToIso(draft.date, draft.endTime),
      guestCount: Math.max(1, Math.floor(this.numberOrZero(draft.guestCount))),
      setupStyle: draft.setupStyle.trim() || null,
      specialRequirements: draft.specialRequirements.trim() || null,
      priceAmount,
      currencyCode: (draft.currencyCode || currencyCodeFallback || 'GBP').toUpperCase(),
      spaceIds: draft.spaceId ? [draft.spaceId] : [],
      allowConflictOverride
    };
  }

  private createAppointmentDraft(enquiry?: EnquiryDetailResponse): AppointmentDraft {
    const start = enquiry ? new Date(enquiry.eventStartUtc) : new Date();
    return {
      title: '',
      type: 'Meeting',
      date: this.toDateOnly(start.toISOString()),
      startTime: this.toTimeOnly(start),
      durationMinutes: 60,
      spaceId: '',
      attendees: '',
      relatedEnquiryIds: enquiry ? [enquiry.id] : [],
      assignedToUserId: enquiry?.eventManagerUserId ?? '',
      notes: '',
      status: 'Scheduled'
    };
  }

  private mapAppointmentToDraft(appointment: AppointmentDetailDto): AppointmentDraft {
    const start = new Date(appointment.startUtc);
    return {
      id: appointment.id,
      title: appointment.title ?? '',
      type: appointment.type ?? 'Meeting',
      date: this.toDateOnly(appointment.startUtc),
      startTime: this.toTimeOnly(start),
      durationMinutes: Math.max(15, Math.floor(this.numberOrZero(appointment.durationMinutes) || 60)),
      spaceId: appointment.spaceId ?? '',
      attendees: appointment.attendees ?? '',
      relatedEnquiryIds: (appointment.relatedEnquiries ?? []).map((item) => item.enquiryId).filter((id) => !!id),
      assignedToUserId: appointment.assignedToUserId ?? '',
      notes: appointment.notes ?? '',
      status: this.normalizeAppointmentStatus(appointment.status)
    };
  }

  private normalizeAppointmentStatus(value: string | null | undefined): AppointmentFormStatus {
    const normalized = (value ?? '').trim().toLowerCase();
    switch (normalized) {
      case 'completed':
        return 'Completed';
      case 'cancelled':
      case 'canceled':
        return 'Cancelled';
      case 'noshow':
      case 'no-show':
        return 'NoShow';
      default:
        return 'Scheduled';
    }
  }

  private validateAppointmentDraft(draft: AppointmentDraft): string | null {
    if (!draft.title.trim()) {
      return 'Appointment title is required.';
    }
    if (!draft.type.trim()) {
      return 'Appointment type is required.';
    }
    if (!draft.date || !draft.startTime) {
      return 'Date and start time are required.';
    }

    const duration = Math.floor(this.numberOrZero(draft.durationMinutes));
    if (duration <= 0) {
      return 'Duration must be greater than zero.';
    }

    if (draft.relatedEnquiryIds.length === 0) {
      return 'Select at least one related enquiry.';
    }

    return null;
  }

  private parseActivityChanges(changeSummaryJson: string | null | undefined): ActivityChangeRow[] {
    const raw = (changeSummaryJson ?? '').trim();
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      return this.toActivityChangeRows(parsed);
    } catch {
      return [{
        label: 'Change',
        before: null,
        after: null,
        value: raw
      }];
    }
  }

  private toActivityChangeRows(value: unknown, labelHint?: string): ActivityChangeRow[] {
    if (value === null || value === undefined) {
      return [];
    }

    if (Array.isArray(value)) {
      return [{
        label: labelHint ?? 'Items',
        before: null,
        after: null,
        value: `${value.length} item(s)`
      }];
    }

    if (typeof value !== 'object') {
      return [{
        label: labelHint ?? 'Value',
        before: null,
        after: null,
        value: this.activityScalar(value)
      }];
    }

    const record = value as Record<string, unknown>;
    const directFrom = this.findCaseInsensitive(record, 'from');
    const directTo = this.findCaseInsensitive(record, 'to');
    if (directFrom !== undefined && directTo !== undefined) {
      const field = this.findCaseInsensitive(record, 'field');
      return [{
        label: field ? this.humanizeActivityLabel(this.activityScalar(field)) : (labelHint ?? 'Value'),
        before: this.activityScalar(directFrom),
        after: this.activityScalar(directTo),
        value: null
      }];
    }

    const oldValue = this.findCaseInsensitive(record, 'old');
    const newValue = this.findCaseInsensitive(record, 'new');
    if (oldValue && newValue && typeof oldValue === 'object' && typeof newValue === 'object') {
      const oldRecord = oldValue as Record<string, unknown>;
      const newRecord = newValue as Record<string, unknown>;
      const keys = new Set([...Object.keys(oldRecord), ...Object.keys(newRecord)]);
      const rows = Array.from(keys)
        .map((key) => ({
          label: this.humanizeActivityLabel(key),
          before: this.activityScalar(oldRecord[key]),
          after: this.activityScalar(newRecord[key]),
          value: null
        }))
        .filter((row) => row.before !== row.after);
      if (rows.length > 0) {
        return rows;
      }
    }

    const rows: ActivityChangeRow[] = [];
    for (const [key, nestedValue] of Object.entries(record)) {
      const nestedRows = this.toActivityChangeRows(nestedValue, this.humanizeActivityLabel(key));
      if (nestedRows.length === 0) {
        rows.push({
          label: this.humanizeActivityLabel(key),
          before: null,
          after: null,
          value: this.activityScalar(nestedValue)
        });
        continue;
      }
      rows.push(...nestedRows);
      if (rows.length >= 8) {
        break;
      }
    }

    return rows.slice(0, 8);
  }

  private findCaseInsensitive(record: Record<string, unknown>, key: string): unknown {
    const matched = Object.keys(record).find((candidate) => candidate.toLowerCase() === key.toLowerCase());
    return matched ? record[matched] : undefined;
  }

  private activityScalar(value: unknown): string {
    if (value === null || value === undefined) {
      return 'null';
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed || 'empty';
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (Array.isArray(value)) {
      return `${value.length} item(s)`;
    }

    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return '{...}';
      }
    }

    return String(value);
  }

  private humanizeActivityLabel(value: string): string {
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_\-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }

  private communicationMatchesFilter(item: ConnectTimelineItemDto): boolean {
    if (this.communicationsFilter === 'all') {
      return true;
    }

    const type = (item.type ?? '').trim().toLowerCase();
    if (this.communicationsFilter === 'emails') {
      return type.includes('email');
    }

    if (this.communicationsFilter === 'notes') {
      return item.isInternal || type.includes('note');
    }

    if (this.communicationsFilter === 'system') {
      return !type.includes('email') && !item.isInternal && !type.includes('note');
    }

    return true;
  }

  private toDateOnly(isoValue: string | null | undefined): string {
    const parsed = isoValue ? new Date(isoValue) : null;
    if (!parsed || Number.isNaN(parsed.getTime())) {
      return '';
    }

    const year = parsed.getUTCFullYear();
    const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
    const day = String(parsed.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toTimeOnly(value: Date): string {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      return '09:00';
    }

    const hours = String(value.getUTCHours()).padStart(2, '0');
    const minutes = String(value.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private combineDateAndTimeToIso(date: string, time: string): string {
    const compactDate = (date || '').trim();
    const compactTime = (time || '').trim();
    const raw = `${compactDate}T${compactTime}:00Z`;
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
      return new Date().toISOString();
    }

    return parsed.toISOString();
  }

  private toLostDateUtcIso(dateValue: string): string | undefined {
    const compact = (dateValue || '').trim();
    if (!compact) {
      return undefined;
    }

    const parsed = new Date(`${compact}T12:00:00Z`);
    if (Number.isNaN(parsed.getTime())) {
      return undefined;
    }

    return parsed.toISOString();
  }

  private todayDateInputValue(): string {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private numberOrZero(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  userDisplayName(user: UserSummaryDto | null | undefined): string {
    if (!user) {
      return '';
    }

    return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
  }
}
