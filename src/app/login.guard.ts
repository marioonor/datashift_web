import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './service/auth.service';

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // If logged in, allow access
  }

  router.navigate(['/']); // If not logged in, redirect to home
  return false;
};