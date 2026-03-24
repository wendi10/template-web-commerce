import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const storage = inject(StorageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        storage.remove('access_token');
        storage.remove('refresh_token');
        router.navigate(['/account/login']);
      }
      const message = error.error?.message || error.message || 'An error occurred';
      return throwError(() => new Error(message));
    })
  );
};
