import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { TranslationService } from '../services/translation.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const translationService = inject(TranslationService);
  const token = tokenService.getToken();
  const lang = translationService.currentLang();

  const headers: any = {
    'Accept-Language': lang
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cloned = req.clone({
    setHeaders: headers
  });

  return next(cloned);
};
