"use client";

import Link from "next/link";
import { Bath, Bed, Building2, Car, ExternalLink, Heart, Maximize } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "./source-badge";
import { PropertyBadge } from "./property-badge";
import { formatArea, formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";
import type { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

function Caracteristica({ icon: Icon, children }: { icon: typeof Bed; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

export function PropertyCard({ property }: PropertyCardProps) {
  const capa = property.urlImagens[0];
  const { toggleFavorite, isFavorite } = useFavorites();
  const favoritado = isFavorite(property.id);
  const rotaDoImovel = `/imoveis/${property.id}`;

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Link href={rotaDoImovel}>
          {capa ? (
            <img
              src={capa}
              alt={property.titulo}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Building2 className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
        </Link>

        <Button
          variant="ghost"
          size="icon"
          aria-label={favoritado ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-pressed={favoritado}
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white"
          onClick={() => toggleFavorite(property.id)}
        >
          <Heart className={cn("h-4 w-4 transition-colors", favoritado ? "fill-red-500 text-red-500" : "fill-transparent")} />
        </Button>

        {property.statusConstrucao && (
          <div className="absolute left-2 top-2">
            <PropertyBadge status={property.statusConstrucao} />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
          <p className="text-lg font-bold text-white">{formatCurrency(property.preco)}</p>
          {property.valorCondominio != null && (
            <p className="text-xs text-white/80">Condomínio: {formatCurrency(property.valorCondominio)}</p>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <Link href={rotaDoImovel}>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors hover:text-primary">{property.titulo}</h3>
        </Link>

        {property.bairro && (
          <Badge variant="secondary" className="mt-2 text-xs">
            {property.bairro}
          </Badge>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {property.quartos != null && <Caracteristica icon={Bed}>{property.quartos}</Caracteristica>}
          {property.banheiros != null && <Caracteristica icon={Bath}>{property.banheiros}</Caracteristica>}
          {property.vagas != null && <Caracteristica icon={Car}>{property.vagas}</Caracteristica>}
          {property.areaUtil != null && <Caracteristica icon={Maximize}>{formatArea(property.areaUtil)}</Caracteristica>}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t px-4 py-2.5">
        <SourceBadge fonteId={property.fonteId} />
        <a
          href={property.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          Ver anúncio
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardFooter>
    </Card>
  );
}
