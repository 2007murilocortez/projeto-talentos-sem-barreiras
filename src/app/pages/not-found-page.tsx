import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-3xl px-10 py-20">
      <p className="text-xs font-medium tracking-widest text-neutral-500 uppercase">Erro 404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900">
        Esta página não existe
      </h1>
      <p className="mt-4 text-neutral-600">
        O endereço pode ter mudado, ou o link que você seguiu está desatualizado.
      </p>
      <Link to="/" className="mt-8 inline-block font-medium text-neutral-900 underline">
        Voltar para o início
      </Link>
    </section>
  );
}
