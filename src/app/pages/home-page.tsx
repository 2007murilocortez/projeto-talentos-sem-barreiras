import { Link } from 'react-router';

import { useAuth } from '@/app/providers/auth-context';
import { ROLE_HOME } from '@/shared/types/user';

export function HomePage() {
  const { role } = useAuth();

  return (
    <section className="mx-auto max-w-3xl px-10 py-20">
      <p className="text-xs font-medium tracking-widest text-neutral-500 uppercase">
        Projeto de extensão universitária
      </p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight text-neutral-900">
        Talento Sem Barreiras
      </h1>
      <p className="mt-6 text-lg text-neutral-600">
        Plataforma gratuita de empregabilidade para pessoas de grupos minoritários e em situação de
        vulnerabilidade. Não é um site de vagas: é uma trilha que acompanha a pessoa do cadastro à
        contratação, e por noventa dias depois dela.
      </p>

      <Link
        to={role === null ? '/entrar' : ROLE_HOME[role]}
        className="mt-10 inline-block border border-neutral-900 px-5 py-2.5 font-medium text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
      >
        {role === null ? 'Entrar na plataforma' : 'Ir para a minha área'}
      </Link>
    </section>
  );
}
