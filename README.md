# Talento Sem Barreiras

Plataforma gratuita de empregabilidade para pessoas de grupos minoritários e em situação de
vulnerabilidade.

[![CI](https://github.com/2007murilocortez/projeto-talentos-sem-barreiras/actions/workflows/ci.yml/badge.svg)](https://github.com/2007murilocortez/projeto-talentos-sem-barreiras/actions/workflows/ci.yml)

**Aplicação em produção:** <!-- deploy --> <https://projeto-talentos-sem-barreiras.vercel.app>

---

## O problema

Existe muita vaga aberta e muita gente qualificada sem emprego ao mesmo tempo. Para quem pertence a um
grupo minorizado, a distância entre os dois lados não se explica só por falta de qualificação: é falta de
informação sobre o que o mercado pede, ausência de rede de contatos, processo seletivo desenhado para um
perfil único e, muitas vezes, uma candidatura recusada sem que a pessoa jamais descubra o motivo. Sites de
vaga convencionais não resolvem nada disso — eles listam oportunidades e deixam a pessoa sozinha diante
delas.

O Talento Sem Barreiras parte de uma tese diferente: **a candidatura é uma etapa da trilha, não o
produto**. A pessoa se cadastra, faz um diagnóstico de habilidades, recebe uma trilha de preparação com
cursos que preenchem exatamente os pontos que faltam, se candidata sabendo onde está o gap, e continua
acompanhada por 90 dias depois da contratação. O público-alvo é formado por pessoas negras, LGBTQIA+,
pessoas com deficiência, mulheres em situação de vulnerabilidade, jovens de baixa renda, imigrantes e
refugiados. A identificação com esses grupos é opcional, autodeclarada e privada: serve para filtro de
vaga afirmativa e para relatório agregado de impacto, e nunca é exposta a outras pessoas usuárias nem às
empresas.

## Stack e por que cada peça

| Peça                         | Por quê                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| React 19 + TypeScript + Vite | Ecossistema conhecido pelo time, build rápido, tipagem forte em modo `strict`                                             |
| Tailwind CSS + shadcn/ui     | Velocidade de UI sem abrir mão de controle; os componentes são código nosso, não dependência fechada                      |
| React Router                 | Rotas protegidas por papel (candidato, empresa, administrador)                                                            |
| TanStack Query               | Cache e estado de servidor resolvidos, sem duplicar dado em store global                                                  |
| Zustand                      | Apenas estado efêmero de interface                                                                                        |
| Zod + React Hook Form        | Um único schema valida o formulário e a fronteira de dados                                                                |
| Supabase                     | Postgres com RLS, autenticação e storage sem manter servidor próprio; a privacidade do dado sensível é imposta pelo banco |
| Vitest                       | Testes rápidos, com foco no domínio de compatibilidade                                                                    |
| Recharts                     | Gráficos do painel de indicadores de impacto                                                                              |
| date-fns                     | Datas em pt-BR                                                                                                            |

## Como rodar localmente

Pré-requisitos: **Node 24** (há um `.nvmrc` no repositório) e npm 11.

```bash
git clone https://github.com/2007murilocortez/projeto-talentos-sem-barreiras.git
cd projeto-talentos-sem-barreiras
npm ci
cp .env.example .env.local
npm run dev
```

A aplicação sobe em <http://localhost:5173>. Com `VITE_DATA_SOURCE=in-memory` (o padrão) ela roda com
dados fictícios, **sem precisar de Supabase nem de nenhuma credencial**.

### Scripts

| Comando                           | O que faz                                           |
| --------------------------------- | --------------------------------------------------- |
| `npm run dev`                     | Servidor de desenvolvimento                         |
| `npm run build`                   | Verificação de tipos e build de produção em `dist/` |
| `npm run preview`                 | Serve o build de produção localmente                |
| `npm run lint` / `lint:fix`       | ESLint                                              |
| `npm run format` / `format:check` | Prettier                                            |
| `npm run typecheck`               | Só a verificação de tipos                           |
| `npm run test` / `test:coverage`  | Vitest                                              |

### Variáveis de ambiente

Todas estão documentadas em `.env.example`. Só variáveis com prefixo `VITE_` chegam ao navegador — e,
por isso, só entram ali valores que podem ser públicos. A service role key do Supabase nunca vai para o
front-end.

## Estrutura de pastas

```
src/
  app/                bootstrap, providers, rotas e guardas de papel
  features/           uma pasta por domínio do produto (UI + hooks + casos de uso)
    matching/         algoritmo de compatibilidade — TypeScript puro, sem React e sem I/O
  shared/ui/          design system, componentes sem regra de negócio
  shared/lib/         utilitários, formatação, tipo Result
  shared/types/       tipos transversais
  data/ports/         contratos dos repositórios
  data/adapters/      implementações: in-memory (dados fake) e supabase (real)
supabase/migrations/  SQL versionado, com RLS
docs/                 arquitetura, modelo de dados, decisões, roadmap e deploy
```

A documentação de projeto vive em [`docs/`](./docs): [arquitetura](./docs/ARCHITECTURE.md),
[modelo de dados](./docs/DATA-MODEL.md), [algoritmo de compatibilidade](./docs/MATCHING.md),
[decisões](./docs/DECISIONS.md), [roadmap](./docs/ROADMAP.md) e [deploy](./docs/DEPLOY.md).

## Aviso de escopo: desktop apenas

**Esta aplicação foi desenhada para desktop, com largura mínima de 1280px. Não há suporte mobile.**
É uma decisão de escopo, não um esquecimento: o tempo disponível foi investido em profundidade de produto
— trilha de preparação, algoritmo explicável e painel de impacto — em vez de em responsividade. Em telas
menores, a aplicação exibe um aviso pedindo para abrir no computador. O raciocínio completo, incluindo a
ressalva de que parte do público-alvo acessa a internet principalmente por celular, está registrado em
[`docs/DECISIONS.md`](./docs/DECISIONS.md), ADR-007.

## Contexto acadêmico

Projeto da disciplina de **Extensão I**, desenvolvido por um grupo de cinco estudantes de três áreas:

- **Análise e Desenvolvimento de Sistemas** (3) — arquitetura, desenvolvimento e testes.
- **Ciências Contábeis** (1) — definição dos indicadores de impacto social, métricas de evolução de renda
  e leitura dos dados do painel administrativo.
- **Gestão Comercial** (1) — pesquisa com empresas, proposta de valor e estratégia de captação de
  parceiros e de vagas afirmativas.

O produto não é hipotético: o objetivo é ter uma plataforma funcional, com dados persistidos e navegável
ponta a ponta nos três perfis, apresentável para banca.

## Como contribuir

Veja [`CONTRIBUTING.md`](./CONTRIBUTING.md). Resumo: branch por tarefa, Conventional Commits, e nada entra
em `main` sem pull request com CI verde.
