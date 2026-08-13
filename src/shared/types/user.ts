export const USER_ROLES = ['candidate', 'company', 'admin'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export const ROLE_LABELS: Record<UserRole, string> = {
  candidate: 'Candidato',
  company: 'Empresa',
  admin: 'Administração',
};

/** Rota inicial de cada papel após a autenticação. */
export const ROLE_HOME: Record<UserRole, string> = {
  candidate: '/candidato',
  company: '/empresa',
  admin: '/admin',
};

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && USER_ROLES.includes(value as UserRole);
}
