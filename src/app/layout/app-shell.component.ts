import { Component, DestroyRef, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';
import {
  AiAssistantActionDto,
  AiAssistantMessageResponse,
  AiAssistantSummaryResponse,
  ApiService,
  AvailabilitySidebarResponse,
  CreateVenueRequest,
  DuplicateEnquiryMatchDto,
  EnquiryDuplicateCheckResponse,
  GlobalSearchGroupDto,
  GlobalSearchIntentDto,
  GlobalSearchResultDto,
  NotificationItemDto,
  RecentlyViewedDto,
  SameDateEnquiryConflictDto,
  VenueSummaryDto
} from '../services/api.service';
import { AuthService } from '../services/auth.service';

interface NavItem {
  label: string;
  section: 'primary' | 'reports' | 'admin';
  route?: string;
  externalUrl?: string;
  exact: boolean;
  badge?: string;
  disabled?: boolean;
  disabledReason?: string;
}

interface AssistantUiMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  generatedAtUtc: string;
  intent?: string;
  fallbackUsed?: boolean;
  actions?: AiAssistantActionDto[];
  suggestions?: string[];
}

@Component({
    selector: 'app-shell',
    imports: [RouterLink, RouterLinkActive, RouterOutlet, ReactiveFormsModule, FormsModule, DatePipe],
    templateUrl: './app-shell.component.html',
    styleUrl: './app-shell.component.scss'
})
export class AppShellComponent implements OnInit {
  private formBuilder = new FormBuilder();
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  isDrawerOpen = false;
  isSubmitting = false;
  submissionError = '';
  showValidation = false;
  isRecentOpen = false;
  isSettingsOpen = false;
  isNotificationsOpen = false;
  isSearchOpen = false;
  isAssistantOpen = false;
  isMobileNavOpen = false;

  venues: VenueSummaryDto[] = [];
  selectedVenueId: string | null = null;
  recentItems: RecentlyViewedDto[] = [];
  availability: AvailabilitySidebarResponse | null = null;
  duplicateCheck: EnquiryDuplicateCheckResponse | null = null;
  duplicateCheckLoading = false;
  dismissDuplicateAdvisory = false;
  dismissDateConflictAdvisory = false;
  showDuplicateWarningModal = false;
  selectedDuplicateEnquiryId = '';
  notifications: NotificationItemDto[] = [];
  unreadNotifications = 0;
  overdueTaskCount = 0;
  searchQuery = '';
  searchGroups: GlobalSearchGroupDto[] = [];
  recentSearches: string[] = [];
  searchIntent: GlobalSearchIntentDto | null = null;
  assistantPrompt = '';
  assistantTone: 'friendly' | 'formal' | 'urgent' = 'friendly';
  assistantLoading = false;
  assistantError = '';
  assistantMessages: AssistantUiMessage[] = [];
  private hasLoadedInitialAssistantBriefing = false;
  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private duplicateCheckDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private duplicateCheckRequestId = 0;

  navItems: NavItem[] = [];
  isCreateVenueOpen = false;
  isCreatingVenue = false;
  createVenueError = '';

  createVenueForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    timeZone: ['Europe/London', [Validators.required, Validators.maxLength(80)]],
    currencyCode: ['GBP', [Validators.required, Validators.maxLength(8)]],
    locale: ['en-GB', [Validators.required, Validators.maxLength(12)]],
    countryCode: ['GB', [Validators.required, Validators.maxLength(8)]],
    enquiriesEmail: ['', Validators.email]
  });

  enquiryForm = this.formBuilder.group({
    contactFirstName: ['', Validators.required],
    contactLastName: ['', Validators.required],
    contactEmail: ['', [Validators.required, Validators.email]],
    contactPhoneNumberE164: ['+44', [Validators.required, Validators.pattern(/^\+[1-9]\d{7,14}$/)]],
    companyName: [''],
    marketingConsent: [false],
    eventType: ['Wedding', Validators.required],
    eventName: [''],
    eventDate: ['', Validators.required],
    eventTime: ['12:00'],
    eventStyle: ['3-Course Dinner'],
    setupStyle: ['Banquet'],
    guestsExpected: [80, [Validators.required, Validators.min(1)]],
    budgetMinAmount: [null as number | null],
    budgetMaxAmount: [null as number | null],
    sourceType: ['Phone', Validators.required],
    sourceDetail: [''],
    leadQuality: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    hasFlexibleDates: [false],
    flexibleDateNotes: [''],
    specialRequirements: [''],
    internalNotes: ['']
  });

  get operationsOnly(): boolean {
    return this.auth.isOperationsOnly();
  }

  get canCreateVenue(): boolean {
    if (this.operationsOnly) {
      return false;
    }

    const roles = this.auth.session?.venueRoles ?? [];
    return roles.some((x) => x.role === 'GroupAdmin');
  }

  get canViewPortfolio(): boolean {
    if (this.operationsOnly) {
      return false;
    }

    const roles = this.auth.session?.venueRoles ?? [];
    const isGroupAdmin = roles.some((x) => x.role === 'GroupAdmin');
    return isGroupAdmin || roles.length > 1;
  }

  get displayName(): string {
    return this.auth.session?.fullName ?? 'User';
  }

  get initials(): string {
    const name = this.displayName.trim();
    const parts = name.split(' ');
    if (parts.length === 1) {
      return (parts[0][0] ?? 'U').toUpperCase();
    }

    return `${parts[0][0] ?? 'U'}${parts[parts.length - 1][0] ?? 'S'}`.toUpperCase();
  }

  get selectedVenueName(): string {
    if (!this.selectedVenueId) {
      return 'Venue';
    }

    return this.venues.find((venue) => venue.id === this.selectedVenueId)?.name ?? 'Venue';
  }

  get currentSectionLabel(): string {
    const url = this.router.url.split('?')[0] || '/';
    const matched = this.navItems
      .filter((item) => !!item.route)
      .sort((left, right) => (right.route?.length ?? 0) - (left.route?.length ?? 0))
      .find((item) => {
        if (!item.route) {
          return false;
        }

        if (item.route === '/') {
          return url === '/';
        }

        return url.startsWith(item.route);
      });

    return matched?.label ?? 'Dashboard';
  }

  get primaryNavItems(): NavItem[] {
    return this.navItems.filter((item) => item.section === 'primary');
  }

  get reportNavItems(): NavItem[] {
    return this.navItems.filter((item) => item.section === 'reports');
  }

  get adminNavItems(): NavItem[] {
    return this.navItems.filter((item) => item.section === 'admin');
  }

  get primaryDuplicateMatch(): DuplicateEnquiryMatchDto | null {
    return this.duplicateCheck?.duplicateMatches?.[0] ?? null;
  }

  get primarySameDateConflict(): SameDateEnquiryConflictDto | null {
    return this.duplicateCheck?.sameDateConflicts?.[0] ?? null;
  }

  get hasDuplicateAdvisory(): boolean {
    return !this.dismissDuplicateAdvisory && !!this.primaryDuplicateMatch;
  }

  get hasDateConflictAdvisory(): boolean {
    return !this.dismissDateConflictAdvisory && !!this.primarySameDateConflict;
  }

  get hasPotentialDuplicateSignals(): boolean {
    return (this.duplicateCheck?.duplicateMatches?.length ?? 0) > 0
      || (this.duplicateCheck?.sameDateConflicts?.length ?? 0) > 0;
  }

  get canUseAssistant(): boolean {
    return !this.operationsOnly && !!this.selectedVenueId;
  }

  get currentEnquiryIdFromUrl(): string | null {
    const tree = this.router.parseUrl(this.router.url);
    const enquiryId = tree.queryParams['enquiry'];
    if (typeof enquiryId === 'string' && enquiryId.trim().length > 0) {
      return enquiryId.trim();
    }

    return null;
  }

  get duplicateModalMatches(): DuplicateEnquiryMatchDto[] {
    return this.duplicateCheck?.duplicateMatches ?? [];
  }

  get duplicateModalConflicts(): SameDateEnquiryConflictDto[] {
    return this.duplicateCheck?.sameDateConflicts ?? [];
  }

  ngOnInit(): void {
    this.setNavItems();
    this.selectedVenueId = this.auth.selectedVenueId;

    this.auth.session$
      .pipe(
        map((session) => session?.venueId ?? null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((venueId) => {
        const venueChanged = this.selectedVenueId !== venueId;
        this.selectedVenueId = venueId;
        this.setNavItems();
        this.loadRecent();
        this.loadNotifications();
        this.loadTaskBadge();
        if (venueChanged) {
          this.searchIntent = null;
          this.assistantMessages = [];
          this.assistantError = '';
          this.hasLoadedInitialAssistantBriefing = false;
        }
      });

    this.api
      .getVenues()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((venues) => {
        this.venues = venues;

        if (venues.length === 0) {
          return;
        }

        if (!this.selectedVenueId || !venues.some((venue) => venue.id === this.selectedVenueId)) {
          this.applySelectedVenue(venues[0].id);
        }
      });

    this.loadRecent();
    this.loadNotifications();
    this.loadTaskBadge();

    this.enquiryForm.controls.eventDate.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((date) => {
      if (!date || !this.selectedVenueId) {
        this.availability = null;
      } else {
        this.api
          .getAvailability(this.selectedVenueId, date)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((availability) => {
            this.availability = availability;
          });
      }

      this.scheduleDuplicateCheck();
    });

    this.enquiryForm.controls.contactEmail.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.scheduleDuplicateCheck();
    });

    this.enquiryForm.controls.contactPhoneNumberE164.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.scheduleDuplicateCheck();
    });

    this.enquiryForm.controls.contactFirstName.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.scheduleDuplicateCheck();
    });

    this.enquiryForm.controls.contactLastName.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.scheduleDuplicateCheck();
    });
  }

  toggleRecent(): void {
    this.isSettingsOpen = false;
    this.isNotificationsOpen = false;
    this.isSearchOpen = false;
    this.isAssistantOpen = false;
    this.isMobileNavOpen = false;
    this.isRecentOpen = !this.isRecentOpen;
  }

  toggleSettings(event: MouseEvent): void {
    event.stopPropagation();
    this.isRecentOpen = false;
    this.isNotificationsOpen = false;
    this.isSearchOpen = false;
    this.isAssistantOpen = false;
    this.isMobileNavOpen = false;
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  toggleNotifications(event: MouseEvent): void {
    event.stopPropagation();
    this.isRecentOpen = false;
    this.isSettingsOpen = false;
    this.isSearchOpen = false;
    this.isAssistantOpen = false;
    this.isMobileNavOpen = false;
    this.isNotificationsOpen = !this.isNotificationsOpen;
    if (this.isNotificationsOpen) {
      this.loadNotifications();
    }
  }

  toggleAssistant(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.canUseAssistant) {
      return;
    }

    this.isRecentOpen = false;
    this.isSettingsOpen = false;
    this.isNotificationsOpen = false;
    this.isSearchOpen = false;
    this.isAssistantOpen = false;
    this.isMobileNavOpen = false;
    this.isAssistantOpen = !this.isAssistantOpen;

    if (this.isAssistantOpen && !this.hasLoadedInitialAssistantBriefing) {
      this.loadDailyBriefing();
    }
  }

  sendAssistantPrompt(event: Event): void {
    event.preventDefault();
    const prompt = this.assistantPrompt.trim();
    if (!prompt || this.assistantLoading) {
      return;
    }

    this.assistantPrompt = '';
    this.appendAssistantMessage({
      id: this.buildAssistantMessageId('user'),
      role: 'user',
      text: prompt,
      generatedAtUtc: new Date().toISOString()
    });
    this.queryAssistant(prompt, this.assistantTone);
  }

  loadDailyBriefing(): void {
    if (!this.selectedVenueId || this.assistantLoading) {
      return;
    }

    this.assistantLoading = true;
    this.assistantError = '';
    this.api
      .getAiDailyBriefing(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.assistantLoading = false;
          this.hasLoadedInitialAssistantBriefing = true;
          this.appendAssistantMessage(this.mapSummaryToAssistantMessage(response, 'daily_briefing'));
        },
        error: () => {
          this.assistantLoading = false;
          this.assistantError = 'Unable to load briefing right now.';
        }
      });
  }

  loadMeetingPrep(): void {
    if (!this.selectedVenueId || this.assistantLoading) {
      return;
    }

    this.assistantLoading = true;
    this.assistantError = '';
    this.api
      .getAiMeetingPrep({ venueId: this.selectedVenueId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.assistantLoading = false;
          const lines: string[] = [response.summary];
          response.items.slice(0, 5).forEach((item) => {
            lines.push(`- ${new Date(item.startUtc).toLocaleString()} · ${item.title} · ${item.clientName}`);
            lines.push(`  ${item.briefing}`);
          });

          this.appendAssistantMessage({
            id: this.buildAssistantMessageId('assistant'),
            role: 'assistant',
            text: lines.join('\n').trim(),
            generatedAtUtc: response.generatedAtUtc,
            intent: 'meeting_prep',
            actions: [
              { key: 'open-diary', label: 'Open Event Diary', type: 'navigate', route: '/event-diary' },
              { key: 'open-connect', label: 'Open Connect', type: 'navigate', route: '/connect' }
            ],
            suggestions: [
              "What's my pipeline looking like this month?",
              'Which enquiries should I follow up on today?'
            ]
          });
        },
        error: () => {
          this.assistantLoading = false;
          this.assistantError = 'Unable to load meeting prep right now.';
        }
      });
  }

  loadCurrentEnquirySummary(): void {
    const enquiryId = this.currentEnquiryIdFromUrl;
    if (!this.selectedVenueId || !enquiryId || this.assistantLoading) {
      return;
    }

    this.assistantLoading = true;
    this.assistantError = '';
    this.api
      .getAiEnquirySummary(this.selectedVenueId, enquiryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.assistantLoading = false;
          this.appendAssistantMessage(this.mapSummaryToAssistantMessage(response, 'enquiry_summary'));
        },
        error: () => {
          this.assistantLoading = false;
          this.assistantError = 'Unable to load enquiry summary.';
        }
      });
  }

  toggleMobileNav(event: Event): void {
    event.stopPropagation();
    this.isRecentOpen = false;
    this.isSettingsOpen = false;
    this.isNotificationsOpen = false;
    this.isSearchOpen = false;
    this.isAssistantOpen = false;
    this.isMobileNavOpen = !this.isMobileNavOpen;
  }

  closeMobileNav(): void {
    this.isMobileNavOpen = false;
  }

  openSettingsSection(section: string): void {
    this.isSettingsOpen = false;
    this.isMobileNavOpen = false;
    this.router.navigate(['/settings'], {
      queryParams: { section }
    });
  }

  openAdmin(): void {
    this.isSettingsOpen = false;
    this.isMobileNavOpen = false;
    this.router.navigate(['/admin']);
  }

  openCreateVenueModal(event?: Event): void {
    event?.stopPropagation();
    if (!this.canCreateVenue || this.isCreatingVenue) {
      return;
    }

    const selectedVenue = this.venues.find((venue) => venue.id === this.selectedVenueId);
    this.createVenueForm.reset({
      name: '',
      timeZone: selectedVenue?.timeZone ?? 'Europe/London',
      currencyCode: selectedVenue?.currencyCode ?? 'GBP',
      locale: 'en-GB',
      countryCode: 'GB',
      enquiriesEmail: ''
    });
    this.createVenueError = '';
    this.isCreateVenueOpen = true;
    this.isSettingsOpen = false;
    this.isRecentOpen = false;
    this.isNotificationsOpen = false;
    this.isSearchOpen = false;
    this.isMobileNavOpen = false;
  }

  closeCreateVenueModal(): void {
    if (this.isCreatingVenue) {
      return;
    }

    this.isCreateVenueOpen = false;
    this.createVenueError = '';
    this.createVenueForm.markAsPristine();
    this.createVenueForm.markAsUntouched();
  }

  submitCreateVenue(): void {
    if (!this.canCreateVenue || this.isCreatingVenue) {
      return;
    }

    if (this.createVenueForm.invalid) {
      this.createVenueForm.markAllAsTouched();
      this.createVenueError = 'Provide a venue name, timezone, and currency code.';
      return;
    }

    const value = this.createVenueForm.getRawValue();
    const payload: CreateVenueRequest = {
      name: (value.name ?? '').trim(),
      timeZone: (value.timeZone ?? '').trim() || null,
      currencyCode: (value.currencyCode ?? '').trim().toUpperCase() || null,
      locale: (value.locale ?? '').trim() || null,
      countryCode: (value.countryCode ?? '').trim().toUpperCase() || null,
      enquiriesEmail: (value.enquiriesEmail ?? '').trim() || null
    };

    this.isCreatingVenue = true;
    this.createVenueError = '';

    this.api
      .createVenue(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (createdVenue) => {
          this.isCreatingVenue = false;
          this.isCreateVenueOpen = false;

          this.venues = [...this.venues, createdVenue].sort((left, right) =>
            left.name.localeCompare(right.name, undefined, { sensitivity: 'base' }));

          this.selectVenue(createdVenue.id);
        },
        error: (error) => {
          this.isCreatingVenue = false;
          this.createVenueError = error?.error?.message ?? error?.error ?? 'Unable to create venue.';
        }
      });
  }

  selectVenue(venueId: string): void {
    this.applySelectedVenue(venueId);
    this.closeMobileNav();
    if (this.searchQuery.trim().length >= 3) {
      this.executeSearch();
    }
  }

  openDrawer(): void {
    this.isDrawerOpen = true;
    this.scheduleDuplicateCheck();
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
    this.submissionError = '';
    this.showValidation = false;
    this.showDuplicateWarningModal = false;
    this.selectedDuplicateEnquiryId = '';
    this.clearDuplicateAdvisories();
  }

  logout(): void {
    // Start server-side revoke as best effort, but don't block UX on network/API issues.
    this.auth
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: () => void 0 });

    this.auth.clearSession();
    this.router.navigateByUrl('/login');
  }

  submitEnquiry(ignoreDuplicateWarnings = false): void {
    this.showValidation = true;
    if (this.enquiryForm.invalid || !this.selectedVenueId) {
      this.enquiryForm.markAllAsTouched();
      this.submissionError = 'Complete required fields and select a venue.';
      return;
    }

    const value = this.enquiryForm.getRawValue();
    const eventStartUtc = this.buildIsoDate(value.eventDate ?? '', value.eventTime ?? '12:00');
    if (!eventStartUtc) {
      this.submissionError = 'Select a valid event date.';
      return;
    }

    if (!ignoreDuplicateWarnings && this.hasPotentialDuplicateSignals) {
      this.openDuplicateWarningModal();
      return;
    }

    this.isSubmitting = true;
    this.submissionError = '';

    this.api
      .createEnquiry({
        venueId: this.selectedVenueId,
        contactFirstName: value.contactFirstName ?? '',
        contactLastName: value.contactLastName ?? '',
        contactEmail: value.contactEmail ?? '',
        contactPhoneNumberE164: value.contactPhoneNumberE164 ?? '',
        companyName: value.companyName ?? undefined,
        marketingConsent: value.marketingConsent ?? false,
        eventType: value.eventType ?? 'Wedding',
        eventName: value.eventName ?? undefined,
        eventStartUtc,
        eventStyle: value.eventStyle ?? undefined,
        setupStyle: value.setupStyle ?? undefined,
        guestsExpected: value.guestsExpected ?? 1,
        budgetMinAmount: value.budgetMinAmount ?? undefined,
        budgetMaxAmount: value.budgetMaxAmount ?? undefined,
        currencyCode: 'GBP',
        sourceType: value.sourceType ?? 'Phone',
        sourceDetail: value.sourceDetail ?? undefined,
        leadQuality: value.leadQuality ?? 3,
        hasFlexibleDates: value.hasFlexibleDates ?? false,
        flexibleDateNotes: value.flexibleDateNotes ?? undefined,
        specialRequirements: value.specialRequirements ?? undefined,
        internalNotes: value.internalNotes ?? undefined
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (created) => {
          this.isSubmitting = false;
          this.closeDrawer();
          this.enquiryForm.reset({
            contactFirstName: '',
            contactLastName: '',
            contactEmail: '',
            contactPhoneNumberE164: '+44',
            companyName: '',
            marketingConsent: false,
            eventType: 'Wedding',
            eventName: '',
            eventDate: '',
            eventTime: '12:00',
            eventStyle: '3-Course Dinner',
            setupStyle: 'Banquet',
            guestsExpected: 80,
            budgetMinAmount: null,
            budgetMaxAmount: null,
            sourceType: 'Phone',
            sourceDetail: '',
            leadQuality: 3,
            hasFlexibleDates: false,
            flexibleDateNotes: '',
            specialRequirements: '',
            internalNotes: ''
          });

          this.router.navigate(['/enquiries'], { queryParams: { created: created.id } });
          this.loadRecent();
          this.clearDuplicateAdvisories();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.submissionError = error?.error?.message ?? 'Unable to create enquiry.';
        }
      });
  }

  proceedWithDuplicateAdvisory(): void {
    this.dismissDuplicateAdvisory = true;
  }

  proceedWithDateConflictAdvisory(): void {
    this.dismissDateConflictAdvisory = true;
  }

  openExistingEnquiry(enquiryId: string): void {
    this.closeDrawer();
    this.router.navigate(['/enquiries'], {
      queryParams: { enquiry: enquiryId, statusTab: 'all' }
    });
  }

  openDuplicateWarningModal(): void {
    if (!this.hasPotentialDuplicateSignals) {
      return;
    }

    const duplicate = this.duplicateModalMatches[0]?.enquiryId;
    const conflict = this.duplicateModalConflicts[0]?.enquiryId;
    this.selectedDuplicateEnquiryId = duplicate ?? conflict ?? '';
    this.showDuplicateWarningModal = true;
  }

  closeDuplicateWarningModal(): void {
    this.showDuplicateWarningModal = false;
  }

  createEnquiryAnyway(): void {
    this.dismissDuplicateAdvisory = true;
    this.dismissDateConflictAdvisory = true;
    this.showDuplicateWarningModal = false;
    this.submitEnquiry(true);
  }

  viewDuplicateSelection(): void {
    const enquiryId = this.selectedDuplicateEnquiryId || this.duplicateModalMatches[0]?.enquiryId || this.duplicateModalConflicts[0]?.enquiryId;
    if (!enquiryId) {
      return;
    }

    this.showDuplicateWarningModal = false;
    this.openExistingEnquiry(enquiryId);
  }

  openMergeFromDuplicateWarning(): void {
    const first = this.duplicateModalMatches[0]?.enquiryId;
    const second = this.duplicateModalMatches[1]?.enquiryId;
    this.showDuplicateWarningModal = false;
    this.closeDrawer();

    if (first && second) {
      this.router.navigate(['/enquiries'], {
        queryParams: {
          statusTab: 'all',
          mergeA: first,
          mergeB: second
        }
      });
      return;
    }

    if (first) {
      this.router.navigate(['/enquiries'], {
        queryParams: {
          statusTab: 'all',
          enquiry: first
        }
      });
    }
  }

  openRecentItem(item: RecentlyViewedDto): void {
    this.isRecentOpen = false;
    this.closeMobileNav();
    if (item.entityType === 'Enquiry') {
      this.router.navigate(['/enquiries'], { queryParams: { enquiry: item.entityId } });
    }
  }

  onSearchFocus(event: Event): void {
    event.stopPropagation();
    this.isRecentOpen = false;
    this.isSettingsOpen = false;
    this.isNotificationsOpen = false;
    this.isAssistantOpen = false;
    this.isSearchOpen = true;
    this.executeSearch();
  }

  onSearchInput(query: string): void {
    this.searchQuery = query;
    this.scheduleSearch();
  }

  submitSearch(event: Event): void {
    event.preventDefault();
    const query = this.searchQuery.trim();
    this.isSearchOpen = false;
    if (!query) {
      return;
    }

    if (this.searchIntent?.isNaturalLanguage && this.searchIntent.suggestedRoute) {
      this.router.navigateByUrl(this.searchIntent.suggestedRoute);
      return;
    }

    this.router.navigate(['/enquiries'], { queryParams: { search: query, statusTab: 'all' } });
  }

  useRecentSearch(query: string): void {
    this.searchQuery = query;
    this.searchIntent = null;
    this.executeSearch();
  }

  openSearchResult(result: GlobalSearchResultDto): void {
    this.isSearchOpen = false;
    this.closeMobileNav();
    this.router.navigateByUrl(result.route);
  }

  openSearchIntentRoute(): void {
    if (!this.searchIntent?.suggestedRoute) {
      return;
    }

    this.isSearchOpen = false;
    this.closeMobileNav();
    this.router.navigateByUrl(this.searchIntent.suggestedRoute);
  }

  runAssistantAction(action: AiAssistantActionDto): void {
    if (action.type === 'copy') {
      if (!action.payload) {
        return;
      }

      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(action.payload).catch(() => {
          this.assistantError = 'Unable to copy to clipboard.';
        });
      }
      return;
    }

    if (action.type === 'navigate' && action.route) {
      this.isAssistantOpen = false;
      this.router.navigateByUrl(action.route);
    }
  }

  runAssistantSuggestion(prompt: string): void {
    if (!prompt.trim()) {
      return;
    }

    this.assistantPrompt = '';
    this.appendAssistantMessage({
      id: this.buildAssistantMessageId('user'),
      role: 'user',
      text: prompt,
      generatedAtUtc: new Date().toISOString()
    });
    this.queryAssistant(prompt, this.assistantTone);
  }

  markAllNotificationsRead(): void {
    this.api
      .markNotificationsRead({ markAll: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadNotifications();
        }
      });
  }

  markNotificationRead(item: NotificationItemDto): void {
    this.api
      .markNotificationsRead({ markAll: false, notificationIds: [item.id] })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (item.linkUrl) {
            this.router.navigateByUrl(item.linkUrl);
          }
          this.loadNotifications();
        }
      });
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.isRecentOpen = false;
    this.isSettingsOpen = false;
    this.isNotificationsOpen = false;
    this.isSearchOpen = false;
    this.isAssistantOpen = false;
    this.isMobileNavOpen = false;
    if (!this.isCreatingVenue) {
      this.isCreateVenueOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isRecentOpen = false;
    this.isSettingsOpen = false;
    this.isNotificationsOpen = false;
    this.isSearchOpen = false;
    this.isAssistantOpen = false;
    this.isMobileNavOpen = false;
    if (!this.isCreatingVenue) {
      this.isCreateVenueOpen = false;
    }
  }

  private buildIsoDate(date: string, time: string): string | null {
    if (!date) {
      return null;
    }

    const normalizedTime = /^\d{2}:\d{2}$/.test(time) ? time : '12:00';
    const value = new Date(`${date}T${normalizedTime}:00`);
    if (Number.isNaN(value.getTime())) {
      return null;
    }

    return value.toISOString();
  }

  private loadRecent(): void {
    this.api
      .getRecentEnquiries()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.recentItems = items;
        },
        error: () => {
          this.recentItems = [];
        }
      });
  }

  private loadNotifications(): void {
    this.api
      .getNotifications(this.selectedVenueId ?? undefined, 20)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.notifications = response.items;
          this.unreadNotifications = response.unreadCount;
          this.setNavItems();
        },
        error: () => {
          this.notifications = [];
          this.unreadNotifications = 0;
          this.setNavItems();
        }
      });
  }

  private loadTaskBadge(): void {
    if (this.operationsOnly || !this.selectedVenueId) {
      this.overdueTaskCount = 0;
      this.setNavItems();
      return;
    }

    this.api
      .getOverdueTasks(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.overdueTaskCount = response.summary.overdue;
          this.setNavItems();
        },
        error: () => {
          this.overdueTaskCount = 0;
          this.setNavItems();
        }
      });
  }

  private scheduleSearch(): void {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    this.searchDebounceTimer = setTimeout(() => {
      this.executeSearch();
    }, 300);
  }

  private executeSearch(): void {
    const query = this.searchQuery.trim();
    if (!this.selectedVenueId) {
      this.searchGroups = [];
      this.recentSearches = [];
      this.searchIntent = null;
      return;
    }

    this.api
      .searchSuggest(this.selectedVenueId, query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.searchGroups = response.groups;
          this.recentSearches = response.recentSearches;
          this.searchIntent = response.intent ?? null;
        },
        error: () => {
          this.searchGroups = [];
          this.recentSearches = [];
          this.searchIntent = null;
        }
      });
  }

  private queryAssistant(prompt: string, tone: string): void {
    if (!this.selectedVenueId) {
      this.assistantError = 'Select a venue to use the AI assistant.';
      return;
    }

    this.assistantLoading = true;
    this.assistantError = '';
    this.api
      .queryAiAssistant(this.selectedVenueId, {
        query: prompt,
        enquiryId: this.currentEnquiryIdFromUrl,
        tone
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.assistantLoading = false;
          this.appendAssistantMessage(this.mapAssistantResponse(response));
        },
        error: () => {
          this.assistantLoading = false;
          this.assistantError = 'AI assistant is temporarily unavailable.';
        }
      });
  }

  private appendAssistantMessage(message: AssistantUiMessage): void {
    this.assistantMessages = [...this.assistantMessages, message];
  }

  private mapSummaryToAssistantMessage(
    response: AiAssistantSummaryResponse,
    intent: string
  ): AssistantUiMessage {
    return {
      id: this.buildAssistantMessageId('assistant'),
      role: 'assistant',
      text: response.summary,
      generatedAtUtc: response.generatedAtUtc,
      intent,
      actions: response.actions,
      suggestions: [
        'Which enquiries should I follow up on today?',
        "Compare this month's revenue to last year",
        'Draft a follow-up email for the Smith wedding'
      ]
    };
  }

  private mapAssistantResponse(response: AiAssistantMessageResponse): AssistantUiMessage {
    return {
      id: this.buildAssistantMessageId('assistant'),
      role: 'assistant',
      text: response.answer,
      generatedAtUtc: response.generatedAtUtc,
      intent: response.intent,
      fallbackUsed: response.fallbackUsed,
      actions: response.actions,
      suggestions: response.suggestedPrompts
    };
  }

  private buildAssistantMessageId(role: 'user' | 'assistant'): string {
    return `${role}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }

  private scheduleDuplicateCheck(): void {
    if (!this.isDrawerOpen) {
      return;
    }

    if (this.duplicateCheckDebounceTimer) {
      clearTimeout(this.duplicateCheckDebounceTimer);
    }

    this.duplicateCheckDebounceTimer = setTimeout(() => {
      this.runDuplicateCheck();
    }, 350);
  }

  private runDuplicateCheck(): void {
    if (!this.selectedVenueId) {
      this.clearDuplicateAdvisories();
      return;
    }

    const emailControl = this.enquiryForm.controls.contactEmail;
    const phoneControl = this.enquiryForm.controls.contactPhoneNumberE164;
    const dateControl = this.enquiryForm.controls.eventDate;

    const email = this.normalizeDuplicateCheckEmail(emailControl.value);
    const phone = this.normalizeDuplicateCheckPhone(phoneControl.value);
    const eventDate = (dateControl.value || '').trim();

    if (!email && !phone && !eventDate) {
      this.clearDuplicateAdvisories();
      return;
    }

    const requestId = ++this.duplicateCheckRequestId;
    this.duplicateCheckLoading = true;

    this.api
      .getEnquiryDuplicateCheck({
        venueId: this.selectedVenueId,
        email: email || undefined,
        phone: phone || undefined,
        firstName: (this.enquiryForm.controls.contactFirstName.value || '').trim() || undefined,
        lastName: (this.enquiryForm.controls.contactLastName.value || '').trim() || undefined,
        eventDate: eventDate || undefined
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (requestId !== this.duplicateCheckRequestId) {
            return;
          }

          this.duplicateCheckLoading = false;
          this.duplicateCheck = response;
          this.dismissDuplicateAdvisory = false;
          this.dismissDateConflictAdvisory = false;
          if (this.showDuplicateWarningModal && !this.hasPotentialDuplicateSignals) {
            this.showDuplicateWarningModal = false;
          }
        },
        error: () => {
          if (requestId !== this.duplicateCheckRequestId) {
            return;
          }

          this.duplicateCheckLoading = false;
          this.duplicateCheck = null;
          this.showDuplicateWarningModal = false;
        }
      });
  }

  private normalizeDuplicateCheckEmail(rawEmail: string | null | undefined): string {
    const trimmed = (rawEmail || '').trim().toLowerCase();
    if (!trimmed) {
      return '';
    }

    return trimmed;
  }

  private normalizeDuplicateCheckPhone(rawPhone: string | null | undefined): string {
    const trimmed = (rawPhone || '').trim();
    if (!trimmed) {
      return '';
    }

    // Ignore untouched country prefix defaults to avoid noisy queries.
    if (trimmed === '+44') {
      return '';
    }

    return trimmed;
  }

  private clearDuplicateAdvisories(): void {
    this.duplicateCheckRequestId++;
    this.duplicateCheck = null;
    this.duplicateCheckLoading = false;
    this.dismissDuplicateAdvisory = false;
    this.dismissDateConflictAdvisory = false;
    this.showDuplicateWarningModal = false;
    this.selectedDuplicateEnquiryId = '';

    if (this.duplicateCheckDebounceTimer) {
      clearTimeout(this.duplicateCheckDebounceTimer);
      this.duplicateCheckDebounceTimer = null;
    }
  }

  private setNavItems(): void {
    if (this.operationsOnly) {
      this.navItems = [{ label: 'Operations Dashboard', section: 'primary', route: '/operations', exact: true }];
      return;
    }

    this.navItems = [
      { label: 'Dashboard', section: 'primary', route: '/', exact: true },
      ...(this.canViewPortfolio
        ? [{ label: 'Portfolio', section: 'primary', route: '/portfolio', exact: false } as NavItem]
        : []),
      {
        label: 'Connect',
        section: 'primary',
        route: '/connect',
        exact: false,
        badge: this.unreadNotifications > 0 ? String(this.unreadNotifications) : undefined
      },
      { label: 'Contacts', section: 'primary', route: '/contacts', exact: false },
      { label: 'Enquiries', section: 'primary', route: '/enquiries', exact: false },
      { label: 'Event Diary', section: 'primary', route: '/event-diary', exact: false },
      {
        label: 'Tasks',
        section: 'primary',
        route: '/tasks',
        exact: false,
        badge: this.overdueTaskCount > 0 ? String(this.overdueTaskCount) : undefined
      },
      { label: 'Events Hub', section: 'primary', route: '/events-hub', exact: false },
      { label: 'Reports', section: 'reports', route: '/reports', exact: false },
      { label: 'Admin', section: 'admin', route: '/admin', exact: false },
      { label: 'Settings', section: 'admin', route: '/settings', exact: false }
    ];
  }

  private applySelectedVenue(venueId: string): boolean {
    const venueChanged = this.selectedVenueId !== venueId;
    this.selectedVenueId = venueId;
    this.auth.setSelectedVenue(venueId);
    this.loadRecent();
    this.loadNotifications();
    this.loadTaskBadge();
    return venueChanged;
  }
}
