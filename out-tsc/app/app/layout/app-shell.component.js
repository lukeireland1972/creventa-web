import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _c0 = a0 => ({ exact: a0 });
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.label;
const _forTrack2 = ($index, $item) => $item.type;
const _forTrack3 = ($index, $item) => $item.entityId;
const _forTrack4 = ($index, $item) => $item.spaceId;
const _forTrack5 = ($index, $item) => $item.recordId;
function AppShellComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 66);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeMobileNav()); });
    i0.ɵɵelementEnd();
} }
function AppShellComponent_For_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 8);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const venue_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", venue_r3.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(venue_r3.name);
} }
function AppShellComponent_For_22_Conditional_0_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "em", 70);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r4.badge);
} }
function AppShellComponent_For_22_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 67)(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(3, AppShellComponent_For_22_Conditional_0_Conditional_3_Template, 2, 1, "em", 70);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵattribute("title", item_r4.disabledReason || "Unavailable");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r4.label);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r4.badge ? 3 : -1);
} }
function AppShellComponent_For_22_Conditional_1_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "em", 70);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r4.badge);
} }
function AppShellComponent_For_22_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "a", 71);
    i0.ɵɵlistener("click", function AppShellComponent_For_22_Conditional_1_Template_a_click_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeMobileNav()); });
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(3, AppShellComponent_For_22_Conditional_1_Conditional_3_Template, 2, 1, "em", 70);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("routerLink", item_r4.route)("routerLinkActiveOptions", i0.ɵɵpureFunction1(4, _c0, item_r4.exact));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r4.label);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r4.badge ? 3 : -1);
} }
function AppShellComponent_For_22_Conditional_2_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "em", 70);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r4.badge);
} }
function AppShellComponent_For_22_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "a", 72);
    i0.ɵɵlistener("click", function AppShellComponent_For_22_Conditional_2_Template_a_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeMobileNav()); });
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(3, AppShellComponent_For_22_Conditional_2_Conditional_3_Template, 2, 1, "em", 70);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("href", item_r4.externalUrl, i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r4.label);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r4.badge ? 3 : -1);
} }
function AppShellComponent_For_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, AppShellComponent_For_22_Conditional_0_Template, 4, 3, "a", 67)(1, AppShellComponent_For_22_Conditional_1_Template, 4, 6, "a", 68)(2, AppShellComponent_For_22_Conditional_2_Template, 4, 3, "a", 69);
} if (rf & 2) {
    const item_r4 = ctx.$implicit;
    i0.ɵɵconditional(item_r4.disabled ? 0 : item_r4.route ? 1 : item_r4.externalUrl ? 2 : -1);
} }
function AppShellComponent_Conditional_23_For_5_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 67)(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r7 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵattribute("title", item_r7.disabledReason || "Unavailable");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r7.label);
} }
function AppShellComponent_Conditional_23_For_5_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "a", 71);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_23_For_5_Conditional_1_Template_a_click_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.closeMobileNav()); });
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r7 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("routerLink", item_r7.route)("routerLinkActiveOptions", i0.ɵɵpureFunction1(3, _c0, item_r7.exact));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r7.label);
} }
function AppShellComponent_Conditional_23_For_5_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "a", 72);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_23_For_5_Conditional_2_Template_a_click_0_listener() { i0.ɵɵrestoreView(_r9); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.closeMobileNav()); });
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r7 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("href", item_r7.externalUrl, i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r7.label);
} }
function AppShellComponent_Conditional_23_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, AppShellComponent_Conditional_23_For_5_Conditional_0_Template, 3, 2, "a", 67)(1, AppShellComponent_Conditional_23_For_5_Conditional_1_Template, 3, 5, "a", 68)(2, AppShellComponent_Conditional_23_For_5_Conditional_2_Template, 3, 2, "a", 69);
} if (rf & 2) {
    const item_r7 = ctx.$implicit;
    i0.ɵɵconditional(item_r7.disabled ? 0 : item_r7.route ? 1 : item_r7.externalUrl ? 2 : -1);
} }
function AppShellComponent_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 10)(1, "p", 11);
    i0.ɵɵtext(2, "Reports");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "nav", 12);
    i0.ɵɵrepeaterCreate(4, AppShellComponent_Conditional_23_For_5_Template, 3, 1, null, null, _forTrack1);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.reportNavItems);
} }
function AppShellComponent_Conditional_24_For_5_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "a", 71);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_24_For_5_Template_a_click_0_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeMobileNav()); });
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r11 = ctx.$implicit;
    i0.ɵɵproperty("routerLink", item_r11.route)("routerLinkActiveOptions", i0.ɵɵpureFunction1(3, _c0, item_r11.exact));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r11.label);
} }
function AppShellComponent_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 10)(1, "p", 11);
    i0.ɵɵtext(2, "Administration");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "nav", 12);
    i0.ɵɵrepeaterCreate(4, AppShellComponent_Conditional_24_For_5_Template, 3, 5, "a", 68, _forTrack1);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.adminNavItems);
} }
function AppShellComponent_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 73);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_40_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleMobileNav($event)); });
    i0.ɵɵtext(1, " \u2630 ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵattribute("aria-expanded", ctx_r1.isMobileNavOpen);
} }
function AppShellComponent_Conditional_53_Conditional_5_Conditional_1_For_3_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_5_Conditional_1_For_3_Template_button_click_0_listener() { const query_r15 = i0.ɵɵrestoreView(_r14).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.useRecentSearch(query_r15)); });
    i0.ɵɵelementStart(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const query_r15 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(query_r15);
} }
function AppShellComponent_Conditional_53_Conditional_5_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 91);
    i0.ɵɵtext(1, "Recent searches");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(2, AppShellComponent_Conditional_53_Conditional_5_Conditional_1_For_3_Template, 3, 1, "button", 92, i0.ɵɵrepeaterTrackByIdentity);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.recentSearches);
} }
function AppShellComponent_Conditional_53_Conditional_5_For_3_For_3_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const result_r17 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(result_r17.secondaryText);
} }
function AppShellComponent_Conditional_53_Conditional_5_For_3_For_3_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_5_For_3_For_3_Template_button_click_0_listener() { const result_r17 = i0.ɵɵrestoreView(_r16).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.openSearchResult(result_r17)); });
    i0.ɵɵelementStart(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(3, AppShellComponent_Conditional_53_Conditional_5_For_3_For_3_Conditional_3_Template, 2, 1, "span");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const result_r17 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(result_r17.primaryText);
    i0.ɵɵadvance();
    i0.ɵɵconditional(result_r17.secondaryText ? 3 : -1);
} }
function AppShellComponent_Conditional_53_Conditional_5_For_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 91);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(2, AppShellComponent_Conditional_53_Conditional_5_For_3_For_3_Template, 4, 2, "button", 92, _forTrack3);
} if (rf & 2) {
    const group_r18 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(group_r18.type);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(group_r18.results);
} }
function AppShellComponent_Conditional_53_Conditional_5_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 90);
    i0.ɵɵtext(1, "No results found.");
    i0.ɵɵelementEnd();
} }
function AppShellComponent_Conditional_53_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 78);
    i0.ɵɵconditionalCreate(1, AppShellComponent_Conditional_53_Conditional_5_Conditional_1_Template, 4, 0);
    i0.ɵɵrepeaterCreate(2, AppShellComponent_Conditional_53_Conditional_5_For_3_Template, 4, 1, null, null, _forTrack2);
    i0.ɵɵconditionalCreate(4, AppShellComponent_Conditional_53_Conditional_5_Conditional_4_Template, 2, 0, "p", 90);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.searchQuery.trim().length < 3 && ctx_r1.recentSearches.length > 0 ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.searchGroups);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.searchQuery.trim().length >= 3 && ctx_r1.searchGroups.length === 0 ? 4 : -1);
} }
function AppShellComponent_Conditional_53_Conditional_9_For_4_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "em");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r20 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r20.status);
} }
function AppShellComponent_Conditional_53_Conditional_9_For_4_Template(rf, ctx) { if (rf & 1) {
    const _r19 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 95);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_9_For_4_Template_button_click_0_listener() { const item_r20 = i0.ɵɵrestoreView(_r19).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.openRecentItem(item_r20)); });
    i0.ɵɵelementStart(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(5, AppShellComponent_Conditional_53_Conditional_9_For_4_Conditional_5_Template, 2, 1, "em");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r20 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r20.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r20.secondaryLine);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r20.status ? 5 : -1);
} }
function AppShellComponent_Conditional_53_Conditional_9_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 90);
    i0.ɵɵtext(1, "No recent enquiries.");
    i0.ɵɵelementEnd();
} }
function AppShellComponent_Conditional_53_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 81)(1, "div", 94);
    i0.ɵɵtext(2, "Recently viewed");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(3, AppShellComponent_Conditional_53_Conditional_9_For_4_Template, 6, 3, "button", null, _forTrack3);
    i0.ɵɵconditionalCreate(5, AppShellComponent_Conditional_53_Conditional_9_Conditional_5_Template, 2, 0, "p", 90);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.recentItems);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.recentItems.length === 0 ? 5 : -1);
} }
function AppShellComponent_Conditional_53_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 84);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.unreadNotifications);
} }
function AppShellComponent_Conditional_53_Conditional_14_For_7_Template(rf, ctx) { if (rf & 1) {
    const _r22 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_14_For_7_Template_button_click_0_listener() { const item_r23 = i0.ɵɵrestoreView(_r22).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.markNotificationRead(item_r23)); });
    i0.ɵɵelementStart(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "em");
    i0.ɵɵtext(6);
    i0.ɵɵpipe(7, "date");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r23 = ctx.$implicit;
    i0.ɵɵclassProp("unread", !item_r23.isRead);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r23.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r23.body);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(7, 5, item_r23.createdAtUtc, "dd/MM HH:mm"));
} }
function AppShellComponent_Conditional_53_Conditional_14_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 90);
    i0.ɵɵtext(1, "No notifications.");
    i0.ɵɵelementEnd();
} }
function AppShellComponent_Conditional_53_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    const _r21 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 85)(1, "div", 96)(2, "span");
    i0.ɵɵtext(3, "Notifications");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_14_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r21); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.markAllNotificationsRead()); });
    i0.ɵɵtext(5, "Mark all read");
    i0.ɵɵelementEnd()();
    i0.ɵɵrepeaterCreate(6, AppShellComponent_Conditional_53_Conditional_14_For_7_Template, 8, 8, "button", 97, _forTrack0);
    i0.ɵɵconditionalCreate(8, AppShellComponent_Conditional_53_Conditional_14_Conditional_8_Template, 2, 0, "p", 90);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(ctx_r1.notifications);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.notifications.length === 0 ? 8 : -1);
} }
function AppShellComponent_Conditional_53_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    const _r24 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 88)(1, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openAdmin()); });
    i0.ɵɵtext(2, "Administration");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("venue-profile")); });
    i0.ɵɵtext(4, "Venue Profile");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("spaces")); });
    i0.ɵɵtext(6, "Spaces & Combinations");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("budgets")); });
    i0.ɵɵtext(8, "Budgets & Targets");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("payment-schedules")); });
    i0.ɵɵtext(10, "Payment Schedules");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("terms")); });
    i0.ɵɵtext(12, "Terms & Conditions");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_13_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("proposal-templates")); });
    i0.ɵɵtext(14, "Proposal Templates");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("planning-milestones")); });
    i0.ɵɵtext(16, "Planning Milestones");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_17_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("report-configuration")); });
    i0.ɵɵtext(18, "Report Configuration");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_19_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("automation")); });
    i0.ɵɵtext(20, "Automation");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_21_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("email-templates")); });
    i0.ɵɵtext(22, "Email Templates");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_23_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("website-forms")); });
    i0.ɵɵtext(24, "Website Forms");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_25_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("calendar-accounts")); });
    i0.ɵɵtext(26, "Calendar Accounts");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_27_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("task-templates")); });
    i0.ɵɵtext(28, "Task Templates");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_29_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("report-schedules")); });
    i0.ɵɵtext(30, "Report Schedules");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_31_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("email-accounts")); });
    i0.ɵɵtext(32, "Email Accounts");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "button", 93);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Conditional_18_Template_button_click_33_listener() { i0.ɵɵrestoreView(_r24); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openSettingsSection("users")); });
    i0.ɵɵtext(34, "Users & Roles");
    i0.ɵɵelementEnd()();
} }
function AppShellComponent_Conditional_53_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 74);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Template_div_click_0_listener($event) { i0.ɵɵrestoreView(_r13); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(1, "form", 75);
    i0.ɵɵlistener("submit", function AppShellComponent_Conditional_53_Template_form_submit_1_listener($event) { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.submitSearch($event)); });
    i0.ɵɵelementStart(2, "span", 76);
    i0.ɵɵtext(3, "\uD83D\uDD0D");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "input", 77);
    i0.ɵɵlistener("ngModelChange", function AppShellComponent_Conditional_53_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onSearchInput($event)); })("focus", function AppShellComponent_Conditional_53_Template_input_focus_4_listener($event) { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onSearchFocus($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(5, AppShellComponent_Conditional_53_Conditional_5_Template, 5, 2, "div", 78);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 79);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Template_div_click_6_listener($event) { i0.ɵɵrestoreView(_r13); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(7, "button", 80);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleRecent()); });
    i0.ɵɵtext(8, "\uD83D\uDD51");
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(9, AppShellComponent_Conditional_53_Conditional_9_Template, 6, 1, "div", 81);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 82);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Template_div_click_10_listener($event) { i0.ɵɵrestoreView(_r13); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(11, "button", 83);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Template_button_click_11_listener($event) { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleNotifications($event)); });
    i0.ɵɵtext(12, "\uD83D\uDD14");
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(13, AppShellComponent_Conditional_53_Conditional_13_Template, 2, 1, "span", 84);
    i0.ɵɵconditionalCreate(14, AppShellComponent_Conditional_53_Conditional_14_Template, 9, 1, "div", 85);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "div", 86);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Template_div_click_15_listener($event) { i0.ɵɵrestoreView(_r13); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(16, "button", 87);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Template_button_click_16_listener($event) { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleSettings($event)); });
    i0.ɵɵtext(17, "\u2699");
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(18, AppShellComponent_Conditional_53_Conditional_18_Template, 35, 0, "div", 88);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "button", 89);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_53_Template_button_click_19_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openDrawer()); });
    i0.ɵɵtext(20, "+ New Enquiry");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.searchQuery);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isSearchOpen ? 5 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.isRecentOpen ? 9 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.unreadNotifications > 0 ? 13 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isNotificationsOpen ? 14 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.isSettingsOpen ? 18 : -1);
} }
function AppShellComponent_Conditional_59_Template(rf, ctx) { if (rf & 1) {
    const _r25 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 98);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_59_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r25); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeDrawer()); });
    i0.ɵɵelementEnd();
} }
function AppShellComponent_Conditional_70_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 37);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.submissionError);
} }
function AppShellComponent_Conditional_209_For_4_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 99);
    i0.ɵɵtext(1, "Available");
    i0.ɵɵelementEnd();
} }
function AppShellComponent_Conditional_209_For_4_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 100);
    i0.ɵɵtext(1, "Busy");
    i0.ɵɵelementEnd();
} }
function AppShellComponent_Conditional_209_For_4_For_7_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const event_r26 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", event_r26.enquiryStatus, " \u00B7 ", event_r26.covers, " covers");
} }
function AppShellComponent_Conditional_209_For_4_For_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 101)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "date");
    i0.ɵɵpipe(6, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(7, AppShellComponent_Conditional_209_For_4_For_7_Conditional_7_Template, 2, 2, "span");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const event_r26 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(event_r26.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate3("", event_r26.recordType, " \u00B7 ", i0.ɵɵpipeBind2(5, 5, event_r26.startUtc, "HH:mm"), "-", i0.ɵɵpipeBind2(6, 8, event_r26.endUtc, "HH:mm"));
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(event_r26.enquiryStatus ? 7 : -1);
} }
function AppShellComponent_Conditional_209_For_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article")(1, "header")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(4, AppShellComponent_Conditional_209_For_4_Conditional_4_Template, 2, 0, "span", 99)(5, AppShellComponent_Conditional_209_For_4_Conditional_5_Template, 2, 0, "span", 100);
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(6, AppShellComponent_Conditional_209_For_4_For_7_Template, 8, 11, "div", 101, _forTrack5);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r27 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(group_r27.spaceName);
    i0.ɵɵadvance();
    i0.ɵɵconditional(group_r27.isAvailable ? 4 : 5);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(group_r27.events);
} }
function AppShellComponent_Conditional_209_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 62)(1, "h3");
    i0.ɵɵtext(2, "Same-date availability");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(3, AppShellComponent_Conditional_209_For_4_Template, 8, 2, "article", null, _forTrack4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.availability.spaces);
} }
export class AppShellComponent {
    constructor() {
        this.formBuilder = new FormBuilder();
        this.api = inject(ApiService);
        this.auth = inject(AuthService);
        this.destroyRef = inject(DestroyRef);
        this.router = inject(Router);
        this.isDrawerOpen = false;
        this.isSubmitting = false;
        this.submissionError = '';
        this.showValidation = false;
        this.isRecentOpen = false;
        this.isSettingsOpen = false;
        this.isNotificationsOpen = false;
        this.isSearchOpen = false;
        this.isMobileNavOpen = false;
        this.venues = [];
        this.selectedVenueId = null;
        this.recentItems = [];
        this.availability = null;
        this.notifications = [];
        this.unreadNotifications = 0;
        this.searchQuery = '';
        this.searchGroups = [];
        this.recentSearches = [];
        this.searchDebounceTimer = null;
        this.navItems = [];
        this.enquiryForm = this.formBuilder.group({
            contactFirstName: ['', Validators.required],
            contactLastName: ['', Validators.required],
            contactEmail: ['', [Validators.required, Validators.email]],
            contactPhoneNumberE164: ['+44', [Validators.required, Validators.pattern(/^\+[1-9]\d{7,14}$/)]],
            companyName: [''],
            marketingConsent: [false],
            eventType: ['Wedding', Validators.required],
            eventName: [''],
            eventDate: ['', Validators.required],
            eventTime: ['12:00'],
            eventStyle: ['3-Course Dinner'],
            setupStyle: ['Banquet'],
            guestsExpected: [80, [Validators.required, Validators.min(1)]],
            budgetMinAmount: [null],
            budgetMaxAmount: [null],
            sourceType: ['Phone', Validators.required],
            sourceDetail: [''],
            leadQuality: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
            hasFlexibleDates: [false],
            flexibleDateNotes: [''],
            specialRequirements: [''],
            internalNotes: ['']
        });
    }
    get operationsOnly() {
        return this.auth.isOperationsOnly();
    }
    get displayName() {
        return this.auth.session?.fullName ?? 'User';
    }
    get initials() {
        const name = this.displayName.trim();
        const parts = name.split(' ');
        if (parts.length === 1) {
            return (parts[0][0] ?? 'U').toUpperCase();
        }
        return `${parts[0][0] ?? 'U'}${parts[parts.length - 1][0] ?? 'S'}`.toUpperCase();
    }
    get selectedVenueName() {
        if (!this.selectedVenueId) {
            return 'Venue';
        }
        return this.venues.find((venue) => venue.id === this.selectedVenueId)?.name ?? 'Venue';
    }
    get currentSectionLabel() {
        const url = this.router.url.split('?')[0] || '/';
        const matched = this.navItems
            .filter((item) => !!item.route)
            .sort((left, right) => (right.route?.length ?? 0) - (left.route?.length ?? 0))
            .find((item) => {
            if (!item.route) {
                return false;
            }
            if (item.route === '/') {
                return url === '/';
            }
            return url.startsWith(item.route);
        });
        return matched?.label ?? 'Dashboard';
    }
    get primaryNavItems() {
        return this.navItems.filter((item) => item.section === 'primary');
    }
    get reportNavItems() {
        return this.navItems.filter((item) => item.section === 'reports');
    }
    get adminNavItems() {
        return this.navItems.filter((item) => item.section === 'admin');
    }
    ngOnInit() {
        this.setNavItems();
        this.selectedVenueId = this.auth.selectedVenueId;
        this.api
            .getVenues()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((venues) => {
            this.venues = venues;
            if (venues.length === 0) {
                return;
            }
            if (!this.selectedVenueId || !venues.some((venue) => venue.id === this.selectedVenueId)) {
                this.applySelectedVenue(venues[0].id);
            }
        });
        this.loadRecent();
        this.loadNotifications();
        this.enquiryForm.controls.eventDate.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((date) => {
            if (!date || !this.selectedVenueId) {
                this.availability = null;
                return;
            }
            this.api
                .getAvailability(this.selectedVenueId, date)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((availability) => {
                this.availability = availability;
            });
        });
    }
    toggleRecent() {
        this.isSettingsOpen = false;
        this.isNotificationsOpen = false;
        this.isSearchOpen = false;
        this.isMobileNavOpen = false;
        this.isRecentOpen = !this.isRecentOpen;
    }
    toggleSettings(event) {
        event.stopPropagation();
        this.isRecentOpen = false;
        this.isNotificationsOpen = false;
        this.isSearchOpen = false;
        this.isMobileNavOpen = false;
        this.isSettingsOpen = !this.isSettingsOpen;
    }
    toggleNotifications(event) {
        event.stopPropagation();
        this.isRecentOpen = false;
        this.isSettingsOpen = false;
        this.isSearchOpen = false;
        this.isMobileNavOpen = false;
        this.isNotificationsOpen = !this.isNotificationsOpen;
        if (this.isNotificationsOpen) {
            this.loadNotifications();
        }
    }
    toggleMobileNav(event) {
        event.stopPropagation();
        this.isRecentOpen = false;
        this.isSettingsOpen = false;
        this.isNotificationsOpen = false;
        this.isSearchOpen = false;
        this.isMobileNavOpen = !this.isMobileNavOpen;
    }
    closeMobileNav() {
        this.isMobileNavOpen = false;
    }
    openSettingsSection(section) {
        this.isSettingsOpen = false;
        this.isMobileNavOpen = false;
        this.router.navigate(['/settings'], {
            queryParams: { section }
        });
    }
    openAdmin() {
        this.isSettingsOpen = false;
        this.isMobileNavOpen = false;
        this.router.navigate(['/admin']);
    }
    selectVenue(venueId) {
        const venueChanged = this.applySelectedVenue(venueId);
        this.closeMobileNav();
        if (this.searchQuery.trim().length >= 3) {
            this.executeSearch();
        }
        if (venueChanged) {
            window.location.reload();
        }
    }
    openDrawer() {
        this.isDrawerOpen = true;
    }
    closeDrawer() {
        this.isDrawerOpen = false;
        this.submissionError = '';
        this.showValidation = false;
    }
    logout() {
        // Start server-side revoke as best effort, but don't block UX on network/API issues.
        this.auth
            .logout()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({ error: () => void 0 });
        this.auth.clearSession();
        this.router.navigateByUrl('/login');
    }
    submitEnquiry() {
        this.showValidation = true;
        if (this.enquiryForm.invalid || !this.selectedVenueId) {
            this.enquiryForm.markAllAsTouched();
            this.submissionError = 'Complete required fields and select a venue.';
            return;
        }
        const value = this.enquiryForm.getRawValue();
        const eventStartUtc = this.buildIsoDate(value.eventDate ?? '', value.eventTime ?? '12:00');
        if (!eventStartUtc) {
            this.submissionError = 'Select a valid event date.';
            return;
        }
        this.isSubmitting = true;
        this.submissionError = '';
        this.api
            .createEnquiry({
            venueId: this.selectedVenueId,
            contactFirstName: value.contactFirstName ?? '',
            contactLastName: value.contactLastName ?? '',
            contactEmail: value.contactEmail ?? '',
            contactPhoneNumberE164: value.contactPhoneNumberE164 ?? '',
            companyName: value.companyName ?? undefined,
            marketingConsent: value.marketingConsent ?? false,
            eventType: value.eventType ?? 'Wedding',
            eventName: value.eventName ?? undefined,
            eventStartUtc,
            eventStyle: value.eventStyle ?? undefined,
            setupStyle: value.setupStyle ?? undefined,
            guestsExpected: value.guestsExpected ?? 1,
            budgetMinAmount: value.budgetMinAmount ?? undefined,
            budgetMaxAmount: value.budgetMaxAmount ?? undefined,
            currencyCode: 'GBP',
            sourceType: value.sourceType ?? 'Phone',
            sourceDetail: value.sourceDetail ?? undefined,
            leadQuality: value.leadQuality ?? 3,
            hasFlexibleDates: value.hasFlexibleDates ?? false,
            flexibleDateNotes: value.flexibleDateNotes ?? undefined,
            specialRequirements: value.specialRequirements ?? undefined,
            internalNotes: value.internalNotes ?? undefined
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (created) => {
                this.isSubmitting = false;
                this.closeDrawer();
                this.enquiryForm.reset({
                    contactFirstName: '',
                    contactLastName: '',
                    contactEmail: '',
                    contactPhoneNumberE164: '+44',
                    companyName: '',
                    marketingConsent: false,
                    eventType: 'Wedding',
                    eventName: '',
                    eventDate: '',
                    eventTime: '12:00',
                    eventStyle: '3-Course Dinner',
                    setupStyle: 'Banquet',
                    guestsExpected: 80,
                    budgetMinAmount: null,
                    budgetMaxAmount: null,
                    sourceType: 'Phone',
                    sourceDetail: '',
                    leadQuality: 3,
                    hasFlexibleDates: false,
                    flexibleDateNotes: '',
                    specialRequirements: '',
                    internalNotes: ''
                });
                this.router.navigate(['/enquiries'], { queryParams: { created: created.id } });
                this.loadRecent();
            },
            error: (error) => {
                this.isSubmitting = false;
                this.submissionError = error?.error?.message ?? 'Unable to create enquiry.';
            }
        });
    }
    openRecentItem(item) {
        this.isRecentOpen = false;
        this.closeMobileNav();
        if (item.entityType === 'Enquiry') {
            this.router.navigate(['/enquiries'], { queryParams: { enquiry: item.entityId } });
        }
    }
    onSearchFocus(event) {
        event.stopPropagation();
        this.isRecentOpen = false;
        this.isSettingsOpen = false;
        this.isNotificationsOpen = false;
        this.isSearchOpen = true;
        this.executeSearch();
    }
    onSearchInput(query) {
        this.searchQuery = query;
        this.scheduleSearch();
    }
    submitSearch(event) {
        event.preventDefault();
        const query = this.searchQuery.trim();
        this.isSearchOpen = false;
        if (!query) {
            return;
        }
        this.router.navigate(['/enquiries'], { queryParams: { search: query, statusTab: 'all' } });
    }
    useRecentSearch(query) {
        this.searchQuery = query;
        this.executeSearch();
    }
    openSearchResult(result) {
        this.isSearchOpen = false;
        this.closeMobileNav();
        this.router.navigateByUrl(result.route);
    }
    markAllNotificationsRead() {
        this.api
            .markNotificationsRead({ markAll: true })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.loadNotifications();
            }
        });
    }
    markNotificationRead(item) {
        this.api
            .markNotificationsRead({ markAll: false, notificationIds: [item.id] })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                if (item.linkUrl) {
                    this.router.navigateByUrl(item.linkUrl);
                }
                this.loadNotifications();
            }
        });
    }
    closeMenus() {
        this.isRecentOpen = false;
        this.isSettingsOpen = false;
        this.isNotificationsOpen = false;
        this.isSearchOpen = false;
        this.isMobileNavOpen = false;
    }
    onEscape() {
        this.isRecentOpen = false;
        this.isSettingsOpen = false;
        this.isNotificationsOpen = false;
        this.isSearchOpen = false;
        this.isMobileNavOpen = false;
    }
    buildIsoDate(date, time) {
        if (!date) {
            return null;
        }
        const normalizedTime = /^\d{2}:\d{2}$/.test(time) ? time : '12:00';
        const value = new Date(`${date}T${normalizedTime}:00`);
        if (Number.isNaN(value.getTime())) {
            return null;
        }
        return value.toISOString();
    }
    loadRecent() {
        this.api
            .getRecentEnquiries()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (items) => {
                this.recentItems = items;
            },
            error: () => {
                this.recentItems = [];
            }
        });
    }
    loadNotifications() {
        this.api
            .getNotifications(this.selectedVenueId ?? undefined, 20)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.notifications = response.items;
                this.unreadNotifications = response.unreadCount;
                this.setNavItems();
            },
            error: () => {
                this.notifications = [];
                this.unreadNotifications = 0;
                this.setNavItems();
            }
        });
    }
    scheduleSearch() {
        if (this.searchDebounceTimer) {
            clearTimeout(this.searchDebounceTimer);
        }
        this.searchDebounceTimer = setTimeout(() => {
            this.executeSearch();
        }, 300);
    }
    executeSearch() {
        const query = this.searchQuery.trim();
        if (!this.selectedVenueId) {
            this.searchGroups = [];
            this.recentSearches = [];
            return;
        }
        this.api
            .searchSuggest(this.selectedVenueId, query)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.searchGroups = response.groups;
                this.recentSearches = response.recentSearches;
            },
            error: () => {
                this.searchGroups = [];
                this.recentSearches = [];
            }
        });
    }
    setNavItems() {
        if (this.operationsOnly) {
            this.navItems = [{ label: 'Operations Dashboard', section: 'primary', route: '/operations', exact: true }];
            return;
        }
        this.navItems = [
            { label: 'Dashboard', section: 'primary', route: '/', exact: true },
            {
                label: 'Connect',
                section: 'primary',
                route: '/connect',
                exact: false,
                badge: this.unreadNotifications > 0 ? String(this.unreadNotifications) : undefined
            },
            { label: 'Enquiries', section: 'primary', route: '/enquiries', exact: false },
            { label: 'Event Diary', section: 'primary', route: '/event-diary', exact: false },
            { label: 'Reports', section: 'reports', route: '/reports', exact: false },
            {
                label: 'Events Hub',
                section: 'reports',
                externalUrl: 'https://events-hub.creventaflow.com',
                exact: false,
                disabled: true,
                disabledReason: 'Connection not ready'
            },
            { label: 'Admin', section: 'admin', route: '/admin', exact: false },
            { label: 'Settings', section: 'admin', route: '/settings', exact: false }
        ];
    }
    applySelectedVenue(venueId) {
        const venueChanged = this.selectedVenueId !== venueId;
        this.selectedVenueId = venueId;
        this.auth.setSelectedVenue(venueId);
        this.loadRecent();
        this.loadNotifications();
        return venueChanged;
    }
    static { this.ɵfac = function AppShellComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppShellComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppShellComponent, selectors: [["app-shell"]], hostBindings: function AppShellComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("click", function AppShellComponent_click_HostBindingHandler() { return ctx.closeMenus(); }, i0.ɵɵresolveDocument)("keydown.escape", function AppShellComponent_keydown_escape_HostBindingHandler() { return ctx.onEscape(); }, i0.ɵɵresolveDocument);
        } }, decls: 215, vars: 25, consts: [[1, "workspace", 3, "click"], ["type", "button", "aria-label", "Close navigation", 1, "mobile-nav-backdrop"], [1, "sidebar", 3, "click"], [1, "sidebar-top"], [1, "brand", 3, "click", "routerLink"], [1, "brand-copy"], [1, "venue-field"], [3, "ngModelChange", "ngModel"], [3, "value"], [1, "sidebar-scroll"], [1, "sidebar-group"], [1, "sidebar-heading"], [1, "sidebar-nav"], [1, "sidebar-footer"], [1, "sidebar-user-card"], [1, "avatar"], [1, "identity"], ["type", "button", 1, "signout-btn", 3, "click"], [1, "main-panel"], [1, "topbar", 3, "click"], [1, "topbar-inner"], [1, "topbar-left"], ["type", "button", "aria-label", "Open navigation", 1, "icon-btn", "mobile-nav-toggle"], [1, "breadcrumbs"], [1, "crumb-primary"], [1, "crumb-sep"], [1, "crumb-muted"], [1, "crumb-current"], [1, "topbar-right"], [1, "avatar", 3, "click", "title"], [1, "content"], [1, "content-inner"], [1, "drawer-backdrop"], [1, "drawer"], [1, "drawer-header"], [1, "icon-btn", 3, "click"], [1, "drawer-form", 3, "ngSubmit", "formGroup"], [1, "form-error"], ["type", "text", "formControlName", "contactFirstName"], ["type", "text", "formControlName", "contactLastName"], ["type", "email", "formControlName", "contactEmail"], ["type", "text", "formControlName", "contactPhoneNumberE164", "placeholder", "+447700900111"], ["type", "text", "formControlName", "companyName"], ["formControlName", "eventType"], ["type", "text", "formControlName", "eventName"], ["type", "date", "formControlName", "eventDate"], ["type", "time", "formControlName", "eventTime"], ["formControlName", "eventStyle"], ["formControlName", "setupStyle"], ["type", "number", "min", "1", "formControlName", "guestsExpected"], ["type", "number", "min", "0", "formControlName", "budgetMinAmount"], ["type", "number", "min", "0", "formControlName", "budgetMaxAmount"], ["formControlName", "sourceType"], ["type", "text", "formControlName", "sourceDetail"], ["type", "number", "min", "1", "max", "5", "formControlName", "leadQuality"], [1, "checkbox"], ["type", "checkbox", "formControlName", "marketingConsent"], ["type", "checkbox", "formControlName", "hasFlexibleDates"], [1, "full"], ["rows", "2", "formControlName", "flexibleDateNotes"], ["rows", "2", "formControlName", "specialRequirements"], ["rows", "3", "formControlName", "internalNotes"], [1, "availability"], [1, "drawer-actions"], ["type", "button", 1, "ghost-btn", 3, "click"], ["type", "submit", 1, "primary-btn", 3, "disabled"], ["type", "button", "aria-label", "Close navigation", 1, "mobile-nav-backdrop", 3, "click"], ["aria-disabled", "true", "tabindex", "-1", 2, "opacity", ".45", "cursor", "not-allowed", "pointer-events", "none"], ["routerLinkActive", "active", 3, "routerLink", "routerLinkActiveOptions"], ["target", "_blank", "rel", "noreferrer", 3, "href"], [1, "badge"], ["routerLinkActive", "active", 3, "click", "routerLink", "routerLinkActiveOptions"], ["target", "_blank", "rel", "noreferrer", 3, "click", "href"], ["type", "button", "aria-label", "Open navigation", 1, "icon-btn", "mobile-nav-toggle", 3, "click"], [1, "search-wrap", 3, "click"], [1, "search", 3, "submit"], [1, "search-icon"], ["type", "text", "name", "globalSearch", "placeholder", "Search enquiries, contacts, events, payments...", 3, "ngModelChange", "focus", "ngModel"], [1, "search-menu"], [1, "recent-wrap", 3, "click"], ["aria-label", "Recently viewed", 1, "icon-btn", 3, "click"], [1, "recent-menu"], [1, "notifications-wrap", 3, "click"], ["aria-label", "Notifications", 1, "icon-btn", 3, "click"], [1, "notification-badge"], [1, "notifications-menu"], [1, "settings-wrap", 3, "click"], ["aria-label", "Settings", 1, "icon-btn", 3, "click"], [1, "settings-menu"], [1, "primary-btn", 3, "click"], [1, "empty"], [1, "search-section-title"], ["type", "button"], ["type", "button", 3, "click"], [1, "recent-title"], [3, "click"], [1, "notifications-title"], ["type", "button", 3, "unread"], [1, "drawer-backdrop", 3, "click"], [1, "available"], [1, "busy"], [1, "availability-event"]], template: function AppShellComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵlistener("click", function AppShellComponent_Template_div_click_0_listener() { return ctx.closeMenus(); });
            i0.ɵɵconditionalCreate(1, AppShellComponent_Conditional_1_Template, 1, 0, "button", 1);
            i0.ɵɵelementStart(2, "aside", 2);
            i0.ɵɵlistener("click", function AppShellComponent_Template_aside_click_2_listener($event) { return $event.stopPropagation(); });
            i0.ɵɵelementStart(3, "div", 3)(4, "a", 4);
            i0.ɵɵlistener("click", function AppShellComponent_Template_a_click_4_listener() { return ctx.closeMobileNav(); });
            i0.ɵɵelementStart(5, "span", 5)(6, "strong");
            i0.ɵɵtext(7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "small");
            i0.ɵɵtext(9);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(10, "label", 6)(11, "span");
            i0.ɵɵtext(12, "Venue");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "select", 7);
            i0.ɵɵlistener("ngModelChange", function AppShellComponent_Template_select_ngModelChange_13_listener($event) { return ctx.selectVenue($event); });
            i0.ɵɵrepeaterCreate(14, AppShellComponent_For_15_Template, 2, 2, "option", 8, _forTrack0);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(16, "div", 9)(17, "section", 10)(18, "p", 11);
            i0.ɵɵtext(19, "Workspace");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "nav", 12);
            i0.ɵɵrepeaterCreate(21, AppShellComponent_For_22_Template, 3, 1, null, null, _forTrack1);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(23, AppShellComponent_Conditional_23_Template, 6, 0, "section", 10);
            i0.ɵɵconditionalCreate(24, AppShellComponent_Conditional_24_Template, 6, 0, "section", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "div", 13)(26, "div", 14)(27, "span", 15);
            i0.ɵɵtext(28);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "span", 16)(30, "strong");
            i0.ɵɵtext(31);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "small");
            i0.ɵɵtext(33, "Signed in");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(34, "button", 17);
            i0.ɵɵlistener("click", function AppShellComponent_Template_button_click_34_listener() { return ctx.logout(); });
            i0.ɵɵtext(35, "Sign out");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(36, "section", 18)(37, "header", 19);
            i0.ɵɵlistener("click", function AppShellComponent_Template_header_click_37_listener($event) { return $event.stopPropagation(); });
            i0.ɵɵelementStart(38, "div", 20)(39, "div", 21);
            i0.ɵɵconditionalCreate(40, AppShellComponent_Conditional_40_Template, 2, 1, "button", 22);
            i0.ɵɵelementStart(41, "div", 23)(42, "span", 24);
            i0.ɵɵtext(43, "Events");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "span", 25);
            i0.ɵɵtext(45, "\u203A");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(46, "span", 26);
            i0.ɵɵtext(47);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "span", 25);
            i0.ɵɵtext(49, "\u203A");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(50, "span", 27);
            i0.ɵɵtext(51);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(52, "div", 28);
            i0.ɵɵconditionalCreate(53, AppShellComponent_Conditional_53_Template, 21, 6);
            i0.ɵɵelementStart(54, "button", 29);
            i0.ɵɵlistener("click", function AppShellComponent_Template_button_click_54_listener() { return ctx.logout(); });
            i0.ɵɵtext(55);
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(56, "main", 30)(57, "div", 31);
            i0.ɵɵelement(58, "router-outlet");
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(59, AppShellComponent_Conditional_59_Template, 1, 0, "div", 32);
            i0.ɵɵelementStart(60, "aside", 33)(61, "div", 34)(62, "div")(63, "h2");
            i0.ɵɵtext(64, "New Event Enquiry");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(65, "p");
            i0.ɵɵtext(66, "Status starts as New. Phone number is required.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(67, "button", 35);
            i0.ɵɵlistener("click", function AppShellComponent_Template_button_click_67_listener() { return ctx.closeDrawer(); });
            i0.ɵɵtext(68, "\u2715");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(69, "form", 36);
            i0.ɵɵlistener("ngSubmit", function AppShellComponent_Template_form_ngSubmit_69_listener() { return ctx.submitEnquiry(); });
            i0.ɵɵconditionalCreate(70, AppShellComponent_Conditional_70_Template, 2, 1, "p", 37);
            i0.ɵɵelementStart(71, "label");
            i0.ɵɵtext(72, " First Name ");
            i0.ɵɵelement(73, "input", 38);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(74, "label");
            i0.ɵɵtext(75, " Last Name ");
            i0.ɵɵelement(76, "input", 39);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(77, "label");
            i0.ɵɵtext(78, " Email ");
            i0.ɵɵelement(79, "input", 40);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(80, "label");
            i0.ɵɵtext(81, " Phone (E.164) ");
            i0.ɵɵelement(82, "input", 41);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(83, "label");
            i0.ɵɵtext(84, " Company ");
            i0.ɵɵelement(85, "input", 42);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(86, "label");
            i0.ɵɵtext(87, " Event Type ");
            i0.ɵɵelementStart(88, "select", 43)(89, "option");
            i0.ɵɵtext(90, "Wedding");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(91, "option");
            i0.ɵɵtext(92, "Corporate Conference");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(93, "option");
            i0.ɵɵtext(94, "Private Dining");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(95, "option");
            i0.ɵɵtext(96, "Christmas Party");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(97, "option");
            i0.ɵɵtext(98, "Birthday");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(99, "option");
            i0.ɵɵtext(100, "Funeral/Wake");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(101, "option");
            i0.ɵɵtext(102, "Charity");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(103, "option");
            i0.ɵɵtext(104, "Product Launch");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(105, "option");
            i0.ɵɵtext(106, "Team Building");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(107, "option");
            i0.ɵɵtext(108, "Other");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(109, "label");
            i0.ɵɵtext(110, " Event Name ");
            i0.ɵɵelement(111, "input", 44);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(112, "label");
            i0.ɵɵtext(113, " Event Date ");
            i0.ɵɵelement(114, "input", 45);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(115, "label");
            i0.ɵɵtext(116, " Start Time ");
            i0.ɵɵelement(117, "input", 46);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(118, "label");
            i0.ɵɵtext(119, " Event Style ");
            i0.ɵɵelementStart(120, "select", 47)(121, "option");
            i0.ɵɵtext(122, "Meeting");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(123, "option");
            i0.ɵɵtext(124, "3-Course Dinner");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(125, "option");
            i0.ɵɵtext(126, "Buffet");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(127, "option");
            i0.ɵɵtext(128, "Reception/Standing");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(129, "option");
            i0.ɵɵtext(130, "BBQ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(131, "option");
            i0.ɵɵtext(132, "Afternoon Tea");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(133, "option");
            i0.ɵɵtext(134, "Drinks Reception");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(135, "option");
            i0.ɵɵtext(136, "Custom");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(137, "label");
            i0.ɵɵtext(138, " Setup Style ");
            i0.ɵɵelementStart(139, "select", 48)(140, "option");
            i0.ɵɵtext(141, "Theatre");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(142, "option");
            i0.ɵɵtext(143, "Banquet");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(144, "option");
            i0.ɵɵtext(145, "Boardroom");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(146, "option");
            i0.ɵɵtext(147, "Cabaret");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(148, "option");
            i0.ɵɵtext(149, "Reception");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(150, "option");
            i0.ɵɵtext(151, "Classroom");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(152, "option");
            i0.ɵɵtext(153, "U-Shape");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(154, "option");
            i0.ɵɵtext(155, "Custom");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(156, "label");
            i0.ɵɵtext(157, " Guests ");
            i0.ɵɵelement(158, "input", 49);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(159, "label");
            i0.ɵɵtext(160, " Budget Min ");
            i0.ɵɵelement(161, "input", 50);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(162, "label");
            i0.ɵɵtext(163, " Budget Max ");
            i0.ɵɵelement(164, "input", 51);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(165, "label");
            i0.ɵɵtext(166, " Source ");
            i0.ɵɵelementStart(167, "select", 52)(168, "option");
            i0.ɵɵtext(169, "Phone");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(170, "option");
            i0.ɵɵtext(171, "Walk-in");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(172, "option");
            i0.ɵɵtext(173, "Referral");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(174, "option");
            i0.ɵɵtext(175, "Social Media");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(176, "option");
            i0.ɵɵtext(177, "Venue Event");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(178, "option");
            i0.ɵɵtext(179, "Third-Party");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(180, "option");
            i0.ɵɵtext(181, "Returning Client");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(182, "option");
            i0.ɵɵtext(183, "Website Form");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(184, "option");
            i0.ɵɵtext(185, "Email");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(186, "label");
            i0.ɵɵtext(187, " Source Detail ");
            i0.ɵɵelement(188, "input", 53);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(189, "label");
            i0.ɵɵtext(190, " Lead Quality (1-5) ");
            i0.ɵɵelement(191, "input", 54);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(192, "label", 55);
            i0.ɵɵelement(193, "input", 56);
            i0.ɵɵelementStart(194, "span");
            i0.ɵɵtext(195, "Marketing consent");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(196, "label", 55);
            i0.ɵɵelement(197, "input", 57);
            i0.ɵɵelementStart(198, "span");
            i0.ɵɵtext(199, "Flexible dates");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(200, "label", 58);
            i0.ɵɵtext(201, " Flexible Date Notes ");
            i0.ɵɵelement(202, "textarea", 59);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(203, "label", 58);
            i0.ɵɵtext(204, " Special Requirements ");
            i0.ɵɵelement(205, "textarea", 60);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(206, "label", 58);
            i0.ɵɵtext(207, " Internal Notes ");
            i0.ɵɵelement(208, "textarea", 61);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(209, AppShellComponent_Conditional_209_Template, 5, 0, "section", 62);
            i0.ɵɵelementStart(210, "div", 63)(211, "button", 64);
            i0.ɵɵlistener("click", function AppShellComponent_Template_button_click_211_listener() { return ctx.closeDrawer(); });
            i0.ɵɵtext(212, "Cancel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(213, "button", 65);
            i0.ɵɵtext(214);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isMobileNavOpen && !ctx.operationsOnly ? 1 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("open", ctx.isMobileNavOpen);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("routerLink", ctx.operationsOnly ? "/operations" : "/");
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.selectedVenueName);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.operationsOnly ? "Operations View" : "Enquiry Management");
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngModel", ctx.selectedVenueId);
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.venues);
            i0.ɵɵadvance(7);
            i0.ɵɵrepeater(ctx.primaryNavItems);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(!ctx.operationsOnly && ctx.reportNavItems.length > 0 ? 23 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(!ctx.operationsOnly && ctx.adminNavItems.length > 0 ? 24 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(ctx.initials);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.displayName);
            i0.ɵɵadvance(9);
            i0.ɵɵconditional(!ctx.operationsOnly ? 40 : -1);
            i0.ɵɵadvance(7);
            i0.ɵɵtextInterpolate(ctx.selectedVenueName);
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(ctx.currentSectionLabel);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(!ctx.operationsOnly ? 53 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("title", ctx.displayName + " (Sign out)");
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate(ctx.initials);
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.isDrawerOpen ? 59 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("open", ctx.isDrawerOpen);
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("formGroup", ctx.enquiryForm);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.submissionError ? 70 : -1);
            i0.ɵɵadvance(139);
            i0.ɵɵconditional(ctx.availability ? 209 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("disabled", ctx.isSubmitting);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.isSubmitting ? "Creating..." : "Create Enquiry", " ");
        } }, dependencies: [RouterLink, RouterLinkActive, RouterOutlet, ReactiveFormsModule, i1.ɵNgNoValidate, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.CheckboxControlValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.MinValidator, i1.MaxValidator, i1.FormGroupDirective, i1.FormControlName, FormsModule, i1.NgModel, i1.NgForm, DatePipe], styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n}\n\n.workspace[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  background: #f3f5fb;\n}\n\n.sidebar[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0 auto 0 0;\n  z-index: 45;\n  width: 286px;\n  background: linear-gradient(180deg, #11152f 0%, #0c1024 100%);\n  border-right: 1px solid rgba(148, 163, 184, 0.18);\n  color: #d5dcf8;\n  display: grid;\n  grid-template-rows: auto 1fr auto;\n  overflow: hidden;\n}\n\n.sidebar-top[_ngcontent-%COMP%] {\n  padding: 1.1rem 1rem 0.85rem;\n  border-bottom: 1px solid rgba(148, 163, 184, 0.14);\n  display: grid;\n  gap: 0.8rem;\n}\n\n.brand[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.66rem;\n  color: #eef2ff;\n  text-decoration: none;\n}\n\n.logo-image[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border-radius: 8px;\n  object-fit: cover;\n  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.35);\n}\n\n.brand-copy[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.05rem;\n}\n\n.brand-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.01rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n}\n\n.brand-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 0.68rem;\n  text-transform: uppercase;\n  letter-spacing: 0.09em;\n  color: #9aa6d1;\n  font-weight: 700;\n}\n\n.venue-field[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.28rem;\n}\n\n.venue-field[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.62rem;\n  text-transform: uppercase;\n  letter-spacing: 0.09em;\n  color: #8f9bc6;\n  font-weight: 800;\n}\n\n.venue-field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(148, 163, 184, 0.26);\n  border-radius: 10px;\n  background: rgba(30, 41, 59, 0.7);\n  color: #e5e7eb;\n  padding: 0.48rem 0.55rem;\n  font-size: 0.8rem;\n}\n\n.sidebar-scroll[_ngcontent-%COMP%] {\n  overflow-y: auto;\n  padding: 0.95rem 0.75rem 1.1rem;\n  display: grid;\n  gap: 0.95rem;\n  align-content: start;\n}\n\n.sidebar-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.42rem;\n}\n\n.sidebar-heading[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0 0.45rem;\n  font-size: 0.65rem;\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  color: #7782ad;\n  font-weight: 800;\n}\n\n.sidebar-nav[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.24rem;\n}\n\n.sidebar-nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #c7cff0;\n  border: 1px solid transparent;\n  border-radius: 11px;\n  padding: 0.58rem 0.62rem;\n  font-size: 0.95rem;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.45rem;\n  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;\n}\n\n.sidebar-nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  background: rgba(79, 70, 229, 0.16);\n  border-color: rgba(129, 140, 248, 0.38);\n  color: #f8fafc;\n}\n\n.sidebar-nav[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%] {\n  background: rgba(79, 70, 229, 0.22);\n  border-color: rgba(165, 180, 252, 0.42);\n  color: #ffffff;\n}\n\n.badge[_ngcontent-%COMP%] {\n  min-width: 18px;\n  text-align: center;\n  border-radius: 999px;\n  padding: 0.08rem 0.34rem;\n  background: #f43f5e;\n  color: #fff;\n  font-style: normal;\n  font-size: 0.62rem;\n  font-weight: 800;\n}\n\n.sidebar-footer[_ngcontent-%COMP%] {\n  border-top: 1px solid rgba(148, 163, 184, 0.14);\n  padding: 0.8rem;\n  display: grid;\n  gap: 0.6rem;\n}\n\n.sidebar-user-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.58rem;\n}\n\n.sidebar-user-card[_ngcontent-%COMP%]   .identity[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.1rem;\n  min-width: 0;\n}\n\n.sidebar-user-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #f8fafc;\n  font-size: 0.82rem;\n  line-height: 1.1;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.sidebar-user-card[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #9aa6d1;\n  font-size: 0.7rem;\n}\n\n.signout-btn[_ngcontent-%COMP%] {\n  border: 1px solid rgba(148, 163, 184, 0.25);\n  background: rgba(15, 23, 42, 0.35);\n  color: #dbeafe;\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font-size: 0.76rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.07em;\n  transition: border-color 0.2s ease, background-color 0.2s ease;\n}\n\n.signout-btn[_ngcontent-%COMP%]:hover {\n  border-color: rgba(191, 219, 254, 0.65);\n  background: rgba(30, 41, 59, 0.5);\n}\n\n.main-panel[_ngcontent-%COMP%] {\n  margin-left: 286px;\n  min-height: 100vh;\n  display: grid;\n  grid-template-rows: auto 1fr;\n}\n\n.topbar[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 30;\n  background: rgba(255, 255, 255, 0.96);\n  border-bottom: 1px solid var(--cf-border-soft);\n  backdrop-filter: blur(8px);\n}\n\n.topbar-inner[_ngcontent-%COMP%] {\n  padding: 0.8rem 1.35rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}\n\n.topbar-left[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  min-width: 0;\n}\n\n.mobile-nav-toggle[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.breadcrumbs[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.46rem;\n  white-space: nowrap;\n}\n\n.crumb-primary[_ngcontent-%COMP%] {\n  color: #0f172a;\n  font-size: 1.83rem;\n  line-height: 1;\n  font-weight: 700;\n}\n\n.crumb-sep[_ngcontent-%COMP%] {\n  color: #9aa3bf;\n  font-size: 1.05rem;\n  font-weight: 700;\n}\n\n.crumb-muted[_ngcontent-%COMP%], \n.crumb-current[_ngcontent-%COMP%] {\n  font-size: 0.84rem;\n  font-weight: 700;\n}\n\n.crumb-muted[_ngcontent-%COMP%] {\n  color: #7c88ab;\n}\n\n.crumb-current[_ngcontent-%COMP%] {\n  color: #1e293b;\n}\n\n.topbar-right[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.46rem;\n  min-width: 0;\n}\n\n.search-wrap[_ngcontent-%COMP%] {\n  position: relative;\n  width: min(430px, 48vw);\n}\n\n.search[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  border: 1px solid var(--cf-border);\n  background: #f8fafc;\n  border-radius: 999px;\n  padding: 0.5rem 0.8rem;\n}\n\n.search-icon[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  font-size: 0.86rem;\n}\n\n.search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 0;\n  background: transparent;\n  color: #334155;\n  font-size: 0.86rem;\n  outline: none;\n}\n\n.search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder {\n  color: #94a3b8;\n}\n\n.icon-btn[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 10px;\n  border: 1px solid transparent;\n  background: transparent;\n  color: #64748b;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;\n}\n\n.icon-btn[_ngcontent-%COMP%]:hover {\n  color: #334155;\n  background: #f8fafc;\n  border-color: var(--cf-border-soft);\n}\n\n.primary-btn[_ngcontent-%COMP%] {\n  border: 1px solid transparent;\n  background: #4f46e5;\n  color: #fff;\n  border-radius: 12px;\n  padding: 0.52rem 0.9rem;\n  font-size: 0.84rem;\n  font-weight: 700;\n  transition: background-color 0.2s ease, box-shadow 0.2s ease;\n}\n\n.primary-btn[_ngcontent-%COMP%]:hover {\n  background: #4338ca;\n  box-shadow: 0 10px 18px rgba(79, 70, 229, 0.28);\n}\n\n.primary-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n}\n\n.ghost-btn[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border);\n  background: #fff;\n  color: #475569;\n  border-radius: 10px;\n  padding: 0.5rem 0.85rem;\n  font-size: 0.84rem;\n  font-weight: 700;\n}\n\n.avatar[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 999px;\n  border: 1px solid #c7d2fe;\n  background: #eef2ff;\n  color: #4338ca;\n  font-size: 0.74rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.recent-wrap[_ngcontent-%COMP%], \n.settings-wrap[_ngcontent-%COMP%], \n.notifications-wrap[_ngcontent-%COMP%] {\n  position: relative;\n}\n\n.recent-menu[_ngcontent-%COMP%], \n.settings-menu[_ngcontent-%COMP%], \n.notifications-menu[_ngcontent-%COMP%], \n.search-menu[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0;\n  top: calc(100% + 8px);\n  z-index: 95;\n  background: #fff;\n  border: 1px solid var(--cf-border);\n  border-radius: 14px;\n  box-shadow: var(--cf-shadow-md);\n}\n\n.recent-menu[_ngcontent-%COMP%] {\n  width: min(380px, 90vw);\n  padding: 0.5rem;\n  display: grid;\n  gap: 0.4rem;\n}\n\n.recent-title[_ngcontent-%COMP%] {\n  margin: 0.1rem 0.2rem 0.25rem;\n  font-size: 0.65rem;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: #94a3b8;\n  font-weight: 800;\n}\n\n.recent-menu[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border-soft);\n  background: #fff;\n  border-radius: 12px;\n  text-align: left;\n  padding: 0.56rem 0.66rem;\n  display: grid;\n  gap: 0.16rem;\n}\n\n.recent-menu[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  border-color: #c7d2fe;\n  background: #f8faff;\n}\n\n.recent-menu[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #0f172a;\n}\n\n.recent-menu[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.recent-menu[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.72rem;\n  color: #64748b;\n  font-style: normal;\n}\n\n.recent-menu[_ngcontent-%COMP%]   .empty[_ngcontent-%COMP%], \n.search-menu[_ngcontent-%COMP%]   .empty[_ngcontent-%COMP%], \n.notifications-menu[_ngcontent-%COMP%]   .empty[_ngcontent-%COMP%] {\n  margin: 0.4rem 0.3rem;\n  color: #94a3b8;\n  font-size: 0.78rem;\n}\n\n.settings-menu[_ngcontent-%COMP%] {\n  width: min(260px, 90vw);\n  padding: 0.4rem;\n  display: grid;\n  gap: 0.3rem;\n}\n\n.settings-menu[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border-soft);\n  background: #fff;\n  border-radius: 10px;\n  text-align: left;\n  padding: 0.5rem 0.6rem;\n  font-size: 0.8rem;\n  color: #334155;\n  font-weight: 600;\n}\n\n.settings-menu[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  border-color: #c7d2fe;\n  background: #f8faff;\n}\n\n.search-menu[_ngcontent-%COMP%] {\n  left: 0;\n  right: 0;\n  max-height: min(420px, 70vh);\n  overflow: auto;\n  padding: 0.45rem;\n  display: grid;\n  gap: 0.34rem;\n}\n\n.search-menu[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border-soft);\n  background: #fff;\n  border-radius: 10px;\n  text-align: left;\n  padding: 0.45rem 0.55rem;\n  display: grid;\n  gap: 0.14rem;\n  color: #334155;\n}\n\n.search-menu[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  border-color: #c7d2fe;\n  background: #f8faff;\n}\n\n.search-menu[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  color: #0f172a;\n}\n\n.search-menu[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: #64748b;\n}\n\n.search-section-title[_ngcontent-%COMP%] {\n  margin: 0.1rem 0.2rem;\n  font-size: 0.64rem;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  color: #94a3b8;\n  font-weight: 800;\n}\n\n.notification-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -3px;\n  right: -4px;\n  min-width: 16px;\n  height: 16px;\n  padding: 0 0.2rem;\n  border-radius: 999px;\n  background: #f43f5e;\n  color: #fff;\n  font-size: 0.6rem;\n  font-weight: 800;\n  line-height: 16px;\n  text-align: center;\n}\n\n.notifications-menu[_ngcontent-%COMP%] {\n  width: min(360px, 90vw);\n  max-height: min(440px, 70vh);\n  overflow: auto;\n  padding: 0.45rem;\n  display: grid;\n  gap: 0.34rem;\n}\n\n.notifications-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n  margin: 0 0.1rem 0.1rem;\n}\n\n.notifications-title[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.68rem;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  color: #94a3b8;\n  font-weight: 800;\n}\n\n.notifications-title[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  color: #4f46e5;\n  font-size: 0.68rem;\n  font-weight: 700;\n  padding: 0;\n}\n\n.notifications-menu[_ngcontent-%COMP%]    > button[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border-soft);\n  background: #fff;\n  border-radius: 10px;\n  text-align: left;\n  padding: 0.45rem 0.55rem;\n  display: grid;\n  gap: 0.12rem;\n}\n\n.notifications-menu[_ngcontent-%COMP%]    > button.unread[_ngcontent-%COMP%] {\n  border-color: #c7d2fe;\n  background: #f8faff;\n}\n\n.notifications-menu[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  color: #0f172a;\n}\n\n.notifications-menu[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.notifications-menu[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: #64748b;\n  font-style: normal;\n}\n\n.content[_ngcontent-%COMP%] {\n  padding: 1.25rem 1.35rem 2.2rem;\n}\n\n.content-inner[_ngcontent-%COMP%] {\n  max-width: 1600px;\n  margin: 0 auto;\n}\n\n.mobile-nav-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 40;\n  border: 0;\n  background: rgba(15, 23, 42, 0.38);\n  backdrop-filter: blur(2px);\n}\n\n.drawer-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  background: rgba(15, 23, 42, 0.38);\n  backdrop-filter: blur(2px);\n  z-index: 80;\n}\n\n.drawer[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  right: 0;\n  height: 100vh;\n  width: min(800px, 100%);\n  background: #fff;\n  transform: translateX(100%);\n  transition: transform 0.25s ease;\n  z-index: 90;\n  box-shadow: -16px 0 36px rgba(15, 23, 42, 0.2);\n  display: grid;\n  grid-template-rows: auto 1fr;\n  overflow: hidden;\n}\n\n.drawer.open[_ngcontent-%COMP%] {\n  transform: translateX(0);\n}\n\n.drawer-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: start;\n  justify-content: space-between;\n  padding: 1.1rem 1.2rem;\n  border-bottom: 1px solid var(--cf-border-soft);\n  background: #f8fafc;\n}\n\n.drawer-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.12rem;\n}\n\n.drawer-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.25rem 0 0;\n  font-size: 0.78rem;\n  color: #64748b;\n}\n\n.drawer-form[_ngcontent-%COMP%] {\n  overflow-y: auto;\n  padding: 1rem 1.2rem 1.3rem;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.86rem;\n  align-content: start;\n}\n\n.drawer-form[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.25rem;\n  font-size: 0.7rem;\n  line-height: 1.2;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  color: #64748b;\n  font-weight: 800;\n}\n\n.drawer-form[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.drawer-form[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.drawer-form[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border);\n  border-radius: 10px;\n  background: #fff;\n  color: #334155;\n  padding: 0.48rem 0.58rem;\n  font-size: 0.82rem;\n  text-transform: none;\n  letter-spacing: normal;\n  font-weight: 500;\n}\n\n.drawer-form[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n\n.drawer-form[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.drawer-form[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.drawer-form[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: #a5b4fc;\n  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);\n}\n\n.checkbox[_ngcontent-%COMP%] {\n  grid-template-columns: 18px 1fr;\n  align-items: center;\n  gap: 0.5rem;\n}\n\n.checkbox[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  margin: 0;\n}\n\n.checkbox[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  text-transform: none;\n  letter-spacing: normal;\n  font-size: 0.8rem;\n  font-weight: 600;\n}\n\n.full[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n}\n\n.form-error[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n  margin: 0;\n  border: 1px solid #fecaca;\n  background: #fef2f2;\n  color: #b91c1c;\n  border-radius: 12px;\n  padding: 0.6rem 0.72rem;\n  font-size: 0.78rem;\n  font-weight: 600;\n}\n\n.availability[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n  border: 1px solid #ddd6fe;\n  background: #f8f8ff;\n  border-radius: 14px;\n  padding: 0.75rem;\n  display: grid;\n  gap: 0.5rem;\n}\n\n.availability[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.82rem;\n  text-transform: uppercase;\n  letter-spacing: 0.07em;\n  color: #4f46e5;\n}\n\n.availability[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border-soft);\n  border-radius: 12px;\n  background: #fff;\n  padding: 0.52rem 0.6rem;\n  display: grid;\n  gap: 0.26rem;\n}\n\n.availability[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]   header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.availability[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #1f2937;\n}\n\n.available[_ngcontent-%COMP%], \n.busy[_ngcontent-%COMP%] {\n  font-size: 0.62rem;\n  padding: 0.16rem 0.42rem;\n  border-radius: 999px;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  font-weight: 800;\n}\n\n.available[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #166534;\n}\n\n.busy[_ngcontent-%COMP%] {\n  background: #fef3c7;\n  color: #92400e;\n}\n\n.availability-event[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.08rem;\n}\n\n.availability-event[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  color: #1f2937;\n}\n\n.availability-event[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: #64748b;\n}\n\n.drawer-actions[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  padding-top: 0.35rem;\n}\n\n@media (max-width: 1240px) {\n  .crumb-primary[_ngcontent-%COMP%] {\n    font-size: 1.48rem;\n  }\n\n  .search-wrap[_ngcontent-%COMP%] {\n    width: min(320px, 40vw);\n  }\n}\n\n@media (max-width: 1080px) {\n  .sidebar[_ngcontent-%COMP%] {\n    transform: translateX(-104%);\n    transition: transform 0.24s ease;\n  }\n\n  .sidebar.open[_ngcontent-%COMP%] {\n    transform: translateX(0);\n  }\n\n  .main-panel[_ngcontent-%COMP%] {\n    margin-left: 0;\n  }\n\n  .mobile-nav-toggle[_ngcontent-%COMP%] {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n  }\n\n  .topbar-inner[_ngcontent-%COMP%] {\n    padding: 0.72rem 0.9rem;\n  }\n\n  .content[_ngcontent-%COMP%] {\n    padding: 1rem 0.9rem 2rem;\n  }\n}\n\n@media (max-width: 860px) {\n  .crumb-muted[_ngcontent-%COMP%], \n   .crumb-sep[_ngcontent-%COMP%] {\n    display: none;\n  }\n\n  .crumb-primary[_ngcontent-%COMP%] {\n    font-size: 1.28rem;\n  }\n\n  .search-wrap[_ngcontent-%COMP%] {\n    width: min(280px, 48vw);\n  }\n\n  .drawer-form[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n\n@media (max-width: 680px) {\n  .search-wrap[_ngcontent-%COMP%] {\n    width: min(220px, 58vw);\n  }\n\n  .recent-wrap[_ngcontent-%COMP%], \n   .settings-wrap[_ngcontent-%COMP%] {\n    display: none;\n  }\n\n  .primary-btn[_ngcontent-%COMP%] {\n    padding: 0.48rem 0.62rem;\n    font-size: 0.77rem;\n  }\n}\n\n@media (max-width: 560px) {\n  .topbar-inner[_ngcontent-%COMP%] {\n    gap: 0.4rem;\n  }\n\n  .search-wrap[_ngcontent-%COMP%], \n   .notifications-wrap[_ngcontent-%COMP%], \n   .topbar-right[_ngcontent-%COMP%]   .primary-btn[_ngcontent-%COMP%] {\n    display: none;\n  }\n\n  .crumb-primary[_ngcontent-%COMP%] {\n    font-size: 1.12rem;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppShellComponent, [{
        type: Component,
        args: [{ selector: 'app-shell', imports: [RouterLink, RouterLinkActive, RouterOutlet, ReactiveFormsModule, FormsModule, DatePipe], template: "<div class=\"workspace\" (click)=\"closeMenus()\">\n  @if (isMobileNavOpen && !operationsOnly) {\n    <button type=\"button\" class=\"mobile-nav-backdrop\" (click)=\"closeMobileNav()\" aria-label=\"Close navigation\"></button>\n  }\n\n  <aside class=\"sidebar\" [class.open]=\"isMobileNavOpen\" (click)=\"$event.stopPropagation()\">\n    <div class=\"sidebar-top\">\n      <a class=\"brand\" [routerLink]=\"operationsOnly ? '/operations' : '/'\" (click)=\"closeMobileNav()\">\n        <span class=\"brand-copy\">\n          <strong>{{ selectedVenueName }}</strong>\n          <small>{{ operationsOnly ? 'Operations View' : 'Enquiry Management' }}</small>\n        </span>\n      </a>\n\n      <label class=\"venue-field\">\n        <span>Venue</span>\n        <select [ngModel]=\"selectedVenueId\" (ngModelChange)=\"selectVenue($event)\">\n          @for (venue of venues; track venue.id) {\n            <option [value]=\"venue.id\">{{ venue.name }}</option>\n          }\n        </select>\n      </label>\n    </div>\n\n    <div class=\"sidebar-scroll\">\n      <section class=\"sidebar-group\">\n        <p class=\"sidebar-heading\">Workspace</p>\n        <nav class=\"sidebar-nav\">\n          @for (item of primaryNavItems; track item.label) {\n            @if (item.disabled) {\n              <a\n                aria-disabled=\"true\"\n                tabindex=\"-1\"\n                [attr.title]=\"item.disabledReason || 'Unavailable'\"\n                style=\"opacity:.45;cursor:not-allowed;pointer-events:none\">\n                <span>{{ item.label }}</span>\n                @if (item.badge) {\n                  <em class=\"badge\">{{ item.badge }}</em>\n                }\n              </a>\n            } @else if (item.route) {\n              <a\n                [routerLink]=\"item.route\"\n                routerLinkActive=\"active\"\n                [routerLinkActiveOptions]=\"{ exact: item.exact }\"\n                (click)=\"closeMobileNav()\">\n                <span>{{ item.label }}</span>\n                @if (item.badge) {\n                  <em class=\"badge\">{{ item.badge }}</em>\n                }\n              </a>\n            } @else if (item.externalUrl) {\n              <a [href]=\"item.externalUrl\" target=\"_blank\" rel=\"noreferrer\" (click)=\"closeMobileNav()\">\n                <span>{{ item.label }}</span>\n                @if (item.badge) {\n                  <em class=\"badge\">{{ item.badge }}</em>\n                }\n              </a>\n            }\n          }\n        </nav>\n      </section>\n\n      @if (!operationsOnly && reportNavItems.length > 0) {\n        <section class=\"sidebar-group\">\n          <p class=\"sidebar-heading\">Reports</p>\n          <nav class=\"sidebar-nav\">\n            @for (item of reportNavItems; track item.label) {\n              @if (item.disabled) {\n                <a\n                  aria-disabled=\"true\"\n                  tabindex=\"-1\"\n                  [attr.title]=\"item.disabledReason || 'Unavailable'\"\n                  style=\"opacity:.45;cursor:not-allowed;pointer-events:none\">\n                  <span>{{ item.label }}</span>\n                </a>\n              } @else if (item.route) {\n                <a\n                  [routerLink]=\"item.route\"\n                  routerLinkActive=\"active\"\n                  [routerLinkActiveOptions]=\"{ exact: item.exact }\"\n                  (click)=\"closeMobileNav()\">\n                  <span>{{ item.label }}</span>\n                </a>\n              } @else if (item.externalUrl) {\n                <a [href]=\"item.externalUrl\" target=\"_blank\" rel=\"noreferrer\" (click)=\"closeMobileNav()\">\n                  <span>{{ item.label }}</span>\n                </a>\n              }\n            }\n          </nav>\n        </section>\n      }\n\n      @if (!operationsOnly && adminNavItems.length > 0) {\n        <section class=\"sidebar-group\">\n          <p class=\"sidebar-heading\">Administration</p>\n          <nav class=\"sidebar-nav\">\n            @for (item of adminNavItems; track item.label) {\n              <a\n                [routerLink]=\"item.route\"\n                routerLinkActive=\"active\"\n                [routerLinkActiveOptions]=\"{ exact: item.exact }\"\n                (click)=\"closeMobileNav()\">\n                <span>{{ item.label }}</span>\n              </a>\n            }\n          </nav>\n        </section>\n      }\n    </div>\n\n    <div class=\"sidebar-footer\">\n      <div class=\"sidebar-user-card\">\n        <span class=\"avatar\">{{ initials }}</span>\n        <span class=\"identity\">\n          <strong>{{ displayName }}</strong>\n          <small>Signed in</small>\n        </span>\n      </div>\n      <button type=\"button\" class=\"signout-btn\" (click)=\"logout()\">Sign out</button>\n    </div>\n  </aside>\n\n  <section class=\"main-panel\">\n    <header class=\"topbar\" (click)=\"$event.stopPropagation()\">\n      <div class=\"topbar-inner\">\n        <div class=\"topbar-left\">\n          @if (!operationsOnly) {\n            <button\n              type=\"button\"\n              class=\"icon-btn mobile-nav-toggle\"\n              aria-label=\"Open navigation\"\n              [attr.aria-expanded]=\"isMobileNavOpen\"\n              (click)=\"toggleMobileNav($event)\">\n              &#9776;\n            </button>\n          }\n\n          <div class=\"breadcrumbs\">\n            <span class=\"crumb-primary\">Events</span>\n            <span class=\"crumb-sep\">&rsaquo;</span>\n            <span class=\"crumb-muted\">{{ selectedVenueName }}</span>\n            <span class=\"crumb-sep\">&rsaquo;</span>\n            <span class=\"crumb-current\">{{ currentSectionLabel }}</span>\n          </div>\n        </div>\n\n        <div class=\"topbar-right\">\n          @if (!operationsOnly) {\n            <div class=\"search-wrap\" (click)=\"$event.stopPropagation()\">\n              <form class=\"search\" (submit)=\"submitSearch($event)\">\n                <span class=\"search-icon\">&#128269;</span>\n                <input\n                  type=\"text\"\n                  [ngModel]=\"searchQuery\"\n                  (ngModelChange)=\"onSearchInput($event)\"\n                  (focus)=\"onSearchFocus($event)\"\n                  name=\"globalSearch\"\n                  placeholder=\"Search enquiries, contacts, events, payments...\"\n                />\n              </form>\n\n              @if (isSearchOpen) {\n                <div class=\"search-menu\">\n                  @if (searchQuery.trim().length < 3 && recentSearches.length > 0) {\n                    <div class=\"search-section-title\">Recent searches</div>\n                    @for (query of recentSearches; track query) {\n                      <button type=\"button\" (click)=\"useRecentSearch(query)\">\n                        <strong>{{ query }}</strong>\n                      </button>\n                    }\n                  }\n\n                  @for (group of searchGroups; track group.type) {\n                    <div class=\"search-section-title\">{{ group.type }}</div>\n                    @for (result of group.results; track result.entityId) {\n                      <button type=\"button\" (click)=\"openSearchResult(result)\">\n                        <strong>{{ result.primaryText }}</strong>\n                        @if (result.secondaryText) {\n                          <span>{{ result.secondaryText }}</span>\n                        }\n                      </button>\n                    }\n                  }\n\n                  @if (searchQuery.trim().length >= 3 && searchGroups.length === 0) {\n                    <p class=\"empty\">No results found.</p>\n                  }\n                </div>\n              }\n            </div>\n\n            <div class=\"recent-wrap\" (click)=\"$event.stopPropagation()\">\n              <button class=\"icon-btn\" (click)=\"toggleRecent()\" aria-label=\"Recently viewed\">&#128337;</button>\n              @if (isRecentOpen) {\n                <div class=\"recent-menu\">\n                  <div class=\"recent-title\">Recently viewed</div>\n                  @for (item of recentItems; track item.entityId) {\n                    <button (click)=\"openRecentItem(item)\">\n                      <strong>{{ item.label }}</strong>\n                      <span>{{ item.secondaryLine }}</span>\n                      @if (item.status) {\n                        <em>{{ item.status }}</em>\n                      }\n                    </button>\n                  }\n                  @if (recentItems.length === 0) {\n                    <p class=\"empty\">No recent enquiries.</p>\n                  }\n                </div>\n              }\n            </div>\n\n            <div class=\"notifications-wrap\" (click)=\"$event.stopPropagation()\">\n              <button class=\"icon-btn\" (click)=\"toggleNotifications($event)\" aria-label=\"Notifications\">&#128276;</button>\n              @if (unreadNotifications > 0) {\n                <span class=\"notification-badge\">{{ unreadNotifications }}</span>\n              }\n              @if (isNotificationsOpen) {\n                <div class=\"notifications-menu\">\n                  <div class=\"notifications-title\">\n                    <span>Notifications</span>\n                    <button type=\"button\" (click)=\"markAllNotificationsRead()\">Mark all read</button>\n                  </div>\n                  @for (item of notifications; track item.id) {\n                    <button type=\"button\" [class.unread]=\"!item.isRead\" (click)=\"markNotificationRead(item)\">\n                      <strong>{{ item.title }}</strong>\n                      <span>{{ item.body }}</span>\n                      <em>{{ item.createdAtUtc | date: 'dd/MM HH:mm' }}</em>\n                    </button>\n                  }\n                  @if (notifications.length === 0) {\n                    <p class=\"empty\">No notifications.</p>\n                  }\n                </div>\n              }\n            </div>\n\n            <div class=\"settings-wrap\" (click)=\"$event.stopPropagation()\">\n              <button class=\"icon-btn\" (click)=\"toggleSettings($event)\" aria-label=\"Settings\">&#9881;</button>\n              @if (isSettingsOpen) {\n                <div class=\"settings-menu\">\n                  <button type=\"button\" (click)=\"openAdmin()\">Administration</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('venue-profile')\">Venue Profile</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('spaces')\">Spaces & Combinations</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('budgets')\">Budgets & Targets</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('payment-schedules')\">Payment Schedules</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('terms')\">Terms & Conditions</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('proposal-templates')\">Proposal Templates</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('planning-milestones')\">Planning Milestones</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('report-configuration')\">Report Configuration</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('automation')\">Automation</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('email-templates')\">Email Templates</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('website-forms')\">Website Forms</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('calendar-accounts')\">Calendar Accounts</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('task-templates')\">Task Templates</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('report-schedules')\">Report Schedules</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('email-accounts')\">Email Accounts</button>\n                  <button type=\"button\" (click)=\"openSettingsSection('users')\">Users & Roles</button>\n                </div>\n              }\n            </div>\n\n            <button class=\"primary-btn\" (click)=\"openDrawer()\">+ New Enquiry</button>\n          }\n\n          <button class=\"avatar\" (click)=\"logout()\" [title]=\"displayName + ' (Sign out)'\">{{ initials }}</button>\n        </div>\n      </div>\n    </header>\n\n    <main class=\"content\">\n      <div class=\"content-inner\">\n        <router-outlet></router-outlet>\n      </div>\n    </main>\n  </section>\n\n  @if (isDrawerOpen) {\n    <div class=\"drawer-backdrop\" (click)=\"closeDrawer()\"></div>\n  }\n\n  <aside class=\"drawer\" [class.open]=\"isDrawerOpen\">\n    <div class=\"drawer-header\">\n      <div>\n        <h2>New Event Enquiry</h2>\n        <p>Status starts as New. Phone number is required.</p>\n      </div>\n      <button class=\"icon-btn\" (click)=\"closeDrawer()\">&#10005;</button>\n    </div>\n\n    <form class=\"drawer-form\" [formGroup]=\"enquiryForm\" (ngSubmit)=\"submitEnquiry()\">\n      @if (submissionError) {\n        <p class=\"form-error\">{{ submissionError }}</p>\n      }\n\n      <label>\n        First Name\n        <input type=\"text\" formControlName=\"contactFirstName\" />\n      </label>\n\n      <label>\n        Last Name\n        <input type=\"text\" formControlName=\"contactLastName\" />\n      </label>\n\n      <label>\n        Email\n        <input type=\"email\" formControlName=\"contactEmail\" />\n      </label>\n\n      <label>\n        Phone (E.164)\n        <input type=\"text\" formControlName=\"contactPhoneNumberE164\" placeholder=\"+447700900111\" />\n      </label>\n\n      <label>\n        Company\n        <input type=\"text\" formControlName=\"companyName\" />\n      </label>\n\n      <label>\n        Event Type\n        <select formControlName=\"eventType\">\n          <option>Wedding</option>\n          <option>Corporate Conference</option>\n          <option>Private Dining</option>\n          <option>Christmas Party</option>\n          <option>Birthday</option>\n          <option>Funeral/Wake</option>\n          <option>Charity</option>\n          <option>Product Launch</option>\n          <option>Team Building</option>\n          <option>Other</option>\n        </select>\n      </label>\n\n      <label>\n        Event Name\n        <input type=\"text\" formControlName=\"eventName\" />\n      </label>\n\n      <label>\n        Event Date\n        <input type=\"date\" formControlName=\"eventDate\" />\n      </label>\n\n      <label>\n        Start Time\n        <input type=\"time\" formControlName=\"eventTime\" />\n      </label>\n\n      <label>\n        Event Style\n        <select formControlName=\"eventStyle\">\n          <option>Meeting</option>\n          <option>3-Course Dinner</option>\n          <option>Buffet</option>\n          <option>Reception/Standing</option>\n          <option>BBQ</option>\n          <option>Afternoon Tea</option>\n          <option>Drinks Reception</option>\n          <option>Custom</option>\n        </select>\n      </label>\n\n      <label>\n        Setup Style\n        <select formControlName=\"setupStyle\">\n          <option>Theatre</option>\n          <option>Banquet</option>\n          <option>Boardroom</option>\n          <option>Cabaret</option>\n          <option>Reception</option>\n          <option>Classroom</option>\n          <option>U-Shape</option>\n          <option>Custom</option>\n        </select>\n      </label>\n\n      <label>\n        Guests\n        <input type=\"number\" min=\"1\" formControlName=\"guestsExpected\" />\n      </label>\n\n      <label>\n        Budget Min\n        <input type=\"number\" min=\"0\" formControlName=\"budgetMinAmount\" />\n      </label>\n\n      <label>\n        Budget Max\n        <input type=\"number\" min=\"0\" formControlName=\"budgetMaxAmount\" />\n      </label>\n\n      <label>\n        Source\n        <select formControlName=\"sourceType\">\n          <option>Phone</option>\n          <option>Walk-in</option>\n          <option>Referral</option>\n          <option>Social Media</option>\n          <option>Venue Event</option>\n          <option>Third-Party</option>\n          <option>Returning Client</option>\n          <option>Website Form</option>\n          <option>Email</option>\n        </select>\n      </label>\n\n      <label>\n        Source Detail\n        <input type=\"text\" formControlName=\"sourceDetail\" />\n      </label>\n\n      <label>\n        Lead Quality (1-5)\n        <input type=\"number\" min=\"1\" max=\"5\" formControlName=\"leadQuality\" />\n      </label>\n\n      <label class=\"checkbox\">\n        <input type=\"checkbox\" formControlName=\"marketingConsent\" />\n        <span>Marketing consent</span>\n      </label>\n\n      <label class=\"checkbox\">\n        <input type=\"checkbox\" formControlName=\"hasFlexibleDates\" />\n        <span>Flexible dates</span>\n      </label>\n\n      <label class=\"full\">\n        Flexible Date Notes\n        <textarea rows=\"2\" formControlName=\"flexibleDateNotes\"></textarea>\n      </label>\n\n      <label class=\"full\">\n        Special Requirements\n        <textarea rows=\"2\" formControlName=\"specialRequirements\"></textarea>\n      </label>\n\n      <label class=\"full\">\n        Internal Notes\n        <textarea rows=\"3\" formControlName=\"internalNotes\"></textarea>\n      </label>\n\n      @if (availability) {\n        <section class=\"availability\">\n          <h3>Same-date availability</h3>\n          @for (group of availability.spaces; track group.spaceId) {\n            <article>\n              <header>\n                <strong>{{ group.spaceName }}</strong>\n                @if (group.isAvailable) {\n                  <span class=\"available\">Available</span>\n                } @else {\n                  <span class=\"busy\">Busy</span>\n                }\n              </header>\n              @for (event of group.events; track event.recordId) {\n                <div class=\"availability-event\">\n                  <strong>{{ event.label }}</strong>\n                  <span>{{ event.recordType }} \u00B7 {{ event.startUtc | date: 'HH:mm' }}-{{ event.endUtc | date: 'HH:mm' }}</span>\n                  @if (event.enquiryStatus) {\n                    <span>{{ event.enquiryStatus }} \u00B7 {{ event.covers }} covers</span>\n                  }\n                </div>\n              }\n            </article>\n          }\n        </section>\n      }\n\n      <div class=\"drawer-actions\">\n        <button type=\"button\" class=\"ghost-btn\" (click)=\"closeDrawer()\">Cancel</button>\n        <button type=\"submit\" class=\"primary-btn\" [disabled]=\"isSubmitting\">\n          {{ isSubmitting ? 'Creating...' : 'Create Enquiry' }}\n        </button>\n      </div>\n    </form>\n  </aside>\n</div>\n", styles: [":host {\n  display: block;\n  min-height: 100vh;\n}\n\n.workspace {\n  min-height: 100vh;\n  background: #f3f5fb;\n}\n\n.sidebar {\n  position: fixed;\n  inset: 0 auto 0 0;\n  z-index: 45;\n  width: 286px;\n  background: linear-gradient(180deg, #11152f 0%, #0c1024 100%);\n  border-right: 1px solid rgba(148, 163, 184, 0.18);\n  color: #d5dcf8;\n  display: grid;\n  grid-template-rows: auto 1fr auto;\n  overflow: hidden;\n}\n\n.sidebar-top {\n  padding: 1.1rem 1rem 0.85rem;\n  border-bottom: 1px solid rgba(148, 163, 184, 0.14);\n  display: grid;\n  gap: 0.8rem;\n}\n\n.brand {\n  display: flex;\n  align-items: center;\n  gap: 0.66rem;\n  color: #eef2ff;\n  text-decoration: none;\n}\n\n.logo-image {\n  width: 32px;\n  height: 32px;\n  border-radius: 8px;\n  object-fit: cover;\n  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.35);\n}\n\n.brand-copy {\n  display: grid;\n  gap: 0.05rem;\n}\n\n.brand-copy strong {\n  font-size: 1.01rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n}\n\n.brand-copy small {\n  font-size: 0.68rem;\n  text-transform: uppercase;\n  letter-spacing: 0.09em;\n  color: #9aa6d1;\n  font-weight: 700;\n}\n\n.venue-field {\n  display: grid;\n  gap: 0.28rem;\n}\n\n.venue-field span {\n  font-size: 0.62rem;\n  text-transform: uppercase;\n  letter-spacing: 0.09em;\n  color: #8f9bc6;\n  font-weight: 800;\n}\n\n.venue-field select {\n  width: 100%;\n  border: 1px solid rgba(148, 163, 184, 0.26);\n  border-radius: 10px;\n  background: rgba(30, 41, 59, 0.7);\n  color: #e5e7eb;\n  padding: 0.48rem 0.55rem;\n  font-size: 0.8rem;\n}\n\n.sidebar-scroll {\n  overflow-y: auto;\n  padding: 0.95rem 0.75rem 1.1rem;\n  display: grid;\n  gap: 0.95rem;\n  align-content: start;\n}\n\n.sidebar-group {\n  display: grid;\n  gap: 0.42rem;\n}\n\n.sidebar-heading {\n  margin: 0;\n  padding: 0 0.45rem;\n  font-size: 0.65rem;\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  color: #7782ad;\n  font-weight: 800;\n}\n\n.sidebar-nav {\n  display: grid;\n  gap: 0.24rem;\n}\n\n.sidebar-nav a {\n  color: #c7cff0;\n  border: 1px solid transparent;\n  border-radius: 11px;\n  padding: 0.58rem 0.62rem;\n  font-size: 0.95rem;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.45rem;\n  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;\n}\n\n.sidebar-nav a:hover {\n  background: rgba(79, 70, 229, 0.16);\n  border-color: rgba(129, 140, 248, 0.38);\n  color: #f8fafc;\n}\n\n.sidebar-nav a.active {\n  background: rgba(79, 70, 229, 0.22);\n  border-color: rgba(165, 180, 252, 0.42);\n  color: #ffffff;\n}\n\n.badge {\n  min-width: 18px;\n  text-align: center;\n  border-radius: 999px;\n  padding: 0.08rem 0.34rem;\n  background: #f43f5e;\n  color: #fff;\n  font-style: normal;\n  font-size: 0.62rem;\n  font-weight: 800;\n}\n\n.sidebar-footer {\n  border-top: 1px solid rgba(148, 163, 184, 0.14);\n  padding: 0.8rem;\n  display: grid;\n  gap: 0.6rem;\n}\n\n.sidebar-user-card {\n  display: flex;\n  align-items: center;\n  gap: 0.58rem;\n}\n\n.sidebar-user-card .identity {\n  display: grid;\n  gap: 0.1rem;\n  min-width: 0;\n}\n\n.sidebar-user-card strong {\n  color: #f8fafc;\n  font-size: 0.82rem;\n  line-height: 1.1;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.sidebar-user-card small {\n  color: #9aa6d1;\n  font-size: 0.7rem;\n}\n\n.signout-btn {\n  border: 1px solid rgba(148, 163, 184, 0.25);\n  background: rgba(15, 23, 42, 0.35);\n  color: #dbeafe;\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font-size: 0.76rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.07em;\n  transition: border-color 0.2s ease, background-color 0.2s ease;\n}\n\n.signout-btn:hover {\n  border-color: rgba(191, 219, 254, 0.65);\n  background: rgba(30, 41, 59, 0.5);\n}\n\n.main-panel {\n  margin-left: 286px;\n  min-height: 100vh;\n  display: grid;\n  grid-template-rows: auto 1fr;\n}\n\n.topbar {\n  position: sticky;\n  top: 0;\n  z-index: 30;\n  background: rgba(255, 255, 255, 0.96);\n  border-bottom: 1px solid var(--cf-border-soft);\n  backdrop-filter: blur(8px);\n}\n\n.topbar-inner {\n  padding: 0.8rem 1.35rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}\n\n.topbar-left {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  min-width: 0;\n}\n\n.mobile-nav-toggle {\n  display: none;\n}\n\n.breadcrumbs {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.46rem;\n  white-space: nowrap;\n}\n\n.crumb-primary {\n  color: #0f172a;\n  font-size: 1.83rem;\n  line-height: 1;\n  font-weight: 700;\n}\n\n.crumb-sep {\n  color: #9aa3bf;\n  font-size: 1.05rem;\n  font-weight: 700;\n}\n\n.crumb-muted,\n.crumb-current {\n  font-size: 0.84rem;\n  font-weight: 700;\n}\n\n.crumb-muted {\n  color: #7c88ab;\n}\n\n.crumb-current {\n  color: #1e293b;\n}\n\n.topbar-right {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.46rem;\n  min-width: 0;\n}\n\n.search-wrap {\n  position: relative;\n  width: min(430px, 48vw);\n}\n\n.search {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  border: 1px solid var(--cf-border);\n  background: #f8fafc;\n  border-radius: 999px;\n  padding: 0.5rem 0.8rem;\n}\n\n.search-icon {\n  color: #94a3b8;\n  font-size: 0.86rem;\n}\n\n.search input {\n  width: 100%;\n  border: 0;\n  background: transparent;\n  color: #334155;\n  font-size: 0.86rem;\n  outline: none;\n}\n\n.search input::placeholder {\n  color: #94a3b8;\n}\n\n.icon-btn {\n  width: 36px;\n  height: 36px;\n  border-radius: 10px;\n  border: 1px solid transparent;\n  background: transparent;\n  color: #64748b;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;\n}\n\n.icon-btn:hover {\n  color: #334155;\n  background: #f8fafc;\n  border-color: var(--cf-border-soft);\n}\n\n.primary-btn {\n  border: 1px solid transparent;\n  background: #4f46e5;\n  color: #fff;\n  border-radius: 12px;\n  padding: 0.52rem 0.9rem;\n  font-size: 0.84rem;\n  font-weight: 700;\n  transition: background-color 0.2s ease, box-shadow 0.2s ease;\n}\n\n.primary-btn:hover {\n  background: #4338ca;\n  box-shadow: 0 10px 18px rgba(79, 70, 229, 0.28);\n}\n\n.primary-btn:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n}\n\n.ghost-btn {\n  border: 1px solid var(--cf-border);\n  background: #fff;\n  color: #475569;\n  border-radius: 10px;\n  padding: 0.5rem 0.85rem;\n  font-size: 0.84rem;\n  font-weight: 700;\n}\n\n.avatar {\n  width: 36px;\n  height: 36px;\n  border-radius: 999px;\n  border: 1px solid #c7d2fe;\n  background: #eef2ff;\n  color: #4338ca;\n  font-size: 0.74rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.recent-wrap,\n.settings-wrap,\n.notifications-wrap {\n  position: relative;\n}\n\n.recent-menu,\n.settings-menu,\n.notifications-menu,\n.search-menu {\n  position: absolute;\n  right: 0;\n  top: calc(100% + 8px);\n  z-index: 95;\n  background: #fff;\n  border: 1px solid var(--cf-border);\n  border-radius: 14px;\n  box-shadow: var(--cf-shadow-md);\n}\n\n.recent-menu {\n  width: min(380px, 90vw);\n  padding: 0.5rem;\n  display: grid;\n  gap: 0.4rem;\n}\n\n.recent-title {\n  margin: 0.1rem 0.2rem 0.25rem;\n  font-size: 0.65rem;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: #94a3b8;\n  font-weight: 800;\n}\n\n.recent-menu button {\n  border: 1px solid var(--cf-border-soft);\n  background: #fff;\n  border-radius: 12px;\n  text-align: left;\n  padding: 0.56rem 0.66rem;\n  display: grid;\n  gap: 0.16rem;\n}\n\n.recent-menu button:hover {\n  border-color: #c7d2fe;\n  background: #f8faff;\n}\n\n.recent-menu strong {\n  font-size: 0.8rem;\n  color: #0f172a;\n}\n\n.recent-menu span,\n.recent-menu em {\n  margin: 0;\n  font-size: 0.72rem;\n  color: #64748b;\n  font-style: normal;\n}\n\n.recent-menu .empty,\n.search-menu .empty,\n.notifications-menu .empty {\n  margin: 0.4rem 0.3rem;\n  color: #94a3b8;\n  font-size: 0.78rem;\n}\n\n.settings-menu {\n  width: min(260px, 90vw);\n  padding: 0.4rem;\n  display: grid;\n  gap: 0.3rem;\n}\n\n.settings-menu button {\n  border: 1px solid var(--cf-border-soft);\n  background: #fff;\n  border-radius: 10px;\n  text-align: left;\n  padding: 0.5rem 0.6rem;\n  font-size: 0.8rem;\n  color: #334155;\n  font-weight: 600;\n}\n\n.settings-menu button:hover {\n  border-color: #c7d2fe;\n  background: #f8faff;\n}\n\n.search-menu {\n  left: 0;\n  right: 0;\n  max-height: min(420px, 70vh);\n  overflow: auto;\n  padding: 0.45rem;\n  display: grid;\n  gap: 0.34rem;\n}\n\n.search-menu button {\n  border: 1px solid var(--cf-border-soft);\n  background: #fff;\n  border-radius: 10px;\n  text-align: left;\n  padding: 0.45rem 0.55rem;\n  display: grid;\n  gap: 0.14rem;\n  color: #334155;\n}\n\n.search-menu button:hover {\n  border-color: #c7d2fe;\n  background: #f8faff;\n}\n\n.search-menu strong {\n  font-size: 0.76rem;\n  color: #0f172a;\n}\n\n.search-menu span {\n  font-size: 0.7rem;\n  color: #64748b;\n}\n\n.search-section-title {\n  margin: 0.1rem 0.2rem;\n  font-size: 0.64rem;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  color: #94a3b8;\n  font-weight: 800;\n}\n\n.notification-badge {\n  position: absolute;\n  top: -3px;\n  right: -4px;\n  min-width: 16px;\n  height: 16px;\n  padding: 0 0.2rem;\n  border-radius: 999px;\n  background: #f43f5e;\n  color: #fff;\n  font-size: 0.6rem;\n  font-weight: 800;\n  line-height: 16px;\n  text-align: center;\n}\n\n.notifications-menu {\n  width: min(360px, 90vw);\n  max-height: min(440px, 70vh);\n  overflow: auto;\n  padding: 0.45rem;\n  display: grid;\n  gap: 0.34rem;\n}\n\n.notifications-title {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n  margin: 0 0.1rem 0.1rem;\n}\n\n.notifications-title span {\n  font-size: 0.68rem;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  color: #94a3b8;\n  font-weight: 800;\n}\n\n.notifications-title button {\n  border: 0;\n  background: transparent;\n  color: #4f46e5;\n  font-size: 0.68rem;\n  font-weight: 700;\n  padding: 0;\n}\n\n.notifications-menu > button {\n  border: 1px solid var(--cf-border-soft);\n  background: #fff;\n  border-radius: 10px;\n  text-align: left;\n  padding: 0.45rem 0.55rem;\n  display: grid;\n  gap: 0.12rem;\n}\n\n.notifications-menu > button.unread {\n  border-color: #c7d2fe;\n  background: #f8faff;\n}\n\n.notifications-menu strong {\n  font-size: 0.76rem;\n  color: #0f172a;\n}\n\n.notifications-menu span,\n.notifications-menu em {\n  font-size: 0.7rem;\n  color: #64748b;\n  font-style: normal;\n}\n\n.content {\n  padding: 1.25rem 1.35rem 2.2rem;\n}\n\n.content-inner {\n  max-width: 1600px;\n  margin: 0 auto;\n}\n\n.mobile-nav-backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: 40;\n  border: 0;\n  background: rgba(15, 23, 42, 0.38);\n  backdrop-filter: blur(2px);\n}\n\n.drawer-backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgba(15, 23, 42, 0.38);\n  backdrop-filter: blur(2px);\n  z-index: 80;\n}\n\n.drawer {\n  position: fixed;\n  top: 0;\n  right: 0;\n  height: 100vh;\n  width: min(800px, 100%);\n  background: #fff;\n  transform: translateX(100%);\n  transition: transform 0.25s ease;\n  z-index: 90;\n  box-shadow: -16px 0 36px rgba(15, 23, 42, 0.2);\n  display: grid;\n  grid-template-rows: auto 1fr;\n  overflow: hidden;\n}\n\n.drawer.open {\n  transform: translateX(0);\n}\n\n.drawer-header {\n  display: flex;\n  align-items: start;\n  justify-content: space-between;\n  padding: 1.1rem 1.2rem;\n  border-bottom: 1px solid var(--cf-border-soft);\n  background: #f8fafc;\n}\n\n.drawer-header h2 {\n  margin: 0;\n  font-size: 1.12rem;\n}\n\n.drawer-header p {\n  margin: 0.25rem 0 0;\n  font-size: 0.78rem;\n  color: #64748b;\n}\n\n.drawer-form {\n  overflow-y: auto;\n  padding: 1rem 1.2rem 1.3rem;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.86rem;\n  align-content: start;\n}\n\n.drawer-form label {\n  display: grid;\n  gap: 0.25rem;\n  font-size: 0.7rem;\n  line-height: 1.2;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  color: #64748b;\n  font-weight: 800;\n}\n\n.drawer-form input,\n.drawer-form select,\n.drawer-form textarea {\n  border: 1px solid var(--cf-border);\n  border-radius: 10px;\n  background: #fff;\n  color: #334155;\n  padding: 0.48rem 0.58rem;\n  font-size: 0.82rem;\n  text-transform: none;\n  letter-spacing: normal;\n  font-weight: 500;\n}\n\n.drawer-form textarea {\n  resize: vertical;\n}\n\n.drawer-form input:focus,\n.drawer-form select:focus,\n.drawer-form textarea:focus {\n  outline: 0;\n  border-color: #a5b4fc;\n  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);\n}\n\n.checkbox {\n  grid-template-columns: 18px 1fr;\n  align-items: center;\n  gap: 0.5rem;\n}\n\n.checkbox input {\n  margin: 0;\n}\n\n.checkbox span {\n  text-transform: none;\n  letter-spacing: normal;\n  font-size: 0.8rem;\n  font-weight: 600;\n}\n\n.full {\n  grid-column: 1 / -1;\n}\n\n.form-error {\n  grid-column: 1 / -1;\n  margin: 0;\n  border: 1px solid #fecaca;\n  background: #fef2f2;\n  color: #b91c1c;\n  border-radius: 12px;\n  padding: 0.6rem 0.72rem;\n  font-size: 0.78rem;\n  font-weight: 600;\n}\n\n.availability {\n  grid-column: 1 / -1;\n  border: 1px solid #ddd6fe;\n  background: #f8f8ff;\n  border-radius: 14px;\n  padding: 0.75rem;\n  display: grid;\n  gap: 0.5rem;\n}\n\n.availability h3 {\n  margin: 0;\n  font-size: 0.82rem;\n  text-transform: uppercase;\n  letter-spacing: 0.07em;\n  color: #4f46e5;\n}\n\n.availability article {\n  border: 1px solid var(--cf-border-soft);\n  border-radius: 12px;\n  background: #fff;\n  padding: 0.52rem 0.6rem;\n  display: grid;\n  gap: 0.26rem;\n}\n\n.availability article header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.availability article header strong {\n  font-size: 0.8rem;\n  color: #1f2937;\n}\n\n.available,\n.busy {\n  font-size: 0.62rem;\n  padding: 0.16rem 0.42rem;\n  border-radius: 999px;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  font-weight: 800;\n}\n\n.available {\n  background: #dcfce7;\n  color: #166534;\n}\n\n.busy {\n  background: #fef3c7;\n  color: #92400e;\n}\n\n.availability-event {\n  display: grid;\n  gap: 0.08rem;\n}\n\n.availability-event strong {\n  font-size: 0.76rem;\n  color: #1f2937;\n}\n\n.availability-event span {\n  font-size: 0.7rem;\n  color: #64748b;\n}\n\n.drawer-actions {\n  grid-column: 1 / -1;\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  padding-top: 0.35rem;\n}\n\n@media (max-width: 1240px) {\n  .crumb-primary {\n    font-size: 1.48rem;\n  }\n\n  .search-wrap {\n    width: min(320px, 40vw);\n  }\n}\n\n@media (max-width: 1080px) {\n  .sidebar {\n    transform: translateX(-104%);\n    transition: transform 0.24s ease;\n  }\n\n  .sidebar.open {\n    transform: translateX(0);\n  }\n\n  .main-panel {\n    margin-left: 0;\n  }\n\n  .mobile-nav-toggle {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n  }\n\n  .topbar-inner {\n    padding: 0.72rem 0.9rem;\n  }\n\n  .content {\n    padding: 1rem 0.9rem 2rem;\n  }\n}\n\n@media (max-width: 860px) {\n  .crumb-muted,\n  .crumb-sep {\n    display: none;\n  }\n\n  .crumb-primary {\n    font-size: 1.28rem;\n  }\n\n  .search-wrap {\n    width: min(280px, 48vw);\n  }\n\n  .drawer-form {\n    grid-template-columns: 1fr;\n  }\n}\n\n@media (max-width: 680px) {\n  .search-wrap {\n    width: min(220px, 58vw);\n  }\n\n  .recent-wrap,\n  .settings-wrap {\n    display: none;\n  }\n\n  .primary-btn {\n    padding: 0.48rem 0.62rem;\n    font-size: 0.77rem;\n  }\n}\n\n@media (max-width: 560px) {\n  .topbar-inner {\n    gap: 0.4rem;\n  }\n\n  .search-wrap,\n  .notifications-wrap,\n  .topbar-right .primary-btn {\n    display: none;\n  }\n\n  .crumb-primary {\n    font-size: 1.12rem;\n  }\n}\n"] }]
    }], null, { closeMenus: [{
            type: HostListener,
            args: ['document:click']
        }], onEscape: [{
            type: HostListener,
            args: ['document:keydown.escape']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppShellComponent, { className: "AppShellComponent", filePath: "src/app/layout/app-shell.component.ts", lineNumber: 35 }); })();
//# sourceMappingURL=app-shell.component.js.map