"use client";

import { useTheme } from "next-themes";
import { Info, Monitor, Moon, Server, Sun } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { API_URL } from "@/lib/api-client";
import { version } from "../../../package.json";

const OPCOES_DE_TEMA = [
  { value: "system", label: "Sistema", icon: Monitor },
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
] as const;

function Linha({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{rotulo}</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl space-y-6 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="mt-1 text-muted-foreground">Preferências do aplicativo.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Aparência
          </CardTitle>
          <CardDescription>Escolha o tema de exibição.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Tema">
            {OPCOES_DE_TEMA.map((opcao) => {
              const Icon = opcao.icon;
              const ativo = theme === opcao.value;
              return (
                <Button
                  key={opcao.value}
                  role="radio"
                  aria-checked={ativo}
                  variant={ativo ? "default" : "outline"}
                  className="flex h-auto flex-col gap-1 py-3"
                  onClick={() => setTheme(opcao.value)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{opcao.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            API
          </CardTitle>
          <CardDescription>Servidor que este aplicativo consulta.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs font-medium text-muted-foreground">URL da API</p>
          <p className="mt-1 rounded-md bg-muted px-3 py-2 font-mono text-sm">{API_URL}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Sobre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <Linha rotulo="Aplicativo">Imóvel Tracker</Linha>
            <Separator />
            <Linha rotulo="Versão">
              <span className="font-mono">{version}</span>
            </Linha>
            <Separator />
            <Linha rotulo="Framework">Next.js 16 e React 19</Linha>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
