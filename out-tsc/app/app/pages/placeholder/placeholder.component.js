import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as i0 from "@angular/core";
export class PlaceholderComponent {
    constructor() {
        this.title = '';
        this.route = inject(ActivatedRoute);
    }
    ngOnInit() {
        if (!this.title) {
            this.title = this.route.snapshot.data['title'] ?? '';
        }
    }
    static { this.ɵfac = function PlaceholderComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlaceholderComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PlaceholderComponent, selectors: [["app-placeholder"]], inputs: { title: "title" }, decls: 5, vars: 1, consts: [[1, "placeholder"]], template: function PlaceholderComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "section", 0)(1, "h1");
            i0.ɵɵtext(2);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(3, "p");
            i0.ɵɵtext(4, "Screen coming soon.");
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.title);
        } }, styles: [".placeholder[_ngcontent-%COMP%] {\n        background: #fff;\n        border-radius: 16px;\n        padding: 2rem;\n        box-shadow: 0 12px 24px rgba(16, 24, 40, 0.06);\n      }\n\n      h1[_ngcontent-%COMP%] {\n        margin: 0 0 0.5rem;\n      }\n\n      p[_ngcontent-%COMP%] {\n        margin: 0;\n        color: #667085;\n      }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlaceholderComponent, [{
        type: Component,
        args: [{ selector: 'app-placeholder', standalone: true, template: `
    <section class="placeholder">
      <h1>{{ title }}</h1>
      <p>Screen coming soon.</p>
    </section>
  `, styles: ["\n      .placeholder {\n        background: #fff;\n        border-radius: 16px;\n        padding: 2rem;\n        box-shadow: 0 12px 24px rgba(16, 24, 40, 0.06);\n      }\n\n      h1 {\n        margin: 0 0 0.5rem;\n      }\n\n      p {\n        margin: 0;\n        color: #667085;\n      }\n    "] }]
    }], null, { title: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PlaceholderComponent, { className: "PlaceholderComponent", filePath: "src/app/pages/placeholder/placeholder.component.ts", lineNumber: 33 }); })();
//# sourceMappingURL=placeholder.component.js.map