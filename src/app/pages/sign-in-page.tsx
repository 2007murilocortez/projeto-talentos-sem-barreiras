import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '@/app/providers/auth-context';
import { ROLE_HOME, ROLE_LABELS, USER_ROLES, type UserRole } from '@/shared/types/user';

/**
 * Entrada provisória da Fase 1: escolhe o papel para exercitar as guardas de rota.
 * A autenticação real, com e-mail e senha, substitui esta tela na Fase 8.
 */
export function SignInPage() {
  const { signInAs } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState<UserRole | null>(null);

  async function handleSignIn(role: UserRole) {
    setPending(role);
    await signInAs(role);
    void navigate(ROLE_HOME[role], { replace: true });
  }

  return (
    <section className="mx-auto max-w-3xl px-10 py-20">
      <p className="text-xs font-medium tracking-widest text-neutral-500 uppercase">Acesso</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900">Entrar como…</h1>
      <p className="mt-4 text-neutral-600">
        Enquanto a autenticação real não chega, escolha um dos três perfis para navegar pela
        aplicação. Nenhuma senha é verificada e nenhum dado sai do seu navegador.
      </p>

      <div className="mt-10 flex gap-4">
        {USER_ROLES.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => void handleSignIn(role)}
            disabled={pending !== null}
            className="border border-neutral-300 px-5 py-3 font-medium text-neutral-900 transition-colors hover:border-neutral-900 disabled:opacity-50"
          >
            {pending === role ? 'Entrando…' : ROLE_LABELS[role]}
          </button>
        ))}
      </div>
    </section>
  );
}
