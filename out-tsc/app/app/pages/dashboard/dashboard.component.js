import { Component, DestroyRef, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.key;
const _forTrack1 = ($index, $item) => $item.taskId;
const _forTrack2 = ($index, $item) => $item.enquiryId;
const _forTrack3 = ($index, $item) => $item.id;
function DashboardComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "article", 1)(1, "h2");
    i0.ɵɵtext(2, "Loading Dashboard");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(3, "p");
    i0.ɵɵtext(4, "Fetching live pipeline, revenue, and payment widgets.");
    i0.ɵɵdomElementEnd()();
} }
function DashboardComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "article", 2)(1, "h2");
    i0.ɵɵtext(2, "Dashboard Unavailable");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(3, "p");
    i0.ɵɵtext(4);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(5, "button", 3);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_2_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.retryLoad()); });
    i0.ɵɵtext(6, "Retry");
    i0.ɵɵdomElementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.errorMessage);
} }
function DashboardComponent_Conditional_3_Conditional_13_For_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const warning_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(warning_r4);
} }
function DashboardComponent_Conditional_3_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "article", 1)(1, "h2");
    i0.ɵɵtext(2, "Limited Dashboard Mode");
    i0.ɵɵdomElementEnd();
    i0.ɵɵrepeaterCreate(3, DashboardComponent_Conditional_3_Conditional_13_For_4_Template, 2, 1, "p", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const model_r5 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(model_r5.warnings);
} }
function DashboardComponent_Conditional_3_For_16_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "small", 28);
    i0.ɵɵtext(1, "Revenue earned from events completed this month.");
    i0.ɵɵdomElementEnd();
} }
function DashboardComponent_Conditional_3_For_16_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "small", 28);
    i0.ɵɵtext(1, "Future revenue secured by bookings confirmed this month.");
    i0.ɵɵdomElementEnd();
} }
function DashboardComponent_Conditional_3_For_16_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "button", 26);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_For_16_Template_button_click_0_listener() { const card_r7 = i0.ɵɵrestoreView(_r6).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openKpi(card_r7)); });
    i0.ɵɵdomElementStart(1, "div", 27)(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(4, "em");
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "number");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(7, "strong");
    i0.ɵɵtext(8);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(9, "p");
    i0.ɵɵtext(10);
    i0.ɵɵdomElementEnd();
    i0.ɵɵconditionalCreate(11, DashboardComponent_Conditional_3_For_16_Conditional_11_Template, 2, 0, "small", 28);
    i0.ɵɵconditionalCreate(12, DashboardComponent_Conditional_3_For_16_Conditional_12_Template, 2, 0, "small", 28);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const card_r7 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(card_r7.label);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("negative", card_r7.deltaPercent < 0);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", i0.ɵɵpipeBind2(6, 8, card_r7.deltaPercent, "1.0-1"), "%");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(card_r7.displayValue);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r7.secondaryText);
    i0.ɵɵadvance();
    i0.ɵɵconditional(card_r7.key === "sales-delivered" || card_r7.key === "salesDelivered" ? 11 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(card_r7.key === "sales-created" || card_r7.key === "salesCreated" ? 12 : -1);
} }
function DashboardComponent_Conditional_3_For_124_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "li")(1, "button", 21);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_For_124_Template_button_click_1_listener() { const task_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openTask(task_r9)); });
    i0.ɵɵdomElementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(4, "small");
    i0.ɵɵtext(5);
    i0.ɵɵdomElementEnd()()();
} if (rf & 2) {
    const task_r9 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(task_r9.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", task_r9.enquiryReference, " \u00B7 ", task_r9.priority);
} }
function DashboardComponent_Conditional_3_Conditional_125_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "li", 24);
    i0.ɵɵtext(1, "No tasks due.");
    i0.ɵɵdomElementEnd();
} }
function DashboardComponent_Conditional_3_For_132_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "li")(1, "button", 21);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_For_132_Template_button_click_1_listener() { const event_r11 = i0.ɵɵrestoreView(_r10).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openUpcomingEvent(event_r11)); });
    i0.ɵɵdomElementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(4, "small");
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "date");
    i0.ɵɵdomElementEnd()()();
} if (rf & 2) {
    const event_r11 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(event_r11.eventName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate3("", event_r11.clientName, " \u00B7 ", i0.ɵɵpipeBind2(6, 4, event_r11.eventStartUtc, "dd/MM HH:mm"), " \u00B7 ", event_r11.guests, " covers");
} }
function DashboardComponent_Conditional_3_Conditional_133_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "li", 24);
    i0.ɵɵtext(1, "No events in the next 7 days.");
    i0.ɵɵdomElementEnd();
} }
function DashboardComponent_Conditional_3_For_140_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "li")(1, "button", 21);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_For_140_Template_button_click_1_listener() { const activity_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openActivity(activity_r13)); });
    i0.ɵɵdomElementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(4, "small");
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "date");
    i0.ɵɵdomElementEnd()()();
} if (rf & 2) {
    const activity_r13 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(activity_r13.actionType);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", activity_r13.userName || "System", " \u00B7 ", i0.ɵɵpipeBind2(6, 3, activity_r13.createdAtUtc, "dd/MM HH:mm"));
} }
function DashboardComponent_Conditional_3_Conditional_141_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "li", 24);
    i0.ɵɵtext(1, "No recently viewed records.");
    i0.ɵɵdomElementEnd();
} }
function DashboardComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "header", 4)(1, "div")(2, "h1");
    i0.ɵɵtext(3, "Dashboard");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(4, "p");
    i0.ɵɵtext(5, "Live sales, conversion, payments, and action signals.");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(6, "div", 5)(7, "button", 6);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setPeriod("7d")); });
    i0.ɵɵtext(8, "7d");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(9, "button", 6);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setPeriod("30d")); });
    i0.ɵɵtext(10, "30d");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(11, "button", 6);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setPeriod("90d")); });
    i0.ɵɵtext(12, "90d");
    i0.ɵɵdomElementEnd()()();
    i0.ɵɵconditionalCreate(13, DashboardComponent_Conditional_3_Conditional_13_Template, 5, 0, "article", 1);
    i0.ɵɵdomElementStart(14, "section", 7);
    i0.ɵɵrepeaterCreate(15, DashboardComponent_Conditional_3_For_16_Template, 13, 11, "button", 8, _forTrack0);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(17, "section", 9)(18, "article", 10)(19, "header")(20, "h2");
    i0.ɵɵtext(21, "Enquiry Pipeline Value");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(22, "small");
    i0.ɵɵtext(23);
    i0.ɵɵpipe(24, "number");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(25, "div", 11)(26, "button", 12);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_Template_button_click_26_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openEnquiriesTab("new-unanswered")); });
    i0.ɵɵdomElementStart(27, "label");
    i0.ɵɵtext(28, "Tentative");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(29, "strong");
    i0.ɵɵtext(30);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(31, "span");
    i0.ɵɵtext(32);
    i0.ɵɵpipe(33, "number");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(34, "button", 13);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_Template_button_click_34_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openEnquiriesTab("proposals")); });
    i0.ɵɵdomElementStart(35, "label");
    i0.ɵɵtext(36, "Open Proposals");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(37, "strong");
    i0.ɵɵtext(38);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(39, "span");
    i0.ɵɵtext(40);
    i0.ɵɵpipe(41, "number");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(42, "button", 14);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_Template_button_click_42_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openEnquiriesTab("provisional")); });
    i0.ɵɵdomElementStart(43, "label");
    i0.ɵɵtext(44, "Provisional");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(45, "strong");
    i0.ɵɵtext(46);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(47, "span");
    i0.ɵɵtext(48);
    i0.ɵɵpipe(49, "number");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(50, "button", 15);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_Template_button_click_50_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openEnquiriesTab("confirmed")); });
    i0.ɵɵdomElementStart(51, "label");
    i0.ɵɵtext(52, "Confirmed (90d)");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(53, "strong");
    i0.ɵɵtext(54);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(55, "span");
    i0.ɵɵtext(56);
    i0.ɵɵpipe(57, "number");
    i0.ɵɵdomElementEnd()()()();
    i0.ɵɵdomElementStart(58, "article", 16)(59, "header")(60, "h2");
    i0.ɵɵtext(61, "Upcoming Payments");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(62, "div", 17)(63, "button", 18);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_Template_button_click_63_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openLink("/reports?report=payment")); });
    i0.ɵɵdomElementStart(64, "span");
    i0.ɵɵtext(65, "Overdue");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(66, "strong");
    i0.ɵɵtext(67);
    i0.ɵɵpipe(68, "number");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(69, "small");
    i0.ɵɵtext(70);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(71, "button", 19);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_Template_button_click_71_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openLink("/reports?report=payment")); });
    i0.ɵɵdomElementStart(72, "span");
    i0.ɵɵtext(73, "7 days");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(74, "strong");
    i0.ɵɵtext(75);
    i0.ɵɵpipe(76, "number");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(77, "button", 19);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_Template_button_click_77_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openLink("/reports?report=payment")); });
    i0.ɵɵdomElementStart(78, "span");
    i0.ɵɵtext(79, "14 days");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(80, "strong");
    i0.ɵɵtext(81);
    i0.ɵɵpipe(82, "number");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(83, "button", 19);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_Template_button_click_83_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openLink("/reports?report=payment")); });
    i0.ɵɵdomElementStart(84, "span");
    i0.ɵɵtext(85, "30 days");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(86, "strong");
    i0.ɵɵtext(87);
    i0.ɵɵpipe(88, "number");
    i0.ɵɵdomElementEnd()()()();
    i0.ɵɵdomElementStart(89, "article", 16)(90, "header")(91, "h2");
    i0.ɵɵtext(92, "Enquiries Requiring Action");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(93, "ul", 20)(94, "li")(95, "button", 21);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_Template_button_click_95_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openActionRequired("inactive")); });
    i0.ɵɵdomElementStart(96, "span");
    i0.ɵɵtext(97, "Inactive (3+ days)");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(98, "strong");
    i0.ɵɵtext(99);
    i0.ɵɵdomElementEnd()()();
    i0.ɵɵdomElementStart(100, "li")(101, "button", 21);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_Template_button_click_101_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openActionRequired("unassigned")); });
    i0.ɵɵdomElementStart(102, "span");
    i0.ɵɵtext(103, "Unassigned");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(104, "strong");
    i0.ɵɵtext(105);
    i0.ɵɵdomElementEnd()()();
    i0.ɵɵdomElementStart(106, "li")(107, "button", 21);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_Template_button_click_107_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openActionRequired("expiring")); });
    i0.ɵɵdomElementStart(108, "span");
    i0.ɵɵtext(109, "Expiring Holds");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(110, "strong");
    i0.ɵɵtext(111);
    i0.ɵɵdomElementEnd()()();
    i0.ɵɵdomElementStart(112, "li", 22)(113, "button", 21);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_3_Template_button_click_113_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openActionRequired("total")); });
    i0.ɵɵdomElementStart(114, "span");
    i0.ɵɵtext(115, "Total");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(116, "strong");
    i0.ɵɵtext(117);
    i0.ɵɵdomElementEnd()()()()();
    i0.ɵɵdomElementStart(118, "article", 16)(119, "header")(120, "h2");
    i0.ɵɵtext(121, "Tasks Due Today");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(122, "ul", 23);
    i0.ɵɵrepeaterCreate(123, DashboardComponent_Conditional_3_For_124_Template, 6, 3, "li", null, _forTrack1);
    i0.ɵɵconditionalCreate(125, DashboardComponent_Conditional_3_Conditional_125_Template, 2, 0, "li", 24);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(126, "article", 16)(127, "header")(128, "h2");
    i0.ɵɵtext(129, "Upcoming Events (7d)");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(130, "ul", 23);
    i0.ɵɵrepeaterCreate(131, DashboardComponent_Conditional_3_For_132_Template, 7, 7, "li", null, _forTrack2);
    i0.ɵɵconditionalCreate(133, DashboardComponent_Conditional_3_Conditional_133_Template, 2, 0, "li", 24);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(134, "article", 10)(135, "header")(136, "h2");
    i0.ɵɵtext(137, "Recently Viewed");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(138, "ul", 25);
    i0.ɵɵrepeaterCreate(139, DashboardComponent_Conditional_3_For_140_Template, 7, 6, "li", null, _forTrack3);
    i0.ɵɵconditionalCreate(141, DashboardComponent_Conditional_3_Conditional_141_Template, 2, 0, "li", 24);
    i0.ɵɵdomElementEnd()()();
} if (rf & 2) {
    const model_r5 = ctx;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵclassProp("active", ctx_r1.period === "7d");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("active", ctx_r1.period === "30d");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("active", ctx_r1.period === "90d");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(model_r5.degradedMode ? 13 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(model_r5.kpis);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate1("Avg conversion ", i0.ɵɵpipeBind2(24, 36, model_r5.pipeline.averageConversionRatePercent, "1.0-1"), "%");
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(model_r5.pipeline.tentative.count);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", model_r5.pipeline.tentative.currencyCode, " ", i0.ɵɵpipeBind2(33, 39, model_r5.pipeline.tentative.value, "1.0-0"));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(model_r5.pipeline.openProposals.count);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", model_r5.pipeline.openProposals.currencyCode, " ", i0.ɵɵpipeBind2(41, 42, model_r5.pipeline.openProposals.value, "1.0-0"));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(model_r5.pipeline.provisional.count);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", model_r5.pipeline.provisional.currencyCode, " ", i0.ɵɵpipeBind2(49, 45, model_r5.pipeline.provisional.value, "1.0-0"));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(model_r5.pipeline.confirmed.count);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", model_r5.pipeline.confirmed.currencyCode, " ", i0.ɵɵpipeBind2(57, 48, model_r5.pipeline.confirmed.value, "1.0-0"));
    i0.ɵɵadvance(11);
    i0.ɵɵtextInterpolate2("", model_r5.upcomingPayments.currencyCode, " ", i0.ɵɵpipeBind2(68, 51, model_r5.upcomingPayments.overdueAmount, "1.0-0"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", model_r5.upcomingPayments.overdueCount, " milestones");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2("", model_r5.upcomingPayments.currencyCode, " ", i0.ɵɵpipeBind2(76, 54, model_r5.upcomingPayments.sevenDaysAmount, "1.0-0"));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate2("", model_r5.upcomingPayments.currencyCode, " ", i0.ɵɵpipeBind2(82, 57, model_r5.upcomingPayments.fourteenDaysAmount, "1.0-0"));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate2("", model_r5.upcomingPayments.currencyCode, " ", i0.ɵɵpipeBind2(88, 60, model_r5.upcomingPayments.thirtyDaysAmount, "1.0-0"));
    i0.ɵɵadvance(12);
    i0.ɵɵtextInterpolate(model_r5.actionRequired.inactiveEnquiries);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(model_r5.actionRequired.unassignedEnquiries);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(model_r5.actionRequired.expiringHolds);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(model_r5.actionRequired.total);
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(model_r5.tasksDueToday);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(model_r5.tasksDueToday.length === 0 ? 125 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(model_r5.upcomingEvents);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(model_r5.upcomingEvents.length === 0 ? 133 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(model_r5.recentActivity);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(model_r5.recentActivity.length === 0 ? 141 : -1);
} }
function DashboardComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "article", 1)(1, "h2");
    i0.ɵɵtext(2, "No Dashboard Data");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(3, "p");
    i0.ɵɵtext(4, "Choose a venue and retry loading your dashboard.");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(5, "button", 3);
    i0.ɵɵdomListener("click", function DashboardComponent_Conditional_4_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r14); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.retryLoad()); });
    i0.ɵɵtext(6, "Refresh");
    i0.ɵɵdomElementEnd()();
} }
export class DashboardComponent {
    constructor() {
        this.api = inject(ApiService);
        this.auth = inject(AuthService);
        this.destroyRef = inject(DestroyRef);
        this.router = inject(Router);
        this.data = null;
        this.period = '30d';
        this.isLoading = false;
        this.errorMessage = '';
        this.currentVenueId = null;
        this.recoveringVenue = false;
    }
    get venueName() {
        const venueId = this.auth.selectedVenueId;
        return this.auth.session?.venueRoles.find((role) => role.venueId === venueId)?.venueName ?? 'Current venue';
    }
    ngOnInit() {
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
    setPeriod(period) {
        this.period = period;
        this.loadDashboard();
    }
    openKpi(card) {
        this.router.navigateByUrl(card.clickRoute);
    }
    openEnquiriesTab(statusTab) {
        this.router.navigate(['/enquiries'], { queryParams: { statusTab } });
    }
    openActionRequired(action) {
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
    openTask(task) {
        this.router.navigate(['/enquiries'], { queryParams: { enquiry: task.enquiryId, statusTab: 'all' } });
    }
    openUpcomingEvent(event) {
        this.router.navigate(['/enquiries'], { queryParams: { enquiry: event.enquiryId, statusTab: 'all' } });
    }
    openActivity(activity) {
        if (activity.linkRoute) {
            this.router.navigateByUrl(activity.linkRoute);
            return;
        }
        if (activity.entityType === 'Enquiry') {
            this.router.navigate(['/enquiries'], { queryParams: { enquiry: activity.entityId, statusTab: 'all' } });
        }
    }
    openLink(path) {
        this.router.navigateByUrl(path);
    }
    retryLoad() {
        this.loadDashboard();
    }
    loadDashboard() {
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
                const apiMessage = typeof error?.error === 'string'
                    ? error.error
                    : typeof error?.error?.message === 'string'
                        ? error.error.message
                        : null;
                const apiCode = typeof error?.error?.code === 'string' ? error.error.code : null;
                const correlationId = typeof error?.error?.correlationId === 'string' ? error.error.correlationId : null;
                const connectivityMessage = error?.status === 0 ? 'Dashboard API is unreachable. Ensure backend is running on http://localhost:5080.' : null;
                this.data = null;
                const message = connectivityMessage ?? apiMessage ?? 'Unable to load dashboard data right now. Please retry.';
                const codeSuffix = apiCode ? ` [${apiCode}]` : '';
                const correlationSuffix = correlationId ? ` (Ref: ${correlationId})` : '';
                this.errorMessage = `${message}${codeSuffix}${correlationSuffix}`;
                this.isLoading = false;
            }
        });
    }
    static { this.ɵfac = function DashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DashboardComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DashboardComponent, selectors: [["app-dashboard"]], decls: 5, vars: 1, consts: [[1, "dashboard"], [1, "state-card"], [1, "state-card", "error"], ["type", "button", 1, "state-action", 3, "click"], [1, "page-header"], ["role", "group", "aria-label", "Period selector", 1, "period-controls"], ["type", "button", 3, "click"], [1, "kpi-grid"], ["type", "button", 1, "kpi-card"], [1, "widget-grid"], [1, "widget", "widget-wide"], [1, "pipeline-cards"], ["type", "button", 1, "pipeline-card", "tentative", 3, "click"], ["type", "button", 1, "pipeline-card", "proposals", 3, "click"], ["type", "button", 1, "pipeline-card", "provisional", 3, "click"], ["type", "button", 1, "pipeline-card", "confirmed", 3, "click"], [1, "widget"], [1, "payment-rows"], ["type", "button", 1, "payment-row", "overdue", 3, "click"], ["type", "button", 1, "payment-row", 3, "click"], [1, "action-list"], ["type", "button", 1, "row-action-btn", 3, "click"], [1, "total"], [1, "simple-list"], [1, "empty"], [1, "activity-list"], ["type", "button", 1, "kpi-card", 3, "click"], [1, "kpi-head"], [1, "kpi-help"]], template: function DashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "section", 0);
            i0.ɵɵconditionalCreate(1, DashboardComponent_Conditional_1_Template, 5, 0, "article", 1)(2, DashboardComponent_Conditional_2_Template, 7, 1, "article", 2)(3, DashboardComponent_Conditional_3_Template, 142, 63)(4, DashboardComponent_Conditional_4_Template, 7, 0, "article", 1);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            let tmp_0_0;
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isLoading ? 1 : ctx.errorMessage ? 2 : (tmp_0_0 = ctx.data) ? 3 : 4, tmp_0_0);
        } }, dependencies: [DatePipe, DecimalPipe], styles: [".dashboard[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n}\n\n.state-card[_ngcontent-%COMP%] {\n  border: 1px dashed #cbd5e1;\n  background: #f8fafc;\n  border-radius: 14px;\n  padding: 1rem;\n  display: grid;\n  gap: 0.5rem;\n}\n\n.state-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.1rem;\n  color: #0f172a;\n}\n\n.state-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #64748b;\n  font-size: 0.86rem;\n}\n\n.state-card.error[_ngcontent-%COMP%] {\n  border-color: #fecaca;\n  background: #fef2f2;\n}\n\n.state-action[_ngcontent-%COMP%] {\n  justify-self: start;\n  border: 1px solid #1d4ed8;\n  background: #2563eb;\n  color: #fff;\n  border-radius: 9px;\n  font-size: 0.8rem;\n  font-weight: 700;\n  padding: 0.4rem 0.72rem;\n}\n\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.8rem;\n}\n\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.55rem;\n  line-height: 1.1;\n  font-weight: 800;\n  color: #0f172a;\n}\n\n.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.2rem 0 0;\n  font-size: 0.88rem;\n  color: #64748b;\n}\n\n.period-controls[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 0.25rem;\n  padding: 0.2rem;\n  border-radius: 10px;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n}\n\n.period-controls[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 1px solid transparent;\n  background: transparent;\n  border-radius: 8px;\n  font-size: 0.75rem;\n  font-weight: 700;\n  color: #475569;\n  padding: 0.3rem 0.5rem;\n}\n\n.period-controls[_ngcontent-%COMP%]   button.active[_ngcontent-%COMP%] {\n  border-color: #bfdbfe;\n  color: #1d4ed8;\n  background: #eff6ff;\n}\n\n.kpi-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.8rem;\n}\n\n.kpi-card[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border);\n  background: #fff;\n  border-radius: 14px;\n  box-shadow: var(--cf-shadow-sm);\n  text-align: left;\n  padding: 0.85rem;\n  display: grid;\n  gap: 0.26rem;\n  transition: border-color 0.2s ease, transform 0.2s ease;\n}\n\n.kpi-card[_ngcontent-%COMP%]:hover {\n  border-color: #bfdbfe;\n  transform: translateY(-1px);\n}\n\n.kpi-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n\n.kpi-head[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  color: #64748b;\n  font-weight: 800;\n}\n\n.kpi-head[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.64rem;\n  font-style: normal;\n  color: #15803d;\n  background: #dcfce7;\n  padding: 0.1rem 0.36rem;\n  border-radius: 999px;\n  font-weight: 800;\n}\n\n.kpi-head[_ngcontent-%COMP%]   em.negative[_ngcontent-%COMP%] {\n  color: #b91c1c;\n  background: #fee2e2;\n}\n\n.kpi-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.38rem;\n  color: #0f172a;\n}\n\n.kpi-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #94a3b8;\n  font-size: 0.72rem;\n}\n\n.kpi-help[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: 0.68rem;\n  line-height: 1.25;\n  font-weight: 600;\n}\n\n.widget-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.8rem;\n}\n\n.widget[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border);\n  background: #fff;\n  border-radius: 14px;\n  box-shadow: var(--cf-shadow-sm);\n  padding: 0.9rem;\n  display: grid;\n  gap: 0.7rem;\n}\n\n.widget-wide[_ngcontent-%COMP%] {\n  grid-column: span 2;\n}\n\n.widget[_ngcontent-%COMP%]   header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.8rem;\n}\n\n.widget[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.98rem;\n  color: #0f172a;\n  font-weight: 800;\n}\n\n.widget[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  font-size: 0.7rem;\n  font-weight: 700;\n}\n\n.pipeline-cards[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.55rem;\n}\n\n.pipeline-card[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  background: #fff;\n  text-align: left;\n  padding: 0.6rem;\n  display: grid;\n  gap: 0.14rem;\n}\n\n.pipeline-card[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 0.64rem;\n  color: #64748b;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  font-weight: 800;\n}\n\n.pipeline-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  color: #0f172a;\n  line-height: 1.1;\n}\n\n.pipeline-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n  color: #64748b;\n}\n\n.pipeline-card.tentative[_ngcontent-%COMP%] {\n  border-left: 4px solid #60a5fa;\n}\n\n.pipeline-card.proposals[_ngcontent-%COMP%] {\n  border-left: 4px solid #3b82f6;\n}\n\n.pipeline-card.provisional[_ngcontent-%COMP%] {\n  border-left: 4px solid #d97706;\n}\n\n.pipeline-card.confirmed[_ngcontent-%COMP%] {\n  border-left: 4px solid #16a34a;\n}\n\n.payment-rows[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.45rem;\n}\n\n.payment-row[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  background: #fff;\n  padding: 0.5rem 0.55rem;\n  text-align: left;\n  display: grid;\n  gap: 0.1rem;\n}\n\n.payment-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: #64748b;\n}\n\n.payment-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.86rem;\n  color: #0f172a;\n}\n\n.payment-row[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: #64748b;\n}\n\n.payment-row.overdue[_ngcontent-%COMP%] {\n  border-color: #fecaca;\n  background: #fff7f7;\n}\n\n.action-list[_ngcontent-%COMP%], \n.simple-list[_ngcontent-%COMP%], \n.activity-list[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: grid;\n  gap: 0.4rem;\n}\n\n.action-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%], \n.simple-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%], \n.activity-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  background: #f8fafc;\n  padding: 0.45rem 0.55rem;\n  display: grid;\n  gap: 0.08rem;\n}\n\n.action-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: block;\n}\n\n.action-list[_ngcontent-%COMP%]   li.total[_ngcontent-%COMP%] {\n  border-color: #bfdbfe;\n  background: #eff6ff;\n}\n\n.action-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover, \n.simple-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover, \n.activity-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover {\n  border-color: #bfdbfe;\n  background: #eff6ff;\n}\n\n.row-action-btn[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  width: 100%;\n  padding: 0;\n  text-align: left;\n  display: grid;\n  gap: 0.08rem;\n}\n\n.action-list[_ngcontent-%COMP%]   .row-action-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.action-list[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.simple-list[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.activity-list[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  color: #1f2937;\n}\n\n.action-list[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.84rem;\n  color: #0f172a;\n}\n\n.simple-list[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.activity-list[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: #64748b;\n}\n\n.empty[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n\n@media (max-width: 1180px) {\n  .kpi-grid[_ngcontent-%COMP%], \n   .widget-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .widget-wide[_ngcontent-%COMP%] {\n    grid-column: span 2;\n  }\n}\n\n@media (max-width: 760px) {\n  .page-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n\n  .kpi-grid[_ngcontent-%COMP%], \n   .widget-grid[_ngcontent-%COMP%], \n   .pipeline-cards[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .widget-wide[_ngcontent-%COMP%] {\n    grid-column: span 1;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DashboardComponent, [{
        type: Component,
        args: [{ selector: 'app-dashboard', imports: [DatePipe, DecimalPipe], template: "<section class=\"dashboard\">\n  @if (isLoading) {\n    <article class=\"state-card\">\n      <h2>Loading Dashboard</h2>\n      <p>Fetching live pipeline, revenue, and payment widgets.</p>\n    </article>\n  } @else if (errorMessage) {\n    <article class=\"state-card error\">\n      <h2>Dashboard Unavailable</h2>\n      <p>{{ errorMessage }}</p>\n      <button type=\"button\" class=\"state-action\" (click)=\"retryLoad()\">Retry</button>\n    </article>\n  } @else if (data; as model) {\n    <header class=\"page-header\">\n      <div>\n        <h1>Dashboard</h1>\n        <p>Live sales, conversion, payments, and action signals.</p>\n      </div>\n      <div class=\"period-controls\" role=\"group\" aria-label=\"Period selector\">\n        <button type=\"button\" [class.active]=\"period === '7d'\" (click)=\"setPeriod('7d')\">7d</button>\n        <button type=\"button\" [class.active]=\"period === '30d'\" (click)=\"setPeriod('30d')\">30d</button>\n        <button type=\"button\" [class.active]=\"period === '90d'\" (click)=\"setPeriod('90d')\">90d</button>\n      </div>\n    </header>\n\n    @if (model.degradedMode) {\n      <article class=\"state-card\">\n        <h2>Limited Dashboard Mode</h2>\n        @for (warning of model.warnings; track warning) {\n          <p>{{ warning }}</p>\n        }\n      </article>\n    }\n\n    <section class=\"kpi-grid\">\n      @for (card of model.kpis; track card.key) {\n        <button class=\"kpi-card\" type=\"button\" (click)=\"openKpi(card)\">\n          <div class=\"kpi-head\">\n            <span>{{ card.label }}</span>\n            <em [class.negative]=\"card.deltaPercent < 0\">{{ card.deltaPercent | number: '1.0-1' }}%</em>\n          </div>\n          <strong>{{ card.displayValue }}</strong>\n          <p>{{ card.secondaryText }}</p>\n          @if (card.key === 'sales-delivered' || card.key === 'salesDelivered') {\n            <small class=\"kpi-help\">Revenue earned from events completed this month.</small>\n          }\n          @if (card.key === 'sales-created' || card.key === 'salesCreated') {\n            <small class=\"kpi-help\">Future revenue secured by bookings confirmed this month.</small>\n          }\n        </button>\n      }\n    </section>\n\n    <section class=\"widget-grid\">\n      <article class=\"widget widget-wide\">\n        <header>\n          <h2>Enquiry Pipeline Value</h2>\n          <small>Avg conversion {{ model.pipeline.averageConversionRatePercent | number: '1.0-1' }}%</small>\n        </header>\n\n        <div class=\"pipeline-cards\">\n          <button type=\"button\" class=\"pipeline-card tentative\" (click)=\"openEnquiriesTab('new-unanswered')\">\n            <label>Tentative</label>\n            <strong>{{ model.pipeline.tentative.count }}</strong>\n            <span>{{ model.pipeline.tentative.currencyCode }} {{ model.pipeline.tentative.value | number: '1.0-0' }}</span>\n          </button>\n          <button type=\"button\" class=\"pipeline-card proposals\" (click)=\"openEnquiriesTab('proposals')\">\n            <label>Open Proposals</label>\n            <strong>{{ model.pipeline.openProposals.count }}</strong>\n            <span>{{ model.pipeline.openProposals.currencyCode }} {{ model.pipeline.openProposals.value | number: '1.0-0' }}</span>\n          </button>\n          <button type=\"button\" class=\"pipeline-card provisional\" (click)=\"openEnquiriesTab('provisional')\">\n            <label>Provisional</label>\n            <strong>{{ model.pipeline.provisional.count }}</strong>\n            <span>{{ model.pipeline.provisional.currencyCode }} {{ model.pipeline.provisional.value | number: '1.0-0' }}</span>\n          </button>\n          <button type=\"button\" class=\"pipeline-card confirmed\" (click)=\"openEnquiriesTab('confirmed')\">\n            <label>Confirmed (90d)</label>\n            <strong>{{ model.pipeline.confirmed.count }}</strong>\n            <span>{{ model.pipeline.confirmed.currencyCode }} {{ model.pipeline.confirmed.value | number: '1.0-0' }}</span>\n          </button>\n        </div>\n      </article>\n\n      <article class=\"widget\">\n        <header>\n          <h2>Upcoming Payments</h2>\n        </header>\n\n        <div class=\"payment-rows\">\n          <button type=\"button\" class=\"payment-row overdue\" (click)=\"openLink('/reports?report=payment')\">\n            <span>Overdue</span>\n            <strong>{{ model.upcomingPayments.currencyCode }} {{ model.upcomingPayments.overdueAmount | number: '1.0-0' }}</strong>\n            <small>{{ model.upcomingPayments.overdueCount }} milestones</small>\n          </button>\n          <button type=\"button\" class=\"payment-row\" (click)=\"openLink('/reports?report=payment')\">\n            <span>7 days</span>\n            <strong>{{ model.upcomingPayments.currencyCode }} {{ model.upcomingPayments.sevenDaysAmount | number: '1.0-0' }}</strong>\n          </button>\n          <button type=\"button\" class=\"payment-row\" (click)=\"openLink('/reports?report=payment')\">\n            <span>14 days</span>\n            <strong>{{ model.upcomingPayments.currencyCode }} {{ model.upcomingPayments.fourteenDaysAmount | number: '1.0-0' }}</strong>\n          </button>\n          <button type=\"button\" class=\"payment-row\" (click)=\"openLink('/reports?report=payment')\">\n            <span>30 days</span>\n            <strong>{{ model.upcomingPayments.currencyCode }} {{ model.upcomingPayments.thirtyDaysAmount | number: '1.0-0' }}</strong>\n          </button>\n        </div>\n      </article>\n\n      <article class=\"widget\">\n        <header>\n          <h2>Enquiries Requiring Action</h2>\n        </header>\n\n        <ul class=\"action-list\">\n          <li>\n            <button type=\"button\" class=\"row-action-btn\" (click)=\"openActionRequired('inactive')\">\n            <span>Inactive (3+ days)</span>\n            <strong>{{ model.actionRequired.inactiveEnquiries }}</strong>\n            </button>\n          </li>\n          <li>\n            <button type=\"button\" class=\"row-action-btn\" (click)=\"openActionRequired('unassigned')\">\n            <span>Unassigned</span>\n            <strong>{{ model.actionRequired.unassignedEnquiries }}</strong>\n            </button>\n          </li>\n          <li>\n            <button type=\"button\" class=\"row-action-btn\" (click)=\"openActionRequired('expiring')\">\n            <span>Expiring Holds</span>\n            <strong>{{ model.actionRequired.expiringHolds }}</strong>\n            </button>\n          </li>\n          <li class=\"total\">\n            <button type=\"button\" class=\"row-action-btn\" (click)=\"openActionRequired('total')\">\n            <span>Total</span>\n            <strong>{{ model.actionRequired.total }}</strong>\n            </button>\n          </li>\n        </ul>\n      </article>\n\n      <article class=\"widget\">\n        <header>\n          <h2>Tasks Due Today</h2>\n        </header>\n\n        <ul class=\"simple-list\">\n          @for (task of model.tasksDueToday; track task.taskId) {\n            <li>\n              <button type=\"button\" class=\"row-action-btn\" (click)=\"openTask(task)\">\n              <span>{{ task.title }}</span>\n              <small>{{ task.enquiryReference }} \u00B7 {{ task.priority }}</small>\n              </button>\n            </li>\n          }\n          @if (model.tasksDueToday.length === 0) {\n            <li class=\"empty\">No tasks due.</li>\n          }\n        </ul>\n      </article>\n\n      <article class=\"widget\">\n        <header>\n          <h2>Upcoming Events (7d)</h2>\n        </header>\n\n        <ul class=\"simple-list\">\n          @for (event of model.upcomingEvents; track event.enquiryId) {\n            <li>\n              <button type=\"button\" class=\"row-action-btn\" (click)=\"openUpcomingEvent(event)\">\n              <span>{{ event.eventName }}</span>\n              <small>{{ event.clientName }} \u00B7 {{ event.eventStartUtc | date: 'dd/MM HH:mm' }} \u00B7 {{ event.guests }} covers</small>\n              </button>\n            </li>\n          }\n          @if (model.upcomingEvents.length === 0) {\n            <li class=\"empty\">No events in the next 7 days.</li>\n          }\n        </ul>\n      </article>\n\n      <article class=\"widget widget-wide\">\n        <header>\n          <h2>Recently Viewed</h2>\n        </header>\n\n        <ul class=\"activity-list\">\n          @for (activity of model.recentActivity; track activity.id) {\n            <li>\n              <button type=\"button\" class=\"row-action-btn\" (click)=\"openActivity(activity)\">\n              <span>{{ activity.actionType }}</span>\n              <small>{{ activity.userName || 'System' }} \u00B7 {{ activity.createdAtUtc | date: 'dd/MM HH:mm' }}</small>\n              </button>\n            </li>\n          }\n          @if (model.recentActivity.length === 0) {\n            <li class=\"empty\">No recently viewed records.</li>\n          }\n        </ul>\n      </article>\n    </section>\n  } @else {\n    <article class=\"state-card\">\n      <h2>No Dashboard Data</h2>\n      <p>Choose a venue and retry loading your dashboard.</p>\n      <button type=\"button\" class=\"state-action\" (click)=\"retryLoad()\">Refresh</button>\n    </article>\n  }\n</section>\n", styles: [".dashboard {\n  display: grid;\n  gap: 1rem;\n}\n\n.state-card {\n  border: 1px dashed #cbd5e1;\n  background: #f8fafc;\n  border-radius: 14px;\n  padding: 1rem;\n  display: grid;\n  gap: 0.5rem;\n}\n\n.state-card h2 {\n  margin: 0;\n  font-size: 1.1rem;\n  color: #0f172a;\n}\n\n.state-card p {\n  margin: 0;\n  color: #64748b;\n  font-size: 0.86rem;\n}\n\n.state-card.error {\n  border-color: #fecaca;\n  background: #fef2f2;\n}\n\n.state-action {\n  justify-self: start;\n  border: 1px solid #1d4ed8;\n  background: #2563eb;\n  color: #fff;\n  border-radius: 9px;\n  font-size: 0.8rem;\n  font-weight: 700;\n  padding: 0.4rem 0.72rem;\n}\n\n.page-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.8rem;\n}\n\n.page-header h1 {\n  margin: 0;\n  font-size: 1.55rem;\n  line-height: 1.1;\n  font-weight: 800;\n  color: #0f172a;\n}\n\n.page-header p {\n  margin: 0.2rem 0 0;\n  font-size: 0.88rem;\n  color: #64748b;\n}\n\n.period-controls {\n  display: inline-flex;\n  gap: 0.25rem;\n  padding: 0.2rem;\n  border-radius: 10px;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n}\n\n.period-controls button {\n  border: 1px solid transparent;\n  background: transparent;\n  border-radius: 8px;\n  font-size: 0.75rem;\n  font-weight: 700;\n  color: #475569;\n  padding: 0.3rem 0.5rem;\n}\n\n.period-controls button.active {\n  border-color: #bfdbfe;\n  color: #1d4ed8;\n  background: #eff6ff;\n}\n\n.kpi-grid {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.8rem;\n}\n\n.kpi-card {\n  border: 1px solid var(--cf-border);\n  background: #fff;\n  border-radius: 14px;\n  box-shadow: var(--cf-shadow-sm);\n  text-align: left;\n  padding: 0.85rem;\n  display: grid;\n  gap: 0.26rem;\n  transition: border-color 0.2s ease, transform 0.2s ease;\n}\n\n.kpi-card:hover {\n  border-color: #bfdbfe;\n  transform: translateY(-1px);\n}\n\n.kpi-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n\n.kpi-head span {\n  font-size: 0.72rem;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  color: #64748b;\n  font-weight: 800;\n}\n\n.kpi-head em {\n  margin: 0;\n  font-size: 0.64rem;\n  font-style: normal;\n  color: #15803d;\n  background: #dcfce7;\n  padding: 0.1rem 0.36rem;\n  border-radius: 999px;\n  font-weight: 800;\n}\n\n.kpi-head em.negative {\n  color: #b91c1c;\n  background: #fee2e2;\n}\n\n.kpi-card strong {\n  font-size: 1.38rem;\n  color: #0f172a;\n}\n\n.kpi-card p {\n  margin: 0;\n  color: #94a3b8;\n  font-size: 0.72rem;\n}\n\n.kpi-help {\n  color: #64748b;\n  font-size: 0.68rem;\n  line-height: 1.25;\n  font-weight: 600;\n}\n\n.widget-grid {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.8rem;\n}\n\n.widget {\n  border: 1px solid var(--cf-border);\n  background: #fff;\n  border-radius: 14px;\n  box-shadow: var(--cf-shadow-sm);\n  padding: 0.9rem;\n  display: grid;\n  gap: 0.7rem;\n}\n\n.widget-wide {\n  grid-column: span 2;\n}\n\n.widget header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.8rem;\n}\n\n.widget h2 {\n  margin: 0;\n  font-size: 0.98rem;\n  color: #0f172a;\n  font-weight: 800;\n}\n\n.widget header small {\n  color: #94a3b8;\n  font-size: 0.7rem;\n  font-weight: 700;\n}\n\n.pipeline-cards {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.55rem;\n}\n\n.pipeline-card {\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  background: #fff;\n  text-align: left;\n  padding: 0.6rem;\n  display: grid;\n  gap: 0.14rem;\n}\n\n.pipeline-card label {\n  font-size: 0.64rem;\n  color: #64748b;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  font-weight: 800;\n}\n\n.pipeline-card strong {\n  font-size: 1.2rem;\n  color: #0f172a;\n  line-height: 1.1;\n}\n\n.pipeline-card span {\n  font-size: 0.72rem;\n  color: #64748b;\n}\n\n.pipeline-card.tentative {\n  border-left: 4px solid #60a5fa;\n}\n\n.pipeline-card.proposals {\n  border-left: 4px solid #3b82f6;\n}\n\n.pipeline-card.provisional {\n  border-left: 4px solid #d97706;\n}\n\n.pipeline-card.confirmed {\n  border-left: 4px solid #16a34a;\n}\n\n.payment-rows {\n  display: grid;\n  gap: 0.45rem;\n}\n\n.payment-row {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  background: #fff;\n  padding: 0.5rem 0.55rem;\n  text-align: left;\n  display: grid;\n  gap: 0.1rem;\n}\n\n.payment-row span {\n  font-size: 0.7rem;\n  color: #64748b;\n}\n\n.payment-row strong {\n  font-size: 0.86rem;\n  color: #0f172a;\n}\n\n.payment-row small {\n  font-size: 0.7rem;\n  color: #64748b;\n}\n\n.payment-row.overdue {\n  border-color: #fecaca;\n  background: #fff7f7;\n}\n\n.action-list,\n.simple-list,\n.activity-list {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: grid;\n  gap: 0.4rem;\n}\n\n.action-list li,\n.simple-list li,\n.activity-list li {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  background: #f8fafc;\n  padding: 0.45rem 0.55rem;\n  display: grid;\n  gap: 0.08rem;\n}\n\n.action-list li {\n  display: block;\n}\n\n.action-list li.total {\n  border-color: #bfdbfe;\n  background: #eff6ff;\n}\n\n.action-list li:hover,\n.simple-list li:hover,\n.activity-list li:hover {\n  border-color: #bfdbfe;\n  background: #eff6ff;\n}\n\n.row-action-btn {\n  border: 0;\n  background: transparent;\n  width: 100%;\n  padding: 0;\n  text-align: left;\n  display: grid;\n  gap: 0.08rem;\n}\n\n.action-list .row-action-btn {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.action-list span,\n.simple-list span,\n.activity-list span {\n  font-size: 0.78rem;\n  color: #1f2937;\n}\n\n.action-list strong {\n  font-size: 0.84rem;\n  color: #0f172a;\n}\n\n.simple-list small,\n.activity-list small {\n  font-size: 0.7rem;\n  color: #64748b;\n}\n\n.empty {\n  color: #94a3b8;\n}\n\n@media (max-width: 1180px) {\n  .kpi-grid,\n  .widget-grid {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .widget-wide {\n    grid-column: span 2;\n  }\n}\n\n@media (max-width: 760px) {\n  .page-header {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n\n  .kpi-grid,\n  .widget-grid,\n  .pipeline-cards {\n    grid-template-columns: 1fr;\n  }\n\n  .widget-wide {\n    grid-column: span 1;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src/app/pages/dashboard/dashboard.component.ts", lineNumber: 22 }); })();
//# sourceMappingURL=dashboard.component.js.map