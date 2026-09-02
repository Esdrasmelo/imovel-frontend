"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { GitCompareArrows, Heart, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PropertyCard } from "@/components/property/property-card";
import { api } from "@/lib/api-client";
import { formatArea, formatCurrency, pluralizar, SEM_VALOR } from "@/lib/format";
import { useFavorites } from "@/hooks/use-favorites";
import type { Property } from "@/types/property";

const MAXIMO_NA_COMPARACAO = 4;
const MINIMO_PARA_COMPARAR = 2;
const CINCO_MINUTOS = 5 * 60 * 1000;

const LINHAS_DA_COMPARACAO: Array<{ rotulo: string; valor: (p: Property) => string; destaque?: boolean }> = [
  { rotulo: "Preço", valor: (p) => formatCurrency(p.preco), destaque: true },
  { rotulo: "Área", valor: (p) => formatArea(p.areaUtil) },
  { rotulo: "Quartos", valor: (p) => (p.quartos == null ? SEM_VALOR : String(p.quartos)) },
  { rotulo: "Banheiros", valor: (p) => (p.banheiros == null ? SEM_VALOR : String(p.banheiros)) },
  { rotulo: "Vagas", valor: (p) => (p.vagas == null ? SEM_VALOR : String(p.vagas)) },
  { rotulo: "Bairro", valor: (p) => p.bairro ?? SEM_VALOR },
  { rotulo: "Construtora", valor: (p) => p.construtora ?? SEM_VALOR },
  { rotulo: "Preço/m²", valor: (p) => formatCurrency(p.precoPorM2, SEM_VALOR) },
  { rotulo: "Condomínio", valor: (p) => formatCurrency(p.valorCondominio, SEM_VALOR) },
];

function SemFavoritos() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Heart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Nenhum favorito ainda</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">Marque imóveis como favoritos para acompanhá-los e compará-los aqui.</p>
        <Link href="/imoveis" className={cn(buttonVariants({ variant: "default" }), "mt-6")}>
          Explorar imóveis
        </Link>
      </div>
    </div>
  );
}

function TabelaDeComparacao({ imoveis, onFechar }: { imoveis: Property[]; onFechar: () => void }) {
  return (
    <Card className="mb-6 overflow-hidden">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="font-semibold">Comparação</h2>
        <Button variant="ghost" size="sm" onClick={onFechar}>
          <X className="mr-1 h-4 w-4" /> Fechar
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Característica</TableHead>
              {imoveis.map((p) => (
                <TableHead key={p.id} className="min-w-[180px]">
                  <span className="line-clamp-2 text-xs font-medium">{p.titulo}</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {LINHAS_DA_COMPARACAO.map((linha) => (
              <TableRow key={linha.rotulo}>
                <TableCell className="font-medium">{linha.rotulo}</TableCell>
                {imoveis.map((p) => (
                  <TableCell key={p.id} className={cn(linha.destaque && "font-semibold text-primary")}>
                    {linha.valor(p)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default function FavoritosPage() {
  const { favoriteIds } = useFavorites();
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [comparando, setComparando] = useState(false);

  const consultas = useQueries({
    queries: favoriteIds.map((id) => ({
      queryKey: ["property", id],
      queryFn: () => api.imoveis.buscarPorId(id),
      staleTime: CINCO_MINUTOS,
    })),
  });

  const carregando = consultas.some((q) => q.isLoading);
  const imoveis = consultas.map((q) => q.data).filter((p): p is Property => p != null);
  const imoveisSelecionados = imoveis.filter((p) => selecionados.includes(p.id));

  const alternarSelecao = (id: string) => {
    setSelecionados((atual) => {
      if (atual.includes(id)) return atual.filter((s) => s !== id);
      if (atual.length >= MAXIMO_NA_COMPARACAO) return atual;
      return [...atual, id];
    });
  };

  const limparSelecao = () => {
    setSelecionados([]);
    setComparando(false);
  };

  if (favoriteIds.length === 0) return <SemFavoritos />;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Favoritos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {favoriteIds.length} {pluralizar(favoriteIds.length, "imóvel salvo", "imóveis salvos")}
          </p>
        </div>
        {selecionados.length > 0 && (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setComparando(true)} disabled={selecionados.length < MINIMO_PARA_COMPARAR}>
              <GitCompareArrows className="mr-2 h-4 w-4" />
              Comparar ({selecionados.length})
            </Button>
            <Button variant="ghost" size="sm" onClick={limparSelecao}>
              Limpar seleção
            </Button>
          </div>
        )}
      </div>

      {!comparando && (
        <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
          Selecione até {MAXIMO_NA_COMPARACAO} imóveis para comparar lado a lado.
        </div>
      )}

      {comparando && imoveisSelecionados.length >= MINIMO_PARA_COMPARAR && (
        <TabelaDeComparacao imoveis={imoveisSelecionados} onFechar={() => setComparando(false)} />
      )}

      {carregando ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteIds.map((id) => (
            <Card key={id} className="overflow-hidden">
              <Skeleton className="aspect-[16/10] w-full" />
              <CardContent className="space-y-3 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {imoveis.map((property) => (
            <div key={property.id} className="relative">
              <label className="absolute left-3 top-3 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-black/40 backdrop-blur-sm">
                <Checkbox
                  checked={selecionados.includes(property.id)}
                  onCheckedChange={() => alternarSelecao(property.id)}
                  aria-label={`Selecionar ${property.titulo} para comparação`}
                  className="border-white data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
              </label>
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
