// @/components/supply/SupplyStatus.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Clock,
  AlertCircle,
  CheckCircle,
  Clock as ClockIcon,
  ChevronDown
} from "lucide-react";
import { formatDateTime } from '@/lib/utils';

interface SupplyStatusProps {
  status: string;
  arrival_date?: string | null;
  availableStatuses: Array<{ value: string; label: string }>;
  showStatusChange: boolean;
  onToggleStatusChange: () => void;
  onChangeStatus: (status: string) => void;
}

// Функция для получения текста статуса
export const getStatusText = (status: string): string => {
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
export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
    case 'confirmed':
      return <ClockIcon className="w-4 h-4 text-amber-500" />;
    case 'delivered':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

export const SupplyStatus: React.FC<SupplyStatusProps> = ({
  status,
  arrival_date,
  availableStatuses,
  showStatusChange,
  onToggleStatusChange,
  onChangeStatus,
}) => {
  const getTimeString = (dateTimeString?: string | null) => {
    if (!dateTimeString) return 'Не указано';
    return formatDateTime(dateTimeString);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Статус поставки
      </Label>
      <div className="p-3 border rounded-md bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            <span className="font-medium">{getStatusText(status)}</span>
          </div>
          <span className="text-sm text-gray-500">
            {status === 'pending' && 'Ожидает подтверждения'}
            {status === 'confirmed' && 'Ожидает оплаты'}
            {status === 'delivered' && 'Доставлено'}
          </span>
        </div>
        {arrival_date && (
          <div className="mt-2 text-sm text-gray-600">
            Дата изменения статуса: {getTimeString(arrival_date)}
          </div>
        )}
        
        {/* Кнопка изменения статуса */}
        {availableStatuses.length > 0 && (
          <>
            <div className="relative mt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onToggleStatusChange}
                className="gap-2 w-full"
              >
                <Clock className="w-4 h-4" />
                Изменить статус
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {showStatusChange && (
                <div className="absolute left-0 right-0 top-full mt-1 z-10 bg-white border rounded-md shadow-lg">
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                      Выберите новый статус:
                    </div>
                    {availableStatuses.map((statusOption) => (
                      <Button
                        key={statusOption.value}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 mb-1"
                        onClick={() => onChangeStatus(statusOption.value)}
                      >
                        {getStatusIcon(statusOption.value)}
                        {statusOption.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};