# Como contribuir

Somos três pessoas commitando no mesmo repositório. As regras abaixo existem por dois motivos: evitar que
a gente pise no trabalho um do outro, e deixar registrado no histórico quem fez o quê — a banca pode pedir
prova de contribuição individual, e o `git log` resolve isso de graça, desde que cada pessoa commite com o
próprio usuário.

## Antes do primeiro commit

Confirme que o git está identificado com a sua conta do GitHub:

```bash
git config user.name "Seu Nome"
git config user.email "seu-email-do-github@exemplo.com"
```

Use o mesmo e-mail cadastrado no GitHub, senão o commit não é atribuído ao seu perfil.

## Branches

Nunca commite direto em `main`. Crie uma branch a partir da `main` atualizada:

```bash
git switch main
git pull
git switch -c feat/busca-de-oportunidades
```

Padrão do nome: `tipo/descricao-em-kebab-case`, com tipo entre `feat`, `fix`, `chore`, `refactor`,
`docs` e `test`.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/pt-br/), em português, no imperativo:

```
feat: adiciona filtro por modalidade na busca de vagas
fix: corrige cálculo de score quando a vaga não tem requisitos
refactor: extrai regra de transição para a máquina de estados
docs: atualiza ADR de privacidade da autodeclaração
test: cobre empate na ordenação de matches
chore: atualiza dependências de lint
```

Commits pequenos e frequentes. Um commit que muda vinte arquivos por três motivos diferentes é impossível
de revisar e de reverter.

## Pull requests

Nada entra em `main` sem pull request, nem correção de uma linha. Preencha o template, marque o checklist
e espere o CI ficar verde. Peça revisão a pelo menos uma pessoa do time.

Antes de abrir o PR, rode local o que o CI vai rodar:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
```

Cada PR gera automaticamente uma URL de preview na Vercel — use ela para revisar UI sem precisar clonar
a branch.

## Conflitos

Se a `main` andou enquanto você trabalhava, atualize a sua branch antes de pedir merge:

```bash
git switch main && git pull
git switch sua-branch
git rebase main
```

## O que não fazer

- Commitar `.env`, chave, token ou qualquer segredo. Se acontecer, avise o grupo na hora: rotacionar a
  chave é obrigatório, apagar o commit não basta.
- Deixar `console.log` ou `any` no código.
- Abrir PR gigante misturando refatoração com feature nova.
- Fazer merge do próprio PR sem revisão.
