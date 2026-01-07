// @/components/SupplyModal.tsx - версия с кнопкой для смены статуса
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
  Upload,
  X,
  CheckCircle,
  Clock as ClockIcon,
  AlertCircle,
  ChevronDown
} from "lucide-react";
import { formatPrice, formatDateTime } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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

// Функция для получения текста статуса
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

// Функция для получения иконки статуса
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
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<Omit<AddSupplyForm, 'images'>>({
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
  });

  const [existingImages, setExistingImages] = useState<SupplyImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isToday, setIsToday] = useState(false);
  const [showStatusChange, setShowStatusChange] = useState(false);

  const today = getTodayDate();
  const tomorrow = getTomorrowDate();
  const dayAfterTomorrow = getDayAfterTomorrow();

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
      description: `Статус поставки изменён на "${getStatusText(newStatus)}"`,
      variant: 'default',
    });
  };

  const parseMoneyValue = (value: string): number => {
    if (!value) return 0;
    const cleaned = value.replace(/[^\d]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 10 - selectedImages.length);
      setSelectedImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (id: number) => {
    setExistingImages(prev => prev.filter(img => img.id !== id));
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
        images: selectedImages.length > 0 ? selectedImages : undefined,
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

  const allImages = [
    ...existingImages,
    ...selectedImages.map((file, index) => ({
      id: -(index + 1),
      image: URL.createObjectURL(file),
      file
    }))
  ];

  // Определяем доступные статусы для изменения
  const getAvailableStatuses = () => {
    const statuses = [
      { value: 'pending', label: 'Ожидает подтверждения' },
      { value: 'confirmed', label: 'Ожидает оплаты' },
      { value: 'delivered', label: 'Подтверждена' },
    ];
    
    // Возвращаем все статусы, кроме текущего
    return statuses.filter(status => status.value !== formData.status);
  };

  const availableStatuses = getAvailableStatuses();

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-[95vw] md:max-w-6xl max-h-[90vh] p-0 gap-0">
          <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b">
            <DialogTitle className="text-lg md:text-xl font-semibold flex items-center gap-2 md:gap-3">
              <Package className="w-5 h-5 md:w-6 md:h-6" />
              {supply ? 'Редактирование поставки' : 'Новая поставка'}
            </DialogTitle>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-1">
              <p className="text-sm text-gray-500">
                {supply && isToday 
                  ? 'Сегодняшняя поставка' 
                  : 'Дата поставки от завтрашнего дня'}
              </p>
              
              {/* Отображение статуса */}
              {supply?.status && (
                <div className={`flex items-center gap-2 text-sm ${
                  supply.status === 'delivered' ? 'text-green-600' :
                  supply.status === 'confirmed' ? 'text-amber-600' :
                  'text-gray-500'
                }`}>
                  {getStatusIcon(supply.status)}
                  <span>
                    {getStatusText(supply.status)}
                    {(supply.status === 'delivered' || supply.status === 'confirmed') && 
                     supply.arrival_date && (
                      <>: {getTimeString(supply.arrival_date)}</>
                    )}
                  </span>
                </div>
              )}
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col h-[calc(90vh-120px)] md:h-[calc(90vh-140px)]">
            {/* Десктопный вид - две колонки */}
            <div className="hidden md:block flex-1 overflow-hidden">
              <div className="grid grid-cols-2 h-full">
                {/* Левая колонка - Основные данные */}
                <div className="border-r p-6 space-y-8 overflow-y-auto">
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
                    
                    {supply ? (
                      // При редактировании
                      <div>
                        {isToday ? (
                          // Сегодняшняя поставка
                          <div className="text-sm text-gray-700">
                            Сегодня ({formData.delivery_date})
                          </div>
                        ) : (
                          // Не сегодняшняя поставка
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

                  {/* Статус поставки (только для редактирования) */}
                  {supply && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Статус поставки
                      </Label>
                      <div className="p-3 border rounded-md bg-gray-50">
                        <div className="flex items-center justify-between">
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
                        {supply.arrival_date && (
                          <div className="mt-2 text-sm text-gray-600">
                            Дата изменения статуса: {getTimeString(supply.arrival_date)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Правая колонка - Изображения */}
                <div className="p-6 space-y-6 overflow-y-auto">
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
                  
                  {allImages.length > 0 && (
                    <div className="text-sm text-gray-500 mb-4">
                      Всего: {allImages.length} файлов
                    </div>
                  )}

                  {/* Кнопка загрузки новых изображений */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Label 
                        htmlFor="image-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 cursor-pointer transition-colors border border-blue-200"
                      >
                        <Upload className="w-4 h-4" />
                        Загрузить файлы
                      </Label>
                      <span className="text-sm text-gray-500">
                        Максимум 10 файлов, каждый до 5 MB
                      </span>
                    </div>

                    {/* Выбранные файлы */}
                    {selectedImages.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-sm text-gray-700">
                          Новые файлы ({selectedImages.length})
                        </Label>
                        <div className="grid grid-cols-4 gap-3">
                          {selectedImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeSelectedImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <p className="text-xs text-gray-500 mt-1 truncate">
                                {file.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Существующие изображения */}
                    {existingImages.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-sm text-gray-700">
                          Существующие изображения ({existingImages.length})
                        </Label>
                        <div className="grid grid-cols-4 gap-3">
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
                                onClick={() => removeExistingImage(image.id)}
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

                    {/* Нет изображений */}
                    {allImages.length === 0 && (
                      <div className="text-center py-8">
                        <FileImage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">
                          Нет загруженных изображений
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Добавьте документы поставки
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Информация о загрузке */}
                  <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-700">
                      Поддерживаются форматы: JPG, PNG, PDF
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Максимальный размер файла: 5 MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Мобильный вид - вкладки */}
            <div className="md:hidden flex-1 flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                <div className="border-b flex-shrink-0">
                  <TabsList className="grid grid-cols-3 w-full h-12 rounded-none">
                    <TabsTrigger value="basic" className="text-xs flex flex-col gap-1">
                      <Building className="w-4 h-4" />
                      Основное
                    </TabsTrigger>
                    <TabsTrigger value="money" className="text-xs flex flex-col gap-1">
                      <Wallet className="w-4 h-4" />
                      Оплата
                    </TabsTrigger>
                    <TabsTrigger value="images" className="text-xs flex flex-col gap-1">
                      <FileImage className="w-4 h-4" />
                      Документы
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="basic" className="p-4 space-y-6 mt-0">
                    {/* Поставщик */}
                    <div className="space-y-2">
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
                                className="flex-1"
                              >
                                Завтра
                              </Button>
                              <Button
                                type="button"
                                variant={formData.delivery_date === dayAfterTomorrow ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleDateSelect(dayAfterTomorrow)}
                                className="flex-1"
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
                              className="flex-1"
                            >
                              Завтра
                            </Button>
                            <Button
                              type="button"
                              variant={formData.delivery_date === dayAfterTomorrow ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleDateSelect(dayAfterTomorrow)}
                              className="flex-1"
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
                        rows={4} 
                        placeholder="Введите комментарий..."
                        className="resize-none min-h-[100px]"
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
                              className="gap-2"
                            >
                              <Clock className="w-4 h-4" />
                              Изменить
                            </Button>
                          )}
                        </div>
                        
                        <div className="p-3 border rounded-md bg-gray-50">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(formData.status)}
                            <span className="font-medium">{getStatusText(formData.status)}</span>
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
                                  className="w-full justify-start gap-2 mb-1"
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
                  </TabsContent>

                  <TabsContent value="money" className="p-4 space-y-6 mt-0">
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
                  </TabsContent>

                  <TabsContent value="images" className="p-4 space-y-6 mt-0">
                    {/* Кнопка для смены статуса в мобильной версии на вкладке документов */}
                    {supply && availableStatuses.length > 0 && (
                      <div className="mb-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowStatusChange(!showStatusChange)}
                          className="w-full gap-2"
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
                                  className="w-full justify-start gap-2"
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

                    {/* Кнопка загрузки файлов */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <FileImage className="w-4 h-4" />
                          Загрузить файлы
                        </Label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            id="image-upload-mobile"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Label 
                            htmlFor="image-upload-mobile"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 cursor-pointer transition-colors border border-blue-200 flex-1 justify-center"
                          >
                            <Upload className="w-4 h-4" />
                            Выбрать файлы
                          </Label>
                        </div>
                      </div>

                      {/* Выбранные файлы */}
                      {selectedImages.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-sm text-gray-700">
                            Новые файлы ({selectedImages.length})
                          </Label>
                          <div className="grid grid-cols-3 gap-2">
                            {selectedImages.map((file, index) => (
                              <div key={index} className="relative">
                                <div className="aspect-square bg-gray-100 rounded border overflow-hidden">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full"
                                  onClick={() => removeSelectedImage(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Существующие изображения */}
                      {existingImages.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-sm text-gray-700">
                            Существующие изображения ({existingImages.length})
                          </Label>
                          <div className="grid grid-cols-3 gap-2">
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
                                  onClick={() => removeExistingImage(image.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Нет изображений */}
                      {allImages.length === 0 && (
                        <div className="text-center py-6">
                          <FileImage className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">
                            Нет загруженных изображений
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
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