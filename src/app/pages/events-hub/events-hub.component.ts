import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';
import {
  ApiService,
  EventsHubAnalyticsDto,
  EventsHubAttendeeDto,
  EventsHubEventDto,
  EventsHubPublishResponse,
  EventsHubSyncResponse,
  SpaceSummaryDto,
  UpsertEventsHubAttendeeRequest,
  UpsertEventsHubEventRequest,
  UserSummaryDto
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-events-hub',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './events-hub.component.html',
  styleUrl: './events-hub.component.scss'
})
export class EventsHubComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  readonly eventTypeOptions = ['Fair', 'Open Day', 'Tasting', 'Networking', 'Exhibition', 'Other'];
  readonly statusOptions = ['Planned', 'Confirmed', 'Completed', 'Cancelled'];
  readonly listingStatusOptions = ['Draft', 'Published'];
  readonly followUpStatusOptions = ['Pending', 'Contacted', 'Converted', 'NotInterested', 'NoResponse'];

  venueId: string | null = null;
  events: EventsHubEventDto[] = [];
  spaces: SpaceSummaryDto[] = [];
  users: UserSummaryDto[] = [];
  attendees: EventsHubAttendeeDto[] = [];
  selectedAttendeeIds = new Set<string>();
  analytics: EventsHubAnalyticsDto | null = null;

  selectedEvent: EventsHubEventDto | null = null;
  selectedEventId: string | null = null;

  loading = true;
  loadingAttendees = false;
  loadingAnalytics = false;
  savingEvent = false;
  publishing = false;
  syncing = false;
  addingAttendee = false;
  importingAttendees = false;
  deletingEvent = false;

  errorMessage = '';
  lastActionMessage = '';
  publishResponse: EventsHubPublishResponse | null = null;
  syncResponse: EventsHubSyncResponse | null = null;
  attendeeImportFile: File | null = null;
  attendeeImportFileName = '';
  registrationLinkCopied = false;
  bulkFollowUpStatus: 'Pending' | 'Contacted' | 'Converted' | 'NotInterested' | 'NoResponse' = 'Contacted';

  eventForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    type: ['Fair', Validators.required],
    eventDate: ['', Validators.required],
    startTime: ['10:00', Validators.required],
    endTime: ['16:00', Validators.required],
    spaceIds: this.formBuilder.nonNullable.control<string[]>([]),
    capacity: this.formBuilder.control<number | null>(null),
    registrationLimit: this.formBuilder.control<number | null>(null),
    description: this.formBuilder.control<string>(''),
    featuredImageUrl: this.formBuilder.control<string>(''),
    isPaid: this.formBuilder.nonNullable.control(false),
    ticketPrice: this.formBuilder.control<number | null>(null),
    currencyCode: this.formBuilder.nonNullable.control('GBP'),
    hasEarlyBird: this.formBuilder.nonNullable.control(false),
    earlyBirdPrice: this.formBuilder.control<number | null>(null),
    earlyBirdEndsOn: this.formBuilder.control<string | null>(null),
    listingStatus: this.formBuilder.nonNullable.control<'Draft' | 'Published'>('Draft'),
    status: this.formBuilder.nonNullable.control<'Planned' | 'Confirmed' | 'Completed' | 'Cancelled'>('Planned')
  });

  attendeeForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(120)]],
    lastName: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumberE164: [''],
    eventInterest: [''],
    notes: [''],
    followUpStatus: this.formBuilder.nonNullable.control<'Pending' | 'Contacted' | 'Converted' | 'NotInterested' | 'NoResponse'>('Pending')
  });

  attendeeImportMappingForm = this.formBuilder.nonNullable.group({
    firstNameColumn: ['FirstName'],
    lastNameColumn: ['LastName'],
    emailColumn: ['Email'],
    phoneColumn: ['Phone'],
    eventInterestColumn: ['EventInterest'],
    notesColumn: ['Notes'],
    followUpStatusColumn: ['FollowUpStatus']
  });

  ngOnInit(): void {
    this.auth.session$
      .pipe(
        map((session) => session?.venueId ?? null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((venueId) => {
        this.handleVenueChange(venueId);
      });

    this.eventForm.controls.spaceIds.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.autoFillCapacityFromSpaces());

    this.eventForm.controls.isPaid.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isPaid) => {
        if (!isPaid) {
          this.eventForm.patchValue({ ticketPrice: null, hasEarlyBird: false, earlyBirdPrice: null, earlyBirdEndsOn: null }, { emitEvent: false });
        }
      });

    this.eventForm.controls.hasEarlyBird.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((hasEarlyBird) => {
        if (!hasEarlyBird) {
          this.eventForm.patchValue({ earlyBirdPrice: null, earlyBirdEndsOn: null }, { emitEvent: false });
        }
      });
  }

  get selectedSpaceIds(): string[] {
    return this.eventForm.controls.spaceIds.value;
  }

  get checkedInCount(): number {
    return this.attendees.filter((x) => x.checkedIn).length;
  }

  get convertedCount(): number {
    return this.attendees.filter((x) => !!x.convertedEnquiryId).length;
  }

  get selectedAttendeeCount(): number {
    return this.selectedAttendeeIds.size;
  }

  get allAttendeesSelected(): boolean {
    return this.attendees.length > 0 && this.selectedAttendeeIds.size === this.attendees.length;
  }

  get publicRegistrationUrl(): string {
    if (!this.selectedEvent) {
      return '';
    }

    return `${window.location.origin}/events-hub/register/${this.selectedEvent.id}`;
  }

  loadAll(): void {
    if (!this.venueId) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.api.getVenueSpaces(this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (spaces) => {
          this.spaces = spaces;
          this.loadEvents();
          this.loadUsers();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = this.extractErrorMessage(error, 'Unable to load venue spaces for Events Hub.');
        }
      });
  }

  loadEvents(): void {
    if (!this.venueId) {
      return;
    }

    this.api.getEventsHubEvents(this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (events) => {
          this.events = events;
          this.loading = false;

          if (this.selectedEventId) {
            const stillExists = events.find((x) => x.id === this.selectedEventId);
            if (stillExists) {
              this.selectEvent(stillExists.id);
              return;
            }
          }

          if (events.length > 0) {
            this.selectEvent(events[0].id);
          } else {
            this.startNewEvent();
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = this.extractErrorMessage(error, 'Unable to load Events Hub events.');
        }
      });
  }

  loadUsers(): void {
    if (!this.venueId) {
      return;
    }

    this.api.getUsers(this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: () => {
          this.users = [];
        }
      });
  }

  selectEvent(eventId: string): void {
    if (!this.venueId) {
      return;
    }

    this.selectedEventId = eventId;
    this.api.getEventsHubEvent(this.venueId, eventId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (event) => {
          this.selectedEvent = event;
          this.patchEventForm(event);
          this.loadAttendees(event.id);
          this.loadAnalytics(event.id);
        },
        error: (error) => {
          this.errorMessage = this.extractErrorMessage(error, 'Unable to load event details.');
        }
      });
  }

  startNewEvent(): void {
    this.selectedEvent = null;
    this.selectedEventId = null;
    this.publishResponse = null;
    this.syncResponse = null;
    this.analytics = null;
    this.attendees = [];
    this.selectedAttendeeIds.clear();

    const now = new Date();
    const start = this.toInputTime(now);
    const endDate = new Date(now.getTime() + (2 * 60 * 60 * 1000));
    const end = this.toInputTime(endDate);

    this.eventForm.reset({
      name: '',
      type: 'Fair',
      eventDate: this.toInputDate(now),
      startTime: start,
      endTime: end,
      spaceIds: [],
      capacity: null,
      registrationLimit: null,
      description: '',
      featuredImageUrl: '',
      isPaid: false,
      ticketPrice: null,
      currencyCode: 'GBP',
      hasEarlyBird: false,
      earlyBirdPrice: null,
      earlyBirdEndsOn: null,
      listingStatus: 'Draft',
      status: 'Planned'
    });
  }

  saveEvent(): void {
    if (!this.venueId) {
      return;
    }

    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const payload = this.toEventPayload();
    if (!payload) {
      return;
    }

    this.savingEvent = true;
    this.errorMessage = '';
    this.lastActionMessage = '';

    const request$ = this.selectedEvent
      ? this.api.updateEventsHubEvent(this.venueId, this.selectedEvent.id, payload)
      : this.api.createEventsHubEvent(this.venueId, payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (event) => {
        this.savingEvent = false;
        this.lastActionMessage = this.selectedEvent
          ? 'Event updated in Events Hub.'
          : 'Event created in Events Hub.';
        this.selectedEventId = event.id;
        this.loadEvents();
      },
      error: (error) => {
        this.savingEvent = false;
        this.errorMessage = typeof error?.error === 'string'
          ? error.error
          : 'Unable to save event.';
      }
    });
  }

  deleteSelectedEvent(): void {
    if (!this.venueId || !this.selectedEvent) {
      return;
    }

    const confirmed = window.confirm(`Delete event \"${this.selectedEvent.name}\" and all attendee records?`);
    if (!confirmed) {
      return;
    }

    this.deletingEvent = true;
    this.errorMessage = '';
    this.lastActionMessage = '';

    this.api.deleteEventsHubEvent(this.venueId, this.selectedEvent.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deletingEvent = false;
          this.lastActionMessage = 'Event deleted.';
          this.startNewEvent();
          this.loadEvents();
        },
        error: () => {
          this.deletingEvent = false;
          this.errorMessage = 'Unable to delete event.';
        }
      });
  }

  publishToCreventa(): void {
    if (!this.venueId || !this.selectedEvent) {
      return;
    }

    this.publishing = true;
    this.errorMessage = '';
    this.lastActionMessage = '';

    this.api.publishEventsHubEvent(this.venueId, this.selectedEvent.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.publishing = false;
          this.publishResponse = response;
          this.lastActionMessage = response.message ?? (response.published ? 'Published to Creventa.' : 'Publish request queued.');
          this.loadEvents();
        },
        error: (error) => {
          this.publishing = false;
          this.errorMessage = typeof error?.error === 'string'
            ? error.error
            : 'Unable to publish event to Creventa.';
        }
      });
  }

  syncFromCreventa(): void {
    if (!this.venueId || !this.selectedEvent) {
      return;
    }

    this.syncing = true;
    this.errorMessage = '';
    this.lastActionMessage = '';

    this.api.syncEventsHubEvent(this.venueId, this.selectedEvent.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.syncing = false;
          this.syncResponse = response;
          this.lastActionMessage = response.message;
          this.loadEvents();
          this.loadAnalytics(this.selectedEvent!.id);
        },
        error: (error) => {
          this.syncing = false;
          this.errorMessage = typeof error?.error === 'string'
            ? error.error
            : 'Unable to sync Creventa data.';
        }
      });
  }

  loadAttendees(eventId: string): void {
    if (!this.venueId) {
      return;
    }

    this.loadingAttendees = true;

    this.api.getEventsHubAttendees(this.venueId, eventId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (attendees) => {
          this.loadingAttendees = false;
          this.attendees = attendees;
          const valid = new Set(attendees.map((x) => x.id));
          this.selectedAttendeeIds = new Set(Array.from(this.selectedAttendeeIds).filter((id) => valid.has(id)));
        },
        error: () => {
          this.loadingAttendees = false;
          this.attendees = [];
          this.selectedAttendeeIds.clear();
        }
      });
  }

  addAttendee(): void {
    if (!this.venueId || !this.selectedEvent || this.attendeeForm.invalid) {
      this.attendeeForm.markAllAsTouched();
      return;
    }

    const payload: UpsertEventsHubAttendeeRequest = {
      firstName: this.attendeeForm.controls.firstName.value.trim(),
      lastName: this.attendeeForm.controls.lastName.value.trim(),
      email: this.attendeeForm.controls.email.value.trim(),
      phoneNumberE164: this.trimOrNull(this.attendeeForm.controls.phoneNumberE164.value),
      eventInterest: this.trimOrNull(this.attendeeForm.controls.eventInterest.value),
      notes: this.trimOrNull(this.attendeeForm.controls.notes.value),
      followUpStatus: this.attendeeForm.controls.followUpStatus.value
    };

    this.addingAttendee = true;
    this.api.addEventsHubAttendee(this.venueId, this.selectedEvent.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.addingAttendee = false;
          this.attendeeForm.reset({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumberE164: '',
            eventInterest: '',
            notes: '',
            followUpStatus: 'Pending'
          });
          this.loadAttendees(this.selectedEvent!.id);
          this.loadEvents();
          this.loadAnalytics(this.selectedEvent!.id);
        },
        error: () => {
          this.addingAttendee = false;
          this.errorMessage = 'Unable to add attendee.';
        }
      });
  }

  toggleCheckIn(attendee: EventsHubAttendeeDto): void {
    if (!this.venueId || !this.selectedEvent) {
      return;
    }

    this.api.setEventsHubAttendeeCheckIn(this.venueId, this.selectedEvent.id, attendee.id, !attendee.checkedIn)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadAttendees(this.selectedEvent!.id);
          this.loadEvents();
          this.loadAnalytics(this.selectedEvent!.id);
        },
        error: () => {
          this.errorMessage = 'Unable to update check-in state.';
        }
      });
  }

  toggleSelectAllAttendees(checked: boolean): void {
    if (checked) {
      this.selectedAttendeeIds = new Set(this.attendees.map((x) => x.id));
      return;
    }

    this.selectedAttendeeIds.clear();
  }

  toggleAttendeeSelection(attendeeId: string, checked: boolean): void {
    if (checked) {
      this.selectedAttendeeIds.add(attendeeId);
      return;
    }

    this.selectedAttendeeIds.delete(attendeeId);
  }

  isAttendeeSelected(attendeeId: string): boolean {
    return this.selectedAttendeeIds.has(attendeeId);
  }

  bulkUpdateFollowUpStatus(): void {
    if (!this.venueId || !this.selectedEvent || this.selectedAttendeeIds.size === 0) {
      return;
    }

    this.api.bulkSetEventsHubAttendeeFollowUpStatus(this.venueId, this.selectedEvent.id, {
      attendeeIds: Array.from(this.selectedAttendeeIds),
      followUpStatus: this.bulkFollowUpStatus
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.lastActionMessage = `Updated follow-up status for ${response.updatedCount} attendee${response.updatedCount === 1 ? '' : 's'}.`;
          this.loadAttendees(this.selectedEvent!.id);
          this.loadEvents();
        },
        error: () => {
          this.errorMessage = 'Unable to update attendee follow-up status.';
        }
      });
  }

  emailAttendees(scope: 'all' | 'selected'): void {
    const targetAttendees = scope === 'all'
      ? this.attendees
      : this.attendees.filter((attendee) => this.selectedAttendeeIds.has(attendee.id));

    const recipients = targetAttendees
      .map((attendee) => attendee.email.trim())
      .filter((email) => email.length > 0);

    if (recipients.length === 0) {
      this.errorMessage = scope === 'all'
        ? 'No attendee email addresses are available.'
        : 'No selected attendees have email addresses.';
      return;
    }

    const subject = this.selectedEvent ? encodeURIComponent(`${this.selectedEvent.name} update`) : '';
    window.location.href = `mailto:${recipients.join(',')}?subject=${subject}`;
  }

  exportAttendeesCsv(): void {
    if (this.attendees.length === 0) {
      this.errorMessage = 'No attendees to export.';
      return;
    }

    const rows = [
      ['First Name', 'Last Name', 'Email', 'Phone', 'Interest', 'Follow Up Status', 'Converted Enquiry', 'Registered At', 'Checked In'],
      ...this.attendees.map((attendee) => [
        attendee.firstName,
        attendee.lastName,
        attendee.email,
        attendee.phoneNumberE164 ?? '',
        attendee.eventInterest ?? '',
        attendee.followUpStatus,
        attendee.convertedEnquiryId ?? '',
        attendee.registeredAtUtc,
        attendee.checkedIn ? 'Yes' : 'No'
      ])
    ];

    const csv = rows
      .map((row) => row.map((value) => this.csvEscape(value)).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const eventSlug = (this.selectedEvent?.name ?? 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fileName = `${eventSlug}-attendees.csv`;
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.setAttribute('download', fileName);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }

  onAttendeeImportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.attendeeImportFile = file;
    this.attendeeImportFileName = file?.name ?? '';
  }

  importAttendeesCsv(): void {
    if (!this.venueId || !this.selectedEvent || !this.attendeeImportFile) {
      this.errorMessage = 'Select a CSV file to import attendees.';
      return;
    }

    this.importingAttendees = true;
    this.errorMessage = '';

    this.api.importEventsHubAttendeesCsv(
      this.venueId,
      this.selectedEvent.id,
      this.attendeeImportFile,
      this.attendeeImportMappingForm.getRawValue()
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.importingAttendees = false;
          this.lastActionMessage = `Imported ${response.importedCount} attendee${response.importedCount === 1 ? '' : 's'} (${response.skippedCount} skipped).`;
          if (response.warnings.length > 0) {
            this.errorMessage = response.warnings.slice(0, 3).join(' ');
          }
          this.attendeeImportFile = null;
          this.attendeeImportFileName = '';
          this.loadAttendees(this.selectedEvent!.id);
          this.loadEvents();
          this.loadAnalytics(this.selectedEvent!.id);
        },
        error: () => {
          this.importingAttendees = false;
          this.errorMessage = 'Unable to import attendee CSV.';
        }
      });
  }

  copyPublicRegistrationLink(): void {
    const url = this.publicRegistrationUrl;
    if (!url) {
      return;
    }

    navigator.clipboard.writeText(url)
      .then(() => {
        this.registrationLinkCopied = true;
        window.setTimeout(() => {
          this.registrationLinkCopied = false;
        }, 1500);
      })
      .catch(() => {
        this.errorMessage = 'Unable to copy the registration link.';
      });
  }

  convertAttendeeToEnquiry(attendee: EventsHubAttendeeDto): void {
    if (!this.venueId || !this.selectedEvent || attendee.convertedEnquiryId) {
      return;
    }

    const event = this.selectedEvent;
    const guestDefault = Math.max(1, Math.round((event.capacity ?? 20) * 0.6));

    this.api.convertVenueEventAttendeeToEnquiry(
      this.venueId,
      event.id,
      attendee.id,
      {
        eventType: this.mapVenueEventTypeToEnquiryType(event.type),
        eventStartUtc: event.startUtc,
        eventEndUtc: event.endUtc,
        guestsExpected: guestDefault,
        eventStyle: event.type,
        eventManagerUserId: this.users[0]?.id ?? null,
        spaceId: event.spaceIds[0] ?? null
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.lastActionMessage = `Attendee converted to enquiry ${response.reference}.`;
          this.loadAttendees(event.id);
          this.loadEvents();
          this.loadAnalytics(event.id);
        },
        error: () => {
          this.errorMessage = 'Unable to convert attendee to enquiry.';
        }
      });
  }

  loadAnalytics(eventId: string): void {
    if (!this.venueId) {
      return;
    }

    this.loadingAnalytics = true;

    this.api.getEventsHubAnalytics(this.venueId, eventId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (analytics) => {
          this.loadingAnalytics = false;
          this.analytics = analytics;
        },
        error: () => {
          this.loadingAnalytics = false;
          this.analytics = null;
        }
      });
  }

  isSpaceSelected(spaceId: string): boolean {
    return this.selectedSpaceIds.includes(spaceId);
  }

  toggleSpace(spaceId: string, checked: boolean): void {
    const existing = this.selectedSpaceIds;
    if (checked) {
      if (!existing.includes(spaceId)) {
        this.eventForm.controls.spaceIds.setValue([...existing, spaceId]);
      }
      return;
    }

    this.eventForm.controls.spaceIds.setValue(existing.filter((id) => id !== spaceId));
  }

  spaceMaxCapacity(space: SpaceSummaryDto): number {
    if (space.capacityBySetup.length === 0) {
      return 0;
    }

    return Math.max(...space.capacityBySetup.map((capacity) => capacity.capacity));
  }

  onFeaturedImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Featured image must be an image file.';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'Featured image must be 5MB or smaller.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.eventForm.controls.featuredImageUrl.setValue(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.readAsDataURL(file);
  }

  private autoFillCapacityFromSpaces(): void {
    const selected = this.selectedSpaceIds;
    if (selected.length === 0) {
      return;
    }

    const currentCapacity = this.eventForm.controls.capacity.value;
    if (currentCapacity && currentCapacity > 0) {
      return;
    }

    const calculated = this.spaces
      .filter((space) => selected.includes(space.id))
      .reduce((sum, space) => {
        const max = Math.max(...space.capacityBySetup.map((capacity) => capacity.capacity), 0);
        return sum + max;
      }, 0);

    if (calculated > 0) {
      this.eventForm.controls.capacity.setValue(calculated);
      if (!this.eventForm.controls.registrationLimit.value) {
        this.eventForm.controls.registrationLimit.setValue(calculated);
      }
    }
  }

  private patchEventForm(event: EventsHubEventDto): void {
    const start = new Date(event.startUtc);
    const end = new Date(event.endUtc);

    this.eventForm.reset({
      name: event.name,
      type: (this.eventTypeOptions.includes(event.type) ? event.type : 'Other'),
      eventDate: this.toInputDate(start),
      startTime: this.toInputTime(start),
      endTime: this.toInputTime(end),
      spaceIds: [...event.spaceIds],
      capacity: event.capacity ?? null,
      registrationLimit: event.registrationLimit ?? null,
      description: event.description ?? '',
      featuredImageUrl: event.featuredImageUrl ?? '',
      isPaid: event.isPaid,
      ticketPrice: event.ticketPrice ?? null,
      currencyCode: event.currencyCode || 'GBP',
      hasEarlyBird: event.hasEarlyBird,
      earlyBirdPrice: event.earlyBirdPrice ?? null,
      earlyBirdEndsOn: event.earlyBirdEndsOn ?? null,
      listingStatus: event.listingStatus === 'Published' ? 'Published' : 'Draft',
      status: (this.statusOptions.includes(event.status) ? event.status : 'Planned') as 'Planned' | 'Confirmed' | 'Completed' | 'Cancelled'
    });

    this.publishResponse = null;
    this.syncResponse = null;
  }

  private toEventPayload(): UpsertEventsHubEventRequest | null {
    const value = this.eventForm.getRawValue();

    const startUtc = this.combineLocalDateTimeToUtc(value.eventDate, value.startTime);
    const endUtc = this.combineLocalDateTimeToUtc(value.eventDate, value.endTime);

    if (!startUtc || !endUtc) {
      this.errorMessage = 'Event date and times are required.';
      return null;
    }

    if (new Date(endUtc).getTime() <= new Date(startUtc).getTime()) {
      this.errorMessage = 'End time must be after start time.';
      return null;
    }

    if (value.isPaid && (!value.ticketPrice || value.ticketPrice <= 0)) {
      this.errorMessage = 'Paid events require a ticket price.';
      return null;
    }

    if (value.hasEarlyBird && (!value.earlyBirdPrice || value.earlyBirdPrice <= 0)) {
      this.errorMessage = 'Early bird pricing requires a valid early bird price.';
      return null;
    }

    return {
      name: value.name.trim(),
      type: value.type,
      startUtc,
      endUtc,
      description: this.trimOrNull(value.description),
      status: value.status,
      capacity: value.capacity,
      spaceIds: value.spaceIds,
      registrationLimit: value.registrationLimit,
      listingStatus: value.listingStatus,
      isPaid: value.isPaid,
      ticketPrice: value.isPaid ? value.ticketPrice : null,
      currencyCode: (value.currencyCode || 'GBP').toUpperCase(),
      hasEarlyBird: value.isPaid && value.hasEarlyBird,
      earlyBirdPrice: value.isPaid && value.hasEarlyBird ? value.earlyBirdPrice : null,
      earlyBirdEndsOn: value.isPaid && value.hasEarlyBird ? value.earlyBirdEndsOn : null,
      featuredImageUrl: this.trimOrNull(value.featuredImageUrl)
    };
  }

  private combineLocalDateTimeToUtc(date: string, time: string): string | null {
    if (!date || !time) {
      return null;
    }

    const value = new Date(`${date}T${time}:00`);
    if (Number.isNaN(value.getTime())) {
      return null;
    }

    return value.toISOString();
  }

  private toInputDate(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toInputTime(value: Date): string {
    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private handleVenueChange(venueId: string | null): void {
    this.venueId = venueId;
    this.resetVenueScopedState();
    if (!this.venueId) {
      this.loading = false;
      this.errorMessage = 'Select a venue to manage Events Hub.';
      return;
    }

    this.loadAll();
  }

  private resetVenueScopedState(): void {
    this.events = [];
    this.spaces = [];
    this.users = [];
    this.attendees = [];
    this.selectedAttendeeIds.clear();
    this.analytics = null;
    this.selectedEvent = null;
    this.selectedEventId = null;
    this.publishResponse = null;
    this.syncResponse = null;
    this.lastActionMessage = '';
    this.errorMessage = '';
    this.loading = true;
    this.startNewEvent();
  }

  private mapVenueEventTypeToEnquiryType(type: string): string {
    const normalized = type.trim().toLowerCase();
    if (normalized.includes('fair') || normalized.includes('wedding')) {
      return 'Wedding';
    }

    if (normalized.includes('network') || normalized.includes('exhibition') || normalized.includes('open day')) {
      return 'Corporate Conference';
    }

    if (normalized.includes('tasting')) {
      return 'Private Dining';
    }

    return 'Other';
  }

  private trimOrNull(value: string | null | undefined): string | null {
    const normalized = (value ?? '').trim();
    return normalized ? normalized : null;
  }

  private csvEscape(value: unknown): string {
    const text = String(value ?? '');
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
      return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
  }

  private extractErrorMessage(error: unknown, fallback: string): string {
    const maybeError = error as { status?: number; error?: { message?: string } | string; message?: string };
    if (typeof maybeError?.error === 'string' && maybeError.error.trim().length > 0) {
      return maybeError.error;
    }

    if (typeof maybeError?.error === 'object' && typeof maybeError.error?.message === 'string' && maybeError.error.message.trim().length > 0) {
      return maybeError.error.message;
    }

    if (typeof maybeError?.message === 'string' && maybeError.message.trim().length > 0) {
      return maybeError.message;
    }

    if (maybeError?.status === 403) {
      return 'You do not have permission to access Events Hub for this venue.';
    }

    return fallback;
  }
}
