import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ClientesService } from 'src/app/service/clientes.service';
import { EmprestimoService } from 'src/app/service/emprestimos.service';
import { Cliente } from 'src/app/models/cliente.model';

@Component({
  selector: 'app-emprestimos',
  templateUrl: './emprestimos.component.html',
  providers: [MessageService]
})
export class EmprestimoComponent implements OnInit {
  emprestimos: any[] = [];
  clientes: Cliente[] = []; // Agora, a lista de clientes deve ser do tipo Cliente[]
  novoEmprestimo = {
    cliente: null,
    agiota: null,  // Inicializa com o ID do agiota
    valor: null,
    taxa_juros: null,
    data_inicio: null,
    data_vencimento: null,
    status: null
  };
  updateDialog: boolean = false;
  deleteDialog: boolean = false;
  emprestimo: any = null;
  minDate: Date = new Date();
  cols: any[] = [
    { field: 'cliente', header: 'Cliente' },
    { field: 'valor', header: 'Valor' },
    { field: 'taxa_juros', header: 'Taxa de Juros' },
    { field: 'data_inicio', header: 'Data de Início' },
    { field: 'data_vencimento', header: 'Data de Vencimento' },
    { field: 'status', header: 'Status' },
    { field: 'acoes', header: 'Ações' }
  ];

  agiotaId: number; // Armazena o ID do agiota da sessão
  
  constructor(
    private messageService: MessageService,
    private clientesService: ClientesService,
    private emprestimoService: EmprestimoService
  ) { 
    this.agiotaId = parseInt(localStorage.getItem('agiotaId') || '0', 10);
  }

  ngOnInit() {
    // Carregar dados de empréstimos e clientes ao inicializar o componente
    this.carregarEmprestimos();
    this.carregarClientes();
  }

  carregarEmprestimos() {
    this.emprestimoService.getEmprestimos().subscribe(
      (data) => {
        // Verifique se a resposta está no formato correto
        if (Array.isArray(data)) {
          this.emprestimos = data
            .filter((emprestimo) => emprestimo.agiota.id === this.agiotaId)
            .map((emprestimo) => {
              const hoje = new Date();
              const dataVencimento = new Date(emprestimo.data_vencimento);
              if (dataVencimento < hoje && emprestimo.status !== 'pago') {
                emprestimo.status = 'atrasado';
              }
              return emprestimo;
            });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Formato de resposta inválido' });
        }
      },
      (error) => {
        console.error('Erro ao carregar empréstimos:', error);  // Log para depuração
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar empréstimos.' });
      }
    );
  }

  carregarClientes() {
    this.clientesService.getClientes().subscribe(
      (data) => {
        // Verifique se a resposta está no formato correto
        if (Array.isArray(data)) {
          this.clientes = data; // Atribuir diretamente os clientes
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Formato de resposta inválido' });
        }
      },
      (error) => {
        console.error('Erro ao carregar clientes:', error);  // Log detalhado do erro
        if (error.error) {
          console.error('Detalhes do erro:', error.error);  // Exibe a resposta de erro do backend, se houver
        }
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar clientes.' });
      }
    );
  }

  abrirDialogo() {
    this.novoEmprestimo = {
      cliente: null,
      agiota: this.agiotaId,
      valor: null,
      taxa_juros: null,
      data_inicio: null,
      data_vencimento: null,
      status: 'ativo' // Status padrão
    };
    this.updateDialog = true;
  }

  editarEmprestimo(emprestimo: any) {
    this.novoEmprestimo = { ...emprestimo };
    this.updateDialog = true;
  }

  deletarEmprestimo(id: number) {
    this.emprestimo = this.emprestimos.find(e => e.id === id);  // Alterado para 'emprestimo'
    this.deleteDialog = true;
  }

  onHideDialog() {
    this.updateDialog = false;
    this.deleteDialog = false;
  }

  salvarEmprestimo() {
    console.log('ID do Cliente Selecionado:', this.novoEmprestimo);
    if (this.novoEmprestimo.cliente && this.novoEmprestimo.valor && this.novoEmprestimo.taxa_juros) {
      this.emprestimoService.createEmprestimo(this.novoEmprestimo).subscribe(
        (response) => {
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Empréstimo salvo com sucesso!'});
          this.onHideDialog(); // Fecha o diálogo
          this.carregarEmprestimos(); // Recarrega a lista de empréstimos
        },
        (error) => {
          this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Falha ao salvar empréstimo!'});
        }
      );
    } else {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos!'});
    }
  }

  confirmarPagamento(emprestimo: any) {
    // Atualiza o status para 'pago'
    emprestimo.status = 'pago';
  
    this.emprestimoService.atualizarEmprestimo(emprestimo).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Empréstimo pago com sucesso!' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao confirmar pagamento!' });
      }
    );
  }

  onConfirmDelete() {
    if (this.emprestimo) {
      this.emprestimoService.deleteEmprestimo(this.emprestimo.id).subscribe(
        () => {
          const index = this.emprestimos.findIndex((e) => e.id === this.emprestimo.id);
          if (index > -1) {
            this.emprestimos.splice(index, 1);
          }
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Empréstimo excluído!' });
          this.deleteDialog = false;
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir empréstimo!' });
          this.deleteDialog = false;
        }
      );
    }
  }
}
