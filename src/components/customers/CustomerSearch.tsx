import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface CustomerSearchProps {
  onSearch: (query: string) => void;
}

export default function CustomerSearch({ onSearch }: CustomerSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
      <Input
        type="text"
        placeholder="Buscar sacados..."
        onChange={(e) => onSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}