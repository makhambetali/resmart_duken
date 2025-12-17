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
import { ChevronDown, ChevronRight, Package, Calendar, Banknote, MessageSquare, CheckCircle2, Clock, FileText, X } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { suppliesApi } from '@/lib/api';


interface SupplyHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierName: string;
}

export const SupplyHistoryModal: React.FC<SupplyHistoryModalProps> = ({
  isOpen,
  onClose,
  supplierName,
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              История поставок: {supplierName}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
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
                    <Badge variant={supply.is_confirmed ? "default" : "secondary"}>
                      {supply.is_confirmed ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1" /> Подтверждено</>
                      ) : (
                        <><Clock className="h-3 w-3 mr-1" /> Ожидает</>
                      )}
                    </Badge>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="mt-2 p-4 rounded-lg border bg-card space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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

                    {supply.arrival_date && (
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Дата прибытия
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

                    {supply.invoice_html && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInvoiceHtml(supply.invoice_html);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Посмотреть накладную
                      </Button>
                    )}

                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Добавлено: {format(new Date(supply.date_added), 'd MMM yyyy, HH:mm', { locale: ru })}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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
    </>
  );
};