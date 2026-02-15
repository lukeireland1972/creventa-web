import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _c0 = () => ({ standalone: true });
const _forTrack0 = ($index, $item) => $item.id;
function AdminComponent_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 2);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.pageError);
} }
function AdminComponent_For_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 8);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const venue_r2 = ctx.$implicit;
    i0.ɵɵproperty("value", venue_r2.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(venue_r2.name);
} }
function AdminComponent_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 9);
    i0.ɵɵtext(1, "Loading venue profile...");
    i0.ɵɵelementEnd();
} }
function AdminComponent_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 9);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.venueMessage);
} }
function AdminComponent_Conditional_24_For_70_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 8);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const mode_r4 = ctx.$implicit;
    i0.ɵɵproperty("value", mode_r4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(mode_r4);
} }
function AdminComponent_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 22)(1, "label", 6)(2, "span");
    i0.ɵɵtext(3, "Venue Name");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "input", 23);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.name, $event) || (ctx_r0.venueDraft.name = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "label", 6)(6, "span");
    i0.ɵɵtext(7, "Legal Entity Name");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "input", 24);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_8_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.legalEntityName, $event) || (ctx_r0.venueDraft.legalEntityName = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "label", 6)(10, "span");
    i0.ɵɵtext(11, "Enquiries Email");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "input", 25);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_12_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.enquiriesEmail, $event) || (ctx_r0.venueDraft.enquiriesEmail = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "label", 6)(14, "span");
    i0.ɵɵtext(15, "Phone (E.164)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "input", 26);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_16_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.phoneNumberE164, $event) || (ctx_r0.venueDraft.phoneNumberE164 = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "label", 6)(18, "span");
    i0.ɵɵtext(19, "Website URL");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "input", 27);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_20_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.websiteUrl, $event) || (ctx_r0.venueDraft.websiteUrl = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "label", 6)(22, "span");
    i0.ɵɵtext(23, "VAT Number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "input", 28);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_24_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.vatNumber, $event) || (ctx_r0.venueDraft.vatNumber = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(25, "label", 6)(26, "span");
    i0.ɵɵtext(27, "Company Reg Number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "input", 29);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_28_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.companyRegistrationNumber, $event) || (ctx_r0.venueDraft.companyRegistrationNumber = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(29, "label", 6)(30, "span");
    i0.ɵɵtext(31, "Country Code");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "input", 30);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_32_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.countryCode, $event) || (ctx_r0.venueDraft.countryCode = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(33, "label", 6)(34, "span");
    i0.ɵɵtext(35, "Currency");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "input", 31);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_36_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.currencyCode, $event) || (ctx_r0.venueDraft.currencyCode = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(37, "label", 6)(38, "span");
    i0.ɵɵtext(39, "Time Zone");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "input", 32);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_40_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.timeZone, $event) || (ctx_r0.venueDraft.timeZone = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(41, "label", 6)(42, "span");
    i0.ɵɵtext(43, "Locale");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "input", 33);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_44_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.locale, $event) || (ctx_r0.venueDraft.locale = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(45, "label", 6)(46, "span");
    i0.ɵɵtext(47, "Default VAT %");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "input", 34);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_48_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.defaultVatRate, $event) || (ctx_r0.venueDraft.defaultVatRate = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(49, "label", 6)(50, "span");
    i0.ɵɵtext(51, "Min Booking Notice (days)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(52, "input", 35);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_52_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.minimumBookingNoticeDays, $event) || (ctx_r0.venueDraft.minimumBookingNoticeDays = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(53, "label", 6)(54, "span");
    i0.ɵɵtext(55, "Default Hold Period (days)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(56, "input", 36);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_56_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.defaultHoldPeriodDays, $event) || (ctx_r0.venueDraft.defaultHoldPeriodDays = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(57, "label", 6)(58, "span");
    i0.ɵɵtext(59, "Hold Warning (days)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(60, "input", 37);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_60_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.holdWarningDays, $event) || (ctx_r0.venueDraft.holdWarningDays = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(61, "label", 6)(62, "span");
    i0.ɵɵtext(63, "Max Holds per Date/Space");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(64, "input", 38);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_64_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.maxHoldsPerDateAndSpace, $event) || (ctx_r0.venueDraft.maxHoldsPerDateAndSpace = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(65, "label", 6)(66, "span");
    i0.ɵɵtext(67, "Hold Auto Release");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(68, "select", 39);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_select_ngModelChange_68_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.holdAutoReleaseMode, $event) || (ctx_r0.venueDraft.holdAutoReleaseMode = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵrepeaterCreate(69, AdminComponent_Conditional_24_For_70_Template, 2, 2, "option", 8, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(71, "label", 13)(72, "span");
    i0.ɵɵtext(73, "Address Line 1");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(74, "input", 40);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_74_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.addressLine1, $event) || (ctx_r0.venueDraft.addressLine1 = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(75, "label", 13)(76, "span");
    i0.ɵɵtext(77, "Address Line 2");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(78, "input", 41);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_78_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.addressLine2, $event) || (ctx_r0.venueDraft.addressLine2 = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(79, "label", 6)(80, "span");
    i0.ɵɵtext(81, "City");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(82, "input", 42);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_82_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.city, $event) || (ctx_r0.venueDraft.city = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(83, "label", 6)(84, "span");
    i0.ɵɵtext(85, "Region");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(86, "input", 43);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_86_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.region, $event) || (ctx_r0.venueDraft.region = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(87, "label", 6)(88, "span");
    i0.ɵɵtext(89, "Postcode");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(90, "input", 44);
    i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Conditional_24_Template_input_ngModelChange_90_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.venueDraft.postcode, $event) || (ctx_r0.venueDraft.postcode = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(91, "div", 19)(92, "button", 20);
    i0.ɵɵlistener("click", function AdminComponent_Conditional_24_Template_button_click_92_listener() { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.saveVenue()); });
    i0.ɵɵtext(93);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.name);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.legalEntityName);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.enquiriesEmail);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.phoneNumberE164);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.websiteUrl);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.vatNumber);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.companyRegistrationNumber);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.countryCode);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.currencyCode);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.timeZone);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.locale);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.defaultVatRate);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.minimumBookingNoticeDays);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.defaultHoldPeriodDays);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.holdWarningDays);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.maxHoldsPerDateAndSpace);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.holdAutoReleaseMode);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.holdAutoReleaseModes);
    i0.ɵɵadvance(5);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.addressLine1);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.addressLine2);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.city);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.region);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.venueDraft.postcode);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r0.savingVenue || ctx_r0.loadingVenueProfile);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.savingVenue ? "Saving..." : "Save Venue", " ");
} }
function AdminComponent_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 9);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.userMessage);
} }
function AdminComponent_For_55_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 8);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const role_r5 = ctx.$implicit;
    i0.ɵɵproperty("value", role_r5);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(role_r5);
} }
function AdminComponent_Conditional_63_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 9);
    i0.ɵɵtext(1, "Debug invitation token: ");
    i0.ɵɵelementStart(2, "code");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.inviteDebugToken);
} }
function AdminComponent_Conditional_80_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 45);
    i0.ɵɵtext(2, "Loading users...");
    i0.ɵɵelementEnd()();
} }
function AdminComponent_Conditional_81_For_1_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "td")(10, "span", 46);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "td", 47)(13, "button", 48);
    i0.ɵɵlistener("click", function AdminComponent_Conditional_81_For_1_Template_button_click_13_listener() { const user_r7 = i0.ɵɵrestoreView(_r6).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.setUserActive(user_r7, !user_r7.isActive)); });
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const user_r7 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", user_r7.firstName, " ", user_r7.lastName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(user_r7.email);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.roleForSelectedVenue(user_r7));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(user_r7.requiresTotp ? "Required" : "Optional");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("active", user_r7.isActive)("inactive", !user_r7.isActive);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", user_r7.isActive ? "Active" : "Inactive", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r0.updatingUser);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", user_r7.isActive ? "Deactivate" : "Activate", " ");
} }
function AdminComponent_Conditional_81_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 45);
    i0.ɵɵtext(2, "No users assigned to this venue.");
    i0.ɵɵelementEnd()();
} }
function AdminComponent_Conditional_81_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, AdminComponent_Conditional_81_For_1_Template, 15, 12, "tr", null, _forTrack0);
    i0.ɵɵconditionalCreate(2, AdminComponent_Conditional_81_Conditional_2_Template, 3, 0, "tr");
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵrepeater(ctx_r0.users);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.users.length === 0 ? 2 : -1);
} }
export class AdminComponent {
    constructor() {
        this.api = inject(ApiService);
        this.auth = inject(AuthService);
        this.router = inject(Router);
        this.destroyRef = inject(DestroyRef);
        this.roleOptions = [
            'GroupAdmin',
            'VenueAdmin',
            'SalesManager',
            'EventsCoordinator',
            'Finance',
            'Operations',
            'ReadOnly'
        ];
        this.holdAutoReleaseModes = [
            'NotifyOnly',
            'AutoReleaseNotifyOperator',
            'AutoReleaseNotifyBoth'
        ];
        this.venues = [];
        this.selectedVenueId = null;
        this.venueDraft = null;
        this.users = [];
        this.loadingVenues = false;
        this.loadingVenueProfile = false;
        this.loadingUsers = false;
        this.savingVenue = false;
        this.invitingUser = false;
        this.updatingUser = false;
        this.pageError = '';
        this.venueMessage = '';
        this.userMessage = '';
        this.inviteForm = this.createDefaultInviteForm();
        this.inviteDebugToken = '';
    }
    ngOnInit() {
        if (this.auth.isOperationsOnly()) {
            this.router.navigateByUrl('/operations');
            return;
        }
        this.loadVenues();
    }
    onVenueSelectionChanged(venueId) {
        if (!venueId) {
            return;
        }
        this.selectedVenueId = venueId;
        this.auth.setSelectedVenue(venueId);
        this.venueMessage = '';
        this.userMessage = '';
        this.inviteDebugToken = '';
        this.loadVenueProfile();
        this.loadUsers();
    }
    saveVenue() {
        const venueId = this.selectedVenueId;
        const draft = this.venueDraft;
        if (!venueId || !draft) {
            return;
        }
        if (!draft.name.trim()) {
            this.venueMessage = 'Venue name is required.';
            return;
        }
        if (!draft.currencyCode.trim() || !draft.countryCode.trim() || !draft.timeZone.trim() || !draft.locale.trim()) {
            this.venueMessage = 'Country, currency, time zone, and locale are required.';
            return;
        }
        this.savingVenue = true;
        this.venueMessage = '';
        const payload = {
            ...draft,
            name: draft.name.trim(),
            legalEntityName: this.normalizeOptionalText(draft.legalEntityName),
            addressLine1: this.normalizeOptionalText(draft.addressLine1),
            addressLine2: this.normalizeOptionalText(draft.addressLine2),
            city: this.normalizeOptionalText(draft.city),
            region: this.normalizeOptionalText(draft.region),
            postcode: this.normalizeOptionalText(draft.postcode),
            countryCode: draft.countryCode.trim().toUpperCase(),
            phoneNumberE164: this.normalizeOptionalText(draft.phoneNumberE164),
            enquiriesEmail: this.normalizeOptionalText(draft.enquiriesEmail),
            websiteUrl: this.normalizeOptionalText(draft.websiteUrl),
            vatNumber: this.normalizeOptionalText(draft.vatNumber),
            companyRegistrationNumber: this.normalizeOptionalText(draft.companyRegistrationNumber),
            logoUrl: this.normalizeOptionalText(draft.logoUrl),
            description: this.normalizeOptionalText(draft.description),
            cancellationPolicy: this.normalizeOptionalText(draft.cancellationPolicy),
            currencyCode: draft.currencyCode.trim().toUpperCase(),
            timeZone: draft.timeZone.trim(),
            locale: draft.locale.trim(),
            defaultVatRate: this.sanitizeNumber(draft.defaultVatRate, 0),
            minimumBookingNoticeDays: this.sanitizeInteger(draft.minimumBookingNoticeDays, 0),
            defaultHoldPeriodDays: this.sanitizeInteger(draft.defaultHoldPeriodDays, 7, 1),
            holdWarningDays: this.sanitizeInteger(draft.holdWarningDays, 2, 0),
            holdAutoReleaseMode: this.normalizeHoldMode(draft.holdAutoReleaseMode),
            maxHoldsPerDateAndSpace: this.sanitizeInteger(draft.maxHoldsPerDateAndSpace, 1, 1)
        };
        this.api
            .updateVenueProfile(venueId, payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (profile) => {
                this.venueDraft = this.mapVenueProfileToDraft(profile);
                this.venueMessage = 'Venue details saved.';
                this.savingVenue = false;
                this.loadVenues();
            },
            error: (error) => {
                this.venueMessage = this.resolveError(error, 'Unable to save venue details.');
                this.savingVenue = false;
            }
        });
    }
    sendInvite() {
        const venueId = this.selectedVenueId;
        if (!venueId) {
            this.userMessage = 'Select a venue first.';
            return;
        }
        const payload = {
            firstName: this.inviteForm.firstName.trim(),
            lastName: this.inviteForm.lastName.trim(),
            email: this.inviteForm.email.trim().toLowerCase(),
            phoneNumberE164: this.normalizeOptionalText(this.inviteForm.phoneNumberE164),
            role: this.inviteForm.role,
            requiresTotp: this.inviteForm.requiresTotp
        };
        if (!payload.firstName || !payload.lastName || !payload.email || !payload.role) {
            this.userMessage = 'First name, last name, email, and role are required.';
            return;
        }
        this.invitingUser = true;
        this.userMessage = '';
        this.inviteDebugToken = '';
        this.api
            .inviteUser({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            phoneNumberE164: payload.phoneNumberE164,
            requiresTotp: payload.requiresTotp,
            venueRoles: [{ venueId, role: payload.role }]
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.userMessage = `Invitation sent to ${response.email}.`;
                this.inviteDebugToken = response.debugToken ?? '';
                this.invitingUser = false;
                this.inviteForm = this.createDefaultInviteForm();
                this.loadUsers();
            },
            error: (error) => {
                this.userMessage = this.resolveError(error, 'Unable to invite user.');
                this.invitingUser = false;
            }
        });
    }
    setUserActive(user, isActive) {
        this.updatingUser = true;
        this.userMessage = '';
        this.api
            .updateUserStatus(user.id, isActive)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.userMessage = `${user.firstName} ${user.lastName} ${isActive ? 'activated' : 'deactivated'}.`;
                this.updatingUser = false;
                this.loadUsers();
            },
            error: (error) => {
                this.userMessage = this.resolveError(error, 'Unable to update user status.');
                this.updatingUser = false;
            }
        });
    }
    roleForSelectedVenue(user) {
        const venueId = this.selectedVenueId;
        if (!venueId) {
            return 'N/A';
        }
        return user.venueRoles.find((role) => role.venueId === venueId)?.role ?? 'N/A';
    }
    loadVenues() {
        this.loadingVenues = true;
        this.pageError = '';
        this.api
            .getVenues()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (venues) => {
                this.venues = venues;
                this.loadingVenues = false;
                if (venues.length === 0) {
                    this.selectedVenueId = null;
                    this.venueDraft = null;
                    this.users = [];
                    this.pageError = 'No venues are available for your account.';
                    return;
                }
                const preferredVenueId = this.auth.selectedVenueId;
                const initialVenueId = venues.some((venue) => venue.id === preferredVenueId) ? preferredVenueId : venues[0].id;
                if (!initialVenueId) {
                    this.pageError = 'Unable to determine active venue.';
                    return;
                }
                this.onVenueSelectionChanged(initialVenueId);
            },
            error: (error) => {
                this.loadingVenues = false;
                this.pageError = this.resolveError(error, 'Unable to load venues.');
            }
        });
    }
    loadVenueProfile() {
        const venueId = this.selectedVenueId;
        if (!venueId) {
            this.venueDraft = null;
            return;
        }
        this.loadingVenueProfile = true;
        this.venueMessage = '';
        this.api
            .getVenueProfile(venueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (profile) => {
                this.venueDraft = this.mapVenueProfileToDraft(profile);
                this.loadingVenueProfile = false;
            },
            error: (error) => {
                this.loadingVenueProfile = false;
                this.venueMessage = this.resolveError(error, 'Unable to load venue details.');
            }
        });
    }
    loadUsers() {
        const venueId = this.selectedVenueId;
        if (!venueId) {
            this.users = [];
            return;
        }
        this.loadingUsers = true;
        this.userMessage = '';
        this.api
            .getUsers(venueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (users) => {
                this.users = users;
                this.loadingUsers = false;
            },
            error: (error) => {
                this.loadingUsers = false;
                this.userMessage = this.resolveError(error, 'Unable to load users.');
            }
        });
    }
    mapVenueProfileToDraft(profile) {
        return {
            name: profile.name,
            legalEntityName: profile.legalEntityName ?? '',
            addressLine1: profile.addressLine1 ?? '',
            addressLine2: profile.addressLine2 ?? '',
            city: profile.city ?? '',
            region: profile.region ?? '',
            postcode: profile.postcode ?? '',
            countryCode: profile.countryCode || 'GB',
            phoneNumberE164: profile.phoneNumberE164 ?? '',
            enquiriesEmail: profile.enquiriesEmail ?? '',
            websiteUrl: profile.websiteUrl ?? '',
            vatNumber: profile.vatNumber ?? '',
            companyRegistrationNumber: profile.companyRegistrationNumber ?? '',
            logoUrl: profile.logoUrl ?? '',
            description: profile.description ?? '',
            cancellationPolicy: profile.cancellationPolicy ?? '',
            currencyCode: profile.currencyCode || 'GBP',
            defaultVatRate: profile.defaultVatRate,
            timeZone: profile.timeZone || 'Europe/London',
            locale: profile.locale || 'en-GB',
            minimumBookingNoticeDays: profile.minimumBookingNoticeDays,
            defaultHoldPeriodDays: profile.defaultHoldPeriodDays,
            holdWarningDays: profile.holdWarningDays,
            holdAutoReleaseMode: this.normalizeHoldMode(profile.holdAutoReleaseMode),
            maxHoldsPerDateAndSpace: profile.maxHoldsPerDateAndSpace
        };
    }
    createDefaultInviteForm() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumberE164: '',
            role: 'EventsCoordinator',
            requiresTotp: false
        };
    }
    normalizeOptionalText(value) {
        if (!value) {
            return null;
        }
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    }
    sanitizeNumber(value, fallback) {
        return Number.isFinite(value) ? value : fallback;
    }
    sanitizeInteger(value, fallback, minValue = Number.MIN_SAFE_INTEGER) {
        const normalized = Number.isFinite(value) ? Math.round(value) : fallback;
        return normalized < minValue ? minValue : normalized;
    }
    normalizeHoldMode(value) {
        switch (value) {
            case 'AutoReleaseNotifyOperator':
            case 'AutoReleaseNotifyBoth':
                return value;
            default:
                return 'NotifyOnly';
        }
    }
    resolveError(error, fallback) {
        if (typeof error === 'object' && error !== null) {
            const maybeError = error;
            if (typeof maybeError.error === 'string' && maybeError.error.trim()) {
                return maybeError.error;
            }
            if (typeof maybeError.error === 'object' && maybeError.error && typeof maybeError.error.message === 'string') {
                return maybeError.error.message;
            }
            if (typeof maybeError.message === 'string' && maybeError.message.trim()) {
                return maybeError.message;
            }
        }
        return fallback;
    }
    static { this.ɵfac = function AdminComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AdminComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AdminComponent, selectors: [["app-admin"]], decls: 82, vars: 19, consts: [[1, "admin-page"], [1, "page-header"], [1, "page-error"], [1, "admin-grid"], [1, "panel"], [1, "panel-header"], [1, "field"], [3, "ngModelChange", "ngModel", "ngModelOptions", "disabled"], [3, "value"], [1, "hint"], [1, "invite-grid"], ["type", "text", "name", "inviteFirstName", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "inviteLastName", 3, "ngModelChange", "ngModel"], [1, "field", "span-2"], ["type", "email", "name", "inviteEmail", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "invitePhone", "placeholder", "+447700900111", 3, "ngModelChange", "ngModel"], ["name", "inviteRole", 3, "ngModelChange", "ngModel"], [1, "check-field", "span-2"], ["type", "checkbox", "name", "inviteRequiresTotp", 3, "ngModelChange", "ngModel"], [1, "panel-actions"], ["type", "button", 1, "primary", 3, "click", "disabled"], [1, "table-wrap"], [1, "form-grid"], ["type", "text", "name", "venueName", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "legalEntityName", 3, "ngModelChange", "ngModel"], ["type", "email", "name", "enquiriesEmail", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "phoneNumberE164", "placeholder", "+447700900111", 3, "ngModelChange", "ngModel"], ["type", "url", "name", "websiteUrl", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "vatNumber", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "companyRegistrationNumber", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "countryCode", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "currencyCode", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "timeZone", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "locale", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "0", "step", "0.01", "name", "defaultVatRate", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "0", "step", "1", "name", "minimumBookingNoticeDays", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "1", "step", "1", "name", "defaultHoldPeriodDays", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "0", "step", "1", "name", "holdWarningDays", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "1", "step", "1", "name", "maxHoldsPerDateAndSpace", 3, "ngModelChange", "ngModel"], ["name", "holdAutoReleaseMode", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "addressLine1", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "addressLine2", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "city", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "region", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "postcode", 3, "ngModelChange", "ngModel"], ["colspan", "6", 1, "empty-row"], [1, "status"], [1, "actions"], ["type", "button", 3, "click", "disabled"]], template: function AdminComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "div")(3, "h1");
            i0.ɵɵtext(4, "Administration");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "p");
            i0.ɵɵtext(6, "Manage venues and user access for the selected tenant.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(7, AdminComponent_Conditional_7_Template, 2, 1, "p", 2);
            i0.ɵɵelementStart(8, "section", 3)(9, "article", 4)(10, "div", 5)(11, "div")(12, "h2");
            i0.ɵɵtext(13, "Venue Management");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "p");
            i0.ɵɵtext(15, "Update core venue profile, compliance, and hold defaults.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(16, "label", 6)(17, "span");
            i0.ɵɵtext(18, "Venue");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "select", 7);
            i0.ɵɵlistener("ngModelChange", function AdminComponent_Template_select_ngModelChange_19_listener($event) { return ctx.onVenueSelectionChanged($event); });
            i0.ɵɵrepeaterCreate(20, AdminComponent_For_21_Template, 2, 2, "option", 8, _forTrack0);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(22, AdminComponent_Conditional_22_Template, 2, 0, "p", 9);
            i0.ɵɵconditionalCreate(23, AdminComponent_Conditional_23_Template, 2, 1, "p", 9);
            i0.ɵɵconditionalCreate(24, AdminComponent_Conditional_24_Template, 94, 24);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "article", 4)(26, "div", 5)(27, "div")(28, "h2");
            i0.ɵɵtext(29, "User Management");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "p");
            i0.ɵɵtext(31, "Invite users to this venue and manage active status.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(32, AdminComponent_Conditional_32_Template, 2, 1, "p", 9);
            i0.ɵɵelementStart(33, "div", 10)(34, "label", 6)(35, "span");
            i0.ɵɵtext(36, "First Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "input", 11);
            i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Template_input_ngModelChange_37_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.inviteForm.firstName, $event) || (ctx.inviteForm.firstName = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(38, "label", 6)(39, "span");
            i0.ɵɵtext(40, "Last Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "input", 12);
            i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Template_input_ngModelChange_41_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.inviteForm.lastName, $event) || (ctx.inviteForm.lastName = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(42, "label", 13)(43, "span");
            i0.ɵɵtext(44, "Email");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(45, "input", 14);
            i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Template_input_ngModelChange_45_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.inviteForm.email, $event) || (ctx.inviteForm.email = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(46, "label", 6)(47, "span");
            i0.ɵɵtext(48, "Phone (optional)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(49, "input", 15);
            i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Template_input_ngModelChange_49_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.inviteForm.phoneNumberE164, $event) || (ctx.inviteForm.phoneNumberE164 = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(50, "label", 6)(51, "span");
            i0.ɵɵtext(52, "Role");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(53, "select", 16);
            i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Template_select_ngModelChange_53_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.inviteForm.role, $event) || (ctx.inviteForm.role = $event); return $event; });
            i0.ɵɵrepeaterCreate(54, AdminComponent_For_55_Template, 2, 2, "option", 8, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(56, "label", 17)(57, "input", 18);
            i0.ɵɵtwoWayListener("ngModelChange", function AdminComponent_Template_input_ngModelChange_57_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.inviteForm.requiresTotp, $event) || (ctx.inviteForm.requiresTotp = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(58, "span");
            i0.ɵɵtext(59, "Require TOTP 2FA on first sign-in");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(60, "div", 19)(61, "button", 20);
            i0.ɵɵlistener("click", function AdminComponent_Template_button_click_61_listener() { return ctx.sendInvite(); });
            i0.ɵɵtext(62);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(63, AdminComponent_Conditional_63_Template, 4, 1, "p", 9);
            i0.ɵɵelementStart(64, "div", 21)(65, "table")(66, "thead")(67, "tr")(68, "th");
            i0.ɵɵtext(69, "Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(70, "th");
            i0.ɵɵtext(71, "Email");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(72, "th");
            i0.ɵɵtext(73, "Role (Selected Venue)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(74, "th");
            i0.ɵɵtext(75, "2FA");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(76, "th");
            i0.ɵɵtext(77, "Status");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(78, "th");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(79, "tbody");
            i0.ɵɵconditionalCreate(80, AdminComponent_Conditional_80_Template, 3, 0, "tr")(81, AdminComponent_Conditional_81_Template, 3, 1);
            i0.ɵɵelementEnd()()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵconditional(ctx.pageError ? 7 : -1);
            i0.ɵɵadvance(12);
            i0.ɵɵproperty("ngModel", ctx.selectedVenueId)("ngModelOptions", i0.ɵɵpureFunction0(18, _c0))("disabled", ctx.loadingVenues || ctx.venues.length === 0);
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.venues);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.loadingVenueProfile ? 22 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.venueMessage ? 23 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.venueDraft ? 24 : -1);
            i0.ɵɵadvance(8);
            i0.ɵɵconditional(ctx.userMessage ? 32 : -1);
            i0.ɵɵadvance(5);
            i0.ɵɵtwoWayProperty("ngModel", ctx.inviteForm.firstName);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.inviteForm.lastName);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.inviteForm.email);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.inviteForm.phoneNumberE164);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.inviteForm.role);
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.roleOptions);
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.inviteForm.requiresTotp);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("disabled", ctx.invitingUser || !ctx.selectedVenueId);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.invitingUser ? "Sending..." : "Send Invite", " ");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.inviteDebugToken ? 63 : -1);
            i0.ɵɵadvance(17);
            i0.ɵɵconditional(ctx.loadingUsers ? 80 : 81);
        } }, dependencies: [FormsModule, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.CheckboxControlValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.MinValidator, i1.NgModel], styles: [".admin-page[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n}\n\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.5rem;\n  letter-spacing: 0.01em;\n}\n\n.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.35rem 0 0;\n  color: var(--cf-text-muted);\n  font-size: 0.92rem;\n}\n\n.page-error[_ngcontent-%COMP%] {\n  margin: 0;\n  border-radius: 12px;\n  border: 1px solid rgba(220, 38, 38, 0.28);\n  background: rgba(254, 226, 226, 0.85);\n  color: #991b1b;\n  padding: 0.75rem 0.9rem;\n}\n\n.admin-grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);\n}\n\n.panel[_ngcontent-%COMP%] {\n  background: var(--cf-surface);\n  border: 1px solid var(--cf-border);\n  border-radius: var(--cf-radius-xl);\n  box-shadow: var(--cf-shadow-sm);\n  padding: 1rem;\n  display: grid;\n  gap: 0.9rem;\n  align-content: start;\n}\n\n.panel-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.08rem;\n  letter-spacing: 0.01em;\n}\n\n.panel-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.3rem 0 0;\n  color: var(--cf-text-muted);\n  font-size: 0.85rem;\n}\n\n.hint[_ngcontent-%COMP%] {\n  margin: 0;\n  border-radius: 10px;\n  background: var(--cf-primary-soft);\n  color: #1e3a8a;\n  padding: 0.6rem 0.7rem;\n  font-size: 0.82rem;\n}\n\n.form-grid[_ngcontent-%COMP%], \n.invite-grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.75rem;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n\n.field[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n}\n\n.field[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.check-field[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--cf-text-muted);\n  font-size: 0.76rem;\n  font-weight: 500;\n  letter-spacing: 0.02em;\n  text-transform: uppercase;\n}\n\n.field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  border-radius: 10px;\n  border: 1px solid var(--cf-border);\n  background: #fff;\n  color: var(--cf-text);\n  min-height: 2.35rem;\n  padding: 0.55rem 0.65rem;\n}\n\n.check-field[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n\n.check-field[_ngcontent-%COMP%]   input[type='checkbox'][_ngcontent-%COMP%] {\n  width: 1rem;\n  height: 1rem;\n}\n\n.span-2[_ngcontent-%COMP%] {\n  grid-column: span 2;\n}\n\n.panel-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n}\n\n.panel-actions[_ngcontent-%COMP%]   .primary[_ngcontent-%COMP%], \n.actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: none;\n  border-radius: 10px;\n  background: var(--cf-primary);\n  color: #fff;\n  padding: 0.58rem 0.9rem;\n  font-weight: 500;\n}\n\n.panel-actions[_ngcontent-%COMP%]   .primary[_ngcontent-%COMP%]:hover, \n.actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  background: var(--cf-primary-hover);\n}\n\n.panel-actions[_ngcontent-%COMP%]   .primary[_ngcontent-%COMP%]:disabled, \n.actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n\n.table-wrap[_ngcontent-%COMP%] {\n  overflow: auto;\n  border: 1px solid var(--cf-border);\n  border-radius: 12px;\n}\n\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  min-width: 620px;\n}\n\nthead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  text-align: left;\n  font-size: 0.72rem;\n  text-transform: uppercase;\n  letter-spacing: 0.03em;\n  color: var(--cf-text-muted);\n  padding: 0.65rem 0.7rem;\n  border-bottom: 1px solid var(--cf-border);\n}\n\ntbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 0.7rem;\n  border-bottom: 1px solid var(--cf-border-soft);\n  font-size: 0.86rem;\n}\n\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n  border-bottom: none;\n}\n\n.status[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  padding: 0.25rem 0.55rem;\n  border-radius: 999px;\n  font-size: 0.75rem;\n  font-weight: 500;\n}\n\n.status.active[_ngcontent-%COMP%] {\n  background: rgba(22, 163, 74, 0.12);\n  color: #166534;\n}\n\n.status.inactive[_ngcontent-%COMP%] {\n  background: rgba(148, 163, 184, 0.16);\n  color: #334155;\n}\n\n.actions[_ngcontent-%COMP%] {\n  text-align: right;\n}\n\n.empty-row[_ngcontent-%COMP%] {\n  color: var(--cf-text-muted);\n  text-align: center;\n  font-style: italic;\n  padding: 1rem 0.7rem;\n}\n\n@media (max-width: 1280px) {\n  .admin-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n\n@media (max-width: 760px) {\n  .form-grid[_ngcontent-%COMP%], \n   .invite-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .span-2[_ngcontent-%COMP%] {\n    grid-column: auto;\n  }\n\n  .panel-actions[_ngcontent-%COMP%] {\n    justify-content: stretch;\n  }\n\n  .panel-actions[_ngcontent-%COMP%]   .primary[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AdminComponent, [{
        type: Component,
        args: [{ selector: 'app-admin', standalone: true, imports: [FormsModule], template: "<section class=\"admin-page\">\n  <header class=\"page-header\">\n    <div>\n      <h1>Administration</h1>\n      <p>Manage venues and user access for the selected tenant.</p>\n    </div>\n  </header>\n\n  @if (pageError) {\n    <p class=\"page-error\">{{ pageError }}</p>\n  }\n\n  <section class=\"admin-grid\">\n    <article class=\"panel\">\n      <div class=\"panel-header\">\n        <div>\n          <h2>Venue Management</h2>\n          <p>Update core venue profile, compliance, and hold defaults.</p>\n        </div>\n      </div>\n\n      <label class=\"field\">\n        <span>Venue</span>\n        <select\n          [ngModel]=\"selectedVenueId\"\n          [ngModelOptions]=\"{ standalone: true }\"\n          (ngModelChange)=\"onVenueSelectionChanged($event)\"\n          [disabled]=\"loadingVenues || venues.length === 0\">\n          @for (venue of venues; track venue.id) {\n            <option [value]=\"venue.id\">{{ venue.name }}</option>\n          }\n        </select>\n      </label>\n\n      @if (loadingVenueProfile) {\n        <p class=\"hint\">Loading venue profile...</p>\n      }\n\n      @if (venueMessage) {\n        <p class=\"hint\">{{ venueMessage }}</p>\n      }\n\n      @if (venueDraft) {\n        <div class=\"form-grid\">\n          <label class=\"field\">\n            <span>Venue Name</span>\n            <input type=\"text\" [(ngModel)]=\"venueDraft.name\" name=\"venueName\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Legal Entity Name</span>\n            <input type=\"text\" [(ngModel)]=\"venueDraft.legalEntityName\" name=\"legalEntityName\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Enquiries Email</span>\n            <input type=\"email\" [(ngModel)]=\"venueDraft.enquiriesEmail\" name=\"enquiriesEmail\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Phone (E.164)</span>\n            <input type=\"text\" [(ngModel)]=\"venueDraft.phoneNumberE164\" name=\"phoneNumberE164\" placeholder=\"+447700900111\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Website URL</span>\n            <input type=\"url\" [(ngModel)]=\"venueDraft.websiteUrl\" name=\"websiteUrl\" />\n          </label>\n\n          <label class=\"field\">\n            <span>VAT Number</span>\n            <input type=\"text\" [(ngModel)]=\"venueDraft.vatNumber\" name=\"vatNumber\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Company Reg Number</span>\n            <input type=\"text\" [(ngModel)]=\"venueDraft.companyRegistrationNumber\" name=\"companyRegistrationNumber\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Country Code</span>\n            <input type=\"text\" [(ngModel)]=\"venueDraft.countryCode\" name=\"countryCode\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Currency</span>\n            <input type=\"text\" [(ngModel)]=\"venueDraft.currencyCode\" name=\"currencyCode\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Time Zone</span>\n            <input type=\"text\" [(ngModel)]=\"venueDraft.timeZone\" name=\"timeZone\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Locale</span>\n            <input type=\"text\" [(ngModel)]=\"venueDraft.locale\" name=\"locale\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Default VAT %</span>\n            <input type=\"number\" min=\"0\" step=\"0.01\" [(ngModel)]=\"venueDraft.defaultVatRate\" name=\"defaultVatRate\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Min Booking Notice (days)</span>\n            <input\n              type=\"number\"\n              min=\"0\"\n              step=\"1\"\n              [(ngModel)]=\"venueDraft.minimumBookingNoticeDays\"\n              name=\"minimumBookingNoticeDays\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Default Hold Period (days)</span>\n            <input\n              type=\"number\"\n              min=\"1\"\n              step=\"1\"\n              [(ngModel)]=\"venueDraft.defaultHoldPeriodDays\"\n              name=\"defaultHoldPeriodDays\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Hold Warning (days)</span>\n            <input type=\"number\" min=\"0\" step=\"1\" [(ngModel)]=\"venueDraft.holdWarningDays\" name=\"holdWarningDays\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Max Holds per Date/Space</span>\n            <input\n              type=\"number\"\n              min=\"1\"\n              step=\"1\"\n              [(ngModel)]=\"venueDraft.maxHoldsPerDateAndSpace\"\n              name=\"maxHoldsPerDateAndSpace\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Hold Auto Release</span>\n            <select [(ngModel)]=\"venueDraft.holdAutoReleaseMode\" name=\"holdAutoReleaseMode\">\n              @for (mode of holdAutoReleaseModes; track mode) {\n                <option [value]=\"mode\">{{ mode }}</option>\n              }\n            </select>\n          </label>\n\n          <label class=\"field span-2\">\n            <span>Address Line 1</span>\n            <input type=\"text\" [(ngModel)]=\"venueDraft.addressLine1\" name=\"addressLine1\" />\n          </label>\n\n          <label class=\"field span-2\">\n            <span>Address Line 2</span>\n            <input type=\"text\" [(ngModel)]=\"venueDraft.addressLine2\" name=\"addressLine2\" />\n          </label>\n\n          <label class=\"field\">\n            <span>City</span>\n            <input type=\"text\" [(ngModel)]=\"venueDraft.city\" name=\"city\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Region</span>\n            <input type=\"text\" [(ngModel)]=\"venueDraft.region\" name=\"region\" />\n          </label>\n\n          <label class=\"field\">\n            <span>Postcode</span>\n            <input type=\"text\" [(ngModel)]=\"venueDraft.postcode\" name=\"postcode\" />\n          </label>\n        </div>\n\n        <div class=\"panel-actions\">\n          <button type=\"button\" class=\"primary\" (click)=\"saveVenue()\" [disabled]=\"savingVenue || loadingVenueProfile\">\n            {{ savingVenue ? 'Saving...' : 'Save Venue' }}\n          </button>\n        </div>\n      }\n    </article>\n\n    <article class=\"panel\">\n      <div class=\"panel-header\">\n        <div>\n          <h2>User Management</h2>\n          <p>Invite users to this venue and manage active status.</p>\n        </div>\n      </div>\n\n      @if (userMessage) {\n        <p class=\"hint\">{{ userMessage }}</p>\n      }\n\n      <div class=\"invite-grid\">\n        <label class=\"field\">\n          <span>First Name</span>\n          <input type=\"text\" [(ngModel)]=\"inviteForm.firstName\" name=\"inviteFirstName\" />\n        </label>\n        <label class=\"field\">\n          <span>Last Name</span>\n          <input type=\"text\" [(ngModel)]=\"inviteForm.lastName\" name=\"inviteLastName\" />\n        </label>\n        <label class=\"field span-2\">\n          <span>Email</span>\n          <input type=\"email\" [(ngModel)]=\"inviteForm.email\" name=\"inviteEmail\" />\n        </label>\n        <label class=\"field\">\n          <span>Phone (optional)</span>\n          <input type=\"text\" [(ngModel)]=\"inviteForm.phoneNumberE164\" name=\"invitePhone\" placeholder=\"+447700900111\" />\n        </label>\n        <label class=\"field\">\n          <span>Role</span>\n          <select [(ngModel)]=\"inviteForm.role\" name=\"inviteRole\">\n            @for (role of roleOptions; track role) {\n              <option [value]=\"role\">{{ role }}</option>\n            }\n          </select>\n        </label>\n        <label class=\"check-field span-2\">\n          <input type=\"checkbox\" [(ngModel)]=\"inviteForm.requiresTotp\" name=\"inviteRequiresTotp\" />\n          <span>Require TOTP 2FA on first sign-in</span>\n        </label>\n      </div>\n\n      <div class=\"panel-actions\">\n        <button type=\"button\" class=\"primary\" (click)=\"sendInvite()\" [disabled]=\"invitingUser || !selectedVenueId\">\n          {{ invitingUser ? 'Sending...' : 'Send Invite' }}\n        </button>\n      </div>\n\n      @if (inviteDebugToken) {\n        <p class=\"hint\">Debug invitation token: <code>{{ inviteDebugToken }}</code></p>\n      }\n\n      <div class=\"table-wrap\">\n        <table>\n          <thead>\n            <tr>\n              <th>Name</th>\n              <th>Email</th>\n              <th>Role (Selected Venue)</th>\n              <th>2FA</th>\n              <th>Status</th>\n              <th></th>\n            </tr>\n          </thead>\n          <tbody>\n            @if (loadingUsers) {\n              <tr>\n                <td colspan=\"6\" class=\"empty-row\">Loading users...</td>\n              </tr>\n            } @else {\n              @for (user of users; track user.id) {\n                <tr>\n                  <td>{{ user.firstName }} {{ user.lastName }}</td>\n                  <td>{{ user.email }}</td>\n                  <td>{{ roleForSelectedVenue(user) }}</td>\n                  <td>{{ user.requiresTotp ? 'Required' : 'Optional' }}</td>\n                  <td>\n                    <span class=\"status\" [class.active]=\"user.isActive\" [class.inactive]=\"!user.isActive\">\n                      {{ user.isActive ? 'Active' : 'Inactive' }}\n                    </span>\n                  </td>\n                  <td class=\"actions\">\n                    <button\n                      type=\"button\"\n                      (click)=\"setUserActive(user, !user.isActive)\"\n                      [disabled]=\"updatingUser\">\n                      {{ user.isActive ? 'Deactivate' : 'Activate' }}\n                    </button>\n                  </td>\n                </tr>\n              }\n\n              @if (users.length === 0) {\n                <tr>\n                  <td colspan=\"6\" class=\"empty-row\">No users assigned to this venue.</td>\n                </tr>\n              }\n            }\n          </tbody>\n        </table>\n      </div>\n    </article>\n  </section>\n</section>\n", styles: [".admin-page {\n  display: grid;\n  gap: 1rem;\n}\n\n.page-header h1 {\n  margin: 0;\n  font-size: 1.5rem;\n  letter-spacing: 0.01em;\n}\n\n.page-header p {\n  margin: 0.35rem 0 0;\n  color: var(--cf-text-muted);\n  font-size: 0.92rem;\n}\n\n.page-error {\n  margin: 0;\n  border-radius: 12px;\n  border: 1px solid rgba(220, 38, 38, 0.28);\n  background: rgba(254, 226, 226, 0.85);\n  color: #991b1b;\n  padding: 0.75rem 0.9rem;\n}\n\n.admin-grid {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);\n}\n\n.panel {\n  background: var(--cf-surface);\n  border: 1px solid var(--cf-border);\n  border-radius: var(--cf-radius-xl);\n  box-shadow: var(--cf-shadow-sm);\n  padding: 1rem;\n  display: grid;\n  gap: 0.9rem;\n  align-content: start;\n}\n\n.panel-header h2 {\n  margin: 0;\n  font-size: 1.08rem;\n  letter-spacing: 0.01em;\n}\n\n.panel-header p {\n  margin: 0.3rem 0 0;\n  color: var(--cf-text-muted);\n  font-size: 0.85rem;\n}\n\n.hint {\n  margin: 0;\n  border-radius: 10px;\n  background: var(--cf-primary-soft);\n  color: #1e3a8a;\n  padding: 0.6rem 0.7rem;\n  font-size: 0.82rem;\n}\n\n.form-grid,\n.invite-grid {\n  display: grid;\n  gap: 0.75rem;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n\n.field {\n  display: grid;\n  gap: 0.34rem;\n}\n\n.field span,\n.check-field span {\n  color: var(--cf-text-muted);\n  font-size: 0.76rem;\n  font-weight: 500;\n  letter-spacing: 0.02em;\n  text-transform: uppercase;\n}\n\n.field input,\n.field select,\n.field textarea {\n  width: 100%;\n  border-radius: 10px;\n  border: 1px solid var(--cf-border);\n  background: #fff;\n  color: var(--cf-text);\n  min-height: 2.35rem;\n  padding: 0.55rem 0.65rem;\n}\n\n.check-field {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n\n.check-field input[type='checkbox'] {\n  width: 1rem;\n  height: 1rem;\n}\n\n.span-2 {\n  grid-column: span 2;\n}\n\n.panel-actions {\n  display: flex;\n  justify-content: flex-end;\n}\n\n.panel-actions .primary,\n.actions button {\n  border: none;\n  border-radius: 10px;\n  background: var(--cf-primary);\n  color: #fff;\n  padding: 0.58rem 0.9rem;\n  font-weight: 500;\n}\n\n.panel-actions .primary:hover,\n.actions button:hover {\n  background: var(--cf-primary-hover);\n}\n\n.panel-actions .primary:disabled,\n.actions button:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n\n.table-wrap {\n  overflow: auto;\n  border: 1px solid var(--cf-border);\n  border-radius: 12px;\n}\n\ntable {\n  width: 100%;\n  border-collapse: collapse;\n  min-width: 620px;\n}\n\nthead th {\n  text-align: left;\n  font-size: 0.72rem;\n  text-transform: uppercase;\n  letter-spacing: 0.03em;\n  color: var(--cf-text-muted);\n  padding: 0.65rem 0.7rem;\n  border-bottom: 1px solid var(--cf-border);\n}\n\ntbody td {\n  padding: 0.7rem;\n  border-bottom: 1px solid var(--cf-border-soft);\n  font-size: 0.86rem;\n}\n\ntbody tr:last-child td {\n  border-bottom: none;\n}\n\n.status {\n  display: inline-flex;\n  align-items: center;\n  padding: 0.25rem 0.55rem;\n  border-radius: 999px;\n  font-size: 0.75rem;\n  font-weight: 500;\n}\n\n.status.active {\n  background: rgba(22, 163, 74, 0.12);\n  color: #166534;\n}\n\n.status.inactive {\n  background: rgba(148, 163, 184, 0.16);\n  color: #334155;\n}\n\n.actions {\n  text-align: right;\n}\n\n.empty-row {\n  color: var(--cf-text-muted);\n  text-align: center;\n  font-style: italic;\n  padding: 1rem 0.7rem;\n}\n\n@media (max-width: 1280px) {\n  .admin-grid {\n    grid-template-columns: 1fr;\n  }\n}\n\n@media (max-width: 760px) {\n  .form-grid,\n  .invite-grid {\n    grid-template-columns: 1fr;\n  }\n\n  .span-2 {\n    grid-column: auto;\n  }\n\n  .panel-actions {\n    justify-content: stretch;\n  }\n\n  .panel-actions .primary {\n    width: 100%;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AdminComponent, { className: "AdminComponent", filePath: "src/app/pages/admin/admin.component.ts", lineNumber: 32 }); })();
//# sourceMappingURL=admin.component.js.map