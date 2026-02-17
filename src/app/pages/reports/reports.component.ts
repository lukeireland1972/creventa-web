import { Component, DestroyRef, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, forkJoin, map, of } from 'rxjs';
import { Chart as ChartJs, registerables } from 'chart.js';
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

interface SalesBarPoint {
  month: string;
  monthLabel: string;
  totalRevenue: number;
  currencyCode: string;
  heightPercent: number;
}

interface PipelineConversionRow {
  stage: string;
  count: number;
  conversionFromPreviousPercent: number;
  conversionFromNewPercent: number;
}

interface PipelineFunnelRow extends PipelineConversionRow {
  widthPercent: number;
}

interface RevenueForecastRow {
  month: string;
  confirmedRevenue: number;
  predictedRevenue: number;
  budgetTarget: number;
  variance: number;
  variancePercent: number;
  predictionVariance: number;
  currencyCode: string;
}

interface RevenueGroupedBarPoint {
  month: string;
  monthLabel: string;
  confirmedHeightPercent: number;
  predictedHeightPercent: number;
  budgetHeightPercent: number;
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

interface PaceRow {
  month: string;
  budgetTarget: number;
  confirmedRevenue: number;
  weightedPipelineRevenue: number;
  totalOnBooks: number;
  sameMonthLyAtThisPoint: number;
  varianceVsBudget: number;
  paceStatus: string;
  currencyCode: string;
}

interface PaceBarPoint {
  month: string;
  monthLabel: string;
  totalOnBooksHeightPercent: number;
  budgetHeightPercent: number;
  lyHeightPercent: number;
}

interface SustainabilityRow {
  month: string;
  eventCount: number;
  totalCarbonKgCo2e: number;
  averageCarbonKgPerGuest: number;
  totalWasteKg: number;
  wasteDivertedKg: number;
  wasteDiversionPercent: number;
  averageWasteKgPerGuest: number;
  averageSustainabilityScore: number;
  targetCarbonKgPerGuest: number;
  targetDiversionPercent: number;
  targetWasteKgPerGuest: number;
  yoyCarbonDeltaPercent: number;
  yoyScoreDelta: number;
  status: string;
}

interface SustainabilityBarPoint {
  month: string;
  monthLabel: string;
  totalCarbonKgCo2e: number;
  wasteDivertedKg: number;
  score: number;
  carbonHeightPercent: number;
}

type ChartJsInstance = ChartJs;

ChartJs.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly pipelineOrder: string[] = ['New', 'Tentative', 'Open Proposal', 'Provisional', 'Confirmed', 'Lost'];
  private readonly leadSources: string[] = [
    'Phone',
    'Email',
    'Website Form',
    'Social Media',
    'Referral',
    'Venue Event',
    'Returning Client'
  ];
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
  sustainabilityReport: ReportResponse | null = null;
  paceReport: ReportResponse | null = null;
  private forecastTrendChart: ChartJsInstance | null = null;

