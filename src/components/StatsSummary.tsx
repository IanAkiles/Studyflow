import React from 'react';
import { StudyObjective } from '../types/objective';

interface StatsSummaryProps {
  objectives: StudyObjective[];
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ objectives }) => {
  const total = objectives.length;
  const naoIniciados = objectives.filter((o) => o.status === 'nao_iniciado').length;
  const emAndamento = objectives.filter((o) => o.status === 'em_andamento').length;
  const concluidos = objectives.filter((o) => o.status === 'concluido').length;
  const percentage = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  const items = [
    { label: 'A iniciar', value: naoIniciados },
    { label: 'Em andamento', value: emAndamento },
    { label: 'Concluídas', value: concluidos },
  ];

  return (
    <section aria-label="Resumo das metas" className="rounded-3xl border border-sage-100 bg-sage-50 p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl text-sage-900">Suas metas</h2>
        <p className="text-sm font-semibold text-sage-800">{percentage}% concluído</p>
      </div>

      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-white/70"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Metas concluídas"
      >
        <div className="h-full rounded-full bg-sage-600 transition-all duration-500" style={{ width: percentage + '%' }} />
      </div>

      <dl className="mt-4 flex gap-8">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-[11px] uppercase tracking-wide text-sage-700">{item.label}</dt>
            <dd className="font-display text-2xl text-sage-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
