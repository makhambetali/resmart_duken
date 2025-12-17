import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  operationToEdit?: CashFlowOperation | null;
  // 🔧 ИСПРАВЛЕНО: Добавлен пропс для блокировки редактирования прошлых дат
  isReadOnly?: boolean;
}

export const CashFlowModal: React.FC<CashFlowModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  operationToEdit,
  isReadOnly = false,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [formData, setFormData] = useState({ amount: '', description: '' });
  
  const isEditMode = !!operationToEdit;

  // 🔧 ИСПРАВЛЕНО: Более надежная инициализация формы
  useEffect(() => {
    if (open) {
      if (isEditMode && operationToEdit) {
        setTransactionType(operationToEdit.amount >= 0 ? 'income' : 'expense');
        setFormData({
          amount: formatPrice(String(Math.abs(operationToEdit.amount))),
          description: operationToEdit.description || '',
        });
      } else {
        setTransactionType('income');
        setFormData({ amount: '', description: '' });
      }
    }
  }, [open, operationToEdit, isEditMode]);

  // 🔧 ИСПРАВЛЕНО: Мутация для сохранения операции
  const { mutate: saveOperation, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const numericAmount = Number(getNumericValue(formData.amount));
      
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Введите корректную сумму');
      }
      
      const finalAmount = transactionType === 'expense' ? -numericAmount : numericAmount;
      const payload = { 
        amount: finalAmount, 
        description: formData.description.trim() || 'Без описания' 
      };

      if (isEditMode && operationToEdit) {
        await cashFlowApi.updateOperation(operationToEdit.id, payload);
      } else {
        await cashFlowApi.createOperation({ 
          ...payload, 
          type: 'cash' 
        });
      }
    },
    onSuccess: () => {
      toast({
        title: isEditMode ? 'Операция обновлена' : 'Операция добавлена',
        className: 'bg-green-500 text-white',
      });
      
      // 🔧 ИСПРАВЛЕНО: Инвалидируем только нужные запросы
      queryClient.invalidateQueries({ queryKey: ['cashFlows'] });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось сохранить операцию',
        variant: 'destructive',
      });
    },
  });

  // 🔧 ИСПРАВЛЕНО: Мутация для удаления операции
  const { mutate: deleteOperation, isPending: isDeleting } = useMutation({
    mutationFn: () => {
      if (!operationToEdit) {
        throw new Error('Операция для удаления не найдена');
      }
      return cashFlowApi.deleteOperation(operationToEdit.id);
    },
    onSuccess: () => {
      toast({ 
        title: 'Операция удалена',
        className: 'bg-green-500 text-white',
      });
      
      queryClient.invalidateQueries({ queryKey: ['cashFlows'] });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка удаления',
        description: error.message || 'Не удалось удалить операцию',
        variant: 'destructive',
      });
    },
  });

  const isLoading = isSaving || isDeleting;

  const handlePriceChange = (value: string) => {
    let numericValue = value.replace(/\D/g, '');
    
    if (numericValue.length > 6) {
      numericValue = numericValue.slice(0, 6);
    }

    setFormData(prev => ({ ...prev, amount: formatPrice(numericValue) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || Number(getNumericValue(formData.amount)) <= 0) {
      toast({
        title: 'Ошибка',
        description: 'Введите корректную сумму',
        variant: 'destructive',
      });
      return;
    }
    
    saveOperation();
  };
  
  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
      deleteOperation();
    }
  };

  // 🔧 ИСПРАВЛЕНО: Проверяем, можно ли редактировать операцию
  const canEdit = !isReadOnly || isEditMode;
  const isDisabled = isLoading || !canEdit;

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!isLoading) {
        onOpenChange(open);
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isReadOnly && !isEditMode ? 'Просмотр операции' : 
             isEditMode ? 'Редактировать операцию' : 'Новая операция'}
          </DialogTitle>
        </DialogHeader>
        
        {isReadOnly && !isEditMode && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-sm text-yellow-700">
              Редактирование операций прошлых дат недоступно. Вы можете только просматривать.
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма</Label>
            <div className="flex items-center">
              <Select
                value={transactionType}
                onValueChange={(value: 'income' | 'expense') => { 
                  if (value && !isDisabled) setTransactionType(value); 
                }}
                disabled={isDisabled || isReadOnly}
              >
                <SelectTrigger
                  className={`w-auto rounded-r-none border-r-0 focus:ring-1 focus:ring-offset-0 text-lg font-bold ${
                    transactionType === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                id="amount" 
                type="text" 
                inputMode="decimal" 
                value={formData.amount}
                onChange={(e) => !isDisabled && handlePriceChange(e.target.value)}
                placeholder="Например: 50 000" 
                required 
                disabled={isDisabled || isReadOnly}
                className="rounded-l-none focus-visible:ring-offset-0 focus-visible:ring-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description" 
              value={formData.description}
              onChange={(e) => !isDisabled && setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Описание операции (например, 'Закупка материалов')"
              rows={3} 
              disabled={isDisabled || isReadOnly}
            />
          </div>
          
          <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:space-x-2 pt-4">
            {isEditMode && canEdit ? (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={isLoading || isReadOnly}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить
              </Button>
            ) : <div />}
            
            <div className="flex justify-end space-x-2">
             
              
              {!isReadOnly && (
                <Button 
                  type="submit" 
                  disabled={isDisabled || !formData.amount}
                >
                  {isLoading ? 'Сохранение...' : isEditMode ? 'Сохранить изменения' : 'Добавить'}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};