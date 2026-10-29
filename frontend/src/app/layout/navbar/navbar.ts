import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Avatar } from '../../shared/avatar/avatar';
import { Icono } from '../../shared/icono/icono';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Avatar, Icono],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected salir(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
