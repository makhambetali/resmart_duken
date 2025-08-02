import React, { useState, useEffect } from 'react';
// ++ ИМПОРТЫ ДЛЯ РАБОТЫ С REACT QUERY И УВЕДОМЛЕНИЯМИ ++
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { suppliersApi } from '@/lib/api';
import { Supplier } from '@/types/supply';

interface SupplierSearchComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SupplierSearchCombobox: React.FC<SupplierSearchComboboxProps> = ({
  value,
  onValueChange,
  placeholder = "Выберите поставщика...",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // ++ ИНИЦИАЛИЗАЦИЯ ХУКОВ ++
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers', debouncedSearch],
    // Предполагается, что ваша функция getSuppliers может принимать строку для поиска
    queryFn: () => suppliersApi.getSuppliers(), 
    enabled: true,
  });

  // ++ 1. МУТАЦИЯ ДЛЯ СОЗДАНИЯ ПОСТАВЩИКА ++
  const { mutate: createSupplier, isLoading: isCreating } = useMutation({
    mutationFn: suppliersApi.createSupplier,
    onSuccess: (newSupplier) => {
      // Обновляем список поставщиков в кеше
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      // Сразу выбираем нового поставщика
      onValueChange(newSupplier.name);
      // Закрываем выпадающий список
      setOpen(false);
      toast({ title: `Поставщик "${newSupplier.name}" успешно создан.`,variant: "default",
        className: "bg-green-500 text-white", });
    },
    onError: () => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать поставщика.',
        variant: 'destructive',
      });
    },
  });

  // ++ 2. ОБРАБОТЧИК ДЛЯ КНОПКИ "ДОБАВИТЬ" ++
  const handleCreateSupplier = () => {
    // Проверяем, что строка не пустая и не идет процесс создания
    if (!searchQuery.trim() || isCreating) return;
    createSupplier({ name: searchQuery.trim() });
  };

  const selectedSupplier = suppliers.find(supplier => supplier.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedSupplier ? (
            <span className="truncate">{selectedSupplier.name}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <CommandInput
              placeholder="Поиск или создание..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList>
            {isLoading ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                Загрузка...
              </div>
            ) : (
              <>
                <CommandEmpty>
                  <div className="p-4 text-sm text-center">
                    <div className="text-muted-foreground mb-2">
                      Поставщик не найден
                    </div>
                    {searchQuery && (
                      // ++ 3. ОБНОВЛЕННАЯ КНОПКА ++
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCreateSupplier}
                        disabled={isCreating}
                      >
                        {isCreating ? 'Добавление...' : `Добавить "${searchQuery}"`}
                      </Button>
                    )}
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {suppliers.map((supplier) => (
                    <CommandItem
                      key={supplier.id}
                      value={supplier.name}
                      onSelect={(currentValue) => {
                        onValueChange(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === supplier.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="truncate">{supplier.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};