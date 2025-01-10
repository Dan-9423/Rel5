import { useState } from 'react';

export type FilterType = 'all' | 'pending' | 'completed' | 'draft' | 'saved' | 'sent';

export function useFilter(initialFilter: FilterType = 'all') {
  const [filter, setFilter] = useState<FilterType>(initialFilter);

  const filterItems = <T extends { status?: string; completed?: boolean }>(
    items: T[],
    filterType: FilterType
  ): T[] => {
    switch (filterType) {
      case 'pending':
        return items.filter(item => !item.completed);
      case 'completed':
        return items.filter(item => item.completed);
      case 'draft':
        return items.filter(item => item.status === 'draft');
      case 'saved':
        return items.filter(item => item.status === 'saved');
      case 'sent':
        return items.filter(item => item.status === 'sent');
      default:
        return items;
    }
  };

  return { filter, setFilter, filterItems };
}