import { Button } from '@/components/ui/button';
import { FilterType } from '@/hooks/useFilter';

interface FilterOption {
  value: FilterType;
  label: string;
  icon?: React.ReactNode;
}

interface FilterBarProps {
  options: FilterOption[];
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterBar({ options, currentFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={currentFilter === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(option.value)}
        >
          {option.icon}
          {option.label}
        </Button>
      ))}
    </div>
  );
}