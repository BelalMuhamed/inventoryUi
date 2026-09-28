import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isReportViewerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = localStorage.getItem('roles');
  if(role?.includes("Report Viewer")){
    return true;
  }
  else {
    router.navigate(['/access-denied']);
    return false;
  }
};
