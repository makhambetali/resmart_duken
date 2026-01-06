// @/components/SupplyModal.tsx - с ImageUpload
import React, { useState, useEffect } from 'react';
import { Supply, AddSupplyForm } from '@/types/supply';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  Loader2,
  Calendar,
  CheckCircle,
  CreditCard,
  Wallet,
  FileImage,
  MessageSquare,
  Building,
  Package,
  Plus,
  Table
} from "lucide-react";
import { formatPrice } from '@/lib/utils';
import { EditableInvoiceTable } from '@/components/EditableInvoiceTable';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ImageUpload } from '@/components/ImageUpload';
import { AITableExtractor } from '@/components/AITableExtractor';
import { ImageViewer } from '@/components/ImageViewer';
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
}

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
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
    is_confirmed: false,
    invoice_html: '',
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [supplyImages, setSupplyImages] = useState<SupplyImage[]>([]);
  const [currentHtmlForTable, setCurrentHtmlForTable] = useState<string>('');

  const today = getTodayDate();
  const tomorrow = getTomorrowDate();
  const isToday = formData.delivery_date === today;

  useEffect(() => {
    if (open && supply) {
      const images = (supply as any).images || [];
      setSupplyImages(images);
      
      let paymentType: 'cash' | 'bank' | 'mixed' = 'cash';
      if (supply.price_cash > 0 && supply.price_bank > 0) paymentType = 'mixed';
      else if (supply.price_bank > 0) paymentType = 'bank';

      const existingHtml = supply.invoice_html || '';
      setCurrentHtmlForTable(existingHtml);

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
      setActiveTab('basic');
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
      setSelectedImages([]);
      setSupplyImages([]);
      setCurrentHtmlForTable('');
      setActiveTab('basic');
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

  const handleOpenImageViewer = (index: number) => {
    setImageViewerIndex(index);
    setIsImageViewerOpen(true);
  };

  const handleAIProcessingComplete = (results: Array<{ file: File; html: string }>) => {
    const validResults = results.filter(r => r.html.trim().length > 0);
    if (validResults.length > 0) {
      const combinedHtml = validResults.map(r => r.html).join('\n<br/>\n');
      setCurrentHtmlForTable(combinedHtml);
      setFormData(prev => ({ ...prev, invoice_html: combinedHtml }));
      
      toast({
        title: 'Таблица создана',
        description: `AI создал таблицу из ${validResults.length} изображений`,
        variant: 'default',
      });
    }
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

  const allImages = [...supplyImages, ...selectedImages.map((file, index) => ({
    id: -(index + 1),
    image: URL.createObjectURL(file),
  }))];

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-[95vw] md:max-w-4xl max-h-[90vh] p-0 gap-0">
          <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b">
            <DialogTitle className="text-lg md:text-xl font-semibold flex items-center gap-2 md:gap-3">
              <Package className="w-5 h-5 md:w-6 md:h-6" />
              {supply ? 'Редактирование поставки' : 'Новая поставка'}
            </DialogTitle>
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
                      Дата поставки
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        type="button"
                        variant={formData.delivery_date === today ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDateSelect(today)}
                        className="h-10"
                      >
                        Сегодня
                      </Button>
                      <Button
                        type="button"
                        variant={formData.delivery_date === tomorrow ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDateSelect(tomorrow)}
                        className="h-10"
                      >
                        Завтра
                      </Button>
                      <div className="relative">
                        <Input 
                          type="date" 
                          min={today}
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

                {/* Правая колонка - Документы */}
                <div className="p-6 space-y-8 overflow-y-auto">
                  {/* Документы заголовок */}
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <FileImage className="w-4 h-4" />
                      Документы
                    </Label>
                    {currentHtmlForTable && (
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsPreviewModalOpen(true)}
                        className="h-8 gap-2"
                      >
                        <Table className="w-4 h-4" />
                        Таблица
                      </Button>
                    )}
                  </div>

                  {/* Статус документов */}
                  {!isToday ? (
                    <div className="p-4 border border-amber-200 rounded-lg bg-amber-50">
                      <p className="text-sm text-amber-700">
                        Загрузка документов доступна только для поставок на сегодня
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Существующие изображения */}
                      {supplyImages.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Загружено изображений: {supplyImages.length}
                            </span>
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="sm"
                              onClick={() => setIsImageViewerOpen(true)}
                              className="h-7 text-xs"
                            >
                              Просмотреть все
                            </Button>
                          </div>
                          <div className="grid grid-cols-4 gap-3">
                            {supplyImages.map((image, index) => (
                              <div
                                key={image.id}
                                className="relative cursor-pointer group"
                                onClick={() => handleOpenImageViewer(index)}
                              >
                                <img
                                  src={image.image}
                                  alt=""
                                  className="w-full h-24 object-cover rounded-lg border group-hover:opacity-80 transition-opacity"
                                />
                                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  {index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Компонент загрузки изображений */}
                      <ImageUpload
                        selectedFiles={selectedImages}
                        onFilesChange={setSelectedImages}
                        disabled={!isToday || isLoading}
                        isToday={isToday}
                        maxFiles={10}
                        maxSizeMB={5}
                      />

                      {/* AI обработка */}
                      {selectedImages.length > 0 && AI_CONFIG.ENABLED && (
                        <AITableExtractor
                          files={selectedImages}
                          onProcessingComplete={handleAIProcessingComplete}
                          disabled={isLoading}
                        />
                      )}
                    </>
                  )}

                  {/* Подтверждение */}
                  <div className="flex items-start space-x-4 p-4 border rounded-lg bg-gray-50">
                    <Checkbox 
                      id="isConfirmed" 
                      checked={formData.is_confirmed} 
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_confirmed: Boolean(checked) }))} 
                      disabled={!isToday}
                      className="h-5 w-5 mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="isConfirmed" className="font-medium flex items-center gap-2 cursor-pointer">
                        <CheckCircle className="w-4 h-4" />
                        Подтвердить поставку
                      </Label>
                      {!isToday && (
                        <p className="text-xs text-gray-500 mt-2">
                          Доступно только для поставок на сегодня
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Мобильный вид - вкладки */}
            <div className="md:hidden flex-1 flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                <div className="border-b flex-shrink-0">
                  <TabsList className="grid grid-cols-4 w-full h-12 rounded-none">
                    <TabsTrigger value="basic" className="text-xs flex flex-col gap-1">
                      <Building className="w-4 h-4" />
                      Основное
                    </TabsTrigger>
                    <TabsTrigger value="money" className="text-xs flex flex-col gap-1">
                      <Wallet className="w-4 h-4" />
                      Оплата
                    </TabsTrigger>
                    <TabsTrigger value="docs" className="text-xs flex flex-col gap-1">
                      <FileImage className="w-4 h-4" />
                      Документы
                    </TabsTrigger>
                    <TabsTrigger value="comment" className="text-xs flex flex-col gap-1">
                      <MessageSquare className="w-4 h-4" />
                      Коммент.
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
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={formData.delivery_date === today ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleDateSelect(today)}
                          className="h-10"
                        >
                          Сегодня
                        </Button>
                        <Button
                          type="button"
                          variant={formData.delivery_date === tomorrow ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleDateSelect(tomorrow)}
                          className="h-10"
                        >
                          Завтра
                        </Button>
                        <div className="col-span-2">
                          <Input 
                            type="date" 
                            min={today}
                            value={formData.delivery_date} 
                            onChange={(e) => handleDateSelect(e.target.value)} 
                            className="h-10"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Подтверждение */}
                    <div className="flex items-start space-x-3 p-3 border rounded-lg bg-gray-50">
                      <Checkbox 
                        id="isConfirmed" 
                        checked={formData.is_confirmed} 
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_confirmed: Boolean(checked) }))} 
                        disabled={!isToday}
                        className="h-5 w-5 mt-0.5"
                      />
                      <div className="flex-1">
                        <Label htmlFor="isConfirmed" className="font-medium flex items-center gap-2 cursor-pointer">
                          <CheckCircle className="w-4 h-4" />
                          Подтвердить поставку
                        </Label>
                        {!isToday && (
                          <p className="text-xs text-gray-500 mt-1">
                            Доступно только для поставок на сегодня
                          </p>
                        )}
                      </div>
                    </div>
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
                  </TabsContent>

                  <TabsContent value="docs" className="p-4 space-y-6 mt-0">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <FileImage className="w-4 h-4" />
                        Документы
                      </Label>
                      {currentHtmlForTable && (
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsPreviewModalOpen(true)}
                          className="h-8 gap-2"
                        >
                          <Table className="w-4 h-4" />
                          Таблица
                        </Button>
                      )}
                    </div>

                    {!isToday ? (
                      <div className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                        <p className="text-sm text-amber-700">
                          Загрузка документов доступна только для поставок на сегодня
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Существующие изображения */}
                        {supplyImages.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                Загружено: {supplyImages.length}
                              </span>
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="sm"
                                onClick={() => setIsImageViewerOpen(true)}
                                className="h-7 text-xs"
                              >
                                Просмотреть все
                              </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {supplyImages.map((image, index) => (
                                <div
                                  key={image.id}
                                  className="relative cursor-pointer"
                                  onClick={() => handleOpenImageViewer(index)}
                                >
                                  <img
                                    src={image.image}
                                    alt=""
                                    className="w-full h-20 object-cover rounded border"
                                  />
                                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                                    {index + 1}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Компонент загрузки изображений */}
                        <ImageUpload
                          selectedFiles={selectedImages}
                          onFilesChange={setSelectedImages}
                          disabled={!isToday || isLoading}
                          isToday={isToday}
                          maxFiles={10}
                          maxSizeMB={5}
                        />

                        {/* AI обработка */}
                        {selectedImages.length > 0 && AI_CONFIG.ENABLED && (
                          <AITableExtractor
                            files={selectedImages}
                            onProcessingComplete={handleAIProcessingComplete}
                            disabled={isLoading}
                          />
                        )}
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="comment" className="p-4 space-y-4 mt-0">
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

      {/* Модальное окно для редактирования таблицы */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-6xl max-h-[85vh] p-0">
          <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b">
            <DialogTitle className="text-lg md:text-xl">Редактирование таблицы</DialogTitle>
          </DialogHeader>
          <div className="h-[60vh] md:h-[70vh] overflow-auto p-2 md:p-6">
            <EditableInvoiceTable
              html={currentHtmlForTable}
              onHtmlChange={(newHtml) => {
                setCurrentHtmlForTable(newHtml);
                setFormData(prev => ({ ...prev, invoice_html: newHtml }));
              }}
            />
          </div>
          <div className="px-4 md:px-6 py-3 md:py-4 border-t">
            <div className="flex flex-col md:flex-row justify-end gap-2 md:gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsPreviewModalOpen(false)}
                className="w-full md:w-auto"
                size="sm"
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
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700"
                size="sm"
              >
                Сохранить
              </Button>
            </div>
          </div>
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