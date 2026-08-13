import { Link, Outlet, useNavigate } from 'react-router';

import { env } from '@/app/config/env';
import { useAuth } from '@/app/providers/auth-context';
import { ROLE_LABELS } from '@/shared/types/user';

export function AppShell() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    void navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen min-w-[1280px]">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo
      </a>

      <header className="flex items-center justify-between border-b border-neutral-200 px-10 py-4">
        <Link to="/" className="font-semibold tracking-tight text-neutral-900">
          Talento Sem Barreiras
        </Link>

        <div className="flex items-center gap-6 text-sm">
          {env.appEnv !== 'production' && (
            <span className="text-neutral-400">dados: {env.dataSource}</span>
          )}

          {user === null ? (
            <Link to="/entrar" className="font-medium text-neutral-900 underline">
              Entrar
            </Link>
          ) : (
            <>
              <span className="text-neutral-600">
                {user.name} · {role === null ? '' : ROLE_LABELS[role]}
              </span>
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="font-medium text-neutral-900 underline"
              >
                Sair
              </button>
            </>
          )}
        </div>
      </header>

      <main id="conteudo">
        <Outlet />
      </main>
    </div>
  );
}
