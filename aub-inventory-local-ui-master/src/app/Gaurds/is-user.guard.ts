import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isUserGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
   const role = localStorage.getItem('roles');
   if(role?.includes("User")){
     return true;
   }
   else {
     router.navigate(['/access-denied']);
     return false;
   }
};
