import React, { useState, useEffect, useRef } from 'react';
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
  autoFocus?: boolean; // Добавляем пропс autoFocus
  autoOpen?: boolean; // Добавляем пропс autoOpen
}

export const SupplierSearchCombobox: React.FC<SupplierSearchComboboxProps> = ({
  value,
  onValueChange,
  placeholder = "Выберите поставщика...",
  disabled = false,
  autoFocus = false,
  autoOpen = false,
}) => {
  const [open, setOpen] = useState(autoOpen); // Используем autoOpen для начального состояния
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const commandInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Фокус на инпут при открытии попапа
  useEffect(() => {
    if (open && commandInputRef.current && autoFocus) {
      // Небольшая задержка для гарантии, что компонент полностью отрендерился
      const timeoutId = setTimeout(() => {
        commandInputRef.current?.focus();
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [open, autoFocus]);

  // Автооткрытие при autoOpen
  useEffect(() => {
    if (autoOpen && !disabled) {
      setOpen(true);
    }
  }, [autoOpen, disabled]);

  // 🔧 ИСПРАВЛЕНО: Добавлен enabled для предотвращения запросов при закрытом попапе
  const { data: suppliersData = [], isLoading } = useQuery({
    queryKey: ['suppliers', 'search', debouncedSearch],
    queryFn: () => suppliersApi.getSuppliers({ 
      q: debouncedSearch,
      page_size: 50 
    }),
    enabled: open, // Запрос только при открытом попапе
    staleTime: 1000 * 60 * 5, // 5 минут кэша
    gcTime: 1000 * 60 * 10, // 10 минут хранения в кэше
  });

  const { mutate: createSupplier, isLoading: isCreating } = useMutation({
    mutationFn: suppliersApi.createSupplier,
    onSuccess: (newSupplier) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      onValueChange(newSupplier.name);
      setOpen(false);
      toast({ 
        title: `Поставщик "${newSupplier.name}" успешно создан.`,
        variant: "default",
        className: "bg-green-500 text-white", 
      });
    },
    onError: () => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать поставщика.',
        variant: 'destructive',
      });
    },
  });

  const handleCreateSupplier = () => {
    if (!searchQuery.trim() || isCreating) return;
    createSupplier({ name: searchQuery.trim() });
  };

  const suppliers = suppliersData?.results || suppliersData || [];
  const selectedSupplier = suppliers.find((supplier: Supplier) => supplier.name === value);

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
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <CommandInput
              ref={commandInputRef}
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
                  {suppliers.map((supplier: Supplier) => (
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