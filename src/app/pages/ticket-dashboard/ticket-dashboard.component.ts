import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import {
  ApiService,
  TicketDashboardRecordDto,
  TicketDashboardVenueDto
} from '../../services/api.service';

type DatePreset = 'last-24h' | 'last-7d' | 'last-30d' | 'last-90d' | 'custom';
type DashboardMode = 'tickets' | 'deposits';
type DepositFilter = 'all' | 'due-24h' | 'overdue';

interface TicketRecord extends TicketDashboardRecordDto {
  createdAtMs: number;
  dueDateMs: number | null;
}

interface GuestRow {
  key: string;
  name: string;
  email: string | null;
  purchaseAtMs: number;
  totalTickets: number;
  averageTicketPrice: number;
  totalAmount: number;
  paidToDate: number;
  amountDue: number;
  dueDateMs: number | null;
  currency: string;
  statusLabels: string[];
}

interface EventRow {
  key: string;
  name: string;
  venueId: string;
  venueName: string;
  eventDateSortMs: number;
  guestCount: number;
  totalTickets: number;
  totalAmount: number;
  paidToDate: number;
  amountDue: number;
  currency: string;
  firstPurchaseAtMs: number;
  latestPurchaseAtMs: number;
  nextDueDateMs: number | null;
  statusLabels: string[];
  guests: GuestRow[];
}

interface MutableGuestRow {
  key: string;
  name: string;
  email: string | null;
  purchaseAtMs: number;
  totalTickets: number;
  averageTicketPrice: number;
  totalAmount: number;
  paidToDate: number;
  amountDue: number;
  dueDateMs: number | null;
  currency: string;
  statusValues: Set<string>;
}

interface SummaryCards {
  eventCount: number;
  guestCount: number;
  ticketCount: number;
  paidToDate: number;
  amountDue: number;
}

