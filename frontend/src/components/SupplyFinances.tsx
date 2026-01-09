// @/components/supply/SupplyFinances.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoneyInput } from '@/components/MoneyInput';
import { CreditCard, Wallet } from "lucide-react";

interface SupplyFinancesProps {
  paymentType: 'cash' | 'bank' | 'mixed';
  price_cash: string;
  price_bank: string;
  bonus: number;
  exchange: number;
  onPaymentTypeChange: (value: 'cash' | 'bank' | 'mixed') => void;
  onPriceCashChange: (value: string) => void;
  onPriceBankChange: (value: string) => void;
  onBonusChange: (value: number) => void;
  onExchangeChange: (value: number) => void;
}

export const SupplyFinances: React.FC<SupplyFinancesProps> = ({
  paymentType,
  price_cash,
  price_bank,
  bonus,
  exchange,
  onPaymentTypeChange,
  onPriceCashChange,
  onPriceBankChange,
  onBonusChange,
  onExchangeChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Тип оплаты</Label>
          <Select 
            value={paymentType} 
            onValueChange={onPaymentTypeChange}
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
          {paymentType === 'cash' && (
            <MoneyInput 
              placeholder="0 ₸"
              value={price_cash}
              onValueChange={onPriceCashChange}
            />
          )}
          {paymentType === 'bank' && (
            <MoneyInput 
              placeholder="0 ₸"
              value={price_bank}
              onValueChange={onPriceBankChange}
            />
          )}
          {paymentType === 'mixed' && (
            <div className="grid grid-cols-2 gap-2">
              <MoneyInput 
                placeholder="Нал."
                value={price_cash}
                onValueChange={onPriceCashChange}
              />
              <MoneyInput 
                placeholder="Банк"
                value={price_bank}
                onValueChange={onPriceBankChange}
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
            value={bonus || ''}
            onChange={(e) => onBonusChange(e.target.value ? Number(e.target.value) : 0)}
            className="h-9"
            placeholder="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Обмен (шт.)</Label>
          <Input 
            type="number" 
            min="0"
            value={exchange || ''}
            onChange={(e) => onExchangeChange(e.target.value ? Number(e.target.value) : 0)}
            className="h-9"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
};