import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agiota } from '../models/agiota.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:3000'; // Altere para sua URL da API
    private tokenKey = 'authToken'; // Chave usada para armazenar o token no localStorage

    constructor(private http: HttpClient) {}

    login(email: string, senha: string): Observable<any> {
        return new Observable((observer) => {
            // Sempre faz o logout antes de tentar um novo login
            this.logout();

            this.http
                .post(`${this.apiUrl}/auth/login`, { email, senha })
                .subscribe(
                    (response: any) => {
                        if (
                            response &&
                            response.access_token &&
                            response.agiota
                        ) {
                            // Armazena o token JWT no localStorage
                            localStorage.setItem(
                                this.tokenKey,
                                response.access_token,
                            );

                            // Armazena o objeto agiota no localStorage
                            localStorage.setItem(
                                'agiota',
                                JSON.stringify(response.agiota),
                            );

                            observer.next(response);
                        } else {
                            observer.error(
                                'Resposta inválida, token ou agiota não encontrado',
                            );
                        }
                    },
                    (error) => observer.error(error),
                );
        });
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem('agiota');
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem(this.tokenKey);
        return !!token; // Retorna true se o token existir
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    register(agiota: Agiota): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/register`, agiota);
    }

    getAgiotaId(): number | null {
        const agiota = JSON.parse(localStorage.getItem('agiota') || 'null');
        if (agiota && agiota.id) {
            return agiota.id; // Retorna o ID do agiota
        }
        console.warn('Agiota não encontrado no localStorage');
        return null;
    }
}
