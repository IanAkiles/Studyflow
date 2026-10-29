import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, AlignLeft, Sparkles, AlertCircle } from 'lucide-react';
import { StudyObjective, ObjectiveFormData, ObjectiveStatus } from '../types/objective';

interface ObjectiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ObjectiveFormData) => void;
  initialData?: StudyObjective | null;
}

export const ObjectiveFormModal: React.FC<ObjectiveFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ObjectiveStatus>('nao_iniciado');
  const [error, setError] = useState<string | null>(null);

  // Preenche os dados quando for edição ou limpa quando for criação
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setDeadline(initialData.deadline || '');
      setStatus(initialData.status);
    } else {
      setTitle('');
      setDescription('');
      // Sugere por padrão uma data daqui a 3 dias para facilitar
      const defaultDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setDeadline(defaultDate);
      setStatus('nao_iniciado');
    }
    setError(null);
  }, [initialData, isOpen]);

  // Atalhos de prazo para estudantes iniciantes
  const setQuickDeadline = (daysFromNow: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromNow);
    setDeadline(target.toISOString().split('T')[0]);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Por favor, informe o título do objetivo. É o que vai te orientar no estudo!');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-slate-800">
                {isEditing ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Atualize os detalhes da sua meta de aprendizado'
                  : 'Defina claramente o que você quer aprender e até quando'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Título */}
          <div>
            <label htmlFor="goal-title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Título do Objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ex.: Praticar 10 exercícios de frações"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 hover:bg-white transition-colors"
              autoFocus
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Dica: Seja específico e direto para saber exatamente quando terminou.
            </p>
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="goal-desc" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Descrição / Detalhes (Opcional)</span>
            </label>
            <textarea
              id="goal-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Quais materiais vai usar? Algum link ou anotação importante para não esquecer?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 hover:bg-white transition-colors resize-none"
            />
          </div>

          {/* Prazo */}
          <div>
            <label htmlFor="goal-deadline" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Prazo Final</span>
            </label>
            <input
              id="goal-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 hover:bg-white transition-colors"
            />

            {/* Atalhos rápidos de prazo */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[11px] text-slate-400">Atalhos rápidos:</span>
              <button
                type="button"
                onClick={() => setQuickDeadline(0)}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(3)}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                +3 dias
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(7)}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                1 semana
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(15)}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                15 dias
              </button>
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="goal-status" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-slate-400" />
              <span>Status Atual</span>
            </label>
            <select
              id="goal-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ObjectiveStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
            >
              <option value="nao_iniciado">🟡 Não iniciado (Aguardando)</option>
              <option value="em_andamento">🔵 Em andamento (Estudando)</option>
              <option value="concluido">🟢 Concluído (Meta atingida)</option>
            </select>
          </div>

          {/* Botões do Rodapé */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isEditing ? 'Salvar Alterações' : 'Criar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
