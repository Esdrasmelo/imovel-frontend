import type { Estatisticas, HealthStatus, PaginatedResponse } from "@/types/api";
import type { Property } from "@/types/property";
import type { ExecucaoColeta, StatusFonte } from "@/types/scraping";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export type QueryParams = Record<string, string | number | boolean | string[] | undefined>;

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export function toQueryString(params: QueryParams | undefined): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [chave, valor] of Object.entries(params)) {
    if (valor === undefined) continue;
    if (Array.isArray(valor)) {
      if (valor.length > 0) search.set(chave, valor.join(","));
      continue;
    }
    search.set(chave, String(valor));
  }
  const texto = search.toString();
  return texto ? `?${texto}` : "";
}

async function mensagemDeErro(response: Response): Promise<string> {
  const corpo = await response.json().catch(() => null);
  const mensagem = corpo && typeof corpo === "object" && "message" in corpo ? corpo.message : null;
  return typeof mensagem === "string" && mensagem ? mensagem : `HTTP ${response.status}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiRequestError(await mensagemDeErro(response), response.status);
  }

  return response.json() as Promise<T>;
}

export const api = {
  imoveis: {
    listar: (params?: QueryParams) =>
      request<PaginatedResponse<Property>>(`/api/imoveis${toQueryString(params)}`),
    buscarPorId: (id: string) => request<Property>(`/api/imoveis/${encodeURIComponent(id)}`),
    bairros: (cidade?: string) => request<string[]>(`/api/imoveis/bairros${toQueryString({ cidade })}`),
    construtoras: () => request<string[]>("/api/imoveis/construtoras"),
    fontes: () => request<string[]>("/api/imoveis/fontes"),
    estatisticas: () => request<Estatisticas>("/api/imoveis/estatisticas"),
  },
  coleta: {
    executar: (fonte?: string) =>
      request<ExecucaoColeta[]>("/api/coleta/executar", {
        method: "POST",
        body: JSON.stringify(fonte ? { fonte } : {}),
      }),
    execucoes: (params?: QueryParams) =>
      request<ExecucaoColeta[]>(`/api/coleta/execucoes${toQueryString(params)}`),
    fontes: () => request<StatusFonte[]>("/api/coleta/fontes"),
  },
  health: () => request<HealthStatus>("/api/health"),
};
