const DATA_SOURCES = ['in-memory', 'supabase'] as const;

export type DataSourceKind = (typeof DATA_SOURCES)[number];

const APP_ENVS = ['local', 'preview', 'production'] as const;

export type AppEnv = (typeof APP_ENVS)[number];

function parseDataSource(raw: string | undefined): DataSourceKind {
  if (raw === undefined || raw === '') return 'in-memory';

  if (!DATA_SOURCES.includes(raw as DataSourceKind)) {
    throw new Error(
      `VITE_DATA_SOURCE inválido: "${raw}". Valores aceitos: ${DATA_SOURCES.join(' | ')}.`
    );
  }

  return raw as DataSourceKind;
}

function parseAppEnv(raw: string | undefined): AppEnv {
  return APP_ENVS.includes(raw as AppEnv) ? (raw as AppEnv) : 'local';
}

/**
 * Único ponto do código que lê `import.meta.env`. Ler variável de ambiente
 * espalhada pela aplicação é como o valor errado passa despercebido até o deploy.
 */
export const env = {
  dataSource: parseDataSource(import.meta.env.VITE_DATA_SOURCE),
  appEnv: parseAppEnv(import.meta.env.VITE_APP_ENV),
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
} as const;
