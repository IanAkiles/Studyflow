import { useState } from 'react';
import { useDpeProgress } from '../hooks/useDpeProgress';
import { TodayFlow } from './dpe/TodayFlow';
import { SyllabusView } from './dpe/SyllabusView';
import { MethodView } from './dpe/MethodView';

type View = 'hoje' | 'edital' | 'metodo';

const VIEWS: { id: View; label: string }[] = [
  { id: 'hoje', label: 'Hoje' },
  { id: 'edital', label: 'Edital' },
  { id: 'metodo', label: 'Método' },
];

export function DpeStudyPlan() {
  const api = useDpeProgress();
  const [view, setView] = useState<View>('hoje');
  const { stats } = api;

  return (
    <section aria-label="Preparação DPE Amazonas" className="space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-sage-100 bg-sage-50 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full bg-sage-100/80 blur-2xl" aria-hidden />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-sage-700">Plano de estudo · DPE-AM</p>
          <h2 className="mt-2 font-display text-3xl leading-tight text-sage-900 sm:text-4xl">Assistente Técnico Administrativo</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sage-800/90">
            Baseado no edital FCC 01/2023 e na prova anterior. Confira o edital atual da DPE-AM antes de se apoiar nestes tópicos.
          </p>

          <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-4">
            <div className="min-w-[200px] flex-1">
              <div className="flex items-baseline justify-between text-xs text-sage-800">
                <span className="font-semibold">
                  {stats.consolidated} de {stats.total} tópicos consolidados
                </span>
                <span>{stats.percentage}%</span>
              </div>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-white/70"
                role="progressbar"
                aria-valuenow={stats.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Tópicos consolidados"
              >
                <div className="h-full rounded-full bg-sage-600 transition-all duration-500" style={{ width: stats.percentage + '%' }} />
              </div>
            </div>
            <dl className="flex gap-6 text-sage-900">
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-sage-700">Iniciados</dt>
                <dd className="font-display text-2xl">{stats.begun}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-sage-700">Revisões vencidas</dt>
                <dd className="font-display text-2xl">{stats.dueCount}</dd>
              </div>
            </dl>
          </div>
          <p className="mt-4 text-xs text-sage-700">Progresso salvo apenas neste navegador.</p>
        </div>
      </header>

      <div className="flex w-fit gap-1 rounded-full border border-stone-200/80 bg-white/70 p-1" role="tablist" aria-label="Seções do plano">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={view === v.id}
            onClick={() => setView(v.id)}
            className={
              'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors cursor-pointer ' +
              (view === v.id ? 'bg-sage-700 text-white' : 'text-stone-600 hover:text-stone-900')
            }
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'hoje' && <TodayFlow api={api} />}
      {view === 'edital' && <SyllabusView api={api} />}
      {view === 'metodo' && <MethodView />}
    </section>
  );
}
