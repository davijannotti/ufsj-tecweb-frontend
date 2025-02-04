import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agiota } from '../models/agiota.model';
import { Cliente } from '../models/cliente.model';
import { Emprestimo } from '../models/emprestimo.model';

@Injectable({
  providedIn: 'root'
})
export class SistemaAgiotaService {

  private apiUrl = 'http://localhost:3000';  // Substitua com a URL real da sua API

  constructor(private http: HttpClient) {}

  // CRUD para Agiotas
  createAgiota(agiota: Agiota): Observable<Agiota> {
    return this.http.post<Agiota>(`${this.apiUrl}/agiota`, agiota);
  }

  getAgiotas(): Observable<Agiota[]> {
    return this.http.get<Agiota[]>(`${this.apiUrl}/agiota`);
  }

  updateAgiota(agiota: Agiota): Observable<Agiota> {
    return this.http.put<Agiota>(`${this.apiUrl}/agiota/${agiota.id}`, agiota);
  }

  deleteAgiota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/agiota/${id}`);
  }

  // CRUD para Clientes
  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/cliente`, cliente);
  }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/cliente`);
  }

  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/cliente/${cliente.id}`, cliente);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cliente/${id}`);
  }

  // CRUD para Empréstimos
  createEmprestimo(emprestimo: Emprestimo): Observable<Emprestimo> {
    return this.http.post<Emprestimo>(`${this.apiUrl}/emprestimo`, emprestimo);
  }

  getEmprestimos(): Observable<Emprestimo[]> {
    return this.http.get<Emprestimo[]>(`${this.apiUrl}/emprestimo`);
  }

  updateEmprestimo(emprestimo: Emprestimo): Observable<Emprestimo> {
    return this.http.put<Emprestimo>(`${this.apiUrl}/emprestimo/${emprestimo.id}`, emprestimo);
  }

  deleteEmprestimo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/emprestimo/${id}`);
  }

  // Obter empréstimos por Agiota e Cliente
  getEmprestimosByAgiota(idAgiota: number): Observable<Emprestimo[]> {
    return this.http.get<Emprestimo[]>(`${this.apiUrl}/emprestimo/agiota/${idAgiota}`);
  }

  getEmprestimosByCliente(idCliente: number): Observable<Emprestimo[]> {
    return this.http.get<Emprestimo[]>(`${this.apiUrl}/emprestimo/cliente/${idCliente}`);
  }
}
