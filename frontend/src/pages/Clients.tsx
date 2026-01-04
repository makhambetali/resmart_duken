// [file name]: Clients.tsx
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
import { Plus, User, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const Clients = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [modalMode, setModalMode] = useState<'add-debt' | 'edit'>('edit');
  const [initialTab, setInitialTab] = useState<string>('debts');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    filterType: 'latest',
    perPage: 10,
    currentPage: 1,
    showZeros: true,
  });

  const { data: clientsData, isLoading: clientsLoading, error: clientsError, isFetching: isFetching } = useQuery({
    queryKey: ['clients', filters],
    queryFn: () => clientsApi.getClients({
      page: filters.currentPage,
      page_size: filters.perPage,
      filter_tag: filters.filterType,
      q: filters.searchTerm,
      show_zeros: filters.showZeros ? 1 : 0,
    }),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
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
    setModalMode('edit');
    setInitialTab('debts');
    setIsClientModalOpen(true);
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setModalMode('add-debt');
    setInitialTab('add-debt');
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
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Покупатели</h1>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm sm:text-base">
              Ошибка загрузки данных. Проверьте соединение с сервером.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Заголовок с информацией о пользователе */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Покупатели</h1>
            <div className="flex items-center gap-2 mt-1 sm:mt-2">
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                <User className="h-3 w-3" />
                <span>{user?.username}</span>
              </div>
              {isFetching && (
                <Badge variant="outline" className="text-xs">
                  Обновление...
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              Найдено: {clientsData?.count || 0}
            </div>
            <Button 
              onClick={handleAddClient} 
              disabled={createClientMutation.isPending}
              className="gap-1.5 flex-1 sm:flex-none"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Добавить клиента</span>
              <span className="sm:hidden">Добавить</span>
            </Button>
          </div>
        </div>
        
        {/* Фильтры */}
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-4">
              {/* Mobile filter toggle */}
              <div className="sm:hidden">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full justify-between"
                  size="sm"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Фильтры</span>
                    {filters.searchTerm && (
                      <Badge variant="secondary" className="ml-1">
                        Активно
                      </Badge>
                    )}
                  </div>
                  <span className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </Button>
              </div>

              {/* Filter content */}
              <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
                <ClientFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  isMobile={true}
                />
              </div>

              {/* Mobile count display */}
              <div className="sm:hidden">
                <div className="text-xs font-medium text-muted-foreground mb-2">Результаты</div>
                <div className="text-sm p-2 bg-gray-50 rounded">
                  Найдено: {clientsData?.count || 0}
                  {isFetching && (
                    <span className="ml-2 text-blue-500">(обновление...)</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Таблица клиентов */}
        {clientsLoading ? (
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 sm:h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
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
          mode={modalMode}
          initialTab={initialTab}
        />
      </div>
    </Layout>
  );
};

export default Clients;