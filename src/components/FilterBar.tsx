import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { FilterStatus, StudyObjective } from '../types/objective';

interface FilterBarProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  objectives: StudyObjective[];
  sortBy: 'prazo' | 'recentes';
  onSortByChange: (sort: 'prazo' | 'recentes') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  objectives,
  sortBy,
  onSortByChange,
}) => {
  const counts = {
    todos: objectives.length,
    nao_iniciado: objectives.filter((o) => o.status === 'nao_iniciado').length,
    em_andamento: objectives.filter((o) => o.status === 'em_andamento').length,
    concluido: objectives.filter((o) => o.status === 'concluido').length,
  };

  const filterButtons: Array<{ key: FilterStatus; label: string; count: number }> = [
    { key: 'todos', label: 'Todos', count: counts.todos },
    { key: 'nao_iniciado', label: 'A Iniciar', count: counts.nao_iniciado },
    { key: 'em_andamento', label: 'Em Andamento', count: counts.em_andamento },
    { key: 'concluido', label: 'Concluídos', count: counts.concluido },
  ];

  return (
    <div className="flex flex-col gap-3 bg-white p-3 sm:p-4 rounded-3xl border border-stone-200/80">
      {/* Abas de Filtro de Status */}
      <div className="flex flex-wrap items-center gap-1.5">
        {filterButtons.map(({ key, label, count }) => {
          const isActive = currentFilter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onFilterChange(key)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-sage-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
              }`}
            >
              <span>{label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-sage-700/80 text-white'
                    : 'bg-stone-200/80 text-stone-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Busca e Ordenação */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        {/* Campo de Busca */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -transtone-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-9 pr-8 py-2 rounded-full border border-stone-200 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sage-500 bg-stone-50/60 focus:bg-white transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -transtone-y-1/2 p-0.5 text-stone-400 hover:text-stone-600 cursor-pointer"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Seletor de Ordenação */}
        <div className="flex items-center gap-1.5 shrink-0 sm:ml-auto">
          <label htmlFor="sort-select" className="sr-only">
            Ordenar por
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as 'prazo' | 'recentes')}
              className="text-xs font-medium text-stone-700 bg-stone-50 border border-stone-200 rounded-full pl-3.5 pr-8 py-2 w-full sm:w-auto hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-sage-500 cursor-pointer appearance-none"
            >
              <option value="prazo">Pelo prazo (mais urgentes)</option>
              <option value="recentes">Mais recentes primeiro</option>
            </select>
            <SlidersHorizontal className="w-3 h-3 text-stone-400 absolute right-2.5 top-1/2 -transtone-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
