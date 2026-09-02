# imovel-frontend

Interface do [imovel-backend](../imovel-backend): dashboard com estatísticas, busca com filtros e
ordenação, detalhe do imóvel com galeria, favoritos com comparação lado a lado e painel de coleta
para disparar e acompanhar os scrapers.

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind 4, componentes shadcn sobre Base UI,
TanStack Query para dados do servidor, Zustand para favoritos, Recharts nos gráficos.

## Como rodar

```bash
npm install
cp .env.example .env.local
npm run dev
```

`NEXT_PUBLIC_API_URL` aponta para o backend (padrão `http://localhost:3333`). Sem o backend no ar
as telas carregam e mostram o estado de erro de cada consulta.

```bash
npm run lint
npm run typecheck
npm run build
```

## Estrutura

```
src/
  app/                  rotas: dashboard, imóveis, imóvel/[id], favoritos, coleta, configurações
  components/
    property/           cartão, selo de status da obra, selo da fonte
    search/             filtros, barra de filtros ativos, ordenação
    shared/             paginação, estados vazio/carregando/erro
    layout/             barra lateral e alternância de tema
    ui/                 componentes gerados pelo shadcn
  hooks/                useProperties, useStatistics, useNeighborhoods, useFavorites, useIsMobile
  lib/                  cliente da API, formatação, constantes
  stores/               favoritos persistidos em localStorage
  types/                contratos da API espelhados do backend
```

## Decisões

**O cliente da API é a única fronteira tipada com o servidor.** `lib/api-client.ts` conhece as
rotas e devolve os tipos de `types/`; nenhuma página monta URL nem faz `fetch`. Os filtros viram
query string por uma função só (`toQueryString`), que descarta `undefined` e junta listas com
vírgula — o formato que o backend espera. Antes havia uma cadeia de quinze `if`s fazendo isso à mão.

**Estado do servidor no TanStack Query, estado do usuário no Zustand.** Imóveis, estatísticas e
coletas são cache de servidor: têm `staleTime`, invalidação e `keepPreviousData` na paginação, para a
lista não piscar ao trocar de página. Favoritos são preferência local, persistida em `localStorage`.
Nenhum dado do servidor é copiado para store.

**Filtros com estado local e aplicação explícita.** O painel de filtros edita uma cópia e só envia
ao clicar em Aplicar, então digitar um preço não dispara uma requisição por tecla. Quando os filtros
externos mudam (remover um selo na barra, por exemplo), a cópia é ressincronizada durante o render,
sem `useEffect` — o padrão que a documentação do React recomenda para estado derivado de props.

**Polling só enquanto há coleta em andamento.** O histórico de execuções usa `refetchInterval` como
função sobre os próprios dados: se alguma execução está pendente ou em andamento, atualiza a cada
cinco segundos; senão, para. A versão anterior duplicava as consultas em chaves paralelas só para
ligar o polling, o que dobrava as requisições e mantinha dois caches para o mesmo dado.

**Estado da mutação vem da mutação.** O botão de cada fonte sabe se está executando comparando
`mutation.variables` com o nome da fonte; não há `Set` paralelo de "fontes em execução" para
manter sincronizado à mão.

**`<img>` em vez de `next/image`.** As fotos vêm de dezenas de domínios de terceiros que mudam
conforme a fonte. Configurar `remotePatterns` para todos seria manutenção sem fim, e o proxy de
otimização do Next para imagens que não controlamos traz pouco ganho. A regra de lint foi desligada
na configuração, não com comentário no código.

**Sem comentários no código.** O que precisaria de comentário virou nome: `paginasVisiveis`,
`algumaEmAndamento`, `MAXIMO_NA_COMPARACAO`, `PRECO_SOB_CONSULTA`. O raciocínio está nesta seção.

## O que mudou na revisão

- O dashboard lia `totalBairros` e `topBairros`, campos que a API nunca teve — o indicador de bairros
  mostrava sempre zero e a seção nunca aparecia. Passou a contar os bairros pela rota própria e a
  exibir as quebras por tipo e por status da obra, que a API devolve e ninguém usava. A mediana de
  preço, agora calculada no backend, aparece ao lado da média.
- A caixa de seleção nos favoritos disparava a alternância duas vezes (no contêiner e no próprio
  controle), anulando o clique. Ficou um controle só, dentro de um `label`.
- `useIsMobile` fazia `setState` dentro de `useEffect`; virou `useSyncExternalStore` sobre
  `matchMedia`, que é o que esse hook é.
- A fonte BRZ saiu das constantes junto com a remoção no backend; `nuqs` e `date-fns` saíram das
  dependências porque nada as importava; `shadcn` foi para `devDependencies`, porque é CLI.
