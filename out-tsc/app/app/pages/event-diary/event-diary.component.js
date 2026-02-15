import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.key;
function _forTrack1($index, $item) { return this.eventKey($item); }
function EventDiaryComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 2);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.loadError);
} }
function EventDiaryComponent_For_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const weekday_r2 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(weekday_r2);
} }
function EventDiaryComponent_For_47_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const cell_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", cell_r4.events.length, " ", cell_r4.events.length === 1 ? "event" : "events");
} }
function EventDiaryComponent_For_47_For_7_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 31)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span")(4, "b");
    i0.ɵɵtext(5, "Covers:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "span")(8, "b");
    i0.ɵɵtext(9, "Timing:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(10);
    i0.ɵɵpipe(11, "date");
    i0.ɵɵpipe(12, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "span")(14, "b");
    i0.ɵɵtext(15, "Event style:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "span")(18, "b");
    i0.ɵɵtext(19, "Status:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "span")(22, "b");
    i0.ɵɵtext(23, "Space:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(24);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "span")(26, "b");
    i0.ɵɵtext(27, "Event manager:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(28);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const event_r6 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(event_r6.label);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", event_r6.covers || "-");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2(" ", i0.ɵɵpipeBind2(11, 8, event_r6.startUtc, "HH:mm"), "-", i0.ɵɵpipeBind2(12, 11, event_r6.endUtc, "HH:mm"));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1(" ", event_r6.eventStyle || "-");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", event_r6.statusKey || event_r6.enquiryStatus || event_r6.eventType);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", event_r6.spaceName);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", event_r6.eventManagerName || "-");
} }
function EventDiaryComponent_For_47_For_7_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 28)(1, "button", 30);
    i0.ɵɵlistener("dragstart", function EventDiaryComponent_For_47_For_7_Template_button_dragstart_1_listener($event) { const event_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.onDragStart(event_r6, $event)); })("mouseenter", function EventDiaryComponent_For_47_For_7_Template_button_mouseenter_1_listener() { const event_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.hoveredEventKey = ctx_r0.eventKey(event_r6)); })("mouseleave", function EventDiaryComponent_For_47_For_7_Template_button_mouseleave_1_listener() { i0.ɵɵrestoreView(_r5); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.hoveredEventKey = null); })("click", function EventDiaryComponent_For_47_For_7_Template_button_click_1_listener() { const event_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.openDetails(event_r6)); });
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(3, EventDiaryComponent_For_47_For_7_Conditional_3_Template, 29, 14, "div", 31);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const event_r6 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r0.eventChipClass(event_r6));
    i0.ɵɵattribute("draggable", ctx_r0.canDrag(event_r6));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.eventDisplayLabel(event_r6), " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.hoveredEventKey === ctx_r0.eventKey(event_r6) ? 3 : -1);
} }
function EventDiaryComponent_For_47_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 29);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const cell_r4 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("+", ctx_r0.hiddenEventsCount(cell_r4), " more");
} }
function EventDiaryComponent_For_47_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 23);
    i0.ɵɵlistener("dragover", function EventDiaryComponent_For_47_Template_article_dragover_0_listener($event) { i0.ɵɵrestoreView(_r3); return i0.ɵɵresetView($event.preventDefault()); })("drop", function EventDiaryComponent_For_47_Template_article_drop_0_listener() { const cell_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onDropDay(cell_r4.key)); });
    i0.ɵɵelementStart(1, "header", 24)(2, "span", 25);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(4, EventDiaryComponent_For_47_Conditional_4_Template, 2, 2, "span", 26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 27);
    i0.ɵɵrepeaterCreate(6, EventDiaryComponent_For_47_For_7_Template, 4, 4, "div", 28, _forTrack1, true);
    i0.ɵɵconditionalCreate(8, EventDiaryComponent_For_47_Conditional_8_Template, 2, 1, "span", 29);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const cell_r4 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("outside-month", !cell_r4.inCurrentMonth);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(cell_r4.dayNumber);
    i0.ɵɵadvance();
    i0.ɵɵconditional(cell_r4.events.length > 0 ? 4 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.eventsForDisplay(cell_r4));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.hiddenEventsCount(cell_r4) > 0 ? 8 : -1);
} }
export class EventDiaryComponent {
    constructor() {
        this.api = inject(ApiService);
        this.auth = inject(AuthService);
        this.destroyRef = inject(DestroyRef);
        this.router = inject(Router);
        this.unassignedSpaceId = '00000000-0000-0000-0000-000000000000';
        this.weekdayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        this.diary = null;
        this.cells = [];
        this.hoveredEventKey = null;
        this.draggingEvent = null;
        this.loadError = '';
        this.monthCursor = this.getUtcMonthStart(new Date());
        this.refreshIntervalHandle = null;
    }
    get venueId() {
        return this.auth.selectedVenueId;
    }
    get monthLabel() {
        return new Intl.DateTimeFormat('en-GB', {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC'
        }).format(this.monthCursor);
    }
    ngOnInit() {
        this.auth.session$
            .pipe(map((session) => session?.venueId ?? null), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
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
    onWindowFocus() {
        this.loadDiary();
    }
    onVisibilityChange() {
        if (document.visibilityState === 'visible') {
            this.loadDiary();
        }
    }
    shiftMonth(offset) {
        const next = new Date(this.monthCursor);
        next.setUTCMonth(next.getUTCMonth() + offset);
        this.monthCursor = this.getUtcMonthStart(next);
        this.loadDiary();
    }
    goToToday() {
        this.monthCursor = this.getUtcMonthStart(new Date());
        this.loadDiary();
    }
    addEvent() {
        this.router.navigate(['/enquiries'], {
            queryParams: { statusTab: 'new-unanswered' }
        });
    }
    loadDiary() {
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
    eventsForDisplay(cell) {
        return cell.events.slice(0, 3);
    }
    hiddenEventsCount(cell) {
        return Math.max(cell.events.length - 3, 0);
    }
    eventKey(event) {
        return `${event.id}-${event.spaceId}-${event.startUtc}`;
    }
    canDrag(event) {
        return event.spaceId !== this.unassignedSpaceId;
    }
    onDragStart(event, browserEvent) {
        if (!this.canDrag(event)) {
            browserEvent?.preventDefault();
            this.draggingEvent = null;
            return;
        }
        this.draggingEvent = event;
    }
    onDropDay(dayKey) {
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
        const payload = {
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
    openDetails(event) {
        if (event.enquiryId) {
            this.router.navigate(['/enquiries'], { queryParams: { enquiry: event.enquiryId } });
        }
    }
    eventChipClass(event) {
        const visualType = event.visualType || this.resolveLegacyVisualType(event);
        return event.spaceId === this.unassignedSpaceId ? `status-${visualType} unassigned` : `status-${visualType}`;
    }
    eventDisplayLabel(event) {
        const visualType = event.visualType || this.resolveLegacyVisualType(event);
        if (visualType === 'provisional') {
            return `${event.label} (P)`;
        }
        return event.label;
    }
    buildMonthCells(events) {
        const eventsByDate = new Map();
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
        const cells = [];
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
    getUtcMonthStart(date) {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    }
    parseIsoDateUtc(dayKey) {
        const [year, month, day] = dayKey.split('-').map((value) => Number(value));
        return new Date(Date.UTC(year, month - 1, day));
    }
    toIsoDateUtc(date) {
        return date.toISOString().slice(0, 10);
    }
    resolveLegacyVisualType(event) {
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
    static { this.ɵfac = function EventDiaryComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || EventDiaryComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: EventDiaryComponent, selectors: [["app-event-diary"]], hostBindings: function EventDiaryComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("focus", function EventDiaryComponent_focus_HostBindingHandler() { return ctx.onWindowFocus(); }, i0.ɵɵresolveWindow)("visibilitychange", function EventDiaryComponent_visibilitychange_HostBindingHandler() { return ctx.onVisibilityChange(); }, i0.ɵɵresolveDocument);
        } }, decls: 48, vars: 2, consts: [[1, "diary-page"], [1, "title-block"], [1, "error-banner"], [1, "calendar-card"], [1, "calendar-toolbar"], [1, "month-nav"], [1, "month-arrows"], ["type", "button", "aria-label", "Previous month", 3, "click"], ["type", "button", "aria-label", "Next month", 3, "click"], ["type", "button", 1, "today-btn", 3, "click"], [1, "toolbar-right"], [1, "legend-inline"], [1, "legend-chip", "status-confirmed"], [1, "legend-chip", "status-provisional"], [1, "legend-chip", "status-tentative"], [1, "legend-chip", "status-open-proposal"], [1, "legend-chip", "status-appointment"], [1, "legend-chip", "status-venue-event"], ["type", "button", 1, "add-event-btn", 3, "click"], [1, "calendar-grid-wrap"], [1, "weekdays-row"], [1, "month-grid"], [1, "day-cell", 3, "outside-month"], [1, "day-cell", 3, "dragover", "drop"], [1, "day-header"], [1, "day-number"], [1, "event-count"], [1, "event-list"], [1, "event-chip-wrap"], [1, "more-events"], ["type", "button", 1, "event-chip", 3, "dragstart", "mouseenter", "mouseleave", "click", "ngClass"], [1, "event-popover"]], template: function EventDiaryComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "h1");
            i0.ɵɵtext(3, "Event Diary");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "p");
            i0.ɵɵtext(5, "Manage your venue bookings and proposals efficiently.");
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(6, EventDiaryComponent_Conditional_6_Template, 2, 1, "p", 2);
            i0.ɵɵelementStart(7, "section", 3)(8, "div", 4)(9, "div", 5)(10, "h2");
            i0.ɵɵtext(11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "div", 6)(13, "button", 7);
            i0.ɵɵlistener("click", function EventDiaryComponent_Template_button_click_13_listener() { return ctx.shiftMonth(-1); });
            i0.ɵɵtext(14, "\u276E");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "button", 8);
            i0.ɵɵlistener("click", function EventDiaryComponent_Template_button_click_15_listener() { return ctx.shiftMonth(1); });
            i0.ɵɵtext(16, "\u276F");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(17, "button", 9);
            i0.ɵɵlistener("click", function EventDiaryComponent_Template_button_click_17_listener() { return ctx.goToToday(); });
            i0.ɵɵtext(18, "Today");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(19, "div", 10)(20, "div", 11)(21, "span");
            i0.ɵɵelement(22, "i", 12);
            i0.ɵɵtext(23, " Confirmed");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "span");
            i0.ɵɵelement(25, "i", 13);
            i0.ɵɵtext(26, " Provisional");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "span");
            i0.ɵɵelement(28, "i", 14);
            i0.ɵɵtext(29, " New / Tentative");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "span");
            i0.ɵɵelement(31, "i", 15);
            i0.ɵɵtext(32, " Open Proposal");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(33, "span");
            i0.ɵɵelement(34, "i", 16);
            i0.ɵɵtext(35, " Appointment");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(36, "span");
            i0.ɵɵelement(37, "i", 17);
            i0.ɵɵtext(38, " Venue Event");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(39, "button", 18);
            i0.ɵɵlistener("click", function EventDiaryComponent_Template_button_click_39_listener() { return ctx.addEvent(); });
            i0.ɵɵtext(40, "+ Add Event");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(41, "div", 19)(42, "div", 20);
            i0.ɵɵrepeaterCreate(43, EventDiaryComponent_For_44_Template, 2, 1, "div", null, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(45, "div", 21);
            i0.ɵɵrepeaterCreate(46, EventDiaryComponent_For_47_Template, 9, 5, "article", 22, _forTrack0);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵconditional(ctx.loadError ? 6 : -1);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.monthLabel);
            i0.ɵɵadvance(32);
            i0.ɵɵrepeater(ctx.weekdayLabels);
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.cells);
        } }, dependencies: [NgClass, DatePipe], styles: [".diary-page[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n}\n\n.title-block[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 2rem;\n  color: #0f172a;\n  font-weight: 800;\n}\n\n.title-block[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.28rem 0 0;\n  color: #64748b;\n  font-size: 1.06rem;\n  font-weight: 600;\n}\n\n.error-banner[_ngcontent-%COMP%] {\n  margin: 0;\n  border: 1px solid #fecaca;\n  border-radius: 10px;\n  background: #fff1f2;\n  color: #b91c1c;\n  padding: 0.6rem 0.8rem;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n.calendar-card[_ngcontent-%COMP%] {\n  border: 1px solid #dbe4ef;\n  border-radius: 22px;\n  background: #ffffff;\n  overflow: hidden;\n  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);\n}\n\n.calendar-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  padding: 1.35rem 1.5rem;\n  border-bottom: 1px solid #e8edf5;\n}\n\n.month-nav[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 1rem;\n}\n\n.month-nav[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 2.2rem;\n  line-height: 1;\n  color: #1e293b;\n  font-weight: 800;\n}\n\n.month-arrows[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  overflow: hidden;\n  background: #f8fafc;\n}\n\n.month-arrows[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  color: #475569;\n  width: 34px;\n  height: 34px;\n  font-size: 1rem;\n  font-weight: 800;\n}\n\n.month-arrows[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]    + button[_ngcontent-%COMP%] {\n  border-left: 1px solid #e2e8f0;\n}\n\n.today-btn[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  color: #475569;\n  font-size: 1rem;\n  font-weight: 700;\n}\n\n.toolbar-right[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.9rem;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n}\n\n.legend-inline[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.8rem;\n  padding-right: 0.8rem;\n  border-right: 1px solid #e2e8f0;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n}\n\n.legend-inline[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  color: #64748b;\n  font-size: 0.86rem;\n  font-weight: 700;\n}\n\n.legend-chip[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 10px;\n  border-radius: 999px;\n  border: 1px solid transparent;\n  display: inline-block;\n}\n\n.legend-chip.status-confirmed[_ngcontent-%COMP%] {\n  background: #16a34a;\n}\n\n.legend-chip.status-provisional[_ngcontent-%COMP%] {\n  border: 1px dashed #d97706;\n  background-image: repeating-linear-gradient(45deg, #fef3c7, #fef3c7 4px, #fffbeb 4px, #fffbeb 8px);\n}\n\n.legend-chip.status-tentative[_ngcontent-%COMP%] {\n  border: 1px dashed #60a5fa;\n  background: #eff6ff;\n}\n\n.legend-chip.status-open-proposal[_ngcontent-%COMP%] {\n  background: #2563eb;\n}\n\n.legend-chip.status-appointment[_ngcontent-%COMP%] {\n  border: 2px solid #3b82f6;\n  background: #ffffff;\n}\n\n.legend-chip.status-venue-event[_ngcontent-%COMP%] {\n  background: #0d9488;\n}\n\n.add-event-btn[_ngcontent-%COMP%] {\n  border: 1px solid #1d4ed8;\n  background: #2563eb;\n  color: #fff;\n  border-radius: 13px;\n  padding: 0.62rem 1.15rem;\n  font-size: 1rem;\n  font-weight: 700;\n  box-shadow: 0 10px 18px rgba(37, 99, 235, 0.22);\n}\n\n.calendar-grid-wrap[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n\n.weekdays-row[_ngcontent-%COMP%], \n.month-grid[_ngcontent-%COMP%] {\n  min-width: 1080px;\n}\n\n.weekdays-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  border-bottom: 1px solid #e8edf5;\n}\n\n.weekdays-row[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 0.7rem 0.45rem;\n  color: #94a3b8;\n  font-size: 0.97rem;\n  font-weight: 800;\n  letter-spacing: 0.04em;\n}\n\n.month-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n}\n\n.day-cell[_ngcontent-%COMP%] {\n  border-right: 1px solid #eef2f8;\n  border-bottom: 1px solid #eef2f8;\n  min-height: 168px;\n  padding: 0.68rem 0.62rem 0.72rem;\n  display: grid;\n  gap: 0.52rem;\n  align-content: start;\n  background: #ffffff;\n}\n\n.day-cell[_ngcontent-%COMP%]:nth-child(7n) {\n  border-right: 0;\n}\n\n.day-cell.outside-month[_ngcontent-%COMP%] {\n  background: #fbfdff;\n}\n\n.day-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.38rem;\n}\n\n.day-number[_ngcontent-%COMP%] {\n  color: #475569;\n  font-size: 1.55rem;\n  font-weight: 700;\n  line-height: 1;\n}\n\n.day-cell.outside-month[_ngcontent-%COMP%]   .day-number[_ngcontent-%COMP%] {\n  color: #c4cfdd;\n}\n\n.event-count[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n\n.event-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.38rem;\n  align-content: start;\n}\n\n.event-chip-wrap[_ngcontent-%COMP%] {\n  position: relative;\n}\n\n.event-chip[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid transparent;\n  border-radius: 8px;\n  padding: 0.34rem 0.55rem;\n  text-align: left;\n  font-size: 0.82rem;\n  font-weight: 700;\n  line-height: 1.25;\n  color: #ffffff;\n  cursor: pointer;\n}\n\n.event-chip.status-confirmed[_ngcontent-%COMP%] {\n  background: #16a34a;\n}\n\n.event-chip.status-provisional[_ngcontent-%COMP%] {\n  color: #1f2937;\n  border: 2px dashed #d97706;\n  background-image: repeating-linear-gradient(45deg, #fef3c7, #fef3c7 4px, #fffbeb 4px, #fffbeb 8px);\n}\n\n.event-chip.status-new[_ngcontent-%COMP%], \n.event-chip.status-tentative[_ngcontent-%COMP%] {\n  color: #1e40af;\n  border: 1px dashed #60a5fa;\n  background: #eff6ff;\n}\n\n.event-chip.status-open-proposal[_ngcontent-%COMP%] {\n  background: #2563eb;\n}\n\n.event-chip.status-completed[_ngcontent-%COMP%] {\n  background: #86efac;\n  color: #14532d;\n}\n\n.event-chip.status-blocked[_ngcontent-%COMP%] {\n  background: #9ca3af;\n}\n\n.event-chip.status-appointment[_ngcontent-%COMP%] {\n  background: #ffffff;\n  color: #1d4ed8;\n  border: 2px solid #3b82f6;\n}\n\n.event-chip.status-venue-event[_ngcontent-%COMP%] {\n  background: #0d9488;\n}\n\n.event-chip.status-lost[_ngcontent-%COMP%] {\n  background: #fecaca;\n  color: #991b1b;\n}\n\n.event-chip.status-archived[_ngcontent-%COMP%] {\n  background: #e5e7eb;\n  color: #334155;\n}\n\n.event-chip.unassigned[_ngcontent-%COMP%] {\n  background: #64748b;\n  color: #ffffff;\n  border-color: #64748b;\n}\n\n.more-events[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: 0.75rem;\n  font-weight: 700;\n}\n\n.event-popover[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 8px);\n  left: 0;\n  z-index: 30;\n  width: 255px;\n  border-radius: 12px;\n  border: 1px solid #1e293b;\n  background: #0f172a;\n  color: #f8fafc;\n  padding: 0.5rem 0.56rem;\n  display: grid;\n  gap: 0.2rem;\n  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.35);\n}\n\n.event-popover[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n}\n\n.event-popover[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.67rem;\n  color: #cbd5e1;\n}\n\n.event-popover[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  color: #ffffff;\n  font-weight: 700;\n}\n\n@media (max-width: 1024px) {\n  .calendar-toolbar[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n\n  .toolbar-right[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: flex-start;\n  }\n}\n\n@media (max-width: 720px) {\n  .title-block[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.65rem;\n  }\n\n  .title-block[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    font-size: 0.94rem;\n  }\n\n  .month-nav[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n\n  .legend-inline[_ngcontent-%COMP%] {\n    border-right: 0;\n    padding-right: 0;\n    justify-content: flex-start;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(EventDiaryComponent, [{
        type: Component,
        args: [{ selector: 'app-event-diary', imports: [NgClass, DatePipe], template: "<section class=\"diary-page\">\n  <header class=\"title-block\">\n    <h1>Event Diary</h1>\n    <p>Manage your venue bookings and proposals efficiently.</p>\n  </header>\n\n  @if (loadError) {\n    <p class=\"error-banner\">{{ loadError }}</p>\n  }\n\n  <section class=\"calendar-card\">\n    <div class=\"calendar-toolbar\">\n      <div class=\"month-nav\">\n        <h2>{{ monthLabel }}</h2>\n        <div class=\"month-arrows\">\n          <button type=\"button\" (click)=\"shiftMonth(-1)\" aria-label=\"Previous month\">&#10094;</button>\n          <button type=\"button\" (click)=\"shiftMonth(1)\" aria-label=\"Next month\">&#10095;</button>\n        </div>\n        <button type=\"button\" class=\"today-btn\" (click)=\"goToToday()\">Today</button>\n      </div>\n\n      <div class=\"toolbar-right\">\n        <div class=\"legend-inline\">\n          <span><i class=\"legend-chip status-confirmed\"></i> Confirmed</span>\n          <span><i class=\"legend-chip status-provisional\"></i> Provisional</span>\n          <span><i class=\"legend-chip status-tentative\"></i> New / Tentative</span>\n          <span><i class=\"legend-chip status-open-proposal\"></i> Open Proposal</span>\n          <span><i class=\"legend-chip status-appointment\"></i> Appointment</span>\n          <span><i class=\"legend-chip status-venue-event\"></i> Venue Event</span>\n        </div>\n        <button type=\"button\" class=\"add-event-btn\" (click)=\"addEvent()\">+ Add Event</button>\n      </div>\n    </div>\n\n    <div class=\"calendar-grid-wrap\">\n      <div class=\"weekdays-row\">\n        @for (weekday of weekdayLabels; track weekday) {\n          <div>{{ weekday }}</div>\n        }\n      </div>\n\n      <div class=\"month-grid\">\n        @for (cell of cells; track cell.key) {\n          <article\n            class=\"day-cell\"\n            [class.outside-month]=\"!cell.inCurrentMonth\"\n            (dragover)=\"$event.preventDefault()\"\n            (drop)=\"onDropDay(cell.key)\">\n            <header class=\"day-header\">\n              <span class=\"day-number\">{{ cell.dayNumber }}</span>\n              @if (cell.events.length > 0) {\n                <span class=\"event-count\">{{ cell.events.length }} {{ cell.events.length === 1 ? 'event' : 'events' }}</span>\n              }\n            </header>\n\n            <div class=\"event-list\">\n              @for (event of eventsForDisplay(cell); track eventKey(event)) {\n                <div class=\"event-chip-wrap\">\n                  <button\n                    type=\"button\"\n                    class=\"event-chip\"\n                    [ngClass]=\"eventChipClass(event)\"\n                    [attr.draggable]=\"canDrag(event)\"\n                    (dragstart)=\"onDragStart(event, $event)\"\n                    (mouseenter)=\"hoveredEventKey = eventKey(event)\"\n                    (mouseleave)=\"hoveredEventKey = null\"\n                    (click)=\"openDetails(event)\">\n                    {{ eventDisplayLabel(event) }}\n                  </button>\n\n                  @if (hoveredEventKey === eventKey(event)) {\n                    <div class=\"event-popover\">\n                      <strong>{{ event.label }}</strong>\n                      <span><b>Covers:</b> {{ event.covers || '-' }}</span>\n                      <span><b>Timing:</b> {{ event.startUtc | date: 'HH:mm' }}-{{ event.endUtc | date: 'HH:mm' }}</span>\n                      <span><b>Event style:</b> {{ event.eventStyle || '-' }}</span>\n                      <span><b>Status:</b> {{ event.statusKey || event.enquiryStatus || event.eventType }}</span>\n                      <span><b>Space:</b> {{ event.spaceName }}</span>\n                      <span><b>Event manager:</b> {{ event.eventManagerName || '-' }}</span>\n                    </div>\n                  }\n                </div>\n              }\n\n              @if (hiddenEventsCount(cell) > 0) {\n                <span class=\"more-events\">+{{ hiddenEventsCount(cell) }} more</span>\n              }\n            </div>\n          </article>\n        }\n      </div>\n    </div>\n  </section>\n</section>\n", styles: [".diary-page {\n  display: grid;\n  gap: 1rem;\n}\n\n.title-block h1 {\n  margin: 0;\n  font-size: 2rem;\n  color: #0f172a;\n  font-weight: 800;\n}\n\n.title-block p {\n  margin: 0.28rem 0 0;\n  color: #64748b;\n  font-size: 1.06rem;\n  font-weight: 600;\n}\n\n.error-banner {\n  margin: 0;\n  border: 1px solid #fecaca;\n  border-radius: 10px;\n  background: #fff1f2;\n  color: #b91c1c;\n  padding: 0.6rem 0.8rem;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n.calendar-card {\n  border: 1px solid #dbe4ef;\n  border-radius: 22px;\n  background: #ffffff;\n  overflow: hidden;\n  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);\n}\n\n.calendar-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  padding: 1.35rem 1.5rem;\n  border-bottom: 1px solid #e8edf5;\n}\n\n.month-nav {\n  display: inline-flex;\n  align-items: center;\n  gap: 1rem;\n}\n\n.month-nav h2 {\n  margin: 0;\n  font-size: 2.2rem;\n  line-height: 1;\n  color: #1e293b;\n  font-weight: 800;\n}\n\n.month-arrows {\n  display: inline-flex;\n  align-items: center;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  overflow: hidden;\n  background: #f8fafc;\n}\n\n.month-arrows button {\n  border: 0;\n  background: transparent;\n  color: #475569;\n  width: 34px;\n  height: 34px;\n  font-size: 1rem;\n  font-weight: 800;\n}\n\n.month-arrows button + button {\n  border-left: 1px solid #e2e8f0;\n}\n\n.today-btn {\n  border: 0;\n  background: transparent;\n  color: #475569;\n  font-size: 1rem;\n  font-weight: 700;\n}\n\n.toolbar-right {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.9rem;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n}\n\n.legend-inline {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.8rem;\n  padding-right: 0.8rem;\n  border-right: 1px solid #e2e8f0;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n}\n\n.legend-inline span {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  color: #64748b;\n  font-size: 0.86rem;\n  font-weight: 700;\n}\n\n.legend-chip {\n  width: 20px;\n  height: 10px;\n  border-radius: 999px;\n  border: 1px solid transparent;\n  display: inline-block;\n}\n\n.legend-chip.status-confirmed {\n  background: #16a34a;\n}\n\n.legend-chip.status-provisional {\n  border: 1px dashed #d97706;\n  background-image: repeating-linear-gradient(45deg, #fef3c7, #fef3c7 4px, #fffbeb 4px, #fffbeb 8px);\n}\n\n.legend-chip.status-tentative {\n  border: 1px dashed #60a5fa;\n  background: #eff6ff;\n}\n\n.legend-chip.status-open-proposal {\n  background: #2563eb;\n}\n\n.legend-chip.status-appointment {\n  border: 2px solid #3b82f6;\n  background: #ffffff;\n}\n\n.legend-chip.status-venue-event {\n  background: #0d9488;\n}\n\n.add-event-btn {\n  border: 1px solid #1d4ed8;\n  background: #2563eb;\n  color: #fff;\n  border-radius: 13px;\n  padding: 0.62rem 1.15rem;\n  font-size: 1rem;\n  font-weight: 700;\n  box-shadow: 0 10px 18px rgba(37, 99, 235, 0.22);\n}\n\n.calendar-grid-wrap {\n  overflow-x: auto;\n}\n\n.weekdays-row,\n.month-grid {\n  min-width: 1080px;\n}\n\n.weekdays-row {\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  border-bottom: 1px solid #e8edf5;\n}\n\n.weekdays-row div {\n  text-align: center;\n  padding: 0.7rem 0.45rem;\n  color: #94a3b8;\n  font-size: 0.97rem;\n  font-weight: 800;\n  letter-spacing: 0.04em;\n}\n\n.month-grid {\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n}\n\n.day-cell {\n  border-right: 1px solid #eef2f8;\n  border-bottom: 1px solid #eef2f8;\n  min-height: 168px;\n  padding: 0.68rem 0.62rem 0.72rem;\n  display: grid;\n  gap: 0.52rem;\n  align-content: start;\n  background: #ffffff;\n}\n\n.day-cell:nth-child(7n) {\n  border-right: 0;\n}\n\n.day-cell.outside-month {\n  background: #fbfdff;\n}\n\n.day-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.38rem;\n}\n\n.day-number {\n  color: #475569;\n  font-size: 1.55rem;\n  font-weight: 700;\n  line-height: 1;\n}\n\n.day-cell.outside-month .day-number {\n  color: #c4cfdd;\n}\n\n.event-count {\n  color: #94a3b8;\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n\n.event-list {\n  display: grid;\n  gap: 0.38rem;\n  align-content: start;\n}\n\n.event-chip-wrap {\n  position: relative;\n}\n\n.event-chip {\n  width: 100%;\n  border: 1px solid transparent;\n  border-radius: 8px;\n  padding: 0.34rem 0.55rem;\n  text-align: left;\n  font-size: 0.82rem;\n  font-weight: 700;\n  line-height: 1.25;\n  color: #ffffff;\n  cursor: pointer;\n}\n\n.event-chip.status-confirmed {\n  background: #16a34a;\n}\n\n.event-chip.status-provisional {\n  color: #1f2937;\n  border: 2px dashed #d97706;\n  background-image: repeating-linear-gradient(45deg, #fef3c7, #fef3c7 4px, #fffbeb 4px, #fffbeb 8px);\n}\n\n.event-chip.status-new,\n.event-chip.status-tentative {\n  color: #1e40af;\n  border: 1px dashed #60a5fa;\n  background: #eff6ff;\n}\n\n.event-chip.status-open-proposal {\n  background: #2563eb;\n}\n\n.event-chip.status-completed {\n  background: #86efac;\n  color: #14532d;\n}\n\n.event-chip.status-blocked {\n  background: #9ca3af;\n}\n\n.event-chip.status-appointment {\n  background: #ffffff;\n  color: #1d4ed8;\n  border: 2px solid #3b82f6;\n}\n\n.event-chip.status-venue-event {\n  background: #0d9488;\n}\n\n.event-chip.status-lost {\n  background: #fecaca;\n  color: #991b1b;\n}\n\n.event-chip.status-archived {\n  background: #e5e7eb;\n  color: #334155;\n}\n\n.event-chip.unassigned {\n  background: #64748b;\n  color: #ffffff;\n  border-color: #64748b;\n}\n\n.more-events {\n  color: #64748b;\n  font-size: 0.75rem;\n  font-weight: 700;\n}\n\n.event-popover {\n  position: absolute;\n  top: calc(100% + 8px);\n  left: 0;\n  z-index: 30;\n  width: 255px;\n  border-radius: 12px;\n  border: 1px solid #1e293b;\n  background: #0f172a;\n  color: #f8fafc;\n  padding: 0.5rem 0.56rem;\n  display: grid;\n  gap: 0.2rem;\n  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.35);\n}\n\n.event-popover strong {\n  font-size: 0.76rem;\n}\n\n.event-popover span {\n  font-size: 0.67rem;\n  color: #cbd5e1;\n}\n\n.event-popover b {\n  color: #ffffff;\n  font-weight: 700;\n}\n\n@media (max-width: 1024px) {\n  .calendar-toolbar {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n\n  .toolbar-right {\n    width: 100%;\n    justify-content: flex-start;\n  }\n}\n\n@media (max-width: 720px) {\n  .title-block h1 {\n    font-size: 1.65rem;\n  }\n\n  .title-block p {\n    font-size: 0.94rem;\n  }\n\n  .month-nav h2 {\n    font-size: 1.5rem;\n  }\n\n  .legend-inline {\n    border-right: 0;\n    padding-right: 0;\n    justify-content: flex-start;\n  }\n}\n"] }]
    }], null, { onWindowFocus: [{
            type: HostListener,
            args: ['window:focus']
        }], onVisibilityChange: [{
            type: HostListener,
            args: ['document:visibilitychange']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(EventDiaryComponent, { className: "EventDiaryComponent", filePath: "src/app/pages/event-diary/event-diary.component.ts", lineNumber: 23 }); })();
//# sourceMappingURL=event-diary.component.js.map