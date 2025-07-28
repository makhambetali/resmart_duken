import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatPrice, getNumericValue } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cashFlowApi } from '@/lib/api';
import { CashFlowOperation } from '@/types/supply';
import { Trash2 } from 'lucide-react';

interface CashFlowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  // ++ ДОБАВЛЕНО: Пропс для передачи операции ++
  operationToEdit?: CashFlowOperation | null;
}

export const CashFlowModal: React.FC<CashFlowModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  operationToEdit,
}) => {
  const { toast } = useToast();
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [formData, setFormData] = useState({ amount: '', description: '' });
  
  // ++ ДОБАВЛЕНО: Определяем, находится ли модальное окно в режиме редактирования ++
  const isEditMode = !!operationToEdit;

  // ++ ИЗМЕНЕНО: useEffect для установки данных формы при открытии модального окна ++
  useEffect(() => {
    if (open) {
      if (isEditMode) {
        // Режим редактирования: заполняем форму данными операции
        setTransactionType(operationToEdit.amount >= 0 ? 'income' : 'expense');
        setFormData({
          amount: formatPrice(String(Math.abs(operationToEdit.amount))),
          description: operationToEdit.description || '',
        });
      } else {
        // Режим создания: сбрасываем форму
        setTransactionType('income');
        setFormData({ amount: '', description: '' });
      }
    }
  }, [open, operationToEdit, isEditMode]);
  
  // ++ ДОБАВЛЕНО: Мутация для создания, обновления и удаления с помощью React Query ++
  const { mutate: saveOperation, isLoading: isSaving } = useMutation({
    mutationFn: async () => {
      const numericAmount = Number(getNumericValue(formData.amount));
      const finalAmount = transactionType === 'expense' ? -numericAmount : numericAmount;
      const payload = { amount: finalAmount, description: formData.description };

      if (isEditMode) {
        await cashFlowApi.updateOperation(operationToEdit.id, payload);
      } else {
        await cashFlowApi.createOperation({ ...payload, type: 'cash' });
      }
    },
    onSuccess: () => {
      toast({
        title: isEditMode ? 'Операция обновлена' : 'Операция добавлена',
        className: 'bg-green-500 text-white',
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка',
        description: `Не удалось сохранить операцию: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const { mutate: deleteOperation, isLoading: isDeleting } = useMutation({
    mutationFn: () => cashFlowApi.deleteOperation(operationToEdit!.id),
    onSuccess: () => {
      toast({ title: 'Операция удалена' });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка удаления',
        description: `Не удалось удалить операцию: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const isLoading = isSaving || isDeleting;

 const handlePriceChange = (value: string) => {
  let numericValue = value.replace(/\D/g, ''); // Удаляем всё, кроме цифр

  // ++ ПРОВЕРЯЕМ ДЛИНУ И ОБРЕЗАЕМ ДО 6 СИМВОЛОВ ++
  if (numericValue.length > 6) {
    numericValue = numericValue.slice(0, 6);
  }

  setFormData(prev => ({ ...prev, amount: formatPrice(numericValue) }));
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveOperation();
  };
  
  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
      deleteOperation();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          {/* ++ ИЗМЕНЕНО: Динамический заголовок ++ */}
          <DialogTitle>{isEditMode ? 'Редактировать операцию' : 'Новая операция'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма</Label>
            <div className="flex items-center">
              <Select
                value={transactionType}
                onValueChange={(value: 'income' | 'expense') => { if (value) setTransactionType(value); }}
                disabled={isLoading}
              >
                <SelectTrigger
                  className={`w-auto rounded-r-none border-r-0 focus:ring-1 focus:ring-offset-0 text-lg font-bold ${
                    transactionType === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                  aria-label="Тип транзакции"
                >
                  <SelectValue placeholder={transactionType === 'income' ? '+' : '-'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">+</SelectItem>
                  <SelectItem value="expense">-</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="amount" type="text" inputMode="decimal" value={formData.amount}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="0" required disabled={isLoading}
                className="rounded-l-none focus-visible:ring-offset-0 focus-visible:ring-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description" value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Описание операции (например, 'Закупка материалов')"
              rows={3} disabled={isLoading}
            />
          </div>
          {/* ++ ИЗМЕНЕНО: Динамические кнопки для создания/редактирования/удаления ++ */}
          <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:space-x-2 pt-4">
            {isEditMode ? (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить
              </Button>
            ) : <div />} {/* Пустой div для сохранения выравнивания */}
            <div className="flex justify-end space-x-2">
             
              <Button type="submit" disabled={isLoading || !formData.amount}>
                {isLoading ? 'Сохранение...' : isEditMode ? 'Сохранить изменения' : 'Добавить'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};