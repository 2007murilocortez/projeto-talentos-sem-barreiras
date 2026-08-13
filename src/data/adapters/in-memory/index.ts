import { createInMemorySessionRepository } from '@/data/adapters/in-memory/session-repository';
import type { DataSource } from '@/data/ports';

/**
 * Implementação de desenvolvimento: dados vivem em memória e a aplicação roda sem
 * backend e sem credenciais. Os repositórios de domínio e as seeds entram na Fase 4.
 */
export function createInMemoryDataSource(): DataSource {
  return {
    kind: 'in-memory',
    session: createInMemorySessionRepository(),
  };
}
