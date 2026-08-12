# Arquitetura — Talento Sem Barreiras

Documento vivo. Alterações estruturais devem gerar um ADR em `DECISIONS.md`.

## 1. O que o sistema é

Uma plataforma web de empregabilidade cuja tese é: **a candidatura é uma etapa da trilha, não o produto**.
O usuário entra, é diagnosticado, recebe um caminho de preparação, se candidata com o gap conhecido, e é
acompanhado por 90 dias depois da contratação. O que o sistema mede no fim não é "vagas publicadas", é
**evolução de renda por pessoa acompanhada**.

Três atores, três superfícies distintas na mesma aplicação: candidato, empresa e administrador.

## 2. Princípios que governam o código

1. **O domínio não sabe que existe React nem Supabase.** `features/matching` e as máquinas de estado são
   TypeScript puro: entrada tipada, saída tipada, sem I/O. É a parte do projeto que sobrevive a uma troca
   de framework, e é o que se defende na banca.
2. **Ports & adapters.** Features falam com interfaces (`OpportunityRepository`), nunca com o cliente de
   banco. Duas implementações intercambiáveis: `in-memory` e `supabase`. Consequência prática: as Fases
   1–7 rodam sem backend, e os testes rodam em milissegundos.
3. **Sem regra de negócio em componente.** Componente → hook → caso de uso → repositório. Um componente
   que calcula score, decide transição de status ou monta payload de banco está errado.
4. **Um conceito, uma definição.** Cada entidade nasce de um schema Zod; o tipo TypeScript é inferido dele
   (`z.infer`). O mesmo schema valida o formulário e a fronteira do adapter.
5. **Erro esperado não é exceção.** Casos de uso retornam `Result<T, E>` (union discriminada). `throw` só
   para bug de programação — e aí é o error boundary que trata.
6. **Acessibilidade é requisito funcional**, não polimento. Uma plataforma de inclusão inacessível se
   autodesmente.

## 3. Camadas

```
┌───────────────────────────────────────────────────────────────┐
│  app/          bootstrap, providers, router, guards de papel  │
├───────────────────────────────────────────────────────────────┤
│  features/*    UI + hooks + casos de uso por domínio          │
│                (matching é a exceção: domínio puro, sem UI)   │
├───────────────────────────────────────────────────────────────┤
│  shared/       ui (design system burro), lib, types           │
├───────────────────────────────────────────────────────────────┤
│  data/ports    contratos de repositório (interfaces)          │
│  data/adapters in-memory | supabase                           │
└───────────────────────────────────────────────────────────────┘
```

Regra de dependência: setas apontam sempre para baixo. `data/adapters` conhece `data/ports`;
`data/ports` não conhece ninguém. `features` conhece `shared` e `data/ports`, nunca `data/adapters`.
A escolha do adapter acontece **uma única vez**, no provider em `app/`.

## 4. Estrutura de pastas

```
src/
  app/
    providers/         QueryProvider, DataSourceProvider, AuthProvider, ThemeProvider
    router/            rotas, RequireRole, RequireAuth
    DesktopOnlyGate    barreira de largura < 1280px
  features/
    auth/              login, cadastro, sessão
    candidate-profile/ perfil, autodeclaração, skills, experiência
    opportunities/     busca, filtros, detalhe, publicação
    matching/          DOMÍNIO PURO — sem React, sem I/O
    applications/      candidaturas + máquina de estados
    readiness-journey/ trilha, etapas, pós-contratação
    company-portal/    onboarding, minhas vagas, candidatos por vaga
    admin-insights/    moderação, indicadores, exportação CSV
  shared/
    ui/                Button, Table, Field, EmptyState, ErrorState, Skeleton...
    lib/               result.ts, format/, a11y/, csv.ts
    types/             tipos transversais (Result, Paginated, Uf)
  data/
    ports/             CandidateRepository, OpportunityRepository, ...
    adapters/
      in-memory/       + seeds/
      supabase/        client, mappers, queries
supabase/
  migrations/          SQL versionado
docs/
```

Anatomia interna de uma feature (o padrão se repete):

```
features/opportunities/
  api/         hooks TanStack Query (useOpportunities, usePublishOpportunity)
  use-cases/   publishOpportunity.ts, searchOpportunities.ts  → retornam Result
  model/       schema Zod + tipos + regras locais
  ui/          componentes e páginas
  index.ts     superfície pública da feature
```

Features não importam arquivos internos umas das outras — apenas o `index.ts`. Compartilhamento real sobe
para `shared/`.

## 5. Fluxo de dados

**Leitura:** componente → hook TanStack Query → caso de uso → port → adapter → dados. O cache de servidor
é do TanStack Query; nada de dado de servidor dentro de Zustand.

**Escrita:** formulário (React Hook Form + resolver Zod) → caso de uso → port → adapter → invalidação de
query. O caso de uso devolve `Result`; a UI decide entre toast de sucesso e mensagem de erro acionável.

**Zustand fica com** o que é puramente de interface: filtros abertos, passo do wizard, preferências de
visualização, estado do drawer. Se o dado vem do backend, não entra ali.

**Autenticação e papel:** o `AuthProvider` expõe `{ user, role, status }`. O router usa `RequireRole` para
proteger a árvore de cada ator. Isso é conveniência de UX; a autorização real vive nas políticas RLS do
Postgres — o cliente nunca é a fonte de verdade de permissão.

## 6. Troca de fonte de dados

`VITE_DATA_SOURCE=in-memory | supabase`, lida uma vez na composição raiz. O critério de sucesso da Fase 8
é brutal e proposital: virar a variável não pode exigir mudança em nenhum componente. Se exigir, a
arquitetura das fases anteriores falhou e o conserto é na fronteira, não na tela.

O adapter in-memory não é brinquedo de teste: ele é a base das Fases 4–7 e da demonstração para a banca
caso o Supabase esteja indisponível no dia. Ele simula latência e falha sob flag, para que estados de
carregamento e de erro sejam construídos com evidência, não no chute.

## 7. Testes

- **Vitest + Testing Library.** Domínio (`matching`, máquinas de estado, cálculo de indicadores) é o alvo
  prioritário: >80% de cobertura, exigência da Fase 3.
- Casos de uso testados contra o adapter in-memory.
- UI: testes de comportamento nas telas de risco (wizard de onboarding, publicação de vaga, transições de
  candidatura). Sem teste de snapshot de layout.
- Acessibilidade: `vitest-axe` nas páginas principais na Fase 9.

## 8. Desktop-only, com honestidade

Abaixo de 1280px a aplicação mostra uma tela única pedindo para abrir no computador. Decidido no briefing,
implementado sem meio-termo (ADR-007 registra a ressalva de público-alvo). Isso **não** relaxa
acessibilidade: foco visível, ordem de tabulação, contraste AA, `label` em todo input, `aria-*` onde o
componente não é nativo, e `prefers-reduced-motion` respeitado em qualquer animação.

## 9. Onde mora cada risco

| Risco                                     | Mitigação                                                                     |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| RLS mal escrita expõe autodeclaração      | Testes de política na Fase 8, com usuário de cada papel                       |
| Matching vira caixa-preta                 | Explicabilidade obrigatória no tipo de retorno — sem explicação não compila   |
| Fase 8 quebrar as telas                   | Ports congelados na Fase 4; adapter novo obedece contrato existente           |
| Seeds pobres deixam telas vazias na banca | Volume e realismo definidos como critério de aceite da Fase 4                 |
| Escopo estourar até novembro              | Fases 5–7 entregam por ator; se faltar tempo, corta-se profundidade, não ator |
