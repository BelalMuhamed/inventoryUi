import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} 
from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private router:Router) {}

  intercept(request: HttpRequest<unknown>,next: HttpHandler): Observable<HttpEvent<unknown>> {
          const jwtToken = localStorage.getItem('token');
          if (jwtToken) {
            // Clone the request and add the JWT token to the headers
            request = request.clone({
              headers: request.headers.set(
                'Authorization',
                `Bearer ${jwtToken}`
              ),
            });
          }
          return next.handle(request).pipe( tap(() => {},
          (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
            return;
            }
            localStorage.clear();
            Swal.fire({
              icon: "error",
              title: "Sorry, your token expired",
              text: "Please Login again!",
            });
            this.router.navigate(['login']);
          }
        }));
  }
}

