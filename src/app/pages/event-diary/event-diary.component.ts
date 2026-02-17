import { Component, DestroyRef, HostListener, OnInit, inject } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, forkJoin, map } from 'rxjs';
import {
  AiDemandHeatmapCellDto,
  ApiService,
  DiaryEventDto,
  DiaryMoveConflictDto,
  DiaryResponse,
  MoveDiaryEventRequest,
  SpaceCombinationDto,
  SpaceSummaryDto
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { QuickTaskCreatedEvent, TaskQuickCreateModalComponent } from '../../ui/task-quick-create-modal/task-quick-create-modal.component';

type DiaryView = 'month' | 'timeline' | 'week' | 'day';
type WeekLayout = 'merged' | 'space';
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

type SpaceFilterOptionType = 'space' | 'combination';

interface SpaceFilterOption {
  key: string;
  label: string;
  type: SpaceFilterOptionType;
  spaceIds: string[];
}

interface RoomTimelineBar {
  key: string;
  event: DiaryEventDto;
  lane: number;
  leftPercent: number;
  widthPercent: number;
}

interface RoomTimelineRow {
  spaceId: string;
  spaceName: string;
  laneCount: number;
  bars: RoomTimelineBar[];
}

interface WeekDayColumn {
  isoDate: string;
  label: string;
  subLabel: string;
  events: DiaryEventDto[];
}

interface WeekSpaceDayLane {
  isoDate: string;
  events: DiaryEventDto[];
}

interface WeekSpaceRow {
  spaceId: string;
  spaceName: string;
  days: WeekSpaceDayLane[];
}

interface DaySpaceColumn {
  spaceId: string;
  spaceName: string;
  events: DiaryEventDto[];
}

interface DiaryEventGroup {
  key: string;
  nested: boolean;
  parentLabel: string;
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
  checkingConflicts: boolean;
  conflicts: DiaryMoveConflictDto[];
  conflictCheckMessage: string;
}

interface MoveUndoState {
  eventType: 'Enquiry' | 'Appointment' | 'VenueEvent';
  eventId: string;
  eventLabel: string;
  oldStartUtc: string;
  oldEndUtc: string;
  oldSpaceId: string;
  newStartUtc: string;
  newEndUtc: string;
  newSpaceId: string;
  expiresAt: number;
  secondsRemaining: number;
  undoing: boolean;
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
  imports: [NgClass, DatePipe, TaskQuickCreateModalComponent],
  templateUrl: './event-diary.component.html',
  styleUrl: './event-diary.component.scss'
})
export class EventDiaryComponent implements OnInit {
  private static readonly timelineColumnAnchor = 6;
  private static readonly timelineColumnCount = 37;
  private static readonly timelineMonthWindow = 12;

  private readonly dayStartHour = 6;
  private readonly dayEndHour = 23;
  private readonly minuteStep = 15;

  private api = inject(ApiService);
  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
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
  roomTimelineRows: RoomTimelineRow[] = [];
  weekColumns: WeekDayColumn[] = [];
  weekSpaceRows: WeekSpaceRow[] = [];
  dayEvents: DiaryEventDto[] = [];
  daySpaceColumns: DaySpaceColumn[] = [];
  showDemandHeatmap = false;
  demandHeatmapLoading = false;
  demandHeatmapMessage = '';
  private demandHeatmapByDate = new Map<string, AiDemandHeatmapCellDto>();
  timelineLayout: 'standard' | 'room' = 'standard';
  weekLayout: WeekLayout = 'merged';
  showSpaceFilterDropdown = false;
  spaceFilterOptions: SpaceFilterOption[] = [];
  selectedSpaceFilterKeys: string[] = [];
  loadingSpaceFilters = false;
  spaceFilterError = '';
  hoveredEventKey: string | null = null;
  draggingEvent: DiaryEventDto | null = null;
  loadError = '';
  exportState: 'xlsx' | 'pdf' | null = null;
  showAddTaskModal = false;
  selectedView: DiaryView = 'month';
  pendingMove: PendingMove | null = null;
  applyingMove = false;
  moveUndoState: MoveUndoState | null = null;

  private monthCursor = this.getUtcMonthStart(new Date());
  private activeSpaceFilterMap = new Map<string, SpaceFilterOption>();
  private refreshIntervalHandle: number | null = null;
  private resizeState: ResizeState | null = null;
  private resizePreview: { eventKey: string; startUtc: string; endUtc: string } | null = null;
  private moveUndoIntervalHandle: number | null = null;
  private pendingConflictCheckSequence = 0;
  private demandHeatmapRequestSequence = 0;
  private diaryLoadSequence = 0;

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

  get spaceFilterSummaryLabel(): string {
    if (this.selectedSpaceFilterKeys.length === 0) {
      return 'All Spaces';
    }

    const selectedLabels = this.selectedSpaceFilterKeys
      .map((key) => this.activeSpaceFilterMap.get(key)?.label)
      .filter((label): label is string => !!label);

    if (selectedLabels.length === 0) {
      return 'All Spaces';
    }

    if (selectedLabels.length <= 2) {
      return selectedLabels.join(', ');
    }

    return `${selectedLabels.slice(0, 2).join(', ')} +${selectedLabels.length - 2}`;
  }

