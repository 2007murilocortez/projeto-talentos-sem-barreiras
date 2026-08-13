import { useEffect, useState, type ReactNode } from 'react';

const MIN_WIDTH = 1280;

/**
 * Decisão de escopo registrada no ADR-007: a plataforma é desenhada para desktop.
 * Abaixo da largura mínima, avisamos em vez de entregar um layout quebrado.
 */
export function DesktopOnlyGate({ children }: { children: ReactNode }) {
  const [isWideEnough, setIsWideEnough] = useState(
    () => window.matchMedia(`(min-width: ${MIN_WIDTH}px)`).matches
  );

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${MIN_WIDTH}px)`);
    const update = (event: MediaQueryListEvent) => {
      setIsWideEnough(event.matches);
    };

    query.addEventListener('change', update);
    return () => {
      query.removeEventListener('change', update);
    };
  }, []);

  if (isWideEnough) {
    return children;
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-10">
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold text-neutral-900">Abra no computador</h1>
        <p className="mt-4 text-neutral-600">
          O Talento Sem Barreiras foi desenhado para telas de {MIN_WIDTH} pixels ou mais. Em uma
          tela menor, as tabelas de candidatos e o painel de indicadores ficariam ilegíveis.
        </p>
        <p className="mt-4 text-neutral-600">
          Acesse pelo navegador de um computador, ou amplie esta janela.
        </p>
      </div>
    </main>
  );
}
