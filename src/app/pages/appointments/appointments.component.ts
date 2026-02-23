import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ApiService,
  AppointmentDetailDto,
  SpaceSummaryDto,
  UserSummaryDto
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

type AppointmentFormStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'NoShow';

interface RelatedEnquiryOption {
  id: string;
  reference: string;
  contactName: string;
  eventType: string;
  eventDate: string;
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

type AppointmentSort = 'date' | 'title' | 'type' | 'status' | 'assignee';

@Component({
  selector: 'app-appointments-page',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly appointmentTypeOptions = ['Meeting', 'Menu Tasting', 'Site Visit', 'Rehearsal', 'Other'];
  readonly appointmentStatusOptions: AppointmentFormStatus[] = ['Scheduled', 'Completed', 'Cancelled', 'NoShow'];

  loading = false;
  errorMessage = '';
  saving = false;
  formError = '';
  formConflictWarning = '';
  formCanOverrideConflict = false;

  appointments: AppointmentDetailDto[] = [];
  filteredAppointments: AppointmentDetailDto[] = [];
  users: UserSummaryDto[] = [];
  spaces: SpaceSummaryDto[] = [];
  relatedEnquiryOptions: RelatedEnquiryOption[] = [];

  showForm = false;
  formMode: 'create' | 'edit' = 'create';
  draft: AppointmentDraft = this.createDraft();
  relatedSearchTerm = '';

  filterType = '';
  filterStatus = '';
  filterAssignedToUserId = '';
  filterSearch = '';
  filterFromDate = '';
  filterToDate = '';
  sortBy: AppointmentSort = 'date';
  sortDirection: 'asc' | 'desc' = 'asc';

  get venueId(): string {
    return this.auth.selectedVenueId || this.auth.session?.venueId || '';
  }

  get filteredRelatedEnquiryOptions(): RelatedEnquiryOption[] {
    const term = this.relatedSearchTerm.trim().toLowerCase();
    if (!term) {
      return this.relatedEnquiryOptions;
    }

    return this.relatedEnquiryOptions.filter((option) =>
      option.reference.toLowerCase().includes(term)
      || option.contactName.toLowerCase().includes(term)
      || option.eventType.toLowerCase().includes(term));
  }

  ngOnInit(): void {
    this.auth.session$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.venueId) {
          this.errorMessage = 'Select a venue to view appointments.';
          this.appointments = [];
          this.filteredAppointments = [];
          return;
        }

        this.errorMessage = '';
        this.loadLookups();
        this.loadAppointments();
      });
  }

  loadAppointments(): void {
    if (!this.venueId) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.api.getAppointments({
      venueId: this.venueId,
      fromUtc: this.filterFromDate ? `${this.filterFromDate}T00:00:00Z` : undefined,
      toUtc: this.filterToDate ? `${this.filterToDate}T23:59:59Z` : undefined,
      assignedToUserId: this.filterAssignedToUserId || undefined,
      status: this.filterStatus || undefined
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.appointments = [...(response.items ?? [])];
          this.applyLocalFilters();
        },
        error: (error) => {
          this.loading = false;
          this.appointments = [];
          this.filteredAppointments = [];
          this.errorMessage = this.resolveApiErrorMessage(error, 'Unable to load appointments.');
        }
      });
  }

  applyFilters(): void {
    this.loadAppointments();
  }

  resetFilters(): void {
    this.filterType = '';
    this.filterStatus = '';
    this.filterAssignedToUserId = '';
    this.filterSearch = '';
    this.filterFromDate = '';
    this.filterToDate = '';
    this.sortBy = 'date';
    this.sortDirection = 'asc';
    this.loadAppointments();
  }

  toggleSort(column: AppointmentSort): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }

    this.applyLocalFilters();
  }

  openCreateForm(): void {
    this.showForm = true;
    this.formMode = 'create';
    this.saving = false;
    this.formError = '';
    this.formConflictWarning = '';
    this.formCanOverrideConflict = false;
    this.relatedSearchTerm = '';
    this.draft = this.createDraft();
  }

  openEditForm(appointmentId: string): void {
    if (!appointmentId || !this.venueId) {
      return;
    }

    this.showForm = true;
    this.formMode = 'edit';
    this.saving = false;
    this.formError = '';
    this.formConflictWarning = '';
    this.formCanOverrideConflict = false;
    this.relatedSearchTerm = '';

    this.api.getAppointment(appointmentId, this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.draft = this.mapToDraft(detail);
        },
        error: () => {
          this.formError = 'Unable to load appointment.';
        }
      });
  }

  cancelForm(): void {
    this.showForm = false;
    this.saving = false;
    this.formError = '';
    this.formConflictWarning = '';
    this.formCanOverrideConflict = false;
    this.relatedSearchTerm = '';
    this.draft = this.createDraft();
  }

  saveAppointment(allowConflictOverride = false): void {
    if (!this.venueId || this.saving) {
      return;
    }

    const validationError = this.validateDraft(this.draft);
    if (validationError) {
      this.formError = validationError;
      return;
    }

    this.saving = true;
    this.formError = '';
    this.formConflictWarning = '';
    this.formCanOverrideConflict = false;

    const payload = {
      venueId: this.venueId,
      title: this.draft.title.trim(),
      type: this.draft.type.trim(),
      startUtc: this.combineDateTimeToIso(this.draft.date, this.draft.startTime),
      durationMinutes: Math.max(15, Math.floor(this.numberOrZero(this.draft.durationMinutes))),
      spaceId: this.draft.spaceId || null,
      attendees: this.draft.attendees.trim() || null,
      relatedEnquiryIds: this.draft.relatedEnquiryIds.filter((id) => !!id),
      assignedToUserId: this.draft.assignedToUserId || null,
      notes: this.draft.notes.trim() || null,
      status: this.draft.status,
      allowConflictOverride
    };

    const request$ = this.formMode === 'edit' && this.draft.id
      ? this.api.updateAppointment(this.draft.id, payload)
      : this.api.createAppointment(payload);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving = false;
          this.cancelForm();
          this.loadAppointments();
        },
        error: (error) => {
          this.saving = false;
          if (error?.status === 409) {
            this.formCanOverrideConflict = true;
            this.formError = typeof error?.error?.message === 'string'
              ? error.error.message
              : 'Appointment conflicts with existing bookings.';
            this.formConflictWarning = 'Space/time conflict detected. Save anyway is available.';
            return;
          }

          this.formError = typeof error?.error?.message === 'string'
            ? error.error.message
            : 'Unable to save appointment.';
        }
      });
  }

  deleteAppointment(appointmentId: string): void {
    if (!appointmentId || !this.venueId) {
      return;
    }

    const confirmed = window.confirm('Delete this appointment?');
    if (!confirmed) {
      return;
    }

    this.api.deleteAppointment(appointmentId, this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (this.draft.id === appointmentId) {
            this.cancelForm();
          }
          this.loadAppointments();
        },
        error: () => {
          this.formError = 'Unable to delete appointment.';
        }
      });
  }

  updateAppointmentStatus(appointmentId: string, status: AppointmentFormStatus): void {
    if (!appointmentId || !this.venueId) {
      return;
    }

    this.api.getAppointment(appointmentId, this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.api.updateAppointment(appointmentId, {
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
          })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => this.loadAppointments(),
              error: () => {
                this.formError = `Unable to mark appointment as ${status}.`;
              }
            });
        },
        error: () => {
          this.formError = 'Unable to load appointment for status change.';
        }
      });
  }

  toggleRelatedEnquiry(enquiryId: string): void {
    const selected = new Set(this.draft.relatedEnquiryIds);
    if (selected.has(enquiryId)) {
      selected.delete(enquiryId);
    } else {
      selected.add(enquiryId);
    }

    this.draft = {
      ...this.draft,
      relatedEnquiryIds: Array.from(selected)
    };
    this.formError = '';
  }

  isRelatedEnquirySelected(enquiryId: string): boolean {
    return this.draft.relatedEnquiryIds.includes(enquiryId);
  }

  appointmentStatusLabel(value: string): string {
    const normalized = (value || '').trim().toLowerCase();
    if (normalized === 'noshow') {
      return 'No-Show';
    }

    return value;
  }

  userDisplayName(user: UserSummaryDto | null | undefined): string {
    if (!user) {
      return '';
    }

    return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
  }

  spaceName(spaceId?: string | null): string {
    if (!spaceId) {
      return 'Unassigned';
    }

    return this.spaces.find((space) => space.id === spaceId)?.name ?? 'Unknown space';
  }

  relatedEnquirySummary(appointment: AppointmentDetailDto): string {
    const related = appointment.relatedEnquiries ?? [];
    if (related.length === 0) {
      return 'No linked enquiries';
    }

    if (related.length === 1) {
      return `${related[0].reference} · ${related[0].contactName}`;
    }

    return `${related.length} linked enquiries`;
  }

  applyLocalFilters(): void {
    const search = this.filterSearch.trim().toLowerCase();
    const type = this.filterType.trim().toLowerCase();
    const from = this.filterFromDate ? new Date(`${this.filterFromDate}T00:00:00Z`) : null;
    const to = this.filterToDate ? new Date(`${this.filterToDate}T23:59:59Z`) : null;

    let list = [...this.appointments];
    if (type) {
      list = list.filter((item) => (item.type || '').trim().toLowerCase() === type);
    }

    if (search) {
      list = list.filter((item) => {
        const relatedText = (item.relatedEnquiries ?? [])
          .map((entry) => `${entry.reference} ${entry.contactName} ${entry.eventName || ''}`.toLowerCase())
          .join(' ');
        return (item.title || '').toLowerCase().includes(search)
          || (item.attendees || '').toLowerCase().includes(search)
          || (item.assignedToName || '').toLowerCase().includes(search)
          || relatedText.includes(search);
      });
    }

    if (from) {
      list = list.filter((item) => new Date(item.startUtc) >= from);
    }

    if (to) {
      list = list.filter((item) => new Date(item.startUtc) <= to);
    }

    list.sort((left, right) => this.compareAppointments(left, right));
    this.filteredAppointments = list;
  }

  private compareAppointments(left: AppointmentDetailDto, right: AppointmentDetailDto): number {
    let result = 0;
    switch (this.sortBy) {
      case 'title':
        result = (left.title || '').localeCompare(right.title || '');
        break;
      case 'type':
        result = (left.type || '').localeCompare(right.type || '');
        break;
      case 'status':
        result = (left.status || '').localeCompare(right.status || '');
        break;
      case 'assignee':
        result = (left.assignedToName || '').localeCompare(right.assignedToName || '');
        break;
      case 'date':
      default:
        result = new Date(left.startUtc).getTime() - new Date(right.startUtc).getTime();
        break;
    }

    return this.sortDirection === 'asc' ? result : -result;
  }

  private loadLookups(): void {
    if (!this.venueId) {
      return;
    }

    this.api.getUsers(this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.users = [...(users ?? [])].sort((left, right) =>
            this.userDisplayName(left).localeCompare(this.userDisplayName(right)));
        },
        error: () => {
          this.users = [];
        }
      });

    this.api.getVenueSpaces(this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (spaces) => {
          this.spaces = [...(spaces ?? [])]
            .filter((space) => space.isActive !== false)
            .sort((left, right) => left.name.localeCompare(right.name));
        },
        error: () => {
          this.spaces = [];
        }
      });

    this.api.getEnquiries({ venueId: this.venueId, statusTab: 'all', page: 1, pageSize: 100 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.relatedEnquiryOptions = (response.page.items ?? []).map((item) => ({
            id: item.id,
            reference: item.reference,
            contactName: item.contactName,
            eventType: item.eventType,
            eventDate: item.eventStartUtc
          }));
        },
        error: () => {
          this.relatedEnquiryOptions = [];
        }
      });
  }

  private createDraft(): AppointmentDraft {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hour = String(now.getUTCHours()).padStart(2, '0');
    const minute = String(now.getUTCMinutes()).padStart(2, '0');

    return {
      title: '',
      type: 'Meeting',
      date: `${year}-${month}-${day}`,
      startTime: `${hour}:${minute}`,
      durationMinutes: 60,
      spaceId: '',
      attendees: '',
      relatedEnquiryIds: [],
      assignedToUserId: '',
      notes: '',
      status: 'Scheduled'
    };
  }

  private mapToDraft(appointment: AppointmentDetailDto): AppointmentDraft {
    const start = new Date(appointment.startUtc);
    const year = start.getUTCFullYear();
    const month = String(start.getUTCMonth() + 1).padStart(2, '0');
    const day = String(start.getUTCDate()).padStart(2, '0');
    const hour = String(start.getUTCHours()).padStart(2, '0');
    const minute = String(start.getUTCMinutes()).padStart(2, '0');

    return {
      id: appointment.id,
      title: appointment.title ?? '',
      type: appointment.type ?? 'Meeting',
      date: `${year}-${month}-${day}`,
      startTime: `${hour}:${minute}`,
      durationMinutes: Math.max(15, Math.floor(this.numberOrZero(appointment.durationMinutes) || 60)),
      spaceId: appointment.spaceId ?? '',
      attendees: appointment.attendees ?? '',
      relatedEnquiryIds: (appointment.relatedEnquiries ?? []).map((item) => item.enquiryId),
      assignedToUserId: appointment.assignedToUserId ?? '',
      notes: appointment.notes ?? '',
      status: this.normalizeStatus(appointment.status)
    };
  }

  private validateDraft(draft: AppointmentDraft): string | null {
    if (!draft.title.trim()) {
      return 'Title is required.';
    }
    if (!draft.type.trim()) {
      return 'Type is required.';
    }
    if (!draft.date || !draft.startTime) {
      return 'Date and time are required.';
    }
    if (Math.floor(this.numberOrZero(draft.durationMinutes)) <= 0) {
      return 'Duration must be greater than zero.';
    }
    if (draft.relatedEnquiryIds.length === 0) {
      return 'Select at least one related enquiry.';
    }

    return null;
  }

  private combineDateTimeToIso(date: string, time: string): string {
    const parsed = new Date(`${date}T${time}:00Z`);
    if (Number.isNaN(parsed.getTime())) {
      return new Date().toISOString();
    }

    return parsed.toISOString();
  }

  private normalizeStatus(value: string | null | undefined): AppointmentFormStatus {
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

  private numberOrZero(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private resolveApiErrorMessage(error: unknown, fallback: string): string {
    const payload = error as {
      status?: number;
      error?: unknown;
      message?: string;
    } | null | undefined;

    const status = Number(payload?.status ?? 0);
    if (status === 0) {
      return 'Appointments API is unreachable. Ensure backend is running on http://localhost:5080.';
    }

    const apiError = payload?.error;
    let message = '';
    let code = '';
    let correlationId = '';

    if (typeof apiError === 'string' && apiError.trim().length > 0) {
      message = apiError.trim();
    } else if (apiError && typeof apiError === 'object') {
      const typed = apiError as {
        message?: string;
        detail?: string;
        title?: string;
        code?: string;
        correlationId?: string;
      };

      if (typeof typed.message === 'string' && typed.message.trim().length > 0) {
        message = typed.message.trim();
      } else if (typeof typed.detail === 'string' && typed.detail.trim().length > 0) {
        message = typed.detail.trim();
      } else if (typeof typed.title === 'string' && typed.title.trim().length > 0) {
        message = typed.title.trim();
      }

      if (typeof typed.code === 'string' && typed.code.trim().length > 0) {
        code = typed.code.trim();
      }

      if (typeof typed.correlationId === 'string' && typed.correlationId.trim().length > 0) {
        correlationId = typed.correlationId.trim();
      }
    }

    if (!message && typeof payload?.message === 'string' && payload.message.trim().length > 0) {
      message = payload.message.trim();
    }

    const resolved = message || fallback;
    const codeSuffix = code ? ` [${code}]` : '';
    const correlationSuffix = correlationId ? ` (Ref: ${correlationId})` : '';
    return `${resolved}${codeSuffix}${correlationSuffix}`;
  }
}
