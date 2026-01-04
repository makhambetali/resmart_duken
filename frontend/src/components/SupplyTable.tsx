import React from 'react';
import { Supply } from '@/types/supply';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  MoreHorizontal, 
  Edit, 
  CheckCircle, 
  AlertCircle, 
  CalendarDays, 
  Info,
  Wallet,
  CreditCard,
  Repeat,
  User,
  MessageSquare,
  Clock,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SupplyTableProps {
  supplies: Supply[];
  onEditSupply: (supply: Supply) => void;
  onSupplierClick: (supplierName: string) => void;
  groupedByDate?: boolean;
}

export const SupplyTable: React.FC<SupplyTableProps> = ({ 
  supplies, 
  onEditSupply,
  onSupplierClick,
  groupedByDate = true 
}) => {
  const formatCurrency = (amount: number) => {
    if (!amount) return '0 ₸';
    return new Intl.NumberFormat('ru-KZ', {
      style: 'currency',
      currency: 'KZT',
      minimumFractionDigits: 0,
    }).format(amount).replace('KZT', '₸');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    }
    
    return date.toLocaleDateString('ru-RU', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };
  
  const formatArrivalDate = (dateString: string | null) => {
    if (!dateString) {
      return "Дата прибытия не указана";
    }
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Сегодня ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Вчера ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const groupSuppliesByDate = (supplies: Supply[]): [string, Supply[]][] => {
    const grouped = supplies.reduce((acc, supply) => {
      const date = supply.delivery_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(supply);
      return acc;
    }, {} as Record<string, Supply[]>);

    return Object.entries(grouped).sort(([a], [b]) => 
      new Date(a).getTime() - new Date(b).getTime()
    );
  };

  const calculateDayTotal = (supplies: Supply[]) => {
    return supplies.reduce((total, supply) => 
      total + supply.price_cash + supply.price_bank, 0
    );
  };

  const groupedSupplies: [string, Supply[]][] = groupedByDate ? groupSuppliesByDate(supplies) : [['all', supplies]];

  if (supplies.length === 0 && !groupedByDate) {
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader />
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Поставок не найдено.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-3 sm:space-y-4">
        {groupedSupplies.map(([date, daySupplies]) => (
          <Card key={date} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
            {groupedByDate && date !== 'all' && (
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 sm:px-6 py-2 sm:py-3 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        {formatDate(date)}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(date).toLocaleDateString('ru-RU', { 
                          day: '2-digit', 
                          month: '2-digit',
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-gray-500">Итого:</span>
                    <Badge variant="secondary" className="px-2 py-0.5 sm:px-3 sm:py-1 text-sm sm:text-base font-medium bg-white border border-blue-200">
                      <span className="text-blue-700">{formatCurrency(calculateDayTotal(daySupplies))}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            )}
            
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[140px] sm:w-[200px]">
                        <div className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                          <span className="hidden sm:inline">Поставщик</span>
                          <span className="sm:hidden">Поставщик</span>
                        </div>
                      </TableHead>
                      <TableHead className="w-[100px] sm:w-[120px]">
                        <div className="flex items-center gap-1">
                          <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                          <span className="hidden sm:inline">Оплата</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <span className="hidden sm:inline">Сумма</span>
                        <span className="sm:hidden">₸</span>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <span className="text-xs">Бонус</span>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <span className="text-xs">Обмен</span>
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                          <span>Комментарий</span>
                        </div>
                      </TableHead>
                      <TableHead className="w-[50px] sm:w-[80px]">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                          <span className="hidden sm:inline text-xs">Статус</span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {daySupplies.length > 0 ? (
                      daySupplies.map((supply) => (
                        <TableRow 
                          key={supply.id}
                          className="cursor-pointer hover:bg-gray-50/80 transition-colors"
                          onClick={() => onEditSupply(supply)}
                        >
                          <TableCell className="font-medium py-3 sm:py-4">
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSupplierClick(supply.supplier);
                                }}
                                className="text-left hover:text-blue-600 hover:underline focus:outline-none focus:text-blue-700 transition-colors flex items-start gap-2 group"
                              >
                                <Building className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span className="truncate text-sm sm:text-base group-hover:text-blue-600">
                                  {supply.supplier}
                                </span>
                              </button>
                              {(supply as any).rescheduled_cnt > 0 && (
                                <div className="flex items-center gap-1">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1">
                                        <Repeat className="h-3 w-3 text-amber-600 flex-shrink-0" />
                                        <span className="text-xs text-amber-600 font-medium">
                                          {supply.rescheduled_cnt}×
                                        </span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                      <p className="text-xs">Перенесена {supply.rescheduled_cnt} раз</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-3 sm:py-4">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "h-6 sm:h-7 border font-normal px-2",
                                    supply.price_bank === 0 ? 'border-green-200 bg-green-50 text-green-700' : 
                                    supply.price_cash === 0 ? 'border-blue-200 bg-blue-50 text-blue-700' : 
                                    'border-purple-200 bg-purple-50 text-purple-700'
                                  )}
                                >
                                  {supply.price_bank === 0 ? (
                                    <Wallet className="h-3.5 w-3.5" />
                                  ) : supply.price_cash === 0 ? (
                                    <CreditCard className="h-3.5 w-3.5" />
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <Wallet className="h-3 w-3" />
                                      <CreditCard className="h-3 w-3" />
                                    </div>
                                  )}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                {supply.price_bank === 0 ? 'Наличные' : 
                                 supply.price_cash === 0 ? 'Банк' : 'Смешанная оплата'}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="py-3 sm:py-4">
                            <div className="flex flex-col gap-0.5 sm:gap-1">
                              {supply.price_cash > 0 && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1 text-xs sm:text-sm">
                                      <Wallet className="h-3 w-3 text-green-600 flex-shrink-0" />
                                      <span className="font-medium truncate">
                                        {formatCurrency(supply.price_cash)}
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p>Наличными: {formatCurrency(supply.price_cash)}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {supply.price_bank > 0 && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1 text-xs sm:text-sm">
                                      <CreditCard className="h-3 w-3 text-blue-600 flex-shrink-0" />
                                      <span className="font-medium truncate">
                                        {formatCurrency(supply.price_bank)}
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p>Банком: {formatCurrency(supply.price_bank)}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {supply.price_cash === 0 && supply.price_bank === 0 && (
                                <span className="text-xs text-gray-400">0</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell py-3 sm:py-4">
                            {supply.bonus > 0 ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 px-2 py-0.5">
                                    {supply.bonus}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Бонусов: {supply.bonus} шт.</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell py-3 sm:py-4">
                            {supply.exchange > 0 ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700 px-2 py-0.5">
                                    {supply.exchange}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Обменов: {supply.exchange} шт.</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell max-w-[200px] py-3 sm:py-4">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="truncate text-gray-600 text-sm">
                                  {supply.comment || '-'}
                                </div>
                              </TooltipTrigger>
                              {supply.comment && (
                                <TooltipContent className="max-w-xs">
                                  <p className="text-sm">{supply.comment}</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TableCell>
                          <TableCell className="py-3 sm:py-4">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex justify-center">
                                  <Badge 
                                    className={cn(
                                      "h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-full cursor-default p-0",
                                      supply.is_confirmed 
                                        ? "bg-green-100 text-green-800 border border-green-200" 
                                        : "bg-rose-100 text-rose-800 border border-rose-200"
                                    )}
                                    variant="secondary"
                                  >
                                    {supply.is_confirmed ? (
                                      <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    ) : (
                                      <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    )}
                                  </Badge>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <div className="text-center">
                                  <p className="font-medium">
                                    {supply.is_confirmed ? 'Подтверждена' : 'Не подтверждена'}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatArrivalDate((supply as any).arrival_date)}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          <div className="flex flex-col items-center gap-2 text-gray-500">
                            <Info className="h-6 w-6" />
                            <p>Поставок за этот день не найдено.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
};