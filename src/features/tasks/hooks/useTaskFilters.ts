import { useState, useMemo } from 'react';
import { Task } from '@/types/task';

type FilterType = 'all' | 'pending' | 'completed' | 'today' | 'week';

interface UseTaskFiltersProps {
  tasks: Task[];
}

export function useTaskFilters({ tasks }: UseTaskFiltersProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Aplicar filtro de busca
    if (search) {
      filtered = filtered.filter(task =>
        task.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Aplicar filtro de status
    switch (filter) {
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'today':
        filtered = filtered.filter(task => {
          if (!task.createdAt) return false;
          const today = new Date();
          const taskDate = new Date(task.createdAt);
          return (
            taskDate.getDate() === today.getDate() &&
            taskDate.getMonth() === today.getMonth() &&
            taskDate.getFullYear() === today.getFullYear()
          );
        });
        break;
      case 'week':
        filtered = filtered.filter(task => {
          if (!task.createdAt) return false;
          const today = new Date();
          const taskDate = new Date(task.createdAt);
          const diffTime = Math.abs(today.getTime() - taskDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        });
        break;
    }

    return filtered;
  }, [tasks, filter, search]);

  return {
    filter,
    setFilter,
    search,
    setSearch,
    filteredTasks
  };
}