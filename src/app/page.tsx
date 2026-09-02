"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Building2, DollarSign, MapPin, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCard } from "@/components/property/property-card";
import { LoadingCards } from "@/components/shared/loading-cards";
import { useStatistics } from "@/hooks/use-statistics";
import { useNeighborhoods } from "@/hooks/use-neighborhoods";
import { useRecentProperties } from "@/hooks/use-properties";
import { rotuloDe, STATUS_CONSTRUCAO_OPTIONS, TIPOS_IMOVEL } from "@/lib/constants";
import { formatCurrency, formatInteger, SEM_VALOR } from "@/lib/format";

const QUANTIDADE_DE_RECENTES = 6;

const CHART_COLORS = [
  "oklch(0.55 0.2 260)",
  "oklch(0.65 0.18 165)",
  "oklch(0.60 0.16 45)",
  "oklch(0.55 0.22 310)",
  "oklch(0.65 0.15 130)",
  "oklch(0.70 0.14 200)",
];

const ESTILO_DO_TOOLTIP = {
  borderRadius: "8px",
  border: "1px solid oklch(0.9 0.01 260)",
  boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
};

function KpiSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-8 w-32" />
        <Skeleton className="mt-2 h-3 w-20" />
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
}

function KpiCard({ title, value, subtitle, icon: Icon }: KpiCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

function SemDados() {
  return (
    <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
      Sem dados disponíveis
    </div>
  );
}

function ChartCard({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ListaDeContagens({ title, itens }: { title: string; itens: Array<{ rotulo: string; quantidade: number }> }) {
  if (itens.length === 0) return null;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2">
        {itens.map((item) => (
          <div key={item.rotulo} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2.5">
            <span className="text-sm font-medium">{item.rotulo}</span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {formatInteger(item.quantidade)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useStatistics();
  const { data: bairros } = useNeighborhoods();
  const { data: recentes, isLoading: recentesLoading } = useRecentProperties(QUANTIDADE_DE_RECENTES);

  const distribuicaoPreco = stats?.distribuicaoPreco ?? [];
  const porFonte = stats?.porFonte ?? [];
  const porTipo = (stats?.porTipo ?? []).map((t) => ({ rotulo: rotuloDe(TIPOS_IMOVEL, t.tipo), quantidade: t.quantidade }));
  const porStatus = (stats?.porStatus ?? []).map((s) => ({
    rotulo: rotuloDe(STATUS_CONSTRUCAO_OPTIONS, s.status),
    quantidade: s.quantidade,
  }));
  const imoveisRecentes = recentes?.data ?? [];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Visão geral dos imóveis coletados</p>
      </div>

      {statsLoading || !stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Total de imóveis" value={formatInteger(stats.totalImoveis)} subtitle="Ativos na base" icon={Building2} />
          <KpiCard
            title="Preço médio"
            value={formatCurrency(stats.precoMedio, SEM_VALOR)}
            subtitle={`Mediana ${formatCurrency(stats.precoMediano, SEM_VALOR)}`}
            icon={DollarSign}
          />
          <KpiCard
            title="Bairros"
            value={bairros ? formatInteger(bairros.length) : SEM_VALOR}
            subtitle="Com imóveis ativos"
            icon={MapPin}
          />
          <KpiCard title="Fontes" value={formatInteger(porFonte.length)} subtitle="Portais com imóveis" icon={TrendingUp} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {statsLoading ? (
          <ChartSkeleton />
        ) : (
          <ChartCard title="Distribuição de preços" icon={BarChart3}>
            {distribuicaoPreco.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distribuicaoPreco}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.8 0.01 260)" vertical={false} />
                  <XAxis dataKey="faixa" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={ESTILO_DO_TOOLTIP} formatter={(value) => [value as number, "Imóveis"]} />
                  <Bar dataKey="quantidade" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <SemDados />
            )}
          </ChartCard>
        )}

        {statsLoading ? (
          <ChartSkeleton />
        ) : (
          <ChartCard title="Imóveis por fonte" icon={TrendingUp}>
            {porFonte.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={porFonte}
                    dataKey="quantidade"
                    nameKey="fonte"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    strokeWidth={2}
                    stroke="oklch(1 0 0)"
                    label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {porFonte.map((fonte, i) => (
                      <Cell key={fonte.fonte} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={ESTILO_DO_TOOLTIP} formatter={(value) => [value as number, "Imóveis"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <SemDados />
            )}
          </ChartCard>
        )}
      </div>

      {!statsLoading && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ListaDeContagens title="Por tipo de imóvel" itens={porTipo} />
          <ListaDeContagens title="Por status da obra" itens={porStatus} />
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Imóveis recentes</h2>
          <Link href="/imoveis" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Ver todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {recentesLoading ? (
          <LoadingCards count={QUANTIDADE_DE_RECENTES} />
        ) : imoveisRecentes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {imoveisRecentes.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-sm text-muted-foreground">Nenhum imóvel coletado ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
