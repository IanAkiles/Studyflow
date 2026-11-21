import { Check, X } from 'lucide-react';
import type { DpeApi } from '../../hooks/useDpeProgress';
import { CONSOLIDATED_AT } from '../../hooks/useDpeProgress';
import { shortBr } from '../../utils/studyDates';

export function SyllabusView({ api }: { api: DpeApi }) {
  const { groups, progress, markManual } = api;

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-stone-600">
        Todos os tópicos, por matéria. Use esta tela para consultar o que já foi visto ou registrar um estudo feito fora do plano de hoje. Os tópicos derivam do edital de 2023, não de uma confirmação do programa de 2026.
      </p>

      {groups.map((group, groupIndex) => {
        const consolidated = group.topics.filter((t) => (progress[t.id]?.reviews ?? 0) >= CONSOLIDATED_AT).length;
        const pct = Math.round((100 * consolidated) / group.topics.length);
        return (
          <details key={group.id} open={groupIndex === 0} className="group rounded-3xl border border-stone-200/80 bg-white">
            <summary className="flex cursor-pointer list-none items-center gap-4 rounded-3xl px-5 py-4 [&::-webkit-details-marker]:hidden">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-stone-900">{group.title}</p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {consolidated} de {group.topics.length} consolidados
                </p>
              </div>
              <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-stone-100 sm:block" aria-hidden>
                <div className="h-full rounded-full bg-sage-500" style={{ width: pct + '%' }} />
              </div>
              <span className="text-stone-400 transition-transform group-open:rotate-180" aria-hidden>
                ▾
              </span>
            </summary>

            <ul className="divide-y divide-stone-100 border-t border-stone-100 px-5">
              {group.topics.map((topic) => {
                const p = progress[topic.id];
                const state = !p ? 'Novo' : p.reviews >= CONSOLIDATED_AT ? 'Consolidado' : 'Em estudo';
                return (
                  <li key={topic.id} className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-900">
                        {topic.label}
                        {topic.priority === 1 && (
                          <span className="ml-2 rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sage-700">
                            Prioritário
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-500">{topic.task}</p>
                      <p className={'mt-1 text-xs font-medium ' + (p ? 'text-sage-700' : 'text-stone-400')}>
                        {state}
                        {p && ' · ' + p.reviews + ' ' + (p.reviews === 1 ? 'revisão' : 'revisões') + ' · próxima ' + shortBr(p.due)}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => markManual(topic.id, false)}
                        title="Errei: volta amanhã"
                        aria-label={'Errei: ' + topic.label}
                        className="rounded-full border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => markManual(topic.id, true)}
                        title="Estudei ou lembrei de memória"
                        aria-label={'Estudei ou lembrei: ' + topic.label}
                        className="rounded-full border border-sage-300 p-2 text-sage-700 hover:bg-sage-50 cursor-pointer"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </details>
        );
      })}
    </div>
  );
}
