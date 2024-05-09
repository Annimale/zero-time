import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isUser()) {
      return true;  // Permitir acceso si no hay un usuario logueado
    } else {
      this.router.navigate(['/']);  // Redirigir a la página de inicio si el usuario está logueado
      return false;
    }
  }
}
