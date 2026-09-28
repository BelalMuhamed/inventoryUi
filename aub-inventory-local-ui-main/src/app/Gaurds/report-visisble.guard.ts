import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const reportVisisbleGuard: CanActivateFn = (route, state) => {
  const role = localStorage.getItem('roles');
  const router = inject(Router)
  if(role?.includes("Card Center Admin")|| role?.includes("Report Viewer")){
    return true;
  }
  else {
    router.navigate(['/access-denied']);
    return false;
  }
};
