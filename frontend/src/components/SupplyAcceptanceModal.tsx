// @/components/SupplyAcceptanceModal.tsx
import React, { useState, useEffect } from 'react';
import { Supply, AddSupplyForm } from '@/types/supply';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2,
  Package,
  Building,
  CheckCircle,
  FileImage,
  MessageSquare,
  Search,
  Clock,
  AlertCircle,
  Info,
  Check,
  X,
  DollarSign,
  CreditCard,
  Wallet,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { ImageUpload } from '@/components/ImageUpload';
import { SupplierSearchCombobox } from '@/components/SupplierSearchCombobox';
import { suppliesApi, suppliersApi } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';

interface SupplyAcceptanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface SupplyImage {
  id: number;
  image: string;
}

const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Функция для форматирования цены
const formatCurrency = (amount: number | string) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num) + ' ₸';
};

// Функция для определения типа оплаты
const getPaymentType = (price_cash: number, price_bank: number) => {
  if (price_cash > 0 && price_bank > 0) return 'Смешанная';
  if (price_bank > 0) return 'Банк';
  return 'Наличные';
};

// @/components/SupplyAcceptanceModal.tsx - исправленная версия
// ... предыдущие импорты ...

export const SupplyAcceptanceModal: React.FC<SupplyAcceptanceModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  
  const [supplierName, setSupplierName] = useState('');
  const [foundSupply, setFoundSupply] = useState<Supply | null>(null);
  const [searchResults, setSearchResults] = useState<Supply[]>([]);
  const [supplierExists, setSupplierExists] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    bonus: 0,
    exchange: 0,
    comment: '',
  });

  // Поля для способа оплаты и суммы (только для новой поставки)
  const [paymentData, setPaymentData] = useState({
    paymentType: 'cash' as 'cash' | 'bank' | 'mixed',
    price_cash: '',
    price_bank: '',
  });
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<SupplyImage[]>([]);
  const [creatingSupply, setCreatingSupply] = useState(false);
  
  const today = getTodayDate();

  // Сброс состояния при открытии/закрытии модального окна
  useEffect(() => {
    if (open) {
      setSupplierName('');
      setFoundSupply(null);
      setSearchResults([]);
      setSupplierExists(false);
      setSearchPerformed(false);
      setShowPaymentSection(false);
      setFormData({
        bonus: 0,
        exchange: 0,
        comment: '',
      });
      setPaymentData({
        paymentType: 'cash',
        price_cash: '',
        price_bank: '',
      });
      setSelectedImages([]);
      setExistingImages([]);
      setCreatingSupply(false);
    }
  }, [open]);

  // Проверка существования поставщика
  const checkSupplierExists = async (name: string): Promise<boolean> => {
    try {
      const suppliers = await suppliersApi.getSuppliers();
      const exists = suppliers.some(s => 
        s.name.toLowerCase() === name.toLowerCase()
      );
      return exists;
    } catch (error) {
      console.error('Error checking supplier:', error);
      return false;
    }
  };

  // Поиск поставок в статусе 'pending' по названию поставщика
  const handleSearchSupplies = async () => {
    if (!supplierName.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название поставщика',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    try {
      // Проверяем существование поставщика
      const exists = await checkSupplierExists(supplierName);
      setSupplierExists(exists);

      // Получаем все поставки
      const supplies = await suppliesApi.getSupplies();
      
      // Фильтруем поставки: на сегодня, в статусе 'pending', и с указанным поставщиком
      const todayPendingSupplies = supplies.filter(supply => 
        supply.delivery_date === today && 
        supply.status === 'pending' &&
        supply.supplier.toLowerCase().includes(supplierName.toLowerCase())
      );

      setSearchResults(todayPendingSupplies);
      setSearchPerformed(true);

      if (todayPendingSupplies.length === 0) {
        if (exists) {
          // Поставщик существует, но поставок нет
          toast({
            title: 'Поставок не найдено',
            description: 'У поставщика нет поставок на сегодня',
            variant: 'default',
          });
        } else {
          // Поставщик не существует
          toast({
            title: 'Поставщик не найден',
            description: 'Поставщик не существует',
            variant: 'default',
          });
        }
      } else if (todayPendingSupplies.length === 1) {
        // Если найдена одна поставка в статусе 'pending' - автоматически выбираем её
        handleSelectSupply(todayPendingSupplies[0]);
      }
    } catch (error) {
      toast({
        title: 'Ошибка поиска',
        description: 'Не удалось загрузить список поставок',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Выбор поставки
  const handleSelectSupply = (supply: Supply) => {
    setFoundSupply(supply);
    const images = (supply as any).images || [];
    setExistingImages(images);
    
    setFormData({
      bonus: supply.bonus || 0,
      exchange: supply.exchange || 0,
      comment: supply.comment || '',
    });

    // Скрываем секцию оплаты при выборе существующей поставки
    setShowPaymentSection(false);
    
    toast({
      title: 'Поставка найдена',
      description: 'Выбрана поставка для приёмки',
      variant: 'default',
    });
  };

  // Обработчик изменения типа оплаты
  const handlePaymentTypeChange = (value: 'cash' | 'bank' | 'mixed') => {
    setPaymentData(prev => ({
      ...prev,
      paymentType: value,
      // Сбрасываем значения при смене типа оплаты
      price_cash: value === 'bank' ? '' : prev.price_cash,
      price_bank: value === 'cash' ? '' : prev.price_bank,
    }));
  };

  // Форматирование суммы для отображения
  const formatPrice = (value: string): string => {
    const numeric = value.replace(/\D/g, '');
    if (!numeric) return '';
    
    const number = parseInt(numeric, 10);
    return new Intl.NumberFormat('ru-RU').format(number);
  };

  // Обработчик ввода суммы
  const handlePriceChange = (field: 'price_cash' | 'price_bank', value: string) => {
    const formatted = formatPrice(value);
    setPaymentData(prev => ({
      ...prev,
      [field]: formatted
    }));
  };

  // Конвертация форматированной суммы обратно в число
  const parsePrice = (value: string): number => {
    const numeric = value.replace(/\s/g, '').replace('₸', '').trim();
    return numeric ? parseInt(numeric, 10) : 0;
  };

  // Создание новой поставки
  const handleCreateSupply = async (): Promise<Supply | null> => {
    try {
      // Если введены данные оплаты, статус будет 'delivered' (подтверждена)
      // Иначе 'pending' (ожидает подтверждения)
      const hasPaymentData = parsePrice(paymentData.price_cash) > 0 || parsePrice(paymentData.price_bank) > 0;
      const status = hasPaymentData ? 'delivered' : 'pending';

      const supplyData: AddSupplyForm = {
        supplier: supplierName,
        paymentType: paymentData.paymentType,
        price_cash: parsePrice(paymentData.price_cash).toString(),
        price_bank: parsePrice(paymentData.price_bank).toString(),
        bonus: formData.bonus,
        exchange: formData.exchange,
        delivery_date: today,
        comment: formData.comment,
        status: status,
        invoice_html: '',
      };

      const supply = await suppliesApi.createSupply(supplyData);
      console.log(supply.id)
      toast({
        title: `Поставка создана: ${supply.id}`,
        description: `Поставка создана на сегодня${hasPaymentData ? ' и сразу подтверждена' : ''}`,
        variant: 'default',
      });
      
      return supply;
    } catch (error) {
      toast({
        title: 'Ошибка создания поставки',
        description: 'Не удалось создать поставку',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Обновление существующей поставки (подтверждение)
  const handleUpdateSupply = async (supplyId: string) => {
    try {
      const updateData: Partial<AddSupplyForm> = {
        bonus: formData.bonus,
        exchange: formData.exchange,
        comment: formData.comment,
        status: 'confirmed',
      };

      await suppliesApi.updateSupply(supplyId, updateData);
      
      // Если есть новые изображения - загружаем их
      if (selectedImages.length > 0) {
        await suppliesApi.updateSupply(supplyId, { images: selectedImages });
      }

      return true;
    } catch (error) {
      console.error('Error updating supply:', error);
      throw error;
    }
  };

  // Создание нового поставщика (если не существует)
  const handleCreateSupplier = async (): Promise<boolean> => {
    if (!supplierName.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название поставщика',
        variant: 'destructive',
      });
      return false;
    }

    try {
      await suppliersApi.createSupplier({
        name: supplierName,
      });
      
      toast({
        title: 'Поставщик создан',
        description: 'Поставщик успешно создан',
        variant: 'default',
      });
      
      setSupplierExists(true);
      return true;
    } catch (error) {
      toast({
        title: 'Ошибка создания поставщика',
        description: 'Не удалось создать поставщика',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Обработчик изменения поставщика через SupplierSearchCombobox
  const handleSupplierChange = (value: string) => {
    setSupplierName(value);
    setSearchPerformed(false);
    // Сбрасываем найденную поставку при изменении поставщика
    if (foundSupply) {
      setFoundSupply(null);
      setSearchResults([]);
      setExistingImages([]);
      setFormData({
        bonus: 0,
        exchange: 0,
        comment: '',
      });
      setPaymentData({
        paymentType: 'cash',
        price_cash: '',
        price_bank: '',
      });
      setShowPaymentSection(false);
    }
  };

  // Основной обработчик подтверждения поставки
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supplierName.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Укажите поставщика',
        variant: 'destructive',
      });
      return;
    }

    // Проверяем, не находится ли уже поставка в статусе 'confirmed' или 'delivered'
    if (foundSupply && foundSupply.status !== 'pending') {
      toast({
        title: 'Поставка уже обработана',
        description: 'Эта поставка уже не может быть подтверждена',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      let supplyToConfirm: Supply | null = foundSupply;
      
      // Если поставка не найдена
      if (!foundSupply) {
        // Проверяем существование поставщика
        if (!supplierExists) {
          // Создаем нового поставщика
          const supplierCreated = await handleCreateSupplier();
          if (!supplierCreated) {
            setIsLoading(false);
            return;
          }
        }
        
        // Создаем новую поставку
        setCreatingSupply(true);
        const createdSupply = await handleCreateSupply();
        if (!createdSupply) {
          setIsLoading(false);
          setCreatingSupply(false);
          return;
        }
        supplyToConfirm = createdSupply;
        setCreatingSupply(false);
      } 
      await handleUpdateSupply(supplyToConfirm!.id);

      // Обновляем кэш запросов
      queryClient.invalidateQueries({ queryKey: ['supplies'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });

      const hasPaymentData = parsePrice(paymentData.price_cash) > 0 || parsePrice(paymentData.price_bank) > 0;
      
      toast({
        title: 'Поставка принята',
        description: hasPaymentData 
          ? 'Поставка успешно принята и сразу подтверждена' 
          : 'Поставка успешно принята',
        variant: 'default',
        className: 'bg-green-500 text-white',
      });

      // Вызываем callback успеха
      if (onSuccess) onSuccess();
      
      // Закрываем модальное окно
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось принять поставку',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setCreatingSupply(false);
    }
  };

  // Сброс выбора
  const handleReset = () => {
    setFoundSupply(null);
    setSearchResults([]);
    setSearchPerformed(false);
    setShowPaymentSection(false);
    setFormData({
      bonus: 0,
      exchange: 0,
      comment: '',
    });
    setPaymentData({
      paymentType: 'cash',
      price_cash: '',
      price_bank: '',
    });
    setSelectedImages([]);
    setExistingImages([]);
  };

  // Проверяем, заполнены ли данные об оплате
  const hasPaymentData = parsePrice(paymentData.price_cash) > 0 || parsePrice(paymentData.price_bank) > 0;

  // Определяем, когда показывать блок оплаты
  // Должен показываться когда: 
  // 1. Это десктоп (скрыто на мобилках)
  // 2. Не найдена поставка (!foundSupply)
  // 3. Не в процессе поиска (!isSearching)
  // 4. Поставщик введен и поиск выполнен (supplierName && searchPerformed)
  const shouldShowPaymentSection =!isSearching && supplierName && searchPerformed;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] md:max-w-2xl max-h-[90vh] p-0" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b">
          <DialogTitle className="text-lg md:text-xl font-semibold flex items-center gap-2 md:gap-3">
            <Package className="w-5 h-5 md:w-6 md:h-6" />
            Приёмка поставки
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-[calc(90vh-120px)] md:h-[calc(90vh-140px)]">
          <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 space-y-6">
            {/* Поиск поставщика */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Поставщик *
                </Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <SupplierSearchCombobox
                      value={supplierName}
                      onValueChange={handleSupplierChange}
                      placeholder="Введите название поставщика или выберите из списка..."
                      disabled={!!foundSupply || isLoading || creatingSupply}
                      autoFocus={open && !supplierName}
                    />
                  </div>
                  {!foundSupply && (
                    <Button
                      type="button"
                      onClick={handleSearchSupplies}
                      disabled={isSearching || isLoading || creatingSupply || !supplierName.trim()}
                      className="gap-2"
                      size="sm"
                    >
                      {isSearching ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      {isSearching ? 'Поиск...' : 'Найти'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Результаты поиска */}
              {searchResults.length > 0 && !foundSupply && (
                <div className="border rounded-lg p-3 space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Найдены поставки ({searchResults.length})
                  </Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {searchResults.map(supply => (
                      <div
                        key={supply.id}
                        className={`flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer ${
                          supply.status !== 'pending' ? 'opacity-60' : ''
                        }`}
                        onClick={() => supply.status === 'pending' && handleSelectSupply(supply)}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">{supply.supplier}</div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-600">
                           
                            
                            {supply.price_cash > 0 && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-green-600" />
                                <span className="font-medium">Наличные:</span>
                                <span className="text-green-700 font-medium">{formatCurrency(supply.price_cash)}</span>
                              </div>
                            )}
                            
                            {supply.price_bank > 0 && (
                              <div className="flex items-center gap-1">
                                <CreditCard className="w-3 h-3 text-blue-600" />
                                <span className="font-medium">Банк:</span>
                                <span className="text-blue-700 font-medium">{formatCurrency(supply.price_bank)}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Итого:</span>
                              <span className="font-bold">
                                {formatCurrency(supply.price_cash + supply.price_bank)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (supply.status === 'pending') {
                              handleSelectSupply(supply);
                            }
                          }}
                          disabled={supply.status !== 'pending'}
                          className="ml-2 flex-shrink-0"
                        >
                          {supply.status === 'pending' ? 'Выбрать' : 'Недоступно'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Статус найденной поставки */}
              {foundSupply && (
                <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <div className="font-medium text-green-800">Поставка найдена</div>
                      </div>
                      <div className="space-y-2 ml-6">
                        <div className="text-sm font-medium text-green-900">{foundSupply.supplier} - {foundSupply.price_cash} ₸</div>
                        
                        {/* Информация о цене найденной поставки */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                         
                          
                          {foundSupply.price_cash > 0 && (
                            <div className="bg-green-50 p-2 rounded border border-green-200">
                              <div className="text-xs text-green-600 mb-1">Наличные</div>
                              <div className="text-sm font-bold text-green-700">
                                {formatCurrency(foundSupply.price_cash)}
                              </div>
                            </div>
                          )}
                          
                          {foundSupply.price_bank > 0 && (
                            <div className="bg-blue-50 p-2 rounded border border-blue-200">
                              <div className="text-xs text-blue-600 mb-1">Банк</div>
                              <div className="text-sm font-bold text-blue-700">
                                {formatCurrency(foundSupply.price_bank)}
                              </div>
                            </div>
                          )}
                          
                          
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="text-red-600 hover:text-red-700 flex-shrink-0 ml-2"
                      disabled={isLoading || creatingSupply}
                    >
                      Изменить
                    </Button>
                  </div>
                  
                  {/* Предупреждение, если поставка уже не в статусе 'pending' */}
                  {foundSupply.status !== 'pending' && (
                    <div className="mt-3 p-2 border border-amber-200 rounded bg-amber-100">
                      <div className="flex items-center gap-2 text-amber-800 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>Эта поставка уже не может быть подтверждена</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Создание новой поставки */}
              {creatingSupply && (
                <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-blue-800 font-medium">Создание поставки...</span>
                  </div>
                </div>
              )}

              {/* Сообщение о необходимости создания поставки */}
              {!foundSupply && supplierExists && searchResults.length === 0 && !isSearching && (
                <div className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">
                      Поставок не найдено, можно создать новую
                    </span>
                  </div>
                </div>
              )}

              {/* Секция способа оплаты и суммы (только для десктопа и при создании новой поставки) */}
              <div className="hidden md:block">
                {shouldShowPaymentSection && (
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPaymentSection(!showPaymentSection)}
                      className="w-full justify-between"
                      size="sm"
                    >
                      <span className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Способ оплаты и сумма (опционально)
                        {hasPaymentData && (
                          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                            Заполнено
                          </Badge>
                        )}
                      </span>
                      {showPaymentSection ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>

                    {showPaymentSection && (
                      <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Способ оплаты</Label>
                            <Select 
                              value={paymentData.paymentType} 
                              onValueChange={handlePaymentTypeChange}
                              disabled={isLoading || creatingSupply}
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

                          {paymentData.paymentType === 'cash' && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Сумма наличными</Label>
                              <div className="relative">
                                <Input
                                  type="text"
                                  placeholder="0 ₸"
                                  value={paymentData.price_cash}
                                  onChange={(e) => handlePriceChange('price_cash', e.target.value)}
                                  disabled={isLoading || creatingSupply}
                                  className="pr-10"
                                />
                                {paymentData.price_cash && (
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    ₸
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {paymentData.paymentType === 'bank' && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Сумма банковской картой</Label>
                              <div className="relative">
                                <Input
                                  type="text"
                                  placeholder="0 ₸"
                                  value={paymentData.price_bank}
                                  onChange={(e) => handlePriceChange('price_bank', e.target.value)}
                                  disabled={isLoading || creatingSupply}
                                  className="pr-10"
                                />
                                {paymentData.price_bank && (
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    ₸
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {paymentData.paymentType === 'mixed' && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Наличные</Label>
                                <div className="relative">
                                  <Input
                                    type="text"
                                    placeholder="0 ₸"
                                    value={paymentData.price_cash}
                                    onChange={(e) => handlePriceChange('price_cash', e.target.value)}
                                    disabled={isLoading || creatingSupply}
                                    className="pr-10"
                                  />
                                  {paymentData.price_cash && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                      ₸
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Банк</Label>
                                <div className="relative">
                                  <Input
                                    type="text"
                                    placeholder="0 ₸"
                                    value={paymentData.price_bank}
                                    onChange={(e) => handlePriceChange('price_bank', e.target.value)}
                                    disabled={isLoading || creatingSupply}
                                    className="pr-10"
                                  />
                                  {paymentData.price_bank && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                      ₸
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="text-xs text-gray-500 pt-2 border-t">
                            <Info className="w-3 h-3 inline mr-1" />
                            Если заполнены данные об оплате, поставка будет сразу подтверждена
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Основная форма для ввода данных */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="0"
                    disabled={isLoading || creatingSupply}
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
                    placeholder="0"
                    disabled={isLoading || creatingSupply}
                  />
                </div>
              </div>

              {/* Комментарий */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Комментарий к приёмке
                </Label>
                <Textarea
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Введите комментарий к приёмке..."
                  rows={3}
                  disabled={isLoading || creatingSupply}
                  className="resize-none"
                />
              </div>

              {/* Документы */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FileImage className="w-4 h-4" />
                  Документы приёмки
                </Label>
                
                {/* Существующие изображения */}
                {existingImages.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      Загружено ранее: {existingImages.length} изображений
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {existingImages.map((image, index) => (
                        <div key={image.id} className="relative">
                          <img
                            src={image.image}
                            alt={`Документ ${index + 1}`}
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

                {/* Загрузка новых изображений */}
                <ImageUpload
                  selectedFiles={selectedImages}
                  onFilesChange={setSelectedImages}
                  disabled={isLoading || creatingSupply}
                  isToday={true}
                  maxFiles={10}
                  maxSizeMB={5}
                />
              </div>
            </div>
          </div>

          {/* Футер с кнопками */}
          <div className="px-4 md:px-6 py-3 md:py-4 border-t bg-white flex-shrink-0">
            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-3 md:gap-0">
              <div className="w-full md:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading || creatingSupply}
                  className="gap-2 w-full md:w-auto"
                  size="sm"
                >
                  Отмена
                </Button>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  type="submit"
                  disabled={
                    isLoading || 
                    creatingSupply || 
                    !supplierName.trim() || 
                    (foundSupply && foundSupply.status !== 'pending') ||
                    (!foundSupply && !searchPerformed)
                  }
                  className="flex-1 md:flex-none gap-2 bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Обработка...
                    </>
                  ) : creatingSupply ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {foundSupply ? 'Принять поставку' : 'Создать и принять'}
                      {hasPaymentData && (
                        <Badge variant="secondary" className="ml-2 bg-white text-green-600">
                          С оплатой
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};