"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Building2, CheckCircle2, Clock, Globe, Loader2, Play, RefreshCw, XCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { formatDateTime, formatInteger } from "@/lib/format";
import type { ExecucaoColeta, StatusFonte } from "@/types/scraping";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ErrorBoundary } from "@/components/shared/error-boundary";

type StatusColeta = ExecucaoColeta["status"];

const INTERVALO_DE_ATUALIZACAO_MS = 5000;
const LIMITE_DO_HISTORICO = 20;
const TODAS_AS_FONTES = undefined;

const STATUS_CONFIG: Record<StatusColeta, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  SUCESSO: { label: "Sucesso", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400", icon: CheckCircle2 },
  ERRO: { label: "Erro", color: "bg-red-500/15 text-red-700 dark:text-red-400", icon: XCircle },
  EM_ANDAMENTO: { label: "Em andamento", color: "bg-blue-500/15 text-blue-700 dark:text-blue-400", icon: Loader2 },
  PENDENTE: { label: "Pendente", color: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400", icon: Clock },
  PARCIAL: { label: "Parcial", color: "bg-orange-500/15 text-orange-700 dark:text-orange-400", icon: AlertTriangle },
};

const STATUS_COM_RESULTADO: ReadonlySet<StatusColeta> = new Set(["SUCESSO", "PARCIAL"]);
const STATUS_ATIVOS: ReadonlySet<StatusColeta> = new Set(["EM_ANDAMENTO", "PENDENTE"]);

function algumaEmAndamento(execucoes: ExecucaoColeta[] | undefined): boolean {
  return execucoes?.some((e) => STATUS_ATIVOS.has(e.status)) ?? false;
}

function StatusBadge({ status }: { status: StatusColeta }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
      <Icon className={`h-3 w-3 ${status === "EM_ANDAMENTO" ? "animate-spin" : ""}`} />
      {config.label}
    </span>
  );
}

function FonteCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-1 h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Separator />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  );
}

function HistoryTableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

function ResumoDaExecucao({ execucao }: { execucao: ExecucaoColeta }) {
  return (
    <div className="mt-1 grid grid-cols-2 gap-1 text-xs">
      <span className="text-muted-foreground">
        Encontrados: <span className="font-medium text-foreground">{execucao.totalEncontrados}</span>
      </span>
      <span className="text-muted-foreground">
        Novos: <span className="font-medium text-emerald-600 dark:text-emerald-400">{execucao.totalNovos}</span>
      </span>
      <span className="text-muted-foreground">
        Atualizados: <span className="font-medium text-blue-600 dark:text-blue-400">{execucao.totalAtualizados}</span>
      </span>
      <span className="text-muted-foreground">
        Erros: <span className="font-medium text-red-600 dark:text-red-400">{execucao.totalErros}</span>
      </span>
    </div>
  );
}