@Component({
  selector: 'app-ticket-dashboard',
  standalone: true,
  imports: [FormsModule, DatePipe, DecimalPipe],
  templateUrl: './ticket-dashboard.component.html',
  styleUrl: './ticket-dashboard.component.scss'
})
export class TicketDashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  isLoading = true;
  errorMessage = '';

  selectedPreset: DatePreset = 'custom';
  activeMode: DashboardMode = 'tickets';
  activeDepositFilter: DepositFilter = 'all';
  fromDate = '';
  toDate = '';
  searchText = '';
  selectedVenueId = 'all';
  groupByEventName = false;
  groupByEventDate = false;
  generatedAtUtc = '';
  seedMessage = '';
  seedErrorMessage = '';
  isSeedingTestData = false;

  eventRows: EventRow[] = [];
  expandedEventKeys = new Set<string>();
  summary: SummaryCards = {
    eventCount: 0,
    guestCount: 0,
    ticketCount: 0,
    paidToDate: 0,
    amountDue: 0
  };
  summaryCurrency = 'GBP';

  venueOptions: TicketDashboardVenueDto[] = [];
  private venueNameById = new Map<string, string>();
  private allRecords: TicketRecord[] = [];
  private shellSelectedVenueId: string | null = null;

  ngOnInit(): void {
    const now = new Date();
    const from = new Date(now);
    from.setFullYear(from.getFullYear() - 1);
    this.fromDate = this.toInputDate(from);
    this.toDate = this.toInputDate(now);
    this.selectedPreset = 'custom';

    this.auth.session$
      .pipe(
        map((session) => session?.venueId ?? null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((venueId) => {
        this.shellSelectedVenueId = venueId;
        if (venueId && this.venueNameById.has(venueId)) {
          this.selectedVenueId = venueId;
        }
        this.recomputeRows();
      });

    this.loadDataset();
  }

  get isTicketsMode(): boolean {
    return this.activeMode === 'tickets';
  }

  get isDepositsMode(): boolean {
    return this.activeMode === 'deposits';
  }

  selectMode(mode: DashboardMode): void {
    if (this.activeMode === mode) {
      return;
    }

    this.activeMode = mode;
    this.recomputeRows();
  }

  selectDepositFilter(filter: DepositFilter): void {
    if (this.activeDepositFilter === filter) {
      return;
    }

    this.activeDepositFilter = filter;
    this.recomputeRows();
  }

  applyPreset(preset: DatePreset, shouldRecompute = true): void {
    this.selectedPreset = preset;
    const now = new Date();

    if (preset === 'custom') {
      if (shouldRecompute) {
        this.recomputeRows();
      }
      return;
    }

    const start = new Date(now);
    switch (preset) {
      case 'last-24h':
        start.setHours(now.getHours() - 24);
        break;
      case 'last-30d':
        start.setDate(now.getDate() - 29);
        break;
      case 'last-90d':
        start.setDate(now.getDate() - 89);
        break;
      case 'last-7d':
      default:
        start.setDate(now.getDate() - 6);
        break;
    }

    this.fromDate = this.toInputDate(start);
    this.toDate = this.toInputDate(now);

    if (shouldRecompute) {
      this.recomputeRows();
    }
  }

  onManualDateChange(): void {
    this.selectedPreset = 'custom';
    this.recomputeRows();
  }

  onFilterChange(): void {
    this.recomputeRows();
  }

  onGroupByEventNameChange(value: boolean): void {
    this.groupByEventName = value;
    this.recomputeRows();
  }

  onGroupByEventDateChange(value: boolean): void {
    this.groupByEventDate = value;
    this.recomputeRows();
  }

  clearSearch(): void {
    this.searchText = '';
    this.recomputeRows();
  }

  toggleEvent(eventKey: string): void {
    if (this.expandedEventKeys.has(eventKey)) {
      this.expandedEventKeys.delete(eventKey);
      return;
    }

    this.expandedEventKeys.add(eventKey);
  }

  isExpanded(eventKey: string): boolean {
    return this.expandedEventKeys.has(eventKey);
  }

  formatCurrency(amount: number, currencyCode: string): string {
    const safeCurrency = currencyCode?.trim() || 'GBP';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: safeCurrency,
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  formatTicketFigure(tickets: number, unitPrice: number, currencyCode: string): string {
    const quantity = Number.isInteger(tickets) ? tickets.toString() : tickets.toFixed(2);
    return `${quantity} x ${this.formatCurrency(unitPrice, currencyCode)}`;
  }

  venueLabel(venueId: string): string {
    return this.venueNameById.get(venueId) ?? venueId;
  }

  get canSeedTestData(): boolean {
    return this.resolveSeedVenueId() !== null;
  }

  seedTestData(): void {
    const targetVenueId = this.resolveSeedVenueId();
    if (!targetVenueId) {
      this.seedMessage = '';
      this.seedErrorMessage = 'Select a specific venue first before adding test ticket data.';
      return;
    }

    if (this.isSeedingTestData) {
      return;
    }

    this.seedMessage = '';
    this.seedErrorMessage = '';
    this.isSeedingTestData = true;

    this.api
      .seedTicketDashboardTestData({ venueId: targetVenueId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isSeedingTestData = false;
          this.seedMessage = `Added ${response.eventsInserted} events and ${response.purchasesInserted} purchases for ${response.venueName}.`;
          this.selectedVenueId = response.venueId;
          this.loadDataset();
        },
        error: (error) => {
          this.isSeedingTestData = false;
          this.seedMessage = '';
          const serverMessage = typeof error?.error === 'string'
            ? error.error
            : typeof error?.error?.message === 'string'
              ? error.error.message
              : '';
          this.seedErrorMessage = serverMessage || 'Unable to add test ticket data right now.';
        }
      });
  }

  private resolveSeedVenueId(): string | null {
    if (this.selectedVenueId && this.selectedVenueId !== 'all') {
      return this.selectedVenueId;
    }

    if (this.shellSelectedVenueId && this.venueNameById.has(this.shellSelectedVenueId)) {
      return this.shellSelectedVenueId;
    }

    if (this.venueOptions.length === 1) {
      return this.venueOptions[0].id;
    }

    return null;
  }

  private loadDataset(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.api
      .getTicketDashboardDataset()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dataset) => {
          this.generatedAtUtc = dataset.generatedAtUtc;
          this.venueOptions = [...(dataset.venues ?? [])].sort((left, right) => left.name.localeCompare(right.name));
          this.venueNameById = new Map(this.venueOptions.map((venue) => [venue.id, venue.name]));
          this.allRecords = (dataset.records ?? [])
            .map((record) => this.normalizeRecord(record))
            .filter((record): record is TicketRecord => record !== null);

          if (this.shellSelectedVenueId && this.venueNameById.has(this.shellSelectedVenueId)) {
            this.selectedVenueId = this.shellSelectedVenueId;
          } else if (this.selectedVenueId !== 'all' && !this.venueNameById.has(this.selectedVenueId)) {
            this.selectedVenueId = 'all';
          }

          this.isLoading = false;
          this.recomputeRows();
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Unable to load ticket dashboard data from the API.';
        }
      });
  }

  private normalizeRecord(record: TicketDashboardRecordDto): TicketRecord | null {
    const createdAtMs = this.toTimestamp(record.createdUtc);
    if (createdAtMs === null) {
      return null;
    }

    const transactionStatus = this.normalizeTransactionStatus(record.status);

    return {
      ...record,
      status: transactionStatus,
      createdAtMs,
      dueDateMs: this.toTimestamp(record.dueDateUtc)
    };
  }

  private recomputeRows(): void {
    if (this.isLoading) {
      return;
    }

    const range = this.resolveDateRange();
    const nowMs = Date.now();
    const search = this.searchText.trim().toLowerCase();

    let filteredRecords = this.allRecords.filter((record) => {
      if (this.isTicketsMode && (record.createdAtMs < range.startMs || record.createdAtMs > range.endMs)) {
        return false;
      }

      if (this.selectedVenueId !== 'all' && record.venueId !== this.selectedVenueId) {
        return false;
      }

      if (!search) {
        return true;
      }

      const haystack = [
        record.eventName,
        record.guestName,
        record.guestEmail ?? '',
        record.transactionId,
        record.status,
        this.venueLabel(record.venueId)
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(search);
    });

    if (this.isDepositsMode) {
      filteredRecords = filteredRecords.filter((record) => {
        if (record.amountDue <= 0) {
          return false;
        }

        if (this.activeDepositFilter === 'overdue') {
          return record.dueDateMs !== null && record.dueDateMs < nowMs;
        }

        if (this.activeDepositFilter === 'due-24h') {
          const upperBound = nowMs + (24 * 60 * 60 * 1000);
          return record.dueDateMs !== null && record.dueDateMs >= nowMs && record.dueDateMs <= upperBound;
        }

        return true;
      });
    }

    const eventMap = new Map<string, {
      key: string;
      name: string;
      venueId: string;
      venueName: string;
      totalTickets: number;
      totalAmount: number;
      paidToDate: number;
      amountDue: number;
      currency: string;
      eventDateSortMs: number;
      firstPurchaseAtMs: number;
      latestPurchaseAtMs: number;
      nextDueDateMs: number | null;
      statusValues: Set<string>;
      guests: Map<string, MutableGuestRow>;
    }>();

    for (const record of filteredRecords) {
      const scopedEventKey = this.buildEventGroupingKey(record);
      const eventDateMs = this.resolveEventDateMs(record);
      let event = eventMap.get(scopedEventKey);
      if (!event) {
        event = {
          key: scopedEventKey,
          name: this.resolveEventGroupName(record),
          venueId: record.venueId,
          venueName: this.venueLabel(record.venueId),
          eventDateSortMs: eventDateMs,
          totalTickets: 0,
          totalAmount: 0,
          paidToDate: 0,
          amountDue: 0,
          currency: record.currency,
          firstPurchaseAtMs: record.createdAtMs,
          latestPurchaseAtMs: record.createdAtMs,
          nextDueDateMs: null,
          statusValues: new Set<string>(),
          guests: new Map<string, MutableGuestRow>()
        };
        eventMap.set(scopedEventKey, event);
      }

      event.totalTickets += record.totalTickets;
      event.totalAmount += record.totalAmount;
      event.paidToDate += record.paidToDate;
      event.amountDue += record.amountDue;
      event.eventDateSortMs = Math.min(event.eventDateSortMs, eventDateMs);
      event.firstPurchaseAtMs = Math.min(event.firstPurchaseAtMs, record.createdAtMs);
      event.latestPurchaseAtMs = Math.max(event.latestPurchaseAtMs, record.createdAtMs);

      if (record.amountDue > 0 && record.dueDateMs !== null) {
        event.nextDueDateMs = event.nextDueDateMs === null
          ? record.dueDateMs
          : Math.min(event.nextDueDateMs, record.dueDateMs);
      }
      event.statusValues.add(record.status);

      const guestKey = record.guestKey || record.transactionId || record.id;
      const existingGuest = event.guests.get(guestKey);
      const guest: MutableGuestRow = existingGuest ?? {
          key: guestKey,
          name: record.guestName || 'Guest',
          email: record.guestEmail ?? null,
          purchaseAtMs: record.createdAtMs,
          totalTickets: 0,
          averageTicketPrice: 0,
          totalAmount: 0,
          paidToDate: 0,
          amountDue: 0,
          dueDateMs: null,
          currency: record.currency,
          statusValues: new Set<string>()
        };

      if (!existingGuest) {
        event.guests.set(guestKey, guest);
      }

      guest.purchaseAtMs = Math.max(guest.purchaseAtMs, record.createdAtMs);
      guest.totalTickets += record.totalTickets;
      guest.totalAmount += record.totalAmount;
      guest.paidToDate += record.paidToDate;
      guest.amountDue += record.amountDue;
      guest.statusValues.add(record.status);

      if (record.amountDue > 0 && record.dueDateMs !== null) {
        guest.dueDateMs = guest.dueDateMs === null
          ? record.dueDateMs
          : Math.min(guest.dueDateMs, record.dueDateMs);
      }
    }

    const eventRows = [...eventMap.values()]
      .map((event): EventRow => {
        const guests = [...event.guests.values()]
          .map((guest): GuestRow => {
            const { statusValues, ...guestBase } = guest;
            return {
              ...guestBase,
              averageTicketPrice: guest.totalTickets > 0
                ? guest.totalAmount / guest.totalTickets
                : guest.averageTicketPrice,
              statusLabels: this.buildStatusLabels(statusValues)
            };
          })
          .sort((left, right) => {
            if (this.groupByEventDate) {
              return left.purchaseAtMs - right.purchaseAtMs;
            }

            if (this.isDepositsMode) {
              const leftDue = left.dueDateMs ?? Number.MAX_SAFE_INTEGER;
              const rightDue = right.dueDateMs ?? Number.MAX_SAFE_INTEGER;
              if (leftDue !== rightDue) {
                return leftDue - rightDue;
              }
            }
            return right.purchaseAtMs - left.purchaseAtMs;
          });

        return {
          key: event.key,
          name: event.name,
          venueId: event.venueId,
          venueName: event.venueName,
          eventDateSortMs: event.eventDateSortMs,
          guestCount: guests.length,
          totalTickets: event.totalTickets,
          totalAmount: event.totalAmount,
          paidToDate: event.paidToDate,
          amountDue: event.amountDue,
          currency: event.currency,
          firstPurchaseAtMs: event.firstPurchaseAtMs,
          latestPurchaseAtMs: event.latestPurchaseAtMs,
          nextDueDateMs: event.nextDueDateMs,
          statusLabels: this.buildStatusLabels(event.statusValues),
          guests
        };
      })
      .sort((left, right) => {
        if (this.groupByEventDate && left.eventDateSortMs !== right.eventDateSortMs) {
          return left.eventDateSortMs - right.eventDateSortMs;
        }

        if (this.groupByEventDate) {
          const byName = left.name.localeCompare(right.name, undefined, { sensitivity: 'base' });
          if (byName !== 0) {
            return byName;
          }
        }

        if (this.isDepositsMode) {
          const leftDue = left.nextDueDateMs ?? Number.MAX_SAFE_INTEGER;
          const rightDue = right.nextDueDateMs ?? Number.MAX_SAFE_INTEGER;
          if (leftDue !== rightDue) {
            return leftDue - rightDue;
          }
        }
        return right.latestPurchaseAtMs - left.latestPurchaseAtMs;
      });

    this.eventRows = eventRows;
    this.summary = {
      eventCount: eventRows.length,
      guestCount: eventRows.reduce((sum, event) => sum + event.guestCount, 0),
      ticketCount: eventRows.reduce((sum, event) => sum + event.totalTickets, 0),
      paidToDate: eventRows.reduce((sum, event) => sum + event.paidToDate, 0),
      amountDue: eventRows.reduce((sum, event) => sum + event.amountDue, 0)
    };
    this.summaryCurrency = eventRows[0]?.currency ?? 'GBP';

    const visibleKeys = new Set(eventRows.map((event) => event.key));
    this.expandedEventKeys = new Set(
      [...this.expandedEventKeys].filter((key) => visibleKeys.has(key))
    );

    if (this.expandedEventKeys.size === 0) {
      for (const event of eventRows.slice(0, 2)) {
        this.expandedEventKeys.add(event.key);
      }
    }
  }

  private resolveDateRange(): { startMs: number; endMs: number } {
    const nowMs = Date.now();
    if (this.selectedPreset === 'last-24h') {
      return { startMs: nowMs - (24 * 60 * 60 * 1000), endMs: nowMs };
    }

    const fromMs = this.fromDate ? new Date(`${this.fromDate}T00:00:00`).getTime() : Number.MIN_SAFE_INTEGER;
    const toMs = this.toDate ? new Date(`${this.toDate}T23:59:59.999`).getTime() : Number.MAX_SAFE_INTEGER;

    if (fromMs <= toMs) {
      return { startMs: fromMs, endMs: toMs };
    }

    return { startMs: toMs, endMs: fromMs };
  }

  private buildEventGroupingKey(record: TicketRecord): string {
    if (!this.groupByEventName && !this.groupByEventDate) {
      return `${record.venueId}::event::${record.eventKey}`;
    }

    const segments = [record.venueId];

    if (this.groupByEventDate) {
      segments.push(`date:${this.resolveEventDateGroupingKey(record)}`);
    }

    if (this.groupByEventName || this.groupByEventDate) {
      segments.push(`name:${this.resolveEventNameGroupingKey(record)}`);
    }

    return segments.join('::');
  }

  private resolveEventNameGroupingKey(record: TicketRecord): string {
    const normalizedName = (record.eventName ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (normalizedName.length > 0) {
      return normalizedName;
    }

    return record.eventKey || record.transactionId || record.id;
  }

  private resolveEventDateGroupingKey(record: TicketRecord): string {
    const eventDateMs = this.resolveEventDateMs(record);
    return new Date(eventDateMs).toISOString().slice(0, 10);
  }

  private resolveEventDateMs(record: TicketRecord): number {
    return record.dueDateMs ?? record.createdAtMs;
  }

  private resolveEventGroupName(record: TicketRecord): string {
    const trimmedName = (record.eventName ?? '').trim();
    if (trimmedName.length > 0) {
      return trimmedName;
    }

    return 'Untitled Event';
  }

  private formatEventDateLabel(record: TicketRecord): string {
    return new Date(this.resolveEventDateMs(record)).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC'
    });
  }

  get ticketsGroupingDescription(): string {
    if (this.groupByEventName && this.groupByEventDate) {
      return 'Grouped by event name and event date, then guest.';
    }

    if (this.groupByEventName) {
      return 'Grouped by event name, then guest.';
    }

    if (this.groupByEventDate) {
      return 'Grouped by event date, then event name, then guest.';
    }

    return 'Grouped by event, then guest.';
  }

  get depositsGroupingDescription(): string {
    if (this.groupByEventName && this.groupByEventDate) {
      return 'Outstanding balances grouped by event name and event date, then guest.';
    }

    if (this.groupByEventName) {
      return 'Outstanding balances grouped by event name and guest.';
    }

    if (this.groupByEventDate) {
      return 'Outstanding balances grouped by event date, then event name, then guest.';
    }

    return 'Outstanding balances grouped by event and guest.';
  }

  private toTimestamp(value: string | null | undefined): number | null {
    if (!value) {
      return null;
    }

    const timestamp = Date.parse(value);
    if (Number.isNaN(timestamp)) {
      return null;
    }

    return timestamp;
  }

  private toInputDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private buildStatusLabels(statusValues: Iterable<string>): string[] {
    const labels = [...new Set(
      [...statusValues]
        .map((status) => this.formatStatusLabel(status))
        .filter((status) => status.length > 0)
    )];
    return labels.length > 0 ? labels : ['Unknown'];
  }

  private formatStatusLabel(rawStatus: string | null | undefined): string {
    const normalized = (rawStatus ?? '').trim().toLowerCase();
    if (!normalized) {
      return 'Unknown';
    }

    if (normalized === 'depositpaid') {
      return 'Deposit Paid';
    }

    return normalized
      .split(/[^a-z0-9]+/i)
      .filter((segment) => segment.length > 0)
      .map((segment) => segment[0].toUpperCase() + segment.slice(1))
      .join(' ');
  }

  private normalizeTransactionStatus(rawStatus: string | null | undefined): string {
    const normalized = (rawStatus ?? '').trim().toLowerCase();
    return normalized.length > 0 ? normalized : 'unknown';
  }
}
