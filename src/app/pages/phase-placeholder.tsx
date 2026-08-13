type PhasePlaceholderProps = {
  title: string;
  phase: string;
  description: string;
  upcoming: readonly string[];
};

/**
 * Andaime das telas que ainda não existem. Some conforme as fases avançam;
 * até lá, deixa explícito o que vem em cada rota em vez de mostrar página vazia.
 */
export function PhasePlaceholder({ title, phase, description, upcoming }: PhasePlaceholderProps) {
  return (
    <section className="mx-auto max-w-3xl px-10 py-16">
      <p className="text-xs font-medium tracking-widest text-neutral-500 uppercase">{phase}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900">{title}</h1>
      <p className="mt-4 text-lg text-neutral-600">{description}</p>

      <h2 className="mt-10 text-sm font-medium tracking-wide text-neutral-500 uppercase">
        Telas previstas
      </h2>
      <ul className="mt-3 space-y-2 text-neutral-700">
        {upcoming.map((item) => (
          <li key={item} className="border-l-2 border-neutral-200 pl-4">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
