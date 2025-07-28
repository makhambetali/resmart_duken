import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface SupplierFiltersProps {
  filters: { searchTerm: string; ordering: string };
  onFilterChange: (filters: Partial<{ searchTerm: string; ordering: string }>) => void;
  onClearFilters: () => void;
}

export const SupplierFilters: React.FC<SupplierFiltersProps> = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="search">Поиск по названию</Label>
            <Input
              id="search"
              placeholder="Введите название..."
              value={filters.searchTerm}
              onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Сортировать по</Label>
            <Select
              value={filters.ordering}
              onValueChange={(value) => onFilterChange({ ordering: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-last_accessed">Последней активности</SelectItem>
                <SelectItem value="-date_added">Дате добавления</SelectItem>
                <SelectItem value="name">Имени (А-Я)</SelectItem>
                <SelectItem value="-name">Имени (Я-А)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
            <Button variant="ghost" onClick={onClearFilters}>
                Сбросить все фильтры
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};