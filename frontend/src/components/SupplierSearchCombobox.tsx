import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

import { Check, ChevronsUpDown, Plus } from 'lucide-react';
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

  // 🔧 ИСПРАВЛЕНО: Используем уже загруженные данные о поставщиках
  const { data: suppliersData = [], isLoading: isSuppliersLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => suppliersApi.getSuppliers(),
    enabled: false, // Не делаем запрос, так как данные уже загружены
  });

  // 🔧 ДОБАВЛЕНО: Отдельный запрос для поиска
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['suppliers', 'search', debouncedSearch],
    queryFn: () => suppliersApi.getSuppliers({ 
      q: debouncedSearch,
      page_size: 50 
    }),
    enabled: open && debouncedSearch.length > 0, // Только при открытом попапе и наличии поискового запроса
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const { mutate: createSupplier, isLoading: isCreating } = useMutation({
    mutationFn: suppliersApi.createSupplier,
    onSuccess: (newSupplier) => {
      // Обновляем кэш поставщиков
      queryClient.setQueryData(['suppliers'], (oldData: any) => {
        if (!oldData) return { results: [newSupplier] };
        return {
          ...oldData,
          results: Array.isArray(oldData) 
            ? [...oldData, newSupplier]
            : Array.isArray(oldData.results)
            ? { ...oldData, results: [...oldData.results, newSupplier] }
            : { results: [newSupplier] }
        };
      });
      
      onValueChange(newSupplier.name);
      setOpen(false);
      toast({ 
        title: `Поставщик "${newSupplier.name}" успешно создан.`,
        variant: "default",
        className: "bg-green-500 text-white", 
      });
    },
    onError: (error: any) => {
      let errorMessage = 'Не удалось создать поставщика.';
      if (error && error.body) {
        const fieldErrors = Object.values(error.body);
        if (Array.isArray(fieldErrors[0]) && fieldErrors[0].length > 0) {
          errorMessage = fieldErrors[0][0];
        }
      }
      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const handleCreateSupplier = () => {
    if (!searchQuery.trim() || isCreating) return;
    createSupplier({ name: searchQuery.trim() });
  };

  // Используем либо результаты поиска, либо все поставщики
  const suppliers = debouncedSearch.length > 0 ? (searchResults?.results || searchResults || []) : (suppliersData?.results || suppliersData || []);
  const selectedSupplier = suppliers.find((supplier: Supplier) => supplier.name === value);

  // Функция для фильтрации поставщиков на клиенте при отсутствии поискового запроса
  const getFilteredSuppliers = () => {
    if (debouncedSearch.length === 0) {
      // Фильтруем локально если нет поискового запроса
      return suppliers.filter((supplier: Supplier) => 
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return suppliers;
  };

  const filteredSuppliers = getFilteredSuppliers();
  const showCreateButton = searchQuery.trim().length > 0 && 
                          !filteredSuppliers.some((s: Supplier) => 
                            s.name.toLowerCase() === searchQuery.trim().toLowerCase()
                          );

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
            {isSuppliersLoading || isSearching ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                Загрузка...
              </div>
            ) : (
              <>
                {filteredSuppliers.length === 0 && searchQuery.length > 0 && (
                  <CommandEmpty>
                    <div className="p-4 text-sm text-center">
                      <div className="text-muted-foreground mb-2">
                        Поставщик не найден
                      </div>
                      {showCreateButton && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCreateSupplier}
                          disabled={isCreating}
                          className="gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          {isCreating ? 'Добавление...' : `Добавить "${searchQuery}"`}
                        </Button>
                      )}
                    </div>
                  </CommandEmpty>
                )}
                {filteredSuppliers.length > 0 && (
                  <CommandGroup>
                    {filteredSuppliers.map((supplier: Supplier) => (
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
                    {/* Кнопка создания нового поставщика, если нет точного совпадения */}
                    {showCreateButton && (
                      <CommandItem
                        value={searchQuery}
                        onSelect={handleCreateSupplier}
                        className="cursor-pointer text-blue-600 font-medium"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Создать "{searchQuery}"</span>
                      </CommandItem>
                    )}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};