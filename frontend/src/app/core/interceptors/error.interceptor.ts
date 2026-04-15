import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.status === 0) {
        // Network error / Server down
        errorMessage = 'تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت';
      } else {
        // For other errors, we keep the error object but we can sanitize it if needed
        // The service will handle the specifics of 400, 401, etc.
        return throwError(() => error);
      }

      // If we handled it (like status 0), we throw a custom error object or string
      // Returning it as an array of strings to match what the auth components expect
      return throwError(() => [errorMessage]);
    })
  );
};
