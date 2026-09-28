import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/Services/Auth/auth.service';
export const authGuard: CanActivateFn = (route, state) => {
  const userStatus = inject(AuthService).isUserLogged;
  const router = inject(Router);
  if(userStatus) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
