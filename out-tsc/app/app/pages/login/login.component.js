import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "../../services/auth.service";
import * as i2 from "@angular/router";
import * as i3 from "@angular/forms";
function LoginComponent_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "label");
    i0.ɵɵtext(1, " TOTP code ");
    i0.ɵɵelement(2, "input", 8);
    i0.ɵɵelementEnd();
} }
function LoginComponent_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 6);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.errorMessage);
} }
export class LoginComponent {
    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
        this.isSubmitting = false;
        this.errorMessage = '';
        this.requiresTotp = false;
        this.form = new FormBuilder().group({
            tenantSubdomain: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            totpCode: ['']
        });
    }
    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.errorMessage = '';
        this.isSubmitting = true;
        const value = this.form.getRawValue();
        this.auth
            .login({
            email: value.email ?? '',
            password: value.password ?? '',
            tenantSubdomain: value.tenantSubdomain ?? '',
            totpCode: value.totpCode || null
        })
            .subscribe({
            next: (response) => {
                this.isSubmitting = false;
                if (response.requiresTwoFactor) {
                    this.requiresTotp = true;
                    this.errorMessage = 'Enter your 6-digit authenticator code to continue.';
                    return;
                }
                const operationsOnly = response.venueRoles.length > 0 && response.venueRoles.every((role) => role.role === 'Operations');
                this.router.navigateByUrl(operationsOnly ? '/operations' : '/');
            },
            error: (error) => {
                this.isSubmitting = false;
                if (error?.status === 0) {
                    this.errorMessage = 'Login service is unavailable. Ensure the API is running on http://localhost:5080.';
                    return;
                }
                this.errorMessage =
                    (typeof error?.error === 'string' ? error.error : error?.error?.message) ??
                        'Login failed. Check credentials and tenant subdomain.';
            }
        });
    }
    static { this.ɵfac = function LoginComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LoginComponent)(i0.ɵɵdirectiveInject(i1.AuthService), i0.ɵɵdirectiveInject(i2.Router)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LoginComponent, selectors: [["app-login"]], decls: 20, vars: 5, consts: [[1, "login-page"], [1, "login-card"], [3, "ngSubmit", "formGroup"], ["type", "text", "formControlName", "tenantSubdomain", "placeholder", "your-tenant"], ["type", "email", "formControlName", "email", "placeholder", "you@company.com"], ["type", "password", "formControlName", "password"], [1, "error"], ["type", "submit", 3, "disabled"], ["type", "text", "formControlName", "totpCode", "maxlength", "6", "placeholder", "123456"]], template: function LoginComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "article", 1)(2, "h1");
            i0.ɵɵtext(3, "CreventaFlow");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "p");
            i0.ɵɵtext(5, "Phase 1 tenant login");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "form", 2);
            i0.ɵɵlistener("ngSubmit", function LoginComponent_Template_form_ngSubmit_6_listener() { return ctx.submit(); });
            i0.ɵɵelementStart(7, "label");
            i0.ɵɵtext(8, " Tenant subdomain ");
            i0.ɵɵelement(9, "input", 3);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "label");
            i0.ɵɵtext(11, " Email ");
            i0.ɵɵelement(12, "input", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "label");
            i0.ɵɵtext(14, " Password ");
            i0.ɵɵelement(15, "input", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(16, LoginComponent_Conditional_16_Template, 3, 0, "label");
            i0.ɵɵconditionalCreate(17, LoginComponent_Conditional_17_Template, 2, 1, "p", 6);
            i0.ɵɵelementStart(18, "button", 7);
            i0.ɵɵtext(19);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance(10);
            i0.ɵɵconditional(ctx.requiresTotp ? 16 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.errorMessage ? 17 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.isSubmitting);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.isSubmitting ? "Signing in..." : ctx.requiresTotp ? "Verify TOTP" : "Sign in", " ");
        } }, dependencies: [ReactiveFormsModule, i3.ɵNgNoValidate, i3.DefaultValueAccessor, i3.NgControlStatus, i3.NgControlStatusGroup, i3.MaxLengthValidator, i3.FormGroupDirective, i3.FormControlName], styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  background: linear-gradient(145deg, #041b3a 0%, #0d3a69 50%, #c6d9f0 100%);\n  font-family: 'Inter', 'Avenir Next', 'Segoe UI', sans-serif;\n  font-weight: 100;\n}\n\n.login-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  padding: 2rem;\n}\n\n.login-card[_ngcontent-%COMP%] {\n  width: min(440px, 100%);\n  background: rgba(255, 255, 255, 0.94);\n  backdrop-filter: blur(12px);\n  border-radius: 24px;\n  padding: 2rem;\n  box-shadow: 0 24px 48px rgba(2, 6, 23, 0.28);\n  display: grid;\n  gap: 1rem;\n}\n\nh1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.9rem;\n}\n\np[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #475467;\n}\n\nform[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.9rem;\n}\n\nlabel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.35rem;\n  color: #344054;\n  font-size: 0.87rem;\n}\n\ninput[_ngcontent-%COMP%] {\n  border: 1px solid #d0d5dd;\n  border-radius: 12px;\n  padding: 0.62rem 0.75rem;\n  font: inherit;\n}\n\nbutton[_ngcontent-%COMP%] {\n  margin-top: 0.4rem;\n  border: none;\n  border-radius: 999px;\n  padding: 0.75rem 1rem;\n  background: #1155cc;\n  color: #fff;\n  font-weight: 700;\n}\n\nbutton[disabled][_ngcontent-%COMP%] {\n  opacity: 0.65;\n}\n\n.error[_ngcontent-%COMP%] {\n  color: #b42318;\n  background: #fee4e2;\n  border-radius: 10px;\n  padding: 0.5rem 0.75rem;\n  font-size: 0.86rem;\n}\n\nsmall[_ngcontent-%COMP%] {\n  color: #667085;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LoginComponent, [{
        type: Component,
        args: [{ selector: 'app-login', imports: [ReactiveFormsModule], template: "<section class=\"login-page\">\n  <article class=\"login-card\">\n    <h1>CreventaFlow</h1>\n    <p>Phase 1 tenant login</p>\n\n    <form [formGroup]=\"form\" (ngSubmit)=\"submit()\">\n      <label>\n        Tenant subdomain\n        <input type=\"text\" formControlName=\"tenantSubdomain\" placeholder=\"your-tenant\" />\n      </label>\n\n      <label>\n        Email\n        <input type=\"email\" formControlName=\"email\" placeholder=\"you@company.com\" />\n      </label>\n\n      <label>\n        Password\n        <input type=\"password\" formControlName=\"password\" />\n      </label>\n\n      @if (requiresTotp) {\n        <label>\n          TOTP code\n          <input type=\"text\" formControlName=\"totpCode\" maxlength=\"6\" placeholder=\"123456\" />\n        </label>\n      }\n\n      @if (errorMessage) {\n        <p class=\"error\">{{ errorMessage }}</p>\n      }\n\n      <button type=\"submit\" [disabled]=\"isSubmitting\">\n        {{ isSubmitting ? 'Signing in...' : requiresTotp ? 'Verify TOTP' : 'Sign in' }}\n      </button>\n    </form>\n  </article>\n</section>\n", styles: [":host {\n  display: block;\n  min-height: 100vh;\n  background: linear-gradient(145deg, #041b3a 0%, #0d3a69 50%, #c6d9f0 100%);\n  font-family: 'Inter', 'Avenir Next', 'Segoe UI', sans-serif;\n  font-weight: 100;\n}\n\n.login-page {\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  padding: 2rem;\n}\n\n.login-card {\n  width: min(440px, 100%);\n  background: rgba(255, 255, 255, 0.94);\n  backdrop-filter: blur(12px);\n  border-radius: 24px;\n  padding: 2rem;\n  box-shadow: 0 24px 48px rgba(2, 6, 23, 0.28);\n  display: grid;\n  gap: 1rem;\n}\n\nh1 {\n  margin: 0;\n  font-size: 1.9rem;\n}\n\np {\n  margin: 0;\n  color: #475467;\n}\n\nform {\n  display: grid;\n  gap: 0.9rem;\n}\n\nlabel {\n  display: grid;\n  gap: 0.35rem;\n  color: #344054;\n  font-size: 0.87rem;\n}\n\ninput {\n  border: 1px solid #d0d5dd;\n  border-radius: 12px;\n  padding: 0.62rem 0.75rem;\n  font: inherit;\n}\n\nbutton {\n  margin-top: 0.4rem;\n  border: none;\n  border-radius: 999px;\n  padding: 0.75rem 1rem;\n  background: #1155cc;\n  color: #fff;\n  font-weight: 700;\n}\n\nbutton[disabled] {\n  opacity: 0.65;\n}\n\n.error {\n  color: #b42318;\n  background: #fee4e2;\n  border-radius: 10px;\n  padding: 0.5rem 0.75rem;\n  font-size: 0.86rem;\n}\n\nsmall {\n  color: #667085;\n}\n"] }]
    }], () => [{ type: i1.AuthService }, { type: i2.Router }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/pages/login/login.component.ts", lineNumber: 13 }); })();
//# sourceMappingURL=login.component.js.map