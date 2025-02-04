import { Cliente } from "./cliente.model";

export interface Agiota {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  clientes: Cliente[]; 
  emprestimos: any[];
}
