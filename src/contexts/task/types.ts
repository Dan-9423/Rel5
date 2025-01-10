import { Task, TaskList } from '@/types/task';

export interface TaskState {
  lists: TaskList[];
  selectedList: TaskList | null;
  isLoading: boolean;
  error: string | null;
}

export interface TaskContextValue extends TaskState {
  addList: (name: string) => void;
  updateList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  selectList: (list: TaskList | null) => void;
  addTask: (listId: string, content: string) => void;
  updateTask: (listId: string, taskId: string, content: string) => void;
  toggleTask: (listId: string, taskId: string) => void;
  deleteTask: (listId: string, taskId: string) => void;
  reorderTasks: (listId: string, startIndex: number, endIndex: number) => void;
}