import { Component, DestroyRef, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ApiService,
  AvailabilitySidebarResponse,
  GlobalSearchGroupDto,
  GlobalSearchResultDto,
  NotificationItemDto,
  RecentlyViewedDto,
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
  isMobileNavOpen = false;

  venues: VenueSummaryDto[] = [];
  selectedVenueId: string | null = null;
  recentItems: RecentlyViewedDto[] = [];
  availability: AvailabilitySidebarResponse | null = null;
  notifications: NotificationItemDto[] = [];
  unreadNotifications = 0;
  searchQuery = '';
  searchGroups: GlobalSearchGroupDto[] = [];
  recentSearches: string[] = [];
  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  navItems: NavItem[] = [];

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

  ngOnInit(): void {
    this.setNavItems();
    this.selectedVenueId = this.auth.selectedVenueId;

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

    this.enquiryForm.controls.eventDate.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((date) => {
      if (!date || !this.selectedVenueId) {
        this.availability = null;
        return;
      }

      this.api
        .getAvailability(this.selectedVenueId, date)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((availability) => {
          this.availability = availability;
        });
    });
  }

  toggleRecent(): void {
    this.isSettingsOpen = false;
    this.isNotificationsOpen = false;
    this.isSearchOpen = false;
    this.isMobileNavOpen = false;
    this.isRecentOpen = !this.isRecentOpen;
  }

  toggleSettings(event: MouseEvent): void {
    event.stopPropagation();
    this.isRecentOpen = false;
    this.isNotificationsOpen = false;
    this.isSearchOpen = false;
    this.isMobileNavOpen = false;
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  toggleNotifications(event: MouseEvent): void {
    event.stopPropagation();
    this.isRecentOpen = false;
    this.isSettingsOpen = false;
    this.isSearchOpen = false;
    this.isMobileNavOpen = false;
    this.isNotificationsOpen = !this.isNotificationsOpen;
    if (this.isNotificationsOpen) {
      this.loadNotifications();
    }
  }

  toggleMobileNav(event: Event): void {
    event.stopPropagation();
    this.isRecentOpen = false;
    this.isSettingsOpen = false;
    this.isNotificationsOpen = false;
    this.isSearchOpen = false;
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

  selectVenue(venueId: string): void {
    const venueChanged = this.applySelectedVenue(venueId);
    this.closeMobileNav();
    if (this.searchQuery.trim().length >= 3) {
      this.executeSearch();
    }

    if (venueChanged) {
      window.location.reload();
    }
  }

  openDrawer(): void {
    this.isDrawerOpen = true;
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
    this.submissionError = '';
    this.showValidation = false;
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

  submitEnquiry(): void {
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
        },
        error: (error) => {
          this.isSubmitting = false;
          this.submissionError = error?.error?.message ?? 'Unable to create enquiry.';
        }
      });
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

    this.router.navigate(['/enquiries'], { queryParams: { search: query, statusTab: 'all' } });
  }

  useRecentSearch(query: string): void {
    this.searchQuery = query;
    this.executeSearch();
  }

  openSearchResult(result: GlobalSearchResultDto): void {
    this.isSearchOpen = false;
    this.closeMobileNav();
    this.router.navigateByUrl(result.route);
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
    this.isMobileNavOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isRecentOpen = false;
    this.isSettingsOpen = false;
    this.isNotificationsOpen = false;
    this.isSearchOpen = false;
    this.isMobileNavOpen = false;
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
      return;
    }

    this.api
      .searchSuggest(this.selectedVenueId, query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.searchGroups = response.groups;
          this.recentSearches = response.recentSearches;
        },
        error: () => {
          this.searchGroups = [];
          this.recentSearches = [];
        }
      });
  }

  private setNavItems(): void {
    if (this.operationsOnly) {
      this.navItems = [{ label: 'Operations Dashboard', section: 'primary', route: '/operations', exact: true }];
      return;
    }

    this.navItems = [
      { label: 'Dashboard', section: 'primary', route: '/', exact: true },
      {
        label: 'Connect',
        section: 'primary',
        route: '/connect',
        exact: false,
        badge: this.unreadNotifications > 0 ? String(this.unreadNotifications) : undefined
      },
      { label: 'Enquiries', section: 'primary', route: '/enquiries', exact: false },
      { label: 'Event Diary', section: 'primary', route: '/event-diary', exact: false },
      { label: 'Reports', section: 'reports', route: '/reports', exact: false },
      {
        label: 'Events Hub',
        section: 'reports',
        externalUrl: 'https://events-hub.creventaflow.com',
        exact: false,
        disabled: true,
        disabledReason: 'Connection not ready'
      },
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
    return venueChanged;
  }
}
