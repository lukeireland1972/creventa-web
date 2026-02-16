import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService, ReportFilterParams, ReportResponse } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

type DatePreset = 'this-month' | 'last-30d' | 'last-90d' | 'this-year' | 'custom';

interface SalesPerformanceRow {
  month: string;
  numberOfBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  currencyCode: string;
}

interface PipelineConversionRow {
  stage: string;
  count: number;
  conversionFromPreviousPercent: number;
  conversionFromNewPercent: number;
}

interface RevenueForecastRow {
  month: string;
  confirmedRevenue: number;
  budgetTarget: number;
  variance: number;
  variancePercent: number;
  currencyCode: string;
}

interface SourceAnalysisRow {
  source: string;
  count: number;
  percentage: number;
  color: string;
}

interface LostReasonRow {
  reason: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly pipelineOrder: string[] = ['New', 'Tentative', 'Open Proposal', 'Provisional', 'Confirmed', 'Lost'];
  private readonly sourcePalette: Record<string, string> = {
    Phone: '#3b82f6',
    Email: '#0ea5e9',
    'Website Form': '#6366f1',
    'Social Media': '#8b5cf6',
    Referral: '#14b8a6',
    'Venue Event': '#f59e0b',
    'Returning Client': '#22c55e'
  };

  readonly eventTypes: string[] = [
    'all',
    'Wedding',
    'Corporate Conference',
    'Private Dining',
    'Christmas Party',
    'Birthday',
    'Funeral/Wake',
    'Charity',
    'Product Launch',
    'Team Building',
    'Other'
  ];

  venueId: string | null = null;

  isLoading = false;
  errorMessage = '';
  exportState: string | null = null;

  selectedPreset: DatePreset = 'this-month';
  fromDate = '';
  toDate = '';
  eventType = 'all';

  salesPerformanceReport: ReportResponse | null = null;
  pipelineConversionReport: ReportResponse | null = null;
  revenueForecastReport: ReportResponse | null = null;
  sourceAnalysisReport: ReportResponse | null = null;
  lostReasonReport: ReportResponse | null = null;

  ngOnInit(): void {
    this.venueId = this.auth.selectedVenueId;
    this.applyPreset('this-month', false);
    this.loadReports();
  }

  applyPreset(preset: DatePreset, shouldReload = true): void {
    this.selectedPreset = preset;
    const today = new Date();

    if (preset === 'custom') {
      if (shouldReload) {
        this.loadReports();
      }
      return;
    }

    if (preset === 'this-month') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      this.fromDate = this.toInputDate(start);
      this.toDate = this.toInputDate(end);
    } else if (preset === 'last-30d') {
      const start = new Date(today);
      start.setDate(today.getDate() - 29);
      this.fromDate = this.toInputDate(start);
      this.toDate = this.toInputDate(today);
    } else if (preset === 'last-90d') {
      const start = new Date(today);
      start.setDate(today.getDate() - 89);
      this.fromDate = this.toInputDate(start);
      this.toDate = this.toInputDate(today);
    } else {
      this.fromDate = `${today.getFullYear()}-01-01`;
      this.toDate = `${today.getFullYear()}-12-31`;
    }

