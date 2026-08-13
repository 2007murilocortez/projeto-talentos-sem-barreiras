import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';

import { AuthContext, type AuthContextValue } from '@/app/providers/auth-context';
import { RequireRole } from '@/app/router/require-role';
import type { UserRole } from '@/shared/types/user';

function renderWithRole(role: UserRole | null, initialPath: string) {
  const auth: AuthContextValue = {
    user:
      role === null ? null : { id: 'u1', email: 'pessoa@exemplo.br', name: 'Pessoa', role: role },
    role,
    status: role === null ? 'anonymous' : 'authenticated',
    signInAs: vi.fn(),
    signOut: vi.fn(),
  };

  render(
    <AuthContext value={auth}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route element={<RequireRole allowed={['admin']} />}>
            <Route path="/admin" element={<p>Painel de indicadores</p>} />
          </Route>
          <Route path="/entrar" element={<p>Tela de acesso</p>} />
          <Route path="/candidato" element={<p>Área do candidato</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext>
  );
}

describe('RequireRole', () => {
  it('libera a rota para o papel permitido', () => {
    renderWithRole('admin', '/admin');

    expect(screen.getByText('Painel de indicadores')).toBeInTheDocument();
  });

  it('manda quem não está autenticado para a tela de acesso', () => {
    renderWithRole(null, '/admin');

    expect(screen.getByText('Tela de acesso')).toBeInTheDocument();
  });

  it('devolve quem tem outro papel para a própria área', () => {
    renderWithRole('candidate', '/admin');

    expect(screen.getByText('Área do candidato')).toBeInTheDocument();
  });
});
