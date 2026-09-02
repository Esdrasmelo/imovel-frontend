import type { StatusConstrucao, TipoImovel } from "@/types/property";

export interface Opcao<T extends string> {
  value: T;
  label: string;
}

export const FONTES: readonly Opcao<string>[] = [
  { value: "vivareal", label: "VivaReal" },
  { value: "zapimoveis", label: "ZapImóveis" },
  { value: "mrv", label: "MRV" },
  { value: "planeta", label: "Construtora Planeta" },
  { value: "mendesortega", label: "Mendes Ortega" },
];

export const TIPOS_IMOVEL: readonly Opcao<TipoImovel>[] = [
  { value: "APARTAMENTO", label: "Apartamento" },
  { value: "CASA", label: "Casa" },
  { value: "TERRENO", label: "Terreno" },
  { value: "LOTE", label: "Lote" },
  { value: "STUDIO", label: "Studio" },
  { value: "COMERCIAL", label: "Comercial" },
];

export const STATUS_CONSTRUCAO_OPTIONS: readonly Opcao<StatusConstrucao>[] = [
  { value: "NA_PLANTA", label: "Na planta" },
  { value: "EM_CONSTRUCAO", label: "Em construção" },
  { value: "PRONTO", label: "Pronto" },
];

export function rotuloDe<T extends string>(opcoes: readonly Opcao<T>[], valor: string): string {
  return opcoes.find((opcao) => opcao.value === valor)?.label ?? valor;
}