  @ViewChild('forecastTrendCanvas')
  private forecastTrendCanvas?: ElementRef<HTMLCanvasElement>;

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => this.destroyCharts());
    this.applyPreset('this-month', false);

    this.auth.session$
      .pipe(
        map((session) => session?.venueId ?? null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((venueId) => {
        this.venueId = venueId;
        if (!venueId) {
          this.clearReportData();
          this.errorMessage = 'Select a venue to load reports.';
          return;
        }

        this.loadReports();
      });
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
      lost: this.api.getLostReasonAnalysisReport(filters).pipe(catchError(() => of(this.emptyReport('lost-reason-analysis', 'Lost Reason Analysis')))),
      sustainability: this.api.getSustainabilityReport(filters).pipe(catchError(() => of(this.emptyReport('sustainability', 'Sustainability')))),
      pace: this.api.getReport('pace', filters).pipe(catchError(() => of(this.emptyReport('pace', 'Pace Report'))))
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.salesPerformanceReport = result.sales;
          this.pipelineConversionReport = result.pipeline;
          this.revenueForecastReport = result.forecast;
          this.sourceAnalysisReport = result.source;
          this.lostReasonReport = result.lost;
          this.sustainabilityReport = result.sustainability;
          this.paceReport = result.pace;
          this.isLoading = false;
          this.scheduleForecastTrendRender();
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Unable to load reports. Please try again.';
          this.destroyCharts();
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

  get salesBarPoints(): SalesBarPoint[] {
    const max = this.salesRevenueMax;
    return this.salesRows.map((row) => ({
      month: row.month,
      monthLabel: this.formatMonth(row.month),
      totalRevenue: row.totalRevenue,
      currencyCode: row.currencyCode,
      heightPercent: max > 0 ? Number(((row.totalRevenue / max) * 100).toFixed(2)) : 0
    }));
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

  get pipelineFunnelRows(): PipelineFunnelRow[] {
    const max = this.pipelineCountMax;
    return this.pipelineRows.map((row) => ({
      ...row,
      widthPercent: max > 0 ? Math.max(24, Number(((row.count / max) * 100).toFixed(2))) : 24
    }));
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
        predictedRevenue: this.getNumber(row, 'predictedRevenue'),
        budgetTarget: this.getNumber(row, 'budgetTarget'),
        variance: this.getNumber(row, 'variance'),
        variancePercent: this.getNumber(row, 'variancePercent'),
        predictionVariance: this.getNumber(row, 'predictionVariance'),
        currencyCode: this.getString(row, 'currencyCode') || 'GBP'
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  get forecastScaleMax(): number {
    return Math.max(
      ...this.revenueForecastRows.map((row) => Math.max(row.confirmedRevenue, row.predictedRevenue, row.budgetTarget)),
      0
    );
  }

  get revenueGroupedBarPoints(): RevenueGroupedBarPoint[] {
    const max = this.forecastScaleMax;
    return this.revenueForecastRows.map((row) => ({
      month: row.month,
      monthLabel: this.formatMonth(row.month),
      confirmedHeightPercent: max > 0 ? Number(((row.confirmedRevenue / max) * 100).toFixed(2)) : 0,
      predictedHeightPercent: max > 0 ? Number(((row.predictedRevenue / max) * 100).toFixed(2)) : 0,
      budgetHeightPercent: max > 0 ? Number(((row.budgetTarget / max) * 100).toFixed(2)) : 0,
      currencyCode: row.currencyCode
    }));
  }

  get sourceRows(): SourceAnalysisRow[] {
    if (!this.sourceAnalysisReport) {
      return [];
    }

    const sourceCountMap = new Map<string, number>();
    for (const row of this.sourceAnalysisReport.rows) {
      const source = this.getString(row, 'source');
      const count = this.getNumber(row, 'count');
      sourceCountMap.set(source, count);
    }

    const rows = this.leadSources
      .map((source) => ({
        source,
        count: sourceCountMap.get(source) ?? 0,
        percentage: 0,
        color: this.sourcePalette[source] ?? '#94a3b8'
      }))
      .sort((a, b) => b.count - a.count);

    const total = rows.reduce((sum, row) => sum + row.count, 0);
    return rows.map((row) => ({
      ...row,
      percentage: total > 0 ? Number(((row.count / total) * 100).toFixed(2)) : 0
    }));
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

    const rows = this.lostReasonReport.rows
      .map((row) => ({
        reason: this.getString(row, 'reason'),
        count: this.getNumber(row, 'count'),
        percentage: this.getNumber(row, 'percentage')
      }))
      .sort((a, b) => b.count - a.count);

    const total = rows.reduce((sum, row) => sum + row.count, 0);
    return rows.map((row) => ({
      ...row,
      percentage: total > 0 ? Number(((row.count / total) * 100).toFixed(2)) : row.percentage
    }));
  }

  get lostCountMax(): number {
    return Math.max(...this.lostRows.map((row) => row.count), 0);
  }

  get paceRows(): PaceRow[] {
    if (!this.paceReport) {
      return [];
    }

    return this.paceReport.rows
      .map((row) => ({
        month: this.getString(row, 'month'),
        budgetTarget: this.getNumber(row, 'budgetTarget'),
        confirmedRevenue: this.getNumber(row, 'confirmedRevenue'),
        weightedPipelineRevenue: this.getNumber(row, 'weightedPipelineRevenue'),
        totalOnBooks: this.getNumber(row, 'totalOnBooks'),
        sameMonthLyAtThisPoint: this.getNumber(row, 'sameMonthLyAtThisPoint'),
        varianceVsBudget: this.getNumber(row, 'varianceVsBudget'),
        paceStatus: this.getString(row, 'paceStatus') || 'n/a',
        currencyCode: this.getString(row, 'currencyCode') || 'GBP'
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  get paceScaleMax(): number {
    return Math.max(
      ...this.paceRows.map((row) => Math.max(row.totalOnBooks, row.budgetTarget, row.sameMonthLyAtThisPoint)),
      0
    );
  }

  get paceBarPoints(): PaceBarPoint[] {
    const max = this.paceScaleMax;
    return this.paceRows.map((row) => ({
      month: row.month,
      monthLabel: this.formatMonth(row.month),
      totalOnBooksHeightPercent: max > 0 ? Number(((row.totalOnBooks / max) * 100).toFixed(2)) : 0,
      budgetHeightPercent: max > 0 ? Number(((row.budgetTarget / max) * 100).toFixed(2)) : 0,
      lyHeightPercent: max > 0 ? Number(((row.sameMonthLyAtThisPoint / max) * 100).toFixed(2)) : 0
    }));
  }

  get sustainabilityRows(): SustainabilityRow[] {
    if (!this.sustainabilityReport) {
      return [];
    }

    return this.sustainabilityReport.rows
      .map((row) => ({
        month: this.getString(row, 'month'),
        eventCount: this.getNumber(row, 'eventCount'),
        totalCarbonKgCo2e: this.getNumber(row, 'totalCarbonKgCo2e'),
        averageCarbonKgPerGuest: this.getNumber(row, 'averageCarbonKgPerGuest'),
        totalWasteKg: this.getNumber(row, 'totalWasteKg'),
        wasteDivertedKg: this.getNumber(row, 'wasteDivertedKg'),
        wasteDiversionPercent: this.getNumber(row, 'wasteDiversionPercent'),
        averageWasteKgPerGuest: this.getNumber(row, 'averageWasteKgPerGuest'),
        averageSustainabilityScore: this.getNumber(row, 'averageSustainabilityScore'),
        targetCarbonKgPerGuest: this.getNumber(row, 'targetCarbonKgPerGuest'),
        targetDiversionPercent: this.getNumber(row, 'targetDiversionPercent'),
        targetWasteKgPerGuest: this.getNumber(row, 'targetWasteKgPerGuest'),
        yoyCarbonDeltaPercent: this.getNumber(row, 'yoyCarbonDeltaPercent'),
        yoyScoreDelta: this.getNumber(row, 'yoyScoreDelta'),
        status: this.getString(row, 'status')
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  get sustainabilityCarbonMax(): number {
    return Math.max(...this.sustainabilityRows.map((row) => row.totalCarbonKgCo2e), 0);
  }

  get sustainabilityBarPoints(): SustainabilityBarPoint[] {
    const max = this.sustainabilityCarbonMax;
    return this.sustainabilityRows.map((row) => ({
      month: row.month,
      monthLabel: this.formatMonth(row.month),
      totalCarbonKgCo2e: row.totalCarbonKgCo2e,
      wasteDivertedKg: row.wasteDivertedKg,
      score: row.averageSustainabilityScore,
      carbonHeightPercent: max > 0 ? Number(((row.totalCarbonKgCo2e / max) * 100).toFixed(2)) : 0
    }));
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

  paceStatusClass(status: string): 'over' | 'under' | 'neutral' {
    const normalized = status.toLowerCase();
    if (normalized === 'ahead') {
      return 'over';
    }

    if (normalized === 'behind') {
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

  private scheduleForecastTrendRender(): void {
    setTimeout(() => this.renderRevenueForecastTrendChart());
  }

  private renderRevenueForecastTrendChart(): void {
    this.forecastTrendChart?.destroy();
    this.forecastTrendChart = null;

    if (this.revenueForecastRows.length === 0) {
      return;
    }

    const canvas = this.forecastTrendCanvas?.nativeElement;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const labels = this.revenueForecastRows.map((row) => this.formatMonth(row.month));
    const confirmed = this.revenueForecastRows.map((row) => row.confirmedRevenue);
    const predicted = this.revenueForecastRows.map((row) => row.predictedRevenue);
    const budget = this.revenueForecastRows.map((row) => row.budgetTarget);
    const showBudget = budget.some((value) => value > 0);
    const currencyCode = this.revenueForecastRows[0]?.currencyCode ?? 'GBP';
    const formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0
    });

    this.forecastTrendChart = new ChartJs(context, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Confirmed Revenue',
            data: confirmed,
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22, 163, 74, 0.12)',
            pointBackgroundColor: '#16a34a',
            borderWidth: 2,
            pointRadius: 3,
            tension: 0.28,
            fill: true
          },
          {
            label: 'Predicted Revenue',
            data: predicted,
            borderColor: '#7c3aed',
            pointBackgroundColor: '#7c3aed',
            borderWidth: 2,
            pointRadius: 3,
            tension: 0.22,
            fill: false
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
              label: (context: any) =>
                `${context?.dataset?.label ?? 'Value'}: ${formatter.format(context?.parsed?.y ?? 0)}`
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

  private destroyCharts(): void {
    this.forecastTrendChart?.destroy();
    this.forecastTrendChart = null;
  }

  private clearReportData(): void {
    this.salesPerformanceReport = null;
    this.pipelineConversionReport = null;
    this.revenueForecastReport = null;
    this.sourceAnalysisReport = null;
    this.lostReasonReport = null;
    this.sustainabilityReport = null;
    this.paceReport = null;
    this.isLoading = false;
    this.destroyCharts();
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
