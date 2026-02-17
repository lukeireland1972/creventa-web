import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const stateUrl = state.url;

  if (auth.isAuthenticated) {
    if (auth.isOperationsOnly()) {
      const normalized = (stateUrl || '').toLowerCase();
      const onEventDiary = normalized.startsWith('/event-diary');
      const hasOperationsView = normalized.includes('view=operations');

      if (!onEventDiary || !hasOperationsView) {
        return router.createUrlTree(['/event-diary'], {
          queryParams: { view: 'operations' }
        });
      }
    }

    return true;
  }

  return router.parseUrl('/login');
};
