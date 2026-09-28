import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isCCAdminGuard: CanActivateFn = (route, state) => {
  const role = localStorage.getItem('roles');
  const router = inject(Router);

  if(role?.includes("Card Center Admin")){
    return true;
  }
  else {
    router.navigate(['/access-denied']);
    return false;
  }
};
