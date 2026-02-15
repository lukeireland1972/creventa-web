import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import {
  ApiService,
  UpdateUserProfileRequest,
  UpdateVenueProfileRequest,
  UserSummaryDto,
  VenueProfileDto,
  VenueSummaryDto
} from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

type HoldAutoReleaseMode = 'NotifyOnly' | 'AutoReleaseNotifyOperator' | 'AutoReleaseNotifyBoth';

interface InviteFormModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumberE164: string;
  role: string;
  requiresTotp: boolean;
}

interface EditUserFormModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly roleOptions = [
    'GroupAdmin',
    'VenueAdmin',
    'SalesManager',
    'EventsCoordinator',
    'Finance',
    'Operations',
    'ReadOnly'
  ];

  readonly holdAutoReleaseModes: HoldAutoReleaseMode[] = [
    'NotifyOnly',
    'AutoReleaseNotifyOperator',
    'AutoReleaseNotifyBoth'
  ];

  venues: VenueSummaryDto[] = [];
  selectedVenueId: string | null = null;
  venueDraft: UpdateVenueProfileRequest | null = null;
  users: UserSummaryDto[] = [];

  loadingVenues = false;
  loadingVenueProfile = false;
  loadingUsers = false;
  savingVenue = false;
  creatingUser = false;
  updatingUserStatus = false;
  savingUserEdit = false;

  pageError = '';
  venueMessage = '';
  userMessage = '';

  inviteForm: InviteFormModel = this.createDefaultInviteForm();
  editingUser: UserSummaryDto | null = null;
  editUserForm: EditUserFormModel = this.createDefaultEditUserForm();

  ngOnInit(): void {
    if (this.auth.isOperationsOnly()) {
      this.router.navigateByUrl('/operations');
      return;
    }

    this.loadVenues();
  }

  onVenueSelectionChanged(venueId: string): void {
    if (!venueId) {
      return;
    }

    this.selectedVenueId = venueId;
    this.auth.setSelectedVenue(venueId);
    this.venueMessage = '';
    this.userMessage = '';
    this.editingUser = null;
    this.editUserForm = this.createDefaultEditUserForm();

    this.loadVenueProfile();
    this.loadUsers();
  }

  saveVenue(): void {
    const venueId = this.selectedVenueId;
    const draft = this.venueDraft;
    if (!venueId || !draft) {
      return;
    }

    if (!draft.name.trim()) {
      this.venueMessage = 'Venue name is required.';
      return;
    }

    if (!draft.currencyCode.trim() || !draft.countryCode.trim() || !draft.timeZone.trim() || !draft.locale.trim()) {
      this.venueMessage = 'Country, currency, time zone, and locale are required.';
      return;
    }

    this.savingVenue = true;
    this.venueMessage = '';

    const payload: UpdateVenueProfileRequest = {
      ...draft,
      name: draft.name.trim(),
      legalEntityName: this.normalizeOptionalText(draft.legalEntityName),
      addressLine1: this.normalizeOptionalText(draft.addressLine1),
      addressLine2: this.normalizeOptionalText(draft.addressLine2),
      city: this.normalizeOptionalText(draft.city),
      region: this.normalizeOptionalText(draft.region),
      postcode: this.normalizeOptionalText(draft.postcode),
      countryCode: draft.countryCode.trim().toUpperCase(),
      phoneNumberE164: this.normalizeOptionalText(draft.phoneNumberE164),
      enquiriesEmail: this.normalizeOptionalText(draft.enquiriesEmail),
      websiteUrl: this.normalizeOptionalText(draft.websiteUrl),
      vatNumber: this.normalizeOptionalText(draft.vatNumber),
      companyRegistrationNumber: this.normalizeOptionalText(draft.companyRegistrationNumber),
      logoUrl: this.normalizeOptionalText(draft.logoUrl),
      description: this.normalizeOptionalText(draft.description),
      cancellationPolicy: this.normalizeOptionalText(draft.cancellationPolicy),
      currencyCode: draft.currencyCode.trim().toUpperCase(),
      timeZone: draft.timeZone.trim(),
      locale: draft.locale.trim(),
      defaultVatRate: this.sanitizeNumber(draft.defaultVatRate, 0),
      minimumBookingNoticeDays: this.sanitizeInteger(draft.minimumBookingNoticeDays, 0),
      defaultHoldPeriodDays: this.sanitizeInteger(draft.defaultHoldPeriodDays, 7, 1),
      holdWarningDays: this.sanitizeInteger(draft.holdWarningDays, 2, 0),
      holdAutoReleaseMode: this.normalizeHoldMode(draft.holdAutoReleaseMode),
      maxHoldsPerDateAndSpace: this.sanitizeInteger(draft.maxHoldsPerDateAndSpace, 1, 1)
    };

    this.api
      .updateVenueProfile(venueId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.venueDraft = this.mapVenueProfileToDraft(profile);
          this.venueMessage = 'Venue details saved.';
          this.savingVenue = false;
          this.loadVenues();
        },
        error: (error) => {
          this.venueMessage = this.resolveError(error, 'Unable to save venue details.');
          this.savingVenue = false;
        }
      });
  }

  createUser(): void {
    const venueId = this.selectedVenueId;
    if (!venueId) {
      this.userMessage = 'Select a venue first.';
      return;
    }

    const payload = {
      firstName: this.inviteForm.firstName.trim(),
      lastName: this.inviteForm.lastName.trim(),
      email: this.inviteForm.email.trim().toLowerCase(),
      password: this.inviteForm.password.trim(),
      confirmPassword: this.inviteForm.confirmPassword.trim(),
      phoneNumberE164: this.normalizeOptionalText(this.inviteForm.phoneNumberE164),
      role: this.inviteForm.role,
      requiresTotp: this.inviteForm.requiresTotp
    };

    if (!payload.firstName || !payload.lastName || !payload.email || !payload.role || !payload.password || !payload.confirmPassword) {
      this.userMessage = 'First name, last name, email, role, and password are required.';
      return;
    }

    if (payload.password !== payload.confirmPassword) {
      this.userMessage = 'Password and confirm password must match.';
      return;
    }

    if (!this.isPasswordComplex(payload.password)) {
      this.userMessage = 'Password must be 8+ characters with uppercase, lowercase, number, and special character.';
      return;
    }

    this.creatingUser = true;
    this.userMessage = '';

    this.api
      .createUser({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
        phoneNumberE164: payload.phoneNumberE164,
        requiresTotp: payload.requiresTotp,
        venueRoles: [{ venueId, role: payload.role }]
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.userMessage = `User created: ${user.firstName} ${user.lastName}. Login is available immediately.`;
          this.creatingUser = false;
          this.inviteForm = this.createDefaultInviteForm();
          this.loadUsers();
        },
        error: (error) => {
          this.userMessage = this.resolveError(error, 'Unable to create user.');
          this.creatingUser = false;
        }
      });
  }

  setUserActive(user: UserSummaryDto, isActive: boolean): void {
    this.updatingUserStatus = true;
    this.userMessage = '';

    this.api
      .updateUserStatus(user.id, isActive)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.userMessage = `${user.firstName} ${user.lastName} ${isActive ? 'activated' : 'deactivated'}.`;
          this.updatingUserStatus = false;
          this.loadUsers();
        },
        error: (error) => {
          this.userMessage = this.resolveError(error, 'Unable to update user status.');
          this.updatingUserStatus = false;
        }
      });
  }

  beginEditUser(user: UserSummaryDto): void {
    this.editingUser = user;
    this.editUserForm = this.createDefaultEditUserForm(user);
    this.userMessage = '';
  }

  cancelEditUser(): void {
    this.editingUser = null;
    this.editUserForm = this.createDefaultEditUserForm();
  }

  saveEditedUser(): void {
    if (!this.editingUser) {
      return;
    }

    const firstName = this.editUserForm.firstName.trim();
    const lastName = this.editUserForm.lastName.trim();
    const email = this.editUserForm.email.trim().toLowerCase();

    if (!firstName || !lastName || !email) {
      this.userMessage = 'First name, last name, and email are required.';
      return;
    }

    const password = this.editUserForm.password.trim();
    const confirmPassword = this.editUserForm.confirmPassword.trim();
    const isChangingPassword = password.length > 0 || confirmPassword.length > 0;

    if (isChangingPassword && (!password || !confirmPassword)) {
      this.userMessage = 'Enter and confirm the new password.';
      return;
    }

    if (isChangingPassword && password !== confirmPassword) {
      this.userMessage = 'Password and confirm password must match.';
      return;
    }

    if (isChangingPassword && !this.isPasswordComplex(password)) {
      this.userMessage = 'Password must be 8+ characters with uppercase, lowercase, number, and special character.';
      return;
    }

    const user = this.editingUser;
    const profilePayload: UpdateUserProfileRequest = { firstName, lastName, email };

    this.savingUserEdit = true;
    this.userMessage = '';

    this.api
      .updateUserProfile(user.id, profilePayload)
      .pipe(switchMap(() => (isChangingPassword ? this.api.updateUserPassword(user.id, password) : of(undefined))))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.savingUserEdit = false;
          this.userMessage = isChangingPassword
            ? `Profile and password updated for ${firstName} ${lastName}.`
            : `Profile updated for ${firstName} ${lastName}.`;
          this.editingUser = null;
          this.editUserForm = this.createDefaultEditUserForm();
          this.loadUsers();
        },
        error: (error) => {
          this.savingUserEdit = false;
          this.userMessage = this.resolveError(error, 'Unable to update user details.');
        }
      });
  }

  roleForSelectedVenue(user: UserSummaryDto): string {
    const venueId = this.selectedVenueId;
    if (!venueId) {
      return 'N/A';
    }

    return user.venueRoles.find((role) => role.venueId === venueId)?.role ?? 'N/A';
  }

  private loadVenues(): void {
    this.loadingVenues = true;
    this.pageError = '';

    this.api
      .getVenues()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (venues) => {
          this.venues = venues;
          this.loadingVenues = false;

          if (venues.length === 0) {
            this.selectedVenueId = null;
            this.venueDraft = null;
            this.users = [];
            this.pageError = 'No venues are available for your account.';
            return;
          }

          const preferredVenueId = this.auth.selectedVenueId;
          const initialVenueId = venues.some((venue) => venue.id === preferredVenueId) ? preferredVenueId : venues[0].id;
          if (!initialVenueId) {
            this.pageError = 'Unable to determine active venue.';
            return;
          }

          this.onVenueSelectionChanged(initialVenueId);
        },
        error: (error) => {
          this.loadingVenues = false;
          this.pageError = this.resolveError(error, 'Unable to load venues.');
        }
      });
  }

  private loadVenueProfile(): void {
    const venueId = this.selectedVenueId;
    if (!venueId) {
      this.venueDraft = null;
      return;
    }

    this.loadingVenueProfile = true;
    this.venueMessage = '';

    this.api
      .getVenueProfile(venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.venueDraft = this.mapVenueProfileToDraft(profile);
          this.loadingVenueProfile = false;
        },
        error: (error) => {
          this.loadingVenueProfile = false;
          this.venueMessage = this.resolveError(error, 'Unable to load venue details.');
        }
      });
  }

  private loadUsers(): void {
    const venueId = this.selectedVenueId;
    if (!venueId) {
      this.users = [];
      return;
    }

    this.loadingUsers = true;
    this.userMessage = '';

    this.api
      .getUsers(venueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.users = users;
          if (this.editingUser) {
            this.editingUser = users.find((user) => user.id === this.editingUser?.id) ?? null;
            if (!this.editingUser) {
              this.editUserForm = this.createDefaultEditUserForm();
            }
          }
          this.loadingUsers = false;
        },
        error: (error) => {
          this.loadingUsers = false;
          this.userMessage = this.resolveError(error, 'Unable to load users.');
        }
      });
  }

  private mapVenueProfileToDraft(profile: VenueProfileDto): UpdateVenueProfileRequest {
    return {
      name: profile.name,
      legalEntityName: profile.legalEntityName ?? '',
      addressLine1: profile.addressLine1 ?? '',
      addressLine2: profile.addressLine2 ?? '',
      city: profile.city ?? '',
      region: profile.region ?? '',
      postcode: profile.postcode ?? '',
      countryCode: profile.countryCode || 'GB',
      phoneNumberE164: profile.phoneNumberE164 ?? '',
      enquiriesEmail: profile.enquiriesEmail ?? '',
      websiteUrl: profile.websiteUrl ?? '',
      vatNumber: profile.vatNumber ?? '',
      companyRegistrationNumber: profile.companyRegistrationNumber ?? '',
      logoUrl: profile.logoUrl ?? '',
      description: profile.description ?? '',
      cancellationPolicy: profile.cancellationPolicy ?? '',
      currencyCode: profile.currencyCode || 'GBP',
      defaultVatRate: profile.defaultVatRate,
      timeZone: profile.timeZone || 'Europe/London',
      locale: profile.locale || 'en-GB',
      minimumBookingNoticeDays: profile.minimumBookingNoticeDays,
      defaultHoldPeriodDays: profile.defaultHoldPeriodDays,
      holdWarningDays: profile.holdWarningDays,
      holdAutoReleaseMode: this.normalizeHoldMode(profile.holdAutoReleaseMode),
      maxHoldsPerDateAndSpace: profile.maxHoldsPerDateAndSpace
    };
  }

  private createDefaultInviteForm(): InviteFormModel {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumberE164: '',
      role: 'EventsCoordinator',
      requiresTotp: false
    };
  }

  private createDefaultEditUserForm(user?: UserSummaryDto): EditUserFormModel {
    return {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      password: '',
      confirmPassword: ''
    };
  }

  private isPasswordComplex(password: string): boolean {
    if (password.length < 8) {
      return false;
    }

    return /[A-Z]/.test(password)
      && /[a-z]/.test(password)
      && /\d/.test(password)
      && /[^A-Za-z0-9]/.test(password);
  }

  private normalizeOptionalText(value: string | null | undefined): string | null {
    if (!value) {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private sanitizeNumber(value: number, fallback: number): number {
    return Number.isFinite(value) ? value : fallback;
  }

  private sanitizeInteger(value: number, fallback: number, minValue = Number.MIN_SAFE_INTEGER): number {
    const normalized = Number.isFinite(value) ? Math.round(value) : fallback;
    return normalized < minValue ? minValue : normalized;
  }

  private normalizeHoldMode(value: string): HoldAutoReleaseMode {
    switch (value) {
      case 'AutoReleaseNotifyOperator':
      case 'AutoReleaseNotifyBoth':
        return value;
      default:
        return 'NotifyOnly';
    }
  }

  private resolveError(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null) {
      const maybeError = error as { error?: { message?: string } | string; message?: string };
      if (typeof maybeError.error === 'string' && maybeError.error.trim()) {
        return maybeError.error;
      }

      if (typeof maybeError.error === 'object' && maybeError.error && typeof maybeError.error.message === 'string') {
        return maybeError.error.message;
      }

      if (typeof maybeError.message === 'string' && maybeError.message.trim()) {
        return maybeError.message;
      }
    }

    return fallback;
  }
}
