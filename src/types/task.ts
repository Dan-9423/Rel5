export interface Task {
  id: string;
  content: string;
  completed: boolean;
  createdAt?: string;
  completedAt?: string;
}

export interface TaskList {
  id: string;
  name: string;
  tasks: Task[];
  createdAt?: string;
  updatedAt?: string;
}