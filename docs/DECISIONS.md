# Decisões de arquitetura (ADRs)

Formato: contexto → decisão → consequência. Uma decisão revogada não é apagada; ganha status
`Substituída por ADR-XXX`.

---

## ADR-001 — Ports & adapters com duas implementações

**Status:** aceita (Fase 0)

**Contexto.** O Supabase só entra na Fase 8, mas as telas precisam existir e ser demonstráveis antes
disso. Além disso, o projeto tem prazo de banca em novembro e cinco pessoas com níveis técnicos
diferentes trabalhando em paralelo.

**Decisão.** Toda leitura e escrita passa por interfaces em `data/ports`. Duas implementações:
`in-memory` (com seeds) e `supabase`. A escolha é feita uma única vez na composição raiz, via
`VITE_DATA_SOURCE`.

**Consequência.** Fases 1–7 rodam sem backend e sem credenciais; testes são rápidos e determinísticos;
a demonstração para a banca tem plano B se a rede falhar. Em troca, existe uma camada de mapeamento a
mais e o risco de o adapter in-memory divergir do real — mitigado por uma suíte de testes de contrato
executada contra as duas implementações.

---

## ADR-002 — Domínio puro e isolado em `features/matching`

**Status:** aceita (Fase 0)

**Contexto.** O algoritmo de compatibilidade é a peça técnica que será defendida oralmente. Se estiver
espalhado em hooks e componentes, é indefensável e intestável.

**Decisão.** `features/matching` contém apenas funções puras tipadas. Nenhum import de React, de cliente
HTTP ou de Supabase. Cobertura mínima de 80%.

**Consequência.** O módulo pode ser lido, testado e explicado isoladamente. Custo: os dados precisam ser
"enriquecidos" antes de entrar, o que exige um caso de uso de montagem. Aceito.

---

## ADR-003 — Explicabilidade obrigatória no tipo de retorno

**Status:** aceita (Fase 0)

**Contexto.** Score sem justificativa é caixa-preta, e caixa-preta em plataforma de inclusão é
exatamente a crítica que a banca vai fazer.

**Decisão.** `MatchResult` exige `explanation: string` e `breakdown` não-opcionais. A UI nunca exibe o
número sozinho.

**Consequência.** É impossível compilar um resultado sem explicação. Custo: gerar texto natural em pt-BR
para todos os cenários dá trabalho e precisa de teste próprio.

---

## ADR-004 — Autodeclaração em tabela separada, com consentimento

**Status:** aceita (Fase 0)

**Contexto.** Grupo autodeclarado é dado sensível (LGPD, art. 11). Guardar como coluna do perfil torna
impossível liberar o perfil para a empresa sem vazar o rótulo.

**Decisão.** Tabela `self_declaration` isolada, com `consent_given` e `consented_at`, RLS negando leitura
a empresas em qualquer circunstância, e acesso do admin apenas por view agregada. O filtro de vaga
afirmativa roda no servidor.

**Consequência.** Privacidade demonstrável e argumento forte de defesa. Custo: um join a mais e a
necessidade de uma view agregada para o painel.

---

## ADR-005 — Estado de servidor no TanStack Query, Zustand só para UI

**Status:** aceita (Fase 0)

**Contexto.** A confusão mais comum em projeto React de equipe mista é duplicar dado de servidor em store
global e depois brigar com sincronização.

**Decisão.** Dado que vem de repositório vive exclusivamente no cache do TanStack Query. Zustand guarda
apenas estado efêmero de interface.

**Consequência.** Menos bugs de dado velho; invalidação explícita após mutação. Regra passível de lint
review no PR.

---

## ADR-006 — `Result<T, E>` para erros esperados

**Status:** aceita (Fase 0)

**Contexto.** Erro esperado (CNPJ duplicado, prazo vencido, transição inválida) tratado com `throw` some
do tipo e vira `catch` genérico com mensagem inútil.

**Decisão.** Casos de uso retornam union discriminada `{ ok: true, value } | { ok: false, error }`, com
erros de domínio nomeados. `throw` fica reservado a bug de programação, capturado por error boundary.

**Consequência.** A UI é obrigada a tratar cada erro conhecido, o que produz mensagens acionáveis. Custo:
mais verbosidade na chamada.

---

## ADR-007 — Desktop-only (com ressalva registrada)

**Status:** aceita por determinação do briefing (Fase 0)

**Contexto.** O briefing exige largura mínima de 1280px e proíbe responsividade, para concentrar esforço
em profundidade de produto no prazo disponível.

**Decisão.** Layout de largura fixa; abaixo de 1280px, uma tela pedindo para abrir no computador. Sem
breakpoints em nenhuma fase.

**Consequência.** Ganho real de velocidade e de densidade de informação nas telas de recrutador e admin.
**Ressalva registrada:** parte relevante do público-alvo (jovens de baixa renda, imigrantes) acessa a
internet majoritariamente por celular, então essa restrição precisa ser apresentada à banca como recorte
consciente de MVP com mobile no roadmap futuro — não como esquecimento. A escolha arquitetural que
preserva essa saída é manter os tokens de espaçamento e tipografia em escala relativa, sem valores em
pixel travados nos componentes de `shared/ui`.

---

## ADR-008 — Cursos e workshops são `Opportunity`, não entidade separada

**Status:** aceita (Fase 0)

**Contexto.** O produto precisa ligar o gap de uma vaga ao curso que o resolve. Entidades separadas
exigiriam duas buscas, dois formulários e duas listagens.

**Decisão.** `Opportunity.kind` discrimina `job | internship | course | workshop | training-program`.
Campos específicos ficam opcionais e validados condicionalmente pelo Zod.

**Consequência.** Busca, publicação, moderação e matching reusam o mesmo caminho; o gap aponta direto
para uma oportunidade existente. Custo: schema com validação condicional por `kind`, que precisa de teste.

---

## ADR-009 — Score congelado no envio da candidatura

**Status:** aceita (Fase 0)

**Contexto.** A vaga pode ser editada depois da candidatura, e o candidato veria um score diferente do
que motivou a decisão dele.

**Decisão.** `Application` guarda `match_score_snapshot` e `match_explanation_snapshot` no momento do
envio.

**Consequência.** Histórico coerente e auditável; o painel de impacto mede o que de fato aconteceu.
Custo: dado duplicado, aceito por ser imutável por natureza.

---

## ADR-010 — Catálogo controlado de skills

**Status:** aceita (Fase 0)

**Contexto.** Skill em texto livre inviabiliza matching: "Excel", "excel avançado" e "Microsoft Excel"
viram três habilidades diferentes.

**Decisão.** Tabela `skill` como catálogo curado, mantido pelo admin. Empresa e candidato selecionam;
não digitam livremente. Sugestão de nova skill vira pedido de moderação.

**Consequência.** Matching confiável e filtros úteis. Custo: o seed precisa de um catálogo inicial
razoável (~80 skills) e o admin ganha uma tela de curadoria — prevista na Fase 7.
