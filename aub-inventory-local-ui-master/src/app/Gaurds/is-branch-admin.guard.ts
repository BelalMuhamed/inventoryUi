import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isBranchAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = localStorage.getItem('roles');
  if(role?.includes("Branch Admin")){
    return true;
  }
  else {
    router.navigate(['/access-denied']);
    return false;
  }
};
