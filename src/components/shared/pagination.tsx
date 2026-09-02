"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  pagina: number;
  totalPaginas: number;
  onPageChange: (page: number) => void;
}

export const RETICENCIAS = "...";
const VIZINHAS_DA_ATUAL = 1;
const MAXIMO_SEM_RETICENCIAS = 7;

export type ItemDePaginacao = number | typeof RETICENCIAS;

export function paginasVisiveis(pagina: number, totalPaginas: number): ItemDePaginacao[] {
  if (totalPaginas <= MAXIMO_SEM_RETICENCIAS) {
    return Array.from({ length: totalPaginas }, (_, i) => i + 1);
  }

  const inicio = Math.max(2, pagina - VIZINHAS_DA_ATUAL);
  const fim = Math.min(totalPaginas - 1, pagina + VIZINHAS_DA_ATUAL);

  const itens: ItemDePaginacao[] = [1];
  if (inicio > 2) itens.push(RETICENCIAS);
  for (let numero = inicio; numero <= fim; numero++) itens.push(numero);
  if (fim < totalPaginas - 1) itens.push(RETICENCIAS);
  itens.push(totalPaginas);
  return itens;
}

export function Pagination({ pagina, totalPaginas, onPageChange }: PaginationProps) {
  if (totalPaginas <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Paginação">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(pagina - 1)} disabled={pagina <= 1} aria-label="Página anterior">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {paginasVisiveis(pagina, totalPaginas).map((item, i) =>
        item === RETICENCIAS ? (
          <span key={`reticencias-${i}`} className="px-2 text-sm text-muted-foreground">
            {RETICENCIAS}
          </span>
        ) : (
          <Button
            key={item}
            variant={item === pagina ? "default" : "outline"}
            size="icon"
            className="h-8 w-8 text-xs"
            onClick={() => onPageChange(item)}
            aria-current={item === pagina ? "page" : undefined}
          >
            {item}
          </Button>
        ),
      )}

      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(pagina + 1)} disabled={pagina >= totalPaginas} aria-label="Próxima página">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
