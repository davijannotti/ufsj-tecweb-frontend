import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from './auth.service';  // Supondo que você tenha o AuthService
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class ClientesService {
    private apiUrl = "http://localhost:3000/cliente"; // URL da API

    constructor(private http: HttpClient, private authService: AuthService) {}

    // Obter todos os clientes do agiota logado
    getClientes(): Observable<any[]> {
        const token = this.authService.getToken(); // Obtém o token JWT
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        
        return this.http.get<any[]>(`${this.apiUrl}`, { headers })
            .pipe(
                catchError(error => {
                    console.error('Erro ao carregar clientes:', error);  // Depuração: log do erro
                    return throwError(() => new Error(error));
                })
            );
    }

    // Adicionar um novo cliente
    adicionarCliente(cliente: any): Observable<any> {
        const token = this.authService.getToken(); // Token JWT
        
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        
        return this.http.post(this.apiUrl, cliente, { headers })
            .pipe(
                catchError(error => {
                    console.error('Erro ao adicionar cliente:', error);
                    return throwError(() => new Error(error));
                })
            );
    }

    // Atualizar informações do cliente
    atualizarCliente(cliente: any): Observable<any> {
        const token = this.authService.getToken(); // Token JWT
        
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        
        return this.http.put(`${this.apiUrl}/${cliente.id}`, cliente, { headers })
            .pipe(
                catchError(error => {
                    console.error('Erro ao atualizar cliente:', error);
                    return throwError(() => new Error(error));
                })
            );
    }
    
    // Remover um cliente
    removerCliente(id: number): Observable<any> {
        const token = this.authService.getToken(); // Token JWT
        
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        
        return this.http.delete(`${this.apiUrl}/${id}`, { headers })
            .pipe(
                catchError(error => {
                    console.error('Erro ao remover cliente:', error);
                    return throwError(() => new Error(error));
                })
            );
    }
}
