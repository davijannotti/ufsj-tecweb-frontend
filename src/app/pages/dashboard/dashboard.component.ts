import { Component, OnInit } from '@angular/core';
import { SistemaAgiotaService } from '../../service/sistema-agiota.service';
import { Cliente } from '../../models/cliente.model';
import { Emprestimo } from '../../models/emprestimo.model';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard-agiota',
  templateUrl: './dashboard.component.html',
  providers: [MessageService, ConfirmationService]
})
export class DashboardComponent implements OnInit {

  totalClientes: number = 0;
  totalInadimplentes: number = 0;
  totalRendimentos: number = 0;
  clientes: Cliente[] = [];
  clientesInadimplentes: Cliente[] = [];
  emprestimos: Emprestimo[] = [];
  exibirDialogEdicao: boolean = false;
  clienteEditando: Cliente = {} as Cliente; // Cliente em edição


  graficoLucros: any = {};
  graficoInadimplentes: any = {};
  filtroInadimplentes: boolean = false;

  constructor(
    private sistemaAgiotaService: SistemaAgiotaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadClientes();
    this.loadEmprestimos();
  }

  // Carregar dados dos clientes
  loadClientes(): void {
    this.sistemaAgiotaService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
      this.totalClientes = clientes.length;
      this.updateClientes();
    }, error => {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Falha ao carregar clientes'});
    });
  }

  // Carregar dados de empréstimos e calcular rendimentos
  loadEmprestimos(): void {
    this.sistemaAgiotaService.getEmprestimos().subscribe(emprestimos => {
      this.emprestimos = emprestimos;
      this.totalRendimentos = emprestimos.reduce((acc, emprestimo) => acc + emprestimo.valor, 0);

      // Verificar inadimplência e atualizar status de empréstimos
      this.checkInadimplencia(emprestimos);

      // Atualizar gráficos
      this.updateGraficoLucros();
      this.updateGraficoInadimplentes();
    }, error => {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Falha ao carregar empréstimos'});
    });
  }

  // Verificar inadimplência e atualizar status de empréstimos
  checkInadimplencia(emprestimos: Emprestimo[]): void {
    const hoje = new Date();
    this.clientesInadimplentes = [];

    console.log('Verificando inadimplência...');
    console.log('Data atual:', hoje);
    
    emprestimos.forEach(emprestimo => {
      console.log('Analisando empréstimo:', emprestimo);
      const dataVencimento = new Date(emprestimo.data_vencimento);

      if ((emprestimo.status === 'ativo' && dataVencimento < hoje) || emprestimo.status === 'atrasado') {
        // Atualiza status do empréstimo para 'atrasado'
        emprestimo.status = 'atrasado';
        this.sistemaAgiotaService.updateEmprestimo(emprestimo).subscribe(() => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Empréstimo Atrasado',
            detail: `Empréstimo do cliente ${emprestimo.cliente} está atrasado!`
          });
        });

        // Adiciona cliente à lista de inadimplentes
        const clienteInadimplente = this.clientes.find(cliente => cliente.id === emprestimo.cliente.id);
        if (clienteInadimplente && !this.clientesInadimplentes.includes(clienteInadimplente)) {
          this.clientesInadimplentes.push(clienteInadimplente);
        }
      }
    });

    // Atualiza o total de inadimplentes
    this.totalInadimplentes = this.clientesInadimplentes.length;
  }

  // Atualizar lista de clientes (com filtro opcional de inadimplentes)
  updateClientes(): void {
    if (this.filtroInadimplentes) {
      // Filtra apenas os clientes inadimplentes, sem necessidade de recarregar os dados da API
      this.clientes = this.clientesInadimplentes;
    } else {
      // Se não houver filtro, apenas mostra todos os clientes já carregados
      this.clientes = [...this.clientes]; // Isso força uma atualização da tabela
    }
  }

  // Atualizar gráfico de lucros
  updateGraficoLucros(): void {
    const lucroMensal = this.emprestimos.reduce((acc, emprestimo) => {
      const mes = new Date(emprestimo.data_inicio).getMonth();
      acc[mes] = (acc[mes] || 0) + emprestimo.valor;
      return acc;
    }, Array(12).fill(0));

    this.graficoLucros = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      datasets: [{
        label: 'Lucros Mensais',
        data: lucroMensal,
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        fill: true
      }]
    };
  }

  // Atualizar gráfico de inadimplentes
  updateGraficoInadimplentes(): void {
    const inadimplentesMensais = Array(12).fill(0);
  
    // Para cada cliente inadimplente, vamos verificar o primeiro empréstimo associado
    this.clientesInadimplentes.forEach(cliente => {
      // Encontrar o primeiro empréstimo do cliente
      const primeiroEmprestimo = this.emprestimos.find(emprestimo => emprestimo.cliente.id === cliente.id);
  
      if (primeiroEmprestimo) {
        // Usar a data de início do primeiro empréstimo como base
        const mes = new Date(primeiroEmprestimo.data_inicio).getMonth();
        inadimplentesMensais[mes]++;
      }
    });
  
    // Atualizando o gráfico de inadimplentes
    this.graficoInadimplentes = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      datasets: [{
        label: 'Inadimplentes Mensais',
        data: inadimplentesMensais,
        backgroundColor: '#FF5733',
        hoverBackgroundColor: '#FF5733',
        fill: true
      }]
    };
  }

  editarCliente(cliente: Cliente): void {
    this.clienteEditando = { ...cliente }; // Cria uma cópia para edição
    this.exibirDialogEdicao = true;       // Exibe o diálogo de edição
  }

  salvarEdicaoCliente(): void {
    this.sistemaAgiotaService.updateCliente(this.clienteEditando).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente atualizado com sucesso!' });
      this.exibirDialogEdicao = false; // Fecha o diálogo
      this.loadClientes();             // Atualiza a lista de clientes
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar cliente' });
    });
  }
  
  cancelarEdicaoCliente(): void {
    this.exibirDialogEdicao = false; // Fecha o diálogo sem salvar
    this.clienteEditando = {} as Cliente; // Limpa os dados do cliente em edição
  }


  // Confirmar remoção de cliente
  confirmarRemocao(cliente: Cliente): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja remover o cliente ${cliente.nome}?`,
      header: 'Confirmar Remoção',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removerCliente(cliente);
      }
    });
  }

  // Remover cliente
  removerCliente(cliente: Cliente): void {
    this.sistemaAgiotaService.deleteCliente(cliente.id).subscribe(() => {
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: `Cliente ${cliente.nome} removido com sucesso!`});
      this.loadClientes();
    }, error => {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Falha ao remover cliente'});
    });
  }
}
