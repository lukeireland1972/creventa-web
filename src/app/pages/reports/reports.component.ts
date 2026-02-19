import { Component, DestroyRef, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, forkJoin, map, of } from 'rxjs';
import { Chart as ChartJs, registerables } from 'chart.js';
import { ApiService, ReportFilterParams, ReportResponse, ReportScheduleDto } from '../../services/api.service';
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

interface RevenueBySpaceRow {
  spaceId: string;
  spaceName: string;
  bookingCount: number;
  totalRevenue: number;
  averageBookingValue: number;
  bookedDays: number;
  availableDays: number;
  utilisationRatePercent: number;
  currencyCode: string;
}

interface RevenueByEventTypeRow {
  eventType: string;
  count: number;
  totalRevenue: number;
  averageValue: number;
  averageCovers: number;
  revenueSharePercent: number;
  compareCount: number;
  compareTotalRevenue: number;
  compareAverageValue: number;
  compareAverageCovers: number;
  revenueDelta: number;
  revenueDeltaPercent: number | null;
  currencyCode: string;
}

interface SalesTeamPerformanceRow {
  rank: number;
  eventManagerName: string;
  enquiriesAssigned: number;
  proposalsSent: number;
  conversionRatePercent: number;
  confirmedRevenue: number;
  averageResponseHours: number;
  tasksCompleted: number;
  appointmentsHeld: number;
  trend: number[];
  currencyCode: string;
}

interface ForecastRow {
  month: string;
  confirmedValue: number;
  weightedPipelineValue: number;
  totalForecast: number;
  budgetTarget: number;
  variance: number;
  paceStatus: string;
  currencyCode: string;
}

