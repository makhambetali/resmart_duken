// @/components/SupplyAcceptanceModal.tsx
import React, { useState, useEffect } from 'react';
import { Supply, AddSupplyForm } from '@/types/supply';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2,
  Package,
  Building,
  CheckCircle,
  FileImage,
  MessageSquare,
  Search
} from "lucide-react";
import { ImageUpload } from '@/components/ImageUpload';
import { suppliesApi, suppliersApi } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { capitalize } from '@/lib/utils';

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

export const SupplyAcceptanceModal: React.FC<SupplyAcceptanceModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const [supplierName, setSupplierName] = useState('');
  const [foundSupply, setFoundSupply] = useState<Supply | null>(null);
  const [searchResults, setSearchResults] = useState<Supply[]>([]);
  const [supplierExists, setSupplierExists] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    bonus: 0,
    exchange: 0,
    comment: '',
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
      setFormData({
        bonus: 0,
        exchange: 0,
        comment: '',
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

  // Поиск неподтвержденных поставок по названию поставщика
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
      
      // Фильтруем поставки: на сегодня, не подтвержденные, и с указанным поставщиком
      const todayUnconfirmedSupplies = supplies.filter(supply => 
        supply.delivery_date === today && 
        !supply.is_confirmed &&
        supply.supplier.toLowerCase().includes(supplierName.toLowerCase())
      );

      setSearchResults(todayUnconfirmedSupplies);

      if (todayUnconfirmedSupplies.length === 0) {
        if (exists) {
          toast({
            title: 'Поставки не найдены',
            description: `У поставщика "${supplierName}" нет неподтвержденных поставок на сегодня`,
            variant: 'default',
          });
        } else {
          toast({
            title: 'Поставщик не найден',
            description: `Поставщик "${supplierName}" не существует`,
            variant: 'destructive',
          });
        }
      } else if (todayUnconfirmedSupplies.length === 1) {
        // Если найдена одна неподтвержденная поставка - автоматически выбираем её
        handleSelectSupply(todayUnconfirmedSupplies[0]);
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
    
    toast({
      title: 'Поставка найдена',
      description: `Выбрана неподтвержденная поставка от ${supply.supplier}`,
      variant: 'default',
    });
  };

  // Создание новой поставки
  const handleCreateSupply = async (): Promise<Supply | null> => {
    try {
      const supplyData: AddSupplyForm = {
        supplier: supplierName,
        paymentType: 'cash',
        price_cash: '0',
        price_bank: '0',
        bonus: formData.bonus,
        exchange: formData.exchange,
        delivery_date: today,
        comment: formData.comment,
        is_confirmed: false, // Сначала создаем как неподтвержденную
        invoice_html: '',
      };

      const supply = await suppliesApi.createSupply(supplyData);
      
      toast({
        title: 'Поставка создана',
        description: `Поставка от ${supplierName} создана на сегодня`,
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
        is_confirmed: true, // Подтверждаем поставку
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
        description: `Поставщик "${supplierName}" успешно создан`,
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
      
      // Подтверждаем поставку (обновляем с is_confirmed: true)
      if (supplyToConfirm) {
        await handleUpdateSupply(supplyToConfirm.id);
      }

      // Обновляем кэш запросов
      queryClient.invalidateQueries({ queryKey: ['supplies'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });

      toast({
        title: 'Поставка подтверждена',
        description: 'Поставка успешно подтверждена и принята',
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
        description: 'Не удалось подтвердить поставку',
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
    setFormData({
      bonus: 0,
      exchange: 0,
      comment: '',
    });
    setSelectedImages([]);
    setExistingImages([]);
  };

  // Обработчик Enter для поиска
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !foundSupply) {
      e.preventDefault();
      handleSearchSupplies();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] md:max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b">
          <DialogTitle className="text-lg md:text-xl font-semibold flex items-center gap-2 md:gap-3">
            <Package className="w-5 h-5 md:w-6 md:h-6" />
            Приёмка поставки
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Подтверждение поставки на сегодня ({today}). Работает только с неподтвержденными поставками.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-[calc(90vh-120px)] md:h-[calc(90vh-140px)]">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* Поиск поставщика */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Поставщик *
                </Label>
                <div className="flex gap-2">
                 <Input
  value={supplierName}
  onChange={(e) => setSupplierName(capitalize(e.target.value))}
  onKeyDown={handleKeyPress}
  placeholder="Введите название поставщика..."
  className="flex-1"
  disabled={!!foundSupply || isLoading || creatingSupply}
  autoFocus
/>
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

              {/* Информация о поставщике */}
              {supplierName && !foundSupply && !isSearching && (
                <div className={`p-3 border rounded-lg ${supplierExists ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="text-sm">
                    <span className="font-medium">Поставщик:</span> {supplierName}
                    <br />
                    <span className="font-medium">Статус:</span> {supplierExists ? 'Существует' : 'Не существует'}
                  </div>
                </div>
              )}

              {/* Результаты поиска */}
              {searchResults.length > 0 && !foundSupply && (
                <div className="border rounded-lg p-3 space-y-2">
                  <Label className="text-sm font-medium">Найдены неподтвержденные поставки:</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {searchResults.map(supply => (
                      <div
                        key={supply.id}
                        className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelectSupply(supply)}
                      >
                        <div>
                          <div className="font-medium">{supply.supplier}</div>
                          <div className="text-sm text-gray-500">
                            Бонус: {supply.bonus || 0}, Обмен: {supply.exchange || 0}
                            {supply.comment && `, Комментарий: ${supply.comment}`}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSupply(supply);
                          }}
                        >
                          Выбрать
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Сообщение о найденной поставке */}
              {foundSupply && (
                <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-green-800">Выбрана поставка для подтверждения:</div>
                      <div className="text-sm text-green-700">
                        {foundSupply.supplier} - 
                        Бонус: {foundSupply.bonus || 0}, Обмен: {foundSupply.exchange || 0}
                        {foundSupply.comment && `, ${foundSupply.comment}`}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="text-red-600 hover:text-red-700"
                      disabled={isLoading || creatingSupply}
                    >
                      Изменить
                    </Button>
                  </div>
                </div>
              )}

              {/* Создание новой поставки */}
              {creatingSupply && (
                <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="font-medium text-blue-800 mb-2">Создание новой поставки</div>
                  <div className="text-sm text-blue-700 mb-3">
                    Создаём новую поставку от "{supplierName}" на сегодня...
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Создание поставки...</span>
                  </div>
                </div>
              )}

              {/* Сообщение о необходимости создания поставки */}
              {!foundSupply && supplierExists && searchResults.length === 0 && !isSearching && (
                <div className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                  <div className="font-medium text-amber-800">Неподтвержденных поставок не найдено</div>
                  <div className="text-sm text-amber-700 mt-1">
                    У поставщика "{supplierName}" нет неподтвержденных поставок на сегодня.
                    Вы можете создать новую поставку и сразу её подтвердить.
                  </div>
                </div>
              )}
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
                  disabled={isLoading || creatingSupply || !supplierName.trim()}
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
                      {foundSupply ? 'Подтвердить поставку' : 'Создать и подтвердить'}
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