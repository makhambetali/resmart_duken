import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { SupplyTable } from '@/components/SupplyTable';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { SupplyModal } from '@/components/SupplyModal';
import { CashFlowModal } from '@/components/CashFlowModal';
import { SupplierViewModal } from '@/components/SupplierViewModal';
import { Supply, AddSupplyForm } from '@/types/supply';
import { suppliesApi, suppliersApi, cashFlowApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Archive, Search, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EmptyState = ({ onAddClick, searchTerm }: { onAddClick: () => void; searchTerm: string }) => (
  <Card className="flex flex-col items-center justify-center p-12 border-2 border-dashed">
    <Archive className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-4 text-sm font-semibold text-gray-900">
      {searchTerm ? `По запросу "${searchTerm}" ничего не найдено` : 'Поставок не найдено'}
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      {searchTerm ? 'Попробуйте другой поисковый запрос или создайте новую поставку' : 'Добавьте новую поставку'}
    </p>
    <Button onClick={onAddClick} className="mt-6">
      {searchTerm ? `Создать поставку для "${searchTerm}"` : 'Добавить поставку'}
    </Button>
  </Card>
);

const Index = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const [isCashFlowModalOpen, setIsCashFlowModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmationFilter, setConfirmationFilter] = useState<'all' | 'confirmed' | 'unconfirmed'>('all');

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

  // 🔧 ИЗМЕНЕНО: Загружаем поставщиков при загрузке страницы, а не только при открытии модалки
  const { 
    data: suppliers = [], 
    isLoading: suppliersLoading,
    error: suppliersError
  } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => suppliersApi.getSuppliers(),
    staleTime: 1000 * 60 * 5, // 5 минут кэша
    gcTime: 1000 * 60 * 10, // 10 минут хранения в кэше
    refetchOnWindowFocus: false,
  });

  const createSupplyMutation = useMutation({
    mutationFn: suppliesApi.createSupply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies'] });
      // 🔧 ДОБАВЛЕНО: Обновляем данные о поставщиках после создания поставки
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
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

  const handleAddSupplyWithSearch = () => {
    setEditingSupply(null);
    setIsSupplyModalOpen(true);
  };
  
  const handleDeleteSupply = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить поставку?')) {
      deleteSupplyMutation.mutate(id);
    }
  };

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

  // Функция для открытия модалки поставщика
  const handleOpenSupplierModal = (supplierName: string) => {
    // Находим поставщика по имени в уже загруженных данных
    const supplier = suppliers.find(s => s.name === supplierName);
    if (supplier) {
      setSelectedSupplier(supplier);
      setIsSupplierModalOpen(true);
    } else {
      toast({
        title: 'Поставщик не найден',
        description: 'Не удалось найти информацию о поставщике',
        variant: 'destructive',
      });
    }
  };

  const handleSupplierEdit = () => {
    toast({
      title: 'Редактирование поставщика',
      description: 'Функция редактирования поставщика будет доступна в будущем',
      variant: 'default',
    });
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
          <Button onClick={handleAddSupply}>
            Добавить поставку
          </Button>
        </div>

        {/* Фильтры и поиск - в одном ряду, занимают всю ширину */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Поиск - занимает большую часть ширины */}
              <div className="flex-1 space-y-2">
                <Label htmlFor="search">Поиск поставок</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Поиск по поставщику или комментарию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>

              {/* Фильтр подтверждения */}
              <div className="space-y-2 min-w-[180px]">
                <Label className="text-sm">Статус</Label>
                <Tabs 
                  value={confirmationFilter} 
                  onValueChange={(value) => setConfirmationFilter(value as 'all' | 'confirmed' | 'unconfirmed')}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-3 h-8 w-full">
                    <TabsTrigger value="all" className="text-xs">
                      Все
                    </TabsTrigger>
                    <TabsTrigger value="confirmed" className="text-xs">
                      Подтв.
                    </TabsTrigger>
                    <TabsTrigger value="unconfirmed" className="text-xs">
                      Не подтв.
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-0">
            {suppliesLoading || suppliersLoading ? (
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
                onSupplierClick={handleOpenSupplierModal}
              />
            ) : (
              <EmptyState 
                onAddClick={handleAddSupplyWithSearch} 
                searchTerm={searchTerm} 
              />
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
        
        {/* Модалка для просмотра информации о поставщике */}
        <SupplierViewModal
          open={isSupplierModalOpen}
          onOpenChange={setIsSupplierModalOpen}
          supplier={selectedSupplier}
          onEdit={handleSupplierEdit}
        />
        
        {/* Floating Action Button для CashFlowModal */}
        <FloatingActionButton
          icon={<DollarSign className="h-6 w-6" />}
          onClick={() => setIsCashFlowModalOpen(true)}
          tooltip="Взнос/вынос"
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