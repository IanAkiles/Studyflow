import React from 'react';
import { BookOpen, Plus, Sparkles, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onResetSamples: () => void;
  hasCustomObjectives: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateModal,
  onResetSamples,
  hasCustomObjectives,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo e Título */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-100 ring-4 ring-indigo-50">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Study<span className="text-indigo-600">Flow</span>
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100/80">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
                  Iniciante
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                Organize seu aprendizado passo a passo, no seu próprio ritmo
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {hasCustomObjectives && (
              <button
                type="button"
                onClick={onResetSamples}
                title="Restaurar objetivos de exemplo para iniciantes"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100/80 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Restaurar Exemplos</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-sm hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="font-semibold">Novo Objetivo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
