"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { SearchFilters } from "@/types/filters";

export function useProperties(filters: SearchFilters) {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () => api.imoveis.listar(filters),
    placeholderData: keepPreviousData,
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => api.imoveis.buscarPorId(id),
  });
}

export function useRecentProperties(quantidade: number) {
  return useQuery({
    queryKey: ["properties", "recent", quantidade],
    queryFn: () =>
      api.imoveis.listar({ ordenarPor: "criadoEm", ordem: "desc", tamanhoPagina: quantidade, pagina: 1 }),
  });
}
