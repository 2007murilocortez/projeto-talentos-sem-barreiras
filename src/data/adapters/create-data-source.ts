import { createInMemoryDataSource } from '@/data/adapters/in-memory';
import type { DataSource } from '@/data/ports';
import type { DataSourceKind } from '@/app/config/env';

/**
 * Único lugar do código que decide qual implementação será usada (ADR-001).
 * Quando o adapter Supabase existir (Fase 8), ele entra aqui — e em nenhum
 * componente. Se alguma tela precisar mudar por causa dessa troca, a arquitetura falhou.
 */
export function createDataSource(kind: DataSourceKind): DataSource {
  switch (kind) {
    case 'in-memory':
      return createInMemoryDataSource();
    case 'supabase':
      throw new Error(
        'O adapter Supabase entra na Fase 8. Use VITE_DATA_SOURCE=in-memory por enquanto.'
      );
  }
}
