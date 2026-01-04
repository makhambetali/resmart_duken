// [file name]: ClientFilters.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientFilters as Filters } from '@/types/client';
import { Search } from 'lucide-react';

interface ClientFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  isMobile?: boolean;
}

export const ClientFilters: React.FC<ClientFiltersProps> = ({
  filters,
  onFilterChange,
  isMobile = false,
}) => {
  return (
    <div className={`space-y-4 ${isMobile ? '' : 'grid grid-cols-1 md:grid-cols-3 gap-4'}`}>
      <div className="space-y-2">
        <Label htmlFor="search" className="text-xs sm:text-sm">Поиск</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="Поиск по имени..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            className="pl-9 text-sm"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="filterType" className="text-xs sm:text-sm">Сортировка</Label>
        <Select
          value={filters.filterType}
          onValueChange={(value) => onFilterChange({ filterType: value as any })}
        >
          <SelectTrigger id="filterType" className="text-sm">
            <SelectValue placeholder="Сортировать по..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Последние</SelectItem>
            <SelectItem value="by_name">По имени</SelectItem>
            <SelectItem value="chosen">Избранные</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="perPage" className="text-xs sm:text-sm">На странице</Label>
        <Select
          value={String(filters.perPage)}
          onValueChange={(value) => onFilterChange({ perPage: Number(value) })}
        >
          <SelectTrigger id="perPage" className="text-sm">
            <SelectValue placeholder="Количество" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};