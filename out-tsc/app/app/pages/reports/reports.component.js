import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.key;
const _forTrack1 = ($index, $item) => $item.id;
function ReportsComponent_For_22_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "li")(1, "button", 4);
    i0.ɵɵlistener("click", function ReportsComponent_For_22_Template_button_click_1_listener() { const item_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.selectReport(item_r2.key)); });
    i0.ɵɵelementStart(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "small");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵclassProp("active", ctx_r2.selectedReportKey === item_r2.key);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r2.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r2.description);
} }
function ReportsComponent_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.snapshotMessage);
} }
function ReportsComponent_Conditional_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 10);
    i0.ɵɵtext(1, "Loading report...");
    i0.ɵɵelementEnd();
} }
function ReportsComponent_Conditional_43_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 19);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const currentReport_r4 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(currentReport_r4.note);
} }
function ReportsComponent_Conditional_43_For_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const column_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(column_r5);
} }
function ReportsComponent_Conditional_43_For_9_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const column_r6 = ctx.$implicit;
    const row_r7 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(row_r7[column_r6]);
} }
function ReportsComponent_Conditional_43_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr");
    i0.ɵɵrepeaterCreate(1, ReportsComponent_Conditional_43_For_9_For_2_Template, 2, 1, "td", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.columns);
} }
function ReportsComponent_Conditional_43_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 10);
    i0.ɵɵtext(1, "No rows returned for this filter range.");
    i0.ɵɵelementEnd();
} }
function ReportsComponent_Conditional_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, ReportsComponent_Conditional_43_Conditional_0_Template, 2, 1, "p", 19);
    i0.ɵɵelementStart(1, "div", 20)(2, "table")(3, "thead")(4, "tr");
    i0.ɵɵrepeaterCreate(5, ReportsComponent_Conditional_43_For_6_Template, 2, 1, "th", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "tbody");
    i0.ɵɵrepeaterCreate(8, ReportsComponent_Conditional_43_For_9_Template, 3, 0, "tr", null, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd()()();
    i0.ɵɵconditionalCreate(10, ReportsComponent_Conditional_43_Conditional_10_Template, 2, 0, "p", 10);
} if (rf & 2) {
    const currentReport_r4 = ctx;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵconditional(currentReport_r4.note ? 0 : -1);
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(ctx_r2.columns);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(currentReport_r4.rows);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(currentReport_r4.rows.length === 0 ? 10 : -1);
} }
function ReportsComponent_For_66_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "li")(1, "div")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "small");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "small");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "button", 21);
    i0.ɵɵlistener("click", function ReportsComponent_For_66_Template_button_click_8_listener() { const schedule_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.deleteSchedule(schedule_r9.id)); });
    i0.ɵɵtext(9, "Delete");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const schedule_r9 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(schedule_r9.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", schedule_r9.reportKey, " \u00B7 ", schedule_r9.frequency);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(schedule_r9.recipients.join(", "));
} }
function ReportsComponent_Conditional_67_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 10);
    i0.ɵɵtext(1, "No schedules configured.");
    i0.ɵɵelementEnd();
} }
export class ReportsComponent {
    constructor() {
        this.api = inject(ApiService);
        this.auth = inject(AuthService);
        this.destroyRef = inject(DestroyRef);
        this.venueId = null;
        this.catalog = [];
        this.selectedReportKey = 'pipeline';
        this.report = null;
        this.schedules = [];
        this.fromDate = '';
        this.toDate = '';
        this.scheduleName = '';
        this.scheduleFrequency = 'weekly';
        this.scheduleRecipients = '';
        this.snapshotMessage = '';
        this.isLoading = false;
    }
    get columns() {
        return this.report?.columns ?? [];
    }
    ngOnInit() {
        this.venueId = this.auth.selectedVenueId;
        if (!this.venueId) {
            return;
        }
        this.loadCatalogAndReport();
        this.loadSchedules();
    }
    selectReport(reportKey) {
        this.selectedReportKey = reportKey;
        this.loadReport();
    }
    loadReport() {
        if (!this.venueId) {
            return;
        }
        this.isLoading = true;
        this.api
            .getReport(this.selectedReportKey, {
            venueId: this.venueId,
            from: this.fromDate || undefined,
            to: this.toDate || undefined
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (report) => {
                this.report = report;
                this.isLoading = false;
            },
            error: () => {
                this.report = null;
                this.isLoading = false;
            }
        });
    }
    exportReport(format) {
        if (!this.venueId) {
            return;
        }
        this.api
            .exportReport(this.selectedReportKey, {
            venueId: this.venueId,
            format,
            from: this.fromDate || undefined,
            to: this.toDate || undefined
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${this.selectedReportKey}.${format}`;
            link.click();
            window.URL.revokeObjectURL(url);
        });
    }
    createSchedule() {
        if (!this.venueId || !this.scheduleName.trim() || !this.scheduleRecipients.trim()) {
            return;
        }
        const recipients = this.scheduleRecipients
            .split(',')
            .map((value) => value.trim())
            .filter((value) => value.length > 0);
        if (recipients.length === 0) {
            return;
        }
        this.api
            .upsertReportSchedule(this.venueId, {
            name: this.scheduleName.trim(),
            reportKey: this.selectedReportKey,
            frequency: this.scheduleFrequency,
            recipients,
            isActive: true,
            venueId: this.venueId
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.scheduleName = '';
                this.scheduleRecipients = '';
                this.loadSchedules();
            }
        });
    }
    deleteSchedule(scheduleId) {
        this.api
            .deleteReportSchedule(scheduleId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.loadSchedules();
            }
        });
    }
    runSnapshot() {
        if (!this.venueId) {
            return;
        }
        this.api
            .runPipelineSnapshot(this.venueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.snapshotMessage = `Snapshot ${response.snapshotDate} captured (${response.rowsInserted} rows).`;
            },
            error: () => {
                this.snapshotMessage = 'Snapshot run failed.';
            }
        });
    }
    loadCatalogAndReport() {
        this.api
            .getReportsCatalog()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (catalog) => {
                this.catalog = catalog.reports;
                if (!this.catalog.some((item) => item.key === this.selectedReportKey) && this.catalog.length > 0) {
                    this.selectedReportKey = this.catalog[0].key;
                }
                this.loadReport();
            }
        });
    }
    loadSchedules() {
        if (!this.venueId) {
            return;
        }
        this.api
            .getReportSchedules(this.venueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.schedules = response.items;
            },
            error: () => {
                this.schedules = [];
            }
        });
    }
    static { this.ɵfac = function ReportsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ReportsComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ReportsComponent, selectors: [["app-reports"]], decls: 68, vars: 10, consts: [[1, "reports-page"], [1, "page-header"], [1, "date-filters"], ["type", "date", 3, "ngModelChange", "ngModel"], ["type", "button", 3, "click"], [1, "layout-grid"], [1, "panel", "report-list"], [1, "snapshot-card"], [1, "panel", "report-view"], [1, "export-actions"], [1, "empty"], [1, "panel", "schedule-panel"], ["type", "text", "placeholder", "Weekly Pace Report", 3, "ngModelChange", "ngModel"], [3, "ngModelChange", "ngModel"], ["value", "daily"], ["value", "weekly"], ["value", "monthly"], ["rows", "3", "placeholder", "alice@grandhotel.co.uk, ryan@grandhotel.co.uk", 3, "ngModelChange", "ngModel"], [1, "schedule-list"], [1, "note"], [1, "table-wrap"], ["type", "button", 1, "danger", 3, "click"]], template: function ReportsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "div")(3, "h1");
            i0.ɵɵtext(4, "Reports");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "p");
            i0.ɵɵtext(6, "Interactive reporting with exports and scheduled delivery.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "div", 2)(8, "label");
            i0.ɵɵtext(9, " From ");
            i0.ɵɵelementStart(10, "input", 3);
            i0.ɵɵtwoWayListener("ngModelChange", function ReportsComponent_Template_input_ngModelChange_10_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.fromDate, $event) || (ctx.fromDate = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "label");
            i0.ɵɵtext(12, " To ");
            i0.ɵɵelementStart(13, "input", 3);
            i0.ɵɵtwoWayListener("ngModelChange", function ReportsComponent_Template_input_ngModelChange_13_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.toDate, $event) || (ctx.toDate = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(14, "button", 4);
            i0.ɵɵlistener("click", function ReportsComponent_Template_button_click_14_listener() { return ctx.loadReport(); });
            i0.ɵɵtext(15, "Apply");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(16, "section", 5)(17, "aside", 6)(18, "h2");
            i0.ɵɵtext(19, "Standard Reports");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "ul");
            i0.ɵɵrepeaterCreate(21, ReportsComponent_For_22_Template, 6, 4, "li", null, _forTrack0);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "div", 7)(24, "h3");
            i0.ɵɵtext(25, "Pace Snapshot");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "p");
            i0.ɵɵtext(27, "Capture today's on-books baseline for year-over-year pace comparisons.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "button", 4);
            i0.ɵɵlistener("click", function ReportsComponent_Template_button_click_28_listener() { return ctx.runSnapshot(); });
            i0.ɵɵtext(29, "Run Snapshot");
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(30, ReportsComponent_Conditional_30_Template, 2, 1, "small");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(31, "article", 8)(32, "header")(33, "h2");
            i0.ɵɵtext(34);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "div", 9)(36, "button", 4);
            i0.ɵɵlistener("click", function ReportsComponent_Template_button_click_36_listener() { return ctx.exportReport("csv"); });
            i0.ɵɵtext(37, "CSV");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(38, "button", 4);
            i0.ɵɵlistener("click", function ReportsComponent_Template_button_click_38_listener() { return ctx.exportReport("xlsx"); });
            i0.ɵɵtext(39, "Excel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(40, "button", 4);
            i0.ɵɵlistener("click", function ReportsComponent_Template_button_click_40_listener() { return ctx.exportReport("pdf"); });
            i0.ɵɵtext(41, "PDF");
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(42, ReportsComponent_Conditional_42_Template, 2, 0, "p", 10);
            i0.ɵɵconditionalCreate(43, ReportsComponent_Conditional_43_Template, 11, 2);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "aside", 11)(45, "h2");
            i0.ɵɵtext(46, "Scheduled Delivery");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(47, "label");
            i0.ɵɵtext(48, " Name ");
            i0.ɵɵelementStart(49, "input", 12);
            i0.ɵɵtwoWayListener("ngModelChange", function ReportsComponent_Template_input_ngModelChange_49_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.scheduleName, $event) || (ctx.scheduleName = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(50, "label");
            i0.ɵɵtext(51, " Frequency ");
            i0.ɵɵelementStart(52, "select", 13);
            i0.ɵɵtwoWayListener("ngModelChange", function ReportsComponent_Template_select_ngModelChange_52_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.scheduleFrequency, $event) || (ctx.scheduleFrequency = $event); return $event; });
            i0.ɵɵelementStart(53, "option", 14);
            i0.ɵɵtext(54, "Daily");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(55, "option", 15);
            i0.ɵɵtext(56, "Weekly");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(57, "option", 16);
            i0.ɵɵtext(58, "Monthly");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(59, "label");
            i0.ɵɵtext(60, " Recipients (comma-separated) ");
            i0.ɵɵelementStart(61, "textarea", 17);
            i0.ɵɵtwoWayListener("ngModelChange", function ReportsComponent_Template_textarea_ngModelChange_61_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.scheduleRecipients, $event) || (ctx.scheduleRecipients = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(62, "button", 4);
            i0.ɵɵlistener("click", function ReportsComponent_Template_button_click_62_listener() { return ctx.createSchedule(); });
            i0.ɵɵtext(63, "Save Schedule");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(64, "ul", 18);
            i0.ɵɵrepeaterCreate(65, ReportsComponent_For_66_Template, 10, 4, "li", null, _forTrack1);
            i0.ɵɵconditionalCreate(67, ReportsComponent_Conditional_67_Template, 2, 0, "li", 10);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            let tmp_6_0;
            i0.ɵɵadvance(10);
            i0.ɵɵtwoWayProperty("ngModel", ctx.fromDate);
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.toDate);
            i0.ɵɵadvance(8);
            i0.ɵɵrepeater(ctx.catalog);
            i0.ɵɵadvance(9);
            i0.ɵɵconditional(ctx.snapshotMessage ? 30 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate((ctx.report == null ? null : ctx.report.name) || "Report");
            i0.ɵɵadvance(8);
            i0.ɵɵconditional(ctx.isLoading ? 42 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional((tmp_6_0 = !ctx.isLoading && ctx.report) ? 43 : -1, tmp_6_0);
            i0.ɵɵadvance(6);
            i0.ɵɵtwoWayProperty("ngModel", ctx.scheduleName);
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.scheduleFrequency);
            i0.ɵɵadvance(9);
            i0.ɵɵtwoWayProperty("ngModel", ctx.scheduleRecipients);
            i0.ɵɵadvance(4);
            i0.ɵɵrepeater(ctx.schedules);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.schedules.length === 0 ? 67 : -1);
        } }, dependencies: [FormsModule, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgModel], styles: [".reports-page[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.9rem;\n}\n\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 0.9rem;\n}\n\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #0f172a;\n  font-size: 1.4rem;\n}\n\n.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.2rem 0 0;\n  color: #64748b;\n  font-size: 0.84rem;\n}\n\n.date-filters[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: end;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n\n.date-filters[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.2rem;\n  color: #64748b;\n  font-size: 0.72rem;\n  font-weight: 700;\n}\n\ninput[_ngcontent-%COMP%], \nselect[_ngcontent-%COMP%], \ntextarea[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 0.45rem 0.55rem;\n  font-size: 0.78rem;\n  color: #334155;\n  background: #fff;\n}\n\nbutton[_ngcontent-%COMP%] {\n  border: 1px solid transparent;\n  border-radius: 10px;\n  background: var(--cf-primary);\n  color: #fff;\n  font-size: 0.74rem;\n  font-weight: 700;\n  padding: 0.42rem 0.65rem;\n}\n\n.layout-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 280px 1fr 320px;\n  gap: 0.8rem;\n}\n\n.panel[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border);\n  border-radius: 14px;\n  background: #fff;\n  box-shadow: var(--cf-shadow-sm);\n  padding: 0.8rem;\n  display: grid;\n  gap: 0.65rem;\n  align-content: start;\n}\n\n.panel[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.96rem;\n  color: #0f172a;\n}\n\n.report-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%], \n.schedule-list[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  display: grid;\n  gap: 0.4rem;\n}\n\n.report-list[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  width: 100%;\n  text-align: left;\n  border: 1px solid #e2e8f0;\n  border-radius: 11px;\n  background: #fff;\n  padding: 0.5rem;\n  display: grid;\n  gap: 0.14rem;\n}\n\n.report-list[_ngcontent-%COMP%]   button.active[_ngcontent-%COMP%] {\n  border-color: #bfdbfe;\n  background: #f8fbff;\n}\n\n.report-list[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.schedule-list[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  color: #0f172a;\n}\n\n.report-list[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.schedule-list[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.snapshot-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.snapshot-card[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 0.68rem;\n  color: #64748b;\n}\n\n.snapshot-card[_ngcontent-%COMP%] {\n  border: 1px solid #dbeafe;\n  border-radius: 12px;\n  background: #f8fbff;\n  padding: 0.55rem;\n  display: grid;\n  gap: 0.35rem;\n}\n\n.snapshot-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #1d4ed8;\n  font-size: 0.76rem;\n}\n\n.report-view[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.8rem;\n  align-items: center;\n}\n\n.export-actions[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 0.35rem;\n}\n\n.table-wrap[_ngcontent-%COMP%] {\n  width: 100%;\n  overflow: auto;\n  border: 1px solid #e2e8f0;\n  border-radius: 11px;\n}\n\ntable[_ngcontent-%COMP%] {\n  border-collapse: collapse;\n  width: 100%;\n  min-width: 620px;\n}\n\nth[_ngcontent-%COMP%], \ntd[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #f1f5f9;\n  padding: 0.42rem 0.5rem;\n  text-align: left;\n  font-size: 0.72rem;\n}\n\nth[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  color: #475569;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  font-size: 0.64rem;\n}\n\n.note[_ngcontent-%COMP%] {\n  margin: 0;\n  border: 1px solid #dbeafe;\n  background: #eff6ff;\n  color: #1d4ed8;\n  border-radius: 10px;\n  padding: 0.5rem;\n  font-size: 0.72rem;\n}\n\n.schedule-panel[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.2rem;\n  color: #64748b;\n  font-size: 0.7rem;\n  font-weight: 700;\n}\n\n.schedule-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  background: #f8fafc;\n  padding: 0.45rem 0.5rem;\n  display: grid;\n  grid-template-columns: 1fr auto;\n  gap: 0.5rem;\n  align-items: start;\n}\n\nbutton.danger[_ngcontent-%COMP%] {\n  background: #b91c1c;\n}\n\n.empty[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #94a3b8;\n  font-size: 0.75rem;\n}\n\n@media (max-width: 1320px) {\n  .layout-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ReportsComponent, [{
        type: Component,
        args: [{ selector: 'app-reports', standalone: true, imports: [FormsModule], template: "<section class=\"reports-page\">\n  <header class=\"page-header\">\n    <div>\n      <h1>Reports</h1>\n      <p>Interactive reporting with exports and scheduled delivery.</p>\n    </div>\n\n    <div class=\"date-filters\">\n      <label>\n        From\n        <input type=\"date\" [(ngModel)]=\"fromDate\" />\n      </label>\n      <label>\n        To\n        <input type=\"date\" [(ngModel)]=\"toDate\" />\n      </label>\n      <button type=\"button\" (click)=\"loadReport()\">Apply</button>\n    </div>\n  </header>\n\n  <section class=\"layout-grid\">\n    <aside class=\"panel report-list\">\n      <h2>Standard Reports</h2>\n      <ul>\n        @for (item of catalog; track item.key) {\n          <li>\n            <button type=\"button\" [class.active]=\"selectedReportKey === item.key\" (click)=\"selectReport(item.key)\">\n              <strong>{{ item.name }}</strong>\n              <small>{{ item.description }}</small>\n            </button>\n          </li>\n        }\n      </ul>\n\n      <div class=\"snapshot-card\">\n        <h3>Pace Snapshot</h3>\n        <p>Capture today's on-books baseline for year-over-year pace comparisons.</p>\n        <button type=\"button\" (click)=\"runSnapshot()\">Run Snapshot</button>\n        @if (snapshotMessage) {\n          <small>{{ snapshotMessage }}</small>\n        }\n      </div>\n    </aside>\n\n    <article class=\"panel report-view\">\n      <header>\n        <h2>{{ report?.name || 'Report' }}</h2>\n        <div class=\"export-actions\">\n          <button type=\"button\" (click)=\"exportReport('csv')\">CSV</button>\n          <button type=\"button\" (click)=\"exportReport('xlsx')\">Excel</button>\n          <button type=\"button\" (click)=\"exportReport('pdf')\">PDF</button>\n        </div>\n      </header>\n\n      @if (isLoading) {\n        <p class=\"empty\">Loading report...</p>\n      }\n\n      @if (!isLoading && report; as currentReport) {\n        @if (currentReport.note) {\n          <p class=\"note\">{{ currentReport.note }}</p>\n        }\n\n        <div class=\"table-wrap\">\n          <table>\n            <thead>\n              <tr>\n                @for (column of columns; track column) {\n                  <th>{{ column }}</th>\n                }\n              </tr>\n            </thead>\n            <tbody>\n              @for (row of currentReport.rows; track $index) {\n                <tr>\n                  @for (column of columns; track column) {\n                    <td>{{ row[column] }}</td>\n                  }\n                </tr>\n              }\n            </tbody>\n          </table>\n        </div>\n\n        @if (currentReport.rows.length === 0) {\n          <p class=\"empty\">No rows returned for this filter range.</p>\n        }\n      }\n    </article>\n\n    <aside class=\"panel schedule-panel\">\n      <h2>Scheduled Delivery</h2>\n\n      <label>\n        Name\n        <input type=\"text\" [(ngModel)]=\"scheduleName\" placeholder=\"Weekly Pace Report\" />\n      </label>\n\n      <label>\n        Frequency\n        <select [(ngModel)]=\"scheduleFrequency\">\n          <option value=\"daily\">Daily</option>\n          <option value=\"weekly\">Weekly</option>\n          <option value=\"monthly\">Monthly</option>\n        </select>\n      </label>\n\n      <label>\n        Recipients (comma-separated)\n        <textarea rows=\"3\" [(ngModel)]=\"scheduleRecipients\" placeholder=\"alice@grandhotel.co.uk, ryan@grandhotel.co.uk\"></textarea>\n      </label>\n\n      <button type=\"button\" (click)=\"createSchedule()\">Save Schedule</button>\n\n      <ul class=\"schedule-list\">\n        @for (schedule of schedules; track schedule.id) {\n          <li>\n            <div>\n              <strong>{{ schedule.name }}</strong>\n              <small>{{ schedule.reportKey }} \u00B7 {{ schedule.frequency }}</small>\n              <small>{{ schedule.recipients.join(', ') }}</small>\n            </div>\n            <button type=\"button\" class=\"danger\" (click)=\"deleteSchedule(schedule.id)\">Delete</button>\n          </li>\n        }\n        @if (schedules.length === 0) {\n          <li class=\"empty\">No schedules configured.</li>\n        }\n      </ul>\n    </aside>\n  </section>\n</section>\n", styles: [".reports-page {\n  display: grid;\n  gap: 0.9rem;\n}\n\n.page-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 0.9rem;\n}\n\n.page-header h1 {\n  margin: 0;\n  color: #0f172a;\n  font-size: 1.4rem;\n}\n\n.page-header p {\n  margin: 0.2rem 0 0;\n  color: #64748b;\n  font-size: 0.84rem;\n}\n\n.date-filters {\n  display: flex;\n  align-items: end;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n\n.date-filters label {\n  display: grid;\n  gap: 0.2rem;\n  color: #64748b;\n  font-size: 0.72rem;\n  font-weight: 700;\n}\n\ninput,\nselect,\ntextarea {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 0.45rem 0.55rem;\n  font-size: 0.78rem;\n  color: #334155;\n  background: #fff;\n}\n\nbutton {\n  border: 1px solid transparent;\n  border-radius: 10px;\n  background: var(--cf-primary);\n  color: #fff;\n  font-size: 0.74rem;\n  font-weight: 700;\n  padding: 0.42rem 0.65rem;\n}\n\n.layout-grid {\n  display: grid;\n  grid-template-columns: 280px 1fr 320px;\n  gap: 0.8rem;\n}\n\n.panel {\n  border: 1px solid var(--cf-border);\n  border-radius: 14px;\n  background: #fff;\n  box-shadow: var(--cf-shadow-sm);\n  padding: 0.8rem;\n  display: grid;\n  gap: 0.65rem;\n  align-content: start;\n}\n\n.panel h2 {\n  margin: 0;\n  font-size: 0.96rem;\n  color: #0f172a;\n}\n\n.report-list ul,\n.schedule-list {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  display: grid;\n  gap: 0.4rem;\n}\n\n.report-list button {\n  width: 100%;\n  text-align: left;\n  border: 1px solid #e2e8f0;\n  border-radius: 11px;\n  background: #fff;\n  padding: 0.5rem;\n  display: grid;\n  gap: 0.14rem;\n}\n\n.report-list button.active {\n  border-color: #bfdbfe;\n  background: #f8fbff;\n}\n\n.report-list strong,\n.schedule-list strong {\n  font-size: 0.78rem;\n  color: #0f172a;\n}\n\n.report-list small,\n.schedule-list small,\n.snapshot-card p,\n.snapshot-card small {\n  font-size: 0.68rem;\n  color: #64748b;\n}\n\n.snapshot-card {\n  border: 1px solid #dbeafe;\n  border-radius: 12px;\n  background: #f8fbff;\n  padding: 0.55rem;\n  display: grid;\n  gap: 0.35rem;\n}\n\n.snapshot-card h3 {\n  margin: 0;\n  color: #1d4ed8;\n  font-size: 0.76rem;\n}\n\n.report-view > header {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.8rem;\n  align-items: center;\n}\n\n.export-actions {\n  display: inline-flex;\n  gap: 0.35rem;\n}\n\n.table-wrap {\n  width: 100%;\n  overflow: auto;\n  border: 1px solid #e2e8f0;\n  border-radius: 11px;\n}\n\ntable {\n  border-collapse: collapse;\n  width: 100%;\n  min-width: 620px;\n}\n\nth,\ntd {\n  border-bottom: 1px solid #f1f5f9;\n  padding: 0.42rem 0.5rem;\n  text-align: left;\n  font-size: 0.72rem;\n}\n\nth {\n  background: #f8fafc;\n  color: #475569;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  font-size: 0.64rem;\n}\n\n.note {\n  margin: 0;\n  border: 1px solid #dbeafe;\n  background: #eff6ff;\n  color: #1d4ed8;\n  border-radius: 10px;\n  padding: 0.5rem;\n  font-size: 0.72rem;\n}\n\n.schedule-panel label {\n  display: grid;\n  gap: 0.2rem;\n  color: #64748b;\n  font-size: 0.7rem;\n  font-weight: 700;\n}\n\n.schedule-list li {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  background: #f8fafc;\n  padding: 0.45rem 0.5rem;\n  display: grid;\n  grid-template-columns: 1fr auto;\n  gap: 0.5rem;\n  align-items: start;\n}\n\nbutton.danger {\n  background: #b91c1c;\n}\n\n.empty {\n  margin: 0;\n  color: #94a3b8;\n  font-size: 0.75rem;\n}\n\n@media (max-width: 1320px) {\n  .layout-grid {\n    grid-template-columns: 1fr;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ReportsComponent, { className: "ReportsComponent", filePath: "src/app/pages/reports/reports.component.ts", lineNumber: 20 }); })();
//# sourceMappingURL=reports.component.js.map