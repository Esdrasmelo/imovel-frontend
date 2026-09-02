"use client";

import { useCallback, useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useProperties } from "@/hooks/use-properties";
import { PropertyCard } from "@/components/property/property-card";
import { SearchFilters } from "@/components/search/search-filters";
import { FilterBar } from "@/components/search/filter-bar";
import { SortSelect } from "@/components/search/sort-select";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingCards } from "@/components/shared/loading-cards";
import { formatInteger, pluralizar } from "@/lib/format";
import type { OrdenacaoPor, Ordem, SearchFilters as SearchFiltersType } from "@/types/filters";

const FILTROS_INICIAIS: SearchFiltersType = {
  pagina: 1,
  tamanhoPagina: 12,
  ordenarPor: "criadoEm",
  ordem: "desc",
};

const PRIMEIRA_PAGINA = 1;

export default function ImoveisPage() {
  const [filters, setFilters] = useState<SearchFiltersType>(FILTROS_INICIAIS);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data, isLoading, isError, error } = useProperties(filters);

  const sortValue = `${filters.ordenarPor ?? "criadoEm"}-${filters.ordem ?? "desc"}`;

  const handleSortChange = useCallback((value: string) => {
    const [ordenarPor, ordem] = value.split("-") as [OrdenacaoPor, Ordem];
    setFilters((prev) => ({ ...prev, ordenarPor, ordem, pagina: PRIMEIRA_PAGINA }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, pagina: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleApplyFilters = useCallback((updated: SearchFiltersType) => {
    setFilters((prev) => ({ ...prev, ...updated, ordenarPor: prev.ordenarPor, ordem: prev.ordem, pagina: PRIMEIRA_PAGINA }));
  }, []);

  const handleRemoveFilter = useCallback((updated: SearchFiltersType) => {
    setFilters({ ...updated, pagina: PRIMEIRA_PAGINA });
  }, []);

  return (
    <div className="flex h-full">
      <aside className="hidden w-[280px] shrink-0 border-r lg:block">
        <div className="sticky top-0 h-[calc(100vh-3rem)]">
          <div className="border-b px-4 py-3">
            <h2 className="text-sm font-semibold">Filtros</h2>
          </div>
          <SearchFilters filters={filters} onApply={handleApplyFilters} />
        </div>
      </aside>

      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger render={<Button variant="outline" size="sm" className="lg:hidden" />}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0">
                  <SheetHeader className="border-b px-4 py-3">
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <SearchFilters filters={filters} onApply={handleApplyFilters} onClose={() => setSheetOpen(false)} />
                </SheetContent>
              </Sheet>

              {data && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{formatInteger(data.meta.total)}</span>{" "}
                  {pluralizar(data.meta.total, "imóvel encontrado", "imóveis encontrados")}
                </p>
              )}
            </div>

            <SortSelect value={sortValue} onChange={handleSortChange} />
          </div>

          <div className="mb-4">
            <FilterBar filters={filters} onRemove={handleRemoveFilter} />
          </div>

          {isError && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              Erro ao carregar imóveis: {error.message}
            </div>
          )}

          {isLoading && <LoadingCards count={6} />}

          {!isLoading && data && data.data.length === 0 && <EmptyState />}

          {!isLoading && data && data.data.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.data.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              <div className="mt-6">
                <Pagination pagina={data.meta.pagina} totalPaginas={data.meta.totalPaginas} onPageChange={handlePageChange} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
