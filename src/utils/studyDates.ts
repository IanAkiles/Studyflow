/** Data local no formato YYYY-MM-DD (sem deslocamento de fuso). */
export const localDate = (date = new Date()): string => {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return date.getFullYear() + '-' + m + '-' + d;
};

/** Data local daqui a `days` dias. */
export const addDays = (days: number): string => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return localDate(date);
};

/** 2026-11-20 -> 20/11 */
export const shortBr = (iso: string): string => {
  const [, m, d] = iso.split('-');
  return d + '/' + m;
};

/** Quantos dias faltam até `iso` (negativo = atrasado). */
export const daysUntil = (iso: string): number => {
  const a = new Date(localDate() + 'T12:00:00').getTime();
  const b = new Date(iso + 'T12:00:00').getTime();
  return Math.round((b - a) / 86400000);
};

/** Texto curto para "quando volta": amanhã, em 3 dias, hoje... */
export const dueLabel = (iso: string): string => {
  const n = daysUntil(iso);
  if (n <= 0) return 'hoje';
  if (n === 1) return 'amanhã';
  return 'em ' + n + ' dias (' + shortBr(iso) + ')';
};
