// @/components/supply/SupplyDatePicker.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from "lucide-react";

interface SupplyDatePickerProps {
  delivery_date: string;
  isToday: boolean;
  isEditing: boolean;
  tomorrow: string;
  dayAfterTomorrow: string;
  onDateSelect: (date: string) => void;
}

export const SupplyDatePicker: React.FC<SupplyDatePickerProps> = ({
  delivery_date,
  isToday,
  isEditing,
  tomorrow,
  dayAfterTomorrow,
  onDateSelect,
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Дата поставки *
      </Label>
      
      {isEditing ? (
        // При редактировании
        <div>
          {isToday ? (
            // Сегодняшняя поставка
            <div className="text-sm text-gray-700">
              Сегодня ({delivery_date})
            </div>
          ) : (
            // Не сегодняшняя поставка
            <div>
              <div className="mb-3">
                <p className="text-sm font-medium mb-2">Выбрать дату:</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <Button
                    type="button"
                    variant={delivery_date === tomorrow ? "default" : "outline"}
                    size="sm"
                    onClick={() => onDateSelect(tomorrow)}
                    className="h-9"
                  >
                    Завтра
                  </Button>
                  <Button
                    type="button"
                    variant={delivery_date === dayAfterTomorrow ? "default" : "outline"}
                    size="sm"
                    onClick={() => onDateSelect(dayAfterTomorrow)}
                    className="h-9"
                  >
                    Послезавтра
                  </Button>
                  <div className="relative">
                    <Input 
                      type="date" 
                      min={tomorrow}
                      value={delivery_date} 
                      onChange={(e) => onDateSelect(e.target.value)} 
                      className="h-9 text-sm"
                      placeholder="Другая дата"
                    />
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Текущая дата: {delivery_date}
              </div>
            </div>
          )}
        </div>
      ) : (
        // При создании новой поставки - только даты от завтра
        <div>
          <div className="mb-3">
            <p className="text-sm font-medium mb-2">Выбрать дату:</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <Button
                type="button"
                variant={delivery_date === tomorrow ? "default" : "outline"}
                size="sm"
                onClick={() => onDateSelect(tomorrow)}
                className="h-9"
              >
                Завтра
              </Button>
              <Button
                type="button"
                variant={delivery_date === dayAfterTomorrow ? "default" : "outline"}
                size="sm"
                onClick={() => onDateSelect(dayAfterTomorrow)}
                className="h-9"
              >
                Послезавтра
              </Button>
              <div className="relative">
                <Input 
                  type="date" 
                  min={tomorrow}
                  value={delivery_date} 
                  onChange={(e) => onDateSelect(e.target.value)} 
                  className="h-9 text-sm"
                  placeholder="Другая дата"
                />
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Выбрано: {delivery_date}
          </div>
        </div>
      )}
    </div>
  );
};