  get standaloneSpaceFilterOptions(): SpaceFilterOption[] {
    return this.spaceFilterOptions.filter((option) => option.type === 'space');
  }

  get combinationSpaceFilterOptions(): SpaceFilterOption[] {
    return this.spaceFilterOptions.filter((option) => option.type === 'combination');
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

  get currentDayIso(): string {
    return this.toIsoDateUtc(this.monthCursor);
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
    end.setUTCMonth(end.getUTCMonth() + EventDiaryComponent.timelineMonthWindow - 1);

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

  get canConfirmPendingMove(): boolean {
    if (!this.pendingMove) {
      return false;
    }

    return !this.pendingMove.checkingConflicts && this.pendingMove.conflicts.length === 0 && !this.applyingMove;
  }

  ngOnInit(): void {
    this.restoreStateFromQueryParams();

    this.auth.session$
      .pipe(
        map((session) => session?.venueId ?? null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((venueId) => {
        if (venueId) {
          this.loadSpaceFilterOptions(venueId);
        } else {
          this.spaceFilterOptions = [];
          this.activeSpaceFilterMap.clear();
        }

        this.loadDiary();
      });

    if (this.venueId) {
      this.loadSpaceFilterOptions(this.venueId);
    }

    this.loadDiary();
    this.refreshIntervalHandle = window.setInterval(() => this.loadDiary(), 30000);
    this.destroyRef.onDestroy(() => {
      if (this.refreshIntervalHandle) {
        clearInterval(this.refreshIntervalHandle);
        this.refreshIntervalHandle = null;
      }

      this.clearMoveUndoState();
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.showSpaceFilterDropdown) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target?.closest('.space-filter')) {
      this.showSpaceFilterDropdown = false;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent): void {
    if (!this.resizeState) {
      return;
    }

    const state = this.resizeState;
    const deltaPixels = event.clientY - state.originClient;
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

    this.syncQueryParams();
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

    this.syncQueryParams();
    this.loadDiary();
  }

  addEvent(): void {
    this.router.navigate(['/enquiries'], {
      queryParams: { statusTab: 'new-unanswered' }
    });
  }

  openAddTask(): void {
    this.showAddTaskModal = true;
  }

  closeAddTaskModal(): void {
    this.showAddTaskModal = false;
  }

  onTaskQuickCreated(event: QuickTaskCreatedEvent): void {
    this.showAddTaskModal = false;
  }

  exportDiary(format: 'xlsx' | 'pdf'): void {
    const venueId = this.venueId;
    if (!venueId || this.exportState) {
      return;
    }

    this.exportState = format;
    this.api
      .exportDiary({
        venueId,
        view: this.selectedView,
        format,
        startDate: this.toIsoDateUtc(this.monthCursor),
        spaceIds: this.getEffectiveSpaceFilterIds()
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          const timestamp = this.toIsoDateUtc(new Date());
          const fileName = `event-diary-${this.selectedView}-${timestamp}.${format}`;
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = fileName;
          anchor.click();
          URL.revokeObjectURL(url);
          this.exportState = null;
        },
        error: () => {
          this.loadError = 'Unable to export diary right now.';
          this.exportState = null;
        }
      });
  }

  isExporting(format: 'xlsx' | 'pdf'): boolean {
    return this.exportState === format;
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

    this.syncQueryParams();
    this.loadDiary();
  }

  toggleDemandHeatmap(): void {
    this.showDemandHeatmap = !this.showDemandHeatmap;
    this.syncQueryParams();
    if (!this.showDemandHeatmap) {
      this.demandHeatmapByDate.clear();
      this.demandHeatmapMessage = '';
      this.demandHeatmapLoading = false;
      return;
    }

    this.loadDiary();
  }

  heatmapClassForDate(dateIso: string | null): string {
    if (!this.showDemandHeatmap || !dateIso) {
      return '';
    }

    const intensity = (this.demandHeatmapByDate.get(dateIso)?.intensity ?? '').toLowerCase();
    if (!intensity) {
      return '';
    }

    return `heatmap-${intensity}`;
  }

  heatmapLabelForDate(dateIso: string | null): string | null {
    if (!this.showDemandHeatmap || !dateIso) {
      return null;
    }

    const cell = this.demandHeatmapByDate.get(dateIso);
    if (!cell || cell.enquiryCount <= 0) {
      return null;
    }

    return cell.intensity;
  }

  toggleSpaceFilterDropdown(): void {
    this.showSpaceFilterDropdown = !this.showSpaceFilterDropdown;
  }

  selectAllSpaces(): void {
    this.selectedSpaceFilterKeys = [];
    this.showSpaceFilterDropdown = false;
    this.syncQueryParams();
    this.loadDiary();
  }

  isSpaceFilterSelected(filterKey: string): boolean {
    return this.selectedSpaceFilterKeys.includes(filterKey);
  }

  toggleSpaceFilter(filterKey: string): void {
    if (!this.activeSpaceFilterMap.has(filterKey)) {
      return;
    }

    const selected = new Set(this.selectedSpaceFilterKeys);
    if (selected.has(filterKey)) {
      selected.delete(filterKey);
    } else {
      selected.add(filterKey);
    }

    this.selectedSpaceFilterKeys = Array.from(selected);
    this.syncQueryParams();
    this.loadDiary();
  }

  setTimelineLayout(layout: 'standard' | 'room'): void {
    if (this.timelineLayout === layout) {
      return;
    }

    this.timelineLayout = layout;
    this.syncQueryParams();
  }

  setWeekLayout(layout: WeekLayout): void {
    if (this.weekLayout === layout) {
      return;
    }

    this.weekLayout = layout;
    this.syncQueryParams();
  }

  roomRowHeightPx(row: RoomTimelineRow): number {
    return Math.max(34, row.laneCount * 28 + 8);
  }

  roomBarTopPx(bar: RoomTimelineBar): number {
    return 4 + bar.lane * 28;
  }

  timelineColumnPercent(index: number): number {
    return (index / EventDiaryComponent.timelineColumnCount) * 100;
  }

  loadDiary(): void {
    const venueId = this.venueId;
    if (!venueId) {
      this.diaryLoadSequence += 1;
      this.diary = null;
      this.cells = [];
      this.timelineRows = [];
      this.roomTimelineRows = [];
      this.weekColumns = [];
      this.weekSpaceRows = [];
      this.dayEvents = [];
      this.daySpaceColumns = [];
      this.demandHeatmapByDate.clear();
      this.demandHeatmapMessage = '';
      this.demandHeatmapLoading = false;
      this.loadError = '';
      return;
    }

    this.pendingConflictCheckSequence += 1;
    this.pendingMove = null;
    const requestSequence = ++this.diaryLoadSequence;

    if (this.selectedView === 'timeline') {
      this.loadTimelineDiary(venueId, requestSequence);
      return;
    }

    this.api
      .getDiary({
        venueId,
        view: this.selectedView,
        startDate: this.toIsoDateUtc(this.monthCursor),
        spaceIds: this.getEffectiveSpaceFilterIds()
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (requestSequence !== this.diaryLoadSequence) {
            return;
          }

          this.diary = response;
          this.loadError = '';
          this.cells = [];
          this.timelineRows = [];
          this.roomTimelineRows = [];
          this.weekColumns = [];
          this.weekSpaceRows = [];
          this.dayEvents = [];
          this.daySpaceColumns = [];

          if (this.selectedView === 'month') {
            this.monthCursor = this.getUtcMonthStart(this.parseIsoDateUtc(response.windowStart));
            this.cells = this.buildMonthCells(response.events);
            this.loadDemandHeatmapForWindow(venueId, this.toIsoDateUtc(this.cells[0]?.date ?? this.monthCursor), this.toIsoDateUtc(this.cells[this.cells.length - 1]?.date ?? this.monthCursor));
            return;
          }

          if (this.selectedView === 'week') {
            this.monthCursor = this.getWeekStart(this.parseIsoDateUtc(response.windowStart));
            this.weekColumns = this.buildWeekColumns(this.parseIsoDateUtc(response.windowStart), response.events);
            this.weekSpaceRows = this.buildWeekSpaceRows(this.weekColumns, response.spaces);
            if (this.weekColumns.length > 0) {
              this.loadDemandHeatmapForWindow(venueId, this.weekColumns[0].isoDate, this.weekColumns[this.weekColumns.length - 1].isoDate);
            } else {
              this.loadDemandHeatmapForWindow(venueId, this.toIsoDateUtc(this.monthCursor), this.toIsoDateUtc(this.monthCursor));
            }
            return;
          }

          this.monthCursor = this.getUtcDayStart(this.parseIsoDateUtc(response.windowStart));
          this.dayEvents = this.buildDayEvents(response.events);
          this.daySpaceColumns = this.buildDaySpaceColumns(this.dayEvents, response.spaces);
          this.loadDemandHeatmapForWindow(venueId, this.currentDayIso, this.currentDayIso);
        },
        error: () => {
          if (requestSequence !== this.diaryLoadSequence) {
            return;
          }

          this.loadError = 'Unable to load diary data right now.';
        }
      });
  }

  eventGroupsForDisplay(cell: { events: DiaryEventDto[] }): DiaryEventGroup[] {
    return this.groupEventsForCell(cell.events).slice(0, 3);
  }

  hiddenEventGroupsCount(cell: { events: DiaryEventDto[] }): number {
    return Math.max(this.groupEventsForCell(cell.events).length - 3, 0);
  }

  eventGroupCount(cell: { events: DiaryEventDto[] }): number {
    return this.groupEventsForCell(cell.events).length;
  }

  eventKey(event: DiaryEventDto): string {
    return `${event.id}-${event.spaceId}-${event.startUtc}`;
  }

  canDrag(event: DiaryEventDto): boolean {
    return !!event;
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
    this.queueMoveFromVerticalDrop(this.draggingEvent, dayIso, this.draggingEvent.spaceId, dragEvent, container, 'Move event to new time');
    this.draggingEvent = null;
  }

  onDropWeekSpaceColumn(dayIso: string, targetSpaceId: string, dragEvent: DragEvent, container: HTMLElement): void {
    if (!this.draggingEvent) {
      return;
    }

    dragEvent.preventDefault();
    this.queueMoveFromVerticalDrop(this.draggingEvent, dayIso, targetSpaceId, dragEvent, container, 'Move event to new time/space');
    this.draggingEvent = null;
  }

  onDropDaySpaceColumn(dayIso: string, targetSpaceId: string, dragEvent: DragEvent, container: HTMLElement): void {
    if (!this.draggingEvent) {
      return;
    }

    dragEvent.preventDefault();
    this.queueMoveFromVerticalDrop(this.draggingEvent, dayIso, targetSpaceId, dragEvent, container, 'Move event to new time/space');
    this.draggingEvent = null;
  }

  onDropRoomTrack(row: RoomTimelineRow, dragEvent: DragEvent, track: HTMLElement): void {
    if (!this.draggingEvent) {
      return;
    }

    dragEvent.preventDefault();

    const rect = track.getBoundingClientRect();
    if (rect.width <= 0) {
      this.draggingEvent = null;
      return;
    }

    const x = Math.max(0, Math.min(rect.width, dragEvent.clientX - rect.left));
    const normalized = x / rect.width;
    const timelineColumn = Math.min(
      EventDiaryComponent.timelineColumnCount - 1,
      Math.max(0, Math.floor(normalized * EventDiaryComponent.timelineColumnCount))
    );

    const firstMondayDay = this.getFirstMondayDay(this.monthCursor);
    const dayOfMonth = firstMondayDay + (timelineColumn - EventDiaryComponent.timelineColumnAnchor);
    const year = this.monthCursor.getUTCFullYear();
    const month = this.monthCursor.getUTCMonth();
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

    if (dayOfMonth < 1 || dayOfMonth > daysInMonth) {
      this.draggingEvent = null;
      return;
    }

    const source = this.draggingEvent;
    const targetDayIso = this.toIsoDateUtc(new Date(Date.UTC(year, month, dayOfMonth)));
    const originalStart = new Date(source.startUtc);
    const originalEnd = new Date(source.endUtc);
    const durationMinutes = Math.max(this.minuteStep, (originalEnd.getTime() - originalStart.getTime()) / 60000);

    const moved = this.buildMovedRange(
      targetDayIso,
      this.utcMinutesOfDay(originalStart) - this.dayStartHour * 60,
      durationMinutes
    );

    this.queueMove(source, moved.start, moved.end, row.spaceId, 'Move event in room timeline');
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

    const sizePixels = container.getBoundingClientRect().height;
    if (sizePixels <= 0) {
      return;
    }

    this.resizeState = {
      event,
      edge,
      view,
      dayIso: event.startUtc.slice(0, 10),
      originClient: mouseEvent.clientY,
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

  private queueMoveFromVerticalDrop(
    source: DiaryEventDto,
    dayIso: string,
    targetSpaceId: string,
    dragEvent: DragEvent,
    container: HTMLElement,
    actionLabel: string
  ): void {
    const rect = container.getBoundingClientRect();
    if (rect.height <= 0) {
      return;
    }

    const y = Math.max(0, Math.min(rect.height, dragEvent.clientY - rect.top));
    const minuteOffset = this.roundMinutesToStep((y / rect.height) * this.totalWindowMinutes);

    const originalStart = new Date(source.startUtc);
    const originalEnd = new Date(source.endUtc);
    const durationMinutes = Math.max(this.minuteStep, (originalEnd.getTime() - originalStart.getTime()) / 60000);

    const moved = this.buildMovedRange(dayIso, minuteOffset, durationMinutes);
    this.queueMove(source, moved.start, moved.end, targetSpaceId, actionLabel);
  }

  confirmPendingMove(): void {
    if (!this.pendingMove || this.applyingMove) {
      return;
    }

    if (this.pendingMove.checkingConflicts) {
      return;
    }

    if (this.pendingMove.conflicts.length > 0) {
      this.loadError = 'Resolve the scheduling conflict before confirming this move.';
      return;
    }

    const move = this.pendingMove;

    this.applyingMove = true;

    const moveRequest: MoveDiaryEventRequest = {
      eventType: move.event.eventType,
      eventId: move.event.id,
      targetSpaceId: move.targetSpaceId,
      newStartUtc: move.newStartUtc,
      newEndUtc: move.newEndUtc
    };

    this.api
      .moveDiaryEvent(moveRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.startMoveUndoWindow(move);
          this.applyingMove = false;
          this.pendingMove = null;
          this.loadDiary();
        },
        error: (error) => {
          this.applyingMove = false;
          const conflictMessage = this.getMoveErrorMessage(
            error,
            'Unable to move the event because it conflicts with another booking.'
          );
          this.loadError = conflictMessage;
          this.pendingMove = null;
        }
      });
  }

  cancelPendingMove(): void {
    this.pendingConflictCheckSequence += 1;
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
    if (event.isSubEvent && event.subEventName) {
      return event.subEventName;
    }

    const visualType = event.visualType || this.resolveLegacyVisualType(event);
    if (visualType === 'provisional') {
      return `${event.label} (P)`;
    }

    return event.label;
  }

  parentEventLabel(event: DiaryEventDto): string {
    return event.parentEventLabel || event.label;
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

  dayEventTopPercent(event: DiaryEventDto): number {
    const range = this.getRenderMinutesRange(event);
    return (range.startMinutes / this.totalWindowMinutes) * 100;
  }

  dayEventHeightPercent(event: DiaryEventDto): number {
    const range = this.getRenderMinutesRange(event);
    const value = (range.durationMinutes / this.totalWindowMinutes) * 100;
    return Math.max(value, 2);
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

    const pendingMove: PendingMove = {
      event,
      oldStartUtc: oldStart.toISOString(),
      oldEndUtc: oldEnd.toISOString(),
      newStartUtc: normalizedStart.toISOString(),
      newEndUtc: normalizedEnd.toISOString(),
      targetSpaceId,
      actionLabel,
      checkingConflicts: true,
      conflicts: [],
      conflictCheckMessage: 'Checking availability...'
    };

    this.pendingMove = pendingMove;
    this.checkPendingMoveConflicts(pendingMove);
  }

  undoLastMove(): void {
    if (!this.moveUndoState || this.moveUndoState.undoing) {
      return;
    }

    const undoState = this.moveUndoState;
    this.moveUndoState = { ...undoState, undoing: true };

    const rollbackRequest: MoveDiaryEventRequest = {
      eventType: undoState.eventType,
      eventId: undoState.eventId,
      targetSpaceId: undoState.oldSpaceId,
      newStartUtc: undoState.oldStartUtc,
      newEndUtc: undoState.oldEndUtc
    };

    this.api
      .moveDiaryEvent(rollbackRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.clearMoveUndoState();
          this.loadDiary();
        },
        error: (error) => {
          const errorMessage = this.getMoveErrorMessage(
            error,
            'Unable to undo the move because the original slot is no longer available.'
          );
          this.loadError = errorMessage;
          this.moveUndoState = { ...undoState, undoing: false };
        }
      });
  }

  private checkPendingMoveConflicts(pendingMove: PendingMove): void {
    const sequence = ++this.pendingConflictCheckSequence;

    const request: MoveDiaryEventRequest = {
      eventType: pendingMove.event.eventType,
      eventId: pendingMove.event.id,
      targetSpaceId: pendingMove.targetSpaceId,
      newStartUtc: pendingMove.newStartUtc,
      newEndUtc: pendingMove.newEndUtc
    };

    this.api
      .checkDiaryMoveConflicts(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (!this.pendingMove || sequence !== this.pendingConflictCheckSequence) {
            return;
          }

          this.pendingMove = {
            ...this.pendingMove,
            checkingConflicts: false,
            conflicts: response.conflicts ?? [],
            conflictCheckMessage: response.message || (response.hasConflicts ? 'Move would create a conflict.' : 'No conflicts detected.')
          };
        },
        error: () => {
          if (!this.pendingMove || sequence !== this.pendingConflictCheckSequence) {
            return;
          }

          this.pendingMove = {
            ...this.pendingMove,
            checkingConflicts: false,
            conflicts: [],
            conflictCheckMessage: 'Conflict check unavailable. You can still try to move the event.'
          };
        }
      });
  }

