import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ClientFilters as Filters } from '@/types/client';

interface ClientFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
}

export const ClientFilters: React.FC<ClientFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
      {/* Поиск */}
      <div className="space-y-2">
        <Label htmlFor="search">Поиск по имени</Label>
        <Input
          id="search"
          placeholder="Введите имя..."
          value={filters.searchTerm}
          onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
        />
      </div>
      
      {/* Сортировка */}
      <div className="space-y-2">
        <Label>Сортировка</Label>
        <Select
          value={filters.filterType}
          onValueChange={(value) => onFilterChange({ filterType: value as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Последние</SelectItem>
            <SelectItem value="oldest">Старые</SelectItem>
            <SelectItem value="max">Макс. долг</SelectItem>
            <SelectItem value="min">Мин. долг</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* На странице */}
      <div className="space-y-2">
        <Label>На странице</Label>
        <Select
          value={filters.perPage.toString()}
          onValueChange={(value) => onFilterChange({ perPage: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ++ ИЗМЕНЕННЫЙ БЛОК ДЛЯ ИДЕАЛЬНОГО ВЫРАВНИВАНИЯ ++ */}
      <div className="flex flex-col justify-end h-full">
        <div className="flex items-center space-x-2 pb-1">
          <Checkbox
            id="showWithoutDebt"
            checked={filters.showZeros}
            onCheckedChange={(checked) => onFilterChange({ showZeros: !!checked })}
          />
          {/* ++ ИЗМЕНЕНО НАЗВАНИЕ ++ */}
          <Label htmlFor="showWithoutDebt" className="cursor-pointer whitespace-nowrap">
            Показать клиентов без долга
          </Label>
        </div>
      </div>
    </div>
  );
};