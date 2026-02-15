import { Component, DestroyRef, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import * as i0 from "@angular/core";
function OperationsDashboardComponent_For_8_For_7_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 7);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const item_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r1.eventStyle);
} }
function OperationsDashboardComponent_For_8_For_7_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 7);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const item_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r1.setupRequirements);
} }
function OperationsDashboardComponent_For_8_For_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 4)(1, "div", 6)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(6, "div", 7);
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "date");
    i0.ɵɵpipe(9, "date");
    i0.ɵɵdomElementEnd();
    i0.ɵɵconditionalCreate(10, OperationsDashboardComponent_For_8_For_7_Conditional_10_Template, 2, 1, "div", 7);
    i0.ɵɵconditionalCreate(11, OperationsDashboardComponent_For_8_For_7_Conditional_11_Template, 2, 1, "div", 7);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const item_r1 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r1.eventName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", item_r1.covers, " covers");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate3(" ", i0.ɵɵpipeBind2(8, 7, item_r1.startUtc, "HH:mm"), " - ", i0.ɵɵpipeBind2(9, 10, item_r1.endUtc, "HH:mm"), " \u00B7 ", item_r1.spaceName, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(item_r1.eventStyle ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r1.setupRequirements ? 11 : -1);
} }
function OperationsDashboardComponent_For_8_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 5);
    i0.ɵɵtext(1, "No scheduled events.");
    i0.ɵɵdomElementEnd();
} }
function OperationsDashboardComponent_For_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "article", 2)(1, "h2");
    i0.ɵɵtext(2);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(3, "p", 3);
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "date");
    i0.ɵɵdomElementEnd();
    i0.ɵɵrepeaterCreate(6, OperationsDashboardComponent_For_8_For_7_Template, 12, 13, "div", 4, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵconditionalCreate(8, OperationsDashboardComponent_For_8_Conditional_8_Template, 2, 0, "p", 5);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const column_r2 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(column_r2.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(5, 3, column_r2.date, "dd/MM/yyyy"));
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(column_r2.items);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(column_r2.items.length === 0 ? 8 : -1);
} }
export class OperationsDashboardComponent {
    constructor() {
        this.api = inject(ApiService);
        this.auth = inject(AuthService);
        this.destroyRef = inject(DestroyRef);
        this.columns = [];
    }
    ngOnInit() {
        const venueId = this.auth.selectedVenueId;
        if (!venueId) {
            return;
        }
        this.api
            .getOperationsOverview(venueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((response) => {
            this.columns = response.columns;
        });
    }
    static { this.ɵfac = function OperationsDashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || OperationsDashboardComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: OperationsDashboardComponent, selectors: [["app-operations-dashboard"]], decls: 9, vars: 0, consts: [[1, "operations-page"], [1, "columns"], [1, "column"], [1, "date"], [1, "item"], [1, "empty"], [1, "row"], [1, "meta"]], template: function OperationsDashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "section", 0)(1, "header")(2, "h1");
            i0.ɵɵtext(3, "Operations Dashboard");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(4, "p");
            i0.ɵɵtext(5, "Yesterday, today, and tomorrow at a glance.");
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(6, "div", 1);
            i0.ɵɵrepeaterCreate(7, OperationsDashboardComponent_For_8_Template, 9, 6, "article", 2, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵrepeater(ctx.columns);
        } }, dependencies: [DatePipe], styles: [".operations-page[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n}\n\nheader[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.45rem;\n  line-height: 1.1;\n  color: #0f172a;\n  font-weight: 800;\n}\n\nheader[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.2rem 0 0;\n  color: #64748b;\n  font-size: 0.88rem;\n}\n\n.columns[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(220px, 1fr));\n  gap: 0.75rem;\n}\n\n.column[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: var(--cf-radius-xl);\n  padding: 0.9rem;\n  border: 1px solid var(--cf-border);\n  box-shadow: var(--cf-shadow-sm);\n  display: grid;\n  gap: 0.7rem;\n}\n\n.column[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.98rem;\n  color: #0f172a;\n}\n\n.date[_ngcontent-%COMP%] {\n  margin: -0.42rem 0 0;\n  color: #64748b;\n  font-size: 0.74rem;\n  font-weight: 600;\n}\n\n.item[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border-soft);\n  border-radius: 12px;\n  padding: 0.62rem;\n  display: grid;\n  gap: 0.28rem;\n  background: #f8fafc;\n}\n\n.row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n\n.row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #334155;\n  font-size: 0.75rem;\n  font-weight: 700;\n}\n\n.meta[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: 0.74rem;\n}\n\n.empty[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  margin: 0;\n  font-size: 0.8rem;\n}\n\n@media (max-width: 980px) {\n  .columns[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(OperationsDashboardComponent, [{
        type: Component,
        args: [{ selector: 'app-operations-dashboard', imports: [DatePipe], template: "<section class=\"operations-page\">\n  <header>\n    <h1>Operations Dashboard</h1>\n    <p>Yesterday, today, and tomorrow at a glance.</p>\n  </header>\n\n  <div class=\"columns\">\n    @for (column of columns; track column) {\n      <article class=\"column\">\n        <h2>{{ column.label }}</h2>\n        <p class=\"date\">{{ column.date | date: 'dd/MM/yyyy' }}</p>\n        @for (item of column.items; track item) {\n          <div class=\"item\">\n            <div class=\"row\">\n              <strong>{{ item.eventName }}</strong>\n              <span>{{ item.covers }} covers</span>\n            </div>\n            <div class=\"meta\">\n              {{ item.startUtc | date: 'HH:mm' }} - {{ item.endUtc | date: 'HH:mm' }} \u00B7 {{ item.spaceName }}\n            </div>\n            @if (item.eventStyle) {\n              <div class=\"meta\">{{ item.eventStyle }}</div>\n            }\n            @if (item.setupRequirements) {\n              <div class=\"meta\">{{ item.setupRequirements }}</div>\n            }\n          </div>\n        }\n        @if (column.items.length === 0) {\n          <p class=\"empty\">No scheduled events.</p>\n        }\n      </article>\n    }\n  </div>\n</section>\n", styles: [".operations-page {\n  display: grid;\n  gap: 1rem;\n}\n\nheader h1 {\n  margin: 0;\n  font-size: 1.45rem;\n  line-height: 1.1;\n  color: #0f172a;\n  font-weight: 800;\n}\n\nheader p {\n  margin: 0.2rem 0 0;\n  color: #64748b;\n  font-size: 0.88rem;\n}\n\n.columns {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(220px, 1fr));\n  gap: 0.75rem;\n}\n\n.column {\n  background: #fff;\n  border-radius: var(--cf-radius-xl);\n  padding: 0.9rem;\n  border: 1px solid var(--cf-border);\n  box-shadow: var(--cf-shadow-sm);\n  display: grid;\n  gap: 0.7rem;\n}\n\n.column h2 {\n  margin: 0;\n  font-size: 0.98rem;\n  color: #0f172a;\n}\n\n.date {\n  margin: -0.42rem 0 0;\n  color: #64748b;\n  font-size: 0.74rem;\n  font-weight: 600;\n}\n\n.item {\n  border: 1px solid var(--cf-border-soft);\n  border-radius: 12px;\n  padding: 0.62rem;\n  display: grid;\n  gap: 0.28rem;\n  background: #f8fafc;\n}\n\n.row {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n\n.row span {\n  color: #334155;\n  font-size: 0.75rem;\n  font-weight: 700;\n}\n\n.meta {\n  color: #64748b;\n  font-size: 0.74rem;\n}\n\n.empty {\n  color: #94a3b8;\n  margin: 0;\n  font-size: 0.8rem;\n}\n\n@media (max-width: 980px) {\n  .columns {\n    grid-template-columns: 1fr;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(OperationsDashboardComponent, { className: "OperationsDashboardComponent", filePath: "src/app/pages/operations-dashboard/operations-dashboard.component.ts", lineNumber: 13 }); })();
//# sourceMappingURL=operations-dashboard.component.js.map