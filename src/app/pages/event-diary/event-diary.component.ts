import { Component, DestroyRef, HostListener, OnInit, inject } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';
import { ApiService, DiaryEventDto, DiaryResponse, MoveDiaryEventRequest } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface MonthCell {
  key: string;
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  events: DiaryEventDto[];
}

@Component({
  selector: 'app-event-diary',
  imports: [NgClass, DatePipe],
  templateUrl: './event-diary.component.html',
  styleUrl: './event-diary.component.scss'
})
export class EventDiaryComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private readonly unassignedSpaceId = '00000000-0000-0000-0000-000000000000';

  readonly weekdayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  diary: DiaryResponse | null = null;
  cells: MonthCell[] = [];
  hoveredEventKey: string | null = null;
  draggingEvent: DiaryEventDto | null = null;
  loadError = '';
  private monthCursor = this.getUtcMonthStart(new Date());
  private refreshIntervalHandle: number | null = null;

  get venueId(): string | null {
    return this.auth.selectedVenueId;
  }

  get monthLabel(): string {
    return new Intl.DateTimeFormat('en-GB', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(this.monthCursor);
  }

  ngOnInit(): void {
    this.auth.session$
      .pipe(
        map((session) => session?.venueId ?? null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.loadDiary();
      });

    this.loadDiary();
    this.refreshIntervalHandle = window.setInterval(() => this.loadDiary(), 30000);
    this.destroyRef.onDestroy(() => {
      if (this.refreshIntervalHandle) {
        clearInterval(this.refreshIntervalHandle);
        this.refreshIntervalHandle = null;
      }
    });
  }

  @HostListener('window:focus')
  onWindowFocus(): void {
    this.loadDiary();
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      this.loadDiary();
    }
  }

  shiftMonth(offset: number): void {
    const next = new Date(this.monthCursor);
    next.setUTCMonth(next.getUTCMonth() + offset);
    this.monthCursor = this.getUtcMonthStart(next);
    this.loadDiary();
  }

  goToToday(): void {
    this.monthCursor = this.getUtcMonthStart(new Date());
    this.loadDiary();
  }

  addEvent(): void {
    this.router.navigate(['/enquiries'], {
      queryParams: { statusTab: 'new-unanswered' }
    });
  }

  loadDiary(): void {
    const venueId = this.venueId;
    if (!venueId) {
      this.diary = null;
      this.cells = [];
      this.loadError = '';
      return;
    }

    this.api
      .getDiary({
        venueId,
        view: 'month',
        startDate: this.toIsoDateUtc(this.monthCursor)
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.diary = response;
          this.cells = this.buildMonthCells(response.events);
          this.loadError = '';
        },
        error: () => {
          this.loadError = 'Unable to load diary data right now.';
        }
      });
  }

  eventsForDisplay(cell: MonthCell): DiaryEventDto[] {
    return cell.events.slice(0, 3);
  }

  hiddenEventsCount(cell: MonthCell): number {
    return Math.max(cell.events.length - 3, 0);
  }

  eventKey(event: DiaryEventDto): string {
    return `${event.id}-${event.spaceId}-${event.startUtc}`;
  }

  canDrag(event: DiaryEventDto): boolean {
    return event.spaceId !== this.unassignedSpaceId;
  }

  onDragStart(event: DiaryEventDto, browserEvent?: DragEvent): void {
    if (!this.canDrag(event)) {
      browserEvent?.preventDefault();
      this.draggingEvent = null;
      return;
    }

    this.draggingEvent = event;
  }

  onDropDay(dayKey: string): void {
    if (!this.draggingEvent) {
      return;
    }

    const source = this.draggingEvent;
    if (!this.canDrag(source)) {
      this.draggingEvent = null;
      return;
    }

    const originalStart = new Date(source.startUtc);
    const originalEnd = new Date(source.endUtc);
    const targetDay = this.parseIsoDateUtc(dayKey);

    const newStart = new Date(targetDay);
    newStart.setUTCHours(originalStart.getUTCHours(), originalStart.getUTCMinutes(), 0, 0);

    const durationMs = originalEnd.getTime() - originalStart.getTime();
    const newEnd = new Date(newStart.getTime() + durationMs);

    const payload: MoveDiaryEventRequest = {
      eventType: source.eventType,
      eventId: source.id,
      targetSpaceId: source.spaceId,
      newStartUtc: newStart.toISOString(),
      newEndUtc: newEnd.toISOString()
    };

    this.api
      .moveDiaryEvent(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.draggingEvent = null;
          this.loadDiary();
        },
        error: () => {
          this.draggingEvent = null;
        }
      });
  }

  openDetails(event: DiaryEventDto): void {
    if (event.enquiryId) {
      this.router.navigate(['/enquiries'], { queryParams: { enquiry: event.enquiryId } });
    }
  }

  eventChipClass(event: DiaryEventDto): string {
    const visualType = event.visualType || this.resolveLegacyVisualType(event);
    return event.spaceId === this.unassignedSpaceId ? `status-${visualType} unassigned` : `status-${visualType}`;
  }

  eventDisplayLabel(event: DiaryEventDto): string {
    const visualType = event.visualType || this.resolveLegacyVisualType(event);
    if (visualType === 'provisional') {
      return `${event.label} (P)`;
    }

    return event.label;
  }

  private buildMonthCells(events: DiaryEventDto[]): MonthCell[] {
    const eventsByDate = new Map<string, DiaryEventDto[]>();

    for (const event of events) {
      const key = event.startUtc.slice(0, 10);
      if (!eventsByDate.has(key)) {
        eventsByDate.set(key, []);
      }
      eventsByDate.get(key)?.push(event);
    }

    for (const [key, dayEvents] of eventsByDate.entries()) {
      dayEvents.sort((a, b) => new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime());
      eventsByDate.set(key, dayEvents);
    }

    const year = this.monthCursor.getUTCFullYear();
    const month = this.monthCursor.getUTCMonth();

    const monthStart = new Date(Date.UTC(year, month, 1));
    const startOffset = monthStart.getUTCDay();
    const gridStart = new Date(monthStart);
    gridStart.setUTCDate(gridStart.getUTCDate() - startOffset);

    const cells: MonthCell[] = [];
    for (let index = 0; index < 42; index += 1) {
      const date = new Date(gridStart);
      date.setUTCDate(gridStart.getUTCDate() + index);
      const key = this.toIsoDateUtc(date);

      cells.push({
        key,
        date,
        dayNumber: date.getUTCDate(),
        inCurrentMonth: date.getUTCMonth() === month,
        events: eventsByDate.get(key) ?? []
      });
    }

    return cells;
  }

  private getUtcMonthStart(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  }

  private parseIsoDateUtc(dayKey: string): Date {
    const [year, month, day] = dayKey.split('-').map((value) => Number(value));
    return new Date(Date.UTC(year, month - 1, day));
  }

  private toIsoDateUtc(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private resolveLegacyVisualType(event: DiaryEventDto): string {
    if (event.eventType === 'Appointment') {
      return 'appointment';
    }

    if (event.eventType === 'VenueEvent') {
      return 'venue-event';
    }

    if (event.enquiryStatus === 'Confirmed') {
      return 'confirmed';
    }

    if (event.enquiryStatus === 'Completed') {
      return 'completed';
    }

    if (event.enquiryStatus === 'Provisional') {
      return 'provisional';
    }

    if (event.enquiryStatus === 'OpenProposal') {
      return 'open-proposal';
    }

    if (event.enquiryStatus === 'Tentative') {
      return 'tentative';
    }

    if (event.enquiryStatus === 'Lost') {
      return 'lost';
    }

    if (event.enquiryStatus === 'Archived') {
      return 'archived';
    }

    return 'new';
  }
}
