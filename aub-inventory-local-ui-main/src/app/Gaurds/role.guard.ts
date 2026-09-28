import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const role = localStorage.getItem('roles');
  const router = inject(Router)
  if(role?.includes("Card Center Admin")|| role?.includes("Branch Admin")||role?.includes("Report Viewer")){
    return true;
  }
  else {
    router.navigate(['/access-denied']);
    return false;
  }
};
