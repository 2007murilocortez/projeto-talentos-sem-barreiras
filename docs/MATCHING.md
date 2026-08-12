# Algoritmo de compatibilidade

Especificação do módulo `src/features/matching`. TypeScript puro: sem React, sem I/O, sem `Date.now()`
implícito (o relógio entra como parâmetro). Implementado na Fase 3.

## 1. Contrato

```ts
type MatchInput = {
  candidate: EnrichedCandidate; // perfil + skills + formação + experiência + progresso da trilha
  opportunities: Opportunity[];
  catalog: { coursesBySkillId: Map<SkillId, Opportunity[]> };
  weights?: MatchWeights; // default exportado, sobrescrevível
};

type MatchResult = {
  opportunityId: string;
  score: number; // 0..100
  breakdown: Record<MatchDimension, DimensionScore>;
  explanation: string; // pt-BR, sempre presente
  gaps: Gap[];
  affirmativeBoostApplied: boolean;
};
```

`explanation` e `breakdown` são obrigatórios no tipo. Não existe caminho de código que produza um número
sem o porquê — a garantia é do compilador, não da disciplina de quem escreve a tela.

## 2. Dimensões e pesos

Um único objeto tipado, `DEFAULT_WEIGHTS`, com asserção de que a soma é 1. Nenhum número mágico solto.

| Dimensão     | Peso | Cálculo                                                                   |
| ------------ | ---- | ------------------------------------------------------------------------- |
| `skills`     | 0.35 | cobertura das skills exigidas, penalizando nível abaixo do mínimo         |
| `area`       | 0.20 | interseção entre áreas desejadas e área da vaga                           |
| `location`   | 0.15 | mesma cidade > mesma UF > remoto > presencial distante                    |
| `background` | 0.15 | formação e anos de experiência vs. mínimo, com meio-termo para "quase lá" |
| `salary`     | 0.10 | sobreposição entre pretensão e faixa oferecida                            |
| `readiness`  | 0.05 | progresso na trilha                                                       |

Cada dimensão retorna `0..1`; o score final é a soma ponderada arredondada para inteiro em `0..100`.

**Detalhamento por dimensão**

- **skills** — só `required` conta para a base; `nice_to_have` entra como bônus limitado (teto de 0.1
  dentro da dimensão). Skill presente com nível ≥ mínimo = 1.0; um nível abaixo = 0.6; dois ou mais
  abaixo = 0.25; ausente = 0. Nível não validado por teste vale 0.85 do validado — incentiva o
  diagnóstico sem punir quem ainda não fez.
- **area** — 1.0 na interseção; 0.5 para área adjacente declarada no catálogo; 0 fora.
- **location** — remoto = 1.0 independentemente de cidade; mesma cidade = 1.0; mesma UF = 0.7; híbrido
  fora da UF = 0.2; presencial fora da UF = 0.
- **background** — atende = 1.0; um degrau abaixo (formação ou até 1 ano de experiência) = 0.6; abaixo
  disso = 0.2. Vaga sem requisito = 1.0.
- **salary** — sobreposição de intervalos normalizada. Sem faixa divulgada = 0.7 (neutro levemente
  positivo, para não punir a vaga que omite). Pretensão acima do teto = decai proporcionalmente, não
  zera de imediato.
- **readiness** — fração de etapas concluídas da trilha.

## 3. Vaga afirmativa

Se a oportunidade é afirmativa e o candidato se autodeclarou em um dos grupos-alvo, a **ordenação**
recebe prioridade — o resultado ganha `affirmativeBoostApplied: true` e sobe no desempate, sem inflar
artificialmente o score de aderência técnica. A explicação diz isso em voz alta: _"Esta vaga é afirmativa
para pessoas com deficiência e você se autodeclarou nesse grupo, então ela aparece em destaque."_
Ação afirmativa escondida dentro de um número não é transparência; é constrangimento.

Candidato sem autodeclaração nunca é penalizado — apenas não recebe a prioridade.

## 4. Explicabilidade

Gerada a partir do `breakdown`, em pt-BR, voz ativa, sempre com o número concreto e o próximo passo:

> "Você atende 4 de 5 requisitos técnicos. Falta Excel avançado — o curso _Excel para Análise de Dados_,
> da Cooperativa X, cobre esse ponto em 12 horas."

Regras de redação: no máximo três frases; começa pelo que a pessoa **tem**, não pelo que falta; nunca usa
jargão de score; sempre termina em ação quando existe gap acionável.

## 5. Gaps acionáveis

```ts
type Gap = {
  kind: 'skill' | 'education' | 'experience';
  label: string;
  currentLevel?: number;
  requiredLevel?: number;
  suggestedCourses: { opportunityId: string; title: string }[];
};
```

O `catalog` recebido na entrada liga cada skill faltante aos cursos publicados na própria plataforma.
É isso que transforma o matching em trilha: a rejeição vira roteiro.

## 6. Determinismo e desempate

Mesma entrada, mesma saída — sem aleatoriedade, sem relógio interno. Ordenação: score desc → boost
afirmativo → menos gaps → prazo mais próximo → id (estabilidade). O último critério existe para que os
testes de empate sejam determinísticos.

## 7. Casos de teste mínimos (Fase 3)

1. Match perfeito → 100 e zero gaps.
2. Match zero → 0, explicação ainda presente e útil.
3. Empate resolvido pela ordem de desempate declarada.
4. Candidato sem nenhuma skill cadastrada.
5. Vaga sem requisitos de skill.
6. Skill presente com nível um abaixo do mínimo.
7. Skill presente com nível dois abaixo.
8. Skill validada vs. autoavaliada, mesmo nível.
9. Pretensão salarial acima do teto da vaga.
10. Vaga sem faixa salarial divulgada.
11. Vaga remota com candidato em outra UF.
12. Vaga presencial em outra UF.
13. Vaga afirmativa com candidato autodeclarado no grupo.
14. Vaga afirmativa com candidato sem autodeclaração (sem penalização).
15. Gap de skill com curso correspondente no catálogo.
16. Gap de skill sem curso correspondente.
17. Pesos customizados alteram a ordenação de forma previsível.
18. Soma dos pesos ≠ 1 é rejeitada.

Cobertura exigida do módulo: acima de 80%.
