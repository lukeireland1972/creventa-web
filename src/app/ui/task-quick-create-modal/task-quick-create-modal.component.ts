import { Component, DestroyRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, EnquiryDetailResponse, EnquiryListItemDto, UserSummaryDto } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

export interface QuickTaskCreatedEvent {
  taskId: string;
  enquiryId: string;
}

interface QuickTaskEnquiryOption {
  id: string;
  reference: string;
  eventName: string;
  eventStartUtc: string;
  status: string;
}

@Component({
  selector: 'app-task-quick-create-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-quick-create-modal.component.html',
  styleUrl: './task-quick-create-modal.component.scss'
})
export class TaskQuickCreateModalComponent implements OnChanges {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  @Input() isOpen = false;
  @Input() defaultEnquiryId: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<QuickTaskCreatedEvent>();

  loadingOptions = false;
  saving = false;
  loadError = '';
  saveError = '';

  enquiries: QuickTaskEnquiryOption[] = [];
  users: UserSummaryDto[] = [];

  readonly form = this.formBuilder.group({
    enquiryId: ['', Validators.required],
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', Validators.maxLength(2000)],
    priority: ['medium', Validators.required],
    category: ['follow_up', Validators.required],
    assigneeId: [''],
    dueDate: [''],
    dueTime: ['']
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        this.handleOpen();
      } else {
        this.resetState();
      }
      return;
    }

    if (changes['defaultEnquiryId'] && this.isOpen) {
      this.applyDefaultEnquirySelection();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    if (!this.isOpen) {
      return;
    }

    this.requestClose();
  }

  requestClose(): void {
    if (this.saving) {
      return;
    }

    this.close.emit();
  }

  submit(): void {
    if (this.saving || this.loadingOptions) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const enquiryId = (raw.enquiryId ?? '').trim();
    if (!enquiryId) {
      return;
    }

    this.saving = true;
    this.saveError = '';

    this.api
      .createTask(enquiryId, {
        title: (raw.title ?? '').trim(),
        description: (raw.description ?? '').trim() || null,
        status: 'todo',
        priority: (raw.priority ?? 'medium').trim() || 'medium',
        category: (raw.category ?? 'follow_up').trim() || 'follow_up',
        assigneeId: (raw.assigneeId ?? '').trim() || null,
        dueDate: (raw.dueDate ?? '').trim() || null,
        dueTime: (raw.dueTime ?? '').trim() || null,
        notes: null
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (task) => {
          this.saving = false;
          this.created.emit({
            taskId: task.id,
            enquiryId: task.enquiryId
          });
          this.requestClose();
        },
        error: (error) => {
          this.saving = false;
          this.saveError = typeof error?.error === 'string'
            ? error.error
            : (typeof error?.error?.message === 'string' ? error.error.message : 'Unable to create task.');
        }
      });
  }

  enquiryLabel(option: QuickTaskEnquiryOption): string {
    const name = option.eventName || 'Untitled event';
    return `${option.reference} · ${name}`;
  }

  enquiryMeta(option: QuickTaskEnquiryOption): string {
    return `${option.status} · ${new Date(option.eventStartUtc).toLocaleDateString('en-GB')}`;
  }

  trackByEnquiry(index: number, option: QuickTaskEnquiryOption): string {
    return option.id;
  }

  trackByUser(index: number, user: UserSummaryDto): string {
    return user.id;
  }

  private handleOpen(): void {
    this.saveError = '';
    this.loadError = '';
    this.form.patchValue({
      title: '',
      description: '',
      priority: 'medium',
      category: 'follow_up',
      assigneeId: '',
      dueDate: '',
      dueTime: ''
    });

    this.loadFormOptions();
  }

  private resetState(): void {
    this.loadingOptions = false;
    this.saving = false;
    this.loadError = '';
    this.saveError = '';
  }

  private loadFormOptions(): void {
    const venueId = this.auth.selectedVenueId;
    if (!venueId) {
      this.loadError = 'Select a venue before creating a task.';
      return;
    }

    this.loadingOptions = true;
    this.loadError = '';

    const defaultEnquiry$ = this.defaultEnquiryId
      ? this.api.getEnquiry(this.defaultEnquiryId).pipe(catchError(() => of(null)))
      : of(null as EnquiryDetailResponse | null);

    forkJoin({
      enquiries: this.api.getEnquiries({
        venueId,
        statusTab: 'all',
        period: 'this-year',
        page: 1,
        pageSize: 200,
        sortBy: 'eventDate',
        sortDirection: 'asc'
      }),
      users: this.api.getUsers(venueId).pipe(catchError(() => of([] as UserSummaryDto[]))),
      defaultEnquiry: defaultEnquiry$
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ enquiries, users, defaultEnquiry }) => {
          const options = enquiries.page.items.map((item) => this.mapEnquiryOption(item));
          if (defaultEnquiry && !options.some((option) => option.id === defaultEnquiry.id)) {
            options.unshift({
              id: defaultEnquiry.id,
              reference: defaultEnquiry.reference,
              eventName: defaultEnquiry.eventName || defaultEnquiry.eventType,
              eventStartUtc: defaultEnquiry.eventStartUtc,
              status: defaultEnquiry.status
            });
          }

          this.enquiries = options;
          this.users = users;
          this.applyDefaultEnquirySelection();
          this.loadingOptions = false;
        },
        error: () => {
          this.loadingOptions = false;
          this.enquiries = [];
          this.users = [];
          this.loadError = 'Unable to load enquiries for task creation.';
        }
      });
  }

  private applyDefaultEnquirySelection(): void {
    const fallback = this.enquiries[0]?.id ?? '';
    const preferred = this.defaultEnquiryId && this.enquiries.some((option) => option.id === this.defaultEnquiryId)
      ? this.defaultEnquiryId
      : fallback;

    this.form.patchValue({
      enquiryId: preferred
    });
  }

  private mapEnquiryOption(item: EnquiryListItemDto): QuickTaskEnquiryOption {
    return {
      id: item.id,
      reference: item.reference,
      eventName: item.eventType,
      eventStartUtc: item.eventStartUtc,
      status: item.status
    };
  }
}
