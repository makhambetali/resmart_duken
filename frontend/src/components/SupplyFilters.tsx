
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

interface SupplyFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  confirmationFilter: 'all' | 'confirmed' | 'unconfirmed';
  onConfirmationFilterChange: (value: 'all' | 'confirmed' | 'unconfirmed') => void;
  onClearFilters: () => void;
  isVisible: boolean;
}

export const SupplyFilters: React.FC<SupplyFiltersProps> = ({
  searchTerm,
  onSearchChange,
  confirmationFilter,
  onConfirmationFilterChange,
  onClearFilters,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            placeholder="Поиск по поставщику или комментарию"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div>
          <Select value={confirmationFilter} onValueChange={onConfirmationFilterChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все поставки</SelectItem>
              <SelectItem value="confirmed">Подтвержденные</SelectItem>
              <SelectItem value="unconfirmed">Не подтвержденные</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="w-full flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Сбросить
          </Button>
        </div>
      </div>
    </div>
  );
};
