import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, mensajeDeError } from '../../../core/auth.service';
import { Icono } from '../../../shared/icono/icono';
import { ModalService } from '../../../shared/modal/modal.service';

/** Pestaña "Iniciar sesión" de la página de acceso. */
@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, Icono],
  templateUrl: './login-form.html',
})
export class LoginForm {
  private readonly auth = inject(AuthService);
  private readonly modal = inject(ModalService);
  private readonly router = inject(Router);

  /** Pide a la página que muestre la pestaña de registro. */
  readonly irARegistro = output<void>();

  protected readonly enviando = signal(false);
  protected readonly verPassword = signal(false);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    // En el login solo se exige completar los campos: mostrar las reglas de la
    // contraseña (o del usuario) daría pistas a quien intenta adivinar una cuenta.
    identificador: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected invalido(campo: 'identificador' | 'password'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: (usuario) => {
        this.enviando.set(false);
        this.modal.exito(`Hola, ${usuario.nombre}`, 'Iniciaste sesión correctamente.', () =>
          this.router.navigateByUrl('/publicaciones'),
        );
      },
      error: (err) => {
        this.enviando.set(false);
        this.modal.error('No se pudo iniciar sesión', mensajeDeError(err));
      },
    });
  }
}
