/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Header, type Section } from './components/Header';
import { StatsSummary } from './components/StatsSummary';
import { DpeStudyPlan } from './components/DpeStudyPlan';
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

  // Seção ativa: plano de estudo (padrão) ou metas. Lembra a última escolha.
  const [section, setSection] = useState<Section>(() => {
    try {
      return localStorage.getItem('studyflow_section') === 'metas' ? 'metas' : 'plano';
    } catch {
      return 'plano';
    }
  });
  const changeSection = (next: Section) => {
    setSection(next);
    try {
      localStorage.setItem('studyflow_section', next);
    } catch {
      /* navegação privada */
    }
  };

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
      <div className="min-h-screen flex items-center justify-center bg-paper text-stone-500">
        <div className="animate-pulse flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-sage-600 animate-bounce" />
          <span className="text-sm font-semibold text-stone-700">Iniciando StudyFlow...</span>
        </div>
      </div>
    );
  }

  const hasNoObjectivesAtAll = objectives.length === 0;
  const isFilteredEmpty = !hasNoObjectivesAtAll && filteredObjectives.length === 0;
  const openCreate = () => {
    setEditingObjective(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col selection:bg-sage-200 selection:text-sage-900">
      <Header
        section={section}
        onSectionChange={changeSection}
        onOpenCreateModal={openCreate}
        onResetSamples={handleResetSamples}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {section === 'plano' ? (
          <DpeStudyPlan />
        ) : (
          <div className="space-y-6">
            <StatsSummary objectives={objectives} />

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

            {hasNoObjectivesAtAll ? (
              <EmptyState isFiltered={false} onOpenCreateModal={openCreate} />
            ) : isFilteredEmpty ? (
              <EmptyState
                isFiltered={true}
                onOpenCreateModal={openCreate}
                onClearFilters={() => {
                  setCurrentFilter('todos');
                  setSearchTerm('');
                }}
              />
            ) : (
              <section aria-label="Lista de Objetivos de Estudo">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-stone-600">
                    {filteredObjectives.length} de {objectives.length}{' '}
                    {objectives.length === 1 ? 'meta' : 'metas'}
                  </h3>
                  <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex items-center gap-1.5 rounded-full bg-sage-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sage-800 cursor-pointer sm:hidden"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                    Nova meta
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        )}
      </main>

      {/* Rodapé Acolhedor */}
      <footer className="border-t border-stone-200/70 py-6 mt-8 text-center text-xs text-stone-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-sage-600" />
            <span>StudyFlow — O seu companheiro diário de estudos.</span>
          </p>
          <p>Seus dados ficam salvos só neste navegador.</p>
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
