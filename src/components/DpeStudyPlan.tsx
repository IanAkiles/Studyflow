import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CalendarDays, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, RotateCcw, Target, Trophy, XCircle } from 'lucide-react';
import { dpeGroups, dpeQuestions, dpeSources, type DpeTopic } from '../data/dpeStudyPlan';

type Progress = Record<string, { reviews: number; last: string; due: string }>;
type Tab = 'hoje' | 'conteudo' | 'treino' | 'metodo';
const STORAGE_KEY = 'studyflow_dpe_am_2026_v1';
const intervals = [1, 3, 7, 14, 30];

const localDate = (date = new Date()) => {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return date.getFullYear() + '-' + m + '-' + d;
};
const addDays = (days: number) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return localDate(date);
};

function loadProgress(): Progress {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return {};
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const safe: Progress = {};
    for (const [id, entry] of Object.entries(parsed as Record<string, unknown>)) {
      if (!entry || typeof entry !== 'object') continue;
      const v = entry as Record<string, unknown>;
      if (typeof v.reviews === 'number' && Number.isFinite(v.reviews) && typeof v.last === 'string' && typeof v.due === 'string') {
        safe[id] = { reviews: Math.min(Math.max(0, v.reviews), 999), last: v.last, due: v.due };
      }
    }
    return safe;
  } catch { return {}; }
}

