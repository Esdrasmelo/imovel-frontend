export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    pagina: number;
    tamanhoPagina: number;
    totalPaginas: number;
  };
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}

export interface ContagemPorFaixa {
  faixa: string;
  quantidade: number;
}

export interface ContagemPorFonte {
  fonte: string;
  quantidade: number;
}

export interface ContagemPorTipo {
  tipo: string;
  quantidade: number;
}

export interface ContagemPorStatus {
  status: string;
  quantidade: number;
}

export interface Estatisticas {
  totalImoveis: number;
  precoMedio: number | null;
  precoMediano: number | null;
  distribuicaoPreco: ContagemPorFaixa[];
  porFonte: ContagemPorFonte[];
  porTipo: ContagemPorTipo[];
  porStatus: ContagemPorStatus[];
}

export interface HealthStatus {
  status: "ok" | "error";
  database: "connected" | "disconnected";
}
