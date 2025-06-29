import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/register']);
      }

      let mensaje = 'Se produjo un error inesperado';

      if (typeof err.error === 'string') {
        mensaje = err.error;
      } else if (err.error) {
        if (typeof err.error.error === 'string') {
          mensaje = err.error.error;
        } else if (typeof err.error.message === 'string') {
          mensaje = err.error.message;
        } else if (typeof err.error === 'object') {
          const mensajes = Object.entries(err.error)
            .map(([campo, msg]) => `${campo}: ${msg}`);
          if (mensajes.length) {
            mensaje = mensajes.join(' | ');
          }
          (err.error as Record<string, unknown>)['message'] = mensaje;
        }
      }

      notifications.show(mensaje);

      return throwError(() => err);
    })
  );
}; 