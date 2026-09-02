"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatusConstrucao } from "@/types/property";

const statusConfig: Record<string, { label: string; className: string }> = {
  NA_PLANTA: {
    label: "Na Planta",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  EM_CONSTRUCAO: {
    label: "Em Construção",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  PRONTO: {
    label: "Pronto",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
};

export function PropertyBadge({ status }: { status: StatusConstrucao | null }) {
  if (!status) return null;

  const config = statusConfig[status];
  if (!config) return null;

  return (
    <Badge variant="outline" className={cn("text-xs font-medium border-0", config.className)}>
      {config.label}
    </Badge>
  );
}
