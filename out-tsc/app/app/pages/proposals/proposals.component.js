import { Component, DestroyRef, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _c0 = () => ({ standalone: true });
function ProposalsComponent_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 25);
    i0.ɵɵlistener("click", function ProposalsComponent_Conditional_9_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openBuilderForEdit()); });
    i0.ɵɵtext(1, "Edit Draft");
    i0.ɵɵelementEnd();
} }
function ProposalsComponent_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 4);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", ctx.page.totalCount, " total");
} }
function ProposalsComponent_Conditional_11_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 27);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.builderError);
} }
function ProposalsComponent_Conditional_11_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.builderNotice);
} }
function ProposalsComponent_Conditional_11_For_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 8);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const enquiry_r4 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("value", enquiry_r4.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.getEnquiryLabel(enquiry_r4));
} }
function ProposalsComponent_Conditional_11_For_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 8);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const template_r5 = ctx.$implicit;
    i0.ɵɵproperty("value", template_r5.key);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", template_r5.label, " (", template_r5.eventType, ")");
} }
function ProposalsComponent_Conditional_11_For_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 8);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const doc_r6 = ctx.$implicit;
    i0.ɵɵproperty("value", doc_r6.version);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", doc_r6.title, " \u00B7 ", doc_r6.version);
} }
function ProposalsComponent_Conditional_11_For_91_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 40)(1, "td")(2, "select", 46)(3, "option", 47);
    i0.ɵɵtext(4, "Room Hire");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "option", 48);
    i0.ɵɵtext(6, "Food & Beverage");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "option", 49);
    i0.ɵɵtext(8, "Equipment");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "option", 50);
    i0.ɵɵtext(10, "Entertainment");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "option", 51);
    i0.ɵɵtext(12, "Staffing");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "option", 52);
    i0.ɵɵtext(14, "Accommodation");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "option", 53);
    i0.ɵɵtext(16, "Miscellaneous");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(17, "td");
    i0.ɵɵelement(18, "input", 54);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "td");
    i0.ɵɵelement(20, "input", 55);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "td")(22, "select", 56)(23, "option", 57);
    i0.ɵɵtext(24, "Per person");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "option", 58);
    i0.ɵɵtext(26, "Per item");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "option", 59);
    i0.ɵɵtext(28, "Per hour");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "option", 60);
    i0.ɵɵtext(30, "Flat rate");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(31, "td");
    i0.ɵɵelement(32, "input", 61);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "td")(34, "select", 62)(35, "option", 8);
    i0.ɵɵtext(36, "20");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "option", 8);
    i0.ɵɵtext(38, "5");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "option", 8);
    i0.ɵɵtext(40, "0");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(41, "td");
    i0.ɵɵelement(42, "input", 63);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "td");
    i0.ɵɵelement(44, "input", 64);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "td");
    i0.ɵɵtext(46);
    i0.ɵɵpipe(47, "number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "td");
    i0.ɵɵtext(49);
    i0.ɵɵpipe(50, "number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(51, "td");
    i0.ɵɵtext(52);
    i0.ɵɵpipe(53, "number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(54, "td")(55, "button", 65);
    i0.ɵɵlistener("click", function ProposalsComponent_Conditional_11_For_91_Template_button_click_55_listener() { const ɵ$index_182_r8 = i0.ɵɵrestoreView(_r7).$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.removeLineItem(ɵ$index_182_r8)); });
    i0.ɵɵtext(56, "Remove");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ɵ$index_182_r8 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("formGroupName", ɵ$index_182_r8);
    i0.ɵɵadvance(35);
    i0.ɵɵproperty("value", 20);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("value", 5);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("value", 0);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(47, 7, ctx_r1.lineSubtotal(ɵ$index_182_r8), "1.2-2"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(50, 10, ctx_r1.lineVat(ɵ$index_182_r8), "1.2-2"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(53, 13, ctx_r1.lineTotal(ɵ$index_182_r8), "1.2-2"));
} }
function ProposalsComponent_Conditional_11_Conditional_117_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "number");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const vat_r9 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("VAT ", vat_r9.vatRate, "%: ", i0.ɵɵpipeBind2(2, 2, vat_r9.vatAmount, "1.2-2"));
} }
function ProposalsComponent_Conditional_11_Conditional_117_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 42)(1, "h4");
    i0.ɵɵtext(2, "VAT Breakdown");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 66);
    i0.ɵɵrepeaterCreate(4, ProposalsComponent_Conditional_11_Conditional_117_For_5_Template, 3, 5, "span", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.builderVatBreakdown);
} }
function ProposalsComponent_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 5)(1, "header")(2, "div")(3, "h2");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6, "Build line items, VAT, terms, validity, and send to the client portal.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "button", 26);
    i0.ɵɵlistener("click", function ProposalsComponent_Conditional_11_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeBuilder()); });
    i0.ɵɵtext(8, "Close");
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(9, ProposalsComponent_Conditional_11_Conditional_9_Template, 2, 1, "p", 27);
    i0.ɵɵconditionalCreate(10, ProposalsComponent_Conditional_11_Conditional_10_Template, 2, 1, "p", 28);
    i0.ɵɵelementStart(11, "form", 29);
    i0.ɵɵlistener("ngSubmit", function ProposalsComponent_Conditional_11_Template_form_ngSubmit_11_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.saveBuilder(false)); });
    i0.ɵɵelementStart(12, "div", 30)(13, "label")(14, "span");
    i0.ɵɵtext(15, "Enquiry");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "select", 9)(17, "option", 10);
    i0.ɵɵtext(18, "Select enquiry");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(19, ProposalsComponent_Conditional_11_For_20_Template, 2, 2, "option", 8, i0.ɵɵcomponentInstance().trackByEnquiryId, true);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "label")(22, "span");
    i0.ɵɵtext(23, "Template");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "select", 31)(25, "option", 10);
    i0.ɵɵtext(26, "No template");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(27, ProposalsComponent_Conditional_11_For_28_Template, 2, 3, "option", 8, i0.ɵɵcomponentInstance().trackByTemplateKey, true);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(29, "label")(30, "span");
    i0.ɵɵtext(31, "Title");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(32, "input", 32);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "label")(34, "span");
    i0.ɵɵtext(35, "Valid Until");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(36, "input", 33);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "label")(38, "span");
    i0.ɵɵtext(39, "Terms Version");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "select", 34)(41, "option", 10);
    i0.ɵɵtext(42, "Select terms");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(43, ProposalsComponent_Conditional_11_For_44_Template, 2, 3, "option", 8, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(45, "label")(46, "span");
    i0.ɵɵtext(47, "Currency");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(48, "input", 35);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "label")(50, "span");
    i0.ɵɵtext(51, "Service Charge %");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(52, "input", 36);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(53, "label", 37)(54, "span");
    i0.ɵɵtext(55, "Introduction");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(56, "textarea", 38);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(57, "section", 39)(58, "header")(59, "h3");
    i0.ɵɵtext(60, "Pricing Line Items");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(61, "button", 25);
    i0.ɵɵlistener("click", function ProposalsComponent_Conditional_11_Template_button_click_61_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.addLineItem()); });
    i0.ɵɵtext(62, "Add Line Item");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(63, "table")(64, "thead")(65, "tr")(66, "th");
    i0.ɵɵtext(67, "Category");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(68, "th");
    i0.ɵɵtext(69, "Description");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(70, "th");
    i0.ɵɵtext(71, "Qty");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(72, "th");
    i0.ɵɵtext(73, "Unit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(74, "th");
    i0.ɵɵtext(75, "Unit Price (ex VAT)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(76, "th");
    i0.ɵɵtext(77, "VAT %");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(78, "th");
    i0.ɵɵtext(79, "Discount %");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(80, "th");
    i0.ɵɵtext(81, "Discount Amt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(82, "th");
    i0.ɵɵtext(83, "Subtotal");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(84, "th");
    i0.ɵɵtext(85, "VAT");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(86, "th");
    i0.ɵɵtext(87, "Total");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(88, "th");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(89, "tbody");
    i0.ɵɵrepeaterCreate(90, ProposalsComponent_Conditional_11_For_91_Template, 57, 16, "tr", 40, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(92, "section", 41)(93, "article")(94, "span");
    i0.ɵɵtext(95, "Subtotal (ex VAT)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(96, "strong");
    i0.ɵɵtext(97);
    i0.ɵɵpipe(98, "number");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(99, "article")(100, "span");
    i0.ɵɵtext(101, "Service Charge");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(102, "strong");
    i0.ɵɵtext(103);
    i0.ɵɵpipe(104, "number");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(105, "article")(106, "span");
    i0.ɵɵtext(107, "Total VAT");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(108, "strong");
    i0.ɵɵtext(109);
    i0.ɵɵpipe(110, "number");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(111, "article")(112, "span");
    i0.ɵɵtext(113, "Total (inc VAT)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(114, "strong");
    i0.ɵɵtext(115);
    i0.ɵɵpipe(116, "number");
    i0.ɵɵelementEnd()()();
    i0.ɵɵconditionalCreate(117, ProposalsComponent_Conditional_11_Conditional_117_Template, 6, 0, "section", 42);
    i0.ɵɵelementStart(118, "footer", 43)(119, "button", 44);
    i0.ɵɵtext(120);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(121, "button", 45);
    i0.ɵɵlistener("click", function ProposalsComponent_Conditional_11_Template_button_click_121_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.saveBuilder(true)); });
    i0.ɵɵtext(122);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.builderMode === "edit" ? "Edit Proposal Draft" : "Create Proposal");
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.builderError ? 9 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.builderNotice ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroup", ctx_r1.builderForm);
    i0.ɵɵadvance(8);
    i0.ɵɵrepeater(ctx_r1.enquiryOptions);
    i0.ɵɵadvance(8);
    i0.ɵɵrepeater(ctx_r1.templateOptions);
    i0.ɵɵadvance(16);
    i0.ɵɵrepeater(ctx_r1.termsDocuments);
    i0.ɵɵadvance(47);
    i0.ɵɵrepeater(ctx_r1.lineItemControls);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate2("", i0.ɵɵpipeBind2(98, 17, ctx_r1.builderSubtotalExclVat, "1.2-2"), " ", ctx_r1.builderForm.controls.currencyCode.value);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate2("", i0.ɵɵpipeBind2(104, 20, ctx_r1.builderServiceChargeAmount, "1.2-2"), " ", ctx_r1.builderForm.controls.currencyCode.value);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate2("", i0.ɵɵpipeBind2(110, 23, ctx_r1.builderTotalVat, "1.2-2"), " ", ctx_r1.builderForm.controls.currencyCode.value);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate2("", i0.ɵɵpipeBind2(116, 26, ctx_r1.builderTotalInclVat, "1.2-2"), " ", ctx_r1.builderForm.controls.currencyCode.value);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.builderVatBreakdown.length > 0 ? 117 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.builderSaving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.builderSaving ? "Saving\u2026" : "Save Draft", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.builderSaving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.builderSaving ? "Saving\u2026" : "Save & Send", " ");
} }
function ProposalsComponent_For_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 8);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const status_r10 = ctx.$implicit;
    i0.ɵɵproperty("value", status_r10.value);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(status_r10.label);
} }
function ProposalsComponent_For_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 8);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const enquiry_r11 = ctx.$implicit;
    i0.ɵɵproperty("value", enquiry_r11.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(enquiry_r11.reference);
} }
function ProposalsComponent_Conditional_45_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 68);
    i0.ɵɵlistener("click", function ProposalsComponent_Conditional_45_For_2_Template_button_click_0_listener() { const status_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.setStatus(status_r13.value)); });
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "em");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const status_r13 = ctx.$implicit;
    const list_r14 = i0.ɵɵnextContext();
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("active", ctx_r1.filtersForm.value.status === status_r13.value);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(status_r13.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.getStatusCount(status_r13.value, list_r14));
} }
function ProposalsComponent_Conditional_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 21);
    i0.ɵɵrepeaterCreate(1, ProposalsComponent_Conditional_45_For_2_Template, 5, 4, "button", 67, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.statusOptions);
} }
function ProposalsComponent_Conditional_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 22);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.lastActionMessage);
} }
function ProposalsComponent_Conditional_47_For_21_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 73);
    i0.ɵɵlistener("click", function ProposalsComponent_Conditional_47_For_21_Template_tr_click_0_listener() { const proposal_r16 = i0.ɵɵrestoreView(_r15).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.selectProposal(proposal_r16.id)); });
    i0.ɵɵelementStart(1, "td")(2, "div", 74);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 75);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "td")(7, "a", 76);
    i0.ɵɵlistener("click", function ProposalsComponent_Conditional_47_For_21_Template_a_click_7_listener($event) { const proposal_r16 = i0.ɵɵrestoreView(_r15).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openEnquiry(proposal_r16.enquiryId, $event)); });
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "td");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "td")(12, "div", 74);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "div", 75);
    i0.ɵɵtext(15);
    i0.ɵɵpipe(16, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "td")(18, "span", 77);
    i0.ɵɵtext(19);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "td");
    i0.ɵɵtext(21);
    i0.ɵɵpipe(22, "number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "td");
    i0.ɵɵtext(24);
    i0.ɵɵpipe(25, "date");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const proposal_r16 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("selected", proposal_r16.id === ctx_r1.selectedProposalId);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(proposal_r16.version);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(proposal_r16.enquiryReference);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", proposal_r16.enquiryReference, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(proposal_r16.clientName);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(proposal_r16.eventType);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(16, 13, proposal_r16.eventStartUtc, "dd/MM/yyyy HH:mm"));
    i0.ɵɵadvance(3);
    i0.ɵɵattribute("data-status", ctx_r1.statusToken(proposal_r16.status));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", proposal_r16.status, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", i0.ɵɵpipeBind2(22, 16, proposal_r16.totalAmount, "1.2-2"), " ", proposal_r16.currencyCode);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(25, 19, proposal_r16.createdAtUtc, "dd/MM/yyyy HH:mm"));
} }
function ProposalsComponent_Conditional_47_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 71);
    i0.ɵɵtext(1, "No proposals match the current filters.");
    i0.ɵɵelementEnd();
} }
function ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_Conditional_50_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 68);
    i0.ɵɵlistener("click", function ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_Conditional_50_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r18); const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.openBuilderForEdit()); });
    i0.ɵɵtext(1, "Edit Draft");
    i0.ɵɵelementEnd();
} }
function ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_For_75_Template(rf, ctx) { if (rf & 1) {
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
    i0.ɵɵtext(10);
    i0.ɵɵpipe(11, "number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "td");
    i0.ɵɵtext(13);
    i0.ɵɵpipe(14, "number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "td");
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "td");
    i0.ɵɵtext(18);
    i0.ɵɵpipe(19, "number");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const line_r19 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(line_r19.category);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(line_r19.description);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(line_r19.quantity);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(line_r19.unit);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(11, 9, line_r19.unitPriceExclVat, "1.2-2"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate2("", line_r19.discountPercent, "% + ", i0.ɵɵpipeBind2(14, 12, line_r19.discountAmount, "1.2-2"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", line_r19.vatRate, "%");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(19, 15, line_r19.totalInclVat, "1.2-2"));
} }
function ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_For_84_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 8);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "number");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const version_r20 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("value", version_r20.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate3(" ", version_r20.version, " \u00B7 ", version_r20.status, " \u00B7 ", i0.ɵɵpipeBind2(2, 4, version_r20.totalAmount, "1.2-2"), " ");
} }
function ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_For_84_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_For_84_Conditional_0_Template, 3, 7, "option", 8);
} if (rf & 2) {
    const version_r20 = ctx.$implicit;
    const proposal_r21 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(version_r20.id !== proposal_r21.id ? 0 : -1);
} }
function ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_Conditional_87_For_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td");
    i0.ɵɵtext(6);
    i0.ɵɵpipe(7, "number");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const line_r22 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(line_r22.description);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(line_r22.changeType);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(7, 3, line_r22.delta, "1.2-2"));
} }
function ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_Conditional_87_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 85)(1, "p")(2, "strong");
    i0.ɵɵtext(3, "Left total:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p")(7, "strong");
    i0.ɵɵtext(8, "Right total:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(9);
    i0.ɵɵpipe(10, "number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "p")(12, "strong");
    i0.ɵɵtext(13, "Delta:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(14);
    i0.ɵɵpipe(15, "number");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "table")(17, "thead")(18, "tr")(19, "th");
    i0.ɵɵtext(20, "Description");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "th");
    i0.ɵɵtext(22, "Change Type");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "th");
    i0.ɵɵtext(24, "Delta");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(25, "tbody");
    i0.ɵɵrepeaterCreate(26, ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_Conditional_87_For_27_Template, 8, 6, "tr", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const diff_r23 = ctx;
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(5, 3, diff_r23.leftTotal, "1.2-2"));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(10, 6, diff_r23.rightTotal, "1.2-2"));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(15, 9, diff_r23.totalDelta, "1.2-2"));
    i0.ɵɵadvance(12);
    i0.ɵɵrepeater(diff_r23.lineDeltas);
} }
function ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r17 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "header")(1, "div")(2, "h2");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "span", 77);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "section", 78)(9, "p")(10, "strong");
    i0.ɵɵtext(11, "Reference:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "p")(14, "strong");
    i0.ɵɵtext(15, "Version:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "p")(18, "strong");
    i0.ɵɵtext(19, "Total:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(20);
    i0.ɵɵpipe(21, "number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "p")(23, "strong");
    i0.ɵɵtext(24, "Valid Until:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(25);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "p")(27, "strong");
    i0.ɵɵtext(28, "Terms:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(29);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "p")(31, "strong");
    i0.ɵɵtext(32, "Sent:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(33);
    i0.ɵɵpipe(34, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "p")(36, "strong");
    i0.ɵɵtext(37, "Viewed:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(38);
    i0.ɵɵpipe(39, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "p")(41, "strong");
    i0.ɵɵtext(42, "Accepted:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(43);
    i0.ɵɵpipe(44, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(45, "section", 79)(46, "button", 68);
    i0.ɵɵlistener("click", function ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_Template_button_click_46_listener() { i0.ɵɵrestoreView(_r17); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.sendSelectedProposal()); });
    i0.ɵɵtext(47, "Send to Client");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "button", 68);
    i0.ɵɵlistener("click", function ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_Template_button_click_48_listener() { i0.ɵɵrestoreView(_r17); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.duplicateSelectedProposal()); });
    i0.ɵɵtext(49, "Duplicate");
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(50, ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_Conditional_50_Template, 2, 0, "button", 80);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(51, "section", 81)(52, "h3");
    i0.ɵɵtext(53, "Line Items");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(54, "table")(55, "thead")(56, "tr")(57, "th");
    i0.ɵɵtext(58, "Category");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(59, "th");
    i0.ɵɵtext(60, "Description");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(61, "th");
    i0.ɵɵtext(62, "Qty");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(63, "th");
    i0.ɵɵtext(64, "Unit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(65, "th");
    i0.ɵɵtext(66, "Unit Price");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(67, "th");
    i0.ɵɵtext(68, "Discount");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(69, "th");
    i0.ɵɵtext(70, "VAT");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(71, "th");
    i0.ɵɵtext(72, "Total");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(73, "tbody");
    i0.ɵɵrepeaterCreate(74, ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_For_75_Template, 20, 18, "tr", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(76, "section", 82)(77, "h3");
    i0.ɵɵtext(78, "Version Comparison");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(79, "div", 83)(80, "select", 84);
    i0.ɵɵtwoWayListener("ngModelChange", function ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_Template_select_ngModelChange_80_listener($event) { i0.ɵɵrestoreView(_r17); const ctx_r1 = i0.ɵɵnextContext(3); i0.ɵɵtwoWayBindingSet(ctx_r1.compareWithProposalId, $event) || (ctx_r1.compareWithProposalId = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementStart(81, "option", 10);
    i0.ɵɵtext(82, "Select version to compare");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(83, ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_For_84_Template, 1, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(85, "button", 68);
    i0.ɵɵlistener("click", function ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_Template_button_click_85_listener() { i0.ɵɵrestoreView(_r17); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.compareSelectedProposal()); });
    i0.ɵɵtext(86, "Compare");
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(87, ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_Conditional_87_Template, 28, 12);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_21_0;
    const proposal_r21 = i0.ɵɵnextContext();
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(proposal_r21.title || proposal_r21.enquiryReference + " " + proposal_r21.version);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", proposal_r21.clientName, " \u00B7 ", proposal_r21.eventType);
    i0.ɵɵadvance();
    i0.ɵɵattribute("data-status", ctx_r1.statusToken(proposal_r21.status));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", proposal_r21.status, " ");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", proposal_r21.enquiryReference);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", proposal_r21.version);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2(" ", i0.ɵɵpipeBind2(21, 18, proposal_r21.totalAmount, "1.2-2"), " ", proposal_r21.currencyCode);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", proposal_r21.validUntilDate || "Not set");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", proposal_r21.termsVersion);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", proposal_r21.sentAtUtc ? i0.ɵɵpipeBind2(34, 21, proposal_r21.sentAtUtc, "dd/MM/yyyy HH:mm") : "Not sent");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", proposal_r21.lastViewedAtUtc ? i0.ɵɵpipeBind2(39, 24, proposal_r21.lastViewedAtUtc, "dd/MM/yyyy HH:mm") : "Not viewed");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", proposal_r21.acceptedAtUtc ? i0.ɵɵpipeBind2(44, 27, proposal_r21.acceptedAtUtc, "dd/MM/yyyy HH:mm") : "Not accepted");
    i0.ɵɵadvance(7);
    i0.ɵɵconditional(ctx_r1.selectedProposalCanEdit ? 50 : -1);
    i0.ɵɵadvance(24);
    i0.ɵɵrepeater(proposal_r21.lineItems);
    i0.ɵɵadvance(6);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.compareWithProposalId);
    i0.ɵɵproperty("ngModelOptions", i0.ɵɵpureFunction0(30, _c0));
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(proposal_r21.versions);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional((tmp_21_0 = ctx_r1.comparison) ? 87 : -1, tmp_21_0);
} }
function ProposalsComponent_Conditional_47_Conditional_23_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 24);
    i0.ɵɵtext(1, "Loading proposal details...");
    i0.ɵɵelementEnd();
} }
function ProposalsComponent_Conditional_47_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "aside", 72);
    i0.ɵɵconditionalCreate(1, ProposalsComponent_Conditional_47_Conditional_23_Conditional_1_Template, 88, 31)(2, ProposalsComponent_Conditional_47_Conditional_23_Conditional_2_Template, 2, 0, "p", 24);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r1.loadingDetail ? 1 : 2);
} }
function ProposalsComponent_Conditional_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 23)(1, "article", 69)(2, "table")(3, "thead")(4, "tr")(5, "th");
    i0.ɵɵtext(6, "Version");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "th");
    i0.ɵɵtext(8, "Enquiry");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "th");
    i0.ɵɵtext(10, "Client");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "th");
    i0.ɵɵtext(12, "Event");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "th");
    i0.ɵɵtext(14, "Status");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "th");
    i0.ɵɵtext(16, "Value");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "th");
    i0.ɵɵtext(18, "Created");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(19, "tbody");
    i0.ɵɵrepeaterCreate(20, ProposalsComponent_Conditional_47_For_21_Template, 26, 22, "tr", 70, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(22, ProposalsComponent_Conditional_47_Conditional_22_Template, 2, 0, "p", 71);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(23, ProposalsComponent_Conditional_47_Conditional_23_Template, 3, 1, "aside", 72);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(20);
    i0.ɵɵrepeater(ctx_r1.proposals);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.proposals.length === 0 ? 22 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional((tmp_3_0 = ctx_r1.selectedProposal) ? 23 : -1, tmp_3_0);
} }
function ProposalsComponent_Conditional_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 24);
    i0.ɵɵtext(1, "Loading proposals...");
    i0.ɵɵelementEnd();
} }
export class ProposalsComponent {
    constructor() {
        this.api = inject(ApiService);
        this.auth = inject(AuthService);
        this.router = inject(Router);
        this.route = inject(ActivatedRoute);
        this.destroyRef = inject(DestroyRef);
        this.formBuilder = new FormBuilder();
        this.loadingList = false;
        this.loadingDetail = false;
        this.listResponse = null;
        this.proposals = [];
        this.selectedProposalId = null;
        this.selectedProposal = null;
        this.comparison = null;
        this.compareWithProposalId = '';
        this.lastActionMessage = '';
        this.selectedEnquiryIdFilter = null;
        this.isBuilderOpen = false;
        this.builderMode = 'create';
        this.builderSaving = false;
        this.builderError = '';
        this.builderNotice = '';
        this.builderSubtotalExclVat = 0;
        this.builderServiceChargeAmount = 0;
        this.builderTotalVat = 0;
        this.builderTotalInclVat = 0;
        this.builderVatBreakdown = [];
        this.enquiryOptions = [];
        this.templateOptions = [];
        this.termsDocuments = [];
        this.applyingTemplate = false;
        this.statusOptions = [
            { value: 'all', label: 'All' },
            { value: 'draft', label: 'Draft' },
            { value: 'sent', label: 'Sent' },
            { value: 'viewed', label: 'Viewed' },
            { value: 'accepted', label: 'Accepted' },
            { value: 'declined', label: 'Declined' },
            { value: 'expired', label: 'Expired' },
            { value: 'superseded', label: 'Superseded' }
        ];
        this.filtersForm = this.formBuilder.group({
            status: ['all'],
            enquiryId: [''],
            eventType: [''],
            sortBy: ['createdAt'],
            sortDirection: ['desc'],
            pageSize: [25]
        });
        this.builderForm = this.formBuilder.group({
            enquiryId: ['', Validators.required],
            templateKey: [''],
            title: [''],
            validUntilDate: [this.defaultValidUntilDate(), Validators.required],
            introduction: [''],
            termsVersion: [''],
            currencyCode: ['GBP', [Validators.required, Validators.maxLength(8)]],
            serviceChargePercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
            lineItems: this.formBuilder.array([])
        });
    }
    get venueId() {
        return this.auth.selectedVenueId;
    }
    get lineItemsArray() {
        return this.builderForm.get('lineItems');
    }
    get lineItemControls() {
        return this.lineItemsArray.controls;
    }
    get selectedProposalCanEdit() {
        return !!this.selectedProposal?.isEditable;
    }
    ngOnInit() {
        this.ensureBuilderHasAtLeastOneLine();
        this.loadBuilderSources();
        this.loadProposals(1);
        this.filtersForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.loadProposals(1);
        });
        this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const proposalId = params.get('proposal');
            const enquiryId = params.get('enquiry');
            const createRequested = params.get('create') === '1';
            if (enquiryId && this.filtersForm.value.enquiryId !== enquiryId) {
                this.filtersForm.patchValue({ enquiryId }, { emitEvent: false });
            }
            if (proposalId && proposalId !== this.selectedProposalId) {
                this.selectProposal(proposalId);
            }
            if (createRequested) {
                this.openBuilderForCreate(enquiryId ?? undefined);
            }
        });
        this.builderForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.recalculateBuilderTotals();
        });
        this.builderForm.controls.enquiryId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((enquiryId) => {
            this.onBuilderEnquiryChanged(enquiryId || '');
        });
        this.builderForm.controls.templateKey.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((templateKey) => {
            if (!this.applyingTemplate) {
                this.applyTemplate(templateKey || '');
            }
        });
    }
    setStatus(status) {
        this.filtersForm.patchValue({ status }, { emitEvent: true });
    }
    selectProposal(proposalId) {
        this.selectedProposalId = proposalId;
        this.selectedEnquiryIdFilter = null;
        this.loadProposalDetail(proposalId);
    }
    duplicateSelectedProposal() {
        if (!this.selectedProposal) {
            return;
        }
        this.api
            .duplicateProposal(this.selectedProposal.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.lastActionMessage = 'Proposal duplicated as a new draft version.';
                this.loadProposals(this.listResponse?.page.page ?? 1);
            },
            error: (error) => {
                this.lastActionMessage = error?.error ?? 'Unable to duplicate proposal.';
            }
        });
    }
    sendSelectedProposal() {
        if (!this.selectedProposalId) {
            return;
        }
        this.sendProposalByPrompt(this.selectedProposalId);
    }
    openBuilderForCreate(enquiryId) {
        this.builderMode = 'create';
        this.isBuilderOpen = true;
        this.builderError = '';
        this.builderNotice = '';
        this.comparison = null;
        const initialEnquiryId = enquiryId
            ?? this.selectedProposal?.enquiryId
            ?? this.selectedEnquiryIdFilter
            ?? this.enquiryOptions[0]?.id
            ?? '';
        this.applyingTemplate = true;
        this.builderForm.reset({
            enquiryId: initialEnquiryId,
            templateKey: '',
            title: '',
            validUntilDate: this.defaultValidUntilDate(),
            introduction: '',
            termsVersion: this.termsDocuments.find((doc) => doc.isActive)?.version ?? '',
            currencyCode: this.resolveDefaultCurrency(initialEnquiryId),
            serviceChargePercent: 0
        });
        this.applyingTemplate = false;
        this.lineItemsArray.clear();
        this.addLineItem();
        this.recalculateBuilderTotals();
        this.onBuilderEnquiryChanged(initialEnquiryId);
    }
    openBuilderForEdit() {
        if (!this.selectedProposal || !this.selectedProposal.isEditable) {
            return;
        }
        const proposal = this.selectedProposal;
        const serviceChargePercent = proposal.subtotalExclVat > 0
            ? this.round2((proposal.serviceChargeAmount / proposal.subtotalExclVat) * 100)
            : 0;
        this.builderMode = 'edit';
        this.isBuilderOpen = true;
        this.builderError = '';
        this.builderNotice = '';
        this.comparison = null;
        this.applyingTemplate = true;
        this.builderForm.patchValue({
            enquiryId: proposal.enquiryId,
            templateKey: '',
            title: proposal.title ?? '',
            validUntilDate: proposal.validUntilDate ?? this.defaultValidUntilDate(),
            introduction: proposal.introduction ?? '',
            termsVersion: proposal.termsVersion,
            currencyCode: proposal.currencyCode,
            serviceChargePercent
        });
        this.applyingTemplate = false;
        this.lineItemsArray.clear();
        for (const line of proposal.lineItems) {
            const fixedDiscountAmount = this.resolveFixedDiscountAmount(line.quantity, line.unitPriceExclVat, line.discountPercent, line.discountAmount);
            this.lineItemsArray.push(this.createLineItemGroup({
                category: line.category,
                description: line.description,
                quantity: line.quantity,
                unit: line.unit,
                unitPriceExclVat: line.unitPriceExclVat,
                vatRate: line.vatRate,
                discountPercent: line.discountPercent,
                discountAmount: fixedDiscountAmount
            }));
        }
        this.ensureBuilderHasAtLeastOneLine();
        this.onBuilderEnquiryChanged(proposal.enquiryId);
        this.recalculateBuilderTotals();
    }
    closeBuilder() {
        this.isBuilderOpen = false;
        this.builderError = '';
    }
    addLineItem(seed) {
        this.lineItemsArray.push(this.createLineItemGroup(seed));
        this.recalculateBuilderTotals();
    }
    removeLineItem(index) {
        if (this.lineItemsArray.length <= 1) {
            return;
        }
        this.lineItemsArray.removeAt(index);
        this.recalculateBuilderTotals();
    }
    saveBuilder(sendAfterSave) {
        if (!this.venueId) {
            this.builderError = 'Select a venue before saving a proposal.';
            return;
        }
        if (this.builderForm.invalid) {
            this.builderForm.markAllAsTouched();
            this.builderError = 'Complete the required fields before saving.';
            return;
        }
        const enquiryId = this.builderForm.controls.enquiryId.value ?? '';
        if (!enquiryId) {
            this.builderError = 'Choose an enquiry for this proposal.';
            return;
        }
        const lineItems = this.toLineItemPayload();
        if (lineItems.length === 0) {
            this.builderError = 'Add at least one line item to continue.';
            return;
        }
        this.builderSaving = true;
        this.builderError = '';
        this.builderNotice = '';
        const value = this.builderForm.getRawValue();
        const payload = {
            title: this.trimOptional(value.title),
            validUntilDate: this.trimOptional(value.validUntilDate),
            introduction: this.trimOptional(value.introduction),
            termsVersion: this.trimOptional(value.termsVersion),
            currencyCode: (value.currencyCode ?? 'GBP').toUpperCase(),
            serviceChargePercent: Number(value.serviceChargePercent ?? 0),
            lineItems
        };
        const request$ = this.builderMode === 'edit' && this.selectedProposal
            ? this.api.updateProposal(this.selectedProposal.id, payload)
            : this.api.createProposal(enquiryId, payload);
        request$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (proposal) => {
                this.builderSaving = false;
                this.builderNotice = this.builderMode === 'edit'
                    ? `Proposal ${proposal.version} updated.`
                    : `Proposal ${proposal.version} created.`;
                this.lastActionMessage = this.builderNotice;
                this.isBuilderOpen = false;
                this.loadProposals(this.listResponse?.page.page ?? 1);
                this.selectProposal(proposal.id);
                if (sendAfterSave) {
                    this.sendProposalByPrompt(proposal.id);
                }
            },
            error: (error) => {
                this.builderSaving = false;
                this.builderError = error?.error ?? 'Unable to save proposal.';
            }
        });
    }
    getStatusCount(statusKey, list) {
        if (statusKey === 'all') {
            return list.page.totalCount;
        }
        const key = statusKey.trim().toLowerCase();
        const matches = Object.entries(list.statusCounts).find(([entryKey]) => entryKey.trim().toLowerCase() === key);
        return matches ? matches[1] : 0;
    }
    getEnquiryLabel(enquiry) {
        return `${enquiry.reference} · ${enquiry.contactName} · ${enquiry.eventType}`;
    }
    lineSubtotal(index) {
        const line = this.lineItemsArray.at(index).value;
        return this.calculateLine(line).subtotalExclVat;
    }
    lineVat(index) {
        const line = this.lineItemsArray.at(index).value;
        return this.calculateLine(line).vatAmount;
    }
    lineTotal(index) {
        const line = this.lineItemsArray.at(index).value;
        return this.calculateLine(line).totalInclVat;
    }
    trackByEnquiryId(index, enquiry) {
        return enquiry.id;
    }
    trackByTemplateKey(index, template) {
        return template.key;
    }
    openEnquiry(enquiryId, event) {
        event.stopPropagation();
        this.router.navigate(['/enquiries'], {
            queryParams: {
                enquiry: enquiryId,
                statusTab: 'proposals'
            }
        });
    }
    statusToken(status) {
        const normalized = (status ?? '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-');
        return normalized || 'unknown';
    }
    sendProposalByPrompt(proposalId) {
        const email = window.prompt('Send proposal to email address');
        if (!email) {
            return;
        }
        this.api
            .sendProposal(proposalId, {
            clientEmail: email.trim(),
            portalBaseUrl: 'https://portal.creventaflow.com'
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (result) => {
                this.lastActionMessage = `Proposal sent. Portal link: ${result.portalLink}`;
                this.loadProposalDetail(proposalId);
                this.loadProposals(this.listResponse?.page.page ?? 1);
            },
            error: (error) => {
                this.lastActionMessage = error?.error ?? 'Unable to send proposal.';
            }
        });
    }
    compareSelectedProposal() {
        if (!this.selectedProposal || !this.compareWithProposalId) {
            return;
        }
        this.api
            .compareProposals(this.selectedProposal.id, this.compareWithProposalId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (comparison) => {
                this.comparison = comparison;
            },
            error: (error) => {
                this.lastActionMessage = error?.error ?? 'Unable to compare versions.';
            }
        });
    }
    loadProposals(page) {
        const venueId = this.venueId;
        if (!venueId) {
            return;
        }
        const filters = this.filtersForm.getRawValue();
        this.loadingList = true;
        this.api
            .getProposals({
            venueId,
            status: filters.status || 'all',
            eventType: this.trimOptional(filters.eventType),
            sortBy: filters.sortBy || undefined,
            sortDirection: filters.sortDirection || 'desc',
            page,
            pageSize: Number(filters.pageSize) || 25,
            ...(filters.enquiryId
                ? {
                // TODO: CLARIFY add first-class enquiryId filter support in API to avoid client-side filtering.
                }
                : {})
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.loadingList = false;
                const enquiryFilter = this.trimOptional(filters.enquiryId);
                const scopedItems = enquiryFilter
                    ? response.page.items.filter((item) => item.enquiryId === enquiryFilter)
                    : response.page.items;
                this.listResponse = {
                    ...response,
                    page: {
                        ...response.page,
                        items: scopedItems,
                        totalCount: enquiryFilter ? scopedItems.length : response.page.totalCount
                    }
                };
                this.proposals = scopedItems;
                if (this.proposals.length === 0) {
                    this.selectedProposal = null;
                    this.selectedProposalId = null;
                    return;
                }
                const routeProposalId = this.route.snapshot.queryParamMap.get('proposal');
                const selectedStillVisible = this.selectedProposalId && this.proposals.some((item) => item.id === this.selectedProposalId);
                const routeProposalVisible = routeProposalId && this.proposals.some((item) => item.id === routeProposalId);
                const proposalId = routeProposalVisible
                    ? routeProposalId
                    : selectedStillVisible
                        ? this.selectedProposalId
                        : this.proposals[0].id;
                this.selectProposal(proposalId);
            },
            error: () => {
                this.loadingList = false;
                this.proposals = [];
                this.selectedProposal = null;
                this.selectedProposalId = null;
            }
        });
    }
    loadProposalDetail(proposalId) {
        this.loadingDetail = true;
        this.comparison = null;
        this.compareWithProposalId = '';
        this.api
            .getProposal(proposalId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (proposal) => {
                this.loadingDetail = false;
                this.selectedProposal = proposal;
                this.selectedEnquiryIdFilter = proposal.enquiryId;
            },
            error: () => {
                this.loadingDetail = false;
                this.selectedProposal = null;
            }
        });
    }
    loadBuilderSources() {
        const venueId = this.venueId;
        if (!venueId) {
            return;
        }
        this.api
            .getEnquiries({
            venueId,
            statusTab: 'all',
            period: 'this-year',
            page: 1,
            pageSize: 100
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.enquiryOptions = [...response.page.items].sort((left, right) => left.reference.localeCompare(right.reference, undefined, { numeric: true, sensitivity: 'base' }));
                if (!this.builderForm.controls.enquiryId.value && this.enquiryOptions.length > 0) {
                    const enquiryIdFromRoute = this.route.snapshot.queryParamMap.get('enquiry');
                    const fallbackEnquiryId = enquiryIdFromRoute ?? this.enquiryOptions[0].id;
                    this.builderForm.patchValue({
                        enquiryId: fallbackEnquiryId,
                        currencyCode: this.resolveDefaultCurrency(fallbackEnquiryId)
                    });
                    this.onBuilderEnquiryChanged(fallbackEnquiryId);
                }
            }
        });
        this.api
            .getTermsDocuments(venueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (documents) => {
                this.termsDocuments = documents;
                if (!this.builderForm.controls.termsVersion.value) {
                    const active = documents.find((document) => document.isActive);
                    if (active) {
                        this.builderForm.patchValue({ termsVersion: active.version }, { emitEvent: false });
                    }
                }
            }
        });
    }
    onBuilderEnquiryChanged(enquiryId) {
        if (!enquiryId || !this.venueId) {
            this.templateOptions = [];
            return;
        }
        const selected = this.enquiryOptions.find((enquiry) => enquiry.id === enquiryId);
        if (selected && this.builderMode === 'create') {
            this.builderForm.patchValue({
                title: this.builderForm.controls.title.value || `${selected.reference} Proposal`,
                currencyCode: this.resolveDefaultCurrency(enquiryId)
            }, { emitEvent: false });
        }
        this.api
            .getProposalTemplateOptions(this.venueId, selected?.eventType)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (templates) => {
                this.templateOptions = templates;
                const selectedTemplate = this.builderForm.controls.templateKey.value;
                if (selectedTemplate && !templates.some((template) => template.key === selectedTemplate)) {
                    this.builderForm.patchValue({ templateKey: '' }, { emitEvent: false });
                }
            },
            error: () => {
                this.templateOptions = [];
            }
        });
    }
    applyTemplate(templateKey) {
        if (!templateKey) {
            return;
        }
        const template = this.templateOptions.find((item) => item.key === templateKey);
        if (!template) {
            return;
        }
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + Math.max(template.defaultValidityDays || 14, 1));
        this.applyingTemplate = true;
        this.builderForm.patchValue({
            introduction: template.defaultIntroduction ?? this.builderForm.controls.introduction.value ?? '',
            termsVersion: template.defaultTermsVersion ?? this.builderForm.controls.termsVersion.value ?? '',
            validUntilDate: this.toDateOnly(validUntil),
            title: this.builderForm.controls.title.value || `${template.label} Proposal`
        }, { emitEvent: false });
        this.applyingTemplate = false;
        this.lineItemsArray.clear();
        for (const line of template.defaultLineItems) {
            this.addLineItem(line);
        }
        this.ensureBuilderHasAtLeastOneLine();
        this.recalculateBuilderTotals();
    }
    toLineItemPayload() {
        return this.lineItemsArray.controls
            .map((control) => control.getRawValue())
            .map((line) => ({
            category: this.requiredText(line.category, 'Miscellaneous'),
            description: this.requiredText(line.description, 'Untitled item'),
            quantity: this.numberOrDefault(line.quantity, 1),
            unit: this.requiredText(line.unit, 'Flat rate'),
            unitPriceExclVat: this.numberOrDefault(line.unitPriceExclVat, 0),
            vatRate: this.numberOrDefault(line.vatRate, 20),
            discountPercent: this.numberOrDefault(line.discountPercent, 0),
            discountAmount: this.numberOrDefault(line.discountAmount, 0)
        }))
            .filter((line) => line.quantity > 0 && line.description.trim().length > 0);
    }
    createLineItemGroup(seed) {
        return this.formBuilder.group({
            category: [seed?.category ?? 'Room Hire', Validators.required],
            description: [seed?.description ?? '', Validators.required],
            quantity: [seed?.quantity ?? 1, [Validators.required, Validators.min(0.01)]],
            unit: [seed?.unit ?? 'Flat rate', Validators.required],
            unitPriceExclVat: [seed?.unitPriceExclVat ?? 0, [Validators.required, Validators.min(0)]],
            vatRate: [seed?.vatRate ?? 20, [Validators.required, Validators.min(0)]],
            discountPercent: [seed?.discountPercent ?? 0, [Validators.min(0), Validators.max(100)]],
            discountAmount: [seed?.discountAmount ?? 0, [Validators.min(0)]]
        });
    }
    ensureBuilderHasAtLeastOneLine() {
        if (this.lineItemsArray.length === 0) {
            this.addLineItem();
        }
    }
    recalculateBuilderTotals() {
        const lines = this.toLineItemPayload().map((line) => this.calculateLine(line));
        const subtotal = this.round2(lines.reduce((acc, line) => acc + line.subtotalExclVat, 0));
        const totalVat = this.round2(lines.reduce((acc, line) => acc + line.vatAmount, 0));
        const serviceChargePercent = this.numberOrDefault(this.builderForm.controls.serviceChargePercent.value, 0);
        const serviceChargeAmount = this.round2(subtotal * (Math.max(serviceChargePercent, 0) / 100));
        const total = this.round2(subtotal + totalVat + serviceChargeAmount);
        const vatMap = new Map();
        for (const line of lines) {
            const current = vatMap.get(line.vatRate) ?? 0;
            vatMap.set(line.vatRate, this.round2(current + line.vatAmount));
        }
        this.builderSubtotalExclVat = subtotal;
        this.builderTotalVat = totalVat;
        this.builderServiceChargeAmount = serviceChargeAmount;
        this.builderTotalInclVat = total;
        this.builderVatBreakdown = [...vatMap.entries()]
            .sort(([left], [right]) => left - right)
            .map(([vatRate, vatAmount]) => ({ vatRate, vatAmount }));
    }
    calculateLine(line) {
        const quantity = this.round2(this.numberOrDefault(line.quantity, 0));
        const unitPriceExclVat = this.round2(this.numberOrDefault(line.unitPriceExclVat, 0));
        const gross = this.round2(quantity * unitPriceExclVat);
        const discountPercent = Math.min(Math.max(this.numberOrDefault(line.discountPercent, 0), 0), 100);
        const discountFromPercent = this.round2(gross * (discountPercent / 100));
        const discountAmount = Math.max(this.numberOrDefault(line.discountAmount, 0), 0);
        const totalDiscount = Math.min(gross, this.round2(discountFromPercent + discountAmount));
        const subtotalExclVat = this.round2(gross - totalDiscount);
        const vatRate = Math.max(this.numberOrDefault(line.vatRate, 0), 0);
        const vatAmount = this.round2(subtotalExclVat * (vatRate / 100));
        const totalInclVat = this.round2(subtotalExclVat + vatAmount);
        return {
            subtotalExclVat,
            vatRate,
            vatAmount,
            totalInclVat
        };
    }
    resolveFixedDiscountAmount(quantity, unitPriceExclVat, discountPercent, persistedDiscountAmount) {
        const gross = this.round2(this.numberOrDefault(quantity, 0) * this.numberOrDefault(unitPriceExclVat, 0));
        const percentDiscount = this.round2(gross * (Math.min(Math.max(this.numberOrDefault(discountPercent, 0), 0), 100) / 100));
        const explicitDiscount = this.round2(this.numberOrDefault(persistedDiscountAmount, 0) - percentDiscount);
        return explicitDiscount > 0 ? explicitDiscount : 0;
    }
    resolveDefaultCurrency(enquiryId) {
        const enquiry = this.enquiryOptions.find((option) => option.id === enquiryId);
        return (enquiry?.currencyCode || 'GBP').toUpperCase();
    }
    trimOptional(value) {
        const normalized = (value ?? '').trim();
        return normalized.length > 0 ? normalized : undefined;
    }
    requiredText(value, fallback) {
        const normalized = (value ?? '').trim();
        return normalized.length > 0 ? normalized : fallback;
    }
    defaultValidUntilDate() {
        const date = new Date();
        date.setDate(date.getDate() + 14);
        return this.toDateOnly(date);
    }
    toDateOnly(date) {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    numberOrDefault(value, fallback) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }
    round2(value) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }
    static { this.ɵfac = function ProposalsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ProposalsComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ProposalsComponent, selectors: [["app-proposals"]], decls: 49, vars: 11, consts: [[1, "page-header"], [1, "header-actions"], ["type", "button", 1, "btn-primary", 3, "click"], ["type", "button", 1, "btn-secondary"], [1, "count-pill"], [1, "builder-panel"], [1, "filters", 3, "formGroup"], ["formControlName", "status"], [3, "value"], ["formControlName", "enquiryId"], ["value", ""], ["type", "text", "formControlName", "eventType", "placeholder", "Filter by event type (e.g. Wedding)"], ["formControlName", "sortBy"], ["value", "createdAt"], ["value", "eventDate"], ["value", "value"], ["value", "status"], ["formControlName", "sortDirection"], ["value", "desc"], ["value", "asc"], ["formControlName", "pageSize"], [1, "status-row"], [1, "action-message"], [1, "layout"], [1, "loading"], ["type", "button", 1, "btn-secondary", 3, "click"], ["type", "button", 1, "btn-close", 3, "click"], [1, "builder-message", "error"], [1, "builder-message", "info"], [1, "builder-form", 3, "ngSubmit", "formGroup"], [1, "builder-meta-grid"], ["formControlName", "templateKey"], ["type", "text", "formControlName", "title", "placeholder", "Proposal title"], ["type", "date", "formControlName", "validUntilDate"], ["formControlName", "termsVersion"], ["type", "text", "formControlName", "currencyCode", "maxlength", "8"], ["type", "number", "min", "0", "max", "100", "step", "0.01", "formControlName", "serviceChargePercent"], [1, "full-width"], ["formControlName", "introduction", "rows", "3", "placeholder", "Welcome message shown in proposal section"], ["formArrayName", "lineItems", 1, "line-editor"], [3, "formGroupName"], [1, "totals-grid"], [1, "vat-breakdown"], [1, "builder-actions"], ["type", "submit", 1, "btn-secondary", 3, "disabled"], ["type", "button", 1, "btn-primary", 3, "click", "disabled"], ["formControlName", "category"], ["value", "Room Hire"], ["value", "Food & Beverage"], ["value", "Equipment"], ["value", "Entertainment"], ["value", "Staffing"], ["value", "Accommodation"], ["value", "Miscellaneous"], ["type", "text", "formControlName", "description", "placeholder", "Description"], ["type", "number", "min", "0.01", "step", "0.01", "formControlName", "quantity"], ["formControlName", "unit"], ["value", "Per person"], ["value", "Per item"], ["value", "Per hour"], ["value", "Flat rate"], ["type", "number", "min", "0", "step", "0.01", "formControlName", "unitPriceExclVat"], ["formControlName", "vatRate"], ["type", "number", "min", "0", "max", "100", "step", "0.01", "formControlName", "discountPercent"], ["type", "number", "min", "0", "step", "0.01", "formControlName", "discountAmount"], ["type", "button", 1, "btn-link", 3, "click"], [1, "chips"], ["type", "button", 3, "active"], ["type", "button", 3, "click"], [1, "list-panel"], [3, "selected"], [1, "empty"], [1, "detail-panel"], [3, "click"], [1, "cell-main"], [1, "cell-sub"], ["href", "", 1, "enquiry-link", 3, "click"], [1, "status"], [1, "summary-grid"], [1, "actions"], ["type", "button"], [1, "line-items"], [1, "versions"], [1, "compare-controls"], [3, "ngModelChange", "ngModel", "ngModelOptions"], [1, "comparison-summary"]], template: function ProposalsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "div")(2, "h1");
            i0.ɵɵtext(3, "Proposal Maker");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "p");
            i0.ɵɵtext(5, "Create, version, price, and send branded proposals from a single workflow.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 1)(7, "button", 2);
            i0.ɵɵlistener("click", function ProposalsComponent_Template_button_click_7_listener() { return ctx.openBuilderForCreate(); });
            i0.ɵɵtext(8, "Create New Proposal");
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(9, ProposalsComponent_Conditional_9_Template, 2, 0, "button", 3);
            i0.ɵɵconditionalCreate(10, ProposalsComponent_Conditional_10_Template, 2, 1, "span", 4);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(11, ProposalsComponent_Conditional_11_Template, 123, 29, "section", 5);
            i0.ɵɵelementStart(12, "form", 6)(13, "select", 7);
            i0.ɵɵrepeaterCreate(14, ProposalsComponent_For_15_Template, 2, 2, "option", 8, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "select", 9)(17, "option", 10);
            i0.ɵɵtext(18, "All enquiries");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(19, ProposalsComponent_For_20_Template, 2, 2, "option", 8, ctx.trackByEnquiryId, true);
            i0.ɵɵelementEnd();
            i0.ɵɵelement(21, "input", 11);
            i0.ɵɵelementStart(22, "select", 12)(23, "option", 13);
            i0.ɵɵtext(24, "Sort by Created");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "option", 14);
            i0.ɵɵtext(26, "Sort by Event Date");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "option", 15);
            i0.ɵɵtext(28, "Sort by Value");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "option", 16);
            i0.ɵɵtext(30, "Sort by Status");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(31, "select", 17)(32, "option", 18);
            i0.ɵɵtext(33, "Newest first");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "option", 19);
            i0.ɵɵtext(35, "Oldest first");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(36, "select", 20)(37, "option", 8);
            i0.ɵɵtext(38, "10 per page");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "option", 8);
            i0.ɵɵtext(40, "25 per page");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "option", 8);
            i0.ɵɵtext(42, "50 per page");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(43, "option", 8);
            i0.ɵɵtext(44, "100 per page");
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(45, ProposalsComponent_Conditional_45_Template, 3, 0, "section", 21);
            i0.ɵɵconditionalCreate(46, ProposalsComponent_Conditional_46_Template, 2, 1, "p", 22);
            i0.ɵɵconditionalCreate(47, ProposalsComponent_Conditional_47_Template, 24, 2, "section", 23)(48, ProposalsComponent_Conditional_48_Template, 2, 0, "section", 24);
        } if (rf & 2) {
            let tmp_1_0;
            let tmp_10_0;
            i0.ɵɵadvance(9);
            i0.ɵɵconditional(ctx.selectedProposalCanEdit ? 9 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional((tmp_1_0 = ctx.listResponse) ? 10 : -1, tmp_1_0);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isBuilderOpen ? 11 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("formGroup", ctx.filtersForm);
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.statusOptions);
            i0.ɵɵadvance(5);
            i0.ɵɵrepeater(ctx.enquiryOptions);
            i0.ɵɵadvance(18);
            i0.ɵɵproperty("value", 10);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", 25);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", 50);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", 100);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional((tmp_10_0 = ctx.listResponse) ? 45 : -1, tmp_10_0);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.lastActionMessage ? 46 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(!ctx.loadingList ? 47 : 48);
        } }, dependencies: [ReactiveFormsModule, i1.ɵNgNoValidate, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.MaxLengthValidator, i1.MinValidator, i1.MaxValidator, i1.FormGroupDirective, i1.FormControlName, i1.FormGroupName, i1.FormArrayName, FormsModule, i1.NgModel, DatePipe, DecimalPipe], styles: [".page-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 1rem;\n  margin-bottom: 1rem;\n\n  h1 {\n    margin: 0;\n    font-size: 1.8rem;\n    color: #0f172a;\n  }\n\n  p {\n    margin: 0.35rem 0 0;\n    color: #475569;\n  }\n\n  .count-pill {\n    border-radius: 999px;\n    background: #dbeafe;\n    color: #1d4ed8;\n    padding: 0.4rem 0.9rem;\n    font-size: 0.8rem;\n    font-weight: 700;\n    text-transform: uppercase;\n    letter-spacing: 0.03em;\n  }\n\n  .header-actions {\n    display: flex;\n    align-items: center;\n    gap: 0.6rem;\n    flex-wrap: wrap;\n    justify-content: flex-end;\n  }\n}\n\n.btn-primary[_ngcontent-%COMP%], \n.btn-secondary[_ngcontent-%COMP%], \n.btn-link[_ngcontent-%COMP%], \n.btn-close[_ngcontent-%COMP%] {\n  border-radius: 0.65rem;\n  font: inherit;\n  cursor: pointer;\n}\n\n.btn-primary[_ngcontent-%COMP%] {\n  border: 0;\n  background: #1d4ed8;\n  color: #fff;\n  font-weight: 700;\n  padding: 0.55rem 0.9rem;\n}\n\n.btn-secondary[_ngcontent-%COMP%] {\n  border: 1px solid #cbd5e1;\n  background: #fff;\n  color: #1e293b;\n  font-weight: 600;\n  padding: 0.5rem 0.85rem;\n}\n\n.btn-close[_ngcontent-%COMP%] {\n  border: 1px solid #cbd5e1;\n  background: #fff;\n  color: #334155;\n  padding: 0.4rem 0.7rem;\n}\n\n.btn-link[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  color: #1d4ed8;\n  font-weight: 700;\n  padding: 0.2rem 0.35rem;\n}\n\n.builder-panel[_ngcontent-%COMP%] {\n  border: 1px solid #dbe5f2;\n  border-radius: 1rem;\n  background: #fff;\n  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.06);\n  padding: 1rem;\n  margin-bottom: 1rem;\n  display: grid;\n  gap: 0.85rem;\n\n  > header {\n    display: flex;\n    justify-content: space-between;\n    align-items: flex-start;\n    gap: 0.75rem;\n\n    h2 {\n      margin: 0;\n      font-size: 1.05rem;\n      color: #0f172a;\n    }\n\n    p {\n      margin: 0.25rem 0 0;\n      color: #64748b;\n      font-size: 0.85rem;\n    }\n  }\n}\n\n.builder-form[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.8rem;\n}\n\n.builder-meta-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));\n  gap: 0.65rem;\n}\n\n.builder-form[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.35rem;\n\n  span {\n    font-size: 0.76rem;\n    text-transform: uppercase;\n    letter-spacing: 0.03em;\n    color: #64748b;\n    font-weight: 700;\n  }\n}\n\n.builder-form[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.builder-form[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.builder-form[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  border: 1px solid #cbd5e1;\n  border-radius: 0.65rem;\n  padding: 0.5rem 0.65rem;\n  font: inherit;\n  color: #0f172a;\n  background: #fff;\n}\n\n.builder-form[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n\n.builder-form[_ngcontent-%COMP%]   .full-width[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n}\n\n.builder-message[_ngcontent-%COMP%] {\n  margin: 0;\n  border-radius: 0.7rem;\n  padding: 0.6rem 0.75rem;\n  font-size: 0.84rem;\n}\n\n.builder-message.error[_ngcontent-%COMP%] {\n  border: 1px solid #fecaca;\n  background: #fff1f2;\n  color: #9f1239;\n}\n\n.builder-message.info[_ngcontent-%COMP%] {\n  border: 1px solid #bae6fd;\n  background: #eff6ff;\n  color: #0c4a6e;\n}\n\n.line-editor[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  border-radius: 0.85rem;\n  overflow: hidden;\n\n  header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 0.7rem 0.8rem;\n    background: #f8fafc;\n    border-bottom: 1px solid #e2e8f0;\n\n    h3 {\n      margin: 0;\n      font-size: 0.88rem;\n      color: #0f172a;\n    }\n  }\n\n  table {\n    width: 100%;\n    border-collapse: collapse;\n  }\n\n  th,\n  td {\n    border-bottom: 1px solid #eef2f7;\n    padding: 0.45rem 0.5rem;\n    font-size: 0.76rem;\n    color: #1e293b;\n    vertical-align: middle;\n    text-align: left;\n  }\n\n  th {\n    text-transform: uppercase;\n    letter-spacing: 0.03em;\n    color: #64748b;\n    font-size: 0.71rem;\n    background: #f8fafc;\n  }\n\n  input,\n  select {\n    width: 100%;\n    min-width: 6rem;\n    padding: 0.35rem 0.45rem;\n    border-radius: 0.55rem;\n    border: 1px solid #cbd5e1;\n    font-size: 0.76rem;\n    background: #fff;\n  }\n}\n\n.totals-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));\n  gap: 0.65rem;\n\n  article {\n    border: 1px solid #dbe5f2;\n    border-radius: 0.8rem;\n    background: #f8fafc;\n    padding: 0.65rem 0.75rem;\n    display: grid;\n    gap: 0.25rem;\n  }\n\n  span {\n    color: #64748b;\n    font-size: 0.73rem;\n    text-transform: uppercase;\n    letter-spacing: 0.03em;\n    font-weight: 700;\n  }\n\n  strong {\n    color: #0f172a;\n    font-size: 1.02rem;\n  }\n}\n\n.vat-breakdown[_ngcontent-%COMP%] {\n  h4 {\n    margin: 0 0 0.4rem;\n    font-size: 0.82rem;\n    color: #0f172a;\n  }\n\n  .chips {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 0.45rem;\n  }\n\n  .chips span {\n    border-radius: 999px;\n    border: 1px solid #dbe5f2;\n    background: #fff;\n    color: #334155;\n    font-size: 0.75rem;\n    padding: 0.2rem 0.55rem;\n    font-weight: 600;\n  }\n}\n\n.builder-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n}\n\n.filters[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));\n  gap: 0.65rem;\n  margin-bottom: 1rem;\n\n  input,\n  select {\n    border: 1px solid #cbd5e1;\n    border-radius: 0.7rem;\n    padding: 0.55rem 0.75rem;\n    font: inherit;\n    color: #0f172a;\n    background: #fff;\n  }\n}\n\n.status-row[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.55rem;\n  margin-bottom: 1rem;\n\n  button {\n    border: 1px solid #dbe5f2;\n    border-radius: 0.8rem;\n    background: #fff;\n    color: #334155;\n    padding: 0.5rem 0.7rem;\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;\n    cursor: pointer;\n\n    em {\n      border-radius: 999px;\n      background: #eff6ff;\n      color: #1e3a8a;\n      padding: 0.1rem 0.45rem;\n      font-style: normal;\n      font-size: 0.75rem;\n      font-weight: 700;\n    }\n  }\n\n  button.active {\n    border-color: #1d4ed8;\n    background: #eff6ff;\n    color: #1d4ed8;\n  }\n}\n\n.action-message[_ngcontent-%COMP%] {\n  margin: 0 0 0.9rem;\n  border: 1px solid #bae6fd;\n  background: #eff6ff;\n  color: #0c4a6e;\n  border-radius: 0.75rem;\n  padding: 0.6rem 0.8rem;\n}\n\n.layout[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1.45fr) minmax(22rem, 1fr);\n  gap: 1rem;\n  align-items: start;\n}\n\n.list-panel[_ngcontent-%COMP%], \n.detail-panel[_ngcontent-%COMP%] {\n  border: 1px solid #dbe5f2;\n  border-radius: 1rem;\n  background: #fff;\n  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.05);\n  overflow: hidden;\n}\n\n.list-panel[_ngcontent-%COMP%] {\n  .enquiry-link {\n    color: #1d4ed8;\n    text-decoration: none;\n    font-weight: 700;\n  }\n\n  .enquiry-link:hover {\n    text-decoration: underline;\n  }\n\n  table {\n    width: 100%;\n    border-collapse: collapse;\n  }\n\n  thead {\n    background: #f8fafc;\n  }\n\n  th,\n  td {\n    text-align: left;\n    padding: 0.7rem 0.8rem;\n    border-bottom: 1px solid #eef2f7;\n    font-size: 0.86rem;\n    color: #1e293b;\n    vertical-align: top;\n  }\n\n  th {\n    font-size: 0.73rem;\n    text-transform: uppercase;\n    letter-spacing: 0.02em;\n    color: #64748b;\n  }\n\n  tbody tr {\n    cursor: pointer;\n    transition: background 0.18s ease;\n  }\n\n  tbody tr:hover {\n    background: #f8fbff;\n  }\n\n  tbody tr.selected {\n    background: #eff6ff;\n  }\n\n  .cell-main {\n    font-weight: 600;\n    color: #0f172a;\n  }\n\n  .cell-sub {\n    color: #64748b;\n    font-size: 0.76rem;\n    margin-top: 0.15rem;\n  }\n}\n\n.detail-panel[_ngcontent-%COMP%] {\n  padding: 1rem;\n  display: grid;\n  gap: 0.9rem;\n\n  header {\n    display: flex;\n    justify-content: space-between;\n    align-items: flex-start;\n    gap: 0.8rem;\n\n    h2 {\n      margin: 0;\n      font-size: 1.08rem;\n      color: #0f172a;\n    }\n\n    p {\n      margin: 0.25rem 0 0;\n      color: #64748b;\n      font-size: 0.85rem;\n    }\n  }\n}\n\n.summary-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.45rem 0.8rem;\n\n  p {\n    margin: 0;\n    color: #334155;\n    font-size: 0.82rem;\n  }\n}\n\n.actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.55rem;\n  flex-wrap: wrap;\n\n  button {\n    border: 0;\n    border-radius: 0.65rem;\n    background: #1d4ed8;\n    color: #fff;\n    font-weight: 600;\n    padding: 0.45rem 0.8rem;\n    cursor: pointer;\n  }\n}\n\n.line-items[_ngcontent-%COMP%], \n.versions[_ngcontent-%COMP%] {\n  h3 {\n    margin: 0 0 0.45rem;\n    font-size: 0.9rem;\n    color: #0f172a;\n  }\n\n  table {\n    width: 100%;\n    border-collapse: collapse;\n    border: 1px solid #e2e8f0;\n    border-radius: 0.75rem;\n    overflow: hidden;\n  }\n\n  th,\n  td {\n    border-bottom: 1px solid #eef2f7;\n    padding: 0.5rem 0.55rem;\n    text-align: left;\n    font-size: 0.78rem;\n    color: #1f2937;\n  }\n\n  th {\n    background: #f8fafc;\n    color: #64748b;\n    font-size: 0.72rem;\n    text-transform: uppercase;\n    letter-spacing: 0.03em;\n  }\n}\n\n.compare-controls[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.5rem;\n  margin-bottom: 0.55rem;\n\n  select,\n  button {\n    border: 1px solid #cbd5e1;\n    border-radius: 0.65rem;\n    padding: 0.42rem 0.6rem;\n    font: inherit;\n  }\n\n  button {\n    background: #fff;\n    cursor: pointer;\n  }\n}\n\n.comparison-summary[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.5rem;\n  margin-bottom: 0.5rem;\n\n  p {\n    margin: 0;\n    padding: 0.45rem 0.55rem;\n    border-radius: 0.65rem;\n    background: #f8fafc;\n    color: #334155;\n    font-size: 0.78rem;\n  }\n}\n\n.status[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  padding: 0.2rem 0.55rem;\n  font-size: 0.72rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.03em;\n  background: #e2e8f0;\n  color: #334155;\n}\n\n.status[data-status='draft'][_ngcontent-%COMP%] {\n  background: #e2e8f0;\n  color: #334155;\n}\n\n.status[data-status='sent'][_ngcontent-%COMP%] {\n  background: #dbeafe;\n  color: #1d4ed8;\n}\n\n.status[data-status='viewed'][_ngcontent-%COMP%] {\n  background: #ede9fe;\n  color: #6d28d9;\n}\n\n.status[data-status='accepted'][_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n}\n\n.status[data-status='declined'][_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n\n.status[data-status='expired'][_ngcontent-%COMP%] {\n  background: #ffedd5;\n  color: #c2410c;\n}\n\n.status[data-status='superseded'][_ngcontent-%COMP%] {\n  background: #f1f5f9;\n  color: #475569;\n}\n\n.empty[_ngcontent-%COMP%], \n.loading[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 1rem;\n  color: #64748b;\n  font-size: 0.88rem;\n}\n\n@media (max-width: 1180px) {\n  .layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .detail-panel[_ngcontent-%COMP%] {\n    order: -1;\n  }\n}\n\n@media (max-width: 720px) {\n  .summary-grid[_ngcontent-%COMP%], \n   .comparison-summary[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ProposalsComponent, [{
        type: Component,
        args: [{ selector: 'app-proposals', imports: [DatePipe, DecimalPipe, ReactiveFormsModule, FormsModule], template: "<section class=\"page-header\">\n  <div>\n    <h1>Proposal Maker</h1>\n    <p>Create, version, price, and send branded proposals from a single workflow.</p>\n  </div>\n  <div class=\"header-actions\">\n    <button type=\"button\" class=\"btn-primary\" (click)=\"openBuilderForCreate()\">Create New Proposal</button>\n    @if (selectedProposalCanEdit) {\n      <button type=\"button\" class=\"btn-secondary\" (click)=\"openBuilderForEdit()\">Edit Draft</button>\n    }\n    @if (listResponse; as list) {\n      <span class=\"count-pill\">{{ list.page.totalCount }} total</span>\n    }\n  </div>\n</section>\n\n@if (isBuilderOpen) {\n  <section class=\"builder-panel\">\n    <header>\n      <div>\n        <h2>{{ builderMode === 'edit' ? 'Edit Proposal Draft' : 'Create Proposal' }}</h2>\n        <p>Build line items, VAT, terms, validity, and send to the client portal.</p>\n      </div>\n      <button type=\"button\" class=\"btn-close\" (click)=\"closeBuilder()\">Close</button>\n    </header>\n\n    @if (builderError) {\n      <p class=\"builder-message error\">{{ builderError }}</p>\n    }\n\n    @if (builderNotice) {\n      <p class=\"builder-message info\">{{ builderNotice }}</p>\n    }\n\n    <form class=\"builder-form\" [formGroup]=\"builderForm\" (ngSubmit)=\"saveBuilder(false)\">\n      <div class=\"builder-meta-grid\">\n        <label>\n          <span>Enquiry</span>\n          <select formControlName=\"enquiryId\">\n            <option value=\"\">Select enquiry</option>\n            @for (enquiry of enquiryOptions; track trackByEnquiryId($index, enquiry)) {\n              <option [value]=\"enquiry.id\">{{ getEnquiryLabel(enquiry) }}</option>\n            }\n          </select>\n        </label>\n\n        <label>\n          <span>Template</span>\n          <select formControlName=\"templateKey\">\n            <option value=\"\">No template</option>\n            @for (template of templateOptions; track trackByTemplateKey($index, template)) {\n              <option [value]=\"template.key\">{{ template.label }} ({{ template.eventType }})</option>\n            }\n          </select>\n        </label>\n\n        <label>\n          <span>Title</span>\n          <input type=\"text\" formControlName=\"title\" placeholder=\"Proposal title\" />\n        </label>\n\n        <label>\n          <span>Valid Until</span>\n          <input type=\"date\" formControlName=\"validUntilDate\" />\n        </label>\n\n        <label>\n          <span>Terms Version</span>\n          <select formControlName=\"termsVersion\">\n            <option value=\"\">Select terms</option>\n            @for (doc of termsDocuments; track doc) {\n              <option [value]=\"doc.version\">{{ doc.title }} \u00B7 {{ doc.version }}</option>\n            }\n          </select>\n        </label>\n\n        <label>\n          <span>Currency</span>\n          <input type=\"text\" formControlName=\"currencyCode\" maxlength=\"8\" />\n        </label>\n\n        <label>\n          <span>Service Charge %</span>\n          <input type=\"number\" min=\"0\" max=\"100\" step=\"0.01\" formControlName=\"serviceChargePercent\" />\n        </label>\n      </div>\n\n      <label class=\"full-width\">\n        <span>Introduction</span>\n        <textarea formControlName=\"introduction\" rows=\"3\" placeholder=\"Welcome message shown in proposal section\"></textarea>\n      </label>\n\n      <section class=\"line-editor\" formArrayName=\"lineItems\">\n        <header>\n          <h3>Pricing Line Items</h3>\n          <button type=\"button\" class=\"btn-secondary\" (click)=\"addLineItem()\">Add Line Item</button>\n        </header>\n\n        <table>\n          <thead>\n            <tr>\n              <th>Category</th>\n              <th>Description</th>\n              <th>Qty</th>\n              <th>Unit</th>\n              <th>Unit Price (ex VAT)</th>\n              <th>VAT %</th>\n              <th>Discount %</th>\n              <th>Discount Amt</th>\n              <th>Subtotal</th>\n              <th>VAT</th>\n              <th>Total</th>\n              <th></th>\n            </tr>\n          </thead>\n          <tbody>\n            @for (lineControl of lineItemControls; track lineControl; let i = $index) {\n              <tr [formGroupName]=\"i\">\n                <td>\n                  <select formControlName=\"category\">\n                    <option value=\"Room Hire\">Room Hire</option>\n                    <option value=\"Food & Beverage\">Food &amp; Beverage</option>\n                    <option value=\"Equipment\">Equipment</option>\n                    <option value=\"Entertainment\">Entertainment</option>\n                    <option value=\"Staffing\">Staffing</option>\n                    <option value=\"Accommodation\">Accommodation</option>\n                    <option value=\"Miscellaneous\">Miscellaneous</option>\n                  </select>\n                </td>\n                <td><input type=\"text\" formControlName=\"description\" placeholder=\"Description\" /></td>\n                <td><input type=\"number\" min=\"0.01\" step=\"0.01\" formControlName=\"quantity\" /></td>\n                <td>\n                  <select formControlName=\"unit\">\n                    <option value=\"Per person\">Per person</option>\n                    <option value=\"Per item\">Per item</option>\n                    <option value=\"Per hour\">Per hour</option>\n                    <option value=\"Flat rate\">Flat rate</option>\n                  </select>\n                </td>\n                <td><input type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"unitPriceExclVat\" /></td>\n                <td>\n                  <select formControlName=\"vatRate\">\n                    <option [value]=\"20\">20</option>\n                    <option [value]=\"5\">5</option>\n                    <option [value]=\"0\">0</option>\n                  </select>\n                </td>\n                <td><input type=\"number\" min=\"0\" max=\"100\" step=\"0.01\" formControlName=\"discountPercent\" /></td>\n                <td><input type=\"number\" min=\"0\" step=\"0.01\" formControlName=\"discountAmount\" /></td>\n                <td>{{ lineSubtotal(i) | number: '1.2-2' }}</td>\n                <td>{{ lineVat(i) | number: '1.2-2' }}</td>\n                <td>{{ lineTotal(i) | number: '1.2-2' }}</td>\n                <td>\n                  <button type=\"button\" class=\"btn-link\" (click)=\"removeLineItem(i)\">Remove</button>\n                </td>\n              </tr>\n            }\n          </tbody>\n        </table>\n      </section>\n\n      <section class=\"totals-grid\">\n        <article>\n          <span>Subtotal (ex VAT)</span>\n          <strong>{{ builderSubtotalExclVat | number: '1.2-2' }} {{ builderForm.controls.currencyCode.value }}</strong>\n        </article>\n        <article>\n          <span>Service Charge</span>\n          <strong>{{ builderServiceChargeAmount | number: '1.2-2' }} {{ builderForm.controls.currencyCode.value }}</strong>\n        </article>\n        <article>\n          <span>Total VAT</span>\n          <strong>{{ builderTotalVat | number: '1.2-2' }} {{ builderForm.controls.currencyCode.value }}</strong>\n        </article>\n        <article>\n          <span>Total (inc VAT)</span>\n          <strong>{{ builderTotalInclVat | number: '1.2-2' }} {{ builderForm.controls.currencyCode.value }}</strong>\n        </article>\n      </section>\n\n      @if (builderVatBreakdown.length > 0) {\n        <section class=\"vat-breakdown\">\n          <h4>VAT Breakdown</h4>\n          <div class=\"chips\">\n            @for (vat of builderVatBreakdown; track vat) {\n              <span>VAT {{ vat.vatRate }}%: {{ vat.vatAmount | number: '1.2-2' }}</span>\n            }\n          </div>\n        </section>\n      }\n\n      <footer class=\"builder-actions\">\n        <button type=\"submit\" class=\"btn-secondary\" [disabled]=\"builderSaving\">\n          {{ builderSaving ? 'Saving\u2026' : 'Save Draft' }}\n        </button>\n        <button type=\"button\" class=\"btn-primary\" [disabled]=\"builderSaving\" (click)=\"saveBuilder(true)\">\n          {{ builderSaving ? 'Saving\u2026' : 'Save & Send' }}\n        </button>\n      </footer>\n    </form>\n  </section>\n}\n\n<form class=\"filters\" [formGroup]=\"filtersForm\">\n  <select formControlName=\"status\">\n    @for (status of statusOptions; track status) {\n      <option [value]=\"status.value\">{{ status.label }}</option>\n    }\n  </select>\n\n  <select formControlName=\"enquiryId\">\n    <option value=\"\">All enquiries</option>\n    @for (enquiry of enquiryOptions; track trackByEnquiryId($index, enquiry)) {\n      <option [value]=\"enquiry.id\">{{ enquiry.reference }}</option>\n    }\n  </select>\n\n  <input type=\"text\" formControlName=\"eventType\" placeholder=\"Filter by event type (e.g. Wedding)\" />\n\n  <select formControlName=\"sortBy\">\n    <option value=\"createdAt\">Sort by Created</option>\n    <option value=\"eventDate\">Sort by Event Date</option>\n    <option value=\"value\">Sort by Value</option>\n    <option value=\"status\">Sort by Status</option>\n  </select>\n\n  <select formControlName=\"sortDirection\">\n    <option value=\"desc\">Newest first</option>\n    <option value=\"asc\">Oldest first</option>\n  </select>\n\n  <select formControlName=\"pageSize\">\n    <option [value]=\"10\">10 per page</option>\n    <option [value]=\"25\">25 per page</option>\n    <option [value]=\"50\">50 per page</option>\n    <option [value]=\"100\">100 per page</option>\n  </select>\n</form>\n\n@if (listResponse; as list) {\n  <section class=\"status-row\">\n    @for (status of statusOptions; track status) {\n      <button\n        type=\"button\"\n        (click)=\"setStatus(status.value)\"\n        [class.active]=\"filtersForm.value.status === status.value\"\n      >\n        <span>{{ status.label }}</span>\n        <em>{{ getStatusCount(status.value, list) }}</em>\n      </button>\n    }\n  </section>\n}\n\n@if (lastActionMessage) {\n  <p class=\"action-message\">{{ lastActionMessage }}</p>\n}\n\n@if (!loadingList) {\n  <section class=\"layout\">\n    <article class=\"list-panel\">\n      <table>\n        <thead>\n          <tr>\n            <th>Version</th>\n            <th>Enquiry</th>\n            <th>Client</th>\n            <th>Event</th>\n            <th>Status</th>\n            <th>Value</th>\n            <th>Created</th>\n          </tr>\n        </thead>\n        <tbody>\n          @for (proposal of proposals; track proposal) {\n            <tr\n              (click)=\"selectProposal(proposal.id)\"\n              [class.selected]=\"proposal.id === selectedProposalId\"\n            >\n              <td>\n                <div class=\"cell-main\">{{ proposal.version }}</div>\n                <div class=\"cell-sub\">{{ proposal.enquiryReference }}</div>\n              </td>\n              <td>\n                <a class=\"enquiry-link\" href=\"\" (click)=\"openEnquiry(proposal.enquiryId, $event)\">\n                  {{ proposal.enquiryReference }}\n                </a>\n              </td>\n              <td>{{ proposal.clientName }}</td>\n              <td>\n                <div class=\"cell-main\">{{ proposal.eventType }}</div>\n                <div class=\"cell-sub\">{{ proposal.eventStartUtc | date: 'dd/MM/yyyy HH:mm' }}</div>\n              </td>\n              <td>\n                <span class=\"status\" [attr.data-status]=\"statusToken(proposal.status)\">\n                  {{ proposal.status }}\n                </span>\n              </td>\n              <td>{{ proposal.totalAmount | number: '1.2-2' }} {{ proposal.currencyCode }}</td>\n              <td>{{ proposal.createdAtUtc | date: 'dd/MM/yyyy HH:mm' }}</td>\n            </tr>\n          }\n        </tbody>\n      </table>\n\n      @if (proposals.length === 0) {\n        <p class=\"empty\">No proposals match the current filters.</p>\n      }\n    </article>\n\n    @if (selectedProposal; as proposal) {\n      <aside class=\"detail-panel\">\n        @if (!loadingDetail) {\n          <header>\n            <div>\n              <h2>{{ proposal.title || (proposal.enquiryReference + ' ' + proposal.version) }}</h2>\n              <p>{{ proposal.clientName }} \u00B7 {{ proposal.eventType }}</p>\n            </div>\n            <span class=\"status\" [attr.data-status]=\"statusToken(proposal.status)\">\n              {{ proposal.status }}\n            </span>\n          </header>\n\n          <section class=\"summary-grid\">\n            <p><strong>Reference:</strong> {{ proposal.enquiryReference }}</p>\n            <p><strong>Version:</strong> {{ proposal.version }}</p>\n            <p><strong>Total:</strong> {{ proposal.totalAmount | number: '1.2-2' }} {{ proposal.currencyCode }}</p>\n            <p><strong>Valid Until:</strong> {{ proposal.validUntilDate || 'Not set' }}</p>\n            <p><strong>Terms:</strong> {{ proposal.termsVersion }}</p>\n            <p><strong>Sent:</strong> {{ proposal.sentAtUtc ? (proposal.sentAtUtc | date: 'dd/MM/yyyy HH:mm') : 'Not sent' }}</p>\n            <p><strong>Viewed:</strong> {{ proposal.lastViewedAtUtc ? (proposal.lastViewedAtUtc | date: 'dd/MM/yyyy HH:mm') : 'Not viewed' }}</p>\n            <p><strong>Accepted:</strong> {{ proposal.acceptedAtUtc ? (proposal.acceptedAtUtc | date: 'dd/MM/yyyy HH:mm') : 'Not accepted' }}</p>\n          </section>\n\n          <section class=\"actions\">\n            <button type=\"button\" (click)=\"sendSelectedProposal()\">Send to Client</button>\n            <button type=\"button\" (click)=\"duplicateSelectedProposal()\">Duplicate</button>\n            @if (selectedProposalCanEdit) {\n              <button type=\"button\" (click)=\"openBuilderForEdit()\">Edit Draft</button>\n            }\n          </section>\n\n          <section class=\"line-items\">\n            <h3>Line Items</h3>\n            <table>\n              <thead>\n                <tr>\n                  <th>Category</th>\n                  <th>Description</th>\n                  <th>Qty</th>\n                  <th>Unit</th>\n                  <th>Unit Price</th>\n                  <th>Discount</th>\n                  <th>VAT</th>\n                  <th>Total</th>\n                </tr>\n              </thead>\n              <tbody>\n                @for (line of proposal.lineItems; track line) {\n                  <tr>\n                    <td>{{ line.category }}</td>\n                    <td>{{ line.description }}</td>\n                    <td>{{ line.quantity }}</td>\n                    <td>{{ line.unit }}</td>\n                    <td>{{ line.unitPriceExclVat | number: '1.2-2' }}</td>\n                    <td>{{ line.discountPercent }}% + {{ line.discountAmount | number: '1.2-2' }}</td>\n                    <td>{{ line.vatRate }}%</td>\n                    <td>{{ line.totalInclVat | number: '1.2-2' }}</td>\n                  </tr>\n                }\n              </tbody>\n            </table>\n          </section>\n\n          <section class=\"versions\">\n            <h3>Version Comparison</h3>\n            <div class=\"compare-controls\">\n              <select [(ngModel)]=\"compareWithProposalId\" [ngModelOptions]=\"{ standalone: true }\">\n                <option value=\"\">Select version to compare</option>\n                @for (version of proposal.versions; track version) {\n                  @if (version.id !== proposal.id) {\n                    <option [value]=\"version.id\">\n                      {{ version.version }} \u00B7 {{ version.status }} \u00B7 {{ version.totalAmount | number: '1.2-2' }}\n                    </option>\n                  }\n                }\n              </select>\n              <button type=\"button\" (click)=\"compareSelectedProposal()\">Compare</button>\n            </div>\n\n            @if (comparison; as diff) {\n              <div class=\"comparison-summary\">\n                <p><strong>Left total:</strong> {{ diff.leftTotal | number: '1.2-2' }}</p>\n                <p><strong>Right total:</strong> {{ diff.rightTotal | number: '1.2-2' }}</p>\n                <p><strong>Delta:</strong> {{ diff.totalDelta | number: '1.2-2' }}</p>\n              </div>\n              <table>\n                <thead>\n                  <tr>\n                    <th>Description</th>\n                    <th>Change Type</th>\n                    <th>Delta</th>\n                  </tr>\n                </thead>\n                <tbody>\n                  @for (line of diff.lineDeltas; track line) {\n                    <tr>\n                      <td>{{ line.description }}</td>\n                      <td>{{ line.changeType }}</td>\n                      <td>{{ line.delta | number: '1.2-2' }}</td>\n                    </tr>\n                  }\n                </tbody>\n              </table>\n            }\n          </section>\n        } @else {\n          <p class=\"loading\">Loading proposal details...</p>\n        }\n      </aside>\n    }\n  </section>\n} @else {\n  <section class=\"loading\">Loading proposals...</section>\n}\n", styles: [".page-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 1rem;\n  margin-bottom: 1rem;\n\n  h1 {\n    margin: 0;\n    font-size: 1.8rem;\n    color: #0f172a;\n  }\n\n  p {\n    margin: 0.35rem 0 0;\n    color: #475569;\n  }\n\n  .count-pill {\n    border-radius: 999px;\n    background: #dbeafe;\n    color: #1d4ed8;\n    padding: 0.4rem 0.9rem;\n    font-size: 0.8rem;\n    font-weight: 700;\n    text-transform: uppercase;\n    letter-spacing: 0.03em;\n  }\n\n  .header-actions {\n    display: flex;\n    align-items: center;\n    gap: 0.6rem;\n    flex-wrap: wrap;\n    justify-content: flex-end;\n  }\n}\n\n.btn-primary,\n.btn-secondary,\n.btn-link,\n.btn-close {\n  border-radius: 0.65rem;\n  font: inherit;\n  cursor: pointer;\n}\n\n.btn-primary {\n  border: 0;\n  background: #1d4ed8;\n  color: #fff;\n  font-weight: 700;\n  padding: 0.55rem 0.9rem;\n}\n\n.btn-secondary {\n  border: 1px solid #cbd5e1;\n  background: #fff;\n  color: #1e293b;\n  font-weight: 600;\n  padding: 0.5rem 0.85rem;\n}\n\n.btn-close {\n  border: 1px solid #cbd5e1;\n  background: #fff;\n  color: #334155;\n  padding: 0.4rem 0.7rem;\n}\n\n.btn-link {\n  border: 0;\n  background: transparent;\n  color: #1d4ed8;\n  font-weight: 700;\n  padding: 0.2rem 0.35rem;\n}\n\n.builder-panel {\n  border: 1px solid #dbe5f2;\n  border-radius: 1rem;\n  background: #fff;\n  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.06);\n  padding: 1rem;\n  margin-bottom: 1rem;\n  display: grid;\n  gap: 0.85rem;\n\n  > header {\n    display: flex;\n    justify-content: space-between;\n    align-items: flex-start;\n    gap: 0.75rem;\n\n    h2 {\n      margin: 0;\n      font-size: 1.05rem;\n      color: #0f172a;\n    }\n\n    p {\n      margin: 0.25rem 0 0;\n      color: #64748b;\n      font-size: 0.85rem;\n    }\n  }\n}\n\n.builder-form {\n  display: grid;\n  gap: 0.8rem;\n}\n\n.builder-meta-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));\n  gap: 0.65rem;\n}\n\n.builder-form label {\n  display: grid;\n  gap: 0.35rem;\n\n  span {\n    font-size: 0.76rem;\n    text-transform: uppercase;\n    letter-spacing: 0.03em;\n    color: #64748b;\n    font-weight: 700;\n  }\n}\n\n.builder-form input,\n.builder-form select,\n.builder-form textarea {\n  border: 1px solid #cbd5e1;\n  border-radius: 0.65rem;\n  padding: 0.5rem 0.65rem;\n  font: inherit;\n  color: #0f172a;\n  background: #fff;\n}\n\n.builder-form textarea {\n  resize: vertical;\n}\n\n.builder-form .full-width {\n  grid-column: 1 / -1;\n}\n\n.builder-message {\n  margin: 0;\n  border-radius: 0.7rem;\n  padding: 0.6rem 0.75rem;\n  font-size: 0.84rem;\n}\n\n.builder-message.error {\n  border: 1px solid #fecaca;\n  background: #fff1f2;\n  color: #9f1239;\n}\n\n.builder-message.info {\n  border: 1px solid #bae6fd;\n  background: #eff6ff;\n  color: #0c4a6e;\n}\n\n.line-editor {\n  border: 1px solid #e2e8f0;\n  border-radius: 0.85rem;\n  overflow: hidden;\n\n  header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 0.7rem 0.8rem;\n    background: #f8fafc;\n    border-bottom: 1px solid #e2e8f0;\n\n    h3 {\n      margin: 0;\n      font-size: 0.88rem;\n      color: #0f172a;\n    }\n  }\n\n  table {\n    width: 100%;\n    border-collapse: collapse;\n  }\n\n  th,\n  td {\n    border-bottom: 1px solid #eef2f7;\n    padding: 0.45rem 0.5rem;\n    font-size: 0.76rem;\n    color: #1e293b;\n    vertical-align: middle;\n    text-align: left;\n  }\n\n  th {\n    text-transform: uppercase;\n    letter-spacing: 0.03em;\n    color: #64748b;\n    font-size: 0.71rem;\n    background: #f8fafc;\n  }\n\n  input,\n  select {\n    width: 100%;\n    min-width: 6rem;\n    padding: 0.35rem 0.45rem;\n    border-radius: 0.55rem;\n    border: 1px solid #cbd5e1;\n    font-size: 0.76rem;\n    background: #fff;\n  }\n}\n\n.totals-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));\n  gap: 0.65rem;\n\n  article {\n    border: 1px solid #dbe5f2;\n    border-radius: 0.8rem;\n    background: #f8fafc;\n    padding: 0.65rem 0.75rem;\n    display: grid;\n    gap: 0.25rem;\n  }\n\n  span {\n    color: #64748b;\n    font-size: 0.73rem;\n    text-transform: uppercase;\n    letter-spacing: 0.03em;\n    font-weight: 700;\n  }\n\n  strong {\n    color: #0f172a;\n    font-size: 1.02rem;\n  }\n}\n\n.vat-breakdown {\n  h4 {\n    margin: 0 0 0.4rem;\n    font-size: 0.82rem;\n    color: #0f172a;\n  }\n\n  .chips {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 0.45rem;\n  }\n\n  .chips span {\n    border-radius: 999px;\n    border: 1px solid #dbe5f2;\n    background: #fff;\n    color: #334155;\n    font-size: 0.75rem;\n    padding: 0.2rem 0.55rem;\n    font-weight: 600;\n  }\n}\n\n.builder-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n}\n\n.filters {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));\n  gap: 0.65rem;\n  margin-bottom: 1rem;\n\n  input,\n  select {\n    border: 1px solid #cbd5e1;\n    border-radius: 0.7rem;\n    padding: 0.55rem 0.75rem;\n    font: inherit;\n    color: #0f172a;\n    background: #fff;\n  }\n}\n\n.status-row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.55rem;\n  margin-bottom: 1rem;\n\n  button {\n    border: 1px solid #dbe5f2;\n    border-radius: 0.8rem;\n    background: #fff;\n    color: #334155;\n    padding: 0.5rem 0.7rem;\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;\n    cursor: pointer;\n\n    em {\n      border-radius: 999px;\n      background: #eff6ff;\n      color: #1e3a8a;\n      padding: 0.1rem 0.45rem;\n      font-style: normal;\n      font-size: 0.75rem;\n      font-weight: 700;\n    }\n  }\n\n  button.active {\n    border-color: #1d4ed8;\n    background: #eff6ff;\n    color: #1d4ed8;\n  }\n}\n\n.action-message {\n  margin: 0 0 0.9rem;\n  border: 1px solid #bae6fd;\n  background: #eff6ff;\n  color: #0c4a6e;\n  border-radius: 0.75rem;\n  padding: 0.6rem 0.8rem;\n}\n\n.layout {\n  display: grid;\n  grid-template-columns: minmax(0, 1.45fr) minmax(22rem, 1fr);\n  gap: 1rem;\n  align-items: start;\n}\n\n.list-panel,\n.detail-panel {\n  border: 1px solid #dbe5f2;\n  border-radius: 1rem;\n  background: #fff;\n  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.05);\n  overflow: hidden;\n}\n\n.list-panel {\n  .enquiry-link {\n    color: #1d4ed8;\n    text-decoration: none;\n    font-weight: 700;\n  }\n\n  .enquiry-link:hover {\n    text-decoration: underline;\n  }\n\n  table {\n    width: 100%;\n    border-collapse: collapse;\n  }\n\n  thead {\n    background: #f8fafc;\n  }\n\n  th,\n  td {\n    text-align: left;\n    padding: 0.7rem 0.8rem;\n    border-bottom: 1px solid #eef2f7;\n    font-size: 0.86rem;\n    color: #1e293b;\n    vertical-align: top;\n  }\n\n  th {\n    font-size: 0.73rem;\n    text-transform: uppercase;\n    letter-spacing: 0.02em;\n    color: #64748b;\n  }\n\n  tbody tr {\n    cursor: pointer;\n    transition: background 0.18s ease;\n  }\n\n  tbody tr:hover {\n    background: #f8fbff;\n  }\n\n  tbody tr.selected {\n    background: #eff6ff;\n  }\n\n  .cell-main {\n    font-weight: 600;\n    color: #0f172a;\n  }\n\n  .cell-sub {\n    color: #64748b;\n    font-size: 0.76rem;\n    margin-top: 0.15rem;\n  }\n}\n\n.detail-panel {\n  padding: 1rem;\n  display: grid;\n  gap: 0.9rem;\n\n  header {\n    display: flex;\n    justify-content: space-between;\n    align-items: flex-start;\n    gap: 0.8rem;\n\n    h2 {\n      margin: 0;\n      font-size: 1.08rem;\n      color: #0f172a;\n    }\n\n    p {\n      margin: 0.25rem 0 0;\n      color: #64748b;\n      font-size: 0.85rem;\n    }\n  }\n}\n\n.summary-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.45rem 0.8rem;\n\n  p {\n    margin: 0;\n    color: #334155;\n    font-size: 0.82rem;\n  }\n}\n\n.actions {\n  display: flex;\n  gap: 0.55rem;\n  flex-wrap: wrap;\n\n  button {\n    border: 0;\n    border-radius: 0.65rem;\n    background: #1d4ed8;\n    color: #fff;\n    font-weight: 600;\n    padding: 0.45rem 0.8rem;\n    cursor: pointer;\n  }\n}\n\n.line-items,\n.versions {\n  h3 {\n    margin: 0 0 0.45rem;\n    font-size: 0.9rem;\n    color: #0f172a;\n  }\n\n  table {\n    width: 100%;\n    border-collapse: collapse;\n    border: 1px solid #e2e8f0;\n    border-radius: 0.75rem;\n    overflow: hidden;\n  }\n\n  th,\n  td {\n    border-bottom: 1px solid #eef2f7;\n    padding: 0.5rem 0.55rem;\n    text-align: left;\n    font-size: 0.78rem;\n    color: #1f2937;\n  }\n\n  th {\n    background: #f8fafc;\n    color: #64748b;\n    font-size: 0.72rem;\n    text-transform: uppercase;\n    letter-spacing: 0.03em;\n  }\n}\n\n.compare-controls {\n  display: flex;\n  gap: 0.5rem;\n  margin-bottom: 0.55rem;\n\n  select,\n  button {\n    border: 1px solid #cbd5e1;\n    border-radius: 0.65rem;\n    padding: 0.42rem 0.6rem;\n    font: inherit;\n  }\n\n  button {\n    background: #fff;\n    cursor: pointer;\n  }\n}\n\n.comparison-summary {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.5rem;\n  margin-bottom: 0.5rem;\n\n  p {\n    margin: 0;\n    padding: 0.45rem 0.55rem;\n    border-radius: 0.65rem;\n    background: #f8fafc;\n    color: #334155;\n    font-size: 0.78rem;\n  }\n}\n\n.status {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  padding: 0.2rem 0.55rem;\n  font-size: 0.72rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.03em;\n  background: #e2e8f0;\n  color: #334155;\n}\n\n.status[data-status='draft'] {\n  background: #e2e8f0;\n  color: #334155;\n}\n\n.status[data-status='sent'] {\n  background: #dbeafe;\n  color: #1d4ed8;\n}\n\n.status[data-status='viewed'] {\n  background: #ede9fe;\n  color: #6d28d9;\n}\n\n.status[data-status='accepted'] {\n  background: #dcfce7;\n  color: #15803d;\n}\n\n.status[data-status='declined'] {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n\n.status[data-status='expired'] {\n  background: #ffedd5;\n  color: #c2410c;\n}\n\n.status[data-status='superseded'] {\n  background: #f1f5f9;\n  color: #475569;\n}\n\n.empty,\n.loading {\n  margin: 0;\n  padding: 1rem;\n  color: #64748b;\n  font-size: 0.88rem;\n}\n\n@media (max-width: 1180px) {\n  .layout {\n    grid-template-columns: 1fr;\n  }\n\n  .detail-panel {\n    order: -1;\n  }\n}\n\n@media (max-width: 720px) {\n  .summary-grid,\n  .comparison-summary {\n    grid-template-columns: 1fr;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ProposalsComponent, { className: "ProposalsComponent", filePath: "src/app/pages/proposals/proposals.component.ts", lineNumber: 26 }); })();
//# sourceMappingURL=proposals.component.js.map