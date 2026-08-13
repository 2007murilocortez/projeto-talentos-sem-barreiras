# Roadmap

Uma fase por vez. Cada fase termina com build e lint limpos, checkboxes atualizados aqui e aprovação
explícita antes da próxima.

**Legenda:** `[ ]` pendente · `[x]` concluído · `[~]` parcial (com pendência anotada)

---

## Fase -1 — Repositório, CI e deploy `[~]`

- [x] Scaffold Vite + React 19 + TypeScript `strict`, com alias `@/*`
- [x] Tailwind CSS v4 e shadcn/ui inicializado (sem componentes ainda)
- [x] ESLint + Prettier integrados, sem conflito
- [x] Vitest configurado, com um teste passando
- [x] Estrutura de pastas criada com `.gitkeep`
- [x] Página placeholder em `/`
- [x] Node fixado em 24 (`.nvmrc` + `engines`), alinhado à Vercel
- [x] `vercel.json` com rewrite de SPA, região `gru1` e headers de segurança
- [x] `.env.example` documentado
- [x] `docs/DEPLOY.md` com o passo a passo manual
- [x] CI no GitHub Actions
- [x] `CONTRIBUTING.md` e template de pull request
- [x] `README.md`
- [x] Commits semânticos no repositório local
- [x] Push para o GitHub, com CI verde na primeira execução
- [x] Deploy na Vercel: <https://projeto-talentos-sem-barreiras.vercel.app>
- [ ] Branch protection em `main`

---

## Fase 0 — Arquitetura e roadmap `[x]`

- [x] `docs/ARCHITECTURE.md` — camadas, ports & adapters, fluxo de dados, estrutura de pastas
- [x] `docs/DATA-MODEL.md` — entidades, diagrama ER, máquinas de estado, matriz de RLS
- [x] `docs/MATCHING.md` — especificação do algoritmo, pesos, explicabilidade, casos de teste
- [x] `docs/DECISIONS.md` — ADR-001 a ADR-010
- [x] `docs/ROADMAP.md`
- [x] Pontos de discordância com o briefing levantados
- [ ] **Aprovação do cliente**

_Aceite: dá para entender o sistema inteiro lendo os documentos, sem ler código._

---

## Fase 1 — Fundação `[x]`

- [x] Vite + React 19 + TypeScript `strict` (sem `any`)
- [x] ESLint + Prettier, com regra que barra import de `data/adapters` dentro de `features`
- [x] Tailwind configurado, estrutura de pastas criada
- [x] React Router com `RequireRole` (papel simulado nesta fase)
- [x] Providers: Query, DataSource, Auth
- [x] `DesktopOnlyGate` (< 1280px)
- [x] `Result<T, E>` em `shared/lib`
- [x] Leitura tipada das variáveis de ambiente concentrada em um módulo
- [x] Ports declaradas + adapter in-memory esqueleto, escolhido por `VITE_DATA_SOURCE`
- [x] Vitest com 11 testes passando
- [x] `.env.example`, README, git com commits semânticos

Assumido de propósito: o provider de tema entra na Fase 2, junto com os tokens do design system.
A tela de acesso é provisória — escolhe o papel sem senha e é substituída na Fase 8.

_Aceite: `npm run build`, `npm run lint` e `npm run test` passam limpos._

---

## Fase 2 — Design system `[ ]`

- [ ] **Plano de design entregue e aprovado antes de codar**: paleta de 5–6 cores com justificativa,
      2–3 famílias tipográficas com escala, conceito de layout em prosa, wireframes em ASCII das três
      telas principais, e o elemento-assinatura definido
- [ ] Tokens implementados (cor, tipografia, espaçamento, raio, sombra, foco)
- [ ] shadcn/ui instalado e **descaracterizado** do padrão de fábrica
- [ ] Componentes base: Button, Input, Select, Checkbox, Radio, Field, Table densa, Badge, Tabs, Dialog,
      Toast, Progress, EmptyState, ErrorState, Skeleton
- [ ] Anel de foco visível em todos os interativos; contraste AA verificado
- [ ] `prefers-reduced-motion` respeitado
- [ ] Página `/styleguide` com tudo, incluindo estados vazio/carregando/erro

