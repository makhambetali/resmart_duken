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
  
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const [isCashFlowModalOpen, setIsCashFlowModalOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmationFilter, setConfirmationFilter] = useState<'all' | 'confirmed' | 'unconfirmed'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // 🔧 ИСПРАВЛЕНО: Добавлены staleTime и gcTime для кэширования
  const { 
    data: supplies = [], 
    isLoading: suppliesLoading, 
    error: suppliesError 
  } = useQuery({
    queryKey: ['supplies'],
    queryFn: suppliesApi.getSupplies,
    staleTime: 1000 * 60, // 1 минута кэша
    gcTime: 1000 * 60 * 5, // 5 минут хранения в кэше
    refetchOnWindowFocus: false, // Не обновлять при переключении вкладок
  });

  // 🔧 ИСПРАВЛЕНО: Добавлен enabled и кэширование
  const { 
    data: suppliers = [], 
    isLoading: suppliersLoading 
  } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => suppliersApi.getSuppliers(),
    enabled: isSupplyModalOpen, // Запрос только при открытом модальном окне
    staleTime: 1000 * 60 * 5, // 5 минут кэша
    gcTime: 1000 * 60 * 10, // 10 минут хранения в кэше
  });

  const createSupplyMutation = useMutation({
    mutationFn: suppliesApi.createSupply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies'] });
      toast({ 
        title: 'Поставка добавлена', 
        variant: "default",
        className: "bg-green-500 text-white" 
      });
    },
    onError: () => {
      toast({ 
        title: 'Ошибка добавления поставки', 
        variant: 'destructive' 
      });
    },
  });

  const deleteSupplyMutation = useMutation({
    mutationFn: suppliesApi.deleteSupply,
    onSuccess: () => {
      setIsSupplyModalOpen(false);
      toast({ 
        title: 'Поставка удалена', 
        variant: 'default', 
        className: "bg-green-500 text-white", 
      });
      queryClient.invalidateQueries({ queryKey: ['supplies'] });
    },
    onError: () => {
      toast({ 
        title: 'Ошибка удаления поставки', 
        variant: 'destructive' 
      });
    },
  });

  const updateSupplyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AddSupplyForm> }) =>
      suppliesApi.updateSupply(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies'] });
      toast({ 
        title: 'Поставка обновлена', 
        variant: "default",
        className: "bg-green-500 text-white" 
      });
    },
    onError: () => {
      toast({ 
        title: 'Ошибка обновления поставки', 
        variant: 'destructive' 
      });
    },
  });

  const filteredSupplies = supplies.filter(supply => {
    const matchesSearch = supply.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (supply.comment?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesConfirmation = confirmationFilter === 'all' || 
                              (confirmationFilter === 'confirmed' && supply.is_confirmed) ||
                              (confirmationFilter === 'unconfirmed' && !supply.is_confirmed);
    
    return matchesSearch && matchesConfirmation;
  });

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

  // @/components/Index.tsx
const handleSupplySubmit = async (data: Omit<AddSupplyForm, 'images'> & { images?: File[] }) => {
  try {
    if (editingSupply) {
      await updateSupplyMutation.mutateAsync({ id: editingSupply.id, data });
    } else {
      await createSupplyMutation.mutateAsync(data);
    }
    setIsSupplyModalOpen(false);
  } catch (error) {
    console.error('Error submitting supply:', error);
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
              <EmptyState onAddClick={handleAddSupply} />
            )}
          </CardContent>
        </Card>

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
            queryClient.invalidateQueries({ queryKey: ['cashFlows'] });
            setIsCashFlowModalOpen(false);
          }}
        />
      </div>
    </Layout>
  );
};

export default Index;