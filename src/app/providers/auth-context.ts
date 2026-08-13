import { createContext, useContext } from 'react';

import type { AuthenticatedUser, UserRole } from '@/shared/types/user';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

export type AuthContextValue = {
  user: AuthenticatedUser | null;
  role: UserRole | null;
  status: AuthStatus;
  signInAs: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const auth = useContext(AuthContext);

  if (auth === null) {
    throw new Error('useAuth precisa estar dentro de <AppProviders>.');
  }

  return auth;
}