_Aceite: o styleguide não parece template de admin._

---

## Fase 3 — Domínio e matching `[ ]`

- [ ] Schemas Zod de todas as entidades, tipos inferidos
- [ ] Máquina de estados de `Application` + testes de transições válidas e inválidas
- [ ] Máquina de estados de `ReadinessJourney` + testes
- [ ] `DEFAULT_WEIGHTS` tipado, com validação de soma
- [ ] Cálculo das seis dimensões
- [ ] Geração de explicação em pt-BR
- [ ] Gaps acionáveis com sugestão de curso
- [ ] Prioridade de vaga afirmativa, declarada na explicação
- [ ] 18 casos de teste do `MATCHING.md` verdes

_Aceite: `npm run test` verde e cobertura de `features/matching` acima de 80%. Nenhuma UI nesta fase._

---

## Fase 4 — Dados fake e casos de uso `[ ]`

- [ ] Adapter in-memory completo, implementando todas as ports
- [ ] Seeds pt-BR: ≥40 candidatos, ≥15 empresas, ≥60 oportunidades, ~80 skills, candidaturas em todos os
      estados, contratações com checkpoints de 30/60/90 dias
- [ ] Casos de uso de candidato, empresa e admin sobre as ports
- [ ] Simulação de latência e de falha sob flag
- [ ] Testes de contrato reutilizáveis pelos dois adapters

_Aceite: dá para rodar o matching sobre os seeds via teste e obter resultados plausíveis._

---

## Fase 5 — Fluxo do candidato `[ ]`

- [ ] Onboarding em etapas, com autodeclaração opcional e consentimento explícito
- [ ] Perfil (edição), experiências, formação, upload de currículo (só armazenar)
- [ ] Diagnóstico de habilidades
- [ ] Painel "minha trilha"
- [ ] Busca de oportunidades com filtros
- [ ] Detalhe da oportunidade com explicação do match e gaps
- [ ] Minhas candidaturas (kanban ou timeline)
- [ ] Acompanhamento pós-contratação
- [ ] Estados vazio, carregando e erro em cada tela

_Aceite: navego do onboarding à candidatura sem um único erro no console._

---

## Fase 6 — Portal da empresa `[ ]`

- [ ] Cadastro e onboarding, com status de aprovação
- [ ] Publicar oportunidade (wizard multi-etapas, com `kind` condicional)
- [ ] Minhas oportunidades, com ações de editar/encerrar
- [ ] Candidatos por vaga, ordenados por compatibilidade e com explicação
- [ ] Transições de status da candidatura pela empresa
- [ ] Perfil da empresa e compromissos de diversidade

---

## Fase 7 — Painel administrativo `[ ]`

- [ ] Aprovação de empresas
- [ ] Moderação de vagas
- [ ] Curadoria do catálogo de skills
- [ ] Indicadores de impacto com Recharts e filtro por período
- [ ] Evolução de renda e funil de conversão da trilha
- [ ] Recortes por grupo autodeclarado, sempre agregados
- [ ] Exportação em CSV

---

## Fase 8 — Supabase `[ ]`

- [ ] Migrations versionadas em `supabase/migrations/`
- [ ] RLS habilitada em todas as tabelas, com as políticas da matriz do `DATA-MODEL.md`
- [ ] Testes de política por papel (candidato, empresa, admin)
- [ ] Auth integrada ao `AuthProvider`
- [ ] Storage para currículo
- [ ] Adapter supabase implementando as mesmas ports
- [ ] Script de seed para o banco real

_Aceite: a aplicação inteira funciona com `VITE_DATA_SOURCE=supabase` sem mudar nenhum componente._

---

## Fase 9 — Acabamento `[ ]`

- [ ] Auditoria de acessibilidade (teclado, leitor de tela, contraste, `vitest-axe`)
- [ ] Revisão de todos os estados vazios e de erro
- [ ] Revisão de microcopy
- [ ] README com instruções de execução
- [ ] Roteiro de demonstração para a banca, com tempo por tela e usuários de teste prontos
