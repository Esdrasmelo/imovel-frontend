"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FONTES, STATUS_CONSTRUCAO_OPTIONS, TIPOS_IMOVEL, type Opcao } from "@/lib/constants";
import type { SearchFilters as SearchFiltersType } from "@/types/filters";

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onApply: (filters: SearchFiltersType) => void;
  onClose?: () => void;
}

function alternar<T extends string>(lista: T[] | undefined, valor: T): T[] {
  const atual = lista ?? [];
  return atual.includes(valor) ? atual.filter((v) => v !== valor) : [...atual, valor];
}

function numeroOuIndefinido(texto: string): number | undefined {
  return texto === "" ? undefined : Number(texto);
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">{titulo}</h4>
      {children}
    </div>
  );
}

function ListaDeOpcoes<T extends string>({ opcoes, selecionadas, onAlternar }: { opcoes: readonly Opcao<T>[]; selecionadas: T[] | undefined; onAlternar: (valor: T) => void }) {
  return (
    <div className="space-y-2">
      {opcoes.map((opcao) => (
        <label key={opcao.value} className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox checked={selecionadas?.includes(opcao.value) ?? false} onCheckedChange={() => onAlternar(opcao.value)} />
          {opcao.label}
        </label>
      ))}
    </div>
  );
}

export function SearchFilters({ filters, onApply, onClose }: SearchFiltersProps) {
  const [local, setLocal] = useState<SearchFiltersType>(filters);
  const [ultimosAplicados, setUltimosAplicados] = useState(filters);

  if (filters !== ultimosAplicados) {
    setUltimosAplicados(filters);
    setLocal(filters);
  }

  const atualizar = (parcial: Partial<SearchFiltersType>) => setLocal((atual) => ({ ...atual, ...parcial }));

  const aplicar = () => {
    onApply(local);
    onClose?.();
  };

  const limpar = () => {
    const limpos: SearchFiltersType = { tamanhoPagina: local.tamanhoPagina };
    setLocal(limpos);
    onApply(limpos);
    onClose?.();
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4">
        <Secao titulo="Busca">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Título, bairro, empreendimento"
              value={local.q ?? ""}
              onChange={(e) => atualizar({ q: e.target.value || undefined })}
              onKeyDown={(e) => e.key === "Enter" && aplicar()}
              className="h-9 pl-8"
            />
          </div>
        </Secao>

        <Separator />

        <Secao titulo="Faixa de preço">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Mín"
              value={local.precoMin ?? ""}
              onChange={(e) => atualizar({ precoMin: numeroOuIndefinido(e.target.value) })}
              className="h-9"
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Máx"
              value={local.precoMax ?? ""}
              onChange={(e) => atualizar({ precoMax: numeroOuIndefinido(e.target.value) })}
              className="h-9"
            />
          </div>
        </Secao>

        <Separator />

        <Secao titulo="Tipo de imóvel">
          <ListaDeOpcoes opcoes={TIPOS_IMOVEL} selecionadas={local.tipoImovel} onAlternar={(v) => atualizar({ tipoImovel: alternar(local.tipoImovel, v) })} />
        </Secao>

        <Separator />

        <Secao titulo="Status da obra">
          <ListaDeOpcoes
            opcoes={STATUS_CONSTRUCAO_OPTIONS}
            selecionadas={local.statusConstrucao}
            onAlternar={(v) => atualizar({ statusConstrucao: alternar(local.statusConstrucao, v) })}
          />
        </Secao>

        <Separator />

        <Secao titulo="Quartos (mín.)">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Ex: 2"
            value={local.quartosMin ?? ""}
            onChange={(e) => atualizar({ quartosMin: numeroOuIndefinido(e.target.value) })}
            className="h-9"
          />
        </Secao>

        <Separator />

        <Secao titulo="Área mín. (m²)">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Ex: 50"
            value={local.areaMin ?? ""}
            onChange={(e) => atualizar({ areaMin: numeroOuIndefinido(e.target.value) })}
            className="h-9"
          />
        </Secao>

        <Separator />

        <Secao titulo="Fonte">
          <ListaDeOpcoes opcoes={FONTES} selecionadas={local.fonte} onAlternar={(v) => atualizar({ fonte: alternar(local.fonte, v) })} />
        </Secao>

        <Separator />

        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-sm font-semibold">Aceita financiamento</span>
          <Switch checked={local.aceitaFinanciamento ?? false} onCheckedChange={(marcado) => atualizar({ aceitaFinanciamento: marcado || undefined })} />
        </label>

        <Separator />

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={limpar}>
            Limpar
          </Button>
          <Button className="flex-1" onClick={aplicar}>
            Aplicar
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
