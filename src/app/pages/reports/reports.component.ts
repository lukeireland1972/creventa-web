import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ApiService,
  ReportDefinitionDto,
  ReportResponse,
  ReportScheduleDto,
  SnapshotRunResponse
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  venueId: string | null = null;
  catalog: ReportDefinitionDto[] = [];
  selectedReportKey = 'pipeline';
  report: ReportResponse | null = null;
  schedules: ReportScheduleDto[] = [];

  fromDate = '';
  toDate = '';
  scheduleName = '';
  scheduleFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly';
  scheduleRecipients = '';

  snapshotMessage = '';
  isLoading = false;

  get columns(): string[] {
    return this.report?.columns ?? [];
  }

  ngOnInit(): void {
    this.venueId = this.auth.selectedVenueId;
    if (!this.venueId) {
      return;
    }

    this.loadCatalogAndReport();
    this.loadSchedules();
  }

  selectReport(reportKey: string): void {
    this.selectedReportKey = reportKey;
    this.loadReport();
  }

  loadReport(): void {
    if (!this.venueId) {
      return;
    }

    this.isLoading = true;
    this.api
      .getReport(this.selectedReportKey, {
        venueId: this.venueId,
        from: this.fromDate || undefined,
        to: this.toDate || undefined
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (report) => {
          this.report = report;
          this.isLoading = false;
        },
        error: () => {
          this.report = null;
          this.isLoading = false;
        }
      });
  }

  exportReport(format: 'csv' | 'xlsx' | 'pdf'): void {
    if (!this.venueId) {
      return;
    }

    this.api
      .exportReport(this.selectedReportKey, {
        venueId: this.venueId,
        format,
        from: this.fromDate || undefined,
        to: this.toDate || undefined
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.selectedReportKey}.${format}`;
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }

  createSchedule(): void {
    if (!this.venueId || !this.scheduleName.trim() || !this.scheduleRecipients.trim()) {
      return;
    }

    const recipients = this.scheduleRecipients
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    if (recipients.length === 0) {
      return;
    }

    this.api
      .upsertReportSchedule(this.venueId, {
        name: this.scheduleName.trim(),
        reportKey: this.selectedReportKey,
        frequency: this.scheduleFrequency,
        recipients,
        isActive: true,
        venueId: this.venueId
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.scheduleName = '';
          this.scheduleRecipients = '';
          this.loadSchedules();
        }
      });
  }

  deleteSchedule(scheduleId: string): void {
    this.api
      .deleteReportSchedule(scheduleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadSchedules();
        }
      });
  }

  runSnapshot(): void {
    if (!this.venueId) {
      return;
    }

    this.api
      .runPipelineSnapshot(this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: SnapshotRunResponse) => {
          this.snapshotMessage = `Snapshot ${response.snapshotDate} captured (${response.rowsInserted} rows).`;
        },
        error: () => {
          this.snapshotMessage = 'Snapshot run failed.';
        }
      });
  }

  private loadCatalogAndReport(): void {
    this.api
      .getReportsCatalog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (catalog) => {
          this.catalog = catalog.reports;
          if (!this.catalog.some((item) => item.key === this.selectedReportKey) && this.catalog.length > 0) {
            this.selectedReportKey = this.catalog[0].key;
          }

          this.loadReport();
        }
      });
  }

  private loadSchedules(): void {
    if (!this.venueId) {
      return;
    }

    this.api
      .getReportSchedules(this.venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.schedules = response.items;
        },
        error: () => {
          this.schedules = [];
        }
      });
  }
}
