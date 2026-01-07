// [file name]: SupplyFullView.tsx
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
  Image as ImageIcon,
  Clock,
  CheckCheck,
  Hourglass
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

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
      return <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />;
    case 'confirmed':
      return <Hourglass className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />;
    case 'delivered':
      return <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />;
    default:
      return <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
  }
};

// Функция для получения цвета статуса
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    case 'confirmed':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800';
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

  if (!open || !supply) return null;

  const paymentType = 
    supply.price_cash > 0 && supply.price_bank > 0 ? 'Смешанная' :
    supply.price_bank > 0 ? 'Банк' : 'Наличные';

  const totalAmount = supply.price_cash + supply.price_bank;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b bg-white">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="hidden sm:block p-2 bg-blue-50 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              Поставка: {supply.supplier}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              {formatDate(supply.delivery_date)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 ml-2"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Images Section - Full width on mobile */}
        {images.length > 0 && (
          <div className="lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r">
            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-2 sm:p-4 relative min-h-[300px] sm:min-h-[400px]">
              <div className="max-w-full max-h-full flex items-center justify-center">
                <img
                  src={images[currentImageIndex]?.image}
                  alt={`Изображение ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain"
                />
              </div>

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-white/80 hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-white/80 hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails - Hidden on small mobile */}
            {images.length > 1 && (
              <div className="hidden sm:block flex-shrink-0 h-24 border-t bg-white p-2 overflow-x-auto">
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

            {/* Image Counter for mobile */}
            {images.length > 1 && (
              <div className="sm:hidden flex justify-center items-center py-2 border-t bg-white">
                <div className="flex gap-1">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Supply Details - Full width on mobile if no images */}
        <div className={`${images.length > 0 ? 'lg:w-1/2' : 'w-full'} flex flex-col overflow-y-auto`}>
          {/* Supply Information */}
          <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Status Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                Статус поставки
              </h3>
              
              <div className="space-y-3">
                {/* Основной бейдж статуса */}
                <div className={`flex items-center justify-between gap-2 p-3 sm:p-4 rounded-lg border ${getStatusColor(supply.status)}`}>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(supply.status)}
                    <div>
                      <div className="font-semibold text-sm sm:text-base">
                        {getStatusText(supply.status)}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {supply.status === 'pending' && 'Поставка создана, ожидает подтверждения'}
                        {supply.status === 'confirmed' && 'Поставка принята, ожидает оплаты'}
                        {supply.status === 'delivered' && 'Поставка оплачена и завершена'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Дата изменения статуса */}
                  {supply.arrival_date && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Изменён:</div>
                      <div className="text-xs font-medium">{formatDateTime(supply.arrival_date)}</div>
                    </div>
                  )}
                </div>

                {/* Бейдж переносов */}
                {(supply as any).rescheduled_cnt > 0 && (
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                    <RefreshCw className="h-3 w-3" />
                    <span className="text-xs">Перенесена {(supply as any).rescheduled_cnt} раз</span>
                  </Badge>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                Финансовая информация
              </h3>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Banknote className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                    <span className="text-xs sm:text-sm text-gray-600">Тип оплаты</span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-blue-700">{paymentType}</div>
                </div>
                
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                    <span className="text-xs sm:text-sm text-gray-600">Общая сумма</span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-green-700">{formatCurrency(totalAmount)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {supply.price_cash > 0 && (
                  <div className="border rounded-lg p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Наличные</div>
                    <div className="text-base sm:text-lg font-semibold text-gray-900">
                      {formatCurrency(supply.price_cash)}
                    </div>
                  </div>
                )}
                
                {supply.price_bank > 0 && (
                  <div className="border rounded-lg p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Банк</div>
                    <div className="text-base sm:text-lg font-semibold text-gray-900">
                      {formatCurrency(supply.price_bank)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bonus & Exchange */}
            {(supply.bonus > 0 || supply.exchange > 0) && (
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Дополнительно</h3>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {supply.bonus > 0 && (
                    <div className="bg-amber-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Gift className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                        <span className="text-xs sm:text-sm text-gray-600">Бонус</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-amber-700">{supply.bonus}</div>
                    </div>
                  )}
                  
                  {supply.exchange > 0 && (
                    <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                        <span className="text-xs sm:text-sm text-gray-600">Обмен</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-purple-700">{supply.exchange}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Даты</h3>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Дата поставки</span>
                  <span className="text-sm font-medium">{formatDate(supply.delivery_date)}</span>
                </div>
                
                {supply.date_added && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Дата создания</span>
                    <span className="text-sm font-medium">{formatDateTime(supply.date_added)}</span>
                  </div>
                )}
                
                {supply.arrival_date && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Дата изменения статуса</span>
                    <span className="text-sm font-medium">{formatDateTime(supply.arrival_date)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            {supply.comment && (
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  Комментарий
                </h3>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{supply.comment}</p>
                </div>
              </div>
            )}

            {/* Invoice HTML */}
            {supply.invoice_html && (
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  Накладная
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <div 
                    className="invoice-preview max-h-48 sm:max-h-60 overflow-y-auto p-3 sm:p-4 text-xs sm:text-sm"
                    dangerouslySetInnerHTML={{ __html: supply.invoice_html }}
                  />
                  <style>{`
                    .invoice-preview table {
                      width: 100%;
                      border-collapse: collapse;
                      font-size: 11px;
                    }
                    @media (min-width: 640px) {
                      .invoice-preview table {
                        font-size: 12px;
                      }
                    }
                    .invoice-preview th,
                    .invoice-preview td {
                      border: 1px solid #e2e8f0;
                      padding: 3px 6px;
                      text-align: left;
                    }
                    @media (min-width: 640px) {
                      .invoice-preview th,
                      .invoice-preview td {
                        padding: 4px 8px;
                      }
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
          <div className="flex-shrink-0 border-t p-3 sm:p-4 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-xs sm:text-sm text-gray-500">
                ID поставки: {supply.id}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 sm:flex-none"
                  size="sm"
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