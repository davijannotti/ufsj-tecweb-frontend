import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Emprestimo } from '../models/emprestimo.model';
import { AuthService } from './auth.service';  // Supondo que você tenha um AuthService

@Injectable({
  providedIn: 'root',
})
export class EmprestimoService {
  private apiUrl = 'http://localhost:3000/emprestimo'; // Substituir pela URL real da API

  constructor(
    private http: HttpClient,
    private authService: AuthService  // Injeta o serviço de autenticação
  ) {}

  // Obter todos os empréstimos para o agiota logado
  getEmprestimos(): Observable<Emprestimo[]> {
    const idAgiota = this.authService.getAgiotaId();  // Supondo que o AuthService tem esse método
    const token = this.authService.getToken(); // Supondo que AuthService tem o método getToken()
    
    // Adiciona o token de autenticação no cabeçalho
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<Emprestimo[]>(`${this.apiUrl}/agiota/${idAgiota}`, { headers });
  }

  // Obter empréstimos por cliente e garantir que seja do agiota logado
  getEmprestimosByCliente(idCliente: number): Observable<Emprestimo[]> {
    const idAgiota = this.authService.getAgiotaId();  // Pega o ID do agiota logado
    const token = this.authService.getToken(); // Token de autenticação
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<Emprestimo[]>(`${this.apiUrl}/agiota/${idAgiota}/cliente/${idCliente}`, { headers });
  }

  // Criar novo empréstimo para o agiota logado
  createEmprestimo(emprestimo: any): Observable<Emprestimo> {
    const idAgiota = this.authService.getAgiotaId();  // Pega o ID do agiota logado
    emprestimo.agiotaId = idAgiota;  // Adiciona o ID do agiota no objeto emprestimo
    const token = this.authService.getToken(); // Token de autenticação

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post<Emprestimo>(`${this.apiUrl}`, emprestimo, { headers });
  }

  // Atualizar um empréstimo
  atualizarEmprestimo(emprestimo: any): Observable<any> {
    const token = this.authService.getToken(); // Token de autenticação
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.put(`${this.apiUrl}/${emprestimo.id}`, emprestimo, { headers });
  }

  // Remover empréstimo
  deleteEmprestimo(id: number): Observable<void> {
    const token = this.authService.getToken(); // Token de autenticação
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
