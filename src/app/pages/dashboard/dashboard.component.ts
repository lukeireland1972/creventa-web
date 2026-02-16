import { Component, DestroyRef, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, of } from 'rxjs';
import {
  ActivityFeedItemDto,
  ApiService,
  DashboardKpiCardDto,
  DashboardResponse,
  ReportResponse,
  TaskDueDto,
  UpcomingEventDto
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface SourceSlice {
  source: string;
  count: number;
  percentage: number;
  color: string;
}

interface RevenueTrendPoint {
  month: string;
  confirmedRevenue: number;
  budgetTarget: number;
  currencyCode: string;
}

interface ChartJsInstance {
  destroy(): void;
}

interface ChartJsConstructor {
  new (context: CanvasRenderingContext2D, config: Record<string, unknown>): ChartJsInstance;
}

declare global {
  interface Window {
    Chart?: ChartJsConstructor;
  }
}

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
  private sourceChart: ChartJsInstance | null = null;
  private revenueChart: ChartJsInstance | null = null;

  sourceSlices: SourceSlice[] = [];
  revenueTrend: RevenueTrendPoint[] = [];
  chartLibraryUnavailable = false;
  chartErrorMessage = '';

  @ViewChild('sourceChartCanvas')
  private sourceChartCanvas?: ElementRef<HTMLCanvasElement>;

  @ViewChild('revenueTrendCanvas')
  private revenueTrendCanvas?: ElementRef<HTMLCanvasElement>;

  get venueName(): string {
    const venueId = this.auth.selectedVenueId;
    return this.auth.session?.venueRoles.find((role) => role.venueId === venueId)?.venueName ?? 'Current venue';
  }

  get revenueTrendHasBudgetOverlay(): boolean {
    return this.revenueTrend.some((point) => point.budgetTarget > 0);
  }

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => this.destroyCharts());

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

  openSourceFilter(source: string): void {
    this.router.navigate(['/enquiries'], {
      queryParams: {
        statusTab: 'all',
        source
      }
    });
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
          this.loadDashboardCharts(venueId, this.period);
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
          this.sourceSlices = [];
          this.revenueTrend = [];
          this.destroyCharts();
          const message = connectivityMessage ?? apiMessage ?? 'Unable to load dashboard data right now. Please retry.';
          const codeSuffix = apiCode ? ` [${apiCode}]` : '';
          const correlationSuffix = correlationId ? ` (Ref: ${correlationId})` : '';
          this.errorMessage = `${message}${codeSuffix}${correlationSuffix}`;
          this.isLoading = false;
        }
      });
  }

  private loadDashboardCharts(venueId: string, period: '7d' | '30d' | '90d'): void {
    const periodWindow = this.resolvePeriodWindow(period);
    const revenueWindowStart = new Date(periodWindow.from);
    revenueWindowStart.setMonth(revenueWindowStart.getMonth() - 11);
    revenueWindowStart.setDate(1);

    const sourceFilters = {
      venueId,
      from: periodWindow.from.toISOString().slice(0, 10),
      to: periodWindow.to.toISOString().slice(0, 10)
    };

    const revenueFilters = {
      venueId,
      from: revenueWindowStart.toISOString().slice(0, 10),
      to: periodWindow.to.toISOString().slice(0, 10)
    };

    this.chartErrorMessage = '';
    this.chartLibraryUnavailable = false;

    forkJoin({
      source: this.api.getSourceAnalysisReport(sourceFilters).pipe(catchError(() => of<ReportResponse | null>(null))),
      revenue: this.api.getRevenueForecastReport(revenueFilters).pipe(catchError(() => of<ReportResponse | null>(null)))
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ source, revenue }) => {
          this.sourceSlices = this.mapSourceSlices(source);
          this.revenueTrend = this.mapRevenueTrend(revenue);
          this.scheduleChartRender();
        },
        error: () => {
          this.sourceSlices = [];
          this.revenueTrend = [];
          this.destroyCharts();
          this.chartErrorMessage = 'Charts are currently unavailable.';
        }
      });
  }

  private mapSourceSlices(report: ReportResponse | null): SourceSlice[] {
    if (!report) {
      return [];
    }

    const palette: Record<string, string> = {
      Phone: '#3b82f6',
      Email: '#0ea5e9',
      'Website Form': '#6366f1',
      'Social Media': '#8b5cf6',
      Referral: '#14b8a6',
      'Venue Event': '#f59e0b',
      'Returning Client': '#22c55e'
    };

    const rows = report.rows
      .map((row) => ({
        source: this.readString(row, 'source'),
        count: this.readNumber(row, 'count'),
        percentage: this.readNumber(row, 'percentage')
      }))
      .filter((row) => row.source.length > 0);

    const total = rows.reduce((sum, row) => sum + row.count, 0);

    return rows
      .map((row) => ({
        source: row.source,
        count: row.count,
        percentage: total > 0 ? Number(((row.count / total) * 100).toFixed(2)) : row.percentage,
        color: palette[row.source] ?? '#94a3b8'
      }))
      .sort((left, right) => right.count - left.count);
  }

  private mapRevenueTrend(report: ReportResponse | null): RevenueTrendPoint[] {
    if (!report) {
      return [];
    }

    return report.rows
      .map((row) => ({
        month: this.readString(row, 'month'),
        confirmedRevenue: this.readNumber(row, 'confirmedRevenue'),
        budgetTarget: this.readNumber(row, 'budgetTarget'),
        currencyCode: this.readString(row, 'currencyCode') || 'GBP'
      }))
      .filter((row) => row.month.length > 0)
      .sort((left, right) => left.month.localeCompare(right.month))
      .slice(-12);
  }

  private scheduleChartRender(): void {
    setTimeout(() => {
      this.renderSourceChart();
      this.renderRevenueTrendChart();
    });
  }

  private renderSourceChart(): void {
    this.sourceChart?.destroy();
    this.sourceChart = null;

    if (this.sourceSlices.length === 0) {
      return;
    }

    const chartCtor = this.resolveChartCtor();
    const canvas = this.sourceChartCanvas?.nativeElement;
    if (!chartCtor || !canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const labels = this.sourceSlices.map((slice) => slice.source);
    const values = this.sourceSlices.map((slice) => slice.count);
    const colors = this.sourceSlices.map((slice) => slice.color);
    const total = values.reduce((sum, value) => sum + value, 0);

    this.sourceChart = new chartCtor(context, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context: { label?: string; parsed?: number }) => {
                const value = typeof context.parsed === 'number' ? context.parsed : 0;
                const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                return `${context.label ?? 'Source'}: ${value} (${pct}%)`;
              }
            }
          }
        },
        onClick: (_event: unknown, activeElements: Array<{ index: number }>) => {
          if (activeElements.length === 0) {
            return;
          }

          const selected = this.sourceSlices[activeElements[0].index];
          if (selected) {
            this.openSourceFilter(selected.source);
          }
        }
      }
    });
  }

  private renderRevenueTrendChart(): void {
    this.revenueChart?.destroy();
    this.revenueChart = null;

    if (this.revenueTrend.length === 0) {
      return;
    }

    const chartCtor = this.resolveChartCtor();
    const canvas = this.revenueTrendCanvas?.nativeElement;
    if (!chartCtor || !canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const labels = this.revenueTrend.map((point) => this.formatMonthLabel(point.month));
    const confirmed = this.revenueTrend.map((point) => point.confirmedRevenue);
    const budget = this.revenueTrend.map((point) => point.budgetTarget);
    const currencyCode = this.revenueTrend[0]?.currencyCode ?? 'GBP';
    const showBudget = budget.some((value) => value > 0);
    const formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0
    });

    this.revenueChart = new chartCtor(context, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Confirmed Revenue',
            data: confirmed,
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22,163,74,0.14)',
            pointBackgroundColor: '#16a34a',
            pointRadius: 3,
            borderWidth: 2,
            tension: 0.28,
            fill: true
          },
          ...(showBudget
            ? [
                {
                  label: 'Budget Target',
                  data: budget,
                  borderColor: '#3b82f6',
                  pointBackgroundColor: '#3b82f6',
                  borderWidth: 2,
                  pointRadius: 2,
                  tension: 0.2,
                  fill: false,
                  borderDash: [6, 6]
                }
              ]
            : [])
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              boxWidth: 8
            }
          },
          tooltip: {
            callbacks: {
              label: (context: { dataset: { label?: string }; parsed: { y?: number } }) =>
                `${context.dataset.label ?? 'Value'}: ${formatter.format(context.parsed.y ?? 0)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value: number | string) => formatter.format(Number(value) || 0)
            }
          }
        }
      }
    });
  }

  private resolvePeriodWindow(period: '7d' | '30d' | '90d'): { from: Date; to: Date } {
    const to = new Date();
    const from = new Date(to);
    const days = period === '7d' ? 6 : period === '30d' ? 29 : 89;
    from.setDate(to.getDate() - days);
    from.setHours(0, 0, 0, 0);
    return { from, to };
  }

  private resolveChartCtor(): ChartJsConstructor | null {
    const chartCtor = window.Chart;
    if (!chartCtor) {
      this.chartLibraryUnavailable = true;
      this.chartErrorMessage = 'Chart library failed to load.';
      return null;
    }

    this.chartLibraryUnavailable = false;
    return chartCtor;
  }

  private destroyCharts(): void {
    this.sourceChart?.destroy();
    this.sourceChart = null;
    this.revenueChart?.destroy();
    this.revenueChart = null;
  }

  private formatMonthLabel(monthKey: string): string {
    if (!/^\d{4}-\d{2}$/.test(monthKey)) {
      return monthKey;
    }

    const [year, month] = monthKey.split('-').map(Number);
    const date = new Date(year, (month || 1) - 1, 1);
    return new Intl.DateTimeFormat('en-GB', { month: 'short', year: '2-digit' }).format(date);
  }

  private readString(row: Record<string, unknown>, key: string): string {
    const value = row[key];
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    return '';
  }

  private readNumber(row: Record<string, unknown>, key: string): number {
    const value = row[key];
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
  }
}
