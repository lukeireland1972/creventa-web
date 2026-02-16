import { Component, DestroyRef, HostListener, OnInit, inject } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, forkJoin, map } from 'rxjs';
import { ApiService, DiaryEventDto, DiaryResponse, MoveDiaryEventRequest } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

type DiaryView = 'month' | 'timeline' | 'week' | 'day';
type ResizeEdge = 'start' | 'end';
type ResizeView = 'week' | 'day';

interface MonthCell {
  key: string;
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  events: DiaryEventDto[];
}

interface TimelineCell {
  key: string;
  isoDate: string | null;
  dayNumber: number | null;
  isFirstMonday: boolean;
  events: DiaryEventDto[];
}

interface TimelineMonthRow {
  monthKey: string;
  monthLabel: string;
  firstMondayDay: number;
  cells: TimelineCell[];
}

interface WeekDayColumn {
  isoDate: string;
  label: string;
  subLabel: string;
  events: DiaryEventDto[];
}

interface PendingMove {
  event: DiaryEventDto;
  oldStartUtc: string;
  oldEndUtc: string;
  newStartUtc: string;
  newEndUtc: string;
  targetSpaceId: string;
  actionLabel: string;
}

interface ResizeState {
  event: DiaryEventDto;
  edge: ResizeEdge;
  view: ResizeView;
  dayIso: string;
  originClient: number;
  pixelsPerMinute: number;
  originalStartUtc: Date;
  originalEndUtc: Date;
}

@Component({
  selector: 'app-event-diary',
  imports: [NgClass, DatePipe],
  templateUrl: './event-diary.component.html',
  styleUrl: './event-diary.component.scss'
})
export class EventDiaryComponent implements OnInit {
  private static readonly timelineColumnAnchor = 6;
  private static readonly timelineColumnCount = 37;

  private readonly dayStartHour = 9;
  private readonly dayEndHour = 23;
  private readonly minuteStep = 15;

  private api = inject(ApiService);
  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private readonly unassignedSpaceId = '00000000-0000-0000-0000-000000000000';

  readonly weekdayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  readonly timelineHeaderLabels = Array.from({ length: EventDiaryComponent.timelineColumnCount }, (_, index) =>
    index < EventDiaryComponent.timelineColumnAnchor ? '' : String(index - EventDiaryComponent.timelineColumnAnchor + 1)
  );
  readonly diaryViews: Array<{ key: DiaryView; label: string }> = [
    { key: 'month', label: 'Month' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'week', label: 'Week' },
    { key: 'day', label: 'Day' }
  ];

  diary: DiaryResponse | null = null;
  cells: MonthCell[] = [];
  timelineRows: TimelineMonthRow[] = [];
  weekColumns: WeekDayColumn[] = [];
  dayEvents: DiaryEventDto[] = [];
  hoveredEventKey: string | null = null;
  draggingEvent: DiaryEventDto | null = null;
  loadError = '';
  selectedView: DiaryView = 'month';
  pendingMove: PendingMove | null = null;
  applyingMove = false;

  private monthCursor = this.getUtcMonthStart(new Date());
  private refreshIntervalHandle: number | null = null;
  private resizeState: ResizeState | null = null;
  private resizePreview: { eventKey: string; startUtc: string; endUtc: string } | null = null;

  get venueId(): string | null {
    return this.auth.selectedVenueId;
  }

  get currentRangeLabel(): string {
    if (this.selectedView === 'timeline') {
      return this.timelineRangeLabel;
    }

    if (this.selectedView === 'week') {
      return this.weekRangeLabel;
    }

    if (this.selectedView === 'day') {
      return this.dayLabel;
    }

    return this.monthLabel;
  }

