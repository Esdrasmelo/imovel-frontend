export interface FonteDados {
  id: string;
  nome: string;
  tipo: string;
  urlBase: string;
  ativo: boolean;
  criadoEm: string;
}

export interface ExecucaoColeta {
  id: string;
  fonteId: string;
  status: "PENDENTE" | "EM_ANDAMENTO" | "SUCESSO" | "ERRO" | "PARCIAL";
  iniciadoEm: string;
  finalizadoEm: string | null;
  totalEncontrados: number;
  totalNovos: number;
  totalAtualizados: number;
  totalErros: number;
  mensagemErro: string | null;
}

export interface StatusFonte {
  fonte: FonteDados;
  ultimaExecucao: ExecucaoColeta | null;
  totalImoveis: number;
}
