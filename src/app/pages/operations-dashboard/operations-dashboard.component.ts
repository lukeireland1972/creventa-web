import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, OperationsDayColumnDto } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-operations-dashboard',
    imports: [DatePipe],
    templateUrl: './operations-dashboard.component.html',
    styleUrl: './operations-dashboard.component.scss'
})
export class OperationsDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  columns: OperationsDayColumnDto[] = this.buildEmptyColumns();
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    const venueId = this.auth.selectedVenueId;
    if (!venueId) {
      this.errorMessage = 'Select a venue to view operations.';
      this.columns = this.buildEmptyColumns();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.api
      .getOperationsOverview(venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.columns = (response.columns?.length ? response.columns : this.buildEmptyColumns()).slice(0, 3);
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Unable to load operations view right now.';
          this.columns = this.buildEmptyColumns();
        }
      });
  }

  private buildEmptyColumns(): OperationsDayColumnDto[] {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const toIsoDay = (value: Date): string => {
      const year = value.getUTCFullYear();
      const month = String(value.getUTCMonth() + 1).padStart(2, '0');
      const day = String(value.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return [
      { label: 'Yesterday', date: toIsoDay(yesterday), items: [] },
      { label: 'Today', date: toIsoDay(today), items: [] },
      { label: 'Tomorrow', date: toIsoDay(tomorrow), items: [] }
    ];
  }
}
