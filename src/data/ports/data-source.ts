import type { AuthenticatedUser, UserRole } from '@/shared/types/user';

/**
 * Contrato de sessão. As telas de autenticação chegam na Fase 5 e o backend real
 * na Fase 8; até lá, o adapter in-memory responde a este mesmo contrato.
 */
export interface SessionRepository {
  getCurrentUser(): Promise<AuthenticatedUser | null>;
  signInAs(role: UserRole): Promise<AuthenticatedUser>;
  signOut(): Promise<void>;
}

/**
 * Superfície única de dados consumida pela aplicação (ADR-001). Os repositórios de
 * domínio — candidatos, oportunidades, candidaturas — entram na Fase 4, depois que
 * a Fase 3 definir os tipos. Nenhuma feature importa um adapter concreto: a escolha
 * da implementação acontece uma única vez, em `src/app/providers`.
 */
export interface DataSource {
  readonly kind: 'in-memory' | 'supabase';
  readonly session: SessionRepository;
}
