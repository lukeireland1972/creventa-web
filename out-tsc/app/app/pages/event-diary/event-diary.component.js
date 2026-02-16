import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, forkJoin, map } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.key;
function _forTrack1($index, $item) { return this.eventKey($item); }
const _forTrack2 = ($index, $item) => $item.monthKey;
function EventDiaryComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 2);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.loadError);
} }
function EventDiaryComponent_For_22_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 23);
    i0.ɵɵlistener("click", function EventDiaryComponent_For_22_Template_button_click_0_listener() { const view_r3 = i0.ɵɵrestoreView(_r2).$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.switchView(view_r3.key)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const view_r3 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("active", ctx_r0.selectedView === view_r3.key);
    i0.ɵɵattribute("aria-selected", ctx_r0.selectedView === view_r3.key);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", view_r3.label, " ");
} }
function EventDiaryComponent_Conditional_44_For_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const weekday_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(weekday_r4);
} }
function EventDiaryComponent_Conditional_44_For_6_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 30);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const cell_r6 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", cell_r6.events.length, " ", cell_r6.events.length === 1 ? "event" : "events");
} }
function EventDiaryComponent_Conditional_44_For_6_For_7_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 35)(1, "strong");
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
    const event_r8 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(event_r8.label);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", event_r8.covers || "-");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2(" ", i0.ɵɵpipeBind2(11, 8, event_r8.startUtc, "HH:mm"), "-", i0.ɵɵpipeBind2(12, 11, event_r8.endUtc, "HH:mm"));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1(" ", event_r8.eventStyle || "-");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", event_r8.statusKey || event_r8.enquiryStatus || event_r8.eventType);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", event_r8.spaceName);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", event_r8.eventManagerName || "-");
} }
function EventDiaryComponent_Conditional_44_For_6_For_7_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 32)(1, "button", 34);
    i0.ɵɵlistener("dragstart", function EventDiaryComponent_Conditional_44_For_6_For_7_Template_button_dragstart_1_listener($event) { const event_r8 = i0.ɵɵrestoreView(_r7).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.onDragStart(event_r8, $event)); })("mouseenter", function EventDiaryComponent_Conditional_44_For_6_For_7_Template_button_mouseenter_1_listener() { const event_r8 = i0.ɵɵrestoreView(_r7).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.hoveredEventKey = ctx_r0.eventKey(event_r8)); })("mouseleave", function EventDiaryComponent_Conditional_44_For_6_For_7_Template_button_mouseleave_1_listener() { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.hoveredEventKey = null); })("click", function EventDiaryComponent_Conditional_44_For_6_For_7_Template_button_click_1_listener() { const event_r8 = i0.ɵɵrestoreView(_r7).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.openDetails(event_r8)); });
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(3, EventDiaryComponent_Conditional_44_For_6_For_7_Conditional_3_Template, 29, 14, "div", 35);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const event_r8 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r0.eventChipClass(event_r8));
    i0.ɵɵattribute("draggable", ctx_r0.canDrag(event_r8));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.eventDisplayLabel(event_r8), " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.hoveredEventKey === ctx_r0.eventKey(event_r8) ? 3 : -1);
} }
function EventDiaryComponent_Conditional_44_For_6_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const cell_r6 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("+", ctx_r0.hiddenEventsCount(cell_r6), " more");
} }
function EventDiaryComponent_Conditional_44_For_6_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 27);
    i0.ɵɵlistener("dragover", function EventDiaryComponent_Conditional_44_For_6_Template_article_dragover_0_listener($event) { i0.ɵɵrestoreView(_r5); return i0.ɵɵresetView($event.preventDefault()); })("drop", function EventDiaryComponent_Conditional_44_For_6_Template_article_drop_0_listener() { const cell_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.onDropDay(cell_r6.key)); });
    i0.ɵɵelementStart(1, "header", 28)(2, "span", 29);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(4, EventDiaryComponent_Conditional_44_For_6_Conditional_4_Template, 2, 2, "span", 30);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 31);
    i0.ɵɵrepeaterCreate(6, EventDiaryComponent_Conditional_44_For_6_For_7_Template, 4, 4, "div", 32, _forTrack1, true);
    i0.ɵɵconditionalCreate(8, EventDiaryComponent_Conditional_44_For_6_Conditional_8_Template, 2, 1, "span", 33);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const cell_r6 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("outside-month", !cell_r6.inCurrentMonth);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(cell_r6.dayNumber);
    i0.ɵɵadvance();
    i0.ɵɵconditional(cell_r6.events.length > 0 ? 4 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.eventsForDisplay(cell_r6));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.hiddenEventsCount(cell_r6) > 0 ? 8 : -1);
} }
function EventDiaryComponent_Conditional_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 21)(1, "div", 24);
    i0.ɵɵrepeaterCreate(2, EventDiaryComponent_Conditional_44_For_3_Template, 2, 1, "div", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 25);
    i0.ɵɵrepeaterCreate(5, EventDiaryComponent_Conditional_44_For_6_Template, 9, 5, "article", 26, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.weekdayLabels);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.cells);
} }
function EventDiaryComponent_Conditional_45_For_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 40);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const label_r9 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(label_r9);
} }
function EventDiaryComponent_Conditional_45_For_10_For_7_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 45);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const cell_r11 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(cell_r11.dayNumber);
} }
function EventDiaryComponent_Conditional_45_For_10_For_7_For_4_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 35)(1, "strong");
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
    const event_r13 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(event_r13.label);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", event_r13.covers || "-");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2(" ", i0.ɵɵpipeBind2(11, 8, event_r13.startUtc, "HH:mm"), "-", i0.ɵɵpipeBind2(12, 11, event_r13.endUtc, "HH:mm"));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1(" ", event_r13.eventStyle || "-");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", event_r13.statusKey || event_r13.enquiryStatus || event_r13.eventType);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", event_r13.spaceName);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", event_r13.eventManagerName || "-");
} }
function EventDiaryComponent_Conditional_45_For_10_For_7_For_4_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 32)(1, "button", 34);
    i0.ɵɵlistener("dragstart", function EventDiaryComponent_Conditional_45_For_10_For_7_For_4_Template_button_dragstart_1_listener($event) { const event_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.onDragStart(event_r13, $event)); })("mouseenter", function EventDiaryComponent_Conditional_45_For_10_For_7_For_4_Template_button_mouseenter_1_listener() { const event_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.hoveredEventKey = ctx_r0.eventKey(event_r13)); })("mouseleave", function EventDiaryComponent_Conditional_45_For_10_For_7_For_4_Template_button_mouseleave_1_listener() { i0.ɵɵrestoreView(_r12); const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.hoveredEventKey = null); })("click", function EventDiaryComponent_Conditional_45_For_10_For_7_For_4_Template_button_click_1_listener() { const event_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.openDetails(event_r13)); });
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(3, EventDiaryComponent_Conditional_45_For_10_For_7_For_4_Conditional_3_Template, 29, 14, "div", 35);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const event_r13 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r0.eventChipClass(event_r13));
    i0.ɵɵattribute("draggable", ctx_r0.canDrag(event_r13));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.eventDisplayLabel(event_r13), " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.hoveredEventKey === ctx_r0.eventKey(event_r13) ? 3 : -1);
} }
function EventDiaryComponent_Conditional_45_For_10_For_7_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const cell_r11 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("+", ctx_r0.hiddenEventsCount(cell_r11), " more");
} }
function EventDiaryComponent_Conditional_45_For_10_For_7_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 44);
    i0.ɵɵlistener("dragover", function EventDiaryComponent_Conditional_45_For_10_For_7_Template_article_dragover_0_listener($event) { i0.ɵɵrestoreView(_r10); return i0.ɵɵresetView($event.preventDefault()); })("drop", function EventDiaryComponent_Conditional_45_For_10_For_7_Template_article_drop_0_listener() { const cell_r11 = i0.ɵɵrestoreView(_r10).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.onDropTimelineCell(cell_r11)); });
    i0.ɵɵconditionalCreate(1, EventDiaryComponent_Conditional_45_For_10_For_7_Conditional_1_Template, 2, 1, "span", 45);
    i0.ɵɵelementStart(2, "div", 46);
    i0.ɵɵrepeaterCreate(3, EventDiaryComponent_Conditional_45_For_10_For_7_For_4_Template, 4, 4, "div", 32, _forTrack1, true);
    i0.ɵɵconditionalCreate(5, EventDiaryComponent_Conditional_45_For_10_For_7_Conditional_5_Template, 2, 1, "span", 33);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const cell_r11 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵclassProp("empty", !cell_r11.isoDate)("first-monday", cell_r11.isFirstMonday);
    i0.ɵɵadvance();
    i0.ɵɵconditional(cell_r11.dayNumber ? 1 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.eventsForDisplay(cell_r11));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.hiddenEventsCount(cell_r11) > 0 ? 5 : -1);
} }
function EventDiaryComponent_Conditional_45_For_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 41)(1, "div", 42)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "small");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵrepeaterCreate(6, EventDiaryComponent_Conditional_45_For_10_For_7_Template, 6, 6, "article", 43, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r14 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(row_r14.monthLabel);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("1st Mon: ", row_r14.firstMondayDay);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(row_r14.cells);
} }
function EventDiaryComponent_Conditional_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 22)(1, "p", 36);
    i0.ɵɵtext(2, " Timeline view: six months shown down the left, aligned by the first Monday of each month. ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 37)(4, "div", 38)(5, "div", 39);
    i0.ɵɵtext(6, "Month");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(7, EventDiaryComponent_Conditional_45_For_8_Template, 2, 1, "div", 40, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(9, EventDiaryComponent_Conditional_45_For_10_Template, 8, 2, "div", 41, _forTrack2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵrepeater(ctx_r0.timelineHeaderLabels);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.timelineRows);
} }
export class EventDiaryComponent {
    constructor() {
        this.api = inject(ApiService);
        this.auth = inject(AuthService);
        this.destroyRef = inject(DestroyRef);
        this.router = inject(Router);
        this.unassignedSpaceId = '00000000-0000-0000-0000-000000000000';
        this.weekdayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        this.timelineHeaderLabels = Array.from({ length: EventDiaryComponent.timelineColumnCount }, (_, index) => index < EventDiaryComponent.timelineColumnAnchor ? '' : String(index - EventDiaryComponent.timelineColumnAnchor + 1));
        this.diaryViews = [
            { key: 'month', label: 'Month' },
            { key: 'timeline', label: 'Timeline' }
        ];
        this.diary = null;
        this.cells = [];
        this.timelineRows = [];
        this.hoveredEventKey = null;
        this.draggingEvent = null;
        this.loadError = '';
        this.selectedView = 'month';
        this.monthCursor = this.getUtcMonthStart(new Date());
        this.refreshIntervalHandle = null;
    }
    static { this.timelineColumnAnchor = 6; }
    static { this.timelineColumnCount = 37; }
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
    get timelineRangeLabel() {
        const end = new Date(this.monthCursor);
        end.setUTCMonth(end.getUTCMonth() + 5);
        const formatter = new Intl.DateTimeFormat('en-GB', {
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC'
        });
        return `${formatter.format(this.monthCursor)} - ${formatter.format(end)}`;
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
    switchView(view) {
        if (this.selectedView === view) {
            return;
        }
        this.selectedView = view;
        this.loadDiary();
    }
    loadDiary() {
        const venueId = this.venueId;
        if (!venueId) {
            this.diary = null;
            this.cells = [];
            this.timelineRows = [];
            this.loadError = '';
            return;
        }
        if (this.selectedView === 'timeline') {
            this.loadTimelineDiary(venueId);
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
                this.timelineRows = [];
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
    onDropTimelineCell(cell) {
        if (!cell.isoDate) {
            return;
        }
        this.onDropDay(cell.isoDate);
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
        const eventsByDate = this.groupEventsByDate(events);
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
    loadTimelineDiary(venueId) {
        const monthStarts = Array.from({ length: 6 }, (_, offset) => {
            const month = new Date(this.monthCursor);
            month.setUTCMonth(month.getUTCMonth() + offset);
            return this.getUtcMonthStart(month);
        });
        const monthRequests = monthStarts.map((start) => this.api.getDiary({
            venueId,
            view: 'month',
            startDate: this.toIsoDateUtc(start)
        }));
        forkJoin(monthRequests)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (responses) => {
                const allEvents = responses.flatMap((response) => response.events);
                this.diary = responses[0] ?? null;
                this.cells = [];
                this.timelineRows = this.buildTimelineRows(monthStarts, allEvents);
                this.loadError = '';
            },
            error: () => {
                this.loadError = 'Unable to load diary data right now.';
            }
        });
    }
    buildTimelineRows(monthStarts, events) {
        const eventsByDate = this.groupEventsByDate(events);
        return monthStarts.map((monthStart) => {
            const year = monthStart.getUTCFullYear();
            const month = monthStart.getUTCMonth();
            const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
            const firstMondayDay = this.getFirstMondayDay(monthStart);
            const cells = Array.from({ length: EventDiaryComponent.timelineColumnCount }, (_, index) => ({
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
    groupEventsByDate(events) {
        const eventsByDate = new Map();
        const dedupe = new Set();
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
    getFirstMondayDay(monthStart) {
        const probe = new Date(monthStart);
        while (probe.getUTCDay() !== 1) {
            probe.setUTCDate(probe.getUTCDate() + 1);
        }
        return probe.getUTCDate();
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
        } }, decls: 46, vars: 3, consts: [[1, "diary-page"], [1, "title-block"], [1, "error-banner"], [1, "calendar-card"], [1, "calendar-toolbar"], [1, "month-nav"], [1, "month-arrows"], ["type", "button", "aria-label", "Previous month", 3, "click"], ["type", "button", "aria-label", "Next month", 3, "click"], ["type", "button", 1, "today-btn", 3, "click"], [1, "toolbar-right"], ["role", "tablist", "aria-label", "Diary view", 1, "view-toggle"], ["type", "button", "role", "tab", 3, "active"], [1, "legend-inline"], [1, "legend-chip", "status-confirmed"], [1, "legend-chip", "status-provisional"], [1, "legend-chip", "status-tentative"], [1, "legend-chip", "status-open-proposal"], [1, "legend-chip", "status-appointment"], [1, "legend-chip", "status-venue-event"], ["type", "button", 1, "add-event-btn", 3, "click"], [1, "calendar-grid-wrap"], [1, "timeline-wrap"], ["type", "button", "role", "tab", 3, "click"], [1, "weekdays-row"], [1, "month-grid"], [1, "day-cell", 3, "outside-month"], [1, "day-cell", 3, "dragover", "drop"], [1, "day-header"], [1, "day-number"], [1, "event-count"], [1, "event-list"], [1, "event-chip-wrap"], [1, "more-events"], ["type", "button", 1, "event-chip", 3, "dragstart", "mouseenter", "mouseleave", "click", "ngClass"], [1, "event-popover"], [1, "timeline-hint"], [1, "timeline-table"], [1, "timeline-header-row"], [1, "timeline-month-col"], [1, "timeline-day-col"], [1, "timeline-row"], [1, "timeline-month-cell"], [1, "timeline-cell", 3, "empty", "first-monday"], [1, "timeline-cell", 3, "dragover", "drop"], [1, "timeline-day-number"], [1, "timeline-events"]], template: function EventDiaryComponent_Template(rf, ctx) { if (rf & 1) {
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
            i0.ɵɵelementStart(19, "div", 10)(20, "div", 11);
            i0.ɵɵrepeaterCreate(21, EventDiaryComponent_For_22_Template, 2, 4, "button", 12, _forTrack0);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "div", 13)(24, "span");
            i0.ɵɵelement(25, "i", 14);
            i0.ɵɵtext(26, " Confirmed");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "span");
            i0.ɵɵelement(28, "i", 15);
            i0.ɵɵtext(29, " Provisional");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "span");
            i0.ɵɵelement(31, "i", 16);
            i0.ɵɵtext(32, " New / Tentative");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(33, "span");
            i0.ɵɵelement(34, "i", 17);
            i0.ɵɵtext(35, " Open Proposal");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(36, "span");
            i0.ɵɵelement(37, "i", 18);
            i0.ɵɵtext(38, " Appointment");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "span");
            i0.ɵɵelement(40, "i", 19);
            i0.ɵɵtext(41, " Venue Event");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(42, "button", 20);
            i0.ɵɵlistener("click", function EventDiaryComponent_Template_button_click_42_listener() { return ctx.addEvent(); });
            i0.ɵɵtext(43, "+ Add Event");
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(44, EventDiaryComponent_Conditional_44_Template, 7, 0, "div", 21)(45, EventDiaryComponent_Conditional_45_Template, 11, 0, "div", 22);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵconditional(ctx.loadError ? 6 : -1);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.selectedView === "timeline" ? ctx.timelineRangeLabel : ctx.monthLabel);
            i0.ɵɵadvance(10);
            i0.ɵɵrepeater(ctx.diaryViews);
            i0.ɵɵadvance(23);
            i0.ɵɵconditional(ctx.selectedView === "month" ? 44 : 45);
        } }, dependencies: [NgClass, DatePipe], styles: [".diary-page[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n}\n\n.title-block[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 2rem;\n  color: #0f172a;\n  font-weight: 800;\n}\n\n.title-block[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.28rem 0 0;\n  color: #64748b;\n  font-size: 1.06rem;\n  font-weight: 600;\n}\n\n.error-banner[_ngcontent-%COMP%] {\n  margin: 0;\n  border: 1px solid #fecaca;\n  border-radius: 10px;\n  background: #fff1f2;\n  color: #b91c1c;\n  padding: 0.6rem 0.8rem;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n.calendar-card[_ngcontent-%COMP%] {\n  border: 1px solid #dbe4ef;\n  border-radius: 22px;\n  background: #ffffff;\n  overflow: hidden;\n  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);\n}\n\n.calendar-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  padding: 1.35rem 1.5rem;\n  border-bottom: 1px solid #e8edf5;\n}\n\n.month-nav[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 1rem;\n}\n\n.month-nav[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 2.2rem;\n  line-height: 1;\n  color: #1e293b;\n  font-weight: 800;\n}\n\n.month-arrows[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  overflow: hidden;\n  background: #f8fafc;\n}\n\n.month-arrows[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  color: #475569;\n  width: 34px;\n  height: 34px;\n  font-size: 1rem;\n  font-weight: 800;\n}\n\n.month-arrows[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]    + button[_ngcontent-%COMP%] {\n  border-left: 1px solid #e2e8f0;\n}\n\n.today-btn[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  color: #475569;\n  font-size: 1rem;\n  font-weight: 700;\n}\n\n.toolbar-right[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.9rem;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n}\n\n.view-toggle[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.2rem;\n  border: 1px solid #dbe4ef;\n  background: #f8fbff;\n  border-radius: 11px;\n  padding: 0.18rem;\n}\n\n.view-toggle[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  color: #64748b;\n  border-radius: 8px;\n  padding: 0.35rem 0.64rem;\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n\n.view-toggle[_ngcontent-%COMP%]   button.active[_ngcontent-%COMP%] {\n  background: #2563eb;\n  color: #ffffff;\n}\n\n.legend-inline[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.8rem;\n  padding-right: 0.8rem;\n  border-right: 1px solid #e2e8f0;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n}\n\n.legend-inline[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  color: #64748b;\n  font-size: 0.86rem;\n  font-weight: 700;\n}\n\n.legend-chip[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 10px;\n  border-radius: 999px;\n  border: 1px solid transparent;\n  display: inline-block;\n}\n\n.legend-chip.status-confirmed[_ngcontent-%COMP%] {\n  background: #16a34a;\n}\n\n.legend-chip.status-provisional[_ngcontent-%COMP%] {\n  border: 1px dashed #d97706;\n  background-image: repeating-linear-gradient(45deg, #fef3c7, #fef3c7 4px, #fffbeb 4px, #fffbeb 8px);\n}\n\n.legend-chip.status-tentative[_ngcontent-%COMP%] {\n  border: 1px dashed #60a5fa;\n  background: #eff6ff;\n}\n\n.legend-chip.status-open-proposal[_ngcontent-%COMP%] {\n  background: #2563eb;\n}\n\n.legend-chip.status-appointment[_ngcontent-%COMP%] {\n  border: 2px solid #3b82f6;\n  background: #ffffff;\n}\n\n.legend-chip.status-venue-event[_ngcontent-%COMP%] {\n  background: #0d9488;\n}\n\n.add-event-btn[_ngcontent-%COMP%] {\n  border: 1px solid #1d4ed8;\n  background: #2563eb;\n  color: #fff;\n  border-radius: 13px;\n  padding: 0.62rem 1.15rem;\n  font-size: 1rem;\n  font-weight: 700;\n  box-shadow: 0 10px 18px rgba(37, 99, 235, 0.22);\n}\n\n.calendar-grid-wrap[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n\n.weekdays-row[_ngcontent-%COMP%], \n.month-grid[_ngcontent-%COMP%] {\n  min-width: 1080px;\n}\n\n.weekdays-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  border-bottom: 1px solid #e8edf5;\n}\n\n.weekdays-row[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 0.7rem 0.45rem;\n  color: #94a3b8;\n  font-size: 0.97rem;\n  font-weight: 800;\n  letter-spacing: 0.04em;\n}\n\n.month-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n}\n\n.day-cell[_ngcontent-%COMP%] {\n  border-right: 1px solid #eef2f8;\n  border-bottom: 1px solid #eef2f8;\n  min-height: 168px;\n  padding: 0.68rem 0.62rem 0.72rem;\n  display: grid;\n  gap: 0.52rem;\n  align-content: start;\n  background: #ffffff;\n}\n\n.day-cell[_ngcontent-%COMP%]:nth-child(7n) {\n  border-right: 0;\n}\n\n.day-cell.outside-month[_ngcontent-%COMP%] {\n  background: #fbfdff;\n}\n\n.day-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.38rem;\n}\n\n.day-number[_ngcontent-%COMP%] {\n  color: #475569;\n  font-size: 1.55rem;\n  font-weight: 700;\n  line-height: 1;\n}\n\n.day-cell.outside-month[_ngcontent-%COMP%]   .day-number[_ngcontent-%COMP%] {\n  color: #c4cfdd;\n}\n\n.event-count[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n\n.event-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.38rem;\n  align-content: start;\n}\n\n.event-chip-wrap[_ngcontent-%COMP%] {\n  position: relative;\n}\n\n.event-chip[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid transparent;\n  border-radius: 8px;\n  padding: 0.34rem 0.55rem;\n  text-align: left;\n  font-size: 0.82rem;\n  font-weight: 700;\n  line-height: 1.25;\n  color: #ffffff;\n  cursor: pointer;\n}\n\n.event-chip.status-confirmed[_ngcontent-%COMP%] {\n  background: #16a34a;\n}\n\n.event-chip.status-provisional[_ngcontent-%COMP%] {\n  color: #1f2937;\n  border: 2px dashed #d97706;\n  background-image: repeating-linear-gradient(45deg, #fef3c7, #fef3c7 4px, #fffbeb 4px, #fffbeb 8px);\n}\n\n.event-chip.status-new[_ngcontent-%COMP%], \n.event-chip.status-tentative[_ngcontent-%COMP%] {\n  color: #1e40af;\n  border: 1px dashed #60a5fa;\n  background: #eff6ff;\n}\n\n.event-chip.status-open-proposal[_ngcontent-%COMP%] {\n  background: #2563eb;\n}\n\n.event-chip.status-completed[_ngcontent-%COMP%] {\n  background: #86efac;\n  color: #14532d;\n}\n\n.event-chip.status-blocked[_ngcontent-%COMP%] {\n  background: #9ca3af;\n}\n\n.event-chip.status-appointment[_ngcontent-%COMP%] {\n  background: #ffffff;\n  color: #1d4ed8;\n  border: 2px solid #3b82f6;\n}\n\n.event-chip.status-venue-event[_ngcontent-%COMP%] {\n  background: #0d9488;\n}\n\n.event-chip.status-lost[_ngcontent-%COMP%] {\n  background: #fecaca;\n  color: #991b1b;\n}\n\n.event-chip.status-archived[_ngcontent-%COMP%] {\n  background: #e5e7eb;\n  color: #334155;\n}\n\n.event-chip.unassigned[_ngcontent-%COMP%] {\n  background: #64748b;\n  color: #ffffff;\n  border-color: #64748b;\n}\n\n.more-events[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: 0.75rem;\n  font-weight: 700;\n}\n\n.event-popover[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 8px);\n  left: 0;\n  z-index: 30;\n  width: 255px;\n  border-radius: 12px;\n  border: 1px solid #1e293b;\n  background: #0f172a;\n  color: #f8fafc;\n  padding: 0.5rem 0.56rem;\n  display: grid;\n  gap: 0.2rem;\n  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.35);\n}\n\n.event-popover[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n}\n\n.event-popover[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.67rem;\n  color: #cbd5e1;\n}\n\n.event-popover[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  color: #ffffff;\n  font-weight: 700;\n}\n\n.timeline-wrap[_ngcontent-%COMP%] {\n  padding: 0.95rem 1rem 1.1rem;\n  overflow-x: auto;\n}\n\n.timeline-hint[_ngcontent-%COMP%] {\n  margin: 0 0 0.7rem;\n  color: #64748b;\n  font-size: 0.83rem;\n  font-weight: 600;\n}\n\n.timeline-table[_ngcontent-%COMP%] {\n  min-width: 1320px;\n  border: 1px solid #e7edf6;\n  border-radius: 14px;\n  overflow: hidden;\n  background: #ffffff;\n}\n\n.timeline-header-row[_ngcontent-%COMP%], \n.timeline-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 190px repeat(37, minmax(0, 1fr));\n}\n\n.timeline-header-row[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #e7edf6;\n  background: #f8fbff;\n}\n\n.timeline-month-col[_ngcontent-%COMP%] {\n  border-right: 1px solid #e7edf6;\n  padding: 0.54rem 0.6rem;\n  color: #64748b;\n  font-size: 0.72rem;\n  text-transform: uppercase;\n  letter-spacing: 0.07em;\n  font-weight: 800;\n}\n\n.timeline-day-col[_ngcontent-%COMP%] {\n  border-right: 1px solid #e7edf6;\n  padding: 0.45rem 0;\n  text-align: center;\n  color: #8da0b7;\n  font-size: 0.68rem;\n  font-weight: 800;\n}\n\n.timeline-day-col[_ngcontent-%COMP%]:last-child {\n  border-right: 0;\n}\n\n.timeline-row[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #eef3f9;\n}\n\n.timeline-row[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n\n.timeline-month-cell[_ngcontent-%COMP%] {\n  border-right: 1px solid #e7edf6;\n  padding: 0.45rem 0.55rem;\n  display: grid;\n  align-content: start;\n  gap: 0.08rem;\n  background: #fbfdff;\n}\n\n.timeline-month-cell[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #1e293b;\n  font-size: 0.84rem;\n  line-height: 1.15;\n}\n\n.timeline-month-cell[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: 0.68rem;\n  font-weight: 700;\n}\n\n.timeline-cell[_ngcontent-%COMP%] {\n  min-height: 64px;\n  border-right: 1px solid #eef3f9;\n  padding: 0.18rem 0.14rem 0.22rem;\n  display: grid;\n  align-content: start;\n  gap: 0.16rem;\n  background: #ffffff;\n}\n\n.timeline-cell[_ngcontent-%COMP%]:last-child {\n  border-right: 0;\n}\n\n.timeline-cell.empty[_ngcontent-%COMP%] {\n  background: #fcfdff;\n}\n\n.timeline-cell.first-monday[_ngcontent-%COMP%] {\n  background: linear-gradient(180deg, #fefce8 0%, #ffffff 52%);\n}\n\n.timeline-day-number[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: 0.62rem;\n  font-weight: 800;\n  line-height: 1;\n}\n\n.timeline-events[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.14rem;\n  align-content: start;\n}\n\n.timeline-events[_ngcontent-%COMP%]   .event-chip[_ngcontent-%COMP%] {\n  padding: 0.16rem 0.22rem;\n  font-size: 0.56rem;\n  border-radius: 6px;\n  line-height: 1.15;\n}\n\n@media (max-width: 1024px) {\n  .calendar-toolbar[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n\n  .toolbar-right[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: flex-start;\n  }\n\n  .timeline-wrap[_ngcontent-%COMP%] {\n    padding: 0.72rem;\n  }\n\n  .timeline-month-cell[_ngcontent-%COMP%] {\n    position: sticky;\n    left: 0;\n    z-index: 4;\n  }\n}\n\n@media (max-width: 720px) {\n  .title-block[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.65rem;\n  }\n\n  .title-block[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    font-size: 0.94rem;\n  }\n\n  .month-nav[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n\n  .legend-inline[_ngcontent-%COMP%] {\n    border-right: 0;\n    padding-right: 0;\n    justify-content: flex-start;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(EventDiaryComponent, [{
        type: Component,
        args: [{ selector: 'app-event-diary', imports: [NgClass, DatePipe], template: "<section class=\"diary-page\">\n  <header class=\"title-block\">\n    <h1>Event Diary</h1>\n    <p>Manage your venue bookings and proposals efficiently.</p>\n  </header>\n\n  @if (loadError) {\n    <p class=\"error-banner\">{{ loadError }}</p>\n  }\n\n  <section class=\"calendar-card\">\n    <div class=\"calendar-toolbar\">\n      <div class=\"month-nav\">\n        <h2>{{ selectedView === 'timeline' ? timelineRangeLabel : monthLabel }}</h2>\n        <div class=\"month-arrows\">\n          <button type=\"button\" (click)=\"shiftMonth(-1)\" aria-label=\"Previous month\">&#10094;</button>\n          <button type=\"button\" (click)=\"shiftMonth(1)\" aria-label=\"Next month\">&#10095;</button>\n        </div>\n        <button type=\"button\" class=\"today-btn\" (click)=\"goToToday()\">Today</button>\n      </div>\n\n      <div class=\"toolbar-right\">\n        <div class=\"view-toggle\" role=\"tablist\" aria-label=\"Diary view\">\n          @for (view of diaryViews; track view.key) {\n            <button\n              type=\"button\"\n              role=\"tab\"\n              [attr.aria-selected]=\"selectedView === view.key\"\n              [class.active]=\"selectedView === view.key\"\n              (click)=\"switchView(view.key)\">\n              {{ view.label }}\n            </button>\n          }\n        </div>\n\n        <div class=\"legend-inline\">\n          <span><i class=\"legend-chip status-confirmed\"></i> Confirmed</span>\n          <span><i class=\"legend-chip status-provisional\"></i> Provisional</span>\n          <span><i class=\"legend-chip status-tentative\"></i> New / Tentative</span>\n          <span><i class=\"legend-chip status-open-proposal\"></i> Open Proposal</span>\n          <span><i class=\"legend-chip status-appointment\"></i> Appointment</span>\n          <span><i class=\"legend-chip status-venue-event\"></i> Venue Event</span>\n        </div>\n        <button type=\"button\" class=\"add-event-btn\" (click)=\"addEvent()\">+ Add Event</button>\n      </div>\n    </div>\n\n    @if (selectedView === 'month') {\n      <div class=\"calendar-grid-wrap\">\n        <div class=\"weekdays-row\">\n          @for (weekday of weekdayLabels; track weekday) {\n            <div>{{ weekday }}</div>\n          }\n        </div>\n\n        <div class=\"month-grid\">\n          @for (cell of cells; track cell.key) {\n            <article\n              class=\"day-cell\"\n              [class.outside-month]=\"!cell.inCurrentMonth\"\n              (dragover)=\"$event.preventDefault()\"\n              (drop)=\"onDropDay(cell.key)\">\n              <header class=\"day-header\">\n                <span class=\"day-number\">{{ cell.dayNumber }}</span>\n                @if (cell.events.length > 0) {\n                  <span class=\"event-count\">{{ cell.events.length }} {{ cell.events.length === 1 ? 'event' : 'events' }}</span>\n                }\n              </header>\n\n              <div class=\"event-list\">\n                @for (event of eventsForDisplay(cell); track eventKey(event)) {\n                  <div class=\"event-chip-wrap\">\n                    <button\n                      type=\"button\"\n                      class=\"event-chip\"\n                      [ngClass]=\"eventChipClass(event)\"\n                      [attr.draggable]=\"canDrag(event)\"\n                      (dragstart)=\"onDragStart(event, $event)\"\n                      (mouseenter)=\"hoveredEventKey = eventKey(event)\"\n                      (mouseleave)=\"hoveredEventKey = null\"\n                      (click)=\"openDetails(event)\">\n                      {{ eventDisplayLabel(event) }}\n                    </button>\n\n                    @if (hoveredEventKey === eventKey(event)) {\n                      <div class=\"event-popover\">\n                        <strong>{{ event.label }}</strong>\n                        <span><b>Covers:</b> {{ event.covers || '-' }}</span>\n                        <span><b>Timing:</b> {{ event.startUtc | date: 'HH:mm' }}-{{ event.endUtc | date: 'HH:mm' }}</span>\n                        <span><b>Event style:</b> {{ event.eventStyle || '-' }}</span>\n                        <span><b>Status:</b> {{ event.statusKey || event.enquiryStatus || event.eventType }}</span>\n                        <span><b>Space:</b> {{ event.spaceName }}</span>\n                        <span><b>Event manager:</b> {{ event.eventManagerName || '-' }}</span>\n                      </div>\n                    }\n                  </div>\n                }\n\n                @if (hiddenEventsCount(cell) > 0) {\n                  <span class=\"more-events\">+{{ hiddenEventsCount(cell) }} more</span>\n                }\n              </div>\n            </article>\n          }\n        </div>\n      </div>\n    } @else {\n      <div class=\"timeline-wrap\">\n        <p class=\"timeline-hint\">\n          Timeline view: six months shown down the left, aligned by the first Monday of each month.\n        </p>\n\n        <div class=\"timeline-table\">\n          <div class=\"timeline-header-row\">\n            <div class=\"timeline-month-col\">Month</div>\n            @for (label of timelineHeaderLabels; track $index) {\n              <div class=\"timeline-day-col\">{{ label }}</div>\n            }\n          </div>\n\n          @for (row of timelineRows; track row.monthKey) {\n            <div class=\"timeline-row\">\n              <div class=\"timeline-month-cell\">\n                <strong>{{ row.monthLabel }}</strong>\n                <small>1st Mon: {{ row.firstMondayDay }}</small>\n              </div>\n\n              @for (cell of row.cells; track cell.key) {\n                <article\n                  class=\"timeline-cell\"\n                  [class.empty]=\"!cell.isoDate\"\n                  [class.first-monday]=\"cell.isFirstMonday\"\n                  (dragover)=\"$event.preventDefault()\"\n                  (drop)=\"onDropTimelineCell(cell)\">\n                  @if (cell.dayNumber) {\n                    <span class=\"timeline-day-number\">{{ cell.dayNumber }}</span>\n                  }\n\n                  <div class=\"timeline-events\">\n                    @for (event of eventsForDisplay(cell); track eventKey(event)) {\n                      <div class=\"event-chip-wrap\">\n                        <button\n                          type=\"button\"\n                          class=\"event-chip\"\n                          [ngClass]=\"eventChipClass(event)\"\n                          [attr.draggable]=\"canDrag(event)\"\n                          (dragstart)=\"onDragStart(event, $event)\"\n                          (mouseenter)=\"hoveredEventKey = eventKey(event)\"\n                          (mouseleave)=\"hoveredEventKey = null\"\n                          (click)=\"openDetails(event)\">\n                          {{ eventDisplayLabel(event) }}\n                        </button>\n\n                        @if (hoveredEventKey === eventKey(event)) {\n                          <div class=\"event-popover\">\n                            <strong>{{ event.label }}</strong>\n                            <span><b>Covers:</b> {{ event.covers || '-' }}</span>\n                            <span><b>Timing:</b> {{ event.startUtc | date: 'HH:mm' }}-{{ event.endUtc | date: 'HH:mm' }}</span>\n                            <span><b>Event style:</b> {{ event.eventStyle || '-' }}</span>\n                            <span><b>Status:</b> {{ event.statusKey || event.enquiryStatus || event.eventType }}</span>\n                            <span><b>Space:</b> {{ event.spaceName }}</span>\n                            <span><b>Event manager:</b> {{ event.eventManagerName || '-' }}</span>\n                          </div>\n                        }\n                      </div>\n                    }\n\n                    @if (hiddenEventsCount(cell) > 0) {\n                      <span class=\"more-events\">+{{ hiddenEventsCount(cell) }} more</span>\n                    }\n                  </div>\n                </article>\n              }\n            </div>\n          }\n        </div>\n      </div>\n    }\n  </section>\n</section>\n", styles: [".diary-page {\n  display: grid;\n  gap: 1rem;\n}\n\n.title-block h1 {\n  margin: 0;\n  font-size: 2rem;\n  color: #0f172a;\n  font-weight: 800;\n}\n\n.title-block p {\n  margin: 0.28rem 0 0;\n  color: #64748b;\n  font-size: 1.06rem;\n  font-weight: 600;\n}\n\n.error-banner {\n  margin: 0;\n  border: 1px solid #fecaca;\n  border-radius: 10px;\n  background: #fff1f2;\n  color: #b91c1c;\n  padding: 0.6rem 0.8rem;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n\n.calendar-card {\n  border: 1px solid #dbe4ef;\n  border-radius: 22px;\n  background: #ffffff;\n  overflow: hidden;\n  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);\n}\n\n.calendar-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  padding: 1.35rem 1.5rem;\n  border-bottom: 1px solid #e8edf5;\n}\n\n.month-nav {\n  display: inline-flex;\n  align-items: center;\n  gap: 1rem;\n}\n\n.month-nav h2 {\n  margin: 0;\n  font-size: 2.2rem;\n  line-height: 1;\n  color: #1e293b;\n  font-weight: 800;\n}\n\n.month-arrows {\n  display: inline-flex;\n  align-items: center;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  overflow: hidden;\n  background: #f8fafc;\n}\n\n.month-arrows button {\n  border: 0;\n  background: transparent;\n  color: #475569;\n  width: 34px;\n  height: 34px;\n  font-size: 1rem;\n  font-weight: 800;\n}\n\n.month-arrows button + button {\n  border-left: 1px solid #e2e8f0;\n}\n\n.today-btn {\n  border: 0;\n  background: transparent;\n  color: #475569;\n  font-size: 1rem;\n  font-weight: 700;\n}\n\n.toolbar-right {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.9rem;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n}\n\n.view-toggle {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.2rem;\n  border: 1px solid #dbe4ef;\n  background: #f8fbff;\n  border-radius: 11px;\n  padding: 0.18rem;\n}\n\n.view-toggle button {\n  border: 0;\n  background: transparent;\n  color: #64748b;\n  border-radius: 8px;\n  padding: 0.35rem 0.64rem;\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n\n.view-toggle button.active {\n  background: #2563eb;\n  color: #ffffff;\n}\n\n.legend-inline {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.8rem;\n  padding-right: 0.8rem;\n  border-right: 1px solid #e2e8f0;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n}\n\n.legend-inline span {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  color: #64748b;\n  font-size: 0.86rem;\n  font-weight: 700;\n}\n\n.legend-chip {\n  width: 20px;\n  height: 10px;\n  border-radius: 999px;\n  border: 1px solid transparent;\n  display: inline-block;\n}\n\n.legend-chip.status-confirmed {\n  background: #16a34a;\n}\n\n.legend-chip.status-provisional {\n  border: 1px dashed #d97706;\n  background-image: repeating-linear-gradient(45deg, #fef3c7, #fef3c7 4px, #fffbeb 4px, #fffbeb 8px);\n}\n\n.legend-chip.status-tentative {\n  border: 1px dashed #60a5fa;\n  background: #eff6ff;\n}\n\n.legend-chip.status-open-proposal {\n  background: #2563eb;\n}\n\n.legend-chip.status-appointment {\n  border: 2px solid #3b82f6;\n  background: #ffffff;\n}\n\n.legend-chip.status-venue-event {\n  background: #0d9488;\n}\n\n.add-event-btn {\n  border: 1px solid #1d4ed8;\n  background: #2563eb;\n  color: #fff;\n  border-radius: 13px;\n  padding: 0.62rem 1.15rem;\n  font-size: 1rem;\n  font-weight: 700;\n  box-shadow: 0 10px 18px rgba(37, 99, 235, 0.22);\n}\n\n.calendar-grid-wrap {\n  overflow-x: auto;\n}\n\n.weekdays-row,\n.month-grid {\n  min-width: 1080px;\n}\n\n.weekdays-row {\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  border-bottom: 1px solid #e8edf5;\n}\n\n.weekdays-row div {\n  text-align: center;\n  padding: 0.7rem 0.45rem;\n  color: #94a3b8;\n  font-size: 0.97rem;\n  font-weight: 800;\n  letter-spacing: 0.04em;\n}\n\n.month-grid {\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n}\n\n.day-cell {\n  border-right: 1px solid #eef2f8;\n  border-bottom: 1px solid #eef2f8;\n  min-height: 168px;\n  padding: 0.68rem 0.62rem 0.72rem;\n  display: grid;\n  gap: 0.52rem;\n  align-content: start;\n  background: #ffffff;\n}\n\n.day-cell:nth-child(7n) {\n  border-right: 0;\n}\n\n.day-cell.outside-month {\n  background: #fbfdff;\n}\n\n.day-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.38rem;\n}\n\n.day-number {\n  color: #475569;\n  font-size: 1.55rem;\n  font-weight: 700;\n  line-height: 1;\n}\n\n.day-cell.outside-month .day-number {\n  color: #c4cfdd;\n}\n\n.event-count {\n  color: #94a3b8;\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n\n.event-list {\n  display: grid;\n  gap: 0.38rem;\n  align-content: start;\n}\n\n.event-chip-wrap {\n  position: relative;\n}\n\n.event-chip {\n  width: 100%;\n  border: 1px solid transparent;\n  border-radius: 8px;\n  padding: 0.34rem 0.55rem;\n  text-align: left;\n  font-size: 0.82rem;\n  font-weight: 700;\n  line-height: 1.25;\n  color: #ffffff;\n  cursor: pointer;\n}\n\n.event-chip.status-confirmed {\n  background: #16a34a;\n}\n\n.event-chip.status-provisional {\n  color: #1f2937;\n  border: 2px dashed #d97706;\n  background-image: repeating-linear-gradient(45deg, #fef3c7, #fef3c7 4px, #fffbeb 4px, #fffbeb 8px);\n}\n\n.event-chip.status-new,\n.event-chip.status-tentative {\n  color: #1e40af;\n  border: 1px dashed #60a5fa;\n  background: #eff6ff;\n}\n\n.event-chip.status-open-proposal {\n  background: #2563eb;\n}\n\n.event-chip.status-completed {\n  background: #86efac;\n  color: #14532d;\n}\n\n.event-chip.status-blocked {\n  background: #9ca3af;\n}\n\n.event-chip.status-appointment {\n  background: #ffffff;\n  color: #1d4ed8;\n  border: 2px solid #3b82f6;\n}\n\n.event-chip.status-venue-event {\n  background: #0d9488;\n}\n\n.event-chip.status-lost {\n  background: #fecaca;\n  color: #991b1b;\n}\n\n.event-chip.status-archived {\n  background: #e5e7eb;\n  color: #334155;\n}\n\n.event-chip.unassigned {\n  background: #64748b;\n  color: #ffffff;\n  border-color: #64748b;\n}\n\n.more-events {\n  color: #64748b;\n  font-size: 0.75rem;\n  font-weight: 700;\n}\n\n.event-popover {\n  position: absolute;\n  top: calc(100% + 8px);\n  left: 0;\n  z-index: 30;\n  width: 255px;\n  border-radius: 12px;\n  border: 1px solid #1e293b;\n  background: #0f172a;\n  color: #f8fafc;\n  padding: 0.5rem 0.56rem;\n  display: grid;\n  gap: 0.2rem;\n  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.35);\n}\n\n.event-popover strong {\n  font-size: 0.76rem;\n}\n\n.event-popover span {\n  font-size: 0.67rem;\n  color: #cbd5e1;\n}\n\n.event-popover b {\n  color: #ffffff;\n  font-weight: 700;\n}\n\n.timeline-wrap {\n  padding: 0.95rem 1rem 1.1rem;\n  overflow-x: auto;\n}\n\n.timeline-hint {\n  margin: 0 0 0.7rem;\n  color: #64748b;\n  font-size: 0.83rem;\n  font-weight: 600;\n}\n\n.timeline-table {\n  min-width: 1320px;\n  border: 1px solid #e7edf6;\n  border-radius: 14px;\n  overflow: hidden;\n  background: #ffffff;\n}\n\n.timeline-header-row,\n.timeline-row {\n  display: grid;\n  grid-template-columns: 190px repeat(37, minmax(0, 1fr));\n}\n\n.timeline-header-row {\n  border-bottom: 1px solid #e7edf6;\n  background: #f8fbff;\n}\n\n.timeline-month-col {\n  border-right: 1px solid #e7edf6;\n  padding: 0.54rem 0.6rem;\n  color: #64748b;\n  font-size: 0.72rem;\n  text-transform: uppercase;\n  letter-spacing: 0.07em;\n  font-weight: 800;\n}\n\n.timeline-day-col {\n  border-right: 1px solid #e7edf6;\n  padding: 0.45rem 0;\n  text-align: center;\n  color: #8da0b7;\n  font-size: 0.68rem;\n  font-weight: 800;\n}\n\n.timeline-day-col:last-child {\n  border-right: 0;\n}\n\n.timeline-row {\n  border-bottom: 1px solid #eef3f9;\n}\n\n.timeline-row:last-child {\n  border-bottom: 0;\n}\n\n.timeline-month-cell {\n  border-right: 1px solid #e7edf6;\n  padding: 0.45rem 0.55rem;\n  display: grid;\n  align-content: start;\n  gap: 0.08rem;\n  background: #fbfdff;\n}\n\n.timeline-month-cell strong {\n  color: #1e293b;\n  font-size: 0.84rem;\n  line-height: 1.15;\n}\n\n.timeline-month-cell small {\n  color: #64748b;\n  font-size: 0.68rem;\n  font-weight: 700;\n}\n\n.timeline-cell {\n  min-height: 64px;\n  border-right: 1px solid #eef3f9;\n  padding: 0.18rem 0.14rem 0.22rem;\n  display: grid;\n  align-content: start;\n  gap: 0.16rem;\n  background: #ffffff;\n}\n\n.timeline-cell:last-child {\n  border-right: 0;\n}\n\n.timeline-cell.empty {\n  background: #fcfdff;\n}\n\n.timeline-cell.first-monday {\n  background: linear-gradient(180deg, #fefce8 0%, #ffffff 52%);\n}\n\n.timeline-day-number {\n  color: #64748b;\n  font-size: 0.62rem;\n  font-weight: 800;\n  line-height: 1;\n}\n\n.timeline-events {\n  display: grid;\n  gap: 0.14rem;\n  align-content: start;\n}\n\n.timeline-events .event-chip {\n  padding: 0.16rem 0.22rem;\n  font-size: 0.56rem;\n  border-radius: 6px;\n  line-height: 1.15;\n}\n\n@media (max-width: 1024px) {\n  .calendar-toolbar {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n\n  .toolbar-right {\n    width: 100%;\n    justify-content: flex-start;\n  }\n\n  .timeline-wrap {\n    padding: 0.72rem;\n  }\n\n  .timeline-month-cell {\n    position: sticky;\n    left: 0;\n    z-index: 4;\n  }\n}\n\n@media (max-width: 720px) {\n  .title-block h1 {\n    font-size: 1.65rem;\n  }\n\n  .title-block p {\n    font-size: 0.94rem;\n  }\n\n  .month-nav h2 {\n    font-size: 1.5rem;\n  }\n\n  .legend-inline {\n    border-right: 0;\n    padding-right: 0;\n    justify-content: flex-start;\n  }\n}\n"] }]
    }], null, { onWindowFocus: [{
            type: HostListener,
            args: ['window:focus']
        }], onVisibilityChange: [{
            type: HostListener,
            args: ['document:visibilitychange']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(EventDiaryComponent, { className: "EventDiaryComponent", filePath: "src/app/pages/event-diary/event-diary.component.ts", lineNumber: 38 }); })();
//# sourceMappingURL=event-diary.component.js.map