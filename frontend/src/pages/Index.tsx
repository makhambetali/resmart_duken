import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { SupplyTable } from '@/components/SupplyTable';
import { SupplyFilters } from '@/components/SupplyFilters';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { SupplyModal } from '@/components/SupplyModal';
import { CashFlowModal } from '@/components/CashFlowModal';
import { Supply, AddSupplyForm } from '@/types/supply';
import { suppliesApi, suppliersApi, cashFlowApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, ListFilter, Archive, FilePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ++ Компонент-заглушка для пустого состояния ++
const EmptyState = ({ onAddClick }: { onAddClick: () => void }) => (
    <Card className="flex flex-col items-center justify-center p-12 border-2 border-dashed">
        <Archive className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-sm font-semibold text-gray-900">Поставок не найдено</h3>
        <p className="mt-1 text-sm text-gray-500">Попробуйте изменить фильтры или добавить новую поставку.</p>
        <Button onClick={onAddClick} className="mt-6">
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
            Добавить поставку
        </Button>
    </Card>
);

const Index = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // State для модалей
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const [isCashFlowModalOpen, setIsCashFlowModalOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  
  // State для фильтров
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmationFilter, setConfirmationFilter] = useState<'all' | 'confirmed' | 'unconfirmed'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Запросы данных
  const { data: supplies = [], isLoading: suppliesLoading, error: suppliesError } = useQuery({
    queryKey: ['supplies'],
    queryFn: suppliesApi.getSupplies,
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => suppliersApi.getSuppliers(),
  });

  // Мутации
  const createSupplyMutation = useMutation({
    mutationFn: suppliesApi.createSupply,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['supplies'] }),
  });
  const deleteSupplyMutation = useMutation({
    mutationFn: suppliesApi.deleteSupply,
    onSuccess: () => {
      toast({ title: 'Поставка удалена' });
      queryClient.invalidateQueries({ queryKey: ['supplies'] });
    },
    onError: () => toast({ title: 'Ошибка удаления поставки', variant: 'destructive' }),
  });
  const updateSupplyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AddSupplyForm> }) =>
      suppliesApi.updateSupply(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['supplies'] }),
  });

  // Фильтрация поставок
  const filteredSupplies = supplies.filter(supply => {
    const matchesSearch = supply.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (supply.comment?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesConfirmation = confirmationFilter === 'all' || 
                              (confirmationFilter === 'confirmed' && supply.is_confirmed) ||
                              (confirmationFilter === 'unconfirmed' && !supply.is_confirmed);
    
    return matchesSearch && matchesConfirmation;
  });

  // Обработчики
  const handleEditSupply = (supply: Supply) => {
    setEditingSupply(supply);
    setIsSupplyModalOpen(true);
  };

  const handleAddSupply = () => {
    setEditingSupply(null);
    setIsSupplyModalOpen(true);
  };
  
  const handleDeleteSupply = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить поставку?')) {
      deleteSupplyMutation.mutate(id);
    }
  };

  const handleSupplySubmit = async (data: AddSupplyForm) => {
    if (editingSupply) {
      await updateSupplyMutation.mutateAsync({ id: editingSupply.id, data });
    } else {
      await createSupplyMutation.mutateAsync(data);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setConfirmationFilter('all');
  };

  if (suppliesError) {
    return (
      <Layout>
        <div className="text-center py-16 px-6 bg-red-50 rounded-lg">
            <h3 className="mt-2 text-lg font-semibold text-red-800">Ошибка загрузки данных</h3>
            <p className="mt-1 text-sm text-red-600">Не удалось получить данные с сервера. Проверьте ваше соединение.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* ++ Обновленная, более чистая шапка ++ */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Поставки</h1>
          <div className="flex items-center gap-2">
             <Button variant="outline" onClick={() => setIsCashFlowModalOpen(true)}>
                <FilePlus className="mr-2 h-4 w-4" />
                Взнос/вынос
             </Button>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <ListFilter className="mr-2 h-4 w-4" />
                {showFilters ? 'Скрыть фильтры' : 'Показать'}
            </Button>
            <Button onClick={handleAddSupply}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить
            </Button>
          </div>
        </div>

        {/* ++ Фильтры в карточке для лучшей визуальной группировки ++ */}
        {showFilters && (
            <Card>
                <CardContent className="pt-6">
                    <SupplyFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        confirmationFilter={confirmationFilter}
                        onConfirmationFilterChange={setConfirmationFilter}
                        onClearFilters={handleClearFilters}
                        isVisible={showFilters}
                    />
                </CardContent>
            </Card>
        )}
        
        <Card>
            <CardContent className="p-0">
                {suppliesLoading ? (
                    // ++ Улучшенный скелетон для состояния загрузки ++
                    <div className="p-6 space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : filteredSupplies.length > 0 ? (
                    <SupplyTable 
                        supplies={filteredSupplies}
                        onEditSupply={handleEditSupply}
                    />
                ) : (
                    // ++ Улучшенное состояние, когда список пуст ++
                    <EmptyState onAddClick={handleAddSupply} />
                )}
            </CardContent>
        </Card>
        
        {/* ++ FAB теперь выполняет основное действие страницы ++ */}
        {/* <FloatingActionButton onClick={handleAddSupply} /> */}

        {/* Модальные окна */}
        <SupplyModal
          open={isSupplyModalOpen}
          onOpenChange={setIsSupplyModalOpen}
          supply={editingSupply}
          onSubmit={handleSupplySubmit}
          suppliers={suppliers}
          handleDeleteSupply={handleDeleteSupply}
        />
<CashFlowModal
  open={isCashFlowModalOpen}
  onOpenChange={setIsCashFlowModalOpen}
  onSuccess={() => {
    // 1. Обновляем данные, связанные с финансами
    queryClient.invalidateQueries({ queryKey: ['cashFlows'] }); 
    // 2. Закрываем модальное окно
    setIsCashFlowModalOpen(false); // <--- ДОБАВЬТЕ ЭТУ СТРОКУ
  }}
/>
      </div>
    </Layout>
  );
};

export default Index;