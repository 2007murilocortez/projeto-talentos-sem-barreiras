import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DesktopOnlyGate } from '@/app/desktop-only-gate';

function mockViewport({ wideEnough }: { wideEnough: boolean }) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: wideEnough,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('DesktopOnlyGate', () => {
  it('mostra a aplicação em telas de 1280px ou mais', () => {
    mockViewport({ wideEnough: true });

    render(
      <DesktopOnlyGate>
        <p>Conteúdo da aplicação</p>
      </DesktopOnlyGate>
    );

    expect(screen.getByText('Conteúdo da aplicação')).toBeInTheDocument();
  });

  it('pede para abrir no computador em telas menores', () => {
    mockViewport({ wideEnough: false });

    render(
      <DesktopOnlyGate>
        <p>Conteúdo da aplicação</p>
      </DesktopOnlyGate>
    );

    expect(screen.getByRole('heading', { name: 'Abra no computador' })).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo da aplicação')).not.toBeInTheDocument();
  });
});
