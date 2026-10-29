import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { StudyObjective } from '../types/objective';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  objective: StudyObjective | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  objective,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !objective) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
      >
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h2 id="delete-dialog-title" className="text-lg font-bold text-slate-900">
            Excluir este objetivo?
          </h2>
          <p id="delete-dialog-desc" className="text-sm text-slate-600 mt-2">
            Você está prestes a remover o objetivo:
          </p>

          <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-800 break-words">
            "{objective.title}"
          </div>

          <p className="text-xs text-rose-600 mt-2.5">
            Essa ação removerá o objetivo do seu armazenamento local e não poderá ser desfeita.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Sim, excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
