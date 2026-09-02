import { Building2 } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Building2 className="h-16 w-16 text-muted-foreground/40" />
      <h3 className="mt-4 text-lg font-semibold">Nenhum imóvel encontrado</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Tente ajustar os filtros de busca para encontrar mais resultados.
      </p>
    </div>
  );
}
