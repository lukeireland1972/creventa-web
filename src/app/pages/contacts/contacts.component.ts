import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ApiService,
  ContactAnalyticsResponse,
  ContactCompanyDetailResponse,
  ContactCompanySummaryDto,
  ContactCustomFieldDefinitionDto,
  ContactDetailResponse,
  ContactListItemDto,
  ContactListResponse,
  ContactTimelineItemDto,
  ContactTimelineResponse,
  UpdateContactRequest
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { QuickTaskCreatedEvent, TaskQuickCreateModalComponent } from '../../ui/task-quick-create-modal/task-quick-create-modal.component';

interface ContactCustomFieldDraft {
  id: string;
  key: string;
  label: string;
  type: string;
  isRequired: boolean;
  isActive: boolean;
  sortOrder: number;
  placeholder: string;
  optionsCsv: string;
}

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, DatePipe, DecimalPipe, TaskQuickCreateModalComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loading = false;
  loadingDetail = false;
  loadingTimeline = false;
  loadingTimelineMore = false;
  loadingAnalytics = false;
  loadingCompanies = false;
  loadingCustomFields = false;
  savingDetail = false;
  savingCustomFields = false;

  listError = '';
  detailError = '';
  timelineError = '';
  analyticsError = '';
  companyError = '';
  customFieldsError = '';
  customFieldsSuccess = '';
  syncMessage = '';
  showAddTaskModal = false;

  contactsResponse: ContactListResponse | null = null;
  contacts: ContactListItemDto[] = [];
  selectedContactId: string | null = null;
  selectedContact: ContactDetailResponse | null = null;

  timelineItems: ContactTimelineItemDto[] = [];
  timelinePage = 1;
  timelinePageSize = 50;
  timelineHasMore = false;

  analytics: ContactAnalyticsResponse | null = null;
  companies: ContactCompanySummaryDto[] = [];
  selectedCompanyName = '';
  selectedCompanyDetail: ContactCompanyDetailResponse | null = null;

  customFieldDefinitions: ContactCustomFieldDefinitionDto[] = [];
  customFieldDefinitionDrafts: ContactCustomFieldDraft[] = [];

  private filtersDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private currentVenueId: string | null = null;
  private customFieldControlNames = new Set<string>();

  readonly filtersForm = this.formBuilder.group({
    search: [''],
    company: [''],
    tag: [''],
    vipOnly: [false],
    pageSize: [25]
  });

  readonly companySearchForm = this.formBuilder.group({
    search: ['']
  });

  readonly contactForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumberE164: ['', [Validators.pattern(/^\+?[1-9]\d{7,14}$/)]],
    companyName: [''],
    jobTitle: [''],
    addressLine1: [''],
    addressLine2: [''],
    city: [''],
    region: [''],
    postcode: [''],
    countryCode: [''],
    tagsCsv: [''],
    isVip: [false],
    vipNotes: [''],
    birthday: [''],
    anniversary: [''],
    preferredCommunicationChannel: [''],
    dietaryPreferences: [''],
    allergenFlagsCsv: [''],
    seatingPreference: [''],
    preferredSetupStyle: [''],
    preferredEventStyle: ['']
  });

  get venueId(): string | null {
    return this.auth.selectedVenueId;
  }

  get selectedContactInsightLabel(): string {
    const detail = this.selectedContact;
    if (!detail) {
      return '';
    }

    const insight = detail.returningGuestInsight;
    if (!insight.isReturningGuest) {
      return 'First-time guest';
    }

    const parts: string[] = [];
    parts.push(`${insight.previousEnquiryCount} previous enquiry${insight.previousEnquiryCount === 1 ? '' : 'ies'}`);
    if (insight.lastEventName) {
      parts.push(`last: ${insight.lastEventName}`);
    }

    return parts.join(' · ');
  }

  get activeCustomFields(): ContactCustomFieldDefinitionDto[] {
    return this.customFieldDefinitions
      .filter((field) => field.isActive)
      .sort((left, right) => left.sortOrder - right.sortOrder || left.label.localeCompare(right.label));
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const requestedContactId = params.get('contact');
      if (requestedContactId && requestedContactId !== this.selectedContactId) {
        this.selectedContactId = requestedContactId;
        this.loadSelectedContact();
      }
    });

    this.auth.session$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const venueId = this.venueId;
      if (!venueId || venueId === this.currentVenueId) {
        return;
      }

      this.currentVenueId = venueId;
      this.selectedContactId = null;
      this.selectedContact = null;
      this.timelineItems = [];
      this.selectedCompanyName = '';
      this.selectedCompanyDetail = null;
      this.refreshAllData();
    });

    this.filtersForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.scheduleReloadContacts();
    });

    this.companySearchForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.scheduleReloadCompanies();
    });

    if (this.venueId) {
      this.currentVenueId = this.venueId;
      this.refreshAllData();
    }
  }

  selectContact(contactId: string): void {
    if (this.selectedContactId === contactId && this.selectedContact) {
      return;
    }

    this.selectedContactId = contactId;
    this.syncContactQueryParam(contactId);
    this.loadSelectedContact();
  }

  clearContactSelection(): void {
    this.selectedContactId = null;
    this.selectedContact = null;
    this.timelineItems = [];
    this.timelineError = '';
    this.syncContactQueryParam(null);
  }

  openAddTaskModal(): void {
    this.showAddTaskModal = true;
  }

  closeAddTaskModal(): void {
    this.showAddTaskModal = false;
  }

  onTaskQuickCreated(event: QuickTaskCreatedEvent): void {
    this.showAddTaskModal = false;
    this.syncMessage = 'Task created.';
  }

  saveContact(): void {
    if (!this.venueId || !this.selectedContactId || !this.selectedContact) {
      return;
    }

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.detailError = 'Complete required contact fields before saving.';
      return;
    }

    this.savingDetail = true;
    this.detailError = '';

    const value = this.contactForm.getRawValue();
    const payload: UpdateContactRequest = {
      firstName: (value.firstName ?? '').trim(),
      lastName: (value.lastName ?? '').trim(),
      email: (value.email ?? '').trim().toLowerCase(),
      phoneNumberE164: (value.phoneNumberE164 ?? '').trim(),
      companyName: this.optionalText(value.companyName),
      jobTitle: this.optionalText(value.jobTitle),
      addressLine1: this.optionalText(value.addressLine1),
      addressLine2: this.optionalText(value.addressLine2),
      city: this.optionalText(value.city),
      region: this.optionalText(value.region),
      postcode: this.optionalText(value.postcode),
      countryCode: this.optionalText(value.countryCode),
      tags: this.parseCsv(value.tagsCsv),
      isVip: !!value.isVip,
      vipNotes: this.optionalText(value.vipNotes),
      birthday: this.optionalText(value.birthday),
      anniversary: this.optionalText(value.anniversary),
      preferredCommunicationChannel: this.optionalText(value.preferredCommunicationChannel),
      dietaryPreferences: this.optionalText(value.dietaryPreferences),
      allergenFlags: this.parseCsv(value.allergenFlagsCsv),
      seatingPreference: this.optionalText(value.seatingPreference),
      preferredSetupStyle: this.optionalText(value.preferredSetupStyle),
      preferredEventStyle: this.optionalText(value.preferredEventStyle),
      customFields: this.collectCustomFieldValues()
    };

    this.api
      .updateContact(this.venueId, this.selectedContactId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.savingDetail = false;
          this.selectedContact = detail;
          this.patchContactForm(detail);
          this.loadContacts();
          this.loadAnalytics();
          if (detail.companyName) {
            this.loadCompanyDetail(detail.companyName);
          }
        },
        error: (error) => {
          this.savingDetail = false;
          this.detailError = error?.error?.message ?? error?.error ?? 'Unable to save contact.';
        }
      });
  }

  pullFromCreventa(): void {
    if (!this.venueId || !this.selectedContactId) {
      return;
    }

    this.syncMessage = '';
    this.api
      .pullContactFromCreventa(this.venueId, this.selectedContactId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.syncMessage = result.message;
          this.loadSelectedContact();
        },
        error: (error) => {
          this.syncMessage = error?.error?.message ?? 'Unable to sync from Creventa.';
        }
      });
  }

  pushToCreventa(): void {
    if (!this.venueId || !this.selectedContactId) {
      return;
    }

    this.syncMessage = '';
    this.api
      .pushContactToCreventa(this.venueId, this.selectedContactId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.syncMessage = result.message;
          this.loadSelectedContact();
        },
        error: (error) => {
          this.syncMessage = error?.error?.message ?? 'Unable to sync to Creventa.';
        }
      });
  }

  loadMoreTimeline(): void {
    if (!this.timelineHasMore || this.loadingTimelineMore || !this.selectedContactId) {
      return;
    }

    this.loadTimeline(this.timelinePage + 1, true);
  }

  openEnquiry(enquiryId: string | null | undefined): void {
    if (!enquiryId) {
      return;
    }

    this.router.navigate(['/enquiries'], {
      queryParams: {
        enquiry: enquiryId,
        statusTab: 'all'
      }
    });
  }

  selectCompany(companyName: string): void {
    this.selectedCompanyName = companyName;
    this.loadCompanyDetail(companyName);
  }

  addCustomFieldDefinition(): void {
    this.customFieldDefinitionDrafts = [
      ...this.customFieldDefinitionDrafts,
      {
        id: crypto.randomUUID(),
        key: '',
        label: '',
        type: 'text',
        isRequired: false,
        isActive: true,
        sortOrder: this.customFieldDefinitionDrafts.length + 1,
        placeholder: '',
        optionsCsv: ''
      }
    ];
  }

  removeCustomFieldDefinition(index: number): void {
    if (index < 0 || index >= this.customFieldDefinitionDrafts.length) {
      return;
    }

    const next = [...this.customFieldDefinitionDrafts];
    next.splice(index, 1);
    this.customFieldDefinitionDrafts = next.map((field, fieldIndex) => ({
      ...field,
      sortOrder: fieldIndex + 1
    }));
  }

  saveCustomFieldDefinitions(): void {
    if (!this.venueId || this.savingCustomFields) {
      return;
    }

    this.customFieldsError = '';
    this.customFieldsSuccess = '';

    const sanitized = this.customFieldDefinitionDrafts
      .map((field, index) => ({
        id: field.id,
        key: (field.key || '').trim().toLowerCase(),
        label: (field.label || '').trim(),
        type: (field.type || 'text').trim().toLowerCase(),
        isRequired: !!field.isRequired,
        isActive: !!field.isActive,
        sortOrder: index + 1,
        placeholder: (field.placeholder || '').trim() || null,
        options: this.parseCsv(field.optionsCsv)
      }))
      .filter((field) => !!field.key && !!field.label);

    this.savingCustomFields = true;
    this.api
      .upsertContactCustomFields(this.venueId, { fields: sanitized })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (fields) => {
          this.savingCustomFields = false;
          this.customFieldsSuccess = 'Custom fields saved.';
          this.customFieldDefinitions = fields;
          this.customFieldDefinitionDrafts = fields
            .slice()
            .sort((left, right) => left.sortOrder - right.sortOrder)
            .map((field) => this.toCustomFieldDraft(field));

          if (this.selectedContact) {
            this.patchContactForm(this.selectedContact);
          }
        },
        error: (error) => {
          this.savingCustomFields = false;
          this.customFieldsError = error?.error?.message ?? 'Unable to save custom fields.';
        }
      });
  }

  customControlName(key: string): string {
    return `customField__${key}`;
  }

  timelineTypeToken(type: string | null | undefined): string {
    return (type || 'system').toLowerCase().replace(/\s+/g, '-');
  }

  contactBadgeToken(contact: ContactListItemDto): string {
    if (contact.isVip) {
      return 'vip';
    }
    if (contact.returningGuestInsight?.isReturningGuest) {
      return 'returning';
    }
    return 'new';
  }

  private refreshAllData(): void {
    this.loadContacts();
    this.loadAnalytics();
    this.loadCompanies();
    this.loadCustomFieldDefinitions();
  }

  private loadContacts(): void {
    const venueId = this.venueId;
    if (!venueId) {
      this.contactsResponse = null;
      this.contacts = [];
      return;
    }

    this.loading = true;
    this.listError = '';

    const filters = this.filtersForm.getRawValue();
    this.api
      .getContacts({
        venueId,
        search: this.optionalText(filters.search),
        company: this.optionalText(filters.company),
        tag: this.optionalText(filters.tag),
        vipOnly: !!filters.vipOnly,
        page: 1,
        pageSize: Number(filters.pageSize ?? 25)
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.contactsResponse = response;
          this.contacts = response.page.items;

          if (this.selectedContactId && this.contacts.some((item) => item.id === this.selectedContactId)) {
            if (!this.selectedContact || this.selectedContact.id !== this.selectedContactId) {
              this.loadSelectedContact();
            }
            return;
          }

          const routeContactId = this.route.snapshot.queryParamMap.get('contact');
          if (routeContactId && this.contacts.some((item) => item.id === routeContactId)) {
            this.selectedContactId = routeContactId;
            this.loadSelectedContact();
            return;
          }

          if (this.contacts.length > 0) {
            this.selectContact(this.contacts[0].id);
          } else {
            this.clearContactSelection();
          }
        },
        error: (error) => {
          this.loading = false;
          this.listError = error?.error?.message ?? 'Unable to load contacts.';
          this.contactsResponse = null;
          this.contacts = [];
        }
      });
  }

  private loadSelectedContact(): void {
    if (!this.venueId || !this.selectedContactId) {
      return;
    }

    this.loadingDetail = true;
    this.detailError = '';

    this.api
      .getContact(this.venueId, this.selectedContactId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.loadingDetail = false;
          this.selectedContact = detail;
          this.patchContactForm(detail);
          this.timelineItems = [];
          this.timelinePage = 1;
          this.timelineHasMore = false;
          this.loadTimeline(1, false);

          if (detail.companyName) {
            this.selectedCompanyName = detail.companyName;
            this.loadCompanyDetail(detail.companyName);
          } else {
            this.selectedCompanyDetail = null;
          }
        },
        error: (error) => {
          this.loadingDetail = false;
          this.detailError = error?.error?.message ?? 'Unable to load contact detail.';
        }
      });
  }

  private loadTimeline(page: number, append: boolean): void {
    if (!this.venueId || !this.selectedContactId) {
      return;
    }

    if (append) {
      this.loadingTimelineMore = true;
    } else {
      this.loadingTimeline = true;
    }

    this.timelineError = '';

    this.api
      .getContactTimeline(this.venueId, this.selectedContactId, {
        page,
        pageSize: this.timelinePageSize
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ContactTimelineResponse) => {
          this.loadingTimeline = false;
          this.loadingTimelineMore = false;

          this.timelinePage = response.page.page;
          this.timelineHasMore = (response.page.page * response.page.pageSize) < response.page.totalCount;

          if (append) {
            this.timelineItems = [...this.timelineItems, ...response.page.items];
          } else {
            this.timelineItems = response.page.items;
          }
        },
        error: (error) => {
          this.loadingTimeline = false;
          this.loadingTimelineMore = false;
          this.timelineError = error?.error?.message ?? 'Unable to load timeline.';
        }
      });
  }

  private loadAnalytics(): void {
    if (!this.venueId) {
      this.analytics = null;
      return;
    }

    this.loadingAnalytics = true;
    this.analyticsError = '';

    this.api
      .getContactAnalytics(this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (analytics) => {
          this.loadingAnalytics = false;
          this.analytics = analytics;
        },
        error: (error) => {
          this.loadingAnalytics = false;
          this.analytics = null;
          this.analyticsError = error?.error?.message ?? 'Unable to load contact analytics.';
        }
      });
  }

  private loadCompanies(): void {
    if (!this.venueId) {
      this.companies = [];
      return;
    }

    this.loadingCompanies = true;
    this.companyError = '';

    this.api
      .getContactCompanies(this.venueId, this.optionalText(this.companySearchForm.getRawValue().search))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (companies) => {
          this.loadingCompanies = false;
          this.companies = companies;
        },
        error: (error) => {
          this.loadingCompanies = false;
          this.companies = [];
          this.companyError = error?.error?.message ?? 'Unable to load companies.';
        }
      });
  }

  private loadCompanyDetail(companyName: string): void {
    if (!this.venueId || !companyName) {
      this.selectedCompanyDetail = null;
      return;
    }

    this.api
      .getContactCompanyDetail(this.venueId, companyName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.selectedCompanyDetail = detail;
        },
        error: () => {
          this.selectedCompanyDetail = null;
        }
      });
  }

  private loadCustomFieldDefinitions(): void {
    if (!this.venueId) {
      this.customFieldDefinitions = [];
      this.customFieldDefinitionDrafts = [];
      return;
    }

    this.loadingCustomFields = true;
    this.customFieldsError = '';

    this.api
      .getContactCustomFields(this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (fields) => {
          this.loadingCustomFields = false;
          this.customFieldDefinitions = fields;
          this.customFieldDefinitionDrafts = fields
            .slice()
            .sort((left, right) => left.sortOrder - right.sortOrder)
            .map((field) => this.toCustomFieldDraft(field));

          if (this.selectedContact) {
            this.patchContactForm(this.selectedContact);
          }
        },
        error: (error) => {
          this.loadingCustomFields = false;
          this.customFieldDefinitions = [];
          this.customFieldDefinitionDrafts = [];
          this.customFieldsError = error?.error?.message ?? 'Unable to load custom fields.';
        }
      });
  }

  private patchContactForm(detail: ContactDetailResponse): void {
    this.contactForm.patchValue(
      {
        firstName: detail.firstName,
        lastName: detail.lastName,
        email: detail.email,
        phoneNumberE164: detail.phoneNumberE164 ?? '',
        companyName: detail.companyName ?? '',
        jobTitle: detail.jobTitle ?? '',
        addressLine1: detail.addressLine1 ?? '',
        addressLine2: detail.addressLine2 ?? '',
        city: detail.city ?? '',
        region: detail.region ?? '',
        postcode: detail.postcode ?? '',
        countryCode: detail.countryCode ?? '',
        tagsCsv: (detail.tags ?? []).join(', '),
        isVip: detail.isVip,
        vipNotes: detail.vipNotes ?? '',
        birthday: detail.birthday ?? '',
        anniversary: detail.anniversary ?? '',
        preferredCommunicationChannel: detail.preferredCommunicationChannel ?? '',
        dietaryPreferences: detail.preferences?.dietaryPreferences ?? '',
        allergenFlagsCsv: (detail.preferences?.allergenFlags ?? []).join(', '),
        seatingPreference: detail.preferences?.seatingPreference ?? '',
        preferredSetupStyle: detail.preferences?.preferredSetupStyle ?? '',
        preferredEventStyle: detail.preferences?.preferredEventStyle ?? ''
      },
      { emitEvent: false }
    );

    this.rebuildCustomFieldControls(detail.customFields ?? {});
  }

  private rebuildCustomFieldControls(values: Record<string, string>): void {
    for (const name of this.customFieldControlNames) {
      (this.contactForm as any).removeControl(name);
    }

    this.customFieldControlNames.clear();

    const definitions = this.activeCustomFields;
    for (const definition of definitions) {
      const controlName = this.customControlName(definition.key);
      const validators = definition.isRequired ? [Validators.required] : [];
      const defaultValue = values[definition.key] ?? '';
      (this.contactForm as any).addControl(controlName, this.formBuilder.control(defaultValue, validators));
      this.customFieldControlNames.add(controlName);
    }
  }

  private collectCustomFieldValues(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const definition of this.activeCustomFields) {
      const controlName = this.customControlName(definition.key);
      const rawValue = this.contactForm.get(controlName)?.value;
      const value = typeof rawValue === 'string'
        ? rawValue.trim()
        : typeof rawValue === 'number'
          ? String(rawValue)
          : typeof rawValue === 'boolean'
            ? (rawValue ? 'true' : 'false')
            : '';

      if (value) {
        result[definition.key] = value;
      }
    }

    return result;
  }

  private syncContactQueryParam(contactId: string | null): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        contact: contactId || null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private scheduleReloadContacts(): void {
    if (this.filtersDebounceTimer) {
      clearTimeout(this.filtersDebounceTimer);
    }

    this.filtersDebounceTimer = setTimeout(() => {
      this.loadContacts();
    }, 250);
  }

  private scheduleReloadCompanies(): void {
    if (this.filtersDebounceTimer) {
      clearTimeout(this.filtersDebounceTimer);
    }

    this.filtersDebounceTimer = setTimeout(() => {
      this.loadCompanies();
    }, 250);
  }

  private optionalText(value: unknown): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }

  private parseCsv(value: unknown): string[] {
    if (typeof value !== 'string') {
      return [];
    }

    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
      .filter((item, index, all) => all.findIndex((candidate) => candidate.toLowerCase() === item.toLowerCase()) === index);
  }

  private toCustomFieldDraft(field: ContactCustomFieldDefinitionDto): ContactCustomFieldDraft {
    return {
      id: field.id,
      key: field.key,
      label: field.label,
      type: field.type,
      isRequired: field.isRequired,
      isActive: field.isActive,
      sortOrder: field.sortOrder,
      placeholder: field.placeholder ?? '',
      optionsCsv: (field.options ?? []).join(', ')
    };
  }
}
