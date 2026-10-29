import { Pipe, PipeTransform } from '@angular/core';

const UNIDADES: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
];
const formato = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

/** Convierte una fecha en texto relativo: "hace 5 minutos", "ayer", "hace 2 semanas". */
@Pipe({ name: 'tiempoRelativo' })
export class TiempoRelativoPipe implements PipeTransform {
  transform(fecha: string | Date | null | undefined): string {
    if (!fecha) return '';
    const segundos = Math.round((new Date(fecha).getTime() - Date.now()) / 1000);
    for (const [unidad, duracion] of UNIDADES) {
      if (Math.abs(segundos) >= duracion) return formato.format(Math.round(segundos / duracion), unidad);
    }
    return 'recién';
  }
}
