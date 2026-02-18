import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  isSubmitting = false;
  errorMessage = '';
  requiresTotp = false;

  form = new FormBuilder().group({
    tenantSubdomain: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    totpCode: ['']
  });

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
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
          if (error?.name === 'TimeoutError') {
            this.errorMessage = 'Login timed out. Please try again and check the server/API logs.';
            return;
          }

          if (error?.status === 0) {
            this.errorMessage = 'Login service is unavailable. Verify the API is reachable from this environment.';
            return;
          }

          this.errorMessage =
            (typeof error?.error === 'string' ? error.error : error?.error?.message) ??
            'Login failed. Check credentials and tenant subdomain.';
        }
      });
  }
}