  private startMoveUndoWindow(move: PendingMove): void {
    this.clearMoveUndoState();

    this.moveUndoState = {
      eventType: move.event.eventType,
      eventId: move.event.id,
      eventLabel: move.event.label,
      oldStartUtc: move.oldStartUtc,
      oldEndUtc: move.oldEndUtc,
      oldSpaceId: move.event.spaceId,
      newStartUtc: move.newStartUtc,
      newEndUtc: move.newEndUtc,
      newSpaceId: move.targetSpaceId,
      expiresAt: Date.now() + 10000,
      secondsRemaining: 10,
      undoing: false
    };

    this.moveUndoIntervalHandle = window.setInterval(() => this.tickMoveUndoTimer(), 250);
  }

  private tickMoveUndoTimer(): void {
    if (!this.moveUndoState) {
      this.clearMoveUndoState();
      return;
    }

    const remainingMs = this.moveUndoState.expiresAt - Date.now();
    if (remainingMs <= 0) {
      this.clearMoveUndoState();
      return;
    }

    const secondsRemaining = Math.max(1, Math.ceil(remainingMs / 1000));
    if (secondsRemaining !== this.moveUndoState.secondsRemaining) {
      this.moveUndoState = {
        ...this.moveUndoState,
        secondsRemaining
      };
    }
  }

