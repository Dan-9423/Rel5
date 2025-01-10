import React, { createContext, useContext, useState } from 'react';
import { TaskList, Task } from '@/types/task';

interface TaskContextType {
  taskLists: TaskList[];
  selectedList: TaskList | null;
  addTaskList: (name: string) => void;
  editTaskList: (id: string, name: string) => void;
  deleteTaskList: (id: string) => void;
  selectList: (list: TaskList) => void;
  addTask: (listId: string, content: string) => void;
  toggleTask: (listId: string, taskId: string) => void;
  deleteTask: (listId: string, taskId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [taskLists, setTaskLists] = useState<TaskList[]>([
    {
      id: '1',
      name: 'Tarefas Pessoais',
      tasks: [
        { id: '1', content: 'Fazer compras', completed: false },
        { id: '2', content: 'Academia', completed: true },
      ]
    },
    {
      id: '2',
      name: 'Trabalho',
      tasks: [
        { id: '3', content: 'Reunião com cliente', completed: false },
        { id: '4', content: 'Enviar relatório', completed: false },
      ]
    }
  ]);
  const [selectedList, setSelectedList] = useState<TaskList | null>(null);

  const addTaskList = (name: string) => {
    const newList: TaskList = {
      id: crypto.randomUUID(),
      name,
      tasks: []
    };
    setTaskLists(prev => [...prev, newList]);
  };

  const editTaskList = (id: string, name: string) => {
    setTaskLists(prev => prev.map(list => 
      list.id === id ? { ...list, name } : list
    ));
  };

  const deleteTaskList = (id: string) => {
    setTaskLists(prev => prev.filter(list => list.id !== id));
    if (selectedList?.id === id) {
      setSelectedList(null);
    }
  };

  const selectList = (list: TaskList) => {
    setSelectedList(list);
  };

  const addTask = (listId: string, content: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      content,
      completed: false
    };
    setTaskLists(prev => prev.map(list => 
      list.id === listId 
        ? { ...list, tasks: [newTask, ...list.tasks] }
        : list
    ));
  };

  const toggleTask = (listId: string, taskId: string) => {
    setTaskLists(prev => prev.map(list => 
      list.id === listId
        ? {
            ...list,
            tasks: list.tasks.map(task =>
              task.id === taskId
                ? { ...task, completed: !task.completed }
                : task
            )
          }
        : list
    ));
  };

  const deleteTask = (listId: string, taskId: string) => {
    setTaskLists(prev => prev.map(list => 
      list.id === listId
        ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
        : list
    ));
  };

  return (
    <TaskContext.Provider value={{
      taskLists,
      selectedList,
      addTaskList,
      editTaskList,
      deleteTaskList,
      selectList,
      addTask,
      toggleTask,
      deleteTask
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};