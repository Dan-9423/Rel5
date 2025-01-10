import { useState, useCallback, useMemo } from 'react';

interface UseSearchProps<T> {
  items: T[];
  searchFields: (keyof T)[];
}

export function useSearch<T>({ items, searchFields }: UseSearchProps<T>) {
  const [query, setQuery] = useState('');

  const search = useCallback((value: string) => {
    setQuery(value.toLowerCase());
  }, []);

  const filteredItems = useMemo(() => {
    if (!query) return items;

    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(query);
      })
    );
  }, [items, query, searchFields]);

  return { query, search, filteredItems };
}