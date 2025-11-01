import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { clientsApi } from '@/lib/api';
import { Client } from '@/types/client';

interface ClientSearchComboboxProps {
  value: string;
  onValueChange: (clientId: string, clientName: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ClientSearchCombobox: React.FC<ClientSearchComboboxProps> = ({
  value,
  onValueChange,
  placeholder = "Выберите клиента...",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ++ ИСПРАВЛЕНИЕ: Правильный запрос с поиском ++
  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['clients-search-combobox', debouncedSearch],
    queryFn: () => clientsApi.getClients({
      q: debouncedSearch, // Используем поисковый запрос
      page_size: 50,
      page: 1,
      show_zeros: 1, // Показываем всех клиентов
    }),
    enabled: open, // Загружаем только когда попап открыт
  });

  // ++ ИСПРАВЛЕНИЕ: Правильное получение результатов ++
  const clients = clientsData?.results || [];
  const selectedClient = clients.find((client: Client) => client.id === value);

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
          {selectedClient ? (
            <span className="truncate">{selectedClient.name}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}> {/* Отключаем встроенную фильтрацию */}
          <div className="flex items-center border-b px-3">
            <CommandInput
              placeholder="Поиск клиента..."
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
                  <div className="p-4 text-sm text-center text-muted-foreground">
                    {debouncedSearch ? `Клиенты по запросу "${debouncedSearch}" не найдены` : 'Начните вводить имя клиента'}
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {clients.map((client: Client) => (
                    <CommandItem
                      key={client.id}
                      value={client.name} // Используем имя для поиска
                      onSelect={() => {
                        onValueChange(client.id, client.name);
                        setOpen(false);
                        setSearchQuery(''); // Очищаем поиск
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === client.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="truncate font-medium">{client.name}</span>
                        {client.phone_number && (
                          <span className="text-xs text-muted-foreground">{client.phone_number}</span>
                        )}
                      </div>
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