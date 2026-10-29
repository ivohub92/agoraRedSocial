import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EstadoMeGusta, OrdenPublicaciones, PaginaPublicaciones, Publicacion } from './models';

@Injectable({ providedIn: 'root' })
export class PublicacionesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/publicaciones`;

  /** Lista paginada; con `usuario` trae solo las de esa persona (se usa en Mi perfil). */
  listar(
    orden: OrdenPublicaciones,
    offset: number,
    limit: number,
    usuario?: string,
  ): Observable<PaginaPublicaciones> {
    let params = new HttpParams().set('orden', orden).set('offset', offset).set('limit', limit);
    if (usuario) params = params.set('usuario', usuario);
    return this.http.get<PaginaPublicaciones>(this.url, { params });
  }

  /** FormData con titulo, mensaje e imagen (opcional). */
  crear(datos: FormData): Observable<Publicacion> {
    return this.http.post<Publicacion>(this.url, datos);
  }

  eliminar(id: string): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.url}/${id}`);
  }

  darMeGusta(id: string): Observable<EstadoMeGusta> {
    return this.http.post<EstadoMeGusta>(`${this.url}/${id}/me-gusta`, {});
  }

  quitarMeGusta(id: string): Observable<EstadoMeGusta> {
    return this.http.delete<EstadoMeGusta>(`${this.url}/${id}/me-gusta`);
  }
}
