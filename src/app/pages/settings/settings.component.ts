import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { QuillModule } from 'ngx-quill';
import { forkJoin } from 'rxjs';
import {
  AutomationActionDto,
  AutomationConditionDto,
  AutomationExecutionLogDto,
  AutomationRuleDto,
  AutomationSettingsDto,
  AutomationTriggerDto,
  CalendarAccountSettingDto,
  ContactCustomFieldDefinitionDto,
  FinancialReferenceSettingsDto,
  ApiService,
  BudgetByEventTypeDto,
  BudgetMonthDto,
  LostReasonSettingDto,
  NotificationPreferenceMatrixRowDto,
  ReportScheduleDto,
  ReportDefinitionDto,
  ReportScheduleExecutionLogDto,
  PaymentScheduleTemplateSettingDto,
  PlanningMilestoneSettingDto,
  ProposalPdfSettingsDto,
  ProposalTemplateSettingDto,
  ReportConfigurationSettingDto,
  SustainabilityEmissionFactorDto,
  SustainabilityEnergyRatingFactorDto,
  SustainabilitySettingsDto,
  SpaceCapacityDto,
  SpaceCombinationDto,
  SpacePricingDto,
  SpaceSummaryDto,
  TermsAndConditionsDto,
  TaskTemplateDto,
  UpdateVenueProfileRequest,
  UserActivityItemDto,
  UserSummaryDto,
  VenueEmailTemplateDto,
  VenueEmailAccountDto,
  NylasStatusDto,
  WebsiteFormSettingDto,
  VenueProfileDto
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

type SettingsSectionKey =
  | 'venue-profile'
  | 'spaces'
  | 'budgets'
  | 'payment-schedules'
  | 'terms'
  | 'proposal-templates'
  | 'planning-milestones'
  | 'sustainability'
  | 'lost-reasons'
  | 'report-configuration'
  | 'notifications'
  | 'automation'
  | 'guest-profiles'
  | 'email-templates'
  | 'website-forms'
  | 'calendar-accounts'
  | 'task-templates'
  | 'report-schedules'
  | 'email-accounts'
  | 'users';

interface SettingsSection {
  key: SettingsSectionKey;
  title: string;
  description: string;
}

interface SectionState {
  loading: boolean;
  saving: boolean;
  error: string;
  success: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, DatePipe, DecimalPipe, QuillModule, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  readonly sections: SettingsSection[] = [
    {
      key: 'venue-profile',
      title: 'Venue Profile',
      description: 'Branding, legal details, VAT defaults, locale, and hold settings.'
    },
    {
      key: 'spaces',
      title: 'Spaces & Combinations',
      description: 'Manage spaces, capacities, pricing rules, and linked room combinations.'
    },
    {
      key: 'budgets',
      title: 'Budgets & Targets',
      description: 'Set monthly revenue targets by event type and import annual budgets from CSV.'
    },
    {
      key: 'payment-schedules',
      title: 'Payment Schedules',
      description: 'Configure default milestone templates by event type for future proposals.'
    },
    {
      key: 'terms',
      title: 'Terms & Conditions',
      description: 'Prepare reusable, versioned terms content for proposal and contract workflows.'
    },
    {
      key: 'proposal-templates',
      title: 'Proposal Templates',
      description: 'Configure reusable proposal templates by event type with default pricing and copy.'
    },
    {
      key: 'planning-milestones',
      title: 'Planning Milestones',
      description: 'Define planning progress checkpoints used on event cards and payment views.'
    },
    {
      key: 'sustainability',
      title: 'Sustainability & ESG',
      description: 'Configure carbon factors, waste/diversion targets, and ESG weighting used for enquiry scorecards.'
    },
    {
      key: 'lost-reasons',
      title: 'Lost Reasons',
      description: 'Manage reasons used when enquiries are moved to Lost for conversion reporting.'
    },
    {
      key: 'report-configuration',
      title: 'Report Configuration',
      description: 'Set pace/forecast conversion weights used by pipeline and pace reporting.'
    },
    {
      key: 'notifications',
      title: 'Notifications',
      description: 'Configure trigger-based delivery channels for in-app, operator email, and client email notifications.'
    },
    {
      key: 'automation',
      title: 'Automation',
      description: 'Build and manage trigger-condition-action rules, defaults, and automation execution history.'
    },
    {
      key: 'guest-profiles',
      title: 'Guest Profiles',
      description: 'Configure custom profile fields, tagging defaults, and personalisation metadata.'
    },
    {
      key: 'email-templates',
      title: 'Email Templates',
      description: 'Manage venue-branded outbound templates with merge field placeholders.'
    },
    {
      key: 'website-forms',
      title: 'Website Forms',
      description: 'Configure embeddable website enquiry forms, required fields, and style settings.'
    },
    {
      key: 'calendar-accounts',
      title: 'Calendar Accounts',
      description: 'Manage connected calendar accounts and provisional hold sync behaviour.'
    },
    {
      key: 'task-templates',
      title: 'Task Templates',
      description: 'Define status-triggered task templates for operational follow-through.'
    },
    {
      key: 'report-schedules',
      title: 'Report Schedules',
      description: 'Configure automated report delivery cadence and recipients.'
    },
    {
      key: 'email-accounts',
      title: 'Email Accounts',
      description: 'Manage connected venue inboxes used for Connect and outbound communication.'
    },
    {
      key: 'users',
      title: 'Users & Roles',
      description: 'Invite users, manage status, and review user activity for the selected venue.'
    }
  ];

  readonly holdAutoReleaseModes = ['NotifyOnly', 'AutoReleaseNotifyOperator', 'AutoReleaseNotifyBoth'];
  readonly roleOptions = [
    'GroupAdmin',
    'VenueAdmin',
    'SalesManager',
    'EventsCoordinator',
    'Finance',
    'Operations',
    'ReadOnly'
  ];
  readonly defaultEventTypes = ['Wedding', 'Corporate Conference', 'Private Dining', 'Christmas Party', 'Other'];
  readonly setupStyles = ['Theatre', 'Banquet', 'Boardroom', 'Cabaret', 'Reception', 'Classroom', 'U-Shape', 'Custom'];
  readonly pricingRateTypes = ['PerHour', 'HalfDay', 'FullDay', 'Evening', 'DelegateRate'];
  readonly dayOfWeekOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  readonly proposalAcceptedStatuses = ['Provisional', 'Confirmed'];
  readonly enquiryStatuses = ['New', 'Tentative', 'OpenProposal', 'Provisional', 'Confirmed', 'Completed', 'Lost', 'Archived'];
  readonly automationTriggerOptions = [
    { value: 'EnquiryCreated', label: 'Enquiry created' },
    { value: 'WebFormSubmission', label: 'Website form submission' },
    { value: 'StatusChanged', label: 'Status changed to' },
    { value: 'DaysSinceLastActivity', label: 'Days since last activity = N' },
    { value: 'PaymentMilestoneOverdue', label: 'Payment milestone overdue' },
    { value: 'ProposalSent', label: 'Proposal sent' },
    { value: 'ProposalAccepted', label: 'Proposal accepted' },
    { value: 'EventDateMinusDays', label: 'Event date minus N days' }
  ];
  readonly automationConditionTypeOptions = [
    { value: 'EventType', label: 'Event type is' },
    { value: 'Value', label: 'Value greater/less than' },
    { value: 'Source', label: 'Source is' },
    { value: 'AssignedTo', label: 'Assigned to' },
    { value: 'Space', label: 'Space is' },
    { value: 'Status', label: 'Status is' }
  ];
  readonly automationConditionOperatorOptions = [
    { value: 'Equals', label: 'Equals' },
    { value: 'GreaterThan', label: 'Greater than' },
    { value: 'LessThan', label: 'Less than' }
  ];
  readonly automationActionOptions = [
    { value: 'ChangeStatus', label: 'Change status' },
    { value: 'SendEmailTemplate', label: 'Send email template' },
    { value: 'CreateTask', label: 'Create task' },
    { value: 'AssignUser', label: 'Assign user' },
    { value: 'AddInternalNote', label: 'Add internal note' },
    { value: 'SendNotification', label: 'Send notification' },
    { value: 'ArchiveEnquiry', label: 'Archive enquiry' }
  ];
  readonly taskTemplateAutoApplyOptions = [
    { value: 'none', label: 'None' },
    { value: 'provisional', label: 'Provisional' },
    { value: 'confirmed', label: 'Confirmed' }
  ];
  readonly taskTemplatePriorityOptions = ['low', 'medium', 'high', 'urgent'];
  readonly taskTemplateCategoryOptions = [
    'follow_up',
    'site_visit',
    'document',
    'payment',
    'catering',
    'setup',
    'communication',
    'internal',
    'other'
  ];
  readonly emailTemplateCategories = ['Acknowledgement', 'Proposal', 'Payment', 'Follow-up', 'Custom'];
  readonly emailTemplateMergeFields = [
    'client_name',
    'client_first_name',
    'event_date',
    'venue_name',
    'proposal_link',
    'payment_link',
    'portal_link',
    'enquiry_ref',
    'operator_name',
    'total_value',
    'deposit_amount',
    'hold_expiry_date',
    'guest_count'
  ];
  readonly taskTemplateAssigneeRoleOptions = [
    'owner',
    'EventsCoordinator',
    'SalesManager',
    'VenueAdmin',
    'Operations',
    'Finance'
  ];
  readonly reportScheduleFrequencyOptions = ['daily', 'weekly', 'monthly'];
  readonly reportScheduleFormatOptions: Array<'csv' | 'pdf' | 'both'> = ['csv', 'pdf', 'both'];
  readonly reportScheduleReportKeys = [
    'sales-performance',
    'pipeline-conversion',
    'revenue-forecast',
    'source-analysis',
    'lost-reason-analysis',
    'sustainability',
    'pace'
  ];
  readonly reportScheduleDayOptions = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 0, label: 'Sunday' }
  ];
  readonly termsEditorModules = {
    toolbar: [
      [{ header: [2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean']
    ]
  };
  readonly sustainabilityEnergyRatings = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  activeSectionKey: SettingsSectionKey = 'venue-profile';
  selectedVenueId: string | null = null;
  sectionStates: Record<SettingsSectionKey, SectionState> = {
    'venue-profile': { loading: false, saving: false, error: '', success: '' },
    spaces: { loading: false, saving: false, error: '', success: '' },
    budgets: { loading: false, saving: false, error: '', success: '' },
    'payment-schedules': { loading: false, saving: false, error: '', success: '' },
    terms: { loading: false, saving: false, error: '', success: '' },
    'proposal-templates': { loading: false, saving: false, error: '', success: '' },
    'planning-milestones': { loading: false, saving: false, error: '', success: '' },
    sustainability: { loading: false, saving: false, error: '', success: '' },
    'lost-reasons': { loading: false, saving: false, error: '', success: '' },
    'report-configuration': { loading: false, saving: false, error: '', success: '' },
    notifications: { loading: false, saving: false, error: '', success: '' },
    automation: { loading: false, saving: false, error: '', success: '' },
    'guest-profiles': { loading: false, saving: false, error: '', success: '' },
    'email-templates': { loading: false, saving: false, error: '', success: '' },
    'website-forms': { loading: false, saving: false, error: '', success: '' },
    'calendar-accounts': { loading: false, saving: false, error: '', success: '' },
    'task-templates': { loading: false, saving: false, error: '', success: '' },
    'report-schedules': { loading: false, saving: false, error: '', success: '' },
    'email-accounts': { loading: false, saving: false, error: '', success: '' },
    users: { loading: false, saving: false, error: '', success: '' }
  };

  private loadedSections = new Set<SettingsSectionKey>();

  venueProfile: VenueProfileDto | null = null;
  spaces: SpaceSummaryDto[] = [];
  combinations: SpaceCombinationDto[] = [];
  users: UserSummaryDto[] = [];
  userActivity: UserActivityItemDto[] = [];
  budgets: BudgetMonthDto[] = [];

  editingSpaceId: string | null = null;
  editingCombinationId: string | null = null;
  selectedBudgetMonth = new Date().getMonth() + 1;
  selectedBudgetYear = new Date().getFullYear();
  selectedBudgetCsvFile: File | null = null;
  inviteDebugToken = '';

  paymentScheduleTemplates: PaymentScheduleTemplateSettingDto[] = [];
  paymentTemplateMilestoneDrafts: PaymentScheduleTemplateSettingDto['milestones'] = [];
  selectedPaymentTemplateCloneEventType = '';
  financialReferenceSettings: FinancialReferenceSettingsDto = {
    invoicePrefix: 'INV',
    creditNotePrefix: 'CN',
    receiptPrefix: 'RCT'
  };
  readonly paymentDueDateRuleOptions = [
    'On confirmation',
    '7 days after confirmation',
    '14 days after confirmation',
    '30 days before event',
    '14 days before event',
    '7 days before event',
    'On event date',
    '7 days after event'
  ];
  readonly paymentAmountTypeOptions = ['Percentage', 'Fixed'];
  termsDocuments: TermsAndConditionsDto[] = [];
  termsVersionHistory: TermsAndConditionsDto[] = [];
  selectedTermsSeriesId: string | null = null;
  selectedTermsViewId: string | null = null;
  selectedTermsDiffLeftId: string | null = null;
  selectedTermsDiffRightId: string | null = null;
  termsDraftSourceId: string | null = null;
  proposalTemplates: ProposalTemplateSettingDto[] = [];
  proposalPdfSettings: ProposalPdfSettingsDto = { paperSize: 'A4' };
  planningMilestones: PlanningMilestoneSettingDto[] = [];
  sustainabilityEmissionFactors: SustainabilityEmissionFactorDto[] = [];
  sustainabilityEnergyRatingMultipliers: SustainabilityEnergyRatingFactorDto[] = [];
  lostReasons: LostReasonSettingDto[] = [];
  automationRules: AutomationRuleDto[] = [];
  automationExecutionLog: AutomationExecutionLogDto[] = [];
  notificationMatrixRows: NotificationPreferenceMatrixRowDto[] = [];
  editingAutomationRuleId: string | null = null;
  guestProfileCustomFields: ContactCustomFieldDefinitionDto[] = [];
  emailTemplates: VenueEmailTemplateDto[] = [];
  websiteForms: WebsiteFormSettingDto[] = [];
  calendarAccounts: CalendarAccountSettingDto[] = [];
  taskTemplates: TaskTemplateDto[] = [];
  reportSchedules: ReportScheduleDto[] = [];
  reportCatalog: ReportDefinitionDto[] = [];
  scheduleExecutionLogs: ReportScheduleExecutionLogDto[] = [];
  activeExecutionScheduleId: string | null = null;
  runningScheduleId: string | null = null;
  emailAccounts: VenueEmailAccountDto[] = [];
  editingEmailAccountId: string | null = null;
  nylasStatus: NylasStatusDto | null = null;
  nylasPopup: Window | null = null;

  readonly venueForm = this.formBuilder.group({
    name: ['', Validators.required],
    legalEntityName: [''],
    addressLine1: [''],
    addressLine2: [''],
    city: [''],
    region: [''],
    postcode: [''],
    countryCode: ['GB', Validators.required],
    phoneNumberE164: [''],
    enquiriesEmail: ['', Validators.email],
    websiteUrl: [''],
    vatNumber: [''],
    companyRegistrationNumber: [''],
    logoUrl: [''],
    description: [''],
    cancellationPolicy: [''],
    currencyCode: ['GBP', Validators.required],
    defaultVatRate: [20, [Validators.required, Validators.min(0)]],
    timeZone: ['Europe/London', Validators.required],
    locale: ['en-GB', Validators.required],
    minimumBookingNoticeDays: [0, [Validators.required, Validators.min(0)]],
    defaultHoldPeriodDays: [7, [Validators.required, Validators.min(1)]],
    holdWarningDays: [2, [Validators.required, Validators.min(0)]],
    holdAutoReleaseMode: ['NotifyOnly', Validators.required],
    maxHoldsPerDateAndSpace: [1, [Validators.required, Validators.min(1)]]
  });

  readonly spaceForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    locationText: [''],
    floorAreaSqm: [null as number | null],
    facilitiesCsv: [''],
    minimumSpendAmount: [null as number | null],
    minimumSpendCurrencyCode: ['GBP', Validators.required],
    turnaroundMinutes: [60, [Validators.required, Validators.min(0)]],
    isActive: [true],
    capacityBySetup: this.formBuilder.array([]),
    pricing: this.formBuilder.array([])
  });

  readonly combinationForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    priceAmount: [null as number | null],
    currencyCode: ['GBP', Validators.required],
    spaceIds: [[] as string[]],
    capacityBySetup: this.formBuilder.array([])
  });

  readonly inviteForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumberE164: [''],
    role: ['EventsCoordinator', Validators.required],
    requiresTotp: [false]
  });

  readonly paymentTemplateForm = this.formBuilder.group({
    id: [''],
    name: ['', Validators.required],
    eventType: ['Wedding', Validators.required],
    isDefault: [false]
  });

  readonly financialReferenceForm = this.formBuilder.group({
    invoicePrefix: ['INV', [Validators.required, Validators.maxLength(20)]],
    creditNotePrefix: ['CN', [Validators.required, Validators.maxLength(20)]],
    receiptPrefix: ['RCT', [Validators.required, Validators.maxLength(20)]]
  });

  readonly termsForm = this.formBuilder.group({
    draftId: [''],
    title: ['', Validators.required],
    eventTypesCsv: ['Wedding', Validators.required],
    content: ['', [Validators.required, Validators.minLength(40)]]
  });

  readonly proposalTemplateForm = this.formBuilder.group({
    key: ['', Validators.required],
    label: ['', Validators.required],
    eventType: ['Wedding', Validators.required],
    defaultValidityDays: [14, [Validators.required, Validators.min(1), Validators.max(365)]],
    defaultIntroduction: [''],
    defaultTermsVersion: ['v1'],
    itemCategory: ['Room Hire', Validators.required],
    itemDescription: ['', Validators.required],
    itemQuantity: [1, [Validators.required, Validators.min(0.01)]],
    itemUnit: ['Flat rate', Validators.required],
    itemUnitPriceExclVat: [0, [Validators.required, Validators.min(0)]],
    itemVatRate: [20, [Validators.required, Validators.min(0)]],
    itemDiscountPercent: [0, [Validators.min(0)]],
    itemDiscountAmount: [0, [Validators.min(0)]]
  });

  readonly planningMilestoneForm = this.formBuilder.group({
    key: ['', Validators.required],
    label: ['', Validators.required],
    isEnabled: [true]
  });

  readonly sustainabilityForm = this.formBuilder.group({
    travelKgCo2ePerGuestKm: [0.18, [Validators.required, Validators.min(0), Validators.max(10)]],
    carbonTargetKgPerGuest: [12, [Validators.required, Validators.min(0.1), Validators.max(500)]],
    wasteTargetKgPerGuest: [1.6, [Validators.required, Validators.min(0.01), Validators.max(500)]],
    diversionTargetPercent: [60, [Validators.required, Validators.min(0), Validators.max(100)]],
    localSourcingRadiusMiles: [50, [Validators.required, Validators.min(1), Validators.max(500)]],
    carbonWeightPercent: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    wasteWeightPercent: [30, [Validators.required, Validators.min(0), Validators.max(100)]],
    sourcingWeightPercent: [20, [Validators.required, Validators.min(0), Validators.max(100)]],
    includeInProposalByDefault: [false]
  });

  readonly lostReasonForm = this.formBuilder.group({
    id: [''],
    label: ['', Validators.required],
    isActive: [true]
  });

  readonly reportConfigurationForm = this.formBuilder.group({
    provisionalWeightPercent: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    tentativeWeightPercent: [20, [Validators.required, Validators.min(0), Validators.max(100)]],
    openProposalWeightPercent: [30, [Validators.required, Validators.min(0), Validators.max(100)]],
    responseTimeWeightPercent: [20, [Validators.required, Validators.min(0), Validators.max(100)]],
    leadSourceWeightPercent: [15, [Validators.required, Validators.min(0), Validators.max(100)]],
    eventTypeWeightPercent: [15, [Validators.required, Validators.min(0), Validators.max(100)]],
    engagementWeightPercent: [20, [Validators.required, Validators.min(0), Validators.max(100)]],
    budgetAlignmentWeightPercent: [10, [Validators.required, Validators.min(0), Validators.max(100)]],
    leadTimeWeightPercent: [10, [Validators.required, Validators.min(0), Validators.max(100)]],
    completenessWeightPercent: [10, [Validators.required, Validators.min(0), Validators.max(100)]]
  });

  readonly automationSettingsForm = this.formBuilder.group({
    proposalAcceptedTargetStatus: ['Provisional', Validators.required],
    followUpInactiveDays: [3, [Validators.required, Validators.min(1), Validators.max(30)]],
    autoArchiveEnabled: [true],
    autoArchiveDays: [90, [Validators.required, Validators.min(7), Validators.max(3650)]]
  });

  readonly automationRuleForm = this.formBuilder.group({
    id: [''],
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
    triggerType: ['StatusChanged', Validators.required],
    triggerStatus: ['Tentative'],
    triggerDays: [null as number | null, [Validators.min(1), Validators.max(3650)]],
    conditions: this.formBuilder.array([]),
    actions: this.formBuilder.array([])
  });

  readonly emailAccountForm = this.formBuilder.group({
    address: ['', [Validators.required, Validators.email]],
    provider: ['Nylas', Validators.required],
    externalAccountReference: [''],
    isActive: [true],
    useForOutbound: [true]
  });

  readonly emailTemplateForm = this.formBuilder.group({
    key: ['', Validators.required],
    name: ['', Validators.required],
    subjectTemplate: ['', Validators.required],
    bodyHtmlTemplate: ['', Validators.required],
    category: ['Custom', Validators.required],
    isActive: [true]
  });

  readonly websiteFormForm = this.formBuilder.group({
    id: [''],
    name: ['', Validators.required],
    slug: ['', Validators.required],
    isActive: [true],
    successMessage: ['Thank you. We have received your enquiry.', Validators.required],
    redirectUrl: [''],
    requiredFieldsCsv: ['firstName,lastName,email,phone,eventDate,guestsExpected,dataConsent', Validators.required],
    optionalFieldsCsv: ['eventStyle,budgetRange,specialRequirements,marketingConsent'],
    styleJson: ['{"primaryColor":"#2563eb","buttonLabel":"Send Enquiry"}']
  });

  readonly calendarAccountForm = this.formBuilder.group({
    id: [''],
    address: ['', [Validators.required, Validators.email]],
    provider: ['Nylas', Validators.required],
    externalCalendarId: [''],
    isActive: [true],
    syncProvisionalHolds: [true],
    connectionStatus: ['connected', Validators.required]
  });

  readonly taskTemplateForm = this.formBuilder.group({
    id: [''],
    name: ['', Validators.required],
    eventType: ['Wedding', Validators.required],
    description: [''],
    isActive: [true],
    autoApplyOnStatus: ['none', Validators.required],
    taskItems: this.formBuilder.array([])
  });

  readonly reportScheduleForm = this.formBuilder.group({
    id: [''],
    name: ['', Validators.required],
    reportKeys: this.formBuilder.control<string[]>(['sales-performance'], { nonNullable: true, validators: [Validators.required] }),
    frequency: ['weekly', Validators.required],
    dayOfWeek: [1 as number | null],
    dayOfMonth: [null as number | null],
    timeOfDay: ['09:00', Validators.required],
    format: ['both' as 'csv' | 'pdf' | 'both', Validators.required],
    recipientsCsv: ['', Validators.required],
    isActive: [true],
    nextRunAtUtc: [''],
    eventType: [''],
    fromDate: [''],
    toDate: ['']
  });

  private budgetForms = new Map<number, FormGroup>();
  private readonly nylasMessageHandler = (event: MessageEvent) => this.handleNylasMessage(event);

  get activeSection(): SettingsSection {
    return this.sections.find((section) => section.key === this.activeSectionKey) ?? this.sections[0];
  }

  get venueName(): string {
    const venueId = this.auth.selectedVenueId;
    return this.auth.session?.venueRoles.find((role) => role.venueId === venueId)?.venueName ?? 'Current venue';
  }

  get monthNumbers(): number[] {
    return Array.from({ length: 12 }, (_, index) => index + 1);
  }

  get spaceCapacityControls(): FormArray {
    return this.spaceForm.get('capacityBySetup') as FormArray;
  }

  get spacePricingControls(): FormArray {
    return this.spaceForm.get('pricing') as FormArray;
  }

  get combinationCapacityControls(): FormArray {
    return this.combinationForm.get('capacityBySetup') as FormArray;
  }

  get automationConditionControls(): FormArray {
    return this.automationRuleForm.get('conditions') as FormArray;
  }

  get automationActionControls(): FormArray {
    return this.automationRuleForm.get('actions') as FormArray;
  }

  get taskTemplateItemControls(): FormArray {
    return this.taskTemplateForm.get('taskItems') as FormArray;
  }

  get currentBudgetForm(): FormGroup | null {
    return this.getBudgetForm(this.selectedBudgetMonth);
  }

  get conversionScoringWeightTotal(): number {
    const value = this.reportConfigurationForm.getRawValue();
    const fields = [
      value.responseTimeWeightPercent,
      value.leadSourceWeightPercent,
      value.eventTypeWeightPercent,
      value.engagementWeightPercent,
      value.budgetAlignmentWeightPercent,
      value.leadTimeWeightPercent,
      value.completenessWeightPercent
    ];

    return Number(
      fields
        .map((item) => Number(item ?? 0))
        .reduce((sum, current) => sum + (Number.isFinite(current) ? current : 0), 0)
      .toFixed(2)
    );
  }

  get sustainabilityWeightTotal(): number {
    const value = this.sustainabilityForm.getRawValue();
    const fields = [
      value.carbonWeightPercent,
      value.wasteWeightPercent,
      value.sourcingWeightPercent
    ];

    return Number(
      fields
        .map((item) => Number(item ?? 0))
        .reduce((sum, current) => sum + (Number.isFinite(current) ? current : 0), 0)
        .toFixed(2)
    );
  }

  ngOnInit(): void {
    window.addEventListener('message', this.nylasMessageHandler);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('message', this.nylasMessageHandler);
      if (this.nylasPopup && !this.nylasPopup.closed) {
        this.nylasPopup.close();
      }
      this.nylasPopup = null;
    });

    this.startNewAutomationRule();
    this.startNewTaskTemplate();
    this.startNewReportSchedule();

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const section = params.get('section') as SettingsSectionKey | null;
      if (section && this.sections.some((item) => item.key === section)) {
        this.activeSectionKey = section;
      } else {
        this.activeSectionKey = 'venue-profile';
      }

      this.ensureSectionLoaded(this.activeSectionKey);
    });

    this.auth.session$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((session) => {
      const nextVenueId = session?.venueId ?? null;
      if (nextVenueId === this.selectedVenueId) {
        return;
      }

      this.selectedVenueId = nextVenueId;
      this.loadedSections.clear();
      this.resetSectionMessages();
      this.automationRules = [];
      this.automationExecutionLog = [];
      this.reportSchedules = [];
      this.reportCatalog = [];
      this.scheduleExecutionLogs = [];
      this.termsDocuments = [];
      this.termsVersionHistory = [];
      this.selectedTermsSeriesId = null;
      this.selectedTermsViewId = null;
      this.selectedTermsDiffLeftId = null;
      this.selectedTermsDiffRightId = null;
      this.termsDraftSourceId = null;
      this.termsForm.patchValue(
        {
          draftId: '',
          title: '',
          eventTypesCsv: 'Wedding',
          content: ''
        },
        { emitEvent: false });
      this.activeExecutionScheduleId = null;
      this.runningScheduleId = null;
      this.startNewAutomationRule();
      this.startNewReportSchedule();
      this.ensureSectionLoaded(this.activeSectionKey);
    });
  }

  setSection(section: SettingsSectionKey): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section },
      queryParamsHandling: 'merge'
    });
  }

  saveVenueProfile(): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (this.venueForm.invalid) {
      this.venueForm.markAllAsTouched();
      this.setSectionError('venue-profile', 'Complete required fields before saving the venue profile.');
      return;
    }

    const value = this.venueForm.getRawValue();
    const payload: UpdateVenueProfileRequest = {
      name: this.requiredText(value.name),
      legalEntityName: this.optionalText(value.legalEntityName),
      addressLine1: this.optionalText(value.addressLine1),
      addressLine2: this.optionalText(value.addressLine2),
      city: this.optionalText(value.city),
      region: this.optionalText(value.region),
      postcode: this.optionalText(value.postcode),
      countryCode: this.requiredText(value.countryCode).toUpperCase(),
      phoneNumberE164: this.optionalText(value.phoneNumberE164),
      enquiriesEmail: this.optionalText(value.enquiriesEmail),
      websiteUrl: this.optionalText(value.websiteUrl),
      vatNumber: this.optionalText(value.vatNumber),
      companyRegistrationNumber: this.optionalText(value.companyRegistrationNumber),
      logoUrl: this.optionalText(value.logoUrl),
      description: this.optionalText(value.description),
      cancellationPolicy: this.optionalText(value.cancellationPolicy),
      currencyCode: this.requiredText(value.currencyCode).toUpperCase(),
      defaultVatRate: Number(value.defaultVatRate ?? 20),
      timeZone: this.requiredText(value.timeZone),
      locale: this.requiredText(value.locale),
      minimumBookingNoticeDays: Number(value.minimumBookingNoticeDays ?? 0),
      defaultHoldPeriodDays: Number(value.defaultHoldPeriodDays ?? 7),
      holdWarningDays: Number(value.holdWarningDays ?? 2),
      holdAutoReleaseMode: this.requiredText(value.holdAutoReleaseMode),
      maxHoldsPerDateAndSpace: Number(value.maxHoldsPerDateAndSpace ?? 1)
    };

    this.setSectionSaving('venue-profile', true);
    this.api
      .updateVenueProfile(this.selectedVenueId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.venueProfile = profile;
          this.patchVenueForm(profile);
          this.setSectionSuccess('venue-profile', 'Venue profile saved.');
          this.setSectionSaving('venue-profile', false);
        },
        error: (error) => {
          this.setSectionError('venue-profile', this.resolveError(error, 'Unable to save venue profile.'));
          this.setSectionSaving('venue-profile', false);
        }
      });
  }

  startNewSpace(): void {
    this.editingSpaceId = null;
    this.spaceForm.reset({
      name: '',
      description: '',
      locationText: '',
      floorAreaSqm: null,
      facilitiesCsv: '',
      minimumSpendAmount: null,
      minimumSpendCurrencyCode: this.venueForm.get('currencyCode')?.value ?? 'GBP',
      turnaroundMinutes: 60,
      isActive: true
    });

    this.replaceFormArray(this.spaceCapacityControls, [this.createCapacityGroup(), this.createCapacityGroup({ setupStyle: 'Reception' })]);
    this.replaceFormArray(this.spacePricingControls, [this.createPricingGroup()]);
  }

  editSpace(space: SpaceSummaryDto): void {
    this.editingSpaceId = space.id;
    this.spaceForm.patchValue({
      name: space.name,
      description: space.description ?? '',
      locationText: space.locationText ?? '',
      floorAreaSqm: space.floorAreaSqm ?? null,
      facilitiesCsv: space.facilitiesCsv,
      minimumSpendAmount: space.minimumSpendAmount ?? null,
      minimumSpendCurrencyCode: space.minimumSpendCurrencyCode,
      turnaroundMinutes: space.turnaroundMinutes,
      isActive: space.isActive
    });

    this.replaceFormArray(
      this.spaceCapacityControls,
      space.capacityBySetup.length > 0 ? space.capacityBySetup.map((rule) => this.createCapacityGroup(rule)) : [this.createCapacityGroup()]
    );
    this.replaceFormArray(
      this.spacePricingControls,
      space.pricing.length > 0 ? space.pricing.map((rule) => this.createPricingGroup(rule)) : [this.createPricingGroup()]
    );
  }

  addSpaceCapacityRule(): void {
    this.spaceCapacityControls.push(this.createCapacityGroup());
  }

  removeSpaceCapacityRule(index: number): void {
    if (this.spaceCapacityControls.length <= 1) {
      return;
    }

    this.spaceCapacityControls.removeAt(index);
  }

  addSpacePricingRule(): void {
    this.spacePricingControls.push(this.createPricingGroup());
  }

  removeSpacePricingRule(index: number): void {
    if (this.spacePricingControls.length <= 1) {
      return;
    }

    this.spacePricingControls.removeAt(index);
  }

  saveSpace(): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (this.spaceForm.invalid) {
      this.spaceForm.markAllAsTouched();
      this.setSectionError('spaces', 'Complete required fields for the space before saving.');
      return;
    }

    const payload = this.mapSpacePayload();
    if (!payload.name) {
      this.setSectionError('spaces', 'Space name is required.');
      return;
    }

    this.setSectionSaving('spaces', true);

    const request$ = this.editingSpaceId
      ? this.api.updateVenueSpace(this.selectedVenueId, this.editingSpaceId, payload)
      : this.api.createVenueSpace(this.selectedVenueId, payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.setSectionSuccess('spaces', this.editingSpaceId ? 'Space updated.' : 'Space created.');
        this.setSectionSaving('spaces', false);
        this.startNewSpace();
        this.loadSpacesSection(true);
      },
      error: (error) => {
        this.setSectionError('spaces', this.resolveError(error, 'Unable to save space.'));
        this.setSectionSaving('spaces', false);
      }
    });
  }

  startNewCombination(): void {
    this.editingCombinationId = null;
    this.combinationForm.reset({
      name: '',
      description: '',
      priceAmount: null,
      currencyCode: this.venueForm.get('currencyCode')?.value ?? 'GBP',
      spaceIds: []
    });
    this.replaceFormArray(this.combinationCapacityControls, [this.createCapacityGroup(), this.createCapacityGroup({ setupStyle: 'Reception' })]);
  }

  editCombination(combination: SpaceCombinationDto): void {
    this.editingCombinationId = combination.id;
    this.combinationForm.patchValue({
      name: combination.name,
      description: combination.description ?? '',
      priceAmount: combination.priceAmount ?? null,
      currencyCode: combination.currencyCode,
      spaceIds: [...combination.spaceIds]
    });

    this.replaceFormArray(
      this.combinationCapacityControls,
      combination.capacityBySetup.length > 0
        ? combination.capacityBySetup.map((rule) => this.createCapacityGroup(rule))
        : [this.createCapacityGroup()]
    );
  }

  addCombinationCapacityRule(): void {
    this.combinationCapacityControls.push(this.createCapacityGroup());
  }

  removeCombinationCapacityRule(index: number): void {
    if (this.combinationCapacityControls.length <= 1) {
      return;
    }

    this.combinationCapacityControls.removeAt(index);
  }

  toggleCombinationSpace(spaceId: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const selected = [...(this.combinationForm.get('spaceIds')?.value ?? [])] as string[];

    if (checkbox.checked) {
      if (!selected.includes(spaceId)) {
        selected.push(spaceId);
      }
    } else {
      const index = selected.indexOf(spaceId);
      if (index >= 0) {
        selected.splice(index, 1);
      }
    }

    this.combinationForm.get('spaceIds')?.setValue(selected);
  }

  isCombinationSpaceSelected(spaceId: string): boolean {
    const selected = (this.combinationForm.get('spaceIds')?.value ?? []) as string[];
    return selected.includes(spaceId);
  }

  saveCombination(): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (this.combinationForm.invalid) {
      this.combinationForm.markAllAsTouched();
      this.setSectionError('spaces', 'Complete required fields for the space combination before saving.');
      return;
    }

    const value = this.combinationForm.getRawValue();
    const selectedSpaces = (value.spaceIds ?? []) as string[];

    if (selectedSpaces.length < 2) {
      this.setSectionError('spaces', 'Select at least two spaces for a combination.');
      return;
    }

    const payload = {
      name: this.requiredText(value.name),
      description: this.optionalText(value.description),
      priceAmount: value.priceAmount === null ? null : Number(value.priceAmount),
      currencyCode: this.requiredText(value.currencyCode).toUpperCase(),
      spaceIds: selectedSpaces,
      capacityBySetup: this.mapCapacityRules(this.combinationCapacityControls)
    };

    this.setSectionSaving('spaces', true);

    const request$ = this.editingCombinationId
      ? this.api.updateSpaceCombination(this.selectedVenueId, this.editingCombinationId, payload)
      : this.api.createSpaceCombination(this.selectedVenueId, payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.setSectionSuccess('spaces', this.editingCombinationId ? 'Combination updated.' : 'Combination created.');
        this.setSectionSaving('spaces', false);
        this.startNewCombination();
        this.loadSpacesSection(true);
      },
      error: (error) => {
        this.setSectionError('spaces', this.resolveError(error, 'Unable to save space combination.'));
        this.setSectionSaving('spaces', false);
      }
    });
  }

  changeBudgetYear(offset: number): void {
    this.selectedBudgetYear += offset;
    this.loadBudgetSection(true);
  }

  setBudgetMonth(month: number): void {
    this.selectedBudgetMonth = month;
    if (!this.budgetForms.has(month)) {
      this.ensureSectionLoaded('budgets');
    }
  }

  addBudgetTargetRow(month: number): void {
    const targets = this.getBudgetTargetsArray(month);
    if (!targets) {
      return;
    }

    targets.push(this.createBudgetTargetGroup());
  }

  removeBudgetTargetRow(month: number, index: number): void {
    const targets = this.getBudgetTargetsArray(month);
    if (!targets || targets.length <= 1) {
      return;
    }

    targets.removeAt(index);
  }

  saveBudgetMonth(month: number): void {
    if (!this.selectedVenueId) {
      return;
    }

    const form = this.getBudgetForm(month);
    if (!form) {
      return;
    }

    if (form.invalid) {
      form.markAllAsTouched();
      this.setSectionError('budgets', 'Complete required fields before saving the budget month.');
      return;
    }

    const value = form.getRawValue();
    const targets = (value.targetsByEventType ?? []) as BudgetByEventTypeDto[];

    const payload = {
      year: this.selectedBudgetYear,
      month,
      overallRevenueTarget: Number(value.overallRevenueTarget ?? 0),
      currencyCode: this.requiredText(value.currencyCode).toUpperCase(),
      targetsByEventType: targets
        .map((target) => ({
          eventType: this.requiredText(target.eventType),
          revenueTarget: Number(target.revenueTarget ?? 0),
          coversTarget: Number(target.coversTarget ?? 0),
          bookingCountTarget: Number(target.bookingCountTarget ?? 0),
          averageSellingPriceTarget: Number(target.averageSellingPriceTarget ?? 0)
        }))
        .filter((target) => target.eventType)
    };

    this.setSectionSaving('budgets', true);

    this.api
      .upsertVenueBudgetMonth(this.selectedVenueId, this.selectedBudgetYear, month, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSectionSuccess('budgets', `Month ${this.getMonthLabel(month)} budget saved.`);
          this.setSectionSaving('budgets', false);
          this.loadBudgetSection(true);
        },
        error: (error) => {
          this.setSectionError('budgets', this.resolveError(error, 'Unable to save budget month.'));
          this.setSectionSaving('budgets', false);
        }
      });
  }

  onBudgetCsvSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedBudgetCsvFile = input.files?.item(0) ?? null;
  }

  uploadBudgetCsv(): void {
    if (!this.selectedVenueId || !this.selectedBudgetCsvFile) {
      return;
    }

    this.setSectionSaving('budgets', true);

    this.api
      .importVenueBudgetsCsv(this.selectedVenueId, this.selectedBudgetCsvFile)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.selectedBudgetCsvFile = null;
          this.setSectionSuccess('budgets', 'Budget CSV imported successfully.');
          this.setSectionSaving('budgets', false);
          this.loadBudgetSection(true);
        },
        error: (error) => {
          this.setSectionError('budgets', this.resolveError(error, 'Unable to import budget CSV.'));
          this.setSectionSaving('budgets', false);
        }
      });
  }

  inviteUser(): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (this.inviteForm.invalid) {
      this.inviteForm.markAllAsTouched();
      this.setSectionError('users', 'Complete invite fields before sending an invitation.');
      return;
    }

    const value = this.inviteForm.getRawValue();

    this.setSectionSaving('users', true);
    this.inviteDebugToken = '';

    this.api
      .inviteUser({
        firstName: this.requiredText(value.firstName),
        lastName: this.requiredText(value.lastName),
        email: this.requiredText(value.email).toLowerCase(),
        phoneNumberE164: this.optionalText(value.phoneNumberE164),
        venueRoles: [{ venueId: this.selectedVenueId, role: this.requiredText(value.role) }],
        requiresTotp: Boolean(value.requiresTotp)
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.setSectionSuccess('users', `Invitation sent to ${response.email}.`);
          this.setSectionSaving('users', false);
          this.inviteDebugToken = response.debugToken ?? '';
          this.inviteForm.reset({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumberE164: '',
            role: 'EventsCoordinator',
            requiresTotp: false
          });
          this.loadUsersSection(true);
        },
        error: (error) => {
          this.setSectionError('users', this.resolveError(error, 'Unable to send invitation.'));
          this.setSectionSaving('users', false);
        }
      });
  }

  toggleUserActive(user: UserSummaryDto, isActive: boolean): void {
    this.setSectionSaving('users', true);
    this.api
      .updateUserStatus(user.id, isActive)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSectionSuccess('users', `${user.firstName} ${user.lastName} ${isActive ? 'activated' : 'deactivated'}.`);
          this.setSectionSaving('users', false);
          this.loadUsersSection(true);
        },
        error: (error) => {
          this.setSectionError('users', this.resolveError(error, 'Unable to update user status.'));
          this.setSectionSaving('users', false);
        }
      });
  }

  getUserRoleForSelectedVenue(user: UserSummaryDto): string {
    if (!this.selectedVenueId) {
      return user.venueRoles.map((role) => role.role).join(', ');
    }

    const role = user.venueRoles.find((assignment) => assignment.venueId === this.selectedVenueId);
    return role?.role ?? 'Not assigned';
  }

  startNewPaymentScheduleTemplate(): void {
    this.paymentTemplateForm.reset({
      id: '',
      name: '',
      eventType: 'Wedding',
      isDefault: this.paymentScheduleTemplates.length === 0
    });
    this.paymentTemplateMilestoneDrafts = [this.createDefaultPaymentTemplateMilestone()];
  }

  editPaymentScheduleTemplate(template: PaymentScheduleTemplateSettingDto): void {
    this.paymentTemplateForm.reset({
      id: template.id,
      name: template.name,
      eventType: template.eventType,
      isDefault: template.isDefault
    });
    this.paymentTemplateMilestoneDrafts = template.milestones.map((milestone) => ({
      name: milestone.name,
      dueDateRule: milestone.dueDateRule,
      amountType: milestone.amountType,
      amount: milestone.amount,
      paymentMethodsAccepted: [...milestone.paymentMethodsAccepted],
      autoReminderEnabled: milestone.autoReminderEnabled,
      autoReminderDays: milestone.autoReminderDays,
      lateReminderEnabled: milestone.lateReminderEnabled,
      lateReminderDays: milestone.lateReminderDays
    }));
  }

  clonePaymentTemplateFromEventType(): void {
    const eventType = this.requiredText(this.selectedPaymentTemplateCloneEventType);
    if (!eventType) {
      this.setSectionError('payment-schedules', 'Select an event type to clone from.');
      return;
    }

    const source = this.paymentScheduleTemplates.find((template) => template.eventType === eventType);
    if (!source) {
      this.setSectionError('payment-schedules', `No template found for ${eventType}.`);
      return;
    }

    this.paymentTemplateForm.patchValue({
      id: '',
      name: `${source.name} Copy`,
      eventType: source.eventType,
      isDefault: false
    });
    this.paymentTemplateMilestoneDrafts = source.milestones.map((milestone) => ({
      ...milestone,
      paymentMethodsAccepted: [...milestone.paymentMethodsAccepted]
    }));
    this.setSectionSuccess('payment-schedules', `Cloned template from ${eventType}.`);
  }

  duplicatePaymentScheduleTemplate(template: PaymentScheduleTemplateSettingDto): void {
    const duplicate: PaymentScheduleTemplateSettingDto = {
      id: crypto.randomUUID(),
      name: `${template.name} (Copy)`,
      eventType: template.eventType,
      isDefault: false,
      milestones: template.milestones.map((milestone) => ({
        ...milestone,
        paymentMethodsAccepted: [...milestone.paymentMethodsAccepted]
      }))
    };

    this.paymentScheduleTemplates = [duplicate, ...this.paymentScheduleTemplates].slice(0, 50);
    this.persistPaymentScheduleTemplates('Payment schedule template duplicated.');
  }

  addPaymentTemplateMilestone(): void {
    this.paymentTemplateMilestoneDrafts = [...this.paymentTemplateMilestoneDrafts, this.createDefaultPaymentTemplateMilestone()];
  }

  removePaymentTemplateMilestone(index: number): void {
    this.paymentTemplateMilestoneDrafts = this.paymentTemplateMilestoneDrafts.filter((_, current) => current !== index);
  }

  dropPaymentTemplateMilestone(event: CdkDragDrop<PaymentScheduleTemplateSettingDto['milestones']>): void {
    const reordered = [...this.paymentTemplateMilestoneDrafts];
    moveItemInArray(reordered, event.previousIndex, event.currentIndex);
    this.paymentTemplateMilestoneDrafts = reordered;
  }

  setPaymentTemplateMilestoneMethods(index: number, rawMethodsCsv: string): void {
    const methods = rawMethodsCsv
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    this.paymentTemplateMilestoneDrafts[index].paymentMethodsAccepted = methods;
  }

  paymentTemplateMilestoneMethodsCsv(milestone: PaymentScheduleTemplateSettingDto['milestones'][number]): string {
    return (milestone.paymentMethodsAccepted ?? []).join(', ');
  }

  savePaymentScheduleTemplate(): void {
    if (this.paymentTemplateForm.invalid || !this.selectedVenueId) {
      this.paymentTemplateForm.markAllAsTouched();
      this.setSectionError('payment-schedules', 'Complete required template fields before saving.');
      return;
    }

    const value = this.paymentTemplateForm.getRawValue();
    const templateId = this.optionalText(value.id) ?? crypto.randomUUID();
    const eventType = this.requiredText(value.eventType);
    const milestones = this.paymentTemplateMilestoneDrafts
      .map((milestone) => ({
        name: this.requiredText(milestone.name),
        dueDateRule: this.requiredText(milestone.dueDateRule) || 'On confirmation',
        amountType: this.requiredText(milestone.amountType) || 'Percentage',
        amount: Number(milestone.amount ?? 0),
        paymentMethodsAccepted: (milestone.paymentMethodsAccepted ?? []).filter((method) => !!method.trim()),
        autoReminderEnabled: Boolean(milestone.autoReminderEnabled),
        autoReminderDays: Number.isFinite(milestone.autoReminderDays) ? Number(milestone.autoReminderDays) : 2,
        lateReminderEnabled: Boolean(milestone.lateReminderEnabled),
        lateReminderDays: Number.isFinite(milestone.lateReminderDays) ? Number(milestone.lateReminderDays) : 2
      }))
      .filter((milestone) => milestone.name.length > 0);

    if (milestones.length === 0) {
      this.setSectionError('payment-schedules', 'Add at least one milestone.');
      return;
    }

    if (milestones.some((milestone) => milestone.amount < 0)) {
      this.setSectionError('payment-schedules', 'Milestone amounts must be zero or greater.');
      return;
    }

    const candidate: PaymentScheduleTemplateSettingDto = {
      id: templateId,
      name: this.requiredText(value.name),
      eventType,
      isDefault: Boolean(value.isDefault),
      milestones: milestones.map((milestone) => ({
        ...milestone,
        paymentMethodsAccepted: milestone.paymentMethodsAccepted.length > 0
          ? milestone.paymentMethodsAccepted
          : ['Online (card)', 'Bank transfer']
      }))
    };

    const existingIndex = this.paymentScheduleTemplates.findIndex((template) => template.id === candidate.id);
    const templates = [...this.paymentScheduleTemplates];
    if (existingIndex >= 0) {
      templates[existingIndex] = candidate;
    } else {
      templates.unshift(candidate);
    }

    if (candidate.isDefault) {
      for (const template of templates) {
        if (template.id !== candidate.id && template.eventType === candidate.eventType) {
          template.isDefault = false;
        }
      }
    } else if (!templates.some((template) => template.eventType === candidate.eventType && template.isDefault)) {
      candidate.isDefault = true;
    }

    this.paymentScheduleTemplates = templates.slice(0, 50);
    this.persistPaymentScheduleTemplates('Payment schedule template saved.');
    this.editPaymentScheduleTemplate(candidate);
  }

  deletePaymentScheduleTemplate(id: string): void {
    const removed = this.paymentScheduleTemplates.find((item) => item.id === id) ?? null;
    const remaining = this.paymentScheduleTemplates.filter((item) => item.id !== id);

    if (removed?.isDefault) {
      const replacement = remaining.find((item) => item.eventType === removed.eventType);
      if (replacement) {
        replacement.isDefault = true;
      }
    }

    this.paymentScheduleTemplates = remaining;
    this.persistPaymentScheduleTemplates('Payment schedule template removed.');

    if (this.paymentTemplateForm.get('id')?.value === id) {
      this.startNewPaymentScheduleTemplate();
    }
  }

  saveFinancialReferenceSettings(): void {
    if (!this.selectedVenueId || this.financialReferenceForm.invalid) {
      this.financialReferenceForm.markAllAsTouched();
      this.setSectionError('payment-schedules', 'Enter valid prefixes before saving numbering settings.');
      return;
    }

    const form = this.financialReferenceForm.getRawValue();
    const payload: FinancialReferenceSettingsDto = {
      invoicePrefix: this.sanitizeFinancialPrefix(form.invoicePrefix, 'INV'),
      creditNotePrefix: this.sanitizeFinancialPrefix(form.creditNotePrefix, 'CN'),
      receiptPrefix: this.sanitizeFinancialPrefix(form.receiptPrefix, 'RCT')
    };

    this.setSectionSaving('payment-schedules', true);
    this.api
      .upsertFinancialReferenceSettings(this.selectedVenueId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (settings) => {
          this.financialReferenceSettings = settings;
          this.financialReferenceForm.patchValue(settings);
          this.setSectionSuccess('payment-schedules', 'Financial numbering settings saved.');
          this.setSectionSaving('payment-schedules', false);
        },
        error: (error) => {
          this.setSectionError('payment-schedules', this.resolveError(error, 'Unable to save financial numbering settings.'));
          this.setSectionSaving('payment-schedules', false);
        }
      });
  }

  saveTermsDocument(): void {
    if (this.termsForm.invalid || !this.selectedVenueId) {
      this.termsForm.markAllAsTouched();
      this.setSectionError('terms', 'Enter title, event type(s), and content before saving terms.');
      return;
    }

    const value = this.termsForm.getRawValue();
    const draftId = this.optionalText(value.draftId);
    const payload = {
      name: this.requiredText(value.title),
      contentHtml: this.requiredText(value.content),
      eventTypes: this.parseTermsEventTypes(value.eventTypesCsv),
      sourceTermsAndConditionsId: this.termsDraftSourceId
    };

    if (payload.eventTypes.length === 0) {
      this.setSectionError('terms', 'Provide at least one event type.');
      return;
    }

    this.setSectionSaving('terms', true);
    const request$ = draftId
      ? this.api.updateVenueTermsDraft(this.selectedVenueId, draftId, {
          name: payload.name,
          contentHtml: payload.contentHtml,
          eventTypes: payload.eventTypes,
          isActive: true
        })
      : this.api.createVenueTermsDraft(this.selectedVenueId, payload);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (draft) => {
          this.setSectionSaving('terms', false);
          this.setSectionSuccess('terms', draftId ? 'Terms draft updated.' : 'Terms draft created.');
          this.termsDraftSourceId = draft.id;
          this.termsForm.patchValue({ draftId: draft.id }, { emitEvent: false });
          this.loadTermsVersionHistory(draft.id);
          this.loadTermsSection(true);
        },
        error: (error) => {
          this.setSectionSaving('terms', false);
          this.setSectionError('terms', this.resolveError(error, 'Unable to save terms draft.'));
        }
      });
  }

  publishTermsDraft(draftId?: string): void {
    if (!this.selectedVenueId) {
      return;
    }

    const targetDraftId = draftId ?? this.optionalText(this.termsForm.getRawValue().draftId);
    if (!targetDraftId) {
      this.setSectionError('terms', 'Select or create a draft before publishing.');
      return;
    }

    this.setSectionSaving('terms', true);
    this.api
      .publishVenueTerms(this.selectedVenueId, targetDraftId, { isActive: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (published) => {
          this.setSectionSaving('terms', false);
          this.setSectionSuccess('terms', `Published ${published.name} v${published.version}.`);
          this.termsForm.patchValue({ draftId: '' }, { emitEvent: false });
          this.termsDraftSourceId = published.id;
          this.loadTermsSection(true);
          this.loadTermsVersionHistory(published.id);
        },
        error: (error) => {
          this.setSectionSaving('terms', false);
          this.setSectionError('terms', this.resolveError(error, 'Unable to publish terms draft.'));
        }
      });
  }

  editTermsDraft(termsId: string): void {
    const target = this.termsVersionHistory.find((item) => item.id === termsId && item.isDraft);
    if (!target) {
      this.setSectionError('terms', 'Only draft terms can be edited. Create a new draft from a published version.');
      return;
    }

    this.termsDraftSourceId = target.id;
    this.termsForm.patchValue(
      {
        draftId: target.id,
        title: target.name,
        eventTypesCsv: (target.eventTypes ?? []).join(', '),
        content: target.contentHtml
      },
      { emitEvent: false });
  }

  createTermsDraftFromVersion(termsId: string): void {
    if (!this.selectedVenueId) {
      return;
    }

    const source = this.termsVersionHistory.find((item) => item.id === termsId) ?? this.termsDocuments.find((item) => item.id === termsId);
    if (!source) {
      this.setSectionError('terms', 'Source terms version not found.');
      return;
    }

    this.setSectionSaving('terms', true);
    this.api
      .createVenueTermsDraft(this.selectedVenueId, {
        name: source.name,
        contentHtml: source.contentHtml,
        eventTypes: source.eventTypes ?? [],
        sourceTermsAndConditionsId: source.id
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (draft) => {
          this.setSectionSaving('terms', false);
          this.setSectionSuccess('terms', 'New draft created from selected version.');
          this.termsDraftSourceId = draft.id;
          this.termsForm.patchValue(
            {
              draftId: draft.id,
              title: draft.name,
              eventTypesCsv: (draft.eventTypes ?? []).join(', '),
              content: draft.contentHtml
            },
            { emitEvent: false });
          this.loadTermsVersionHistory(draft.id);
        },
        error: (error) => {
          this.setSectionSaving('terms', false);
          this.setSectionError('terms', this.resolveError(error, 'Unable to create draft from selected version.'));
        }
      });
  }

  get selectedTermsPreviewHtml(): string {
    const selected = this.termsVersionHistory.find((item) => item.id === this.selectedTermsViewId);
    return selected?.contentHtml ?? '';
  }

  get termsDiffHtml(): string {
    const left = this.termsVersionHistory.find((item) => item.id === this.selectedTermsDiffLeftId);
    const right = this.termsVersionHistory.find((item) => item.id === this.selectedTermsDiffRightId);
    if (!left || !right) {
      return '';
    }

    return this.buildHtmlDiff(left.contentHtml ?? '', right.contentHtml ?? '');
  }

  private parseTermsEventTypes(value: string | null | undefined): string[] {
    return (value ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .filter((item, index, all) => all.findIndex((candidate) => candidate.toLowerCase() === item.toLowerCase()) === index)
      .slice(0, 20);
  }

  private buildHtmlDiff(previousHtml: string, currentHtml: string): string {
    const previous = this.stripHtml(previousHtml);
    const current = this.stripHtml(currentHtml);
    if (!previous && !current) {
      return '';
    }

    const leftTokens = previous.split(/\s+/).filter((token) => token.length > 0);
    const rightTokens = current.split(/\s+/).filter((token) => token.length > 0);
    const lcs = this.buildLcsMatrix(leftTokens, rightTokens);
    const chunks: string[] = [];
    this.collectDiffChunks(leftTokens, rightTokens, lcs, leftTokens.length, rightTokens.length, chunks);
    return chunks.join(' ').trim();
  }

  private buildLcsMatrix(left: string[], right: string[]): number[][] {
    const matrix = Array.from({ length: left.length + 1 }, () => Array<number>(right.length + 1).fill(0));
    for (let i = 1; i <= left.length; i += 1) {
      for (let j = 1; j <= right.length; j += 1) {
        if (left[i - 1].toLowerCase() === right[j - 1].toLowerCase()) {
          matrix[i][j] = matrix[i - 1][j - 1] + 1;
        } else {
          matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
        }
      }
    }

    return matrix;
  }

  private collectDiffChunks(
    left: string[],
    right: string[],
    lcs: number[][],
    i: number,
    j: number,
    chunks: string[]): void {
    if (i > 0 && j > 0 && left[i - 1].toLowerCase() === right[j - 1].toLowerCase()) {
      this.collectDiffChunks(left, right, lcs, i - 1, j - 1, chunks);
      chunks.push(this.escapeHtml(right[j - 1]));
      return;
    }

    if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
      this.collectDiffChunks(left, right, lcs, i, j - 1, chunks);
      chunks.push(`<span class="diff-add">${this.escapeHtml(right[j - 1])}</span>`);
      return;
    }

    if (i > 0 && (j === 0 || lcs[i][j - 1] < lcs[i - 1][j])) {
      this.collectDiffChunks(left, right, lcs, i - 1, j, chunks);
      chunks.push(`<span class="diff-remove">${this.escapeHtml(left[i - 1])}</span>`);
    }
  }

  private stripHtml(value: string): string {
    return value
      .replace(/<\s*br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  saveProposalTemplate(): void {
    if (this.proposalTemplateForm.invalid || !this.selectedVenueId) {
      this.proposalTemplateForm.markAllAsTouched();
      this.setSectionError('proposal-templates', 'Complete required fields before saving a proposal template.');
      return;
    }

    const value = this.proposalTemplateForm.getRawValue();
    const key = this.requiredText(value.key).toLowerCase();
    const template: ProposalTemplateSettingDto = {
      key,
      label: this.requiredText(value.label),
      eventType: this.requiredText(value.eventType),
      defaultValidityDays: Number(value.defaultValidityDays ?? 14),
      defaultIntroduction: this.optionalText(value.defaultIntroduction),
      defaultTermsVersion: this.optionalText(value.defaultTermsVersion),
      defaultLineItems: [
        {
          category: this.requiredText(value.itemCategory),
          description: this.requiredText(value.itemDescription),
          quantity: Number(value.itemQuantity ?? 1),
          unit: this.requiredText(value.itemUnit),
          unitPriceExclVat: Number(value.itemUnitPriceExclVat ?? 0),
          vatRate: Number(value.itemVatRate ?? 20),
          discountPercent: Number(value.itemDiscountPercent ?? 0),
          discountAmount: Number(value.itemDiscountAmount ?? 0)
        }
      ]
    };

    this.proposalTemplates = [template, ...this.proposalTemplates.filter((item) => item.key !== key)];
    this.persistProposalTemplates('Proposal template saved.');

    this.proposalTemplateForm.reset({
      key: '',
      label: '',
      eventType: 'Wedding',
      defaultValidityDays: 14,
      defaultIntroduction: '',
      defaultTermsVersion: 'v1',
      itemCategory: 'Room Hire',
      itemDescription: '',
      itemQuantity: 1,
      itemUnit: 'Flat rate',
      itemUnitPriceExclVat: 0,
      itemVatRate: 20,
      itemDiscountPercent: 0,
      itemDiscountAmount: 0
    });
  }

  saveProposalPdfSettings(): void {
    if (!this.selectedVenueId) {
      return;
    }

    this.setSectionSaving('proposal-templates', true);
    this.api
      .upsertProposalPdfSettings(this.selectedVenueId, this.proposalPdfSettings)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (settings) => {
          this.proposalPdfSettings = settings;
          this.setSectionSuccess('proposal-templates', 'Proposal PDF settings saved.');
          this.setSectionSaving('proposal-templates', false);
        },
        error: (error) => {
          this.setSectionError('proposal-templates', this.resolveError(error, 'Unable to save proposal PDF settings.'));
          this.setSectionSaving('proposal-templates', false);
        }
      });
  }

  deleteProposalTemplate(key: string): void {
    this.proposalTemplates = this.proposalTemplates.filter((item) => item.key !== key);
    this.persistProposalTemplates('Proposal template removed.');
  }

  savePlanningMilestone(): void {
    if (this.planningMilestoneForm.invalid || !this.selectedVenueId) {
      this.planningMilestoneForm.markAllAsTouched();
      this.setSectionError('planning-milestones', 'Complete key and label before saving a planning milestone.');
      return;
    }

    const value = this.planningMilestoneForm.getRawValue();
    const key = this.requiredText(value.key);
    const next: PlanningMilestoneSettingDto = {
      key,
      label: this.requiredText(value.label),
      isEnabled: Boolean(value.isEnabled)
    };

    this.planningMilestones = [next, ...this.planningMilestones.filter((item) => item.key !== key)];
    this.persistPlanningMilestones('Planning milestone saved.');

    this.planningMilestoneForm.reset({
      key: '',
      label: '',
      isEnabled: true
    });
  }

  deletePlanningMilestone(key: string): void {
    this.planningMilestones = this.planningMilestones.filter((item) => item.key !== key);
    this.persistPlanningMilestones('Planning milestone removed.');
  }

  addSustainabilityEmissionFactor(): void {
    const nextKeyBase = 'factor';
    let counter = this.sustainabilityEmissionFactors.length + 1;
    let nextKey = `${nextKeyBase}-${counter}`;
    while (this.sustainabilityEmissionFactors.some((factor) => factor.key === nextKey)) {
      counter += 1;
      nextKey = `${nextKeyBase}-${counter}`;
    }

    this.sustainabilityEmissionFactors = [
      ...this.sustainabilityEmissionFactors,
      {
        key: nextKey,
        label: `Factor ${counter}`,
        kgCo2ePerGuest: 0
      }
    ];
  }

  removeSustainabilityEmissionFactor(key: string): void {
    this.sustainabilityEmissionFactors = this.sustainabilityEmissionFactors.filter((factor) => factor.key !== key);
  }

  saveSustainabilitySettings(): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (this.sustainabilityForm.invalid) {
      this.sustainabilityForm.markAllAsTouched();
      this.setSectionError('sustainability', 'Complete sustainability settings before saving.');
      return;
    }

    const normalizedFactors = this.sustainabilityEmissionFactors
      .map((factor) => ({
        key: this.requiredText(factor.key).toLowerCase(),
        label: this.requiredText(factor.label),
        kgCo2ePerGuest: Number(factor.kgCo2ePerGuest ?? 0)
      }))
      .filter((factor) => !!factor.key && !!factor.label)
      .filter((factor, index, all) => all.findIndex((candidate) => candidate.key === factor.key) === index);

    if (normalizedFactors.length === 0) {
      this.setSectionError('sustainability', 'Add at least one catering emission factor.');
      return;
    }

    const ratingMap = new Map<string, number>();
    for (const entry of this.sustainabilityEnergyRatingMultipliers) {
      const rating = this.requiredText(entry.rating).toUpperCase();
      if (!rating) {
        continue;
      }

      ratingMap.set(rating, Number(entry.multiplier ?? 1));
    }

    const normalizedRatings: SustainabilityEnergyRatingFactorDto[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      .map((rating) => ({
        rating,
        multiplier: Number(ratingMap.get(rating) ?? 1)
      }));

    const formValue = this.sustainabilityForm.getRawValue();
    const weights = [
      Number(formValue.carbonWeightPercent ?? 0),
      Number(formValue.wasteWeightPercent ?? 0),
      Number(formValue.sourcingWeightPercent ?? 0)
    ];
    const totalWeight = weights.reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);
    if (totalWeight <= 0) {
      this.setSectionError('sustainability', 'At least one sustainability score weight must be above 0%.');
      return;
    }

    const payload: SustainabilitySettingsDto = {
      cateringEmissionFactors: normalizedFactors,
      travelKgCo2ePerGuestKm: Number(formValue.travelKgCo2ePerGuestKm ?? 0.18),
      energyRatingMultipliers: normalizedRatings,
      carbonTargetKgPerGuest: Number(formValue.carbonTargetKgPerGuest ?? 12),
      wasteTargetKgPerGuest: Number(formValue.wasteTargetKgPerGuest ?? 1.6),
      diversionTargetPercent: Number(formValue.diversionTargetPercent ?? 60),
      localSourcingRadiusMiles: Number(formValue.localSourcingRadiusMiles ?? 50),
      carbonWeightPercent: Number(formValue.carbonWeightPercent ?? 50),
      wasteWeightPercent: Number(formValue.wasteWeightPercent ?? 30),
      sourcingWeightPercent: Number(formValue.sourcingWeightPercent ?? 20),
      includeInProposalByDefault: Boolean(formValue.includeInProposalByDefault)
    };

    this.setSectionSaving('sustainability', true);
    this.api
      .upsertSustainabilitySettings(this.selectedVenueId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (settings) => {
          this.sustainabilityEmissionFactors = [...settings.cateringEmissionFactors];
          const ratingMap = new Map(
            settings.energyRatingMultipliers.map((item) => [item.rating.toUpperCase(), item.multiplier])
          );
          this.sustainabilityEnergyRatingMultipliers = this.sustainabilityEnergyRatings.map((rating) => ({
            rating,
            multiplier: Number(ratingMap.get(rating) ?? 1)
          }));
          this.sustainabilityForm.patchValue({
            travelKgCo2ePerGuestKm: settings.travelKgCo2ePerGuestKm,
            carbonTargetKgPerGuest: settings.carbonTargetKgPerGuest,
            wasteTargetKgPerGuest: settings.wasteTargetKgPerGuest,
            diversionTargetPercent: settings.diversionTargetPercent,
            localSourcingRadiusMiles: settings.localSourcingRadiusMiles,
            carbonWeightPercent: settings.carbonWeightPercent,
            wasteWeightPercent: settings.wasteWeightPercent,
            sourcingWeightPercent: settings.sourcingWeightPercent,
            includeInProposalByDefault: settings.includeInProposalByDefault
          });
          this.setSectionSuccess('sustainability', 'Sustainability settings saved.');
          this.setSectionSaving('sustainability', false);
        },
        error: (error) => {
          this.setSectionError('sustainability', this.resolveError(error, 'Unable to save sustainability settings.'));
          this.setSectionSaving('sustainability', false);
        }
      });
  }

  saveLostReason(): void {
    if (this.lostReasonForm.invalid || !this.selectedVenueId) {
      this.lostReasonForm.markAllAsTouched();
      this.setSectionError('lost-reasons', 'Enter a valid label before saving a lost reason.');
      return;
    }

    const value = this.lostReasonForm.getRawValue();
    const id = this.optionalText(value.id) ?? crypto.randomUUID();
    const nextSortOrder = this.lostReasons.length + 1;
    const reason: LostReasonSettingDto = {
      id,
      label: this.requiredText(value.label),
      isActive: Boolean(value.isActive),
      sortOrder: nextSortOrder
    };

    const nextReasons = [reason, ...this.lostReasons.filter((item) => item.id !== id)]
      .map((item, index) => ({ ...item, sortOrder: index + 1 }));

    this.persistLostReasons(nextReasons, 'Lost reason saved.');
    this.lostReasonForm.reset({
      id: '',
      label: '',
      isActive: true
    });
  }

  editLostReason(reason: LostReasonSettingDto): void {
    this.lostReasonForm.patchValue({
      id: reason.id,
      label: reason.label,
      isActive: reason.isActive
    });
  }

  deleteLostReason(id: string): void {
    const nextReasons = this.lostReasons
      .filter((item) => item.id !== id)
      .map((item, index) => ({ ...item, sortOrder: index + 1 }));
    this.persistLostReasons(nextReasons, 'Lost reason removed.');
  }

  moveLostReason(id: string, direction: -1 | 1): void {
    const currentIndex = this.lostReasons.findIndex((item) => item.id === id);
    if (currentIndex < 0) {
      return;
    }

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= this.lostReasons.length) {
      return;
    }

    const reordered = [...this.lostReasons];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    const normalized = reordered.map((item, index) => ({ ...item, sortOrder: index + 1 }));
    this.persistLostReasons(normalized, 'Lost reasons reordered.');
  }

  addGuestProfileField(): void {
    const nextSortOrder = this.guestProfileCustomFields.length + 1;
    this.guestProfileCustomFields = [
      ...this.guestProfileCustomFields,
      {
        id: crypto.randomUUID(),
        key: '',
        label: '',
        type: 'text',
        isRequired: false,
        isActive: true,
        sortOrder: nextSortOrder,
        placeholder: null,
        options: []
      }
    ];
  }

  removeGuestProfileField(id: string): void {
    this.guestProfileCustomFields = this.guestProfileCustomFields
      .filter((field) => field.id !== id)
      .map((field, index) => ({ ...field, sortOrder: index + 1 }));
  }

  moveGuestProfileField(id: string, direction: -1 | 1): void {
    const currentIndex = this.guestProfileCustomFields.findIndex((field) => field.id === id);
    if (currentIndex < 0) {
      return;
    }

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= this.guestProfileCustomFields.length) {
      return;
    }

    const reordered = [...this.guestProfileCustomFields];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    this.guestProfileCustomFields = reordered.map((field, index) => ({ ...field, sortOrder: index + 1 }));
  }

  saveGuestProfileFields(): void {
    if (!this.selectedVenueId) {
      return;
    }

    const sanitized = this.guestProfileCustomFields
      .map((field, index) => ({
        id: field.id || crypto.randomUUID(),
        key: this.requiredText(field.key).toLowerCase(),
        label: this.requiredText(field.label),
        type: (field.type || 'text').toLowerCase(),
        isRequired: field.isRequired,
        isActive: field.isActive,
        sortOrder: index + 1,
        placeholder: this.optionalText(field.placeholder),
        options: field.options ?? []
      }))
      .filter((field) => field.key && field.label)
      .filter((field, index, all) => all.findIndex((candidate) => candidate.key === field.key) === index);

    this.setSectionSaving('guest-profiles', true);
    this.api
      .upsertContactCustomFields(this.selectedVenueId, { fields: sanitized })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (fields) => {
          this.guestProfileCustomFields = [...fields].sort((left, right) => left.sortOrder - right.sortOrder);
          this.setSectionSuccess('guest-profiles', 'Guest profile custom fields saved.');
          this.setSectionSaving('guest-profiles', false);
        },
        error: (error) => {
          this.setSectionError('guest-profiles', this.resolveError(error, 'Unable to save guest profile custom fields.'));
          this.setSectionSaving('guest-profiles', false);
        }
      });
  }

  guestProfileOptionsText(field: ContactCustomFieldDefinitionDto): string {
    return (field.options ?? []).join(', ');
  }

  setGuestProfileOptions(field: ContactCustomFieldDefinitionDto, value: string): void {
    field.options = this.parseCsvList(value);
  }

  saveReportConfiguration(): void {
    if (this.reportConfigurationForm.invalid || !this.selectedVenueId) {
      this.reportConfigurationForm.markAllAsTouched();
      this.setSectionError('report-configuration', 'Enter valid conversion weights before saving.');
      return;
    }

    const value = this.reportConfigurationForm.getRawValue();
    const payload: ReportConfigurationSettingDto = {
      provisionalWeightPercent: Number(value.provisionalWeightPercent ?? 50),
      tentativeWeightPercent: Number(value.tentativeWeightPercent ?? 20),
      openProposalWeightPercent: Number(value.openProposalWeightPercent ?? 30),
      responseTimeWeightPercent: Number(value.responseTimeWeightPercent ?? 20),
      leadSourceWeightPercent: Number(value.leadSourceWeightPercent ?? 15),
      eventTypeWeightPercent: Number(value.eventTypeWeightPercent ?? 15),
      engagementWeightPercent: Number(value.engagementWeightPercent ?? 20),
      budgetAlignmentWeightPercent: Number(value.budgetAlignmentWeightPercent ?? 10),
      leadTimeWeightPercent: Number(value.leadTimeWeightPercent ?? 10),
      completenessWeightPercent: Number(value.completenessWeightPercent ?? 10)
    };

    this.setSectionSaving('report-configuration', true);
    this.api
      .upsertReportConfiguration(this.selectedVenueId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.reportConfigurationForm.patchValue({
            provisionalWeightPercent: response.provisionalWeightPercent,
            tentativeWeightPercent: response.tentativeWeightPercent,
            openProposalWeightPercent: response.openProposalWeightPercent,
            responseTimeWeightPercent: response.responseTimeWeightPercent,
            leadSourceWeightPercent: response.leadSourceWeightPercent,
            eventTypeWeightPercent: response.eventTypeWeightPercent,
            engagementWeightPercent: response.engagementWeightPercent,
            budgetAlignmentWeightPercent: response.budgetAlignmentWeightPercent,
            leadTimeWeightPercent: response.leadTimeWeightPercent,
            completenessWeightPercent: response.completenessWeightPercent
          });
          this.setSectionSuccess('report-configuration', 'Report configuration saved.');
          this.setSectionSaving('report-configuration', false);
        },
        error: (error) => {
          this.setSectionError('report-configuration', this.resolveError(error, 'Unable to save report configuration.'));
          this.setSectionSaving('report-configuration', false);
        }
      });
  }

  saveNotificationMatrix(): void {
    if (!this.selectedVenueId) {
      return;
    }

    this.setSectionSaving('notifications', true);
    this.api
      .upsertNotificationPreferenceMatrix(
        this.notificationMatrixRows.map((row) => ({
          triggerKey: row.triggerKey,
          inAppEnabled: Boolean(row.inAppEnabled),
          emailOperatorEnabled: Boolean(row.emailOperatorEnabled),
          emailClientEnabled: Boolean(row.emailClientEnabled)
        })),
        this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.notificationMatrixRows = [...response.rows].sort((left, right) => left.label.localeCompare(right.label));
          this.setSectionSuccess('notifications', 'Notification matrix saved.');
          this.setSectionSaving('notifications', false);
        },
        error: (error) => {
          this.setSectionError('notifications', this.resolveError(error, 'Unable to save notification settings.'));
          this.setSectionSaving('notifications', false);
        }
      });
  }

  saveAutomationSettings(): void {
    if (this.automationSettingsForm.invalid || !this.selectedVenueId) {
      this.automationSettingsForm.markAllAsTouched();
      this.setSectionError('automation', 'Complete automation settings before saving.');
      return;
    }

    const value = this.automationSettingsForm.getRawValue();
    const payload: AutomationSettingsDto = {
      proposalAcceptedTargetStatus: this.requiredText(value.proposalAcceptedTargetStatus),
      followUpInactiveDays: Number(value.followUpInactiveDays ?? 3),
      autoArchiveEnabled: Boolean(value.autoArchiveEnabled),
      autoArchiveDays: Number(value.autoArchiveDays ?? 90)
    };

    this.setSectionSaving('automation', true);
    this.api
      .upsertAutomationSettings(this.selectedVenueId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.automationSettingsForm.patchValue({
            proposalAcceptedTargetStatus: response.proposalAcceptedTargetStatus,
            followUpInactiveDays: response.followUpInactiveDays,
            autoArchiveEnabled: response.autoArchiveEnabled,
            autoArchiveDays: response.autoArchiveDays
          });
          this.setSectionSuccess('automation', 'Automation settings saved.');
          this.setSectionSaving('automation', false);
        },
        error: (error) => {
          this.setSectionError('automation', this.resolveError(error, 'Unable to save automation settings.'));
          this.setSectionSaving('automation', false);
        }
      });
  }

  startNewAutomationRule(): void {
    this.editingAutomationRuleId = null;
    this.automationRuleForm.reset({
      id: '',
      name: '',
      description: '',
      isActive: true,
      triggerType: 'StatusChanged',
      triggerStatus: 'Tentative',
      triggerDays: null
    });
    this.replaceFormArray(this.automationConditionControls, [this.createAutomationConditionGroup()]);
    this.replaceFormArray(this.automationActionControls, [this.createAutomationActionGroup()]);
  }

  editAutomationRule(rule: AutomationRuleDto): void {
    this.editingAutomationRuleId = rule.id;
    this.automationRuleForm.patchValue({
      id: rule.id,
      name: rule.name,
      description: rule.description ?? '',
      isActive: rule.isActive,
      triggerType: rule.trigger.type,
      triggerStatus: rule.trigger.status ?? '',
      triggerDays: rule.trigger.days ?? null
    });
    this.replaceFormArray(
      this.automationConditionControls,
      rule.conditions.length > 0 ? rule.conditions.map((condition) => this.createAutomationConditionGroup(condition)) : [this.createAutomationConditionGroup()]
    );
    this.replaceFormArray(
      this.automationActionControls,
      rule.actions.length > 0 ? rule.actions.map((action) => this.createAutomationActionGroup(action)) : [this.createAutomationActionGroup()]
    );
  }

  addAutomationCondition(): void {
    this.automationConditionControls.push(this.createAutomationConditionGroup());
  }

  removeAutomationCondition(index: number): void {
    if (this.automationConditionControls.length <= 1) {
      return;
    }

    this.automationConditionControls.removeAt(index);
  }

  addAutomationAction(): void {
    this.automationActionControls.push(this.createAutomationActionGroup());
  }

  removeAutomationAction(index: number): void {
    if (this.automationActionControls.length <= 1) {
      return;
    }

    this.automationActionControls.removeAt(index);
  }

  onAutomationTriggerTypeChange(): void {
    const triggerType = this.requiredText(this.automationRuleForm.get('triggerType')?.value);
    if (triggerType === 'StatusChanged') {
      this.automationRuleForm.patchValue({ triggerStatus: this.requiredText(this.automationRuleForm.get('triggerStatus')?.value) || 'Tentative' });
    } else {
      this.automationRuleForm.patchValue({ triggerStatus: '' });
    }

    if (triggerType === 'DaysSinceLastActivity') {
      this.automationRuleForm.patchValue({ triggerDays: this.automationRuleForm.get('triggerDays')?.value ?? 3 });
      return;
    }

    if (triggerType === 'EventDateMinusDays') {
      this.automationRuleForm.patchValue({ triggerDays: this.automationRuleForm.get('triggerDays')?.value ?? 14 });
      return;
    }

    this.automationRuleForm.patchValue({ triggerDays: null });
  }

  saveAutomationRule(): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (this.automationRuleForm.invalid) {
      this.automationRuleForm.markAllAsTouched();
      this.setSectionError('automation', 'Complete automation rule details before saving.');
      return;
    }

    const value = this.automationRuleForm.getRawValue();
    const nowIso = new Date().toISOString();
    const existingRule = this.editingAutomationRuleId
      ? this.automationRules.find((rule) => rule.id === this.editingAutomationRuleId) ?? null
      : null;
    const isEditing = Boolean(this.editingAutomationRuleId);
    const nextSortOrder = existingRule?.sortOrder ?? this.automationRules.length + 1;

    const nextRule: AutomationRuleDto = {
      id: this.requiredText(value.id) || `rule-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      name: this.requiredText(value.name),
      description: this.optionalText(value.description),
      isActive: Boolean(value.isActive),
      sortOrder: nextSortOrder,
      trigger: {
        type: this.requiredText(value.triggerType),
        status: this.optionalText(value.triggerStatus),
        days: value.triggerDays !== null && value.triggerDays !== undefined ? Number(value.triggerDays) : null
      },
      conditions: this.automationConditionControls.controls
        .map((control) => {
          const group = control as FormGroup;
          const type = this.requiredText(group.get('type')?.value);
          return {
            type,
            operator: this.optionalText(group.get('operator')?.value),
            value: this.optionalText(group.get('value')?.value),
            amount: group.get('amount')?.value === null ? null : Number(group.get('amount')?.value ?? 0)
          } as AutomationConditionDto;
        })
        .filter((condition) => condition.type.length > 0),
      actions: this.automationActionControls.controls
        .map((control) => {
          const group = control as FormGroup;
          const type = this.requiredText(group.get('type')?.value);
          return {
            type,
            targetStatus: this.optionalText(group.get('targetStatus')?.value),
            templateKey: this.optionalText(group.get('templateKey')?.value),
            assigneeUserId: this.optionalText(group.get('assigneeUserId')?.value),
            taskTitle: this.optionalText(group.get('taskTitle')?.value),
            taskDueOffsetDays: group.get('taskDueOffsetDays')?.value === null ? null : Number(group.get('taskDueOffsetDays')?.value ?? 0),
            note: this.optionalText(group.get('note')?.value),
            notificationUserId: this.optionalText(group.get('notificationUserId')?.value)
          } as AutomationActionDto;
        })
        .filter((action) => action.type.length > 0),
      createdAtUtc: existingRule?.createdAtUtc ?? nowIso,
      updatedAtUtc: nowIso
    };

    if (nextRule.actions.length === 0) {
      this.setSectionError('automation', 'Add at least one automation action.');
      return;
    }

    const nextRules = this.automationRules
      .filter((rule) => rule.id !== nextRule.id)
      .concat(nextRule)
      .sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name))
      .map((rule, index) => ({ ...rule, sortOrder: index + 1 }));

    this.setSectionSaving('automation', true);
    this.api
      .upsertAutomationRules(this.selectedVenueId, nextRules)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rules) => {
          this.automationRules = [...rules].sort((left, right) => left.sortOrder - right.sortOrder);
          this.startNewAutomationRule();
          this.setSectionSuccess('automation', isEditing ? 'Automation rule updated.' : 'Automation rule created.');
          this.setSectionSaving('automation', false);
          this.loadAutomationExecutionLog();
        },
        error: (error) => {
          this.setSectionError('automation', this.resolveError(error, 'Unable to save automation rule.'));
          this.setSectionSaving('automation', false);
        }
      });
  }

  deleteAutomationRule(ruleId: string): void {
    if (!this.selectedVenueId) {
      return;
    }

    const nextRules = this.automationRules.filter((rule) => rule.id !== ruleId).map((rule, index) => ({ ...rule, sortOrder: index + 1 }));
    this.setSectionSaving('automation', true);
    this.api
      .upsertAutomationRules(this.selectedVenueId, nextRules)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rules) => {
          this.automationRules = [...rules].sort((left, right) => left.sortOrder - right.sortOrder);
          if (this.editingAutomationRuleId === ruleId) {
            this.startNewAutomationRule();
          }
          this.setSectionSuccess('automation', 'Automation rule removed.');
          this.setSectionSaving('automation', false);
          this.loadAutomationExecutionLog();
        },
        error: (error) => {
          this.setSectionError('automation', this.resolveError(error, 'Unable to remove automation rule.'));
          this.setSectionSaving('automation', false);
        }
      });
  }

  toggleAutomationRule(rule: AutomationRuleDto): void {
    if (!this.selectedVenueId) {
      return;
    }

    this.setSectionSaving('automation', true);
    this.api
      .updateAutomationRuleState(this.selectedVenueId, rule.id, !rule.isActive)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedRule) => {
          this.automationRules = this.automationRules
            .map((item) => (item.id === updatedRule.id ? updatedRule : item))
            .sort((left, right) => left.sortOrder - right.sortOrder);
          this.setSectionSuccess('automation', `${updatedRule.name} ${updatedRule.isActive ? 'activated' : 'deactivated'}.`);
          this.setSectionSaving('automation', false);
          this.loadAutomationExecutionLog();
        },
        error: (error) => {
          this.setSectionError('automation', this.resolveError(error, 'Unable to update automation rule state.'));
          this.setSectionSaving('automation', false);
        }
      });
  }

  saveEmailTemplate(): void {
    if (!this.selectedVenueId || this.emailTemplateForm.invalid) {
      this.emailTemplateForm.markAllAsTouched();
      this.setSectionError('email-templates', 'Complete all template fields before saving.');
      return;
    }

    const value = this.emailTemplateForm.getRawValue();
    const key = this.requiredText(value.key).toLowerCase();
    const nextTemplate: VenueEmailTemplateDto = {
      key,
      name: this.requiredText(value.name),
      subjectTemplate: this.requiredText(value.subjectTemplate),
      bodyHtmlTemplate: this.requiredText(value.bodyHtmlTemplate),
      category: this.optionalText(value.category) ?? 'Custom',
      isActive: Boolean(value.isActive)
    };

    const nextTemplates = [nextTemplate, ...this.emailTemplates.filter((template) => template.key !== key)];
    this.setSectionSaving('email-templates', true);
    this.api
      .upsertEmailTemplates(this.selectedVenueId, nextTemplates)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (templates) => {
          this.emailTemplates = templates;
          this.setSectionSuccess('email-templates', 'Email template saved.');
          this.setSectionSaving('email-templates', false);
          this.emailTemplateForm.reset({
            key: '',
            name: '',
            subjectTemplate: '',
            bodyHtmlTemplate: '',
            category: 'Custom',
            isActive: true
          });
        },
        error: (error) => {
          this.setSectionError('email-templates', this.resolveError(error, 'Unable to save email template.'));
          this.setSectionSaving('email-templates', false);
        }
      });
  }

  editEmailTemplate(template: VenueEmailTemplateDto): void {
    this.emailTemplateForm.reset({
      key: template.key,
      name: template.name,
      subjectTemplate: template.subjectTemplate,
      bodyHtmlTemplate: template.bodyHtmlTemplate,
      category: template.category || 'Custom',
      isActive: template.isActive
    });
  }

  insertEmailTemplateMergeField(controlName: 'subjectTemplate' | 'bodyHtmlTemplate', mergeField: string): void {
    const currentValue = this.emailTemplateForm.controls[controlName].value ?? '';
    const token = `{${mergeField}}`;
    const nextValue = currentValue.length > 0 ? `${currentValue} ${token}` : token;
    this.emailTemplateForm.controls[controlName].setValue(nextValue);
    this.emailTemplateForm.controls[controlName].markAsDirty();
  }

  get emailTemplatePreviewSubject(): string {
    const value = this.emailTemplateForm.controls.subjectTemplate.value ?? '';
    return this.applyEmailTemplateSampleMergeFields(value);
  }

  get emailTemplatePreviewBodyHtml(): string {
    const value = this.emailTemplateForm.controls.bodyHtmlTemplate.value ?? '';
    return this.applyEmailTemplateSampleMergeFields(value);
  }

  deleteEmailTemplate(key: string): void {
    if (!this.selectedVenueId) {
      return;
    }

    const templates = this.emailTemplates.filter((template) => template.key !== key);
    this.setSectionSaving('email-templates', true);
    this.api
      .upsertEmailTemplates(this.selectedVenueId, templates)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.emailTemplates = response;
          this.setSectionSuccess('email-templates', 'Email template removed.');
          this.setSectionSaving('email-templates', false);
        },
        error: (error) => {
          this.setSectionError('email-templates', this.resolveError(error, 'Unable to remove email template.'));
          this.setSectionSaving('email-templates', false);
        }
      });
  }

  private applyEmailTemplateSampleMergeFields(value: string): string {
    const samples: Record<string, string> = {
      client_name: 'Alex Morgan',
      client_first_name: 'Alex',
      event_date: '24/09/2026',
      venue_name: this.venueName || 'Grand Country Manor',
      proposal_link: 'https://flow.creventa.dev/portal/proposal/sample',
      payment_link: 'https://flow.creventa.dev/portal/payments/sample',
      portal_link: 'https://flow.creventa.dev/portal/sample',
      enquiry_ref: 'ENQ-2026-0101',
      operator_name: this.auth.session?.fullName || 'Venue Team',
      total_value: 'GBP 12,750.00',
      deposit_amount: 'GBP 2,550.00',
      hold_expiry_date: '30/09/2026',
      guest_count: '120'
    };

    let output = value ?? '';
    Object.entries(samples).forEach(([key, sample]) => {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      output = output.replace(new RegExp(`{{\\s*${escapedKey}\\s*}}`, 'gi'), sample);
      output = output.replace(new RegExp(`{\\s*${escapedKey}\\s*}`, 'gi'), sample);
    });

    return output;
  }

  saveWebsiteForm(): void {
    if (!this.selectedVenueId || this.websiteFormForm.invalid) {
      this.websiteFormForm.markAllAsTouched();
      this.setSectionError('website-forms', 'Complete required website form fields before saving.');
      return;
    }

    const value = this.websiteFormForm.getRawValue();
    const id = this.optionalText(value.id) ?? crypto.randomUUID();
    const nextForm: WebsiteFormSettingDto = {
      id,
      name: this.requiredText(value.name),
      slug: this.requiredText(value.slug).toLowerCase(),
      isActive: Boolean(value.isActive),
      successMessage: this.requiredText(value.successMessage),
      redirectUrl: this.optionalText(value.redirectUrl),
      requiredFields: this.parseCsvList(value.requiredFieldsCsv),
      optionalFields: this.parseCsvList(value.optionalFieldsCsv),
      styleJson: this.optionalText(value.styleJson)
    };

    const forms = [nextForm, ...this.websiteForms.filter((form) => form.id !== id)];
    this.setSectionSaving('website-forms', true);
    this.api
      .upsertWebsiteForms(this.selectedVenueId, forms)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.websiteForms = response;
          this.setSectionSuccess('website-forms', 'Website form saved.');
          this.setSectionSaving('website-forms', false);
          this.websiteFormForm.reset({
            id: '',
            name: '',
            slug: '',
            isActive: true,
            successMessage: 'Thank you. We have received your enquiry.',
            redirectUrl: '',
            requiredFieldsCsv: 'firstName,lastName,email,phone,eventDate,guestsExpected,dataConsent',
            optionalFieldsCsv: 'eventStyle,budgetRange,specialRequirements,marketingConsent',
            styleJson: '{"primaryColor":"#2563eb","buttonLabel":"Send Enquiry"}'
          });
        },
        error: (error) => {
          this.setSectionError('website-forms', this.resolveError(error, 'Unable to save website form.'));
          this.setSectionSaving('website-forms', false);
        }
      });
  }

  editWebsiteForm(form: WebsiteFormSettingDto): void {
    this.websiteFormForm.patchValue({
      id: form.id,
      name: form.name,
      slug: form.slug,
      isActive: form.isActive,
      successMessage: form.successMessage,
      redirectUrl: form.redirectUrl ?? '',
      requiredFieldsCsv: form.requiredFields.join(','),
      optionalFieldsCsv: form.optionalFields.join(','),
      styleJson: form.styleJson ?? ''
    });
  }

  deleteWebsiteForm(id: string): void {
    if (!this.selectedVenueId) {
      return;
    }

    const forms = this.websiteForms.filter((form) => form.id !== id);
    this.setSectionSaving('website-forms', true);
    this.api
      .upsertWebsiteForms(this.selectedVenueId, forms)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.websiteForms = response;
          this.setSectionSuccess('website-forms', 'Website form removed.');
          this.setSectionSaving('website-forms', false);
        },
        error: (error) => {
          this.setSectionError('website-forms', this.resolveError(error, 'Unable to remove website form.'));
          this.setSectionSaving('website-forms', false);
        }
      });
  }

  saveCalendarAccount(): void {
    if (!this.selectedVenueId || this.calendarAccountForm.invalid) {
      this.calendarAccountForm.markAllAsTouched();
      this.setSectionError('calendar-accounts', 'Enter valid calendar account values before saving.');
      return;
    }

    const value = this.calendarAccountForm.getRawValue();
    const id = this.optionalText(value.id) ?? crypto.randomUUID();
    const account: CalendarAccountSettingDto = {
      id,
      address: this.requiredText(value.address).toLowerCase(),
      provider: this.requiredText(value.provider),
      externalCalendarId: this.optionalText(value.externalCalendarId),
      isActive: Boolean(value.isActive),
      syncProvisionalHolds: Boolean(value.syncProvisionalHolds),
      connectionStatus: this.requiredText(value.connectionStatus).toLowerCase(),
      lastSyncedAtUtc: new Date().toISOString()
    };

    const accounts = [account, ...this.calendarAccounts.filter((item) => item.id !== id)];
    this.setSectionSaving('calendar-accounts', true);
    this.api
      .upsertCalendarAccounts(this.selectedVenueId, accounts)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.calendarAccounts = response;
          this.setSectionSuccess('calendar-accounts', 'Calendar account saved.');
          this.setSectionSaving('calendar-accounts', false);
          this.calendarAccountForm.reset({
            id: '',
            address: '',
            provider: 'Nylas',
            externalCalendarId: '',
            isActive: true,
            syncProvisionalHolds: true,
            connectionStatus: 'connected'
          });
        },
        error: (error) => {
          this.setSectionError('calendar-accounts', this.resolveError(error, 'Unable to save calendar account.'));
          this.setSectionSaving('calendar-accounts', false);
        }
      });
  }

  editCalendarAccount(account: CalendarAccountSettingDto): void {
    this.calendarAccountForm.patchValue({
      id: account.id,
      address: account.address,
      provider: account.provider,
      externalCalendarId: account.externalCalendarId ?? '',
      isActive: account.isActive,
      syncProvisionalHolds: account.syncProvisionalHolds,
      connectionStatus: account.connectionStatus
    });
  }

  deleteCalendarAccount(id: string): void {
    if (!this.selectedVenueId) {
      return;
    }

    const accounts = this.calendarAccounts.filter((item) => item.id !== id);
    this.setSectionSaving('calendar-accounts', true);
    this.api
      .upsertCalendarAccounts(this.selectedVenueId, accounts)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.calendarAccounts = response;
          this.setSectionSuccess('calendar-accounts', 'Calendar account removed.');
          this.setSectionSaving('calendar-accounts', false);
        },
        error: (error) => {
          this.setSectionError('calendar-accounts', this.resolveError(error, 'Unable to remove calendar account.'));
          this.setSectionSaving('calendar-accounts', false);
        }
      });
  }

  saveTaskTemplate(): void {
    if (!this.selectedVenueId || this.taskTemplateForm.invalid || this.taskTemplateItemControls.length === 0) {
      this.taskTemplateForm.markAllAsTouched();
      this.setSectionError('task-templates', 'Complete required task template fields before saving.');
      return;
    }

    const value = this.taskTemplateForm.getRawValue();
    const templateId = this.optionalText(value.id) ?? undefined;
    const items = this.taskTemplateItemControls.controls.map((control, index) => {
      const itemValue = control.getRawValue();
      return {
        title: this.requiredText(itemValue.title),
        description: this.optionalText(itemValue.description),
        category: this.requiredText(itemValue.category),
        priority: this.requiredText(itemValue.priority),
        defaultAssigneeRole: this.requiredText(itemValue.defaultAssigneeRole),
        dueDateOffset: Number(itemValue.dueDateOffset ?? 0),
        sortOrder: index + 1
      };
    });

    this.setSectionSaving('task-templates', true);
    const payload = {
      name: this.requiredText(value.name),
      eventType: this.requiredText(value.eventType),
      description: this.optionalText(value.description),
      isActive: Boolean(value.isActive),
      autoApplyOnStatus: this.requiredText(value.autoApplyOnStatus),
      tasks: items
    };

    const request$ = templateId
      ? this.api.updateTaskTemplate(templateId, payload)
      : this.api.createTaskTemplate({
          venueId: this.selectedVenueId,
          ...payload
        });

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSectionSuccess('task-templates', 'Task template saved.');
          this.setSectionSaving('task-templates', false);
          this.startNewTaskTemplate();
          this.loadTaskTemplatesSection(true);
        },
        error: (error) => {
          this.setSectionError('task-templates', this.resolveError(error, 'Unable to save task template.'));
          this.setSectionSaving('task-templates', false);
        }
      });
  }

  editTaskTemplate(template: TaskTemplateDto): void {
    this.taskTemplateForm.patchValue({
      id: template.id,
      name: template.name,
      eventType: template.eventType,
      description: template.description ?? '',
      isActive: template.isActive,
      autoApplyOnStatus: template.autoApplyOnStatus
    });

    const templateItems: Array<{
      title: string;
      description?: string | null;
      category: string;
      priority: string;
      defaultAssigneeRole: string;
      dueDateOffset: number;
      sortOrder: number;
    }> = template.tasks.length > 0
      ? template.tasks
      : [{
          title: '',
          description: '',
          category: 'other',
          priority: 'medium',
          defaultAssigneeRole: 'owner',
          dueDateOffset: 0,
          sortOrder: 1
        }];

    this.replaceFormArray(
      this.taskTemplateItemControls,
      templateItems.map((item, index) =>
        this.createTaskTemplateItemGroup({
          title: item.title,
          description: item.description ?? '',
          category: item.category,
          priority: item.priority,
          defaultAssigneeRole: item.defaultAssigneeRole,
          dueDateOffset: item.dueDateOffset,
          sortOrder: item.sortOrder || index + 1
        })
      )
    );
  }

  deleteTaskTemplate(templateId: string): void {
    this.setSectionSaving('task-templates', true);
    this.api
      .deleteTaskTemplate(templateId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSectionSuccess('task-templates', 'Task template removed.');
          this.setSectionSaving('task-templates', false);
          this.loadTaskTemplatesSection(true);
        },
        error: (error) => {
          this.setSectionError('task-templates', this.resolveError(error, 'Unable to remove task template.'));
          this.setSectionSaving('task-templates', false);
        }
      });
  }

  duplicateTaskTemplate(templateId: string): void {
    this.setSectionSaving('task-templates', true);
    this.api
      .duplicateTaskTemplate(templateId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSectionSuccess('task-templates', 'Task template duplicated.');
          this.setSectionSaving('task-templates', false);
          this.loadTaskTemplatesSection(true);
        },
        error: (error) => {
          this.setSectionError('task-templates', this.resolveError(error, 'Unable to duplicate task template.'));
          this.setSectionSaving('task-templates', false);
        }
      });
  }

  startNewTaskTemplate(): void {
    this.taskTemplateForm.reset({
      id: '',
      name: '',
      eventType: 'Wedding',
      description: '',
      isActive: true,
      autoApplyOnStatus: 'none'
    });
    this.replaceFormArray(this.taskTemplateItemControls, [this.createTaskTemplateItemGroup()]);
  }

  addTaskTemplateItem(): void {
    this.taskTemplateItemControls.push(this.createTaskTemplateItemGroup());
  }

  removeTaskTemplateItem(index: number): void {
    if (this.taskTemplateItemControls.length <= 1) {
      return;
    }
    this.taskTemplateItemControls.removeAt(index);
  }

  moveTaskTemplateItem(index: number, direction: -1 | 1): void {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.taskTemplateItemControls.length) {
      return;
    }

    const control = this.taskTemplateItemControls.at(index);
    this.taskTemplateItemControls.removeAt(index);
    this.taskTemplateItemControls.insert(targetIndex, control);
  }

  saveReportSchedule(): void {
    if (!this.selectedVenueId || this.reportScheduleForm.invalid) {
      this.reportScheduleForm.markAllAsTouched();
      this.setSectionError('report-schedules', 'Complete required schedule fields before saving.');
      return;
    }

    const value = this.reportScheduleForm.getRawValue();
    const selectedReportKeys = value.reportKeys ?? [];
    const recipients = this.parseCsvList(value.recipientsCsv);
    if (selectedReportKeys.length === 0) {
      this.setSectionError('report-schedules', 'Select at least one report type.');
      return;
    }

    if (recipients.length === 0) {
      this.setSectionError('report-schedules', 'Add at least one recipient email.');
      return;
    }

    const scheduleId = this.optionalText(value.id) ?? undefined;
    this.setSectionSaving('report-schedules', true);
    this.api
      .upsertReportSchedule(
        this.selectedVenueId,
        {
          name: this.requiredText(value.name),
          reportKeys: selectedReportKeys,
          frequency: this.requiredText(value.frequency),
          dayOfWeek: value.dayOfWeek ?? undefined,
          dayOfMonth: value.dayOfMonth ?? undefined,
          timeOfDay: this.requiredText(value.timeOfDay),
          format: value.format ?? 'both',
          recipients,
          isActive: Boolean(value.isActive),
          nextRunAtUtc: this.optionalText(value.nextRunAtUtc) ?? undefined,
          eventType: this.optionalText(value.eventType) ?? undefined,
          fromDate: this.optionalText(value.fromDate) ?? undefined,
          toDate: this.optionalText(value.toDate) ?? undefined
        },
        scheduleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSectionSuccess('report-schedules', 'Report schedule saved.');
          this.setSectionSaving('report-schedules', false);
          this.startNewReportSchedule();
          this.loadReportSchedulesSection(true);
        },
        error: (error) => {
          this.setSectionError('report-schedules', this.resolveError(error, 'Unable to save report schedule.'));
          this.setSectionSaving('report-schedules', false);
        }
      });
  }

  editReportSchedule(schedule: ReportScheduleDto): void {
    this.reportScheduleForm.patchValue({
      id: schedule.id,
      name: schedule.name,
      reportKeys: [...schedule.reportKeys],
      frequency: schedule.frequency,
      dayOfWeek: schedule.dayOfWeek ?? 1,
      dayOfMonth: schedule.dayOfMonth ?? null,
      timeOfDay: schedule.timeOfDay ?? '09:00',
      format: schedule.format ?? 'both',
      recipientsCsv: schedule.recipients.join(','),
      isActive: schedule.isActive,
      nextRunAtUtc: schedule.nextRunAtUtc ?? '',
      eventType: schedule.eventType ?? '',
      fromDate: schedule.fromDate ?? '',
      toDate: schedule.toDate ?? ''
    });
    this.activeExecutionScheduleId = schedule.id;
    this.loadReportScheduleExecutionLogs(schedule.id);
  }

  deleteReportScheduleItem(scheduleId: string): void {
    this.setSectionSaving('report-schedules', true);
    this.api
      .deleteReportSchedule(scheduleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSectionSuccess('report-schedules', 'Report schedule removed.');
          this.setSectionSaving('report-schedules', false);
          if (this.activeExecutionScheduleId === scheduleId) {
            this.activeExecutionScheduleId = null;
            this.scheduleExecutionLogs = [];
          }
          this.loadReportSchedulesSection(true);
        },
        error: (error) => {
          this.setSectionError('report-schedules', this.resolveError(error, 'Unable to remove report schedule.'));
          this.setSectionSaving('report-schedules', false);
        }
      });
  }

  startNewReportSchedule(): void {
    this.activeExecutionScheduleId = null;
    this.scheduleExecutionLogs = [];
    this.reportScheduleForm.reset({
      id: '',
      name: '',
      reportKeys: ['sales-performance'],
      frequency: 'weekly',
      dayOfWeek: 1,
      dayOfMonth: null,
      timeOfDay: '09:00',
      format: 'both',
      recipientsCsv: '',
      isActive: true,
      nextRunAtUtc: '',
      eventType: '',
      fromDate: '',
      toDate: ''
    });
  }

  toggleReportKey(reportKey: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const next = [...(this.reportScheduleForm.get('reportKeys')?.value ?? [])];
    if (target.checked) {
      if (!next.includes(reportKey)) {
        next.push(reportKey);
      }
    } else {
      const index = next.indexOf(reportKey);
      if (index >= 0) {
        next.splice(index, 1);
      }
    }

    this.reportScheduleForm.get('reportKeys')?.setValue(next);
  }

  isReportSelected(reportKey: string): boolean {
    const selected = this.reportScheduleForm.get('reportKeys')?.value ?? [];
    return selected.includes(reportKey);
  }

  sendReportScheduleNow(scheduleId: string): void {
    this.runningScheduleId = scheduleId;
    this.api
      .sendReportScheduleNow(scheduleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          const message = result.isSuccess ? 'Report schedule sent successfully.' : `Report schedule failed: ${result.message}`;
          if (result.isSuccess) {
            this.setSectionSuccess('report-schedules', message);
          } else {
            this.setSectionError('report-schedules', message);
          }

          this.runningScheduleId = null;
          this.loadReportSchedulesSection(true);
          this.loadReportScheduleExecutionLogs(scheduleId);
        },
        error: (error) => {
          this.runningScheduleId = null;
          this.setSectionError('report-schedules', this.resolveError(error, 'Unable to run report schedule now.'));
        }
      });
  }

  loadReportScheduleExecutionLogs(scheduleId: string): void {
    this.activeExecutionScheduleId = scheduleId;
    this.api
      .getReportScheduleExecutions(scheduleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.scheduleExecutionLogs = response.items;
        },
        error: () => {
          this.scheduleExecutionLogs = [];
        }
      });
  }

  startNewEmailAccount(): void {
    this.editingEmailAccountId = null;
    this.emailAccountForm.reset({
      address: '',
      provider: 'Nylas',
      externalAccountReference: '',
      isActive: true,
      useForOutbound: true
    });
  }

  editEmailAccount(account: VenueEmailAccountDto): void {
    this.editingEmailAccountId = account.id;
    this.emailAccountForm.patchValue({
      address: account.address,
      provider: account.provider,
      externalAccountReference: account.externalAccountReference ?? '',
      isActive: account.isActive,
      useForOutbound: account.useForOutbound
    });
  }

  saveEmailAccount(): void {
    if (this.emailAccountForm.invalid || !this.selectedVenueId) {
      this.emailAccountForm.markAllAsTouched();
      this.setSectionError('email-accounts', 'Enter a valid email account before saving.');
      return;
    }

    const value = this.emailAccountForm.getRawValue();
    const payload = {
      address: this.requiredText(value.address).toLowerCase(),
      provider: this.requiredText(value.provider),
      externalAccountReference: this.optionalText(value.externalAccountReference) ?? undefined,
      isActive: Boolean(value.isActive),
      useForOutbound: Boolean(value.useForOutbound)
    };

    this.setSectionSaving('email-accounts', true);

    const request$ = this.editingEmailAccountId
      ? this.api.updateVenueEmailAccount(this.selectedVenueId, this.editingEmailAccountId, payload)
      : this.api.createVenueEmailAccount(this.selectedVenueId, payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.setSectionSuccess('email-accounts', this.editingEmailAccountId ? 'Email account updated.' : 'Email account added.');
        this.setSectionSaving('email-accounts', false);
        this.startNewEmailAccount();
        this.loadEmailAccountsSection(true);
      },
      error: (error) => {
        this.setSectionError('email-accounts', this.resolveError(error, 'Unable to save email account.'));
        this.setSectionSaving('email-accounts', false);
      }
    });
  }

  deleteEmailAccount(accountId: string): void {
    if (!this.selectedVenueId) {
      return;
    }

    this.setSectionSaving('email-accounts', true);
    this.api
      .deleteVenueEmailAccount(this.selectedVenueId, accountId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSectionSuccess('email-accounts', 'Email account deleted.');
          this.setSectionSaving('email-accounts', false);
          this.loadEmailAccountsSection(true);
          if (this.editingEmailAccountId === accountId) {
            this.startNewEmailAccount();
          }
        },
        error: (error) => {
          this.setSectionError('email-accounts', this.resolveError(error, 'Unable to delete email account.'));
          this.setSectionSaving('email-accounts', false);
        }
      });
  }

  connectNylasFromForm(): void {
    if (!this.selectedVenueId) {
      return;
    }

    const addressValue = this.optionalText(this.emailAccountForm.get('address')?.value);
    this.connectNylas(addressValue);
  }

  connectNylas(loginHint?: string | null): void {
    if (!this.selectedVenueId) {
      return;
    }

    this.setSectionSaving('email-accounts', true);
    this.api
      .createNylasConnectUrl({
        venueId: this.selectedVenueId,
        provider: 'google',
        loginHint: loginHint ?? undefined,
        returnPath: '/settings?section=email-accounts'
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.setSectionSaving('email-accounts', false);
          this.nylasPopup = window.open(response.connectUrl, 'creventa-nylas-connect', 'width=720,height=840');
          if (!this.nylasPopup) {
            this.setSectionError('email-accounts', 'Popup was blocked. Allow popups and try again.');
          } else {
            this.setSectionSuccess('email-accounts', 'Complete the Nylas sign-in flow in the opened window.');
          }
        },
        error: (error) => {
          this.setSectionSaving('email-accounts', false);
          this.setSectionError('email-accounts', this.resolveError(error, 'Unable to start Nylas connection.'));
        }
      });
  }

  disconnectNylas(account: VenueEmailAccountDto): void {
    if (!this.selectedVenueId) {
      return;
    }

    this.setSectionSaving('email-accounts', true);
    this.api
      .disconnectNylasAccount(this.selectedVenueId, account.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSectionSaving('email-accounts', false);
          this.setSectionSuccess('email-accounts', `${account.address} disconnected from Nylas.`);
          this.loadEmailAccountsSection(true);
        },
        error: (error) => {
          this.setSectionSaving('email-accounts', false);
          this.setSectionError('email-accounts', this.resolveError(error, 'Unable to disconnect Nylas account.'));
        }
      });
  }

  getBudgetForm(month: number): FormGroup | null {
    return this.budgetForms.get(month) ?? null;
  }

  getBudgetTargetsArray(month: number): FormArray | null {
    const form = this.getBudgetForm(month);
    return form ? (form.get('targetsByEventType') as FormArray) : null;
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  trackByMonth(_: number, month: number): number {
    return month;
  }

  getMonthLabel(month: number): string {
    const date = new Date(Date.UTC(this.selectedBudgetYear, month - 1, 1));
    return date.toLocaleString('en-GB', { month: 'short' });
  }

  getReportDisplayName(reportKey: string): string {
    return this.reportCatalog.find((report) => report.key === reportKey)?.name ?? reportKey;
  }

  getScheduleFrequencyLabel(schedule: ReportScheduleDto): string {
    const time = schedule.timeOfDay || '09:00';
    if (schedule.frequency === 'daily') {
      return `Daily at ${time} UTC`;
    }

    if (schedule.frequency === 'weekly') {
      return `Weekly on ${this.getDayLabel(schedule.dayOfWeek)} at ${time} UTC`;
    }

    if (schedule.frequency === 'monthly') {
      return `Monthly on day ${schedule.dayOfMonth ?? 1} at ${time} UTC`;
    }

    return `${schedule.frequency} at ${time} UTC`;
  }

  getDayLabel(day?: number | null): string {
    const found = this.reportScheduleDayOptions.find((item) => item.value === day);
    return found?.label ?? 'Monday';
  }

  private ensureSectionLoaded(section: SettingsSectionKey): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (this.loadedSections.has(section)) {
      return;
    }

    switch (section) {
      case 'venue-profile':
        this.loadVenueProfileSection();
        break;
      case 'spaces':
        this.loadSpacesSection();
        break;
      case 'budgets':
        this.loadBudgetSection();
        break;
      case 'users':
        this.loadUsersSection();
        break;
      case 'payment-schedules':
        this.loadPaymentScheduleSection();
        break;
      case 'terms':
        this.loadTermsSection();
        break;
      case 'proposal-templates':
        this.loadProposalTemplatesSection();
        break;
      case 'planning-milestones':
        this.loadPlanningMilestonesSection();
        break;
      case 'sustainability':
        this.loadSustainabilitySection();
        break;
      case 'lost-reasons':
        this.loadLostReasonsSection();
        break;
      case 'report-configuration':
        this.loadReportConfigurationSection();
        break;
      case 'notifications':
        this.loadNotificationsSection();
        break;
      case 'automation':
        this.loadAutomationSection();
        break;
      case 'guest-profiles':
        this.loadGuestProfilesSection();
        break;
      case 'email-templates':
        this.loadEmailTemplatesSection();
        break;
      case 'website-forms':
        this.loadWebsiteFormsSection();
        break;
      case 'calendar-accounts':
        this.loadCalendarAccountsSection();
        break;
      case 'task-templates':
        this.loadTaskTemplatesSection();
        break;
      case 'report-schedules':
        this.loadReportSchedulesSection();
        break;
      case 'email-accounts':
        this.loadEmailAccountsSection();
        break;
      default:
        break;
    }

    this.loadedSections.add(section);
  }

  private loadVenueProfileSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('venue-profile')) {
      return;
    }

    this.setSectionLoading('venue-profile', true);

    this.api
      .getVenueProfile(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.venueProfile = profile;
          this.patchVenueForm(profile);
          this.setSectionLoading('venue-profile', false);
        },
        error: (error) => {
          this.setSectionError('venue-profile', this.resolveError(error, 'Unable to load venue profile.'));
          this.setSectionLoading('venue-profile', false);
        }
      });
  }

  private loadSpacesSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('spaces')) {
      return;
    }

    this.setSectionLoading('spaces', true);

    this.api
      .getVenueSpaces(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (spaces) => {
          this.spaces = spaces;
          this.loadSpaceCombinations();
          if (!this.editingSpaceId) {
            this.startNewSpace();
          }
        },
        error: (error) => {
          this.setSectionError('spaces', this.resolveError(error, 'Unable to load spaces.'));
          this.setSectionLoading('spaces', false);
        }
      });
  }

  private loadSpaceCombinations(): void {
    if (!this.selectedVenueId) {
      return;
    }

    this.api
      .getSpaceCombinations(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (combinations) => {
          this.combinations = combinations;
          if (!this.editingCombinationId) {
            this.startNewCombination();
          }
          this.setSectionLoading('spaces', false);
        },
        error: (error) => {
          this.setSectionError('spaces', this.resolveError(error, 'Unable to load space combinations.'));
          this.setSectionLoading('spaces', false);
        }
      });
  }

  private loadBudgetSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('budgets')) {
      return;
    }

    this.setSectionLoading('budgets', true);

    this.api
      .getVenueBudgets(this.selectedVenueId, this.selectedBudgetYear)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          this.budgets = rows;
          this.buildBudgetForms(rows);
          this.setSectionLoading('budgets', false);
        },
        error: (error) => {
          this.setSectionError('budgets', this.resolveError(error, 'Unable to load budgets.'));
          this.setSectionLoading('budgets', false);
        }
      });
  }

  private loadUsersSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('users')) {
      return;
    }

    this.setSectionLoading('users', true);

    this.api
      .getUsers(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.loadUserActivity();
        },
        error: (error) => {
          this.setSectionError('users', this.resolveError(error, 'Unable to load users.'));
          this.setSectionLoading('users', false);
        }
      });
  }

  private loadUserActivity(): void {
    this.api
      .getUserActivity(40)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.userActivity = items;
          this.setSectionLoading('users', false);
        },
        error: () => {
          this.userActivity = [];
          this.setSectionLoading('users', false);
        }
      });
  }

  private loadPaymentScheduleSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('payment-schedules')) {
      return;
    }

    this.setSectionLoading('payment-schedules', true);
    forkJoin({
      templates: this.api.getPaymentScheduleTemplates(this.selectedVenueId),
      references: this.api.getFinancialReferenceSettings(this.selectedVenueId)
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ templates, references }) => {
          this.paymentScheduleTemplates = templates;
          this.financialReferenceSettings = references;
          this.financialReferenceForm.patchValue(references);
          if (!this.paymentTemplateForm.get('id')?.value) {
            if (templates.length > 0) {
              this.editPaymentScheduleTemplate(templates[0]);
            } else {
              this.startNewPaymentScheduleTemplate();
            }
          }
          this.setSectionLoading('payment-schedules', false);
        },
        error: (error) => {
          this.paymentScheduleTemplates = [];
          this.financialReferenceSettings = {
            invoicePrefix: 'INV',
            creditNotePrefix: 'CN',
            receiptPrefix: 'RCT'
          };
          this.financialReferenceForm.patchValue(this.financialReferenceSettings);
          this.startNewPaymentScheduleTemplate();
          this.setSectionError('payment-schedules', this.resolveError(error, 'Unable to load payment schedule templates.'));
          this.setSectionLoading('payment-schedules', false);
        }
      });
  }

  private loadTermsSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('terms')) {
      return;
    }

    this.setSectionLoading('terms', true);
    this.api
      .getVenueTerms(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (documents) => {
          this.termsDocuments = documents;
          if (!this.selectedTermsSeriesId && documents.length > 0) {
            this.loadTermsVersionHistory(documents[0].id);
          }
          this.setSectionLoading('terms', false);
        },
        error: (error) => {
          this.termsDocuments = [];
          this.termsVersionHistory = [];
          this.setSectionError('terms', this.resolveError(error, 'Unable to load terms documents.'));
          this.setSectionLoading('terms', false);
        }
      });
  }

  loadTermsVersionHistory(termsId: string): void {
    if (!this.selectedVenueId || !termsId) {
      this.termsVersionHistory = [];
      this.selectedTermsSeriesId = null;
      return;
    }

    this.api
      .getVenueTermsVersions(this.selectedVenueId, termsId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (versions) => {
          this.termsVersionHistory = [...versions].sort((left, right) => {
            const versionDelta = (right.version || 0) - (left.version || 0);
            if (versionDelta !== 0) {
              return versionDelta;
            }

            return new Date(right.createdAtUtc).getTime() - new Date(left.createdAtUtc).getTime();
          });

          this.selectedTermsSeriesId = this.termsVersionHistory[0]?.seriesId ?? null;
          this.selectedTermsViewId = this.termsVersionHistory[0]?.id ?? null;
          this.selectedTermsDiffLeftId = this.termsVersionHistory[0]?.id ?? null;
          this.selectedTermsDiffRightId = this.termsVersionHistory.length > 1 ? this.termsVersionHistory[1].id : null;
        },
        error: (error) => {
          this.termsVersionHistory = [];
          this.selectedTermsSeriesId = null;
          this.selectedTermsViewId = null;
          this.selectedTermsDiffLeftId = null;
          this.selectedTermsDiffRightId = null;
          this.setSectionError('terms', this.resolveError(error, 'Unable to load terms version history.'));
        }
      });
  }

  private loadProposalTemplatesSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('proposal-templates')) {
      return;
    }

    this.setSectionLoading('proposal-templates', true);
    forkJoin({
      templates: this.api.getVenueProposalTemplates(this.selectedVenueId),
      pdfSettings: this.api.getProposalPdfSettings(this.selectedVenueId)
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ templates, pdfSettings }) => {
          this.proposalTemplates = templates;
          this.proposalPdfSettings = pdfSettings;
          this.setSectionLoading('proposal-templates', false);
        },
        error: (error) => {
          this.proposalTemplates = [];
          this.proposalPdfSettings = { paperSize: 'A4' };
          this.setSectionError('proposal-templates', this.resolveError(error, 'Unable to load proposal templates.'));
          this.setSectionLoading('proposal-templates', false);
        }
      });
  }

  private loadPlanningMilestonesSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('planning-milestones')) {
      return;
    }

    this.setSectionLoading('planning-milestones', true);
    this.api
      .getPlanningMilestones(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (milestones) => {
          this.planningMilestones = milestones;
          this.setSectionLoading('planning-milestones', false);
        },
        error: (error) => {
          this.planningMilestones = [];
          this.setSectionError('planning-milestones', this.resolveError(error, 'Unable to load planning milestones.'));
          this.setSectionLoading('planning-milestones', false);
        }
      });
  }

  private loadSustainabilitySection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('sustainability')) {
      return;
    }

    this.setSectionLoading('sustainability', true);
    this.api
      .getSustainabilitySettings(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (settings) => {
          this.sustainabilityEmissionFactors = [...settings.cateringEmissionFactors];
          const ratingMap = new Map(
            settings.energyRatingMultipliers.map((item) => [item.rating.toUpperCase(), item.multiplier])
          );
          this.sustainabilityEnergyRatingMultipliers = this.sustainabilityEnergyRatings.map((rating) => ({
            rating,
            multiplier: Number(ratingMap.get(rating) ?? 1)
          }));
          this.sustainabilityForm.patchValue({
            travelKgCo2ePerGuestKm: settings.travelKgCo2ePerGuestKm,
            carbonTargetKgPerGuest: settings.carbonTargetKgPerGuest,
            wasteTargetKgPerGuest: settings.wasteTargetKgPerGuest,
            diversionTargetPercent: settings.diversionTargetPercent,
            localSourcingRadiusMiles: settings.localSourcingRadiusMiles,
            carbonWeightPercent: settings.carbonWeightPercent,
            wasteWeightPercent: settings.wasteWeightPercent,
            sourcingWeightPercent: settings.sourcingWeightPercent,
            includeInProposalByDefault: settings.includeInProposalByDefault
          });
          this.setSectionLoading('sustainability', false);
        },
        error: (error) => {
          this.sustainabilityEmissionFactors = [];
          this.sustainabilityEnergyRatingMultipliers = [];
          this.setSectionError('sustainability', this.resolveError(error, 'Unable to load sustainability settings.'));
          this.setSectionLoading('sustainability', false);
        }
      });
  }

  private loadLostReasonsSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('lost-reasons')) {
      return;
    }

    this.setSectionLoading('lost-reasons', true);
    this.api
      .getLostReasons(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (reasons) => {
          this.lostReasons = [...reasons].sort((left, right) => left.sortOrder - right.sortOrder);
          this.setSectionLoading('lost-reasons', false);
        },
        error: (error) => {
          this.lostReasons = [];
          this.setSectionError('lost-reasons', this.resolveError(error, 'Unable to load lost reasons.'));
          this.setSectionLoading('lost-reasons', false);
        }
      });
  }

  private loadReportConfigurationSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('report-configuration')) {
      return;
    }

    this.setSectionLoading('report-configuration', true);
    this.api
      .getReportConfiguration(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (config) => {
          this.reportConfigurationForm.patchValue({
            provisionalWeightPercent: config.provisionalWeightPercent,
            tentativeWeightPercent: config.tentativeWeightPercent,
            openProposalWeightPercent: config.openProposalWeightPercent,
            responseTimeWeightPercent: config.responseTimeWeightPercent,
            leadSourceWeightPercent: config.leadSourceWeightPercent,
            eventTypeWeightPercent: config.eventTypeWeightPercent,
            engagementWeightPercent: config.engagementWeightPercent,
            budgetAlignmentWeightPercent: config.budgetAlignmentWeightPercent,
            leadTimeWeightPercent: config.leadTimeWeightPercent,
            completenessWeightPercent: config.completenessWeightPercent
          });
          this.setSectionLoading('report-configuration', false);
        },
        error: (error) => {
          this.setSectionError('report-configuration', this.resolveError(error, 'Unable to load report configuration.'));
          this.setSectionLoading('report-configuration', false);
        }
      });
  }

  private loadAutomationSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('automation')) {
      return;
    }

    this.setSectionLoading('automation', true);
    forkJoin({
      settings: this.api.getAutomationSettings(this.selectedVenueId),
      rules: this.api.getAutomationRules(this.selectedVenueId),
      executionLog: this.api.getAutomationExecutionLog(this.selectedVenueId)
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ settings, rules, executionLog }) => {
          this.automationSettingsForm.patchValue({
            proposalAcceptedTargetStatus: settings.proposalAcceptedTargetStatus,
            followUpInactiveDays: settings.followUpInactiveDays,
            autoArchiveEnabled: settings.autoArchiveEnabled,
            autoArchiveDays: settings.autoArchiveDays
          });
          this.automationRules = [...rules].sort((left, right) => left.sortOrder - right.sortOrder);
          this.automationExecutionLog = [...executionLog].sort((left, right) => right.timestampUtc.localeCompare(left.timestampUtc));
          this.startNewAutomationRule();
          this.setSectionLoading('automation', false);
        },
        error: (error) => {
          this.automationRules = [];
          this.automationExecutionLog = [];
          this.startNewAutomationRule();
          this.setSectionError('automation', this.resolveError(error, 'Unable to load automation settings.'));
          this.setSectionLoading('automation', false);
        }
      });
  }

  private loadNotificationsSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('notifications')) {
      return;
    }

    this.setSectionLoading('notifications', true);
    this.api
      .getNotificationPreferenceMatrix(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.notificationMatrixRows = [...response.rows].sort((left, right) => left.label.localeCompare(right.label));
          this.setSectionLoading('notifications', false);
        },
        error: (error) => {
          this.notificationMatrixRows = [];
          this.setSectionError('notifications', this.resolveError(error, 'Unable to load notification settings.'));
          this.setSectionLoading('notifications', false);
        }
      });
  }

  private loadAutomationExecutionLog(): void {
    if (!this.selectedVenueId) {
      return;
    }

    this.api
      .getAutomationExecutionLog(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          this.automationExecutionLog = [...rows].sort((left, right) => right.timestampUtc.localeCompare(left.timestampUtc));
        },
        error: () => {
          this.automationExecutionLog = [];
        }
      });
  }

  private loadGuestProfilesSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('guest-profiles')) {
      return;
    }

    this.setSectionLoading('guest-profiles', true);
    this.api
      .getContactCustomFields(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (fields) => {
          this.guestProfileCustomFields = [...fields].sort((left, right) => left.sortOrder - right.sortOrder);
          this.setSectionLoading('guest-profiles', false);
        },
        error: (error) => {
          this.guestProfileCustomFields = [];
          this.setSectionError('guest-profiles', this.resolveError(error, 'Unable to load guest profile fields.'));
          this.setSectionLoading('guest-profiles', false);
        }
      });
  }

  private loadEmailTemplatesSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('email-templates')) {
      return;
    }

    this.setSectionLoading('email-templates', true);
    this.api
      .getEmailTemplates(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (templates) => {
          this.emailTemplates = templates.map((template) => ({
            ...template,
            category: template.category || 'Custom'
          }));
          this.setSectionLoading('email-templates', false);
        },
        error: (error) => {
          this.emailTemplates = [];
          this.setSectionError('email-templates', this.resolveError(error, 'Unable to load email templates.'));
          this.setSectionLoading('email-templates', false);
        }
      });
  }

  private loadWebsiteFormsSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('website-forms')) {
      return;
    }

    this.setSectionLoading('website-forms', true);
    this.api
      .getWebsiteForms(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (forms) => {
          this.websiteForms = forms;
          this.setSectionLoading('website-forms', false);
        },
        error: (error) => {
          this.websiteForms = [];
          this.setSectionError('website-forms', this.resolveError(error, 'Unable to load website forms.'));
          this.setSectionLoading('website-forms', false);
        }
      });
  }

  private loadCalendarAccountsSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('calendar-accounts')) {
      return;
    }

    this.setSectionLoading('calendar-accounts', true);
    this.api
      .getCalendarAccounts(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (accounts) => {
          this.calendarAccounts = accounts;
          this.setSectionLoading('calendar-accounts', false);
        },
        error: (error) => {
          this.calendarAccounts = [];
          this.setSectionError('calendar-accounts', this.resolveError(error, 'Unable to load calendar accounts.'));
          this.setSectionLoading('calendar-accounts', false);
        }
      });
  }

  private loadTaskTemplatesSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('task-templates')) {
      return;
    }

    this.setSectionLoading('task-templates', true);
    this.api
      .getTaskTemplates(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.taskTemplates = response.templates;
          if (!this.taskTemplateForm.get('id')?.value) {
            this.startNewTaskTemplate();
          }
          this.setSectionLoading('task-templates', false);
        },
        error: (error) => {
          this.taskTemplates = [];
          this.setSectionError('task-templates', this.resolveError(error, 'Unable to load task templates.'));
          this.startNewTaskTemplate();
          this.setSectionLoading('task-templates', false);
        }
      });
  }

  private loadReportSchedulesSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('report-schedules')) {
      return;
    }

    this.setSectionLoading('report-schedules', true);
    forkJoin({
      schedules: this.api.getReportSchedules(this.selectedVenueId),
      catalog: this.api.getReportsCatalog()
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.reportSchedules = response.schedules.items;
          this.reportCatalog = response.catalog.reports.filter((report) => this.reportScheduleReportKeys.includes(report.key));
          if (!this.reportScheduleForm.get('id')?.value) {
            this.startNewReportSchedule();
          }
          this.setSectionLoading('report-schedules', false);
        },
        error: (error) => {
          this.reportSchedules = [];
          this.reportCatalog = [];
          this.setSectionError('report-schedules', this.resolveError(error, 'Unable to load report schedules.'));
          this.setSectionLoading('report-schedules', false);
        }
      });
  }

  private loadEmailAccountsSection(force = false): void {
    if (!this.selectedVenueId) {
      return;
    }

    if (!force && this.loadedSections.has('email-accounts')) {
      return;
    }

    this.setSectionLoading('email-accounts', true);
    this.api
      .getNylasStatus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (status) => {
          this.nylasStatus = status;
        },
        error: () => {
          this.nylasStatus = { isConfigured: false, redirectUri: '', defaultProvider: 'google' };
        }
      });

    this.api
      .getVenueEmailAccounts(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (accounts) => {
          this.emailAccounts = accounts;
          if (!this.editingEmailAccountId) {
            this.startNewEmailAccount();
          }
          this.setSectionLoading('email-accounts', false);
        },
        error: (error) => {
          this.emailAccounts = [];
          this.setSectionError('email-accounts', this.resolveError(error, 'Unable to load venue email accounts.'));
          this.setSectionLoading('email-accounts', false);
        }
      });
  }

  private patchVenueForm(profile: VenueProfileDto): void {
    this.venueForm.patchValue({
      name: profile.name,
      legalEntityName: profile.legalEntityName ?? '',
      addressLine1: profile.addressLine1 ?? '',
      addressLine2: profile.addressLine2 ?? '',
      city: profile.city ?? '',
      region: profile.region ?? '',
      postcode: profile.postcode ?? '',
      countryCode: profile.countryCode,
      phoneNumberE164: profile.phoneNumberE164 ?? '',
      enquiriesEmail: profile.enquiriesEmail ?? '',
      websiteUrl: profile.websiteUrl ?? '',
      vatNumber: profile.vatNumber ?? '',
      companyRegistrationNumber: profile.companyRegistrationNumber ?? '',
      logoUrl: profile.logoUrl ?? '',
      description: profile.description ?? '',
      cancellationPolicy: profile.cancellationPolicy ?? '',
      currencyCode: profile.currencyCode,
      defaultVatRate: profile.defaultVatRate,
      timeZone: profile.timeZone,
      locale: profile.locale,
      minimumBookingNoticeDays: profile.minimumBookingNoticeDays,
      defaultHoldPeriodDays: profile.defaultHoldPeriodDays,
      holdWarningDays: profile.holdWarningDays,
      holdAutoReleaseMode: profile.holdAutoReleaseMode,
      maxHoldsPerDateAndSpace: profile.maxHoldsPerDateAndSpace
    });
  }

  private buildBudgetForms(rows: BudgetMonthDto[]): void {
    this.budgetForms.clear();

    for (const month of this.monthNumbers) {
      const row = rows.find((item) => item.month === month);
      const targets = row?.targetsByEventType?.length
        ? row.targetsByEventType
        : this.defaultEventTypes.map((eventType) => ({
            eventType,
            revenueTarget: 0,
            coversTarget: 0,
            bookingCountTarget: 0,
            averageSellingPriceTarget: 0
          }));

      const form = this.formBuilder.group({
        month: [month],
        overallRevenueTarget: [row?.overallRevenueTarget ?? 0, [Validators.required, Validators.min(0)]],
        currencyCode: [row?.currencyCode ?? (this.venueForm.get('currencyCode')?.value ?? 'GBP'), Validators.required],
        targetsByEventType: this.formBuilder.array(targets.map((target) => this.createBudgetTargetGroup(target)))
      });

      this.budgetForms.set(month, form);
    }
  }

  private mapSpacePayload(): {
    name: string;
    description?: string | null;
    locationText?: string | null;
    floorAreaSqm?: number | null;
    facilitiesCsv: string;
    minimumSpendAmount?: number | null;
    minimumSpendCurrencyCode: string;
    turnaroundMinutes: number;
    isActive: boolean;
    capacityBySetup: SpaceCapacityDto[];
    pricing: SpacePricingDto[];
  } {
    const value = this.spaceForm.getRawValue();

    return {
      name: this.requiredText(value.name),
      description: this.optionalText(value.description),
      locationText: this.optionalText(value.locationText),
      floorAreaSqm: value.floorAreaSqm === null ? null : Number(value.floorAreaSqm),
      facilitiesCsv: this.requiredText(value.facilitiesCsv),
      minimumSpendAmount: value.minimumSpendAmount === null ? null : Number(value.minimumSpendAmount),
      minimumSpendCurrencyCode: this.requiredText(value.minimumSpendCurrencyCode).toUpperCase(),
      turnaroundMinutes: Number(value.turnaroundMinutes ?? 0),
      isActive: Boolean(value.isActive),
      capacityBySetup: this.mapCapacityRules(this.spaceCapacityControls),
      pricing: this.mapPricingRules(this.spacePricingControls)
    };
  }

  private mapCapacityRules(array: FormArray): SpaceCapacityDto[] {
    return array.controls
      .map((control) => {
        const group = control as FormGroup;
        return {
          setupStyle: this.requiredText(group.get('setupStyle')?.value ?? ''),
          capacity: Number(group.get('capacity')?.value ?? 0)
        };
      })
      .filter((rule) => rule.setupStyle && rule.capacity > 0);
  }

  private mapPricingRules(array: FormArray): SpacePricingDto[] {
    return array.controls
      .map((control) => {
        const group = control as FormGroup;
        const dayOfWeekValue = group.get('dayOfWeek')?.value;

        return {
          rateType: this.requiredText(group.get('rateType')?.value ?? ''),
          amount: Number(group.get('amount')?.value ?? 0),
          currencyCode: this.requiredText(group.get('currencyCode')?.value ?? 'GBP').toUpperCase(),
          dayOfWeek: dayOfWeekValue ? String(dayOfWeekValue) : null
        };
      })
      .filter((rule) => rule.rateType && rule.amount >= 0);
  }

  private createCapacityGroup(rule?: Partial<SpaceCapacityDto>): FormGroup {
    return this.formBuilder.group({
      setupStyle: [rule?.setupStyle ?? 'Banquet', Validators.required],
      capacity: [rule?.capacity ?? 80, [Validators.required, Validators.min(1)]]
    });
  }

  private createPricingGroup(rule?: Partial<SpacePricingDto>): FormGroup {
    return this.formBuilder.group({
      rateType: [rule?.rateType ?? 'FullDay', Validators.required],
      amount: [rule?.amount ?? 0, [Validators.required, Validators.min(0)]],
      currencyCode: [rule?.currencyCode ?? (this.venueForm.get('currencyCode')?.value ?? 'GBP'), Validators.required],
      dayOfWeek: [rule?.dayOfWeek ?? '']
    });
  }

  private createBudgetTargetGroup(target?: Partial<BudgetByEventTypeDto>): FormGroup {
    return this.formBuilder.group({
      eventType: [target?.eventType ?? '', Validators.required],
      revenueTarget: [target?.revenueTarget ?? 0, [Validators.required, Validators.min(0)]],
      coversTarget: [target?.coversTarget ?? 0, [Validators.required, Validators.min(0)]],
      bookingCountTarget: [target?.bookingCountTarget ?? 0, [Validators.required, Validators.min(0)]],
      averageSellingPriceTarget: [target?.averageSellingPriceTarget ?? 0, [Validators.required, Validators.min(0)]]
    });
  }

  private createAutomationConditionGroup(condition?: Partial<AutomationConditionDto>): FormGroup {
    return this.formBuilder.group({
      type: [condition?.type ?? 'EventType', Validators.required],
      operator: [condition?.operator ?? 'Equals'],
      value: [condition?.value ?? ''],
      amount: [condition?.amount ?? null]
    });
  }

  private createAutomationActionGroup(action?: Partial<AutomationActionDto>): FormGroup {
    return this.formBuilder.group({
      type: [action?.type ?? 'CreateTask', Validators.required],
      targetStatus: [action?.targetStatus ?? ''],
      templateKey: [action?.templateKey ?? ''],
      assigneeUserId: [action?.assigneeUserId ?? ''],
      taskTitle: [action?.taskTitle ?? 'Follow up'],
      taskDueOffsetDays: [action?.taskDueOffsetDays ?? 1, [Validators.min(0), Validators.max(3650)]],
      note: [action?.note ?? ''],
      notificationUserId: [action?.notificationUserId ?? '']
    });
  }

  private createTaskTemplateItemGroup(item?: {
    title?: string;
    description?: string;
    category?: string;
    priority?: string;
    defaultAssigneeRole?: string;
    dueDateOffset?: number;
    sortOrder?: number;
  }): FormGroup {
    return this.formBuilder.group({
      title: [item?.title ?? '', Validators.required],
      description: [item?.description ?? ''],
      category: [item?.category ?? 'other', Validators.required],
      priority: [item?.priority ?? 'medium', Validators.required],
      defaultAssigneeRole: [item?.defaultAssigneeRole ?? 'owner', Validators.required],
      dueDateOffset: [item?.dueDateOffset ?? 0, [Validators.required, Validators.min(-3650), Validators.max(3650)]],
      sortOrder: [item?.sortOrder ?? 1, [Validators.required, Validators.min(1)]]
    });
  }

  private replaceFormArray(target: FormArray, next: FormGroup[]): void {
    while (target.length > 0) {
      target.removeAt(0);
    }

    for (const group of next) {
      target.push(group);
    }
  }

  private createDefaultPaymentTemplateMilestone(): PaymentScheduleTemplateSettingDto['milestones'][number] {
    return {
      name: 'Deposit',
      dueDateRule: 'On confirmation',
      amountType: 'Percentage',
      amount: 25,
      paymentMethodsAccepted: ['Online (card)', 'Bank transfer'],
      autoReminderEnabled: true,
      autoReminderDays: 2,
      lateReminderEnabled: true,
      lateReminderDays: 2
    };
  }

  private sanitizeFinancialPrefix(raw: string | null | undefined, fallback: string): string {
    const cleaned = (raw ?? '')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '');

    return cleaned.length > 0 ? cleaned.slice(0, 20) : fallback;
  }

  private persistPaymentScheduleTemplates(successMessage: string): void {
    if (!this.selectedVenueId) {
      return;
    }

    this.setSectionSaving('payment-schedules', true);
    this.api
      .upsertPaymentScheduleTemplates(this.selectedVenueId, this.paymentScheduleTemplates)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (templates) => {
          this.paymentScheduleTemplates = templates;
          const selectedId = this.optionalText(this.paymentTemplateForm.get('id')?.value);
          if (selectedId) {
            const selectedTemplate = templates.find((template) => template.id === selectedId);
            if (selectedTemplate) {
              this.editPaymentScheduleTemplate(selectedTemplate);
            }
          } else if (templates.length === 0) {
            this.startNewPaymentScheduleTemplate();
          }
          this.setSectionSuccess('payment-schedules', successMessage);
          this.setSectionSaving('payment-schedules', false);
        },
        error: (error) => {
          this.setSectionError('payment-schedules', this.resolveError(error, 'Unable to save payment schedule templates.'));
          this.setSectionSaving('payment-schedules', false);
        }
      });
  }

  private persistProposalTemplates(successMessage: string): void {
    if (!this.selectedVenueId) {
      return;
    }

    this.setSectionSaving('proposal-templates', true);
    this.api
      .upsertVenueProposalTemplates(this.selectedVenueId, this.proposalTemplates)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (templates) => {
          this.proposalTemplates = templates;
          this.setSectionSuccess('proposal-templates', successMessage);
          this.setSectionSaving('proposal-templates', false);
        },
        error: (error) => {
          this.setSectionError('proposal-templates', this.resolveError(error, 'Unable to save proposal templates.'));
          this.setSectionSaving('proposal-templates', false);
        }
      });
  }

  private persistPlanningMilestones(successMessage: string): void {
    if (!this.selectedVenueId) {
      return;
    }

    this.setSectionSaving('planning-milestones', true);
    this.api
      .upsertPlanningMilestones(this.selectedVenueId, this.planningMilestones)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (milestones) => {
          this.planningMilestones = milestones;
          this.setSectionSuccess('planning-milestones', successMessage);
          this.setSectionSaving('planning-milestones', false);
        },
        error: (error) => {
          this.setSectionError('planning-milestones', this.resolveError(error, 'Unable to save planning milestones.'));
          this.setSectionSaving('planning-milestones', false);
        }
      });
  }

  private persistLostReasons(nextReasons: LostReasonSettingDto[], successMessage: string): void {
    if (!this.selectedVenueId) {
      return;
    }

    this.setSectionSaving('lost-reasons', true);
    this.api
      .upsertLostReasons(this.selectedVenueId, nextReasons)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (reasons) => {
          this.lostReasons = [...reasons].sort((left, right) => left.sortOrder - right.sortOrder);
          this.setSectionSuccess('lost-reasons', successMessage);
          this.setSectionSaving('lost-reasons', false);
        },
        error: (error) => {
          this.setSectionError('lost-reasons', this.resolveError(error, 'Unable to save lost reasons.'));
          this.setSectionSaving('lost-reasons', false);
        }
      });
  }

  private resetSectionMessages(): void {
    for (const section of this.sections) {
      this.sectionStates[section.key].error = '';
      this.sectionStates[section.key].success = '';
      this.sectionStates[section.key].loading = false;
      this.sectionStates[section.key].saving = false;
    }
  }

  private setSectionLoading(section: SettingsSectionKey, loading: boolean): void {
    this.sectionStates[section].loading = loading;
    if (loading) {
      this.sectionStates[section].error = '';
      this.sectionStates[section].success = '';
    }
  }

  private setSectionSaving(section: SettingsSectionKey, saving: boolean): void {
    this.sectionStates[section].saving = saving;
    if (saving) {
      this.sectionStates[section].error = '';
      this.sectionStates[section].success = '';
    }
  }

  private setSectionError(section: SettingsSectionKey, message: string): void {
    this.sectionStates[section].error = message;
    this.sectionStates[section].success = '';
  }

  private setSectionSuccess(section: SettingsSectionKey, message: string): void {
    this.sectionStates[section].success = message;
    this.sectionStates[section].error = '';
  }

  private handleNylasMessage(event: MessageEvent): void {
    if (event.origin !== window.location.origin || !event.data || typeof event.data !== 'object') {
      return;
    }

    const payload = event.data as {
      source?: string;
      success?: boolean;
      message?: string;
      venueId?: string;
    };

    if (payload.source !== 'creventaflow-nylas') {
      return;
    }

    if (!this.selectedVenueId || (payload.venueId && payload.venueId !== this.selectedVenueId)) {
      return;
    }

    if (payload.success) {
      this.setSectionSuccess('email-accounts', payload.message ?? 'Nylas account connected.');
      this.startNewEmailAccount();
      this.loadEmailAccountsSection(true);
      return;
    }

    this.setSectionError('email-accounts', payload.message ?? 'Nylas connection failed.');
  }

  private optionalText(value: unknown): string | null {
    const text = String(value ?? '').trim();
    return text.length > 0 ? text : null;
  }

  private requiredText(value: unknown): string {
    return String(value ?? '').trim();
  }

  private parseCsvList(value: unknown): string[] {
    return String(value ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  private resolveError(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const payload = (error as { error?: unknown }).error;
      if (typeof payload === 'string') {
        return payload;
      }
      if (typeof payload === 'object' && payload !== null && 'message' in payload) {
        const message = (payload as { message?: unknown }).message;
        if (typeof message === 'string' && message.trim()) {
          return message;
        }
      }
    }

    return fallback;
  }
}
