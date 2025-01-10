import { useState, useCallback } from 'react';

export function useDialog(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState<any>(null);

  const open = useCallback((dialogData?: any) => {
    setData(dialogData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  return { isOpen, data, open, close };
}