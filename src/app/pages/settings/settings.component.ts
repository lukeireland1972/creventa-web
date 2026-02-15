import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AutomationSettingsDto,
  CalendarAccountSettingDto,
  ApiService,
  BudgetByEventTypeDto,
  BudgetMonthDto,
  ReportScheduleDto,
  PaymentScheduleTemplateSettingDto,
  PlanningMilestoneSettingDto,
  ProposalTemplateSettingDto,
  ReportConfigurationSettingDto,
  SpaceCapacityDto,
  SpaceCombinationDto,
  SpacePricingDto,
  SpaceSummaryDto,
  TermsDocumentSettingDto,
  TaskTemplateDto,
  UpdateVenueProfileRequest,
  UserActivityItemDto,
  UserSummaryDto,
  VenueEmailTemplateDto,
  VenueEmailAccountDto,
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
  | 'report-configuration'
  | 'automation'
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
  imports: [ReactiveFormsModule, FormsModule, DatePipe, DecimalPipe],
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
      key: 'report-configuration',
      title: 'Report Configuration',
      description: 'Set pace/forecast conversion weights used by pipeline and pace reporting.'
    },
    {
      key: 'automation',
      title: 'Automation',
      description: 'Control accepted-proposal status transitions and archive/follow-up automation defaults.'
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
    'report-configuration': { loading: false, saving: false, error: '', success: '' },
    automation: { loading: false, saving: false, error: '', success: '' },
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
  termsDocuments: TermsDocumentSettingDto[] = [];
  proposalTemplates: ProposalTemplateSettingDto[] = [];
  planningMilestones: PlanningMilestoneSettingDto[] = [];
  emailTemplates: VenueEmailTemplateDto[] = [];
  websiteForms: WebsiteFormSettingDto[] = [];
  calendarAccounts: CalendarAccountSettingDto[] = [];
  taskTemplates: TaskTemplateDto[] = [];
  reportSchedules: ReportScheduleDto[] = [];
  emailAccounts: VenueEmailAccountDto[] = [];
  editingEmailAccountId: string | null = null;

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
    name: ['', Validators.required],
    eventType: ['Wedding', Validators.required],
    milestoneName: ['Booking Deposit', Validators.required],
    dueDateRule: ['X days after confirmation', Validators.required],
    amountType: ['Percentage', Validators.required],
    amount: [25, [Validators.required, Validators.min(0.01)]],
    acceptedMethodsCsv: ['Online (card), Bank transfer']
  });

  readonly termsForm = this.formBuilder.group({
    title: ['', Validators.required],
    eventType: ['Wedding', Validators.required],
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

  readonly reportConfigurationForm = this.formBuilder.group({
    provisionalWeightPercent: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
    tentativeWeightPercent: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    openProposalWeightPercent: [30, [Validators.required, Validators.min(0), Validators.max(100)]]
  });

  readonly automationSettingsForm = this.formBuilder.group({
    proposalAcceptedTargetStatus: ['Provisional', Validators.required],
    followUpInactiveDays: [3, [Validators.required, Validators.min(1), Validators.max(30)]],
    autoArchiveEnabled: [true],
    autoArchiveDays: [90, [Validators.required, Validators.min(7), Validators.max(3650)]]
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
    triggerStatus: ['Confirmed', Validators.required],
    assignToEventManager: [true],
    itemTitle: ['Follow up', Validators.required],
    itemDescription: [''],
    itemPriority: ['Medium', Validators.required],
    itemDueDateRule: ['days-after-status-change', Validators.required],
    itemDueOffsetDays: [1, [Validators.required, Validators.min(0)]]
  });

  readonly reportScheduleForm = this.formBuilder.group({
    id: [''],
    name: ['', Validators.required],
    reportKey: ['pipeline', Validators.required],
    frequency: ['weekly', Validators.required],
    recipientsCsv: ['', Validators.required],
    isActive: [true],
    nextRunAtUtc: [''],
    filtersJson: ['{}']
  });

  private budgetForms = new Map<number, FormGroup>();

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

  get currentBudgetForm(): FormGroup | null {
    return this.getBudgetForm(this.selectedBudgetMonth);
  }

  ngOnInit(): void {
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

  savePaymentScheduleTemplate(): void {
    if (this.paymentTemplateForm.invalid || !this.selectedVenueId) {
      this.paymentTemplateForm.markAllAsTouched();
      this.setSectionError('payment-schedules', 'Complete required template fields before saving.');
      return;
    }

    const value = this.paymentTemplateForm.getRawValue();
    const methods = this.requiredText(value.acceptedMethodsCsv)
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const template: PaymentScheduleTemplateSettingDto = {
      id: crypto.randomUUID(),
      name: this.requiredText(value.name),
      eventType: this.requiredText(value.eventType),
      isDefault: this.paymentScheduleTemplates.length === 0,
      milestones: [
        {
          name: this.requiredText(value.milestoneName),
          dueDateRule: this.requiredText(value.dueDateRule),
          amountType: this.requiredText(value.amountType) || 'Percentage',
          amount: Number(value.amount ?? 0),
          paymentMethodsAccepted: methods.length > 0 ? methods : ['Online (card)', 'Bank transfer'],
          autoReminderEnabled: true,
          autoReminderDays: 2,
          lateReminderEnabled: true,
          lateReminderDays: 2
        }
      ]
    };

    this.paymentScheduleTemplates = [template, ...this.paymentScheduleTemplates].slice(0, 20);
    this.persistPaymentScheduleTemplates('Payment schedule template saved.');

    this.paymentTemplateForm.reset({
      name: '',
      eventType: 'Wedding',
      milestoneName: 'Booking Deposit',
      dueDateRule: 'X days after confirmation',
      amountType: 'Percentage',
      amount: 25,
      acceptedMethodsCsv: 'Online (card), Bank transfer'
    });
  }

  deletePaymentScheduleTemplate(id: string): void {
    this.paymentScheduleTemplates = this.paymentScheduleTemplates.filter((item) => item.id !== id);
    this.persistPaymentScheduleTemplates('Payment schedule template removed.');
  }

  saveTermsDocument(): void {
    if (this.termsForm.invalid || !this.selectedVenueId) {
      this.termsForm.markAllAsTouched();
      this.setSectionError('terms', 'Enter title, event type, and content before saving terms.');
      return;
    }

    const value = this.termsForm.getRawValue();
    const title = this.requiredText(value.title);
    const versionsForTitle = this.termsDocuments.filter((doc) => doc.title.toLowerCase() === title.toLowerCase());
    const highestVersion = versionsForTitle
      .map((doc) => Number(doc.version.toLowerCase().replace('v', '')))
      .filter((version) => Number.isFinite(version))
      .reduce((max, version) => Math.max(max, version), 0);
    const nextVersion = `v${highestVersion + 1}`;

    const draft: TermsDocumentSettingDto = {
      id: crypto.randomUUID(),
      title,
      eventType: this.requiredText(value.eventType),
      version: nextVersion,
      content: this.requiredText(value.content),
      isActive: true,
      updatedAtUtc: new Date().toISOString()
    };

    this.termsDocuments = [draft, ...this.termsDocuments].slice(0, 40);
    this.persistTermsDocuments(`Terms document saved as ${nextVersion}.`);

    this.termsForm.reset({
      title: '',
      eventType: 'Wedding',
      content: ''
    });
  }

  deleteTermsDocument(id: string): void {
    this.termsDocuments = this.termsDocuments.filter((item) => item.id !== id);
    this.persistTermsDocuments('Terms document removed.');
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

  saveReportConfiguration(): void {
    if (this.reportConfigurationForm.invalid || !this.selectedVenueId) {
      this.reportConfigurationForm.markAllAsTouched();
      this.setSectionError('report-configuration', 'Enter valid conversion weights before saving.');
      return;
    }

    const value = this.reportConfigurationForm.getRawValue();
    const payload: ReportConfigurationSettingDto = {
      provisionalWeightPercent: Number(value.provisionalWeightPercent ?? 80),
      tentativeWeightPercent: Number(value.tentativeWeightPercent ?? 50),
      openProposalWeightPercent: Number(value.openProposalWeightPercent ?? 30)
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
            openProposalWeightPercent: response.openProposalWeightPercent
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
            isActive: true
          });
        },
        error: (error) => {
          this.setSectionError('email-templates', this.resolveError(error, 'Unable to save email template.'));
          this.setSectionSaving('email-templates', false);
        }
      });
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
    if (!this.selectedVenueId || this.taskTemplateForm.invalid) {
      this.taskTemplateForm.markAllAsTouched();
      this.setSectionError('task-templates', 'Complete required task template fields before saving.');
      return;
    }

    const value = this.taskTemplateForm.getRawValue();
    const templateId = this.optionalText(value.id) ?? undefined;
    this.setSectionSaving('task-templates', true);
    this.api
      .upsertTaskTemplate(
        this.selectedVenueId,
        {
          name: this.requiredText(value.name),
          eventType: this.requiredText(value.eventType),
          triggerStatus: this.requiredText(value.triggerStatus),
          assignToEventManager: Boolean(value.assignToEventManager),
          items: [
            {
              title: this.requiredText(value.itemTitle),
              description: this.optionalText(value.itemDescription) ?? undefined,
              priority: this.requiredText(value.itemPriority),
              dueDateRule: this.requiredText(value.itemDueDateRule),
              dueOffsetDays: Number(value.itemDueOffsetDays ?? 0)
            }
          ]
        },
        templateId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSectionSuccess('task-templates', 'Task template saved.');
          this.setSectionSaving('task-templates', false);
          this.taskTemplateForm.reset({
            id: '',
            name: '',
            eventType: 'Wedding',
            triggerStatus: 'Confirmed',
            assignToEventManager: true,
            itemTitle: 'Follow up',
            itemDescription: '',
            itemPriority: 'Medium',
            itemDueDateRule: 'days-after-status-change',
            itemDueOffsetDays: 1
          });
          this.loadTaskTemplatesSection(true);
        },
        error: (error) => {
          this.setSectionError('task-templates', this.resolveError(error, 'Unable to save task template.'));
          this.setSectionSaving('task-templates', false);
        }
      });
  }

  editTaskTemplate(template: TaskTemplateDto): void {
    const firstItem = template.items[0];
    this.taskTemplateForm.patchValue({
      id: template.id,
      name: template.name,
      eventType: template.eventType,
      triggerStatus: template.triggerStatus,
      assignToEventManager: template.assignToEventManager,
      itemTitle: firstItem?.title ?? '',
      itemDescription: firstItem?.description ?? '',
      itemPriority: firstItem?.priority ?? 'Medium',
      itemDueDateRule: firstItem?.dueDateRule ?? 'days-after-status-change',
      itemDueOffsetDays: firstItem?.dueOffsetDays ?? 0
    });
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

  saveReportSchedule(): void {
    if (!this.selectedVenueId || this.reportScheduleForm.invalid) {
      this.reportScheduleForm.markAllAsTouched();
      this.setSectionError('report-schedules', 'Complete required schedule fields before saving.');
      return;
    }

    const value = this.reportScheduleForm.getRawValue();
    const scheduleId = this.optionalText(value.id) ?? undefined;
    this.setSectionSaving('report-schedules', true);
    this.api
      .upsertReportSchedule(
        this.selectedVenueId,
        {
          name: this.requiredText(value.name),
          reportKey: this.requiredText(value.reportKey),
          frequency: this.requiredText(value.frequency),
          recipients: this.parseCsvList(value.recipientsCsv),
          isActive: Boolean(value.isActive),
          nextRunAtUtc: this.optionalText(value.nextRunAtUtc) ?? undefined,
          filtersJson: this.optionalText(value.filtersJson) ?? '{}'
        },
        scheduleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSectionSuccess('report-schedules', 'Report schedule saved.');
          this.setSectionSaving('report-schedules', false);
          this.reportScheduleForm.reset({
            id: '',
            name: '',
            reportKey: 'pipeline',
            frequency: 'weekly',
            recipientsCsv: '',
            isActive: true,
            nextRunAtUtc: '',
            filtersJson: '{}'
          });
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
      reportKey: schedule.reportKey,
      frequency: schedule.frequency,
      recipientsCsv: schedule.recipients.join(','),
      isActive: schedule.isActive,
      nextRunAtUtc: schedule.nextRunAtUtc ?? '',
      filtersJson: '{}'
    });
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
          this.loadReportSchedulesSection(true);
        },
        error: (error) => {
          this.setSectionError('report-schedules', this.resolveError(error, 'Unable to remove report schedule.'));
          this.setSectionSaving('report-schedules', false);
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
      case 'report-configuration':
        this.loadReportConfigurationSection();
        break;
      case 'automation':
        this.loadAutomationSection();
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
    this.api
      .getPaymentScheduleTemplates(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (templates) => {
          this.paymentScheduleTemplates = templates;
          this.setSectionLoading('payment-schedules', false);
        },
        error: (error) => {
          this.paymentScheduleTemplates = [];
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
      .getTermsDocuments(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (documents) => {
          this.termsDocuments = documents;
          this.setSectionLoading('terms', false);
        },
        error: (error) => {
          this.termsDocuments = [];
          this.setSectionError('terms', this.resolveError(error, 'Unable to load terms documents.'));
          this.setSectionLoading('terms', false);
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
    this.api
      .getVenueProposalTemplates(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (templates) => {
          this.proposalTemplates = templates;
          this.setSectionLoading('proposal-templates', false);
        },
        error: (error) => {
          this.proposalTemplates = [];
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
            openProposalWeightPercent: config.openProposalWeightPercent
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
    this.api
      .getAutomationSettings(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (config) => {
          this.automationSettingsForm.patchValue({
            proposalAcceptedTargetStatus: config.proposalAcceptedTargetStatus,
            followUpInactiveDays: config.followUpInactiveDays,
            autoArchiveEnabled: config.autoArchiveEnabled,
            autoArchiveDays: config.autoArchiveDays
          });
          this.setSectionLoading('automation', false);
        },
        error: (error) => {
          this.setSectionError('automation', this.resolveError(error, 'Unable to load automation settings.'));
          this.setSectionLoading('automation', false);
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
          this.emailTemplates = templates;
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
          this.setSectionLoading('task-templates', false);
        },
        error: (error) => {
          this.taskTemplates = [];
          this.setSectionError('task-templates', this.resolveError(error, 'Unable to load task templates.'));
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
    this.api
      .getReportSchedules(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.reportSchedules = response.items;
          this.setSectionLoading('report-schedules', false);
        },
        error: (error) => {
          this.reportSchedules = [];
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

  private replaceFormArray(target: FormArray, next: FormGroup[]): void {
    while (target.length > 0) {
      target.removeAt(0);
    }

    for (const group of next) {
      target.push(group);
    }
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
          this.setSectionSuccess('payment-schedules', successMessage);
          this.setSectionSaving('payment-schedules', false);
        },
        error: (error) => {
          this.setSectionError('payment-schedules', this.resolveError(error, 'Unable to save payment schedule templates.'));
          this.setSectionSaving('payment-schedules', false);
        }
      });
  }

  private persistTermsDocuments(successMessage: string): void {
    if (!this.selectedVenueId) {
      return;
    }

    this.setSectionSaving('terms', true);
    this.api
      .upsertTermsDocuments(this.selectedVenueId, this.termsDocuments)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (documents) => {
          this.termsDocuments = documents;
          this.setSectionSuccess('terms', successMessage);
          this.setSectionSaving('terms', false);
        },
        error: (error) => {
          this.setSectionError('terms', this.resolveError(error, 'Unable to save terms documents.'));
          this.setSectionSaving('terms', false);
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
