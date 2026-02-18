import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, WebsiteFormSettingDto } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-website-enquiry',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './website-enquiry.component.html',
  styleUrl: './website-enquiry.component.scss'
})
export class WebsiteEnquiryComponent implements OnInit {
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private sanitizer = inject(DomSanitizer);
  private readonly previewCacheBuster = Date.now().toString();

  selectedVenueId: string | null = null;
  forms: WebsiteFormSettingDto[] = [];
  selectedFormId = '';
  loading = false;
  errorMessage = '';
  copyMessage = '';

  ngOnInit(): void {
    this.auth.session$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((session) => {
        const venueId = session?.venueId ?? null;
        if (venueId === this.selectedVenueId) {
          return;
        }

        this.selectedVenueId = venueId;
        this.forms = [];
        this.selectedFormId = '';
        this.copyMessage = '';
        this.errorMessage = '';
        this.loadForms();
      });
  }

  get selectedForm(): WebsiteFormSettingDto | null {
    if (!this.selectedFormId) {
      return this.forms[0] ?? null;
    }
    return this.forms.find((form) => form.id === this.selectedFormId) ?? this.forms[0] ?? null;
  }

  get previewUrl(): string {
    if (!this.selectedVenueId) {
      return '';
    }

    const embedBaseUrl = this.resolveWidgetBaseUrl();
    const cacheBusterQuery = `cb=${encodeURIComponent(this.previewCacheBuster)}`;
    const slug = this.selectedForm?.slug;
    if (!slug) {
      return `${embedBaseUrl}/embed/enquiry-form/${this.selectedVenueId}?${cacheBusterQuery}`;
    }

    return `${embedBaseUrl}/embed/enquiry-form/${this.selectedVenueId}/${encodeURIComponent(slug)}?${cacheBusterQuery}`;
  }

  get safePreviewUrl(): SafeResourceUrl | null {
    if (!this.previewUrl) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
  }

  get widgetSnippet(): string {
    if (!this.selectedVenueId) {
      return '';
    }

    const embedBaseUrl = this.resolveWidgetBaseUrl();
    const slug = this.selectedForm?.slug;
    const slugAttr = slug ? ` form-slug="${slug}"` : '';
    return `<script src="${embedBaseUrl}/widget.js"></script>\n<creventa-enquiry-form venue-id="${this.selectedVenueId}"${slugAttr}></creventa-enquiry-form>`;
  }

  get iframeSnippet(): string {
    if (!this.selectedVenueId) {
      return '';
    }

    const embedBaseUrl = this.resolveWidgetBaseUrl();
    const slug = this.selectedForm?.slug;
    const slugSuffix = slug ? `/${encodeURIComponent(slug)}` : '';
    return `<iframe src="${embedBaseUrl}/embed/enquiry-form/${this.selectedVenueId}${slugSuffix}" style="width:100%;min-height:760px;border:0;border-radius:12px;" loading="lazy"></iframe>`;
  }

  openSettingsWebsiteForms(): void {
    this.router.navigate(['/settings'], { queryParams: { section: 'website-forms' } });
  }

  copySnippet(value: string): void {
    if (!value.trim()) {
      return;
    }

    navigator.clipboard.writeText(value).then(
      () => {
        this.copyMessage = 'Embed code copied.';
      },
      () => {
        this.copyMessage = 'Unable to copy embed code.';
      }
    );
  }

  private loadForms(): void {
    if (!this.selectedVenueId) {
      this.errorMessage = 'Select a venue to preview website enquiry forms.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.api
      .getWebsiteForms(this.selectedVenueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (forms) => {
          this.forms = forms.filter((form) => form.isActive);
          this.selectedFormId = this.forms[0]?.id ?? '';
          this.loading = false;
        },
        error: (error) => {
          if (error?.status === 401 || error?.status === 403) {
            this.loadFormsFromPublicConfig(this.selectedVenueId!);
            return;
          }

          this.handleFormsLoadFailure();
        }
      });
  }

  private loadFormsFromPublicConfig(venueId: string): void {
    this.api
      .getPublicWebsiteFormConfig(venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.forms = (response?.forms ?? []).map((form) => ({
            id: form.id,
            name: form.name,
            slug: form.slug,
            isActive: true,
            successMessage: form.successMessage,
            redirectUrl: form.redirectUrl ?? null,
            requiredFields: form.requiredFields ?? [],
            optionalFields: form.optionalFields ?? [],
            styleJson: form.styleJson ?? null,
            formFields: form.formFields ?? [],
            brandingPrimaryColor: form.brandingPrimaryColor ?? null,
            brandingLogoUrl: form.brandingLogoUrl ?? null,
            gdprCheckboxText: form.gdprCheckboxText ?? null,
            recaptchaSiteKey: form.recaptchaSiteKey ?? null,
            autoAcknowledgementTemplateId: form.autoAcknowledgementTemplateId ?? null
          }));

          this.selectedFormId = response?.defaultFormId
            ?? this.forms[0]?.id
            ?? '';
          this.loading = false;
          this.errorMessage = '';
        },
        error: () => {
          this.handleFormsLoadFailure();
        }
      });
  }

  private handleFormsLoadFailure(): void {
    this.forms = [];
    this.selectedFormId = '';
    this.loading = false;
    this.errorMessage = 'Unable to load website forms for this venue.';
  }

  private resolveWidgetBaseUrl(): string {
    if (typeof window === 'undefined') {
      return '';
    }

    const location = window.location;
    const host = location.hostname.toLowerCase();
    const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
    if (isLocalHost && (location.port === '4200' || location.port === '5173')) {
      return `${location.protocol}//${location.hostname}:5080`;
    }

    return location.origin;
  }
}
