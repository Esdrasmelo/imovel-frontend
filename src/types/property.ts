export const TIPO_IMOVEL = {
  APARTAMENTO: "APARTAMENTO",
  CASA: "CASA",
  TERRENO: "TERRENO",
  LOTE: "LOTE",
  STUDIO: "STUDIO",
  COMERCIAL: "COMERCIAL",
} as const;
export type TipoImovel = (typeof TIPO_IMOVEL)[keyof typeof TIPO_IMOVEL];

export const TIPO_NEGOCIO = { VENDA: "VENDA", ALUGUEL: "ALUGUEL" } as const;
export type TipoNegocio = (typeof TIPO_NEGOCIO)[keyof typeof TIPO_NEGOCIO];

export const STATUS_CONSTRUCAO = {
  NA_PLANTA: "NA_PLANTA",
  EM_CONSTRUCAO: "EM_CONSTRUCAO",
  PRONTO: "PRONTO",
} as const;
export type StatusConstrucao = (typeof STATUS_CONSTRUCAO)[keyof typeof STATUS_CONSTRUCAO];

export interface Property {
  id: string;
  externalId: string;
  fonteId: string;
  titulo: string;
  descricao: string | null;
  url: string;
  urlImagens: string[];
  preco: number | null;
  precoPorM2: number | null;
  valorCondominio: number | null;
  tipoImovel: TipoImovel;
  tipoNegocio: TipoNegocio;
  statusConstrucao: StatusConstrucao | null;
  areaUtil: number | null;
  areaTotal: number | null;
  quartos: number | null;
  suites: number | null;
  banheiros: number | null;
  vagas: number | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string;
  estado: string;
  latitude: number | null;
  longitude: number | null;
  nomeEmpreendimento: string | null;
  construtora: string | null;
  aceitaFinanciamento: boolean | null;
  codigoImovel: string | null;
  dataPublicacao: string | null;
  dataAtualizacao: string | null;
  criadoEm: string;
  atualizadoEm: string;
  ativo: boolean;
}
