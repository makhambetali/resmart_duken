// @/components/SupplyModal.tsx - добавьте эти изменения
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
  Download
} from "lucide-react";
import { formatPrice, getNumericValue } from '@/lib/utils';
import { EditableInvoiceTable } from '@/components/EditableInvoiceTable';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ImageUpload } from '@/components/ImageUpload';
import { AITableExtractor } from '@/components/AITableExtractor';
import { ImageViewer } from '@/components/ImageViewer';

interface SupplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleDeleteSupply: (id: string) => void;
  supply?: Supply | null;
  onSubmit: (data: Omit<AddSupplyForm, 'images'> & { images?: File[] }) => Promise<void>;
  suppliers: Array<{ id: string; name: string }>;
}

interface SupplyImage {
  id: number;
  image: string;
}

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
    price_cash: '0',
    price_bank: '0',
    bonus: 0,
    exchange: 0,
    delivery_date: new Date().toLocaleDateString('en-CA'),
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

  const today = new Date().toLocaleDateString('en-CA');
  const plus7 = new Date(Date.now() + 7 * 864e5).toLocaleDateString('en-CA');
  const isToday = formData.delivery_date === today;

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

      setFormData({
        supplier: supply.supplier,
        paymentType,
        price_cash: formatPrice(supply.price_cash.toString()),
        price_bank: formatPrice(supply.price_bank.toString()),
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
        supplier: '', paymentType: 'cash', price_cash: '0',
        price_bank: '0', bonus: 0, exchange: 0,
        delivery_date: today,
        comment: '', is_confirmed: false, invoice_html: '',
      });
      setSelectedImages([]);
      setSupplyImages([]);
      setCurrentHtmlForTable('');
      setCreatedAt('');
      setIsRescheduled(false);
    }
  }, [supply, open, today]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        price_cash: getNumericValue(formData.price_cash),
        price_bank: getNumericValue(formData.price_bank),
        invoice_html: formData.invoice_html,
        images: selectedImages.length > 0 ? selectedImages : undefined,
      };
      
      console.log(selectedImages);
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
    id: -(index + 1), // Отрицательные ID для новых файлов
    image: URL.createObjectURL(file),
  }))];

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-screen h-screen max-w-2xl max-h-[700px] rounded-none border-none overflow-y-auto">
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
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentType">Тип оплаты</Label>
                <Select value={formData.paymentType} onValueChange={(value: 'cash' | 'bank' | 'mixed') => 
                  setFormData(prev => ({ ...prev, paymentType: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Наличные</SelectItem>
                    <SelectItem value="bank">Банк</SelectItem>
                    <SelectItem value="mixed">Смешанная</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cashAmount">Сумма наличными (₸)</Label>
                <Input 
                  id="cashAmount" 
                  type="text"
                  inputMode="numeric" 
                  placeholder="0" 
                  value={formData.price_cash} 
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setFormData(prev => ({ ...prev, price_cash: formatPrice(numericValue) }));
                  }} 
                  disabled={formData.paymentType === 'bank'} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankAmount">Сумма банком (₸)</Label>
                <Input 
                  id="bankAmount" 
                  type="text"
                  inputMode="numeric" 
                  placeholder="0" 
                  value={formData.price_bank} 
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setFormData(prev => ({ ...prev, price_bank: formatPrice(numericValue) }));
                  }} 
                  disabled={formData.paymentType === 'cash'} 
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bonus">Бонус</Label>
                    <Input 
                      id="bonus" 
                      type="number" 
                      max="999"
                      inputMode="numeric" 
                      value={formData.bonus} 
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        bonus: Number(e.target.value.replace(/\D/g, '').slice(0, 3)) || 0 
                      }))} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="exchange">Обмен</Label>
                    <Input 
                      id="exchange" 
                      type="number" 
                      max="999" 
                      inputMode="numeric"
                      value={formData.exchange} 
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        exchange: Number(e.target.value.replace(/\D/g, '').slice(0, 3)) || 0 
                      }))} 
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="deliveryDate">Дата поставки</Label>
                    <Input 
                      id="deliveryDate" 
                      type="date" 
                      min={today} 
                      max={plus7} 
                      value={formData.delivery_date} 
                      onChange={(e) => setFormData(prev => ({ ...prev, delivery_date: e.target.value }))} 
                    />
                  </div>
                </div>
                {!isToday && (
                  <p className="text-sm text-amber-600 mt-2">
                    ⚠️ Подтверждение и загрузка документов доступны только для сегодняшней даты.
                  </p>
                )}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="comment">Комментарий</Label>
                <Textarea 
                  id="comment" 
                  value={formData.comment} 
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))} 
                  rows={3} 
                />
              </div>

              {/* Блок загрузки и просмотра изображений */}
              <div className="space-y-4 md:col-span-2">
                <div className="flex justify-between items-center">
                  <Label>Изображения документов</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsPreviewModalOpen(true)}
                    disabled={!hasPreviewContent}
                    className="gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    Редактировать таблицу
                    {tableHasChanges && <span className="ml-1 text-green-600 font-bold">*</span>}
                  </Button>
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
                          
                          {/* Кнопки управления */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="icon"
                                  className="h-7 w-7 bg-white/90 hover:bg-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadImage(image.image, image.id);
                                  }}
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Скачать</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="icon"
                                  className="h-7 w-7 bg-white/90 hover:bg-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteImage(image.id);
                                  }}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Удалить</TooltipContent>
                            </Tooltip>
                          </div>
                          
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
                {selectedImages.length > 0 && (
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

              <div className="flex items-center space-x-2 md:col-span-2">
                <Checkbox 
                  id="isConfirmed" 
                  checked={formData.is_confirmed} 
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_confirmed: Boolean(checked) }))} 
                  disabled={!isToday} 
                />
                <Label htmlFor="isConfirmed" className={!isToday ? 'text-muted-foreground' : ''}>
                  Подтверждена
                </Label>
              </div>
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
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Удалить
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || !formData.supplier}
                >
                  {isLoading ? 'Сохранение...' : (supply ? 'Обновить' : 'Добавить')}
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