    if (shouldReload) {
      this.loadReports();
    }
  }

  onManualDateChange(): void {
    this.selectedPreset = 'custom';
  }

  loadReports(): void {
    if (!this.venueId) {
      this.errorMessage = 'Select a venue to load reports.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const filters = this.buildFilterParams();

    forkJoin({
      sales: this.api.getSalesPerformanceReport(filters).pipe(catchError(() => of(this.emptyReport('sales-performance', 'Sales Performance')))),
      pipeline: this.api.getPipelineConversionReport(filters).pipe(catchError(() => of(this.emptyReport('pipeline-conversion', 'Pipeline Conversion')))),
      forecast: this.api.getRevenueForecastReport(filters).pipe(catchError(() => of(this.emptyReport('revenue-forecast', 'Revenue Forecast')))),
      source: this.api.getSourceAnalysisReport(filters).pipe(catchError(() => of(this.emptyReport('source-analysis', 'Source Analysis')))),
      lost: this.api.getLostReasonAnalysisReport(filters).pipe(catchError(() => of(this.emptyReport('lost-reason-analysis', 'Lost Reason Analysis'))))
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.salesPerformanceReport = result.sales;
          this.pipelineConversionReport = result.pipeline;
          this.revenueForecastReport = result.forecast;
          this.sourceAnalysisReport = result.source;
          this.lostReasonReport = result.lost;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Unable to load reports. Please try again.';
        }
      });
  }

  exportSection(reportKey: string, format: 'csv' | 'pdf'): void {
    if (!this.venueId) {
      return;
    }

    this.exportState = `${reportKey}-${format}`;
    this.api
      .exportReport(reportKey, {
        venueId: this.venueId,
        format,
        from: this.fromDate || undefined,
        to: this.toDate || undefined,
        eventType: this.eventType === 'all' ? undefined : this.eventType
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          const fileName = `${reportKey}-${this.toInputDate(new Date())}.${format}`;
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = fileName;
          anchor.click();
          URL.revokeObjectURL(url);
          this.exportState = null;
        },
        error: () => {
          this.exportState = null;
        }
      });
  }

  isExporting(reportKey: string, format: 'csv' | 'pdf'): boolean {
    return this.exportState === `${reportKey}-${format}`;
  }

  get salesRows(): SalesPerformanceRow[] {
    if (!this.salesPerformanceReport) {
      return [];
    }

    return this.salesPerformanceReport.rows
      .map((row) => ({
        month: this.getString(row, 'month'),
        numberOfBookings: this.getNumber(row, 'numberOfBookings'),
        totalRevenue: this.getNumber(row, 'totalRevenue'),
        averageBookingValue: this.getNumber(row, 'averageBookingValue'),
        currencyCode: this.getString(row, 'currencyCode') || 'GBP'
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  get salesRevenueMax(): number {
    return Math.max(...this.salesRows.map((row) => row.totalRevenue), 0);
  }

  get pipelineRows(): PipelineConversionRow[] {
    if (!this.pipelineConversionReport) {
      return [];
    }

    return this.pipelineConversionReport.rows
      .map((row) => ({
        stage: this.getString(row, 'stage'),
        count: this.getNumber(row, 'count'),
        conversionFromPreviousPercent: this.getNumber(row, 'conversionFromPreviousPercent'),
        conversionFromNewPercent: this.getNumber(row, 'conversionFromNewPercent')
      }))
      .sort((a, b) => this.pipelineOrder.indexOf(a.stage) - this.pipelineOrder.indexOf(b.stage));
  }

  get pipelineCountMax(): number {
    return Math.max(...this.pipelineRows.map((row) => row.count), 0);
  }

  get revenueForecastRows(): RevenueForecastRow[] {
    if (!this.revenueForecastReport) {
      return [];
    }

    return this.revenueForecastReport.rows
      .map((row) => ({
        month: this.getString(row, 'month'),
        confirmedRevenue: this.getNumber(row, 'confirmedRevenue'),
        budgetTarget: this.getNumber(row, 'budgetTarget'),
        variance: this.getNumber(row, 'variance'),
        variancePercent: this.getNumber(row, 'variancePercent'),
        currencyCode: this.getString(row, 'currencyCode') || 'GBP'
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  get forecastScaleMax(): number {
    return Math.max(
      ...this.revenueForecastRows.map((row) => Math.max(row.confirmedRevenue, row.budgetTarget)),
      0
    );
  }

  get sourceRows(): SourceAnalysisRow[] {
    if (!this.sourceAnalysisReport) {
      return [];
    }

    const rows = this.sourceAnalysisReport.rows.map((row) => ({
      source: this.getString(row, 'source'),
      count: this.getNumber(row, 'count'),
      percentage: this.getNumber(row, 'percentage'),
      color: this.sourcePalette[this.getString(row, 'source')] ?? '#94a3b8'
    }));

    const total = rows.reduce((sum, row) => sum + row.count, 0);
    return rows
      .map((row) => ({
        ...row,
        percentage: total > 0 ? Number(((row.count / total) * 100).toFixed(2)) : row.percentage
      }))
      .sort((a, b) => b.count - a.count);
  }

  get sourceTotal(): number {
    return this.sourceRows.reduce((sum, row) => sum + row.count, 0);
  }

  get sourceDonutBackground(): string {
    const data = this.sourceRows.filter((row) => row.count > 0);
    if (data.length === 0) {
      return 'conic-gradient(#e2e8f0 0% 100%)';
    }

    let current = 0;
    const segments = data.map((row) => {
      const next = current + row.percentage;
      const segment = `${row.color} ${current.toFixed(2)}% ${Math.min(next, 100).toFixed(2)}%`;
      current = next;
      return segment;
    });

    if (current < 100) {
      segments.push(`#e2e8f0 ${current.toFixed(2)}% 100%`);
    }

    return `conic-gradient(${segments.join(', ')})`;
  }

  get lostRows(): LostReasonRow[] {
    if (!this.lostReasonReport) {
      return [];
    }

    return this.lostReasonReport.rows
      .map((row) => ({
        reason: this.getString(row, 'reason'),
        count: this.getNumber(row, 'count'),
        percentage: this.getNumber(row, 'percentage')
      }))
      .sort((a, b) => b.count - a.count);
  }

  get lostCountMax(): number {
    return Math.max(...this.lostRows.map((row) => row.count), 0);
  }

  formatMonth(month: string): string {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return month;
    }

    const [year, value] = month.split('-');
    const asDate = new Date(Number(year), Number(value) - 1, 1);
    return new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }).format(asDate);
  }

  formatCurrency(amount: number, currencyCode = 'GBP'): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  formatPercent(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  varianceClass(variance: number): 'over' | 'under' | 'neutral' {
    if (variance > 0) {
      return 'over';
    }

    if (variance < 0) {
      return 'under';
    }

    return 'neutral';
  }

  private buildFilterParams(): ReportFilterParams {
    return {
      venueId: this.venueId!,
      from: this.fromDate || undefined,
      to: this.toDate || undefined,
      eventType: this.eventType === 'all' ? undefined : this.eventType
    };
  }

  private emptyReport(key: string, name: string): ReportResponse {
    return {
      key,
      name,
      generatedAtUtc: new Date().toISOString(),
      columns: [],
      rows: [],
      series: [],
      note: null
    };
  }

  private toInputDate(value: Date): string {
    return value.toISOString().slice(0, 10);
  }

  private getString(row: Record<string, unknown>, key: string): string {
    const value = row[key];
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    return '';
  }

  private getNumber(row: Record<string, unknown>, key: string): number {
    const value = row[key];
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string' && value.length > 0) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
  }
}
