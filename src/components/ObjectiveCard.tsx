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
      badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
      icon: <CircleDashed className="w-3.5 h-3.5 text-stone-500" />,
    },
    em_andamento: {
      label: 'Em andamento',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
    },
    concluido: {
      label: 'Concluído',
      badgeClass: 'bg-sage-100 text-sage-800 border-sage-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-sage-600" />,
    },
  }[objective.status];

  return (
    <article
      className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 hover:border-stone-300 transition-colors flex flex-col justify-between group relative"
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
          <div className="flex items-center gap-1 text-stone-400">
            <button
              type="button"
              onClick={() => onEdit(objective)}
              title="Editar objetivo"
              aria-label={`Editar ${objective.title}`}
              className="p-1.5 rounded-lg text-stone-500 hover:text-sage-600 hover:bg-sage-50 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteRequest(objective)}
              title="Excluir objetivo"
              aria-label={`Excluir ${objective.title}`}
              className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base sm:text-lg font-bold text-stone-800 tracking-tight leading-snug break-words ${
            isCompleted ? 'text-stone-500 line-through decoration-stone-300' : ''
          }`}
        >
          {objective.title}
        </h3>

        {/* Descrição */}
        {objective.description ? (
          <p className="text-sm text-stone-600 mt-2 leading-relaxed whitespace-pre-line break-words line-clamp-4">
            {objective.description}
          </p>
        ) : (
          <p className="text-xs text-stone-400 italic mt-2">
            Nenhuma descrição detalhada adicionada.
          </p>
        )}
      </div>

      {/* Rodapé do Card: Prazo e Atalho de Mudança de Status */}
      <div className="mt-5 pt-3.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-xs">
        {/* Informações de Prazo */}
        <div className="flex items-center gap-1.5 text-stone-600">
          <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
          <span
            className={`font-medium ${
              deadlineInfo.isOverdue
                ? 'text-rose-600 font-semibold flex items-center gap-1'
                : deadlineInfo.isToday
                ? 'text-amber-600 font-semibold'
                : 'text-stone-600'
            }`}
          >
            {deadlineInfo.isOverdue && <AlertCircle className="w-3.5 h-3.5 inline text-rose-500" />}
            {deadlineInfo.text}
          </span>
        </div>

        {/* Alternador Rápido de Status */}
        <div className="flex items-center gap-1 ml-auto">
                    <select
            value={objective.status}
            onChange={(e) => onStatusChange(objective.id, e.target.value as ObjectiveStatus)}
            aria-label="Alterar status deste objetivo"
            className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-full px-3 py-1 text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-sage-500 cursor-pointer"
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
