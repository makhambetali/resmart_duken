import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatPrice, getNumericValue } from '@/lib/utils';
import { cashFlowApi } from '@/lib/api';
import { CashFlowOperation } from '@/types/supply';
import { Trash2, Plus, Minus, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CashFlowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  operationToEdit?: CashFlowOperation | null;
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
  const [formData, setFormData] = useState({ 
    amount: '', 
    description: '' 
  });
  
  const isEditMode = !!operationToEdit;

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

  const { mutate: saveOperation, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const numericAmount = Number(getNumericValue(formData.amount));
      
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Введите корректную сумму');
      }
      
      if (formData.description.length > 500) {
        throw new Error('Описание не должно превышать 500 символов');
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
      
      queryClient.invalidateQueries({ queryKey: ['cashFlows'] });
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (!isEditMode) {
        setFormData({ amount: '', description: '' });
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

  const handleAmountChange = (value: string) => {
    let numericValue = value.replace(/\D/g, '');
    
    // Ограничение на максимальную сумму (999,999,999)
    if (numericValue.length > 9) {
      numericValue = numericValue.slice(0, 9);
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
    
    if (formData.description.length > 500) {
      toast({
        title: 'Ошибка',
        description: 'Описание не должно превышать 500 символов',
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

  const canEdit = !isReadOnly || isEditMode;
  const isDisabled = isLoading || !canEdit;

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-border/50 shadow-2xl">
        <div className="p-6 space-y-6">
          <DialogHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                {isReadOnly && !isEditMode ? 'Просмотр операции' : 
                 isEditMode ? 'Редактировать операцию' : 'Новая операция'}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 -mr-2"
              >

              </Button>
            </div>
            
            {isReadOnly && !isEditMode && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                <p className="text-sm text-yellow-800">
                  Редактирование операций прошлых дат недоступно.
                </p>
              </div>
            )}
          </DialogHeader>

          {/* Type Toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-xl">
            <button
              type="button"
              onClick={() => !isDisabled && setTransactionType('income')}
              disabled={isDisabled}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                transactionType === 'income'
                  ? "bg-green-500 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <ArrowDownLeft className="w-4 h-4" />
              Доход
            </button>
            <button
              type="button"
              onClick={() => !isDisabled && setTransactionType('expense')}
              disabled={isDisabled}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                transactionType === 'expense'
                  ? "bg-red-500 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <ArrowUpRight className="w-4 h-4" />
              Расход
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-medium">Сумма</Label>
            <div className="relative">
              <div className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200",
                transactionType === 'income' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              )}>
                {transactionType === 'income' ? 
                  <Plus className="w-4 h-4" /> : 
                  <Minus className="w-4 h-4" />
                }
              </div>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={formData.amount}
                onChange={(e) => !isDisabled && handleAmountChange(e.target.value)}
                disabled={isDisabled}
                className={cn(
                  "h-14 pl-14 pr-16 text-xl font-semibold bg-muted/50 border-transparent focus:border-primary transition-all duration-200",
                  "placeholder:text-muted-foreground/50",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                ₸
              </span>
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="description" className="text-sm font-medium">Описание</Label>
              <span className={cn(
                "text-xs",
                formData.description.length > 450 ? "text-red-500" : "text-muted-foreground"
              )}>
                {formData.description.length}/500
              </span>
            </div>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => !isDisabled && setFormData(prev => ({ 
                ...prev, 
                description: e.target.value.slice(0, 500) 
              }))}
              placeholder="Введите описание операции..."
              rows={3}
              disabled={isDisabled}
              className={cn(
                "resize-none bg-muted/50 border-transparent focus:border-primary transition-all duration-200",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isReadOnly && (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !formData.amount || Number(getNumericValue(formData.amount)) <= 0}
                className={cn(
                  "w-full h-12 text-base font-medium transition-all duration-200",
                  transactionType === 'income' 
                    ? "bg-green-500 hover:bg-green-600 text-white" 
                    : "bg-red-500 hover:bg-red-600 text-white"
                )}
              >
                {isLoading ? 'Сохранение...' : 
                 isEditMode ? 'Сохранить изменения' : 
                 transactionType === 'income' ? 'Добавить доход' : 'Добавить расход'}
                {formData.amount && Number(getNumericValue(formData.amount)) > 0 && (
                  <span className="ml-1 font-semibold">
                    {formatPrice(getNumericValue(formData.amount))} ₸
                  </span>
                )}
              </Button>
            )}

            {isEditMode && canEdit && !isReadOnly && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={isLoading}
                className="w-full h-10 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить операцию
              </Button>
            )}
          </div>

          {/* Read-only message */}
          {isReadOnly && !isEditMode && (
            <div className="text-center text-sm text-muted-foreground pt-2">
              Операция доступна только для просмотра
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};