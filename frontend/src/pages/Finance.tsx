import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cashFlowApi, suppliesApi } from '@/lib/api';
import { CashFlowOperation, Supply } from '@/types/supply';
import { PlusCircle, AlertTriangle, ChevronsDown, ChevronsUp, Info, FileText, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { CashFlowModal } from '@/components/CashFlowModal';

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

// Компонент для полноэкранного отображения таблицы
const FullscreenInvoiceTable = ({ 
  html, 
  supplier,
  onClose 
}: { 
  html: string; 
  supplier: string;
  onClose: () => void;
}) => {
  const [processedHtml, setProcessedHtml] = useState<string>('');

  useEffect(() => {
    if (!html) {
      setProcessedHtml('');
      return;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const tables = doc.querySelectorAll('table');
      
      if (tables.length === 0) {
        setProcessedHtml('');
        return;
      }

      // Удаляем все кроме таблиц и добавляем стили
      let result = '';
      tables.forEach((table, index) => {
        // Клонируем таблицу чтобы не мутировать оригинальный DOM
        const tableClone = table.cloneNode(true) as HTMLTableElement;
        
        // Очищаем таблицу от лишних атрибутов
        tableClone.removeAttribute('class');
        tableClone.removeAttribute('style');
        tableClone.removeAttribute('border');
        tableClone.removeAttribute('cellspacing');
        tableClone.removeAttribute('cellpadding');
        
        // Добавляем базовые стили
        tableClone.setAttribute('style', 'border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;');
        
        // Обрабатываем заголовки
        const headers = tableClone.querySelectorAll('th');
        headers.forEach(th => {
          const style = `
            border: 1px solid #e2e8f0;
            padding: 12px 16px;
            text-align: left;
            font-weight: 600;
            background-color: #f8fafc;
            color: #1e293b;
            font-size: 14px;
          `;
          th.setAttribute('style', style);
        });

        // Обрабатываем ячейки
        const cells = tableClone.querySelectorAll('td');
        cells.forEach((td, cellIndex) => {
          const style = `
            border: 1px solid #e2e8f0;
            padding: 10px 16px;
            color: #334155;
            font-size: 14px;
            ${cellIndex % 2 === 0 ? 'background-color: #f8fafc;' : ''}
          `;
          td.setAttribute('style', style);
        });

        // Чередование строк
        const rows = tableClone.querySelectorAll('tr');
        rows.forEach((row, rowIndex) => {
          if (rowIndex % 2 === 0) {
            row.setAttribute('style', 'background-color: #ffffff;');
          } else {
            row.setAttribute('style', 'background-color: #f8fafc;');
          }
        });

        result += tableClone.outerHTML;
      });

      setProcessedHtml(result);
    } catch (error) {
      console.error('Error processing invoice HTML:', error);
      setProcessedHtml(html); // Возвращаем оригинальный HTML в случае ошибки
    }
  }, [html]);

  if (!processedHtml) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-500">Нет данных для отображения</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Минимальный заголовок */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-gray-600" />
          <div className="text-sm font-medium text-gray-900">{supplier}</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Контейнер для таблицы с прокруткой */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-full">
          <div 
            className="invoice-table"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />
        </div>
      </div>

      <style>{`
        .invoice-table {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        .invoice-table table {
          width: 100%;
          border-collapse: collapse;
          margin: 0 auto;
        }
        
        .invoice-table th {
          border: 1px solid #e2e8f0;
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          background-color: #f8fafc;
          color: #1e293b;
          font-size: 14px;
          white-space: nowrap;
        }
        
        .invoice-table td {
          border: 1px solid #e2e8f0;
          padding: 10px 16px;
          color: #334155;
          font-size: 14px;
          vertical-align: top;
        }
        
        .invoice-table tr:nth-child(even) {
          background-color: #f8fafc;
        }
        
        .invoice-table tr:hover {
          background-color: #f1f5f9;
        }
        
        /* Стили для числовых ячеек */
        .invoice-table td {
          text-align: left;
        }
        
        .invoice-table td:last-child {
          text-align: right;
        }
        
        @media print {
          body * {
            visibility: hidden;
          }
          
          .invoice-table,
          .invoice-table * {
            visibility: visible;
          }
          
          .invoice-table {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
          
          .invoice-table th,
          .invoice-table td {
            border-color: #000 !important;
            color: #000 !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

// Простая модалка для полноэкранного просмотра
const FullscreenInvoiceModal = ({ 
  html, 
  supplier,
  onClose 
}: { 
  html: string; 
  supplier: string;
  onClose: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (html) {
      setIsOpen(true);
    }
  }, [html]);

  useEffect(() => {
    if (!isOpen && onClose) {
      onClose();
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white">
      {html && (
        <FullscreenInvoiceTable
          html={html}
          supplier={supplier}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};


const FinancePage = () => {
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<CashFlowOperation | null>(null);
  const [isCashFlowsExpanded, setIsCashFlowsExpanded] = useState(false);

  const [cashFlowFilter, setCashFlowFilter] = useState('all');
  const [supplyFilter, setSupplyFilter] = useState('all');

  const [selectedInvoice, setSelectedInvoice] = useState<{
    html: string;
    supplier: string;
  } | null>(null);

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
    enabled: !!selectedDate,
  });

  const { 
    data: supplies, 
    isLoading: suppliesLoading, 
    error: suppliesError 
  } = useQuery({
    queryKey: ['supplies', selectedDate, supplyFilter],
    queryFn: () => suppliesApi.getSuppliesByDate(selectedDate, supplyFilter),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!selectedDate,
  });

  useEffect(() => {
    if (selectedDate) {
      setIsCashFlowsExpanded(false);
      setCashFlowFilter('all');
      setSupplyFilter('all');
      
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

  const handleViewInvoice = (supply: Supply) => {
    console.log('Opening invoice for:', supply.supplier);
    console.log('HTML length:', supply.invoice_html?.length);
    
    if (supply.invoice_html) {
      setSelectedInvoice({
        html: supply.invoice_html,
        supplier: supply.supplier,
      });
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
                      <TableCell className="font-medium">{s.supplier}</TableCell>
                      <TableCell>{formatCurrency(s.price_cash)}</TableCell>
                      <TableCell>{formatCurrency(s.price_bank)}</TableCell>
                      <TableCell>
                        {s.bonus > 0 ? (
                          <div className="text-green-600 font-medium">{s.bonus}</div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {s.exchange > 0 ? (
                          <div className="text-red-600 font-medium">{s.exchange}</div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {s.invoice_html ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewInvoice(s)}
                            className="gap-2"
                          >
                            <FileText className="h-4 w-4" />
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

      {/* Fullscreen Invoice Modal */}
      {selectedInvoice && (
        <FullscreenInvoiceModal
          html={selectedInvoice.html}
          supplier={selectedInvoice.supplier}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

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