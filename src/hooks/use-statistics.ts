"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export function useStatistics() {
  return useQuery({
    queryKey: ["statistics"],
    queryFn: () => api.imoveis.estatisticas(),
  });
}
