// @/components/SupplyModal.tsx - обновленный код
import React, { useState, useEffect, useRef } from 'react';
import { Supply, AddSupplyForm } from '@/types/supply';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SupplierSearchCombobox } from '@/components/SupplierSearchCombobox';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { AI_CONFIG } from '@/ai-config';
import { 
  Trash, 
  FileText, 
  Loader2, 
  Eye, 
  CalendarClock,
  RefreshCw,
  Table,
  Info,
  Image as ImageIcon,
  X,
  ChevronRight,
  ChevronLeft,
  Download,
  Calendar,
  CheckCircle
} from "lucide-react";
import { formatPrice, getNumericValue } from '@/lib/utils';
import { EditableInvoiceTable } from '@/components/EditableInvoiceTable';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ImageUpload } from '@/components/ImageUpload';
import { AITableExtractor } from '@/components/AITableExtractor';
import { ImageViewer } from '@/components/ImageViewer';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SupplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleDeleteSupply: (id: string) => void;
  supply?: Supply | null;
  onSubmit: (data: Omit<AddSupplyForm, 'images'> & { images?: File[] }) => Promise<void>;
  suppliers: Array<{ id: string; name: string }>;
  initialSupplier?: string; // Новый пропс
}

interface SupplyImage {
  id: number;
  image: string;
}

// Функция для получения даты завтра
const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString('en-CA');
};

// Функция для получения даты послезавтра
const getDayAfterTomorrowDate = () => {
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  return dayAfterTomorrow.toLocaleDateString('en-CA');
};

// Функция для получения сегодняшней даты
const getTodayDate = () => {
  return new Date().toLocaleDateString('en-CA');
};

// Функция для проверки, является ли дата сегодняшней
const isDateToday = (dateString: string) => {
  return dateString === getTodayDate();
};

// Функция для получения читаемого названия даты
const getDateDisplayName = (dateString: string) => {
  const today = getTodayDate();
  const tomorrow = getTomorrowDate();
  const dayAfterTomorrow = getDayAfterTomorrowDate();
  
  if (dateString === today) return 'Сегодня';
  if (dateString === tomorrow) return 'Завтра';
  if (dateString === dayAfterTomorrow) return 'Послезавтра';
  
  // Для других дат показываем в формате ДД.ММ
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
};

// Custom Input компонент для денежных значений
interface MoneyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValueChange: (value: string) => void;
  isPrimary?: boolean;
  maxDigits?: number;
}

