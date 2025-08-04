import React, { useState, useEffect } from 'react';
import { Supply, AddSupplyForm } from '@/types/supply';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SupplierSearchCombobox } from '@/components/SupplierSearchCombobox';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Trash, FileText } from "lucide-react"; // Import FileText icon
import { formatPrice, getNumericValue } from '@/lib/utils';

interface SupplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleDeleteSupply: (id: string) => void;
  supply?: Supply | null;
  onSubmit: (data: Omit<AddSupplyForm, 'images'>) => Promise<void>;
  suppliers: Array<{ id: string; name: string }>;
}

export const SupplyModal: React.FC<SupplyModalProps> = ({
  open,
  onOpenChange,
  handleDeleteSupply,
  supply,
  onSubmit,
  suppliers,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [existingInvoiceUrl, setExistingInvoiceUrl] = useState<string | null>(null); // State for existing invoice URL
  const [formData, setFormData] = useState<Omit<AddSupplyForm, 'images'>>({
    supplier: '',
    paymentType: 'cash',
    price_cash: '0',
    price_bank: '0',
    bonus: 0,
    exchange: 0,
    delivery_date: new Date().toISOString().split('T')[0],
    comment: '',
    is_confirmed: false,
    invoice: null,
  });

  const today = new Date().toISOString().split('T')[0];
  const plus7 = new Date(Date.now() + 7 * 864e5).toISOString().split('T')[0];
  const isToday = formData.delivery_date === today;

  useEffect(() => {
    if (supply && open) {
      let paymentType: 'cash' | 'bank' | 'mixed' = 'cash';
      if (supply.price_cash > 0 && supply.price_bank > 0) {
        paymentType = 'mixed';
      } else if (supply.price_bank > 0) {
        paymentType = 'bank';
      }

      setFormData({
        supplier: supply.supplier,
        paymentType,
        price_cash: formatPrice(supply.price_cash.toString()),
        price_bank: formatPrice(supply.price_bank.toString()),
        bonus: supply.bonus,
        exchange: supply.exchange,
        delivery_date: supply.delivery_date,
        comment: supply.comment || '',
        is_confirmed: supply.is_confirmed,
        invoice: null,
      });
      
      // Set the existing invoice URL
      setExistingInvoiceUrl(supply.invoice || null);

    } else if (open) {
      setFormData({
        supplier: '',
        paymentType: 'cash',
        price_cash: '0',
        price_bank: '0',
        bonus: 0,
        exchange: 0,
        delivery_date: new Date().toISOString().split('T')[0],
        comment: '',
        is_confirmed: false,
        invoice: null,
      });

      // Reset the existing invoice URL
      setExistingInvoiceUrl(null);
    }
  }, [supply, open]);

  const handleFocus = (field: keyof Omit<AddSupplyForm, 'images' | 'invoice'>) => {
    setFormData(prev => {
      const value = prev[field];
      if (value === '0' || value === 0) {
        return { ...prev, [field]: '' };
      }
      return prev;
    });
  };

  const handleBlur = (field: 'price_cash' | 'price_bank' | 'bonus' | 'exchange') => {
    setFormData(prev => {
      if (prev[field] === '') {
        const defaultValue = (field === 'price_cash' || field === 'price_bank') ? '0' : 0;
        return { ...prev, [field]: defaultValue };
      }
      return prev;
    });
  };

  const handlePriceChange = (field: 'price_cash' | 'price_bank', value: string) => {
    let numericValue = value.replace(/\D/g, '');
    if (numericValue.length > 6) {
        numericValue = numericValue.slice(0, 6);
    }
    const formatted = formatPrice(numericValue);
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const handleNumericInputChange = (field: 'bonus' | 'exchange', value: string) => {
    let numericValue = value.replace(/\D/g, '');

    if (numericValue.length > 3) {
      numericValue = numericValue.slice(0, 3);
    }

    setFormData(prev => ({ ...prev, [field]: Number(numericValue) || 0 }));
  };

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData(prev => ({ ...prev, invoice: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        price_cash: getNumericValue(formData.price_cash),
        price_bank: getNumericValue(formData.price_bank),
      };

      await onSubmit(submitData);
      toast({
        title: supply ? 'Поставка обновлена' : 'Поставка добавлена',
        description: 'Операция выполнена успешно',
        variant: "default",
        className: "bg-green-500 text-white",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting supply:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить поставку',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentTypeChange = (newPaymentType: 'cash' | 'bank' | 'mixed') => {
    setFormData(prev => {
      const cashValue = getNumericValue(prev.price_cash);
      const bankValue = getNumericValue(prev.price_bank);
      const totalValue = Number(cashValue) + Number(bankValue);

      let newCash = '0';
      let newBank = '0';

      if (newPaymentType === 'cash') {
        newCash = formatPrice(totalValue.toString());
      } else if (newPaymentType === 'bank') {
        newBank = formatPrice(totalValue.toString());
      } else {
        newCash = prev.price_cash;
        newBank = prev.price_bank;
      }

      return {
        ...prev,
        paymentType: newPaymentType,
        price_cash: newCash,
        price_bank: newBank,
      };
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-2xl rounded-none border-none overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {supply ? 'Редактировать поставку' : 'Добавить поставку'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="supplier">Поставщик</Label>
              <SupplierSearchCombobox
                value={formData.supplier}
                onValueChange={(value) => setFormData(prev => ({ ...prev, supplier: value }))}
                placeholder="Выберите поставщика..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentType">Тип оплаты</Label>
              <Select
                value={formData.paymentType}
                onValueChange={handlePaymentTypeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Наличные</SelectItem>
                  <SelectItem value="bank">Банк</SelectItem>
                  <SelectItem value="mixed">Смешанная</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cashAmount">Сумма наличными (₸)</Label>
              <Input
                id="cashAmount"
                type="text"
                placeholder="0"
                value={formData.price_cash}
                onChange={(e) => handlePriceChange('price_cash', e.target.value)}
                disabled={formData.paymentType === 'bank'}
                onFocus={() => handleFocus('price_cash')}
                onBlur={() => handleBlur('price_cash')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAmount">Сумма банком (₸)</Label>
              <Input
                id="bankAmount"
                type="text"
                placeholder="0"
                value={formData.price_bank}
                onChange={(e) => handlePriceChange('price_bank', e.target.value)}
                disabled={formData.paymentType === 'cash'}
                onFocus={() => handleFocus('price_bank')}
                onBlur={() => handleBlur('price_bank')}
              />
            </div>

            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="bonus">Бонус</Label>
                  <Input
                    id="bonus"
                    type="number"
                    max="999"
                    value={formData.bonus}
                    onChange={(e) => handleNumericInputChange('bonus', e.target.value)}
                    onFocus={() => handleFocus('bonus')}
                    onBlur={() => handleBlur('bonus')}
                  />
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="exchange">Обмен</Label>
                  <Input
                    id="exchange"
                    type="number"
                    max="999"
                    value={formData.exchange}
                    onChange={(e) => handleNumericInputChange('exchange', e.target.value)}
                    onFocus={() => handleFocus('exchange')}
                    onBlur={() => handleBlur('exchange')}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="deliveryDate">Дата поставки</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    min={today}
                    max={plus7}
                    value={formData.delivery_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, delivery_date: e.target.value }))}
                  />
                </div>
              </div>
              {!isToday && (
                  <p className="text-sm text-amber-600 mt-2">
                    ⚠️ Для поставок с датой отличной от сегодняшней нельзя подтвердить товар или прикрепить документы
                  </p>
                )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="comment">Комментарий</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="invoice">Счет-фактура (PDF)</Label>
              
              {/* --- NEW: Link to existing invoice --- */}
              {supply && existingInvoiceUrl && (
                <div className="mb-2">
                  <a
                    href={existingInvoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-600 hover:underline"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Просмотреть текущий счет-фактуру
                  </a>
                </div>
              )}

              <Input
                id="invoice"
                type="file"
                accept=".pdf"
                onChange={handleInvoiceChange}
                disabled={!isToday}
              />
               <Input
                id="invoice_phone"
                type="file"
                accept=".pdf"
                // onChange={handleInvoiceChange}
                disabled={!isToday}
              />
              {formData.invoice && <p className="text-sm text-muted-foreground mt-1">Выбран новый файл: {formData.invoice.name}</p>}
            </div>

            <div className="flex items-center space-x-2 md:col-span-2">
              <Checkbox
                id="isConfirmed"
                checked={formData.is_confirmed}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, is_confirmed: Boolean(checked) }))
                }
                disabled={!isToday}
              />
              <Label htmlFor="isConfirmed" className={!isToday ? 'text-muted-foreground' : ''}>
                Подтверждена
              </Label>
              {!isToday && (
                <span className="text-sm text-muted-foreground">
                  (доступно только для сегодняшней даты)
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div>
              {supply && (
                <Button type="button" variant="destructive" onClick={() => handleDeleteSupply(supply.id)} disabled={isLoading}>
                  <Trash className="w-4 h-4 mr-2" />
                  Удалить
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading || !formData.supplier}>
                {isLoading ? 'Сохранение...' : (supply ? 'Обновить' : 'Добавить')}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};