interface BudgetPaceByEventTypeRow {
  rowType: 'month' | 'summary';
  eventType: string;
  month: string;
  bookingCountThisYear: number;
  bookingCountLy: number;
  revenueThisYear: number;
  revenueLy: number;
  budgetRevenue: number;
  aspThisYear: number;
  aspLy: number;
  averageCoversThisYear: number;
  averageCoversLy: number;
  currencyCode: string;
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
  private readonly router = inject(Router);
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
  private readonly eventTypePalette = ['#1d4ed8', '#2563eb', '#7c3aed', '#0ea5e9', '#14b8a6', '#22c55e', '#f59e0b', '#f97316', '#ec4899'];

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
  readonly reportScheduleFrequencyOptions: Array<'daily' | 'weekly' | 'monthly'> = ['daily', 'weekly', 'monthly'];
  readonly reportScheduleFormatOptions: Array<'csv' | 'pdf' | 'both'> = ['csv', 'pdf', 'both'];
  readonly reportScheduleDayOptions = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 0, label: 'Sunday' }
  ];
  readonly reportTitles: Record<string, string> = {
    'sales-performance': 'Sales Performance',
    'pipeline-conversion': 'Pipeline Conversion',
    'revenue-space': 'Revenue by Space',
    'revenue-event-type': 'Revenue by Event Type',
    'sales-team-performance': 'Sales Team Performance',
    forecast: 'Forecast (Weighted Pipeline)',
    'budget-pace-event-type': 'Budget / Pace by Event Type',
    'revenue-forecast': 'Revenue Forecast vs Budget',
    pace: 'Pace Report',
    sustainability: 'Sustainability',
    'source-analysis': 'Source Analysis',
    'lost-reason-analysis': 'Lost Reason Analysis'
  };

  venueId: string | null = null;

  isLoading = false;
  errorMessage = '';
  exportState: string | null = null;
  reportSchedules: ReportScheduleDto[] = [];
  scheduleDialogOpen = false;
  scheduleDialogError = '';
  scheduleDialogSuccess = '';
  scheduleDialogSaving = false;
  scheduleDialogReportKey: string | null = null;
  scheduleDialogScheduleId: string | null = null;
  scheduleFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly';
  scheduleDayOfWeek = 1;
  scheduleDayOfMonth: number | null = null;
  scheduleTimeOfDay = '09:00';
  scheduleFormat: 'csv' | 'pdf' | 'both' = 'both';
  scheduleIsActive = true;
  scheduleRecipientDraft = '';
  scheduleRecipients: string[] = [];

  selectedPreset: DatePreset = 'this-month';
  fromDate = '';
  toDate = '';
  compareEnabled = false;
  compareFromDate = '';
  compareToDate = '';
  eventType = 'all';

  salesPerformanceReport: ReportResponse | null = null;
  pipelineConversionReport: ReportResponse | null = null;
  revenueForecastReport: ReportResponse | null = null;
  sourceAnalysisReport: ReportResponse | null = null;
  lostReasonReport: ReportResponse | null = null;
  sustainabilityReport: ReportResponse | null = null;
  paceReport: ReportResponse | null = null;
  revenueBySpaceReport: ReportResponse | null = null;
  revenueByEventTypeReport: ReportResponse | null = null;
  salesTeamPerformanceReport: ReportResponse | null = null;
  weightedForecastReport: ReportResponse | null = null;
  budgetPaceByEventTypeReport: ReportResponse | null = null;
  private forecastTrendChart: ChartJsInstance | null = null;
  private weightedForecastChart: ChartJsInstance | null = null;

  @ViewChild('forecastTrendCanvas')
  private forecastTrendCanvas?: ElementRef<HTMLCanvasElement>;

  @ViewChild('weightedForecastCanvas')
  private weightedForecastCanvas?: ElementRef<HTMLCanvasElement>;

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

  onCompareToggle(): void {
    if (this.compareEnabled && (!this.compareFromDate || !this.compareToDate)) {
      this.assignDefaultComparisonRange();
    }
  }

  loadReports(): void {
    if (!this.venueId) {
      this.errorMessage = 'Select a venue to load reports.';
      return;
    }
    const venueId = this.venueId;

    this.isLoading = true;
    this.errorMessage = '';

    const filters = this.buildFilterParams();

    forkJoin({
      sales: this.api.getSalesPerformanceReport(filters).pipe(catchError(() => of(this.emptyReport('sales-performance', 'Sales Performance')))),
      pipeline: this.api.getPipelineConversionReport(filters).pipe(catchError(() => of(this.emptyReport('pipeline-conversion', 'Pipeline Conversion')))),
      forecast: this.api.getRevenueForecastReport(filters).pipe(catchError(() => of(this.emptyReport('revenue-forecast', 'Revenue Forecast')))),
      revenueBySpace: this.api.getRevenueBySpaceReport(filters).pipe(catchError(() => of(this.emptyReport('revenue-space', 'Revenue by Space')))),
      revenueByEventType: this.api.getRevenueByEventTypeReport(filters).pipe(catchError(() => of(this.emptyReport('revenue-event-type', 'Revenue by Event Type')))),
      salesTeam: this.api.getSalesTeamPerformanceReport(filters).pipe(catchError(() => of(this.emptyReport('sales-team-performance', 'Sales Team Performance')))),
      weightedForecast: this.api.getForecastReport(filters).pipe(catchError(() => of(this.emptyReport('forecast', 'Forecast')))),
      budgetPaceByEventType: this.api.getBudgetPaceByEventTypeReport(filters).pipe(catchError(() => of(this.emptyReport('budget-pace-event-type', 'Budget / Pace by Event Type')))),
      source: this.api.getSourceAnalysisReport(filters).pipe(catchError(() => of(this.emptyReport('source-analysis', 'Source Analysis')))),
      lost: this.api.getLostReasonAnalysisReport(filters).pipe(catchError(() => of(this.emptyReport('lost-reason-analysis', 'Lost Reason Analysis')))),
      sustainability: this.api.getSustainabilityReport(filters).pipe(catchError(() => of(this.emptyReport('sustainability', 'Sustainability')))),
      pace: this.api.getReport('pace', filters).pipe(catchError(() => of(this.emptyReport('pace', 'Pace Report')))),
      schedules: this.api.getReportSchedules(venueId).pipe(catchError(() => of({ items: [] as ReportScheduleDto[] })))
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.salesPerformanceReport = result.sales;
          this.pipelineConversionReport = result.pipeline;
          this.revenueForecastReport = result.forecast;
          this.revenueBySpaceReport = result.revenueBySpace;
          this.revenueByEventTypeReport = result.revenueByEventType;
          this.salesTeamPerformanceReport = result.salesTeam;
          this.weightedForecastReport = result.weightedForecast;
          this.budgetPaceByEventTypeReport = result.budgetPaceByEventType;
          this.sourceAnalysisReport = result.source;
          this.lostReasonReport = result.lost;
          this.sustainabilityReport = result.sustainability;
          this.paceReport = result.pace;
          this.reportSchedules = result.schedules.items
            .slice()
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          this.isLoading = false;
          this.scheduleChartRenders();
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
        compareFrom: this.compareEnabled ? this.compareFromDate || undefined : undefined,
        compareTo: this.compareEnabled ? this.compareToDate || undefined : undefined,
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

  openScheduleDialog(reportKey: string): void {
    if (!this.venueId) {
      return;
    }

    this.scheduleDialogOpen = true;
    this.scheduleDialogError = '';
    this.scheduleDialogSuccess = '';
    this.scheduleDialogReportKey = reportKey;

    const existing = this.findScheduleForReport(reportKey);
    this.scheduleDialogScheduleId = existing?.id ?? null;
    this.scheduleFrequency = (existing?.frequency?.toLowerCase() as 'daily' | 'weekly' | 'monthly') ?? 'weekly';
    this.scheduleDayOfWeek = existing?.dayOfWeek ?? 1;
    this.scheduleDayOfMonth = existing?.dayOfMonth ?? null;
    this.scheduleTimeOfDay = existing?.timeOfDay ?? '09:00';
    this.scheduleFormat = existing?.format ?? 'both';
    this.scheduleIsActive = existing?.isActive ?? true;
    this.scheduleRecipients = existing?.recipients?.slice() ?? [];
    this.scheduleRecipientDraft = '';
  }

  closeScheduleDialog(): void {
    this.scheduleDialogOpen = false;
    this.scheduleDialogError = '';
    this.scheduleDialogSuccess = '';
    this.scheduleDialogSaving = false;
    this.scheduleDialogReportKey = null;
    this.scheduleDialogScheduleId = null;
    this.scheduleFrequency = 'weekly';
    this.scheduleDayOfWeek = 1;
    this.scheduleDayOfMonth = null;
    this.scheduleTimeOfDay = '09:00';
    this.scheduleFormat = 'both';
    this.scheduleIsActive = true;
    this.scheduleRecipientDraft = '';
    this.scheduleRecipients = [];
  }

  addScheduleRecipientFromDraft(): void {
    const email = this.normalizeEmail(this.scheduleRecipientDraft);
    if (!email) {
      this.scheduleRecipientDraft = '';
      return;
    }

    if (!this.scheduleRecipients.some((value) => value.toLowerCase() === email.toLowerCase())) {
      this.scheduleRecipients = [...this.scheduleRecipients, email];
    }

    this.scheduleRecipientDraft = '';
  }

  onScheduleRecipientKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addScheduleRecipientFromDraft();
    }
  }

  removeScheduleRecipient(email: string): void {
    this.scheduleRecipients = this.scheduleRecipients.filter((value) => value.toLowerCase() !== email.toLowerCase());
  }

  saveSchedule(): void {
    if (!this.venueId || !this.scheduleDialogReportKey) {
      return;
    }
    const venueId = this.venueId;

    this.addScheduleRecipientFromDraft();

    if (this.scheduleRecipients.length === 0) {
      this.scheduleDialogError = 'Add at least one valid recipient email.';
      return;
    }

    if (this.scheduleFrequency === 'monthly' && (!this.scheduleDayOfMonth || this.scheduleDayOfMonth < 1 || this.scheduleDayOfMonth > 31)) {
      this.scheduleDialogError = 'Select a valid day of month (1-31).';
      return;
    }

    this.scheduleDialogSaving = true;
    this.scheduleDialogError = '';
    this.scheduleDialogSuccess = '';

    const reportTitle = this.getReportTitle(this.scheduleDialogReportKey);
    const eventTypeFilter = this.eventType === 'all' ? undefined : this.eventType;
    const scheduleName = `${reportTitle} ${this.scheduleFrequency === 'daily' ? 'Daily' : this.scheduleFrequency === 'monthly' ? 'Monthly' : 'Weekly'} Delivery`;
    const payload = {
      name: scheduleName,
      reportKeys: [this.scheduleDialogReportKey],
      frequency: this.scheduleFrequency,
      dayOfWeek: this.scheduleFrequency === 'weekly' ? this.scheduleDayOfWeek : undefined,
      dayOfMonth: this.scheduleFrequency === 'monthly' ? this.scheduleDayOfMonth ?? undefined : undefined,
      timeOfDay: this.scheduleTimeOfDay,
      format: this.scheduleFormat,
      recipients: this.scheduleRecipients,
      isActive: this.scheduleIsActive,
      eventType: eventTypeFilter,
      fromDate: this.fromDate || undefined,
      toDate: this.toDate || undefined
    };

    this.api
      .upsertReportSchedule(venueId, payload, this.scheduleDialogScheduleId ?? undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (schedule) => {
          const withoutCurrent = this.reportSchedules.filter((item) => item.id !== schedule.id);
          this.reportSchedules = [...withoutCurrent, schedule].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          this.scheduleDialogSaving = false;
          this.scheduleDialogSuccess = 'Schedule saved.';
          setTimeout(() => this.closeScheduleDialog(), 450);
        },
        error: () => {
          this.scheduleDialogSaving = false;
          this.scheduleDialogError = 'Unable to save schedule. Please try again.';
        }
      });
  }

  getActiveScheduleCount(reportKey: string): number {
    return this.reportSchedules.filter((schedule) => schedule.isActive && schedule.reportKeys.some((key) => key === reportKey)).length;
  }

  getScheduleBadge(reportKey: string): string {
    const count = this.getActiveScheduleCount(reportKey);
    return `${count} scheduled`;
  }

  getReportTitle(reportKey: string): string {
    return this.reportTitles[reportKey] ?? reportKey;
  }

  getScheduleFilterSummary(): string {
    const dateSummary = this.fromDate && this.toDate ? `${this.fromDate} → ${this.toDate}` : this.selectedPreset.replace('-', ' ');
    const eventTypeSummary = this.eventType === 'all' ? 'All event types' : this.eventType;
    return `Filters: ${dateSummary} · ${eventTypeSummary}`;
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

  get revenueBySpaceRows(): RevenueBySpaceRow[] {
    if (!this.revenueBySpaceReport) {
      return [];
    }

    return this.revenueBySpaceReport.rows
      .map((row) => ({
        spaceId: this.getString(row, 'spaceId'),
        spaceName: this.getString(row, 'spaceName'),
        bookingCount: this.getNumber(row, 'bookingCount'),
        totalRevenue: this.getNumber(row, 'totalRevenue'),
        averageBookingValue: this.getNumber(row, 'averageBookingValue'),
        bookedDays: this.getNumber(row, 'bookedDays'),
        availableDays: this.getNumber(row, 'availableDays'),
        utilisationRatePercent: this.getNumber(row, 'utilisationRatePercent'),
        currencyCode: this.getString(row, 'currencyCode') || 'GBP'
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  get revenueBySpaceRevenueMax(): number {
    return Math.max(...this.revenueBySpaceRows.map((row) => row.totalRevenue), 0);
  }

  get revenueBySpaceBarPoints(): SalesBarPoint[] {
    const max = this.revenueBySpaceRevenueMax;
    return this.revenueBySpaceRows.map((row) => ({
      month: row.spaceId,
      monthLabel: row.spaceName,
      totalRevenue: row.totalRevenue,
      currencyCode: row.currencyCode,
      heightPercent: max > 0 ? Number(((row.totalRevenue / max) * 100).toFixed(2)) : 0
    }));
  }

  get revenueByEventTypeRows(): RevenueByEventTypeRow[] {
    if (!this.revenueByEventTypeReport) {
      return [];
    }

    return this.revenueByEventTypeReport.rows
      .map((row) => ({
        eventType: this.getString(row, 'eventType'),
        count: this.getNumber(row, 'count'),
        totalRevenue: this.getNumber(row, 'totalRevenue'),
        averageValue: this.getNumber(row, 'averageValue'),
        averageCovers: this.getNumber(row, 'averageCovers'),
        revenueSharePercent: this.getNumber(row, 'revenueSharePercent'),
        compareCount: this.getNumber(row, 'compareCount'),
        compareTotalRevenue: this.getNumber(row, 'compareTotalRevenue'),
        compareAverageValue: this.getNumber(row, 'compareAverageValue'),
        compareAverageCovers: this.getNumber(row, 'compareAverageCovers'),
        revenueDelta: this.getNumber(row, 'revenueDelta'),
        revenueDeltaPercent: this.getNullableNumber(row, 'revenueDeltaPercent'),
        currencyCode: this.getString(row, 'currencyCode') || 'GBP'
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  get revenueByEventTypeTotal(): number {
    return this.revenueByEventTypeRows.reduce((sum, row) => sum + row.totalRevenue, 0);
  }

  get revenueByEventTypeCurrencyCode(): string {
    return this.revenueByEventTypeRows[0]?.currencyCode ?? 'GBP';
  }

  get revenueByEventTypeDonutBackground(): string {
    const total = this.revenueByEventTypeTotal;
    if (total <= 0) {
      return '#e2e8f0';
    }

    return this.eventTypePalette[0] ?? '#94a3b8';
  }

  getEventTypeColor(index: number): string {
    return this.eventTypePalette[index % this.eventTypePalette.length];
  }

  get salesTeamRows(): SalesTeamPerformanceRow[] {
    if (!this.salesTeamPerformanceReport) {
      return [];
    }

    return this.salesTeamPerformanceReport.rows
      .map((row) => ({
        rank: this.getNumber(row, 'rank'),
        eventManagerName: this.getString(row, 'eventManagerName'),
        enquiriesAssigned: this.getNumber(row, 'enquiriesAssigned'),
        proposalsSent: this.getNumber(row, 'proposalsSent'),
        conversionRatePercent: this.getNumber(row, 'conversionRatePercent'),
        confirmedRevenue: this.getNumber(row, 'confirmedRevenue'),
        averageResponseHours: this.getNumber(row, 'averageResponseHours'),
        tasksCompleted: this.getNumber(row, 'tasksCompleted'),
        appointmentsHeld: this.getNumber(row, 'appointmentsHeld'),
        trend: this.getNumberArray(row, 'trend'),
        currencyCode: this.getString(row, 'currencyCode') || 'GBP'
      }))
      .sort((a, b) => a.rank - b.rank);
  }

  get salesTeamTrendMax(): number {
    return Math.max(0, ...this.salesTeamRows.flatMap((row) => row.trend));
  }

  get weightedForecastRows(): ForecastRow[] {
    if (!this.weightedForecastReport) {
      return [];
    }

    return this.weightedForecastReport.rows
      .map((row) => ({
        month: this.getString(row, 'month'),
        confirmedValue: this.getNumber(row, 'confirmedValue'),
        weightedPipelineValue: this.getNumber(row, 'weightedPipelineValue'),
        totalForecast: this.getNumber(row, 'totalForecast'),
        budgetTarget: this.getNumber(row, 'budgetTarget'),
        variance: this.getNumber(row, 'variance'),
        paceStatus: this.getString(row, 'paceStatus') || 'n/a',
        currencyCode: this.getString(row, 'currencyCode') || 'GBP'
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  get budgetPaceByEventTypeRows(): BudgetPaceByEventTypeRow[] {
    if (!this.budgetPaceByEventTypeReport) {
      return [];
    }

    return this.budgetPaceByEventTypeReport.rows
      .map((row) => {
        const rowType: BudgetPaceByEventTypeRow['rowType'] = this.getString(row, 'rowType') === 'summary' ? 'summary' : 'month';
        return {
          rowType,
          eventType: this.getString(row, 'eventType'),
          month: this.getString(row, 'month'),
          bookingCountThisYear: this.getNumber(row, 'bookingCountThisYear'),
          bookingCountLy: this.getNumber(row, 'bookingCountLy'),
          revenueThisYear: this.getNumber(row, 'revenueThisYear'),
          revenueLy: this.getNumber(row, 'revenueLy'),
          budgetRevenue: this.getNumber(row, 'budgetRevenue'),
          aspThisYear: this.getNumber(row, 'aspThisYear'),
          aspLy: this.getNumber(row, 'aspLy'),
          averageCoversThisYear: this.getNumber(row, 'averageCoversThisYear'),
          averageCoversLy: this.getNumber(row, 'averageCoversLy'),
          currencyCode: this.getString(row, 'currencyCode') || 'GBP'
        };
      })
      .sort((a, b) => {
        if (a.rowType !== b.rowType) {
          return a.rowType === 'month' ? -1 : 1;
        }

        const byType = a.eventType.localeCompare(b.eventType);
        if (byType !== 0) {
          return byType;
        }

        if (a.rowType === 'summary') {
          return 0;
        }

        return a.month.localeCompare(b.month);
      });
  }

  formatNullablePercent(value: number | null): string {
    if (value === null || !Number.isFinite(value)) {
      return 'N/A';
    }

    return this.formatPercent(value);
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
      return '#e2e8f0';
    }

    return data[0]?.color ?? '#94a3b8';
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

  drillIntoBudgetPaceRow(row: BudgetPaceByEventTypeRow): void {
    if (row.rowType !== 'month' || !/^\d{4}-\d{2}$/.test(row.month)) {
      return;
    }

    const [year, month] = row.month.split('-').map((value) => Number(value));
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    this.router.navigate(['/enquiries'], {
      queryParams: {
        eventType: row.eventType,
        from: this.toInputDate(start),
        to: this.toInputDate(end)
      }
    });
  }

  sparklineHeight(value: number): number {
    if (value <= 0 || this.salesTeamTrendMax <= 0) {
      return 10;
    }

    const scaled = (value / this.salesTeamTrendMax) * 100;
    return Math.max(10, Number(scaled.toFixed(2)));
  }

  sparklineLabel(row: SalesTeamPerformanceRow): string {
    if (row.trend.length === 0) {
      return 'No trend data';
    }

    return row.trend.map((value) => this.formatCurrency(value, row.currencyCode)).join(', ');
  }

  private findScheduleForReport(reportKey: string): ReportScheduleDto | null {
    const matches = this.reportSchedules.filter((schedule) => schedule.reportKeys.some((key) => key === reportKey));
    if (matches.length === 0) {
      return null;
    }

    const active = matches.find((schedule) => schedule.isActive);
    return active ?? matches[0];
  }

  private normalizeEmail(value: string | null | undefined): string | null {
    const candidate = (value ?? '').trim();
    if (!candidate) {
      return null;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(candidate) ? candidate : null;
  }

  private buildFilterParams(): ReportFilterParams {
    const includeComparison = this.compareEnabled && !!this.compareFromDate && !!this.compareToDate;
    return {
      venueId: this.venueId!,
      from: this.fromDate || undefined,
      to: this.toDate || undefined,
      compareFrom: includeComparison ? this.compareFromDate : undefined,
      compareTo: includeComparison ? this.compareToDate : undefined,
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

  private assignDefaultComparisonRange(): void {
    if (!this.fromDate || !this.toDate) {
      return;
    }

    const from = new Date(`${this.fromDate}T00:00:00Z`);
    const to = new Date(`${this.toDate}T00:00:00Z`);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) {
      return;
    }

    const durationMs = to.getTime() - from.getTime();
    const compareTo = new Date(from.getTime() - 24 * 60 * 60 * 1000);
    const compareFrom = new Date(compareTo.getTime() - durationMs);
    this.compareFromDate = this.toInputDate(compareFrom);
    this.compareToDate = this.toInputDate(compareTo);
  }

  private scheduleChartRenders(): void {
    setTimeout(() => {
      this.renderRevenueForecastTrendChart();
      this.renderWeightedForecastChart();
    });
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

  private renderWeightedForecastChart(): void {
    this.weightedForecastChart?.destroy();
    this.weightedForecastChart = null;

    if (this.weightedForecastRows.length === 0) {
      return;
    }

    const canvas = this.weightedForecastCanvas?.nativeElement;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const labels = this.weightedForecastRows.map((row) => this.formatMonth(row.month));
    const confirmed = this.weightedForecastRows.map((row) => row.confirmedValue);
    const weighted = this.weightedForecastRows.map((row) => row.weightedPipelineValue);
    const budget = this.weightedForecastRows.map((row) => row.budgetTarget);
    const showBudget = budget.some((value) => value > 0);
    const currencyCode = this.weightedForecastRows[0]?.currencyCode ?? 'GBP';
    const formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0
    });

    this.weightedForecastChart = new ChartJs(context, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Confirmed Value',
            data: confirmed,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.32)',
            pointRadius: 2,
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            stack: 'forecast'
          },
          {
            label: 'Weighted Pipeline Value',
            data: weighted,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.3)',
            pointRadius: 2,
            borderWidth: 2,
            tension: 0.3,
            fill: '-1',
            stack: 'forecast'
          },
          ...(showBudget
            ? [
                {
                  label: 'Budget Target',
                  data: budget,
                  borderColor: '#16a34a',
                  pointBackgroundColor: '#16a34a',
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
            stacked: true,
            ticks: {
              callback: (value: number | string) => formatter.format(Number(value) || 0)
            }
          },
          x: {
            stacked: true
          }
        }
      }
    });
  }

  private destroyCharts(): void {
    this.forecastTrendChart?.destroy();
    this.forecastTrendChart = null;
    this.weightedForecastChart?.destroy();
    this.weightedForecastChart = null;
  }

  private clearReportData(): void {
    this.salesPerformanceReport = null;
    this.pipelineConversionReport = null;
    this.revenueForecastReport = null;
    this.revenueBySpaceReport = null;
    this.revenueByEventTypeReport = null;
    this.salesTeamPerformanceReport = null;
    this.weightedForecastReport = null;
    this.budgetPaceByEventTypeReport = null;
    this.sourceAnalysisReport = null;
    this.lostReasonReport = null;
    this.sustainabilityReport = null;
    this.paceReport = null;
    this.reportSchedules = [];
    this.closeScheduleDialog();
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

  private getNullableNumber(row: Record<string, unknown>, key: string): number | null {
    const value = row[key];
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
  }

  private getNumberArray(row: Record<string, unknown>, key: string): number[] {
    const value = row[key];
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => {
        if (typeof item === 'number') {
          return item;
        }
        if (typeof item === 'string' && item.length > 0) {
          const parsed = Number(item);
          return Number.isFinite(parsed) ? parsed : null;
        }
        return null;
      })
      .filter((item): item is number => item !== null);
  }
}
