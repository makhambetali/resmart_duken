// @/components/SupplyModal.tsx - упрощенная версия
import React, { useState, useEffect } from 'react';
import { Supply, AddSupplyForm } from '@/types/supply';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SupplierSearchCombobox } from '@/components/SupplierSearchCombobox';
import { useToast } from '@/hooks/use-toast';
import { 
  Trash, 
  Loader2,
  Calendar,
  CreditCard,
  Wallet,
  MessageSquare,
  Building,
  Package,
  Plus
} from "lucide-react";
import { formatPrice } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';

interface SupplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleDeleteSupply: (id: string) => void;
  supply?: Supply | null;
  onSubmit: (data: Omit<AddSupplyForm, 'images'> & { images?: File[] }) => Promise<void>;
  suppliers: Array<{ id: string; name: string }>;
  initialSupplier?: string;
}

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

const getDayAfterTomorrow = () => {
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  return dayAfterTomorrow.toISOString().split('T')[0];
};

interface MoneyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValueChange: (value: string) => void;
}

const MoneyInput: React.FC<MoneyInputProps> = ({ 
  value, 
  onValueChange, 
  disabled,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (value === '0' || value === '0 ₸') {
      onValueChange('');
    }
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (!value.trim()) {
      onValueChange('0 ₸');
    }
    if (props.onBlur) props.onBlur(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^\d]/g, '').slice(0, 9);
    
    if (numericValue === '') {
      onValueChange('');
    } else {
      const formattedValue = formatPrice(numericValue);
      onValueChange(formattedValue);
    }
  };

  const displayValue = value === '0' || value === '0 ₸' || value === '' 
    ? (isFocused ? '' : '0 ₸') 
    : value;

  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className="pr-10 h-9 md:h-10"
        maxLength={13}
        {...props}
      />
      {!isFocused && value !== '' && value !== '0' && value !== '0 ₸' && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
          ₸
        </div>
      )}
    </div>
  );
};

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
  const [formData, setFormData] = useState<Omit<AddSupplyForm, 'images'>>({
    supplier: '',
    paymentType: 'cash',
    price_cash: '0 ₸',
    price_bank: '0 ₸',
    bonus: 0,
    exchange: 0,
    delivery_date: getTomorrowDate(),
    comment: '',
    is_confirmed: false,
    invoice_html: '',
  });

  const tomorrow = getTomorrowDate();
  const dayAfterTomorrow = getDayAfterTomorrow();

  useEffect(() => {
    if (open && supply) {
      let paymentType: 'cash' | 'bank' | 'mixed' = 'cash';
      if (supply.price_cash > 0 && supply.price_bank > 0) paymentType = 'mixed';
      else if (supply.price_bank > 0) paymentType = 'bank';

      setFormData({
        supplier: supply.supplier,
        paymentType,
        price_cash: supply.price_cash > 0 ? formatPrice(supply.price_cash.toString()) : '0 ₸',
        price_bank: supply.price_bank > 0 ? formatPrice(supply.price_bank.toString()) : '0 ₸',
        bonus: supply.bonus,
        exchange: supply.exchange,
        delivery_date: supply.delivery_date,
        comment: supply.comment || '',
        is_confirmed: supply.is_confirmed,
        invoice_html: '',
      });
    } else if (open) {
      setFormData({
        supplier: '', 
        paymentType: 'cash', 
        price_cash: '0 ₸',
        price_bank: '0 ₸', 
        bonus: 0, 
        exchange: 0,
        delivery_date: tomorrow,
        comment: '', 
        is_confirmed: false, 
        invoice_html: '',
      });
    }
  }, [supply, open, tomorrow]);

  const handleDateSelect = (date: string) => {
    setFormData(prev => ({ ...prev, delivery_date: date }));
  };

  const handlePaymentTypeChange = (newPaymentType: 'cash' | 'bank' | 'mixed') => {
    setFormData(prev => {
      const newData = { ...prev, paymentType: newPaymentType };
      
      if (prev.paymentType === 'mixed' && (newPaymentType === 'cash' || newPaymentType === 'bank')) {
        newData.price_cash = '0 ₸';
        newData.price_bank = '0 ₸';
      } else if (newPaymentType === 'bank' && prev.paymentType === 'cash' && prev.price_cash !== '0 ₸') {
        newData.price_bank = prev.price_cash;
        newData.price_cash = '0 ₸';
      } else if (newPaymentType === 'cash' && prev.paymentType === 'bank' && prev.price_bank !== '0 ₸') {
        newData.price_cash = prev.price_bank;
        newData.price_bank = '0 ₸';
      }
      
      return newData;
    });
  };

  const parseMoneyValue = (value: string): number => {
    if (!value) return 0;
    const cleaned = value.replace(/[^\d]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplier) {
      toast({
        title: 'Ошибка',
        description: 'Выберите поставщика',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        price_cash: (parseMoneyValue(formData.price_cash)).toString(),
        price_bank: (parseMoneyValue(formData.price_bank)).toString(),
        invoice_html: formData.invoice_html,
      };
      
      await onSubmit(submitData);
      
      toast({
        title: supply ? 'Поставка обновлена' : 'Поставка добавлена',
        variant: 'default',
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить поставку',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-[95vw] md:max-w-2xl max-h-[90vh] p-0 gap-0">
          <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b">
            <DialogTitle className="text-lg md:text-xl font-semibold flex items-center gap-2 md:gap-3">
              <Package className="w-5 h-5 md:w-6 md:h-6" />
              {supply ? 'Редактирование поставки' : 'Новая поставка'}
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Дата поставки от завтрашнего дня. Документы и подтверждение - при приёмке поставки.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col h-[calc(90vh-120px)] md:h-[calc(90vh-140px)]">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {/* Поставщик */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Поставщик *
                </Label>
                <SupplierSearchCombobox 
                  value={formData.supplier} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, supplier: value }))} 
                  placeholder="Выберите или создайте поставщика..." 
                  autoFocus={open && !supply}
                  autoOpen={open && !supply}
                />
              </div>

              {/* Дата поставки */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Дата поставки *
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant={formData.delivery_date === tomorrow ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDateSelect(tomorrow)}
                    className="h-10"
                  >
                    Завтра
                  </Button>
                  <Button
                    type="button"
                    variant={formData.delivery_date === dayAfterTomorrow ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDateSelect(dayAfterTomorrow)}
                    className="h-10"
                  >
                    Послезавтра
                  </Button>
                  <div className="relative">
                    <Input 
                      type="date" 
                      min={tomorrow}
                      value={formData.delivery_date} 
                      onChange={(e) => handleDateSelect(e.target.value)} 
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Финансы */}
              <div className="space-y-6">
                <Label className="text-sm font-medium">Финансы</Label>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Тип оплаты</Label>
                    <Select 
                      value={formData.paymentType} 
                      onValueChange={handlePaymentTypeChange}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            Наличные
                          </div>
                        </SelectItem>
                        <SelectItem value="bank">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Банк
                          </div>
                        </SelectItem>
                        <SelectItem value="mixed">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Wallet className="w-3 h-3" />
                              <span className="mx-1">+</span>
                              <CreditCard className="w-3 h-3" />
                            </div>
                            Смешанная
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Сумма</Label>
                    {formData.paymentType === 'cash' && (
                      <MoneyInput 
                        placeholder="0 ₸"
                        value={formData.price_cash}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, price_cash: value }))}
                      />
                    )}
                    {formData.paymentType === 'bank' && (
                      <MoneyInput 
                        placeholder="0 ₸"
                        value={formData.price_bank}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, price_bank: value }))}
                      />
                    )}
                    {formData.paymentType === 'mixed' && (
                      <div className="grid grid-cols-2 gap-2">
                        <MoneyInput 
                          placeholder="Нал."
                          value={formData.price_cash}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, price_cash: value }))}
                        />
                        <MoneyInput 
                          placeholder="Банк"
                          value={formData.price_bank}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, price_bank: value }))}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Бонус (шт.)</Label>
                    <Input 
                      type="number" 
                      min="0"
                      value={formData.bonus || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        bonus: e.target.value ? Number(e.target.value) : 0 
                      }))}
                      className="h-9"
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Обмен (шт.)</Label>
                    <Input 
                      type="number" 
                      min="0"
                      value={formData.exchange || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        exchange: e.target.value ? Number(e.target.value) : 0 
                      }))}
                      className="h-9"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Комментарий */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Комментарий
                </Label>
                <Textarea 
                  value={formData.comment} 
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))} 
                  rows={5} 
                  placeholder="Введите комментарий..."
                  className="resize-none min-h-[120px]"
                />
              </div>
            </div>

            {/* Футер с кнопками */}
            <div className="px-4 md:px-6 py-3 md:py-4 border-t bg-white flex-shrink-0">
              <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-3 md:gap-0">
                <div className="w-full md:w-auto">
                  {supply && (
                    <Button 
                      type="button" 
                      variant="destructive" 
                      onClick={() => handleDeleteSupply(supply.id)} 
                      disabled={isLoading}
                      className="gap-2 w-full md:w-auto"
                      size="sm"
                    >
                      <Trash className="w-4 h-4" />
                      Удалить поставку
                    </Button>
                  )}
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    disabled={isLoading}
                    className="flex-1 md:flex-none"
                    size="sm"
                  >
                    Отмена
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !formData.supplier}
                    className="flex-1 md:flex-none gap-2 bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        {supply ? 'Обновить' : 'Добавить'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};