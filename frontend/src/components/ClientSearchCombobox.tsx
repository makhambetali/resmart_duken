// ClientSearchCombobox.tsx
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
  value: string; // Это может быть client.id или client.name, в зависимости от вашего use case
  onValueChange: (clientId: string, clientName: string) => void;
  onAddNewClient?: (clientName: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ClientSearchCombobox: React.FC<ClientSearchComboboxProps> = ({
  value,
  onValueChange,
  onAddNewClient,
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
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const { mutate: createClient, isLoading: isCreating } = useMutation({
    mutationFn: clientsApi.createClient,
    onSuccess: (newClient) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      // Передаем ID и имя нового клиента
      onValueChange(newClient.id.toString(), newClient.name);
      setOpen(false);
      toast({ 
        title: `Клиент "${newClient.name}" успешно создан.`,
        variant: "default",
        className: "bg-green-500 text-white", 
      });
    },
    onError: () => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать клиента.',
        variant: 'destructive',
      });
    },
  });

  const handleCreateClient = () => {
    if (!searchQuery.trim() || isCreating) return;
    createClient({ name: searchQuery.trim() });
  };

  const handleAddNewClient = () => {
    if (onAddNewClient) {
      onAddNewClient(searchQuery.trim());
    } else {
      handleCreateClient();
    }
  };

  const clients = clientsData?.results || clientsData || [];
  
  // Находим выбранного клиента по ID или имени (в зависимости от value)
  const selectedClient = clients.find((client: Client) => 
    client.id.toString() === value || client.name === value
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
                      Клиент не найден
                    </div>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddNewClient}
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
                        // Передаем и ID и имя при выборе
                        onValueChange(client.id.toString(), client.name);
                        setOpen(false);
                        setSearchQuery('');
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedClient?.id === client.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="truncate font-medium">{client.name}</span>
                        {client.phone && (
                          <span className="text-xs text-muted-foreground">
                            {client.phone}
                          </span>
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