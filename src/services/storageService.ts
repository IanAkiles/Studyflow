import { StudyObjective, ObjectiveFormData, ObjectiveStatus } from '../types/objective';

const STORAGE_KEY = 'studyflow_objectives_v1';

// Exemplos iniciais acolhedores para estudantes iniciantes
const INITIAL_SAMPLE_OBJECTIVES: StudyObjective[] = [
  {
    id: 'sample-1',
    title: 'Compreender os conceitos básicos de Lógica e Variáveis',
    description: 'Assistir às 3 primeiras videoaulas e resolver 5 exercícios práticos no caderno.',
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Criar um cronograma semanal de estudos',
    description: 'Reservar 45 minutos diários de segunda a sexta para foco sem distrações no celular.',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Ler o Capítulo 1 do livro de estudos',
    description: 'Fazer anotações em tópicos com as principais dúvidas para pesquisar depois.',
    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const storageService = {
  /**
   * Obtém todos os objetivos salvos no localStorage.
   * Se for a primeira visita do estudante, inicializa com exemplos acolhedores.
   */
  getObjectives(): StudyObjective[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Primeira inicialização
        this.saveObjectives(INITIAL_SAMPLE_OBJECTIVES);
        return INITIAL_SAMPLE_OBJECTIVES;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de objetivos no localStorage.
   */
  saveObjectives(objectives: StudyObjective[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
    } catch (error) {
      console.error('Erro ao gravar objetivos no localStorage:', error);
    }
  },

  /**
   * Cria e persiste um novo objetivo de estudo.
   */
  createObjective(data: ObjectiveFormData): StudyObjective {
    const current = this.getObjectives();
    const newObjective: StudyObjective = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `obj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [newObjective, ...current];
    this.saveObjectives(updatedList);
    return newObjective;
  },

  /**
   * Atualiza um objetivo existente pelo ID.
   */
  updateObjective(id: string, updates: Partial<ObjectiveFormData>): StudyObjective | null {
    const current = this.getObjectives();
    const index = current.findIndex((obj) => obj.id === id);
    if (index === -1) return null;

    const updatedItem: StudyObjective = {
      ...current[index],
      ...updates,
      title: updates.title !== undefined ? updates.title.trim() : current[index].title,
      description: updates.description !== undefined ? updates.description.trim() : current[index].description,
      updatedAt: new Date().toISOString(),
    };

    current[index] = updatedItem;
    this.saveObjectives(current);
    return updatedItem;
  },

  /**
   * Altera rapidamente apenas o status de um objetivo.
   */
  updateStatus(id: string, status: ObjectiveStatus): StudyObjective | null {
    return this.updateObjective(id, { status });
  },

  /**
   * Exclui um objetivo pelo ID.
   */
  deleteObjective(id: string): boolean {
    const current = this.getObjectives();
    const filtered = current.filter((obj) => obj.id !== id);
    if (filtered.length === current.length) return false;

    this.saveObjectives(filtered);
    return true;
  },

  /**
   * Limpa todos os dados ou redefine para os exemplos.
   */
  resetToSampleData(): StudyObjective[] {
    this.saveObjectives(INITIAL_SAMPLE_OBJECTIVES);
    return INITIAL_SAMPLE_OBJECTIVES;
  },

  /**
   * Limpa totalmente todos os objetivos.
   */
  clearAll(): void {
    this.saveObjectives([]);
  }
};