export function DpeStudyPlan() {
  const [expanded, setExpanded] = useState(true);
  const [tab, setTab] = useState<Tab>('hoje');
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [currentSubject, setCurrentSubject] = useState('todos');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [sessionChecks, setSessionChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* private browsing */ }
  }, [progress]);

  const topics = useMemo(() => dpeGroups.flatMap(group => group.topics), []);
  const completed = topics.filter(t => (progress[t.id]?.reviews ?? 0) >= 4).length;
  const begun = topics.filter(t => progress[t.id]).length;
  const today = localDate();
  const due = topics.filter(t => progress[t.id] && progress[t.id].due <= today);
  const notStarted = topics.filter(t => !progress[t.id]).sort((a, b) => a.priority - b.priority);
  const recommended = [...due, ...notStarted.slice(0, Math.max(0, 3 - due.length))].slice(0, 6);
  const currentQuestion = dpeQuestions[questionIndex];
  const percentage = Math.round(100 * completed / topics.length);

  const mark = (topic: DpeTopic, success: boolean) => {
    setProgress(prev => {
      const former = prev[topic.id]?.reviews ?? 0;
      const next = success ? former + 1 : 0;
      return {
        ...prev,
        [topic.id]: {
          reviews: next,
          last: today,
          due: addDays(success ? intervals[Math.min(next - 1, intervals.length - 1)] : 1)
        }
      };
    });
  };

  const answer = (value: number) => {
    if (selected !== null) return;
    setSelected(value);
    setAnsweredCount(v => v + 1);
    if (value === currentQuestion.correct) setCorrectAnswers(v => v + 1);
  };
  const nextQuestion = () => {
    setQuestionIndex(i => i + 1);
    setSelected(null);
  };
  const restart = () => {
    setQuestionIndex(0);
    setSelected(null);
    setAnsweredCount(0);
    setCorrectAnswers(0);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'hoje', label: 'Estudar hoje' },
    { id: 'conteudo', label: 'Edital verticalizado' },
    { id: 'treino', label: 'Questões autorais' },
    { id: 'metodo', label: 'Estratégia e provas' }
  ];

  return (
    <section aria-label="Preparação DPE Amazonas" className="rounded-2xl bg-white border border-indigo-100 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
        <div className="flex justify-between items-start gap-3">
          <div>
            <p className="text-xs text-indigo-200 font-bold uppercase tracking-widest mb-2">Missão concurso público · DPE-AM</p>
            <h2 className="text-xl sm:text-2xl font-extrabold">Rumo à aprovação — Assistente Técnico Administrativo</h2>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl">Trilha baseada no edital FCC 01/2023 e na prova anterior. Não substitui o edital de 2026: confira cargo, localidade, tópicos, cronograma e retificações nos canais oficiais antes da inscrição.</p>
          </div>
          <button type="button" onClick={() => setExpanded(v => !v)} aria-label={expanded ? 'Recolher plano' : 'Expandir plano'} className="rounded-lg p-2 bg-white/10 hover:bg-white/20">
            {expanded ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-5">
          <Metric label="Tópicos" value={String(topics.length)} />
          <Metric label="Iniciados" value={String(begun)} />
          <Metric label="Consolidados" value={completed + '/' + topics.length} />
          <Metric label="Revisões vencidas" value={String(due.length)} />
        </div>
        <div className="h-2 bg-white/15 rounded-full mt-4 overflow-hidden">
          <div className="bg-emerald-400 h-full rounded-full transition-all" style={{width: percentage + '%'}} />
        </div>
        <p className="text-xs mt-2 text-slate-300">{percentage}% de tópicos com ao menos quatro revisões. Progresso armazenado somente neste navegador.</p>
      </div>
      {expanded && (
        <>
          <div className="flex border-b border-slate-100 p-2 gap-1 overflow-x-auto" role="tablist" aria-label="Plano de estudos DPE-AM">
            {tabs.map(t => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} type="button" onClick={() => setTab(t.id)}
                className={'whitespace-nowrap rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition ' + (tab === t.id ? 'bg-indigo-50 text-indigo-800' : 'text-slate-500 hover:bg-slate-50')}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="p-4 sm:p-6">
            {tab === 'hoje' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold"><CalendarDays size={18} className="text-indigo-500"/> Roteiro diário sugerido · 2 horas</div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {['20 min: revisão espaçada', '40 min: teoria e lei seca', '40 min: questões FCC', '20 min: caderno de erros'].map(item => (
                    <div key={item} className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs font-medium text-slate-700">{item}</div>
                  ))}
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 text-sm">Missões de hoje ({recommended.length})</h3>
                  {recommended.length === 0 && <p className="text-sm text-slate-500">Você está em dia. Use o tempo para uma prova anterior ou simulado.</p>}
                  {recommended.map(topic => {
                    const p = progress[topic.id];
                    return (
                      <div key={topic.id} className="rounded-xl border border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-xs text-indigo-600 font-semibold">{dpeGroups.find(g => g.id === topic.subject)?.title} · {p ? 'Revisão ' + (p.reviews + 1) : 'Primeiro contato'}</p>
                          <p className="text-sm text-slate-900 font-bold mt-1">{topic.label}</p>
                          <p className="text-xs text-slate-500 mt-1">{topic.task}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button type="button" onClick={() => mark(topic, false)} className="text-xs font-semibold rounded-lg border border-rose-200 text-rose-700 px-3 py-2 hover:bg-rose-50">Errei</button>
                          <button type="button" onClick={() => mark(topic, true)} className="text-xs font-semibold rounded-lg bg-indigo-600 text-white px-3 py-2 hover:bg-indigo-700">Acertei / revisei</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-amber-50 rounded-xl border border-amber-100 p-3 text-xs text-amber-900">Não marque um tópico sem testar sua lembrança. Feche o material, tente explicar em voz alta e resolva questões antes de escolher “Acertei”. Se errar, ele volta para amanhã.</div>
              </div>
            )}

            {tab === 'conteudo' && (
              <div className="space-y-4">
                <div className="flex justify-between gap-3 items-center flex-wrap">
                  <div>
                    <h3 className="font-bold text-slate-900">Conteúdo verticalizado</h3>
                    <p className="text-xs text-slate-500">Todos os tópicos abaixo derivam do edital de 2023, não de uma confirmação do programa de 2026.</p>
                  </div>
                  <select aria-label="Filtrar matéria" value={currentSubject} onChange={e => setCurrentSubject(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-xs bg-white">
                    <option value="todos">Todas as matérias</option>
                    {dpeGroups.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                  </select>
                </div>
                {dpeGroups.filter(g => currentSubject === 'todos' || g.id === currentSubject).map(group => (
                  <div key={group.id} className="rounded-xl border border-slate-200 p-3 sm:p-4">
                    <h4 className="font-bold text-sm text-slate-800">{group.title} <span className="text-xs font-normal text-slate-500">({group.topics.filter(t => (progress[t.id]?.reviews ?? 0) >= 4).length}/{group.topics.length} consolidados)</span></h4>
                    <p className="text-xs text-slate-500 mb-3">{group.context}</p>
                    <div className="space-y-2">
                      {group.topics.map(topic => {
                        const p = progress[topic.id];
                        return (
                          <div key={topic.id} className="rounded-lg p-2 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-semibold text-slate-800">{topic.label} {topic.priority === 1 && <span className="text-[10px] text-indigo-600">· PRIORITÁRIO</span>}</p>
                              <p className="text-xs text-slate-500">{topic.task}</p>
                              {p && <p className="text-[11px] text-emerald-700 mt-1">{p.reviews} revisões · próxima: {p.due.split('-').reverse().join('/')}</p>}
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <button type="button" onClick={() => mark(topic, false)} title="Errei: agendar amanhã" aria-label={'Errei: ' + topic.label} className="border rounded-lg border-rose-200 text-rose-600 p-2 hover:bg-rose-50"><XCircle size={17}/></button>
                              <button type="button" onClick={() => mark(topic, true)} title="Recuperei de memória e acertei" aria-label={'Acertei: ' + topic.label} className="border rounded-lg border-indigo-200 text-indigo-600 p-2 hover:bg-indigo-50"><CheckCircle2 size={17}/></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'treino' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><Target size={18} className="text-indigo-500"/> Treino de recuperação ativa</h3>
                    <p className="text-xs text-slate-500">Questões autorais para treino, não questões oficiais da FCC. Para provas reais, use os links em “Estratégia e provas”.</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600">{Math.min(questionIndex + 1, dpeQuestions.length)}/{dpeQuestions.length} · {correctAnswers}/{answeredCount} acertos</span>
                </div>
                {questionIndex < dpeQuestions.length ? (
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                    <span className="text-xs uppercase tracking-wider font-bold text-indigo-600">{currentQuestion.subject}</span>
                    <p className="text-slate-900 text-sm font-semibold">{currentQuestion.prompt}</p>
                    {currentQuestion.options.map((option, i) => {
                      const answered = selected !== null;
                      const correct = i === currentQuestion.correct;
                      const chosen = i === selected;
                      const feedback = answered && correct ? 'border-emerald-400 bg-emerald-50 text-emerald-900' : answered && chosen ? 'border-rose-400 bg-rose-50 text-rose-900' : 'border-slate-200 bg-white text-slate-700';
                      return (
                        <button type="button" key={i} disabled={answered} onClick={() => answer(i)}
                          className={'block w-full text-left rounded-lg border p-3 text-sm ' + feedback + (!answered ? ' hover:border-indigo-400' : '')}>
                          <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{option}
                        </button>
                      );
                    })}
                    {selected !== null && (
                      <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
                        <p className="text-sm font-semibold text-slate-900">{selected === currentQuestion.correct ? 'Resposta correta!' : 'Resposta incorreta — reveja o conceito.'}</p>
                        <p className="text-sm text-slate-700 mt-1">{currentQuestion.explanation}</p>
                        <button type="button" onClick={nextQuestion} className="mt-3 rounded-lg bg-indigo-600 text-white font-bold text-sm px-4 py-2">Próxima questão</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5 text-center">
                    <Trophy className="mx-auto text-indigo-600 mb-2" size={28}/>
                    <h3 className="text-lg font-bold text-slate-900">{correctAnswers} de {dpeQuestions.length} acertos</h3>
                    <p className="text-sm text-slate-600">Meta de treino: 80% ou mais, sem consultar material. Refaça os assuntos dos erros.</p>
                    <button type="button" onClick={restart} className="mt-3 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-bold">Refazer treino</button>
                  </div>
                )}
              </div>
            )}

            {tab === 'metodo' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 font-bold text-slate-800"><BookOpen size={18} className="text-indigo-500"/> Estratégia de preparação</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    ['Semanas 1–4', 'Diagnóstico com prova de 2023. Base de Português, Constitucional e Administrativo. Questões desde o primeiro dia.'],
                    ['Semanas 5–8', 'Direito institucional, legislação da Defensoria, organização administrativa e licitações na lei vigente.'],
                    ['Semanas 9–12', 'Administração, orçamento, gestão de pessoas, processos, materiais e revisão das matérias com mais erros.'],
                    ['Semanas 13–16', 'Dois simulados semanais, alternados com correção detalhada e revisão espaçada.'],
                    ['Semanas 17–18', 'Retas finais: legislação, caderno de erros, controle de tempo, sono e logística. Readequar à data oficial da prova.']
                  ].map(([phase, text]) => (
                    <div key={phase} className="rounded-xl border border-slate-200 p-3">
                      <h4 className="font-bold text-indigo-700 text-sm">{phase}</h4><p className="text-xs text-slate-600 mt-1">{text}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4 space-y-2">
                  <h4 className="font-bold text-indigo-900 text-sm">Técnicas para seguir rigorosamente</h4>
                  {[
                    ['Estudo ativo', 'Leia um tópico e feche o material. Explique sem olhar antes de marcar como revisado.'],
                    ['Repetição espaçada', 'Revisões progressivas em 1, 3, 7, 14 e 30 dias após acertos; erros voltam em 1 dia.'],
                    ['Caderno de erros', 'Para cada erro, anote assunto, causa do erro e regra correta em uma frase.'],
                    ['Questões FCC', 'Faça blocos cronometrados de 15–25 questões; corrija todas, inclusive acertos por chute.'],
                    ['Simulado completo', 'Reserve 3 horas, 60 questões e sem consulta, espelhando o formato de 2023; confira o formato de 2026.'],
                    ['Metas mensuráveis', 'Busque ao menos 80% de acertos em treinos; é meta de estudo, não nota oficial de aprovação.'],
                  ].map(([title, desc]) => (
                    <p key={title} className="text-xs text-slate-700"><strong className="text-slate-900">{title}:</strong> {desc}</p>
                  ))}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2">Links para provas, edital e legislação</h4>
                  <div className="space-y-2">
                    {dpeSources.map(s => (
                      <a key={s.url} href={s.url} target="_blank" rel="noreferrer noopener" className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 p-3 text-xs font-semibold text-indigo-700 hover:bg-indigo-50">
                        {s.label}<ExternalLink size={15} className="flex-shrink-0"/>
                      </a>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                  <strong>Atualização obrigatória:</strong> o edital de 2023 continha referências a leis antigas de licitações (Lei 8.666/1993 e Lei 10.520/2002). Elas foram revogadas; estude a Lei 14.133/2021 e confirme com o edital atual quais normas e conteúdos serão exigidos. Não considere aqui vagas em Manaus ou datas de 2026 como confirmadas.
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-white/10 p-3"><p className="text-[11px] text-indigo-100">{label}</p><p className="text-lg font-extrabold mt-1">{value}</p></div>;
}
