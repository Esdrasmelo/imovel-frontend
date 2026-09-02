"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TIPOS_IMOVEL, STATUS_CONSTRUCAO_OPTIONS, FONTES } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import type { SearchFilters } from "@/types/filters";

interface FilterBarProps {
  filters: SearchFilters;
  onRemove: (updated: SearchFilters) => void;
}

interface FilterPill {
  key: string;
  label: string;
  onRemove: () => void;
}

export function FilterBar({ filters, onRemove }: FilterBarProps) {
  const pills: FilterPill[] = [];

  if (filters.precoMin != null) {
    pills.push({
      key: "precoMin",
      label: `A partir de ${formatCurrency(filters.precoMin)}`,
      onRemove: () => onRemove({ ...filters, precoMin: undefined }),
    });
  }

  if (filters.precoMax != null) {
    pills.push({
      key: "precoMax",
      label: `Até ${formatCurrency(filters.precoMax)}`,
      onRemove: () => onRemove({ ...filters, precoMax: undefined }),
    });
  }

  filters.tipoImovel?.forEach((tipo) => {
    const label = TIPOS_IMOVEL.find((t) => t.value === tipo)?.label ?? tipo;
    pills.push({
      key: `tipo-${tipo}`,
      label,
      onRemove: () =>
        onRemove({
          ...filters,
          tipoImovel: filters.tipoImovel?.filter((t) => t !== tipo),
        }),
    });
  });

  filters.statusConstrucao?.forEach((status) => {
    const label = STATUS_CONSTRUCAO_OPTIONS.find((s) => s.value === status)?.label ?? status;
    pills.push({
      key: `status-${status}`,
      label,
      onRemove: () =>
        onRemove({
          ...filters,
          statusConstrucao: filters.statusConstrucao?.filter((s) => s !== status),
        }),
    });
  });

  if (filters.quartosMin != null) {
    pills.push({
      key: "quartosMin",
      label: `${filters.quartosMin}+ quartos`,
      onRemove: () => onRemove({ ...filters, quartosMin: undefined }),
    });
  }

  if (filters.areaMin != null) {
    pills.push({
      key: "areaMin",
      label: `${filters.areaMin}+ m²`,
      onRemove: () => onRemove({ ...filters, areaMin: undefined }),
    });
  }

  filters.fonte?.forEach((fonte) => {
    const label = FONTES.find((f) => f.value === fonte)?.label ?? fonte;
    pills.push({
      key: `fonte-${fonte}`,
      label,
      onRemove: () =>
        onRemove({
          ...filters,
          fonte: filters.fonte?.filter((f) => f !== fonte),
        }),
    });
  });

  if (filters.aceitaFinanciamento) {
    pills.push({
      key: "financiamento",
      label: "Aceita Financiamento",
      onRemove: () => onRemove({ ...filters, aceitaFinanciamento: undefined }),
    });
  }

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((pill) => (
        <Badge
          key={pill.key}
          variant="secondary"
          className="flex items-center gap-1 pr-1 text-xs"
        >
          {pill.label}
          <button
            onClick={pill.onRemove}
            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
            aria-label={`Remover filtro: ${pill.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
