import { useState, type ReactNode } from 'react';
import { ArrowRight, BookOpen, Check, PencilLine, Repeat, RotateCcw, Sparkles, Undo2 } from 'lucide-react';
import { dpeQuestions } from '../../data/dpeStudyPlan';
import type { DpeApi, StepId } from '../../hooks/useDpeProgress';
import { dueLabel } from '../../utils/studyDates';

const ORDER: StepId[] = ['teoria', 'questoes', 'revisao'];

const META: Record<StepId, { n: number; title: string; hint: string; Icon: typeof BookOpen }> = {
  teoria: { n: 1, title: 'Teoria', hint: 'Aprenda o conteúdo novo', Icon: BookOpen },
  questoes: { n: 2, title: 'Questões', hint: 'Teste o que estudou', Icon: PencilLine },
  revisao: { n: 3, title: 'Revisão', hint: 'Fixe o que já viu', Icon: Repeat },
};

type Active = StepId | 'fim';

export function TodayFlow({ api }: { api: DpeApi }) {
  const { steps } = api;

  const isPending = (id: StepId) => steps[id].total > 0 && !steps[id].done;
  const firstPending = ORDER.find(isPending) ?? 'fim';
  const [active, setActive] = useState<Active>(firstPending);

  /** Próximo passo com algo a fazer depois de `from`; se não houver, encerra o dia. */
  const nextAfter = (from: StepId): Active => {
    const rest = ORDER.slice(ORDER.indexOf(from) + 1);
    return rest.find(isPending) ?? 'fim';
  };

  /** Rótulo do botão "avançar", de acordo com o destino real (passos vazios são pulados). */
  const nextLabel = (from: StepId): string => {
    const target = nextAfter(from);
    if (target === 'questoes') return 'Continuar para as questões';
    if (target === 'revisao') return 'Continuar para a revisão';
    return 'Concluir sessão de hoje';
  };

  return (
    <div className="space-y-5">
      <ol className="grid grid-cols-3 gap-2 sm:gap-3" aria-label="Passos de hoje">
        {ORDER.map((id) => {
          const meta = META[id];
          const step = steps[id];
          const empty = step.total === 0;
          const done = !empty && step.done;
          const current = active === id;
          const Icon = meta.Icon;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => setActive(id)}
                aria-current={current ? 'step' : undefined}
                className={
                  'w-full h-full text-left rounded-2xl border px-3 py-3 sm:px-4 sm:py-4 transition-colors cursor-pointer ' +
                  (current
                    ? 'bg-sage-50 border-sage-300 shadow-xs'
                    : 'bg-white/60 border-stone-200/80 hover:bg-white hover:border-stone-300')
                }
              >
                <span className="flex items-center gap-2">
                  <span
                    className={
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ' +
                      (done
                        ? 'bg-sage-600 text-white'
                        : current
                          ? 'bg-sage-700 text-white'
                          : 'bg-stone-200/80 text-stone-600')
                    }
                  >
                    {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : meta.n}
                  </span>
                  <span className="text-sm font-semibold text-stone-800">{meta.title}</span>
                  <Icon className="ml-auto hidden h-4 w-4 text-stone-400 sm:block" aria-hidden />
                </span>
                <span className="mt-2 block text-xs text-stone-500">
                  {empty ? 'Nada pendente' : done ? 'Concluído' : step.completed + ' de ' + step.total}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="rounded-3xl border border-stone-200/80 bg-white p-5 sm:p-7">
        {active === 'teoria' && <TheoryPanel api={api} nextLabel={nextLabel('teoria')} onNext={() => setActive(nextAfter('teoria'))} />}
        {active === 'questoes' && <QuestionsPanel api={api} nextLabel={nextLabel('questoes')} onNext={() => setActive(nextAfter('questoes'))} />}
        {active === 'revisao' && <ReviewPanel api={api} nextLabel={nextLabel('revisao')} onNext={() => setActive(nextAfter('revisao'))} />}
        {active === 'fim' && <DonePanel api={api} onRetry={() => setActive('questoes')} />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Peças compartilhadas                                                */
/* ------------------------------------------------------------------ */

function PanelHeader({ step, children }: { step: StepId; children: ReactNode }) {
  const meta = META[step];
  return (
    <header className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-sage-600">Passo {meta.n} de 3</p>
      <h3 className="mt-1 font-display text-2xl text-stone-900">{meta.title}</h3>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">{children}</p>
    </header>
  );
}

function NextButton({ onClick, children, disabled }: { onClick: () => void; children: ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer ' +
        (disabled
          ? 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
          : 'bg-sage-700 text-white hover:bg-sage-800 shadow-xs')
      }
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </button>
  );
}

function EmptyNote({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-sage-50 border border-sage-100 p-5 text-sm text-sage-900">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sage-800/90 leading-relaxed">{children}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Passo 1: teoria                                                     */
/* ------------------------------------------------------------------ */

function TheoryPanel({ api, onNext, nextLabel }: { api: DpeApi; onNext: () => void; nextLabel: string }) {
  const { session, steps, topicById, groups, completeTheory, undoTheory } = api;
  const topics = session.theory.map((id) => topicById.get(id)).filter((t): t is NonNullable<typeof t> => Boolean(t));
  const done = steps.teoria.done;

  return (
    <section aria-label="Teoria">
      <PanelHeader step="teoria">
        Conteúdo novo de hoje. Estude com o material aberto e, só depois, marque como estudado. Cada tópico entra na sua revisão a partir de amanhã.
      </PanelHeader>

      {topics.length === 0 ? (
        <EmptyNote title="Todos os tópicos do edital já foram iniciados.">
          Não há teoria nova. Siga para as questões e para a revisão.
        </EmptyNote>
      ) : (
        <ul className="space-y-3">
          {topics.map((topic) => {
            const finished = session.theoryDone.includes(topic.id);
            const group = groups.find((g) => g.id === topic.subject);
            return (
              <li
                key={topic.id}
                className={
                  'rounded-2xl border p-4 sm:p-5 transition-colors ' +
                  (finished ? 'bg-sage-50/70 border-sage-200' : 'bg-paper border-stone-200/80')
                }
              >
                <p className="text-xs font-semibold text-sage-700">
                  {group?.title}
                  {topic.priority === 1 && <span className="ml-2 rounded-full bg-sage-100 px-2 py-0.5 text-[10px] uppercase tracking-wide">Prioritário</span>}
                </p>
                <p className="mt-1.5 text-base font-semibold text-stone-900">{topic.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  <span className="font-semibold text-stone-700">O que fazer: </span>
                  {topic.task}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {finished ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1.5 text-xs font-semibold text-sage-800">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} /> Estudado
                      </span>
                      <button
                        type="button"
                        onClick={() => undoTheory(topic.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-800 cursor-pointer"
                      >
                        <Undo2 className="h-3.5 w-3.5" /> Desfazer
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => completeTheory(topic.id)}
                      className="inline-flex items-center gap-2 rounded-full bg-white border border-sage-300 px-4 py-2 text-sm font-semibold text-sage-800 hover:bg-sage-50 cursor-pointer"
                    >
                      <Check className="h-4 w-4" /> Terminei de estudar
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <NextButton onClick={onNext} disabled={!done && topics.length > 0}>
          {done || topics.length === 0 ? nextLabel : 'Pular este passo'}
        </NextButton>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Passo 2: questões                                                   */
/* ------------------------------------------------------------------ */

function QuestionsPanel({ api, onNext, nextLabel }: { api: DpeApi; onNext: () => void; nextLabel: string }) {
  const { session, answerQuestion, resetPractice } = api;
  const ids = session.questionIds;
  const firstOpen = ids.findIndex((i) => session.answers[i] === undefined);
  const [view, setView] = useState(firstOpen === -1 ? ids.length : firstOpen);

  const correctCount = ids.filter((i) => session.answers[i] === dpeQuestions[i].correct).length;
  const finished = view >= ids.length;

  return (
    <section aria-label="Questões">
      <PanelHeader step="questoes">
        {ids.length} questões de treino, uma de cada vez. Responda sem consultar o material: a ideia é recuperar o que você estudou.
      </PanelHeader>

      <div className="mb-5 flex items-center gap-1.5" role="list" aria-label="Progresso das questões">
        {ids.map((qi, pos) => {
          const chosen = session.answers[qi];
          const answered = chosen !== undefined;
          const right = answered && chosen === dpeQuestions[qi].correct;
          const reachable = answered || pos === firstOpen;
          return (
            <button
              key={qi}
              type="button"
              role="listitem"
              disabled={!reachable}
              onClick={() => setView(pos)}
              aria-label={'Questão ' + (pos + 1) + (answered ? (right ? ', correta' : ', incorreta') : '')}
              aria-current={pos === view ? 'step' : undefined}
              className={
                'h-2.5 flex-1 rounded-full transition-all ' +
                (right ? 'bg-sage-500' : answered ? 'bg-rose-300' : 'bg-stone-200') +
                (pos === view ? ' ring-2 ring-sage-300 ring-offset-2 ring-offset-white' : '') +
                (reachable ? ' cursor-pointer' : ' cursor-default')
              }
            />
          );
        })}
      </div>

      {!finished ? (
        <QuestionCard
          key={ids[view]}
          index={ids[view]}
          position={view + 1}
          total={ids.length}
          chosen={session.answers[ids[view]]}
          onAnswer={(opt) => answerQuestion(ids[view], opt)}
          onNext={() => setView(view + 1)}
          isLast={view === ids.length - 1}
        />
      ) : (
        <div className="rounded-2xl bg-sage-50 border border-sage-100 p-6 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-sage-600" aria-hidden />
          <p className="mt-2 font-display text-3xl text-sage-900">
            {correctCount} de {ids.length}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-sage-800">
            {correctCount / ids.length >= 0.8
              ? 'Meta batida: 80% ou mais. Bom ritmo.'
              : 'Abaixo de 80%. Volte aos assuntos das questões que errou antes da próxima sessão.'}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                resetPractice();
                setView(0);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-sage-300 bg-white px-4 py-2 text-sm font-semibold text-sage-800 hover:bg-sage-50 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" /> Refazer
            </button>
            <NextButton onClick={onNext}>{nextLabel}</NextButton>
          </div>
        </div>
      )}
    </section>
  );
}

function QuestionCard({
  index,
  position,
  total,
  chosen,
  onAnswer,
  onNext,
  isLast,
}: {
  index: number;
  position: number;
  total: number;
  chosen: number | undefined;
  onAnswer: (option: number) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const q = dpeQuestions[index];
  const answered = chosen !== undefined;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
        {q.subject} · {position}/{total}
      </p>
      <p className="mt-2 text-lg font-semibold leading-snug text-stone-900">{q.prompt}</p>

      <div className="mt-4 space-y-2">
        {q.options.map((option, i) => {
          const isRight = i === q.correct;
          const isChosen = i === chosen;
          const state = answered
            ? isRight
              ? 'border-sage-400 bg-sage-50 text-sage-900'
              : isChosen
                ? 'border-rose-300 bg-rose-50 text-rose-900'
                : 'border-stone-200 bg-white text-stone-400'
            : 'border-stone-200 bg-paper text-stone-800 hover:border-sage-400 hover:bg-sage-50/50 cursor-pointer';
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => onAnswer(i)}
              className={'flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors ' + state}
            >
              <span className="mt-px font-semibold">{String.fromCharCode(65 + i)}</span>
              <span className="flex-1">{option}</span>
              {answered && isRight && <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" strokeWidth={3} />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-4 rounded-2xl border border-stone-200 bg-paper p-4" role="status">
          <p className="text-sm font-semibold text-stone-900">
            {chosen === q.correct ? 'Resposta correta.' : 'Resposta incorreta. Releia o conceito.'}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-stone-600">{q.explanation}</p>
          <div className="mt-4">
            <NextButton onClick={onNext}>{isLast ? 'Ver resultado' : 'Próxima questão'}</NextButton>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Passo 3: revisão                                                    */
/* ------------------------------------------------------------------ */

function ReviewPanel({ api, onNext, nextLabel }: { api: DpeApi; onNext: () => void; nextLabel: string }) {
  const { session, progress, topicById, groups, reviewTopic, undoReview } = api;
  const topics = session.review.map((id) => topicById.get(id)).filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <section aria-label="Revisão">
      <PanelHeader step="revisao">
        Tópicos que já passaram pela teoria e voltam hoje. Feche o material, tente explicar de memória e só então diga se lembrou.
      </PanelHeader>

      {topics.length === 0 ? (
        <EmptyNote title="Nenhuma revisão vencida hoje.">
          Os tópicos que você estudar hoje voltam a partir de amanhã.
        </EmptyNote>
      ) : (
        <ul className="space-y-3">
          {topics.map((topic) => {
            const record = session.reviewResult[topic.id];
            const entry = progress[topic.id];
            const group = groups.find((g) => g.id === topic.subject);
            return (
              <li
                key={topic.id}
                className={
                  'rounded-2xl border p-4 sm:p-5 transition-colors ' +
                  (record ? 'bg-sage-50/70 border-sage-200' : 'bg-paper border-stone-200/80')
                }
              >
                <p className="text-xs font-semibold text-sage-700">
                  {group?.title} · revisão {(record ? (record.prev?.reviews ?? 0) : (entry?.reviews ?? 0)) + 1}
                </p>
                <p className="mt-1.5 text-base font-semibold text-stone-900">{topic.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  <span className="font-semibold text-stone-700">Teste-se: </span>
                  {topic.task}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {record ? (
                    <>
                      <span
                        className={
                          'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ' +
                          (record.result === 'ok' ? 'bg-sage-100 text-sage-800' : 'bg-rose-100 text-rose-800')
                        }
                      >
                        {record.result === 'ok' ? 'Lembrei' : 'Errei'} · volta {entry ? dueLabel(entry.due) : 'amanhã'}
                      </span>
                      <button
                        type="button"
                        onClick={() => undoReview(topic.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-800 cursor-pointer"
                      >
                        <Undo2 className="h-3.5 w-3.5" /> Desfazer
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => reviewTopic(topic.id, true)}
                        className="inline-flex items-center gap-2 rounded-full bg-sage-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sage-800 cursor-pointer"
                      >
                        <Check className="h-4 w-4" /> Lembrei
                      </button>
                      <button
                        type="button"
                        onClick={() => reviewTopic(topic.id, false)}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
                      >
                        Errei
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {session.reviewMore > 0 && (
        <p className="mt-4 text-xs text-stone-500">
          Mais {session.reviewMore} {session.reviewMore === 1 ? 'revisão vencida fica' : 'revisões vencidas ficam'} para os próximos dias, para não sobrecarregar a sessão.
        </p>
      )}

      <div className="mt-6">
        <NextButton onClick={onNext} disabled={!api.steps.revisao.done && topics.length > 0}>
          {nextLabel}
        </NextButton>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Fim do dia                                                          */
/* ------------------------------------------------------------------ */

function DonePanel({ api, onRetry }: { api: DpeApi; onRetry: () => void }) {
  const { steps, session } = api;
  const correct = session.questionIds.filter((i) => session.answers[i] === dpeQuestions[i].correct).length;
  const answered = session.questionIds.filter((i) => session.answers[i] !== undefined).length;

  return (
    <section aria-label="Resumo do dia" className="text-center py-4 sm:py-6">
      <Sparkles className="mx-auto h-7 w-7 text-sage-600" aria-hidden />
      <h3 className="mt-3 font-display text-2xl text-stone-900">Sessão de hoje concluída</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-600">
        {steps.teoria.completed} {steps.teoria.completed === 1 ? 'tópico novo' : 'tópicos novos'}, {correct} de {answered} questões certas e{' '}
        {steps.revisao.completed} {steps.revisao.completed === 1 ? 'revisão' : 'revisões'}. Amanhã o plano se atualiza sozinho.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
      >
        <RotateCcw className="h-4 w-4" /> Fazer mais questões
      </button>
    </section>
  );
}