function FonteCard({ statusFonte, onExecutar, executando }: { statusFonte: StatusFonte; onExecutar: (fonteNome: string) => void; executando: boolean }) {
  const { fonte, ultimaExecucao, totalImoveis } = statusFonte;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${fonte.ativo ? "bg-emerald-500" : "bg-red-500"}`} title={fonte.ativo ? "Ativa" : "Inativa"} />
          <CardTitle>{fonte.nome}</CardTitle>
        </div>
        <CardAction>
          <Badge variant="secondary" className="text-xs">
            {fonte.tipo}
          </Badge>
        </CardAction>
        <CardDescription className="flex items-center gap-1 truncate">
          <Globe className="h-3 w-3 shrink-0" />
          <span className="truncate">{fonte.urlBase}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            Total de imóveis
          </span>
          <span className="font-semibold">{formatInteger(totalImoveis)}</span>
        </div>

        <Separator />

        {ultimaExecucao ? (
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Última execução</span>
              <StatusBadge status={ultimaExecucao.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Data</span>
              <span>{formatDateTime(ultimaExecucao.iniciadoEm)}</span>
            </div>
            {STATUS_COM_RESULTADO.has(ultimaExecucao.status) && <ResumoDaExecucao execucao={ultimaExecucao} />}
            {ultimaExecucao.mensagemErro && (
              <p className="mt-1 break-words text-xs text-red-600 dark:text-red-400">{ultimaExecucao.mensagemErro}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma execução registrada.</p>
        )}
      </CardContent>

      <CardFooter>
        <Button className="w-full" size="sm" onClick={() => onExecutar(fonte.nome)} disabled={executando || !fonte.ativo}>
          {executando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
          {executando ? "Executando..." : "Executar coleta"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function CartaoDeErro({ mensagem, onTentarDeNovo }: { mensagem: string; onTentarDeNovo: () => void }) {
  return (
    <Card>
      <CardContent className="py-8">
        <div className="flex flex-col items-center text-center">
          <XCircle className="mb-2 h-10 w-10 text-destructive" />
          <p className="text-sm text-muted-foreground">{mensagem}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={onTentarDeNovo}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Tentar novamente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CartaoVazio({ icon: Icon, mensagem }: { icon: typeof Globe; mensagem: string }) {
  return (
    <Card>
      <CardContent className="py-8 text-center">
        <Icon className="mx-auto h-10 w-10 text-muted-foreground/40" />
        <p className="mt-2 text-sm text-muted-foreground">{mensagem}</p>
      </CardContent>
    </Card>
  );
}

export default function ScrapingPage() {
  const queryClient = useQueryClient();

  const execucoesQuery = useQuery({
    queryKey: ["coleta", "execucoes"],
    queryFn: () => api.coleta.execucoes({ limite: LIMITE_DO_HISTORICO }),
    refetchInterval: (query) => (algumaEmAndamento(query.state.data) ? INTERVALO_DE_ATUALIZACAO_MS : false),
  });

  const emAndamento = algumaEmAndamento(execucoesQuery.data);

  const fontesQuery = useQuery({
    queryKey: ["coleta", "fontes"],
    queryFn: () => api.coleta.fontes(),
    refetchInterval: emAndamento ? INTERVALO_DE_ATUALIZACAO_MS : false,
  });

  const executar = useMutation({
    mutationFn: (fonte: string | undefined) => api.coleta.executar(fonte),
    onSuccess: (_resultado, fonte) => {
      toast.success(fonte ? `Coleta iniciada para ${fonte}` : "Coleta iniciada para todas as fontes");
      queryClient.invalidateQueries({ queryKey: ["coleta"] });
    },
    onError: (erro: Error) => {
      toast.error(`Erro ao iniciar coleta: ${erro.message}`);
    },
  });

  const executandoFonte = (nome: string) => executar.isPending && executar.variables === nome;
  const executandoTodas = executar.isPending && executar.variables === TODAS_AS_FONTES;

  const nomePorFonteId = useMemo(
    () => new Map((fontesQuery.data ?? []).map((sf) => [sf.fonte.id, sf.fonte.nome])),
    [fontesQuery.data],
  );

  return (
    <ErrorBoundary>
      <div className="space-y-8 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Coleta</h1>
            <p className="mt-1 text-muted-foreground">Controle as fontes e acompanhe as execuções.</p>
          </div>
          <Button onClick={() => executar.mutate(TODAS_AS_FONTES)} disabled={executar.isPending} size="lg">
            {executandoTodas ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            Executar todas
          </Button>
        </div>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Fontes de dados</h2>
          {fontesQuery.error ? (
            <CartaoDeErro
              mensagem={`Erro ao carregar fontes: ${fontesQuery.error.message}`}
              onTentarDeNovo={() => queryClient.invalidateQueries({ queryKey: ["coleta", "fontes"] })}
            />
          ) : fontesQuery.isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 5 }, (_, i) => (
                <FonteCardSkeleton key={i} />
              ))}
            </div>
          ) : fontesQuery.data && fontesQuery.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {fontesQuery.data.map((sf) => (
                <FonteCard key={sf.fonte.id} statusFonte={sf} onExecutar={(nome) => executar.mutate(nome)} executando={executandoFonte(sf.fonte.nome)} />
              ))}
            </div>
          ) : (
            <CartaoVazio icon={Globe} mensagem="Nenhuma fonte de dados cadastrada." />
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Histórico de execuções</h2>
            {emAndamento && (
              <span className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                Atualizando automaticamente
              </span>
            )}
          </div>

          {execucoesQuery.error ? (
            <CartaoDeErro
              mensagem={`Erro ao carregar histórico: ${execucoesQuery.error.message}`}
              onTentarDeNovo={() => queryClient.invalidateQueries({ queryKey: ["coleta", "execucoes"] })}
            />
          ) : execucoesQuery.isLoading ? (
            <Card>
              <CardContent className="py-4">
                <HistoryTableSkeleton />
              </CardContent>
            </Card>
          ) : execucoesQuery.data && execucoesQuery.data.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fonte</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Início</TableHead>
                      <TableHead>Fim</TableHead>
                      <TableHead className="text-right">Encontrados</TableHead>
                      <TableHead className="text-right">Novos</TableHead>
                      <TableHead className="text-right">Atualizados</TableHead>
                      <TableHead className="text-right">Erros</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {execucoesQuery.data.map((exec) => (
                      <TableRow key={exec.id}>
                        <TableCell className="font-medium">{nomePorFonteId.get(exec.fonteId) ?? exec.fonteId}</TableCell>
                        <TableCell>
                          <StatusBadge status={exec.status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDateTime(exec.iniciadoEm)}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDateTime(exec.finalizadoEm)}</TableCell>
                        <TableCell className="text-right">{exec.totalEncontrados}</TableCell>
                        <TableCell className="text-right text-emerald-600 dark:text-emerald-400">{exec.totalNovos}</TableCell>
                        <TableCell className="text-right text-blue-600 dark:text-blue-400">{exec.totalAtualizados}</TableCell>
                        <TableCell className="text-right text-red-600 dark:text-red-400">{exec.totalErros}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <CartaoVazio icon={Clock} mensagem="Nenhuma execução registrada ainda." />
          )}
        </section>
      </div>
    </ErrorBoundary>
  );
}
