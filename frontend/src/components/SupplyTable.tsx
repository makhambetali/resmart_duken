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
import { MoreHorizontal, Edit, CheckCircle, AlertCircle, CalendarDays, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SupplyTableProps {
  supplies: Supply[];
  onEditSupply: (supply: Supply) => void;
  groupedByDate?: boolean;
}

export const SupplyTable: React.FC<SupplyTableProps> = ({ 
  supplies, 
  onEditSupply,
  groupedByDate = true 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KZ', {
      style: 'currency',
      currency: 'KZT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const formatArrivalDate = (dateString: string | null) => {
    if (!dateString) {
      return "Дата прибытия не указана";
    }
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className="space-y-4">
        {groupedSupplies.map(([date, daySupplies]) => (
          <Card key={date} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
            {groupedByDate && date !== 'all' && (
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {formatDate(date)}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Итого:</span>
                    <Badge variant="secondary" className="px-3 py-1 text-base font-medium bg-white border border-blue-200">
                      <span className="text-blue-700">{formatCurrency(calculateDayTotal(daySupplies))}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            )}
            
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[200px]">Поставщик</TableHead>
                    <TableHead className="w-[120px]">Оплата</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead className="hidden md:table-cell">Бонус</TableHead>
                    <TableHead className="hidden md:table-cell">Обмен</TableHead>
                    <TableHead className="hidden lg:table-cell">Комментарий</TableHead>
                    <TableHead className="w-[180px]">Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {daySupplies.length > 0 ? (
                    daySupplies.map((supply) => (
                      <TableRow key={supply.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {supply.supplier}
                            {/* --- Начало изменений: Добавлен символ переноса --- */}
                            {(supply as any).is_rescheduled && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="16" 
                                    height="16" 
                                    fill="currentColor" 
                                    className="bi bi-arrow-clockwise text-amber-600 cursor-help"
                                    viewBox="0 0 16 16"
                                  >
                                    <path 
                                      fillRule="evenodd" 
                                      d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                                    />
                                    <path 
                                      d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"
                                    />
                                  </svg>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Перенесенная поставка</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {/* --- Конец изменений --- */}
                            {supply.comment && (
                              <Info className="h-4 w-4 text-gray-400 lg:hidden" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "border font-normal",
                              supply.price_bank === 0 ? 'border-green-200 bg-green-50 text-green-700' : 
                              supply.price_cash === 0 ? 'border-blue-200 bg-blue-50 text-blue-700' : 
                              'border-purple-200 bg-purple-50 text-purple-700'
                            )}
                          >
                            {supply.price_bank === 0 ? 'Наличные' : 
                             supply.price_cash === 0 ? 'Банк' : 'Смешанная'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            {supply.price_cash > 0 && (
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-gray-500">Нал:</span>
                                <span className="font-medium">{formatCurrency(supply.price_cash)}</span>
                              </div>
                            )}
                            {supply.price_bank > 0 && (
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-gray-500">Банк:</span>
                                <span className="font-medium">{formatCurrency(supply.price_bank)}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {supply.bonus > 0 ? (
                            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                              {supply.bonus}
                            </Badge>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {supply.exchange > 0 ? (
                            <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">
                              {supply.exchange}
                            </Badge>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell max-w-[200px]">
                          <div className="truncate text-gray-600">
                            {supply.comment || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge 
                                className={cn(
                                  "flex items-center gap-1.5 py-1 cursor-default",
                                  supply.is_confirmed 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-rose-100 text-rose-800"
                                )}
                                variant="secondary"
                              >
                                {supply.is_confirmed ? (
                                  <>
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    <span>Подтверждена</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    <span>Не подтверждена</span>
                                  </>
                                )}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{formatArrivalDate((supply as any).arrival_date)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Открыть меню</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEditSupply(supply)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Редактировать
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Поставок за этот день не найдено.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
};