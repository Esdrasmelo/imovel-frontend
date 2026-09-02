"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export function useNeighborhoods() {
  return useQuery({
    queryKey: ["neighborhoods"],
    queryFn: () => api.imoveis.bairros(),
    staleTime: 10 * 60 * 1000,
  });
}
