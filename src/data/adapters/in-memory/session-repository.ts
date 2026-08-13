import type { SessionRepository } from '@/data/ports';
import { type AuthenticatedUser, ROLE_LABELS, type UserRole } from '@/shared/types/user';

const STORAGE_KEY = 'tsb:sessao-demo';

const DEMO_USERS: Record<UserRole, AuthenticatedUser> = {
  candidate: {
    id: 'demo-candidato',
    email: 'candidato@exemplo.br',
    name: 'Candidato de demonstração',
    role: 'candidate',
  },
  company: {
    id: 'demo-empresa',
    email: 'empresa@exemplo.br',
    name: 'Empresa de demonstração',
    role: 'company',
  },
  admin: {
    id: 'demo-admin',
    email: 'admin@exemplo.br',
    name: 'Administração',
    role: 'admin',
  },
};

function readStoredRole(): UserRole | null {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored !== null && stored in DEMO_USERS ? (stored as UserRole) : null;
}

/**
 * Sessão simulada da Fase 1: sem senha, sem token, sem validação. Existe apenas
 * para exercitar as guardas de rota enquanto a autenticação real não chega (Fase 8).
 */
export function createInMemorySessionRepository(): SessionRepository {
  return {
    getCurrentUser() {
      const role = readStoredRole();
      return Promise.resolve(role === null ? null : DEMO_USERS[role]);
    },

    signInAs(role: UserRole) {
      window.localStorage.setItem(STORAGE_KEY, role);
      return Promise.resolve(DEMO_USERS[role]);
    },

    signOut() {
      window.localStorage.removeItem(STORAGE_KEY);
      return Promise.resolve();
    },
  };
}

export const DEMO_USER_LABELS = ROLE_LABELS;
