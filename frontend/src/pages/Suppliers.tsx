import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { SupplierTable } from '@/components/SupplierTable';
import { SupplierModal } from '@/components/SupplierModal';
import { SupplierFilters } from '@/components/SupplierFilters';
import { Supplier, CreateSupplierData } from '@/types';
import { suppliersApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ListFilter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const SuppliersPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Запрос данных
  const { data: suppliers = [], isLoading: suppliersLoading, error: suppliersError } = useQuery({
    queryKey: ['suppliers', searchTerm],
    queryFn: () => suppliersApi.getSuppliers(searchTerm),
  });

  // Мутации
  const createMutation = useMutation({
    mutationFn: suppliersApi.createSupplier,
    onSuccess: () => {
      toast({ title: 'Поставщик создан' });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsModalOpen(false);
    },
    onError: (error: any) => toast({ title: 'Ошибка', description: error.body?.name?.[0] || 'Не удалось создать поставщика', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSupplierData> }) => suppliersApi.updateSupplier(id, data),
    onSuccess: () => {
      toast({ title: 'Поставщик обновлен' });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsModalOpen(false);
    },
    onError: () => toast({ title: 'Ошибка', description: 'Не удалось обновить поставщика', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: suppliersApi.deleteSupplier,
    onSuccess: () => {
      toast({ title: 'Поставщик удален' });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: () => toast({ title: 'Ошибка', description: 'Не удалось удалить поставщика', variant: 'destructive' }),
  });

  // Обработчики
  const handleAdd = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого поставщика?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = async (data: CreateSupplierData) => {
    if (editingSupplier) {
      await updateMutation.mutateAsync({ id: editingSupplier.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  if (suppliersError) {
    return <Layout><div className="text-red-600">Ошибка загрузки данных.</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Поставщики</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <ListFilter className="mr-2 h-4 w-4" />
              {showFilters ? 'Скрыть фильтры' : 'Фильтры'}
            </Button>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить
            </Button>
          </div>
        </div>

        {showFilters && (
          <SupplierFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClearFilters={() => setSearchTerm('')}
          />
        )}
        
        <Card>
          <CardContent className="p-0">
            {suppliersLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <SupplierTable 
                suppliers={suppliers}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <SupplierModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        supplier={editingSupplier}
        onSubmit={handleSubmit}
        isLoading={createMutation.isLoading || updateMutation.isLoading}
      />
    </Layout>
  );
};

export default SuppliersPage;