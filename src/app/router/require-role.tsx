import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuth } from '@/app/providers/auth-context';
import { ROLE_HOME, type UserRole } from '@/shared/types/user';

/**
 * Guarda de conveniência: evita que a pessoa veja uma tela que não é dela.
 * A autorização de verdade é imposta pelas políticas RLS no banco (ADR-004);
 * o cliente nunca é a fonte de verdade de permissão.
 */
export function RequireRole({ allowed }: { allowed: readonly UserRole[] }) {
  const { status, role } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <p className="p-8 text-neutral-500">Verificando o acesso…</p>;
  }

  if (status === 'anonymous' || role === null) {
    return <Navigate to="/entrar" replace state={{ from: location.pathname }} />;
  }

  if (!allowed.includes(role)) {
    return <Navigate to={ROLE_HOME[role]} replace />;
  }

  return <Outlet />;
}
