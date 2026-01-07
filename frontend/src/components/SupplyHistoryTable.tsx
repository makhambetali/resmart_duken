// [file name]: SupplyHistoryTable.tsx
import React, { useState, useEffect } from 'react';
import { Supply } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChevronDown, 
  ChevronRight, 
  Package, 
  Calendar, 
  Banknote, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  FileText, 
  X,
  Eye,
  ExternalLink,
  AlertCircle,
  Hourglass
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { suppliesApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';

interface SupplyHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierName: string;
  supplierId?: string;
  onSelectSupply?: (supply: Supply) => void;
}

// Функция для получения текста статуса
const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Ожидает подтверждения';
    case 'confirmed':
      return 'Ожидает оплаты';
    case 'delivered':
      return 'Подтверждена';
    default:
      return status;
  }
};

// Функция для получения иконки статуса
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <AlertCircle className="h-3 w-3" />;
    case 'confirmed':
      return <Hourglass className="h-3 w-3" />;
    case 'delivered':
      return <CheckCircle2 className="h-3 w-3" />;
    default:
      return <AlertCircle className="h-3 w-3" />;
  }
};

// Функция для получения варианта бейджа статуса
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'confirmed':
      return 'outline';
    case 'delivered':
      return 'default';
    default:
      return 'secondary';
  }
};

export const SupplyHistoryModal: React.FC<SupplyHistoryModalProps> = ({
  isOpen,
  onClose,
  supplierName,
  supplierId,
  onSelectSupply,
}) => {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [invoiceHtml, setInvoiceHtml] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && supplierName) {
      fetchSupplyHistory();
    }
  }, [isOpen, supplierName]);

  const fetchSupplyHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await suppliesApi.getSupplyHistory(supplierName);
      setSupplies(data);
    } catch (err) {
      setError('Не удалось загрузить историю поставок');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id: number) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(amount) + ' ₸';
  };

  const handleViewFullSupply = (supply: Supply) => {
    onSelectSupply?.(supply);
    onClose();
  };

  // Mobile card view
  const MobileSupplyCard = ({ supply }: { supply: Supply }) => {
    const isOpen = openItems.has(supply.id);
    
    return (
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">
                  {format(new Date(supply.delivery_date), 'd MMMM yyyy', { locale: ru })}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                  {formatCurrency(supply.price_cash + supply.price_bank)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewFullSupply(supply)}
                  className="h-7 px-2"
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Badge 
                  variant={getStatusBadgeVariant(supply.status || 'pending')} 
                  className="text-xs gap-1"
                >
                  {getStatusIcon(supply.status || 'pending')}
                  <span className="truncate max-w-[60px] sm:max-w-none">
                    {getStatusText(supply.status || 'pending')}
                  </span>
                </Badge>
              </div>
            </div>

            {isOpen && (
              <div className="pt-3 border-t space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Оплата наличными</div>
                    <div className="font-medium text-sm">{formatCurrency(supply.price_cash)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Оплата картой</div>
                    <div className="font-medium text-sm">{formatCurrency(supply.price_bank)}</div>
                  </div>
                  {supply.bonus > 0 && (
                    <div>
                      <div className="text-xs text-gray-500">Бонус</div>
                      <div className="font-medium text-sm">{supply.bonus}</div>
                    </div>
                  )}
                  {supply.exchange > 0 && (
                    <div>
                      <div className="text-xs text-gray-500">Обмен</div>
                      <div className="font-medium text-sm">{supply.exchange}</div>
                    </div>
                  )}
                </div>

                {supply.arrival_date && (
                  <div>
                    <div className="text-xs text-gray-500">Дата изменения статуса</div>
                    <div className="font-medium text-sm">
                      {format(new Date(supply.arrival_date), 'd MMM, HH:mm', { locale: ru })}
                    </div>
                  </div>
                )}

                {supply.comment && (
                  <div>
                    <div className="text-xs text-gray-500">Комментарий</div>
                    <div className="text-sm bg-gray-50 p-2 rounded mt-1">{supply.comment}</div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenItems(new Set())}
                    className="flex-1"
                  >
                    Свернуть
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewFullSupply(supply)}
                    className="flex-1 gap-1"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Подробнее
                  </Button>
                </div>
              </div>
            )}

            {!isOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleItem(supply.id)}
                className="w-full justify-start text-xs text-gray-500"
              >
                <ChevronRight className="h-3 w-3 mr-1" />
                Подробнее
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0 sm:max-w-[95vw]">
          <DialogHeader className="px-4 sm:px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Package className="h-5 w-5 text-primary flex-shrink-0" />
                <DialogTitle className="text-lg sm:text-xl truncate">
                  История поставок: {supplierName}
                </DialogTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3">
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-8 text-destructive">
                {error}
              </div>
            )}

            {!loading && !error && supplies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                История поставок пуста
              </div>
            )}

            {/* Mobile View */}
            <div className="sm:hidden">
              {!loading && !error && supplies.map(supply => (
                <MobileSupplyCard key={supply.id} supply={supply} />
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block">
              {!loading && !error && supplies.map(supply => (
                <Collapsible
                  key={supply.id}
                  open={openItems.has(supply.id)}
                  onOpenChange={() => toggleItem(supply.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        {openItems.has(supply.id) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div className="text-left">
                          <div className="font-medium">
                            {format(new Date(supply.delivery_date), 'd MMMM yyyy', { locale: ru })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(supply.price_cash + supply.price_bank)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewFullSupply(supply);
                          }}
                          className="h-7 px-2"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Badge 
                          variant={getStatusBadgeVariant(supply.status || 'pending')}
                          className="gap-1"
                        >
                          {getStatusIcon(supply.status || 'pending')}
                          {getStatusText(supply.status || 'pending')}
                        </Badge>
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="mt-2 p-4 rounded-lg border bg-card space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-2 gap-4 flex-1">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Banknote className="h-3 w-3" /> Оплата наличными
                            </div>
                            <div className="font-medium">{formatCurrency(supply.price_cash)}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Banknote className="h-3 w-3" /> Оплата картой
                            </div>
                            <div className="font-medium">{formatCurrency(supply.price_bank)}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Бонус</div>
                            <div className="font-medium">{supply.bonus}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Кол-во обмена</div>
                            <div className="font-medium">{supply.exchange}</div>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewFullSupply(supply)}
                          className="h-8 gap-1"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Детали
                        </Button>
                      </div>

                      {supply.arrival_date && (
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Дата изменения статуса
                          </div>
                          <div className="font-medium">
                            {format(new Date(supply.arrival_date), 'd MMMM yyyy, HH:mm', { locale: ru })}
                          </div>
                        </div>
                      )}

                      {supply.comment && (
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" /> Комментарий
                          </div>
                          <div className="text-sm bg-muted/50 p-2 rounded">{supply.comment}</div>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground pt-2 border-t">
                        Добавлено: {format(new Date(supply.date_added), 'd MMM yyyy, HH:mm', { locale: ru })}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Invoice Viewer */}
      <Dialog open={!!invoiceHtml} onOpenChange={() => setInvoiceHtml(null)}>
        <DialogContent className="w-screen h-screen max-w-none m-0 rounded-none p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Накладная
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setInvoiceHtml(null)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-4 sm:p-6 bg-background">
            {invoiceHtml && (
              <div 
                className="max-w-4xl mx-auto bg-card p-4 sm:p-6 rounded-lg border shadow-sm overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: invoiceHtml }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};