import React from 'react';
import { 
  Calendar, 
  Edit3, 
  Trash2, 
  CircleDashed, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { StudyObjective, ObjectiveStatus } from '../types/objective';
import { getDeadlineInfo } from '../utils/dateUtils';

interface ObjectiveCardProps {
  objective: StudyObjective;
  onEdit: (objective: StudyObjective) => void;
  onDeleteRequest: (objective: StudyObjective) => void;
  onStatusChange: (id: string, newStatus: ObjectiveStatus) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const isCompleted = objective.status === 'concluido';
  const deadlineInfo = getDeadlineInfo(objective.deadline, isCompleted);

  // Mapeamento de estilos por status
  const statusConfig = {
    nao_iniciado: {
      label: 'Não iniciado',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
      icon: <CircleDashed className="w-3.5 h-3.5 text-amber-600" />,
      borderAccent: 'border-l-amber-400',
    },
    em_andamento: {
      label: 'Em andamento',
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-200/80',
      icon: <Clock className="w-3.5 h-3.5 text-sky-600" />,
      borderAccent: 'border-l-sky-500',
    },
    concluido: {
      label: 'Concluído',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      borderAccent: 'border-l-emerald-500',
    },
  }[objective.status];

  return (
    <article
      className={`bg-white rounded-2xl border border-slate-200/90 border-l-4 ${statusConfig.borderAccent} p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative`}
    >
      <div>
        {/* Cabeçalho do Card: Status e Ações */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Badge de Status com seletor interativo acessível */}
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.badgeClass}`}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </span>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-1 text-slate-400">
            <button
              type="button"
              onClick={() => onEdit(objective)}
              title="Editar objetivo"
              aria-label={`Editar ${objective.title}`}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteRequest(objective)}
              title="Excluir objetivo"
              aria-label={`Excluir ${objective.title}`}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-snug break-words ${
            isCompleted ? 'text-slate-500 line-through decoration-slate-300' : ''
          }`}
        >
          {objective.title}
        </h3>

        {/* Descrição */}
        {objective.description ? (
          <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line break-words line-clamp-4">
            {objective.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mt-2">
            Nenhuma descrição detalhada adicionada.
          </p>
        )}
      </div>

      {/* Rodapé do Card: Prazo e Atalho de Mudança de Status */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Informações de Prazo */}
        <div className="flex items-center gap-1.5 text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span
            className={`font-medium ${
              deadlineInfo.isOverdue
                ? 'text-rose-600 font-semibold flex items-center gap-1'
                : deadlineInfo.isToday
                ? 'text-amber-600 font-semibold'
                : 'text-slate-600'
            }`}
          >
            {deadlineInfo.isOverdue && <AlertCircle className="w-3.5 h-3.5 inline text-rose-500" />}
            {deadlineInfo.text}
          </span>
        </div>

        {/* Alternador Rápido de Status */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Mudar para:</span>
          <select
            value={objective.status}
            onChange={(e) => onStatusChange(objective.id, e.target.value as ObjectiveStatus)}
            aria-label="Alterar status deste objetivo"
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="nao_iniciado">A Iniciar</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>
      </div>
    </article>
  );
};
