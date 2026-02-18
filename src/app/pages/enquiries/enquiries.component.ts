import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, concatMap, distinctUntilChanged, forkJoin, from, map, of, tap } from 'rxjs';
import { DocumentsComponent } from './components/documents/documents.component';
import { TasksTabComponent } from './components/tasks-tab/tasks-tab.component';
import { QuickTaskCreatedEvent, TaskQuickCreateModalComponent } from '../../ui/task-quick-create-modal/task-quick-create-modal.component';
import {
  AppointmentDetailDto,
  ActivityFeedEntryDto,
  AiFollowUpRecommendationDto,
  ApiService,
  BulkActionResultResponse,
  CreateEnquiryRequest,
  EnquiryDocumentDto,
  EnquiryDetailResponse,
  EnquirySelectionResponse,
  EnquirySustainabilityRequest,
  EnquirySustainabilityResponse,
  EnquiryListItemDto,
  EnquiryListResponse,
  GenerateBeoResponse,
  LostReasonSettingDto,
  PortfolioRoutingOptionsResponse,
  PortfolioRoutingVenueOptionDto,
  PaymentMilestoneDto,
  PaymentScheduleResponse,
  PaymentScheduleTemplateSettingDto,
  PaymentTransactionDto,
  ProposalListItemDto,
  SpaceSummaryDto,
  SubEventConflictDto,
  SubEventDto,
  MergeEnquiriesResponse,
  UploadEnquiryDocumentRequest,
  UpsertSubEventRequest,
  UpsertPaymentMilestoneRequest,
  TransitionEnquiryStatusResponse,
  UpdateEnquiryRequest,
  UserSummaryDto
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ActivityRealtimeService } from '../../services/activity-realtime.service';

interface StatusTab {
  key: string;
  label: string;
}

interface BulkEmailRecipient {
  enquiryId: string;
  reference: string;
  name: string;
  email: string;
  eventName: string;
  eventDate: string;
}

interface PaymentMilestoneDraft {
  clientKey: string;
  id?: string;
  label: string;
  dueDate: string;
  amount: number;
  currencyCode: string;
  acceptedMethods: string;
  autoReminder: boolean;
  autoReminderDaysBefore: number | null;
  lateReminder: boolean;
  lateReminderDaysAfter: number | null;
  daysBeforeEvent: number;
}

interface SubEventDraft {
  name: string;
  type: string;
  status: string;
  date: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  spaceId: string;
  setupStyle: string;
  notes: string;
}

interface SubEventAvailabilityState {
  loading: boolean;
  isAvailable: boolean;
  warning: string;
  conflicts: SubEventConflictDto[];
}

interface AppointmentDraft {
  title: string;
  type: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  spaceId: string;
  attendees: string;
  assignedToUserId: string;
  notes: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'NoShow';
  relatedEnquiryIds: string[];
}

interface AppointmentEnquiryOption {
  id: string;
  label: string;
}

interface EnquiryActivityFilterState {
  actionCategory: 'all' | 'status' | 'communication' | 'document' | 'payment';
  userId: string;
  fromDate: string;
  toDate: string;
}

interface BulkUndoState {
  token: string;
  actionLabel: string;
  expiresAtUtc: string;
  secondsRemaining: number;
}

interface MergeFieldDefinition {
  key: string;
  label: string;
}

type EditableOverviewField =
  | 'contactName'
  | 'eventName'
  | 'eventDate'
  | 'startTime'
  | 'guestsExpected'
  | 'eventStyle'
  | 'setupStyle'
  | 'eventManagerUserId'
  | 'leadQuality'
  | 'sourceType'
  | 'sourceDetail'
  | 'contactPhoneNumberE164'
  | 'contactEmail'
  | 'companyName'
  | 'budgetMinAmount'
  | 'budgetMaxAmount'
  | 'specialRequirements'
  | 'hasFlexibleDates'
  | 'flexibleDateNotes'
  | 'marketingConsent';

interface EnquiryOverviewDraft {
  contactName: string;
  eventName: string;
  eventDate: string;
  startTime: string;
  guestsExpected: number;
  eventStyle: string;
  setupStyle: string;
  eventManagerUserId: string;
  leadQuality: number;
  sourceType: string;
  sourceDetail: string;
  contactPhoneNumberE164: string;
  contactEmail: string;
  companyName: string;
  budgetMinAmount: string;
  budgetMaxAmount: string;
  specialRequirements: string;
  hasFlexibleDates: boolean;
  flexibleDateNotes: string;
  marketingConsent: boolean;
}

