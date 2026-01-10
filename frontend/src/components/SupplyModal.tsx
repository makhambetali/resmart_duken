// @/components/SupplyModal.tsx
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
  Plus,
  FileImage,
  Eye,
  Clock,
  X,
  CheckCircle,
  Clock as ClockIcon,
  AlertCircle,
  ChevronDown
} from "lucide-react";
import { formatPrice, formatDateTime } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ImageUpload';

interface SupplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleDeleteSupply: (id: string) => void;
  supply?: Supply | null;
  onSubmit: (data: Omit<AddSupplyForm, 'images'> & { images?: File[] }) => Promise<void>;
  suppliers: Array<{ id: string; name: string }>;
  initialSupplier?: string;
}

interface SupplyImage {
  id: number;
  image: string;
  file?: File;
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

const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
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

// Компонент: Десктопная левая колонка - улучшенная
const DesktopLeftColumn: React.FC<{
  formData: any;
  setFormData: any;
  supply?: Supply | null;
  tomorrow: string;
  dayAfterTomorrow: string;
  today: string;
  isToday: boolean;
  handleDateSelect: (date: string) => void;
  handlePaymentTypeChange: (type: 'cash' | 'bank' | 'mixed') => void;
  showStatusChange: boolean;
  setShowStatusChange: (show: boolean) => void;
  handleStatusChange: (status: string) => void;
  showRightColumn: boolean;
}> = ({ 
  formData, 
  setFormData, 
  supply, 
  tomorrow, 
  dayAfterTomorrow, 
  today, 
  isToday, 
  handleDateSelect, 
  handlePaymentTypeChange,
  showStatusChange,
  setShowStatusChange,
  handleStatusChange,
  showRightColumn
}) => {
  const getStatusIcon = (status: string) => {
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

  const getAvailableStatuses = () => {
    const statuses = [
      { value: 'pending', label: 'Ожидает подтверждения' },
      { value: 'confirmed', label: 'Ожидает оплаты' },
      { value: 'delivered', label: 'Подтверждена' },
    ];
    
    return statuses.filter(status => status.value !== formData.status);
  };

  const availableStatuses = getAvailableStatuses();

  return (
    <div className={`p-4 md:p-6 space-y-6 md:space-y-8 overflow-y-auto ${showRightColumn ? 'border-r md:w-1/2' : 'md:w-full'}`}>
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
        />
      </div>

      {/* Дата поставки */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Дата поставки *
        </Label>
        
        {supply ? (
          isToday ? (
            <div className="text-sm text-gray-700">
              Сегодня ({formData.delivery_date})
            </div>
          ) : (
            <div>
              <div className="mb-3">
                <p className="text-sm font-medium mb-2">Выбрать дату:</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <Button
                    type="button"
                    variant={formData.delivery_date === tomorrow ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDateSelect(tomorrow)}
                    className="h-9"
                  >
                    Завтра
                  </Button>
                  <Button
                    type="button"
                    variant={formData.delivery_date === dayAfterTomorrow ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDateSelect(dayAfterTomorrow)}
                    className="h-9"
                  >
                    Послезавтра
                  </Button>
                  <div className="relative">
                    <Input 
                      type="date" 
                      min={tomorrow}
                      value={formData.delivery_date} 
                      onChange={(e) => handleDateSelect(e.target.value)} 
                      className="h-9 text-sm"
                      placeholder="Другая дата"
                    />
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Текущая дата: {formData.delivery_date}
              </div>
            </div>
          )
        ) : (
          <div>
            <div className="mb-3">
              <p className="text-sm font-medium mb-2">Выбрать дату:</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <Button
                  type="button"
                  variant={formData.delivery_date === tomorrow ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDateSelect(tomorrow)}
                  className="h-9"
                >
                  Завтра
                </Button>
                <Button
                  type="button"
                  variant={formData.delivery_date === dayAfterTomorrow ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDateSelect(dayAfterTomorrow)}
                  className="h-9"
                >
                  Послезавтра
                </Button>
                <div className="relative">
                  <Input 
                    type="date" 
                    min={tomorrow}
                    value={formData.delivery_date} 
                    onChange={(e) => handleDateSelect(e.target.value)} 
                    className="h-9 text-sm"
                    placeholder="Другая дата"
                  />
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Выбрано: {formData.delivery_date}
            </div>
          </div>
        )}
      </div>

      {/* Финансы */}
      <div className="space-y-6">
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

      {/* Статус поставки - только если есть поставка и не показываем правую колонку */}
      {supply && !showRightColumn && (
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Статус поставки
          </Label>
          <div className="p-3 border rounded-md bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(formData.status)}
                <span className="font-medium">{getStatusText(formData.status)}</span>
              </div>
              <span className="text-sm text-gray-500">
                {formData.status === 'pending' && 'Ожидает подтверждения'}
                {formData.status === 'confirmed' && 'Ожидает оплаты'}
                {formData.status === 'delivered' && 'Доставлено'}
              </span>
            </div>
            
            {/* Кнопка изменения статуса */}
            {availableStatuses.length > 0 && (
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStatusChange(!showStatusChange)}
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
                      {availableStatuses.map((status) => (
                        <Button
                          key={status.value}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2 mb-1"
                          onClick={() => handleStatusChange(status.value)}
                        >
                          {getStatusIcon(status.value)}
                          {status.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Документы - только если не показываем правую колонку и это сегодняшняя поставка */}
      {!showRightColumn && isToday && (
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <FileImage className="w-4 h-4" />
            Документы и изображения
          </Label>
          <ImageUpload
            selectedFiles={formData.selectedImages || []}
            onFilesChange={(files) => setFormData(prev => ({ ...prev, selectedImages: files }))}
            disabled={false}
            isToday={isToday}
            maxFiles={10}
            maxSizeMB={5}
          />
        </div>
      )}
    </div>
  );
};

// Компонент: Десктопная правая колонка (только для сегодняшних поставок)
const DesktopRightColumn: React.FC<{
  formData: any;
  supply?: Supply | null;
  showStatusChange: boolean;
  setShowStatusChange: (show: boolean) => void;
  handleStatusChange: (status: string) => void;
  existingImages: SupplyImage[];
  setSelectedImages: (images: File[]) => void;
  selectedImages: File[];
  setExistingImages: (images: SupplyImage[]) => void;
}> = ({ 
  formData, 
  supply, 
  showStatusChange, 
  setShowStatusChange, 
  handleStatusChange,
  existingImages,
  setSelectedImages,
  selectedImages,
  setExistingImages
}) => {
  const getStatusIcon = (status: string) => {
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

  const getAvailableStatuses = () => {
    const statuses = [
      { value: 'pending', label: 'Ожидает подтверждения' },
      { value: 'confirmed', label: 'Ожидает оплаты' },
      { value: 'delivered', label: 'Подтверждена' },
    ];
    
    return statuses.filter(status => status.value !== formData.status);
  };

  const availableStatuses = getAvailableStatuses();

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto md:w-1/2">
      {/* Кнопка смены статуса и заголовок */}
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <FileImage className="w-4 h-4" />
          Документы и изображения
        </Label>
        
        {/* Кнопка для смены статуса поставки */}
        {supply && availableStatuses.length > 0 && (
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowStatusChange(!showStatusChange)}
              className="gap-2"
            >
              <Clock className="w-4 h-4" />
              Изменить статус
              <ChevronDown className="w-4 h-4" />
            </Button>
            
            {showStatusChange && (
              <div className="absolute right-0 top-full mt-1 z-10 bg-white border rounded-md shadow-lg min-w-[200px]">
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                    Выберите новый статус:
                  </div>
                  {availableStatuses.map((status) => (
                    <Button
                      key={status.value}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 mb-1"
                      onClick={() => handleStatusChange(status.value)}
                    >
                      {getStatusIcon(status.value)}
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Используем ваш ImageUpload компонент */}
      <ImageUpload
        selectedFiles={selectedImages}
        onFilesChange={setSelectedImages}
        disabled={false}
        isToday={true}
        maxFiles={10}
        maxSizeMB={5}
      />

      {/* Существующие изображения */}
      {existingImages.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm text-gray-700">
            Существующие изображения ({existingImages.length})
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {existingImages.map((image) => (
              <div key={image.id} className="relative group">
                <div 
                  className="aspect-square bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => window.open(image.image, '_blank')}
                >
                  <img
                    src={image.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setExistingImages(prev => prev.filter(img => img.id !== image.id))}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="flex items-center justify-center mt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => window.open(image.image, '_blank')}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Просмотр
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент: Мобильные вкладки - Основное
const MobileBasicTab: React.FC<{
  formData: any;
  setFormData: any;
  supply?: Supply | null;
  showStatusChange: boolean;
  setShowStatusChange: (show: boolean) => void;
  handleStatusChange: (status: string) => void;
  handleDateSelect: (date: string) => void;
  tomorrow: string;
  dayAfterTomorrow: string;
  isToday: boolean;
}> = ({ 
  formData, 
  setFormData, 
  supply, 
  showStatusChange, 
  setShowStatusChange, 
  handleStatusChange,
  handleDateSelect,
  tomorrow,
  dayAfterTomorrow,
  isToday
}) => {
  const getStatusIcon = (status: string) => {
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

  const getAvailableStatuses = () => {
    const statuses = [
      { value: 'pending', label: 'Ожидает подтверждения' },
      { value: 'confirmed', label: 'Ожидает оплаты' },
      { value: 'delivered', label: 'Подтверждена' },
    ];
    
    return statuses.filter(status => status.value !== formData.status);
  };

  const availableStatuses = getAvailableStatuses();

  return (
    <div className="space-y-4">
      {/* Поставщик */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Building className="w-4 h-4" />
          Поставщик *
        </Label>
        <SupplierSearchCombobox 
          value={formData.supplier} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, supplier: value }))} 
          placeholder="Выберите поставщика..." 
        />
      </div>

      {/* Дата поставки */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Дата поставки
        </Label>
        {supply ? (
          isToday ? (
            <div className="text-sm text-gray-700">
              Сегодня ({formData.delivery_date})
            </div>
          ) : (
            <div className="space-y-2">
              <Input 
                type="date" 
                min={tomorrow}
                value={formData.delivery_date} 
                onChange={(e) => handleDateSelect(e.target.value)} 
                className="h-10"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.delivery_date === tomorrow ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDateSelect(tomorrow)}
                  className="flex-1 text-xs"
                >
                  Завтра
                </Button>
                <Button
                  type="button"
                  variant={formData.delivery_date === dayAfterTomorrow ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDateSelect(dayAfterTomorrow)}
                  className="flex-1 text-xs"
                >
                  Послезавтра
                </Button>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-2">
            <Input 
              type="date" 
              min={tomorrow}
              value={formData.delivery_date} 
              onChange={(e) => handleDateSelect(e.target.value)} 
              className="h-10"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.delivery_date === tomorrow ? "default" : "outline"}
                size="sm"
                onClick={() => handleDateSelect(tomorrow)}
                className="flex-1 text-xs"
              >
                Завтра
              </Button>
              <Button
                type="button"
                variant={formData.delivery_date === dayAfterTomorrow ? "default" : "outline"}
                size="sm"
                onClick={() => handleDateSelect(dayAfterTomorrow)}
                className="flex-1 text-xs"
              >
                Послезавтра
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Бонус и обмен */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Бонус (шт.)</Label>
          <Input 
            type="number" 
            min="0"
            value={formData.bonus || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              bonus: e.target.value ? Number(e.target.value) : 0 
            }))}
            className="h-10"
            placeholder="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Обмен (шт.)</Label>
          <Input 
            type="number" 
            min="0"
            value={formData.exchange || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              exchange: e.target.value ? Number(e.target.value) : 0 
            }))}
            className="h-10"
            placeholder="0"
          />
        </div>
      </div>

      {/* Комментарий */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Комментарий
        </Label>
        <Textarea 
          value={formData.comment} 
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))} 
          rows={3} 
          placeholder="Введите комментарий..."
          className="resize-none"
        />
      </div>

      {/* Статус поставки и кнопка изменения */}
      {supply && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Статус поставки
            </Label>
            
            {/* Кнопка смены статуса для мобильной версии */}
            {availableStatuses.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowStatusChange(!showStatusChange)}
                className="gap-2 text-xs"
              >
                <Clock className="w-4 h-4" />
                Изменить
              </Button>
            )}
          </div>
          
          <div className="p-3 border rounded-md bg-gray-50">
            <div className="flex items-center gap-2 mb-1">
              {getStatusIcon(formData.status)}
              <span className="font-medium text-sm">{getStatusText(formData.status)}</span>
            </div>
            <span className="text-xs text-gray-500 block mb-2">
              {formData.status === 'pending' && 'Ожидает подтверждения'}
              {formData.status === 'confirmed' && 'Ожидает оплаты'}
              {formData.status === 'delivered' && 'Доставлено'}
            </span>
            
            {showStatusChange && (
              <div className="mt-3 pt-3 border-t space-y-1">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  Выберите новый статус:
                </div>
                {availableStatuses.map((status) => (
                  <Button
                    key={status.value}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 mb-1 text-xs"
                    onClick={() => handleStatusChange(status.value)}
                  >
                    {getStatusIcon(status.value)}
                    {status.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент: Мобильные вкладки - Оплата
const MobileMoneyTab: React.FC<{
  formData: any;
  setFormData: any;
  handlePaymentTypeChange: (type: 'cash' | 'bank' | 'mixed') => void;
}> = ({ formData, setFormData, handlePaymentTypeChange }) => {
  return (
    <div className="space-y-4">
      {/* Тип оплаты */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Тип оплаты</Label>
        <Select 
          value={formData.paymentType} 
          onValueChange={handlePaymentTypeChange}
        >
          <SelectTrigger className="h-10">
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

      {/* Суммы */}
      {formData.paymentType === 'cash' && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Наличные</Label>
          <MoneyInput 
            placeholder="0 ₸"
            value={formData.price_cash}
            onValueChange={(value) => setFormData(prev => ({ ...prev, price_cash: value }))}
          />
        </div>
      )}
      
      {formData.paymentType === 'bank' && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Банк</Label>
          <MoneyInput 
            placeholder="0 ₸"
            value={formData.price_bank}
            onValueChange={(value) => setFormData(prev => ({ ...prev, price_bank: value }))}
          />
        </div>
      )}
      
      {formData.paymentType === 'mixed' && (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Наличные</Label>
            <MoneyInput 
              placeholder="0 ₸"
              value={formData.price_cash}
              onValueChange={(value) => setFormData(prev => ({ ...prev, price_cash: value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Банк</Label>
            <MoneyInput 
              placeholder="0 ₸"
              value={formData.price_bank}
              onValueChange={(value) => setFormData(prev => ({ ...prev, price_bank: value }))}
            />
          </div>
        </>
      )}
    </div>
  );
};

// Компонент: Мобильные вкладки - Документы (только для сегодняшних поставок)
const MobileImagesTab: React.FC<{
  existingImages: SupplyImage[];
  setSelectedImages: (images: File[]) => void;
  selectedImages: File[];
  setExistingImages: (images: SupplyImage[]) => void;
  supply?: Supply | null;
  showStatusChange: boolean;
  setShowStatusChange: (show: boolean) => void;
  handleStatusChange: (status: string) => void;
  formData: any;
  isToday: boolean;
}> = ({ 
  existingImages,
  setSelectedImages,
  selectedImages,
  setExistingImages,
  supply,
  showStatusChange,
  setShowStatusChange,
  handleStatusChange,
  formData,
  isToday
}) => {
  // Если не сегодняшняя поставка, показываем сообщение
  if (!isToday) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <FileImage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            Загрузка документов доступна только для сегодняшних поставок
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Измените дату поставки на сегодня, чтобы загрузить документы
          </p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
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

  const getAvailableStatuses = () => {
    const statuses = [
      { value: 'pending', label: 'Ожидает подтверждения' },
      { value: 'confirmed', label: 'Ожидает оплаты' },
      { value: 'delivered', label: 'Подтверждена' },
    ];
    
    return statuses.filter(status => status.value !== formData.status);
  };

  const availableStatuses = getAvailableStatuses();

  return (
    <div className="space-y-4">
      {/* Кнопка для смены статуса в мобильной версии на вкладке документов */}
      {supply && availableStatuses.length > 0 && (
        <div className="mb-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowStatusChange(!showStatusChange)}
            className="w-full gap-2 text-xs"
          >
            <Clock className="w-4 h-4" />
            Изменить статус поставки
            <ChevronDown className="w-4 h-4" />
          </Button>
          
          {showStatusChange && (
            <div className="mt-2 border rounded-md p-3 bg-gray-50">
              <div className="text-xs font-medium text-gray-500 mb-2">
                Выберите новый статус:
              </div>
              <div className="space-y-1">
                {availableStatuses.map((status) => (
                  <Button
                    key={status.value}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-xs"
                    onClick={() => handleStatusChange(status.value)}
                  >
                    {getStatusIcon(status.value)}
                    {status.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Используем ваш ImageUpload компонент */}
      <ImageUpload
        selectedFiles={selectedImages}
        onFilesChange={setSelectedImages}
        disabled={false}
        isToday={isToday}
        maxFiles={10}
        maxSizeMB={5}
      />

      {/* Существующие изображения */}
      {existingImages.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm text-gray-700">
            Существующие изображения ({existingImages.length})
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {existingImages.map((image) => (
              <div key={image.id} className="relative">
                <div 
                  className="aspect-square bg-gray-100 rounded border overflow-hidden"
                  onClick={() => window.open(image.image, '_blank')}
                >
                  <img
                    src={image.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full"
                  onClick={() => setExistingImages(prev => prev.filter(img => img.id !== image.id))}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Главный компонент
export const SupplyModal: React.FC<SupplyModalProps> = ({
  open,
  onOpenChange,
  handleDeleteSupply,
  supply,
  onSubmit,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<Omit<AddSupplyForm, 'images'> & { selectedImages?: File[] }>({
    supplier: '',
    paymentType: 'cash',
    price_cash: '0 ₸',
    price_bank: '0 ₸',
    bonus: 0,
    exchange: 0,
    delivery_date: getTomorrowDate(),
    comment: '',
    status: 'pending',
    invoice_html: '',
    selectedImages: [],
  });

  const [existingImages, setExistingImages] = useState<SupplyImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isToday, setIsToday] = useState(false);
  const [showStatusChange, setShowStatusChange] = useState(false);

  const today = getTodayDate();
  const tomorrow = getTomorrowDate();
  const dayAfterTomorrow = getDayAfterTomorrow();

  // Определяем, нужно ли показывать правую колонку
  const showRightColumn = !!(supply && isToday);

  useEffect(() => {
    if (open && supply) {
      const images = (supply as any).images || [];
      setExistingImages(images.map((img: any) => ({ 
        id: img.id, 
        image: img.image 
      })));
      
      let paymentType: 'cash' | 'bank' | 'mixed' = 'cash';
      if (supply.price_cash > 0 && supply.price_bank > 0) paymentType = 'mixed';
      else if (supply.price_bank > 0) paymentType = 'bank';

      const isSupplyToday = supply.delivery_date === today;
      setIsToday(isSupplyToday);

      setFormData({
        supplier: supply.supplier,
        paymentType,
        price_cash: supply.price_cash > 0 ? formatPrice(supply.price_cash.toString()) : '0 ₸',
        price_bank: supply.price_bank > 0 ? formatPrice(supply.price_bank.toString()) : '0 ₸',
        bonus: supply.bonus,
        exchange: supply.exchange,
        delivery_date: supply.delivery_date,
        comment: supply.comment || '',
        status: supply.status || 'pending',
        invoice_html: '',
        selectedImages: [],
      });
      
      setSelectedImages([]);
      setActiveTab('basic');
      setShowStatusChange(false);
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
        status: 'pending',
        invoice_html: '',
        selectedImages: [],
      });
      setExistingImages([]);
      setSelectedImages([]);
      setIsToday(false);
      setShowStatusChange(false);
      setActiveTab('basic');
    }
  }, [supply, open, tomorrow, today]);

  const handleDateSelect = (date: string) => {
    const isSelectedDateToday = date === today;
    setFormData(prev => ({ ...prev, delivery_date: date }));
    setIsToday(isSelectedDateToday);
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

  const handleStatusChange = (newStatus: string) => {
    setFormData(prev => ({ ...prev, status: newStatus }));
    setShowStatusChange(false);
    
    toast({
      title: 'Статус изменён',
      description: `Статус поставки изменён на "${
        newStatus === 'pending' ? 'Ожидает подтверждения' :
        newStatus === 'confirmed' ? 'Ожидает оплаты' : 'Подтверждена'
      }"`,
      variant: 'default',
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
        supplier: formData.supplier,
        paymentType: formData.paymentType,
        price_cash: (parseMoneyValue(formData.price_cash)).toString(),
        price_bank: (parseMoneyValue(formData.price_bank)).toString(),
        bonus: formData.bonus,
        exchange: formData.exchange,
        delivery_date: formData.delivery_date,
        comment: formData.comment,
        status: formData.status,
        invoice_html: formData.invoice_html,
        images: showRightColumn ? selectedImages : undefined,
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

  const getTimeString = (dateTimeString?: string | null) => {
    if (!dateTimeString) return 'Не указано';
    return formatDateTime(dateTimeString);
  };

  // Определяем ширину модального окна в зависимости от контекста
  const getModalWidthClass = () => {
    if (showRightColumn) {
      return "md:max-w-6xl"; // Широкая модалка для сегодняшних поставок
    } else {
      return "md:max-w-3xl"; // Узкая модалка для не сегодняшних поставок
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`w-full max-w-[95vw] ${getModalWidthClass()} max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col`}>
          <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b flex-shrink-0">
            <DialogTitle className="text-lg md:text-xl font-semibold flex items-center gap-2 md:gap-3">
              <Package className="w-5 h-5 md:w-6 md:h-6" />
              {supply ? 'Редактирование поставки' : 'Новая поставка'}
            </DialogTitle>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-1">
              <p className="text-sm text-gray-500">
                {supply && isToday 
                  ? 'Сегодняшняя поставка' 
                  : 'Дата поставки от завтрашнего дня'}
                {isToday && showRightColumn && ' • Доступна загрузка документов'}
              </p>
              
              {/* Отображение статуса */}
              {supply?.status && (
                <div className={`flex items-center gap-2 text-sm ${
                  supply.status === 'delivered' ? 'text-green-600' :
                  supply.status === 'confirmed' ? 'text-amber-600' :
                  'text-gray-500'
                }`}>
                  {supply.status === 'pending' && <AlertCircle className="w-4 h-4 text-gray-500" />}
                  {supply.status === 'confirmed' && <ClockIcon className="w-4 h-4 text-amber-500" />}
                  {supply.status === 'delivered' && <CheckCircle className="w-4 h-4 text-green-600" />}
                  <span>
                    {supply.status === 'pending' && 'Ожидает подтверждения'}
                    {supply.status === 'confirmed' && 'Ожидает оплаты'}
                    {supply.status === 'delivered' && 'Подтверждена'}
                    {(supply.status === 'delivered' || supply.status === 'confirmed') && 
                     supply.arrival_date && (
                      <>: {getTimeString(supply.arrival_date)}</>
                    )}
                  </span>
                </div>
              )}
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            {/* Десктопный вид */}
            <div className="hidden md:flex flex-1 overflow-hidden">
              <DesktopLeftColumn
                formData={formData}
                setFormData={setFormData}
                supply={supply}
                tomorrow={tomorrow}
                dayAfterTomorrow={dayAfterTomorrow}
                today={today}
                isToday={isToday}
                handleDateSelect={handleDateSelect}
                handlePaymentTypeChange={handlePaymentTypeChange}
                showStatusChange={showStatusChange}
                setShowStatusChange={setShowStatusChange}
                handleStatusChange={handleStatusChange}
                showRightColumn={showRightColumn}
              />
              
              {/* Правую колонку показываем только для сегодняшних поставок */}
              {showRightColumn && (
                <DesktopRightColumn
                  formData={formData}
                  supply={supply}
                  showStatusChange={showStatusChange}
                  setShowStatusChange={setShowStatusChange}
                  handleStatusChange={handleStatusChange}
                  existingImages={existingImages}
                  setSelectedImages={setSelectedImages}
                  selectedImages={selectedImages}
                  setExistingImages={setExistingImages}
                />
              )}
            </div>

            {/* Мобильный вид */}
            <div className="md:hidden flex-1 flex flex-col overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="border-b flex-shrink-0">
                  <TabsList className="grid grid-cols-3 w-full h-12 rounded-none">
                    <TabsTrigger value="basic" className="text-xs flex flex-col gap-1 py-2">
                      <Building className="w-4 h-4" />
                      <span className="text-[10px]">Основное</span>
                    </TabsTrigger>
                    <TabsTrigger value="money" className="text-xs flex flex-col gap-1 py-2">
                      <Wallet className="w-4 h-4" />
                      <span className="text-[10px]">Оплата</span>
                    </TabsTrigger>
                    {isToday && (
                      <TabsTrigger value="images" className="text-xs flex flex-col gap-1 py-2">
                        <FileImage className="w-4 h-4" />
                        <span className="text-[10px]">Документы</span>
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="basic" className="p-4 space-y-4 mt-0 h-full">
                    <MobileBasicTab
                      formData={formData}
                      setFormData={setFormData}
                      supply={supply}
                      showStatusChange={showStatusChange}
                      setShowStatusChange={setShowStatusChange}
                      handleStatusChange={handleStatusChange}
                      handleDateSelect={handleDateSelect}
                      tomorrow={tomorrow}
                      dayAfterTomorrow={dayAfterTomorrow}
                      isToday={isToday}
                    />
                  </TabsContent>

                  <TabsContent value="money" className="p-4 space-y-4 mt-0 h-full">
                    <MobileMoneyTab
                      formData={formData}
                      setFormData={setFormData}
                      handlePaymentTypeChange={handlePaymentTypeChange}
                    />
                  </TabsContent>

                  {/* Вкладка с документами показывается только для сегодняшних поставок */}
                  {isToday && (
                    <TabsContent value="images" className="p-4 space-y-4 mt-0 h-full">
                      <MobileImagesTab
                        existingImages={existingImages}
                        setSelectedImages={setSelectedImages}
                        selectedImages={selectedImages}
                        setExistingImages={setExistingImages}
                        supply={supply}
                        showStatusChange={showStatusChange}
                        setShowStatusChange={setShowStatusChange}
                        handleStatusChange={handleStatusChange}
                        formData={formData}
                        isToday={isToday}
                      />
                    </TabsContent>
                  )}
                </div>
              </Tabs>
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