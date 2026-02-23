import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

function enforceAuthenticatedRoute(stateUrl: string): boolean | ReturnType<Router['createUrlTree']> {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated) {
    return router.parseUrl('/login');
  }

  if (auth.isOperationsOnly()) {
    const normalized = (stateUrl || '').toLowerCase();
    const onOperationsDashboard = normalized.startsWith('/operations');

    if (!onOperationsDashboard) {
      return router.createUrlTree(['/operations']);
    }
  }

  return true;
}

export const authGuard: CanActivateFn = (_route, state) => {
  return enforceAuthenticatedRoute(state.url);
};

export const authChildGuard: CanActivateChildFn = (_childRoute, state) => {
  return enforceAuthenticatedRoute(state.url);
};