  private clearMoveUndoState(): void {
    if (this.moveUndoIntervalHandle) {
      clearInterval(this.moveUndoIntervalHandle);
      this.moveUndoIntervalHandle = null;
    }

    this.moveUndoState = null;
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

  private loadTimelineDiary(venueId: string, requestSequence: number): void {
    const monthStarts = Array.from({ length: EventDiaryComponent.timelineMonthWindow }, (_, offset) => {
      const month = new Date(this.monthCursor);
      month.setUTCMonth(month.getUTCMonth() + offset);
      return this.getUtcMonthStart(month);
    });

    const monthRequests = monthStarts.map((start) =>
      this.api.getDiary({
        venueId,
        view: 'month',
        startDate: this.toIsoDateUtc(start),
        spaceIds: this.getEffectiveSpaceFilterIds()
      })
    );

    forkJoin(monthRequests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (responses) => {
          if (requestSequence !== this.diaryLoadSequence) {
            return;
          }

          const allEvents = responses.flatMap((response) => response.events);
          this.diary = responses[0] ?? null;
          this.cells = [];
          this.weekColumns = [];
          this.weekSpaceRows = [];
          this.dayEvents = [];
          this.daySpaceColumns = [];
          this.timelineRows = this.buildTimelineRows(monthStarts, allEvents);
          this.roomTimelineRows = this.buildRoomTimelineRows(this.monthCursor, allEvents, this.diary?.spaces ?? []);
          this.loadError = '';
          const timelineFrom = this.toIsoDateUtc(monthStarts[0]);
          const lastTimelineMonth = monthStarts[monthStarts.length - 1];
          const timelineTo = this.toIsoDateUtc(new Date(Date.UTC(
            lastTimelineMonth.getUTCFullYear(),
            lastTimelineMonth.getUTCMonth() + 1,
            0
          )));
          this.loadDemandHeatmapForWindow(venueId, timelineFrom, timelineTo);
        },
        error: () => {
          if (requestSequence !== this.diaryLoadSequence) {
            return;
          }

          this.loadError = 'Unable to load diary data right now.';
        }
      });
  }

