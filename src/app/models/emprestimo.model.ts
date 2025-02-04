import { Agiota } from "./agiota.model";
import { Cliente } from "./cliente.model";

export interface Emprestimo {
  id: number;
  valor: number;
  taxa_juros: number;
  data_inicio: string;  // Data em formato ISO (YYYY-MM-DD)
  data_vencimento: string;
  status: 'ativo' | 'atrasado' | 'pago';
  agiota: Agiota;
  cliente: Cliente;
}