@Component({
    selector: 'app-enquiries',
    imports: [DatePipe, DecimalPipe, ReactiveFormsModule, FormsModule, DocumentsComponent, TasksTabComponent, TaskQuickCreateModalComponent],
    templateUrl: './enquiries.component.html',
    styleUrl: './enquiries.component.scss',
    animations: [
      trigger('expandSection', [
        transition(':enter', [
          style({ opacity: 0, height: 0 }),
          animate('180ms ease-out', style({ opacity: 1, height: '*' }))
        ]),
        transition(':leave', [
          animate('140ms ease-in', style({ opacity: 0, height: 0 }))
        ])
      ])
    ]
})
export class EnquiriesComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private activityRealtime = inject(ActivityRealtimeService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = new FormBuilder();

  statusTabs: StatusTab[] = [
    { key: 'new-unanswered', label: 'New / Unanswered' },
    { key: 'proposals', label: 'Proposals' },
    { key: 'provisional', label: 'Provisional' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'lost', label: 'Lost' },
    { key: 'all', label: 'All' }
  ];

  quickFilters = [
    { value: '', label: 'No quick filter' },
    { value: 'my-enquiries', label: 'My Enquiries' },
    { value: 'unassigned', label: 'Unassigned' },
    { value: 'overdue-follow-up', label: 'Overdue Follow-up' },
    { value: 'expiring-holds', label: 'Expiring Holds' }
  ];
  conversionSortOptions: Array<{ value: string; label: string }> = [
    { value: '', label: 'Sort: Last Activity' },
    { value: 'conversionScore:desc', label: 'Sort: Conversion Score (High to Low)' },
    { value: 'conversionScore:asc', label: 'Sort: Conversion Score (Low to High)' },
    { value: 'eventDate:asc', label: 'Sort: Event Date (Earliest)' },
    { value: 'eventDate:desc', label: 'Sort: Event Date (Latest)' },
    { value: 'value:desc', label: 'Sort: Value (High to Low)' },
    { value: 'value:asc', label: 'Sort: Value (Low to High)' }
  ];

  activeTab = 'new-unanswered';
  listResponse: EnquiryListResponse | null = null;
  enquiries: EnquiryListItemDto[] = [];
  loading = false;
  enquiryLoadError = '';
  sourceFilter = '';
  creatingTestEnquiries = false;
  testDataFeedbackMessage = '';
  testDataFeedbackType: 'info' | 'success' | 'error' = 'info';
  showAddTaskModal = false;

  selectedEnquiryId: string | null = null;
  selectedEnquiry: EnquiryDetailResponse | null = null;
  sameDateAvailabilityExpanded = true;
  aiFollowUpRecommendations: AiFollowUpRecommendationDto[] = [];
  aiFollowUpRecommendationsLoading = false;
  aiFollowUpRecommendationsMessage = '';
  aiFollowUpExecutionInProgressKey: string | null = null;
  aiFollowUpExecutionMessage = '';
  aiFollowUpExecutionError = '';
  detailTab: 'overview' | 'events' | 'appointments' | 'tasks' | 'proposals' | 'payments' | 'sustainability' | 'documents' | 'activity' = 'overview';
  activityEntries: ActivityFeedEntryDto[] = [];
  activityLoading = false;
  activityLoadingMore = false;
  activityHasMore = false;
  activityTotalCount = 0;
  activityError = '';
  private activityPage = 1;
  private readonly activityPageSize = 50;
  activityFilters: EnquiryActivityFilterState = {
    actionCategory: 'all',
    userId: '',
    fromDate: '',
    toDate: ''
  };
  private activityRealtimeSubscribed = false;
  private activityReloadTimer: ReturnType<typeof setTimeout> | null = null;
  enquiryProposals: ProposalListItemDto[] = [];
  enquiryProposalsLoading = false;
  paymentSchedule: PaymentScheduleResponse | null = null;
  paymentScheduleLoading = false;
  paymentScheduleError = '';
  paymentScheduleMessage = '';
  paymentScheduleName = 'Default';
  paymentMilestonesDraft: PaymentMilestoneDraft[] = [];
  paymentSavingSchedule = false;
  paymentCreatingLinkMilestoneId: string | null = null;
  paymentGeneratingInvoiceMilestoneId: string | null = null;
  paymentSendingReminderMilestoneId: string | null = null;
  paymentHighlightedMilestoneId: string | null = null;
  paymentInitializingDefaults = false;
  enquirySustainability: EnquirySustainabilityResponse | null = null;
  sustainabilityDraft: EnquirySustainabilityRequest = this.createDefaultSustainabilityDraft();
  sustainabilityLoading = false;
  sustainabilitySaving = false;
  sustainabilityError = '';
  sustainabilityMessage = '';
  enquiryDocuments: EnquiryDocumentDto[] = [];
  enquiryDocumentsLoading = false;
  enquiryDocumentsError = '';
  documentCategoryFilter = 'All';
  documentUploadCategory = 'Other';
  documentPendingFile: File | null = null;
  documentDropActive = false;
  documentUploadBusy = false;
  documentUploadError = '';
  deletingDocumentId: string | null = null;
  generatingBeo = false;
  showRecordPaymentModal = false;
  recordingPaymentMilestoneId: string | null = null;
  paymentRecordBusy = false;
  paymentRecordError = '';
  private milestoneDraftCounter = 0;
  overviewEditingField: EditableOverviewField | null = null;
  overviewSaving = false;
  overviewSavedField: EditableOverviewField | null = null;
  overviewValidationErrors: Partial<Record<EditableOverviewField, string>> = {};
  overviewToastMessage = '';
  private overviewToastTimer: ReturnType<typeof setTimeout> | null = null;
  private overviewSavedFieldTimer: ReturnType<typeof setTimeout> | null = null;
  overviewDraft: EnquiryOverviewDraft = this.createEmptyOverviewDraft();
  venueSpaces: SpaceSummaryDto[] = [];
  loadingVenueSpaces = false;
  private loadedVenueSpacesVenueId: string | null = null;
  spaceAssignmentBusySpaceId: string | null = null;
  routingOptions: PortfolioRoutingOptionsResponse | null = null;
  routingOptionsLoading = false;
  routingOptionsError = '';
  selectedRoutingVenueId = '';
  routingTransferMessage = '';
  showTransferEnquiryModal = false;
  transferModalStep: 'form' | 'confirm' = 'form';
  transferModalTargetVenueId = '';
  transferModalReason = '';
  transferModalKeepCopy = true;
  transferModalSubmitting = false;
  transferModalError = '';
  eventStyleOptions = [
    'Meeting',
    '3-Course Dinner',
    'Buffet',
    'Reception/Standing',
    'BBQ',
    'Afternoon Tea',
    'Drinks Reception',
    'Custom'
  ];
  setupStyleOptions = [
    'Theatre',
    'Banquet',
    'Boardroom',
    'Cabaret',
    'Reception',
    'Classroom',
    'U-Shape',
    'Custom'
  ];
  sourceTypeOptions = [
    'Phone',
    'Email',
    'Website Form',
    'Social Media',
    'Referral',
    'Venue Event',
    'Returning Client'
  ];
  readonly sustainabilityCateringTypes = ['standard', 'vegetarian', 'vegan', 'buffet'];
  readonly sustainabilityEnergyRatings = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  showAddSubEventForm = false;
  creatingSubEvent = false;
  updatingSubEventIds = new Set<string>();
  deletingSubEventId: string | null = null;
  subEventTypeOptions = ['Ceremony', 'Reception', 'Dinner', 'After-Party', 'Meeting', 'Custom'];
  subEventStatusOptions = ['New', 'Tentative', 'OpenProposal', 'Provisional', 'Confirmed', 'Completed', 'Lost', 'Archived'];
  newSubEventDraft: SubEventDraft = this.createDefaultSubEventDraft();
  newSubEventError = '';
  newSubEventWarning = '';
  newSubEventCanOverrideConflict = false;
  newSubEventAvailability: SubEventAvailabilityState = { loading: false, isAvailable: true, warning: '', conflicts: [] };
  private newSubEventAvailabilityTimer: ReturnType<typeof setTimeout> | null = null;
  expandedSubEventIds = new Set<string>();
  subEventDrafts: Record<string, SubEventDraft> = {};
  subEventErrors: Record<string, string> = {};
  subEventWarnings: Record<string, string> = {};
  subEventCanOverrideConflict: Record<string, boolean> = {};
  subEventAvailability: Record<string, SubEventAvailabilityState> = {};
  private subEventAvailabilityTimers: Record<string, ReturnType<typeof setTimeout>> = {};
  showAppointmentForm = false;
  appointmentFormMode: 'create' | 'edit' = 'create';
  appointmentEditingId: string | null = null;
  appointmentSaving = false;
  appointmentError = '';
  appointmentConflictWarning = '';
  appointmentDraft: AppointmentDraft = this.createDefaultAppointmentDraft();
  selectedEnquiryIds = new Set<string>();
  selectingAllMatching = false;
  assignableUsers: UserSummaryDto[] = [];
  loadingAssignableUsers = false;
  bulkActionBusy = false;
  bulkActionFeedback = '';
  bulkProgressLabel = '';
  bulkProgressCompleted = 0;
  bulkProgressTotal = 0;
  pendingBulkAssignValue = '';
  pendingBulkStatusValue = '';
  bulkUndoState: BulkUndoState | null = null;
  private bulkUndoTimer: ReturnType<typeof setInterval> | null = null;
  showLostReasonModal = false;
  lostReasonModalMode: 'bulk' | 'single' = 'bulk';
  pendingSingleStatusTarget: string | null = null;
  bulkLostReason = '';
  bulkLostReasonDetail = '';
  bulkLostCompetitorName = '';
  bulkLostDate = '';
  showBulkEmailModal = false;
  bulkEmailRecipients: BulkEmailRecipient[] = [];
  loadingBulkEmailRecipients = false;
  sendingBulkEmail = false;
  bulkEmailSubject = '';
  bulkEmailBody = '';
  showMergeModal = false;
  loadingMergeModal = false;
  mergeSubmitting = false;
  mergeError = '';
  mergeResultMessage = '';
  mergePrimaryDetail: EnquiryDetailResponse | null = null;
  mergeSecondaryDetail: EnquiryDetailResponse | null = null;
  mergeFieldSources: Record<string, 'primary' | 'secondary'> = {};
  private pendingMergeIdsFromQuery: string[] = [];
  private loadedAssignableUsersVenueId: string | null = null;
  private lastLoadedVenueId: string | null = null;
  private recoveringVenueContext = false;
  private readonly pageSizeOptions = new Set([10, 25, 50, 100]);
  private readonly defaultLostReasonChoices = [
    'Price Too High',
    'Date Unavailable',
    'Chose Competitor',
    'Client Cancelled',
    'No Response',
    'Venue Not Suitable',
    'Budget Constraints',
    'Other'
  ];
  readonly documentCategories = [
    'Proposal',
    'Contract',
    'Invoice',
    'BEO',
    'Floor Plan',
    'Menu',
    'Correspondence',
    'Other'
  ];
  private readonly allowedDocumentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'csv'];
  private readonly maxDocumentBytes = 25 * 1024 * 1024;
  private lostReasonChoices: string[] = [];
  private loadedLostReasonsVenueId: string | null = null;
  private loadingLostReasons = false;
  readonly mergeFieldDefinitions: MergeFieldDefinition[] = [
    { key: 'contactFirstName', label: 'Contact First Name' },
    { key: 'contactLastName', label: 'Contact Last Name' },
    { key: 'contactEmail', label: 'Contact Email' },
    { key: 'contactPhoneNumberE164', label: 'Contact Phone' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'eventName', label: 'Event Name' },
    { key: 'eventType', label: 'Event Type' },
    { key: 'eventStartUtc', label: 'Event Date & Time' },
    { key: 'guestsExpected', label: 'Guests' },
    { key: 'eventStyle', label: 'Event Style' },
    { key: 'setupStyle', label: 'Setup Style' },
    { key: 'budgetMinAmount', label: 'Budget Min' },
    { key: 'budgetMaxAmount', label: 'Budget Max' },
    { key: 'sourceType', label: 'Lead Source' },
    { key: 'sourceDetail', label: 'Source Detail' },
    { key: 'specialRequirements', label: 'Special Requirements' },
    { key: 'internalNotes', label: 'Internal Notes' },
    { key: 'eventManagerUserId', label: 'Owner' }
  ];

  filtersForm = this.formBuilder.group({
    search: [''],
    quickFilter: [''],
    conversionScoreMin: [''],
    conversionScoreMax: [''],
    sort: [''],
    pageSize: [25]
  });

  paymentRecordForm = this.formBuilder.group({
    receivedDate: [''],
    amount: [0],
    method: ['Bank Transfer'],
    reference: [''],
    notes: [''],
    applyOverpaymentToNextMilestone: [true]
  });

  get venueId(): string | null {
    return this.auth.selectedVenueId;
  }

  get hasEnquiryFiltersApplied(): boolean {
    const filters = this.filtersForm.getRawValue();
    return Boolean(
      (filters.search ?? '').trim()
      || (filters.quickFilter ?? '').trim()
      || (this.sourceFilter ?? '').trim()
      || this.normalizeNumericQuery(filters.conversionScoreMin)
      || this.normalizeNumericQuery(filters.conversionScoreMax)
    );
  }

  get selectedCount(): number {
    return this.selectedEnquiryIds.size;
  }

  get allMatchingCount(): number {
    return this.listResponse?.page.totalCount ?? 0;
  }

  get canSelectAllMatching(): boolean {
    return this.allMatchingCount > this.selectedCount;
  }

  get hasBulkProgress(): boolean {
    return this.bulkProgressTotal > 0;
  }

  get bulkProgressPercent(): number {
    if (!this.bulkProgressTotal) {
      return 0;
    }
    return Math.min(100, Math.round((this.bulkProgressCompleted / this.bulkProgressTotal) * 100));
  }

  get canMergeSelected(): boolean {
    return this.selectedCount === 2 && !this.bulkActionBusy;
  }

  get bulkUndoSecondsRemaining(): number {
    return this.bulkUndoState?.secondsRemaining ?? 0;
  }

  get allVisibleSelected(): boolean {
    return this.enquiries.length > 0 && this.enquiries.every((enquiry) => this.selectedEnquiryIds.has(enquiry.id));
  }

  get partiallyVisibleSelected(): boolean {
    if (this.enquiries.length === 0) {
      return false;
    }

    const selectedVisible = this.enquiries.filter((enquiry) => this.selectedEnquiryIds.has(enquiry.id)).length;
    return selectedVisible > 0 && selectedVisible < this.enquiries.length;
  }

  get bulkStatusOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'New', label: 'New' },
      { value: 'Tentative', label: 'Tentative' },
      { value: 'OpenProposal', label: 'Open Proposal' },
      { value: 'Provisional', label: 'Provisional' },
      { value: 'Confirmed', label: 'Confirmed' },
      { value: 'Completed', label: 'Completed' },
      { value: 'Lost', label: 'Lost' },
      { value: 'Archived', label: 'Archived' }
    ];
  }

  get lostReasonOptions(): string[] {
    return this.lostReasonChoices.length > 0 ? this.lostReasonChoices : this.defaultLostReasonChoices;
  }

  get showLostCompetitorField(): boolean {
    return /competitor/i.test(this.bulkLostReason);
  }

  get canShowPaymentsTab(): boolean {
    if (!this.selectedEnquiry) {
      return false;
    }

    return this.selectedEnquiry.status === 'Provisional' || this.selectedEnquiry.status === 'Confirmed';
  }

  get selectedRoutingVenueOption(): PortfolioRoutingVenueOptionDto | null {
    if (!this.routingOptions || !this.selectedRoutingVenueId) {
      return null;
    }

    return this.routingOptions.venueOptions.find((option) => option.venueId === this.selectedRoutingVenueId) ?? null;
  }

  get hasCrossVenueRoutingOptions(): boolean {
    return (this.routingOptions?.venueOptions.length ?? 0) > 0;
  }

  get canTransferSelectedEnquiry(): boolean {
    const enquiryVenueId = this.selectedEnquiry?.venueId;
    if (!enquiryVenueId) {
      return false;
    }

    const venueRoles = this.auth.session?.venueRoles ?? [];
    return venueRoles.some((assignment) =>
      (assignment.venueId === enquiryVenueId && (assignment.role === 'SalesManager' || assignment.role === 'VenueAdmin'))
      || assignment.role === 'GroupAdmin');
  }

  get selectedTransferModalVenueOption(): PortfolioRoutingVenueOptionDto | null {
    if (!this.routingOptions || !this.transferModalTargetVenueId) {
      return null;
    }

    return this.routingOptions.venueOptions.find((option) => option.venueId === this.transferModalTargetVenueId) ?? null;
  }

  get paymentSummaryCurrency(): string {
    return this.paymentSchedule?.currencyCode || this.selectedEnquiry?.currencyCode || 'GBP';
  }

  get paymentMilestoneDraftTotal(): number {
    return this.roundMoney(this.paymentMilestonesDraft.reduce((sum, milestone) => sum + this.numberOrZero(milestone.amount), 0));
  }

  get paymentScheduleDeltaToProposal(): number {
    const proposalTotal = this.paymentSchedule?.proposalTotal ?? 0;
    return this.roundMoney(this.paymentMilestoneDraftTotal - proposalTotal);
  }

  get hasPaymentScheduleMismatch(): boolean {
    return Math.abs(this.paymentScheduleDeltaToProposal) >= 0.01;
  }

  get paymentProgressPercent(): number {
    return this.paymentSchedule?.paymentProgress.percent ?? 0;
  }

  get paymentProgressStatusToken(): string {
    return (this.paymentSchedule?.paymentProgress.statusColor ?? 'Green').toLowerCase();
  }

  get recordingPaymentMilestone(): PaymentMilestoneDto | null {
    return this.getScheduleMilestone(this.recordingPaymentMilestoneId ?? undefined);
  }

  get assignedSpaceIds(): string[] {
    if (!this.selectedEnquiry) {
      return [];
    }

    const allSpaceIds = this.selectedEnquiry.subEvents.flatMap((subEvent) => subEvent.spaceIds);
    return Array.from(new Set(allSpaceIds));
  }

  get managersForOverview(): UserSummaryDto[] {
    return this.assignableUsers;
  }

  get appointmentEnquiryOptions(): AppointmentEnquiryOption[] {
    const lookup = new Map<string, AppointmentEnquiryOption>();
    for (const enquiry of this.enquiries) {
      lookup.set(enquiry.id, {
        id: enquiry.id,
        label: `${enquiry.reference} · ${enquiry.contactName} · ${enquiry.eventType}`
      });
    }

    if (this.selectedEnquiry) {
      lookup.set(this.selectedEnquiry.id, {
        id: this.selectedEnquiry.id,
        label: `${this.selectedEnquiry.reference} · ${this.selectedEnquiry.contactFirstName} ${this.selectedEnquiry.contactLastName} · ${this.selectedEnquiry.eventName || this.selectedEnquiry.eventType}`
      });
    }

    return Array.from(lookup.values())
      .sort((left, right) => left.label.localeCompare(right.label, undefined, { sensitivity: 'base' }))
      .slice(0, 80);
  }

  get canSaveAppointment(): boolean {
    return !this.appointmentSaving
      && !!this.selectedEnquiry
      && !!this.appointmentDraft.title.trim()
      && !!this.appointmentDraft.type.trim()
      && !!this.appointmentDraft.date
      && !!this.appointmentDraft.startTime
      && this.appointmentDraft.durationMinutes > 0;
  }

  get filteredEnquiryDocuments(): EnquiryDocumentDto[] {
    const category = this.documentCategoryFilter.trim();
    if (!category || category.toLowerCase() === 'all') {
      return this.enquiryDocuments;
    }

    return this.enquiryDocuments.filter((document) => document.category === category);
  }

  get canGenerateBeo(): boolean {
    return this.selectedEnquiry?.status === 'Confirmed';
  }

  get bulkEmailToDisplay(): string {
    return this.bulkEmailRecipients.map((recipient) => recipient.email).join(', ');
  }

  get documentPendingFileLabel(): string {
    if (!this.documentPendingFile) {
      return '';
    }

    return `${this.documentPendingFile.name} (${this.humanFileSize(this.documentPendingFile.size)})`;
  }

  get sustainabilitySupplierShareTotal(): number {
    return this.roundMoney(
      this.numberOrZero(this.sustainabilityDraft.localSupplierSharePercent)
      + this.numberOrZero(this.sustainabilityDraft.regionalSupplierSharePercent)
      + this.numberOrZero(this.sustainabilityDraft.nationalSupplierSharePercent)
      + this.numberOrZero(this.sustainabilityDraft.internationalSupplierSharePercent)
    );
  }

  get sustainabilitySupplierShareDelta(): number {
    return this.roundMoney(this.sustainabilitySupplierShareTotal - 100);
  }

  sustainabilityGradeToken(grade: string | null | undefined): string {
    const normalized = (grade ?? '').trim().toLowerCase();
    if (normalized === 'a' || normalized === 'b' || normalized === 'c' || normalized === 'd' || normalized === 'e') {
      return normalized;
    }

    return 'n-a';
  }

  sustainabilityScoreToken(score: number | null | undefined): string {
    const resolved = this.numberOrZero(score);
    if (resolved >= 80) {
      return 'excellent';
    }

    if (resolved >= 65) {
      return 'strong';
    }

    if (resolved >= 50) {
      return 'watch';
    }

    return 'risk';
  }

  sustainabilityBenchmarkToken(deltaPercent: number | null | undefined): string {
    const resolved = this.numberOrZero(deltaPercent);
    if (Math.abs(resolved) < 0.1) {
      return 'neutral';
    }

    return resolved < 0 ? 'better' : 'worse';
  }

  conversionScoreValue(score: number | null | undefined): number {
    if (typeof score !== 'number' || !Number.isFinite(score)) {
      return 0;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  conversionScoreBandToken(scoreBand: string | null | undefined, score: number | null | undefined): 'hot' | 'warm' | 'watch' | 'cold' {
    const normalized = (scoreBand ?? '').trim().toLowerCase();
    if (normalized === 'hot' || normalized === 'warm' || normalized === 'watch' || normalized === 'cold') {
      return normalized;
    }

    const resolvedScore = this.conversionScoreValue(score);
    if (resolvedScore >= 80) {
      return 'hot';
    }

    if (resolvedScore >= 60) {
      return 'warm';
    }

    if (resolvedScore >= 40) {
      return 'watch';
    }

    return 'cold';
  }

  conversionTrendDirectionLabel(direction: string | null | undefined): string {
    const normalized = (direction ?? '').trim().toLowerCase();
    if (normalized === 'warming') {
      return 'Warming';
    }

    if (normalized === 'cooling') {
      return 'Cooling';
    }

    return 'Stable';
  }

  conversionTrendToken(direction: string | null | undefined): 'warming' | 'cooling' | 'stable' {
    const normalized = (direction ?? '').trim().toLowerCase();
    if (normalized === 'warming' || normalized === 'cooling') {
      return normalized;
    }

    return 'stable';
  }

  conversionTrendDeltaLabel(delta: number | null | undefined): string {
    if (typeof delta !== 'number' || !Number.isFinite(delta)) {
      return '0.0';
    }

    return `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}`;
  }

  followUpPriorityToken(priority: string | null | undefined): 'urgent' | 'high' | 'medium' | 'low' {
    const normalized = (priority ?? '').trim().toLowerCase();
    if (normalized === 'urgent' || normalized === 'high' || normalized === 'medium' || normalized === 'low') {
      return normalized;
    }

    return 'medium';
  }

  saveEnquirySustainability(): void {
    if (!this.selectedEnquiryId || this.sustainabilitySaving) {
      return;
    }

    const normalized = this.normalizeSustainabilityDraft(this.sustainabilityDraft);
    const supplierShareTotal = this.roundMoney(
      normalized.localSupplierSharePercent
      + normalized.regionalSupplierSharePercent
      + normalized.nationalSupplierSharePercent
      + normalized.internationalSupplierSharePercent
    );

    if (supplierShareTotal <= 0) {
      this.sustainabilityError = 'Supplier distribution requires at least one non-zero value.';
      this.sustainabilityMessage = '';
      return;
    }

    this.sustainabilityDraft = normalized;
    this.sustainabilitySaving = true;
    this.sustainabilityError = '';
    this.sustainabilityMessage = '';

    this.api.upsertEnquirySustainability(this.selectedEnquiryId, normalized)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.sustainabilitySaving = false;
          this.enquirySustainability = response;
          this.sustainabilityDraft = this.mapSustainabilityResponseToDraft(response);
          this.sustainabilityMessage = 'Sustainability profile saved.';
        },
        error: (error) => {
          this.sustainabilitySaving = false;
          this.sustainabilityError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to save sustainability profile.';
          this.sustainabilityMessage = '';
        }
      });
  }

  ngOnInit(): void {
    this.ensureActivityRealtimeSubscription();

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const previousSelectedEnquiryId = this.selectedEnquiryId;
      const enquiryId = params.get('enquiry');
      const requestedStatusTab = params.get('statusTab');
      const requestedDetailTab = params.get('tab');
      const requestedSearch = params.get('search') ?? '';
      const requestedQuickFilter = params.get('quickFilter') ?? '';
      const requestedSource = params.get('source') ?? '';
      const requestedConversionScoreMin = this.normalizeNumericQuery(params.get('conversionScoreMin'));
      const requestedConversionScoreMax = this.normalizeNumericQuery(params.get('conversionScoreMax'));
      const requestedSort = this.composeSortValue(
        params.get('sort'),
        params.get('sortBy'),
        params.get('sortDirection')
      );
      const requestedMilestone = params.get('milestone');
      const requestedMergeA = params.get('mergeA');
      const requestedMergeB = params.get('mergeB');
      const requestedPageSize = this.parsePageSize(params.get('pageSize'));
      let shouldReloadList = false;
      const previousTab = this.activeTab;

      if (requestedStatusTab && this.isValidStatusTab(requestedStatusTab) && requestedStatusTab !== this.activeTab) {
        this.activeTab = requestedStatusTab;
        this.clearBulkSelection();
        shouldReloadList = true;
      }

      if (!requestedStatusTab && this.activeTab !== 'new-unanswered') {
        this.activeTab = 'new-unanswered';
        this.clearBulkSelection();
        shouldReloadList = true;
      }

      const currentFilters = this.filtersForm.getRawValue();
      const currentPageSize = this.parsePageSize(String(currentFilters.pageSize ?? 25));
      if (
        (currentFilters.search ?? '') !== requestedSearch ||
        (currentFilters.quickFilter ?? '') !== requestedQuickFilter ||
        (currentFilters.conversionScoreMin ?? '') !== requestedConversionScoreMin ||
        (currentFilters.conversionScoreMax ?? '') !== requestedConversionScoreMax ||
        (currentFilters.sort ?? '') !== requestedSort ||
        currentPageSize !== requestedPageSize
      ) {
        this.filtersForm.patchValue(
          {
            search: requestedSearch,
            quickFilter: requestedQuickFilter,
            conversionScoreMin: requestedConversionScoreMin,
            conversionScoreMax: requestedConversionScoreMax,
            sort: requestedSort,
            pageSize: requestedPageSize
          },
          { emitEvent: false }
        );
        shouldReloadList = true;
      }

      if (this.sourceFilter !== requestedSource) {
        this.sourceFilter = requestedSource;
        shouldReloadList = true;
      }

      if (this.isValidDetailTab(requestedDetailTab) && requestedDetailTab !== this.detailTab) {
        this.detailTab = requestedDetailTab;
      }

      this.paymentHighlightedMilestoneId = requestedMilestone;

      if (requestedMergeA && requestedMergeB && requestedMergeA !== requestedMergeB) {
        this.pendingMergeIdsFromQuery = [requestedMergeA, requestedMergeB];
      }

      this.selectedEnquiryId = enquiryId;

      if (previousTab !== this.activeTab) {
        this.bulkActionFeedback = '';
      }

      if (shouldReloadList || !this.listResponse) {
        this.loadEnquiries(1);
        return;
      }

      if (enquiryId && enquiryId !== previousSelectedEnquiryId) {
        this.loadEnquiryDetail(enquiryId);
      }

      this.tryOpenMergeModalFromQuery();
    });

    this.filtersForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const filters = this.filtersForm.getRawValue();
      const trimmedSearch = (filters.search ?? '').trim();
      const quickFilter = filters.quickFilter ?? '';
      const conversionScoreMin = this.normalizeNumericQuery(filters.conversionScoreMin);
      const conversionScoreMax = this.normalizeNumericQuery(filters.conversionScoreMax);
      const sort = this.composeSortValue(filters.sort);
      const pageSize = this.parsePageSize(String(filters.pageSize ?? 25));

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          search: trimmedSearch || null,
          quickFilter: quickFilter || null,
          source: this.sourceFilter || null,
          conversionScoreMin: conversionScoreMin || null,
          conversionScoreMax: conversionScoreMax || null,
          sort: sort || null,
          pageSize: pageSize === 25 ? null : pageSize
        },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
      this.loadEnquiries(1);
    });

    this.auth.session$
      .pipe(
        map((session) => session?.venueId ?? null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((venueId) => {
        if (this.lastLoadedVenueId === venueId) {
          return;
        }

        this.lastLoadedVenueId = venueId;
        this.resetVenueScopedState();
        if (!venueId) {
          return;
        }

        const requestedEnquiryId = this.route.snapshot.queryParamMap.get('enquiry');
        if (requestedEnquiryId) {
          this.selectedEnquiryId = requestedEnquiryId;
        }

        this.loadEnquiries(1);
      });
  }

  setTab(tabKey: string): void {
    if (!this.isValidStatusTab(tabKey) || this.activeTab === tabKey) {
      return;
    }

    this.clearBulkSelection();
    this.bulkActionFeedback = '';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { statusTab: tabKey },
      queryParamsHandling: 'merge'
    });
  }

  openAddTask(): void {
    this.showAddTaskModal = true;
  }

  closeAddTaskModal(): void {
    this.showAddTaskModal = false;
  }

  onTaskQuickCreated(event: QuickTaskCreatedEvent): void {
    this.showAddTaskModal = false;
    this.bulkActionFeedback = 'Task created.';

    if (!this.selectedEnquiryId || this.selectedEnquiryId !== event.enquiryId) {
      return;
    }

    if (this.detailTab === 'tasks') {
      this.loadEnquiryDetail(this.selectedEnquiryId);
    }
  }

  createTestEnquiries(): void {
    const venueId = this.venueId;
    if (!venueId) {
      this.setTestDataFeedback('Select a venue before creating test enquiries.', 'error');
      return;
    }

    if (this.creatingTestEnquiries) {
      return;
    }

    this.creatingTestEnquiries = true;
    this.setTestDataFeedback('Creating 10 test enquiries...', 'info');
    this.bulkActionFeedback = '';

    this.api
      .generateTestEnquiries({
        venueId,
        count: 10
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.finishTestEnquiryCreation(response.created, 10 - response.created);
        },
        error: (error) => {
          if (error?.status === 404 || error?.status === 405) {
            this.createFallbackTestEnquiries(venueId);
            return;
          }

          this.creatingTestEnquiries = false;
          const message = typeof error?.error === 'string'
            ? error.error
            : (typeof error?.error?.message === 'string' ? error.error.message : 'Unable to create test enquiries.');
          this.bulkActionFeedback = message;
          this.setTestDataFeedback(message, 'error');
        }
      });
  }

  openWebsiteEnquiryPreview(): void {
    this.router.navigateByUrl('/website-enquiry');
  }

  private createFallbackTestEnquiries(venueId: string): void {
    const payloads = this.buildFallbackTestEnquiryPayloads(venueId, 10);
    let created = 0;
    let attempted = 0;

    this.setTestDataFeedback('Using fallback generator to create 10 test enquiries...', 'info');

    from(payloads)
      .pipe(
        concatMap((payload) =>
          this.api.createEnquiry(payload).pipe(
            map(() => true),
            catchError(() => of(false))
          )),
        tap((ok) => {
          attempted += 1;
          if (ok) {
            created += 1;
          }

          this.setTestDataFeedback(`Creating test enquiries... ${attempted}/10`, 'info');
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        complete: () => {
          this.finishTestEnquiryCreation(created, 10 - created);
        }
      });
  }

  private finishTestEnquiryCreation(created: number, failed: number): void {
    this.creatingTestEnquiries = false;

    if (created > 0 && failed === 0) {
      const message = `${created} test enquiries created.`;
      this.bulkActionFeedback = message;
      this.setTestDataFeedback(message, 'success');
      this.loadEnquiries(1);
      return;
    }

    if (created > 0) {
      const message = `${created} test enquiries created. ${failed} failed.`;
      this.bulkActionFeedback = message;
      this.setTestDataFeedback(message, 'error');
      this.loadEnquiries(1);
      return;
    }

    const message = 'Unable to create test enquiries.';
    this.bulkActionFeedback = message;
    this.setTestDataFeedback(message, 'error');
  }

  private setTestDataFeedback(message: string, type: 'info' | 'success' | 'error'): void {
    this.testDataFeedbackMessage = message;
    this.testDataFeedbackType = type;
  }

  private buildFallbackTestEnquiryPayloads(venueId: string, count: number): CreateEnquiryRequest[] {
    const eventTypes = ['Wedding', 'Corporate Meeting', 'Private Dining', 'Conference', 'Birthday Party'];
    const eventStyles = ['Meeting', '3-Course Dinner', 'Buffet', 'Reception/Standing', 'Drinks Reception'];
    const sourceTypes = ['Phone', 'Email', 'Website Form', 'Referral', 'Venue Event'];
    const firstNames = ['Emma', 'Oliver', 'Sophie', 'James', 'Charlotte', 'Liam', 'Amelia', 'Noah', 'Isla', 'George'];
    const lastNames = ['Taylor', 'Wilson', 'Hughes', 'Patel', 'Edwards', 'Thompson', 'Davies', 'Roberts', 'Carter', 'Morgan'];
    const now = new Date();

    return Array.from({ length: count }, (_, index) => {
      const eventStart = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 7 + index * 3,
        12,
        0,
        0,
        0
      ));
      const eventEnd = new Date(eventStart.getTime() + 5 * 60 * 60 * 1000);
      const uniqueToken = `${Date.now()}${index}`;
      const firstName = firstNames[index % firstNames.length];
      const lastName = lastNames[(index + 3) % lastNames.length];
      const guestsExpected = 40 + index * 12;
      const budgetMin = Math.round(guestsExpected * 35);
      const budgetMax = Math.round(guestsExpected * 95);

      return {
        venueId,
        contactFirstName: firstName,
        contactLastName: lastName,
        contactEmail: `test.${uniqueToken}@creventaflow.local`,
        contactPhoneNumberE164: `+4477009${(10000 + index).toString().padStart(5, '0')}`,
        secondaryContactName: undefined,
        secondaryEmail: undefined,
        secondaryPhoneNumberE164: undefined,
        companyName: `Test Company ${index + 1}`,
        marketingConsent: index % 2 === 0,
        eventType: eventTypes[index % eventTypes.length],
        eventName: `Test Event ${index + 1}`,
        eventStartUtc: eventStart.toISOString(),
        eventEndUtc: eventEnd.toISOString(),
        hasFlexibleDates: index % 4 === 0,
        flexibleDateNotes: index % 4 === 0 ? 'Flexible by one week either side.' : undefined,
        guestsExpected,
        eventStyle: eventStyles[index % eventStyles.length],
        setupStyle: 'Banquet',
        budgetMinAmount: budgetMin,
        budgetMaxAmount: budgetMax,
        currencyCode: 'GBP',
        sourceType: sourceTypes[index % sourceTypes.length],
        sourceDetail: undefined,
        leadQuality: (index % 5) + 1,
        specialRequirements: index % 3 === 0 ? 'Vegetarian options requested.' : undefined,
        internalNotes: 'Generated via Enquiries fallback test data action.',
        eventManagerUserId: undefined
      };
    });
  }

  loadEnquiries(page: number): void {
    const venueId = this.venueId;
    if (!venueId) {
      const fallbackVenueId = this.auth.session?.venueRoles[0]?.venueId ?? null;
      if (fallbackVenueId) {
        this.auth.setSelectedVenue(fallbackVenueId);
        return;
      }

      this.loading = false;
      this.enquiries = [];
      this.listResponse = null;
      this.selectedEnquiry = null;
      this.enquiryLoadError = 'Select a venue to view enquiries.';
      return;
    }

    const tenantId = this.auth.session?.tenantId;
    if (tenantId) {
      void this.activityRealtime.ensureConnected(tenantId, venueId);
    }

    this.ensureAssignableUsersLoaded(venueId);
    this.ensureLostReasonsLoaded(venueId);
    this.loading = true;
    this.enquiryLoadError = '';
    const filters = this.filtersForm.getRawValue();
    const { sortBy, sortDirection } = this.parseSort(filters.sort);

    this.api
      .getEnquiries({
        venueId,
        statusTab: this.activeTab,
        period: 'this-month',
        quickFilter: filters.quickFilter || undefined,
        search: filters.search || undefined,
        source: this.sourceFilter || undefined,
        conversionScoreMin: this.parseOptionalNumber(filters.conversionScoreMin),
        conversionScoreMax: this.parseOptionalNumber(filters.conversionScoreMax),
        sortBy,
        sortDirection,
        page,
        pageSize: Number(filters.pageSize) || 25
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.recoveringVenueContext = false;
          this.enquiryLoadError = '';
          this.listResponse = response;
          this.enquiries = response.page.items;
          this.syncBulkSelectionToVisibleRows();

          if (!this.selectedEnquiryId && this.enquiries.length > 0) {
            this.selectEnquiry(this.enquiries[0].id);
          }

          if (this.selectedEnquiryId) {
            this.loadEnquiryDetail(this.selectedEnquiryId);
          }

          this.tryOpenMergeModalFromQuery();
        },
        error: (error) => {
          if ((error?.status === 403 || error?.status === 404) && !this.recoveringVenueContext) {
            const fallbackVenueId = this.auth.session?.venueRoles.find((role) => role.venueId !== venueId)?.venueId;
            if (fallbackVenueId) {
              this.recoveringVenueContext = true;
              this.auth.setSelectedVenue(fallbackVenueId);
              return;
            }

            this.recoveringVenueContext = true;
            this.api
              .getVenues()
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({
                next: (venues) => {
                  const fallbackFromLiveVenues =
                    venues.find((venue) => venue.id !== venueId)?.id
                    ?? venues[0]?.id
                    ?? null;

                  if (fallbackFromLiveVenues && fallbackFromLiveVenues !== venueId) {
                    this.auth.setSelectedVenue(fallbackFromLiveVenues);
                    return;
                  }

                  this.recoveringVenueContext = false;
                  this.loading = false;
                  this.enquiries = [];
                  this.listResponse = null;
                  this.selectedEnquiry = null;
                  this.enquiryLoadError = this.resolveEnquiryListError(error);
                },
                error: () => {
                  this.recoveringVenueContext = false;
                  this.loading = false;
                  this.enquiries = [];
                  this.listResponse = null;
                  this.selectedEnquiry = null;
                  this.enquiryLoadError = this.resolveEnquiryListError(error);
                }
              });
            return;
          }

          this.recoveringVenueContext = false;
          this.loading = false;
          this.enquiries = [];
          this.listResponse = null;
          this.selectedEnquiry = null;
          this.enquiryLoadError = this.resolveEnquiryListError(error);
        }
      });
  }

  clearEnquiryFilters(): void {
    this.filtersForm.patchValue(
      {
        search: '',
        quickFilter: '',
        conversionScoreMin: '',
        conversionScoreMax: '',
        sort: '',
        pageSize: 25
      },
      { emitEvent: false }
    );
    this.sourceFilter = '';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: null,
        quickFilter: null,
        source: null,
        conversionScoreMin: null,
        conversionScoreMax: null,
        sort: null,
        pageSize: null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });

    this.loadEnquiries(1);
  }

  selectEnquiry(enquiryId: string): void {
    this.selectedEnquiryId = enquiryId;
    this.sameDateAvailabilityExpanded = true;
    this.resetEnquiryActivityState();
    this.enquiryProposals = [];
    this.enquiryProposalsLoading = false;
    this.paymentSchedule = null;
    this.paymentScheduleError = '';
    this.paymentScheduleMessage = '';
    this.paymentMilestonesDraft = [];
    this.enquiryDocuments = [];
    this.enquiryDocumentsLoading = false;
    this.enquiryDocumentsError = '';
    this.enquirySustainability = null;
    this.sustainabilityDraft = this.createDefaultSustainabilityDraft();
    this.sustainabilityLoading = false;
    this.sustainabilitySaving = false;
    this.sustainabilityError = '';
    this.sustainabilityMessage = '';
    this.documentPendingFile = null;
    this.documentUploadError = '';
    this.documentUploadBusy = false;
    this.documentCategoryFilter = 'All';
    this.documentUploadCategory = 'Other';
    this.aiFollowUpRecommendations = [];
    this.aiFollowUpRecommendationsLoading = true;
    this.aiFollowUpRecommendationsMessage = '';
    this.aiFollowUpExecutionInProgressKey = null;
    this.aiFollowUpExecutionError = '';
    this.aiFollowUpExecutionMessage = '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { enquiry: enquiryId },
      queryParamsHandling: 'merge'
    });
    this.loadEnquiryDetail(enquiryId);
  }

  changeDetailTab(tab: 'overview' | 'events' | 'appointments' | 'tasks' | 'proposals' | 'payments' | 'sustainability' | 'documents' | 'activity'): void {
    if (tab === 'payments' && !this.canShowPaymentsTab) {
      return;
    }

    this.detailTab = tab;
    if (tab === 'proposals' && this.selectedEnquiryId) {
      this.loadEnquiryProposals(this.selectedEnquiryId);
    }
    if (tab === 'payments' && this.selectedEnquiryId) {
      this.loadPaymentSchedule(this.selectedEnquiryId, true);
    }
    if (tab === 'sustainability' && this.selectedEnquiryId) {
      this.loadEnquirySustainability(this.selectedEnquiryId);
    }
    if (tab === 'activity' && this.selectedEnquiryId) {
      this.loadEnquiryActivity(true);
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab === 'overview' ? null : tab },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  toggleSameDateAvailability(): void {
    this.sameDateAvailabilityExpanded = !this.sameDateAvailabilityExpanded;
  }

  onActivityFiltersChanged(): void {
    if (this.detailTab !== 'activity' || !this.selectedEnquiryId) {
      return;
    }

    this.loadEnquiryActivity(true);
  }

  onActivityFeedScroll(event: Event): void {
    if (!this.selectedEnquiryId || this.detailTab !== 'activity' || !this.activityHasMore || this.activityLoadingMore || this.activityLoading) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }

    const threshold = 120;
    const remaining = target.scrollHeight - (target.scrollTop + target.clientHeight);
    if (remaining <= threshold) {
      this.loadEnquiryActivity(false);
    }
  }

  activityUserInitials(entry: ActivityFeedEntryDto): string {
    const name = (entry.userName ?? '').trim();
    if (!name) {
      return 'SY';
    }

    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  changeStatus(targetStatus: string): void {
    if (!this.selectedEnquiryId) {
      return;
    }

    if (targetStatus === 'Lost') {
      this.openLostReasonModal('single', targetStatus);
      return;
    }

    this.api
      .transitionEnquiryStatus(this.selectedEnquiryId, { targetStatus })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.showGeneratedTasksToast(response);
          this.loadEnquiryDetail(this.selectedEnquiryId!);
          this.loadEnquiries(this.listResponse?.page.page ?? 1);
        }
      });
  }

  statusToken(status: string | null | undefined): string {
    const normalized = (status ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    if (normalized === 'openproposal') {
      return 'open-proposal';
    }

    return normalized;
  }

  startOverviewEdit(field: EditableOverviewField): void {
    if (!this.selectedEnquiry || this.overviewSaving) {
      return;
    }

    this.overviewEditingField = field;
    this.clearOverviewSavedState();
    this.overviewValidationErrors[field] = '';
  }

  cancelOverviewEdit(field: EditableOverviewField): void {
    if (this.overviewEditingField === field) {
      this.overviewEditingField = null;
    }

    this.overviewValidationErrors[field] = '';
    if (this.selectedEnquiry) {
      this.populateOverviewDraft(this.selectedEnquiry);
    }
  }

  onOverviewFieldKeydown(field: EditableOverviewField, event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelOverviewEdit(field);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveOverviewField(field);
    }
  }

  saveOverviewField(field: EditableOverviewField): void {
    if (!this.selectedEnquiryId || !this.selectedEnquiry || this.overviewSaving) {
      return;
    }

    this.overviewValidationErrors[field] = '';
    const error = this.validateOverviewField(field);
    if (error) {
      this.overviewValidationErrors[field] = error;
      return;
    }

    const payload = this.buildUpdateEnquiryPayload();
    const previousDetail = { ...this.selectedEnquiry };
    const previousListItem = this.enquiries.find((item) => item.id === this.selectedEnquiryId);
    const previousListItemSnapshot = previousListItem ? { ...previousListItem } : null;
    const optimisticDetail = this.buildOptimisticEnquiryDetail(previousDetail);

    this.selectedEnquiry = optimisticDetail;
    this.populateOverviewDraft(optimisticDetail);
    this.updateEnquiryListWithOptimisticDetail(optimisticDetail);
    this.overviewEditingField = null;
    this.overviewSaving = true;

    this.api
      .updateEnquiry(this.selectedEnquiryId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.overviewSaving = false;
          this.markOverviewFieldSaved(field);
          this.showOverviewToast('Saved');
          this.loadEnquiryDetail(this.selectedEnquiryId!);
          this.loadEnquiries(this.listResponse?.page.page ?? 1);
        },
        error: (errorResponse) => {
          this.overviewSaving = false;
          this.selectedEnquiry = previousDetail;
          this.populateOverviewDraft(previousDetail);
          if (previousListItemSnapshot) {
            this.enquiries = this.enquiries.map((item) => (item.id === previousListItemSnapshot.id ? previousListItemSnapshot : item));
          }
          this.overviewEditingField = field;
          const message = typeof errorResponse?.error === 'string'
            ? errorResponse.error
            : 'Unable to save change.';
          this.overviewValidationErrors[field] = message;
          this.showOverviewToast('Unable to save change');
        }
      });
  }

  overviewFieldError(field: EditableOverviewField): string {
    return this.overviewValidationErrors[field] ?? '';
  }

  isOverviewEditing(field: EditableOverviewField): boolean {
    return this.overviewEditingField === field;
  }

  isOverviewFieldSaved(field: EditableOverviewField): boolean {
    return this.overviewSavedField === field;
  }

  showSpaceBookButton(spaceId: string, isAvailable: boolean): boolean {
    return !this.isSpaceAssigned(spaceId) && isAvailable;
  }

  isSpaceAssigned(spaceId: string): boolean {
    return this.assignedSpaceIds.includes(spaceId);
  }

  bookSpace(spaceId: string): void {
    if (!this.selectedEnquiryId || this.spaceAssignmentBusySpaceId) {
      return;
    }

    this.spaceAssignmentBusySpaceId = spaceId;
    this.api.assignEnquirySpace(this.selectedEnquiryId, spaceId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.spaceAssignmentBusySpaceId = null;
          this.showOverviewToast('Space booked');
          this.loadEnquiryDetail(this.selectedEnquiryId!);
          this.loadEnquiries(this.listResponse?.page.page ?? 1);
        },
        error: () => {
          this.spaceAssignmentBusySpaceId = null;
          this.showOverviewToast('Unable to book space');
        }
      });
  }

  unassignSpace(spaceId: string): void {
    if (!this.selectedEnquiryId || this.spaceAssignmentBusySpaceId) {
      return;
    }

    this.spaceAssignmentBusySpaceId = spaceId;
    this.api.unassignEnquirySpace(this.selectedEnquiryId, spaceId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.spaceAssignmentBusySpaceId = null;
          this.showOverviewToast('Space unassigned');
          this.loadEnquiryDetail(this.selectedEnquiryId!);
          this.loadEnquiries(this.listResponse?.page.page ?? 1);
        },
        error: () => {
          this.spaceAssignmentBusySpaceId = null;
          this.showOverviewToast('Unable to unassign space');
        }
      });
  }

  onRoutingVenueSelected(venueId: string): void {
    this.selectedRoutingVenueId = venueId;
    this.routingTransferMessage = '';
  }

  openTransferEnquiryModal(): void {
    if (!this.selectedEnquiryId || !this.hasCrossVenueRoutingOptions || !this.canTransferSelectedEnquiry) {
      return;
    }

    this.transferModalTargetVenueId = this.selectedRoutingVenueId || this.routingOptions?.venueOptions[0]?.venueId || '';
    this.transferModalReason = '';
    this.transferModalKeepCopy = true;
    this.transferModalError = '';
    this.transferModalSubmitting = false;
    this.transferModalStep = 'form';
    this.showTransferEnquiryModal = true;
  }

  closeTransferEnquiryModal(): void {
    if (this.transferModalSubmitting) {
      return;
    }

    this.showTransferEnquiryModal = false;
    this.transferModalError = '';
    this.transferModalSubmitting = false;
    this.transferModalStep = 'form';
  }

  continueTransferEnquiryModal(): void {
    if (!this.transferModalTargetVenueId) {
      this.transferModalError = 'Please choose a target venue.';
      return;
    }

    this.transferModalError = '';
    this.transferModalStep = 'confirm';
  }

  editTransferEnquiryModal(): void {
    if (this.transferModalSubmitting) {
      return;
    }

    this.transferModalError = '';
    this.transferModalStep = 'form';
  }

  confirmTransferEnquiryModal(): void {
    if (!this.selectedEnquiryId || !this.transferModalTargetVenueId || this.transferModalSubmitting) {
      return;
    }

    this.transferModalSubmitting = true;
    this.transferModalError = '';
    this.routingTransferMessage = '';

    this.api
      .transferEnquiryToVenue(this.selectedEnquiryId, {
        targetVenueId: this.transferModalTargetVenueId,
        reason: this.transferModalReason.trim() || undefined,
        keepCopy: this.transferModalKeepCopy
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.transferModalSubmitting = false;
          this.showTransferEnquiryModal = false;
          this.transferModalStep = 'form';

          const targetEnquiryId = response.targetEnquiryId || response.enquiryId;
          const targetReference = response.targetEnquiryReference || response.enquiryReference;
          this.routingTransferMessage = `Transferred to ${response.targetVenueName} (${targetReference}).`;
          this.showOverviewToast(`Transferred to ${response.targetVenueName}`);

          const canAccessTargetVenue = (this.auth.session?.venueRoles ?? [])
            .some((role) => role.venueId === response.targetVenueId);

          if (canAccessTargetVenue) {
            this.auth.setSelectedVenue(response.targetVenueId);
            this.router.navigate(['/enquiries'], {
              queryParams: { statusTab: 'all', enquiry: targetEnquiryId }
            });
            return;
          }

          this.loadEnquiries(1);
          if (this.selectedEnquiryId) {
            this.loadEnquiryDetail(this.selectedEnquiryId);
          }
        },
        error: (error) => {
          this.transferModalSubmitting = false;
          this.transferModalError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to transfer this enquiry.';
        }
      });
  }

  openCreateAppointmentForm(): void {
    if (!this.selectedEnquiry) {
      return;
    }

    const baseDate = this.toDateOnly(this.selectedEnquiry.eventStartUtc);
    this.appointmentFormMode = 'create';
    this.appointmentEditingId = null;
    this.appointmentSaving = false;
    this.appointmentError = '';
    this.appointmentConflictWarning = '';
    this.appointmentDraft = this.createDefaultAppointmentDraft(this.selectedEnquiry);
    this.appointmentDraft.date = baseDate;
    this.appointmentDraft.relatedEnquiryIds = [this.selectedEnquiry.id];
    this.showAppointmentForm = true;
  }

  editAppointment(appointment: { id: string }): void {
    if (!this.selectedEnquiry?.venueId || !appointment?.id) {
      return;
    }

    this.appointmentFormMode = 'edit';
    this.appointmentEditingId = appointment.id;
    this.appointmentSaving = false;
    this.appointmentError = '';
    this.appointmentConflictWarning = '';
    this.showAppointmentForm = true;

    this.api.getAppointment(appointment.id, this.selectedEnquiry.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.appointmentDraft = this.mapAppointmentToDraft(detail);
        },
        error: () => {
          this.showAppointmentForm = false;
          this.appointmentEditingId = null;
          this.appointmentError = '';
          this.appointmentConflictWarning = '';
          this.showOverviewToast('Unable to load appointment');
        }
      });
  }

  cancelAppointmentForm(): void {
    this.showAppointmentForm = false;
    this.appointmentFormMode = 'create';
    this.appointmentEditingId = null;
    this.appointmentSaving = false;
    this.appointmentError = '';
    this.appointmentConflictWarning = '';
    this.appointmentDraft = this.createDefaultAppointmentDraft(this.selectedEnquiry ?? undefined);
  }

  submitAppointmentForm(allowConflictOverride = false): void {
    if (!this.selectedEnquiry?.venueId || !this.canSaveAppointment || this.appointmentSaving) {
      return;
    }

    const startDate = this.combineDateAndTimeToDate(this.appointmentDraft.date, this.appointmentDraft.startTime);
    const startUtc = startDate.toISOString();

    const payload = {
      venueId: this.selectedEnquiry.venueId,
      title: this.appointmentDraft.title.trim(),
      type: this.appointmentDraft.type.trim(),
      startUtc,
      durationMinutes: Math.max(15, Math.floor(this.appointmentDraft.durationMinutes || 60)),
      spaceId: this.appointmentDraft.spaceId || null,
      attendees: this.appointmentDraft.attendees.trim() || null,
      relatedEnquiryIds: this.appointmentDraft.relatedEnquiryIds.filter((id) => !!id),
      assignedToUserId: this.appointmentDraft.assignedToUserId || null,
      notes: this.appointmentDraft.notes.trim() || null,
      status: this.appointmentDraft.status,
      allowConflictOverride
    } as const;

    this.appointmentSaving = true;
    this.appointmentError = '';
    this.appointmentConflictWarning = '';

    const request$ = this.appointmentFormMode === 'edit' && this.appointmentEditingId
      ? this.api.updateAppointment(this.appointmentEditingId, payload)
      : this.api.createAppointment(payload);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const mode = this.appointmentFormMode;
          const enquiryId = this.selectedEnquiryId;
          this.cancelAppointmentForm();
          if (enquiryId) {
            this.loadEnquiryDetail(enquiryId);
          }
          this.showOverviewToast(mode === 'edit' ? 'Appointment updated' : 'Appointment created');
        },
        error: (errorResponse) => {
          this.appointmentSaving = false;
          const message = typeof errorResponse?.error?.message === 'string'
            ? errorResponse.error.message
            : 'Unable to save appointment.';
          this.appointmentError = message;
          if (errorResponse?.status === 409) {
            this.appointmentConflictWarning = 'This appointment conflicts with an existing booking.';
          }
        }
      });
  }

  deleteAppointment(appointmentId: string): void {
    if (!this.selectedEnquiry?.venueId || !appointmentId || this.appointmentSaving) {
      return;
    }

    const confirmed = window.confirm('Delete this appointment?');
    if (!confirmed) {
      return;
    }

    this.appointmentSaving = true;
    this.appointmentError = '';
    this.appointmentConflictWarning = '';

    this.api.deleteAppointment(appointmentId, this.selectedEnquiry.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.appointmentSaving = false;
          if (this.selectedEnquiryId) {
            this.loadEnquiryDetail(this.selectedEnquiryId);
          }
          this.showOverviewToast('Appointment deleted');
        },
        error: () => {
          this.appointmentSaving = false;
          this.appointmentError = 'Unable to delete appointment.';
        }
      });
  }

  toggleAppointmentRelatedEnquiry(enquiryId: string): void {
    const selected = new Set(this.appointmentDraft.relatedEnquiryIds);
    if (selected.has(enquiryId)) {
      selected.delete(enquiryId);
    } else {
      selected.add(enquiryId);
    }

    this.appointmentDraft.relatedEnquiryIds = Array.from(selected);
  }

  isAppointmentRelatedEnquirySelected(enquiryId: string): boolean {
    return this.appointmentDraft.relatedEnquiryIds.includes(enquiryId);
  }

  get timelineSubEvents(): SubEventDto[] {
    if (!this.selectedEnquiry) {
      return [];
    }

    return [...this.selectedEnquiry.subEvents].sort(
      (left, right) => new Date(left.startUtc).getTime() - new Date(right.startUtc).getTime()
    );
  }

  get subEventTotalGuests(): number {
    return this.timelineSubEvents.reduce((total, subEvent) => total + Math.max(0, subEvent.guestCount || 0), 0);
  }

  get subEventUniqueSpaceCount(): number {
    const uniqueSpaceIds = new Set<string>();
    for (const subEvent of this.timelineSubEvents) {
      for (const spaceId of subEvent.spaceIds) {
        uniqueSpaceIds.add(spaceId);
      }
    }

    return uniqueSpaceIds.size;
  }

  get subEventTotalDurationHours(): number {
    const totalMinutes = this.timelineSubEvents.reduce((total, subEvent) => {
      const start = new Date(subEvent.startUtc).getTime();
      const end = new Date(subEvent.endUtc).getTime();
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
        return total;
      }

      return total + Math.round((end - start) / (1000 * 60));
    }, 0);

    return totalMinutes / 60;
  }

  get subEventSpaceUtilisation(): Array<{ spaceId: string; spaceName: string; minutes: number; percent: number }> {
    const minutesBySpace = new Map<string, number>();
    for (const subEvent of this.timelineSubEvents) {
      const start = new Date(subEvent.startUtc).getTime();
      const end = new Date(subEvent.endUtc).getTime();
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
        continue;
      }

      const durationMinutes = Math.round((end - start) / (1000 * 60));
      for (const spaceId of subEvent.spaceIds) {
        minutesBySpace.set(spaceId, (minutesBySpace.get(spaceId) ?? 0) + durationMinutes);
      }
    }

    const timelineWindowMinutes = 17 * 60; // 06:00-23:00 timeline baseline.
    return Array.from(minutesBySpace.entries())
      .map(([spaceId, minutes]) => {
        const spaceName = this.venueSpaces.find((space) => space.id === spaceId)?.name ?? 'Unassigned';
        const percent = timelineWindowMinutes > 0 ? Math.min(100, (minutes / timelineWindowMinutes) * 100) : 0;
        return { spaceId, spaceName, minutes, percent };
      })
      .sort((left, right) => right.minutes - left.minutes);
  }

  getSubEventSpaceName(subEvent: SubEventDto): string {
    if (subEvent.spaceIds.length === 0) {
      return 'Unassigned';
    }

    const names = subEvent.spaceIds
      .map((spaceId) => this.venueSpaces.find((space) => space.id === spaceId)?.name)
      .filter((name): name is string => !!name);

    if (names.length === 0) {
      return 'Assigned space';
    }

    return names.join(', ');
  }

  toggleAddSubEventForm(): void {
    this.showAddSubEventForm = !this.showAddSubEventForm;
    this.newSubEventError = '';
    this.newSubEventWarning = '';
    this.newSubEventCanOverrideConflict = false;
    this.newSubEventAvailability = { loading: false, isAvailable: true, warning: '', conflicts: [] };

    if (this.showAddSubEventForm) {
      this.newSubEventDraft = this.createDefaultSubEventDraft(this.selectedEnquiry ?? undefined);
      this.scheduleSubEventAvailabilityCheck(this.newSubEventDraft, null);
    }
  }

  cancelAddSubEvent(): void {
    this.showAddSubEventForm = false;
    this.newSubEventError = '';
    this.newSubEventWarning = '';
    this.newSubEventCanOverrideConflict = false;
    this.newSubEventAvailability = { loading: false, isAvailable: true, warning: '', conflicts: [] };
    this.newSubEventDraft = this.createDefaultSubEventDraft(this.selectedEnquiry ?? undefined);
  }

  createSubEvent(allowConflictOverride = false): void {
    if (!this.selectedEnquiryId || !this.selectedEnquiry || this.creatingSubEvent) {
      return;
    }

    if (allowConflictOverride) {
      const proceed = window.confirm('This sub-event overlaps with existing bookings. Save anyway and override conflict warnings?');
      if (!proceed) {
        return;
      }
    }

    this.newSubEventError = '';
    this.newSubEventCanOverrideConflict = false;
    this.newSubEventWarning = this.buildLocalSubEventOverlapWarning(this.newSubEventDraft, undefined);

    const validationError = this.validateSubEventDraft(this.newSubEventDraft, undefined);
    if (validationError) {
      this.newSubEventError = validationError;
      return;
    }

    const payload = this.buildSubEventPayload(this.newSubEventDraft, this.selectedEnquiry.currencyCode, allowConflictOverride);
    this.creatingSubEvent = true;

    this.api.createSubEvent(this.selectedEnquiryId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.creatingSubEvent = false;
          this.showAddSubEventForm = false;
          this.newSubEventDraft = this.createDefaultSubEventDraft(this.selectedEnquiry ?? undefined);
          this.newSubEventCanOverrideConflict = false;
          this.newSubEventAvailability = { loading: false, isAvailable: true, warning: '', conflicts: [] };
          this.showOverviewToast('Sub-event added');
          this.loadEnquiryDetail(this.selectedEnquiryId!);
          this.loadEnquiries(this.listResponse?.page.page ?? 1);
        },
        error: (errorResponse) => {
          this.creatingSubEvent = false;
          const { message, warning, canOverride, conflicts } = this.resolveSubEventApiError(errorResponse);
          this.newSubEventError = message;
          this.newSubEventWarning = warning;
          this.newSubEventCanOverrideConflict = canOverride;
          this.newSubEventAvailability = {
            loading: false,
            isAvailable: conflicts.length === 0,
            warning,
            conflicts
          };
        }
      });
  }

  isSubEventExpanded(subEventId: string): boolean {
    return this.expandedSubEventIds.has(subEventId);
  }

  toggleSubEventExpanded(subEvent: SubEventDto): void {
    const next = new Set(this.expandedSubEventIds);
    if (next.has(subEvent.id)) {
      next.delete(subEvent.id);
      delete this.subEventDrafts[subEvent.id];
      delete this.subEventErrors[subEvent.id];
      delete this.subEventWarnings[subEvent.id];
      delete this.subEventCanOverrideConflict[subEvent.id];
      delete this.subEventAvailability[subEvent.id];
      if (this.subEventAvailabilityTimers[subEvent.id]) {
        clearTimeout(this.subEventAvailabilityTimers[subEvent.id]);
        delete this.subEventAvailabilityTimers[subEvent.id];
      }
    } else {
      next.add(subEvent.id);
      this.subEventDrafts[subEvent.id] = this.mapSubEventToDraft(subEvent);
      this.subEventErrors[subEvent.id] = '';
      this.subEventWarnings[subEvent.id] = '';
      this.subEventCanOverrideConflict[subEvent.id] = false;
      this.subEventAvailability[subEvent.id] = { loading: false, isAvailable: true, warning: '', conflicts: [] };
      this.scheduleSubEventAvailabilityCheck(this.subEventDrafts[subEvent.id], subEvent.id);
    }

    this.expandedSubEventIds = next;
  }

  subEventDraft(subEventId: string): SubEventDraft {
    if (!this.subEventDrafts[subEventId]) {
      const source = this.selectedEnquiry?.subEvents.find((subEvent) => subEvent.id === subEventId);
      this.subEventDrafts[subEventId] = source ? this.mapSubEventToDraft(source) : this.createDefaultSubEventDraft(this.selectedEnquiry ?? undefined);
    }

    return this.subEventDrafts[subEventId];
  }

  saveSubEvent(subEvent: SubEventDto): void {
    this.saveSubEventWithConflictPolicy(subEvent, false);
  }

  saveSubEventWithConflictPolicy(subEvent: SubEventDto, allowConflictOverride: boolean): void {
    if (!this.selectedEnquiryId || !this.selectedEnquiry) {
      return;
    }

    if (allowConflictOverride) {
      const proceed = window.confirm(`"${subEvent.name}" conflicts with existing bookings. Save anyway?`);
      if (!proceed) {
        return;
      }
    }

    const draft = this.subEventDraft(subEvent.id);
    this.subEventErrors[subEvent.id] = '';
    this.subEventCanOverrideConflict[subEvent.id] = false;
    this.subEventWarnings[subEvent.id] = this.buildLocalSubEventOverlapWarning(draft, subEvent.id);

    const validationError = this.validateSubEventDraft(draft, subEvent.id);
    if (validationError) {
      this.subEventErrors[subEvent.id] = validationError;
      return;
    }

    const payload = this.buildSubEventPayload(draft, this.selectedEnquiry.currencyCode, allowConflictOverride);
    this.updatingSubEventIds = new Set(this.updatingSubEventIds).add(subEvent.id);

    this.api.updateSubEvent(this.selectedEnquiryId, subEvent.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const nextUpdating = new Set(this.updatingSubEventIds);
          nextUpdating.delete(subEvent.id);
          this.updatingSubEventIds = nextUpdating;
          this.showOverviewToast('Sub-event updated');
          this.loadEnquiryDetail(this.selectedEnquiryId!);
          this.loadEnquiries(this.listResponse?.page.page ?? 1);
        },
        error: (errorResponse) => {
          const nextUpdating = new Set(this.updatingSubEventIds);
          nextUpdating.delete(subEvent.id);
          this.updatingSubEventIds = nextUpdating;
          const { message, warning, canOverride, conflicts } = this.resolveSubEventApiError(errorResponse);
          this.subEventErrors[subEvent.id] = message;
          this.subEventWarnings[subEvent.id] = warning;
          this.subEventCanOverrideConflict[subEvent.id] = canOverride;
          this.subEventAvailability[subEvent.id] = {
            loading: false,
            isAvailable: conflicts.length === 0,
            warning,
            conflicts
          };
        }
      });
  }

  cancelSubEventEdit(subEvent: SubEventDto): void {
    this.subEventDrafts[subEvent.id] = this.mapSubEventToDraft(subEvent);
    this.subEventErrors[subEvent.id] = '';
    this.subEventWarnings[subEvent.id] = '';
    this.subEventCanOverrideConflict[subEvent.id] = false;
    this.subEventAvailability[subEvent.id] = { loading: false, isAvailable: true, warning: '', conflicts: [] };
    this.scheduleSubEventAvailabilityCheck(this.subEventDrafts[subEvent.id], subEvent.id);
  }

  deleteSubEvent(subEvent: SubEventDto): void {
    if (!this.selectedEnquiryId || this.deletingSubEventId) {
      return;
    }

    const confirmed = window.confirm(`Delete sub-event "${subEvent.name}"?`);
    if (!confirmed) {
      return;
    }

    this.deletingSubEventId = subEvent.id;
    this.api.deleteSubEvent(this.selectedEnquiryId, subEvent.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deletingSubEventId = null;
          const nextExpanded = new Set(this.expandedSubEventIds);
          nextExpanded.delete(subEvent.id);
          this.expandedSubEventIds = nextExpanded;
          delete this.subEventDrafts[subEvent.id];
          delete this.subEventErrors[subEvent.id];
          delete this.subEventWarnings[subEvent.id];
          delete this.subEventCanOverrideConflict[subEvent.id];
          delete this.subEventAvailability[subEvent.id];
          this.showOverviewToast('Sub-event deleted');
          this.loadEnquiryDetail(this.selectedEnquiryId!);
          this.loadEnquiries(this.listResponse?.page.page ?? 1);
        },
        error: () => {
          this.deletingSubEventId = null;
          this.showOverviewToast('Unable to delete sub-event');
        }
      });
  }

  updateNewSubEventDraft(patch: Partial<SubEventDraft>, triggerAvailability = false): void {
    this.newSubEventDraft = { ...this.newSubEventDraft, ...patch };
    this.newSubEventError = '';
    this.newSubEventCanOverrideConflict = false;
    if (triggerAvailability) {
      this.scheduleSubEventAvailabilityCheck(this.newSubEventDraft, null);
    }
  }

  updateSubEventDraftField(subEventId: string, patch: Partial<SubEventDraft>, triggerAvailability = false): void {
    const next = { ...this.subEventDraft(subEventId), ...patch };
    this.subEventDrafts[subEventId] = next;
    this.subEventErrors[subEventId] = '';
    this.subEventCanOverrideConflict[subEventId] = false;
    if (triggerAvailability) {
      this.scheduleSubEventAvailabilityCheck(next, subEventId);
    }
  }

  setupStylesForDraft(draft: SubEventDraft): string[] {
    const selectedSpace = this.venueSpaces.find((space) => space.id === draft.spaceId);
    if (!selectedSpace || selectedSpace.capacityBySetup.length === 0) {
      return this.setupStyleOptions;
    }

    const fromSpace = selectedSpace.capacityBySetup.map((entry) => entry.setupStyle).filter((value) => !!value?.trim());
    const merged = Array.from(new Set([...fromSpace, ...this.setupStyleOptions]));
    return merged.sort((left, right) => left.localeCompare(right));
  }

  subEventAvailabilityWarning(subEventId?: string): string {
    if (!subEventId) {
      return this.newSubEventAvailability.warning;
    }

    return this.subEventAvailability[subEventId]?.warning || '';
  }

  subEventAvailabilityIsChecking(subEventId?: string): boolean {
    if (!subEventId) {
      return this.newSubEventAvailability.loading;
    }

    return !!this.subEventAvailability[subEventId]?.loading;
  }

  subEventAvailabilityIsAvailable(subEventId?: string): boolean {
    if (!subEventId) {
      return this.newSubEventAvailability.isAvailable;
    }

    return this.subEventAvailability[subEventId]?.isAvailable ?? true;
  }

  onSubEventTimelineHandleChange(subEvent: SubEventDto, boundary: 'start' | 'end', value: number): void {
    const draft = { ...this.subEventDraft(subEvent.id) };
    const clampedMinutes = Math.min(23 * 60, Math.max(6 * 60, Math.round(this.numberOrZero(value))));
    const hours = Math.floor(clampedMinutes / 60);
    const minutes = clampedMinutes % 60;
    const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    if (boundary === 'start') {
      draft.startTime = formatted;
    } else {
      draft.endTime = formatted;
    }

    if (draft.endTime <= draft.startTime) {
      if (boundary === 'start') {
        const startTotal = hours * 60 + minutes;
        const endTotal = Math.min(23 * 60, startTotal + 30);
        draft.endTime = `${String(Math.floor(endTotal / 60)).padStart(2, '0')}:${String(endTotal % 60).padStart(2, '0')}`;
      } else {
        const endTotal = hours * 60 + minutes;
        const startTotal = Math.max(6 * 60, endTotal - 30);
        draft.startTime = `${String(Math.floor(startTotal / 60)).padStart(2, '0')}:${String(startTotal % 60).padStart(2, '0')}`;
      }
    }

    this.subEventDrafts[subEvent.id] = draft;
    if (!this.expandedSubEventIds.has(subEvent.id)) {
      this.expandedSubEventIds = new Set(this.expandedSubEventIds).add(subEvent.id);
    }

    this.scheduleSubEventAvailabilityCheck(draft, subEvent.id);
  }

  subEventTimelineLeftPercent(subEvent: SubEventDto): number {
    const source = this.subEventDrafts[subEvent.id] ?? this.mapSubEventToDraft(subEvent);
    const minutes = this.timeToMinutes(source.startTime);
    return this.timelinePercentForMinutes(minutes);
  }

  subEventTimelineWidthPercent(subEvent: SubEventDto): number {
    const source = this.subEventDrafts[subEvent.id] ?? this.mapSubEventToDraft(subEvent);
    const startMinutes = this.timeToMinutes(source.startTime);
    const endMinutes = this.timeToMinutes(source.endTime);
    const timelineStart = 6 * 60;
    const timelineEnd = 23 * 60;
    const clampedStart = Math.min(timelineEnd, Math.max(timelineStart, startMinutes));
    const clampedEnd = Math.min(timelineEnd, Math.max(timelineStart, endMinutes));
    const window = Math.max(1, timelineEnd - timelineStart);
    const width = Math.max(2, ((Math.max(clampedEnd, clampedStart + 1) - clampedStart) / window) * 100);
    return Math.min(100, width);
  }

  subEventDraftStartMinutes(subEventId: string): number {
    return this.timeToMinutes(this.subEventDraft(subEventId).startTime);
  }

  subEventDraftEndMinutes(subEventId: string): number {
    return this.timeToMinutes(this.subEventDraft(subEventId).endTime);
  }

  private buildUpdateEnquiryPayload(): UpdateEnquiryRequest {
    const sourceEnquiry = this.selectedEnquiry!;
    const { contactFirstName, contactLastName } = this.splitDraftContactName(sourceEnquiry);
    const eventStartUtc = this.combineDraftDateAndTimeToUtc(this.overviewDraft.eventDate, this.overviewDraft.startTime);

    return {
      eventType: sourceEnquiry.eventType,
      eventName: this.overviewDraft.eventName.trim() || null,
      eventStartUtc,
      eventEndUtc: sourceEnquiry.eventEndUtc ?? null,
      hasFlexibleDates: this.overviewDraft.hasFlexibleDates,
      flexibleDateNotes: this.overviewDraft.flexibleDateNotes.trim() || null,
      guestsExpected: Math.max(1, Math.round(this.numberOrZero(this.overviewDraft.guestsExpected))),
      guestsConfirmed: sourceEnquiry.guestsConfirmed ?? null,
      eventStyle: this.overviewDraft.eventStyle || null,
      setupStyle: this.overviewDraft.setupStyle || null,
      budgetMinAmount: this.parseNullableMoney(this.overviewDraft.budgetMinAmount),
      budgetMaxAmount: this.parseNullableMoney(this.overviewDraft.budgetMaxAmount),
      currencyCode: sourceEnquiry.currencyCode,
      sourceType: this.overviewDraft.sourceType || sourceEnquiry.sourceType,
      sourceDetail: this.overviewDraft.sourceDetail.trim() || null,
      leadQuality: Math.min(5, Math.max(1, Math.round(this.numberOrZero(this.overviewDraft.leadQuality)))),
      specialRequirements: this.overviewDraft.specialRequirements.trim() || null,
      internalNotes: sourceEnquiry.internalNotes ?? null,
      eventManagerUserId: this.overviewDraft.eventManagerUserId || null,
      contactFirstName,
      contactLastName,
      contactEmail: this.overviewDraft.contactEmail.trim(),
      contactPhoneNumberE164: this.overviewDraft.contactPhoneNumberE164.trim(),
      companyName: this.overviewDraft.companyName.trim() || null,
      marketingConsent: this.overviewDraft.marketingConsent
    };
  }

  private validateOverviewField(field: EditableOverviewField): string | null {
    const draft = this.overviewDraft;
    const guestCount = Math.round(this.numberOrZero(draft.guestsExpected));
    const contactName = this.normalizeWhitespace(draft.contactName);

    if ((field === 'eventDate' || field === 'startTime') && !this.isFutureDateTime(draft.eventDate, draft.startTime)) {
      return 'Date and start time must be in the future.';
    }

    if (field === 'contactName' && !contactName) {
      return 'Contact name is required.';
    }

    if (field === 'eventName' && !this.normalizeWhitespace(draft.eventName)) {
      return 'Event name is required.';
    }

    if (field === 'guestsExpected') {
      if (!Number.isInteger(guestCount) || guestCount <= 0) {
        return 'Guest count must be a positive integer.';
      }

      const capacity = this.calculateAssignedSpaceCapacity(draft.setupStyle);
      if (capacity > 0 && guestCount > capacity) {
        return `Guest count exceeds assigned space capacity (${capacity}).`;
      }
    }

    if (field === 'contactPhoneNumberE164' && !this.isValidE164Phone(draft.contactPhoneNumberE164)) {
      return 'Phone must be in E.164 format, e.g. +447700900123.';
    }

    if (field === 'contactEmail' && !this.isValidEmail(draft.contactEmail)) {
      return 'Enter a valid email address.';
    }

    if (field === 'leadQuality') {
      const leadQuality = Math.round(this.numberOrZero(draft.leadQuality));
      if (!Number.isInteger(leadQuality) || leadQuality < 1 || leadQuality > 5) {
        return 'Lead quality must be between 1 and 5.';
      }
    }

    if ((field === 'budgetMinAmount' || field === 'budgetMaxAmount')
      && this.parseNullableMoney(draft.budgetMinAmount) !== null
      && this.parseNullableMoney(draft.budgetMaxAmount) !== null
      && (this.parseNullableMoney(draft.budgetMinAmount) ?? 0) > (this.parseNullableMoney(draft.budgetMaxAmount) ?? 0))
    {
      return 'Budget minimum cannot be greater than budget maximum.';
    }

    return null;
  }

  private buildOptimisticEnquiryDetail(source: EnquiryDetailResponse): EnquiryDetailResponse {
    const { contactFirstName, contactLastName } = this.splitDraftContactName(source);
    const eventManagerUserId = this.overviewDraft.eventManagerUserId.trim();
    const eventManagerName = eventManagerUserId
      ? this.managerNameFromId(eventManagerUserId) ?? source.eventManagerName
      : null;

    return {
      ...source,
      contactFirstName,
      contactLastName,
      contactEmail: this.overviewDraft.contactEmail.trim(),
      contactPhoneNumberE164: this.overviewDraft.contactPhoneNumberE164.trim(),
      companyName: this.normalizeNullableText(this.overviewDraft.companyName),
      eventName: this.normalizeNullableText(this.overviewDraft.eventName),
      eventStartUtc: this.combineDraftDateAndTimeToUtc(this.overviewDraft.eventDate, this.overviewDraft.startTime),
      hasFlexibleDates: this.overviewDraft.hasFlexibleDates,
      flexibleDateNotes: this.normalizeNullableText(this.overviewDraft.flexibleDateNotes),
      guestsExpected: Math.max(1, Math.round(this.numberOrZero(this.overviewDraft.guestsExpected))),
      eventStyle: this.normalizeNullableText(this.overviewDraft.eventStyle),
      setupStyle: this.normalizeNullableText(this.overviewDraft.setupStyle),
      budgetMinAmount: this.parseNullableMoney(this.overviewDraft.budgetMinAmount),
      budgetMaxAmount: this.parseNullableMoney(this.overviewDraft.budgetMaxAmount),
      sourceType: this.overviewDraft.sourceType || source.sourceType,
      sourceDetail: this.normalizeNullableText(this.overviewDraft.sourceDetail),
      leadQuality: Math.min(5, Math.max(1, Math.round(this.numberOrZero(this.overviewDraft.leadQuality)))),
      specialRequirements: this.normalizeNullableText(this.overviewDraft.specialRequirements),
      eventManagerUserId: eventManagerUserId || null,
      eventManagerName,
      marketingConsent: this.overviewDraft.marketingConsent
    };
  }

  private updateEnquiryListWithOptimisticDetail(detail: EnquiryDetailResponse): void {
    const contactName = `${detail.contactFirstName} ${detail.contactLastName}`.trim();
    this.enquiries = this.enquiries.map((item) => {
      if (item.id !== detail.id) {
        return item;
      }

      return {
        ...item,
        contactName,
        eventStyle: detail.eventStyle,
        eventStartUtc: detail.eventStartUtc,
        guestsExpected: detail.guestsExpected,
        eventManagerName: detail.eventManagerName,
        sourceType: detail.sourceType
      };
    });
  }

  private splitDraftContactName(source: EnquiryDetailResponse): { contactFirstName: string; contactLastName: string } {
    const normalized = this.normalizeWhitespace(this.overviewDraft.contactName);
    if (!normalized) {
      return {
        contactFirstName: source.contactFirstName,
        contactLastName: source.contactLastName
      };
    }

    const segments = normalized.split(' ');
    const contactFirstName = segments.shift() ?? source.contactFirstName;
    const contactLastName = segments.join(' ').trim() || source.contactLastName;
    return { contactFirstName, contactLastName };
  }

  private managerNameFromId(userId: string): string | null {
    const match = this.managersForOverview.find((manager) => manager.id === userId);
    return match ? `${match.firstName} ${match.lastName}`.trim() : null;
  }

  private normalizeWhitespace(value: string | null | undefined): string {
    return (value ?? '').trim().replace(/\s+/g, ' ');
  }

  private normalizeNullableText(value: string | null | undefined): string | null {
    const normalized = this.normalizeWhitespace(value ?? '');
    return normalized || null;
  }

  private calculateAssignedSpaceCapacity(setupStyle: string): number {
    if (this.assignedSpaceIds.length === 0 || this.venueSpaces.length === 0) {
      return 0;
    }

    const normalizedSetupStyle = (setupStyle || '').trim().toLowerCase();
    let total = 0;
    this.assignedSpaceIds.forEach((spaceId) => {
      const space = this.venueSpaces.find((candidate) => candidate.id === spaceId);
      if (!space || space.capacityBySetup.length === 0) {
        return;
      }

      const exact = space.capacityBySetup.find((capacity) => capacity.setupStyle.trim().toLowerCase() === normalizedSetupStyle);
      total += exact?.capacity ?? Math.max(...space.capacityBySetup.map((capacity) => capacity.capacity));
    });
    return total;
  }

  private isFutureDateTime(dateValue: string, timeValue: string): boolean {
    const candidate = new Date(`${dateValue}T${timeValue || '00:00'}:00`);
    if (Number.isNaN(candidate.getTime())) {
      return false;
    }

    return candidate.getTime() > Date.now();
  }

  private isValidE164Phone(value: string): boolean {
    return /^\+[1-9]\d{7,15}$/.test((value || '').trim());
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value || '').trim());
  }

  private parseNullableMoney(value: string): number | null {
    const parsed = this.roundMoney(this.numberOrZero(value));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null;
    }
    return parsed;
  }

  private combineDraftDateAndTimeToUtc(dateValue: string, timeValue: string): string {
    const candidate = new Date(`${dateValue}T${timeValue || '00:00'}:00`);
    return Number.isNaN(candidate.getTime()) ? new Date().toISOString() : candidate.toISOString();
  }

  private populateOverviewDraft(enquiry: EnquiryDetailResponse): void {
    const eventDate = this.toDateOnly(enquiry.eventStartUtc);
    const localTime = new Date(enquiry.eventStartUtc);
    const hours = String(localTime.getHours()).padStart(2, '0');
    const minutes = String(localTime.getMinutes()).padStart(2, '0');
    this.overviewDraft = {
      contactName: `${enquiry.contactFirstName} ${enquiry.contactLastName}`.trim(),
      eventName: enquiry.eventName ?? '',
      eventDate,
      startTime: `${hours}:${minutes}`,
      guestsExpected: enquiry.guestsExpected,
      eventStyle: enquiry.eventStyle ?? '',
      setupStyle: enquiry.setupStyle ?? '',
      eventManagerUserId: enquiry.eventManagerUserId ?? '',
      leadQuality: enquiry.leadQuality,
      sourceType: enquiry.sourceType,
      sourceDetail: enquiry.sourceDetail ?? '',
      contactPhoneNumberE164: enquiry.contactPhoneNumberE164 ?? '',
      contactEmail: enquiry.contactEmail ?? '',
      companyName: enquiry.companyName ?? '',
      budgetMinAmount: enquiry.budgetMinAmount?.toString() ?? '',
      budgetMaxAmount: enquiry.budgetMaxAmount?.toString() ?? '',
      specialRequirements: enquiry.specialRequirements ?? '',
      hasFlexibleDates: enquiry.hasFlexibleDates,
      flexibleDateNotes: enquiry.flexibleDateNotes ?? '',
      marketingConsent: enquiry.marketingConsent
    };
  }

  private showOverviewToast(message: string): void {
    this.overviewToastMessage = message;
    if (this.overviewToastTimer) {
      clearTimeout(this.overviewToastTimer);
    }

    this.overviewToastTimer = setTimeout(() => {
      this.overviewToastMessage = '';
      this.overviewToastTimer = null;
    }, 1800);
  }

  private markOverviewFieldSaved(field: EditableOverviewField): void {
    this.overviewSavedField = field;
    if (this.overviewSavedFieldTimer) {
      clearTimeout(this.overviewSavedFieldTimer);
    }

    this.overviewSavedFieldTimer = setTimeout(() => {
      this.overviewSavedField = null;
      this.overviewSavedFieldTimer = null;
    }, 1400);
  }

  private clearOverviewSavedState(field?: EditableOverviewField): void {
    if (!field || this.overviewSavedField === field) {
      this.overviewSavedField = null;
    }

    if (this.overviewSavedFieldTimer) {
      clearTimeout(this.overviewSavedFieldTimer);
      this.overviewSavedFieldTimer = null;
    }
  }

  private isValidStatusTab(tabKey: string): boolean {
    return this.statusTabs.some((tab) => tab.key === tabKey);
  }

  isEnquirySelected(enquiryId: string): boolean {
    return this.selectedEnquiryIds.has(enquiryId);
  }

  toggleSelectAll(checked: boolean): void {
    if (!checked) {
      this.clearBulkSelection();
      return;
    }

    this.selectedEnquiryIds = new Set(this.enquiries.map((enquiry) => enquiry.id));
    this.bulkActionFeedback = '';
    this.clearBulkUndoState();
  }

  toggleEnquirySelection(enquiryId: string, checked: boolean): void {
    const next = new Set(this.selectedEnquiryIds);
    if (checked) {
      next.add(enquiryId);
    } else {
      next.delete(enquiryId);
    }

    this.selectedEnquiryIds = next;
    this.bulkActionFeedback = '';
  }

  clearBulkSelection(): void {
    this.selectedEnquiryIds = new Set<string>();
    this.pendingBulkAssignValue = '';
    this.pendingBulkStatusValue = '';
    this.bulkProgressLabel = '';
    this.bulkProgressCompleted = 0;
    this.bulkProgressTotal = 0;
    this.mergeResultMessage = '';
  }

  undoLastBulkAction(): void {
    const undoState = this.bulkUndoState;
    if (!undoState || this.bulkActionBusy) {
      return;
    }

    this.bulkActionBusy = true;
    this.bulkActionFeedback = `Undoing ${undoState.actionLabel}...`;

    this.api
      .bulkUndoEnquiries({
        undoToken: undoState.token
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.bulkActionBusy = false;
          this.clearBulkUndoState();
          const failed = result.failed.length;
          this.bulkActionFeedback = failed === 0
            ? `Undo complete for ${result.succeeded} enquir${result.succeeded === 1 ? 'y' : 'ies'}.`
            : `Undo restored ${result.succeeded}/${result.requested} enquir${result.requested === 1 ? 'y' : 'ies'}. ${failed} failed.`;

          this.clearBulkSelection();
          this.loadEnquiries(this.listResponse?.page.page ?? 1);
          if (this.selectedEnquiryId) {
            this.loadEnquiryDetail(this.selectedEnquiryId);
          }
        },
        error: (error) => {
          this.bulkActionBusy = false;
          this.clearBulkUndoState();
          this.bulkActionFeedback =
            typeof error?.error?.error === 'string' ? error.error.error : 'Unable to undo the last bulk action.';
        }
      });
  }

  openMergeModalForSelected(): void {
    if (!this.canMergeSelected || this.showMergeModal || this.loadingMergeModal) {
      return;
    }

    const selected = Array.from(this.selectedEnquiryIds);
    if (selected.length !== 2) {
      return;
    }

    this.openMergeModalForIds(selected[0], selected[1], false);
  }

  closeMergeModal(): void {
    if (this.mergeSubmitting) {
      return;
    }

    this.showMergeModal = false;
    this.loadingMergeModal = false;
    this.mergeError = '';
    this.mergePrimaryDetail = null;
    this.mergeSecondaryDetail = null;
    this.mergeFieldSources = {};
    this.pendingMergeIdsFromQuery = [];
    this.clearMergeQueryParams();
  }

  chooseMergeFieldSource(fieldKey: string, source: 'primary' | 'secondary'): void {
    this.mergeFieldSources = {
      ...this.mergeFieldSources,
      [fieldKey]: source
    };
  }

  mergeFieldSelectedSource(fieldKey: string): 'primary' | 'secondary' {
    return this.mergeFieldSources[fieldKey] ?? 'primary';
  }

  mergeFieldPreviewValue(
    enquiry: EnquiryDetailResponse | null,
    fieldKey: string): string
  {
    if (!enquiry) {
      return 'Not available';
    }

    switch (fieldKey) {
      case 'contactFirstName':
        return enquiry.contactFirstName || 'Not set';
      case 'contactLastName':
        return enquiry.contactLastName || 'Not set';
      case 'contactEmail':
        return enquiry.contactEmail || 'Not set';
      case 'contactPhoneNumberE164':
        return enquiry.contactPhoneNumberE164 || 'Not set';
      case 'companyName':
        return enquiry.companyName || 'Not set';
      case 'eventName':
        return enquiry.eventName || enquiry.eventType || 'Not set';
      case 'eventType':
        return enquiry.eventType || 'Not set';
      case 'eventStartUtc':
        return this.toDateTimeLocalInput(enquiry.eventStartUtc).replace('T', ' ');
      case 'guestsExpected':
        return `${enquiry.guestsExpected ?? 0}`;
      case 'eventStyle':
        return enquiry.eventStyle || 'Not set';
      case 'setupStyle':
        return enquiry.setupStyle || 'Not set';
      case 'budgetMinAmount':
        return enquiry.budgetMinAmount != null
          ? `${this.roundMoney(enquiry.budgetMinAmount).toFixed(2)} ${enquiry.currencyCode}`
          : 'Not set';
      case 'budgetMaxAmount':
        return enquiry.budgetMaxAmount != null
          ? `${this.roundMoney(enquiry.budgetMaxAmount).toFixed(2)} ${enquiry.currencyCode}`
          : 'Not set';
      case 'sourceType':
        return enquiry.sourceType || 'Not set';
      case 'sourceDetail':
        return enquiry.sourceDetail || 'Not set';
      case 'specialRequirements':
        return enquiry.specialRequirements || 'Not set';
      case 'internalNotes':
        return enquiry.internalNotes || 'Not set';
      case 'eventManagerUserId':
        return enquiry.eventManagerName || 'Unassigned';
      default:
        return 'Not set';
    }
  }

  submitMerge(): void {
    if (!this.mergePrimaryDetail || !this.mergeSecondaryDetail || this.mergeSubmitting) {
      return;
    }

    this.mergeSubmitting = true;
    this.mergeError = '';

    this.api
      .mergeEnquiries({
        primaryEnquiryId: this.mergePrimaryDetail.id,
        secondaryEnquiryId: this.mergeSecondaryDetail.id,
        fieldSources: this.mergeFieldSources,
        archiveSecondary: true
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: MergeEnquiriesResponse) => {
          this.mergeSubmitting = false;
          this.showMergeModal = false;
          this.mergeResultMessage =
            `Merged ${result.secondaryReference} into ${result.primaryReference}. `
            + `${result.movedSubEvents} sub-event(s), ${result.movedProposals} proposal(s), `
            + `${result.movedPaymentSchedules} payment schedule(s), ${result.movedCommunications} communication(s), `
            + `${result.movedTasks} task(s), ${result.movedDocuments} document(s), ${result.movedAppointments} appointment link(s) moved.`;

          this.clearMergeQueryParams();
          this.clearBulkSelection();
          this.selectedEnquiryId = result.primaryEnquiryId;
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              enquiry: result.primaryEnquiryId
            },
            queryParamsHandling: 'merge',
            replaceUrl: true
          });

          this.loadEnquiries(this.listResponse?.page.page ?? 1);
          this.loadEnquiryDetail(result.primaryEnquiryId);
        },
        error: (error) => {
          this.mergeSubmitting = false;
          this.mergeError =
            typeof error?.error?.error === 'string' ? error.error.error : 'Unable to merge enquiries right now.';
        }
      });
  }

  selectAllMatchingEnquiries(): void {
    const venueId = this.venueId;
    if (!venueId || this.selectingAllMatching || this.bulkActionBusy) {
      return;
    }

    const filters = this.filtersForm.getRawValue();
    this.selectingAllMatching = true;
    this.bulkActionFeedback = '';

    this.api
      .getEnquirySelection({
        venueId,
        statusTab: this.activeTab,
        quickFilter: filters.quickFilter || undefined,
        search: filters.search || undefined,
        source: this.sourceFilter || undefined
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: EnquirySelectionResponse) => {
          this.selectingAllMatching = false;
          this.selectedEnquiryIds = new Set(response.enquiryIds);
          this.clearBulkUndoState();
          if (response.isTruncated) {
            this.bulkActionFeedback = `Selected ${response.enquiryIds.length} of ${response.totalCount} matching enquiries (selection limit reached).`;
          } else {
            this.bulkActionFeedback = `Selected all ${response.totalCount} matching enquiries.`;
          }
        },
        error: () => {
          this.selectingAllMatching = false;
          this.bulkActionFeedback = 'Unable to select all matching enquiries.';
        }
      });
  }

  applyBulkAssign(targetValue: string): void {
    this.pendingBulkAssignValue = targetValue;
    if (!targetValue || this.selectedCount === 0 || this.bulkActionBusy) {
      return;
    }

    const eventManagerUserId = targetValue === 'unassigned' ? null : targetValue;
    this.bulkActionBusy = true;
    this.bulkActionFeedback = '';
    this.clearBulkUndoState();
    this.startBulkProgress('Assigning owners', this.selectedCount);

    this.api
      .bulkAssignEnquiries({
        enquiryIds: Array.from(this.selectedEnquiryIds),
        eventManagerUserId
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.pendingBulkAssignValue = '';
          this.completeBulkProgress(result.requested);
          this.handleBulkActionResult('assigned', result);
        },
        error: (error) => {
          this.bulkActionBusy = false;
          this.pendingBulkAssignValue = '';
          this.completeBulkProgress(this.bulkProgressCompleted);
          this.bulkActionFeedback =
            typeof error?.error?.error === 'string' ? error.error.error : 'Bulk assignment failed. Please try again.';
        }
      });
  }

  applyBulkStatus(targetStatus: string): void {
    this.pendingBulkStatusValue = targetStatus;
    if (!targetStatus || this.selectedCount === 0 || this.bulkActionBusy) {
      return;
    }

    if (targetStatus === 'Lost') {
      this.openLostReasonModal('bulk', targetStatus);
      return;
    }

    this.executeBulkStatusTransition(targetStatus);
  }

  confirmBulkArchive(): void {
    if (this.selectedCount === 0 || this.bulkActionBusy) {
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to archive ${this.selectedCount} enquiries?`);
    if (!confirmed) {
      return;
    }

    this.bulkActionBusy = true;
    this.bulkActionFeedback = '';
    this.clearBulkUndoState();
    this.startBulkProgress('Archiving enquiries', this.selectedCount);

    this.api
      .bulkArchiveEnquiries({
        enquiryIds: Array.from(this.selectedEnquiryIds)
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.completeBulkProgress(result.requested);
          this.handleBulkActionResult('archived', result);
        },
        error: (error) => {
          this.bulkActionBusy = false;
          this.completeBulkProgress(this.bulkProgressCompleted);
          this.bulkActionFeedback =
            typeof error?.error?.error === 'string' ? error.error.error : 'Bulk archive failed. Please try again.';
        }
      });
  }

  cancelLostReasonModal(): void {
    this.showLostReasonModal = false;
    this.lostReasonModalMode = 'bulk';
    this.pendingSingleStatusTarget = null;
    this.pendingBulkStatusValue = '';
    this.bulkLostReason = '';
    this.bulkLostReasonDetail = '';
    this.bulkLostCompetitorName = '';
    this.bulkLostDate = '';
  }

  confirmLostStatusTransition(): void {
    if (!this.bulkLostReason.trim()) {
      this.bulkActionFeedback = 'Lost reason is required when moving enquiries to Lost.';
      return;
    }

    const lostAtUtc = this.toLostDateUtcIso(this.bulkLostDate);
    const lostReasonDetail = this.composeLostReasonDetail();
    this.showLostReasonModal = false;
    if (this.lostReasonModalMode === 'single') {
      if (!this.selectedEnquiryId || this.pendingSingleStatusTarget !== 'Lost') {
        this.cancelLostReasonModal();
        return;
      }

      this.api
        .transitionEnquiryStatus(this.selectedEnquiryId, {
          targetStatus: 'Lost',
          lostReason: this.bulkLostReason.trim(),
          lostReasonDetail,
          lostAtUtc
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.showGeneratedTasksToast(response);
            this.cancelLostReasonModal();
            this.loadEnquiryDetail(this.selectedEnquiryId!);
            this.loadEnquiries(this.listResponse?.page.page ?? 1);
          },
          error: () => {
            this.bulkActionFeedback = 'Unable to move enquiry to Lost. Please try again.';
            this.cancelLostReasonModal();
          }
        });
      return;
    }

    this.executeBulkStatusTransition('Lost', this.bulkLostReason.trim(), lostReasonDetail, lostAtUtc);
  }

  private showGeneratedTasksToast(response?: TransitionEnquiryStatusResponse | null): void {
    const generatedTaskCount = Number(response?.generatedTaskCount ?? 0);
    if (!Number.isFinite(generatedTaskCount) || generatedTaskCount <= 0) {
      return;
    }

    const statusLabel = this.toStatusLabel(response?.status ?? '');
    this.showOverviewToast(
      `${generatedTaskCount} task${generatedTaskCount === 1 ? '' : 's'} created from ${statusLabel} template.`
    );
  }

  private toStatusLabel(status: string): string {
    const normalized = (status ?? '').trim().toLowerCase();
    switch (normalized) {
      case 'openproposal':
        return 'Open Proposal';
      case 'provisional':
        return 'Provisional';
      case 'confirmed':
        return 'Confirmed';
      case 'tentative':
        return 'Tentative';
      case 'new':
        return 'New';
      case 'completed':
        return 'Completed';
      case 'lost':
        return 'Lost';
      case 'archived':
        return 'Archived';
      default:
        return status || 'status';
    }
  }

  private openLostReasonModal(mode: 'bulk' | 'single', targetStatus: string): void {
    if (targetStatus !== 'Lost') {
      return;
    }

    this.lostReasonModalMode = mode;
    this.pendingSingleStatusTarget = mode === 'single' ? targetStatus : null;
    this.bulkLostReason = '';
    this.bulkLostReasonDetail = '';
    this.bulkLostCompetitorName = '';
    this.bulkLostDate = this.todayDateInputValue();
    this.showLostReasonModal = true;
  }

  private composeLostReasonDetail(): string | undefined {
    const notes: string[] = [];
    if (this.bulkLostCompetitorName.trim()) {
      notes.push(`Competitor: ${this.bulkLostCompetitorName.trim()}`);
    }
    if (this.bulkLostReasonDetail.trim()) {
      notes.push(this.bulkLostReasonDetail.trim());
    }

    const combined = notes.join(' | ').trim();
    return combined || undefined;
  }

  private todayDateInputValue(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toLostDateUtcIso(dateValue: string): string | undefined {
    const trimmed = (dateValue || '').trim();
    if (!trimmed) {
      return undefined;
    }

    const parsed = new Date(`${trimmed}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) {
      return undefined;
    }

    return parsed.toISOString();
  }

  openBulkEmailComposer(): void {
    if (this.selectedCount === 0 || this.loadingBulkEmailRecipients) {
      return;
    }

    const selectedIds = Array.from(this.selectedEnquiryIds);
    this.loadingBulkEmailRecipients = true;
    this.bulkActionFeedback = '';

    forkJoin(selectedIds.map((enquiryId) => this.api.getEnquiry(enquiryId)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (details) => {
          this.loadingBulkEmailRecipients = false;
          const recipientByEmail = new Map<string, BulkEmailRecipient>();
          details.forEach((detail) => {
            const email = (detail.contactEmail || '').trim();
            if (!email) {
              return;
            }

            if (!recipientByEmail.has(email.toLowerCase())) {
              recipientByEmail.set(email.toLowerCase(), {
                enquiryId: detail.id,
                reference: detail.reference,
                name: `${detail.contactFirstName} ${detail.contactLastName}`.trim(),
                email,
                eventName: detail.eventName || detail.eventType,
                eventDate: detail.eventStartUtc
              });
            }
          });

          this.bulkEmailRecipients = Array.from(recipientByEmail.values());

          this.bulkEmailSubject = 'Update for {event_name}';
          this.bulkEmailBody =
            'Hi {contact_name},\n\n'
            + 'I am following up regarding {event_name} on {event_date}.\n\n'
            + 'Please let me know if you would like any updates.\n\n'
            + 'Kind regards,';
          this.showBulkEmailModal = this.bulkEmailRecipients.length > 0;

          if (this.bulkEmailRecipients.length === 0) {
            this.bulkActionFeedback = 'Selected enquiries do not have contact emails.';
          }
        },
        error: () => {
          this.loadingBulkEmailRecipients = false;
          this.bulkActionFeedback = 'Unable to prepare email recipients for selected enquiries.';
        }
      });
  }

  closeBulkEmailModal(): void {
    this.showBulkEmailModal = false;
    this.bulkEmailRecipients = [];
    this.bulkEmailSubject = '';
    this.bulkEmailBody = '';
  }

  sendBulkEmail(): void {
    if (!this.venueId || this.sendingBulkEmail) {
      return;
    }

    const subject = this.bulkEmailSubject.trim();
    const body = this.bulkEmailBody.trim();
    if (!subject || !body) {
      this.bulkActionFeedback = 'Email subject and body are required.';
      return;
    }

    const requests = this.bulkEmailRecipients.map((recipient) => {
      const personalizedSubject = this.applyBulkEmailMergeFields(subject, recipient);
      const personalizedBody = this.applyBulkEmailMergeFields(body, recipient);
      return this.api.sendConnectEmail(recipient.enquiryId, {
        venueId: this.venueId!,
        to: recipient.email,
        subject: personalizedSubject,
        body: personalizedBody
      });
    });

    if (requests.length === 0) {
      this.bulkActionFeedback = 'No valid recipients available.';
      return;
    }

    this.sendingBulkEmail = true;
    this.startBulkProgress('Sending emails', requests.length);
    let sent = 0;
    let failed = 0;

    from(requests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(
        concatMap((request) =>
          request.pipe(
            map(() => true),
            catchError(() => of(false))
          )),
        tap((ok) => {
          if (ok) {
            sent += 1;
          } else {
            failed += 1;
          }
          this.completeBulkProgress(sent + failed);
        }))
      .subscribe({
        next: () => {
          // All progress handled in tap.
        },
        complete: () => {
          this.sendingBulkEmail = false;
          this.closeBulkEmailModal();
          this.bulkActionFeedback = failed === 0
            ? `Email sent to ${sent} selected contact${sent === 1 ? '' : 's'}.`
            : `Email sent to ${sent}/${requests.length} selected contact${requests.length === 1 ? '' : 's'}. ${failed} failed.`;
          this.bulkProgressLabel = '';
          this.bulkProgressCompleted = 0;
          this.bulkProgressTotal = 0;
        }
      });
  }

  exportSelected(): void {
    const selectedIds = Array.from(this.selectedEnquiryIds);
    if (selectedIds.length === 0 || this.bulkActionBusy) {
      return;
    }

    this.bulkActionBusy = true;
    this.bulkActionFeedback = '';
    this.startBulkProgress('Exporting enquiries', selectedIds.length);

    const details: EnquiryDetailResponse[] = [];
    let failed = 0;

    from(selectedIds)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(
        concatMap((enquiryId) =>
          this.api.getEnquiry(enquiryId).pipe(
            map((detail) => ({ ok: true as const, detail })),
            catchError(() => of({ ok: false as const, detail: null }))
          )),
        tap((result) => {
          if (result.ok && result.detail) {
            details.push(result.detail);
          } else {
            failed += 1;
          }
          this.completeBulkProgress(details.length + failed);
        }))
      .subscribe({
        next: () => {
          // handled in complete
        },
        complete: () => {
          this.bulkActionBusy = false;
          if (details.length === 0) {
            this.bulkActionFeedback = 'Unable to export selected enquiries.';
            this.bulkProgressLabel = '';
            this.bulkProgressCompleted = 0;
            this.bulkProgressTotal = 0;
            return;
          }

    const headers = [
      'Reference',
      'Contact',
      'Event Type',
      'Event Style',
      'Event Date',
      'Guests',
      'Status',
      'Value',
      'Currency',
      'Owner',
      'Source',
      'Last Activity'
    ];

          const rows = details.map((enquiry) => [
      enquiry.reference,
      `${enquiry.contactFirstName} ${enquiry.contactLastName}`.trim(),
      enquiry.eventType,
      enquiry.eventStyle ?? '',
      new Date(enquiry.eventStartUtc).toISOString(),
      String(enquiry.guestsExpected),
      enquiry.status,
      (enquiry.budgetMaxAmount ?? enquiry.budgetMinAmount ?? '').toString(),
      enquiry.currencyCode,
      enquiry.eventManagerName ?? 'Unassigned',
      enquiry.sourceType,
      new Date(enquiry.activityLog?.[0]?.createdAtUtc ?? enquiry.eventStartUtc).toISOString()
    ]);

          const csvContent = [headers, ...rows]
            .map((row) => row.map((cell) => this.escapeCsv(cell)).join(','))
            .join('\n');

          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          link.href = url;
          link.download = `creventa-enquiries-selected-${timestamp}.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          this.bulkActionFeedback = failed === 0
            ? `Exported ${details.length} selected enquir${details.length === 1 ? 'y' : 'ies'}.`
            : `Exported ${details.length}/${selectedIds.length} selected enquiries. ${failed} failed.`;
          this.bulkProgressLabel = '';
          this.bulkProgressCompleted = 0;
          this.bulkProgressTotal = 0;
        }
      });
  }

  private parsePageSize(raw: string | null): number {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      return 25;
    }

    return this.pageSizeOptions.has(parsed) ? parsed : 25;
  }

  private parseOptionalNumber(raw: unknown): number | undefined {
    if (raw === null || raw === undefined) {
      return undefined;
    }

    const value = String(raw).trim();
    if (!value) {
      return undefined;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return undefined;
    }

    return parsed;
  }

  private normalizeNumericQuery(raw: unknown): string {
    if (raw === null || raw === undefined) {
      return '';
    }

    const value = String(raw).trim();
    if (!value) {
      return '';
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return '';
    }

    return String(parsed);
  }

  private parseSort(raw: unknown): { sortBy?: string; sortDirection?: 'asc' | 'desc' } {
    const value = this.composeSortValue(raw);
    if (!value) {
      return {};
    }

    const [sortByRaw, directionRaw] = value.split(':');
    const sortBy = (sortByRaw ?? '').trim();
    const direction = (directionRaw ?? '').trim().toLowerCase() === 'asc' ? 'asc' : 'desc';

    if (!sortBy) {
      return {};
    }

    return {
      sortBy,
      sortDirection: direction
    };
  }

  private composeSortValue(
    explicitSort: unknown,
    legacySortBy: unknown = undefined,
    legacySortDirection: unknown = undefined): string {
    const sort = String(explicitSort ?? '').trim();
    if (sort) {
      return sort;
    }

    const sortBy = String(legacySortBy ?? '').trim();
    if (!sortBy) {
      return '';
    }

    const direction = String(legacySortDirection ?? '').trim().toLowerCase() === 'asc' ? 'asc' : 'desc';
    return `${sortBy}:${direction}`;
  }

  private isValidDetailTab(tab: string | null): tab is 'overview' | 'events' | 'appointments' | 'tasks' | 'proposals' | 'payments' | 'sustainability' | 'documents' | 'activity' {
    return tab === 'overview'
      || tab === 'events'
      || tab === 'appointments'
      || tab === 'tasks'
      || tab === 'proposals'
      || tab === 'payments'
      || tab === 'sustainability'
      || tab === 'documents'
      || tab === 'activity';
  }

  private toDateOnly(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return new Date().toISOString().slice(0, 10);
    }

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toDateTimeLocalInput(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  private toTimeOnly(value: Date): string {
    if (Number.isNaN(value.getTime())) {
      return '09:00';
    }

    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private combineDateAndTimeToDate(date: string, time: string): Date {
    return new Date(`${date}T${time}:00`);
  }

  private timeToMinutes(time: string): number {
    const parts = time.split(':');
    if (parts.length !== 2) {
      return 9 * 60;
    }

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return 9 * 60;
    }

    return hours * 60 + minutes;
  }

  private timelinePercentForMinutes(minutes: number): number {
    const timelineStart = 6 * 60;
    const timelineEnd = 23 * 60;
    const clamped = Math.min(timelineEnd, Math.max(timelineStart, minutes));
    const window = timelineEnd - timelineStart;
    return ((clamped - timelineStart) / window) * 100;
  }

  private createDefaultSubEventDraft(enquiry?: EnquiryDetailResponse): SubEventDraft {
    const startReference = enquiry ? new Date(enquiry.eventStartUtc) : new Date();
    const endReference = enquiry?.eventEndUtc ? new Date(enquiry.eventEndUtc) : new Date(startReference.getTime() + 60 * 60 * 1000);
    const fallbackEnd = endReference > startReference
      ? endReference
      : new Date(startReference.getTime() + 60 * 60 * 1000);
    const date = this.toDateOnly(startReference.toISOString());

    return {
      name: '',
      type: 'Custom',
      status: enquiry?.status ?? 'New',
      date,
      startTime: this.toTimeOnly(startReference),
      endTime: this.toTimeOnly(fallbackEnd),
      guestCount: enquiry?.guestsExpected ?? 1,
      spaceId: this.venueSpaces[0]?.id ?? '',
      setupStyle: enquiry?.setupStyle ?? '',
      notes: ''
    };
  }

  private createDefaultAppointmentDraft(enquiry?: EnquiryDetailResponse): AppointmentDraft {
    const startReference = enquiry ? new Date(enquiry.eventStartUtc) : new Date();
    const date = this.toDateOnly(startReference.toISOString());

    return {
      title: '',
      type: 'Meeting',
      date,
      startTime: this.toTimeOnly(startReference),
      durationMinutes: 60,
      spaceId: this.venueSpaces[0]?.id ?? '',
      attendees: '',
      assignedToUserId: enquiry?.eventManagerUserId ?? '',
      notes: '',
      status: 'Scheduled',
      relatedEnquiryIds: enquiry ? [enquiry.id] : []
    };
  }

  private mapAppointmentToDraft(appointment: AppointmentDetailDto): AppointmentDraft {
    const start = new Date(appointment.startUtc);
    const date = this.toDateOnly(appointment.startUtc);

    return {
      title: appointment.title ?? '',
      type: appointment.type ?? 'Meeting',
      date,
      startTime: this.toTimeOnly(start),
      durationMinutes: Math.max(15, Number(appointment.durationMinutes || 60)),
      spaceId: appointment.spaceId ?? '',
      attendees: appointment.attendees ?? '',
      assignedToUserId: appointment.assignedToUserId ?? '',
      notes: appointment.notes ?? '',
      status: this.normalizeAppointmentStatus(appointment.status),
      relatedEnquiryIds: (appointment.relatedEnquiries ?? []).map((item) => item.enquiryId).filter((id) => !!id)
    };
  }

  private createDefaultSustainabilityDraft(): EnquirySustainabilityRequest {
    return {
      cateringType: this.sustainabilityCateringTypes?.[0] ?? 'standard',
      venueEnergyRating: this.sustainabilityEnergyRatings?.[2] ?? 'C',
      guestCountOverride: null,
      estimatedTravelKmPerGuest: 15,
      foodWasteKg: 0,
      generalWasteKg: 0,
      recyclablesKg: 0,
      compostablesKg: 0,
      localSourcingPercent: 0,
      localSupplierSharePercent: 25,
      regionalSupplierSharePercent: 35,
      nationalSupplierSharePercent: 30,
      internationalSupplierSharePercent: 10,
      includeInProposal: false,
      notes: ''
    };
  }

  private mapSustainabilityResponseToDraft(response: EnquirySustainabilityResponse): EnquirySustainabilityRequest {
    return {
      cateringType: response.cateringType || (this.sustainabilityCateringTypes?.[0] ?? 'standard'),
      venueEnergyRating: response.venueEnergyRating || (this.sustainabilityEnergyRatings?.[2] ?? 'C'),
      guestCountOverride: response.guestCountOverride ?? null,
      estimatedTravelKmPerGuest: this.numberOrZero(response.estimatedTravelKmPerGuest),
      foodWasteKg: this.numberOrZero(response.foodWasteKg),
      generalWasteKg: this.numberOrZero(response.generalWasteKg),
      recyclablesKg: this.numberOrZero(response.recyclablesKg),
      compostablesKg: this.numberOrZero(response.compostablesKg),
      localSourcingPercent: this.numberOrZero(response.localSourcingPercent),
      localSupplierSharePercent: this.numberOrZero(response.localSupplierSharePercent),
      regionalSupplierSharePercent: this.numberOrZero(response.regionalSupplierSharePercent),
      nationalSupplierSharePercent: this.numberOrZero(response.nationalSupplierSharePercent),
      internationalSupplierSharePercent: this.numberOrZero(response.internationalSupplierSharePercent),
      includeInProposal: response.includeInProposal,
      notes: response.notes ?? ''
    };
  }

  private normalizeSustainabilityDraft(input: EnquirySustainabilityRequest): EnquirySustainabilityRequest {
    const totalShares = this.numberOrZero(input.localSupplierSharePercent)
      + this.numberOrZero(input.regionalSupplierSharePercent)
      + this.numberOrZero(input.nationalSupplierSharePercent)
      + this.numberOrZero(input.internationalSupplierSharePercent);

    const normalizedShares = totalShares > 0
      ? {
        local: (this.numberOrZero(input.localSupplierSharePercent) / totalShares) * 100,
        regional: (this.numberOrZero(input.regionalSupplierSharePercent) / totalShares) * 100,
        national: (this.numberOrZero(input.nationalSupplierSharePercent) / totalShares) * 100,
        international: (this.numberOrZero(input.internationalSupplierSharePercent) / totalShares) * 100
      }
      : {
        local: 0,
        regional: 0,
        national: 0,
        international: 0
      };

    return {
      cateringType: (input.cateringType || '').trim().toLowerCase() || (this.sustainabilityCateringTypes[0] ?? 'standard'),
      venueEnergyRating: (input.venueEnergyRating || '').trim().toUpperCase() || (this.sustainabilityEnergyRatings[2] ?? 'C'),
      guestCountOverride: input.guestCountOverride && input.guestCountOverride > 0
        ? Math.round(input.guestCountOverride)
        : null,
      estimatedTravelKmPerGuest: this.roundMoney(Math.max(0, this.numberOrZero(input.estimatedTravelKmPerGuest))),
      foodWasteKg: this.roundMoney(Math.max(0, this.numberOrZero(input.foodWasteKg))),
      generalWasteKg: this.roundMoney(Math.max(0, this.numberOrZero(input.generalWasteKg))),
      recyclablesKg: this.roundMoney(Math.max(0, this.numberOrZero(input.recyclablesKg))),
      compostablesKg: this.roundMoney(Math.max(0, this.numberOrZero(input.compostablesKg))),
      localSourcingPercent: this.roundMoney(Math.min(100, Math.max(0, this.numberOrZero(input.localSourcingPercent)))),
      localSupplierSharePercent: this.roundMoney(normalizedShares.local),
      regionalSupplierSharePercent: this.roundMoney(normalizedShares.regional),
      nationalSupplierSharePercent: this.roundMoney(normalizedShares.national),
      internationalSupplierSharePercent: this.roundMoney(normalizedShares.international),
      includeInProposal: !!input.includeInProposal,
      notes: (input.notes || '').trim() || null
    };
  }

  private mapSubEventToDraft(subEvent: SubEventDto): SubEventDraft {
    const start = new Date(subEvent.startUtc);
    const end = new Date(subEvent.endUtc);
    return {
      name: subEvent.name,
      type: subEvent.type || 'Custom',
      status: subEvent.status || (this.selectedEnquiry?.status ?? 'New'),
      date: this.toDateOnly(subEvent.startUtc),
      startTime: this.toTimeOnly(start),
      endTime: this.toTimeOnly(end),
      guestCount: subEvent.guestCount,
      spaceId: subEvent.spaceIds[0] ?? '',
      setupStyle: subEvent.setupStyle ?? '',
      notes: subEvent.specialRequirements ?? ''
    };
  }

  private validateSubEventDraft(draft: SubEventDraft, subEventId?: string): string | null {
    if (!draft.name.trim()) {
      return 'Sub-event name is required.';
    }

    if (!draft.type.trim()) {
      return 'Sub-event type is required.';
    }

    if (!this.subEventTypeOptions.includes(draft.type)) {
      return 'Select a valid sub-event type.';
    }

    if (!draft.status.trim() || !this.subEventStatusOptions.includes(draft.status)) {
      return 'Select a valid sub-event status.';
    }

    if (!draft.date) {
      return 'Date is required.';
    }

    if (!draft.startTime || !draft.endTime) {
      return 'Start and end times are required.';
    }

    const guestCount = Math.round(this.numberOrZero(draft.guestCount));
    if (!Number.isInteger(guestCount) || guestCount <= 0) {
      return 'Guest count must be a positive integer.';
    }

    if (!draft.spaceId) {
      return 'Select a space for the sub-event.';
    }

    const start = this.combineDateAndTimeToDate(draft.date, draft.startTime);
    const end = this.combineDateAndTimeToDate(draft.date, draft.endTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 'Start and end times are required.';
    }

    if (end <= start) {
      return 'End time must be later than start time.';
    }

    const selectedSpace = this.venueSpaces.find((space) => space.id === draft.spaceId);
    if (!selectedSpace) {
      return 'Selected space is not available for this venue.';
    }

    const capacity = this.resolveSpaceCapacity(selectedSpace, draft.setupStyle);
    if (capacity > 0 && guestCount > capacity) {
      return `Guest count exceeds ${selectedSpace.name} capacity (${capacity}) for the selected setup.`;
    }

    return null;
  }

  private resolveSpaceCapacity(space: SpaceSummaryDto, setupStyle: string): number {
    if (!space.capacityBySetup.length) {
      return 0;
    }

    const normalizedSetup = (setupStyle || '').trim().toLowerCase();
    const match = space.capacityBySetup.find((item) => item.setupStyle.trim().toLowerCase() === normalizedSetup);
    return match?.capacity ?? Math.max(...space.capacityBySetup.map((item) => item.capacity));
  }

  private detectSubEventOverlap(draft: SubEventDraft, subEventId?: string): string | null {
    if (!this.selectedEnquiry) {
      return null;
    }

    const start = this.combineDateAndTimeToDate(draft.date, draft.startTime);
    const end = this.combineDateAndTimeToDate(draft.date, draft.endTime);
    const selectedSpace = this.venueSpaces.find((space) => space.id === draft.spaceId);
    const turnaroundMinutes = Math.max(0, selectedSpace?.turnaroundMinutes ?? 0);

    const bufferedStart = new Date(start.getTime() - turnaroundMinutes * 60 * 1000);
    const bufferedEnd = new Date(end.getTime() + turnaroundMinutes * 60 * 1000);

    const overlapping = this.selectedEnquiry.subEvents.find((candidate) => {
      if (candidate.id === subEventId) {
        return false;
      }

      if (!candidate.spaceIds.includes(draft.spaceId)) {
        return false;
      }

      const candidateStart = new Date(candidate.startUtc);
      const candidateEnd = new Date(candidate.endUtc);
      return candidateStart < bufferedEnd && candidateEnd > bufferedStart;
    });

    if (!overlapping) {
      return null;
    }

    return `Time overlaps with "${overlapping.name}" in the same space (includes ${turnaroundMinutes} minute turnaround).`;
  }

  private buildLocalSubEventOverlapWarning(draft: SubEventDraft, subEventId?: string): string {
    return this.detectSubEventOverlap(draft, subEventId) ?? '';
  }

  private scheduleSubEventAvailabilityCheck(draft: SubEventDraft, subEventId: string | null): void {
    if (!this.selectedEnquiryId || !this.selectedEnquiry || !draft.spaceId || !draft.date || !draft.startTime || !draft.endTime) {
      this.setSubEventAvailabilityState(subEventId, {
        loading: false,
        isAvailable: true,
        warning: '',
        conflicts: []
      });
      return;
    }

    if (subEventId) {
      const existing = this.subEventAvailabilityTimers[subEventId];
      if (existing) {
        clearTimeout(existing);
      }
    } else if (this.newSubEventAvailabilityTimer) {
      clearTimeout(this.newSubEventAvailabilityTimer);
    }

    this.setSubEventAvailabilityState(subEventId, {
      loading: true,
      isAvailable: true,
      warning: 'Checking space availability...',
      conflicts: []
    });

    const timer = setTimeout(() => {
      void this.runSubEventAvailabilityCheck(draft, subEventId);
    }, 250);

    if (subEventId) {
      this.subEventAvailabilityTimers[subEventId] = timer;
    } else {
      this.newSubEventAvailabilityTimer = timer;
    }
  }

  private async runSubEventAvailabilityCheck(draft: SubEventDraft, subEventId: string | null): Promise<void> {
    if (!this.selectedEnquiryId) {
      return;
    }

    const start = this.combineDateAndTimeToDate(draft.date, draft.startTime);
    const end = this.combineDateAndTimeToDate(draft.date, draft.endTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      this.setSubEventAvailabilityState(subEventId, {
        loading: false,
        isAvailable: false,
        warning: 'Enter a valid start/end time window.',
        conflicts: []
      });
      return;
    }

    this.api.checkSubEventAvailability(this.selectedEnquiryId, {
      startUtc: start.toISOString(),
      endUtc: end.toISOString(),
      spaceIds: [draft.spaceId],
      excludeSubEventId: subEventId
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const overlapWarning = this.buildLocalSubEventOverlapWarning(draft, subEventId ?? undefined);
          const remoteWarning = response.conflicts.length > 0
            ? `Conflicts: ${response.conflicts
              .slice(0, 3)
              .map((conflict) => `${conflict.label} (${this.toDateTimeLocalInput(conflict.startUtc).replace('T', ' ')}-${this.toDateTimeLocalInput(conflict.endUtc).slice(11, 16)})`)
              .join('; ')}`
            : '';
          this.setSubEventAvailabilityState(subEventId, {
            loading: false,
            isAvailable: response.isAvailable,
            warning: [overlapWarning, remoteWarning].filter(Boolean).join(' | '),
            conflicts: response.conflicts
          });
        },
        error: () => {
          this.setSubEventAvailabilityState(subEventId, {
            loading: false,
            isAvailable: true,
            warning: 'Unable to verify live availability right now.',
            conflicts: []
          });
        }
      });
  }

  private setSubEventAvailabilityState(subEventId: string | null, state: SubEventAvailabilityState): void {
    if (subEventId) {
      this.subEventAvailability[subEventId] = state;
      this.subEventWarnings[subEventId] = state.warning;
      return;
    }

    this.newSubEventAvailability = state;
    this.newSubEventWarning = state.warning;
  }

  private buildSubEventPayload(draft: SubEventDraft, currencyCodeFallback: string, allowConflictOverride: boolean): UpsertSubEventRequest {
    const start = this.combineDateAndTimeToDate(draft.date, draft.startTime);
    const end = this.combineDateAndTimeToDate(draft.date, draft.endTime);
    return {
      name: draft.name.trim(),
      type: draft.type.trim() || 'Custom',
      status: draft.status.trim() || null,
      startUtc: start.toISOString(),
      endUtc: end.toISOString(),
      guestCount: Math.max(1, Math.round(this.numberOrZero(draft.guestCount))),
      setupStyle: draft.setupStyle.trim() || null,
      specialRequirements: draft.notes.trim() || null,
      priceAmount: null,
      currencyCode: (currencyCodeFallback || 'GBP').toUpperCase(),
      spaceIds: draft.spaceId ? [draft.spaceId] : [],
      allowConflictOverride
    };
  }

  private resolveSubEventApiError(errorResponse: any): { message: string; warning: string; canOverride: boolean; conflicts: SubEventConflictDto[] } {
    if (errorResponse?.status === 409) {
      const rawConflicts = Array.isArray(errorResponse?.error?.conflicts) ? errorResponse.error.conflicts : [];
      const summary = rawConflicts
        .slice(0, 3)
        .map((conflict: any) => {
          const label = conflict?.label || 'Existing booking';
          const start = conflict?.startUtc ? this.toDateTimeLocalInput(conflict.startUtc) : '';
          const end = conflict?.endUtc ? this.toDateTimeLocalInput(conflict.endUtc) : '';
          const prettyWindow = start && end ? `${start.replace('T', ' ')} - ${end.slice(11, 16)}` : '';
          return prettyWindow ? `${label} (${prettyWindow})` : label;
        })
        .join('; ');

      return {
        message: typeof errorResponse?.error?.message === 'string'
          ? errorResponse.error.message
          : 'Sub-event conflicts with existing bookings.',
        warning: summary ? `Conflicts: ${summary}` : '',
        canOverride: true,
        conflicts: rawConflicts
      };
    }

    const message = typeof errorResponse?.error === 'string'
      ? errorResponse.error
      : (typeof errorResponse?.error?.message === 'string' ? errorResponse.error.message : 'Unable to save sub-event.');

    return { message, warning: '', canOverride: false, conflicts: [] };
  }

  private subtractDays(dateOnly: string, days: number): string {
    const date = new Date(`${dateOnly}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) {
      return this.toDateOnly(new Date().toISOString());
    }

    date.setUTCDate(date.getUTCDate() - days);
    return this.toDateOnly(date.toISOString());
  }

  private resolveDueDateRule(dueDateRule: string, eventDate: string, confirmationDate: string): string {
    const rule = (dueDateRule || '').trim().toLowerCase();
    if (!rule) {
      return confirmationDate;
    }

    if (rule.includes('on confirmation')) {
      return confirmationDate;
    }

    if (rule.includes('on event')) {
      return eventDate;
    }

    const match = rule.match(/(\d+)/);
    const days = match ? Number(match[1]) : 0;

    if (rule.includes('before event')) {
      return this.subtractDays(eventDate, days);
    }

    if (rule.includes('after event')) {
      return this.subtractDays(eventDate, -days);
    }

    if (rule.includes('after confirmation')) {
      return this.subtractDays(confirmationDate, -days);
    }

    return confirmationDate;
  }

  private calculateDueDateFromEventOffset(daysBeforeEvent: number): string {
    if (!this.selectedEnquiry) {
      return this.toDateOnly(new Date().toISOString());
    }

    const eventDate = this.toDateOnly(this.selectedEnquiry.eventStartUtc);
    return this.subtractDays(eventDate, daysBeforeEvent);
  }

  private estimateDaysBeforeEvent(dueDate: string): number {
    if (!this.selectedEnquiry) {
      return 0;
    }

    const eventDate = new Date(`${this.toDateOnly(this.selectedEnquiry.eventStartUtc)}T00:00:00Z`);
    const milestoneDate = new Date(`${dueDate}T00:00:00Z`);
    if (Number.isNaN(eventDate.getTime()) || Number.isNaN(milestoneDate.getTime())) {
      return 0;
    }

    return Math.round((eventDate.getTime() - milestoneDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  private nextMilestoneClientKey(): string {
    this.milestoneDraftCounter += 1;
    return `new-${this.milestoneDraftCounter}`;
  }

  private numberOrZero(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private roundMoney(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private createEmptyOverviewDraft(): EnquiryOverviewDraft {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    return {
      contactName: '',
      eventName: '',
      eventDate: `${yyyy}-${mm}-${dd}`,
      startTime: `${hh}:${min}`,
      guestsExpected: 1,
      eventStyle: '',
      setupStyle: '',
      eventManagerUserId: '',
      leadQuality: 3,
      sourceType: 'Phone',
      sourceDetail: '',
      contactPhoneNumberE164: '',
      contactEmail: '',
      companyName: '',
      budgetMinAmount: '',
      budgetMaxAmount: '',
      specialRequirements: '',
      hasFlexibleDates: false,
      flexibleDateNotes: '',
      marketingConsent: false
    };
  }

  private loadEnquiryDetail(enquiryId: string): void {
    this.api
      .getEnquiry(enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (enquiry) => {
          this.selectedEnquiry = enquiry;
          this.sameDateAvailabilityExpanded = true;
          this.populateOverviewDraft(enquiry);
          this.overviewEditingField = null;
          this.overviewValidationErrors = {};
          this.clearOverviewSavedState();
          this.showAddSubEventForm = false;
          this.creatingSubEvent = false;
          this.newSubEventDraft = this.createDefaultSubEventDraft(enquiry);
          this.newSubEventError = '';
          this.newSubEventWarning = '';
          this.newSubEventCanOverrideConflict = false;
          this.newSubEventAvailability = { loading: false, isAvailable: true, warning: '', conflicts: [] };
          if (this.newSubEventAvailabilityTimer) {
            clearTimeout(this.newSubEventAvailabilityTimer);
            this.newSubEventAvailabilityTimer = null;
          }
          Object.values(this.subEventAvailabilityTimers).forEach((timer) => clearTimeout(timer));
          this.subEventAvailabilityTimers = {};
          this.expandedSubEventIds = new Set<string>();
          this.subEventDrafts = {};
          this.subEventErrors = {};
          this.subEventWarnings = {};
          this.subEventCanOverrideConflict = {};
          this.subEventAvailability = {};
          this.updatingSubEventIds = new Set<string>();
          this.deletingSubEventId = null;
          this.showAppointmentForm = false;
          this.appointmentFormMode = 'create';
          this.appointmentEditingId = null;
          this.appointmentSaving = false;
          this.appointmentError = '';
          this.appointmentConflictWarning = '';
          this.appointmentDraft = this.createDefaultAppointmentDraft(enquiry);
          this.aiFollowUpExecutionMessage = '';
          this.aiFollowUpExecutionError = '';
          this.loadEnquiryProposals(enquiryId);
          this.loadAiFollowUpRecommendations(enquiryId);
          this.ensureVenueSpacesLoaded(enquiry.venueId);
          this.loadRoutingOptions(enquiryId);

          if (!this.canShowPaymentsTab && this.detailTab === 'payments') {
            this.detailTab = 'overview';
          }

          if (this.detailTab === 'payments' && this.canShowPaymentsTab) {
            this.loadPaymentSchedule(enquiryId, true);
          }

          if (this.detailTab === 'sustainability') {
            this.loadEnquirySustainability(enquiryId);
          }

          if (this.detailTab === 'activity') {
            this.loadEnquiryActivity(true);
          }

        },
        error: () => {
          this.selectedEnquiry = null;
          this.resetEnquiryActivityState();
          this.overviewDraft = this.createEmptyOverviewDraft();
          this.overviewEditingField = null;
          this.overviewValidationErrors = {};
          this.clearOverviewSavedState();
          this.enquiryProposals = [];
          this.enquiryProposalsLoading = false;
          this.paymentSchedule = null;
          this.paymentMilestonesDraft = [];
          this.paymentScheduleLoading = false;
          this.paymentScheduleError = '';
          this.paymentScheduleMessage = '';
          this.showAddSubEventForm = false;
          this.creatingSubEvent = false;
          this.newSubEventDraft = this.createDefaultSubEventDraft();
          this.newSubEventError = '';
          this.newSubEventWarning = '';
          this.newSubEventCanOverrideConflict = false;
          this.newSubEventAvailability = { loading: false, isAvailable: true, warning: '', conflicts: [] };
          if (this.newSubEventAvailabilityTimer) {
            clearTimeout(this.newSubEventAvailabilityTimer);
            this.newSubEventAvailabilityTimer = null;
          }
          Object.values(this.subEventAvailabilityTimers).forEach((timer) => clearTimeout(timer));
          this.subEventAvailabilityTimers = {};
          this.expandedSubEventIds = new Set<string>();
          this.subEventDrafts = {};
          this.subEventErrors = {};
          this.subEventWarnings = {};
          this.subEventCanOverrideConflict = {};
          this.subEventAvailability = {};
          this.aiFollowUpRecommendations = [];
          this.aiFollowUpRecommendationsLoading = false;
          this.aiFollowUpRecommendationsMessage = '';
          this.aiFollowUpExecutionInProgressKey = null;
          this.aiFollowUpExecutionMessage = '';
          this.aiFollowUpExecutionError = '';
          this.updatingSubEventIds = new Set<string>();
          this.deletingSubEventId = null;
          this.showAppointmentForm = false;
          this.appointmentFormMode = 'create';
          this.appointmentEditingId = null;
          this.appointmentSaving = false;
          this.appointmentError = '';
          this.appointmentConflictWarning = '';
          this.appointmentDraft = this.createDefaultAppointmentDraft();
          this.enquiryDocuments = [];
          this.enquiryDocumentsLoading = false;
          this.enquiryDocumentsError = '';
          this.enquirySustainability = null;
          this.sustainabilityDraft = this.createDefaultSustainabilityDraft();
          this.sustainabilityLoading = false;
          this.sustainabilitySaving = false;
          this.sustainabilityError = '';
          this.sustainabilityMessage = '';
          this.documentPendingFile = null;
          this.documentUploadBusy = false;
          this.documentUploadError = '';
          this.deletingDocumentId = null;
          this.generatingBeo = false;
          this.routingOptions = null;
          this.routingOptionsLoading = false;
          this.routingOptionsError = '';
          this.selectedRoutingVenueId = '';
          this.routingTransferMessage = '';
          this.showTransferEnquiryModal = false;
          this.transferModalStep = 'form';
          this.transferModalTargetVenueId = '';
          this.transferModalReason = '';
          this.transferModalKeepCopy = true;
          this.transferModalSubmitting = false;
          this.transferModalError = '';
        }
      });
  }

  private loadRoutingOptions(enquiryId: string): void {
    this.routingOptionsLoading = true;
    this.routingOptionsError = '';
    this.routingTransferMessage = '';
    this.api
      .getEnquiryRoutingOptions(enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.routingOptionsLoading = false;
          this.routingOptions = response;
          const currentSelectionStillValid = !!response.venueOptions.find((option) => option.venueId === this.selectedRoutingVenueId);
          if (!currentSelectionStillValid) {
            this.selectedRoutingVenueId = response.venueOptions[0]?.venueId ?? '';
          }
        },
        error: (error) => {
          this.routingOptionsLoading = false;
          this.routingOptions = null;
          this.selectedRoutingVenueId = '';
          this.routingOptionsError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to load sister-venue routing options.';
        }
      });
  }

  private resetVenueScopedState(): void {
    this.clearBulkSelection();
    this.loading = false;
    this.enquiryLoadError = '';
    this.listResponse = null;
    this.enquiries = [];
    this.selectedEnquiryId = null;
    this.selectedEnquiry = null;
    this.pendingBulkAssignValue = '';
    this.pendingBulkStatusValue = '';
    this.bulkActionFeedback = '';
    this.mergeResultMessage = '';
    this.showMergeModal = false;
    this.loadingMergeModal = false;
    this.mergeSubmitting = false;
    this.mergeError = '';
    this.mergePrimaryDetail = null;
    this.mergeSecondaryDetail = null;
    this.mergeFieldSources = {};
    this.pendingMergeIdsFromQuery = [];
    this.overviewDraft = this.createEmptyOverviewDraft();
    this.overviewEditingField = null;
    this.overviewValidationErrors = {};
    this.clearOverviewSavedState();
    this.overviewToastMessage = '';
    this.enquiryProposals = [];
    this.enquiryProposalsLoading = false;
    this.paymentSchedule = null;
    this.paymentScheduleLoading = false;
    this.paymentScheduleError = '';
    this.paymentScheduleMessage = '';
    this.paymentMilestonesDraft = [];
    this.paymentSavingSchedule = false;
    this.paymentInitializingDefaults = false;
    this.enquirySustainability = null;
    this.sustainabilityDraft = this.createDefaultSustainabilityDraft();
    this.sustainabilityLoading = false;
    this.sustainabilitySaving = false;
    this.sustainabilityError = '';
    this.sustainabilityMessage = '';
    this.enquiryDocuments = [];
    this.enquiryDocumentsLoading = false;
    this.enquiryDocumentsError = '';
    this.documentPendingFile = null;
    this.documentUploadBusy = false;
    this.documentUploadError = '';
    this.generatingBeo = false;
    this.detailTab = 'overview';
    this.resetEnquiryActivityState();
    this.loadedVenueSpacesVenueId = null;
    this.venueSpaces = [];
    this.loadingVenueSpaces = false;
    this.loadedAssignableUsersVenueId = null;
    this.assignableUsers = [];
    this.loadingAssignableUsers = false;
    this.loadedLostReasonsVenueId = null;
    this.loadingLostReasons = false;
    this.lostReasonChoices = [];
    this.routingOptions = null;
    this.routingOptionsLoading = false;
    this.routingOptionsError = '';
    this.selectedRoutingVenueId = '';
    this.routingTransferMessage = '';
    this.showTransferEnquiryModal = false;
    this.transferModalStep = 'form';
    this.transferModalTargetVenueId = '';
    this.transferModalReason = '';
    this.transferModalKeepCopy = true;
    this.transferModalSubmitting = false;
    this.transferModalError = '';
  }

  private resolveEnquiryListError(error: any): string {
    const apiMessage =
      typeof error?.error === 'string'
        ? error.error
        : typeof error?.error?.message === 'string'
          ? error.error.message
          : null;
    const apiCode = typeof error?.error?.code === 'string' ? error.error.code : null;
    const correlationId = typeof error?.error?.correlationId === 'string' ? error.error.correlationId : null;

    const connectivityMessage =
      error?.status === 0
        ? 'Enquiries API is unreachable. Ensure backend is running on http://localhost:5080.'
        : null;

    const message = connectivityMessage ?? apiMessage ?? 'Unable to load enquiries right now. Please retry.';
    const codeSuffix = apiCode ? ` [${apiCode}]` : '';
    const correlationSuffix = correlationId ? ` (Ref: ${correlationId})` : '';
    return `${message}${codeSuffix}${correlationSuffix}`;
  }

  private ensureVenueSpacesLoaded(venueId: string): void {
    if (this.loadingVenueSpaces || this.loadedVenueSpacesVenueId === venueId) {
      return;
    }

    this.loadingVenueSpaces = true;
    this.api.getVenueSpaces(venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (spaces) => {
          this.loadingVenueSpaces = false;
          this.loadedVenueSpacesVenueId = venueId;
          this.venueSpaces = spaces;
        },
        error: () => {
          this.loadingVenueSpaces = false;
          this.loadedVenueSpacesVenueId = null;
          this.venueSpaces = [];
        }
      });
  }

  createProposalForSelectedEnquiry(): void {
    if (!this.selectedEnquiryId) {
      return;
    }

    this.router.navigate(['/proposals'], {
      queryParams: {
        enquiry: this.selectedEnquiryId,
        create: 1
      }
    });
  }

  openProposalInMaker(proposalId: string): void {
    this.router.navigate(['/proposals'], {
      queryParams: {
        proposal: proposalId
      }
    });
  }

  executeFollowUpRecommendation(recommendation: AiFollowUpRecommendationDto): void {
    const enquiryId = this.selectedEnquiryId;
    const venueId = this.venueId;
    if (!enquiryId || !venueId || this.aiFollowUpExecutionInProgressKey) {
      return;
    }

    this.aiFollowUpExecutionInProgressKey = recommendation.key;
    this.aiFollowUpExecutionError = '';
    this.aiFollowUpExecutionMessage = '';

    this.api
      .executeAiFollowUpRecommendation(venueId, enquiryId, recommendation.key, {
        sendImmediately: recommendation.recommendedChannel === 'email',
        templateKey: recommendation.suggestedTemplateKey || undefined
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.aiFollowUpExecutionInProgressKey = null;
          this.aiFollowUpExecutionMessage = response.message || 'Action completed.';
          this.aiFollowUpExecutionError = '';
          this.loadAiFollowUpRecommendations(enquiryId);
          this.loadEnquiries(this.listResponse?.page.page ?? 1);
          if (this.detailTab === 'activity') {
            this.loadEnquiryActivity(true);
          }
        },
        error: () => {
          this.aiFollowUpExecutionInProgressKey = null;
          this.aiFollowUpExecutionError = 'Unable to execute recommendation right now.';
          this.aiFollowUpExecutionMessage = '';
        }
      });
  }

  openFollowUpRecommendation(recommendation: AiFollowUpRecommendationDto): void {
    const routeHint = recommendation.routeHint?.trim();
    if (!routeHint) {
      return;
    }

    this.router.navigateByUrl(routeHint);
  }

  isRecommendationExecuting(recommendation: AiFollowUpRecommendationDto): boolean {
    return this.aiFollowUpExecutionInProgressKey === recommendation.key;
  }

  onDocumentCategoryFilterChange(value: string): void {
    this.documentCategoryFilter = value || 'All';
  }

  onDocumentUploadCategoryChange(value: string): void {
    this.documentUploadCategory = value || 'Other';
    this.documentUploadError = '';
  }

  private loadAiFollowUpRecommendations(enquiryId: string): void {
    const venueId = this.venueId;
    if (!venueId) {
      this.aiFollowUpRecommendations = [];
      this.aiFollowUpRecommendationsLoading = false;
      this.aiFollowUpRecommendationsMessage = 'Select a venue to load recommendations.';
      return;
    }

    this.aiFollowUpRecommendationsLoading = true;
    this.aiFollowUpRecommendationsMessage = '';

    this.api
      .getAiFollowUpRecommendations(venueId, enquiryId, 3)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.aiFollowUpRecommendations = response.items ?? [];
          this.aiFollowUpRecommendationsLoading = false;
          this.aiFollowUpRecommendationsMessage =
            this.aiFollowUpRecommendations.length > 0
              ? ''
              : response.message || (!response.hasSufficientData ? 'Gathering engagement signals...' : 'No recommendations yet.');
        },
        error: () => {
          this.aiFollowUpRecommendations = [];
          this.aiFollowUpRecommendationsLoading = false;
          this.aiFollowUpRecommendationsMessage = 'Recommendations are currently unavailable.';
        }
      });
  }

  onDocumentDragOver(event: DragEvent): void {
    event.preventDefault();
    this.documentDropActive = true;
  }

  onDocumentDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.documentDropActive = false;
  }

  onDocumentDrop(event: DragEvent): void {
    event.preventDefault();
    this.documentDropActive = false;

    const file = event.dataTransfer?.files?.item(0);
    if (!file) {
      return;
    }

    this.queueDocumentFile(file);
  }

  onDocumentFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0) ?? null;
    if (file) {
      this.queueDocumentFile(file);
    }

    input.value = '';
  }

  clearPendingDocument(): void {
    this.documentPendingFile = null;
    this.documentUploadError = '';
  }

  uploadPendingDocument(): void {
    if (!this.selectedEnquiryId || !this.documentPendingFile || this.documentUploadBusy) {
      return;
    }

    this.documentUploadBusy = true;
    this.documentUploadError = '';

    this.readFileAsBase64(this.documentPendingFile)
      .then((base64Content) => {
        const payload: UploadEnquiryDocumentRequest = {
          fileName: this.documentPendingFile!.name,
          mimeType: this.resolveDocumentMimeType(this.documentPendingFile!),
          category: this.documentUploadCategory || 'Other',
          base64Content
        };

        this.api.uploadEnquiryDocument(this.selectedEnquiryId!, payload)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.documentUploadBusy = false;
              this.documentPendingFile = null;
              this.documentUploadCategory = 'Other';
              this.loadEnquiryDocuments(this.selectedEnquiryId!);
              this.showOverviewToast('Document uploaded');
            },
            error: (error) => {
              this.documentUploadBusy = false;
              this.documentUploadError = typeof error?.error === 'string'
                ? error.error
                : 'Unable to upload document.';
            }
          });
      })
      .catch(() => {
        this.documentUploadBusy = false;
        this.documentUploadError = 'Unable to read the selected file.';
      });
  }

  deleteEnquiryDocument(document: EnquiryDocumentDto): void {
    if (!this.selectedEnquiryId || this.deletingDocumentId) {
      return;
    }

    const confirmed = window.confirm(`Delete "${document.fileName}"?`);
    if (!confirmed) {
      return;
    }

    this.deletingDocumentId = document.id;
    this.api.deleteEnquiryDocument(this.selectedEnquiryId, document.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deletingDocumentId = null;
          this.loadEnquiryDocuments(this.selectedEnquiryId!);
          this.showOverviewToast('Document deleted');
        },
        error: (error) => {
          this.deletingDocumentId = null;
          this.documentUploadError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to delete document.';
        }
      });
  }

  openDocumentDownload(document: EnquiryDocumentDto): void {
    window.open(document.downloadUrl || `/api/documents/${document.id}`, '_blank', 'noopener');
  }

  openDocumentPreview(document: EnquiryDocumentDto): void {
    if (!this.canPreviewEnquiryDocument(document)) {
      return;
    }

    window.open(document.downloadUrl || `/api/documents/${document.id}`, '_blank', 'noopener');
  }

  canPreviewEnquiryDocument(document: EnquiryDocumentDto): boolean {
    if (document.canPreview) {
      return true;
    }

    const mime = (document.mimeType || '').toLowerCase();
    return mime === 'application/pdf' || mime.startsWith('image/');
  }

  generateBeoDocument(): void {
    if (!this.selectedEnquiryId || !this.canGenerateBeo || this.generatingBeo) {
      return;
    }

    this.generatingBeo = true;
    this.documentUploadError = '';

    this.api.generateEnquiryBeo(this.selectedEnquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: GenerateBeoResponse) => {
          this.generatingBeo = false;
          this.loadEnquiryDocuments(this.selectedEnquiryId!);
          this.showOverviewToast('BEO generated');
          if (result.downloadUrl) {
            window.open(result.downloadUrl, '_blank', 'noopener');
          }
        },
        error: (error) => {
          this.generatingBeo = false;
          this.documentUploadError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to generate BEO.';
        }
      });
  }

  private loadEnquiryProposals(enquiryId: string): void {
    this.enquiryProposalsLoading = true;

    this.api
      .getEnquiryProposals(enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (proposals) => {
          this.enquiryProposalsLoading = false;
          this.enquiryProposals = proposals;
        },
        error: () => {
          this.enquiryProposalsLoading = false;
          this.enquiryProposals = [];
        }
      });
  }

  private loadEnquiryDocuments(enquiryId: string): void {
    this.enquiryDocumentsLoading = true;
    this.enquiryDocumentsError = '';

    this.api.getEnquiryDocuments(enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (documents) => {
          this.enquiryDocumentsLoading = false;
          this.enquiryDocuments = [...documents].sort(
            (left, right) => new Date(right.uploadedAtUtc).getTime() - new Date(left.uploadedAtUtc).getTime()
          );
        },
        error: (error) => {
          this.enquiryDocumentsLoading = false;
          this.enquiryDocuments = [];
          this.enquiryDocumentsError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to load enquiry documents.';
        }
      });
  }

  private loadEnquirySustainability(enquiryId: string): void {
    this.sustainabilityLoading = true;
    this.sustainabilityError = '';
    this.sustainabilityMessage = '';

    this.api.getEnquirySustainability(enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.sustainabilityLoading = false;
          this.enquirySustainability = response;
          this.sustainabilityDraft = this.mapSustainabilityResponseToDraft(response);
        },
        error: (error) => {
          this.sustainabilityLoading = false;
          this.enquirySustainability = null;
          this.sustainabilityDraft = this.createDefaultSustainabilityDraft();
          this.sustainabilityError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to load sustainability profile.';
        }
      });
  }

  private loadPaymentSchedule(enquiryId: string, initializeWhenMissing: boolean): void {
    this.paymentScheduleLoading = true;
    this.paymentScheduleError = '';
    this.paymentScheduleMessage = '';

    this.api
      .getPaymentSchedule(enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (schedule) => {
          this.paymentScheduleLoading = false;
          this.paymentSchedule = schedule;
          this.paymentScheduleName = schedule.scheduleName || 'Default';
          this.paymentMilestonesDraft = schedule.milestones.map((milestone) => this.mapMilestoneToDraft(milestone));

          if (
            initializeWhenMissing
            && !this.paymentInitializingDefaults
            && this.canShowPaymentsTab
            && schedule.milestones.length === 0
            && schedule.proposalTotal > 0
          ) {
            this.initializePaymentMilestonesFromTemplate(enquiryId, schedule);
          }
        },
        error: (error) => {
          this.paymentScheduleLoading = false;
          this.paymentSchedule = null;
          this.paymentMilestonesDraft = [];
          this.paymentScheduleError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to load payment milestones.';
        }
      });
  }

  private initializePaymentMilestonesFromTemplate(enquiryId: string, schedule: PaymentScheduleResponse): void {
    if (!this.venueId || !this.selectedEnquiry) {
      return;
    }

    this.paymentInitializingDefaults = true;
    const eventDate = this.toDateOnly(this.selectedEnquiry.eventStartUtc);
    const confirmationDate = this.toDateOnly(new Date().toISOString());

    this.api
      .getPaymentScheduleTemplates(this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (templates) => {
          const template = this.selectPaymentTemplate(templates, this.selectedEnquiry?.eventType ?? '');
          const milestones = template
            ? this.buildMilestonesFromTemplate(template, schedule.proposalTotal, schedule.currencyCode, eventDate, confirmationDate)
            : this.buildFallbackMilestones(schedule.proposalTotal, schedule.currencyCode, eventDate);

          this.persistPaymentSchedule(enquiryId, template?.name ?? 'Auto-generated Schedule', milestones, true);
        },
        error: () => {
          const milestones = this.buildFallbackMilestones(schedule.proposalTotal, schedule.currencyCode, eventDate);
          this.persistPaymentSchedule(enquiryId, 'Auto-generated Schedule', milestones, true);
        }
      });
  }

  addPaymentMilestone(): void {
    const currencyCode = this.paymentSummaryCurrency;
    const presets = [
      { label: 'Deposit', daysBeforeEvent: 180 },
      { label: 'Interim Payment', daysBeforeEvent: 30 },
      { label: 'Final Balance', daysBeforeEvent: 7 },
      { label: 'Post-Event Extras', daysBeforeEvent: -7 }
    ];

    const preset = presets[Math.min(this.paymentMilestonesDraft.length, presets.length - 1)];
    const dueDate = this.calculateDueDateFromEventOffset(preset.daysBeforeEvent);
    const outstanding = Math.max((this.paymentSchedule?.proposalTotal ?? 0) - this.paymentMilestoneDraftTotal, 0);

    this.paymentMilestonesDraft = [
      ...this.paymentMilestonesDraft,
      {
        clientKey: this.nextMilestoneClientKey(),
        label: preset.label,
        dueDate,
        amount: this.roundMoney(outstanding > 0 ? outstanding : 0),
        currencyCode,
        acceptedMethods: 'Online (card),Bank transfer',
        autoReminder: true,
        autoReminderDaysBefore: 2,
        lateReminder: true,
        lateReminderDaysAfter: 2,
        daysBeforeEvent: preset.daysBeforeEvent
      }
    ];
  }

  removePaymentMilestone(clientKey: string): void {
    this.paymentMilestonesDraft = this.paymentMilestonesDraft.filter((milestone) => milestone.clientKey !== clientKey);
  }

  savePaymentMilestones(): void {
    if (!this.selectedEnquiryId) {
      return;
    }

    if (this.paymentMilestonesDraft.length === 0) {
      this.paymentScheduleError = 'Add at least one milestone before saving.';
      return;
    }

    const milestones = this.paymentMilestonesDraft.map((milestone): UpsertPaymentMilestoneRequest => ({
      id: milestone.id ?? null,
      label: milestone.label.trim(),
      dueDate: milestone.dueDate,
      amount: this.roundMoney(this.numberOrZero(milestone.amount)),
      currencyCode: (milestone.currencyCode || this.paymentSummaryCurrency).toUpperCase(),
      acceptedMethods: milestone.acceptedMethods || null,
      autoReminder: milestone.autoReminder,
      autoReminderDaysBefore: milestone.autoReminder ? milestone.autoReminderDaysBefore : null,
      lateReminder: milestone.lateReminder,
      lateReminderDaysAfter: milestone.lateReminder ? milestone.lateReminderDaysAfter : null
    }));

    if (milestones.some((milestone) => !milestone.label || !milestone.dueDate || milestone.amount < 0)) {
      this.paymentScheduleError = 'Each milestone requires a label, due date, and a non-negative amount.';
      return;
    }

    this.persistPaymentSchedule(this.selectedEnquiryId, this.paymentScheduleName || 'Default', milestones, false);
  }

  createPaymentLinkForMilestone(milestoneId: string): void {
    this.paymentCreatingLinkMilestoneId = milestoneId;
    this.paymentScheduleError = '';
    this.paymentScheduleMessage = '';
    const checkoutWindow = window.open('', '_blank', 'noopener,noreferrer');

    const returnUrl = `${window.location.origin}/enquiries?enquiry=${this.selectedEnquiryId ?? ''}&tab=payments&milestone=${milestoneId}`;
    const cancelUrl = returnUrl;

    this.api
      .createPaymentLink(milestoneId, { returnUrl, cancelUrl })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.paymentCreatingLinkMilestoneId = null;
          if (response.paymentUrl) {
            if (checkoutWindow) {
              checkoutWindow.location.href = response.paymentUrl;
            } else {
              window.open(response.paymentUrl, '_blank', 'noopener,noreferrer');
            }
            this.paymentScheduleMessage = 'Payment link created and opened in a new tab.';
          } else {
            if (checkoutWindow) {
              checkoutWindow.close();
            }
            this.paymentScheduleMessage = 'Payment link created.';
          }
          if (this.selectedEnquiryId) {
            this.loadPaymentSchedule(this.selectedEnquiryId, false);
          }
        },
        error: (error) => {
          this.paymentCreatingLinkMilestoneId = null;
          if (checkoutWindow) {
            checkoutWindow.close();
          }
          this.paymentScheduleMessage = '';
          this.paymentScheduleError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to create payment link.';
        }
      });
  }

  openRecordPaymentModal(milestone: PaymentMilestoneDto): void {
    this.recordingPaymentMilestoneId = milestone.id;
    this.showRecordPaymentModal = true;
    this.paymentRecordError = '';
    this.paymentRecordForm.reset({
      receivedDate: this.toDateTimeLocalInput(new Date().toISOString()),
      amount: milestone.balanceRemaining > 0 ? milestone.balanceRemaining : milestone.amount,
      method: 'Bank Transfer',
      reference: '',
      notes: '',
      applyOverpaymentToNextMilestone: true
    });
  }

  closeRecordPaymentModal(): void {
    this.showRecordPaymentModal = false;
    this.recordingPaymentMilestoneId = null;
    this.paymentRecordBusy = false;
    this.paymentRecordError = '';
  }

  submitRecordPayment(): void {
    const milestoneId = this.recordingPaymentMilestoneId;
    if (!milestoneId || !this.paymentSchedule) {
      return;
    }

    const value = this.paymentRecordForm.getRawValue();
    const amount = this.numberOrZero(value.amount);
    if (amount <= 0) {
      this.paymentRecordError = 'Amount must be greater than zero.';
      return;
    }

    const receivedAtUtc = value.receivedDate
      ? new Date(value.receivedDate).toISOString()
      : new Date().toISOString();

    this.paymentRecordBusy = true;
    this.paymentRecordError = '';

    this.api
      .recordPayment(milestoneId, {
        amount,
        currencyCode: this.paymentSchedule.currencyCode,
        method: value.method || 'Bank Transfer',
        reference: (value.reference || '').trim() || undefined,
        notes: (value.notes || '').trim() || undefined,
        receivedAtUtc,
        applyOverpaymentToNextMilestone: !!value.applyOverpaymentToNextMilestone
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (schedule) => {
          this.paymentRecordBusy = false;
          this.showRecordPaymentModal = false;
          this.paymentSchedule = schedule;
          this.paymentScheduleName = schedule.scheduleName || 'Default';
          this.paymentMilestonesDraft = schedule.milestones.map((milestone) => this.mapMilestoneToDraft(milestone));
          if (this.selectedEnquiryId) {
            this.loadEnquiryDetail(this.selectedEnquiryId);
          }
        },
        error: (error) => {
          this.paymentRecordBusy = false;
          this.paymentRecordError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to record payment.';
        }
      });
  }

  generateInvoiceForMilestone(milestoneId: string): void {
    this.paymentGeneratingInvoiceMilestoneId = milestoneId;
    this.paymentScheduleError = '';

    this.api
      .generateMilestoneInvoice(milestoneId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.paymentGeneratingInvoiceMilestoneId = null;
          this.paymentScheduleError = '';
          if (this.selectedEnquiryId) {
            this.loadEnquiryDetail(this.selectedEnquiryId);
          }

          if (result.downloadUrl) {
            window.open(result.downloadUrl, '_blank', 'noopener');
          }
        },
        error: (error) => {
          this.paymentGeneratingInvoiceMilestoneId = null;
          this.paymentScheduleError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to generate invoice.';
        }
      });
  }

  sendPaymentReminderForMilestone(milestoneId: string): void {
    this.paymentSendingReminderMilestoneId = milestoneId;
    this.paymentScheduleError = '';

    this.api
      .sendPaymentReminder(milestoneId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.paymentSendingReminderMilestoneId = null;
          this.showOverviewToast(`Reminder sent to ${result.recipientEmail}`);
          if (this.selectedEnquiryId) {
            this.loadPaymentSchedule(this.selectedEnquiryId, false);
          }
        },
        error: (error) => {
          this.paymentSendingReminderMilestoneId = null;
          this.paymentScheduleError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to send payment reminder.';
        }
      });
  }

  milestonePercentOfContract(milestone: PaymentMilestoneDraft): number {
    const total = this.paymentSchedule?.proposalTotal ?? 0;
    if (total <= 0) {
      return 0;
    }

    return this.roundMoney((this.numberOrZero(milestone.amount) / total) * 100);
  }

  milestoneStatusToken(status: string): string {
    const normalized = (status || '').trim().toLowerCase();
    if (normalized === 'partial' || normalized === 'partially paid') {
      return 'partially-paid';
    }

    if (normalized === 'upcoming' || normalized === 'due') {
      return 'pending';
    }

    return normalized.replace(/\s+/g, '-');
  }

  private normalizeAppointmentStatus(status: string | null | undefined): 'Scheduled' | 'Completed' | 'Cancelled' | 'NoShow' {
    const normalized = (status ?? '').trim().toLowerCase();
    if (normalized === 'completed') {
      return 'Completed';
    }

    if (normalized === 'cancelled' || normalized === 'canceled') {
      return 'Cancelled';
    }

    if (normalized === 'noshow' || normalized === 'no-show' || normalized === 'no show') {
      return 'NoShow';
    }

    return 'Scheduled';
  }

  setMilestoneAmount(milestone: PaymentMilestoneDraft, raw: string): void {
    milestone.amount = this.roundMoney(this.numberOrZero(raw));
  }

  setMilestoneDaysBeforeEvent(milestone: PaymentMilestoneDraft, raw: string): void {
    const parsed = Number(raw);
    milestone.daysBeforeEvent = Number.isFinite(parsed) ? Math.round(parsed) : milestone.daysBeforeEvent;
    milestone.dueDate = this.calculateDueDateFromEventOffset(milestone.daysBeforeEvent);
  }

  isMilestoneOverdue(milestone: PaymentMilestoneDto): boolean {
    return milestone.isOverdue || milestone.status.toLowerCase() === 'overdue';
  }

  isMilestoneOverdueById(milestoneId?: string): boolean {
    const milestone = this.getScheduleMilestone(milestoneId);
    return milestone ? this.isMilestoneOverdue(milestone) : false;
  }

  isMilestoneHighlighted(milestoneId: string): boolean {
    return this.paymentHighlightedMilestoneId === milestoneId;
  }

  getScheduleMilestone(milestoneId?: string): PaymentMilestoneDto | null {
    if (!milestoneId || !this.paymentSchedule) {
      return null;
    }

    return this.paymentSchedule.milestones.find((milestone) => milestone.id === milestoneId) ?? null;
  }

  milestonePaidAmount(milestoneId?: string): number {
    return this.getScheduleMilestone(milestoneId)?.amountPaid ?? 0;
  }

  milestoneBalanceAmount(milestoneId: string | undefined, fallbackAmount: number): number {
    return this.getScheduleMilestone(milestoneId)?.balanceRemaining ?? fallbackAmount;
  }

  milestoneStatusLabel(milestoneId?: string): string {
    const raw = this.getScheduleMilestone(milestoneId)?.status ?? 'Pending';
    if (raw === 'Partial') {
      return 'Partially Paid';
    }

    if (raw === 'Upcoming' || raw === 'Due') {
      return 'Pending';
    }

    return raw;
  }

  openRecordPaymentModalForId(milestoneId?: string): void {
    const milestone = this.getScheduleMilestone(milestoneId);
    if (!milestone) {
      this.paymentScheduleError = 'Milestone not found.';
      return;
    }

    this.openRecordPaymentModal(milestone);
  }

  private persistPaymentSchedule(
    enquiryId: string,
    scheduleName: string,
    milestones: UpsertPaymentMilestoneRequest[],
    silentOnFailure: boolean): void
  {
    this.paymentSavingSchedule = true;
    this.paymentScheduleError = '';

    this.api
      .upsertPaymentSchedule(enquiryId, {
        name: scheduleName,
        milestones
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.paymentSavingSchedule = false;
          this.paymentInitializingDefaults = false;
          this.paymentSchedule = updated;
          this.paymentScheduleName = updated.scheduleName || 'Default';
          this.paymentMilestonesDraft = updated.milestones.map((milestone) => this.mapMilestoneToDraft(milestone));
        },
        error: (error) => {
          this.paymentSavingSchedule = false;
          this.paymentInitializingDefaults = false;
          if (!silentOnFailure) {
            this.paymentScheduleError = typeof error?.error === 'string'
              ? error.error
              : 'Unable to save payment schedule.';
          }
        }
      });
  }

  private mapMilestoneToDraft(milestone: PaymentMilestoneDto): PaymentMilestoneDraft {
    return {
      clientKey: milestone.id,
      id: milestone.id,
      label: milestone.label,
      dueDate: milestone.dueDate,
      amount: milestone.amount,
      currencyCode: milestone.currencyCode,
      acceptedMethods: '',
      autoReminder: false,
      autoReminderDaysBefore: null,
      lateReminder: false,
      lateReminderDaysAfter: null,
      daysBeforeEvent: this.estimateDaysBeforeEvent(milestone.dueDate)
    };
  }

  private buildMilestonesFromTemplate(
    template: PaymentScheduleTemplateSettingDto,
    proposalTotal: number,
    currencyCode: string,
    eventDate: string,
    confirmationDate: string): UpsertPaymentMilestoneRequest[]
  {
    const milestones: UpsertPaymentMilestoneRequest[] = [];
    let allocated = 0;

    template.milestones.forEach((milestone, index) => {
      const rawAmount = milestone.amountType.toLowerCase() === 'fixed'
        ? this.numberOrZero(milestone.amount)
        : proposalTotal * (this.numberOrZero(milestone.amount) / 100);
      let rounded = this.roundMoney(rawAmount);
      if (index === template.milestones.length - 1) {
        rounded = this.roundMoney(proposalTotal - allocated);
      }

      if (rounded <= 0) {
        return;
      }

      allocated += rounded;
      milestones.push({
        id: null,
        label: milestone.name,
        dueDate: this.resolveDueDateRule(milestone.dueDateRule, eventDate, confirmationDate),
        amount: rounded,
        currencyCode,
        acceptedMethods: milestone.paymentMethodsAccepted.join(','),
        autoReminder: milestone.autoReminderEnabled,
        autoReminderDaysBefore: milestone.autoReminderEnabled ? milestone.autoReminderDays : null,
        lateReminder: milestone.lateReminderEnabled,
        lateReminderDaysAfter: milestone.lateReminderEnabled ? milestone.lateReminderDays : null
      });
    });

    return milestones;
  }

  private buildFallbackMilestones(
    proposalTotal: number,
    currencyCode: string,
    eventDate: string): UpsertPaymentMilestoneRequest[]
  {
    const distribution = [
      { label: 'Deposit', percent: 25, daysBeforeEvent: 180 },
      { label: 'Interim Payment', percent: 50, daysBeforeEvent: 30 },
      { label: 'Final Balance', percent: 25, daysBeforeEvent: 7 }
    ];

    let allocated = 0;
    return distribution.map((entry, index) => {
      let amount = this.roundMoney(proposalTotal * (entry.percent / 100));
      if (index === distribution.length - 1) {
        amount = this.roundMoney(proposalTotal - allocated);
      }
      allocated += amount;

      return {
        id: null,
        label: entry.label,
        dueDate: this.subtractDays(eventDate, entry.daysBeforeEvent),
        amount,
        currencyCode,
        acceptedMethods: 'Online (card),Bank transfer',
        autoReminder: true,
        autoReminderDaysBefore: 2,
        lateReminder: true,
        lateReminderDaysAfter: 2
      };
    });
  }

  private selectPaymentTemplate(
    templates: PaymentScheduleTemplateSettingDto[],
    eventType: string): PaymentScheduleTemplateSettingDto | null
  {
    if (templates.length === 0) {
      return null;
    }

    const byTypeDefault = templates.find((template) => template.eventType === eventType && template.isDefault);
    if (byTypeDefault) {
      return byTypeDefault;
    }

    const byTypeAny = templates.find((template) => template.eventType === eventType);
    if (byTypeAny) {
      return byTypeAny;
    }

    return templates.find((template) => template.isDefault) ?? templates[0];
  }

  private executeBulkStatusTransition(targetStatus: string, lostReason?: string, lostReasonDetail?: string, lostAtUtc?: string): void {
    this.bulkActionBusy = true;
    this.bulkActionFeedback = '';
    this.clearBulkUndoState();
    this.startBulkProgress(`Moving to ${targetStatus}`, this.selectedCount);

    this.api
      .bulkTransitionEnquiries({
        enquiryIds: Array.from(this.selectedEnquiryIds),
        targetStatus,
        lostReason,
        lostReasonDetail,
        lostAtUtc
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.pendingBulkStatusValue = '';
          this.pendingSingleStatusTarget = null;
          this.lostReasonModalMode = 'bulk';
          this.bulkLostReason = '';
          this.bulkLostReasonDetail = '';
          this.bulkLostCompetitorName = '';
          this.bulkLostDate = '';
          this.completeBulkProgress(result.requested);
          this.handleBulkActionResult(`moved to ${targetStatus}`, result);
        },
        error: (error) => {
          this.bulkActionBusy = false;
          this.pendingBulkStatusValue = '';
          this.completeBulkProgress(this.bulkProgressCompleted);
          this.bulkActionFeedback =
            typeof error?.error?.error === 'string' ? error.error.error : 'Bulk status change failed. Please try again.';
        }
      });
  }

  private handleBulkActionResult(actionLabel: string, result: BulkActionResultResponse): void {
    this.bulkActionBusy = false;
    const failed = result.failed.length;
    if (failed === 0) {
      this.bulkActionFeedback = `${result.succeeded} enquir${result.succeeded === 1 ? 'y' : 'ies'} ${actionLabel}.`;
    } else {
      this.bulkActionFeedback = `${result.succeeded}/${result.requested} enquir${result.requested === 1 ? 'y' : 'ies'} ${actionLabel}. ${failed} failed.`;
    }

    this.captureBulkUndoState(actionLabel, result);
    this.pendingBulkAssignValue = '';
    this.pendingBulkStatusValue = '';
    this.bulkProgressLabel = '';
    this.bulkProgressCompleted = 0;
    this.bulkProgressTotal = 0;
    if (!this.bulkUndoState) {
      this.clearBulkSelection();
    }
    this.loadEnquiries(this.listResponse?.page.page ?? 1);
    if (this.selectedEnquiryId) {
      this.loadEnquiryDetail(this.selectedEnquiryId);
    }
  }

  private startBulkProgress(label: string, total: number): void {
    this.bulkProgressLabel = label;
    this.bulkProgressTotal = Math.max(0, total);
    this.bulkProgressCompleted = 0;
  }

  private completeBulkProgress(completed: number): void {
    this.bulkProgressCompleted = Math.max(0, Math.min(this.bulkProgressTotal || completed, completed));
  }

  private clearBulkUndoState(): void {
    this.bulkUndoState = null;
    if (this.bulkUndoTimer) {
      clearInterval(this.bulkUndoTimer);
      this.bulkUndoTimer = null;
    }
  }

  private captureBulkUndoState(actionLabel: string, result: BulkActionResultResponse): void {
    this.clearBulkUndoState();

    if (!result.undoToken || !result.undoExpiresAtUtc) {
      return;
    }

    const expiresAt = new Date(result.undoExpiresAtUtc);
    if (Number.isNaN(expiresAt.getTime())) {
      return;
    }

    const nextState: BulkUndoState = {
      token: result.undoToken,
      actionLabel,
      expiresAtUtc: result.undoExpiresAtUtc,
      secondsRemaining: Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / 1000))
    };

    if (nextState.secondsRemaining <= 0) {
      return;
    }

    this.bulkUndoState = nextState;
    this.bulkUndoTimer = setInterval(() => {
      if (!this.bulkUndoState) {
        this.clearBulkUndoState();
        return;
      }

      const remaining = Math.max(0, Math.ceil((new Date(this.bulkUndoState.expiresAtUtc).getTime() - Date.now()) / 1000));
      if (remaining <= 0) {
        this.clearBulkUndoState();
        return;
      }

      this.bulkUndoState = {
        ...this.bulkUndoState,
        secondsRemaining: remaining
      };
    }, 1000);
  }

  private clearMergeQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        mergeA: null,
        mergeB: null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private tryOpenMergeModalFromQuery(): void {
    if (this.showMergeModal || this.loadingMergeModal || this.pendingMergeIdsFromQuery.length !== 2) {
      return;
    }

    const [first, second] = this.pendingMergeIdsFromQuery;
    if (!first || !second || first === second) {
      this.pendingMergeIdsFromQuery = [];
      this.clearMergeQueryParams();
      return;
    }

    this.pendingMergeIdsFromQuery = [];
    this.openMergeModalForIds(first, second, true);
  }

  private openMergeModalForIds(firstEnquiryId: string, secondEnquiryId: string, clearQueryParamsOnOpen: boolean): void {
    if (!firstEnquiryId || !secondEnquiryId || firstEnquiryId === secondEnquiryId) {
      return;
    }

    this.loadingMergeModal = true;
    this.showMergeModal = true;
    this.mergeError = '';
    this.mergePrimaryDetail = null;
    this.mergeSecondaryDetail = null;
    this.mergeFieldSources = {};

    forkJoin([
      this.api.getEnquiry(firstEnquiryId),
      this.api.getEnquiry(secondEnquiryId)
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([first, second]) => {
          this.loadingMergeModal = false;
          this.mergePrimaryDetail = first;
          this.mergeSecondaryDetail = second;
          this.mergeFieldSources = Object.fromEntries(this.mergeFieldDefinitions.map((field) => [field.key, 'primary']));
          if (clearQueryParamsOnOpen) {
            this.clearMergeQueryParams();
          }
        },
        error: (error) => {
          this.loadingMergeModal = false;
          this.showMergeModal = false;
          this.mergeError = typeof error?.error?.error === 'string'
            ? error.error.error
            : 'Unable to load selected enquiries for merge.';
          this.clearMergeQueryParams();
        }
      });
  }

  private ensureActivityRealtimeSubscription(): void {
    if (this.activityRealtimeSubscribed) {
      return;
    }

    this.activityRealtimeSubscribed = true;
    this.activityRealtime.events$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.scheduleActivityReload();
      });
  }

  private scheduleActivityReload(): void {
    if (!this.selectedEnquiryId || this.detailTab !== 'activity') {
      return;
    }

    if (this.activityReloadTimer) {
      clearTimeout(this.activityReloadTimer);
    }

    this.activityReloadTimer = setTimeout(() => {
      this.loadEnquiryActivity(true);
    }, 450);
  }

  private loadEnquiryActivity(reset: boolean): void {
    if (!this.selectedEnquiryId) {
      return;
    }

    const page = reset ? 1 : this.activityPage + 1;
    if (reset) {
      this.activityError = '';
      this.activityLoading = true;
      this.activityLoadingMore = false;
    } else {
      this.activityLoadingMore = true;
    }

    this.api.getEnquiryActivity(this.selectedEnquiryId, {
      actionCategory: this.activityFilters.actionCategory,
      userId: this.activityFilters.userId || undefined,
      fromDate: this.activityFilters.fromDate || undefined,
      toDate: this.activityFilters.toDate || undefined,
      page,
      pageSize: this.activityPageSize
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.activityLoading = false;
          this.activityLoadingMore = false;
          this.activityPage = response.page;
          this.activityHasMore = response.hasMore;
          this.activityTotalCount = response.totalCount;
          this.activityEntries = reset
            ? response.items
            : [...this.activityEntries, ...response.items];
        },
        error: () => {
          this.activityLoading = false;
          this.activityLoadingMore = false;
          this.activityError = 'Unable to load activity.';
          if (reset) {
            this.activityEntries = [];
            this.activityHasMore = false;
            this.activityTotalCount = 0;
          }
        }
      });
  }

  private resetEnquiryActivityState(): void {
    if (this.activityReloadTimer) {
      clearTimeout(this.activityReloadTimer);
      this.activityReloadTimer = null;
    }

    this.activityEntries = [];
    this.activityLoading = false;
    this.activityLoadingMore = false;
    this.activityHasMore = false;
    this.activityTotalCount = 0;
    this.activityError = '';
    this.activityPage = 1;
  }

  private ensureLostReasonsLoaded(venueId: string): void {
    if (this.loadingLostReasons || this.loadedLostReasonsVenueId === venueId) {
      return;
    }

    this.loadingLostReasons = true;
    this.api
      .getLostReasons(venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (reasons: LostReasonSettingDto[]) => {
          this.loadingLostReasons = false;
          this.loadedLostReasonsVenueId = venueId;
          const activeLabels = reasons
            .filter((reason) => reason.isActive && !!reason.label?.trim())
            .sort((left, right) => left.sortOrder - right.sortOrder)
            .map((reason) => reason.label.trim());

          this.lostReasonChoices = activeLabels;
        },
        error: () => {
          this.loadingLostReasons = false;
          this.loadedLostReasonsVenueId = venueId;
          this.lostReasonChoices = [];
        }
      });
  }

  private ensureAssignableUsersLoaded(venueId: string): void {
    if (this.loadedAssignableUsersVenueId === venueId || this.loadingAssignableUsers) {
      return;
    }

    this.loadingAssignableUsers = true;
    this.api
      .getUsers(venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.loadingAssignableUsers = false;
          this.loadedAssignableUsersVenueId = venueId;
          this.assignableUsers = users
            .filter((user) => user.isActive)
            .sort((left, right) =>
              `${left.firstName} ${left.lastName}`.localeCompare(`${right.firstName} ${right.lastName}`, undefined, {
                sensitivity: 'base'
              })
            );
        },
        error: () => {
          this.loadingAssignableUsers = false;
          this.assignableUsers = [];
        }
      });
  }

  private queueDocumentFile(file: File): void {
    this.documentUploadError = '';

    const validationError = this.validateDocumentFile(file);
    if (validationError) {
      this.documentPendingFile = null;
      this.documentUploadError = validationError;
      return;
    }

    this.documentPendingFile = file;
  }

  private validateDocumentFile(file: File): string | null {
    if (file.size <= 0) {
      return 'Selected file is empty.';
    }

    if (file.size > this.maxDocumentBytes) {
      return 'File size cannot exceed 25MB.';
    }

    const extension = this.fileExtension(file.name);
    if (!extension || !this.allowedDocumentExtensions.includes(extension)) {
      return 'Unsupported file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, CSV.';
    }

    return null;
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        const marker = 'base64,';
        const markerIndex = result.indexOf(marker);
        if (markerIndex < 0) {
          reject(new Error('Unable to parse file payload.'));
          return;
        }

        resolve(result.slice(markerIndex + marker.length));
      };
      reader.onerror = () => reject(reader.error ?? new Error('Unable to read file.'));
      reader.readAsDataURL(file);
    });
  }

  private fileExtension(fileName: string): string {
    const normalized = (fileName || '').toLowerCase().trim();
    const lastDot = normalized.lastIndexOf('.');
    if (lastDot < 0 || lastDot === normalized.length - 1) {
      return '';
    }

    return normalized.slice(lastDot + 1);
  }

  private resolveDocumentMimeType(file: File): string {
    if (file.type) {
      return file.type;
    }

    switch (this.fileExtension(file.name)) {
      case 'pdf':
        return 'application/pdf';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'csv':
        return 'text/csv';
      default:
        return 'application/octet-stream';
    }
  }

  humanFileSize(size: number): string {
    if (!Number.isFinite(size) || size <= 0) {
      return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    let value = size;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }

    const rounded = unitIndex === 0 ? Math.round(value) : Math.round(value * 10) / 10;
    return `${rounded} ${units[unitIndex]}`;
  }

  private syncBulkSelectionToVisibleRows(): void {
    if (this.selectedEnquiryIds.size === 0) {
      return;
    }
    // Keep cross-page selections (including "select all matching") intact.
    this.selectedEnquiryIds = new Set(this.selectedEnquiryIds);
  }

  private applyBulkEmailMergeFields(template: string, recipient: BulkEmailRecipient): string {
    const formattedDate = recipient.eventDate
      ? new Date(recipient.eventDate).toLocaleDateString('en-GB')
      : '';

    return template
      .replaceAll('{contact_name}', recipient.name || '')
      .replaceAll('{event_name}', recipient.eventName || '')
      .replaceAll('{event_date}', formattedDate);
  }

  private escapeCsv(value: string): string {
    const stringValue = `${value ?? ''}`;
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }
}
