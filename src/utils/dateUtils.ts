/**
 * Utilitários para formatação e cálculo amigável de datas no padrão pt-BR
 */

export function formatDateBR(dateString?: string): string {
  if (!dateString) return 'Sem prazo definido';
  try {
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  } catch {
    return dateString;
  }
}

export interface DeadlineInfo {
  text: string;
  isOverdue: boolean;
  isToday: boolean;
  isSoon: boolean; // within 3 days
}

export function getDeadlineInfo(deadlineString?: string, isCompleted: boolean = false): DeadlineInfo {
  if (!deadlineString) {
    return {
      text: 'Sem prazo definido',
      isOverdue: false,
      isToday: false,
      isSoon: false,
    };
  }

  if (isCompleted) {
    return {
      text: `Concluído (Prazo: ${formatDateBR(deadlineString)})`,
      isOverdue: false,
      isToday: false,
      isSoon: false,
    };
  }

  try {
    const [year, month, day] = deadlineString.split('-').map(Number);
    const deadline = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const daysAgo = Math.abs(diffDays);
      return {
        text: `Venceu há ${daysAgo} ${daysAgo === 1 ? 'dia' : 'dias'} (${formatDateBR(deadlineString)})`,
        isOverdue: true,
        isToday: false,
        isSoon: false,
      };
    } else if (diffDays === 0) {
      return {
        text: `Vence hoje! (${formatDateBR(deadlineString)})`,
        isOverdue: false,
        isToday: true,
        isSoon: true,
      };
    } else if (diffDays === 1) {
      return {
        text: `Vence amanhã (${formatDateBR(deadlineString)})`,
        isOverdue: false,
        isToday: false,
        isSoon: true,
      };
    } else if (diffDays <= 3) {
      return {
        text: `Faltam ${diffDays} dias (${formatDateBR(deadlineString)})`,
        isOverdue: false,
        isToday: false,
        isSoon: true,
      };
    } else {
      return {
        text: `Prazo: ${formatDateBR(deadlineString)} (em ${diffDays} dias)`,
        isOverdue: false,
        isToday: false,
        isSoon: false,
      };
    }
  } catch {
    return {
      text: formatDateBR(deadlineString),
      isOverdue: false,
      isToday: false,
      isSoon: false,
    };
  }
}
