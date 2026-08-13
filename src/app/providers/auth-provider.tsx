import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { AuthContext, type AuthContextValue, type AuthStatus } from '@/app/providers/auth-context';
import { useDataSource } from '@/app/providers/data-source-context';
import type { AuthenticatedUser, UserRole } from '@/shared/types/user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { session } = useDataSource();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let active = true;

    void session.getCurrentUser().then((current) => {
      if (!active) return;
      setUser(current);
      setStatus(current === null ? 'anonymous' : 'authenticated');
    });

    return () => {
      active = false;
    };
  }, [session]);

  const signInAs = useCallback(
    async (role: UserRole) => {
      const signed = await session.signInAs(role);
      setUser(signed);
      setStatus('authenticated');
    },
    [session]
  );

  const signOut = useCallback(async () => {
    await session.signOut();
    setUser(null);
    setStatus('anonymous');
  }, [session]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, role: user?.role ?? null, status, signInAs, signOut }),
    [user, status, signInAs, signOut]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
