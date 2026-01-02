import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { ClientTable } from '@/components/ClientTable';
import { ClientFilters } from '@/components/ClientFilters';
import { ClientModal } from '@/components/ClientModal';
import { Client, AddClientForm, ClientFilters as Filters } from '@/types/client';
import { clientsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const Clients = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    filterType: 'latest',
    perPage: 10,
    currentPage: 1,
    showZeros: true,
  });

  const { data: clientsData, isLoading: clientsLoading, error: clientsError } = useQuery({
    queryKey: ['clients', filters],
    queryFn: () => clientsApi.getClients({
      page: filters.currentPage,
      page_size: filters.perPage,
      filter_tag: filters.filterType,
      q: filters.searchTerm,
      show_zeros: filters.showZeros ? 1 : 0,
    }),
    staleTime: 1000 * 60, // 1 минута кэша, чтобы предотвратить частые запросы
    gcTime: 1000 * 60 * 5, // 5 минут хранения в кэше
  });

  const createClientMutation = useMutation({
    mutationFn: clientsApi.createClient,
    onSuccess: () => {
      toast({ title: 'Клиент добавлен', variant: "default", className: "bg-green-500 text-white", });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsClientModalOpen(false);
    },
    onError: (error: any) => {
      let errorMessage = 'Произошла неизвестная ошибка.';
      if (error && error.body) {
        const fieldErrors = Object.values(error.body);
        if (Array.isArray(fieldErrors[0]) && fieldErrors[0].length > 0) {
          errorMessage = fieldErrors[0][0];
        }
      }
      toast({ 
        title: 'Ошибка добавления клиента', 
        description: errorMessage,
        variant: 'destructive' 
      });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddClientForm }) =>
      clientsApi.updateClient(id, data),
    onSuccess: () => {
      toast({ title: 'Клиент обновлен', variant: "default", className: "bg-green-500 text-white", });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsClientModalOpen(false);
    },
    onError: (error: any) => {
      let errorMessage = 'Произошла неизвестная ошибка.';
      if (error && error.body) {
        const fieldErrors = Object.values(error.body);
        if (Array.isArray(fieldErrors[0]) && fieldErrors[0].length > 0) {
          errorMessage = fieldErrors[0][0];
        }
      }
      toast({ 
        title: 'Ошибка добавления клиента', 
        description: errorMessage,
        variant: 'destructive' 
      });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: clientsApi.deleteClient,
    onSuccess: () => {
      toast({ title: 'Клиент удален', variant: "default", className: "bg-green-500 text-white",});
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: () => {
      toast({ title: 'Ошибка удаления клиента', variant: 'destructive' });
    },
  });

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsClientModalOpen(true);
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setIsClientModalOpen(true);
  };
  
  const handleDeleteClient = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить клиента?')) {
      deleteClientMutation.mutate(id);
    }
  };

  const handleClientSubmit = async (data: AddClientForm) => {
    if (editingClient) {
      await updateClientMutation.mutateAsync({ id: editingClient.id, data });
    } else {
      await createClientMutation.mutateAsync(data);
    }
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, currentPage: page }));
  };

  if (clientsError) {
    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Покупатели</h1>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive">
              Ошибка загрузки данных. Проверьте соединение с сервером.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onAddSupplyClick={handleAddClient}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Покупатели</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Найдено: {clientsData?.count || 0}
            </div>
            <Button onClick={handleAddClient}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <ClientFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </CardContent>
        </Card>

        {clientsLoading ? (
          <div className="bg-card rounded-lg shadow p-6 text-center">
            <p className="text-muted-foreground">Загрузка клиентов...</p>
          </div>
        ) : (
          <ClientTable 
            clients={clientsData?.results || []}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
            totalCount={clientsData?.count || 0}
            currentPage={filters.currentPage}
            perPage={filters.perPage}
            onPageChange={handlePageChange}
          />
        )}

        <ClientModal
          open={isClientModalOpen}
          onOpenChange={setIsClientModalOpen}
          client={editingClient}
          onSubmit={handleClientSubmit}
          onDelete={handleDeleteClient}
        />
      </div>
    </Layout>
  );
};

export default Clients;