import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from '@/App';

describe('App', () => {
  it('exibe o nome do projeto', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Talento Sem Barreiras' })).toBeInTheDocument();
  });
});
