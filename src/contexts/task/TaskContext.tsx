import { createStoreContext } from '@/lib/context/createStoreContext';
import { TaskState, TaskContextValue } from './types';
import { useCallback } from 'react';

const initialState: TaskState = {
  lists: [],
  selectedList: null,
  isLoading: false,
  error: null,
};

const [TaskStoreProvider, useTaskStore] = createStoreContext({
  name: 'Task',
  initialState,
  persistKey: 'task_state',
});

export function TaskProvider({ children }: { children: React.ReactNode }) {
  return <TaskStoreProvider>{children}</TaskStoreProvider>;
}

export function useTask(): TaskContextValue {
  const [state, setState] = useTaskStore();

  const addList = useCallback((name: string) => {
    const newList = {
      id: crypto.randomUUID(),
      name,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setState({
      ...state,
      lists: [...state.lists, newList],
    });
  }, [state, setState]);

  const updateList = useCallback((id: string, name: string) => {
    setState({
      ...state,
      lists: state.lists.map(list =>
        list.id === id
          ? {
              ...list,
              name,
              updatedAt: new Date().toISOString(),
            }
          : list
      ),
    });
  }, [state, setState]);

  const deleteList = useCallback((id: string) => {
    setState({
      ...state,
      lists: state.lists.filter(list => list.id !== id),
      selectedList: state.selectedList?.id === id ? null : state.selectedList,
    });
  }, [state, setState]);

  const selectList = useCallback((list: typeof state.selectedList) => {
    setState({
      ...state,
      selectedList: list,
    });
  }, [state, setState]);

  const addTask = useCallback((listId: string, content: string) => {
    const newTask = {
      id: crypto.randomUUID(),
      content,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setState({
      ...state,
      lists: state.lists.map(list =>
        list.id === listId
          ? {
              ...list,
              tasks: [newTask, ...list.tasks],
              updatedAt: new Date().toISOString(),
            }
          : list
      ),
    });
  }, [state, setState]);

  const updateTask = useCallback((listId: string, taskId: string, content: string) => {
    setState({
      ...state,
      lists: state.lists.map(list =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.map(task =>
                task.id === taskId
                  ? { ...task, content }
                  : task
              ),
              updatedAt: new Date().toISOString(),
            }
          : list
      ),
    });
  }, [state, setState]);

  const toggleTask = useCallback((listId: string, taskId: string) => {
    setState({
      ...state,
      lists: state.lists.map(list =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.map(task =>
                task.id === taskId
                  ? {
                      ...task,
                      completed: !task.completed,
                      completedAt: !task.completed ? new Date().toISOString() : undefined,
                    }
                  : task
              ),
              updatedAt: new Date().toISOString(),
            }
          : list
      ),
    });
  }, [state, setState]);

  const deleteTask = useCallback((listId: string, taskId: string) => {
    setState({
      ...state,
      lists: state.lists.map(list =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.filter(task => task.id !== taskId),
              updatedAt: new Date().toISOString(),
            }
          : list
      ),
    });
  }, [state, setState]);

  const reorderTasks = useCallback((listId: string, startIndex: number, endIndex: number) => {
    const list = state.lists.find(l => l.id === listId);
    if (!list) return;

    const tasks = [...list.tasks];
    const [removed] = tasks.splice(startIndex, 1);
    tasks.splice(endIndex, 0, removed);

    setState({
      ...state,
      lists: state.lists.map(l =>
        l.id === listId
          ? {
              ...l,
              tasks,
              updatedAt: new Date().toISOString(),
            }
          : l
      ),
    });
  }, [state, setState]);

  return {
    ...state,
    addList,
    updateList,
    deleteList,
    selectList,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    reorderTasks,
  };
}