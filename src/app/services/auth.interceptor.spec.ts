import { HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('authInterceptor', () => {
  it('adds auth, tenant, and venue headers when present', (done) => {
    const authStub = {
      accessToken: 'token-123',
      tenantSubdomain: 'grandhotel',
      selectedVenueId: 'venue-abc'
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authStub }]
    });

    const request = new HttpRequest('GET', '/api/enquiries');

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, (nextRequest) => {
        expect(nextRequest.headers.get('Authorization')).toBe('Bearer token-123');
        expect(nextRequest.headers.get('X-Tenant-Subdomain')).toBe('grandhotel');
        expect(nextRequest.headers.get('X-Venue-Id')).toBe('venue-abc');
        return of(new HttpResponse({ status: 200 }));
      }).subscribe({
        complete: () => done()
      });
    });
  });

  it('does not set headers when values are not available', (done) => {
    const authStub = {
      accessToken: null,
      tenantSubdomain: null,
      selectedVenueId: null
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authStub }]
    });

    const request = new HttpRequest('GET', '/api/enquiries');

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, (nextRequest) => {
        expect(nextRequest.headers.has('Authorization')).toBeFalse();
        expect(nextRequest.headers.has('X-Tenant-Subdomain')).toBeFalse();
        expect(nextRequest.headers.has('X-Venue-Id')).toBeFalse();
        return of(new HttpResponse({ status: 200 }));
      }).subscribe({
        complete: () => done()
      });
    });
  });
});

