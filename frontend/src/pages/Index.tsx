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
import { Archive, Search, DollarSign, Filter, Plus, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const EmptyState = ({ onAddClick, searchTerm }: { onAddClick: () => void; searchTerm: string }) => (
  <Card className="flex flex-col items-center justify-center p-6 sm:p-12 border-2 border-dashed">
    <Archive className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
    <h3 className="mt-4 text-base sm:text-lg font-semibold text-gray-900 text-center">
      {searchTerm ? `По запросу "${searchTerm}" ничего не найдено` : 'Поставок не найдено'}
    </h3>
    <p className="mt-1 text-sm text-gray-500 text-center px-4">
      {searchTerm ? 'Попробуйте другой поисковый запрос или создайте новую поставку' : 'Добавьте новую поставку'}
    </p>
    <Button 
      onClick={onAddClick} 
      className="mt-6" 
      size="sm"
      smSize="default" // 🔧 ИСПРАВЛЕНО: убрано двоеточие
    >
      {searchTerm ? `Создать поставку` : 'Добавить поставку'}
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { 
    data: supplies = [], 
    isLoading: suppliesLoading, 
    error: suppliesError 
  } = useQuery({
    queryKey: ['supplies'],
    queryFn: suppliesApi.getSupplies,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const { 
    data: suppliers = [], 
    isLoading: suppliersLoading,
    error: suppliersError
  } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => suppliersApi.getSuppliers(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const createSupplyMutation = useMutation({
    mutationFn: suppliesApi.createSupply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies'] });
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

  const handleOpenSupplierModal = (supplierName: string) => {
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
        <div className="text-center py-8 sm:py-16 px-4 sm:px-6 bg-red-50 rounded-lg">
          <h3 className="mt-2 text-base sm:text-lg font-semibold text-red-800">Ошибка загрузки данных</h3>
          <p className="mt-1 text-sm text-red-600">Не удалось получить данные с сервера. Проверьте ваше соединение.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onAddSupplyClick={handleAddSupply}>
      <div className="space-y-4 sm:space-y-6">
        {/* Заголовок и кнопка - адаптивно */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Поставки</h1>
          
          {/* Десктопная кнопка */}
          <Button 
            onClick={handleAddSupply}
            className="hidden sm:flex gap-2"
            size="default" // 🔧 ИСПРАВЛЕНО
          >
            <Plus className="h-4 w-4" />
            Добавить поставку
          </Button>
          
          {/* Мобильная кнопка */}
          <Button 
            onClick={handleAddSupply}
            className="sm:hidden"
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Карточка с фильтрами и поиском */}
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            {/* Заголовок и кнопка фильтров на мобильных */}
            <div className="flex items-center justify-between mb-4 sm:hidden">
              <h2 className="text-base font-semibold">Фильтры</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                {showMobileFilters ? 'Скрыть' : 'Показать'}
              </Button>
            </div>

            {/* Основная форма фильтров */}
            <div className={`${showMobileFilters ? 'block' : 'hidden sm:block'}`}>
              <div className="space-y-4 sm:space-y-0 sm:flex sm:items-end sm:gap-4 lg:gap-6">
                {/* Поиск - адаптивный */}
                <div className="flex-1 space-y-2">
                  <Label htmlFor="search" className="text-sm sm:text-base">Поиск поставок</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="search"
                      placeholder="Поиск по поставщику или комментарию..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value.replace(/(^|\s)\S/g, char => char.toUpperCase()))}
                      className="pl-10 w-full text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Десктопный фильтр статуса */}
                <div className="hidden sm:block space-y-2 min-w-[180px]">
                  <Label className="text-sm sm:text-base">Статус</Label>
                  <Tabs 
                    value={confirmationFilter} 
                    onValueChange={(value) => setConfirmationFilter(value as 'all' | 'confirmed' | 'unconfirmed')}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3 h-8 w-full">
                      <TabsTrigger value="all" className="text-xs sm:text-sm">
                        Все
                      </TabsTrigger>
                      <TabsTrigger value="confirmed" className="text-xs sm:text-sm">
                        Подтв.
                      </TabsTrigger>
                      <TabsTrigger value="unconfirmed" className="text-xs sm:text-sm">
                        Не подтв.
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Мобильный фильтр статуса */}
                <div className="sm:hidden space-y-2">
                  <Label className="text-sm">Статус поставки</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {confirmationFilter === 'all' && 'Все поставки'}
                        {confirmationFilter === 'confirmed' && 'Подтвержденные'}
                        {confirmationFilter === 'unconfirmed' && 'Неподтвержденные'}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuItem onClick={() => setConfirmationFilter('all')}>
                        Все поставки
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setConfirmationFilter('confirmed')}>
                        Подтвержденные
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setConfirmationFilter('unconfirmed')}>
                        Неподтвержденные
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Кнопки действий на мобильных */}
              <div className="flex gap-3 mt-4 sm:hidden">
                <Button 
                  onClick={() => setIsCashFlowModalOpen(true)}
                  variant="outline"
                  className="flex-1 gap-2"
                  size="sm"
                >
                  <DollarSign className="h-4 w-4" />
                  Касса
                </Button>
                <Button 
                  onClick={handleAddSupply}
                  className="flex-1 gap-2"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Добавить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Информация о количестве */}
        <div className="flex items-center justify-between px-1">
          <div className="text-sm sm:text-base">
            <span className="font-medium">Найдено:</span> {filteredSupplies.length} поставок
            {searchTerm && (
              <span className="text-gray-600 ml-2">
                по запросу "<span className="font-medium">{searchTerm}</span>"
              </span>
            )}
          </div>
          {confirmationFilter !== 'all' && (
            <div className="text-xs sm:text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              {confirmationFilter === 'confirmed' ? 'Подтвержденные' : 'Неподтвержденные'}
            </div>
          )}
        </div>
        
        {/* Таблица поставок */}
        <Card>
          <CardContent className="p-2 sm:p-0 overflow-hidden">
            {suppliesLoading || suppliersLoading ? (
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <Skeleton className="h-8 sm:h-10 w-full" />
                <Skeleton className="h-8 sm:h-10 w-full" />
                <Skeleton className="h-8 sm:h-10 w-full" />
                <Skeleton className="h-8 sm:h-10 w-full" />
              </div>
            ) : filteredSupplies.length > 0 ? (
              <div className="overflow-x-auto">
                <SupplyTable 
                  supplies={filteredSupplies}
                  onEditSupply={handleEditSupply}
                  onSupplierClick={handleOpenSupplierModal}
                />
              </div>
            ) : (
              <EmptyState 
                onAddClick={handleAddSupplyWithSearch} 
                searchTerm={searchTerm} 
              />
            )}
          </CardContent>
        </Card>

        {/* Модальные окна */}
        <SupplyModal
          open={isSupplyModalOpen}
          onOpenChange={setIsSupplyModalOpen}
          supply={editingSupply}
          onSubmit={handleSupplySubmit}
          suppliers={suppliers}
          handleDeleteSupply={handleDeleteSupply}
        />
        
        <SupplierViewModal
          open={isSupplierModalOpen}
          onOpenChange={setIsSupplierModalOpen}
          supplier={selectedSupplier}
          onEdit={handleSupplierEdit}
        />
        
        {/* Floating Action Button для CashFlowModal - только для десктопа */}
       {/* Floating Action Button для CashFlowModal - скрыта на мобильных */}
{/* Условный рендеринг для разных экранов */}
{typeof window !== 'undefined' && window.innerWidth >= 640 && (
  <FloatingActionButton
    icon={<DollarSign className="h-6 w-6" />}
    onClick={() => setIsCashFlowModalOpen(true)}
    tooltip="Взнос/вынос"
  />
)}
        
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