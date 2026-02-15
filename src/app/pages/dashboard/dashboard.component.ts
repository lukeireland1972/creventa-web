import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivityFeedItemDto,
  ApiService,
  DashboardKpiCardDto,
  DashboardResponse,
  TaskDueDto,
  UpcomingEventDto
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-dashboard',
    imports: [DatePipe, DecimalPipe],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  data: DashboardResponse | null = null;
  period: '7d' | '30d' | '90d' = '30d';
  isLoading = false;
  errorMessage = '';
  private currentVenueId: string | null = null;
  private recoveringVenue = false;

  get venueName(): string {
    const venueId = this.auth.selectedVenueId;
    return this.auth.session?.venueRoles.find((role) => role.venueId === venueId)?.venueName ?? 'Current venue';
  }

  ngOnInit(): void {
    if (this.auth.isOperationsOnly()) {
      this.router.navigateByUrl('/operations');
      return;
    }

    this.auth.session$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((session) => {
      const venueId = session?.venueId ?? null;
      if (!venueId) {
        this.currentVenueId = null;
        this.data = null;
        this.errorMessage = 'Select a venue to view dashboard metrics.';
        return;
      }

      if (this.currentVenueId === venueId && this.data) {
        return;
      }

      this.currentVenueId = venueId;
      this.loadDashboard();
    });
  }

  setPeriod(period: '7d' | '30d' | '90d'): void {
    this.period = period;
    this.loadDashboard();
  }

  openKpi(card: DashboardKpiCardDto): void {
    this.router.navigateByUrl(card.clickRoute);
  }

  openEnquiriesTab(statusTab: string): void {
    this.router.navigate(['/enquiries'], { queryParams: { statusTab } });
  }

  openActionRequired(action: 'inactive' | 'unassigned' | 'expiring' | 'total'): void {
    switch (action) {
      case 'inactive':
        this.router.navigate(['/enquiries'], { queryParams: { statusTab: 'all', quickFilter: 'overdue-follow-up' } });
        return;
      case 'unassigned':
        this.router.navigate(['/enquiries'], { queryParams: { statusTab: 'all', quickFilter: 'unassigned' } });
        return;
      case 'expiring':
        this.router.navigate(['/enquiries'], { queryParams: { statusTab: 'provisional', quickFilter: 'expiring-holds' } });
        return;
      default:
        this.router.navigate(['/enquiries'], { queryParams: { statusTab: 'all' } });
    }
  }

  openTask(task: TaskDueDto): void {
    this.router.navigate(['/enquiries'], { queryParams: { enquiry: task.enquiryId, statusTab: 'all' } });
  }

  openUpcomingEvent(event: UpcomingEventDto): void {
    this.router.navigate(['/enquiries'], { queryParams: { enquiry: event.enquiryId, statusTab: 'all' } });
  }

  openActivity(activity: ActivityFeedItemDto): void {
    if (activity.linkRoute) {
      this.router.navigateByUrl(activity.linkRoute);
      return;
    }

    if (activity.entityType === 'Enquiry') {
      this.router.navigate(['/enquiries'], { queryParams: { enquiry: activity.entityId, statusTab: 'all' } });
    }
  }

  openLink(path: string): void {
    this.router.navigateByUrl(path);
  }

  retryLoad(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    const venueId = this.currentVenueId ?? this.auth.selectedVenueId;
    if (!venueId) {
      this.data = null;
      this.errorMessage = 'Select a venue to view dashboard metrics.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.api
      .getDashboard(venueId, this.period)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.data = response;
          this.recoveringVenue = false;
          this.isLoading = false;
        },
        error: (error) => {
          if (error?.status === 403 && this.auth.isOperationsOnly()) {
            this.router.navigateByUrl('/operations');
            this.isLoading = false;
            return;
          }

          if ((error?.status === 403 || error?.status === 404) && !this.recoveringVenue) {
            const fallbackVenueId = this.auth.session?.venueRoles.find((role) => role.venueId !== venueId)?.venueId;
            if (fallbackVenueId) {
              this.recoveringVenue = true;
              this.auth.setSelectedVenue(fallbackVenueId);
              this.currentVenueId = fallbackVenueId;
              this.loadDashboard();
              return;
            }
          }

          this.recoveringVenue = false;

          const apiMessage =
            typeof error?.error === 'string'
              ? error.error
              : typeof error?.error?.message === 'string'
                ? error.error.message
                : null;
          const apiCode = typeof error?.error?.code === 'string' ? error.error.code : null;
          const correlationId = typeof error?.error?.correlationId === 'string' ? error.error.correlationId : null;

          const connectivityMessage =
            error?.status === 0 ? 'Dashboard API is unreachable. Ensure backend is running on http://localhost:5080.' : null;

          this.data = null;
          const message = connectivityMessage ?? apiMessage ?? 'Unable to load dashboard data right now. Please retry.';
          const codeSuffix = apiCode ? ` [${apiCode}]` : '';
          const correlationSuffix = correlationId ? ` (Ref: ${correlationId})` : '';
          this.errorMessage = `${message}${codeSuffix}${correlationSuffix}`;
          this.isLoading = false;
        }
      });
  }
}
