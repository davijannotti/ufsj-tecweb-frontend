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

  /**
   * Realiza o login e armazena o token JWT no localStorage
   * @param email Email do usuário
   * @param senha Senha do usuário
   * @returns Observable da resposta HTTP
   */
  login(email: string, senha: string): Observable<any> {
    return new Observable((observer) => {
      this.http.post(`${this.apiUrl}/auth/login`, { email, senha }).subscribe(
        (response: any) => {
          if (response && response.access_token) { // Verifica se 'access_token' está presente
            localStorage.setItem(this.tokenKey, response.access_token); // Armazena o token JWT
            observer.next(response);
          } else {
            observer.error('Token de acesso não recebido na resposta');
          }
        },
        (error) => observer.error(error)
      );
    });
  }

  /**
   * Realiza o logout removendo o token JWT do localStorage
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns true se o token JWT estiver presente, false caso contrário
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token; // Retorna true se o token existir
  }

  /**
   * Retorna o token JWT armazenado
   * @returns O token JWT ou null
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  
  register(agiota: Agiota): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, agiota);
  }

  /**
   * Obtém o ID do agiota logado diretamente do token
   * @returns O ID do agiota ou null se o token não existir ou estiver inválido
   */
  getAgiotaId(): number | null {
    const token = this.getToken(); // Obtém o token do localStorage
    if (!token) return null;

    try {
      // Extraímos o 'sub' do token (onde está o agiotaId)
      const tokenParts = token.split('.'); 
      const decoded = JSON.parse(atob(tokenParts[1])); // Decodifica o payload do token
      return decoded.sub || null; // Retorna o 'sub' (ID do agiota) ou null
    } catch (error) {
      console.error('Erro ao processar o token', error);
      return null;
    }
  }
}
