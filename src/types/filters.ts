import type { TipoImovel, TipoNegocio, StatusConstrucao } from "./property";

export type OrdenacaoPor = "preco" | "areaUtil" | "quartos" | "criadoEm";
export type Ordem = "asc" | "desc";

export type SearchFilters = {
  q?: string;
  precoMin?: number;
  precoMax?: number;
  tipoImovel?: TipoImovel[];
  tipoNegocio?: TipoNegocio;
  statusConstrucao?: StatusConstrucao[];
  bairro?: string[];
  construtora?: string[];
  quartosMin?: number;
  areaMin?: number;
  aceitaFinanciamento?: boolean;
  fonte?: string[];
  cidade?: string;
  estado?: string;
  ordenarPor?: OrdenacaoPor;
  ordem?: Ordem;
  pagina?: number;
  tamanhoPagina?: number;
};
