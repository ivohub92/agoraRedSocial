import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

/**
 * Agrega el id del usuario logueado a los pedidos a la API, para que el backend sepa
 * quién da me gusta o elimina. Es TEMPORAL (Sprint 2): en el Sprint 3 se reemplaza por
 * el header Authorization con el token JWT.
 */
export const usuarioInterceptor: HttpInterceptorFn = (req, next) => {
  const usuario = inject(AuthService).usuario();
  if (!usuario || !req.url.startsWith(environment.apiUrl)) return next(req);
  return next(req.clone({ setHeaders: { 'X-Usuario-Id': usuario._id } }));
};
