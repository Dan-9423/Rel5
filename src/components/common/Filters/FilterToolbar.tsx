import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '../SearchInput';

interface FilterToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
}

export function FilterToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
  actions
}: FilterToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4 flex-1">
        {onSearchChange && (
          <SearchInput
            value={searchValue || ''}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            className="max-w-sm"
          />
        )}
        {filters}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}