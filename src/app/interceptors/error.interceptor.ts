import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        const url = req.url;
        if (url.includes('/auth/') || url.includes('/login') || url.includes('/register')) {
          localStorage.removeItem('token');
          router.navigate(['/register']);
        }
      }
      return throwError(() => err);
    })
  );
}; 