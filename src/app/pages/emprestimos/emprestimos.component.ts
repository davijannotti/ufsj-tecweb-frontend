import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ClientesService } from 'src/app/service/clientes.service';
import { EmprestimoService } from 'src/app/service/emprestimos.service';
import { Cliente } from 'src/app/models/cliente.model';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-emprestimos',
  templateUrl: './emprestimos.component.html',
  providers: [MessageService],
})
export class EmprestimoComponent implements OnInit {
  emprestimos: any[] = [];
  clientes: Cliente[] = []; // Agora, a lista de clientes deve ser do tipo Cliente[]
  novoEmprestimo = {
    cliente: null,
    agiota: null, // Inicializa com o ID do agiota
    valor: null,
    taxa_juros: null,
    data_inicio: null,
    data_vencimento: null,
    status: null,
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
    { field: 'acoes', header: 'Ações' },
  ];

  agiotaId: number; // Armazena o ID do agiota da sessão

  constructor(
    private messageService: MessageService,
    private clientesService: ClientesService,
    private emprestimoService: EmprestimoService,
    private authService: AuthService,
  ) {
    this.agiotaId = authService.getAgiotaId(); // Obter o ID do agiota autenticado
  }

  ngOnInit() {
    // Carregar dados de empréstimos e clientes ao inicializar o componente
    this.carregarEmprestimos();
    this.carregarClientes();
  }

  carregarEmprestimos() {
    // Passar o idAgiota ao serviço
    this.emprestimoService.getEmprestimos(this.agiotaId).subscribe(
      (data) => {
        console.log('Agiota ID: ', data);
        if (Array.isArray(data)) {
          this.emprestimos = data.filter((emprestimo) => {
            return emprestimo.agiota.id === this.agiotaId;
          });
          data.map((emprestimo) => {
            const hoje = new Date();
            const dataVencimento = new Date(emprestimo.data_vencimento);
            if (dataVencimento < hoje && emprestimo.status !== 'pago') {
              emprestimo.status = 'atrasado';
            }
            return emprestimo;
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Formato de resposta inválido',
          });
        }
      },
      (error) => {
        console.error('Erro ao carregar empréstimos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar empréstimos.',
        });
      },
    );
  }

  carregarClientes() {
    this.clientesService.getClientes().subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.clientes = data;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Formato de resposta inválido',
          });
        }
      },
      (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar clientes.',
        });
      },
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
      status: 'ativo',
    };
    this.updateDialog = true;
  }

  editarEmprestimo(emprestimo: any) {
    this.novoEmprestimo = { ...emprestimo };
    this.updateDialog = true;
  }

  deletarEmprestimo(id: number) {
    this.emprestimo = this.emprestimos.find((e) => e.id === id);
    this.deleteDialog = true;
  }

  onHideDialog() {
    this.updateDialog = false;
    this.deleteDialog = false;
  }

  salvarEmprestimo() {
    console.log('ID do Cliente Selecionado:', this.novoEmprestimo.cliente);
    if (
      this.novoEmprestimo.cliente &&
      this.novoEmprestimo.valor &&
      this.novoEmprestimo.taxa_juros
    ) {
      // Passando o ID do agiota ao criar o empréstimo
      this.emprestimoService
        .createEmprestimo(this.novoEmprestimo, this.agiotaId)
        .subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Empréstimo salvo com sucesso!',
            });
            this.onHideDialog();
            this.carregarEmprestimos();
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao salvar empréstimo!',
            });
          },
        );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos!',
      });
    }
  }

  getClienteNome(clienteId: number): string {
    const cliente = this.clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.nome : 'Nome não encontrado';
  }

  confirmarPagamento(emprestimo: any) {
    emprestimo.status = 'pago';

    this.emprestimoService
      .atualizarEmprestimo(emprestimo, this.agiotaId)
      .subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Empréstimo pago com sucesso!',
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao confirmar pagamento!',
          });
        },
      );
  }

  onConfirmDelete() {
    if (this.emprestimo) {
      this.emprestimoService
        .deleteEmprestimo(this.emprestimo.id, this.agiotaId)
        .subscribe(
          () => {
            const index = this.emprestimos.findIndex(
              (e) => e.id === this.emprestimo.id,
            );
            if (index > -1) {
              this.emprestimos.splice(index, 1);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Empréstimo excluído!',
            });
            this.deleteDialog = false;
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao excluir empréstimo!',
            });
            this.deleteDialog = false;
          },
        );
    }
  }
}
