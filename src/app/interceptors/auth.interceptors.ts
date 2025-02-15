import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service'; // Importa o seu AuthService

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        const token = this.authService.getToken(); // Obtém o token do serviço de autenticação

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`, // Adiciona o token no header
                },
            });
        }

        return next.handle(request); // Continua com a requisição
    }
}
