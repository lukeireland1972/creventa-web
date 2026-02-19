import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('googleButtonHost') private googleButtonHost?: ElementRef<HTMLDivElement>;

  private static googleScriptPromise: Promise<void> | null = null;
  private viewReady = false;
  private googleButtonInitialized = false;

  isSubmitting = false;
  errorMessage = '';
  requiresTotp = false;
  googleSsoEnabled = false;
  googleSsoLoading = true;
  googleSsoClientId = '';

  form = new FormBuilder().group({
    tenantSubdomain: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    totpCode: ['']
  });

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadSsoProviders();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    void this.tryRenderGoogleButtonAsync();
  }

  ngOnDestroy(): void {
    window.google?.accounts?.id?.cancel?.();
  }

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

          this.routeForUser(response);
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

  private loadSsoProviders(): void {
    this.googleSsoLoading = true;
    this.auth.getSsoProviders().subscribe({
      next: (providers) => {
        this.googleSsoLoading = false;

        const googleProvider = providers.find((provider) => provider.name.toLowerCase() === 'google');
        this.googleSsoEnabled = !!googleProvider?.enabled;
        this.googleSsoClientId = (googleProvider?.clientId ?? '').trim();

        void this.tryRenderGoogleButtonAsync();
      },
      error: () => {
        this.googleSsoLoading = false;
        this.googleSsoEnabled = false;
        this.googleSsoClientId = '';
      }
    });
  }

  private async tryRenderGoogleButtonAsync(): Promise<void> {
    if (!this.viewReady || !this.googleButtonHost) {
      return;
    }

    if (!this.googleSsoEnabled || !this.googleSsoClientId || this.googleButtonInitialized) {
      return;
    }

    try {
      await this.loadGoogleScriptAsync();
      if (!window.google?.accounts?.id) {
        this.errorMessage = 'Google sign-in is temporarily unavailable.';
        return;
      }

      const host = this.googleButtonHost.nativeElement;
      host.innerHTML = '';

      window.google.accounts.id.initialize({
        client_id: this.googleSsoClientId,
        callback: (response) => {
          this.handleGoogleCredential(response);
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google.accounts.id.renderButton(host, {
        type: 'standard',
        shape: 'pill',
        theme: 'outline',
        text: 'continue_with',
        size: 'large',
        width: 360
      });

      this.googleButtonInitialized = true;
    } catch {
      this.errorMessage = 'Google sign-in is temporarily unavailable.';
    }
  }

  private handleGoogleCredential(response: GoogleIdCredentialResponse): void {
    const idToken = (response.credential ?? '').trim();
    if (!idToken) {
      this.errorMessage = 'Google sign-in failed. Please try again.';
      return;
    }

    const tenantSubdomain = (this.form.controls.tenantSubdomain.value ?? '').trim().toLowerCase();
    if (!tenantSubdomain) {
      this.form.controls.tenantSubdomain.markAsTouched();
      this.errorMessage = 'Enter your tenant subdomain before using Google sign-in.';
      return;
    }

    this.errorMessage = '';
    this.requiresTotp = false;
    this.isSubmitting = true;

    this.auth.loginWithGoogle(idToken, tenantSubdomain).subscribe({
      next: (loginResponse) => {
        this.isSubmitting = false;
        this.routeForUser(loginResponse);
      },
      error: (error) => {
        this.isSubmitting = false;
        if (error?.status === 401) {
          this.errorMessage = 'Google sign-in succeeded, but this account is not enabled for this tenant.';
          return;
        }

        this.errorMessage =
          (typeof error?.error === 'string' ? error.error : error?.error?.message) ??
          'Google sign-in failed. Please try again.';
      }
    });
  }

  private routeForUser(response: LoginResponse): void {
    const operationsOnly = response.venueRoles.length > 0 && response.venueRoles.every((role) => role.role === 'Operations');
    this.router.navigateByUrl(operationsOnly ? '/operations' : '/');
  }

  private loadGoogleScriptAsync(): Promise<void> {
    if (window.google?.accounts?.id) {
      return Promise.resolve();
    }

    if (LoginComponent.googleScriptPromise) {
      return LoginComponent.googleScriptPromise;
    }

    LoginComponent.googleScriptPromise = new Promise<void>((resolve, reject) => {
      const resolveIfReady = (): boolean => {
        if (window.google?.accounts?.id) {
          resolve();
          return true;
        }

        return false;
      };

      const existing = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
      if (existing) {
        if (resolveIfReady()) {
          return;
        }

        const onLoad = () => {
          if (!resolveIfReady()) {
            reject(new Error('Google script loaded but API is unavailable.'));
          }
        };

        existing.addEventListener('load', onLoad, { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load Google script.')), { once: true });

        window.setTimeout(() => {
          if (!resolveIfReady()) {
            reject(new Error('Timed out waiting for Google script.'));
          }
        }, 5000);

        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        script.dataset['loaded'] = 'true';
        if (!resolveIfReady()) {
          reject(new Error('Google script loaded but API is unavailable.'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Google script.'));
      document.head.appendChild(script);
    });

    return LoginComponent.googleScriptPromise;
  }
}
