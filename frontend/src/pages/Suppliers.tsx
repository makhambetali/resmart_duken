// [file name]: Suppliers.tsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { SupplierTable } from '@/components/SupplierTable';
import { SupplierModal } from '@/components/SupplierModal';
import { SupplierViewModal } from '@/components/SupplierViewModal';
import { Supplier, CreateSupplierData, SupplierFilters, IsEverydaySupplyFilter } from '@/types/supplier';
import { suppliersApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, ChevronLeft, ChevronRight, Shield, Search, Filter, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SuppliersPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, isLoading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<SupplierFilters>({
    searchTerm: '',
    perPage: 10,
    currentPage: 1,
    is_everyday_supply: 'all',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  const { 
    data: suppliersData, 
    isLoading: suppliersLoading, 
    error: suppliersError,
    isFetching: isSuppliersFetching
  } = useQuery({
    queryKey: ['suppliers', filters, user],
    queryFn: () => suppliersApi.getSuppliers({
      page: filters.currentPage,
      page_size: filters.perPage,
      q: filters.searchTerm,
      is_everyday_supply: filters.is_everyday_supply === 'all' 
        ? undefined 
        : filters.is_everyday_supply,
    }),
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
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
      setIsEditModalOpen(false);
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
      setIsEditModalOpen(false);
      setEditingSupplier(null);
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
    setIsEditModalOpen(true);
  };

  const handleView = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsEditModalOpen(true);
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

  // Если загрузка аутентификации, показываем лоадер
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
      <div className="space-y-4 sm:space-y-6">
        {/* Заголовок с информацией о пользователе */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Поставщики</h1>
            <div className="flex items-center gap-2 mt-1 sm:mt-2">
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                <User className="h-3 w-3" />
                <span>{user?.username}</span>
              </div>
              {isAdmin && (
                <Badge variant="secondary" className="text-xs">
                  <Shield className="w-2.5 h-2.5 mr-1" />
                  Админ
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              Найдено: {suppliersData?.count || 0}
              {isSuppliersFetching && (
                <span className="ml-2 text-blue-500 text-xs">(обновление...)</span>
              )}
            </div>
            <Button 
              onClick={handleAdd} 
              disabled={createMutation.isPending}
              className="gap-1.5 flex-1 sm:flex-none"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Добавить поставщика</span>
              <span className="sm:hidden">Добавить</span>
            </Button>
          </div>
        </div>
        
        {/* Фильтры */}
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск по названию..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange({ 
                    searchTerm: e.target.value.replace(/(^|\s)\S/g, char => char.toUpperCase()) 
                  })}
                  className="pl-9 text-sm"
                />
              </div>

              {/* Filter Toggle for Mobile */}
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
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
                </Button>
              </div>

              {/* Filters Content */}
              <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">
                      Ежедневная поставка
                    </label>
                    <Select
                      value={filters.is_everyday_supply}
                      onValueChange={(value) => handleFilterChange({ 
                        is_everyday_supply: value as IsEverydaySupplyFilter 
                      })}
                    >
                      <SelectTrigger className="text-sm">
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
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">
                      На странице
                    </label>
                    <Select
                      value={String(filters.perPage)}
                      onValueChange={(value) => handleFilterChange({ perPage: Number(value) })}
                    >
                      <SelectTrigger className="text-sm">
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

                  {/* Mobile count display */}
                  <div className="sm:hidden">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Результаты</div>
                    <div className="text-sm p-2 bg-gray-50 rounded">
                      Найдено: {suppliersData?.count || 0}
                      {isSuppliersFetching && (
                        <span className="ml-2 text-blue-500">(обновление...)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {suppliersLoading ? (
              <div className="p-4 sm:p-6 space-y-4">
                {[...Array(filters.perPage)].map((_, i) => (
                  <Skeleton key={i} className="h-12 sm:h-10 w-full" />
                ))}
              </div>
            ) : (
              <SupplierTable 
                suppliers={suppliersData?.results || []}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                canEdit={isAdmin || user?.profile?.role === 'admin'}
                canDelete={isAdmin || user?.profile?.role === 'admin'}
              />
            )}
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Страница {filters.currentPage} из {totalPages} • Всего: {suppliersData?.count || 0}
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(filters.currentPage - 1)}
                disabled={filters.currentPage === 1 || isSuppliersFetching}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 3) {
                    page = i + 1;
                  } else if (filters.currentPage === 1) {
                    page = i + 1;
                  } else if (filters.currentPage === totalPages) {
                    page = totalPages - 2 + i;
                  } else {
                    page = filters.currentPage - 1 + i;
                  }

                  if (page > totalPages || page < 1) return null;
                  
                  return (
                    <Button
                      key={page}
                      variant={page === filters.currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      disabled={isSuppliersFetching}
                      className="h-8 w-8 p-0"
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
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Модалка для просмотра */}
      <SupplierViewModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        supplier={selectedSupplier}
        onEdit={() => {
          if (selectedSupplier) {
            setIsViewModalOpen(false);
            setEditingSupplier(selectedSupplier);
            setIsEditModalOpen(true);
          }
        }}
        canEdit={isAdmin || user?.profile?.role === 'admin'}
      />

      {/* Модалка для редактирования */}
      <SupplierModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        supplier={editingSupplier}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </Layout>
  );
};

export default SuppliersPage;