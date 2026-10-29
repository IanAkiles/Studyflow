export type ObjectiveStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyObjective {
  id: string;
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  status: ObjectiveStatus;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export type ObjectiveFormData = {
  title: string;
  description: string;
  deadline: string;
  status: ObjectiveStatus;
};

export type FilterStatus = 'todos' | ObjectiveStatus;
