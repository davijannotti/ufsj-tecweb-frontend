import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'], // opcional, para estilos personalizados
})
export class RegisterComponent {
  nome: string = '';
  email: string = '';
  telefone: string = '';
  senha: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router, public layoutService: LayoutService) {}

  onRegister() {
    // Verificação dos campos obrigatórios
    if (!this.nome || !this.email || !this.telefone || !this.senha) {
      this.errorMessage = 'Todos os campos são obrigatórios!';
      return;
    }

    // Criar o objeto Agiota com os dados preenchidos
    const agiota = {
      id: 0, // O ID será gerado pelo backend
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      senha: this.senha,
      clientes: [],  // Lista de clientes (pode começar vazia ou ser preenchida posteriormente)
      emprestimos: [] // Lista de empréstimos (pode começar vazia ou ser preenchida posteriormente)
    };

    // Chamar o serviço de autenticação para registrar o agiota
    this.authService.register(agiota).subscribe({
      next: () => {
        this.successMessage = 'Cadastro realizado com sucesso!';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000); // Redireciona após 2 segundos
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Erro ao realizar cadastro';
        this.successMessage = '';
      },
    });
  }
}
