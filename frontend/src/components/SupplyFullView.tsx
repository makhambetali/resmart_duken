// @/components/SupplyFullView/SupplyFullView.tsx
import React, { useState, useEffect } from 'react';
import { Supply } from '@/types/supply';
import { Button } from '@/components/ui/button';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Calendar, 
  CreditCard, 
  Banknote, 
  Gift, 
  RefreshCw, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface SupplyFullViewProps {
  supply: Supply;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
  } catch {
    return dateString;
  }
};

const formatDateTime = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru });
  } catch {
    return dateString;
  }
};

export const SupplyFullView: React.FC<SupplyFullViewProps> = ({
  supply,
  open,
  onOpenChange,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<Array<{ id: number; image: string }>>([]);

  useEffect(() => {
    if (supply && (supply as any).images) {
      setImages((supply as any).images || []);
    } else {
      setImages([]);
    }
    setCurrentImageIndex(0);
  }, [supply]);

  useEffect(() => {
    if (!open) {
      setCurrentImageIndex(0);
    }
  }, [open]);

  // Навигация с клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNextImage();
          break;
        case 'Escape':
          onOpenChange(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, images.length, currentImageIndex]);

  const handlePrevImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const handleDownloadImage = async (imageUrl: string, imageId: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `supply-${supply.id}-image-${imageId}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (!open || !supply) return null;

  const paymentType = 
    supply.price_cash > 0 && supply.price_bank > 0 ? 'Смешанная' :
    supply.price_bank > 0 ? 'Банк' : 'Наличные';

  const totalAmount = supply.price_cash + supply.price_bank;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Поставка: {supply.supplier}
            </h2>
            <p className="text-sm text-gray-500">
              {formatDate(supply.delivery_date)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          className="h-10 w-10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Images */}
        <div className="lg:w-1/2 flex flex-col border-r">
          {images.length > 0 ? (
            <>
              {/* Main Image */}
              <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 relative">
                <div className="max-w-full max-h-full flex items-center justify-center">
                  <img
                    src={images[currentImageIndex]?.image}
                    alt={`Изображение ${currentImageIndex + 1}`}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>

                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 hover:bg-white"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 hover:bg-white"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex-shrink-0 h-24 border-t bg-white p-2 overflow-x-auto">
                  <div className="flex gap-2 h-full">
                    {images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 h-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-blue-500' : 'border-transparent'}`}
                      >
                        <img
                          src={image.image}
                          alt={`Миниатюра ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === currentImageIndex && (
                          <div className="absolute inset-0 bg-blue-500/20" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Actions */}
              <div className="flex-shrink-0 border-t p-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ImageIcon className="h-4 w-4" />
                    <span>{images.length} изображений</span>
                  </div>
                  
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
              <ImageIcon className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium">Нет изображений</p>
              <p className="text-gray-400 text-sm mt-2 text-center">
                Для этой поставки не загружены фотографии документов
              </p>
            </div>
          )}
        </div>

        {/* Right Panel - Supply Details */}
        <div className="lg:w-1/2 flex flex-col overflow-y-auto">
          {/* Supply Information */}
          <div className="flex-1 p-6 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${supply.is_confirmed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                {supply.is_confirmed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {supply.is_confirmed ? 'Подтверждена' : 'Не подтверждена'}
                </span>
              </div>
              
              {(supply as any).rescheduled_cnt > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="text-sm">Перенесена {(supply as any).rescheduled_cnt} раз</span>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Финансовая информация
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Banknote className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Тип оплаты</span>
                  </div>
                  <div className="text-xl font-bold text-blue-700">{paymentType}</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Общая сумма</span>
                  </div>
                  <div className="text-xl font-bold text-green-700">{formatCurrency(totalAmount)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {supply.price_cash > 0 && (
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Наличные</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(supply.price_cash)}
                    </div>
                  </div>
                )}
                
                {supply.price_bank > 0 && (
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Банк</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(supply.price_bank)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bonus & Exchange */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Дополнительно</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {supply.bonus > 0 && (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Gift className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-gray-600">Бонус</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-700">{supply.bonus}</div>
                  </div>
                )}
                
                {supply.exchange > 0 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <RefreshCw className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-gray-600">Обмен</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-700">{supply.exchange}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Даты</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Дата поставки</span>
                  <span className="font-medium">{formatDate(supply.delivery_date)}</span>
                </div>
                
                {supply.date_added && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Дата создания</span>
                    <span className="font-medium">{formatDateTime(supply.date_added)}</span>
                  </div>
                )}
                
                {supply.arrival_date && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Дата прибытия</span>
                    <span className="font-medium">{formatDateTime(supply.arrival_date)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            {supply.comment && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                  Комментарий
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{supply.comment}</p>
                </div>
              </div>
            )}

            {/* Invoice HTML */}
            {supply.invoice_html && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Накладная
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <div 
                    className="invoice-preview max-h-60 overflow-y-auto p-4"
                    dangerouslySetInnerHTML={{ __html: supply.invoice_html }}
                  />
                  <style>{`
                    .invoice-preview table {
                      width: 100%;
                      border-collapse: collapse;
                      font-size: 12px;
                    }
                    .invoice-preview th,
                    .invoice-preview td {
                      border: 1px solid #e2e8f0;
                      padding: 4px 8px;
                      text-align: left;
                    }
                    .invoice-preview th {
                      background-color: #f8fafc;
                      font-weight: 600;
                    }
                  `}</style>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 border-t p-4 bg-white">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                ID поставки: {supply.id}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Закрыть
                </Button>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
