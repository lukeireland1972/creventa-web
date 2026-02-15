import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export type UserRole =
  | 'SuperAdmin'
  | 'GroupAdmin'
  | 'VenueAdmin'
  | 'SalesManager'
  | 'EventsCoordinator'
  | 'Finance'
  | 'Operations'
  | 'ReadOnly';

export interface UserVenueRoleDto {
  venueId: string;
  venueName: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
  venueId?: string | null;
  totpCode?: string | null;
  tenantSubdomain?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  expiresAtUtc: string;
  requiresTwoFactor: boolean;
  twoFactorMethod?: string | null;
  userId: string;
  tenantId?: string | null;
  venueId?: string | null;
  fullName: string;
  email: string;
  venueRoles: UserVenueRoleDto[];
}

export interface CurrentUserResponse {
  userId: string;
  tenantId?: string | null;
  email: string;
  fullName: string;
  isSuperAdmin: boolean;
  requiresTotp: boolean;
  venueRoles: UserVenueRoleDto[];
}

const STORAGE_KEY = 'creventaflow.auth';

interface AuthSessionState {
  accessToken: string;
  expiresAtUtc: string;
  userId: string;
  tenantId?: string | null;
  venueId?: string | null;
  fullName: string;
  email: string;
  venueRoles: UserVenueRoleDto[];
  tenantSubdomain: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private sessionSubject = new BehaviorSubject<AuthSessionState | null>(null);
  readonly session$ = this.sessionSubject.asObservable();

  constructor(private http: HttpClient) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as AuthSessionState;
      if (parsed?.accessToken && parsed.expiresAtUtc) {
        if (new Date(parsed.expiresAtUtc).getTime() > Date.now()) {
          this.sessionSubject.next(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', request).pipe(
      tap((response) => {
        if (!response.requiresTwoFactor && response.accessToken) {
          this.persistSession(response, request.tenantSubdomain ?? 'grandhotel');
        }
      })
    );
  }

  getCurrentUser(): Observable<CurrentUserResponse> {
    return this.http.get<CurrentUserResponse>('/api/auth/me');
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/logout', {}).pipe(
      tap(() => {
        this.clearSession();
      })
    );
  }

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.sessionSubject.next(null);
  }

  setSelectedVenue(venueId: string): void {
    const current = this.sessionSubject.value;
    if (!current) {
      return;
    }

    const next = {
      ...current,
      venueId
    };

    this.sessionSubject.next(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  get accessToken(): string | null {
    return this.sessionSubject.value?.accessToken ?? null;
  }

  get tenantSubdomain(): string | null {
    return this.sessionSubject.value?.tenantSubdomain ?? null;
  }

  get selectedVenueId(): string | null {
    return this.sessionSubject.value?.venueId ?? null;
  }

  get isAuthenticated(): boolean {
    const current = this.sessionSubject.value;
    if (!current?.accessToken) {
      return false;
    }

    return new Date(current.expiresAtUtc).getTime() > Date.now();
  }

  get session(): AuthSessionState | null {
    return this.sessionSubject.value;
  }

  isOperationsOnly(): boolean {
    const roles = this.sessionSubject.value?.venueRoles ?? [];
    return roles.length > 0 && roles.every((x) => x.role === 'Operations');
  }

  private persistSession(response: LoginResponse, tenantSubdomain: string): void {
    const state: AuthSessionState = {
      accessToken: response.accessToken,
      expiresAtUtc: response.expiresAtUtc,
      userId: response.userId,
      tenantId: response.tenantId,
      venueId: response.venueId ?? response.venueRoles[0]?.venueId ?? null,
      fullName: response.fullName,
      email: response.email,
      venueRoles: response.venueRoles,
      tenantSubdomain
    };

    this.sessionSubject.next(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}
