import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, PublicEventsHubRegistrationEventDto } from '../../services/api.service';

@Component({
  selector: 'app-events-hub-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, RouterLink],
  templateUrl: './events-hub-registration.component.html',
  styleUrl: './events-hub-registration.component.scss'
})
export class EventsHubRegistrationComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  loading = true;
  submitting = false;
  event: PublicEventsHubRegistrationEventDto | null = null;
  errorMessage = '';
  successMessage = '';

  registrationForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(120)]],
    lastName: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(300)]],
    phoneNumberE164: [''],
    eventInterest: [''],
    notes: ['']
  });

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId')?.trim() ?? '';
    if (!eventId) {
      this.loading = false;
      this.errorMessage = 'Registration link is invalid.';
      return;
    }

    this.api.getPublicEventsHubRegistrationEvent(eventId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (event) => {
          this.event = event;
          this.loading = false;
          this.errorMessage = '';
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'This registration link is unavailable.';
        }
      });
  }

  submit(): void {
    if (this.submitting || this.registrationForm.invalid || !this.event) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.registrationForm.getRawValue();
    this.api.registerPublicEventsHubAttendee(this.event.eventId, {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim(),
      phoneNumberE164: this.trimOrNull(payload.phoneNumberE164),
      eventInterest: this.trimOrNull(payload.eventInterest),
      notes: this.trimOrNull(payload.notes)
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Registration complete. The venue team will follow up with you shortly.';
          this.registrationForm.reset({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumberE164: '',
            eventInterest: '',
            notes: ''
          });
        },
        error: (error) => {
          this.submitting = false;
          const message = typeof error?.error === 'string'
            ? error.error
            : 'Unable to complete registration right now.';
          this.errorMessage = message;
        }
      });
  }

  private trimOrNull(value: string | null | undefined): string | null {
    const normalized = (value ?? '').trim();
    return normalized.length > 0 ? normalized : null;
  }
}

