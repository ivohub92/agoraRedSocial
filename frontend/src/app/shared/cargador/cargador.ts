import { Component, inject } from '@angular/core';
import { CargadorService } from './cargador.service';

@Component({
  selector: 'app-cargador',
  template: `
    @let datos = cargador.actual();
    <div class="cargador" [class.visible]="datos" [attr.aria-hidden]="!datos" role="status" aria-live="polite">
      <div class="mascota">
        <div class="giro"></div>
        <div class="pulso"></div>
        <img src="mascota.svg" alt="" />
      </div>
      <span class="texto">{{ datos?.texto }}</span>
      @if (datos?.detalle) {
        <span class="detalle">{{ datos?.detalle }}</span>
      }
    </div>
  `,
  styleUrl: './cargador.scss',
})
export class Cargador {
  protected readonly cargador = inject(CargadorService);
}
