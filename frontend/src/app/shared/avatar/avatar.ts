import { Component, computed, input } from '@angular/core';
import { Usuario } from '../../core/models';

type DatosAvatar = Pick<Usuario, 'nombre' | 'apellido' | 'imagenPerfil'>;


@Component({
  selector: 'app-avatar',
  template: `
    @if (usuario()?.imagenPerfil; as src) {
      <img class="grayscale" [src]="src" [alt]="'Foto de ' + usuario()!.nombre" />
    } @else {
      {{ iniciales() }}
    }
  `,
  styles: `
    :host {
      display: flex;
      flex: none;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      aspect-ratio: 1 / 1;
      font-family: var(--font-heading);
      font-weight: 800;
      letter-spacing: 0.02em;
      background: var(--color-neutral-300);
      color: var(--color-neutral-900);
    }
    :host(.propio) {
      background: var(--color-accent-200);
      color: var(--color-accent-800);
    }
    :host(.en-barra) {
      background: #fff;
      color: var(--color-accent-700);
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `,
  host: {
    '[class]': 'variante()',
    '[style.width]': 'size() ? size() + "px" : "100%"',
    '[style.height]': 'size() ? size() + "px" : null',
    '[style.font-size.px]': 'size() ? size()! * 0.36 : 64',
  },
})
export class Avatar {
  readonly usuario = input<DatosAvatar | null>(null);

  readonly size = input<number | null>(null);
  readonly variante = input<'otro' | 'propio' | 'en-barra'>('otro');

  protected readonly iniciales = computed(() => {
    const u = this.usuario();
    return u ? `${u.nombre[0] ?? ''}${u.apellido[0] ?? ''}`.toUpperCase() : '?';
  });
}
