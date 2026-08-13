import { PhasePlaceholder } from '@/app/pages/phase-placeholder';

export function CandidateHomePage() {
  return (
    <PhasePlaceholder
      phase="Fase 5"
      title="Área do candidato"
      description="Aqui fica a trilha de preparação: o caminho do cadastro até a contratação, com o que falta sempre visível."
      upcoming={[
        'Onboarding em etapas, com autodeclaração opcional',
        'Perfil, experiências e formação',
        'Diagnóstico de habilidades',
        'Minha trilha',
        'Busca de oportunidades com filtros',
        'Detalhe da oportunidade, com a explicação do match',
        'Minhas candidaturas',
        'Acompanhamento pós-contratação',
      ]}
    />
  );
}

export function CompanyHomePage() {
  return (
    <PhasePlaceholder
      phase="Fase 6"
      title="Portal da empresa"
      description="Publicação de vagas, cursos e programas, e a lista de pessoas candidatas ordenada por compatibilidade — sempre com o porquê ao lado do número."
      upcoming={[
        'Cadastro e onboarding, com aprovação da administração',
        'Publicar oportunidade',
        'Minhas oportunidades',
        'Candidatos por vaga, com explicação do match',
        'Perfil da empresa e compromissos de diversidade',
      ]}
    />
  );
}

export function AdminHomePage() {
  return (
    <PhasePlaceholder
      phase="Fase 7"
      title="Administração"
      description="Moderação e o painel de indicadores de impacto, que é o material de apresentação do projeto."
      upcoming={[
        'Aprovação de empresas',
        'Moderação de vagas',
        'Curadoria do catálogo de habilidades',
        'Indicadores de impacto, com filtro por período',
        'Evolução de renda e funil da trilha',
        'Exportação em CSV',
      ]}
    />
  );
}
