const moedaBrasileira = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const dataCurta = new Intl.DateTimeFormat("pt-BR");

const dataEHora = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export const SEM_VALOR = "—";
export const PRECO_SOB_CONSULTA = "Sob consulta";

export function formatCurrency(value: number | null | undefined, ausente = PRECO_SOB_CONSULTA): string {
  if (value == null) return ausente;
  return moedaBrasileira.format(value);
}

export function formatArea(value: number | null | undefined): string {
  if (value == null) return SEM_VALOR;
  return `${value} m²`;
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return SEM_VALOR;
  return dataCurta.format(new Date(date));
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return SEM_VALOR;
  return dataEHora.format(new Date(date));
}

export function formatInteger(value: number): string {
  return value.toLocaleString("pt-BR");
}

export function pluralizar(quantidade: number, singular: string, plural: string): string {
  return quantidade === 1 ? singular : plural;
}
