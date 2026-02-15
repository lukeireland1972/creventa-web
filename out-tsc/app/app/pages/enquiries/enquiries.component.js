import { Component, DestroyRef, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
function EnquiriesComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 2)(1, "article")(2, "div", 12)(3, "span");
    i0.ɵɵtext(4, "New Enquiries");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "em", 13);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "strong");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p");
    i0.ɵɵtext(10, "vs previous period");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "article")(12, "div", 12)(13, "span");
    i0.ɵɵtext(14, "Proposals Sent");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "em", 13);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "strong");
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "p");
    i0.ɵɵtext(20, "active this period");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "article")(22, "div", 12)(23, "span");
    i0.ɵɵtext(24, "Confirmed");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "em", 13);
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(27, "strong");
    i0.ɵɵtext(28);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "p");
    i0.ɵɵtext(30, "bookings converted");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(31, "article")(32, "div", 12)(33, "span");
    i0.ɵɵtext(34, "Lost");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "em", 14);
    i0.ɵɵtext(36);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(37, "strong");
    i0.ɵɵtext(38);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "p");
    i0.ɵɵtext(40, "conversion drop-off");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const list_r1 = ctx;
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1("", list_r1.stats.newEnquiriesDeltaPercent, "%");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(list_r1.stats.newEnquiries);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate1("", list_r1.stats.proposalsSentDeltaPercent, "%");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(list_r1.stats.proposalsSent);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate1("", list_r1.stats.confirmedDeltaPercent, "%");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(list_r1.stats.confirmed);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate1("", list_r1.stats.lostRatePercent, "% rate");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(list_r1.stats.lost);
} }
function EnquiriesComponent_Conditional_9_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 16);
    i0.ɵɵlistener("click", function EnquiriesComponent_Conditional_9_For_2_Template_button_click_0_listener() { const tab_r3 = i0.ɵɵrestoreView(_r2).$implicit; const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.setTab(tab_r3.key)); });
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "em");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const tab_r3 = ctx.$implicit;
    const list_r5 = i0.ɵɵnextContext();
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("active", tab_r3.key === ctx_r3.activeTab);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(tab_r3.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(list_r5.statusTabCounts[tab_r3.key]);
} }
function EnquiriesComponent_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 3);
    i0.ɵɵrepeaterCreate(1, EnquiriesComponent_Conditional_9_For_2_Template, 5, 4, "button", 15, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r3.statusTabs);
} }
function EnquiriesComponent_For_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 8);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const quickFilter_r6 = ctx.$implicit;
    i0.ɵɵproperty("value", quickFilter_r6.value);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(quickFilter_r6.label);
} }
function EnquiriesComponent_Conditional_27_For_25_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 21);
    i0.ɵɵlistener("click", function EnquiriesComponent_Conditional_27_For_25_Template_tr_click_0_listener() { const enquiry_r8 = i0.ɵɵrestoreView(_r7).$implicit; const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.selectEnquiry(enquiry_r8.id)); });
    i0.ɵɵelementStart(1, "td", 22);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td")(4, "div", 23);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 24);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "td")(9, "div", 23);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 24);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "td")(14, "div", 23);
    i0.ɵɵtext(15);
    i0.ɵɵpipe(16, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "div", 24);
    i0.ɵɵtext(18);
    i0.ɵɵpipe(19, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "td");
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "td")(23, "span", 25);
    i0.ɵɵtext(24);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(25, "td");
    i0.ɵɵtext(26);
    i0.ɵɵpipe(27, "number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "td");
    i0.ɵɵtext(29);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "td")(31, "div", 23);
    i0.ɵɵtext(32);
    i0.ɵɵpipe(33, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "div", 24);
    i0.ɵɵtext(35);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const enquiry_r8 = ctx.$implicit;
    const ctx_r3 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("selected", enquiry_r8.id === ctx_r3.selectedEnquiryId);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(enquiry_r8.reference);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(enquiry_r8.contactName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(enquiry_r8.sourceType);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(enquiry_r8.eventType);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(enquiry_r8.eventStyle || "Style not set");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(16, 17, enquiry_r8.eventStartUtc, "dd/MM/yyyy"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(19, 20, enquiry_r8.eventStartUtc, "HH:mm"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(enquiry_r8.guestsExpected);
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("data-status", ctx_r3.statusToken(enquiry_r8.status));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", enquiry_r8.status, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" ", enquiry_r8.proposalValue ? i0.ɵɵpipeBind2(27, 23, enquiry_r8.proposalValue, "1.0-0") : "TBD", " ", enquiry_r8.currencyCode, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(enquiry_r8.eventManagerName || "Unassigned");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(33, 26, enquiry_r8.lastActivityAtUtc, "dd/MM HH:mm"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", enquiry_r8.daysSinceContact, " days");
} }
function EnquiriesComponent_Conditional_27_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 19);
    i0.ɵɵtext(1, "No enquiries matched the current filters.");
    i0.ɵɵelementEnd();
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_31_Conditional_39_For_4_For_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵpipe(3, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const event_r10 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate4(" ", event_r10.label, " \u00B7 ", event_r10.recordType, " \u00B7 ", i0.ɵɵpipeBind2(2, 4, event_r10.startUtc, "HH:mm"), "-", i0.ɵɵpipeBind2(3, 7, event_r10.endUtc, "HH:mm"), " ");
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_31_Conditional_39_For_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article")(1, "header")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵrepeaterCreate(6, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_31_Conditional_39_For_4_For_7_Template, 4, 10, "p", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r11 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(group_r11.spaceName);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("busy", !group_r11.isAvailable);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(group_r11.isAvailable ? "Available" : "Busy");
    i0.ɵɵadvance();
    i0.ɵɵrepeater(group_r11.events);
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_31_Conditional_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 30)(1, "h3");
    i0.ɵɵtext(2, "Same-date availability");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(3, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_31_Conditional_39_For_4_Template, 8, 4, "article", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const detail_r12 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(detail_r12.sameDateAvailability.spaces);
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 28)(1, "div", 29)(2, "p")(3, "strong");
    i0.ɵɵtext(4, "Event:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p")(7, "strong");
    i0.ɵɵtext(8, "Date:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(9);
    i0.ɵɵpipe(10, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "p")(12, "strong");
    i0.ɵɵtext(13, "Guests:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "p")(16, "strong");
    i0.ɵɵtext(17, "Style:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "p")(20, "strong");
    i0.ɵɵtext(21, "Manager:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "p")(24, "strong");
    i0.ɵɵtext(25, "Lead Quality:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "p")(28, "strong");
    i0.ɵɵtext(29, "Source:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(30);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "p")(32, "strong");
    i0.ɵɵtext(33, "Phone:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(34);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "p")(36, "strong");
    i0.ɵɵtext(37, "Email:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(38);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(39, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_31_Conditional_39_Template, 5, 0, "div", 30);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const detail_r12 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", detail_r12.eventName || detail_r12.eventType);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(10, 11, detail_r12.eventStartUtc, "dd/MM/yyyy HH:mm"));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", detail_r12.guestsExpected);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", detail_r12.eventStyle || "Not set");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", detail_r12.eventManagerName || "Unassigned");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", detail_r12.leadQuality, "/5");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2(" ", detail_r12.sourceType, " ", detail_r12.sourceDetail ? "\u00B7 " + detail_r12.sourceDetail : "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", detail_r12.contactPhoneNumberE164);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", detail_r12.contactEmail);
    i0.ɵɵadvance();
    i0.ɵɵconditional(detail_r12.sameDateAvailability ? 39 : -1);
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_32_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 31)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "date");
    i0.ɵɵpipe(6, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "span");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const subEvent_r13 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(subEvent_r13.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", i0.ɵɵpipeBind2(5, 5, subEvent_r13.startUtc, "dd/MM HH:mm"), " - ", i0.ɵɵpipeBind2(6, 8, subEvent_r13.endUtc, "HH:mm"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2("", subEvent_r13.guestCount, " guests \u00B7 ", subEvent_r13.setupStyle || "Custom");
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_32_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 19);
    i0.ɵɵtext(1, "No sub-events configured.");
    i0.ɵɵelementEnd();
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 28);
    i0.ɵɵrepeaterCreate(1, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_32_For_2_Template, 9, 11, "article", 31, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵconditionalCreate(3, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_32_Conditional_3_Template, 2, 0, "p", 19);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const detail_r12 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(detail_r12.subEvents);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(detail_r12.subEvents.length === 0 ? 3 : -1);
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_33_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 31)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const appointment_r14 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(appointment_r14.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", i0.ɵɵpipeBind2(5, 5, appointment_r14.startUtc, "dd/MM/yyyy HH:mm"), " \u00B7 ", appointment_r14.durationMinutes, " mins");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate2("", appointment_r14.spaceName || "No space", " \u00B7 ", appointment_r14.status);
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_33_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 19);
    i0.ɵɵtext(1, "No appointments linked.");
    i0.ɵɵelementEnd();
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 28);
    i0.ɵɵrepeaterCreate(1, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_33_For_2_Template, 8, 8, "article", 31, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵconditionalCreate(3, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_33_Conditional_3_Template, 2, 0, "p", 19);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const detail_r12 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(detail_r12.appointments);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(detail_r12.appointments.length === 0 ? 3 : -1);
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_34_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 19);
    i0.ɵɵtext(1, "Loading proposals...");
    i0.ɵɵelementEnd();
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_34_Conditional_5_Conditional_0_For_1_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 34)(1, "div")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div")(8, "span");
    i0.ɵɵtext(9);
    i0.ɵɵpipe(10, "number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "button", 33);
    i0.ɵɵlistener("click", function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_34_Conditional_5_Conditional_0_For_1_Template_button_click_11_listener() { const proposal_r17 = i0.ɵɵrestoreView(_r16).$implicit; const ctx_r3 = i0.ɵɵnextContext(6); return i0.ɵɵresetView(ctx_r3.openProposalInMaker(proposal_r17.id)); });
    i0.ɵɵtext(12, "Open");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const proposal_r17 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate2("", proposal_r17.version, " \u00B7 ", proposal_r17.status);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(6, 5, proposal_r17.createdAtUtc, "dd/MM/yyyy HH:mm"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2("", i0.ɵɵpipeBind2(10, 8, proposal_r17.totalAmount, "1.2-2"), " ", proposal_r17.currencyCode);
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_34_Conditional_5_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_34_Conditional_5_Conditional_0_For_1_Template, 13, 11, "article", 34, i0.ɵɵrepeaterTrackByIdentity);
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext(5);
    i0.ɵɵrepeater(ctx_r3.enquiryProposals);
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_34_Conditional_5_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 19);
    i0.ɵɵtext(1, "No proposals created for this enquiry yet.");
    i0.ɵɵelementEnd();
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_34_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_34_Conditional_5_Conditional_0_Template, 2, 0)(1, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_34_Conditional_5_Conditional_1_Template, 2, 0, "p", 19);
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext(4);
    i0.ɵɵconditional(ctx_r3.enquiryProposals.length > 0 ? 0 : 1);
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 28)(1, "div", 32)(2, "button", 33);
    i0.ɵɵlistener("click", function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_34_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r15); const ctx_r3 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r3.createProposalForSelectedEnquiry()); });
    i0.ɵɵtext(3, "Create New Proposal");
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(4, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_34_Conditional_4_Template, 2, 0, "p", 19)(5, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_34_Conditional_5_Template, 2, 1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r3.enquiryProposalsLoading ? 4 : 5);
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 28)(1, "p");
    i0.ɵɵtext(2, "Documents upload/download flow is wired for Phase 2.");
    i0.ɵɵelementEnd()();
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_36_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 31)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const entry_r18 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(entry_r18.actionType);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(5, 3, entry_r18.createdAtUtc, "dd/MM/yyyy HH:mm"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(entry_r18.userName || "System");
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_36_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 19);
    i0.ɵɵtext(1, "No activity captured yet.");
    i0.ɵɵelementEnd();
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 28);
    i0.ɵɵrepeaterCreate(1, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_36_For_2_Template, 8, 6, "article", 31, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵconditionalCreate(3, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_36_Conditional_3_Template, 2, 0, "p", 19);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const detail_r12 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(detail_r12.activityLog);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(detail_r12.activityLog.length === 0 ? 3 : -1);
} }
function EnquiriesComponent_Conditional_27_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "aside", 20)(1, "header")(2, "div")(3, "h2");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "span", 25);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 26)(10, "button", 21);
    i0.ɵɵlistener("click", function EnquiriesComponent_Conditional_27_Conditional_27_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r9); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.changeStatus("Tentative")); });
    i0.ɵɵtext(11, "Tentative");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "button", 21);
    i0.ɵɵlistener("click", function EnquiriesComponent_Conditional_27_Conditional_27_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r9); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.changeStatus("OpenProposal")); });
    i0.ɵɵtext(13, "Open Proposal");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "button", 21);
    i0.ɵɵlistener("click", function EnquiriesComponent_Conditional_27_Conditional_27_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r9); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.changeStatus("Provisional")); });
    i0.ɵɵtext(15, "Provisional");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "button", 21);
    i0.ɵɵlistener("click", function EnquiriesComponent_Conditional_27_Conditional_27_Template_button_click_16_listener() { i0.ɵɵrestoreView(_r9); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.changeStatus("Confirmed")); });
    i0.ɵɵtext(17, "Confirmed");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "nav", 27)(19, "button", 21);
    i0.ɵɵlistener("click", function EnquiriesComponent_Conditional_27_Conditional_27_Template_button_click_19_listener() { i0.ɵɵrestoreView(_r9); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.changeDetailTab("overview")); });
    i0.ɵɵtext(20, "Overview");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "button", 21);
    i0.ɵɵlistener("click", function EnquiriesComponent_Conditional_27_Conditional_27_Template_button_click_21_listener() { i0.ɵɵrestoreView(_r9); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.changeDetailTab("events")); });
    i0.ɵɵtext(22, "Events");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "button", 21);
    i0.ɵɵlistener("click", function EnquiriesComponent_Conditional_27_Conditional_27_Template_button_click_23_listener() { i0.ɵɵrestoreView(_r9); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.changeDetailTab("appointments")); });
    i0.ɵɵtext(24, "Appointments");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "button", 21);
    i0.ɵɵlistener("click", function EnquiriesComponent_Conditional_27_Conditional_27_Template_button_click_25_listener() { i0.ɵɵrestoreView(_r9); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.changeDetailTab("proposals")); });
    i0.ɵɵtext(26, "Proposals");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "button", 21);
    i0.ɵɵlistener("click", function EnquiriesComponent_Conditional_27_Conditional_27_Template_button_click_27_listener() { i0.ɵɵrestoreView(_r9); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.changeDetailTab("documents")); });
    i0.ɵɵtext(28, "Documents");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "button", 21);
    i0.ɵɵlistener("click", function EnquiriesComponent_Conditional_27_Conditional_27_Template_button_click_29_listener() { i0.ɵɵrestoreView(_r9); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.changeDetailTab("activity")); });
    i0.ɵɵtext(30, "Activity");
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(31, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_31_Template, 40, 14, "section", 28);
    i0.ɵɵconditionalCreate(32, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_32_Template, 4, 1, "section", 28);
    i0.ɵɵconditionalCreate(33, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_33_Template, 4, 1, "section", 28);
    i0.ɵɵconditionalCreate(34, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_34_Template, 6, 1, "section", 28);
    i0.ɵɵconditionalCreate(35, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_35_Template, 3, 0, "section", 28);
    i0.ɵɵconditionalCreate(36, EnquiriesComponent_Conditional_27_Conditional_27_Conditional_36_Template, 4, 1, "section", 28);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const detail_r12 = ctx;
    const ctx_r3 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(detail_r12.reference);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", detail_r12.contactFirstName, " ", detail_r12.contactLastName);
    i0.ɵɵadvance();
    i0.ɵɵattribute("data-status", ctx_r3.statusToken(detail_r12.status));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(detail_r12.status);
    i0.ɵɵadvance(11);
    i0.ɵɵclassProp("active", ctx_r3.detailTab === "overview");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("active", ctx_r3.detailTab === "events");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("active", ctx_r3.detailTab === "appointments");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("active", ctx_r3.detailTab === "proposals");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("active", ctx_r3.detailTab === "documents");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("active", ctx_r3.detailTab === "activity");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r3.detailTab === "overview" ? 31 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r3.detailTab === "events" ? 32 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r3.detailTab === "appointments" ? 33 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r3.detailTab === "proposals" ? 34 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r3.detailTab === "documents" ? 35 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r3.detailTab === "activity" ? 36 : -1);
} }
function EnquiriesComponent_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 10)(1, "article", 17)(2, "table")(3, "thead")(4, "tr")(5, "th");
    i0.ɵɵtext(6, "Ref");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "th");
    i0.ɵɵtext(8, "Contact");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "th");
    i0.ɵɵtext(10, "Event");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "th");
    i0.ɵɵtext(12, "Date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "th");
    i0.ɵɵtext(14, "Guests");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "th");
    i0.ɵɵtext(16, "Status");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "th");
    i0.ɵɵtext(18, "Value");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "th");
    i0.ɵɵtext(20, "Owner");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "th");
    i0.ɵɵtext(22, "Last Activity");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(23, "tbody");
    i0.ɵɵrepeaterCreate(24, EnquiriesComponent_Conditional_27_For_25_Template, 36, 29, "tr", 18, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(26, EnquiriesComponent_Conditional_27_Conditional_26_Template, 2, 0, "p", 19);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(27, EnquiriesComponent_Conditional_27_Conditional_27_Template, 37, 23, "aside", 20);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_3_0;
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵadvance(24);
    i0.ɵɵrepeater(ctx_r3.enquiries);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r3.enquiries.length === 0 ? 26 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional((tmp_3_0 = ctx_r3.selectedEnquiry) ? 27 : -1, tmp_3_0);
} }
function EnquiriesComponent_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 11);
    i0.ɵɵtext(1, "Loading enquiries...");
    i0.ɵɵelementEnd();
} }
export class EnquiriesComponent {
    constructor() {
        this.api = inject(ApiService);
        this.auth = inject(AuthService);
        this.destroyRef = inject(DestroyRef);
        this.route = inject(ActivatedRoute);
        this.router = inject(Router);
        this.formBuilder = new FormBuilder();
        this.statusTabs = [
            { key: 'new-unanswered', label: 'New / Unanswered' },
            { key: 'proposals', label: 'Proposals' },
            { key: 'provisional', label: 'Provisional' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'lost', label: 'Lost' },
            { key: 'all', label: 'All' }
        ];
        this.quickFilters = [
            { value: '', label: 'No quick filter' },
            { value: 'my-enquiries', label: 'My Enquiries' },
            { value: 'unassigned', label: 'Unassigned' },
            { value: 'overdue-follow-up', label: 'Overdue Follow-up' },
            { value: 'expiring-holds', label: 'Expiring Holds' }
        ];
        this.activeTab = 'new-unanswered';
        this.listResponse = null;
        this.enquiries = [];
        this.loading = false;
        this.selectedEnquiryId = null;
        this.selectedEnquiry = null;
        this.detailTab = 'overview';
        this.enquiryProposals = [];
        this.enquiryProposalsLoading = false;
        this.pageSizeOptions = new Set([10, 25, 50, 100]);
        this.filtersForm = this.formBuilder.group({
            search: [''],
            quickFilter: [''],
            pageSize: [25]
        });
    }
    get venueId() {
        return this.auth.selectedVenueId;
    }
    ngOnInit() {
        this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const previousSelectedEnquiryId = this.selectedEnquiryId;
            const enquiryId = params.get('enquiry');
            const requestedStatusTab = params.get('statusTab');
            const requestedSearch = params.get('search') ?? '';
            const requestedQuickFilter = params.get('quickFilter') ?? '';
            const requestedPageSize = this.parsePageSize(params.get('pageSize'));
            let shouldReloadList = false;
            if (requestedStatusTab && this.isValidStatusTab(requestedStatusTab) && requestedStatusTab !== this.activeTab) {
                this.activeTab = requestedStatusTab;
                shouldReloadList = true;
            }
            if (!requestedStatusTab && this.activeTab !== 'new-unanswered') {
                this.activeTab = 'new-unanswered';
                shouldReloadList = true;
            }
            const currentFilters = this.filtersForm.getRawValue();
            const currentPageSize = this.parsePageSize(String(currentFilters.pageSize ?? 25));
            if ((currentFilters.search ?? '') !== requestedSearch ||
                (currentFilters.quickFilter ?? '') !== requestedQuickFilter ||
                currentPageSize !== requestedPageSize) {
                this.filtersForm.patchValue({
                    search: requestedSearch,
                    quickFilter: requestedQuickFilter,
                    pageSize: requestedPageSize
                }, { emitEvent: false });
                shouldReloadList = true;
            }
            this.selectedEnquiryId = enquiryId;
            if (shouldReloadList || !this.listResponse) {
                this.loadEnquiries(1);
                return;
            }
            if (enquiryId && enquiryId !== previousSelectedEnquiryId) {
                this.loadEnquiryDetail(enquiryId);
            }
        });
        this.filtersForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            const filters = this.filtersForm.getRawValue();
            const trimmedSearch = (filters.search ?? '').trim();
            const quickFilter = filters.quickFilter ?? '';
            const pageSize = this.parsePageSize(String(filters.pageSize ?? 25));
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {
                    search: trimmedSearch || null,
                    quickFilter: quickFilter || null,
                    pageSize: pageSize === 25 ? null : pageSize
                },
                queryParamsHandling: 'merge',
                replaceUrl: true
            });
            this.loadEnquiries(1);
        });
    }
    setTab(tabKey) {
        if (!this.isValidStatusTab(tabKey) || this.activeTab === tabKey) {
            return;
        }
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { statusTab: tabKey },
            queryParamsHandling: 'merge'
        });
    }
    loadEnquiries(page) {
        const venueId = this.venueId;
        if (!venueId) {
            return;
        }
        this.loading = true;
        const filters = this.filtersForm.getRawValue();
        this.api
            .getEnquiries({
            venueId,
            statusTab: this.activeTab,
            period: 'this-month',
            quickFilter: filters.quickFilter || undefined,
            search: filters.search || undefined,
            page,
            pageSize: Number(filters.pageSize) || 25
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.loading = false;
                this.listResponse = response;
                this.enquiries = response.page.items;
                if (!this.selectedEnquiryId && this.enquiries.length > 0) {
                    this.selectEnquiry(this.enquiries[0].id);
                }
                if (this.selectedEnquiryId) {
                    this.loadEnquiryDetail(this.selectedEnquiryId);
                }
            },
            error: () => {
                this.loading = false;
                this.enquiries = [];
                this.selectedEnquiry = null;
            }
        });
    }
    selectEnquiry(enquiryId) {
        this.selectedEnquiryId = enquiryId;
        this.enquiryProposals = [];
        this.enquiryProposalsLoading = false;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { enquiry: enquiryId },
            queryParamsHandling: 'merge'
        });
        this.loadEnquiryDetail(enquiryId);
    }
    changeDetailTab(tab) {
        this.detailTab = tab;
        if (tab === 'proposals' && this.selectedEnquiryId) {
            this.loadEnquiryProposals(this.selectedEnquiryId);
        }
    }
    changeStatus(targetStatus) {
        if (!this.selectedEnquiryId) {
            return;
        }
        this.api
            .transitionEnquiryStatus(this.selectedEnquiryId, { targetStatus })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.loadEnquiryDetail(this.selectedEnquiryId);
                this.loadEnquiries(this.listResponse?.page.page ?? 1);
            }
        });
    }
    statusToken(status) {
        const normalized = (status ?? '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-');
        if (normalized === 'openproposal') {
            return 'open-proposal';
        }
        return normalized;
    }
    isValidStatusTab(tabKey) {
        return this.statusTabs.some((tab) => tab.key === tabKey);
    }
    parsePageSize(raw) {
        const parsed = Number(raw);
        if (!Number.isFinite(parsed)) {
            return 25;
        }
        return this.pageSizeOptions.has(parsed) ? parsed : 25;
    }
    loadEnquiryDetail(enquiryId) {
        this.api
            .getEnquiry(enquiryId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (enquiry) => {
                this.selectedEnquiry = enquiry;
                this.loadEnquiryProposals(enquiryId);
            },
            error: () => {
                this.selectedEnquiry = null;
                this.enquiryProposals = [];
                this.enquiryProposalsLoading = false;
            }
        });
    }
    createProposalForSelectedEnquiry() {
        if (!this.selectedEnquiryId) {
            return;
        }
        this.router.navigate(['/proposals'], {
            queryParams: {
                enquiry: this.selectedEnquiryId,
                create: 1
            }
        });
    }
    openProposalInMaker(proposalId) {
        this.router.navigate(['/proposals'], {
            queryParams: {
                proposal: proposalId
            }
        });
    }
    loadEnquiryProposals(enquiryId) {
        this.enquiryProposalsLoading = true;
        this.api
            .getEnquiryProposals(enquiryId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (proposals) => {
                this.enquiryProposalsLoading = false;
                this.enquiryProposals = proposals;
            },
            error: () => {
                this.enquiryProposalsLoading = false;
                this.enquiryProposals = [];
            }
        });
    }
    static { this.ɵfac = function EnquiriesComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || EnquiriesComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: EnquiriesComponent, selectors: [["app-enquiries"]], decls: 29, vars: 8, consts: [[1, "page-header"], [1, "period-pill"], [1, "stats"], [1, "tabs"], [1, "filters", 3, "formGroup"], [1, "search-field"], ["type", "text", "formControlName", "search", "placeholder", "Search by ref, contact, email, event, notes"], ["formControlName", "quickFilter"], [3, "value"], ["formControlName", "pageSize"], [1, "layout"], [1, "loading"], [1, "stat-top"], [1, "trend", "positive"], [1, "trend", "warning"], [1, "tab", 3, "active"], [1, "tab", 3, "click"], [1, "list-panel"], [3, "selected"], [1, "empty"], [1, "detail-panel"], [3, "click"], [1, "ref-cell"], [1, "cell-main"], [1, "cell-sub"], [1, "status"], [1, "actions"], [1, "detail-tabs"], [1, "tab-panel"], [1, "overview-grid"], [1, "same-date"], [1, "row"], [1, "proposal-actions"], ["type", "button", 3, "click"], [1, "row", "proposal-row"]], template: function EnquiriesComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "div")(2, "h1");
            i0.ɵɵtext(3, "Enquiry Management");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "p");
            i0.ɵɵtext(5, "Pipeline, status transitions, and same-date availability in one view.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "span", 1);
            i0.ɵɵtext(7, "This Month");
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(8, EnquiriesComponent_Conditional_8_Template, 41, 8, "section", 2);
            i0.ɵɵconditionalCreate(9, EnquiriesComponent_Conditional_9_Template, 3, 0, "section", 3);
            i0.ɵɵelementStart(10, "form", 4)(11, "label", 5)(12, "span");
            i0.ɵɵtext(13, "\uD83D\uDD0D");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(14, "input", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "select", 7);
            i0.ɵɵrepeaterCreate(16, EnquiriesComponent_For_17_Template, 2, 2, "option", 8, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "select", 9)(19, "option", 8);
            i0.ɵɵtext(20, "10 per page");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "option", 8);
            i0.ɵɵtext(22, "25 per page");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "option", 8);
            i0.ɵɵtext(24, "50 per page");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "option", 8);
            i0.ɵɵtext(26, "100 per page");
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(27, EnquiriesComponent_Conditional_27_Template, 28, 2, "section", 10)(28, EnquiriesComponent_Conditional_28_Template, 2, 0, "section", 11);
        } if (rf & 2) {
            let tmp_0_0;
            let tmp_1_0;
            i0.ɵɵadvance(8);
            i0.ɵɵconditional((tmp_0_0 = ctx.listResponse) ? 8 : -1, tmp_0_0);
            i0.ɵɵadvance();
            i0.ɵɵconditional((tmp_1_0 = ctx.listResponse) ? 9 : -1, tmp_1_0);
            i0.ɵɵadvance();
            i0.ɵɵproperty("formGroup", ctx.filtersForm);
            i0.ɵɵadvance(6);
            i0.ɵɵrepeater(ctx.quickFilters);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("value", 10);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", 25);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", 50);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", 100);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(!ctx.loading ? 27 : 28);
        } }, dependencies: [ReactiveFormsModule, i1.ɵNgNoValidate, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, DatePipe, DecimalPipe], styles: [".page-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.8rem;\n}\n\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.5rem;\n  line-height: 1.1;\n  font-weight: 800;\n  color: #0f172a;\n}\n\n.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.2rem 0 0;\n  font-size: 0.88rem;\n  color: #64748b;\n}\n\n.period-pill[_ngcontent-%COMP%] {\n  padding: 0.24rem 0.58rem;\n  border-radius: 999px;\n  border: 1px solid #dbeafe;\n  background: #eff6ff;\n  color: #2563eb;\n  font-size: 0.67rem;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n}\n\n.stats[_ngcontent-%COMP%] {\n  margin-top: 0.95rem;\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 0.76rem;\n}\n\n.stats[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] {\n  background: #fff;\n  border: 1px solid var(--cf-border);\n  border-radius: var(--cf-radius-xl);\n  box-shadow: var(--cf-shadow-sm);\n  padding: 0.82rem;\n  display: grid;\n  gap: 0.25rem;\n}\n\n.stat-top[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n\n.stat-top[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  letter-spacing: 0.07em;\n  text-transform: uppercase;\n  color: #64748b;\n  font-weight: 800;\n}\n\n.stats[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.45rem;\n  color: #0f172a;\n  line-height: 1.1;\n}\n\n.stats[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.72rem;\n  color: #94a3b8;\n}\n\n.trend[_ngcontent-%COMP%] {\n  font-style: normal;\n  font-size: 0.62rem;\n  font-weight: 800;\n  padding: 0.08rem 0.38rem;\n  border-radius: 999px;\n}\n\n.trend.positive[_ngcontent-%COMP%] {\n  color: #15803d;\n  background: #dcfce7;\n}\n\n.trend.warning[_ngcontent-%COMP%] {\n  color: #b45309;\n  background: #fef3c7;\n}\n\n.tabs[_ngcontent-%COMP%] {\n  margin-top: 0.85rem;\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n\n.tab[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border);\n  border-radius: 999px;\n  background: #fff;\n  color: #475569;\n  padding: 0.34rem 0.72rem;\n  font-size: 0.74rem;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;\n}\n\n.tab[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: normal;\n  min-width: 18px;\n  text-align: center;\n  border-radius: 999px;\n  padding: 0.03rem 0.34rem;\n  background: #f1f5f9;\n  font-size: 0.62rem;\n  font-weight: 800;\n  color: #64748b;\n}\n\n.tab.active[_ngcontent-%COMP%] {\n  border-color: #93c5fd;\n  background: #eff6ff;\n  color: #2563eb;\n}\n\n.tab.active[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  background: #2563eb;\n  color: #fff;\n}\n\n.filters[_ngcontent-%COMP%] {\n  margin-top: 0.8rem;\n  display: grid;\n  grid-template-columns: 1fr 220px 145px;\n  gap: 0.55rem;\n}\n\n.search-field[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.45rem;\n  border: 1px solid var(--cf-border);\n  border-radius: 11px;\n  background: #fff;\n  padding: 0 0.6rem;\n}\n\n.search-field[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  font-size: 0.8rem;\n}\n\n.search-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 0;\n  padding: 0.58rem 0;\n  font-size: 0.82rem;\n  color: #334155;\n  outline: none;\n}\n\n.filters[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border);\n  border-radius: 11px;\n  background: #fff;\n  color: #475569;\n  padding: 0.56rem 0.62rem;\n  font-size: 0.79rem;\n}\n\n.layout[_ngcontent-%COMP%] {\n  margin-top: 0.9rem;\n  display: grid;\n  grid-template-columns: 1.65fr 1fr;\n  gap: 0.8rem;\n}\n\n.list-panel[_ngcontent-%COMP%], \n.detail-panel[_ngcontent-%COMP%] {\n  background: #fff;\n  border: 1px solid var(--cf-border);\n  border-radius: var(--cf-radius-2xl);\n  box-shadow: var(--cf-shadow-sm);\n  overflow: hidden;\n}\n\n.list-panel[_ngcontent-%COMP%] {\n  overflow: auto;\n}\n\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n}\n\nth[_ngcontent-%COMP%], \ntd[_ngcontent-%COMP%] {\n  padding: 0.66rem 0.72rem;\n  border-bottom: 1px solid #f1f5f9;\n  text-align: left;\n  vertical-align: top;\n}\n\nth[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  color: #64748b;\n  font-size: 0.64rem;\n  text-transform: uppercase;\n  letter-spacing: 0.07em;\n  font-weight: 800;\n}\n\ntd[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  color: #334155;\n}\n\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: #f8fafc;\n}\n\ntbody[_ngcontent-%COMP%]   tr.selected[_ngcontent-%COMP%] {\n  background: #eff6ff;\n}\n\n.ref-cell[_ngcontent-%COMP%] {\n  font-weight: 700;\n  color: #0f172a;\n}\n\n.cell-main[_ngcontent-%COMP%] {\n  color: #1e293b;\n  font-weight: 600;\n}\n\n.cell-sub[_ngcontent-%COMP%] {\n  margin-top: 0.14rem;\n  color: #94a3b8;\n  font-size: 0.68rem;\n  line-height: 1.2;\n}\n\n.status[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  padding: 0.16rem 0.48rem;\n  font-size: 0.62rem;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  font-weight: 800;\n  background: #e2e8f0;\n  color: #475569;\n}\n\n.status[data-status='new'][_ngcontent-%COMP%], \n.status[data-status='tentative'][_ngcontent-%COMP%] {\n  background: #dbeafe;\n  color: #1d4ed8;\n}\n\n.status[data-status='open-proposal'][_ngcontent-%COMP%] {\n  background: #ede9fe;\n  color: #6d28d9;\n}\n\n.status[data-status='provisional'][_ngcontent-%COMP%] {\n  background: #fef3c7;\n  color: #b45309;\n}\n\n.status[data-status='confirmed'][_ngcontent-%COMP%], \n.status[data-status='completed'][_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #166534;\n}\n\n.status[data-status='lost'][_ngcontent-%COMP%], \n.status[data-status='archived'][_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n\n.empty[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0.9rem;\n  color: #64748b;\n  font-size: 0.8rem;\n}\n\n.detail-panel[_ngcontent-%COMP%]   header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: start;\n  justify-content: space-between;\n  gap: 0.8rem;\n  padding: 0.9rem 0.95rem 0.75rem;\n  border-bottom: 1px solid var(--cf-border-soft);\n}\n\n.detail-panel[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.08rem;\n  color: #0f172a;\n}\n\n.detail-panel[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.24rem 0 0;\n  color: #64748b;\n  font-size: 0.78rem;\n}\n\n.actions[_ngcontent-%COMP%] {\n  padding: 0.62rem 0.95rem;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n  border-bottom: 1px solid var(--cf-border-soft);\n}\n\n.actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border);\n  background: #fff;\n  color: #475569;\n  border-radius: 999px;\n  padding: 0.22rem 0.58rem;\n  font-size: 0.65rem;\n  font-weight: 700;\n}\n\n.actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  border-color: #93c5fd;\n  background: #eff6ff;\n  color: #1d4ed8;\n}\n\n.detail-tabs[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.18rem;\n  overflow-x: auto;\n  border-bottom: 1px solid var(--cf-border-soft);\n  padding: 0.24rem 0.5rem;\n}\n\n.detail-tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  border-radius: 9px;\n  padding: 0.36rem 0.54rem;\n  font-size: 0.72rem;\n  font-weight: 700;\n  color: #64748b;\n  white-space: nowrap;\n}\n\n.detail-tabs[_ngcontent-%COMP%]   button.active[_ngcontent-%COMP%] {\n  color: #2563eb;\n  background: #eff6ff;\n}\n\n.tab-panel[_ngcontent-%COMP%] {\n  padding: 0.82rem 0.95rem;\n  display: grid;\n  gap: 0.48rem;\n}\n\n.proposal-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n\n  button {\n    border: 0;\n    border-radius: 999px;\n    background: #1d4ed8;\n    color: #fff;\n    font-size: 0.68rem;\n    font-weight: 700;\n    padding: 0.3rem 0.65rem;\n    cursor: pointer;\n  }\n}\n\n.overview-grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.35rem;\n}\n\n.tab-panel[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.78rem;\n  color: #334155;\n}\n\n.tab-panel[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #0f172a;\n}\n\n.row[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border-soft);\n  border-radius: 11px;\n  padding: 0.52rem 0.58rem;\n  display: grid;\n  gap: 0.18rem;\n}\n\n.row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  color: #0f172a;\n}\n\n.row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n  color: #64748b;\n}\n\n.proposal-row[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n\n  > div {\n    display: grid;\n    gap: 0.15rem;\n  }\n\n  button {\n    border: 1px solid #cbd5e1;\n    border-radius: 999px;\n    background: #fff;\n    color: #1d4ed8;\n    font-size: 0.67rem;\n    font-weight: 700;\n    padding: 0.22rem 0.58rem;\n    cursor: pointer;\n  }\n}\n\n.same-date[_ngcontent-%COMP%] {\n  margin-top: 0.35rem;\n  border: 1px solid #dbeafe;\n  border-radius: 14px;\n  background: #f8fbff;\n  padding: 0.64rem;\n  display: grid;\n  gap: 0.5rem;\n}\n\n.same-date[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.66rem;\n  color: #2563eb;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n}\n\n.same-date[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border-soft);\n  border-radius: 11px;\n  background: #fff;\n  padding: 0.45rem 0.52rem;\n}\n\n.same-date[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]   header[_ngcontent-%COMP%] {\n  border: 0;\n  margin: 0 0 0.22rem;\n  padding: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.same-date[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n}\n\n.same-date[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  padding: 0.1rem 0.35rem;\n  border-radius: 999px;\n  font-size: 0.58rem;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  color: #166534;\n  background: #dcfce7;\n  font-weight: 800;\n}\n\n.same-date[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   span.busy[_ngcontent-%COMP%] {\n  color: #92400e;\n  background: #fef3c7;\n}\n\n.same-date[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: #64748b;\n}\n\n.loading[_ngcontent-%COMP%] {\n  margin-top: 0.8rem;\n  background: #fff;\n  border: 1px solid var(--cf-border);\n  border-radius: var(--cf-radius-xl);\n  padding: 0.85rem 1rem;\n  color: #64748b;\n  font-size: 0.84rem;\n}\n\n@media (max-width: 1240px) {\n  .layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n\n@media (max-width: 1060px) {\n  .stats[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n\n@media (max-width: 760px) {\n  .page-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n\n  .stats[_ngcontent-%COMP%], \n   .filters[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  th[_ngcontent-%COMP%], \n   td[_ngcontent-%COMP%] {\n    padding-left: 0.5rem;\n    padding-right: 0.5rem;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(EnquiriesComponent, [{
        type: Component,
        args: [{ selector: 'app-enquiries', imports: [DatePipe, DecimalPipe, ReactiveFormsModule], template: "<section class=\"page-header\">\n  <div>\n    <h1>Enquiry Management</h1>\n    <p>Pipeline, status transitions, and same-date availability in one view.</p>\n  </div>\n  <span class=\"period-pill\">This Month</span>\n</section>\n\n@if (listResponse; as list) {\n  <section class=\"stats\">\n    <article>\n      <div class=\"stat-top\">\n        <span>New Enquiries</span>\n        <em class=\"trend positive\">{{ list.stats.newEnquiriesDeltaPercent }}%</em>\n      </div>\n      <strong>{{ list.stats.newEnquiries }}</strong>\n      <p>vs previous period</p>\n    </article>\n    <article>\n      <div class=\"stat-top\">\n        <span>Proposals Sent</span>\n        <em class=\"trend positive\">{{ list.stats.proposalsSentDeltaPercent }}%</em>\n      </div>\n      <strong>{{ list.stats.proposalsSent }}</strong>\n      <p>active this period</p>\n    </article>\n    <article>\n      <div class=\"stat-top\">\n        <span>Confirmed</span>\n        <em class=\"trend positive\">{{ list.stats.confirmedDeltaPercent }}%</em>\n      </div>\n      <strong>{{ list.stats.confirmed }}</strong>\n      <p>bookings converted</p>\n    </article>\n    <article>\n      <div class=\"stat-top\">\n        <span>Lost</span>\n        <em class=\"trend warning\">{{ list.stats.lostRatePercent }}% rate</em>\n      </div>\n      <strong>{{ list.stats.lost }}</strong>\n      <p>conversion drop-off</p>\n    </article>\n  </section>\n}\n\n@if (listResponse; as list) {\n  <section class=\"tabs\">\n    @for (tab of statusTabs; track tab) {\n      <button\n        class=\"tab\"\n        [class.active]=\"tab.key === activeTab\"\n        (click)=\"setTab(tab.key)\"\n        >\n        <span>{{ tab.label }}</span>\n        <em>{{ list.statusTabCounts[tab.key] }}</em>\n      </button>\n    }\n  </section>\n}\n\n<form class=\"filters\" [formGroup]=\"filtersForm\">\n  <label class=\"search-field\">\n    <span>&#128269;</span>\n    <input type=\"text\" formControlName=\"search\" placeholder=\"Search by ref, contact, email, event, notes\" />\n  </label>\n  <select formControlName=\"quickFilter\">\n    @for (quickFilter of quickFilters; track quickFilter) {\n      <option [value]=\"quickFilter.value\">{{ quickFilter.label }}</option>\n    }\n  </select>\n  <select formControlName=\"pageSize\">\n    <option [value]=\"10\">10 per page</option>\n    <option [value]=\"25\">25 per page</option>\n    <option [value]=\"50\">50 per page</option>\n    <option [value]=\"100\">100 per page</option>\n  </select>\n</form>\n\n@if (!loading) {\n  <section class=\"layout\">\n    <article class=\"list-panel\">\n      <table>\n        <thead>\n          <tr>\n            <th>Ref</th>\n            <th>Contact</th>\n            <th>Event</th>\n            <th>Date</th>\n            <th>Guests</th>\n            <th>Status</th>\n            <th>Value</th>\n            <th>Owner</th>\n            <th>Last Activity</th>\n          </tr>\n        </thead>\n        <tbody>\n          @for (enquiry of enquiries; track enquiry) {\n            <tr\n              [class.selected]=\"enquiry.id === selectedEnquiryId\"\n              (click)=\"selectEnquiry(enquiry.id)\"\n              >\n              <td class=\"ref-cell\">{{ enquiry.reference }}</td>\n              <td>\n                <div class=\"cell-main\">{{ enquiry.contactName }}</div>\n                <div class=\"cell-sub\">{{ enquiry.sourceType }}</div>\n              </td>\n              <td>\n                <div class=\"cell-main\">{{ enquiry.eventType }}</div>\n                <div class=\"cell-sub\">{{ enquiry.eventStyle || 'Style not set' }}</div>\n              </td>\n              <td>\n                <div class=\"cell-main\">{{ enquiry.eventStartUtc | date: 'dd/MM/yyyy' }}</div>\n                <div class=\"cell-sub\">{{ enquiry.eventStartUtc | date: 'HH:mm' }}</div>\n              </td>\n              <td>{{ enquiry.guestsExpected }}</td>\n              <td>\n                <span class=\"status\" [attr.data-status]=\"statusToken(enquiry.status)\">\n                  {{ enquiry.status }}\n                </span>\n              </td>\n              <td>\n                {{ enquiry.proposalValue ? (enquiry.proposalValue | number: '1.0-0') : 'TBD' }}\n                {{ enquiry.currencyCode }}\n              </td>\n              <td>{{ enquiry.eventManagerName || 'Unassigned' }}</td>\n              <td>\n                <div class=\"cell-main\">{{ enquiry.lastActivityAtUtc | date: 'dd/MM HH:mm' }}</div>\n                <div class=\"cell-sub\">{{ enquiry.daysSinceContact }} days</div>\n              </td>\n            </tr>\n          }\n        </tbody>\n      </table>\n      @if (enquiries.length === 0) {\n        <p class=\"empty\">No enquiries matched the current filters.</p>\n      }\n    </article>\n\n    @if (selectedEnquiry; as detail) {\n      <aside class=\"detail-panel\">\n        <header>\n          <div>\n            <h2>{{ detail.reference }}</h2>\n            <p>{{ detail.contactFirstName }} {{ detail.contactLastName }}</p>\n          </div>\n          <span class=\"status\" [attr.data-status]=\"statusToken(detail.status)\">{{ detail.status }}</span>\n        </header>\n\n        <div class=\"actions\">\n          <button (click)=\"changeStatus('Tentative')\">Tentative</button>\n          <button (click)=\"changeStatus('OpenProposal')\">Open Proposal</button>\n          <button (click)=\"changeStatus('Provisional')\">Provisional</button>\n          <button (click)=\"changeStatus('Confirmed')\">Confirmed</button>\n        </div>\n\n        <nav class=\"detail-tabs\">\n          <button [class.active]=\"detailTab === 'overview'\" (click)=\"changeDetailTab('overview')\">Overview</button>\n          <button [class.active]=\"detailTab === 'events'\" (click)=\"changeDetailTab('events')\">Events</button>\n          <button [class.active]=\"detailTab === 'appointments'\" (click)=\"changeDetailTab('appointments')\">Appointments</button>\n          <button [class.active]=\"detailTab === 'proposals'\" (click)=\"changeDetailTab('proposals')\">Proposals</button>\n          <button [class.active]=\"detailTab === 'documents'\" (click)=\"changeDetailTab('documents')\">Documents</button>\n          <button [class.active]=\"detailTab === 'activity'\" (click)=\"changeDetailTab('activity')\">Activity</button>\n        </nav>\n\n        @if (detailTab === 'overview') {\n          <section class=\"tab-panel\">\n            <div class=\"overview-grid\">\n              <p><strong>Event:</strong> {{ detail.eventName || detail.eventType }}</p>\n              <p><strong>Date:</strong> {{ detail.eventStartUtc | date: 'dd/MM/yyyy HH:mm' }}</p>\n              <p><strong>Guests:</strong> {{ detail.guestsExpected }}</p>\n              <p><strong>Style:</strong> {{ detail.eventStyle || 'Not set' }}</p>\n              <p><strong>Manager:</strong> {{ detail.eventManagerName || 'Unassigned' }}</p>\n              <p><strong>Lead Quality:</strong> {{ detail.leadQuality }}/5</p>\n              <p><strong>Source:</strong> {{ detail.sourceType }} {{ detail.sourceDetail ? '\u00B7 ' + detail.sourceDetail : '' }}</p>\n              <p><strong>Phone:</strong> {{ detail.contactPhoneNumberE164 }}</p>\n              <p><strong>Email:</strong> {{ detail.contactEmail }}</p>\n            </div>\n\n            @if (detail.sameDateAvailability) {\n              <div class=\"same-date\">\n                <h3>Same-date availability</h3>\n                @for (group of detail.sameDateAvailability.spaces; track group) {\n                  <article>\n                    <header>\n                      <strong>{{ group.spaceName }}</strong>\n                      <span [class.busy]=\"!group.isAvailable\">{{ group.isAvailable ? 'Available' : 'Busy' }}</span>\n                    </header>\n                    @for (event of group.events; track event) {\n                      <p>\n                        {{ event.label }} \u00B7 {{ event.recordType }} \u00B7 {{ event.startUtc | date: 'HH:mm' }}-{{ event.endUtc | date: 'HH:mm' }}\n                      </p>\n                    }\n                  </article>\n                }\n              </div>\n            }\n          </section>\n        }\n\n        @if (detailTab === 'events') {\n          <section class=\"tab-panel\">\n            @for (subEvent of detail.subEvents; track subEvent) {\n              <article class=\"row\">\n                <strong>{{ subEvent.name }}</strong>\n                <span>{{ subEvent.startUtc | date: 'dd/MM HH:mm' }} - {{ subEvent.endUtc | date: 'HH:mm' }}</span>\n                <span>{{ subEvent.guestCount }} guests \u00B7 {{ subEvent.setupStyle || 'Custom' }}</span>\n              </article>\n            }\n            @if (detail.subEvents.length === 0) {\n              <p class=\"empty\">No sub-events configured.</p>\n            }\n          </section>\n        }\n\n        @if (detailTab === 'appointments') {\n          <section class=\"tab-panel\">\n            @for (appointment of detail.appointments; track appointment) {\n              <article class=\"row\">\n                <strong>{{ appointment.title }}</strong>\n                <span>{{ appointment.startUtc | date: 'dd/MM/yyyy HH:mm' }} \u00B7 {{ appointment.durationMinutes }} mins</span>\n                <span>{{ appointment.spaceName || 'No space' }} \u00B7 {{ appointment.status }}</span>\n              </article>\n            }\n            @if (detail.appointments.length === 0) {\n              <p class=\"empty\">No appointments linked.</p>\n            }\n          </section>\n        }\n\n        @if (detailTab === 'proposals') {\n          <section class=\"tab-panel\">\n            <div class=\"proposal-actions\">\n              <button type=\"button\" (click)=\"createProposalForSelectedEnquiry()\">Create New Proposal</button>\n            </div>\n\n            @if (enquiryProposalsLoading) {\n              <p class=\"empty\">Loading proposals...</p>\n            } @else {\n              @if (enquiryProposals.length > 0) {\n                @for (proposal of enquiryProposals; track proposal) {\n                  <article class=\"row proposal-row\">\n                    <div>\n                      <strong>{{ proposal.version }} \u00B7 {{ proposal.status }}</strong>\n                      <span>{{ proposal.createdAtUtc | date: 'dd/MM/yyyy HH:mm' }}</span>\n                    </div>\n                    <div>\n                      <span>{{ proposal.totalAmount | number: '1.2-2' }} {{ proposal.currencyCode }}</span>\n                      <button type=\"button\" (click)=\"openProposalInMaker(proposal.id)\">Open</button>\n                    </div>\n                  </article>\n                }\n              } @else {\n                <p class=\"empty\">No proposals created for this enquiry yet.</p>\n              }\n            }\n          </section>\n        }\n\n        @if (detailTab === 'documents') {\n          <section class=\"tab-panel\">\n            <p>Documents upload/download flow is wired for Phase 2.</p>\n          </section>\n        }\n\n        @if (detailTab === 'activity') {\n          <section class=\"tab-panel\">\n            @for (entry of detail.activityLog; track entry) {\n              <article class=\"row\">\n                <strong>{{ entry.actionType }}</strong>\n                <span>{{ entry.createdAtUtc | date: 'dd/MM/yyyy HH:mm' }}</span>\n                <span>{{ entry.userName || 'System' }}</span>\n              </article>\n            }\n            @if (detail.activityLog.length === 0) {\n              <p class=\"empty\">No activity captured yet.</p>\n            }\n          </section>\n        }\n      </aside>\n    }\n  </section>\n} @else {\n  <section class=\"loading\">Loading enquiries...</section>\n}\n", styles: [".page-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.8rem;\n}\n\n.page-header h1 {\n  margin: 0;\n  font-size: 1.5rem;\n  line-height: 1.1;\n  font-weight: 800;\n  color: #0f172a;\n}\n\n.page-header p {\n  margin: 0.2rem 0 0;\n  font-size: 0.88rem;\n  color: #64748b;\n}\n\n.period-pill {\n  padding: 0.24rem 0.58rem;\n  border-radius: 999px;\n  border: 1px solid #dbeafe;\n  background: #eff6ff;\n  color: #2563eb;\n  font-size: 0.67rem;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n}\n\n.stats {\n  margin-top: 0.95rem;\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 0.76rem;\n}\n\n.stats article {\n  background: #fff;\n  border: 1px solid var(--cf-border);\n  border-radius: var(--cf-radius-xl);\n  box-shadow: var(--cf-shadow-sm);\n  padding: 0.82rem;\n  display: grid;\n  gap: 0.25rem;\n}\n\n.stat-top {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n\n.stat-top span {\n  font-size: 0.7rem;\n  letter-spacing: 0.07em;\n  text-transform: uppercase;\n  color: #64748b;\n  font-weight: 800;\n}\n\n.stats strong {\n  font-size: 1.45rem;\n  color: #0f172a;\n  line-height: 1.1;\n}\n\n.stats p {\n  margin: 0;\n  font-size: 0.72rem;\n  color: #94a3b8;\n}\n\n.trend {\n  font-style: normal;\n  font-size: 0.62rem;\n  font-weight: 800;\n  padding: 0.08rem 0.38rem;\n  border-radius: 999px;\n}\n\n.trend.positive {\n  color: #15803d;\n  background: #dcfce7;\n}\n\n.trend.warning {\n  color: #b45309;\n  background: #fef3c7;\n}\n\n.tabs {\n  margin-top: 0.85rem;\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n\n.tab {\n  border: 1px solid var(--cf-border);\n  border-radius: 999px;\n  background: #fff;\n  color: #475569;\n  padding: 0.34rem 0.72rem;\n  font-size: 0.74rem;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;\n}\n\n.tab em {\n  font-style: normal;\n  min-width: 18px;\n  text-align: center;\n  border-radius: 999px;\n  padding: 0.03rem 0.34rem;\n  background: #f1f5f9;\n  font-size: 0.62rem;\n  font-weight: 800;\n  color: #64748b;\n}\n\n.tab.active {\n  border-color: #93c5fd;\n  background: #eff6ff;\n  color: #2563eb;\n}\n\n.tab.active em {\n  background: #2563eb;\n  color: #fff;\n}\n\n.filters {\n  margin-top: 0.8rem;\n  display: grid;\n  grid-template-columns: 1fr 220px 145px;\n  gap: 0.55rem;\n}\n\n.search-field {\n  display: flex;\n  align-items: center;\n  gap: 0.45rem;\n  border: 1px solid var(--cf-border);\n  border-radius: 11px;\n  background: #fff;\n  padding: 0 0.6rem;\n}\n\n.search-field span {\n  color: #94a3b8;\n  font-size: 0.8rem;\n}\n\n.search-field input {\n  width: 100%;\n  border: 0;\n  padding: 0.58rem 0;\n  font-size: 0.82rem;\n  color: #334155;\n  outline: none;\n}\n\n.filters select {\n  border: 1px solid var(--cf-border);\n  border-radius: 11px;\n  background: #fff;\n  color: #475569;\n  padding: 0.56rem 0.62rem;\n  font-size: 0.79rem;\n}\n\n.layout {\n  margin-top: 0.9rem;\n  display: grid;\n  grid-template-columns: 1.65fr 1fr;\n  gap: 0.8rem;\n}\n\n.list-panel,\n.detail-panel {\n  background: #fff;\n  border: 1px solid var(--cf-border);\n  border-radius: var(--cf-radius-2xl);\n  box-shadow: var(--cf-shadow-sm);\n  overflow: hidden;\n}\n\n.list-panel {\n  overflow: auto;\n}\n\ntable {\n  width: 100%;\n  border-collapse: collapse;\n}\n\nth,\ntd {\n  padding: 0.66rem 0.72rem;\n  border-bottom: 1px solid #f1f5f9;\n  text-align: left;\n  vertical-align: top;\n}\n\nth {\n  background: #f8fafc;\n  color: #64748b;\n  font-size: 0.64rem;\n  text-transform: uppercase;\n  letter-spacing: 0.07em;\n  font-weight: 800;\n}\n\ntd {\n  font-size: 0.78rem;\n  color: #334155;\n}\n\ntbody tr {\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n\ntbody tr:hover {\n  background: #f8fafc;\n}\n\ntbody tr.selected {\n  background: #eff6ff;\n}\n\n.ref-cell {\n  font-weight: 700;\n  color: #0f172a;\n}\n\n.cell-main {\n  color: #1e293b;\n  font-weight: 600;\n}\n\n.cell-sub {\n  margin-top: 0.14rem;\n  color: #94a3b8;\n  font-size: 0.68rem;\n  line-height: 1.2;\n}\n\n.status {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  padding: 0.16rem 0.48rem;\n  font-size: 0.62rem;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  font-weight: 800;\n  background: #e2e8f0;\n  color: #475569;\n}\n\n.status[data-status='new'],\n.status[data-status='tentative'] {\n  background: #dbeafe;\n  color: #1d4ed8;\n}\n\n.status[data-status='open-proposal'] {\n  background: #ede9fe;\n  color: #6d28d9;\n}\n\n.status[data-status='provisional'] {\n  background: #fef3c7;\n  color: #b45309;\n}\n\n.status[data-status='confirmed'],\n.status[data-status='completed'] {\n  background: #dcfce7;\n  color: #166534;\n}\n\n.status[data-status='lost'],\n.status[data-status='archived'] {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n\n.empty {\n  margin: 0;\n  padding: 0.9rem;\n  color: #64748b;\n  font-size: 0.8rem;\n}\n\n.detail-panel header {\n  display: flex;\n  align-items: start;\n  justify-content: space-between;\n  gap: 0.8rem;\n  padding: 0.9rem 0.95rem 0.75rem;\n  border-bottom: 1px solid var(--cf-border-soft);\n}\n\n.detail-panel header h2 {\n  margin: 0;\n  font-size: 1.08rem;\n  color: #0f172a;\n}\n\n.detail-panel header p {\n  margin: 0.24rem 0 0;\n  color: #64748b;\n  font-size: 0.78rem;\n}\n\n.actions {\n  padding: 0.62rem 0.95rem;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n  border-bottom: 1px solid var(--cf-border-soft);\n}\n\n.actions button {\n  border: 1px solid var(--cf-border);\n  background: #fff;\n  color: #475569;\n  border-radius: 999px;\n  padding: 0.22rem 0.58rem;\n  font-size: 0.65rem;\n  font-weight: 700;\n}\n\n.actions button:hover {\n  border-color: #93c5fd;\n  background: #eff6ff;\n  color: #1d4ed8;\n}\n\n.detail-tabs {\n  display: flex;\n  align-items: center;\n  gap: 0.18rem;\n  overflow-x: auto;\n  border-bottom: 1px solid var(--cf-border-soft);\n  padding: 0.24rem 0.5rem;\n}\n\n.detail-tabs button {\n  border: 0;\n  background: transparent;\n  border-radius: 9px;\n  padding: 0.36rem 0.54rem;\n  font-size: 0.72rem;\n  font-weight: 700;\n  color: #64748b;\n  white-space: nowrap;\n}\n\n.detail-tabs button.active {\n  color: #2563eb;\n  background: #eff6ff;\n}\n\n.tab-panel {\n  padding: 0.82rem 0.95rem;\n  display: grid;\n  gap: 0.48rem;\n}\n\n.proposal-actions {\n  display: flex;\n  justify-content: flex-end;\n\n  button {\n    border: 0;\n    border-radius: 999px;\n    background: #1d4ed8;\n    color: #fff;\n    font-size: 0.68rem;\n    font-weight: 700;\n    padding: 0.3rem 0.65rem;\n    cursor: pointer;\n  }\n}\n\n.overview-grid {\n  display: grid;\n  gap: 0.35rem;\n}\n\n.tab-panel p {\n  margin: 0;\n  font-size: 0.78rem;\n  color: #334155;\n}\n\n.tab-panel p strong {\n  color: #0f172a;\n}\n\n.row {\n  border: 1px solid var(--cf-border-soft);\n  border-radius: 11px;\n  padding: 0.52rem 0.58rem;\n  display: grid;\n  gap: 0.18rem;\n}\n\n.row strong {\n  font-size: 0.78rem;\n  color: #0f172a;\n}\n\n.row span {\n  font-size: 0.72rem;\n  color: #64748b;\n}\n\n.proposal-row {\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n\n  > div {\n    display: grid;\n    gap: 0.15rem;\n  }\n\n  button {\n    border: 1px solid #cbd5e1;\n    border-radius: 999px;\n    background: #fff;\n    color: #1d4ed8;\n    font-size: 0.67rem;\n    font-weight: 700;\n    padding: 0.22rem 0.58rem;\n    cursor: pointer;\n  }\n}\n\n.same-date {\n  margin-top: 0.35rem;\n  border: 1px solid #dbeafe;\n  border-radius: 14px;\n  background: #f8fbff;\n  padding: 0.64rem;\n  display: grid;\n  gap: 0.5rem;\n}\n\n.same-date h3 {\n  margin: 0;\n  font-size: 0.66rem;\n  color: #2563eb;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n}\n\n.same-date article {\n  border: 1px solid var(--cf-border-soft);\n  border-radius: 11px;\n  background: #fff;\n  padding: 0.45rem 0.52rem;\n}\n\n.same-date article header {\n  border: 0;\n  margin: 0 0 0.22rem;\n  padding: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.same-date article header strong {\n  font-size: 0.75rem;\n}\n\n.same-date article header span {\n  padding: 0.1rem 0.35rem;\n  border-radius: 999px;\n  font-size: 0.58rem;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  color: #166534;\n  background: #dcfce7;\n  font-weight: 800;\n}\n\n.same-date article header span.busy {\n  color: #92400e;\n  background: #fef3c7;\n}\n\n.same-date article p {\n  font-size: 0.7rem;\n  color: #64748b;\n}\n\n.loading {\n  margin-top: 0.8rem;\n  background: #fff;\n  border: 1px solid var(--cf-border);\n  border-radius: var(--cf-radius-xl);\n  padding: 0.85rem 1rem;\n  color: #64748b;\n  font-size: 0.84rem;\n}\n\n@media (max-width: 1240px) {\n  .layout {\n    grid-template-columns: 1fr;\n  }\n}\n\n@media (max-width: 1060px) {\n  .stats {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n\n@media (max-width: 760px) {\n  .page-header {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n\n  .stats,\n  .filters {\n    grid-template-columns: 1fr;\n  }\n\n  th,\n  td {\n    padding-left: 0.5rem;\n    padding-right: 0.5rem;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(EnquiriesComponent, { className: "EnquiriesComponent", filePath: "src/app/pages/enquiries/enquiries.component.ts", lineNumber: 20 }); })();
//# sourceMappingURL=enquiries.component.js.map