import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';

// Sprint 1: navegación libre entre pantallas (los guards de sesión se agregan en el Sprint 3).
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    // Login y registro comparten página: son dos pestañas (?tab=registro).
    path: 'login',
    title: 'Acceso · AnimeVerse',
    loadComponent: () => import('./pages/acceso/acceso').then((m) => m.Acceso),
  },
  {
    // La antigua página de registro ahora es la pestaña "Registrarse".
    path: 'registro',
    redirectTo: () => inject(Router).createUrlTree(['/login'], { queryParams: { tab: 'registro' } }),
  },
  {
    path: 'publicaciones',
    title: 'Publicaciones · AnimeVerse',
    loadComponent: () =>
      import('./pages/publicaciones/publicaciones').then((m) => m.Publicaciones),
  },
  {
    path: 'mi-perfil',
    title: 'Mi perfil · AnimeVerse',
    loadComponent: () => import('./pages/mi-perfil/mi-perfil').then((m) => m.MiPerfil),
  },
  { path: '**', redirectTo: 'login' },
];
