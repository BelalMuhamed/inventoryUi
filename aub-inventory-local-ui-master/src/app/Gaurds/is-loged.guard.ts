import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/Auth/auth.service';

export const isLogedGuard: CanActivateFn = (route, state) => {
   const userStatus = inject(AuthService).isUserLogged;
    const router = inject(Router);
    console.log('Guard check — isUserLogged:', userStatus);
    if(userStatus) {
      console.log(userStatus);

        const role = localStorage.getItem('roles');
          if(role?.includes("Card Center Admin")){
            router.navigate(['/distribute']);
          }
          else if(role?.includes("Branch Admin")){
            router.navigate(['/request']);
          }
          else if(role?.includes("IT Admin")){
            router.navigate(['/configration']);
          }
          else if(role?.includes("Report Viewer")){
            router.navigate(['/report']);
          }
          else if(role?.includes("User")){
           router.navigate(['/User-Menu']);
          }
      return false;
    } else {
console.log(userStatus);

      return true;
    }
};
