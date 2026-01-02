import React, { useState, useEffect } from 'react';
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
import { clientsApi } from '@/lib/api';
import { Client } from '@/types/client';

interface ClientSearchComboboxProps {
  value: string; // ID клиента
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

  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 🔧 Запрос только при открытом попапе
  const { data: clientsData = [], isLoading } = useQuery({
    queryKey: ['clients', 'search', debouncedSearch],
    queryFn: () => clientsApi.getClients({ 
      q: debouncedSearch,
      page_size: 50 
    }),
    enabled: open,
    staleTime: 1000 * 60 * 5, // 5 минут кэша
    gcTime: 1000 * 60 * 10, // 10 минут хранения в кэше
  });

  const { mutate: createClient, isLoading: isCreating } = useMutation({
    mutationFn: clientsApi.createClient,
    onSuccess: (newClient) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      // Передаем ID и имя нового клиента родителю
      onValueChange(newClient.id, newClient.name);
      setOpen(false);
      toast({ 
        title: `Клиент "${newClient.name}" успешно создан.`,
        variant: "default",
        className: "bg-green-500 text-white", 
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка',
        description: error?.body?.error || 'Не удалось создать клиента.',
        variant: 'destructive',
      });
    },
  });

  const handleCreateClient = () => {
    if (!searchQuery.trim() || isCreating) return;
    
    // Отправляем POST запрос на создание клиента
    createClient({ name: searchQuery.trim() });
  };

  const clients = clientsData?.results || clientsData || [];
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
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <CommandInput
  placeholder="Поиск или создание..."
  value={searchQuery}
  onValueChange={(value) => setSearchQuery(value.replace(/(^|\s)\S/g, char => char.toUpperCase()))}
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
                      Клиент не найден
                    </div>
                    {searchQuery.trim() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCreateClient}
                        disabled={isCreating}
                      >
                        {isCreating ? 'Добавление...' : `Добавить "${searchQuery}"`}
                      </Button>
                    )}
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {clients.map((client: Client) => (
                    <CommandItem
                      key={client.id}
                      value={client.name}
                      onSelect={() => {
                        // При выборе существующего клиента передаем его ID и имя
                        if (value === client.id) {
                          // Если клиент уже выбран - сбрасываем
                          onValueChange("", "");
                        } else {
                          onValueChange(client.id, client.name);
                        }
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === client.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="truncate">{client.name}</span>
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