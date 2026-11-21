import { useCallback, useEffect, useMemo, useState } from 'react';
import { dpeGroups, dpeQuestions, type DpeTopic } from '../data/dpeStudyPlan';
import { addDays, localDate } from '../utils/studyDates';

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export type ProgressEntry = { reviews: number; last: string; due: string };
export type Progress = Record<string, ProgressEntry>;

export type ReviewRecord = {
  result: 'ok' | 'erro';
  /** Estado anterior do tópico, para permitir "desfazer". */
  prev: ProgressEntry | null;
};

/** Plano do dia: o que estudar, quais questões fazer e o que revisar. */
export type Session = {
  date: string;
  theory: string[];
  theoryDone: string[];
  review: string[];
  reviewMore: number;
  reviewResult: Record<string, ReviewRecord>;
  questionIds: number[];
  answers: Record<number, number>;
};

export type StepId = 'teoria' | 'questoes' | 'revisao';

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

/** Mesma chave de antes: quem já estudou mantém o progresso. */
const PROGRESS_KEY = 'studyflow_dpe_am_2026_v1';
const SESSION_KEY = 'studyflow_dpe_am_2026_session_v1';

export const INTERVALS = [1, 3, 7, 14, 30];
export const CONSOLIDATED_AT = 4;
export const NEW_TOPICS_PER_DAY = 2;
export const QUESTIONS_PER_SESSION = 6;
export const MAX_REVIEWS_PER_DAY = 6;

/** Matéria do plano -> rótulos usados nas questões autorais. */
const QUESTION_LABELS: Record<string, string[]> = {
  portugues: ['Português'],
  juridico: ['Constitucional'],
  constitucional: ['Constitucional'],
  administrativo: ['Administrativo'],
  gestao: ['Gestão pública', 'Orçamento'],
  materiais: ['Materiais'],
};

const allTopics: DpeTopic[] = dpeGroups.flatMap((group) => group.topics);
const topicById = new Map(allTopics.map((t) => [t.id, t]));

/* ------------------------------------------------------------------ */
/* Regra de repetição espaçada (igual à versão anterior)               */
/* ------------------------------------------------------------------ */

export function nextEntry(prev: ProgressEntry | undefined, success: boolean, today: string): ProgressEntry {
  const former = prev?.reviews ?? 0;
  const next = success ? former + 1 : 0;
  return {
    reviews: next,
    last: today,
    due: addDays(success ? INTERVALS[Math.min(next - 1, INTERVALS.length - 1)] : 1),
  };
}

/* ------------------------------------------------------------------ */
/* Leitura / gravação                                                  */
/* ------------------------------------------------------------------ */

function isEntry(value: unknown): value is ProgressEntry {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.reviews === 'number' && Number.isFinite(v.reviews) && typeof v.last === 'string' && typeof v.due === 'string';
}

function loadProgress(): Progress {
  try {
    const value = localStorage.getItem(PROGRESS_KEY);
    if (!value) return {};
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const safe: Progress = {};
    for (const [id, entry] of Object.entries(parsed as Record<string, unknown>)) {
      if (isEntry(entry)) {
        safe[id] = { reviews: Math.min(Math.max(0, entry.reviews), 999), last: entry.last, due: entry.due };
      }
    }
    return safe;
  } catch {
    return {};
  }
}

function buildSession(progress: Progress, today: string): Session {
  const theory = allTopics
    .filter((t) => !progress[t.id])
    .sort((a, b) => a.priority - b.priority)
    .slice(0, NEW_TOPICS_PER_DAY);

  const dueAll = allTopics
    .filter((t) => progress[t.id] && progress[t.id].due <= today)
    .sort((a, b) => progress[a.id].due.localeCompare(progress[b.id].due));
  const review = dueAll.slice(0, MAX_REVIEWS_PER_DAY);

  // Questões: primeiro as das matérias de hoje, depois as demais.
  // O ponto de partida gira a cada dia para não repetir sempre as mesmas.
  const labels = new Set<string>();
  [...theory, ...review].forEach((t) => (QUESTION_LABELS[t.subject] ?? []).forEach((l) => labels.add(l)));
  const n = dpeQuestions.length;
  const dayNumber = Math.floor(new Date(today + 'T12:00:00').getTime() / 86400000);
  const rotated = dpeQuestions.map((_, i) => (i + dayNumber) % n);
  const relevant = rotated.filter((i) => labels.has(dpeQuestions[i].subject));
  const others = rotated.filter((i) => !labels.has(dpeQuestions[i].subject));
  const questionIds = [...relevant, ...others].slice(0, QUESTIONS_PER_SESSION);

  return {
    date: today,
    theory: theory.map((t) => t.id),
    theoryDone: [],
    review: review.map((t) => t.id),
    reviewMore: dueAll.length - review.length,
    reviewResult: {},
    questionIds,
    answers: {},
  };
}

