import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cashFlowApi, suppliesApi } from '@/lib/api';
import { CashFlowOperation, Supply } from '@/types/supply';
import { PlusCircle, AlertTriangle, ChevronsDown, ChevronsUp, Info, FileText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { CashFlowModal } from '@/components/CashFlowModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formatCurrency = (amount: number) => new Intl.NumberFormat('ru-RU').format(amount) + ' ₸';

const StatCard = ({ title, value, className, tooltipContent }: { title: string, value: string, className?: string, tooltipContent: string }) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const FilterButtons = ({ options, selectedValue, onValueChange }: {
  options: { value: string; label: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}) => (
  <div className="flex items-center gap-2">
    {options.map(option => (
      <Button
        key={option.value}
        variant={selectedValue === option.value ? 'default' : 'outline'}
        size="sm"
        onClick={() => onValueChange(option.value)}
      >
        {option.label}
      </Button>
    ))}
  </div>
);

const FinancePage = () => {
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<CashFlowOperation | null>(null);
  const [isCashFlowsExpanded, setIsCashFlowsExpanded] = useState(false);

  const [cashFlowFilter, setCashFlowFilter] = useState('all');
  const [supplyFilter, setSupplyFilter] = useState('all');

  const [invoiceHtml, setInvoiceHtml] = useState<string | null>(null);

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

  // 🔧 ИСПРАВЛЕНО: Добавлены параметры кэширования и refetchOnWindowFocus
  const { 
    data: cashFlows, 
    isLoading: cashFlowsLoading, 
    error: cashFlowsError 
  } = useQuery({
    queryKey: ['cashFlows', selectedDate, cashFlowFilter],
    queryFn: () => cashFlowApi.getOperationsByDate(selectedDate, cashFlowFilter),
    staleTime: 1000 * 60, // 1 минута кэша
    gcTime: 1000 * 60 * 5, // 5 минут хранения в кэше
    refetchOnWindowFocus: false, // Не обновлять при переключении вкладок
    enabled: !!selectedDate, // Запрос только при наличии даты
  });

  // 🔧 ИСПРАВЛЕНО: Добавлены параметры кэширования
  const { 
    data: supplies, 
    isLoading: suppliesLoading, 
    error: suppliesError 
  } = useQuery({
    queryKey: ['supplies', selectedDate, supplyFilter],
    queryFn: () => suppliesApi.getSuppliesByDate(selectedDate, supplyFilter),
    staleTime: 1000 * 60, // 1 минута кэша
    gcTime: 1000 * 60 * 5, // 5 минут хранения в кэше
    refetchOnWindowFocus: false, // Не обновлять при переключении вкладок
    enabled: !!selectedDate, // Запрос только при наличии даты
  });

  // 🔧 ИСПРАВЛЕНО: useEffect для сброса состояния при изменении даты
  useEffect(() => {
    if (selectedDate) {
      setIsCashFlowsExpanded(false);
      setCashFlowFilter('all');
      setSupplyFilter('all');
      
      // Предварительная загрузка данных при изменении даты
      queryClient.prefetchQuery({
        queryKey: ['cashFlows', selectedDate, 'all'],
        queryFn: () => cashFlowApi.getOperationsByDate(selectedDate, 'all'),
      });
      queryClient.prefetchQuery({
        queryKey: ['supplies', selectedDate, 'all'],
        queryFn: () => suppliesApi.getSuppliesByDate(selectedDate, 'all'),
      });
    }
  }, [selectedDate, queryClient]);

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

  const supplyTotals = useMemo(() => {
    if (!Array.isArray(supplies)) return { cash: 0, bank: 0, total: 0 };
    const cash = supplies.reduce((sum, s) => sum + s.price_cash, 0);
    const bank = supplies.reduce((sum, s) => sum + s.price_bank, 0);
    return { cash, bank, total: cash + bank };
  }, [supplies]);

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['cashFlows', selectedDate] });
    queryClient.invalidateQueries({ queryKey: ['supplies', selectedDate] });
    setIsModalOpen(false);
    setSelectedOperation(null);
  };

  const handleAddOperationClick = () => {
    setSelectedOperation(null);
    setIsModalOpen(true);
  };

  const handleEditOperationClick = (operation: CashFlowOperation) => {
    if (isToday) {
      setSelectedOperation(operation);
      setIsModalOpen(true);
    }
  };

  const isLoading = cashFlowsLoading || suppliesLoading;

  if (cashFlowsError || suppliesError) {
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
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Управление финансами</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-48"
            />
            <Button onClick={handleAddOperationClick}>
              <PlusCircle className="mr-2 h-4 w-4" /> Добавить операцию
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard 
            title="Доходы" 
            value={isLoading ? "..." : formatCurrency(cashFlowTotals.income)} 
            className="text-green-600"
            tooltipContent="Сумма всех взносов за выбранный день."
          />
          <StatCard 
            title="Расходы" 
            value={isLoading ? "..." : formatCurrency(cashFlowTotals.expense)} 
            className="text-red-600"
            tooltipContent="Сумма всех расходов за день."
          />
          <StatCard 
            title="Итого" 
            value={isLoading ? "..." : formatCurrency(cashFlowTotals.balance)} 
            className="text-blue-600"
            tooltipContent="Баланс доходов и расходов."
          />
        </div>

        {/* Cash Flows */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Движение средств за день</CardTitle>
            <FilterButtons 
              options={cashFlowFilterOptions}
              selectedValue={cashFlowFilter}
              onValueChange={setCashFlowFilter}
            />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Дата/время</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center p-8">Загрузка...</TableCell>
                  </TableRow>
                ) : visibleCashFlows.length > 0 ? (
                  visibleCashFlows.map(op => (
                    <TableRow 
                      key={op.id} 
                      onClick={() => handleEditOperationClick(op)}
                      className={isToday ? "cursor-pointer hover:bg-gray-50" : "cursor-default"}
                    >
                      <TableCell className={op.amount >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
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
          </CardContent>
        </Card>

        {/* Supplies */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Поставки за день</CardTitle>
            <FilterButtons 
              options={supplyFilterOptions}
              selectedValue={supplyFilter}
              onValueChange={setSupplyFilter}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard 
                title="Наличные" 
                value={isLoading ? "..." : formatCurrency(supplyTotals.cash)} 
                className="text-cyan-600"
                tooltipContent="Сумма всех поставок за день, оплаченных наличными."
              />
              <StatCard 
                title="Банк" 
                value={isLoading ? "..." : formatCurrency(supplyTotals.bank)} 
                className="text-orange-600"
                tooltipContent="Поставки, оплаченные через банк."
              />
              <StatCard 
                title="Всего" 
                value={isLoading ? "..." : formatCurrency(supplyTotals.total)} 
                className="text-slate-800"
                tooltipContent="Общая сумма всех поставок за день."
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Поставщик</TableHead>
                  <TableHead>Наличные</TableHead>
                  <TableHead>Банк</TableHead>
                  <TableHead>Бонус</TableHead>
                  <TableHead>Обмен</TableHead>
                  <TableHead>Накладная</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center">Загрузка...</TableCell></TableRow>
                ) : supplies && supplies.length > 0 ? (
                  supplies.map(s => (
                    <TableRow key={s.id}>
                      <TableCell>{s.supplier}</TableCell>
                      <TableCell>{formatCurrency(s.price_cash)}</TableCell>
                      <TableCell>{formatCurrency(s.price_bank)}</TableCell>
                      <TableCell className="text-green-600 font-medium">{s.bonus}</TableCell>
                      <TableCell className="text-red-600 font-medium">{s.exchange}</TableCell>

                      <TableCell>
                        {s.invoice_html ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setInvoiceHtml(s.invoice_html)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Открыть
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Нет поставок за выбранный день.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Fullscreen Invoice Viewer */}
      <Dialog open={!!invoiceHtml} onOpenChange={() => setInvoiceHtml(null)}>
        <DialogContent className="w-screen h-screen max-w-none m-0 rounded-none p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Накладная
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto p-6 bg-background">
            {invoiceHtml && (
              <div
                className="max-w-4xl mx-auto bg-card p-6 rounded-lg border shadow-sm"
                dangerouslySetInnerHTML={{ __html: invoiceHtml }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <CashFlowModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleSuccess}
        operationToEdit={selectedOperation}
        isReadOnly={!isToday}
      />
    </Layout>
  );
};

export default FinancePage;