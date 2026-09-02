"use client";

import { Badge } from "@/components/ui/badge";
import { FONTES, rotuloDe } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CORES_POR_FONTE: Record<string, string> = {
  vivareal: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  zapimoveis: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  mrv: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  planeta: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  mendesortega: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const COR_DESCONHECIDA = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

export function SourceBadge({ fonteId }: { fonteId: string }) {
  return (
    <Badge variant="outline" className={cn("border-0 text-xs font-medium", CORES_POR_FONTE[fonteId] ?? COR_DESCONHECIDA)}>
      {rotuloDe(FONTES, fonteId)}
    </Badge>
  );
}
