import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent {
    email: string = '';
    password: string = '';
    errorMessage: string = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        public layoutService: LayoutService,
    ) {}

    onLogin() {
        this.authService.login(this.email, this.password).subscribe({
            next: (response) => {
                localStorage.setItem('access_token', response.access_token); // Armazena o token
                this.router.navigate(['']); // Redireciona para o dashboard
            },
            error: (err) => {
                console.error('Erro durante o login:', err); // Log para debugging
                if (err.error && err.error.message) {
                    this.errorMessage = err.error.message; // Mensagem do servidor
                } else {
                    this.errorMessage =
                        'Ocorreu um erro inesperado. Tente novamente.';
                }
            },
        });
    }

    createAccount() {
        this.router.navigate(['/auth/register']);
    }
}
