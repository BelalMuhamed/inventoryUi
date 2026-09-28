import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isITAdminGuard: CanActivateFn = (route, state) => {
  const role = localStorage.getItem('roles');
  const router = inject(Router);

  if(role?.includes("IT Admin")){
    return true;
  }
  else {
    router.navigate(['/access-denied']);
    return false;
  }
};
