import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean> | Promise<boolean> | boolean {
        // Verifica se o usuário está autenticado
        const isAuthenticated = this.authService.isAuthenticated();

        if (!isAuthenticated) {
            // Se não estiver autenticado, redireciona para a página de login
            this.router.navigate(['/auth/login']);
        }

        // Retorna verdadeiro se o usuário estiver autenticado, ou falso caso contrário
        return isAuthenticated;
    }
}