const MoneyInput: React.FC<MoneyInputProps> = ({ 
  value, 
  onValueChange, 
  disabled, 
  isPrimary, 
  maxDigits = 9,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    // Если значение "0", очищаем поле при фокусе
    if (value === '0' || value === '0 ₸') {
      onValueChange('');
    }
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    // Если поле пустое после потери фокуса, устанавливаем "0 ₸"
    if (!value.trim()) {
      onValueChange('0 ₸');
    }
    if (props.onBlur) props.onBlur(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Удаляем все нецифровые символы, кроме ₸ в конце
    const numericValue = inputValue.replace(/[^\d]/g, '').slice(0, maxDigits);
    
    if (numericValue === '') {
      onValueChange('');
    } else {
      const formattedValue = formatPrice(numericValue);
      onValueChange(formattedValue);
    }
  };

  // Форматируем отображение значения
  const displayValue = value === '0' || value === '0 ₸' || value === '' 
    ? (isFocused ? '' : '0 ₸') 
    : value;

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className={`pr-10 ${isFocused ? 'border-blue-500 ring-1 ring-blue-500' : ''} ${
          isPrimary ? 'bg-blue-50 border-blue-300' : ''
        }`}
        maxLength={maxDigits + 4} // Оставляем место для форматирования
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
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
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

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [supplyImages, setSupplyImages] = useState<SupplyImage[]>([]);
  const [currentHtmlForTable, setCurrentHtmlForTable] = useState<string>('');
  const [tableHasChanges, setTableHasChanges] = useState<boolean>(false);
  const [createdAt, setCreatedAt] = useState<string>('');
  const [isRescheduled, setIsRescheduled] = useState<boolean>(false);
  const [showCustomDateInput, setShowCustomDateInput] = useState<boolean>(false);

  const today = getTodayDate();
  const tomorrow = getTomorrowDate();
  const dayAfterTomorrow = getDayAfterTomorrowDate();
  const isToday = isDateToday(formData.delivery_date);

  // Функция для вычисления суммы двух денежных значений
  const sumMoneyValues = (val1: string, val2: string): string => {
    const num1 = getNumericValue(val1);
    const num2 = getNumericValue(val2);
    const sum = num1 + num2;
    return formatPrice(sum.toString());
  };

  // Обработка изменения типа оплаты
  const handlePaymentTypeChange = (newPaymentType: 'cash' | 'bank' | 'mixed') => {
    setFormData(prev => {
      const newData = { ...prev, paymentType: newPaymentType };
      
      // Если меняемся со смешанного типа на cash или bank
      if (prev.paymentType === 'mixed' && (newPaymentType === 'cash' || newPaymentType === 'bank')) {
        // const totalSum = sumMoneyValues(prev.price_cash, prev.price_bank);
        
        if (newPaymentType === 'cash') {
          // Суммируем оба значения в cash, bank обнуляем
          newData.price_cash = '0 ₸';
          newData.price_bank = '0 ₸';
        } else if (newPaymentType === 'bank') {
          // Суммируем оба значения в bank, cash обнуляем
          newData.price_bank ='0 ₸';
          newData.price_cash = '0 ₸';
        }
      }
      // Если меняемся с cash на bank
      else if (newPaymentType === 'bank' && prev.paymentType === 'cash' && prev.price_cash !== '0 ₸') {
        // Перемещаем сумму из cash в bank
        newData.price_bank = prev.price_cash;
        newData.price_cash = '0 ₸';
      } 
      // Если меняемся с bank на cash
      else if (newPaymentType === 'cash' && prev.paymentType === 'bank' && prev.price_bank !== '0 ₸') {
        // Перемещаем сумму из bank в cash
        newData.price_cash = prev.price_bank;
        newData.price_bank = '0 ₸';
      }
      // Если меняемся на mixed из cash или bank
      else if (newPaymentType === 'mixed') {
        // При смешанном типе оставляем текущее значение в основном поле
        if (prev.paymentType === 'cash' && prev.price_cash !== '0 ₸') {
          // Перемещаем сумму из cash в cash (оставляем как есть), bank ставим 0
          newData.price_bank = '0 ₸';
        } else if (prev.paymentType === 'bank' && prev.price_bank !== '0 ₸') {
          // Перемещаем сумму из bank в bank (оставляем как есть), cash ставим 0
          newData.price_cash = '0 ₸';
        }
      }
      
      return newData;
    });
  };

  // Загрузка существующих изображений при открытии
  useEffect(() => {
    if (open && supply) {
      // Типизируем images из supply
      const images = (supply as any).images || [];
      setSupplyImages(images);
      
      let paymentType: 'cash' | 'bank' | 'mixed' = 'cash';
      if (supply.price_cash > 0 && supply.price_bank > 0) paymentType = 'mixed';
      else if (supply.price_bank > 0) paymentType = 'bank';

      setCreatedAt(supply.date_added || '');
      setIsRescheduled((supply as any).rescheduled_cnt || 0);

      const existingHtml = supply.invoice_html || '';
      setCurrentHtmlForTable(existingHtml);
      setTableHasChanges(false);

      // Проверяем, является ли дата одной из ключевых
      const supplyDate = supply.delivery_date;
      if (supplyDate !== today && supplyDate !== tomorrow && supplyDate !== dayAfterTomorrow) {
        setShowCustomDateInput(true);
      }

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
        invoice_html: existingHtml,
      });
      
      setSelectedImages([]);
    } else if (open) {
      // Новая поставка
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
      setSelectedImages([]);
      setSupplyImages([]);
      setCurrentHtmlForTable('');
      setCreatedAt('');
      setIsRescheduled(false);
      setShowCustomDateInput(false);
    }
  }, [supply, open, today, tomorrow, dayAfterTomorrow]);

  // Функция для обработки выбора даты
  const handleDateSelect = (date: string) => {
    setFormData(prev => ({ ...prev, delivery_date: date }));
    if (date === 'custom') {
      setShowCustomDateInput(true);
    } else {
      setShowCustomDateInput(false);
    }
  };

  // Функция для обработки кастомной даты
  const handleCustomDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, delivery_date: date }));
  };

  // Функция для открытия просмотра изображения
  const handleOpenImageViewer = (index: number) => {
    setImageViewerIndex(index);
    setIsImageViewerOpen(true);
  };

  // Функция для удаления существующего изображения
  const handleDeleteImage = async (imageId: number) => {
    if (confirm('Вы уверены, что хотите удалить это изображение?')) {
      try {
        // Отправляем запрос на удаление
        const response = await fetch(`/api/v1/supply-images/${imageId}/`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Удаляем из локального состояния
          setSupplyImages(prev => prev.filter(img => img.id !== imageId));
          toast({
            title: 'Изображение удалено',
            variant: 'default',
          });
        } else {
          throw new Error('Не удалось удалить изображение');
        }
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить изображение',
          variant: 'destructive',
        });
      }
    }
  };

  // Функция для скачивания изображения
  const handleDownloadImage = async (imageUrl: string, imageId: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `supply-image-${imageId}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: 'Ошибка скачивания',
        description: 'Не удалось скачать изображение',
        variant: 'destructive',
      });
    }
  };

  // Обработка результатов AI
  const handleAIProcessingComplete = (results: Array<{ file: File; html: string }>) => {
    const validResults = results.filter(r => r.html.trim().length > 0);
    if (validResults.length > 0) {
      const combinedHtml = validResults.map(r => r.html).join('\n<br/>\n');
      setCurrentHtmlForTable(combinedHtml);
      setFormData(prev => ({ ...prev, invoice_html: combinedHtml }));
      setTableHasChanges(true);
      
      toast({
        title: 'Таблица создана',
        description: `AI создал таблицу из ${validResults.length} изображений`,
        variant: 'default',
      });
    }
  };
const parseMoneyValue = (value: string): number => {
  if (!value) return 0;
  // Удаляем всё кроме цифр (₸, пробелы и форматирование)
  const cleaned = value.replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        className: 'bg-green-500 text-white',
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

  const formatCreatedAt = (dateString: string) => {
    if (!dateString) return 'Дата создания неизвестна';
    
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasPreviewContent = currentHtmlForTable.length > 0 || formData.invoice_html.length > 0;
  const allImages = [...supplyImages, ...selectedImages.map((file, index) => ({
    id: -(index + 1),
    image: URL.createObjectURL(file),
  }))];

  // Определяем, является ли поле основной суммой
  const isCashPrimary = formData.paymentType === 'cash';
  const isBankPrimary = formData.paymentType === 'bank';

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* Добавлен onPointerDownOutside и onInteractOutside для предотвращения закрытия */}
        <DialogContent 
          className="w-screen h-screen max-w-2xl max-h-[700px] rounded-none border-none overflow-y-auto"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{supply ? 'Редактировать поставку' : 'Добавить поставку'}</span>
              {isRescheduled && supply && (
                <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Перенесена</span>
                </div>
              )}
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
                    autoFocus={open && !supply} // Автофокус только при открытии и для новой поставки
                    autoOpen={open && !supply} // Автооткрытие только при открытии и для новой поставки
                  />
              </div>
              
              {/* Чекбокс подтверждения - перенесен выше */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Подтверждение
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </Label>
                <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Checkbox 
                    id="isConfirmed" 
                    checked={formData.is_confirmed} 
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_confirmed: Boolean(checked) }))} 
                    disabled={!isToday} 
                  />
                  <Label htmlFor="isConfirmed" className="text-sm font-normal cursor-pointer">
                    {formData.is_confirmed ? (
                      <span className="text-green-600 font-medium">Поставка подтверждена</span>
                    ) : (
                      <span>Подтвердить поставку</span>
                    )}
                  </Label>
                </div>
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
                <Label htmlFor="cashAmount">
                  Сумма наличными
                  {isCashPrimary && (
                    <span className="ml-1 text-xs text-green-600 font-medium">(основная)</span>
                  )}
                </Label>
                <MoneyInput 
                  id="cashAmount"
                  placeholder="0 ₸"
                  value={formData.price_cash}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, price_cash: value }))}
                  disabled={formData.paymentType === 'bank'}
                  isPrimary={isCashPrimary}
                  maxDigits={9}
                />
 </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankAmount">
                  Сумма банком
                  {isBankPrimary && (
                    <span className="ml-1 text-xs text-blue-600 font-medium">(основная)</span>
                  )}
                </Label>
                <MoneyInput 
                  id="bankAmount"
                  placeholder="0 ₸"
                  value={formData.price_bank}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, price_bank: value }))}
                  disabled={formData.paymentType === 'cash'}
                  isPrimary={isBankPrimary}
                  maxDigits={9}
                />
 </div>
              
              <div className="md:col-span-2">
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Дата поставки</Label>
                  <div className="space-y-3">
                    {/* Вкладки с ключевыми датами */}
                    <Tabs 
                      value={formData.delivery_date} 
                      onValueChange={handleDateSelect}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-4 mb-2">
                        <TabsTrigger value={today} className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                          Сегодня
                        </TabsTrigger>
                        <TabsTrigger value={tomorrow} className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                          Завтра
                        </TabsTrigger>
                        <TabsTrigger value={dayAfterTomorrow} className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                          Послезавтра
                        </TabsTrigger>
                        <TabsTrigger value="custom" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                          <Calendar className="w-4 h-4 mr-2" />
                          Другая
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {/* Поле для ввода кастомной даты */}
                    {showCustomDateInput && (
                      <div className="mt-2">
                        <Input 
                          type="date" 
                          min={today}
                          value={formData.delivery_date} 
                          onChange={(e) => handleCustomDateChange(e.target.value)} 
                          className="border-blue-300 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Выбрана дата: <span className="font-medium">{getDateDisplayName(formData.delivery_date)}</span>
                        </p>
                      </div>
                    )}

                    {/* Отображение выбранной даты */}
                    {!showCustomDateInput && (
                      <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-700 font-medium">
                            {getDateDisplayName(formData.delivery_date)}
                          </span>
                          <span className="text-gray-600">
                            ({formData.delivery_date})
                          </span>
                        </div>
                        {isToday && (
                          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Сегодня можно загружать изображения и редактировать таблицу
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                <div className="space-y-2">
                  <Label htmlFor="bonus">Бонус (шт.)</Label>
                  <div className="relative">
                    <Input 
                      id="bonus" 
                      type="number" 
                      min="0"
                      max="9999"
                      inputMode="numeric"
                      value={formData.bonus || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Ограничиваем ввод только цифрами
                        const numericValue = value.replace(/[^\d]/g, '').slice(0, 4);
                        setFormData(prev => ({ 
                          ...prev, 
                          bonus: numericValue ? Number(numericValue) : 0 
                        }));
                      }}
                      className="pr-10"
                      placeholder="0"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                      шт.
                    </div>
                  </div>

                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exchange">Обмен (шт.)</Label>
                  <div className="relative">
                    <Input 
                      id="exchange" 
                      type="number" 
                      min="0"
                      max="9999"
                      inputMode="numeric"
                      value={formData.exchange || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Ограничиваем ввод только цифрами
                        const numericValue = value.replace(/[^\d]/g, '').slice(0, 4);
                        setFormData(prev => ({ 
                          ...prev, 
                          exchange: numericValue ? Number(numericValue) : 0 
                        }));
                      }}
                      className="pr-10"
                      placeholder="0"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                      шт.
                    </div>
                  </div>

                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="comment">Комментарий</Label>
                <Textarea 
                  id="comment" 
                  value={formData.comment} 
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))} 
                  rows={3} 
                  placeholder="Введите комментарий к поставке..."
                />
              </div>

              {/* Блок загрузки и просмотра изображений - показываем только если сегодня */}
              {isToday && (
                <div className="space-y-4 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">Документы поставки</Label>
                    {AI_CONFIG.ENABLED && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsPreviewModalOpen(true)}
                        disabled={!hasPreviewContent}
                        className="gap-1.5"
                      >
                        <Table className="w-4 h-4" />
                        Редактировать таблицу
                        {tableHasChanges && <span className="ml-1 text-green-600 font-bold">*</span>}
                      </Button>
                    )}
                  </div>

                  {/* Существующие изображения */}
                  {supplyImages.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">
                          Загруженные изображения ({supplyImages.length})
                        </h4>
                        <span className="text-xs text-gray-500">
                          Кликните для просмотра
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {supplyImages.map((image, index) => (
                          <div
                            key={image.id}
                            className="relative group border rounded-lg overflow-hidden hover:border-primary transition-all duration-200"
                          >
                            <button
                              type="button"
                              onClick={() => handleOpenImageViewer(index)}
                              className="w-full h-full aspect-square overflow-hidden"
                            >
                              <img
                                src={image.image}
                                alt={`Изображение ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                            </button>
                            
                            {/* Номер изображения */}
                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Разделитель если есть и старые и новые изображения */}
                  {supplyImages.length > 0 && selectedImages.length > 0 && (
                    <div className="border-t pt-4" />
                  )}

                  {/* Компонент загрузки новых изображений */}
                  <ImageUpload
                    selectedFiles={selectedImages}
                    onFilesChange={setSelectedImages}
                    disabled={!isToday || isLoading}
                    isToday={isToday}
                    maxFiles={10}
                    maxSizeMB={5}
                  />

                  {/* AI обработка (опционально) */}
                  {selectedImages.length > 0 && AI_CONFIG.ENABLED && (
                    <AITableExtractor
                      files={selectedImages}
                      onProcessingComplete={handleAIProcessingComplete}
                      disabled={!isToday || isLoading}
                    />
                  )}

                  {/* Информация о существующей таблице */}
                  {formData.invoice_html.length > 0 && allImages.length === 0 && (
                    <div className="p-3 border rounded-lg bg-blue-50">
                      <div className="flex items-center gap-2">
                        <Table className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">
                          Текущая поставка содержит таблицу из {formData.invoice_html.split('<tr>').length - 1} строк
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {supply && createdAt && (
              <div className="md:col-span-2 p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarClock className="w-4 h-4" />
                  <span>Создано: {formatCreatedAt(createdAt)}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <div>
                {supply && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => handleDeleteSupply(supply.id)} 
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Trash className="w-4 h-4" />
                    Удалить поставку
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || !formData.supplier}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      {supply ? 'Обновить поставку' : 'Добавить поставку'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Модальное окно для редактирования таблицы */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="w-screen h-screen max-w-none max-h-none rounded-none border-none p-0 flex flex-col">
          <DialogHeader className="flex-shrink-0 px-6 py-4 border-b bg-white">
            <DialogTitle>Редактирование таблицы</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-auto bg-gray-50 p-4">
            <EditableInvoiceTable
              html={currentHtmlForTable}
              onHtmlChange={(newHtml) => {
                setCurrentHtmlForTable(newHtml);
                setFormData(prev => ({ ...prev, invoice_html: newHtml }));
                setTableHasChanges(true);
              }}
            />
          </div>
          <DialogFooter className="flex-shrink-0 px-6 py-4 border-t bg-white">
            <div className="flex justify-between items-center w-full">
              <Button 
                variant="outline" 
                onClick={() => setIsPreviewModalOpen(false)}
              >
                Отмена
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: 'Изменения сохранены',
                    variant: "default",
                  });
                  setIsPreviewModalOpen(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Сохранить
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Модальное окно для просмотра изображений */}
      {allImages.length > 0 && (
        <ImageViewer
          images={allImages.map(img => ({
            id: img.id,
            image: typeof img.image === 'string' ? img.image : URL.createObjectURL(img.image as any)
          }))}
          initialIndex={imageViewerIndex}
          open={isImageViewerOpen}
          onOpenChange={setIsImageViewerOpen}
        />
      )}
    </TooltipProvider>
  );
};