  private getMoveErrorMessage(error: unknown, fallback: string): string {
    const payload = error as { error?: unknown; message?: string } | null | undefined;
    const apiError = payload?.error;

    if (typeof apiError === 'string' && apiError.trim().length > 0) {
      return apiError;
    }

    if (
      apiError &&
      typeof apiError === 'object' &&
      'message' in apiError &&
      typeof (apiError as { message?: string }).message === 'string' &&
      (apiError as { message?: string }).message!.trim().length > 0
    ) {
      return (apiError as { message: string }).message;
    }

    if (typeof payload?.message === 'string' && payload.message.trim().length > 0) {
      return payload.message;
    }

    return fallback;
  }

  private loadSpaceFilterOptions(venueId: string): void {
    this.loadingSpaceFilters = true;
    this.spaceFilterError = '';

    forkJoin({
      spaces: this.api.getVenueSpaces(venueId),
      combinations: this.api.getSpaceCombinations(venueId)
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ spaces, combinations }) => {
          const options = this.buildSpaceFilterOptions(spaces, combinations);
          this.spaceFilterOptions = options;
          this.activeSpaceFilterMap = new Map(options.map((option) => [option.key, option]));
          this.selectedSpaceFilterKeys = this.selectedSpaceFilterKeys.filter((key) => this.activeSpaceFilterMap.has(key));
          this.loadingSpaceFilters = false;
          this.syncQueryParams();
          this.loadDiary();
        },
        error: () => {
          this.loadingSpaceFilters = false;
          this.spaceFilterOptions = [];
          this.activeSpaceFilterMap.clear();
          this.spaceFilterError = 'Unable to load spaces right now.';
        }
      });
  }

  private loadDemandHeatmapForWindow(venueId: string, fromDate: string, toDate: string): void {
    if (!this.showDemandHeatmap) {
      this.demandHeatmapByDate.clear();
      this.demandHeatmapMessage = '';
      this.demandHeatmapLoading = false;
      return;
    }

    const sequence = ++this.demandHeatmapRequestSequence;
    this.demandHeatmapLoading = true;
    this.demandHeatmapMessage = '';

    this.api
      .getAiDemandHeatmap({
        venueId,
        fromDate,
        toDate,
        spaceIds: this.getEffectiveSpaceFilterIds()
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (sequence !== this.demandHeatmapRequestSequence) {
            return;
          }

          this.demandHeatmapByDate = new Map((response.cells ?? []).map((cell) => [cell.date, cell]));
          this.demandHeatmapLoading = false;
          this.demandHeatmapMessage =
            response.hasSufficientData
              ? ''
              : response.message || 'Gathering data...';
        },
        error: () => {
          if (sequence !== this.demandHeatmapRequestSequence) {
            return;
          }

          this.demandHeatmapByDate.clear();
          this.demandHeatmapLoading = false;
          this.demandHeatmapMessage = 'Heatmap data is temporarily unavailable.';
        }
      });
  }

  private buildSpaceFilterOptions(spaces: SpaceSummaryDto[], combinations: SpaceCombinationDto[]): SpaceFilterOption[] {
    const activeSpaces = spaces
      .filter((space) => space.isActive)
      .sort((left, right) => left.name.localeCompare(right.name, undefined, { sensitivity: 'base' }));

    const activeSpaceIdSet = new Set(activeSpaces.map((space) => space.id));
    const options: SpaceFilterOption[] = [];

    options.push(
      ...activeSpaces.map((space) => ({
        key: `space:${space.id}`,
        label: space.name,
        type: 'space' as const,
        spaceIds: [space.id]
      }))
    );

    const combinationOptions: SpaceFilterOption[] = [];
    for (const combination of combinations) {
      const constituentSpaceIds = Array.from(new Set(combination.spaceIds.filter((spaceId) => activeSpaceIdSet.has(spaceId))));
      if (constituentSpaceIds.length === 0) {
        continue;
      }

      combinationOptions.push({
        key: `combo:${combination.id}`,
        label: combination.name,
        type: 'combination',
        spaceIds: constituentSpaceIds
      });
    }

    combinationOptions.sort((left, right) => left.label.localeCompare(right.label, undefined, { sensitivity: 'base' }));

    options.push(...combinationOptions);
    return options;
  }

  private getEffectiveSpaceFilterIds(): string[] | undefined {
    if (this.selectedSpaceFilterKeys.length === 0) {
      return undefined;
    }

    const ids = new Set<string>();
    for (const key of this.selectedSpaceFilterKeys) {
      const option = this.activeSpaceFilterMap.get(key);
      if (!option) {
        continue;
      }

      option.spaceIds.forEach((spaceId) => ids.add(spaceId));
    }

    return ids.size > 0 ? Array.from(ids) : undefined;
  }

  private restoreStateFromQueryParams(): void {
    const query = this.route.snapshot.queryParamMap;

    const viewParam = (query.get('view') || '').trim().toLowerCase();
    if (viewParam === 'month' || viewParam === 'timeline' || viewParam === 'week' || viewParam === 'day') {
      this.selectedView = viewParam;
    }

    const startDateParam = query.get('startDate');
    if (startDateParam) {
      const parsed = this.parseIsoDateParam(startDateParam);
      if (parsed) {
        if (this.selectedView === 'week') {
          this.monthCursor = this.getWeekStart(parsed);
        } else if (this.selectedView === 'day') {
          this.monthCursor = this.getUtcDayStart(parsed);
        } else {
          this.monthCursor = this.getUtcMonthStart(parsed);
        }
      }
    }

    const spacesParam = query.get('spaces');
    this.selectedSpaceFilterKeys = this.parseSpaceFilterQuery(spacesParam);

    const timelineLayoutParam = (query.get('timelineLayout') || '').trim().toLowerCase();
    if (timelineLayoutParam === 'room') {
      this.timelineLayout = 'room';
    }

    const weekLayoutParam = (query.get('weekLayout') || '').trim().toLowerCase();
    if (weekLayoutParam === 'space') {
      this.weekLayout = 'space';
    }

    const heatmapParam = (query.get('heatmap') || '').trim();
    if (heatmapParam === '1' || heatmapParam.toLowerCase() === 'true') {
      this.showDemandHeatmap = true;
    }
  }

  private parseSpaceFilterQuery(value: string | null): string[] {
    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map((token) => token.trim())
      .filter((token) => token.length > 0)
      .map((token) => {
        const normalized = decodeURIComponent(token);
        if (normalized.startsWith('space:') || normalized.startsWith('combo:')) {
          return normalized;
        }

        return `space:${normalized}`;
      });
  }

  private parseIsoDateParam(value: string): Date | null {
    const trimmed = value.trim();
    const pattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!pattern.test(trimmed)) {
      return null;
    }

    const parsed = this.parseIsoDateUtc(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private syncQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      replaceUrl: true,
      queryParams: {
        view: this.selectedView,
        startDate: this.toIsoDateUtc(this.monthCursor),
        spaces: this.selectedSpaceFilterKeys.length > 0 ? this.selectedSpaceFilterKeys.join(',') : null,
        timelineLayout: this.timelineLayout === 'room' ? 'room' : null,
        weekLayout: this.weekLayout === 'space' ? 'space' : null,
        heatmap: this.showDemandHeatmap ? '1' : null
      },
      queryParamsHandling: 'merge'
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

  private buildRoomTimelineRows(monthStartCursor: Date, events: DiaryEventDto[], spaces: DiaryResponse['spaces']): RoomTimelineRow[] {
    const monthStart = this.getUtcMonthStart(monthStartCursor);
    const daysInMonth = new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 0)).getUTCDate();
    const firstMondayDay = this.getFirstMondayDay(monthStart);
    const monthEndExclusive = new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 1));

    const rows = spaces
      .filter((space) => space.spaceId !== this.unassignedSpaceId)
      .map((space) => {
        const rowEvents = events
          .filter((event) => event.spaceId === space.spaceId)
          .filter((event) => {
            const eventStart = new Date(event.startUtc);
            const eventEnd = new Date(event.endUtc);
            return eventStart < monthEndExclusive && eventEnd > monthStart;
          })
          .sort((left, right) => new Date(left.startUtc).getTime() - new Date(right.startUtc).getTime());

        const laneEndColumns: number[] = [];
        const bars: RoomTimelineBar[] = [];

        for (const event of rowEvents) {
          const eventStart = new Date(event.startUtc);
          const eventEnd = new Date(event.endUtc);

          const startDay = eventStart < monthStart ? 1 : eventStart.getUTCDate();
          const effectiveEnd = eventEnd <= monthStart ? monthStart : eventEnd;
          const rawEndDay = eventEnd >= monthEndExclusive ? daysInMonth : effectiveEnd.getUTCDate();
          const endDay = Math.max(startDay, rawEndDay);

          const startColumn = EventDiaryComponent.timelineColumnAnchor + (startDay - firstMondayDay);
          const endColumn = EventDiaryComponent.timelineColumnAnchor + (endDay - firstMondayDay);

          if (endColumn < 0 || startColumn > EventDiaryComponent.timelineColumnCount - 1) {
            continue;
          }

          const clippedStartColumn = Math.max(0, startColumn);
          const clippedEndColumn = Math.min(EventDiaryComponent.timelineColumnCount - 1, endColumn);
          if (clippedEndColumn < clippedStartColumn) {
            continue;
          }

          let lane = laneEndColumns.findIndex((lastEndColumn) => clippedStartColumn > lastEndColumn);
          if (lane < 0) {
            lane = laneEndColumns.length;
            laneEndColumns.push(clippedEndColumn);
          } else {
            laneEndColumns[lane] = clippedEndColumn;
          }

          bars.push({
            key: `${event.id}-${space.spaceId}-${event.startUtc}`,
            event,
            lane,
            leftPercent: (clippedStartColumn / EventDiaryComponent.timelineColumnCount) * 100,
            widthPercent: Math.max(((clippedEndColumn - clippedStartColumn + 1) / EventDiaryComponent.timelineColumnCount) * 100, 2)
          });
        }

        return {
          spaceId: space.spaceId,
          spaceName: space.spaceName,
          laneCount: Math.max(laneEndColumns.length, 1),
          bars
        };
      })
      .sort((left, right) => left.spaceName.localeCompare(right.spaceName, undefined, { sensitivity: 'base' }));

    return rows;
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

  private buildWeekSpaceRows(weekColumns: WeekDayColumn[], spaces: DiaryResponse['spaces']): WeekSpaceRow[] {
    const sortedSpaces = this.getSortedDiarySpaces(spaces, weekColumns.flatMap((day) => day.events));

    return sortedSpaces.map((space) => ({
      spaceId: space.spaceId,
      spaceName: space.spaceName,
      days: weekColumns.map((day) => ({
        isoDate: day.isoDate,
        events: day.events.filter((event) => event.spaceId === space.spaceId)
      }))
    }));
  }

  private buildDayEvents(events: DiaryEventDto[]): DiaryEventDto[] {
    return events
      .slice()
      .sort((left, right) => new Date(left.startUtc).getTime() - new Date(right.startUtc).getTime());
  }

  private buildDaySpaceColumns(events: DiaryEventDto[], spaces: DiaryResponse['spaces']): DaySpaceColumn[] {
    const sortedSpaces = this.getSortedDiarySpaces(spaces, events);

    return sortedSpaces.map((space) => ({
      spaceId: space.spaceId,
      spaceName: space.spaceName,
      events: events
        .filter((event) => event.spaceId === space.spaceId)
        .sort((left, right) => new Date(left.startUtc).getTime() - new Date(right.startUtc).getTime())
    }));
  }

  private getSortedDiarySpaces(
    spaces: DiaryResponse['spaces'],
    events: DiaryEventDto[]
  ): Array<{ spaceId: string; spaceName: string }> {
    const mappedSpaces = spaces.map((space) => ({ spaceId: space.spaceId, spaceName: space.spaceName }));
    const known = new Set(mappedSpaces.map((space) => space.spaceId));

    for (const event of events) {
      if (known.has(event.spaceId)) {
        continue;
      }

      known.add(event.spaceId);
      mappedSpaces.push({
        spaceId: event.spaceId,
        spaceName: event.spaceName || 'Unassigned'
      });
    }

    return mappedSpaces
      .filter((space) => space.spaceId !== this.unassignedSpaceId || events.some((event) => event.spaceId === this.unassignedSpaceId))
      .sort((left, right) => left.spaceName.localeCompare(right.spaceName, undefined, { sensitivity: 'base' }));
  }

  private groupEventsForCell(events: DiaryEventDto[]): DiaryEventGroup[] {
    const sorted = events
      .slice()
      .sort((left, right) => new Date(left.startUtc).getTime() - new Date(right.startUtc).getTime());

    const groups: DiaryEventGroup[] = [];
    const nestedLookup = new Map<string, DiaryEventGroup>();

    for (const event of sorted) {
      if (event.eventType === 'Enquiry' && event.isSubEvent && event.enquiryId) {
        const nestedKey = `nested-${event.enquiryId}`;
        let group = nestedLookup.get(nestedKey);
        if (!group) {
          group = {
            key: nestedKey,
            nested: true,
            parentLabel: this.parentEventLabel(event),
            events: []
          };
          nestedLookup.set(nestedKey, group);
          groups.push(group);
        }

        group.events.push(event);
        continue;
      }

      groups.push({
        key: `single-${this.eventKey(event)}`,
        nested: false,
        parentLabel: this.eventDisplayLabel(event),
        events: [event]
      });
    }

    groups.forEach((group) => {
      group.events.sort((left, right) => new Date(left.startUtc).getTime() - new Date(right.startUtc).getTime());
    });

    return groups;
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
