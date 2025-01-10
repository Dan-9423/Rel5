import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DataListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
}

export function DataList<T>({
  data,
  renderItem,
  emptyState,
  className
}: DataListProps<T>) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {data.map((item, index) => renderItem(item, index))}
    </div>
  );
}