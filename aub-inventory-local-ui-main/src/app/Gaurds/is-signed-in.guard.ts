import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/Services/Auth/auth.service';

export const isSignedInGuard: CanActivateFn = (route, state) => {
  const userStatus = inject(AuthService).isUserLogged;
  const router = inject(Router);
  if(userStatus) {
    const role = localStorage.getItem('roles');
    if(role?.includes("Card Center Admin")){
      router.navigate(['/distribute']);
    }
    if(role?.includes("Branch Admin")){
      router.navigate(['/request']);
    }
    if(role?.includes("IT Admin")){
      router.navigate(['/configration']);
    }
    return false;
  } 
  else {
    router.navigate(['/login'])
    return true;
  };
}
