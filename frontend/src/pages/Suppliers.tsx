import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { SupplierTable } from '@/components/SupplierTable';
import { SupplierModal } from '@/components/SupplierModal';
import { Supplier, CreateSupplierData, SupplierFilters, IsEverydaySupplyFilter } from '@/types/supplier';
import { suppliersApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const SuppliersPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [filters, setFilters] = useState<SupplierFilters>({
    searchTerm: '',
    perPage: 10,
    currentPage: 1,
    is_everyday_supply: 'all',
  });

  // 🔧 ИСПРАВЛЕНО: Добавлены параметры кэширования и отключено обновление при фокусе окна
  const { 
    data: suppliersData, 
    isLoading: suppliersLoading, 
    error: suppliersError,
    isFetching: isSuppliersFetching
  } = useQuery({
    queryKey: ['suppliers', filters],
    queryFn: () => suppliersApi.getSuppliers({
      page: filters.currentPage,
      page_size: filters.perPage,
      q: filters.searchTerm,
      is_everyday_supply: filters.is_everyday_supply === 'all' 
        ? undefined 
        : filters.is_everyday_supply,
    }),
    staleTime: 1000 * 60 * 2, // 2 минуты кэша
    gcTime: 1000 * 60 * 10, // 10 минут хранения в кэше
    refetchOnWindowFocus: false, // Не обновлять при переключении вкладок
    keepPreviousData: true, // Сохранять предыдущие данные при загрузке
    refetchOnMount: false, // Не обновлять при монтировании
  });

  const createMutation = useMutation({
    mutationFn: suppliersApi.createSupplier,
    onSuccess: () => {
      toast({ 
        title: 'Поставщик создан',
        variant: "default", 
        className: "bg-green-500 text-white"   
      });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast({ 
        title: 'Ошибка', 
        description: error.body?.name?.[0] || 'Не удалось создать поставщика', 
        variant: 'destructive' 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSupplierData> }) => 
      suppliersApi.updateSupplier(id, data),
    onSuccess: () => {
      toast({ 
        title: 'Поставщик обновлен', 
        variant: "default", 
        className: "bg-green-500 text-white" 
      });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast({ 
        title: 'Ошибка', 
        description: error.body?.name?.[0] || 'Не удалось обновить поставщика', 
        variant: 'destructive' 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: suppliersApi.deleteSupplier,
    onSuccess: () => {
      toast({ 
        title: 'Поставщик удален', 
        variant: "default", 
        className: "bg-green-500 text-white" 
      });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: () => {
      toast({ 
        title: 'Ошибка', 
        description: 'Не удалось удалить поставщика', 
        variant: 'destructive' 
      });
    },
  });

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
    try {
      if (editingSupplier) {
        await updateMutation.mutateAsync({ id: editingSupplier.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error('Error submitting supplier:', error);
    }
  };

  const handleFilterChange = (newFilters: Partial<SupplierFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, currentPage: page }));
  };
  
  const totalPages = Math.ceil((suppliersData?.count || 0) / filters.perPage);

  if (suppliersError) {
    return (
      <Layout>
        <div className="text-red-600 p-4 bg-red-50 border border-red-200 rounded-lg">
          Ошибка загрузки данных.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Поставщики</h1>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Найдено: {suppliersData?.count || 0}
              {isSuppliersFetching && (
                <span className="ml-2 text-blue-500 text-xs">(обновление...)</span>
              )}
            </div>
            <Button onClick={handleAdd} disabled={createMutation.isPending}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить
            </Button>
          </div>
        </div>
        
        {/* Фильтры */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <Input
                placeholder="Поиск по названию..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
                className="md:col-span-2"
              />
              
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Ежедневная поставка
                </label>
                <Select
                  value={filters.is_everyday_supply}
                  onValueChange={(value) => handleFilterChange({ 
                    is_everyday_supply: value as IsEverydaySupplyFilter 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Фильтр..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    <SelectItem value="true">Да</SelectItem>
                    <SelectItem value="false">Нет</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  На странице
                </label>
                <Select
                  value={String(filters.perPage)}
                  onValueChange={(value) => handleFilterChange({ perPage: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Количество" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {suppliersLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(filters.perPage)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <SupplierTable 
                suppliers={suppliersData?.results || []}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.currentPage - 1)}
              disabled={filters.currentPage === 1 || isSuppliersFetching}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (filters.currentPage <= 3) {
                  page = i + 1;
                } else if (filters.currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = filters.currentPage - 2 + i;
                }

                if (page > totalPages || page < 1) return null;
                
                return (
                  <Button
                    key={page}
                    variant={page === filters.currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    disabled={isSuppliersFetching}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.currentPage + 1)}
              disabled={filters.currentPage === totalPages || isSuppliersFetching}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <SupplierModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        supplier={editingSupplier}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </Layout>
  );
};

export default SuppliersPage;