import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);

  let headers = request.headers;

  const token = auth.accessToken;
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const tenantSubdomain = auth.tenantSubdomain;
  const tenantId = auth.session?.tenantId;
  if (tenantId) {
    headers = headers.set('X-Tenant-Id', tenantId);
  }

  if (tenantSubdomain) {
    headers = headers.set('X-Tenant-Subdomain', tenantSubdomain);
  }

  const venueId = auth.selectedVenueId;
  if (venueId) {
    headers = headers.set('X-Venue-Id', venueId);
  }

  return next(request.clone({ headers }));
};
