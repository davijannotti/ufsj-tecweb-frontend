import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ClientesService } from 'src/app/service/clientes.service';

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    providers: [MessageService],
})
export class ClientesComponent implements OnInit {
    clientes: any[] = [];
    cols: any[] = [
        { field: 'nome', header: 'Nome' },
        { field: 'endereco', header: 'Endereco' },
        { field: 'telefone', header: 'Telefone' },
        { field: 'acoes', header: 'Ações' },
    ];
    novoCliente: any = {};
    updateDialog: boolean = false;
    deleteDialog: boolean = false;
    clienteSelecionado: any = null;

    constructor(
        private clientesService: ClientesService,
        private messageService: MessageService,
    ) {}

    ngOnInit() {
        this.carregarClientes();
    }

    carregarClientes() {
        this.clientesService.getClientes().subscribe(
            (data) => {
                this.clientes = data;
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar os clientes.',
                });
            },
        );
    }

    abrirDialogo() {
        this.novoCliente = {};
        this.updateDialog = true;
    }

    salvarCliente() {
        if (this.novoCliente.id) {
            this.clientesService.atualizarCliente(this.novoCliente).subscribe(
                () => {
                    this.carregarClientes();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Cliente atualizado.',
                    });
                    this.updateDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Não foi possível atualizar o cliente.',
                    });
                },
            );
        } else {
            this.clientesService.adicionarCliente(this.novoCliente).subscribe(
                () => {
                    this.carregarClientes();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Cliente adicionado.',
                    });
                    this.updateDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Não foi possível adicionar o cliente.',
                    });
                },
            );
        }
    }

    editarCliente(cliente: any) {
        this.novoCliente = { ...cliente };
        this.updateDialog = true;
    }

    confirmarExclusao(cliente: any) {
        this.clienteSelecionado = cliente;
        this.deleteDialog = true;
    }

    excluirCliente() {
        if (this.clienteSelecionado) {
            this.clientesService
                .removerCliente(this.clienteSelecionado.id)
                .subscribe(
                    () => {
                        this.carregarClientes();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Cliente excluído.',
                        });
                        this.deleteDialog = false;
                    },
                    () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Não foi possível excluir o cliente.',
                        });
                    },
                );
        }
    }
}
