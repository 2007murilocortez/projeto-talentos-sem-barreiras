# Deploy na Vercel — passo a passo manual

Estes passos precisam ser executados por você na interface web. O agente não tem acesso à Vercel.
Faça na ordem; cada bloco depende do anterior.

## 1. Importar o repositório

1. Acesse <https://vercel.com/new>.
2. Entre com **Continue with GitHub**, usando a conta `2007murilocortez`.
3. Na lista de repositórios, localize `projeto-talentos-sem-barreiras` e clique em **Import**.
   Se ele não aparecer, clique em **Adjust GitHub App Permissions** e conceda acesso ao repositório.

## 2. Configurar o build

Na tela de configuração do projeto, confira campo por campo:

| Campo            | Valor exato             |
| ---------------- | ----------------------- |
| Project Name     | `talento-sem-barreiras` |
| Framework Preset | `Vite`                  |
| Root Directory   | `./`                    |
| Build Command    | `npm run build`         |
| Output Directory | `dist`                  |
| Install Command  | `npm ci`                |
| Node.js Version  | `24.x`                  |

O `vercel.json` do repositório já declara build, output, região `gru1` e os rewrites de SPA. Se algum
campo da interface divergir do arquivo, o arquivo vence — mantenha os dois iguais para evitar confusão.

## 3. Cadastrar as variáveis de ambiente

Ainda na tela de import, abra **Environment Variables**. Cadastre em **Production** e **Preview**
(marque as duas caixas para cada variável):

| Name               | Value                                                 |
| ------------------ | ----------------------------------------------------- |
| `VITE_DATA_SOURCE` | `in-memory`                                           |
| `VITE_APP_ENV`     | `production` (em Production) / `preview` (em Preview) |

Não cadastre `VITE_SUPABASE_URL` nem `VITE_SUPABASE_ANON_KEY` agora. Elas entram na Fase 8, junto com a
troca de `VITE_DATA_SOURCE` para `supabase`. Cadastrar vazias só produz erro difícil de diagnosticar.

Lembrete: qualquer valor cadastrado com prefixo `VITE_` fica visível no bundle. A service role key do
Supabase não pode ser cadastrada aqui em nenhuma circunstância.

## 4. Publicar

Clique em **Deploy** e espere. Ao final você recebe uma URL `https://talento-sem-barreiras.vercel.app`.
Abra e confirme que a tela placeholder aparece com a tipografia carregada.

Cole essa URL no `README.md`, na linha marcada com `<!-- deploy -->`.

## 5. Confirmar produção e previews

1. **Settings → Git**: confirme que **Production Branch** é `main`.
2. Ainda em **Settings → Git**, confirme que **Preview Deployments** está habilitado para todas as
   branches. É isso que faz cada pull request ganhar uma URL própria de teste — útil para o grupo
   revisar sem clonar o projeto.
3. Faça o teste real do rewrite de SPA: abra a URL de produção, navegue para qualquer rota interna e
   **recarregue a página com F5**. Se voltar 404, o rewrite não está ativo. Ainda não há rotas internas
   nesta fase, mas repita esse teste assim que o React Router entrar, na Fase 1.

## 6. Depois, na Fase 8 (Supabase)

1. Crie o projeto no Supabase, região São Paulo.
2. Copie **Project URL** e **anon public key** em Project Settings → API.
3. Cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` na Vercel, em Production e Preview.
4. Troque `VITE_DATA_SOURCE` para `supabase`.
5. Faça um **Redeploy** — variável de ambiente nova só vale a partir do próximo deploy.

## Problemas comuns

**404 ao recarregar uma rota interna.** O rewrite de SPA não está sendo aplicado. Confirme que
`vercel.json` está na raiz do repositório e foi commitado.

**Build passa local e falha na Vercel.** Quase sempre é versão de Node diferente. Local, CI e Vercel
estão fixados em Node 24 (`.nvmrc`, `engines`, workflow do GitHub Actions). Se mudar em um, mude nos três.

**Variável de ambiente não chega na aplicação.** Ou falta o prefixo `VITE_`, ou não houve redeploy
depois de cadastrar.

**Página em branco sem erro visível.** Abra o console do navegador. Em geral é caminho de asset errado,
causado por `base` mal configurada no `vite.config.ts` — que hoje está no padrão e deve continuar assim.
