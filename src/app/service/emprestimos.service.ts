import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmprestimoService {
  private baseUrl = 'http://localhost:3000/emprestimo'; // Ajuste para o seu backend

  constructor(private http: HttpClient) {}

  // Método para buscar os empréstimos do agiota
  getEmprestimos(idAgiota: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/agiota/${idAgiota}`);
  }

  // Método para criar um empréstimo
  createEmprestimo(emprestimo: any, idAgiota: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, emprestimo);
  }

  // Método para atualizar um empréstimo
  atualizarEmprestimo(emprestimo: any, idAgiota: number): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/update/${emprestimo.id}}`,
      emprestimo,
    );
  }

  // Método para deletar um empréstimo
  deleteEmprestimo(id: number, idAgiota: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
