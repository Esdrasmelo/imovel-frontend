"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bath,
  Bed,
  Building2,
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  ExternalLink,
  Heart,
  MapPin,
  Maximize,
  Ruler,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SourceBadge } from "@/components/property/source-badge";
import { PropertyBadge } from "@/components/property/property-badge";
import { useProperty } from "@/hooks/use-properties";
import { useFavorites } from "@/hooks/use-favorites";
import { formatArea, formatCurrency, formatDate } from "@/lib/format";
import { rotuloDe, TIPOS_IMOVEL } from "@/lib/constants";

function PropertyDetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-6 w-48" />
      </div>
      <Skeleton className="aspect-[16/9] w-full rounded-xl" />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl bg-muted">
        <Building2 className="h-20 w-20 text-muted-foreground/30" />
      </div>
    );
  }

  const anterior = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const proxima = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  const temVarias = images.length > 1;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted">
        <img src={images[activeIndex]} alt={`${title} - Foto ${activeIndex + 1}`} className="h-full w-full object-cover" />
        {temVarias && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 hover:text-white"
              onClick={anterior}
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 hover:text-white"
              onClick={proxima}
              aria-label="Próxima foto"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {temVarias && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-all",
                i === activeIndex ? "ring-2 ring-primary ring-offset-2" : "opacity-60 hover:opacity-100",
              )}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FeatureItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

function LinhaDeInformacao({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{rotulo}</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toggleFavorite, isFavorite } = useFavorites();
  const favoritado = isFavorite(id);

  const { data: property, isLoading, isError, error } = useProperty(id);

  if (isLoading) return <PropertyDetailSkeleton />;

  if (isError) {
    return (
      <div className="mx-auto max-w-5xl p-4 md:p-6">
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive">Erro ao carregar imóvel: {error.message}</p>
          <Link href="/imoveis" className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>
            Voltar para listagem
          </Link>
        </div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/imoveis" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant={favoritado ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFavorite(id)}
            className={favoritado ? "bg-red-500 text-white hover:bg-red-600" : ""}
          >
            <Heart className={cn("mr-2 h-4 w-4", favoritado && "fill-current")} />
            {favoritado ? "Favoritado" : "Favoritar"}
          </Button>
          <a href={property.url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver anúncio original
          </a>
        </div>
      </div>

      <ImageGallery images={property.urlImagens} title={property.titulo} />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="secondary">{rotuloDe(TIPOS_IMOVEL, property.tipoImovel)}</Badge>
              <Badge variant="secondary">{property.tipoNegocio === "VENDA" ? "Venda" : "Aluguel"}</Badge>
              <PropertyBadge status={property.statusConstrucao} />
              {property.aceitaFinanciamento && (
                <Badge className="border-0 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Aceita financiamento
                </Badge>
              )}
              <SourceBadge fonteId={property.fonteId} />
            </div>
            <h1 className="text-2xl font-bold leading-tight md:text-3xl">{property.titulo}</h1>
            {property.bairro && (
              <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {property.bairro}, {property.cidade} - {property.estado}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {property.quartos != null && <FeatureItem icon={Bed} label="Quartos" value={property.quartos} />}
            {property.suites != null && <FeatureItem icon={Bed} label="Suítes" value={property.suites} />}
            {property.banheiros != null && <FeatureItem icon={Bath} label="Banheiros" value={property.banheiros} />}
            {property.vagas != null && <FeatureItem icon={Car} label="Vagas" value={property.vagas} />}
            {property.areaUtil != null && <FeatureItem icon={Maximize} label="Área útil" value={formatArea(property.areaUtil)} />}
            {property.areaTotal != null && <FeatureItem icon={Ruler} label="Área total" value={formatArea(property.areaTotal)} />}
          </div>

          {property.descricao && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{property.descricao}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Preço
              </div>
              <p className="text-3xl font-bold text-primary">{formatCurrency(property.preco)}</p>
              <div className="space-y-2 text-sm">
                {property.valorCondominio != null && (
                  <LinhaDeInformacao rotulo="Condomínio">{formatCurrency(property.valorCondominio)}</LinhaDeInformacao>
                )}
                {property.precoPorM2 != null && (
                  <LinhaDeInformacao rotulo="Preço/m²">{formatCurrency(property.precoPorM2)}</LinhaDeInformacao>
                )}
              </div>
            </CardContent>
          </Card>

          {(property.construtora || property.nomeEmpreendimento) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Empreendimento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {property.nomeEmpreendimento && <LinhaDeInformacao rotulo="Nome">{property.nomeEmpreendimento}</LinhaDeInformacao>}
                {property.construtora && <LinhaDeInformacao rotulo="Construtora">{property.construtora}</LinhaDeInformacao>}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {property.codigoImovel && (
                <LinhaDeInformacao rotulo="Código">
                  <span className="font-mono text-xs">{property.codigoImovel}</span>
                </LinhaDeInformacao>
              )}
              <Separator />
              <LinhaDeInformacao rotulo="Cadastrado em">{formatDate(property.criadoEm)}</LinhaDeInformacao>
              <LinhaDeInformacao rotulo="Atualizado em">{formatDate(property.atualizadoEm)}</LinhaDeInformacao>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
