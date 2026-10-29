import React from 'react';
import { Target, Clock, CheckCircle2, CircleDashed, Flame } from 'lucide-react';
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

  // Mensagem acolhedora motivacional para iniciantes
  const getMotivationalMessage = () => {
    if (total === 0) {
      return 'Nenhum objetivo ainda. Que tal cadastrar sua primeira meta de estudo hoje?';
    }
    if (concluidos === total) {
      return 'Incrível! Você concluiu todos os seus objetivos cadastrados! Parabéns pela dedicação!';
    }
    if (percentage >= 50) {
      return `Muito bem! Você já completou mais da metade (${percentage}%) das suas metas!`;
    }
    if (emAndamento > 0) {
      return 'Você está em movimento! Mantenha a consistência, um passo de cada vez.';
    }
    return 'Dê o primeiro passo escolhendo um dos seus objetivos para iniciar agora!';
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Visão Geral
            </span>
            <span className="text-xs text-slate-400">
              {total === 1 ? '1 objetivo cadastrado' : `${total} objetivos cadastrados`}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 mt-1">
            Seu Progresso de Estudos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{getMotivationalMessage()}</span>
          </p>
        </div>

        {/* Indicador de % Concluído */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 self-start sm:self-auto min-w-[140px]">
          <div className="text-right flex-1">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Conclusão
            </p>
            <p className="text-xl font-extrabold text-indigo-600 leading-none">
              {percentage}%
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Barra de progresso visual */}
      <div className="mt-4">
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Cartões de Contadores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
        {/* Total */}
        <div className="bg-slate-50/70 rounded-xl p-3 sm:p-4 border border-slate-100/90 transition hover:bg-slate-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Cadastrado</span>
            <span className="w-7 h-7 rounded-lg bg-slate-200/80 flex items-center justify-center text-slate-600">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{total}</p>
          <span className="text-[11px] text-slate-400">metas no StudyFlow</span>
        </div>

        {/* Não Iniciado */}
        <div className="bg-amber-50/50 rounded-xl p-3 sm:p-4 border border-amber-100/80 transition hover:bg-amber-50/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-800">Não Iniciados</span>
            <span className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <CircleDashed className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-900 mt-2">{naoIniciados}</p>
          <span className="text-[11px] text-amber-700/80">aguardando início</span>
        </div>

        {/* Em Andamento */}
        <div className="bg-sky-50/50 rounded-xl p-3 sm:p-4 border border-sky-100/80 transition hover:bg-sky-50/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sky-800">Em Andamento</span>
            <span className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-sky-900 mt-2">{emAndamento}</p>
          <span className="text-[11px] text-sky-700/80">estudos em progresso</span>
        </div>

        {/* Concluídos */}
        <div className="bg-emerald-50/50 rounded-xl p-3 sm:p-4 border border-emerald-100/80 transition hover:bg-emerald-50/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-800">Concluídos</span>
            <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-900 mt-2">{concluidos}</p>
          <span className="text-[11px] text-emerald-700/80">metas alcançadas</span>
        </div>
      </div>
    </section>
  );
};
