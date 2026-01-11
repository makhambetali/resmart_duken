// @/pages/FinancePage.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cashFlowApi, suppliesApi } from '@/lib/api';
import { CashFlowOperation, Supply } from '@/types/supply';
import { PlusCircle, AlertTriangle, ChevronsDown, ChevronsUp, Info, FileText, Eye, Lock, Calendar, DollarSign, Package, Download, MoreVertical, Filter, EyeOff, Shield } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { CashFlowModal } from '@/components/CashFlowModal';
import { SupplyFullView } from '@/components/SupplyFullView';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ru-RU').format(amount) + ' ₸';
};

// Mobile Stat Card для админов
const MobileStatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  className = '',
  tooltipContent 
}: { 
  title: string; 
  value: string; 
  icon: React.ElementType;
  className?: string;
  tooltipContent: string;
}) => (
  <Card className={`${className}`}>
    <CardContent className="p-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-xs text-gray-500 font-medium">{title}</div>
          <div className="text-base font-bold truncate">{value}</div>
        </div>
        <div className="p-2 bg-gray-100 rounded-full">
          <Icon className="h-4 w-4 text-gray-600" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Mobile Supply Card для админов
const MobileSupplyCardAdmin = ({ 
  supply, 
  onViewClick 
}: { 
  supply: Supply; 
  onViewClick: (supply: Supply) => void;
}) => (
  <Card className="mb-3">
    <CardContent className="p-3 sm:p-4">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{supply.supplier}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs px-2 py-0">
                Поставка
              </Badge>
              {supply.invoice_html && (
                <Badge variant="secondary" className="text-xs px-2 py-0 bg-blue-50">
                  <FileText className="h-3 w-3 mr-1" />
                  Документ
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewClick(supply)}
            className="h-8 w-8"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-xs text-gray-500">Наличные</div>
            <div className="font-medium text-sm">{formatCurrency(supply.price_cash)}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-xs text-gray-500">Банк</div>
            <div className="font-medium text-sm">{formatCurrency(supply.price_bank)}</div>
          </div>
        </div>

        {(supply.bonus > 0 || supply.exchange > 0) && (
          <div className="flex gap-2">
            {supply.bonus > 0 && (
              <div className="flex-1 bg-green-50 p-2 rounded">
                <div className="text-xs text-green-600">Бонус</div>
                <div className="font-medium text-green-700 text-sm">{supply.bonus}</div>
              </div>
            )}
            {supply.exchange > 0 && (
              <div className="flex-1 bg-purple-50 p-2 rounded">
                <div className="text-xs text-purple-600">Обмен</div>
                <div className="font-medium text-purple-700 text-sm">{supply.exchange}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// Mobile Supply Card для обычных пользователей (без сумм)
const MobileSupplyCardUser = ({ 
  supply, 
  onViewClick 
}: { 
  supply: Supply; 
  onViewClick: (supply: Supply) => void;
}) => (
  <Card className="mb-3">
    <CardContent className="p-3 sm:p-4">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{supply.supplier}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs px-2 py-0">
                Поставка
              </Badge>
              {supply.invoice_html && (
                <Badge variant="secondary" className="text-xs px-2 py-0 bg-blue-50">
                  <FileText className="h-3 w-3 mr-1" />
                  Документ
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewClick(supply)}
            className="h-8 w-8"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-xs text-gray-500">Способ оплаты</div>
            <div className="font-medium text-sm">
              {supply.price_cash > 0 && supply.price_bank > 0 ? 'Смешанная' : 
               supply.price_bank > 0 ? 'Банк' : 'Наличные'}
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-xs text-gray-500">Статус</div>
            <Badge 
              variant={supply.status === 'delivered' ? 'default' : 'secondary'} 
              className="text-xs"
            >
              {supply.status === 'pending' ? 'Ожидает' :
               supply.status === 'confirmed' ? 'Подтверждена' : 'Доставлена'}
            </Badge>
          </div>
        </div>

        {(supply.bonus > 0 || supply.exchange > 0) && (
          <div className="flex gap-2">
            {supply.bonus > 0 && (
              <div className="flex-1 bg-green-50 p-2 rounded">
                <div className="text-xs text-green-600">Бонус</div>
                <div className="font-medium text-green-700 text-sm">{supply.bonus}</div>
              </div>
            )}
            {supply.exchange > 0 && (
              <div className="flex-1 bg-purple-50 p-2 rounded">
                <div className="text-xs text-purple-600">Обмен</div>
                <div className="font-medium text-purple-700 text-sm">{supply.exchange}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// Mobile Cash Flow Card для админов
const MobileCashFlowCard = ({ 
  operation, 
  onEditClick,
  isEditable 
}: { 
  operation: CashFlowOperation; 
  onEditClick: (op: CashFlowOperation) => void;
  isEditable: boolean;
}) => (
  <Card className={`mb-3 ${operation.amount >= 0 ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}`}>
    <CardContent className="p-3 sm:p-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className={`text-lg font-bold ${operation.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {operation.amount >= 0 ? '+' : ''}{formatCurrency(operation.amount)}
            </div>
            {operation.description && (
              <p className="text-sm text-gray-600 mt-1 truncate">{operation.description}</p>
            )}
          </div>
          {isEditable && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEditClick(operation)}
              className="h-7 w-7"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {format(new Date(operation.date_added), 'HH:mm')}
          </div>
          <Badge 
            variant={operation.amount >= 0 ? "default" : "destructive"} 
            className="text-xs px-2 py-0"
          >
            {operation.amount >= 0 ? 'Доход' : 'Расход'}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FinancePage = () => {
  const queryClient = useQueryClient();
  const { user, logout, isAdmin } = useAuth();

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<CashFlowOperation | null>(null);
  const [isCashFlowsExpanded, setIsCashFlowsExpanded] = useState(false);

  const [cashFlowFilter, setCashFlowFilter] = useState('all');
  const [supplyFilter, setSupplyFilter] = useState('all');

  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null);
  const [isSupplyFullViewOpen, setIsSupplyFullViewOpen] = useState(false);

  const todayStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
  const isToday = selectedDate === todayStr;

  const cashFlowFilterOptions = [
    { value: 'all', label: 'Все' },
    { value: 'income', label: 'Доходы' },
    { value: 'expense', label: 'Расходы' },
  ];

  const supplyFilterOptions = [
    { value: 'all', label: 'Все' },
    { value: 'cash', label: 'Наличные' },
    { value: 'bank', label: 'Банк' },
    { value: 'mix', label: 'Смешанные' },
  ];

  // Функция для фильтрации поставок с учетом смешанных оплат
  const filterSupplies = (supplies: Supply[], filter: string) => {
    if (!supplies) return [];
    
    switch(filter) {
      case 'cash':
        // Показываем все поставки где есть наличные (включая смешанные)
        return supplies.filter(s => s.price_cash > 0);
      case 'bank':
        // Показываем все поставки где есть банк (включая смешанные)
        return supplies.filter(s => s.price_bank > 0);
      case 'mix':
        // Показываем только полностью смешанные
        return supplies.filter(s => s.price_cash > 0 && s.price_bank > 0);
      case 'all':
      default:
        return supplies;
    }
  };

  const { 
    data: cashFlows, 
    isLoading: cashFlowsLoading, 
    error: cashFlowsError 
  } = useQuery({
    queryKey: ['cashFlows', selectedDate, cashFlowFilter],
    queryFn: () => cashFlowApi.getOperationsByDate(selectedDate, cashFlowFilter),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!selectedDate && isAdmin,
  });

  const { 
    data: allSupplies, 
    isLoading: suppliesLoading, 
    error: suppliesError 
  } = useQuery({
    queryKey: ['supplies', selectedDate, 'all'],
    queryFn: () => suppliesApi.getSuppliesByDate(selectedDate, 'all'),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!selectedDate,
  });

  // Применяем фильтр к поставкам
  const supplies = useMemo(() => {
    if (!allSupplies) return [];
    return filterSupplies(allSupplies, supplyFilter);
  }, [allSupplies, supplyFilter]);

  useEffect(() => {
    if (selectedDate) {
      setIsCashFlowsExpanded(false);
      setCashFlowFilter('all');
      setSupplyFilter('all');
      
      if (isAdmin) {
        queryClient.prefetchQuery({
          queryKey: ['cashFlows', selectedDate, 'all'],
          queryFn: () => cashFlowApi.getOperationsByDate(selectedDate, 'all'),
        });
      }
      
      queryClient.prefetchQuery({
        queryKey: ['supplies', selectedDate, 'all'],
        queryFn: () => suppliesApi.getSuppliesByDate(selectedDate, 'all'),
      });
    }
  }, [selectedDate, queryClient, isAdmin]);

  const visibleCashFlows = useMemo(() => {
    if (!cashFlows) return [];
    return isCashFlowsExpanded ? cashFlows : cashFlows.slice(0, 3);
  }, [cashFlows, isCashFlowsExpanded]);

  const cashFlowTotals = useMemo(() => {
    if (!Array.isArray(cashFlows)) return { income: 0, expense: 0, balance: 0 };
    const income = cashFlows.filter(op => op.amount > 0).reduce((sum, op) => sum + op.amount, 0);
    const expense = cashFlows.filter(op => op.amount < 0).reduce((sum, op) => sum + Math.abs(op.amount), 0);
    return { income, expense, balance: income - expense };
  }, [cashFlows]);

  // Расчет сумм для ВСЕХ поставок (не только отфильтрованных)
  const supplyTotals = useMemo(() => {
    if (!Array.isArray(allSupplies)) return { cash: 0, bank: 0, total: 0 };
    const cash = allSupplies.reduce((sum, s) => sum + s.price_cash, 0);
    const bank = allSupplies.reduce((sum, s) => sum + s.price_bank, 0);
    return { cash, bank, total: cash + bank };
  }, [allSupplies]);

  const handleSuccess = () => {
    if (isAdmin) {
      queryClient.invalidateQueries({ queryKey: ['cashFlows', selectedDate] });
    }
    queryClient.invalidateQueries({ queryKey: ['supplies', selectedDate, 'all'] });
    setIsModalOpen(false);
    setSelectedOperation(null);
  };

  const handleAddOperationClick = () => {
    setSelectedOperation(null);
    setIsModalOpen(true);
  };

  const handleEditOperationClick = (operation: CashFlowOperation) => {
    if (isToday && isAdmin) {
      setSelectedOperation(operation);
      setIsModalOpen(true);
    }
  };

  const handleViewSupply = (supply: Supply) => {
    setSelectedSupply(supply);
    setIsSupplyFullViewOpen(true);
  };

  const isLoading = suppliesLoading || (isAdmin && cashFlowsLoading);

  if ((isAdmin && cashFlowsError) || suppliesError) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 rounded-lg">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-red-800">Ошибка при загрузке данных</h2>
          <p className="mt-2 text-red-600">Не удалось получить данные с сервера.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {isAdmin ? 'Управление финансами' : 'Поставки'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {isAdmin ? 'Просмотр и управление финансами компании' : 'Информация о поставках'}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-48">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="pl-10 w-full"
              />
            </div>
            {isAdmin && (
              <Button 
                onClick={handleAddOperationClick}
                className="w-full sm:w-auto"
                size="sm"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> 
                <span className="hidden sm:inline">Добавить операцию</span>
                <span className="sm:hidden">Добавить</span>
              </Button>
            )}
          </div>
        </div>

        {/* Role Indicator */}
        <div className={cn(
          "rounded-lg p-3 border",
          isAdmin 
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
            : "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              isAdmin ? "bg-blue-100" : "bg-gray-100"
            )}>
              {isAdmin ? (
                <Shield className="h-5 w-5 text-blue-600" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-sm">
                {isAdmin ? 'Режим администратора' : 'Режим просмотра'}
              </h3>
              <p className="text-xs text-gray-600">
                {isAdmin 
                  ? 'У вас есть доступ ко всем финансовым данным и операциям'
                  : 'Вы можете просматривать информацию о поставках без доступа к финансовым данным'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Admin Dashboard - только для админов */}
        {isAdmin ? (
          <>
            {/* Stat Cards - Mobile */}
            <div className="grid grid-cols-2 sm:hidden gap-3">
              <MobileStatCard 
                title="Доходы" 
                value={cashFlowsLoading ? "..." : formatCurrency(cashFlowTotals.income)}
                icon={ChevronsUp}
                className="text-green-600"
                tooltipContent="Сумма всех доходов"
              />
              <MobileStatCard 
                title="Расходы" 
                value={cashFlowsLoading ? "..." : formatCurrency(cashFlowTotals.expense)}
                icon={ChevronsDown}
                className="text-red-600"
                tooltipContent="Сумма всех расходов"
              />
              <MobileStatCard 
                title="Итого" 
                value={cashFlowsLoading ? "..." : formatCurrency(cashFlowTotals.balance)}
                icon={DollarSign}
                className="text-blue-600"
                tooltipContent="Баланс"
              />
              <MobileStatCard 
                title="Поставки" 
                value={suppliesLoading ? "..." : formatCurrency(supplyTotals.total)}
                icon={Package}
                className="text-purple-600"
                tooltipContent="Сумма поставок"
              />
            </div>

            {/* Stat Cards - Desktop */}
            <div className="hidden sm:grid gap-4 md:grid-cols-4">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Доходы</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {cashFlowsLoading ? "..." : formatCurrency(cashFlowTotals.income)}
                      </p>
                    </div>
                    <ChevronsUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Расходы</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {cashFlowsLoading ? "..." : formatCurrency(cashFlowTotals.expense)}
                      </p>
                    </div>
                    <ChevronsDown className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Итого</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {cashFlowsLoading ? "..." : formatCurrency(cashFlowTotals.balance)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Поставки</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {suppliesLoading ? "..." : formatCurrency(supplyTotals.total)}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cash Flows Section - только для админов */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">Движение средств</CardTitle>
                  <CardDescription className="text-sm">
                    {selectedDate === todayStr ? 'Сегодня' : format(new Date(selectedDate), 'dd.MM.yyyy')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={cashFlowFilter} onValueChange={setCashFlowFilter}>
                    <SelectTrigger className="w-[120px] sm:w-[140px]">
                      <SelectValue placeholder="Фильтр" />
                    </SelectTrigger>
                    <SelectContent>
                      {cashFlowFilterOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {/* Mobile Cash Flows */}
                <div className="sm:hidden space-y-2">
                  {cashFlowsLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                  ) : visibleCashFlows.length > 0 ? (
                    visibleCashFlows.map(op => (
                      <MobileCashFlowCard 
                        key={op.id}
                        operation={op}
                        onEditClick={handleEditOperationClick}
                        isEditable={isToday}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Нет операций за выбранный день
                    </div>
                  )}
                </div>

                {/* Desktop Cash Flows Table */}
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Сумма</TableHead>
                        <TableHead>Описание</TableHead>
                        <TableHead>Дата/время</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cashFlowsLoading ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center p-8">
                            Загрузка...
                          </TableCell>
                        </TableRow>
                      ) : visibleCashFlows.length > 0 ? (
                        visibleCashFlows.map(op => (
                          <TableRow 
                            key={op.id} 
                            onClick={() => handleEditOperationClick(op)}
                            className={isToday ? "cursor-pointer hover:bg-gray-50" : "cursor-default"}
                          >
                            <TableCell className={cn(
                              "font-bold",
                              op.amount >= 0 ? 'text-green-600' : 'text-red-600'
                            )}>
                              {op.amount >= 0 ? '+' : ''}{formatCurrency(op.amount)}
                            </TableCell>
                            <TableCell>{op.description || '-'}</TableCell>
                            <TableCell>{format(new Date(op.date_added), 'dd.MM.yyyy HH:mm')}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center p-8">
                            Нет операций за выбранный день.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {cashFlows && cashFlows.length > 3 && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="ghost"
                        onClick={() => setIsCashFlowsExpanded(!isCashFlowsExpanded)}
                        size="sm"
                      >
                        {isCashFlowsExpanded ? (
                          <>
                            <ChevronsUp className="mr-2 h-4 w-4" />
                            Скрыть
                          </>
                        ) : (
                          <>
                            <ChevronsDown className="mr-2 h-4 w-4" />
                            Показать еще {cashFlows.length - 3}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* User View - только поставки без сумм */
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Информация о поставках</CardTitle>
              <CardDescription>
                Доступ ограничен: вы можете просматривать только информацию о поставках
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Ограниченный доступ</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        Финансовая информация скрыта. Для доступа к полной информации обратитесь к администратору.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Supplies Section - для всех, но с разным отображением */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Поставки</CardTitle>
              <CardDescription className="text-sm">
                {selectedDate === todayStr ? 'Сегодня' : format(new Date(selectedDate), 'dd.MM.yyyy')}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={supplyFilter} onValueChange={setSupplyFilter}>
                <SelectTrigger className="w-[120px] sm:w-[140px]">
                  <SelectValue placeholder="Фильтр" />
                </SelectTrigger>
                <SelectContent>
                  {supplyFilterOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Stat Cards для админов - Mobile (вертикальная версия) */}
            {isAdmin && (
              <div className="sm:hidden space-y-3 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-blue-600 font-medium">Наличные</div>
                      <div className="text-base font-bold text-blue-700 break-all">
                        {suppliesLoading ? "..." : formatCurrency(supplyTotals.cash)}
                      </div>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-orange-600 font-medium">Банк</div>
                      <div className="text-base font-bold text-orange-700 break-all">
                        {suppliesLoading ? "..." : formatCurrency(supplyTotals.bank)}
                      </div>
                    </div>
                    <div className="p-2 bg-orange-100 rounded-full">
                      <DollarSign className="h-4 w-4 text-orange-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-600 font-medium">Всего поставок</div>
                      <div className="text-base font-bold text-gray-900 break-all">
                        {suppliesLoading ? "..." : formatCurrency(supplyTotals.total)}
                      </div>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Package className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Supply Stats для админов */}
            {isAdmin && (
              <div className="hidden sm:grid grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Наличные</div>
                        <div className="text-xl font-bold text-gray-900">
                          {suppliesLoading ? "..." : formatCurrency(supplyTotals.cash)}
                        </div>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-full">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Банк</div>
                        <div className="text-xl font-bold text-gray-900">
                          {suppliesLoading ? "..." : formatCurrency(supplyTotals.bank)}
                        </div>
                      </div>
                      <div className="p-2 bg-orange-100 rounded-full">
                        <DollarSign className="h-5 w-5 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Всего</div>
                        <div className="text-xl font-bold text-gray-900">
                          {suppliesLoading ? "..." : formatCurrency(supplyTotals.total)}
                        </div>
                      </div>
                      <div className="p-2 bg-gray-100 rounded-full">
                        <Package className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Mobile Supplies List */}
            <div className="sm:hidden space-y-2">
              {suppliesLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : supplies && supplies.length > 0 ? (
                supplies.map(s => (
                  isAdmin ? (
                    <MobileSupplyCardAdmin 
                      key={s.id}
                      supply={s}
                      onViewClick={handleViewSupply}
                    />
                  ) : (
                    <MobileSupplyCardUser 
                      key={s.id}
                      supply={s}
                      onViewClick={handleViewSupply}
                    />
                  )
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Нет поставок за выбранный день
                </div>
              )}
            </div>

            {/* Desktop Supplies Table */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Поставщик</TableHead>
                    {isAdmin && <TableHead>Наличные</TableHead>}
                    {isAdmin && <TableHead>Банк</TableHead>}
                    {!isAdmin && <TableHead>Способ оплаты</TableHead>}
                    <TableHead>Бонус</TableHead>
                    <TableHead>Обмен</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Документы</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliesLoading ? (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 8 : 6} className="text-center p-8">
                        Загрузка...
                      </TableCell>
                    </TableRow>
                  ) : supplies && supplies.length > 0 ? (
                    supplies.map(s => (
                      <TableRow 
                        key={s.id} 
                        onClick={() => handleViewSupply(s)}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">{s.supplier}</TableCell>
                        
                        {/* Показываем суммы только админам */}
                        {isAdmin && <TableCell>{formatCurrency(s.price_cash)}</TableCell>}
                        {isAdmin && <TableCell>{formatCurrency(s.price_bank)}</TableCell>}
                        
                        {/* Для обычных пользователей показываем только тип оплаты */}
                        {!isAdmin && (
                          <TableCell>
                            {s.price_cash > 0 && s.price_bank > 0 ? 'Смешанная' : 
                             s.price_bank > 0 ? 'Банк' : 'Наличные'}
                          </TableCell>
                        )}
                        
                        <TableCell>
                          {s.bonus > 0 ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              {s.bonus}
                            </Badge>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {s.exchange > 0 ? (
                            <Badge variant="outline" className="text-purple-600 border-purple-300">
                              {s.exchange}
                            </Badge>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={s.status === 'delivered' ? 'default' : 'outline'} 
                            className={cn(
                              "text-xs",
                              s.status === 'pending' && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
                              s.status === 'confirmed' && "bg-blue-100 text-blue-800 hover:bg-blue-100",
                              s.status === 'delivered' && "bg-green-100 text-green-800 hover:bg-green-100"
                            )}
                          >
                            {s.status === 'pending' ? 'Ожидает' :
                             s.status === 'confirmed' ? 'Подтверждена' : 'Доставлена'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {s.invoice_html ? (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-gray-600">Накладная</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewSupply(s);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 8 : 6} className="text-center p-8">
                        Нет поставок за выбранный день.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supply Full View Modal - для всех */}
      {selectedSupply && (
        <SupplyFullView
          supply={selectedSupply}
          open={isSupplyFullViewOpen}
          onOpenChange={setIsSupplyFullViewOpen}
        />
      )}

      {/* Cash Flow Modal - только для админов */}
      {isAdmin && (
        <CashFlowModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSuccess={handleSuccess}
          operationToEdit={selectedOperation}
          isReadOnly={!isToday}
        />
      )}
    </Layout>
  );
};

export default FinancePage;