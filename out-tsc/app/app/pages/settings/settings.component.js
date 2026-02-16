import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.key;
const _forTrack1 = ($index, $item) => $item.id;
function SettingsComponent_For_10_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 8);
    i0.ɵɵlistener("click", function SettingsComponent_For_10_Template_button_click_0_listener() { const section_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.setSection(section_r2.key)); });
    i0.ɵɵelementStart(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const section_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("active", section_r2.key === ctx_r2.activeSectionKey);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(section_r2.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(section_r2.description);
} }
function SettingsComponent_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 7)(1, "h3");
    i0.ɵɵtext(2, "No Venue Selected");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "Select a venue from the top navigation to configure settings.");
    i0.ɵɵelementEnd()();
} }
function SettingsComponent_Conditional_18_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 9)(1, "p");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Loading ", ctx_r2.activeSection.title.toLowerCase(), "...");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 10);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.sectionStates[ctx_r2.activeSectionKey].error);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 11);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.sectionStates[ctx_r2.activeSectionKey].success);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_2_For_68_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 38);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const mode_r5 = ctx.$implicit;
    i0.ɵɵproperty("value", mode_r5);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(mode_r5);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "form", 15);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_2_Template_form_ngSubmit_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.saveVenueProfile()); });
    i0.ɵɵelementStart(1, "label");
    i0.ɵɵtext(2, " Venue Name ");
    i0.ɵɵelement(3, "input", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "label");
    i0.ɵɵtext(5, " Legal Entity Name ");
    i0.ɵɵelement(6, "input", 17);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "label");
    i0.ɵɵtext(8, " Address Line 1 ");
    i0.ɵɵelement(9, "input", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "label");
    i0.ɵɵtext(11, " Address Line 2 ");
    i0.ɵɵelement(12, "input", 19);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "label");
    i0.ɵɵtext(14, " City ");
    i0.ɵɵelement(15, "input", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "label");
    i0.ɵɵtext(17, " Region/County ");
    i0.ɵɵelement(18, "input", 21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "label");
    i0.ɵɵtext(20, " Postcode ");
    i0.ɵɵelement(21, "input", 22);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "label");
    i0.ɵɵtext(23, " Country Code ");
    i0.ɵɵelement(24, "input", 23);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "label");
    i0.ɵɵtext(26, " Enquiries Phone (E.164) ");
    i0.ɵɵelement(27, "input", 24);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "label");
    i0.ɵɵtext(29, " Enquiries Email ");
    i0.ɵɵelement(30, "input", 25);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "label");
    i0.ɵɵtext(32, " Website URL ");
    i0.ɵɵelement(33, "input", 26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "label");
    i0.ɵɵtext(35, " VAT Number ");
    i0.ɵɵelement(36, "input", 27);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "label");
    i0.ɵɵtext(38, " Company Registration Number ");
    i0.ɵɵelement(39, "input", 28);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "label");
    i0.ɵɵtext(41, " Logo URL ");
    i0.ɵɵelement(42, "input", 29);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "label");
    i0.ɵɵtext(44, " Currency ");
    i0.ɵɵelement(45, "input", 30);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "label");
    i0.ɵɵtext(47, " Default VAT (%) ");
    i0.ɵɵelement(48, "input", 31);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "label");
    i0.ɵɵtext(50, " Time Zone ");
    i0.ɵɵelement(51, "input", 32);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(52, "label");
    i0.ɵɵtext(53, " Locale ");
    i0.ɵɵelement(54, "input", 33);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(55, "label");
    i0.ɵɵtext(56, " Min Booking Notice (days) ");
    i0.ɵɵelement(57, "input", 34);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(58, "label");
    i0.ɵɵtext(59, " Default Hold Period (days) ");
    i0.ɵɵelement(60, "input", 35);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(61, "label");
    i0.ɵɵtext(62, " Hold Warning (days) ");
    i0.ɵɵelement(63, "input", 36);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(64, "label");
    i0.ɵɵtext(65, " Hold Auto Release ");
    i0.ɵɵelementStart(66, "select", 37);
    i0.ɵɵrepeaterCreate(67, SettingsComponent_Conditional_18_Conditional_1_Conditional_2_For_68_Template, 2, 2, "option", 38, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(69, "label");
    i0.ɵɵtext(70, " Max Holds per Date/Space ");
    i0.ɵɵelement(71, "input", 39);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(72, "label", 40);
    i0.ɵɵtext(73, " Description ");
    i0.ɵɵelement(74, "textarea", 41);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(75, "label", 40);
    i0.ɵɵtext(76, " Cancellation Policy ");
    i0.ɵɵelement(77, "textarea", 42);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(78, "div", 43)(79, "button", 44);
    i0.ɵɵtext(80);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("formGroup", ctx_r2.venueForm);
    i0.ɵɵadvance(67);
    i0.ɵɵrepeater(ctx_r2.holdAutoReleaseModes);
    i0.ɵɵadvance(12);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates["venue-profile"].saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates["venue-profile"].saving ? "Saving..." : "Save Venue Profile", " ");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_20_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "small");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "td");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "td");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "td")(11, "button", 68);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_20_Template_button_click_11_listener() { const space_r8 = i0.ɵɵrestoreView(_r7).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.editSpace(space_r8)); });
    i0.ɵɵtext(12, "Edit");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const space_r8 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(space_r8.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(space_r8.locationText || "No location");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(space_r8.isActive ? "Yes" : "No");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", space_r8.turnaroundMinutes, " min");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 69);
    i0.ɵɵtext(2, "No spaces configured yet.");
    i0.ɵɵelementEnd()();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_63_For_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 38);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const style_r10 = ctx.$implicit;
    i0.ɵɵproperty("value", style_r10);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(style_r10);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_63_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 59)(1, "select", 70);
    i0.ɵɵrepeaterCreate(2, SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_63_For_3_Template, 2, 2, "option", 38, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "input", 71);
    i0.ɵɵelementStart(5, "button", 72);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_63_Template_button_click_5_listener() { const ɵ$index_328_r11 = i0.ɵɵrestoreView(_r9).$index; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.removeSpaceCapacityRule(ɵ$index_328_r11)); });
    i0.ɵɵtext(6, "\u2715");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ɵ$index_328_r11 = ctx.$index;
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("formGroupName", ɵ$index_328_r11);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r2.setupStyles);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_72_For_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 38);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const rate_r13 = ctx.$implicit;
    i0.ɵɵproperty("value", rate_r13);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(rate_r13);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_72_For_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 38);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const day_r14 = ctx.$implicit;
    i0.ɵɵproperty("value", day_r14);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(day_r14);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_72_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 61)(1, "select", 73);
    i0.ɵɵrepeaterCreate(2, SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_72_For_3_Template, 2, 2, "option", 38, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "input", 74)(5, "input", 30);
    i0.ɵɵelementStart(6, "select", 75)(7, "option", 76);
    i0.ɵɵtext(8, "Any day");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(9, SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_72_For_10_Template, 2, 2, "option", 38, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "button", 72);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_72_Template_button_click_11_listener() { const ɵ$index_354_r15 = i0.ɵɵrestoreView(_r12).$index; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.removeSpacePricingRule(ɵ$index_354_r15)); });
    i0.ɵɵtext(12, "\u2715");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ɵ$index_354_r15 = ctx.$index;
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("formGroupName", ɵ$index_354_r15);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r2.pricingRateTypes);
    i0.ɵɵadvance(7);
    i0.ɵɵrepeater(ctx_r2.dayOfWeekOptions);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_96_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
    i0.ɵɵpipe(1, "number");
} if (rf & 2) {
    const combination_r17 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵtextInterpolate2(" ", combination_r17.currencyCode, " ", i0.ɵɵpipeBind2(1, 2, combination_r17.priceAmount, "1.2-2"), " ");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_96_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " - ");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_96_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td");
    i0.ɵɵconditionalCreate(6, SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_96_Conditional_6_Template, 2, 5)(7, SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_96_Conditional_7_Template, 1, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "td")(9, "button", 68);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_96_Template_button_click_9_listener() { const combination_r17 = i0.ɵɵrestoreView(_r16).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.editCombination(combination_r17)); });
    i0.ɵɵtext(10, "Edit");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const combination_r17 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(combination_r17.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(combination_r17.spaceIds.length);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(combination_r17.priceAmount !== null && combination_r17.priceAmount !== undefined ? 6 : 7);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_Conditional_97_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 69);
    i0.ɵɵtext(2, "No space combinations configured yet.");
    i0.ɵɵelementEnd()();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_120_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 67)(1, "input", 77);
    i0.ɵɵlistener("change", function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_120_Template_input_change_1_listener($event) { const space_r19 = i0.ɵɵrestoreView(_r18).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.toggleCombinationSpace(space_r19.id, $event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const space_r19 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵproperty("checked", ctx_r2.isCombinationSpaceSelected(space_r19.id));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(space_r19.name);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_129_For_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 38);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const style_r21 = ctx.$implicit;
    i0.ɵɵproperty("value", style_r21);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(style_r21);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_129_Template(rf, ctx) { if (rf & 1) {
    const _r20 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 59)(1, "select", 70);
    i0.ɵɵrepeaterCreate(2, SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_129_For_3_Template, 2, 2, "option", 38, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "input", 71);
    i0.ɵɵelementStart(5, "button", 72);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_129_Template_button_click_5_listener() { const ɵ$index_500_r22 = i0.ɵɵrestoreView(_r20).$index; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.removeCombinationCapacityRule(ɵ$index_500_r22)); });
    i0.ɵɵtext(6, "\u2715");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ɵ$index_500_r22 = ctx.$index;
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("formGroupName", ɵ$index_500_r22);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r2.setupStyles);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 14)(1, "article", 13)(2, "header", 45)(3, "h3");
    i0.ɵɵtext(4, "Spaces");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 46);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.startNewSpace()); });
    i0.ɵɵtext(6, "New Space");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 47)(8, "table")(9, "thead")(10, "tr")(11, "th");
    i0.ɵɵtext(12, "Name");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "th");
    i0.ɵɵtext(14, "Active");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "th");
    i0.ɵɵtext(16, "Turnaround");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(17, "th");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "tbody");
    i0.ɵɵrepeaterCreate(19, SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_20_Template, 13, 4, "tr", null, _forTrack1);
    i0.ɵɵconditionalCreate(21, SettingsComponent_Conditional_18_Conditional_1_Conditional_3_Conditional_21_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(22, "article", 13)(23, "header", 45)(24, "h3");
    i0.ɵɵtext(25);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(26, "form", 48);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_Template_form_ngSubmit_26_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.saveSpace()); });
    i0.ɵɵelementStart(27, "label");
    i0.ɵɵtext(28, " Space Name ");
    i0.ɵɵelement(29, "input", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "label");
    i0.ɵɵtext(31, " Location ");
    i0.ɵɵelement(32, "input", 49);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "label");
    i0.ɵɵtext(34, " Floor Area (sqm) ");
    i0.ɵɵelement(35, "input", 50);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "label");
    i0.ɵɵtext(37, " Turnaround (minutes) ");
    i0.ɵɵelement(38, "input", 51);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "label");
    i0.ɵɵtext(40, " Min Spend ");
    i0.ɵɵelement(41, "input", 52);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "label");
    i0.ɵɵtext(43, " Min Spend Currency ");
    i0.ɵɵelement(44, "input", 53);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "label", 40);
    i0.ɵɵtext(46, " Facilities (comma separated) ");
    i0.ɵɵelement(47, "input", 54);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "label", 40);
    i0.ɵɵtext(49, " Description ");
    i0.ɵɵelement(50, "textarea", 41);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(51, "label", 55);
    i0.ɵɵelement(52, "input", 56);
    i0.ɵɵelementStart(53, "span");
    i0.ɵɵtext(54, "Active and bookable");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(55, "section", 57)(56, "header")(57, "h4");
    i0.ɵɵtext(58, "Capacity by Setup Style");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(59, "button", 46);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_Template_button_click_59_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.addSpaceCapacityRule()); });
    i0.ɵɵtext(60, "Add");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(61, "div", 58);
    i0.ɵɵrepeaterCreate(62, SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_63_Template, 7, 1, "div", 59, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(64, "section", 57)(65, "header")(66, "h4");
    i0.ɵɵtext(67, "Pricing Rules");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(68, "button", 46);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_Template_button_click_68_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.addSpacePricingRule()); });
    i0.ɵɵtext(69, "Add");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(70, "div", 60);
    i0.ɵɵrepeaterCreate(71, SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_72_Template, 13, 1, "div", 61, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(73, "div", 43)(74, "button", 44);
    i0.ɵɵtext(75);
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(76, "section", 62)(77, "article", 13)(78, "header", 45)(79, "h3");
    i0.ɵɵtext(80, "Space Combinations");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(81, "button", 46);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_Template_button_click_81_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.startNewCombination()); });
    i0.ɵɵtext(82, "New Combination");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(83, "div", 47)(84, "table")(85, "thead")(86, "tr")(87, "th");
    i0.ɵɵtext(88, "Name");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(89, "th");
    i0.ɵɵtext(90, "Members");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(91, "th");
    i0.ɵɵtext(92, "Price");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(93, "th");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(94, "tbody");
    i0.ɵɵrepeaterCreate(95, SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_96_Template, 11, 3, "tr", null, _forTrack1);
    i0.ɵɵconditionalCreate(97, SettingsComponent_Conditional_18_Conditional_1_Conditional_3_Conditional_97_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(98, "article", 13)(99, "header", 45)(100, "h3");
    i0.ɵɵtext(101);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(102, "form", 48);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_Template_form_ngSubmit_102_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.saveCombination()); });
    i0.ɵɵelementStart(103, "label");
    i0.ɵɵtext(104, " Combination Name ");
    i0.ɵɵelement(105, "input", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(106, "label");
    i0.ɵɵtext(107, " Price Amount ");
    i0.ɵɵelement(108, "input", 63);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(109, "label");
    i0.ɵɵtext(110, " Currency ");
    i0.ɵɵelement(111, "input", 30);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(112, "label", 40);
    i0.ɵɵtext(113, " Description ");
    i0.ɵɵelement(114, "textarea", 64);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(115, "section", 65)(116, "h4");
    i0.ɵɵtext(117, "Included Spaces");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(118, "div", 66);
    i0.ɵɵrepeaterCreate(119, SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_120_Template, 4, 2, "label", 67, _forTrack1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(121, "section", 57)(122, "header")(123, "h4");
    i0.ɵɵtext(124, "Combined Capacity Rules");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(125, "button", 46);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_3_Template_button_click_125_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.addCombinationCapacityRule()); });
    i0.ɵɵtext(126, "Add");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(127, "div", 58);
    i0.ɵɵrepeaterCreate(128, SettingsComponent_Conditional_18_Conditional_1_Conditional_3_For_129_Template, 7, 1, "div", 59, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(130, "div", 43)(131, "button", 44);
    i0.ɵɵtext(132);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(19);
    i0.ɵɵrepeater(ctx_r2.spaces);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.spaces.length === 0 ? 21 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r2.editingSpaceId ? "Edit Space" : "Create Space");
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroup", ctx_r2.spaceForm);
    i0.ɵɵadvance(36);
    i0.ɵɵrepeater(ctx_r2.spaceCapacityControls.controls);
    i0.ɵɵadvance(9);
    i0.ɵɵrepeater(ctx_r2.spacePricingControls.controls);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates.spaces.saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates.spaces.saving ? "Saving..." : ctx_r2.editingSpaceId ? "Update Space" : "Create Space", " ");
    i0.ɵɵadvance(20);
    i0.ɵɵrepeater(ctx_r2.combinations);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.combinations.length === 0 ? 97 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r2.editingCombinationId ? "Edit Combination" : "Create Combination");
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroup", ctx_r2.combinationForm);
    i0.ɵɵadvance(17);
    i0.ɵɵrepeater(ctx_r2.spaces);
    i0.ɵɵadvance(9);
    i0.ɵɵrepeater(ctx_r2.combinationCapacityControls.controls);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates.spaces.saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates.spaces.saving ? "Saving..." : ctx_r2.editingCombinationId ? "Update Combination" : "Create Combination", " ");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_4_For_13_Template(rf, ctx) { if (rf & 1) {
    const _r24 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 85);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_4_For_13_Template_button_click_0_listener() { const month_r25 = i0.ɵɵrestoreView(_r24).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.setBudgetMonth(month_r25)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const month_r25 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵclassProp("active", month_r25 === ctx_r2.selectedBudgetMonth);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.getMonthLabel(month_r25), " ");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_4_Conditional_14_Conditional_28_For_1_Template(rf, ctx) { if (rf & 1) {
    const _r27 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 89)(1, "td");
    i0.ɵɵelement(2, "input", 90);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td");
    i0.ɵɵelement(4, "input", 91);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td");
    i0.ɵɵelement(6, "input", 92);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td");
    i0.ɵɵelement(8, "input", 93);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "td");
    i0.ɵɵelement(10, "input", 94);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "td")(12, "button", 72);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_4_Conditional_14_Conditional_28_For_1_Template_button_click_12_listener() { const ɵ$index_593_r28 = i0.ɵɵrestoreView(_r27).$index; const ctx_r2 = i0.ɵɵnextContext(6); return i0.ɵɵresetView(ctx_r2.removeBudgetTargetRow(ctx_r2.selectedBudgetMonth, ɵ$index_593_r28)); });
    i0.ɵɵtext(13, "\u2715");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ɵ$index_593_r28 = ctx.$index;
    i0.ɵɵproperty("formGroupName", ɵ$index_593_r28);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_4_Conditional_14_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, SettingsComponent_Conditional_18_Conditional_1_Conditional_4_Conditional_14_Conditional_28_For_1_Template, 14, 1, "tr", 89, i0.ɵɵrepeaterTrackByIndex);
} if (rf & 2) {
    i0.ɵɵrepeater(ctx.controls);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_4_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    const _r26 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "form", 81)(1, "label");
    i0.ɵɵtext(2, " Overall Revenue Target ");
    i0.ɵɵelement(3, "input", 86);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "label");
    i0.ɵɵtext(5, " Currency ");
    i0.ɵɵelement(6, "input", 30);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "section", 87)(8, "header")(9, "h4");
    i0.ɵɵtext(10, "Targets by Event Type");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "button", 46);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_4_Conditional_14_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r26); const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.addBudgetTargetRow(ctx_r2.selectedBudgetMonth)); });
    i0.ɵɵtext(12, "Add Row");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "table")(14, "thead")(15, "tr")(16, "th");
    i0.ɵɵtext(17, "Event Type");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "th");
    i0.ɵɵtext(19, "Revenue");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "th");
    i0.ɵɵtext(21, "Covers");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "th");
    i0.ɵɵtext(23, "Bookings");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "th");
    i0.ɵɵtext(25, "ASP");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(26, "th");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(27, "tbody");
    i0.ɵɵconditionalCreate(28, SettingsComponent_Conditional_18_Conditional_1_Conditional_4_Conditional_14_Conditional_28_Template, 2, 0);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(29, "div", 43)(30, "button", 88);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_4_Conditional_14_Template_button_click_30_listener() { i0.ɵɵrestoreView(_r26); const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.saveBudgetMonth(ctx_r2.selectedBudgetMonth)); });
    i0.ɵɵtext(31);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_6_0;
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("formGroup", ctx);
    i0.ɵɵadvance(28);
    i0.ɵɵconditional((tmp_6_0 = ctx_r2.getBudgetTargetsArray(ctx_r2.selectedBudgetMonth)) ? 28 : -1, tmp_6_0);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates.budgets.saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates.budgets.saving ? "Saving..." : "Save " + ctx_r2.getMonthLabel(ctx_r2.selectedBudgetMonth) + " Budget", " ");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r23 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 13)(1, "header", 45)(2, "h3");
    i0.ɵɵtext(3, "Annual Budgets");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 78)(5, "button", 46);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_4_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r23); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.changeBudgetYear(-1)); });
    i0.ɵɵtext(6, "Previous");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "span");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "button", 46);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_4_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r23); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.changeBudgetYear(1)); });
    i0.ɵɵtext(10, "Next");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "div", 79);
    i0.ɵɵrepeaterCreate(12, SettingsComponent_Conditional_18_Conditional_1_Conditional_4_For_13_Template, 2, 3, "button", 80, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(14, SettingsComponent_Conditional_18_Conditional_1_Conditional_4_Conditional_14_Template, 32, 4, "form", 81);
    i0.ɵɵelementStart(15, "section", 82)(16, "h4");
    i0.ɵɵtext(17, "Import from CSV");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "p");
    i0.ɵɵtext(19, "Header format: `year,month,overallRevenueTarget,currency,eventType,revenueTarget,coversTarget,bookingCountTarget,aspTarget`.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "div", 78)(21, "input", 83);
    i0.ɵɵlistener("change", function SettingsComponent_Conditional_18_Conditional_1_Conditional_4_Template_input_change_21_listener($event) { i0.ɵɵrestoreView(_r23); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onBudgetCsvSelected($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "button", 84);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_4_Template_button_click_22_listener() { i0.ɵɵrestoreView(_r23); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.uploadBudgetCsv()); });
    i0.ɵɵtext(23, " Import CSV ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    let tmp_5_0;
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r2.selectedBudgetYear);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r2.monthNumbers);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional((tmp_5_0 = ctx_r2.currentBudgetForm) ? 14 : -1, tmp_5_0);
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("disabled", !ctx_r2.selectedBudgetCsvFile || ctx_r2.sectionStates.budgets.saving);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_5_For_52_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
    i0.ɵɵpipe(1, "number");
} if (rf & 2) {
    const template_r31 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(1, 1, template_r31.milestones[0] == null ? null : template_r31.milestones[0].amount, "1.0-2"), "% ");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_5_For_52_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
    i0.ɵɵpipe(1, "number");
} if (rf & 2) {
    let tmp_14_0;
    const template_r31 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵtextInterpolate2(" ", ((tmp_14_0 = ctx_r2.venueForm.get("currencyCode")) == null ? null : tmp_14_0.value) || "GBP", " ", i0.ɵɵpipeBind2(1, 2, template_r31.milestones[0] == null ? null : template_r31.milestones[0].amount, "1.2-2"), " ");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_5_For_52_Template(rf, ctx) { if (rf & 1) {
    const _r30 = i0.ɵɵgetCurrentView();
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
    i0.ɵɵconditionalCreate(8, SettingsComponent_Conditional_18_Conditional_1_Conditional_5_For_52_Conditional_8_Template, 2, 4)(9, SettingsComponent_Conditional_18_Conditional_1_Conditional_5_For_52_Conditional_9_Template, 2, 5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "td");
    i0.ɵɵtext(11, "-");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "td")(13, "button", 103);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_5_For_52_Template_button_click_13_listener() { const template_r31 = i0.ɵɵrestoreView(_r30).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.deletePaymentScheduleTemplate(template_r31.id)); });
    i0.ɵɵtext(14, "Delete");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const template_r31 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(template_r31.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(template_r31.eventType);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate((template_r31.milestones[0] == null ? null : template_r31.milestones[0].name) || "-");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(((template_r31.milestones[0] == null ? null : template_r31.milestones[0].amountType) || "") === "Percentage" ? 8 : 9);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_5_Conditional_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 104);
    i0.ɵɵtext(2, "No payment schedule templates yet.");
    i0.ɵɵelementEnd()();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r29 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 13)(1, "header", 45)(2, "h3");
    i0.ɵɵtext(3, "Payment Schedule Templates");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "p", 95);
    i0.ɵɵtext(5, "Templates are stored per venue and used as defaults when events are confirmed.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "form", 48);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_5_Template_form_ngSubmit_6_listener() { i0.ɵɵrestoreView(_r29); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.savePaymentScheduleTemplate()); });
    i0.ɵɵelementStart(7, "label");
    i0.ɵɵtext(8, " Template Name ");
    i0.ɵɵelement(9, "input", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "label");
    i0.ɵɵtext(11, " Event Type ");
    i0.ɵɵelement(12, "input", 90);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "label");
    i0.ɵɵtext(14, " Milestone Name ");
    i0.ɵɵelement(15, "input", 96);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "label");
    i0.ɵɵtext(17, " Due Date Rule ");
    i0.ɵɵelement(18, "input", 97);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "label");
    i0.ɵɵtext(20, " Amount Type ");
    i0.ɵɵelementStart(21, "select", 98)(22, "option", 99);
    i0.ɵɵtext(23, "Percentage");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "option", 100);
    i0.ɵɵtext(25, "Fixed");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(26, "label");
    i0.ɵɵtext(27, " Amount ");
    i0.ɵɵelement(28, "input", 101);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "label", 40);
    i0.ɵɵtext(30, " Accepted Methods (comma separated) ");
    i0.ɵɵelement(31, "input", 102);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "div", 43)(33, "button", 44);
    i0.ɵɵtext(34);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(35, "div", 47)(36, "table")(37, "thead")(38, "tr")(39, "th");
    i0.ɵɵtext(40, "Name");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "th");
    i0.ɵɵtext(42, "Event Type");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "th");
    i0.ɵɵtext(44, "Milestone");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "th");
    i0.ɵɵtext(46, "Amount");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(47, "th");
    i0.ɵɵtext(48, "Updated");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(49, "th");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(50, "tbody");
    i0.ɵɵrepeaterCreate(51, SettingsComponent_Conditional_18_Conditional_1_Conditional_5_For_52_Template, 15, 4, "tr", null, _forTrack1);
    i0.ɵɵconditionalCreate(53, SettingsComponent_Conditional_18_Conditional_1_Conditional_5_Conditional_53_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("formGroup", ctx_r2.paymentTemplateForm);
    i0.ɵɵadvance(27);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates["payment-schedules"].saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates["payment-schedules"].saving ? "Saving..." : "Save Template", " ");
    i0.ɵɵadvance(17);
    i0.ɵɵrepeater(ctx_r2.paymentScheduleTemplates);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.paymentScheduleTemplates.length === 0 ? 53 : -1);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_6_For_34_Template(rf, ctx) { if (rf & 1) {
    const _r33 = i0.ɵɵgetCurrentView();
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
    i0.ɵɵpipe(9, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "td")(11, "button", 103);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_6_For_34_Template_button_click_11_listener() { const doc_r34 = i0.ɵɵrestoreView(_r33).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.deleteTermsDocument(doc_r34.id)); });
    i0.ɵɵtext(12, "Delete");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const doc_r34 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(doc_r34.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(doc_r34.version);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(doc_r34.eventType);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(9, 4, doc_r34.updatedAtUtc, "dd/MM/yyyy HH:mm"));
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_6_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 107);
    i0.ɵɵtext(2, "No terms documents yet.");
    i0.ɵɵelementEnd()();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r32 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 13)(1, "header", 45)(2, "h3");
    i0.ɵɵtext(3, "Terms & Conditions");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "p", 95);
    i0.ɵɵtext(5, "Terms are stored per venue with version history for proposal and contract use.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "form", 48);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_6_Template_form_ngSubmit_6_listener() { i0.ɵɵrestoreView(_r32); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.saveTermsDocument()); });
    i0.ɵɵelementStart(7, "label");
    i0.ɵɵtext(8, " Terms Title ");
    i0.ɵɵelement(9, "input", 105);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "label");
    i0.ɵɵtext(11, " Event Type ");
    i0.ɵɵelement(12, "input", 90);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "label", 40);
    i0.ɵɵtext(14, " Terms Content ");
    i0.ɵɵelement(15, "textarea", 106);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 43)(17, "button", 44);
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(19, "div", 47)(20, "table")(21, "thead")(22, "tr")(23, "th");
    i0.ɵɵtext(24, "Title");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "th");
    i0.ɵɵtext(26, "Version");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "th");
    i0.ɵɵtext(28, "Event Type");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "th");
    i0.ɵɵtext(30, "Updated");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(31, "th");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(32, "tbody");
    i0.ɵɵrepeaterCreate(33, SettingsComponent_Conditional_18_Conditional_1_Conditional_6_For_34_Template, 13, 7, "tr", null, _forTrack1);
    i0.ɵɵconditionalCreate(35, SettingsComponent_Conditional_18_Conditional_1_Conditional_6_Conditional_35_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("formGroup", ctx_r2.termsForm);
    i0.ɵɵadvance(11);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates.terms.saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates.terms.saving ? "Saving..." : "Save Terms Version", " ");
    i0.ɵɵadvance(15);
    i0.ɵɵrepeater(ctx_r2.termsDocuments);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.termsDocuments.length === 0 ? 35 : -1);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_7_For_70_Template(rf, ctx) { if (rf & 1) {
    const _r36 = i0.ɵɵgetCurrentView();
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
    i0.ɵɵelementStart(9, "td")(10, "button", 103);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_7_For_70_Template_button_click_10_listener() { const template_r37 = i0.ɵɵrestoreView(_r36).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.deleteProposalTemplate(template_r37.key)); });
    i0.ɵɵtext(11, "Delete");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const template_r37 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(template_r37.key);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(template_r37.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(template_r37.eventType);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", template_r37.defaultValidityDays, " days");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_7_Conditional_71_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 107);
    i0.ɵɵtext(2, "No proposal templates configured yet.");
    i0.ɵɵelementEnd()();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    const _r35 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 13)(1, "header", 45)(2, "h3");
    i0.ɵɵtext(3, "Proposal Templates");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "form", 48);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_7_Template_form_ngSubmit_4_listener() { i0.ɵɵrestoreView(_r35); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.saveProposalTemplate()); });
    i0.ɵɵelementStart(5, "label");
    i0.ɵɵtext(6, " Template Key ");
    i0.ɵɵelement(7, "input", 108);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "label");
    i0.ɵɵtext(9, " Label ");
    i0.ɵɵelement(10, "input", 109);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "label");
    i0.ɵɵtext(12, " Event Type ");
    i0.ɵɵelement(13, "input", 90);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "label");
    i0.ɵɵtext(15, " Validity Days ");
    i0.ɵɵelement(16, "input", 110);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "label");
    i0.ɵɵtext(18, " Default Terms Version ");
    i0.ɵɵelement(19, "input", 111);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "label", 40);
    i0.ɵɵtext(21, " Introduction ");
    i0.ɵɵelement(22, "textarea", 112);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "section", 113)(24, "header")(25, "h4");
    i0.ɵɵtext(26, "Default Line Item");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(27, "div", 114)(28, "label");
    i0.ɵɵtext(29, " Category ");
    i0.ɵɵelement(30, "input", 115);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "label");
    i0.ɵɵtext(32, " Description ");
    i0.ɵɵelement(33, "input", 116);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "label");
    i0.ɵɵtext(35, " Quantity ");
    i0.ɵɵelement(36, "input", 117);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "label");
    i0.ɵɵtext(38, " Unit ");
    i0.ɵɵelement(39, "input", 118);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "label");
    i0.ɵɵtext(41, " Unit Price (ex VAT) ");
    i0.ɵɵelement(42, "input", 119);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "label");
    i0.ɵɵtext(44, " VAT Rate (%) ");
    i0.ɵɵelement(45, "input", 120);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "label");
    i0.ɵɵtext(47, " Discount (%) ");
    i0.ɵɵelement(48, "input", 121);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "label");
    i0.ɵɵtext(50, " Discount Amount ");
    i0.ɵɵelement(51, "input", 122);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(52, "div", 43)(53, "button", 44);
    i0.ɵɵtext(54);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(55, "div", 47)(56, "table")(57, "thead")(58, "tr")(59, "th");
    i0.ɵɵtext(60, "Key");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(61, "th");
    i0.ɵɵtext(62, "Label");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(63, "th");
    i0.ɵɵtext(64, "Event Type");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(65, "th");
    i0.ɵɵtext(66, "Validity");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(67, "th");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(68, "tbody");
    i0.ɵɵrepeaterCreate(69, SettingsComponent_Conditional_18_Conditional_1_Conditional_7_For_70_Template, 12, 4, "tr", null, _forTrack0);
    i0.ɵɵconditionalCreate(71, SettingsComponent_Conditional_18_Conditional_1_Conditional_7_Conditional_71_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("formGroup", ctx_r2.proposalTemplateForm);
    i0.ɵɵadvance(49);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates["proposal-templates"].saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates["proposal-templates"].saving ? "Saving..." : "Save Template", " ");
    i0.ɵɵadvance(15);
    i0.ɵɵrepeater(ctx_r2.proposalTemplates);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.proposalTemplates.length === 0 ? 71 : -1);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_8_For_31_Template(rf, ctx) { if (rf & 1) {
    const _r39 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td")(8, "button", 103);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_8_For_31_Template_button_click_8_listener() { const milestone_r40 = i0.ɵɵrestoreView(_r39).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.deletePlanningMilestone(milestone_r40.key)); });
    i0.ɵɵtext(9, "Delete");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const milestone_r40 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(milestone_r40.key);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(milestone_r40.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(milestone_r40.isEnabled ? "Yes" : "No");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_8_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 69);
    i0.ɵɵtext(2, "No planning milestones configured yet.");
    i0.ɵɵelementEnd()();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    const _r38 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 13)(1, "header", 45)(2, "h3");
    i0.ɵɵtext(3, "Planning Milestones");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "form", 48);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_8_Template_form_ngSubmit_4_listener() { i0.ɵɵrestoreView(_r38); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.savePlanningMilestone()); });
    i0.ɵɵelementStart(5, "label");
    i0.ɵɵtext(6, " Key ");
    i0.ɵɵelement(7, "input", 123);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "label");
    i0.ɵɵtext(9, " Label ");
    i0.ɵɵelement(10, "input", 124);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "label", 125);
    i0.ɵɵelement(12, "input", 126);
    i0.ɵɵelementStart(13, "span");
    i0.ɵɵtext(14, "Enabled");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 43)(16, "button", 44);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(18, "div", 47)(19, "table")(20, "thead")(21, "tr")(22, "th");
    i0.ɵɵtext(23, "Key");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "th");
    i0.ɵɵtext(25, "Label");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "th");
    i0.ɵɵtext(27, "Enabled");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(28, "th");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(29, "tbody");
    i0.ɵɵrepeaterCreate(30, SettingsComponent_Conditional_18_Conditional_1_Conditional_8_For_31_Template, 10, 3, "tr", null, _forTrack0);
    i0.ɵɵconditionalCreate(32, SettingsComponent_Conditional_18_Conditional_1_Conditional_8_Conditional_32_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("formGroup", ctx_r2.planningMilestoneForm);
    i0.ɵɵadvance(12);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates["planning-milestones"].saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates["planning-milestones"].saving ? "Saving..." : "Add Milestone", " ");
    i0.ɵɵadvance(13);
    i0.ɵɵrepeater(ctx_r2.planningMilestones);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.planningMilestones.length === 0 ? 32 : -1);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r41 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 13)(1, "header", 45)(2, "h3");
    i0.ɵɵtext(3, "Report Conversion Weights");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "form", 48);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_9_Template_form_ngSubmit_4_listener() { i0.ɵɵrestoreView(_r41); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.saveReportConfiguration()); });
    i0.ɵɵelementStart(5, "label");
    i0.ɵɵtext(6, " Provisional Weight (%) ");
    i0.ɵɵelement(7, "input", 127);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "label");
    i0.ɵɵtext(9, " Tentative Weight (%) ");
    i0.ɵɵelement(10, "input", 128);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "label");
    i0.ɵɵtext(12, " Open Proposal Weight (%) ");
    i0.ɵɵelement(13, "input", 129);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "div", 43)(15, "button", 44);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("formGroup", ctx_r2.reportConfigurationForm);
    i0.ɵɵadvance(11);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates["report-configuration"].saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates["report-configuration"].saving ? "Saving..." : "Save Report Configuration", " ");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_10_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 38);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const status_r43 = ctx.$implicit;
    i0.ɵɵproperty("value", status_r43);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(status_r43);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r42 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 13)(1, "header", 45)(2, "h3");
    i0.ɵɵtext(3, "Automation Settings");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "form", 48);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_10_Template_form_ngSubmit_4_listener() { i0.ɵɵrestoreView(_r42); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.saveAutomationSettings()); });
    i0.ɵɵelementStart(5, "label");
    i0.ɵɵtext(6, " Proposal Accepted Target Status ");
    i0.ɵɵelementStart(7, "select", 130);
    i0.ɵɵrepeaterCreate(8, SettingsComponent_Conditional_18_Conditional_1_Conditional_10_For_9_Template, 2, 2, "option", 38, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "label");
    i0.ɵɵtext(11, " Follow-up Inactive Days ");
    i0.ɵɵelement(12, "input", 131);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "label");
    i0.ɵɵtext(14, " Auto-Archive Days ");
    i0.ɵɵelement(15, "input", 132);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "label", 125);
    i0.ɵɵelement(17, "input", 133);
    i0.ɵɵelementStart(18, "span");
    i0.ɵɵtext(19, "Enable Auto-Archive");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "div", 43)(21, "button", 44);
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("formGroup", ctx_r2.automationSettingsForm);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r2.proposalAcceptedStatuses);
    i0.ɵɵadvance(13);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates.automation.saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates.automation.saving ? "Saving..." : "Save Automation Settings", " ");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_11_For_39_Template(rf, ctx) { if (rf & 1) {
    const _r45 = i0.ɵɵgetCurrentView();
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
    i0.ɵɵelementStart(9, "td")(10, "button", 103);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_11_For_39_Template_button_click_10_listener() { const template_r46 = i0.ɵɵrestoreView(_r45).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.deleteEmailTemplate(template_r46.key)); });
    i0.ɵɵtext(11, "Delete");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const template_r46 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(template_r46.key);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(template_r46.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(template_r46.subjectTemplate);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(template_r46.isActive ? "Yes" : "No");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_11_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 107);
    i0.ɵɵtext(2, "No email templates configured yet.");
    i0.ɵɵelementEnd()();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    const _r44 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 13)(1, "header", 45)(2, "h3");
    i0.ɵɵtext(3, "Email Templates");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "form", 48);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_11_Template_form_ngSubmit_4_listener() { i0.ɵɵrestoreView(_r44); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.saveEmailTemplate()); });
    i0.ɵɵelementStart(5, "label");
    i0.ɵɵtext(6, " Template Key ");
    i0.ɵɵelement(7, "input", 134);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "label");
    i0.ɵɵtext(9, " Template Name ");
    i0.ɵɵelement(10, "input", 135);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "label", 40);
    i0.ɵɵtext(12, " Subject Template ");
    i0.ɵɵelement(13, "input", 136);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "label", 40);
    i0.ɵɵtext(15, " HTML Body Template ");
    i0.ɵɵelement(16, "textarea", 137);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "label", 125);
    i0.ɵɵelement(18, "input", 56);
    i0.ɵɵelementStart(19, "span");
    i0.ɵɵtext(20, "Active");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 43)(22, "button", 44);
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(24, "div", 47)(25, "table")(26, "thead")(27, "tr")(28, "th");
    i0.ɵɵtext(29, "Key");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "th");
    i0.ɵɵtext(31, "Name");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "th");
    i0.ɵɵtext(33, "Subject");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "th");
    i0.ɵɵtext(35, "Active");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(36, "th");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(37, "tbody");
    i0.ɵɵrepeaterCreate(38, SettingsComponent_Conditional_18_Conditional_1_Conditional_11_For_39_Template, 12, 4, "tr", null, _forTrack0);
    i0.ɵɵconditionalCreate(40, SettingsComponent_Conditional_18_Conditional_1_Conditional_11_Conditional_40_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("formGroup", ctx_r2.emailTemplateForm);
    i0.ɵɵadvance(18);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates["email-templates"].saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates["email-templates"].saving ? "Saving..." : "Save Template", " ");
    i0.ɵɵadvance(15);
    i0.ɵɵrepeater(ctx_r2.emailTemplates);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.emailTemplates.length === 0 ? 40 : -1);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_12_For_46_Template(rf, ctx) { if (rf & 1) {
    const _r48 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td")(8, "button", 68);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_12_For_46_Template_button_click_8_listener() { const form_r49 = i0.ɵɵrestoreView(_r48).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.editWebsiteForm(form_r49)); });
    i0.ɵɵtext(9, "Edit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "button", 103);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_12_For_46_Template_button_click_10_listener() { const form_r49 = i0.ɵɵrestoreView(_r48).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.deleteWebsiteForm(form_r49.id)); });
    i0.ɵɵtext(11, "Delete");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const form_r49 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(form_r49.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(form_r49.slug);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(form_r49.isActive ? "Yes" : "No");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_12_Conditional_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 69);
    i0.ɵɵtext(2, "No website forms configured yet.");
    i0.ɵɵelementEnd()();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    const _r47 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 13)(1, "header", 45)(2, "h3");
    i0.ɵɵtext(3, "Website Forms");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "form", 48);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_12_Template_form_ngSubmit_4_listener() { i0.ɵɵrestoreView(_r47); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.saveWebsiteForm()); });
    i0.ɵɵelementStart(5, "label");
    i0.ɵɵtext(6, " Form Name ");
    i0.ɵɵelement(7, "input", 138);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "label");
    i0.ɵɵtext(9, " Slug ");
    i0.ɵɵelement(10, "input", 139);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "label", 40);
    i0.ɵɵtext(12, " Success Message ");
    i0.ɵɵelement(13, "input", 140);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "label");
    i0.ɵɵtext(15, " Redirect URL ");
    i0.ɵɵelement(16, "input", 141);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "label");
    i0.ɵɵtext(18, " Required Fields (CSV) ");
    i0.ɵɵelement(19, "input", 142);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "label", 40);
    i0.ɵɵtext(21, " Optional Fields (CSV) ");
    i0.ɵɵelement(22, "input", 143);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "label", 40);
    i0.ɵɵtext(24, " Style JSON ");
    i0.ɵɵelement(25, "textarea", 144);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "label", 125);
    i0.ɵɵelement(27, "input", 56);
    i0.ɵɵelementStart(28, "span");
    i0.ɵɵtext(29, "Active");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(30, "div", 43)(31, "button", 44);
    i0.ɵɵtext(32);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(33, "div", 47)(34, "table")(35, "thead")(36, "tr")(37, "th");
    i0.ɵɵtext(38, "Name");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "th");
    i0.ɵɵtext(40, "Slug");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "th");
    i0.ɵɵtext(42, "Active");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(43, "th");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(44, "tbody");
    i0.ɵɵrepeaterCreate(45, SettingsComponent_Conditional_18_Conditional_1_Conditional_12_For_46_Template, 12, 3, "tr", null, _forTrack1);
    i0.ɵɵconditionalCreate(47, SettingsComponent_Conditional_18_Conditional_1_Conditional_12_Conditional_47_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("formGroup", ctx_r2.websiteFormForm);
    i0.ɵɵadvance(27);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates["website-forms"].saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates["website-forms"].saving ? "Saving..." : "Save Website Form", " ");
    i0.ɵɵadvance(13);
    i0.ɵɵrepeater(ctx_r2.websiteForms);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.websiteForms.length === 0 ? 47 : -1);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_13_For_41_Template(rf, ctx) { if (rf & 1) {
    const _r51 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td")(8, "button", 68);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_13_For_41_Template_button_click_8_listener() { const account_r52 = i0.ɵɵrestoreView(_r51).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.editCalendarAccount(account_r52)); });
    i0.ɵɵtext(9, "Edit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "button", 103);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_13_For_41_Template_button_click_10_listener() { const account_r52 = i0.ɵɵrestoreView(_r51).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.deleteCalendarAccount(account_r52.id)); });
    i0.ɵɵtext(11, "Delete");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const account_r52 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(account_r52.address);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(account_r52.provider);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(account_r52.connectionStatus);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_13_Conditional_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 69);
    i0.ɵɵtext(2, "No calendar accounts configured yet.");
    i0.ɵɵelementEnd()();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    const _r50 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 13)(1, "header", 45)(2, "h3");
    i0.ɵɵtext(3, "Calendar Accounts");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "form", 48);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_13_Template_form_ngSubmit_4_listener() { i0.ɵɵrestoreView(_r50); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.saveCalendarAccount()); });
    i0.ɵɵelementStart(5, "label");
    i0.ɵɵtext(6, " Account Address ");
    i0.ɵɵelement(7, "input", 145);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "label");
    i0.ɵɵtext(9, " Provider ");
    i0.ɵɵelement(10, "input", 146);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "label");
    i0.ɵɵtext(12, " External Calendar ID ");
    i0.ɵɵelement(13, "input", 147);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "label");
    i0.ɵɵtext(15, " Connection Status ");
    i0.ɵɵelement(16, "input", 148);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "label", 125);
    i0.ɵɵelement(18, "input", 56);
    i0.ɵɵelementStart(19, "span");
    i0.ɵɵtext(20, "Active");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "label", 125);
    i0.ɵɵelement(22, "input", 149);
    i0.ɵɵelementStart(23, "span");
    i0.ɵɵtext(24, "Sync provisional holds");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(25, "div", 43)(26, "button", 44);
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(28, "div", 47)(29, "table")(30, "thead")(31, "tr")(32, "th");
    i0.ɵɵtext(33, "Address");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "th");
    i0.ɵɵtext(35, "Provider");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "th");
    i0.ɵɵtext(37, "Status");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(38, "th");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(39, "tbody");
    i0.ɵɵrepeaterCreate(40, SettingsComponent_Conditional_18_Conditional_1_Conditional_13_For_41_Template, 12, 3, "tr", null, _forTrack1);
    i0.ɵɵconditionalCreate(42, SettingsComponent_Conditional_18_Conditional_1_Conditional_13_Conditional_42_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("formGroup", ctx_r2.calendarAccountForm);
    i0.ɵɵadvance(22);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates["calendar-accounts"].saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates["calendar-accounts"].saving ? "Saving..." : "Save Calendar Account", " ");
    i0.ɵɵadvance(13);
    i0.ɵɵrepeater(ctx_r2.calendarAccounts);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.calendarAccounts.length === 0 ? 42 : -1);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_14_For_49_Template(rf, ctx) { if (rf & 1) {
    const _r54 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td")(8, "button", 68);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_14_For_49_Template_button_click_8_listener() { const template_r55 = i0.ɵɵrestoreView(_r54).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.editTaskTemplate(template_r55)); });
    i0.ɵɵtext(9, "Edit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "button", 103);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_14_For_49_Template_button_click_10_listener() { const template_r55 = i0.ɵɵrestoreView(_r54).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.deleteTaskTemplate(template_r55.id)); });
    i0.ɵɵtext(11, "Delete");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const template_r55 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(template_r55.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(template_r55.eventType);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(template_r55.triggerStatus);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_14_Conditional_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 69);
    i0.ɵɵtext(2, "No task templates configured yet.");
    i0.ɵɵelementEnd()();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    const _r53 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 13)(1, "header", 45)(2, "h3");
    i0.ɵɵtext(3, "Task Templates");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "form", 48);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_14_Template_form_ngSubmit_4_listener() { i0.ɵɵrestoreView(_r53); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.saveTaskTemplate()); });
    i0.ɵɵelementStart(5, "label");
    i0.ɵɵtext(6, " Template Name ");
    i0.ɵɵelement(7, "input", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "label");
    i0.ɵɵtext(9, " Event Type ");
    i0.ɵɵelement(10, "input", 90);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "label");
    i0.ɵɵtext(12, " Trigger Status ");
    i0.ɵɵelement(13, "input", 150);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "label");
    i0.ɵɵtext(15, " Task Title ");
    i0.ɵɵelement(16, "input", 151);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "label");
    i0.ɵɵtext(18, " Priority ");
    i0.ɵɵelement(19, "input", 152);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "label");
    i0.ɵɵtext(21, " Due Rule ");
    i0.ɵɵelement(22, "input", 153);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "label");
    i0.ɵɵtext(24, " Due Offset Days ");
    i0.ɵɵelement(25, "input", 154);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "label", 40);
    i0.ɵɵtext(27, " Description ");
    i0.ɵɵelement(28, "textarea", 155);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "label", 125);
    i0.ɵɵelement(30, "input", 156);
    i0.ɵɵelementStart(31, "span");
    i0.ɵɵtext(32, "Assign to event manager");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(33, "div", 43)(34, "button", 44);
    i0.ɵɵtext(35);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(36, "div", 47)(37, "table")(38, "thead")(39, "tr")(40, "th");
    i0.ɵɵtext(41, "Name");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "th");
    i0.ɵɵtext(43, "Event Type");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "th");
    i0.ɵɵtext(45, "Trigger");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(46, "th");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(47, "tbody");
    i0.ɵɵrepeaterCreate(48, SettingsComponent_Conditional_18_Conditional_1_Conditional_14_For_49_Template, 12, 3, "tr", null, _forTrack1);
    i0.ɵɵconditionalCreate(50, SettingsComponent_Conditional_18_Conditional_1_Conditional_14_Conditional_50_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("formGroup", ctx_r2.taskTemplateForm);
    i0.ɵɵadvance(30);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates["task-templates"].saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates["task-templates"].saving ? "Saving..." : "Save Task Template", " ");
    i0.ɵɵadvance(13);
    i0.ɵɵrepeater(ctx_r2.taskTemplates);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.taskTemplates.length === 0 ? 50 : -1);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_15_For_45_Template(rf, ctx) { if (rf & 1) {
    const _r57 = i0.ɵɵgetCurrentView();
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
    i0.ɵɵelementStart(9, "td")(10, "button", 68);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_15_For_45_Template_button_click_10_listener() { const schedule_r58 = i0.ɵɵrestoreView(_r57).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.editReportSchedule(schedule_r58)); });
    i0.ɵɵtext(11, "Edit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "button", 103);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_15_For_45_Template_button_click_12_listener() { const schedule_r58 = i0.ɵɵrestoreView(_r57).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.deleteReportScheduleItem(schedule_r58.id)); });
    i0.ɵɵtext(13, "Delete");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const schedule_r58 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(schedule_r58.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(schedule_r58.reportKey);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(schedule_r58.frequency);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(schedule_r58.isActive ? "Yes" : "No");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_15_Conditional_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 107);
    i0.ɵɵtext(2, "No report schedules configured yet.");
    i0.ɵɵelementEnd()();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    const _r56 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 13)(1, "header", 45)(2, "h3");
    i0.ɵɵtext(3, "Report Schedules");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "form", 48);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_15_Template_form_ngSubmit_4_listener() { i0.ɵɵrestoreView(_r56); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.saveReportSchedule()); });
    i0.ɵɵelementStart(5, "label");
    i0.ɵɵtext(6, " Name ");
    i0.ɵɵelement(7, "input", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "label");
    i0.ɵɵtext(9, " Report Key ");
    i0.ɵɵelement(10, "input", 157);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "label");
    i0.ɵɵtext(12, " Frequency ");
    i0.ɵɵelement(13, "input", 158);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "label", 40);
    i0.ɵɵtext(15, " Recipients (CSV) ");
    i0.ɵɵelement(16, "input", 159);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "label");
    i0.ɵɵtext(18, " Next Run UTC ");
    i0.ɵɵelement(19, "input", 160);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "label", 125);
    i0.ɵɵelement(21, "input", 56);
    i0.ɵɵelementStart(22, "span");
    i0.ɵɵtext(23, "Active");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "label", 40);
    i0.ɵɵtext(25, " Filters JSON ");
    i0.ɵɵelement(26, "textarea", 161);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "div", 43)(28, "button", 44);
    i0.ɵɵtext(29);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(30, "div", 47)(31, "table")(32, "thead")(33, "tr")(34, "th");
    i0.ɵɵtext(35, "Name");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "th");
    i0.ɵɵtext(37, "Report");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "th");
    i0.ɵɵtext(39, "Frequency");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "th");
    i0.ɵɵtext(41, "Active");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(42, "th");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(43, "tbody");
    i0.ɵɵrepeaterCreate(44, SettingsComponent_Conditional_18_Conditional_1_Conditional_15_For_45_Template, 14, 4, "tr", null, _forTrack1);
    i0.ɵɵconditionalCreate(46, SettingsComponent_Conditional_18_Conditional_1_Conditional_15_Conditional_46_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("formGroup", ctx_r2.reportScheduleForm);
    i0.ɵɵadvance(24);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates["report-schedules"].saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates["report-schedules"].saving ? "Saving..." : "Save Report Schedule", " ");
    i0.ɵɵadvance(15);
    i0.ɵɵrepeater(ctx_r2.reportSchedules);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.reportSchedules.length === 0 ? 46 : -1);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_16_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Nylas integration is configured. Connect Google or Microsoft inboxes for this venue. ");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_16_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Nylas integration is not configured on the API yet. Set Nylas keys in server appsettings before connecting. ");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_16_For_25_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    const _r62 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 167);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_16_For_25_Conditional_12_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r62); const account_r61 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.disconnectNylas(account_r61)); });
    i0.ɵɵtext(1, "Disconnect");
    i0.ɵɵelementEnd();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_16_For_25_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    const _r63 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 68);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_16_For_25_Conditional_13_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r63); const account_r61 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.connectNylas(account_r61.address)); });
    i0.ɵɵtext(1, "Reconnect");
    i0.ɵɵelementEnd();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_16_For_25_Template(rf, ctx) { if (rf & 1) {
    const _r60 = i0.ɵɵgetCurrentView();
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
    i0.ɵɵelementStart(9, "td")(10, "button", 68);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_16_For_25_Template_button_click_10_listener() { const account_r61 = i0.ɵɵrestoreView(_r60).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.editEmailAccount(account_r61)); });
    i0.ɵɵtext(11, "Edit");
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(12, SettingsComponent_Conditional_18_Conditional_1_Conditional_16_For_25_Conditional_12_Template, 2, 0, "button", 165)(13, SettingsComponent_Conditional_18_Conditional_1_Conditional_16_For_25_Conditional_13_Template, 2, 0, "button", 166);
    i0.ɵɵelementStart(14, "button", 103);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_16_For_25_Template_button_click_14_listener() { const account_r61 = i0.ɵɵrestoreView(_r60).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.deleteEmailAccount(account_r61.id)); });
    i0.ɵɵtext(15, "Delete");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const account_r61 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(account_r61.address);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(account_r61.provider);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(account_r61.connectionStatus);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(account_r61.useForOutbound ? "Yes" : "No");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(account_r61.provider === "Nylas" && account_r61.connectionStatus !== "disconnected" ? 12 : account_r61.provider === "Nylas" ? 13 : -1);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_16_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 107);
    i0.ɵɵtext(2, "No email accounts configured yet.");
    i0.ɵɵelementEnd()();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    const _r59 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 14)(1, "article", 13)(2, "header", 45)(3, "h3");
    i0.ɵɵtext(4, "Connected Email Accounts");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 88);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_16_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r59); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.connectNylas()); });
    i0.ɵɵtext(6, " Connect with Nylas ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "p", 162);
    i0.ɵɵconditionalCreate(8, SettingsComponent_Conditional_18_Conditional_1_Conditional_16_Conditional_8_Template, 1, 0)(9, SettingsComponent_Conditional_18_Conditional_1_Conditional_16_Conditional_9_Template, 1, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 47)(11, "table")(12, "thead")(13, "tr")(14, "th");
    i0.ɵɵtext(15, "Address");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "th");
    i0.ɵɵtext(17, "Provider");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "th");
    i0.ɵɵtext(19, "Status");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "th");
    i0.ɵɵtext(21, "Outbound");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(22, "th");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "tbody");
    i0.ɵɵrepeaterCreate(24, SettingsComponent_Conditional_18_Conditional_1_Conditional_16_For_25_Template, 16, 5, "tr", null, _forTrack1);
    i0.ɵɵconditionalCreate(26, SettingsComponent_Conditional_18_Conditional_1_Conditional_16_Conditional_26_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(27, "article", 13)(28, "header", 45)(29, "h3");
    i0.ɵɵtext(30);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "button", 46);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_16_Template_button_click_31_listener() { i0.ɵɵrestoreView(_r59); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.startNewEmailAccount()); });
    i0.ɵɵtext(32, "New");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(33, "form", 48);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_16_Template_form_ngSubmit_33_listener() { i0.ɵɵrestoreView(_r59); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.saveEmailAccount()); });
    i0.ɵɵelementStart(34, "label");
    i0.ɵɵtext(35, " Address ");
    i0.ɵɵelement(36, "input", 145);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "label");
    i0.ɵɵtext(38, " Provider ");
    i0.ɵɵelement(39, "input", 146);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "label", 40);
    i0.ɵɵtext(41, " External Reference ");
    i0.ɵɵelement(42, "input", 163);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "label", 125);
    i0.ɵɵelement(44, "input", 56);
    i0.ɵɵelementStart(45, "span");
    i0.ɵɵtext(46, "Active");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(47, "label", 125);
    i0.ɵɵelement(48, "input", 164);
    i0.ɵɵelementStart(49, "span");
    i0.ɵɵtext(50, "Use for outbound");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(51, "div", 43)(52, "button", 84);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_16_Template_button_click_52_listener() { i0.ɵɵrestoreView(_r59); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.connectNylasFromForm()); });
    i0.ɵɵtext(53, " Connect Nylas for this address ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(54, "button", 44);
    i0.ɵɵtext(55);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates["email-accounts"].saving || !(ctx_r2.nylasStatus == null ? null : ctx_r2.nylasStatus.isConfigured));
    i0.ɵɵadvance(3);
    i0.ɵɵconditional((ctx_r2.nylasStatus == null ? null : ctx_r2.nylasStatus.isConfigured) ? 8 : 9);
    i0.ɵɵadvance(16);
    i0.ɵɵrepeater(ctx_r2.emailAccounts);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.emailAccounts.length === 0 ? 26 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r2.editingEmailAccountId ? "Edit Email Account" : "Add Email Account");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("formGroup", ctx_r2.emailAccountForm);
    i0.ɵɵadvance(19);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates["email-accounts"].saving || !(ctx_r2.nylasStatus == null ? null : ctx_r2.nylasStatus.isConfigured));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates["email-accounts"].saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates["email-accounts"].saving ? "Saving..." : ctx_r2.editingEmailAccountId ? "Update Account" : "Add Account", " ");
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_17_For_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 38);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const role_r65 = ctx.$implicit;
    i0.ɵɵproperty("value", role_r65);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(role_r65);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_17_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 174);
    i0.ɵɵtext(1, " Dev invite token: ");
    i0.ɵɵelementStart(2, "code");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r2.inviteDebugToken);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_17_For_50_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r66 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 103);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_17_For_50_Conditional_10_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r66); const user_r67 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.toggleUserActive(user_r67, false)); });
    i0.ɵɵtext(1, "Deactivate");
    i0.ɵɵelementEnd();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_17_For_50_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    const _r68 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 68);
    i0.ɵɵlistener("click", function SettingsComponent_Conditional_18_Conditional_1_Conditional_17_For_50_Conditional_11_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r68); const user_r67 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.toggleUserActive(user_r67, true)); });
    i0.ɵɵtext(1, "Activate");
    i0.ɵɵelementEnd();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_17_For_50_Template(rf, ctx) { if (rf & 1) {
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
    i0.ɵɵelementStart(9, "td");
    i0.ɵɵconditionalCreate(10, SettingsComponent_Conditional_18_Conditional_1_Conditional_17_For_50_Conditional_10_Template, 2, 0, "button", 177)(11, SettingsComponent_Conditional_18_Conditional_1_Conditional_17_For_50_Conditional_11_Template, 2, 0, "button", 166);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const user_r67 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", user_r67.firstName, " ", user_r67.lastName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(user_r67.email);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.getUserRoleForSelectedVenue(user_r67));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(user_r67.isActive ? "Active" : "Inactive");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(user_r67.isActive ? 10 : 11);
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_17_Conditional_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 107);
    i0.ɵɵtext(2, "No users assigned to this venue.");
    i0.ɵɵelementEnd()();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_17_For_58_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li")(1, "div")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "small");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "span");
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "date");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const entry_r69 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(entry_r69.actionType);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", entry_r69.entityType, " \u00B7 ", entry_r69.entityId);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(8, 4, entry_r69.createdAtUtc, "dd/MM/yyyy HH:mm"));
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_17_Conditional_59_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 176);
    i0.ɵɵtext(1, "No recent activity available.");
    i0.ɵɵelementEnd();
} }
function SettingsComponent_Conditional_18_Conditional_1_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    const _r64 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 168)(1, "article", 13)(2, "header", 45)(3, "h3");
    i0.ɵɵtext(4, "Invite User");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "form", 48);
    i0.ɵɵlistener("ngSubmit", function SettingsComponent_Conditional_18_Conditional_1_Conditional_17_Template_form_ngSubmit_5_listener() { i0.ɵɵrestoreView(_r64); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.inviteUser()); });
    i0.ɵɵelementStart(6, "label");
    i0.ɵɵtext(7, " First Name ");
    i0.ɵɵelement(8, "input", 169);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "label");
    i0.ɵɵtext(10, " Last Name ");
    i0.ɵɵelement(11, "input", 170);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "label");
    i0.ɵɵtext(13, " Email ");
    i0.ɵɵelement(14, "input", 171);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "label");
    i0.ɵɵtext(16, " Phone (optional) ");
    i0.ɵɵelement(17, "input", 24);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "label");
    i0.ɵɵtext(19, " Role ");
    i0.ɵɵelementStart(20, "select", 172);
    i0.ɵɵrepeaterCreate(21, SettingsComponent_Conditional_18_Conditional_1_Conditional_17_For_22_Template, 2, 2, "option", 38, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "label", 125);
    i0.ɵɵelement(24, "input", 173);
    i0.ɵɵelementStart(25, "span");
    i0.ɵɵtext(26, "Require TOTP setup");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(27, "div", 43)(28, "button", 44);
    i0.ɵɵtext(29);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(30, SettingsComponent_Conditional_18_Conditional_1_Conditional_17_Conditional_30_Template, 4, 1, "p", 174);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(31, "article", 13)(32, "header", 45)(33, "h3");
    i0.ɵɵtext(34, "Users for Selected Venue");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(35, "div", 47)(36, "table")(37, "thead")(38, "tr")(39, "th");
    i0.ɵɵtext(40, "Name");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "th");
    i0.ɵɵtext(42, "Email");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "th");
    i0.ɵɵtext(44, "Role");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "th");
    i0.ɵɵtext(46, "Status");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(47, "th");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(48, "tbody");
    i0.ɵɵrepeaterCreate(49, SettingsComponent_Conditional_18_Conditional_1_Conditional_17_For_50_Template, 12, 6, "tr", null, _forTrack1);
    i0.ɵɵconditionalCreate(51, SettingsComponent_Conditional_18_Conditional_1_Conditional_17_Conditional_51_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(52, "section", 13)(53, "header", 45)(54, "h3");
    i0.ɵɵtext(55, "Recent User Activity");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(56, "ul", 175);
    i0.ɵɵrepeaterCreate(57, SettingsComponent_Conditional_18_Conditional_1_Conditional_17_For_58_Template, 9, 7, "li", null, _forTrack1);
    i0.ɵɵconditionalCreate(59, SettingsComponent_Conditional_18_Conditional_1_Conditional_17_Conditional_59_Template, 2, 0, "li", 176);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("formGroup", ctx_r2.inviteForm);
    i0.ɵɵadvance(16);
    i0.ɵɵrepeater(ctx_r2.roleOptions);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("disabled", ctx_r2.sectionStates.users.saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.sectionStates.users.saving ? "Sending..." : "Send Invitation", " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.inviteDebugToken ? 30 : -1);
    i0.ɵɵadvance(19);
    i0.ɵɵrepeater(ctx_r2.users);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.users.length === 0 ? 51 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(ctx_r2.userActivity);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.userActivity.length === 0 ? 59 : -1);
} }
function SettingsComponent_Conditional_18_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, SettingsComponent_Conditional_18_Conditional_1_Conditional_0_Template, 2, 1, "p", 10);
    i0.ɵɵconditionalCreate(1, SettingsComponent_Conditional_18_Conditional_1_Conditional_1_Template, 2, 1, "p", 11);
    i0.ɵɵconditionalCreate(2, SettingsComponent_Conditional_18_Conditional_1_Conditional_2_Template, 81, 3, "form", 12);
    i0.ɵɵconditionalCreate(3, SettingsComponent_Conditional_18_Conditional_1_Conditional_3_Template, 133, 10);
    i0.ɵɵconditionalCreate(4, SettingsComponent_Conditional_18_Conditional_1_Conditional_4_Template, 24, 3, "section", 13);
    i0.ɵɵconditionalCreate(5, SettingsComponent_Conditional_18_Conditional_1_Conditional_5_Template, 54, 4, "section", 13);
    i0.ɵɵconditionalCreate(6, SettingsComponent_Conditional_18_Conditional_1_Conditional_6_Template, 36, 4, "section", 13);
    i0.ɵɵconditionalCreate(7, SettingsComponent_Conditional_18_Conditional_1_Conditional_7_Template, 72, 4, "section", 13);
    i0.ɵɵconditionalCreate(8, SettingsComponent_Conditional_18_Conditional_1_Conditional_8_Template, 33, 4, "section", 13);
    i0.ɵɵconditionalCreate(9, SettingsComponent_Conditional_18_Conditional_1_Conditional_9_Template, 17, 3, "section", 13);
    i0.ɵɵconditionalCreate(10, SettingsComponent_Conditional_18_Conditional_1_Conditional_10_Template, 23, 3, "section", 13);
    i0.ɵɵconditionalCreate(11, SettingsComponent_Conditional_18_Conditional_1_Conditional_11_Template, 41, 4, "section", 13);
    i0.ɵɵconditionalCreate(12, SettingsComponent_Conditional_18_Conditional_1_Conditional_12_Template, 48, 4, "section", 13);
    i0.ɵɵconditionalCreate(13, SettingsComponent_Conditional_18_Conditional_1_Conditional_13_Template, 43, 4, "section", 13);
    i0.ɵɵconditionalCreate(14, SettingsComponent_Conditional_18_Conditional_1_Conditional_14_Template, 51, 4, "section", 13);
    i0.ɵɵconditionalCreate(15, SettingsComponent_Conditional_18_Conditional_1_Conditional_15_Template, 47, 4, "section", 13);
    i0.ɵɵconditionalCreate(16, SettingsComponent_Conditional_18_Conditional_1_Conditional_16_Template, 56, 8, "section", 14);
    i0.ɵɵconditionalCreate(17, SettingsComponent_Conditional_18_Conditional_1_Conditional_17_Template, 60, 6);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(ctx_r2.sectionStates[ctx_r2.activeSectionKey].error ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.sectionStates[ctx_r2.activeSectionKey].success ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "venue-profile" ? 2 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "spaces" ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "budgets" ? 4 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "payment-schedules" ? 5 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "terms" ? 6 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "proposal-templates" ? 7 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "planning-milestones" ? 8 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "report-configuration" ? 9 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "automation" ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "email-templates" ? 11 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "website-forms" ? 12 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "calendar-accounts" ? 13 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "task-templates" ? 14 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "report-schedules" ? 15 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "email-accounts" ? 16 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeSectionKey === "users" ? 17 : -1);
} }
function SettingsComponent_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, SettingsComponent_Conditional_18_Conditional_0_Template, 3, 1, "article", 9)(1, SettingsComponent_Conditional_18_Conditional_1_Template, 18, 18);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r2.sectionStates[ctx_r2.activeSectionKey].loading ? 0 : 1);
} }
export class SettingsComponent {
    constructor() {
        this.route = inject(ActivatedRoute);
        this.router = inject(Router);
        this.auth = inject(AuthService);
        this.api = inject(ApiService);
        this.formBuilder = inject(FormBuilder);
        this.destroyRef = inject(DestroyRef);
        this.sections = [
            {
                key: 'venue-profile',
                title: 'Venue Profile',
                description: 'Branding, legal details, VAT defaults, locale, and hold settings.'
            },
            {
                key: 'spaces',
                title: 'Spaces & Combinations',
                description: 'Manage spaces, capacities, pricing rules, and linked room combinations.'
            },
            {
                key: 'budgets',
                title: 'Budgets & Targets',
                description: 'Set monthly revenue targets by event type and import annual budgets from CSV.'
            },
            {
                key: 'payment-schedules',
                title: 'Payment Schedules',
                description: 'Configure default milestone templates by event type for future proposals.'
            },
            {
                key: 'terms',
                title: 'Terms & Conditions',
                description: 'Prepare reusable, versioned terms content for proposal and contract workflows.'
            },
            {
                key: 'proposal-templates',
                title: 'Proposal Templates',
                description: 'Configure reusable proposal templates by event type with default pricing and copy.'
            },
            {
                key: 'planning-milestones',
                title: 'Planning Milestones',
                description: 'Define planning progress checkpoints used on event cards and payment views.'
            },
            {
                key: 'report-configuration',
                title: 'Report Configuration',
                description: 'Set pace/forecast conversion weights used by pipeline and pace reporting.'
            },
            {
                key: 'automation',
                title: 'Automation',
                description: 'Control accepted-proposal status transitions and archive/follow-up automation defaults.'
            },
            {
                key: 'email-templates',
                title: 'Email Templates',
                description: 'Manage venue-branded outbound templates with merge field placeholders.'
            },
            {
                key: 'website-forms',
                title: 'Website Forms',
                description: 'Configure embeddable website enquiry forms, required fields, and style settings.'
            },
            {
                key: 'calendar-accounts',
                title: 'Calendar Accounts',
                description: 'Manage connected calendar accounts and provisional hold sync behaviour.'
            },
            {
                key: 'task-templates',
                title: 'Task Templates',
                description: 'Define status-triggered task templates for operational follow-through.'
            },
            {
                key: 'report-schedules',
                title: 'Report Schedules',
                description: 'Configure automated report delivery cadence and recipients.'
            },
            {
                key: 'email-accounts',
                title: 'Email Accounts',
                description: 'Manage connected venue inboxes used for Connect and outbound communication.'
            },
            {
                key: 'users',
                title: 'Users & Roles',
                description: 'Invite users, manage status, and review user activity for the selected venue.'
            }
        ];
        this.holdAutoReleaseModes = ['NotifyOnly', 'AutoReleaseNotifyOperator', 'AutoReleaseNotifyBoth'];
        this.roleOptions = [
            'GroupAdmin',
            'VenueAdmin',
            'SalesManager',
            'EventsCoordinator',
            'Finance',
            'Operations',
            'ReadOnly'
        ];
        this.defaultEventTypes = ['Wedding', 'Corporate Conference', 'Private Dining', 'Christmas Party', 'Other'];
        this.setupStyles = ['Theatre', 'Banquet', 'Boardroom', 'Cabaret', 'Reception', 'Classroom', 'U-Shape', 'Custom'];
        this.pricingRateTypes = ['PerHour', 'HalfDay', 'FullDay', 'Evening', 'DelegateRate'];
        this.dayOfWeekOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        this.proposalAcceptedStatuses = ['Provisional', 'Confirmed'];
        this.activeSectionKey = 'venue-profile';
        this.selectedVenueId = null;
        this.sectionStates = {
            'venue-profile': { loading: false, saving: false, error: '', success: '' },
            spaces: { loading: false, saving: false, error: '', success: '' },
            budgets: { loading: false, saving: false, error: '', success: '' },
            'payment-schedules': { loading: false, saving: false, error: '', success: '' },
            terms: { loading: false, saving: false, error: '', success: '' },
            'proposal-templates': { loading: false, saving: false, error: '', success: '' },
            'planning-milestones': { loading: false, saving: false, error: '', success: '' },
            'report-configuration': { loading: false, saving: false, error: '', success: '' },
            automation: { loading: false, saving: false, error: '', success: '' },
            'email-templates': { loading: false, saving: false, error: '', success: '' },
            'website-forms': { loading: false, saving: false, error: '', success: '' },
            'calendar-accounts': { loading: false, saving: false, error: '', success: '' },
            'task-templates': { loading: false, saving: false, error: '', success: '' },
            'report-schedules': { loading: false, saving: false, error: '', success: '' },
            'email-accounts': { loading: false, saving: false, error: '', success: '' },
            users: { loading: false, saving: false, error: '', success: '' }
        };
        this.loadedSections = new Set();
        this.venueProfile = null;
        this.spaces = [];
        this.combinations = [];
        this.users = [];
        this.userActivity = [];
        this.budgets = [];
        this.editingSpaceId = null;
        this.editingCombinationId = null;
        this.selectedBudgetMonth = new Date().getMonth() + 1;
        this.selectedBudgetYear = new Date().getFullYear();
        this.selectedBudgetCsvFile = null;
        this.inviteDebugToken = '';
        this.paymentScheduleTemplates = [];
        this.termsDocuments = [];
        this.proposalTemplates = [];
        this.planningMilestones = [];
        this.emailTemplates = [];
        this.websiteForms = [];
        this.calendarAccounts = [];
        this.taskTemplates = [];
        this.reportSchedules = [];
        this.emailAccounts = [];
        this.editingEmailAccountId = null;
        this.nylasStatus = null;
        this.nylasPopup = null;
        this.venueForm = this.formBuilder.group({
            name: ['', Validators.required],
            legalEntityName: [''],
            addressLine1: [''],
            addressLine2: [''],
            city: [''],
            region: [''],
            postcode: [''],
            countryCode: ['GB', Validators.required],
            phoneNumberE164: [''],
            enquiriesEmail: ['', Validators.email],
            websiteUrl: [''],
            vatNumber: [''],
            companyRegistrationNumber: [''],
            logoUrl: [''],
            description: [''],
            cancellationPolicy: [''],
            currencyCode: ['GBP', Validators.required],
            defaultVatRate: [20, [Validators.required, Validators.min(0)]],
            timeZone: ['Europe/London', Validators.required],
            locale: ['en-GB', Validators.required],
            minimumBookingNoticeDays: [0, [Validators.required, Validators.min(0)]],
            defaultHoldPeriodDays: [7, [Validators.required, Validators.min(1)]],
            holdWarningDays: [2, [Validators.required, Validators.min(0)]],
            holdAutoReleaseMode: ['NotifyOnly', Validators.required],
            maxHoldsPerDateAndSpace: [1, [Validators.required, Validators.min(1)]]
        });
        this.spaceForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: [''],
            locationText: [''],
            floorAreaSqm: [null],
            facilitiesCsv: [''],
            minimumSpendAmount: [null],
            minimumSpendCurrencyCode: ['GBP', Validators.required],
            turnaroundMinutes: [60, [Validators.required, Validators.min(0)]],
            isActive: [true],
            capacityBySetup: this.formBuilder.array([]),
            pricing: this.formBuilder.array([])
        });
        this.combinationForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: [''],
            priceAmount: [null],
            currencyCode: ['GBP', Validators.required],
            spaceIds: [[]],
            capacityBySetup: this.formBuilder.array([])
        });
        this.inviteForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phoneNumberE164: [''],
            role: ['EventsCoordinator', Validators.required],
            requiresTotp: [false]
        });
        this.paymentTemplateForm = this.formBuilder.group({
            name: ['', Validators.required],
            eventType: ['Wedding', Validators.required],
            milestoneName: ['Booking Deposit', Validators.required],
            dueDateRule: ['X days after confirmation', Validators.required],
            amountType: ['Percentage', Validators.required],
            amount: [25, [Validators.required, Validators.min(0.01)]],
            acceptedMethodsCsv: ['Online (card), Bank transfer']
        });
        this.termsForm = this.formBuilder.group({
            title: ['', Validators.required],
            eventType: ['Wedding', Validators.required],
            content: ['', [Validators.required, Validators.minLength(40)]]
        });
        this.proposalTemplateForm = this.formBuilder.group({
            key: ['', Validators.required],
            label: ['', Validators.required],
            eventType: ['Wedding', Validators.required],
            defaultValidityDays: [14, [Validators.required, Validators.min(1), Validators.max(365)]],
            defaultIntroduction: [''],
            defaultTermsVersion: ['v1'],
            itemCategory: ['Room Hire', Validators.required],
            itemDescription: ['', Validators.required],
            itemQuantity: [1, [Validators.required, Validators.min(0.01)]],
            itemUnit: ['Flat rate', Validators.required],
            itemUnitPriceExclVat: [0, [Validators.required, Validators.min(0)]],
            itemVatRate: [20, [Validators.required, Validators.min(0)]],
            itemDiscountPercent: [0, [Validators.min(0)]],
            itemDiscountAmount: [0, [Validators.min(0)]]
        });
        this.planningMilestoneForm = this.formBuilder.group({
            key: ['', Validators.required],
            label: ['', Validators.required],
            isEnabled: [true]
        });
        this.reportConfigurationForm = this.formBuilder.group({
            provisionalWeightPercent: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
            tentativeWeightPercent: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
            openProposalWeightPercent: [30, [Validators.required, Validators.min(0), Validators.max(100)]]
        });
        this.automationSettingsForm = this.formBuilder.group({
            proposalAcceptedTargetStatus: ['Provisional', Validators.required],
            followUpInactiveDays: [3, [Validators.required, Validators.min(1), Validators.max(30)]],
            autoArchiveEnabled: [true],
            autoArchiveDays: [90, [Validators.required, Validators.min(7), Validators.max(3650)]]
        });
        this.emailAccountForm = this.formBuilder.group({
            address: ['', [Validators.required, Validators.email]],
            provider: ['Nylas', Validators.required],
            externalAccountReference: [''],
            isActive: [true],
            useForOutbound: [true]
        });
        this.emailTemplateForm = this.formBuilder.group({
            key: ['', Validators.required],
            name: ['', Validators.required],
            subjectTemplate: ['', Validators.required],
            bodyHtmlTemplate: ['', Validators.required],
            isActive: [true]
        });
        this.websiteFormForm = this.formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            slug: ['', Validators.required],
            isActive: [true],
            successMessage: ['Thank you. We have received your enquiry.', Validators.required],
            redirectUrl: [''],
            requiredFieldsCsv: ['firstName,lastName,email,phone,eventDate,guestsExpected,dataConsent', Validators.required],
            optionalFieldsCsv: ['eventStyle,budgetRange,specialRequirements,marketingConsent'],
            styleJson: ['{"primaryColor":"#2563eb","buttonLabel":"Send Enquiry"}']
        });
        this.calendarAccountForm = this.formBuilder.group({
            id: [''],
            address: ['', [Validators.required, Validators.email]],
            provider: ['Nylas', Validators.required],
            externalCalendarId: [''],
            isActive: [true],
            syncProvisionalHolds: [true],
            connectionStatus: ['connected', Validators.required]
        });
        this.taskTemplateForm = this.formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            eventType: ['Wedding', Validators.required],
            triggerStatus: ['Confirmed', Validators.required],
            assignToEventManager: [true],
            itemTitle: ['Follow up', Validators.required],
            itemDescription: [''],
            itemPriority: ['Medium', Validators.required],
            itemDueDateRule: ['days-after-status-change', Validators.required],
            itemDueOffsetDays: [1, [Validators.required, Validators.min(0)]]
        });
        this.reportScheduleForm = this.formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            reportKey: ['pipeline', Validators.required],
            frequency: ['weekly', Validators.required],
            recipientsCsv: ['', Validators.required],
            isActive: [true],
            nextRunAtUtc: [''],
            filtersJson: ['{}']
        });
        this.budgetForms = new Map();
        this.nylasMessageHandler = (event) => this.handleNylasMessage(event);
    }
    get activeSection() {
        return this.sections.find((section) => section.key === this.activeSectionKey) ?? this.sections[0];
    }
    get venueName() {
        const venueId = this.auth.selectedVenueId;
        return this.auth.session?.venueRoles.find((role) => role.venueId === venueId)?.venueName ?? 'Current venue';
    }
    get monthNumbers() {
        return Array.from({ length: 12 }, (_, index) => index + 1);
    }
    get spaceCapacityControls() {
        return this.spaceForm.get('capacityBySetup');
    }
    get spacePricingControls() {
        return this.spaceForm.get('pricing');
    }
    get combinationCapacityControls() {
        return this.combinationForm.get('capacityBySetup');
    }
    get currentBudgetForm() {
        return this.getBudgetForm(this.selectedBudgetMonth);
    }
    ngOnInit() {
        window.addEventListener('message', this.nylasMessageHandler);
        this.destroyRef.onDestroy(() => {
            window.removeEventListener('message', this.nylasMessageHandler);
            if (this.nylasPopup && !this.nylasPopup.closed) {
                this.nylasPopup.close();
            }
            this.nylasPopup = null;
        });
        this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const section = params.get('section');
            if (section && this.sections.some((item) => item.key === section)) {
                this.activeSectionKey = section;
            }
            else {
                this.activeSectionKey = 'venue-profile';
            }
            this.ensureSectionLoaded(this.activeSectionKey);
        });
        this.auth.session$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((session) => {
            const nextVenueId = session?.venueId ?? null;
            if (nextVenueId === this.selectedVenueId) {
                return;
            }
            this.selectedVenueId = nextVenueId;
            this.loadedSections.clear();
            this.resetSectionMessages();
            this.ensureSectionLoaded(this.activeSectionKey);
        });
    }
    setSection(section) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { section },
            queryParamsHandling: 'merge'
        });
    }
    saveVenueProfile() {
        if (!this.selectedVenueId) {
            return;
        }
        if (this.venueForm.invalid) {
            this.venueForm.markAllAsTouched();
            this.setSectionError('venue-profile', 'Complete required fields before saving the venue profile.');
            return;
        }
        const value = this.venueForm.getRawValue();
        const payload = {
            name: this.requiredText(value.name),
            legalEntityName: this.optionalText(value.legalEntityName),
            addressLine1: this.optionalText(value.addressLine1),
            addressLine2: this.optionalText(value.addressLine2),
            city: this.optionalText(value.city),
            region: this.optionalText(value.region),
            postcode: this.optionalText(value.postcode),
            countryCode: this.requiredText(value.countryCode).toUpperCase(),
            phoneNumberE164: this.optionalText(value.phoneNumberE164),
            enquiriesEmail: this.optionalText(value.enquiriesEmail),
            websiteUrl: this.optionalText(value.websiteUrl),
            vatNumber: this.optionalText(value.vatNumber),
            companyRegistrationNumber: this.optionalText(value.companyRegistrationNumber),
            logoUrl: this.optionalText(value.logoUrl),
            description: this.optionalText(value.description),
            cancellationPolicy: this.optionalText(value.cancellationPolicy),
            currencyCode: this.requiredText(value.currencyCode).toUpperCase(),
            defaultVatRate: Number(value.defaultVatRate ?? 20),
            timeZone: this.requiredText(value.timeZone),
            locale: this.requiredText(value.locale),
            minimumBookingNoticeDays: Number(value.minimumBookingNoticeDays ?? 0),
            defaultHoldPeriodDays: Number(value.defaultHoldPeriodDays ?? 7),
            holdWarningDays: Number(value.holdWarningDays ?? 2),
            holdAutoReleaseMode: this.requiredText(value.holdAutoReleaseMode),
            maxHoldsPerDateAndSpace: Number(value.maxHoldsPerDateAndSpace ?? 1)
        };
        this.setSectionSaving('venue-profile', true);
        this.api
            .updateVenueProfile(this.selectedVenueId, payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (profile) => {
                this.venueProfile = profile;
                this.patchVenueForm(profile);
                this.setSectionSuccess('venue-profile', 'Venue profile saved.');
                this.setSectionSaving('venue-profile', false);
            },
            error: (error) => {
                this.setSectionError('venue-profile', this.resolveError(error, 'Unable to save venue profile.'));
                this.setSectionSaving('venue-profile', false);
            }
        });
    }
    startNewSpace() {
        this.editingSpaceId = null;
        this.spaceForm.reset({
            name: '',
            description: '',
            locationText: '',
            floorAreaSqm: null,
            facilitiesCsv: '',
            minimumSpendAmount: null,
            minimumSpendCurrencyCode: this.venueForm.get('currencyCode')?.value ?? 'GBP',
            turnaroundMinutes: 60,
            isActive: true
        });
        this.replaceFormArray(this.spaceCapacityControls, [this.createCapacityGroup(), this.createCapacityGroup({ setupStyle: 'Reception' })]);
        this.replaceFormArray(this.spacePricingControls, [this.createPricingGroup()]);
    }
    editSpace(space) {
        this.editingSpaceId = space.id;
        this.spaceForm.patchValue({
            name: space.name,
            description: space.description ?? '',
            locationText: space.locationText ?? '',
            floorAreaSqm: space.floorAreaSqm ?? null,
            facilitiesCsv: space.facilitiesCsv,
            minimumSpendAmount: space.minimumSpendAmount ?? null,
            minimumSpendCurrencyCode: space.minimumSpendCurrencyCode,
            turnaroundMinutes: space.turnaroundMinutes,
            isActive: space.isActive
        });
        this.replaceFormArray(this.spaceCapacityControls, space.capacityBySetup.length > 0 ? space.capacityBySetup.map((rule) => this.createCapacityGroup(rule)) : [this.createCapacityGroup()]);
        this.replaceFormArray(this.spacePricingControls, space.pricing.length > 0 ? space.pricing.map((rule) => this.createPricingGroup(rule)) : [this.createPricingGroup()]);
    }
    addSpaceCapacityRule() {
        this.spaceCapacityControls.push(this.createCapacityGroup());
    }
    removeSpaceCapacityRule(index) {
        if (this.spaceCapacityControls.length <= 1) {
            return;
        }
        this.spaceCapacityControls.removeAt(index);
    }
    addSpacePricingRule() {
        this.spacePricingControls.push(this.createPricingGroup());
    }
    removeSpacePricingRule(index) {
        if (this.spacePricingControls.length <= 1) {
            return;
        }
        this.spacePricingControls.removeAt(index);
    }
    saveSpace() {
        if (!this.selectedVenueId) {
            return;
        }
        if (this.spaceForm.invalid) {
            this.spaceForm.markAllAsTouched();
            this.setSectionError('spaces', 'Complete required fields for the space before saving.');
            return;
        }
        const payload = this.mapSpacePayload();
        if (!payload.name) {
            this.setSectionError('spaces', 'Space name is required.');
            return;
        }
        this.setSectionSaving('spaces', true);
        const request$ = this.editingSpaceId
            ? this.api.updateVenueSpace(this.selectedVenueId, this.editingSpaceId, payload)
            : this.api.createVenueSpace(this.selectedVenueId, payload);
        request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.setSectionSuccess('spaces', this.editingSpaceId ? 'Space updated.' : 'Space created.');
                this.setSectionSaving('spaces', false);
                this.startNewSpace();
                this.loadSpacesSection(true);
            },
            error: (error) => {
                this.setSectionError('spaces', this.resolveError(error, 'Unable to save space.'));
                this.setSectionSaving('spaces', false);
            }
        });
    }
    startNewCombination() {
        this.editingCombinationId = null;
        this.combinationForm.reset({
            name: '',
            description: '',
            priceAmount: null,
            currencyCode: this.venueForm.get('currencyCode')?.value ?? 'GBP',
            spaceIds: []
        });
        this.replaceFormArray(this.combinationCapacityControls, [this.createCapacityGroup(), this.createCapacityGroup({ setupStyle: 'Reception' })]);
    }
    editCombination(combination) {
        this.editingCombinationId = combination.id;
        this.combinationForm.patchValue({
            name: combination.name,
            description: combination.description ?? '',
            priceAmount: combination.priceAmount ?? null,
            currencyCode: combination.currencyCode,
            spaceIds: [...combination.spaceIds]
        });
        this.replaceFormArray(this.combinationCapacityControls, combination.capacityBySetup.length > 0
            ? combination.capacityBySetup.map((rule) => this.createCapacityGroup(rule))
            : [this.createCapacityGroup()]);
    }
    addCombinationCapacityRule() {
        this.combinationCapacityControls.push(this.createCapacityGroup());
    }
    removeCombinationCapacityRule(index) {
        if (this.combinationCapacityControls.length <= 1) {
            return;
        }
        this.combinationCapacityControls.removeAt(index);
    }
    toggleCombinationSpace(spaceId, event) {
        const checkbox = event.target;
        const selected = [...(this.combinationForm.get('spaceIds')?.value ?? [])];
        if (checkbox.checked) {
            if (!selected.includes(spaceId)) {
                selected.push(spaceId);
            }
        }
        else {
            const index = selected.indexOf(spaceId);
            if (index >= 0) {
                selected.splice(index, 1);
            }
        }
        this.combinationForm.get('spaceIds')?.setValue(selected);
    }
    isCombinationSpaceSelected(spaceId) {
        const selected = (this.combinationForm.get('spaceIds')?.value ?? []);
        return selected.includes(spaceId);
    }
    saveCombination() {
        if (!this.selectedVenueId) {
            return;
        }
        if (this.combinationForm.invalid) {
            this.combinationForm.markAllAsTouched();
            this.setSectionError('spaces', 'Complete required fields for the space combination before saving.');
            return;
        }
        const value = this.combinationForm.getRawValue();
        const selectedSpaces = (value.spaceIds ?? []);
        if (selectedSpaces.length < 2) {
            this.setSectionError('spaces', 'Select at least two spaces for a combination.');
            return;
        }
        const payload = {
            name: this.requiredText(value.name),
            description: this.optionalText(value.description),
            priceAmount: value.priceAmount === null ? null : Number(value.priceAmount),
            currencyCode: this.requiredText(value.currencyCode).toUpperCase(),
            spaceIds: selectedSpaces,
            capacityBySetup: this.mapCapacityRules(this.combinationCapacityControls)
        };
        this.setSectionSaving('spaces', true);
        const request$ = this.editingCombinationId
            ? this.api.updateSpaceCombination(this.selectedVenueId, this.editingCombinationId, payload)
            : this.api.createSpaceCombination(this.selectedVenueId, payload);
        request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.setSectionSuccess('spaces', this.editingCombinationId ? 'Combination updated.' : 'Combination created.');
                this.setSectionSaving('spaces', false);
                this.startNewCombination();
                this.loadSpacesSection(true);
            },
            error: (error) => {
                this.setSectionError('spaces', this.resolveError(error, 'Unable to save space combination.'));
                this.setSectionSaving('spaces', false);
            }
        });
    }
    changeBudgetYear(offset) {
        this.selectedBudgetYear += offset;
        this.loadBudgetSection(true);
    }
    setBudgetMonth(month) {
        this.selectedBudgetMonth = month;
        if (!this.budgetForms.has(month)) {
            this.ensureSectionLoaded('budgets');
        }
    }
    addBudgetTargetRow(month) {
        const targets = this.getBudgetTargetsArray(month);
        if (!targets) {
            return;
        }
        targets.push(this.createBudgetTargetGroup());
    }
    removeBudgetTargetRow(month, index) {
        const targets = this.getBudgetTargetsArray(month);
        if (!targets || targets.length <= 1) {
            return;
        }
        targets.removeAt(index);
    }
    saveBudgetMonth(month) {
        if (!this.selectedVenueId) {
            return;
        }
        const form = this.getBudgetForm(month);
        if (!form) {
            return;
        }
        if (form.invalid) {
            form.markAllAsTouched();
            this.setSectionError('budgets', 'Complete required fields before saving the budget month.');
            return;
        }
        const value = form.getRawValue();
        const targets = (value.targetsByEventType ?? []);
        const payload = {
            year: this.selectedBudgetYear,
            month,
            overallRevenueTarget: Number(value.overallRevenueTarget ?? 0),
            currencyCode: this.requiredText(value.currencyCode).toUpperCase(),
            targetsByEventType: targets
                .map((target) => ({
                eventType: this.requiredText(target.eventType),
                revenueTarget: Number(target.revenueTarget ?? 0),
                coversTarget: Number(target.coversTarget ?? 0),
                bookingCountTarget: Number(target.bookingCountTarget ?? 0),
                averageSellingPriceTarget: Number(target.averageSellingPriceTarget ?? 0)
            }))
                .filter((target) => target.eventType)
        };
        this.setSectionSaving('budgets', true);
        this.api
            .upsertVenueBudgetMonth(this.selectedVenueId, this.selectedBudgetYear, month, payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.setSectionSuccess('budgets', `Month ${this.getMonthLabel(month)} budget saved.`);
                this.setSectionSaving('budgets', false);
                this.loadBudgetSection(true);
            },
            error: (error) => {
                this.setSectionError('budgets', this.resolveError(error, 'Unable to save budget month.'));
                this.setSectionSaving('budgets', false);
            }
        });
    }
    onBudgetCsvSelected(event) {
        const input = event.target;
        this.selectedBudgetCsvFile = input.files?.item(0) ?? null;
    }
    uploadBudgetCsv() {
        if (!this.selectedVenueId || !this.selectedBudgetCsvFile) {
            return;
        }
        this.setSectionSaving('budgets', true);
        this.api
            .importVenueBudgetsCsv(this.selectedVenueId, this.selectedBudgetCsvFile)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.selectedBudgetCsvFile = null;
                this.setSectionSuccess('budgets', 'Budget CSV imported successfully.');
                this.setSectionSaving('budgets', false);
                this.loadBudgetSection(true);
            },
            error: (error) => {
                this.setSectionError('budgets', this.resolveError(error, 'Unable to import budget CSV.'));
                this.setSectionSaving('budgets', false);
            }
        });
    }
    inviteUser() {
        if (!this.selectedVenueId) {
            return;
        }
        if (this.inviteForm.invalid) {
            this.inviteForm.markAllAsTouched();
            this.setSectionError('users', 'Complete invite fields before sending an invitation.');
            return;
        }
        const value = this.inviteForm.getRawValue();
        this.setSectionSaving('users', true);
        this.inviteDebugToken = '';
        this.api
            .inviteUser({
            firstName: this.requiredText(value.firstName),
            lastName: this.requiredText(value.lastName),
            email: this.requiredText(value.email).toLowerCase(),
            phoneNumberE164: this.optionalText(value.phoneNumberE164),
            venueRoles: [{ venueId: this.selectedVenueId, role: this.requiredText(value.role) }],
            requiresTotp: Boolean(value.requiresTotp)
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.setSectionSuccess('users', `Invitation sent to ${response.email}.`);
                this.setSectionSaving('users', false);
                this.inviteDebugToken = response.debugToken ?? '';
                this.inviteForm.reset({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumberE164: '',
                    role: 'EventsCoordinator',
                    requiresTotp: false
                });
                this.loadUsersSection(true);
            },
            error: (error) => {
                this.setSectionError('users', this.resolveError(error, 'Unable to send invitation.'));
                this.setSectionSaving('users', false);
            }
        });
    }
    toggleUserActive(user, isActive) {
        this.setSectionSaving('users', true);
        this.api
            .updateUserStatus(user.id, isActive)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.setSectionSuccess('users', `${user.firstName} ${user.lastName} ${isActive ? 'activated' : 'deactivated'}.`);
                this.setSectionSaving('users', false);
                this.loadUsersSection(true);
            },
            error: (error) => {
                this.setSectionError('users', this.resolveError(error, 'Unable to update user status.'));
                this.setSectionSaving('users', false);
            }
        });
    }
    getUserRoleForSelectedVenue(user) {
        if (!this.selectedVenueId) {
            return user.venueRoles.map((role) => role.role).join(', ');
        }
        const role = user.venueRoles.find((assignment) => assignment.venueId === this.selectedVenueId);
        return role?.role ?? 'Not assigned';
    }
    savePaymentScheduleTemplate() {
        if (this.paymentTemplateForm.invalid || !this.selectedVenueId) {
            this.paymentTemplateForm.markAllAsTouched();
            this.setSectionError('payment-schedules', 'Complete required template fields before saving.');
            return;
        }
        const value = this.paymentTemplateForm.getRawValue();
        const methods = this.requiredText(value.acceptedMethodsCsv)
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
        const template = {
            id: crypto.randomUUID(),
            name: this.requiredText(value.name),
            eventType: this.requiredText(value.eventType),
            isDefault: this.paymentScheduleTemplates.length === 0,
            milestones: [
                {
                    name: this.requiredText(value.milestoneName),
                    dueDateRule: this.requiredText(value.dueDateRule),
                    amountType: this.requiredText(value.amountType) || 'Percentage',
                    amount: Number(value.amount ?? 0),
                    paymentMethodsAccepted: methods.length > 0 ? methods : ['Online (card)', 'Bank transfer'],
                    autoReminderEnabled: true,
                    autoReminderDays: 2,
                    lateReminderEnabled: true,
                    lateReminderDays: 2
                }
            ]
        };
        this.paymentScheduleTemplates = [template, ...this.paymentScheduleTemplates].slice(0, 20);
        this.persistPaymentScheduleTemplates('Payment schedule template saved.');
        this.paymentTemplateForm.reset({
            name: '',
            eventType: 'Wedding',
            milestoneName: 'Booking Deposit',
            dueDateRule: 'X days after confirmation',
            amountType: 'Percentage',
            amount: 25,
            acceptedMethodsCsv: 'Online (card), Bank transfer'
        });
    }
    deletePaymentScheduleTemplate(id) {
        this.paymentScheduleTemplates = this.paymentScheduleTemplates.filter((item) => item.id !== id);
        this.persistPaymentScheduleTemplates('Payment schedule template removed.');
    }
    saveTermsDocument() {
        if (this.termsForm.invalid || !this.selectedVenueId) {
            this.termsForm.markAllAsTouched();
            this.setSectionError('terms', 'Enter title, event type, and content before saving terms.');
            return;
        }
        const value = this.termsForm.getRawValue();
        const title = this.requiredText(value.title);
        const versionsForTitle = this.termsDocuments.filter((doc) => doc.title.toLowerCase() === title.toLowerCase());
        const highestVersion = versionsForTitle
            .map((doc) => Number(doc.version.toLowerCase().replace('v', '')))
            .filter((version) => Number.isFinite(version))
            .reduce((max, version) => Math.max(max, version), 0);
        const nextVersion = `v${highestVersion + 1}`;
        const draft = {
            id: crypto.randomUUID(),
            title,
            eventType: this.requiredText(value.eventType),
            version: nextVersion,
            content: this.requiredText(value.content),
            isActive: true,
            updatedAtUtc: new Date().toISOString()
        };
        this.termsDocuments = [draft, ...this.termsDocuments].slice(0, 40);
        this.persistTermsDocuments(`Terms document saved as ${nextVersion}.`);
        this.termsForm.reset({
            title: '',
            eventType: 'Wedding',
            content: ''
        });
    }
    deleteTermsDocument(id) {
        this.termsDocuments = this.termsDocuments.filter((item) => item.id !== id);
        this.persistTermsDocuments('Terms document removed.');
    }
    saveProposalTemplate() {
        if (this.proposalTemplateForm.invalid || !this.selectedVenueId) {
            this.proposalTemplateForm.markAllAsTouched();
            this.setSectionError('proposal-templates', 'Complete required fields before saving a proposal template.');
            return;
        }
        const value = this.proposalTemplateForm.getRawValue();
        const key = this.requiredText(value.key).toLowerCase();
        const template = {
            key,
            label: this.requiredText(value.label),
            eventType: this.requiredText(value.eventType),
            defaultValidityDays: Number(value.defaultValidityDays ?? 14),
            defaultIntroduction: this.optionalText(value.defaultIntroduction),
            defaultTermsVersion: this.optionalText(value.defaultTermsVersion),
            defaultLineItems: [
                {
                    category: this.requiredText(value.itemCategory),
                    description: this.requiredText(value.itemDescription),
                    quantity: Number(value.itemQuantity ?? 1),
                    unit: this.requiredText(value.itemUnit),
                    unitPriceExclVat: Number(value.itemUnitPriceExclVat ?? 0),
                    vatRate: Number(value.itemVatRate ?? 20),
                    discountPercent: Number(value.itemDiscountPercent ?? 0),
                    discountAmount: Number(value.itemDiscountAmount ?? 0)
                }
            ]
        };
        this.proposalTemplates = [template, ...this.proposalTemplates.filter((item) => item.key !== key)];
        this.persistProposalTemplates('Proposal template saved.');
        this.proposalTemplateForm.reset({
            key: '',
            label: '',
            eventType: 'Wedding',
            defaultValidityDays: 14,
            defaultIntroduction: '',
            defaultTermsVersion: 'v1',
            itemCategory: 'Room Hire',
            itemDescription: '',
            itemQuantity: 1,
            itemUnit: 'Flat rate',
            itemUnitPriceExclVat: 0,
            itemVatRate: 20,
            itemDiscountPercent: 0,
            itemDiscountAmount: 0
        });
    }
    deleteProposalTemplate(key) {
        this.proposalTemplates = this.proposalTemplates.filter((item) => item.key !== key);
        this.persistProposalTemplates('Proposal template removed.');
    }
    savePlanningMilestone() {
        if (this.planningMilestoneForm.invalid || !this.selectedVenueId) {
            this.planningMilestoneForm.markAllAsTouched();
            this.setSectionError('planning-milestones', 'Complete key and label before saving a planning milestone.');
            return;
        }
        const value = this.planningMilestoneForm.getRawValue();
        const key = this.requiredText(value.key);
        const next = {
            key,
            label: this.requiredText(value.label),
            isEnabled: Boolean(value.isEnabled)
        };
        this.planningMilestones = [next, ...this.planningMilestones.filter((item) => item.key !== key)];
        this.persistPlanningMilestones('Planning milestone saved.');
        this.planningMilestoneForm.reset({
            key: '',
            label: '',
            isEnabled: true
        });
    }
    deletePlanningMilestone(key) {
        this.planningMilestones = this.planningMilestones.filter((item) => item.key !== key);
        this.persistPlanningMilestones('Planning milestone removed.');
    }
    saveReportConfiguration() {
        if (this.reportConfigurationForm.invalid || !this.selectedVenueId) {
            this.reportConfigurationForm.markAllAsTouched();
            this.setSectionError('report-configuration', 'Enter valid conversion weights before saving.');
            return;
        }
        const value = this.reportConfigurationForm.getRawValue();
        const payload = {
            provisionalWeightPercent: Number(value.provisionalWeightPercent ?? 80),
            tentativeWeightPercent: Number(value.tentativeWeightPercent ?? 50),
            openProposalWeightPercent: Number(value.openProposalWeightPercent ?? 30)
        };
        this.setSectionSaving('report-configuration', true);
        this.api
            .upsertReportConfiguration(this.selectedVenueId, payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.reportConfigurationForm.patchValue({
                    provisionalWeightPercent: response.provisionalWeightPercent,
                    tentativeWeightPercent: response.tentativeWeightPercent,
                    openProposalWeightPercent: response.openProposalWeightPercent
                });
                this.setSectionSuccess('report-configuration', 'Report configuration saved.');
                this.setSectionSaving('report-configuration', false);
            },
            error: (error) => {
                this.setSectionError('report-configuration', this.resolveError(error, 'Unable to save report configuration.'));
                this.setSectionSaving('report-configuration', false);
            }
        });
    }
    saveAutomationSettings() {
        if (this.automationSettingsForm.invalid || !this.selectedVenueId) {
            this.automationSettingsForm.markAllAsTouched();
            this.setSectionError('automation', 'Complete automation settings before saving.');
            return;
        }
        const value = this.automationSettingsForm.getRawValue();
        const payload = {
            proposalAcceptedTargetStatus: this.requiredText(value.proposalAcceptedTargetStatus),
            followUpInactiveDays: Number(value.followUpInactiveDays ?? 3),
            autoArchiveEnabled: Boolean(value.autoArchiveEnabled),
            autoArchiveDays: Number(value.autoArchiveDays ?? 90)
        };
        this.setSectionSaving('automation', true);
        this.api
            .upsertAutomationSettings(this.selectedVenueId, payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.automationSettingsForm.patchValue({
                    proposalAcceptedTargetStatus: response.proposalAcceptedTargetStatus,
                    followUpInactiveDays: response.followUpInactiveDays,
                    autoArchiveEnabled: response.autoArchiveEnabled,
                    autoArchiveDays: response.autoArchiveDays
                });
                this.setSectionSuccess('automation', 'Automation settings saved.');
                this.setSectionSaving('automation', false);
            },
            error: (error) => {
                this.setSectionError('automation', this.resolveError(error, 'Unable to save automation settings.'));
                this.setSectionSaving('automation', false);
            }
        });
    }
    saveEmailTemplate() {
        if (!this.selectedVenueId || this.emailTemplateForm.invalid) {
            this.emailTemplateForm.markAllAsTouched();
            this.setSectionError('email-templates', 'Complete all template fields before saving.');
            return;
        }
        const value = this.emailTemplateForm.getRawValue();
        const key = this.requiredText(value.key).toLowerCase();
        const nextTemplate = {
            key,
            name: this.requiredText(value.name),
            subjectTemplate: this.requiredText(value.subjectTemplate),
            bodyHtmlTemplate: this.requiredText(value.bodyHtmlTemplate),
            isActive: Boolean(value.isActive)
        };
        const nextTemplates = [nextTemplate, ...this.emailTemplates.filter((template) => template.key !== key)];
        this.setSectionSaving('email-templates', true);
        this.api
            .upsertEmailTemplates(this.selectedVenueId, nextTemplates)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (templates) => {
                this.emailTemplates = templates;
                this.setSectionSuccess('email-templates', 'Email template saved.');
                this.setSectionSaving('email-templates', false);
                this.emailTemplateForm.reset({
                    key: '',
                    name: '',
                    subjectTemplate: '',
                    bodyHtmlTemplate: '',
                    isActive: true
                });
            },
            error: (error) => {
                this.setSectionError('email-templates', this.resolveError(error, 'Unable to save email template.'));
                this.setSectionSaving('email-templates', false);
            }
        });
    }
    deleteEmailTemplate(key) {
        if (!this.selectedVenueId) {
            return;
        }
        const templates = this.emailTemplates.filter((template) => template.key !== key);
        this.setSectionSaving('email-templates', true);
        this.api
            .upsertEmailTemplates(this.selectedVenueId, templates)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.emailTemplates = response;
                this.setSectionSuccess('email-templates', 'Email template removed.');
                this.setSectionSaving('email-templates', false);
            },
            error: (error) => {
                this.setSectionError('email-templates', this.resolveError(error, 'Unable to remove email template.'));
                this.setSectionSaving('email-templates', false);
            }
        });
    }
    saveWebsiteForm() {
        if (!this.selectedVenueId || this.websiteFormForm.invalid) {
            this.websiteFormForm.markAllAsTouched();
            this.setSectionError('website-forms', 'Complete required website form fields before saving.');
            return;
        }
        const value = this.websiteFormForm.getRawValue();
        const id = this.optionalText(value.id) ?? crypto.randomUUID();
        const nextForm = {
            id,
            name: this.requiredText(value.name),
            slug: this.requiredText(value.slug).toLowerCase(),
            isActive: Boolean(value.isActive),
            successMessage: this.requiredText(value.successMessage),
            redirectUrl: this.optionalText(value.redirectUrl),
            requiredFields: this.parseCsvList(value.requiredFieldsCsv),
            optionalFields: this.parseCsvList(value.optionalFieldsCsv),
            styleJson: this.optionalText(value.styleJson)
        };
        const forms = [nextForm, ...this.websiteForms.filter((form) => form.id !== id)];
        this.setSectionSaving('website-forms', true);
        this.api
            .upsertWebsiteForms(this.selectedVenueId, forms)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.websiteForms = response;
                this.setSectionSuccess('website-forms', 'Website form saved.');
                this.setSectionSaving('website-forms', false);
                this.websiteFormForm.reset({
                    id: '',
                    name: '',
                    slug: '',
                    isActive: true,
                    successMessage: 'Thank you. We have received your enquiry.',
                    redirectUrl: '',
                    requiredFieldsCsv: 'firstName,lastName,email,phone,eventDate,guestsExpected,dataConsent',
                    optionalFieldsCsv: 'eventStyle,budgetRange,specialRequirements,marketingConsent',
                    styleJson: '{"primaryColor":"#2563eb","buttonLabel":"Send Enquiry"}'
                });
            },
            error: (error) => {
                this.setSectionError('website-forms', this.resolveError(error, 'Unable to save website form.'));
                this.setSectionSaving('website-forms', false);
            }
        });
    }
    editWebsiteForm(form) {
        this.websiteFormForm.patchValue({
            id: form.id,
            name: form.name,
            slug: form.slug,
            isActive: form.isActive,
            successMessage: form.successMessage,
            redirectUrl: form.redirectUrl ?? '',
            requiredFieldsCsv: form.requiredFields.join(','),
            optionalFieldsCsv: form.optionalFields.join(','),
            styleJson: form.styleJson ?? ''
        });
    }
    deleteWebsiteForm(id) {
        if (!this.selectedVenueId) {
            return;
        }
        const forms = this.websiteForms.filter((form) => form.id !== id);
        this.setSectionSaving('website-forms', true);
        this.api
            .upsertWebsiteForms(this.selectedVenueId, forms)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.websiteForms = response;
                this.setSectionSuccess('website-forms', 'Website form removed.');
                this.setSectionSaving('website-forms', false);
            },
            error: (error) => {
                this.setSectionError('website-forms', this.resolveError(error, 'Unable to remove website form.'));
                this.setSectionSaving('website-forms', false);
            }
        });
    }
    saveCalendarAccount() {
        if (!this.selectedVenueId || this.calendarAccountForm.invalid) {
            this.calendarAccountForm.markAllAsTouched();
            this.setSectionError('calendar-accounts', 'Enter valid calendar account values before saving.');
            return;
        }
        const value = this.calendarAccountForm.getRawValue();
        const id = this.optionalText(value.id) ?? crypto.randomUUID();
        const account = {
            id,
            address: this.requiredText(value.address).toLowerCase(),
            provider: this.requiredText(value.provider),
            externalCalendarId: this.optionalText(value.externalCalendarId),
            isActive: Boolean(value.isActive),
            syncProvisionalHolds: Boolean(value.syncProvisionalHolds),
            connectionStatus: this.requiredText(value.connectionStatus).toLowerCase(),
            lastSyncedAtUtc: new Date().toISOString()
        };
        const accounts = [account, ...this.calendarAccounts.filter((item) => item.id !== id)];
        this.setSectionSaving('calendar-accounts', true);
        this.api
            .upsertCalendarAccounts(this.selectedVenueId, accounts)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.calendarAccounts = response;
                this.setSectionSuccess('calendar-accounts', 'Calendar account saved.');
                this.setSectionSaving('calendar-accounts', false);
                this.calendarAccountForm.reset({
                    id: '',
                    address: '',
                    provider: 'Nylas',
                    externalCalendarId: '',
                    isActive: true,
                    syncProvisionalHolds: true,
                    connectionStatus: 'connected'
                });
            },
            error: (error) => {
                this.setSectionError('calendar-accounts', this.resolveError(error, 'Unable to save calendar account.'));
                this.setSectionSaving('calendar-accounts', false);
            }
        });
    }
    editCalendarAccount(account) {
        this.calendarAccountForm.patchValue({
            id: account.id,
            address: account.address,
            provider: account.provider,
            externalCalendarId: account.externalCalendarId ?? '',
            isActive: account.isActive,
            syncProvisionalHolds: account.syncProvisionalHolds,
            connectionStatus: account.connectionStatus
        });
    }
    deleteCalendarAccount(id) {
        if (!this.selectedVenueId) {
            return;
        }
        const accounts = this.calendarAccounts.filter((item) => item.id !== id);
        this.setSectionSaving('calendar-accounts', true);
        this.api
            .upsertCalendarAccounts(this.selectedVenueId, accounts)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.calendarAccounts = response;
                this.setSectionSuccess('calendar-accounts', 'Calendar account removed.');
                this.setSectionSaving('calendar-accounts', false);
            },
            error: (error) => {
                this.setSectionError('calendar-accounts', this.resolveError(error, 'Unable to remove calendar account.'));
                this.setSectionSaving('calendar-accounts', false);
            }
        });
    }
    saveTaskTemplate() {
        if (!this.selectedVenueId || this.taskTemplateForm.invalid) {
            this.taskTemplateForm.markAllAsTouched();
            this.setSectionError('task-templates', 'Complete required task template fields before saving.');
            return;
        }
        const value = this.taskTemplateForm.getRawValue();
        const templateId = this.optionalText(value.id) ?? undefined;
        this.setSectionSaving('task-templates', true);
        this.api
            .upsertTaskTemplate(this.selectedVenueId, {
            name: this.requiredText(value.name),
            eventType: this.requiredText(value.eventType),
            triggerStatus: this.requiredText(value.triggerStatus),
            assignToEventManager: Boolean(value.assignToEventManager),
            items: [
                {
                    title: this.requiredText(value.itemTitle),
                    description: this.optionalText(value.itemDescription) ?? undefined,
                    priority: this.requiredText(value.itemPriority),
                    dueDateRule: this.requiredText(value.itemDueDateRule),
                    dueOffsetDays: Number(value.itemDueOffsetDays ?? 0)
                }
            ]
        }, templateId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.setSectionSuccess('task-templates', 'Task template saved.');
                this.setSectionSaving('task-templates', false);
                this.taskTemplateForm.reset({
                    id: '',
                    name: '',
                    eventType: 'Wedding',
                    triggerStatus: 'Confirmed',
                    assignToEventManager: true,
                    itemTitle: 'Follow up',
                    itemDescription: '',
                    itemPriority: 'Medium',
                    itemDueDateRule: 'days-after-status-change',
                    itemDueOffsetDays: 1
                });
                this.loadTaskTemplatesSection(true);
            },
            error: (error) => {
                this.setSectionError('task-templates', this.resolveError(error, 'Unable to save task template.'));
                this.setSectionSaving('task-templates', false);
            }
        });
    }
    editTaskTemplate(template) {
        const firstItem = template.items[0];
        this.taskTemplateForm.patchValue({
            id: template.id,
            name: template.name,
            eventType: template.eventType,
            triggerStatus: template.triggerStatus,
            assignToEventManager: template.assignToEventManager,
            itemTitle: firstItem?.title ?? '',
            itemDescription: firstItem?.description ?? '',
            itemPriority: firstItem?.priority ?? 'Medium',
            itemDueDateRule: firstItem?.dueDateRule ?? 'days-after-status-change',
            itemDueOffsetDays: firstItem?.dueOffsetDays ?? 0
        });
    }
    deleteTaskTemplate(templateId) {
        this.setSectionSaving('task-templates', true);
        this.api
            .deleteTaskTemplate(templateId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.setSectionSuccess('task-templates', 'Task template removed.');
                this.setSectionSaving('task-templates', false);
                this.loadTaskTemplatesSection(true);
            },
            error: (error) => {
                this.setSectionError('task-templates', this.resolveError(error, 'Unable to remove task template.'));
                this.setSectionSaving('task-templates', false);
            }
        });
    }
    saveReportSchedule() {
        if (!this.selectedVenueId || this.reportScheduleForm.invalid) {
            this.reportScheduleForm.markAllAsTouched();
            this.setSectionError('report-schedules', 'Complete required schedule fields before saving.');
            return;
        }
        const value = this.reportScheduleForm.getRawValue();
        const scheduleId = this.optionalText(value.id) ?? undefined;
        this.setSectionSaving('report-schedules', true);
        this.api
            .upsertReportSchedule(this.selectedVenueId, {
            name: this.requiredText(value.name),
            reportKey: this.requiredText(value.reportKey),
            frequency: this.requiredText(value.frequency),
            recipients: this.parseCsvList(value.recipientsCsv),
            isActive: Boolean(value.isActive),
            nextRunAtUtc: this.optionalText(value.nextRunAtUtc) ?? undefined,
            filtersJson: this.optionalText(value.filtersJson) ?? '{}'
        }, scheduleId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.setSectionSuccess('report-schedules', 'Report schedule saved.');
                this.setSectionSaving('report-schedules', false);
                this.reportScheduleForm.reset({
                    id: '',
                    name: '',
                    reportKey: 'pipeline',
                    frequency: 'weekly',
                    recipientsCsv: '',
                    isActive: true,
                    nextRunAtUtc: '',
                    filtersJson: '{}'
                });
                this.loadReportSchedulesSection(true);
            },
            error: (error) => {
                this.setSectionError('report-schedules', this.resolveError(error, 'Unable to save report schedule.'));
                this.setSectionSaving('report-schedules', false);
            }
        });
    }
    editReportSchedule(schedule) {
        this.reportScheduleForm.patchValue({
            id: schedule.id,
            name: schedule.name,
            reportKey: schedule.reportKey,
            frequency: schedule.frequency,
            recipientsCsv: schedule.recipients.join(','),
            isActive: schedule.isActive,
            nextRunAtUtc: schedule.nextRunAtUtc ?? '',
            filtersJson: '{}'
        });
    }
    deleteReportScheduleItem(scheduleId) {
        this.setSectionSaving('report-schedules', true);
        this.api
            .deleteReportSchedule(scheduleId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.setSectionSuccess('report-schedules', 'Report schedule removed.');
                this.setSectionSaving('report-schedules', false);
                this.loadReportSchedulesSection(true);
            },
            error: (error) => {
                this.setSectionError('report-schedules', this.resolveError(error, 'Unable to remove report schedule.'));
                this.setSectionSaving('report-schedules', false);
            }
        });
    }
    startNewEmailAccount() {
        this.editingEmailAccountId = null;
        this.emailAccountForm.reset({
            address: '',
            provider: 'Nylas',
            externalAccountReference: '',
            isActive: true,
            useForOutbound: true
        });
    }
    editEmailAccount(account) {
        this.editingEmailAccountId = account.id;
        this.emailAccountForm.patchValue({
            address: account.address,
            provider: account.provider,
            externalAccountReference: account.externalAccountReference ?? '',
            isActive: account.isActive,
            useForOutbound: account.useForOutbound
        });
    }
    saveEmailAccount() {
        if (this.emailAccountForm.invalid || !this.selectedVenueId) {
            this.emailAccountForm.markAllAsTouched();
            this.setSectionError('email-accounts', 'Enter a valid email account before saving.');
            return;
        }
        const value = this.emailAccountForm.getRawValue();
        const payload = {
            address: this.requiredText(value.address).toLowerCase(),
            provider: this.requiredText(value.provider),
            externalAccountReference: this.optionalText(value.externalAccountReference) ?? undefined,
            isActive: Boolean(value.isActive),
            useForOutbound: Boolean(value.useForOutbound)
        };
        this.setSectionSaving('email-accounts', true);
        const request$ = this.editingEmailAccountId
            ? this.api.updateVenueEmailAccount(this.selectedVenueId, this.editingEmailAccountId, payload)
            : this.api.createVenueEmailAccount(this.selectedVenueId, payload);
        request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.setSectionSuccess('email-accounts', this.editingEmailAccountId ? 'Email account updated.' : 'Email account added.');
                this.setSectionSaving('email-accounts', false);
                this.startNewEmailAccount();
                this.loadEmailAccountsSection(true);
            },
            error: (error) => {
                this.setSectionError('email-accounts', this.resolveError(error, 'Unable to save email account.'));
                this.setSectionSaving('email-accounts', false);
            }
        });
    }
    deleteEmailAccount(accountId) {
        if (!this.selectedVenueId) {
            return;
        }
        this.setSectionSaving('email-accounts', true);
        this.api
            .deleteVenueEmailAccount(this.selectedVenueId, accountId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.setSectionSuccess('email-accounts', 'Email account deleted.');
                this.setSectionSaving('email-accounts', false);
                this.loadEmailAccountsSection(true);
                if (this.editingEmailAccountId === accountId) {
                    this.startNewEmailAccount();
                }
            },
            error: (error) => {
                this.setSectionError('email-accounts', this.resolveError(error, 'Unable to delete email account.'));
                this.setSectionSaving('email-accounts', false);
            }
        });
    }
    connectNylasFromForm() {
        if (!this.selectedVenueId) {
            return;
        }
        const addressValue = this.optionalText(this.emailAccountForm.get('address')?.value);
        this.connectNylas(addressValue);
    }
    connectNylas(loginHint) {
        if (!this.selectedVenueId) {
            return;
        }
        this.setSectionSaving('email-accounts', true);
        this.api
            .createNylasConnectUrl({
            venueId: this.selectedVenueId,
            provider: 'google',
            loginHint: loginHint ?? undefined,
            returnPath: '/settings?section=email-accounts'
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.setSectionSaving('email-accounts', false);
                this.nylasPopup = window.open(response.connectUrl, 'creventa-nylas-connect', 'width=720,height=840');
                if (!this.nylasPopup) {
                    this.setSectionError('email-accounts', 'Popup was blocked. Allow popups and try again.');
                }
                else {
                    this.setSectionSuccess('email-accounts', 'Complete the Nylas sign-in flow in the opened window.');
                }
            },
            error: (error) => {
                this.setSectionSaving('email-accounts', false);
                this.setSectionError('email-accounts', this.resolveError(error, 'Unable to start Nylas connection.'));
            }
        });
    }
    disconnectNylas(account) {
        if (!this.selectedVenueId) {
            return;
        }
        this.setSectionSaving('email-accounts', true);
        this.api
            .disconnectNylasAccount(this.selectedVenueId, account.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.setSectionSaving('email-accounts', false);
                this.setSectionSuccess('email-accounts', `${account.address} disconnected from Nylas.`);
                this.loadEmailAccountsSection(true);
            },
            error: (error) => {
                this.setSectionSaving('email-accounts', false);
                this.setSectionError('email-accounts', this.resolveError(error, 'Unable to disconnect Nylas account.'));
            }
        });
    }
    getBudgetForm(month) {
        return this.budgetForms.get(month) ?? null;
    }
    getBudgetTargetsArray(month) {
        const form = this.getBudgetForm(month);
        return form ? form.get('targetsByEventType') : null;
    }
    trackById(_, item) {
        return item.id;
    }
    trackByMonth(_, month) {
        return month;
    }
    getMonthLabel(month) {
        const date = new Date(Date.UTC(this.selectedBudgetYear, month - 1, 1));
        return date.toLocaleString('en-GB', { month: 'short' });
    }
    ensureSectionLoaded(section) {
        if (!this.selectedVenueId) {
            return;
        }
        if (this.loadedSections.has(section)) {
            return;
        }
        switch (section) {
            case 'venue-profile':
                this.loadVenueProfileSection();
                break;
            case 'spaces':
                this.loadSpacesSection();
                break;
            case 'budgets':
                this.loadBudgetSection();
                break;
            case 'users':
                this.loadUsersSection();
                break;
            case 'payment-schedules':
                this.loadPaymentScheduleSection();
                break;
            case 'terms':
                this.loadTermsSection();
                break;
            case 'proposal-templates':
                this.loadProposalTemplatesSection();
                break;
            case 'planning-milestones':
                this.loadPlanningMilestonesSection();
                break;
            case 'report-configuration':
                this.loadReportConfigurationSection();
                break;
            case 'automation':
                this.loadAutomationSection();
                break;
            case 'email-templates':
                this.loadEmailTemplatesSection();
                break;
            case 'website-forms':
                this.loadWebsiteFormsSection();
                break;
            case 'calendar-accounts':
                this.loadCalendarAccountsSection();
                break;
            case 'task-templates':
                this.loadTaskTemplatesSection();
                break;
            case 'report-schedules':
                this.loadReportSchedulesSection();
                break;
            case 'email-accounts':
                this.loadEmailAccountsSection();
                break;
            default:
                break;
        }
        this.loadedSections.add(section);
    }
    loadVenueProfileSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('venue-profile')) {
            return;
        }
        this.setSectionLoading('venue-profile', true);
        this.api
            .getVenueProfile(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (profile) => {
                this.venueProfile = profile;
                this.patchVenueForm(profile);
                this.setSectionLoading('venue-profile', false);
            },
            error: (error) => {
                this.setSectionError('venue-profile', this.resolveError(error, 'Unable to load venue profile.'));
                this.setSectionLoading('venue-profile', false);
            }
        });
    }
    loadSpacesSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('spaces')) {
            return;
        }
        this.setSectionLoading('spaces', true);
        this.api
            .getVenueSpaces(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (spaces) => {
                this.spaces = spaces;
                this.loadSpaceCombinations();
                if (!this.editingSpaceId) {
                    this.startNewSpace();
                }
            },
            error: (error) => {
                this.setSectionError('spaces', this.resolveError(error, 'Unable to load spaces.'));
                this.setSectionLoading('spaces', false);
            }
        });
    }
    loadSpaceCombinations() {
        if (!this.selectedVenueId) {
            return;
        }
        this.api
            .getSpaceCombinations(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (combinations) => {
                this.combinations = combinations;
                if (!this.editingCombinationId) {
                    this.startNewCombination();
                }
                this.setSectionLoading('spaces', false);
            },
            error: (error) => {
                this.setSectionError('spaces', this.resolveError(error, 'Unable to load space combinations.'));
                this.setSectionLoading('spaces', false);
            }
        });
    }
    loadBudgetSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('budgets')) {
            return;
        }
        this.setSectionLoading('budgets', true);
        this.api
            .getVenueBudgets(this.selectedVenueId, this.selectedBudgetYear)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (rows) => {
                this.budgets = rows;
                this.buildBudgetForms(rows);
                this.setSectionLoading('budgets', false);
            },
            error: (error) => {
                this.setSectionError('budgets', this.resolveError(error, 'Unable to load budgets.'));
                this.setSectionLoading('budgets', false);
            }
        });
    }
    loadUsersSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('users')) {
            return;
        }
        this.setSectionLoading('users', true);
        this.api
            .getUsers(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (users) => {
                this.users = users;
                this.loadUserActivity();
            },
            error: (error) => {
                this.setSectionError('users', this.resolveError(error, 'Unable to load users.'));
                this.setSectionLoading('users', false);
            }
        });
    }
    loadUserActivity() {
        this.api
            .getUserActivity(40)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (items) => {
                this.userActivity = items;
                this.setSectionLoading('users', false);
            },
            error: () => {
                this.userActivity = [];
                this.setSectionLoading('users', false);
            }
        });
    }
    loadPaymentScheduleSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('payment-schedules')) {
            return;
        }
        this.setSectionLoading('payment-schedules', true);
        this.api
            .getPaymentScheduleTemplates(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (templates) => {
                this.paymentScheduleTemplates = templates;
                this.setSectionLoading('payment-schedules', false);
            },
            error: (error) => {
                this.paymentScheduleTemplates = [];
                this.setSectionError('payment-schedules', this.resolveError(error, 'Unable to load payment schedule templates.'));
                this.setSectionLoading('payment-schedules', false);
            }
        });
    }
    loadTermsSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('terms')) {
            return;
        }
        this.setSectionLoading('terms', true);
        this.api
            .getTermsDocuments(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (documents) => {
                this.termsDocuments = documents;
                this.setSectionLoading('terms', false);
            },
            error: (error) => {
                this.termsDocuments = [];
                this.setSectionError('terms', this.resolveError(error, 'Unable to load terms documents.'));
                this.setSectionLoading('terms', false);
            }
        });
    }
    loadProposalTemplatesSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('proposal-templates')) {
            return;
        }
        this.setSectionLoading('proposal-templates', true);
        this.api
            .getVenueProposalTemplates(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (templates) => {
                this.proposalTemplates = templates;
                this.setSectionLoading('proposal-templates', false);
            },
            error: (error) => {
                this.proposalTemplates = [];
                this.setSectionError('proposal-templates', this.resolveError(error, 'Unable to load proposal templates.'));
                this.setSectionLoading('proposal-templates', false);
            }
        });
    }
    loadPlanningMilestonesSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('planning-milestones')) {
            return;
        }
        this.setSectionLoading('planning-milestones', true);
        this.api
            .getPlanningMilestones(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (milestones) => {
                this.planningMilestones = milestones;
                this.setSectionLoading('planning-milestones', false);
            },
            error: (error) => {
                this.planningMilestones = [];
                this.setSectionError('planning-milestones', this.resolveError(error, 'Unable to load planning milestones.'));
                this.setSectionLoading('planning-milestones', false);
            }
        });
    }
    loadReportConfigurationSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('report-configuration')) {
            return;
        }
        this.setSectionLoading('report-configuration', true);
        this.api
            .getReportConfiguration(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (config) => {
                this.reportConfigurationForm.patchValue({
                    provisionalWeightPercent: config.provisionalWeightPercent,
                    tentativeWeightPercent: config.tentativeWeightPercent,
                    openProposalWeightPercent: config.openProposalWeightPercent
                });
                this.setSectionLoading('report-configuration', false);
            },
            error: (error) => {
                this.setSectionError('report-configuration', this.resolveError(error, 'Unable to load report configuration.'));
                this.setSectionLoading('report-configuration', false);
            }
        });
    }
    loadAutomationSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('automation')) {
            return;
        }
        this.setSectionLoading('automation', true);
        this.api
            .getAutomationSettings(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (config) => {
                this.automationSettingsForm.patchValue({
                    proposalAcceptedTargetStatus: config.proposalAcceptedTargetStatus,
                    followUpInactiveDays: config.followUpInactiveDays,
                    autoArchiveEnabled: config.autoArchiveEnabled,
                    autoArchiveDays: config.autoArchiveDays
                });
                this.setSectionLoading('automation', false);
            },
            error: (error) => {
                this.setSectionError('automation', this.resolveError(error, 'Unable to load automation settings.'));
                this.setSectionLoading('automation', false);
            }
        });
    }
    loadEmailTemplatesSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('email-templates')) {
            return;
        }
        this.setSectionLoading('email-templates', true);
        this.api
            .getEmailTemplates(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (templates) => {
                this.emailTemplates = templates;
                this.setSectionLoading('email-templates', false);
            },
            error: (error) => {
                this.emailTemplates = [];
                this.setSectionError('email-templates', this.resolveError(error, 'Unable to load email templates.'));
                this.setSectionLoading('email-templates', false);
            }
        });
    }
    loadWebsiteFormsSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('website-forms')) {
            return;
        }
        this.setSectionLoading('website-forms', true);
        this.api
            .getWebsiteForms(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (forms) => {
                this.websiteForms = forms;
                this.setSectionLoading('website-forms', false);
            },
            error: (error) => {
                this.websiteForms = [];
                this.setSectionError('website-forms', this.resolveError(error, 'Unable to load website forms.'));
                this.setSectionLoading('website-forms', false);
            }
        });
    }
    loadCalendarAccountsSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('calendar-accounts')) {
            return;
        }
        this.setSectionLoading('calendar-accounts', true);
        this.api
            .getCalendarAccounts(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (accounts) => {
                this.calendarAccounts = accounts;
                this.setSectionLoading('calendar-accounts', false);
            },
            error: (error) => {
                this.calendarAccounts = [];
                this.setSectionError('calendar-accounts', this.resolveError(error, 'Unable to load calendar accounts.'));
                this.setSectionLoading('calendar-accounts', false);
            }
        });
    }
    loadTaskTemplatesSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('task-templates')) {
            return;
        }
        this.setSectionLoading('task-templates', true);
        this.api
            .getTaskTemplates(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.taskTemplates = response.templates;
                this.setSectionLoading('task-templates', false);
            },
            error: (error) => {
                this.taskTemplates = [];
                this.setSectionError('task-templates', this.resolveError(error, 'Unable to load task templates.'));
                this.setSectionLoading('task-templates', false);
            }
        });
    }
    loadReportSchedulesSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('report-schedules')) {
            return;
        }
        this.setSectionLoading('report-schedules', true);
        this.api
            .getReportSchedules(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.reportSchedules = response.items;
                this.setSectionLoading('report-schedules', false);
            },
            error: (error) => {
                this.reportSchedules = [];
                this.setSectionError('report-schedules', this.resolveError(error, 'Unable to load report schedules.'));
                this.setSectionLoading('report-schedules', false);
            }
        });
    }
    loadEmailAccountsSection(force = false) {
        if (!this.selectedVenueId) {
            return;
        }
        if (!force && this.loadedSections.has('email-accounts')) {
            return;
        }
        this.setSectionLoading('email-accounts', true);
        this.api
            .getNylasStatus()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (status) => {
                this.nylasStatus = status;
            },
            error: () => {
                this.nylasStatus = { isConfigured: false, redirectUri: '', defaultProvider: 'google' };
            }
        });
        this.api
            .getVenueEmailAccounts(this.selectedVenueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (accounts) => {
                this.emailAccounts = accounts;
                if (!this.editingEmailAccountId) {
                    this.startNewEmailAccount();
                }
                this.setSectionLoading('email-accounts', false);
            },
            error: (error) => {
                this.emailAccounts = [];
                this.setSectionError('email-accounts', this.resolveError(error, 'Unable to load venue email accounts.'));
                this.setSectionLoading('email-accounts', false);
            }
        });
    }
    patchVenueForm(profile) {
        this.venueForm.patchValue({
            name: profile.name,
            legalEntityName: profile.legalEntityName ?? '',
            addressLine1: profile.addressLine1 ?? '',
            addressLine2: profile.addressLine2 ?? '',
            city: profile.city ?? '',
            region: profile.region ?? '',
            postcode: profile.postcode ?? '',
            countryCode: profile.countryCode,
            phoneNumberE164: profile.phoneNumberE164 ?? '',
            enquiriesEmail: profile.enquiriesEmail ?? '',
            websiteUrl: profile.websiteUrl ?? '',
            vatNumber: profile.vatNumber ?? '',
            companyRegistrationNumber: profile.companyRegistrationNumber ?? '',
            logoUrl: profile.logoUrl ?? '',
            description: profile.description ?? '',
            cancellationPolicy: profile.cancellationPolicy ?? '',
            currencyCode: profile.currencyCode,
            defaultVatRate: profile.defaultVatRate,
            timeZone: profile.timeZone,
            locale: profile.locale,
            minimumBookingNoticeDays: profile.minimumBookingNoticeDays,
            defaultHoldPeriodDays: profile.defaultHoldPeriodDays,
            holdWarningDays: profile.holdWarningDays,
            holdAutoReleaseMode: profile.holdAutoReleaseMode,
            maxHoldsPerDateAndSpace: profile.maxHoldsPerDateAndSpace
        });
    }
    buildBudgetForms(rows) {
        this.budgetForms.clear();
        for (const month of this.monthNumbers) {
            const row = rows.find((item) => item.month === month);
            const targets = row?.targetsByEventType?.length
                ? row.targetsByEventType
                : this.defaultEventTypes.map((eventType) => ({
                    eventType,
                    revenueTarget: 0,
                    coversTarget: 0,
                    bookingCountTarget: 0,
                    averageSellingPriceTarget: 0
                }));
            const form = this.formBuilder.group({
                month: [month],
                overallRevenueTarget: [row?.overallRevenueTarget ?? 0, [Validators.required, Validators.min(0)]],
                currencyCode: [row?.currencyCode ?? (this.venueForm.get('currencyCode')?.value ?? 'GBP'), Validators.required],
                targetsByEventType: this.formBuilder.array(targets.map((target) => this.createBudgetTargetGroup(target)))
            });
            this.budgetForms.set(month, form);
        }
    }
    mapSpacePayload() {
        const value = this.spaceForm.getRawValue();
        return {
            name: this.requiredText(value.name),
            description: this.optionalText(value.description),
            locationText: this.optionalText(value.locationText),
            floorAreaSqm: value.floorAreaSqm === null ? null : Number(value.floorAreaSqm),
            facilitiesCsv: this.requiredText(value.facilitiesCsv),
            minimumSpendAmount: value.minimumSpendAmount === null ? null : Number(value.minimumSpendAmount),
            minimumSpendCurrencyCode: this.requiredText(value.minimumSpendCurrencyCode).toUpperCase(),
            turnaroundMinutes: Number(value.turnaroundMinutes ?? 0),
            isActive: Boolean(value.isActive),
            capacityBySetup: this.mapCapacityRules(this.spaceCapacityControls),
            pricing: this.mapPricingRules(this.spacePricingControls)
        };
    }
    mapCapacityRules(array) {
        return array.controls
            .map((control) => {
            const group = control;
            return {
                setupStyle: this.requiredText(group.get('setupStyle')?.value ?? ''),
                capacity: Number(group.get('capacity')?.value ?? 0)
            };
        })
            .filter((rule) => rule.setupStyle && rule.capacity > 0);
    }
    mapPricingRules(array) {
        return array.controls
            .map((control) => {
            const group = control;
            const dayOfWeekValue = group.get('dayOfWeek')?.value;
            return {
                rateType: this.requiredText(group.get('rateType')?.value ?? ''),
                amount: Number(group.get('amount')?.value ?? 0),
                currencyCode: this.requiredText(group.get('currencyCode')?.value ?? 'GBP').toUpperCase(),
                dayOfWeek: dayOfWeekValue ? String(dayOfWeekValue) : null
            };
        })
            .filter((rule) => rule.rateType && rule.amount >= 0);
    }
    createCapacityGroup(rule) {
        return this.formBuilder.group({
            setupStyle: [rule?.setupStyle ?? 'Banquet', Validators.required],
            capacity: [rule?.capacity ?? 80, [Validators.required, Validators.min(1)]]
        });
    }
    createPricingGroup(rule) {
        return this.formBuilder.group({
            rateType: [rule?.rateType ?? 'FullDay', Validators.required],
            amount: [rule?.amount ?? 0, [Validators.required, Validators.min(0)]],
            currencyCode: [rule?.currencyCode ?? (this.venueForm.get('currencyCode')?.value ?? 'GBP'), Validators.required],
            dayOfWeek: [rule?.dayOfWeek ?? '']
        });
    }
    createBudgetTargetGroup(target) {
        return this.formBuilder.group({
            eventType: [target?.eventType ?? '', Validators.required],
            revenueTarget: [target?.revenueTarget ?? 0, [Validators.required, Validators.min(0)]],
            coversTarget: [target?.coversTarget ?? 0, [Validators.required, Validators.min(0)]],
            bookingCountTarget: [target?.bookingCountTarget ?? 0, [Validators.required, Validators.min(0)]],
            averageSellingPriceTarget: [target?.averageSellingPriceTarget ?? 0, [Validators.required, Validators.min(0)]]
        });
    }
    replaceFormArray(target, next) {
        while (target.length > 0) {
            target.removeAt(0);
        }
        for (const group of next) {
            target.push(group);
        }
    }
    persistPaymentScheduleTemplates(successMessage) {
        if (!this.selectedVenueId) {
            return;
        }
        this.setSectionSaving('payment-schedules', true);
        this.api
            .upsertPaymentScheduleTemplates(this.selectedVenueId, this.paymentScheduleTemplates)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (templates) => {
                this.paymentScheduleTemplates = templates;
                this.setSectionSuccess('payment-schedules', successMessage);
                this.setSectionSaving('payment-schedules', false);
            },
            error: (error) => {
                this.setSectionError('payment-schedules', this.resolveError(error, 'Unable to save payment schedule templates.'));
                this.setSectionSaving('payment-schedules', false);
            }
        });
    }
    persistTermsDocuments(successMessage) {
        if (!this.selectedVenueId) {
            return;
        }
        this.setSectionSaving('terms', true);
        this.api
            .upsertTermsDocuments(this.selectedVenueId, this.termsDocuments)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (documents) => {
                this.termsDocuments = documents;
                this.setSectionSuccess('terms', successMessage);
                this.setSectionSaving('terms', false);
            },
            error: (error) => {
                this.setSectionError('terms', this.resolveError(error, 'Unable to save terms documents.'));
                this.setSectionSaving('terms', false);
            }
        });
    }
    persistProposalTemplates(successMessage) {
        if (!this.selectedVenueId) {
            return;
        }
        this.setSectionSaving('proposal-templates', true);
        this.api
            .upsertVenueProposalTemplates(this.selectedVenueId, this.proposalTemplates)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (templates) => {
                this.proposalTemplates = templates;
                this.setSectionSuccess('proposal-templates', successMessage);
                this.setSectionSaving('proposal-templates', false);
            },
            error: (error) => {
                this.setSectionError('proposal-templates', this.resolveError(error, 'Unable to save proposal templates.'));
                this.setSectionSaving('proposal-templates', false);
            }
        });
    }
    persistPlanningMilestones(successMessage) {
        if (!this.selectedVenueId) {
            return;
        }
        this.setSectionSaving('planning-milestones', true);
        this.api
            .upsertPlanningMilestones(this.selectedVenueId, this.planningMilestones)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (milestones) => {
                this.planningMilestones = milestones;
                this.setSectionSuccess('planning-milestones', successMessage);
                this.setSectionSaving('planning-milestones', false);
            },
            error: (error) => {
                this.setSectionError('planning-milestones', this.resolveError(error, 'Unable to save planning milestones.'));
                this.setSectionSaving('planning-milestones', false);
            }
        });
    }
    resetSectionMessages() {
        for (const section of this.sections) {
            this.sectionStates[section.key].error = '';
            this.sectionStates[section.key].success = '';
            this.sectionStates[section.key].loading = false;
            this.sectionStates[section.key].saving = false;
        }
    }
    setSectionLoading(section, loading) {
        this.sectionStates[section].loading = loading;
        if (loading) {
            this.sectionStates[section].error = '';
            this.sectionStates[section].success = '';
        }
    }
    setSectionSaving(section, saving) {
        this.sectionStates[section].saving = saving;
        if (saving) {
            this.sectionStates[section].error = '';
            this.sectionStates[section].success = '';
        }
    }
    setSectionError(section, message) {
        this.sectionStates[section].error = message;
        this.sectionStates[section].success = '';
    }
    setSectionSuccess(section, message) {
        this.sectionStates[section].success = message;
        this.sectionStates[section].error = '';
    }
    handleNylasMessage(event) {
        if (event.origin !== window.location.origin || !event.data || typeof event.data !== 'object') {
            return;
        }
        const payload = event.data;
        if (payload.source !== 'creventaflow-nylas') {
            return;
        }
        if (!this.selectedVenueId || (payload.venueId && payload.venueId !== this.selectedVenueId)) {
            return;
        }
        if (payload.success) {
            this.setSectionSuccess('email-accounts', payload.message ?? 'Nylas account connected.');
            this.startNewEmailAccount();
            this.loadEmailAccountsSection(true);
            return;
        }
        this.setSectionError('email-accounts', payload.message ?? 'Nylas connection failed.');
    }
    optionalText(value) {
        const text = String(value ?? '').trim();
        return text.length > 0 ? text : null;
    }
    requiredText(value) {
        return String(value ?? '').trim();
    }
    parseCsvList(value) {
        return String(value ?? '')
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
    }
    resolveError(error, fallback) {
        if (typeof error === 'object' && error !== null && 'error' in error) {
            const payload = error.error;
            if (typeof payload === 'string') {
                return payload;
            }
            if (typeof payload === 'object' && payload !== null && 'message' in payload) {
                const message = payload.message;
                if (typeof message === 'string' && message.trim()) {
                    return message;
                }
            }
        }
        return fallback;
    }
    static { this.ɵfac = function SettingsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SettingsComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SettingsComponent, selectors: [["app-settings"]], decls: 19, vars: 4, consts: [[1, "settings-page"], [1, "page-header"], [1, "layout"], ["aria-label", "Settings sections", 1, "section-list"], ["type", "button", 1, "section-card", 3, "active"], [1, "panel"], [1, "panel-header"], [1, "empty-state"], ["type", "button", 1, "section-card", 3, "click"], [1, "loading-state"], [1, "message", "error"], [1, "message", "success"], [1, "form-grid", 3, "formGroup"], [1, "card"], [1, "two-column"], [1, "form-grid", 3, "ngSubmit", "formGroup"], ["type", "text", "formControlName", "name"], ["type", "text", "formControlName", "legalEntityName"], ["type", "text", "formControlName", "addressLine1"], ["type", "text", "formControlName", "addressLine2"], ["type", "text", "formControlName", "city"], ["type", "text", "formControlName", "region"], ["type", "text", "formControlName", "postcode"], ["type", "text", "formControlName", "countryCode"], ["type", "text", "formControlName", "phoneNumberE164", "placeholder", "+447700900111"], ["type", "email", "formControlName", "enquiriesEmail"], ["type", "url", "formControlName", "websiteUrl"], ["type", "text", "formControlName", "vatNumber"], ["type", "text", "formControlName", "companyRegistrationNumber"], ["type", "url", "formControlName", "logoUrl"], ["type", "text", "formControlName", "currencyCode"], ["type", "number", "min", "0", "step", "0.01", "formControlName", "defaultVatRate"], ["type", "text", "formControlName", "timeZone"], ["type", "text", "formControlName", "locale"], ["type", "number", "min", "0", "formControlName", "minimumBookingNoticeDays"], ["type", "number", "min", "1", "formControlName", "defaultHoldPeriodDays"], ["type", "number", "min", "0", "formControlName", "holdWarningDays"], ["formControlName", "holdAutoReleaseMode"], [3, "value"], ["type", "number", "min", "1", "formControlName", "maxHoldsPerDateAndSpace"], [1, "full-width"], ["rows", "3", "formControlName", "description"], ["rows", "4", "formControlName", "cancellationPolicy"], [1, "actions", "full-width"], ["type", "submit", 1, "primary", 3, "disabled"], [1, "card-header"], ["type", "button", 1, "ghost", 3, "click"], [1, "table-wrap"], [1, "form-grid", "compact", 3, "ngSubmit", "formGroup"], ["type", "text", "formControlName", "locationText"], ["type", "number", "min", "0", "step", "0.01", "formControlName", "floorAreaSqm"], ["type", "number", "min", "0", "formControlName", "turnaroundMinutes"], ["type", "number", "min", "0", "step", "0.01", "formControlName", "minimumSpendAmount"], ["type", "text", "formControlName", "minimumSpendCurrencyCode"], ["type", "text", "formControlName", "facilitiesCsv"], [1, "full-width", "checkbox"], ["type", "checkbox", "formControlName", "isActive"], [1, "matrix-section", "full-width"], ["formArrayName", "capacityBySetup", 1, "matrix-grid"], [1, "matrix-row", 3, "formGroupName"], ["formArrayName", "pricing", 1, "matrix-grid"], [1, "matrix-row", "wide", 3, "formGroupName"], [1, "two-column", "combinations-block"], ["type", "number", "min", "0", "step", "0.01", "formControlName", "priceAmount"], ["rows", "2", "formControlName", "description"], [1, "space-picker", "full-width"], [1, "pill-grid"], [1, "pill-option"], ["type", "button", 1, "link", 3, "click"], ["colspan", "4", 1, "empty-row"], ["formControlName", "setupStyle"], ["type", "number", "min", "1", "formControlName", "capacity"], ["type", "button", 1, "icon", 3, "click"], ["formControlName", "rateType"], ["type", "number", "min", "0", "step", "0.01", "formControlName", "amount"], ["formControlName", "dayOfWeek"], ["value", ""], ["type", "checkbox", 3, "change", "checked"], [1, "inline-actions"], [1, "month-nav"], ["type", "button", 3, "active"], [1, "form-grid", "compact", 3, "formGroup"], [1, "csv-import"], ["type", "file", "accept", ".csv,text/csv", 3, "change"], ["type", "button", 1, "ghost", 3, "click", "disabled"], ["type", "button", 3, "click"], ["type", "number", "min", "0", "step", "0.01", "formControlName", "overallRevenueTarget"], ["formArrayName", "targetsByEventType", 1, "targets-table", "full-width"], ["type", "button", 1, "primary", 3, "click", "disabled"], [3, "formGroupName"], ["type", "text", "formControlName", "eventType"], ["type", "number", "min", "0", "step", "0.01", "formControlName", "revenueTarget"], ["type", "number", "min", "0", "formControlName", "coversTarget"], ["type", "number", "min", "0", "formControlName", "bookingCountTarget"], ["type", "number", "min", "0", "step", "0.01", "formControlName", "averageSellingPriceTarget"], [1, "hint"], ["type", "text", "formControlName", "milestoneName"], ["type", "text", "formControlName", "dueDateRule"], ["formControlName", "amountType"], ["value", "Percentage"], ["value", "Fixed"], ["type", "number", "min", "0.01", "step", "0.01", "formControlName", "amount"], ["type", "text", "formControlName", "acceptedMethodsCsv"], ["type", "button", 1, "link", "danger", 3, "click"], ["colspan", "6", 1, "empty-row"], ["type", "text", "formControlName", "title", "placeholder", "Wedding Terms"], ["rows", "8", "formControlName", "content"], ["colspan", "5", 1, "empty-row"], ["type", "text", "formControlName", "key", "placeholder", "wedding-premium"], ["type", "text", "formControlName", "label", "placeholder", "Wedding Premium"], ["type", "number", "min", "1", "max", "365", "formControlName", "defaultValidityDays"], ["type", "text", "formControlName", "defaultTermsVersion"], ["rows", "3", "formControlName", "defaultIntroduction"], [1, "targets-table", "full-width"], [1, "form-grid", "compact"], ["type", "text", "formControlName", "itemCategory"], ["type", "text", "formControlName", "itemDescription"], ["type", "number", "min", "0.01", "step", "0.01", "formControlName", "itemQuantity"], ["type", "text", "formControlName", "itemUnit"], ["type", "number", "min", "0", "step", "0.01", "formControlName", "itemUnitPriceExclVat"], ["type", "number", "min", "0", "step", "0.01", "formControlName", "itemVatRate"], ["type", "number", "min", "0", "step", "0.01", "formControlName", "itemDiscountPercent"], ["type", "number", "min", "0", "step", "0.01", "formControlName", "itemDiscountAmount"], ["type", "text", "formControlName", "key", "placeholder", "menus_confirmed"], ["type", "text", "formControlName", "label", "placeholder", "Menus Confirmed"], [1, "checkbox"], ["type", "checkbox", "formControlName", "isEnabled"], ["type", "number", "min", "0", "max", "100", "step", "0.01", "formControlName", "provisionalWeightPercent"], ["type", "number", "min", "0", "max", "100", "step", "0.01", "formControlName", "tentativeWeightPercent"], ["type", "number", "min", "0", "max", "100", "step", "0.01", "formControlName", "openProposalWeightPercent"], ["formControlName", "proposalAcceptedTargetStatus"], ["type", "number", "min", "1", "max", "30", "formControlName", "followUpInactiveDays"], ["type", "number", "min", "7", "max", "3650", "formControlName", "autoArchiveDays"], ["type", "checkbox", "formControlName", "autoArchiveEnabled"], ["type", "text", "formControlName", "key", "placeholder", "proposal_sent"], ["type", "text", "formControlName", "name", "placeholder", "Proposal Sent"], ["type", "text", "formControlName", "subjectTemplate", "placeholder", "Your proposal for {event_name}"], ["rows", "5", "formControlName", "bodyHtmlTemplate"], ["type", "text", "formControlName", "name", "placeholder", "Wedding Enquiry Form"], ["type", "text", "formControlName", "slug", "placeholder", "weddings"], ["type", "text", "formControlName", "successMessage"], ["type", "url", "formControlName", "redirectUrl"], ["type", "text", "formControlName", "requiredFieldsCsv"], ["type", "text", "formControlName", "optionalFieldsCsv"], ["rows", "3", "formControlName", "styleJson"], ["type", "email", "formControlName", "address"], ["type", "text", "formControlName", "provider"], ["type", "text", "formControlName", "externalCalendarId"], ["type", "text", "formControlName", "connectionStatus"], ["type", "checkbox", "formControlName", "syncProvisionalHolds"], ["type", "text", "formControlName", "triggerStatus"], ["type", "text", "formControlName", "itemTitle"], ["type", "text", "formControlName", "itemPriority"], ["type", "text", "formControlName", "itemDueDateRule"], ["type", "number", "min", "0", "formControlName", "itemDueOffsetDays"], ["rows", "2", "formControlName", "itemDescription"], ["type", "checkbox", "formControlName", "assignToEventManager"], ["type", "text", "formControlName", "reportKey"], ["type", "text", "formControlName", "frequency", "placeholder", "daily/weekly/monthly"], ["type", "text", "formControlName", "recipientsCsv", "placeholder", "ops@venue.co.uk,finance@venue.co.uk"], ["type", "datetime-local", "formControlName", "nextRunAtUtc"], ["rows", "3", "formControlName", "filtersJson"], [1, "helper-text"], ["type", "text", "formControlName", "externalAccountReference"], ["type", "checkbox", "formControlName", "useForOutbound"], ["type", "button", 1, "link", "warning"], ["type", "button", 1, "link"], ["type", "button", 1, "link", "warning", 3, "click"], [1, "two-column", "users-layout"], ["type", "text", "formControlName", "firstName"], ["type", "text", "formControlName", "lastName"], ["type", "email", "formControlName", "email"], ["formControlName", "role"], ["type", "checkbox", "formControlName", "requiresTotp"], [1, "hint", "full-width"], [1, "activity-list"], [1, "empty-row"], ["type", "button", 1, "link", "danger"]], template: function SettingsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "div")(3, "h1");
            i0.ɵɵtext(4, "Settings");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "p");
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(7, "section", 2)(8, "aside", 3);
            i0.ɵɵrepeaterCreate(9, SettingsComponent_For_10_Template, 5, 4, "button", 4, _forTrack0);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "section", 5)(12, "header", 6)(13, "h2");
            i0.ɵɵtext(14);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "p");
            i0.ɵɵtext(16);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(17, SettingsComponent_Conditional_17_Template, 5, 0, "article", 7)(18, SettingsComponent_Conditional_18_Template, 2, 1);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate1("", ctx.venueName, " configuration for operations, commercial workflows, and compliance.");
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.sections);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.activeSection.title);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.activeSection.description);
            i0.ɵɵadvance();
            i0.ɵɵconditional(!ctx.selectedVenueId ? 17 : 18);
        } }, dependencies: [ReactiveFormsModule, i1.ɵNgNoValidate, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.CheckboxControlValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.MinValidator, i1.MaxValidator, i1.FormGroupDirective, i1.FormControlName, i1.FormGroupName, i1.FormArrayName, FormsModule, DatePipe, DecimalPipe], styles: [".settings-page[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n}\n\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.72rem;\n  color: #0f172a;\n}\n\n.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.35rem 0 0;\n  color: #64748b;\n  font-size: 0.9rem;\n}\n\n.layout[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(15rem, 19rem) minmax(0, 1fr);\n  gap: 1rem;\n  align-items: start;\n}\n\n.section-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.55rem;\n  position: sticky;\n  top: 1rem;\n}\n\n.section-card[_ngcontent-%COMP%] {\n  border: 1px solid #dbe5f2;\n  border-radius: 14px;\n  background: #fff;\n  text-align: left;\n  padding: 0.75rem;\n  display: grid;\n  gap: 0.3rem;\n  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);\n}\n\n.section-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.92rem;\n  color: #0f172a;\n}\n\n.section-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  color: #64748b;\n  line-height: 1.3;\n}\n\n.section-card.active[_ngcontent-%COMP%] {\n  border-color: #93c5fd;\n  background: #eff6ff;\n}\n\n.panel[_ngcontent-%COMP%] {\n  border: 1px solid #dbe5f2;\n  border-radius: 16px;\n  background: #fff;\n  padding: 1rem;\n  box-shadow: 0 20px 35px rgba(15, 23, 42, 0.06);\n  display: grid;\n  gap: 0.9rem;\n}\n\n.panel-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #0f172a;\n}\n\n.panel-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.3rem 0 0;\n  color: #64748b;\n  font-size: 0.88rem;\n}\n\n.message[_ngcontent-%COMP%] {\n  margin: 0;\n  border-radius: 10px;\n  padding: 0.6rem 0.75rem;\n  font-size: 0.84rem;\n}\n\n.message.error[_ngcontent-%COMP%] {\n  background: #fef2f2;\n  border: 1px solid #fecaca;\n  color: #b91c1c;\n}\n\n.message.success[_ngcontent-%COMP%] {\n  background: #ecfdf3;\n  border: 1px solid #bbf7d0;\n  color: #166534;\n}\n\n.loading-state[_ngcontent-%COMP%], \n.empty-state[_ngcontent-%COMP%] {\n  border: 1px dashed #cbd5e1;\n  border-radius: 12px;\n  background: #f8fafc;\n  padding: 1rem;\n}\n\n.empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #0f172a;\n}\n\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.loading-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.35rem 0 0;\n  color: #64748b;\n}\n\n.form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.75rem;\n}\n\n.form-grid.compact[_ngcontent-%COMP%] {\n  gap: 0.65rem;\n}\n\n.form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.3rem;\n  font-size: 0.78rem;\n  color: #334155;\n  font-weight: 700;\n}\n\n.form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.form-grid[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  background: #fff;\n  padding: 0.52rem 0.62rem;\n  color: #0f172a;\n  font-size: 0.84rem;\n}\n\n.form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n\n.full-width[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n}\n\n.checkbox[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.45rem;\n}\n\n.checkbox[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 1rem;\n  height: 1rem;\n}\n\n.actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.5rem;\n}\n\nbutton[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n\nbutton.primary[_ngcontent-%COMP%], \nbutton.ghost[_ngcontent-%COMP%], \nbutton.link[_ngcontent-%COMP%], \nbutton.icon[_ngcontent-%COMP%] {\n  border-radius: 9px;\n  font-weight: 700;\n}\n\nbutton.primary[_ngcontent-%COMP%] {\n  border: 1px solid #1d4ed8;\n  background: #2563eb;\n  color: #fff;\n  padding: 0.48rem 0.8rem;\n  font-size: 0.8rem;\n}\n\nbutton.primary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n}\n\nbutton.ghost[_ngcontent-%COMP%] {\n  border: 1px solid #cbd5e1;\n  background: #f8fafc;\n  color: #334155;\n  padding: 0.35rem 0.62rem;\n  font-size: 0.76rem;\n}\n\nbutton.link[_ngcontent-%COMP%] {\n  border: none;\n  background: transparent;\n  color: #1d4ed8;\n  padding: 0;\n  font-size: 0.76rem;\n}\n\nbutton.link.danger[_ngcontent-%COMP%] {\n  color: #b91c1c;\n}\n\nbutton.link.warning[_ngcontent-%COMP%] {\n  color: #b45309;\n}\n\nbutton.icon[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  background: #fff;\n  color: #475569;\n  width: 1.7rem;\n  height: 1.7rem;\n  line-height: 1.7rem;\n  text-align: center;\n  padding: 0;\n}\n\n.card[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  border-radius: 14px;\n  background: #fff;\n  padding: 0.85rem;\n  display: grid;\n  gap: 0.75rem;\n}\n\n.card-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n\n.card-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #0f172a;\n  font-size: 1rem;\n}\n\n.helper-text[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #64748b;\n  font-size: 0.78rem;\n}\n\n.table-wrap[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  min-width: 34rem;\n}\n\nth[_ngcontent-%COMP%], \ntd[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #e2e8f0;\n  text-align: left;\n  vertical-align: top;\n  padding: 0.48rem 0.36rem;\n  font-size: 0.78rem;\n  color: #334155;\n}\n\nth[_ngcontent-%COMP%] {\n  color: #475569;\n  font-size: 0.72rem;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n\ntd[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  color: #0f172a;\n}\n\ntd[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n\n.empty-row[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #64748b;\n  font-style: italic;\n}\n\n.two-column[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.85rem;\n}\n\n.combinations-block[_ngcontent-%COMP%] {\n  margin-top: 0.85rem;\n}\n\n.matrix-section[_ngcontent-%COMP%] {\n  border: 1px dashed #cbd5e1;\n  border-radius: 12px;\n  padding: 0.65rem;\n  background: #f8fafc;\n  display: grid;\n  gap: 0.55rem;\n}\n\n.matrix-section[_ngcontent-%COMP%]   header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n\n.matrix-section[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #0f172a;\n  font-size: 0.8rem;\n}\n\n.matrix-grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.4rem;\n}\n\n.matrix-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 8rem 2rem;\n  gap: 0.35rem;\n  align-items: center;\n}\n\n.matrix-row.wide[_ngcontent-%COMP%] {\n  grid-template-columns: 1fr 8rem 5rem 9rem 2rem;\n}\n\n.pill-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.4rem;\n}\n\n.pill-option[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  border: 1px solid #cbd5e1;\n  border-radius: 999px;\n  background: #fff;\n  padding: 0.25rem 0.55rem;\n  font-size: 0.74rem;\n  color: #334155;\n}\n\n.space-picker[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], \n.targets-table[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], \n.csv-import[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #0f172a;\n  font-size: 0.82rem;\n}\n\n.targets-table[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.45rem;\n}\n\n.targets-table[_ngcontent-%COMP%]   header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n\n.targets-table[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-width: 6.5rem;\n}\n\n.month-nav[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.35rem;\n}\n\n.month-nav[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 1px solid #cbd5e1;\n  background: #fff;\n  color: #334155;\n  border-radius: 999px;\n  padding: 0.24rem 0.54rem;\n  font-size: 0.74rem;\n}\n\n.month-nav[_ngcontent-%COMP%]   button.active[_ngcontent-%COMP%] {\n  border-color: #93c5fd;\n  background: #eff6ff;\n  color: #1d4ed8;\n}\n\n.inline-actions[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n}\n\n.inline-actions[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  font-weight: 700;\n  color: #1e293b;\n}\n\n.hint[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #64748b;\n  font-size: 0.78rem;\n}\n\n.hint[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  background: #f1f5f9;\n  border: 1px solid #cbd5e1;\n  border-radius: 7px;\n  padding: 0.1rem 0.35rem;\n  color: #0f172a;\n}\n\n.csv-import[_ngcontent-%COMP%] {\n  border: 1px dashed #cbd5e1;\n  border-radius: 12px;\n  background: #f8fafc;\n  padding: 0.75rem;\n  display: grid;\n  gap: 0.5rem;\n}\n\n.users-layout[_ngcontent-%COMP%] {\n  align-items: start;\n}\n\n.activity-list[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: grid;\n  gap: 0.4rem;\n}\n\n.activity-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  background: #f8fafc;\n  padding: 0.5rem 0.6rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n\n.activity-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.1rem;\n}\n\n.activity-list[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.82rem;\n  color: #0f172a;\n}\n\n.activity-list[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.activity-list[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n  color: #64748b;\n}\n\n@media (max-width: 1180px) {\n  .layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .section-list[_ngcontent-%COMP%] {\n    position: static;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .two-column[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n\n@media (max-width: 760px) {\n  .section-list[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .matrix-row[_ngcontent-%COMP%], \n   .matrix-row.wide[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .actions[_ngcontent-%COMP%] {\n    justify-content: stretch;\n  }\n\n  .actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SettingsComponent, [{
        type: Component,
        args: [{ selector: 'app-settings', standalone: true, imports: [ReactiveFormsModule, FormsModule, DatePipe, DecimalPipe], template: "<section class=\"settings-page\">\n  <header class=\"page-header\">\n    <div>\n      <h1>Settings</h1>\n      <p>{{ venueName }} configuration for operations, commercial workflows, and compliance.</p>\n    </div>\n  </header>\n\n  <section class=\"layout\">\n    <aside class=\"section-list\" aria-label=\"Settings sections\">\n      @for (section of sections; track section.key) {\n        <button\n          type=\"button\"\n          class=\"section-card\"\n          [class.active]=\"section.key === activeSectionKey\"\n          (click)=\"setSection(section.key)\">\n          <strong>{{ section.title }}</strong>\n          <span>{{ section.description }}</span>\n        </button>\n      }\n    </aside>\n\n    <section class=\"panel\">\n      <header class=\"panel-header\">\n        <h2>{{ activeSection.title }}</h2>\n        <p>{{ activeSection.description }}</p>\n      </header>\n\n      @if (!selectedVenueId) {\n        <article class=\"empty-state\">\n          <h3>No Venue Selected</h3>\n          <p>Select a venue from the top navigation to configure settings.</p>\n        </article>\n      } @else {\n        @if (sectionStates[activeSectionKey].loading) {\n          <article class=\"loading-state\">\n            <p>Loading {{ activeSection.title.toLowerCase() }}...</p>\n          </article>\n        } @else {\n          @if (sectionStates[activeSectionKey].error) {\n            <p class=\"message error\">{{ sectionStates[activeSectionKey].error }}</p>\n          }\n          @if (sectionStates[activeSectionKey].success) {\n            <p class=\"message success\">{{ sectionStates[activeSectionKey].success }}</p>\n          }\n\n          @if (activeSectionKey === 'venue-profile') {\n            <form class=\"form-grid\" [formGroup]=\"venueForm\" (ngSubmit)=\"saveVenueProfile()\">\n              <label>\n                Venue Name\n                <input type=\"text\" formControlName=\"name\" />\n              </label>\n\n              <label>\n                Legal Entity Name\n                <input type=\"text\" formControlName=\"legalEntityName\" />\n              </label>\n\n              <label>\n                Address Line 1\n                <input type=\"text\" formControlName=\"addressLine1\" />\n              </label>\n\n              <label>\n                Address Line 2\n                <input type=\"text\" formControlName=\"addressLine2\" />\n              </label>\n\n              <label>\n                City\n                <input type=\"text\" formControlName=\"city\" />\n              </label>\n\n              <label>\n                Region/County\n                <input type=\"text\" formControlName=\"region\" />\n              </label>\n\n              <label>\n                Postcode\n                <input type=\"text\" formControlName=\"postcode\" />\n              </label>\n\n              <label>\n                Country Code\n                <input type=\"text\" formControlName=\"countryCode\" />\n              </label>\n\n              <label>\n                Enquiries Phone (E.164)\n                <input type=\"text\" formControlName=\"phoneNumberE164\" placeholder=\"+447700900111\" />\n              </label>\n\n              <label>\n                Enquiries Email\n                <input type=\"email\" formControlName=\"enquiriesEmail\" />\n              </label>\n\n              <label>\n                Website URL\n                <input type=\"url\" formControlName=\"websiteUrl\" />\n              </label>\n\n              <label>\n                VAT Number\n                <input type=\"text\" formControlName=\"vatNumber\" />\n              </label>\n\n              <label>\n                Company Registration Number\n                <input type=\"text\" formControlName=\"companyRegistrationNumber\" />\n              </label>\n\n              <label>\n                Logo URL\n                <input type=\"url\" formControlName=\"logoUrl\" />\n              </label>\n\n              <label>\n                Currency\n                <input type=\"text\" formControlName=\"currencyCode\" />\n              </label>\n\n              <label>\n                Default VAT (%)\n                <input type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"defaultVatRate\" />\n              </label>\n\n              <label>\n                Time Zone\n                <input type=\"text\" formControlName=\"timeZone\" />\n              </label>\n\n              <label>\n                Locale\n                <input type=\"text\" formControlName=\"locale\" />\n              </label>\n\n              <label>\n                Min Booking Notice (days)\n                <input type=\"number\" min=\"0\" formControlName=\"minimumBookingNoticeDays\" />\n              </label>\n\n              <label>\n                Default Hold Period (days)\n                <input type=\"number\" min=\"1\" formControlName=\"defaultHoldPeriodDays\" />\n              </label>\n\n              <label>\n                Hold Warning (days)\n                <input type=\"number\" min=\"0\" formControlName=\"holdWarningDays\" />\n              </label>\n\n              <label>\n                Hold Auto Release\n                <select formControlName=\"holdAutoReleaseMode\">\n                  @for (mode of holdAutoReleaseModes; track mode) {\n                    <option [value]=\"mode\">{{ mode }}</option>\n                  }\n                </select>\n              </label>\n\n              <label>\n                Max Holds per Date/Space\n                <input type=\"number\" min=\"1\" formControlName=\"maxHoldsPerDateAndSpace\" />\n              </label>\n\n              <label class=\"full-width\">\n                Description\n                <textarea rows=\"3\" formControlName=\"description\"></textarea>\n              </label>\n\n              <label class=\"full-width\">\n                Cancellation Policy\n                <textarea rows=\"4\" formControlName=\"cancellationPolicy\"></textarea>\n              </label>\n\n              <div class=\"actions full-width\">\n                <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates['venue-profile'].saving\">\n                  {{ sectionStates['venue-profile'].saving ? 'Saving...' : 'Save Venue Profile' }}\n                </button>\n              </div>\n            </form>\n          }\n\n          @if (activeSectionKey === 'spaces') {\n            <section class=\"two-column\">\n              <article class=\"card\">\n                <header class=\"card-header\">\n                  <h3>Spaces</h3>\n                  <button type=\"button\" class=\"ghost\" (click)=\"startNewSpace()\">New Space</button>\n                </header>\n\n                <div class=\"table-wrap\">\n                  <table>\n                    <thead>\n                      <tr>\n                        <th>Name</th>\n                        <th>Active</th>\n                        <th>Turnaround</th>\n                        <th></th>\n                      </tr>\n                    </thead>\n                    <tbody>\n                      @for (space of spaces; track space.id) {\n                        <tr>\n                          <td>\n                            <strong>{{ space.name }}</strong>\n                            <small>{{ space.locationText || 'No location' }}</small>\n                          </td>\n                          <td>{{ space.isActive ? 'Yes' : 'No' }}</td>\n                          <td>{{ space.turnaroundMinutes }} min</td>\n                          <td>\n                            <button type=\"button\" class=\"link\" (click)=\"editSpace(space)\">Edit</button>\n                          </td>\n                        </tr>\n                      }\n                      @if (spaces.length === 0) {\n                        <tr>\n                          <td colspan=\"4\" class=\"empty-row\">No spaces configured yet.</td>\n                        </tr>\n                      }\n                    </tbody>\n                  </table>\n                </div>\n              </article>\n\n              <article class=\"card\">\n                <header class=\"card-header\">\n                  <h3>{{ editingSpaceId ? 'Edit Space' : 'Create Space' }}</h3>\n                </header>\n\n                <form class=\"form-grid compact\" [formGroup]=\"spaceForm\" (ngSubmit)=\"saveSpace()\">\n                  <label>\n                    Space Name\n                    <input type=\"text\" formControlName=\"name\" />\n                  </label>\n\n                  <label>\n                    Location\n                    <input type=\"text\" formControlName=\"locationText\" />\n                  </label>\n\n                  <label>\n                    Floor Area (sqm)\n                    <input type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"floorAreaSqm\" />\n                  </label>\n\n                  <label>\n                    Turnaround (minutes)\n                    <input type=\"number\" min=\"0\" formControlName=\"turnaroundMinutes\" />\n                  </label>\n\n                  <label>\n                    Min Spend\n                    <input type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"minimumSpendAmount\" />\n                  </label>\n\n                  <label>\n                    Min Spend Currency\n                    <input type=\"text\" formControlName=\"minimumSpendCurrencyCode\" />\n                  </label>\n\n                  <label class=\"full-width\">\n                    Facilities (comma separated)\n                    <input type=\"text\" formControlName=\"facilitiesCsv\" />\n                  </label>\n\n                  <label class=\"full-width\">\n                    Description\n                    <textarea rows=\"3\" formControlName=\"description\"></textarea>\n                  </label>\n\n                  <label class=\"full-width checkbox\">\n                    <input type=\"checkbox\" formControlName=\"isActive\" />\n                    <span>Active and bookable</span>\n                  </label>\n\n                  <section class=\"matrix-section full-width\">\n                    <header>\n                      <h4>Capacity by Setup Style</h4>\n                      <button type=\"button\" class=\"ghost\" (click)=\"addSpaceCapacityRule()\">Add</button>\n                    </header>\n                    <div formArrayName=\"capacityBySetup\" class=\"matrix-grid\">\n                      @for (rule of spaceCapacityControls.controls; track $index; let i = $index) {\n                        <div [formGroupName]=\"i\" class=\"matrix-row\">\n                          <select formControlName=\"setupStyle\">\n                            @for (style of setupStyles; track style) {\n                              <option [value]=\"style\">{{ style }}</option>\n                            }\n                          </select>\n                          <input type=\"number\" min=\"1\" formControlName=\"capacity\" />\n                          <button type=\"button\" class=\"icon\" (click)=\"removeSpaceCapacityRule(i)\">&#10005;</button>\n                        </div>\n                      }\n                    </div>\n                  </section>\n\n                  <section class=\"matrix-section full-width\">\n                    <header>\n                      <h4>Pricing Rules</h4>\n                      <button type=\"button\" class=\"ghost\" (click)=\"addSpacePricingRule()\">Add</button>\n                    </header>\n                    <div formArrayName=\"pricing\" class=\"matrix-grid\">\n                      @for (rule of spacePricingControls.controls; track $index; let i = $index) {\n                        <div [formGroupName]=\"i\" class=\"matrix-row wide\">\n                          <select formControlName=\"rateType\">\n                            @for (rate of pricingRateTypes; track rate) {\n                              <option [value]=\"rate\">{{ rate }}</option>\n                            }\n                          </select>\n                          <input type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"amount\" />\n                          <input type=\"text\" formControlName=\"currencyCode\" />\n                          <select formControlName=\"dayOfWeek\">\n                            <option value=\"\">Any day</option>\n                            @for (day of dayOfWeekOptions; track day) {\n                              <option [value]=\"day\">{{ day }}</option>\n                            }\n                          </select>\n                          <button type=\"button\" class=\"icon\" (click)=\"removeSpacePricingRule(i)\">&#10005;</button>\n                        </div>\n                      }\n                    </div>\n                  </section>\n\n                  <div class=\"actions full-width\">\n                    <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates.spaces.saving\">\n                      {{ sectionStates.spaces.saving ? 'Saving...' : (editingSpaceId ? 'Update Space' : 'Create Space') }}\n                    </button>\n                  </div>\n                </form>\n              </article>\n            </section>\n\n            <section class=\"two-column combinations-block\">\n              <article class=\"card\">\n                <header class=\"card-header\">\n                  <h3>Space Combinations</h3>\n                  <button type=\"button\" class=\"ghost\" (click)=\"startNewCombination()\">New Combination</button>\n                </header>\n\n                <div class=\"table-wrap\">\n                  <table>\n                    <thead>\n                      <tr>\n                        <th>Name</th>\n                        <th>Members</th>\n                        <th>Price</th>\n                        <th></th>\n                      </tr>\n                    </thead>\n                    <tbody>\n                      @for (combination of combinations; track combination.id) {\n                        <tr>\n                          <td>{{ combination.name }}</td>\n                          <td>{{ combination.spaceIds.length }}</td>\n                          <td>\n                            @if (combination.priceAmount !== null && combination.priceAmount !== undefined) {\n                              {{ combination.currencyCode }} {{ combination.priceAmount | number: '1.2-2' }}\n                            } @else {\n                              -\n                            }\n                          </td>\n                          <td>\n                            <button type=\"button\" class=\"link\" (click)=\"editCombination(combination)\">Edit</button>\n                          </td>\n                        </tr>\n                      }\n                      @if (combinations.length === 0) {\n                        <tr>\n                          <td colspan=\"4\" class=\"empty-row\">No space combinations configured yet.</td>\n                        </tr>\n                      }\n                    </tbody>\n                  </table>\n                </div>\n              </article>\n\n              <article class=\"card\">\n                <header class=\"card-header\">\n                  <h3>{{ editingCombinationId ? 'Edit Combination' : 'Create Combination' }}</h3>\n                </header>\n\n                <form class=\"form-grid compact\" [formGroup]=\"combinationForm\" (ngSubmit)=\"saveCombination()\">\n                  <label>\n                    Combination Name\n                    <input type=\"text\" formControlName=\"name\" />\n                  </label>\n\n                  <label>\n                    Price Amount\n                    <input type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"priceAmount\" />\n                  </label>\n\n                  <label>\n                    Currency\n                    <input type=\"text\" formControlName=\"currencyCode\" />\n                  </label>\n\n                  <label class=\"full-width\">\n                    Description\n                    <textarea rows=\"2\" formControlName=\"description\"></textarea>\n                  </label>\n\n                  <section class=\"space-picker full-width\">\n                    <h4>Included Spaces</h4>\n                    <div class=\"pill-grid\">\n                      @for (space of spaces; track space.id) {\n                        <label class=\"pill-option\">\n                          <input\n                            type=\"checkbox\"\n                            [checked]=\"isCombinationSpaceSelected(space.id)\"\n                            (change)=\"toggleCombinationSpace(space.id, $event)\" />\n                          <span>{{ space.name }}</span>\n                        </label>\n                      }\n                    </div>\n                  </section>\n\n                  <section class=\"matrix-section full-width\">\n                    <header>\n                      <h4>Combined Capacity Rules</h4>\n                      <button type=\"button\" class=\"ghost\" (click)=\"addCombinationCapacityRule()\">Add</button>\n                    </header>\n                    <div formArrayName=\"capacityBySetup\" class=\"matrix-grid\">\n                      @for (rule of combinationCapacityControls.controls; track $index; let i = $index) {\n                        <div [formGroupName]=\"i\" class=\"matrix-row\">\n                          <select formControlName=\"setupStyle\">\n                            @for (style of setupStyles; track style) {\n                              <option [value]=\"style\">{{ style }}</option>\n                            }\n                          </select>\n                          <input type=\"number\" min=\"1\" formControlName=\"capacity\" />\n                          <button type=\"button\" class=\"icon\" (click)=\"removeCombinationCapacityRule(i)\">&#10005;</button>\n                        </div>\n                      }\n                    </div>\n                  </section>\n\n                  <div class=\"actions full-width\">\n                    <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates.spaces.saving\">\n                      {{ sectionStates.spaces.saving ? 'Saving...' : (editingCombinationId ? 'Update Combination' : 'Create Combination') }}\n                    </button>\n                  </div>\n                </form>\n              </article>\n            </section>\n          }\n\n          @if (activeSectionKey === 'budgets') {\n            <section class=\"card\">\n              <header class=\"card-header\">\n                <h3>Annual Budgets</h3>\n                <div class=\"inline-actions\">\n                  <button type=\"button\" class=\"ghost\" (click)=\"changeBudgetYear(-1)\">Previous</button>\n                  <span>{{ selectedBudgetYear }}</span>\n                  <button type=\"button\" class=\"ghost\" (click)=\"changeBudgetYear(1)\">Next</button>\n                </div>\n              </header>\n\n              <div class=\"month-nav\">\n                @for (month of monthNumbers; track month) {\n                  <button\n                    type=\"button\"\n                    [class.active]=\"month === selectedBudgetMonth\"\n                    (click)=\"setBudgetMonth(month)\">\n                    {{ getMonthLabel(month) }}\n                  </button>\n                }\n              </div>\n\n              @if (currentBudgetForm; as monthForm) {\n                <form [formGroup]=\"monthForm\" class=\"form-grid compact\">\n                  <label>\n                    Overall Revenue Target\n                    <input type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"overallRevenueTarget\" />\n                  </label>\n\n                  <label>\n                    Currency\n                    <input type=\"text\" formControlName=\"currencyCode\" />\n                  </label>\n\n                  <section class=\"targets-table full-width\" formArrayName=\"targetsByEventType\">\n                    <header>\n                      <h4>Targets by Event Type</h4>\n                      <button type=\"button\" class=\"ghost\" (click)=\"addBudgetTargetRow(selectedBudgetMonth)\">Add Row</button>\n                    </header>\n                    <table>\n                      <thead>\n                        <tr>\n                          <th>Event Type</th>\n                          <th>Revenue</th>\n                          <th>Covers</th>\n                          <th>Bookings</th>\n                          <th>ASP</th>\n                          <th></th>\n                        </tr>\n                      </thead>\n                      <tbody>\n                        @if (getBudgetTargetsArray(selectedBudgetMonth); as targetsArray) {\n                          @for (target of targetsArray.controls; track $index; let i = $index) {\n                            <tr [formGroupName]=\"i\">\n                              <td><input type=\"text\" formControlName=\"eventType\" /></td>\n                              <td><input type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"revenueTarget\" /></td>\n                              <td><input type=\"number\" min=\"0\" formControlName=\"coversTarget\" /></td>\n                              <td><input type=\"number\" min=\"0\" formControlName=\"bookingCountTarget\" /></td>\n                              <td><input type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"averageSellingPriceTarget\" /></td>\n                              <td>\n                                <button type=\"button\" class=\"icon\" (click)=\"removeBudgetTargetRow(selectedBudgetMonth, i)\">&#10005;</button>\n                              </td>\n                            </tr>\n                          }\n                        }\n                      </tbody>\n                    </table>\n                  </section>\n\n                  <div class=\"actions full-width\">\n                    <button\n                      type=\"button\"\n                      class=\"primary\"\n                      [disabled]=\"sectionStates.budgets.saving\"\n                      (click)=\"saveBudgetMonth(selectedBudgetMonth)\">\n                      {{ sectionStates.budgets.saving ? 'Saving...' : ('Save ' + getMonthLabel(selectedBudgetMonth) + ' Budget') }}\n                    </button>\n                  </div>\n                </form>\n              }\n\n              <section class=\"csv-import\">\n                <h4>Import from CSV</h4>\n                <p>Header format: `year,month,overallRevenueTarget,currency,eventType,revenueTarget,coversTarget,bookingCountTarget,aspTarget`.</p>\n                <div class=\"inline-actions\">\n                  <input type=\"file\" accept=\".csv,text/csv\" (change)=\"onBudgetCsvSelected($event)\" />\n                  <button\n                    type=\"button\"\n                    class=\"ghost\"\n                    [disabled]=\"!selectedBudgetCsvFile || sectionStates.budgets.saving\"\n                    (click)=\"uploadBudgetCsv()\">\n                    Import CSV\n                  </button>\n                </div>\n              </section>\n            </section>\n          }\n\n          @if (activeSectionKey === 'payment-schedules') {\n            <section class=\"card\">\n              <header class=\"card-header\">\n                <h3>Payment Schedule Templates</h3>\n              </header>\n\n              <p class=\"hint\">Templates are stored per venue and used as defaults when events are confirmed.</p>\n\n              <form class=\"form-grid compact\" [formGroup]=\"paymentTemplateForm\" (ngSubmit)=\"savePaymentScheduleTemplate()\">\n                <label>\n                  Template Name\n                  <input type=\"text\" formControlName=\"name\" />\n                </label>\n\n                <label>\n                  Event Type\n                  <input type=\"text\" formControlName=\"eventType\" />\n                </label>\n\n                <label>\n                  Milestone Name\n                  <input type=\"text\" formControlName=\"milestoneName\" />\n                </label>\n\n                <label>\n                  Due Date Rule\n                  <input type=\"text\" formControlName=\"dueDateRule\" />\n                </label>\n\n                <label>\n                  Amount Type\n                  <select formControlName=\"amountType\">\n                    <option value=\"Percentage\">Percentage</option>\n                    <option value=\"Fixed\">Fixed</option>\n                  </select>\n                </label>\n\n                <label>\n                  Amount\n                  <input type=\"number\" min=\"0.01\" step=\"0.01\" formControlName=\"amount\" />\n                </label>\n\n                <label class=\"full-width\">\n                  Accepted Methods (comma separated)\n                  <input type=\"text\" formControlName=\"acceptedMethodsCsv\" />\n                </label>\n\n                <div class=\"actions full-width\">\n                  <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates['payment-schedules'].saving\">\n                    {{ sectionStates['payment-schedules'].saving ? 'Saving...' : 'Save Template' }}\n                  </button>\n                </div>\n              </form>\n\n              <div class=\"table-wrap\">\n                <table>\n                  <thead>\n                    <tr>\n                      <th>Name</th>\n                      <th>Event Type</th>\n                      <th>Milestone</th>\n                      <th>Amount</th>\n                      <th>Updated</th>\n                      <th></th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    @for (template of paymentScheduleTemplates; track template.id) {\n                      <tr>\n                        <td>{{ template.name }}</td>\n                        <td>{{ template.eventType }}</td>\n                        <td>{{ template.milestones[0]?.name || '-' }}</td>\n                        <td>\n                          @if ((template.milestones[0]?.amountType || '') === 'Percentage') {\n                            {{ template.milestones[0]?.amount | number: '1.0-2' }}%\n                          } @else {\n                            {{ venueForm.get('currencyCode')?.value || 'GBP' }} {{ template.milestones[0]?.amount | number: '1.2-2' }}\n                          }\n                        </td>\n                        <td>-</td>\n                        <td>\n                          <button type=\"button\" class=\"link danger\" (click)=\"deletePaymentScheduleTemplate(template.id)\">Delete</button>\n                        </td>\n                      </tr>\n                    }\n                    @if (paymentScheduleTemplates.length === 0) {\n                      <tr>\n                        <td colspan=\"6\" class=\"empty-row\">No payment schedule templates yet.</td>\n                      </tr>\n                    }\n                  </tbody>\n                </table>\n              </div>\n            </section>\n          }\n\n          @if (activeSectionKey === 'terms') {\n            <section class=\"card\">\n              <header class=\"card-header\">\n                <h3>Terms & Conditions</h3>\n              </header>\n\n              <p class=\"hint\">Terms are stored per venue with version history for proposal and contract use.</p>\n\n              <form class=\"form-grid compact\" [formGroup]=\"termsForm\" (ngSubmit)=\"saveTermsDocument()\">\n                <label>\n                  Terms Title\n                  <input type=\"text\" formControlName=\"title\" placeholder=\"Wedding Terms\" />\n                </label>\n\n                <label>\n                  Event Type\n                  <input type=\"text\" formControlName=\"eventType\" />\n                </label>\n\n                <label class=\"full-width\">\n                  Terms Content\n                  <textarea rows=\"8\" formControlName=\"content\"></textarea>\n                </label>\n\n                <div class=\"actions full-width\">\n                  <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates.terms.saving\">\n                    {{ sectionStates.terms.saving ? 'Saving...' : 'Save Terms Version' }}\n                  </button>\n                </div>\n              </form>\n\n              <div class=\"table-wrap\">\n                <table>\n                  <thead>\n                    <tr>\n                      <th>Title</th>\n                      <th>Version</th>\n                      <th>Event Type</th>\n                      <th>Updated</th>\n                      <th></th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    @for (doc of termsDocuments; track doc.id) {\n                      <tr>\n                        <td>{{ doc.title }}</td>\n                        <td>{{ doc.version }}</td>\n                        <td>{{ doc.eventType }}</td>\n                        <td>{{ doc.updatedAtUtc | date: 'dd/MM/yyyy HH:mm' }}</td>\n                        <td>\n                          <button type=\"button\" class=\"link danger\" (click)=\"deleteTermsDocument(doc.id)\">Delete</button>\n                        </td>\n                      </tr>\n                    }\n                    @if (termsDocuments.length === 0) {\n                      <tr>\n                        <td colspan=\"5\" class=\"empty-row\">No terms documents yet.</td>\n                      </tr>\n                    }\n                  </tbody>\n                </table>\n              </div>\n            </section>\n          }\n\n          @if (activeSectionKey === 'proposal-templates') {\n            <section class=\"card\">\n              <header class=\"card-header\">\n                <h3>Proposal Templates</h3>\n              </header>\n\n              <form class=\"form-grid compact\" [formGroup]=\"proposalTemplateForm\" (ngSubmit)=\"saveProposalTemplate()\">\n                <label>\n                  Template Key\n                  <input type=\"text\" formControlName=\"key\" placeholder=\"wedding-premium\" />\n                </label>\n\n                <label>\n                  Label\n                  <input type=\"text\" formControlName=\"label\" placeholder=\"Wedding Premium\" />\n                </label>\n\n                <label>\n                  Event Type\n                  <input type=\"text\" formControlName=\"eventType\" />\n                </label>\n\n                <label>\n                  Validity Days\n                  <input type=\"number\" min=\"1\" max=\"365\" formControlName=\"defaultValidityDays\" />\n                </label>\n\n                <label>\n                  Default Terms Version\n                  <input type=\"text\" formControlName=\"defaultTermsVersion\" />\n                </label>\n\n                <label class=\"full-width\">\n                  Introduction\n                  <textarea rows=\"3\" formControlName=\"defaultIntroduction\"></textarea>\n                </label>\n\n                <section class=\"targets-table full-width\">\n                  <header>\n                    <h4>Default Line Item</h4>\n                  </header>\n                  <div class=\"form-grid compact\">\n                    <label>\n                      Category\n                      <input type=\"text\" formControlName=\"itemCategory\" />\n                    </label>\n                    <label>\n                      Description\n                      <input type=\"text\" formControlName=\"itemDescription\" />\n                    </label>\n                    <label>\n                      Quantity\n                      <input type=\"number\" min=\"0.01\" step=\"0.01\" formControlName=\"itemQuantity\" />\n                    </label>\n                    <label>\n                      Unit\n                      <input type=\"text\" formControlName=\"itemUnit\" />\n                    </label>\n                    <label>\n                      Unit Price (ex VAT)\n                      <input type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"itemUnitPriceExclVat\" />\n                    </label>\n                    <label>\n                      VAT Rate (%)\n                      <input type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"itemVatRate\" />\n                    </label>\n                    <label>\n                      Discount (%)\n                      <input type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"itemDiscountPercent\" />\n                    </label>\n                    <label>\n                      Discount Amount\n                      <input type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"itemDiscountAmount\" />\n                    </label>\n                  </div>\n                </section>\n\n                <div class=\"actions full-width\">\n                  <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates['proposal-templates'].saving\">\n                    {{ sectionStates['proposal-templates'].saving ? 'Saving...' : 'Save Template' }}\n                  </button>\n                </div>\n              </form>\n\n              <div class=\"table-wrap\">\n                <table>\n                  <thead>\n                    <tr>\n                      <th>Key</th>\n                      <th>Label</th>\n                      <th>Event Type</th>\n                      <th>Validity</th>\n                      <th></th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    @for (template of proposalTemplates; track template.key) {\n                      <tr>\n                        <td>{{ template.key }}</td>\n                        <td>{{ template.label }}</td>\n                        <td>{{ template.eventType }}</td>\n                        <td>{{ template.defaultValidityDays }} days</td>\n                        <td>\n                          <button type=\"button\" class=\"link danger\" (click)=\"deleteProposalTemplate(template.key)\">Delete</button>\n                        </td>\n                      </tr>\n                    }\n                    @if (proposalTemplates.length === 0) {\n                      <tr>\n                        <td colspan=\"5\" class=\"empty-row\">No proposal templates configured yet.</td>\n                      </tr>\n                    }\n                  </tbody>\n                </table>\n              </div>\n            </section>\n          }\n\n          @if (activeSectionKey === 'planning-milestones') {\n            <section class=\"card\">\n              <header class=\"card-header\">\n                <h3>Planning Milestones</h3>\n              </header>\n\n              <form class=\"form-grid compact\" [formGroup]=\"planningMilestoneForm\" (ngSubmit)=\"savePlanningMilestone()\">\n                <label>\n                  Key\n                  <input type=\"text\" formControlName=\"key\" placeholder=\"menus_confirmed\" />\n                </label>\n\n                <label>\n                  Label\n                  <input type=\"text\" formControlName=\"label\" placeholder=\"Menus Confirmed\" />\n                </label>\n\n                <label class=\"checkbox\">\n                  <input type=\"checkbox\" formControlName=\"isEnabled\" />\n                  <span>Enabled</span>\n                </label>\n\n                <div class=\"actions full-width\">\n                  <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates['planning-milestones'].saving\">\n                    {{ sectionStates['planning-milestones'].saving ? 'Saving...' : 'Add Milestone' }}\n                  </button>\n                </div>\n              </form>\n\n              <div class=\"table-wrap\">\n                <table>\n                  <thead>\n                    <tr>\n                      <th>Key</th>\n                      <th>Label</th>\n                      <th>Enabled</th>\n                      <th></th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    @for (milestone of planningMilestones; track milestone.key) {\n                      <tr>\n                        <td>{{ milestone.key }}</td>\n                        <td>{{ milestone.label }}</td>\n                        <td>{{ milestone.isEnabled ? 'Yes' : 'No' }}</td>\n                        <td>\n                          <button type=\"button\" class=\"link danger\" (click)=\"deletePlanningMilestone(milestone.key)\">Delete</button>\n                        </td>\n                      </tr>\n                    }\n                    @if (planningMilestones.length === 0) {\n                      <tr>\n                        <td colspan=\"4\" class=\"empty-row\">No planning milestones configured yet.</td>\n                      </tr>\n                    }\n                  </tbody>\n                </table>\n              </div>\n            </section>\n          }\n\n          @if (activeSectionKey === 'report-configuration') {\n            <section class=\"card\">\n              <header class=\"card-header\">\n                <h3>Report Conversion Weights</h3>\n              </header>\n\n              <form class=\"form-grid compact\" [formGroup]=\"reportConfigurationForm\" (ngSubmit)=\"saveReportConfiguration()\">\n                <label>\n                  Provisional Weight (%)\n                  <input type=\"number\" min=\"0\" max=\"100\" step=\"0.01\" formControlName=\"provisionalWeightPercent\" />\n                </label>\n\n                <label>\n                  Tentative Weight (%)\n                  <input type=\"number\" min=\"0\" max=\"100\" step=\"0.01\" formControlName=\"tentativeWeightPercent\" />\n                </label>\n\n                <label>\n                  Open Proposal Weight (%)\n                  <input type=\"number\" min=\"0\" max=\"100\" step=\"0.01\" formControlName=\"openProposalWeightPercent\" />\n                </label>\n\n                <div class=\"actions full-width\">\n                  <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates['report-configuration'].saving\">\n                    {{ sectionStates['report-configuration'].saving ? 'Saving...' : 'Save Report Configuration' }}\n                  </button>\n                </div>\n              </form>\n            </section>\n          }\n\n          @if (activeSectionKey === 'automation') {\n            <section class=\"card\">\n              <header class=\"card-header\">\n                <h3>Automation Settings</h3>\n              </header>\n\n              <form class=\"form-grid compact\" [formGroup]=\"automationSettingsForm\" (ngSubmit)=\"saveAutomationSettings()\">\n                <label>\n                  Proposal Accepted Target Status\n                  <select formControlName=\"proposalAcceptedTargetStatus\">\n                    @for (status of proposalAcceptedStatuses; track status) {\n                      <option [value]=\"status\">{{ status }}</option>\n                    }\n                  </select>\n                </label>\n\n                <label>\n                  Follow-up Inactive Days\n                  <input type=\"number\" min=\"1\" max=\"30\" formControlName=\"followUpInactiveDays\" />\n                </label>\n\n                <label>\n                  Auto-Archive Days\n                  <input type=\"number\" min=\"7\" max=\"3650\" formControlName=\"autoArchiveDays\" />\n                </label>\n\n                <label class=\"checkbox\">\n                  <input type=\"checkbox\" formControlName=\"autoArchiveEnabled\" />\n                  <span>Enable Auto-Archive</span>\n                </label>\n\n                <div class=\"actions full-width\">\n                  <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates.automation.saving\">\n                    {{ sectionStates.automation.saving ? 'Saving...' : 'Save Automation Settings' }}\n                  </button>\n                </div>\n              </form>\n            </section>\n          }\n\n          @if (activeSectionKey === 'email-templates') {\n            <section class=\"card\">\n              <header class=\"card-header\">\n                <h3>Email Templates</h3>\n              </header>\n\n              <form class=\"form-grid compact\" [formGroup]=\"emailTemplateForm\" (ngSubmit)=\"saveEmailTemplate()\">\n                <label>\n                  Template Key\n                  <input type=\"text\" formControlName=\"key\" placeholder=\"proposal_sent\" />\n                </label>\n\n                <label>\n                  Template Name\n                  <input type=\"text\" formControlName=\"name\" placeholder=\"Proposal Sent\" />\n                </label>\n\n                <label class=\"full-width\">\n                  Subject Template\n                  <input type=\"text\" formControlName=\"subjectTemplate\" placeholder=\"Your proposal for {event_name}\" />\n                </label>\n\n                <label class=\"full-width\">\n                  HTML Body Template\n                  <textarea rows=\"5\" formControlName=\"bodyHtmlTemplate\"></textarea>\n                </label>\n\n                <label class=\"checkbox\">\n                  <input type=\"checkbox\" formControlName=\"isActive\" />\n                  <span>Active</span>\n                </label>\n\n                <div class=\"actions full-width\">\n                  <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates['email-templates'].saving\">\n                    {{ sectionStates['email-templates'].saving ? 'Saving...' : 'Save Template' }}\n                  </button>\n                </div>\n              </form>\n\n              <div class=\"table-wrap\">\n                <table>\n                  <thead>\n                    <tr>\n                      <th>Key</th>\n                      <th>Name</th>\n                      <th>Subject</th>\n                      <th>Active</th>\n                      <th></th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    @for (template of emailTemplates; track template.key) {\n                      <tr>\n                        <td>{{ template.key }}</td>\n                        <td>{{ template.name }}</td>\n                        <td>{{ template.subjectTemplate }}</td>\n                        <td>{{ template.isActive ? 'Yes' : 'No' }}</td>\n                        <td>\n                          <button type=\"button\" class=\"link danger\" (click)=\"deleteEmailTemplate(template.key)\">Delete</button>\n                        </td>\n                      </tr>\n                    }\n                    @if (emailTemplates.length === 0) {\n                      <tr>\n                        <td colspan=\"5\" class=\"empty-row\">No email templates configured yet.</td>\n                      </tr>\n                    }\n                  </tbody>\n                </table>\n              </div>\n            </section>\n          }\n\n          @if (activeSectionKey === 'website-forms') {\n            <section class=\"card\">\n              <header class=\"card-header\">\n                <h3>Website Forms</h3>\n              </header>\n\n              <form class=\"form-grid compact\" [formGroup]=\"websiteFormForm\" (ngSubmit)=\"saveWebsiteForm()\">\n                <label>\n                  Form Name\n                  <input type=\"text\" formControlName=\"name\" placeholder=\"Wedding Enquiry Form\" />\n                </label>\n\n                <label>\n                  Slug\n                  <input type=\"text\" formControlName=\"slug\" placeholder=\"weddings\" />\n                </label>\n\n                <label class=\"full-width\">\n                  Success Message\n                  <input type=\"text\" formControlName=\"successMessage\" />\n                </label>\n\n                <label>\n                  Redirect URL\n                  <input type=\"url\" formControlName=\"redirectUrl\" />\n                </label>\n\n                <label>\n                  Required Fields (CSV)\n                  <input type=\"text\" formControlName=\"requiredFieldsCsv\" />\n                </label>\n\n                <label class=\"full-width\">\n                  Optional Fields (CSV)\n                  <input type=\"text\" formControlName=\"optionalFieldsCsv\" />\n                </label>\n\n                <label class=\"full-width\">\n                  Style JSON\n                  <textarea rows=\"3\" formControlName=\"styleJson\"></textarea>\n                </label>\n\n                <label class=\"checkbox\">\n                  <input type=\"checkbox\" formControlName=\"isActive\" />\n                  <span>Active</span>\n                </label>\n\n                <div class=\"actions full-width\">\n                  <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates['website-forms'].saving\">\n                    {{ sectionStates['website-forms'].saving ? 'Saving...' : 'Save Website Form' }}\n                  </button>\n                </div>\n              </form>\n\n              <div class=\"table-wrap\">\n                <table>\n                  <thead>\n                    <tr>\n                      <th>Name</th>\n                      <th>Slug</th>\n                      <th>Active</th>\n                      <th></th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    @for (form of websiteForms; track form.id) {\n                      <tr>\n                        <td>{{ form.name }}</td>\n                        <td>{{ form.slug }}</td>\n                        <td>{{ form.isActive ? 'Yes' : 'No' }}</td>\n                        <td>\n                          <button type=\"button\" class=\"link\" (click)=\"editWebsiteForm(form)\">Edit</button>\n                          <button type=\"button\" class=\"link danger\" (click)=\"deleteWebsiteForm(form.id)\">Delete</button>\n                        </td>\n                      </tr>\n                    }\n                    @if (websiteForms.length === 0) {\n                      <tr>\n                        <td colspan=\"4\" class=\"empty-row\">No website forms configured yet.</td>\n                      </tr>\n                    }\n                  </tbody>\n                </table>\n              </div>\n            </section>\n          }\n\n          @if (activeSectionKey === 'calendar-accounts') {\n            <section class=\"card\">\n              <header class=\"card-header\">\n                <h3>Calendar Accounts</h3>\n              </header>\n\n              <form class=\"form-grid compact\" [formGroup]=\"calendarAccountForm\" (ngSubmit)=\"saveCalendarAccount()\">\n                <label>\n                  Account Address\n                  <input type=\"email\" formControlName=\"address\" />\n                </label>\n\n                <label>\n                  Provider\n                  <input type=\"text\" formControlName=\"provider\" />\n                </label>\n\n                <label>\n                  External Calendar ID\n                  <input type=\"text\" formControlName=\"externalCalendarId\" />\n                </label>\n\n                <label>\n                  Connection Status\n                  <input type=\"text\" formControlName=\"connectionStatus\" />\n                </label>\n\n                <label class=\"checkbox\">\n                  <input type=\"checkbox\" formControlName=\"isActive\" />\n                  <span>Active</span>\n                </label>\n\n                <label class=\"checkbox\">\n                  <input type=\"checkbox\" formControlName=\"syncProvisionalHolds\" />\n                  <span>Sync provisional holds</span>\n                </label>\n\n                <div class=\"actions full-width\">\n                  <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates['calendar-accounts'].saving\">\n                    {{ sectionStates['calendar-accounts'].saving ? 'Saving...' : 'Save Calendar Account' }}\n                  </button>\n                </div>\n              </form>\n\n              <div class=\"table-wrap\">\n                <table>\n                  <thead>\n                    <tr>\n                      <th>Address</th>\n                      <th>Provider</th>\n                      <th>Status</th>\n                      <th></th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    @for (account of calendarAccounts; track account.id) {\n                      <tr>\n                        <td>{{ account.address }}</td>\n                        <td>{{ account.provider }}</td>\n                        <td>{{ account.connectionStatus }}</td>\n                        <td>\n                          <button type=\"button\" class=\"link\" (click)=\"editCalendarAccount(account)\">Edit</button>\n                          <button type=\"button\" class=\"link danger\" (click)=\"deleteCalendarAccount(account.id)\">Delete</button>\n                        </td>\n                      </tr>\n                    }\n                    @if (calendarAccounts.length === 0) {\n                      <tr>\n                        <td colspan=\"4\" class=\"empty-row\">No calendar accounts configured yet.</td>\n                      </tr>\n                    }\n                  </tbody>\n                </table>\n              </div>\n            </section>\n          }\n\n          @if (activeSectionKey === 'task-templates') {\n            <section class=\"card\">\n              <header class=\"card-header\">\n                <h3>Task Templates</h3>\n              </header>\n\n              <form class=\"form-grid compact\" [formGroup]=\"taskTemplateForm\" (ngSubmit)=\"saveTaskTemplate()\">\n                <label>\n                  Template Name\n                  <input type=\"text\" formControlName=\"name\" />\n                </label>\n\n                <label>\n                  Event Type\n                  <input type=\"text\" formControlName=\"eventType\" />\n                </label>\n\n                <label>\n                  Trigger Status\n                  <input type=\"text\" formControlName=\"triggerStatus\" />\n                </label>\n\n                <label>\n                  Task Title\n                  <input type=\"text\" formControlName=\"itemTitle\" />\n                </label>\n\n                <label>\n                  Priority\n                  <input type=\"text\" formControlName=\"itemPriority\" />\n                </label>\n\n                <label>\n                  Due Rule\n                  <input type=\"text\" formControlName=\"itemDueDateRule\" />\n                </label>\n\n                <label>\n                  Due Offset Days\n                  <input type=\"number\" min=\"0\" formControlName=\"itemDueOffsetDays\" />\n                </label>\n\n                <label class=\"full-width\">\n                  Description\n                  <textarea rows=\"2\" formControlName=\"itemDescription\"></textarea>\n                </label>\n\n                <label class=\"checkbox\">\n                  <input type=\"checkbox\" formControlName=\"assignToEventManager\" />\n                  <span>Assign to event manager</span>\n                </label>\n\n                <div class=\"actions full-width\">\n                  <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates['task-templates'].saving\">\n                    {{ sectionStates['task-templates'].saving ? 'Saving...' : 'Save Task Template' }}\n                  </button>\n                </div>\n              </form>\n\n              <div class=\"table-wrap\">\n                <table>\n                  <thead>\n                    <tr>\n                      <th>Name</th>\n                      <th>Event Type</th>\n                      <th>Trigger</th>\n                      <th></th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    @for (template of taskTemplates; track template.id) {\n                      <tr>\n                        <td>{{ template.name }}</td>\n                        <td>{{ template.eventType }}</td>\n                        <td>{{ template.triggerStatus }}</td>\n                        <td>\n                          <button type=\"button\" class=\"link\" (click)=\"editTaskTemplate(template)\">Edit</button>\n                          <button type=\"button\" class=\"link danger\" (click)=\"deleteTaskTemplate(template.id)\">Delete</button>\n                        </td>\n                      </tr>\n                    }\n                    @if (taskTemplates.length === 0) {\n                      <tr>\n                        <td colspan=\"4\" class=\"empty-row\">No task templates configured yet.</td>\n                      </tr>\n                    }\n                  </tbody>\n                </table>\n              </div>\n            </section>\n          }\n\n          @if (activeSectionKey === 'report-schedules') {\n            <section class=\"card\">\n              <header class=\"card-header\">\n                <h3>Report Schedules</h3>\n              </header>\n\n              <form class=\"form-grid compact\" [formGroup]=\"reportScheduleForm\" (ngSubmit)=\"saveReportSchedule()\">\n                <label>\n                  Name\n                  <input type=\"text\" formControlName=\"name\" />\n                </label>\n\n                <label>\n                  Report Key\n                  <input type=\"text\" formControlName=\"reportKey\" />\n                </label>\n\n                <label>\n                  Frequency\n                  <input type=\"text\" formControlName=\"frequency\" placeholder=\"daily/weekly/monthly\" />\n                </label>\n\n                <label class=\"full-width\">\n                  Recipients (CSV)\n                  <input type=\"text\" formControlName=\"recipientsCsv\" placeholder=\"ops@venue.co.uk,finance@venue.co.uk\" />\n                </label>\n\n                <label>\n                  Next Run UTC\n                  <input type=\"datetime-local\" formControlName=\"nextRunAtUtc\" />\n                </label>\n\n                <label class=\"checkbox\">\n                  <input type=\"checkbox\" formControlName=\"isActive\" />\n                  <span>Active</span>\n                </label>\n\n                <label class=\"full-width\">\n                  Filters JSON\n                  <textarea rows=\"3\" formControlName=\"filtersJson\"></textarea>\n                </label>\n\n                <div class=\"actions full-width\">\n                  <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates['report-schedules'].saving\">\n                    {{ sectionStates['report-schedules'].saving ? 'Saving...' : 'Save Report Schedule' }}\n                  </button>\n                </div>\n              </form>\n\n              <div class=\"table-wrap\">\n                <table>\n                  <thead>\n                    <tr>\n                      <th>Name</th>\n                      <th>Report</th>\n                      <th>Frequency</th>\n                      <th>Active</th>\n                      <th></th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    @for (schedule of reportSchedules; track schedule.id) {\n                      <tr>\n                        <td>{{ schedule.name }}</td>\n                        <td>{{ schedule.reportKey }}</td>\n                        <td>{{ schedule.frequency }}</td>\n                        <td>{{ schedule.isActive ? 'Yes' : 'No' }}</td>\n                        <td>\n                          <button type=\"button\" class=\"link\" (click)=\"editReportSchedule(schedule)\">Edit</button>\n                          <button type=\"button\" class=\"link danger\" (click)=\"deleteReportScheduleItem(schedule.id)\">Delete</button>\n                        </td>\n                      </tr>\n                    }\n                    @if (reportSchedules.length === 0) {\n                      <tr>\n                        <td colspan=\"5\" class=\"empty-row\">No report schedules configured yet.</td>\n                      </tr>\n                    }\n                  </tbody>\n                </table>\n              </div>\n            </section>\n          }\n\n          @if (activeSectionKey === 'email-accounts') {\n            <section class=\"two-column\">\n              <article class=\"card\">\n                <header class=\"card-header\">\n                  <h3>Connected Email Accounts</h3>\n                  <button type=\"button\" class=\"primary\" (click)=\"connectNylas()\" [disabled]=\"sectionStates['email-accounts'].saving || !nylasStatus?.isConfigured\">\n                    Connect with Nylas\n                  </button>\n                </header>\n                <p class=\"helper-text\">\n                  @if (nylasStatus?.isConfigured) {\n                    Nylas integration is configured. Connect Google or Microsoft inboxes for this venue.\n                  } @else {\n                    Nylas integration is not configured on the API yet. Set Nylas keys in server appsettings before connecting.\n                  }\n                </p>\n\n                <div class=\"table-wrap\">\n                  <table>\n                    <thead>\n                      <tr>\n                        <th>Address</th>\n                        <th>Provider</th>\n                        <th>Status</th>\n                        <th>Outbound</th>\n                        <th></th>\n                      </tr>\n                    </thead>\n                    <tbody>\n                      @for (account of emailAccounts; track account.id) {\n                        <tr>\n                          <td>{{ account.address }}</td>\n                          <td>{{ account.provider }}</td>\n                          <td>{{ account.connectionStatus }}</td>\n                          <td>{{ account.useForOutbound ? 'Yes' : 'No' }}</td>\n                          <td>\n                            <button type=\"button\" class=\"link\" (click)=\"editEmailAccount(account)\">Edit</button>\n                            @if (account.provider === 'Nylas' && account.connectionStatus !== 'disconnected') {\n                              <button type=\"button\" class=\"link warning\" (click)=\"disconnectNylas(account)\">Disconnect</button>\n                            } @else if (account.provider === 'Nylas') {\n                              <button type=\"button\" class=\"link\" (click)=\"connectNylas(account.address)\">Reconnect</button>\n                            }\n                            <button type=\"button\" class=\"link danger\" (click)=\"deleteEmailAccount(account.id)\">Delete</button>\n                          </td>\n                        </tr>\n                      }\n                      @if (emailAccounts.length === 0) {\n                        <tr>\n                          <td colspan=\"5\" class=\"empty-row\">No email accounts configured yet.</td>\n                        </tr>\n                      }\n                    </tbody>\n                  </table>\n                </div>\n              </article>\n\n              <article class=\"card\">\n                <header class=\"card-header\">\n                  <h3>{{ editingEmailAccountId ? 'Edit Email Account' : 'Add Email Account' }}</h3>\n                  <button type=\"button\" class=\"ghost\" (click)=\"startNewEmailAccount()\">New</button>\n                </header>\n\n                <form class=\"form-grid compact\" [formGroup]=\"emailAccountForm\" (ngSubmit)=\"saveEmailAccount()\">\n                  <label>\n                    Address\n                    <input type=\"email\" formControlName=\"address\" />\n                  </label>\n\n                  <label>\n                    Provider\n                    <input type=\"text\" formControlName=\"provider\" />\n                  </label>\n\n                  <label class=\"full-width\">\n                    External Reference\n                    <input type=\"text\" formControlName=\"externalAccountReference\" />\n                  </label>\n\n                  <label class=\"checkbox\">\n                    <input type=\"checkbox\" formControlName=\"isActive\" />\n                    <span>Active</span>\n                  </label>\n\n                  <label class=\"checkbox\">\n                    <input type=\"checkbox\" formControlName=\"useForOutbound\" />\n                    <span>Use for outbound</span>\n                  </label>\n\n                  <div class=\"actions full-width\">\n                    <button type=\"button\" class=\"ghost\" (click)=\"connectNylasFromForm()\" [disabled]=\"sectionStates['email-accounts'].saving || !nylasStatus?.isConfigured\">\n                      Connect Nylas for this address\n                    </button>\n                    <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates['email-accounts'].saving\">\n                      {{ sectionStates['email-accounts'].saving ? 'Saving...' : (editingEmailAccountId ? 'Update Account' : 'Add Account') }}\n                    </button>\n                  </div>\n                </form>\n              </article>\n            </section>\n          }\n\n          @if (activeSectionKey === 'users') {\n            <section class=\"two-column users-layout\">\n              <article class=\"card\">\n                <header class=\"card-header\">\n                  <h3>Invite User</h3>\n                </header>\n\n                <form class=\"form-grid compact\" [formGroup]=\"inviteForm\" (ngSubmit)=\"inviteUser()\">\n                  <label>\n                    First Name\n                    <input type=\"text\" formControlName=\"firstName\" />\n                  </label>\n\n                  <label>\n                    Last Name\n                    <input type=\"text\" formControlName=\"lastName\" />\n                  </label>\n\n                  <label>\n                    Email\n                    <input type=\"email\" formControlName=\"email\" />\n                  </label>\n\n                  <label>\n                    Phone (optional)\n                    <input type=\"text\" formControlName=\"phoneNumberE164\" placeholder=\"+447700900111\" />\n                  </label>\n\n                  <label>\n                    Role\n                    <select formControlName=\"role\">\n                      @for (role of roleOptions; track role) {\n                        <option [value]=\"role\">{{ role }}</option>\n                      }\n                    </select>\n                  </label>\n\n                  <label class=\"checkbox\">\n                    <input type=\"checkbox\" formControlName=\"requiresTotp\" />\n                    <span>Require TOTP setup</span>\n                  </label>\n\n                  <div class=\"actions full-width\">\n                    <button type=\"submit\" class=\"primary\" [disabled]=\"sectionStates.users.saving\">\n                      {{ sectionStates.users.saving ? 'Sending...' : 'Send Invitation' }}\n                    </button>\n                  </div>\n\n                  @if (inviteDebugToken) {\n                    <p class=\"hint full-width\">\n                      Dev invite token: <code>{{ inviteDebugToken }}</code>\n                    </p>\n                  }\n                </form>\n              </article>\n\n              <article class=\"card\">\n                <header class=\"card-header\">\n                  <h3>Users for Selected Venue</h3>\n                </header>\n\n                <div class=\"table-wrap\">\n                  <table>\n                    <thead>\n                      <tr>\n                        <th>Name</th>\n                        <th>Email</th>\n                        <th>Role</th>\n                        <th>Status</th>\n                        <th></th>\n                      </tr>\n                    </thead>\n                    <tbody>\n                      @for (user of users; track user.id) {\n                        <tr>\n                          <td>{{ user.firstName }} {{ user.lastName }}</td>\n                          <td>{{ user.email }}</td>\n                          <td>{{ getUserRoleForSelectedVenue(user) }}</td>\n                          <td>{{ user.isActive ? 'Active' : 'Inactive' }}</td>\n                          <td>\n                            @if (user.isActive) {\n                              <button type=\"button\" class=\"link danger\" (click)=\"toggleUserActive(user, false)\">Deactivate</button>\n                            } @else {\n                              <button type=\"button\" class=\"link\" (click)=\"toggleUserActive(user, true)\">Activate</button>\n                            }\n                          </td>\n                        </tr>\n                      }\n                      @if (users.length === 0) {\n                        <tr>\n                          <td colspan=\"5\" class=\"empty-row\">No users assigned to this venue.</td>\n                        </tr>\n                      }\n                    </tbody>\n                  </table>\n                </div>\n              </article>\n            </section>\n\n            <section class=\"card\">\n              <header class=\"card-header\">\n                <h3>Recent User Activity</h3>\n              </header>\n\n              <ul class=\"activity-list\">\n                @for (entry of userActivity; track entry.id) {\n                  <li>\n                    <div>\n                      <strong>{{ entry.actionType }}</strong>\n                      <small>{{ entry.entityType }} \u00B7 {{ entry.entityId }}</small>\n                    </div>\n                    <span>{{ entry.createdAtUtc | date: 'dd/MM/yyyy HH:mm' }}</span>\n                  </li>\n                }\n                @if (userActivity.length === 0) {\n                  <li class=\"empty-row\">No recent activity available.</li>\n                }\n              </ul>\n            </section>\n          }\n        }\n      }\n    </section>\n  </section>\n</section>\n", styles: [".settings-page {\n  display: grid;\n  gap: 1rem;\n}\n\n.page-header h1 {\n  margin: 0;\n  font-size: 1.72rem;\n  color: #0f172a;\n}\n\n.page-header p {\n  margin: 0.35rem 0 0;\n  color: #64748b;\n  font-size: 0.9rem;\n}\n\n.layout {\n  display: grid;\n  grid-template-columns: minmax(15rem, 19rem) minmax(0, 1fr);\n  gap: 1rem;\n  align-items: start;\n}\n\n.section-list {\n  display: grid;\n  gap: 0.55rem;\n  position: sticky;\n  top: 1rem;\n}\n\n.section-card {\n  border: 1px solid #dbe5f2;\n  border-radius: 14px;\n  background: #fff;\n  text-align: left;\n  padding: 0.75rem;\n  display: grid;\n  gap: 0.3rem;\n  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);\n}\n\n.section-card strong {\n  font-size: 0.92rem;\n  color: #0f172a;\n}\n\n.section-card span {\n  font-size: 0.78rem;\n  color: #64748b;\n  line-height: 1.3;\n}\n\n.section-card.active {\n  border-color: #93c5fd;\n  background: #eff6ff;\n}\n\n.panel {\n  border: 1px solid #dbe5f2;\n  border-radius: 16px;\n  background: #fff;\n  padding: 1rem;\n  box-shadow: 0 20px 35px rgba(15, 23, 42, 0.06);\n  display: grid;\n  gap: 0.9rem;\n}\n\n.panel-header h2 {\n  margin: 0;\n  color: #0f172a;\n}\n\n.panel-header p {\n  margin: 0.3rem 0 0;\n  color: #64748b;\n  font-size: 0.88rem;\n}\n\n.message {\n  margin: 0;\n  border-radius: 10px;\n  padding: 0.6rem 0.75rem;\n  font-size: 0.84rem;\n}\n\n.message.error {\n  background: #fef2f2;\n  border: 1px solid #fecaca;\n  color: #b91c1c;\n}\n\n.message.success {\n  background: #ecfdf3;\n  border: 1px solid #bbf7d0;\n  color: #166534;\n}\n\n.loading-state,\n.empty-state {\n  border: 1px dashed #cbd5e1;\n  border-radius: 12px;\n  background: #f8fafc;\n  padding: 1rem;\n}\n\n.empty-state h3 {\n  margin: 0;\n  color: #0f172a;\n}\n\n.empty-state p,\n.loading-state p {\n  margin: 0.35rem 0 0;\n  color: #64748b;\n}\n\n.form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.75rem;\n}\n\n.form-grid.compact {\n  gap: 0.65rem;\n}\n\n.form-grid label {\n  display: grid;\n  gap: 0.3rem;\n  font-size: 0.78rem;\n  color: #334155;\n  font-weight: 700;\n}\n\n.form-grid input,\n.form-grid select,\n.form-grid textarea {\n  width: 100%;\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  background: #fff;\n  padding: 0.52rem 0.62rem;\n  color: #0f172a;\n  font-size: 0.84rem;\n}\n\n.form-grid textarea {\n  resize: vertical;\n}\n\n.full-width {\n  grid-column: 1 / -1;\n}\n\n.checkbox {\n  display: flex;\n  align-items: center;\n  gap: 0.45rem;\n}\n\n.checkbox input {\n  width: 1rem;\n  height: 1rem;\n}\n\n.actions {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.5rem;\n}\n\nbutton {\n  cursor: pointer;\n}\n\nbutton.primary,\nbutton.ghost,\nbutton.link,\nbutton.icon {\n  border-radius: 9px;\n  font-weight: 700;\n}\n\nbutton.primary {\n  border: 1px solid #1d4ed8;\n  background: #2563eb;\n  color: #fff;\n  padding: 0.48rem 0.8rem;\n  font-size: 0.8rem;\n}\n\nbutton.primary:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n}\n\nbutton.ghost {\n  border: 1px solid #cbd5e1;\n  background: #f8fafc;\n  color: #334155;\n  padding: 0.35rem 0.62rem;\n  font-size: 0.76rem;\n}\n\nbutton.link {\n  border: none;\n  background: transparent;\n  color: #1d4ed8;\n  padding: 0;\n  font-size: 0.76rem;\n}\n\nbutton.link.danger {\n  color: #b91c1c;\n}\n\nbutton.link.warning {\n  color: #b45309;\n}\n\nbutton.icon {\n  border: 1px solid #e2e8f0;\n  background: #fff;\n  color: #475569;\n  width: 1.7rem;\n  height: 1.7rem;\n  line-height: 1.7rem;\n  text-align: center;\n  padding: 0;\n}\n\n.card {\n  border: 1px solid #e2e8f0;\n  border-radius: 14px;\n  background: #fff;\n  padding: 0.85rem;\n  display: grid;\n  gap: 0.75rem;\n}\n\n.card-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n\n.card-header h3 {\n  margin: 0;\n  color: #0f172a;\n  font-size: 1rem;\n}\n\n.helper-text {\n  margin: 0;\n  color: #64748b;\n  font-size: 0.78rem;\n}\n\n.table-wrap {\n  overflow-x: auto;\n}\n\ntable {\n  width: 100%;\n  border-collapse: collapse;\n  min-width: 34rem;\n}\n\nth,\ntd {\n  border-bottom: 1px solid #e2e8f0;\n  text-align: left;\n  vertical-align: top;\n  padding: 0.48rem 0.36rem;\n  font-size: 0.78rem;\n  color: #334155;\n}\n\nth {\n  color: #475569;\n  font-size: 0.72rem;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n\ntd strong {\n  display: block;\n  color: #0f172a;\n}\n\ntd small {\n  color: #64748b;\n}\n\n.empty-row {\n  text-align: center;\n  color: #64748b;\n  font-style: italic;\n}\n\n.two-column {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.85rem;\n}\n\n.combinations-block {\n  margin-top: 0.85rem;\n}\n\n.matrix-section {\n  border: 1px dashed #cbd5e1;\n  border-radius: 12px;\n  padding: 0.65rem;\n  background: #f8fafc;\n  display: grid;\n  gap: 0.55rem;\n}\n\n.matrix-section header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n\n.matrix-section h4 {\n  margin: 0;\n  color: #0f172a;\n  font-size: 0.8rem;\n}\n\n.matrix-grid {\n  display: grid;\n  gap: 0.4rem;\n}\n\n.matrix-row {\n  display: grid;\n  grid-template-columns: 1fr 8rem 2rem;\n  gap: 0.35rem;\n  align-items: center;\n}\n\n.matrix-row.wide {\n  grid-template-columns: 1fr 8rem 5rem 9rem 2rem;\n}\n\n.pill-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.4rem;\n}\n\n.pill-option {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  border: 1px solid #cbd5e1;\n  border-radius: 999px;\n  background: #fff;\n  padding: 0.25rem 0.55rem;\n  font-size: 0.74rem;\n  color: #334155;\n}\n\n.space-picker h4,\n.targets-table h4,\n.csv-import h4 {\n  margin: 0;\n  color: #0f172a;\n  font-size: 0.82rem;\n}\n\n.targets-table {\n  display: grid;\n  gap: 0.45rem;\n}\n\n.targets-table header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n\n.targets-table input {\n  min-width: 6.5rem;\n}\n\n.month-nav {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.35rem;\n}\n\n.month-nav button {\n  border: 1px solid #cbd5e1;\n  background: #fff;\n  color: #334155;\n  border-radius: 999px;\n  padding: 0.24rem 0.54rem;\n  font-size: 0.74rem;\n}\n\n.month-nav button.active {\n  border-color: #93c5fd;\n  background: #eff6ff;\n  color: #1d4ed8;\n}\n\n.inline-actions {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n}\n\n.inline-actions span {\n  font-size: 0.8rem;\n  font-weight: 700;\n  color: #1e293b;\n}\n\n.hint {\n  margin: 0;\n  color: #64748b;\n  font-size: 0.78rem;\n}\n\n.hint code {\n  background: #f1f5f9;\n  border: 1px solid #cbd5e1;\n  border-radius: 7px;\n  padding: 0.1rem 0.35rem;\n  color: #0f172a;\n}\n\n.csv-import {\n  border: 1px dashed #cbd5e1;\n  border-radius: 12px;\n  background: #f8fafc;\n  padding: 0.75rem;\n  display: grid;\n  gap: 0.5rem;\n}\n\n.users-layout {\n  align-items: start;\n}\n\n.activity-list {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: grid;\n  gap: 0.4rem;\n}\n\n.activity-list li {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  background: #f8fafc;\n  padding: 0.5rem 0.6rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n\n.activity-list li div {\n  display: grid;\n  gap: 0.1rem;\n}\n\n.activity-list strong {\n  font-size: 0.82rem;\n  color: #0f172a;\n}\n\n.activity-list small,\n.activity-list span {\n  font-size: 0.72rem;\n  color: #64748b;\n}\n\n@media (max-width: 1180px) {\n  .layout {\n    grid-template-columns: 1fr;\n  }\n\n  .section-list {\n    position: static;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .two-column {\n    grid-template-columns: 1fr;\n  }\n}\n\n@media (max-width: 760px) {\n  .section-list {\n    grid-template-columns: 1fr;\n  }\n\n  .form-grid {\n    grid-template-columns: 1fr;\n  }\n\n  .matrix-row,\n  .matrix-row.wide {\n    grid-template-columns: 1fr;\n  }\n\n  .actions {\n    justify-content: stretch;\n  }\n\n  .actions button {\n    width: 100%;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SettingsComponent, { className: "SettingsComponent", filePath: "src/app/pages/settings/settings.component.ts", lineNumber: 72 }); })();
//# sourceMappingURL=settings.component.js.map