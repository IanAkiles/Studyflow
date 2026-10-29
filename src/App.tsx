/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsSummary } from './components/StatsSummary';
import { ObjectiveCard } from './components/ObjectiveCard';
import { ObjectiveFormModal } from './components/ObjectiveFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { FilterBar } from './components/FilterBar';
import { storageService } from './services/storageService';
import { StudyObjective, ObjectiveFormData, ObjectiveStatus, FilterStatus } from './types/objective';
import { Plus, GraduationCap } from 'lucide-react';

export default function App() {
  const [objectives, setObjectives] = useState<StudyObjective[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Estados dos Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<StudyObjective | null>(null);
  const [objectiveToDelete, setObjectiveToDelete] = useState<StudyObjective | null>(null);

  // Estados de Filtro e Busca
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'prazo' | 'recentes'>('prazo');

  // Carrega os dados do localStorage na montagem inicial
  useEffect(() => {
    const loaded = storageService.getObjectives();
    setObjectives(loaded);
    setIsLoaded(true);
  }, []);

  // Handlers de Operações CRUD
  const handleCreateObjective = (data: ObjectiveFormData) => {
    const created = storageService.createObjective(data);
    setObjectives((prev) => [created, ...prev]);
  };

  const handleUpdateObjective = (data: ObjectiveFormData) => {
    if (!editingObjective) return;
    const updated = storageService.updateObjective(editingObjective.id, data);
    if (updated) {
      setObjectives((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    }
  };

  const handleStatusChange = (id: string, newStatus: ObjectiveStatus) => {
    const updated = storageService.updateStatus(id, newStatus);
    if (updated) {
      setObjectives((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    }
  };

  const handleDeleteConfirmed = () => {
    if (!objectiveToDelete) return;
    const success = storageService.deleteObjective(objectiveToDelete.id);
    if (success) {
      setObjectives((prev) => prev.filter((item) => item.id !== objectiveToDelete.id));
    }
    setObjectiveToDelete(null);
  };

  const handleResetSamples = () => {
    const samples = storageService.resetToSampleData();
    setObjectives(samples);
  };

  // Filtragem e Ordenação
  const filteredObjectives = useMemo(() => {
    return objectives
      .filter((obj) => {
        // Filtro por status
        if (currentFilter !== 'todos' && obj.status !== currentFilter) {
          return false;
        }

        // Filtro por busca de texto
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = obj.title.toLowerCase().includes(query);
          const matchDesc = obj.description?.toLowerCase().includes(query) || false;
          return matchTitle || matchDesc;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'prazo') {
          // Objetivos sem prazo vão para o final
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        } else {
          // Mais recentes primeiro
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [objectives, currentFilter, searchTerm, sortBy]);

  // Se ainda estiver carregando do storage
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="animate-pulse flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-indigo-500 animate-bounce" />
          <span className="text-sm font-semibold text-slate-700">Iniciando StudyFlow...</span>
        </div>
      </div>
    );
  }

  const hasNoObjectivesAtAll = objectives.length === 0;
  const isFilteredEmpty = !hasNoObjectivesAtAll && filteredObjectives.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Barra de Navegação Superior */}
      <Header
        onOpenCreateModal={() => {
          setEditingObjective(null);
          setIsFormModalOpen(true);
        }}
        onResetSamples={handleResetSamples}
        hasCustomObjectives={hasNoObjectivesAtAll || objectives.length > 0}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Painel de Estatísticas e Progresso */}
        <StatsSummary objectives={objectives} />

        {/* Barra de Filtros, Pesquisa e Ordenação */}
        {!hasNoObjectivesAtAll && (
          <FilterBar
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            objectives={objectives}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />
        )}

        {/* Lista de Cartões de Objetivos ou Estado Vazio */}
        {hasNoObjectivesAtAll ? (
          <EmptyState
            isFiltered={false}
            onOpenCreateModal={() => {
              setEditingObjective(null);
              setIsFormModalOpen(true);
            }}
          />
        ) : isFilteredEmpty ? (
          <EmptyState
            isFiltered={true}
            onOpenCreateModal={() => {
              setEditingObjective(null);
              setIsFormModalOpen(true);
            }}
            onClearFilters={() => {
              setCurrentFilter('todos');
              setSearchTerm('');
            }}
          />
        ) : (
          <section aria-label="Lista de Objetivos de Estudo">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">
                Seus Objetivos{' '}
                <span className="text-xs font-semibold text-slate-400 font-normal">
                  (Exibindo {filteredObjectives.length} de {objectives.length})
                </span>
              </h3>

              <button
                type="button"
                onClick={() => {
                  setEditingObjective(null);
                  setIsFormModalOpen(true);
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar outro</span>
              </button>
            </div>

            {/* Grid de Cartões de Objetivos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredObjectives.map((objective) => (
                <ObjectiveCard
                  key={objective.id}
                  objective={objective}
                  onEdit={(obj) => {
                    setEditingObjective(obj);
                    setIsFormModalOpen(true);
                  }}
                  onDeleteRequest={(obj) => setObjectiveToDelete(obj)}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Rodapé Acolhedor */}
      <footer className="border-t border-slate-200/70 bg-white/60 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span>StudyFlow — O seu companheiro diário de estudos.</span>
          </p>
          <p>Dados salvos com segurança no seu navegador via localStorage.</p>
        </div>
      </footer>

      {/* Modal de Formulário (Criação e Edição) */}
      <ObjectiveFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingObjective(null);
        }}
        onSubmit={(data) => {
          if (editingObjective) {
            handleUpdateObjective(data);
          } else {
            handleCreateObjective(data);
          }
        }}
        initialData={editingObjective}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={Boolean(objectiveToDelete)}
        objective={objectiveToDelete}
        onClose={() => setObjectiveToDelete(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
