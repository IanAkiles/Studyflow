import React from 'react';
import { Compass, Plus, SearchX, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenCreateModal: () => void;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenCreateModal,
  onClearFilters,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto my-6">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-slate-500 mt-1.5 max-w-xs mx-auto">
          Não encontramos nenhum objetivo correspondente aos filtros ou termo de busca selecionados.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
          >
            Limpar filtros e ver todos
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-indigo-100/80 p-8 sm:p-12 text-center max-w-xl mx-auto my-6 shadow-xs relative overflow-hidden">
      {/* Elemento de fundo sutil */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-50 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-sky-50 rounded-full blur-2xl pointer-events-none" />

      <div className="relative">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-sky-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-100 ring-8 ring-indigo-50">
          <Compass className="w-8 h-8 stroke-[2]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Comece no seu ritmo</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Nenhum objetivo cadastrado ainda
        </h3>

        <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
          Grandes conquistas começam com pequenos passos bem definidos. Cadastre seu primeiro objetivo de estudo para dar direção ao seu aprendizado!
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-md hover:shadow-lg shadow-indigo-100 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Cadastrar meu primeiro objetivo</span>
          </button>
        </div>

        {/* Dicas acolhedoras para o iniciante */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-left">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            💡 Dicas para iniciantes:
          </p>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside">
            <li>Prefira metas pequenas: em vez de "Aprender Inglês", tente "Aprender 5 verbos novos".</li>
            <li>Defina um prazo realista para não gerar ansiedade.</li>
            <li>Marque como "Concluído" ao finalizar para sentir o progresso!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
