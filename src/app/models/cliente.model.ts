import { Agiota } from './agiota.model';

export interface Cliente {
    id: number;
    nome: string;
    endereco: string;
    foto: Blob | null;
    telefone: string;
    agiota: Agiota;
    emprestimos: any[];
}
