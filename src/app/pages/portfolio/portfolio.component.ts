import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';
import {
  ApiService,
  PortfolioRoutingVenueOptionDto,
  PortfolioReportResponse,
  PortfolioSharedAvailabilityResponse,
  PortfolioVenueMetricsDto,
  PortfolioVenueReportDto,
  VenueSummaryDto
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

type ReportDatePreset = 'this-month' | 'last-30d' | 'last-90d' | 'this-year' | 'custom';

interface VenueMetricBar {
  venueId: string;
  venueName: string;
  value: number;
  widthPercent: number;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [FormsModule, DecimalPipe, DatePipe, NgClass],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly reportOptions = [
    { key: 'sales-performance', label: 'Sales Performance' },
    { key: 'pipeline-conversion', label: 'Pipeline Conversion' },
    { key: 'revenue-forecast', label: 'Revenue Forecast' },
    { key: 'source-analysis', label: 'Source Analysis' },
    { key: 'lost-reason-analysis', label: 'Lost Reason Analysis' }
  ];

  readonly eventTypeOptions = [
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

  selectedVenueFilterId = 'all';
  selectedReportKey = 'sales-performance';
  selectedReportPreset: ReportDatePreset = 'this-month';
  reportFrom = '';
  reportTo = '';
  reportEventType = 'all';

  loadingDashboard = false;
  loadingReport = false;
  loadingVenues = false;
  dashboardError = '';
  reportError = '';
  cascadeError = '';
  cascadeSuccess = '';

  dashboardData: {
    generatedAtUtc: string;
    aggregate: {
      totalActiveEnquiries: number;
      totalConfirmedEvents: number;
      totalPipelineValue: number;
      totalMonthlyRevenue: number;
      currencyCode: string;
    };
    venues: PortfolioVenueMetricsDto[];
  } | null = null;

  groupReport: PortfolioReportResponse | null = null;
  venueOptions: VenueSummaryDto[] = [];
  sharedAvailabilityDate = this.toInputDate(new Date());
  sharedAvailabilityGuests = 80;
  sharedAvailabilitySourceVenueId = 'all';
  sharedAvailabilityLoading = false;
  sharedAvailabilityError = '';
  sharedAvailabilityData: PortfolioSharedAvailabilityResponse | null = null;

  cascadeSourceVenueId = '';
  cascadeTargetVenueIds = new Set<string>();
  cascadeIncludeVenueProfileBranding = true;
  cascadeIncludePaymentSchedules = true;
  cascadeIncludeTermsDocuments = true;
  cascadeIncludeProposalTemplates = true;
  cascadeIncludeProposalPdfSettings = true;
  cascadeIncludePlanningMilestones = true;
  cascadeIncludeReportConfiguration = true;
  cascadeApplying = false;

  get currencyCode(): string {
    return this.dashboardData?.aggregate.currencyCode ?? 'GBP';
  }

  get canApplyCascade(): boolean {
    return (
      !this.cascadeApplying
      && !!this.cascadeSourceVenueId
      && this.targetVenueOptions.length > 0
      && (
        this.cascadeIncludeVenueProfileBranding
        || this.cascadeIncludePaymentSchedules
        || this.cascadeIncludeTermsDocuments
        || this.cascadeIncludeProposalTemplates
        || this.cascadeIncludeProposalPdfSettings
        || this.cascadeIncludePlanningMilestones
        || this.cascadeIncludeReportConfiguration
      )
    );
  }

  get targetVenueOptions(): VenueSummaryDto[] {
    return this.venueOptions.filter((venue) => venue.id !== this.cascadeSourceVenueId);
  }

  get dashboardComparisonBars(): VenueMetricBar[] {
    const venues = this.dashboardData?.venues ?? [];
    const maxValue = Math.max(...venues.map((venue) => venue.pipelineValue), 0);
    return venues
      .map((venue) => ({
        venueId: venue.venueId,
        venueName: venue.venueName,
        value: venue.pipelineValue,
        widthPercent: maxValue <= 0 ? 0 : Math.max(6, (venue.pipelineValue / maxValue) * 100)
      }))
      .sort((left, right) => right.value - left.value);
  }

  get reportComparisonBars(): VenueMetricBar[] {
    const venues = this.groupReport?.venues ?? [];
    const computed = venues.map((venue) => ({
      venueId: venue.venueId,
      venueName: venue.venueName,
      value: this.extractComparisonMetric(venue)
    }));
    const maxValue = Math.max(...computed.map((item) => item.value), 0);
    return computed
      .map((item) => ({
        ...item,
        widthPercent: maxValue <= 0 ? 0 : Math.max(6, (item.value / maxValue) * 100)
      }))
      .sort((left, right) => right.value - left.value);
  }

  ngOnInit(): void {
    this.applyReportPreset('this-month', false);
    this.auth.session$
      .pipe(
        map((session) => session?.venueId ?? null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.loadVenues();
        this.loadDashboard();
        this.loadGroupReport();
        this.loadSharedAvailability();
      });
  }

  loadDashboard(): void {
    this.loadingDashboard = true;
    this.dashboardError = '';
    this.api
      .getPortfolioDashboard(this.selectedVenueFilterId === 'all' ? undefined : this.selectedVenueFilterId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.dashboardData = response;
          this.loadingDashboard = false;
        },
        error: () => {
          this.loadingDashboard = false;
          this.dashboardData = null;
          this.dashboardError = 'Unable to load portfolio metrics.';
        }
      });
  }

  loadGroupReport(): void {
    this.loadingReport = true;
    this.reportError = '';
    this.api
      .getPortfolioReport(this.selectedReportKey, {
        from: this.reportFrom || undefined,
        to: this.reportTo || undefined,
        eventType: this.reportEventType === 'all' ? undefined : this.reportEventType
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.groupReport = response;
          this.loadingReport = false;
        },
        error: () => {
          this.groupReport = null;
          this.loadingReport = false;
          this.reportError = 'Unable to load portfolio report.';
        }
      });
  }

  loadVenues(): void {
    this.loadingVenues = true;
    this.api
      .getVenues()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (venues) => {
          this.loadingVenues = false;
          this.venueOptions = [...venues].sort((left, right) => left.name.localeCompare(right.name));

          if (!this.cascadeSourceVenueId || !this.venueOptions.some((venue) => venue.id === this.cascadeSourceVenueId)) {
            const preferredVenueId = this.auth.selectedVenueId ?? this.venueOptions[0]?.id ?? '';
            this.cascadeSourceVenueId = preferredVenueId;
            this.resetCascadeTargetsToAll();
          } else if (this.cascadeTargetVenueIds.size === 0) {
            this.resetCascadeTargetsToAll();
          }

          if (
            this.sharedAvailabilitySourceVenueId !== 'all'
            && !this.venueOptions.some((venue) => venue.id === this.sharedAvailabilitySourceVenueId)
          ) {
            this.sharedAvailabilitySourceVenueId = 'all';
          }
        },
        error: () => {
          this.loadingVenues = false;
          this.venueOptions = [];
          this.cascadeSourceVenueId = '';
          this.cascadeTargetVenueIds.clear();
          this.sharedAvailabilitySourceVenueId = 'all';
        }
      });
  }

  onDashboardVenueFilterChange(): void {
    this.loadDashboard();
  }

  applyReportPreset(preset: ReportDatePreset, reload = true): void {
    this.selectedReportPreset = preset;
    const today = new Date();
    if (preset === 'custom') {
      if (reload) {
        this.loadGroupReport();
      }
      return;
    }

    if (preset === 'this-month') {
      this.reportFrom = this.toInputDate(new Date(today.getFullYear(), today.getMonth(), 1));
      this.reportTo = this.toInputDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
    } else if (preset === 'last-30d') {
      const start = new Date(today);
      start.setDate(today.getDate() - 29);
      this.reportFrom = this.toInputDate(start);
      this.reportTo = this.toInputDate(today);
    } else if (preset === 'last-90d') {
      const start = new Date(today);
      start.setDate(today.getDate() - 89);
      this.reportFrom = this.toInputDate(start);
      this.reportTo = this.toInputDate(today);
    } else {
      this.reportFrom = `${today.getFullYear()}-01-01`;
      this.reportTo = `${today.getFullYear()}-12-31`;
    }

    if (reload) {
      this.loadGroupReport();
    }
  }

  onReportFilterChanged(): void {
    if (this.selectedReportPreset !== 'custom') {
      this.selectedReportPreset = 'custom';
    }
  }

  onSharedAvailabilityFilterChanged(): void {
    this.loadSharedAvailability();
  }

  switchToVenue(venueId: string): void {
    this.auth.setSelectedVenue(venueId);
    this.router.navigateByUrl('/');
  }

  openVenueReports(venueId: string): void {
    this.auth.setSelectedVenue(venueId);
    this.router.navigateByUrl('/reports');
  }

  openVenueEnquiries(venueId: string): void {
    this.auth.setSelectedVenue(venueId);
    this.router.navigate(['/enquiries'], { queryParams: { statusTab: 'all' } });
  }

  onCascadeSourceVenueChange(): void {
    this.resetCascadeTargetsToAll();
  }

  isCascadeTargetSelected(venueId: string): boolean {
    return this.cascadeTargetVenueIds.has(venueId);
  }

  setCascadeTargetSelection(venueId: string, selected: boolean): void {
    const next = new Set(this.cascadeTargetVenueIds);
    if (selected) {
      next.add(venueId);
    } else {
      next.delete(venueId);
    }
    this.cascadeTargetVenueIds = next;
  }

  selectAllCascadeTargets(): void {
    this.resetCascadeTargetsToAll();
  }

  clearCascadeTargets(): void {
    this.cascadeTargetVenueIds = new Set<string>();
  }

  applyCascade(): void {
    if (!this.canApplyCascade) {
      return;
    }

    this.cascadeApplying = true;
    this.cascadeSuccess = '';
    this.cascadeError = '';

    const targetVenueIds = this.cascadeTargetVenueIds.size > 0
      ? [...this.cascadeTargetVenueIds]
      : this.targetVenueOptions.map((venue) => venue.id);

    this.api
      .cascadeGroupSettings({
        sourceVenueId: this.cascadeSourceVenueId,
        targetVenueIds,
        includeVenueProfileBranding: this.cascadeIncludeVenueProfileBranding,
        includePaymentSchedules: this.cascadeIncludePaymentSchedules,
        includeTermsDocuments: this.cascadeIncludeTermsDocuments,
        includeProposalTemplates: this.cascadeIncludeProposalTemplates,
        includeProposalPdfSettings: this.cascadeIncludeProposalPdfSettings,
        includePlanningMilestones: this.cascadeIncludePlanningMilestones,
        includeReportConfiguration: this.cascadeIncludeReportConfiguration
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.cascadeApplying = false;
          this.cascadeSuccess = `Applied settings to ${response.targetVenueIds.length} venue(s).`;
          this.cascadeError = '';
        },
        error: (error) => {
          this.cascadeApplying = false;
          this.cascadeError = typeof error?.error === 'string' ? error.error : 'Unable to cascade settings.';
          this.cascadeSuccess = '';
        }
      });
  }

  reportCellValue(row: Record<string, unknown>, column: string): string {
    const raw = row[column];
    if (raw === null || raw === undefined) {
      return '—';
    }

    if (typeof raw === 'number') {
      return Number.isInteger(raw) ? raw.toString() : raw.toFixed(2);
    }

    return String(raw);
  }

  trackVenueMetric(_: number, item: PortfolioVenueMetricsDto): string {
    return item.venueId;
  }

  trackVenueReport(_: number, item: PortfolioVenueReportDto): string {
    return item.venueId;
  }

  trackSharedAvailabilityVenue(_: number, item: PortfolioRoutingVenueOptionDto): string {
    return item.venueId;
  }

  loadSharedAvailability(): void {
    if (!this.sharedAvailabilityDate) {
      this.sharedAvailabilityData = null;
      this.sharedAvailabilityError = 'Choose a date to inspect shared availability.';
      return;
    }

    this.sharedAvailabilityLoading = true;
    this.sharedAvailabilityError = '';
    this.api
      .getPortfolioSharedAvailability({
        date: this.sharedAvailabilityDate,
        guestsExpected: Math.max(1, Math.round(this.sharedAvailabilityGuests || 1)),
        sourceVenueId: this.sharedAvailabilitySourceVenueId === 'all' ? undefined : this.sharedAvailabilitySourceVenueId
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.sharedAvailabilityLoading = false;
          this.sharedAvailabilityData = response;
        },
        error: (error) => {
          this.sharedAvailabilityLoading = false;
          this.sharedAvailabilityData = null;
          this.sharedAvailabilityError = typeof error?.error === 'string'
            ? error.error
            : 'Unable to load shared availability right now.';
        }
      });
  }

  private resetCascadeTargetsToAll(): void {
    const next = new Set<string>();
    this.targetVenueOptions.forEach((venue) => next.add(venue.id));
    this.cascadeTargetVenueIds = next;
  }

  private extractComparisonMetric(venueReport: PortfolioVenueReportDto): number {
    if (!venueReport.report?.rows) {
      return 0;
    }

    if (this.selectedReportKey === 'sales-performance') {
      return this.sumNumberColumn(venueReport.report.rows, 'totalRevenue');
    }

    if (this.selectedReportKey === 'revenue-forecast') {
      return this.sumNumberColumn(venueReport.report.rows, 'totalOnBooks');
    }

    if (this.selectedReportKey === 'pipeline-conversion') {
      const confirmedRow = venueReport.report.rows.find((row) => String(row['stage'] ?? '').toLowerCase() === 'confirmed');
      return confirmedRow ? this.toNumber(confirmedRow['count']) : 0;
    }

    if (this.selectedReportKey === 'source-analysis') {
      return this.sumNumberColumn(venueReport.report.rows, 'count');
    }

    if (this.selectedReportKey === 'lost-reason-analysis') {
      return this.sumNumberColumn(venueReport.report.rows, 'count');
    }

    return 0;
  }

  private sumNumberColumn(rows: Record<string, unknown>[], key: string): number {
    return rows.reduce((sum, row) => sum + this.toNumber(row[key]), 0);
  }

  private toNumber(value: unknown): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  private toInputDate(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
