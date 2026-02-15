import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
const STORAGE_KEY = 'creventaflow.auth';
export class AuthService {
    constructor(http) {
        this.http = http;
        this.sessionSubject = new BehaviorSubject(null);
        this.session$ = this.sessionSubject.asObservable();
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return;
        }
        try {
            const parsed = JSON.parse(raw);
            if (parsed?.accessToken && parsed.expiresAtUtc) {
                if (new Date(parsed.expiresAtUtc).getTime() > Date.now()) {
                    this.sessionSubject.next(parsed);
                }
                else {
                    localStorage.removeItem(STORAGE_KEY);
                }
            }
        }
        catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    }
    login(request) {
        return this.http.post('/api/auth/login', request).pipe(tap((response) => {
            if (!response.requiresTwoFactor && response.accessToken) {
                this.persistSession(response, request.tenantSubdomain ?? 'grandhotel');
            }
        }));
    }
    getCurrentUser() {
        return this.http.get('/api/auth/me');
    }
    logout() {
        return this.http.post('/api/auth/logout', {}).pipe(tap(() => {
            this.clearSession();
        }));
    }
    clearSession() {
        localStorage.removeItem(STORAGE_KEY);
        this.sessionSubject.next(null);
    }
    setSelectedVenue(venueId) {
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
    get accessToken() {
        return this.sessionSubject.value?.accessToken ?? null;
    }
    get tenantSubdomain() {
        return this.sessionSubject.value?.tenantSubdomain ?? null;
    }
    get selectedVenueId() {
        return this.sessionSubject.value?.venueId ?? null;
    }
    get isAuthenticated() {
        const current = this.sessionSubject.value;
        if (!current?.accessToken) {
            return false;
        }
        return new Date(current.expiresAtUtc).getTime() > Date.now();
    }
    get session() {
        return this.sessionSubject.value;
    }
    isOperationsOnly() {
        const roles = this.sessionSubject.value?.venueRoles ?? [];
        return roles.length > 0 && roles.every((x) => x.role === 'Operations');
    }
    persistSession(response, tenantSubdomain) {
        const state = {
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
    static { this.ɵfac = function AuthService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AuthService)(i0.ɵɵinject(i1.HttpClient)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.HttpClient }], null); })();
//# sourceMappingURL=auth.service.js.map