  get monthLabel(): string {
    return new Intl.DateTimeFormat('en-GB', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(this.monthCursor);
  }

  get dayLabel(): string {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(this.monthCursor);
  }

  get weekRangeLabel(): string {
    const start = this.getWeekStart(this.monthCursor);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 6);

    const formatter = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC'
    });

    return `${formatter.format(start)} - ${formatter.format(end)}`;
  }

  get timelineRangeLabel(): string {
    const end = new Date(this.monthCursor);
    end.setUTCMonth(end.getUTCMonth() + 5);

    const formatter = new Intl.DateTimeFormat('en-GB', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC'
    });

    return `${formatter.format(this.monthCursor)} - ${formatter.format(end)}`;
  }

  get timeAxisHours(): number[] {
    return Array.from({ length: this.dayEndHour - this.dayStartHour + 1 }, (_, index) => this.dayStartHour + index);
  }

  get timeSlotHours(): number[] {
    return Array.from({ length: this.dayEndHour - this.dayStartHour }, (_, index) => this.dayStartHour + index);
  }

  get hasPendingMove(): boolean {
    return !!this.pendingMove;
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

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent): void {
    if (!this.resizeState) {
      return;
    }

    const state = this.resizeState;
    const deltaPixels = state.view === 'week' ? event.clientY - state.originClient : event.clientX - state.originClient;
    const deltaMinutes = this.roundMinutesToStep(deltaPixels / state.pixelsPerMinute);

    const dayBounds = this.getDayWindowBounds(state.dayIso);
    let nextStart = new Date(state.originalStartUtc);
    let nextEnd = new Date(state.originalEndUtc);

    if (state.edge === 'start') {
      nextStart = new Date(state.originalStartUtc.getTime() + deltaMinutes * 60000);
      if (nextStart < dayBounds.start) {
        nextStart = new Date(dayBounds.start);
      }
      if (nextStart >= new Date(nextEnd.getTime() - this.minuteStep * 60000)) {
        nextStart = new Date(nextEnd.getTime() - this.minuteStep * 60000);
      }
    } else {
      nextEnd = new Date(state.originalEndUtc.getTime() + deltaMinutes * 60000);
      if (nextEnd > dayBounds.end) {
        nextEnd = new Date(dayBounds.end);
      }
      if (nextEnd <= new Date(nextStart.getTime() + this.minuteStep * 60000)) {
        nextEnd = new Date(nextStart.getTime() + this.minuteStep * 60000);
      }
    }

    this.resizePreview = {
      eventKey: this.eventKey(state.event),
      startUtc: nextStart.toISOString(),
      endUtc: nextEnd.toISOString()
    };
  }

  @HostListener('document:mouseup')
  onDocumentMouseUp(): void {
    if (!this.resizeState) {
      return;
    }

    const state = this.resizeState;
    const preview = this.resizePreview;

    this.resizeState = null;
    this.resizePreview = null;

    if (!preview) {
      return;
    }

    this.queueMove(
      state.event,
      new Date(preview.startUtc),
      new Date(preview.endUtc),
      state.event.spaceId,
      'Resize event duration'
    );
  }

  shiftMonth(offset: number): void {
    if (this.selectedView === 'week') {
      const next = new Date(this.monthCursor);
      next.setUTCDate(next.getUTCDate() + offset * 7);
      this.monthCursor = this.getWeekStart(next);
    } else if (this.selectedView === 'day') {
      const next = new Date(this.monthCursor);
      next.setUTCDate(next.getUTCDate() + offset);
      this.monthCursor = this.getUtcDayStart(next);
    } else {
      const next = new Date(this.monthCursor);
      next.setUTCMonth(next.getUTCMonth() + offset);
      this.monthCursor = this.getUtcMonthStart(next);
    }

    this.loadDiary();
  }

  goToToday(): void {
    const today = new Date();

    if (this.selectedView === 'week') {
      this.monthCursor = this.getWeekStart(today);
    } else if (this.selectedView === 'day') {
      this.monthCursor = this.getUtcDayStart(today);
    } else {
      this.monthCursor = this.getUtcMonthStart(today);
    }

    this.loadDiary();
  }

  addEvent(): void {
    this.router.navigate(['/enquiries'], {
      queryParams: { statusTab: 'new-unanswered' }
    });
  }

  switchView(view: DiaryView): void {
    if (this.selectedView === view) {
      return;
    }

    this.selectedView = view;

    if (view === 'week') {
      this.monthCursor = this.getWeekStart(this.monthCursor);
    } else if (view === 'day') {
      this.monthCursor = this.getUtcDayStart(this.monthCursor);
    } else {
      this.monthCursor = this.getUtcMonthStart(this.monthCursor);
    }

    this.loadDiary();
  }

  loadDiary(): void {
    const venueId = this.venueId;
    if (!venueId) {
      this.diary = null;
      this.cells = [];
      this.timelineRows = [];
      this.weekColumns = [];
      this.dayEvents = [];
      this.loadError = '';
      return;
    }

    this.pendingMove = null;

    if (this.selectedView === 'timeline') {
      this.loadTimelineDiary(venueId);
      return;
    }

    this.api
      .getDiary({
        venueId,
        view: this.selectedView,
        startDate: this.toIsoDateUtc(this.monthCursor)
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.diary = response;
          this.loadError = '';
          this.cells = [];
          this.timelineRows = [];
          this.weekColumns = [];
          this.dayEvents = [];

          if (this.selectedView === 'month') {
            this.monthCursor = this.getUtcMonthStart(this.parseIsoDateUtc(response.windowStart));
            this.cells = this.buildMonthCells(response.events);
            return;
          }

          if (this.selectedView === 'week') {
            this.monthCursor = this.getWeekStart(this.parseIsoDateUtc(response.windowStart));
            this.weekColumns = this.buildWeekColumns(this.parseIsoDateUtc(response.windowStart), response.events);
            return;
          }

          this.monthCursor = this.getUtcDayStart(this.parseIsoDateUtc(response.windowStart));
          this.dayEvents = this.buildDayEvents(response.events);
        },
        error: () => {
          this.loadError = 'Unable to load diary data right now.';
        }
      });
  }

  eventsForDisplay(cell: { events: DiaryEventDto[] }): DiaryEventDto[] {
    return cell.events.slice(0, 3);
  }

  hiddenEventsCount(cell: { events: DiaryEventDto[] }): number {
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

  onDragEnd(): void {
    this.draggingEvent = null;
  }

  onDropDay(dayKey: string): void {
    if (!this.draggingEvent) {
      return;
    }

    const source = this.draggingEvent;
    const originalStart = new Date(source.startUtc);
    const originalEnd = new Date(source.endUtc);
    const targetDay = this.parseIsoDateUtc(dayKey);

    const newStart = new Date(targetDay);
    newStart.setUTCHours(originalStart.getUTCHours(), originalStart.getUTCMinutes(), 0, 0);

    const durationMs = Math.max(this.minuteStep * 60000, originalEnd.getTime() - originalStart.getTime());
    const newEnd = new Date(newStart.getTime() + durationMs);

    this.queueMove(source, newStart, newEnd, source.spaceId, 'Move event to new date');
    this.draggingEvent = null;
  }

  onDropTimelineCell(cell: TimelineCell): void {
    if (!cell.isoDate) {
      return;
    }

    this.onDropDay(cell.isoDate);
  }

  onDropWeekColumn(dayIso: string, dragEvent: DragEvent, container: HTMLElement): void {
    if (!this.draggingEvent) {
      return;
    }

    dragEvent.preventDefault();

    const source = this.draggingEvent;
    const rect = container.getBoundingClientRect();
    const y = Math.max(0, Math.min(rect.height, dragEvent.clientY - rect.top));
    const minuteOffset = this.roundMinutesToStep((y / rect.height) * this.totalWindowMinutes);

    const originalStart = new Date(source.startUtc);
    const originalEnd = new Date(source.endUtc);
    const durationMinutes = Math.max(this.minuteStep, (originalEnd.getTime() - originalStart.getTime()) / 60000);

    const moved = this.buildMovedRange(dayIso, minuteOffset, durationMinutes);
    this.queueMove(source, moved.start, moved.end, source.spaceId, 'Move event to new time');
    this.draggingEvent = null;
  }

  onDropDayTrack(dragEvent: DragEvent, track: HTMLElement): void {
    if (!this.draggingEvent) {
      return;
    }

    dragEvent.preventDefault();

    const source = this.draggingEvent;
    const rect = track.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, dragEvent.clientX - rect.left));
    const minuteOffset = this.roundMinutesToStep((x / rect.width) * this.totalWindowMinutes);

    const originalStart = new Date(source.startUtc);
    const originalEnd = new Date(source.endUtc);
    const durationMinutes = Math.max(this.minuteStep, (originalEnd.getTime() - originalStart.getTime()) / 60000);

    const moved = this.buildMovedRange(this.toIsoDateUtc(this.monthCursor), minuteOffset, durationMinutes);
    this.queueMove(source, moved.start, moved.end, source.spaceId, 'Move event to new time');
    this.draggingEvent = null;
  }

  onResizeHandleMouseDown(
    mouseEvent: MouseEvent,
    event: DiaryEventDto,
    edge: ResizeEdge,
    view: ResizeView,
    container: HTMLElement
  ): void {
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();

    if (!this.canDrag(event)) {
      return;
    }

    const sizePixels = view === 'week' ? container.getBoundingClientRect().height : container.getBoundingClientRect().width;
    if (sizePixels <= 0) {
      return;
    }

    this.resizeState = {
      event,
      edge,
      view,
      dayIso: event.startUtc.slice(0, 10),
      originClient: view === 'week' ? mouseEvent.clientY : mouseEvent.clientX,
      pixelsPerMinute: sizePixels / this.totalWindowMinutes,
      originalStartUtc: new Date(event.startUtc),
      originalEndUtc: new Date(event.endUtc)
    };

    this.resizePreview = {
      eventKey: this.eventKey(event),
      startUtc: event.startUtc,
      endUtc: event.endUtc
    };
  }

  confirmPendingMove(): void {
    if (!this.pendingMove || this.applyingMove) {
      return;
    }

    this.applyingMove = true;

    const moveRequest: MoveDiaryEventRequest = {
      eventType: this.pendingMove.event.eventType,
      eventId: this.pendingMove.event.id,
      targetSpaceId: this.pendingMove.targetSpaceId,
      newStartUtc: this.pendingMove.newStartUtc,
      newEndUtc: this.pendingMove.newEndUtc
    };

    this.api
      .moveDiaryEvent(moveRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.applyingMove = false;
          this.pendingMove = null;
          this.loadDiary();
        },
        error: (error) => {
          this.applyingMove = false;
          const conflictMessage =
            typeof error?.error?.message === 'string'
              ? error.error.message
              : 'Unable to move the event because it conflicts with another booking.';
          this.loadError = conflictMessage;
          this.pendingMove = null;
        }
      });
  }

  cancelPendingMove(): void {
    this.pendingMove = null;
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

  formatHour(hour: number): string {
    return `${hour.toString().padStart(2, '0')}:00`;
  }

  timeMarkerPercent(hour: number): number {
    return ((hour - this.dayStartHour) / (this.dayEndHour - this.dayStartHour)) * 100;
  }

  weekEventTopPercent(event: DiaryEventDto): number {
    const range = this.getRenderMinutesRange(event);
    return (range.startMinutes / this.totalWindowMinutes) * 100;
  }

  weekEventHeightPercent(event: DiaryEventDto): number {
    const range = this.getRenderMinutesRange(event);
    const value = (range.durationMinutes / this.totalWindowMinutes) * 100;
    return Math.max(value, 2);
  }

  dayEventLeftPercent(event: DiaryEventDto): number {
    const range = this.getRenderMinutesRange(event);
    return (range.startMinutes / this.totalWindowMinutes) * 100;
  }

  dayEventWidthPercent(event: DiaryEventDto): number {
    const range = this.getRenderMinutesRange(event);
    const value = (range.durationMinutes / this.totalWindowMinutes) * 100;
    return Math.max(value, 3);
  }

  private queueMove(
    event: DiaryEventDto,
    newStartUtcDate: Date,
    newEndUtcDate: Date,
    targetSpaceId: string,
    actionLabel: string
  ): void {
    const oldStart = new Date(event.startUtc);
    const oldEnd = new Date(event.endUtc);

    let normalizedStart = new Date(newStartUtcDate);
    let normalizedEnd = new Date(newEndUtcDate);

    if (normalizedEnd <= normalizedStart) {
      normalizedEnd = new Date(normalizedStart.getTime() + this.minuteStep * 60000);
    }

    if (
      oldStart.getTime() === normalizedStart.getTime() &&
      oldEnd.getTime() === normalizedEnd.getTime() &&
      event.spaceId === targetSpaceId
    ) {
      return;
    }

    this.pendingMove = {
      event,
      oldStartUtc: oldStart.toISOString(),
      oldEndUtc: oldEnd.toISOString(),
      newStartUtc: normalizedStart.toISOString(),
      newEndUtc: normalizedEnd.toISOString(),
      targetSpaceId,
      actionLabel
    };
  }

  private buildMonthCells(events: DiaryEventDto[]): MonthCell[] {
    const eventsByDate = this.groupEventsByDate(events);

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

  private loadTimelineDiary(venueId: string): void {
    const monthStarts = Array.from({ length: 6 }, (_, offset) => {
      const month = new Date(this.monthCursor);
      month.setUTCMonth(month.getUTCMonth() + offset);
      return this.getUtcMonthStart(month);
    });

    const monthRequests = monthStarts.map((start) =>
      this.api.getDiary({
        venueId,
        view: 'month',
        startDate: this.toIsoDateUtc(start)
      })
    );

    forkJoin(monthRequests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (responses) => {
          const allEvents = responses.flatMap((response) => response.events);
          this.diary = responses[0] ?? null;
          this.cells = [];
          this.weekColumns = [];
          this.dayEvents = [];
          this.timelineRows = this.buildTimelineRows(monthStarts, allEvents);
          this.loadError = '';
        },
        error: () => {
          this.loadError = 'Unable to load diary data right now.';
        }
      });
  }

  private buildTimelineRows(monthStarts: Date[], events: DiaryEventDto[]): TimelineMonthRow[] {
    const eventsByDate = this.groupEventsByDate(events);

    return monthStarts.map((monthStart) => {
      const year = monthStart.getUTCFullYear();
      const month = monthStart.getUTCMonth();
      const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      const firstMondayDay = this.getFirstMondayDay(monthStart);

      const cells: TimelineCell[] = Array.from({ length: EventDiaryComponent.timelineColumnCount }, (_, index) => ({
        key: `${year}-${month + 1}-${index}`,
        isoDate: null,
        dayNumber: null,
        isFirstMonday: false,
        events: []
      }));

      for (let day = 1; day <= daysInMonth; day += 1) {
        const column = EventDiaryComponent.timelineColumnAnchor + (day - firstMondayDay);
        if (column < 0 || column >= EventDiaryComponent.timelineColumnCount) {
          continue;
        }

        const date = new Date(Date.UTC(year, month, day));
        const isoDate = this.toIsoDateUtc(date);

        cells[column] = {
          key: `${year}-${month + 1}-${column}`,
          isoDate,
          dayNumber: day,
          isFirstMonday: day === firstMondayDay,
          events: eventsByDate.get(isoDate) ?? []
        };
      }

      return {
        monthKey: `${year}-${month + 1}`,
        monthLabel: new Intl.DateTimeFormat('en-GB', {
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC'
        }).format(monthStart),
        firstMondayDay,
        cells
      };
    });
  }

  private buildWeekColumns(windowStart: Date, events: DiaryEventDto[]): WeekDayColumn[] {
    const eventsByDate = this.groupEventsByDate(events);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(windowStart);
      date.setUTCDate(windowStart.getUTCDate() + index);
      const isoDate = this.toIsoDateUtc(date);

      return {
        isoDate,
        label: new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' }).format(date).toUpperCase(),
        subLabel: new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' }).format(date),
        events: (eventsByDate.get(isoDate) ?? []).slice().sort((left, right) => new Date(left.startUtc).getTime() - new Date(right.startUtc).getTime())
      };
    });
  }

  private buildDayEvents(events: DiaryEventDto[]): DiaryEventDto[] {
    return events
      .slice()
      .sort((left, right) => new Date(left.startUtc).getTime() - new Date(right.startUtc).getTime());
  }

  private groupEventsByDate(events: DiaryEventDto[]): Map<string, DiaryEventDto[]> {
    const eventsByDate = new Map<string, DiaryEventDto[]>();
    const dedupe = new Set<string>();

    for (const event of events) {
      const dateKey = event.startUtc.slice(0, 10);
      const uniqueKey = `${dateKey}|${event.id}|${event.spaceId}|${event.startUtc}|${event.endUtc}|${event.eventType}`;
      if (dedupe.has(uniqueKey)) {
        continue;
      }

      dedupe.add(uniqueKey);

      if (!eventsByDate.has(dateKey)) {
        eventsByDate.set(dateKey, []);
      }

      eventsByDate.get(dateKey)?.push(event);
    }

    for (const [key, dayEvents] of eventsByDate.entries()) {
      dayEvents.sort((a, b) => new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime());
      eventsByDate.set(key, dayEvents);
    }

    return eventsByDate;
  }

  private getRenderMinutesRange(event: DiaryEventDto): { startMinutes: number; durationMinutes: number } {
    const startIso = this.getEffectiveStartUtc(event);
    const endIso = this.getEffectiveEndUtc(event);

    const start = new Date(startIso);
    const end = new Date(endIso);

    const startMinutes = this.clampMinutesWithinWindow(this.utcMinutesOfDay(start) - this.dayStartHour * 60);
    const endMinutes = this.clampMinutesWithinWindow(this.utcMinutesOfDay(end) - this.dayStartHour * 60);

    const durationMinutes = Math.max(this.minuteStep, endMinutes - startMinutes);

    return {
      startMinutes,
      durationMinutes
    };
  }

  private getEffectiveStartUtc(event: DiaryEventDto): string {
    if (this.resizePreview && this.resizePreview.eventKey === this.eventKey(event)) {
      return this.resizePreview.startUtc;
    }

    return event.startUtc;
  }

  private getEffectiveEndUtc(event: DiaryEventDto): string {
    if (this.resizePreview && this.resizePreview.eventKey === this.eventKey(event)) {
      return this.resizePreview.endUtc;
    }

    return event.endUtc;
  }

  private buildMovedRange(dayIso: string, minuteOffset: number, durationMinutes: number): { start: Date; end: Date } {
    const dayBounds = this.getDayWindowBounds(dayIso);

    let start = new Date(dayBounds.start.getTime() + minuteOffset * 60000);
    let end = new Date(start.getTime() + Math.max(this.minuteStep, durationMinutes) * 60000);

    if (start < dayBounds.start) {
      start = new Date(dayBounds.start);
    }

    if (end > dayBounds.end) {
      end = new Date(dayBounds.end);
    }

    if (end <= start) {
      start = new Date(end.getTime() - this.minuteStep * 60000);
    }

    return { start, end };
  }

  private getDayWindowBounds(dayIso: string): { start: Date; end: Date } {
    const day = this.parseIsoDateUtc(dayIso);
    const start = new Date(day);
    start.setUTCHours(this.dayStartHour, 0, 0, 0);

    const end = new Date(day);
    end.setUTCHours(this.dayEndHour, 0, 0, 0);

    return { start, end };
  }

  private getWeekStart(date: Date): Date {
    const dayStart = this.getUtcDayStart(date);
    const diff = dayStart.getUTCDay();
    dayStart.setUTCDate(dayStart.getUTCDate() - diff);
    return dayStart;
  }

  private getUtcMonthStart(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  }

  private getUtcDayStart(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  private parseIsoDateUtc(dayKey: string): Date {
    const [year, month, day] = dayKey.split('-').map((value) => Number(value));
    return new Date(Date.UTC(year, month - 1, day));
  }

  private toIsoDateUtc(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private getFirstMondayDay(monthStart: Date): number {
    const probe = new Date(monthStart);
    while (probe.getUTCDay() !== 1) {
      probe.setUTCDate(probe.getUTCDate() + 1);
    }

    return probe.getUTCDate();
  }

  private get totalWindowMinutes(): number {
    return (this.dayEndHour - this.dayStartHour) * 60;
  }

  private utcMinutesOfDay(value: Date): number {
    return value.getUTCHours() * 60 + value.getUTCMinutes();
  }

  private clampMinutesWithinWindow(minutes: number): number {
    return Math.max(0, Math.min(this.totalWindowMinutes, minutes));
  }

  private roundMinutesToStep(minutes: number): number {
    return Math.round(minutes / this.minuteStep) * this.minuteStep;
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