function loadSession(progress: Progress): Session {
  const today = localDate();
  try {
    const value = localStorage.getItem(SESSION_KEY);
    if (value) {
      const s = JSON.parse(value) as Session;
      const valid =
        s &&
        s.date === today &&
        Array.isArray(s.theory) &&
        Array.isArray(s.theoryDone) &&
        Array.isArray(s.review) &&
        Array.isArray(s.questionIds) &&
        s.questionIds.every((i) => Number.isInteger(i) && i >= 0 && i < dpeQuestions.length) &&
        s.reviewResult &&
        typeof s.reviewResult === 'object' &&
        s.answers &&
        typeof s.answers === 'object';
      if (valid) {
        return {
          ...s,
          theory: s.theory.filter((id) => topicById.has(id)),
          theoryDone: s.theoryDone.filter((id) => topicById.has(id)),
          review: s.review.filter((id) => topicById.has(id)),
          reviewMore: typeof s.reviewMore === 'number' ? s.reviewMore : 0,
        };
      }
    }
  } catch {
    /* sessão corrompida: monta uma nova */
  }
  return buildSession(progress, today);
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function useDpeProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [session, setSession] = useState<Session>(() => loadSession(loadProgress()));

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      /* navegação privada */
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      /* navegação privada */
    }
  }, [session]);

  // Se o app ficou aberto de um dia para o outro, monta o plano do novo dia.
  useEffect(() => {
    const onFocus = () => {
      const today = localDate();
      setSession((current) => (current.date === today ? current : buildSession(progress, today)));
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [progress]);

  /* ---------- Passo 1: teoria ---------- */

  const completeTheory = useCallback((topicId: string) => {
    const today = localDate();
    setProgress((prev) => (prev[topicId] ? prev : { ...prev, [topicId]: nextEntry(undefined, true, today) }));
    setSession((s) => (s.theoryDone.includes(topicId) ? s : { ...s, theoryDone: [...s.theoryDone, topicId] }));
  }, []);

  const undoTheory = useCallback((topicId: string) => {
    const today = localDate();
    setProgress((prev) => {
      const entry = prev[topicId];
      // só desfaz se ainda for o registro criado hoje pela teoria
      if (!entry || entry.last !== today || entry.reviews !== 1) return prev;
      const { [topicId]: _removed, ...rest } = prev;
      return rest;
    });
    setSession((s) => ({ ...s, theoryDone: s.theoryDone.filter((id) => id !== topicId) }));
  }, []);

  /* ---------- Passo 2: questões ---------- */

  const answerQuestion = useCallback((questionIndex: number, option: number) => {
    setSession((s) => (s.answers[questionIndex] !== undefined ? s : { ...s, answers: { ...s.answers, [questionIndex]: option } }));
  }, []);

  const resetPractice = useCallback(() => {
    setSession((s) => ({ ...s, answers: {} }));
  }, []);

  /* ---------- Passo 3: revisão ---------- */

  const reviewTopic = useCallback(
    (topicId: string, success: boolean) => {
      const today = localDate();
      const prev = progress[topicId] ?? null;
      setProgress((p) => ({ ...p, [topicId]: nextEntry(p[topicId], success, today) }));
      setSession((s) =>
        s.reviewResult[topicId]
          ? s
          : { ...s, reviewResult: { ...s.reviewResult, [topicId]: { result: success ? 'ok' : 'erro', prev } } },
      );
    },
    [progress],
  );

  const undoReview = useCallback(
    (topicId: string) => {
      const record = session.reviewResult[topicId];
      if (!record) return;
      setProgress((p) => {
        if (record.prev) return { ...p, [topicId]: record.prev };
        const { [topicId]: _removed, ...rest } = p;
        return rest;
      });
      setSession((s) => {
        const { [topicId]: _gone, ...restResults } = s.reviewResult;
        return { ...s, reviewResult: restResults };
      });
    },
    [session.reviewResult],
  );

  /* ---------- Marcação manual (tela do edital) ---------- */

  const markManual = useCallback((topicId: string, success: boolean) => {
    const today = localDate();
    setProgress((p) => ({ ...p, [topicId]: nextEntry(p[topicId], success, today) }));
  }, []);

  /* ---------- Derivados ---------- */

  const stats = useMemo(() => {
    const today = localDate();
    const total = allTopics.length;
    const begun = allTopics.filter((t) => progress[t.id]).length;
    const consolidated = allTopics.filter((t) => (progress[t.id]?.reviews ?? 0) >= CONSOLIDATED_AT).length;
    const dueCount = allTopics.filter((t) => progress[t.id] && progress[t.id].due <= today).length;
    return { total, begun, consolidated, dueCount, percentage: Math.round((100 * consolidated) / total) };
  }, [progress]);

  const steps = useMemo(() => {
    const theoryDone = session.theory.every((id) => session.theoryDone.includes(id));
    const answered = session.questionIds.filter((i) => session.answers[i] !== undefined).length;
    const practiceDone = answered === session.questionIds.length;
    const reviewDone = session.review.every((id) => session.reviewResult[id]);
    return {
      teoria: { done: theoryDone, total: session.theory.length, completed: session.theoryDone.length },
      questoes: { done: practiceDone, total: session.questionIds.length, completed: answered },
      revisao: {
        done: reviewDone,
        total: session.review.length,
        completed: session.review.filter((id) => session.reviewResult[id]).length,
      },
    } as const;
  }, [session]);

  return {
    groups: dpeGroups,
    topicById,
    progress,
    session,
    stats,
    steps,
    completeTheory,
    undoTheory,
    answerQuestion,
    resetPractice,
    reviewTopic,
    undoReview,
    markManual,
  };
}

export type DpeApi = ReturnType<typeof useDpeProgress>;
