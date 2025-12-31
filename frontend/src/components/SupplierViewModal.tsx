import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { suppliersApi } from '@/lib/api';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Package, 
  BarChart3, 
  Loader2,
  Edit,
  Phone,
  User,
  Truck,
  Calendar,
  FileText,
  Info,
  ShieldCheck,
  CalendarDays,
  Hash,
  Target,
  Zap,
  Timer
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SupplierViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: any | null;
  onEdit: () => void;
}

const COEFFICIENT_CONFIG = {
  green: { min: 0, max: 0.4, color: 'bg-green-500', textColor: 'text-green-700', label: 'Хорошо' },
  yellow: { min: 0.5, max: 1, color: 'bg-yellow-500', textColor: 'text-yellow-700', label: 'Средне' },
  red: { min: 1.1, max: Infinity, color: 'bg-red-500', textColor: 'text-red-700', label: 'Плохо' },
};

const PREDICTION_COLORS = {
  high: { 
    bg: 'bg-emerald-500', 
    text: 'text-emerald-700', 
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-200',
    label: 'Высокая'
  },
  medium: { 
    bg: 'bg-amber-500', 
    text: 'text-amber-700', 
    bgLight: 'bg-amber-50',
    border: 'border-amber-200',
    label: 'Средняя'
  },
  low: { 
    bg: 'bg-rose-500', 
    text: 'text-rose-700', 
    bgLight: 'bg-rose-50',
    border: 'border-rose-200',
    label: 'Низкая'
  }
};

const getPredictionColor = (probability: number) => {
  if (probability >= 70) return PREDICTION_COLORS.high;
  if (probability >= 30) return PREDICTION_COLORS.medium;
  return PREDICTION_COLORS.low;
};

const InfoRow = ({ icon: Icon, label, value, className = '' }: {
  icon: React.ElementType;
  label: string;
  value: string | null;
  className?: string;
}) => (
  <div className={`flex items-start gap-3 py-2 ${className}`}>
    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
      <Icon className="h-4 w-4 text-gray-600" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
      <div className="text-sm text-gray-900 font-medium break-words whitespace-normal">
        {value || <span className="text-gray-400 italic">Не указано</span>}
      </div>
    </div>
  </div>
);

const PredictionDisplay = ({ prediction }: { prediction: any[] }) => {
  const sortedPrediction = [...prediction].sort((a, b) => b.probability - a.probability);

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-md bg-indigo-100">
            <Target className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <h4 className="font-medium text-sm">Прогноз времени прибытия</h4>
        </div>

        <div className="space-y-3">
          {sortedPrediction.map((item, index) => {
            const color = getPredictionColor(item.probability);
            const width = `${Math.min(item.probability, 100)}%`;
            
            return (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${color.bg}`} />
                    <span className="text-sm font-medium">{item.interval}</span>
                  </div>
                  <span className={cn("font-bold text-sm", color.text)}>
                    {item.probability.toFixed(1)}%
                  </span>
                </div>
                
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      color.bg
                    )}
                    style={{ width }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <Badge 
                    variant="outline" 
                    className={cn("px-2 py-0.5 text-xs", color.border)}
                  >
                    {color.label} вероятность
                  </Badge>
                  <span>100%</span>
                </div>
              </div>
            );
          })}
        </div>

        {sortedPrediction.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-3.5 w-3.5 text-amber-600" />
              <h5 className="text-xs font-medium text-gray-700">Рекомендация:</h5>
            </div>
            <p className="text-xs text-gray-600">
              {sortedPrediction[0].probability >= 70 
                ? `Наиболее вероятное время прибытия: ${sortedPrediction[0].interval}. Можно планировать точно.`
                : `Рекомендуется учитывать несколько временных интервалов. Основное время: ${sortedPrediction[0].interval}`
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SupplierStatsDisplay = ({ stats, isLoading }: { stats: any | null; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-3" />
        <span className="text-sm text-gray-500">Загрузка статистики...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center p-8">
        <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">Нет данных по поставкам</p>
        <p className="text-xs text-gray-400 mt-1">Статистика появится после выполнения поставок</p>
      </div>
    );
  }

  const getCoefficientColor = (value: number) => {
    if (value <= COEFFICIENT_CONFIG.green.max) {
      return COEFFICIENT_CONFIG.green;
    } else if (value <= COEFFICIENT_CONFIG.yellow.max) {
      return COEFFICIENT_CONFIG.yellow;
    } else {
      return COEFFICIENT_CONFIG.red;
    }
  };

  const coeffColor = getCoefficientColor(stats.price?.rescheduled_coef || 0);
  const coeffPercentage = Math.min((stats.price?.rescheduled_coef || 0) * 50, 100);

  const hasPriceData = stats.price && stats.price.count > 0;
  const hasArrivalTimeData = stats.arrival_time && stats.arrival_time.avg !== '00:00';
  const hasPrediction = stats.arrival_prediction && stats.arrival_prediction.length > 0;

  return (
    <div className="space-y-6">
      {/* Основные метрики */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-600 font-medium">Всего поставок</div>
                <div className="text-2xl font-bold text-gray-900">{stats.price?.count || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-gray-600 font-medium">Коэффициент переносов</div>
                <div className="text-2xl font-bold mt-1" style={{ color: coeffColor.textColor }}>
                  {(stats.price?.rescheduled_coef || 0).toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Прогноз времени прибытия */}
      {hasPrediction && (
        <PredictionDisplay prediction={stats.arrival_prediction} />
      )}

      {/* Прогресс-бар коэффициента */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Стабильность поставок</span>
              </div>
              <Badge 
                variant="outline" 
                className={`font-semibold ${coeffColor.textColor}`}
                style={{ 
                  borderColor: coeffColor.textColor.replace('text-', ''),
                  color: coeffColor.textColor 
                }}
              >
                {coeffColor.label}
              </Badge>
            </div>
            <Progress value={coeffPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>0 (идеально)</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-red-500" />
                <span>2+ (критично)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Статистика цен */}
      {hasPriceData && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-md bg-green-100">
                <DollarSign className="h-3.5 w-3.5 text-green-600" />
              </div>
              <h4 className="font-medium text-sm">Статистика по ценам</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 p-2 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500 font-medium">Средняя цена</div>
                <div className="font-bold text-gray-900">{(stats.price.avg || 0).toFixed(2)} ₸</div>
              </div>
              <div className="space-y-1 p-2 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500 font-medium">Медиана</div>
                <div className="font-bold text-gray-900">{(stats.price.med || 0).toFixed(2)} ₸</div>
              </div>
              <div className="space-y-1 p-2 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500 font-medium">Минимальная</div>
                <div className="font-bold text-gray-900">{(stats.price.min || 0).toFixed(2)} ₸</div>
              </div>
              <div className="space-y-1 p-2 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500 font-medium">Максимальная</div>
                <div className="font-bold text-gray-900">{(stats.price.max || 0).toFixed(2)} ₸</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Время прибытия */}
      {hasArrivalTimeData && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-md bg-blue-100">
                <Clock className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <h4 className="font-medium text-sm">Историческое время прибытия</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 p-2 rounded-lg bg-blue-50/50">
                <div className="text-xs text-gray-500 font-medium">Среднее время</div>
                <div className="font-bold text-gray-900 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {stats.arrival_time.avg}
                </div>
              </div>
              <div className="space-y-1 p-2 rounded-lg bg-blue-50/50">
                <div className="text-xs text-gray-500 font-medium">Медиана</div>
                <div className="font-bold text-gray-900 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {stats.arrival_time.med}
                </div>
              </div>
              <div className="space-y-1 p-2 rounded-lg bg-blue-50/50">
                <div className="text-xs text-gray-500 font-medium">Самое раннее</div>
                <div className="font-bold text-gray-900 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {stats.arrival_time.min}
                </div>
              </div>
              <div className="space-y-1 p-2 rounded-lg bg-blue-50/50">
                <div className="text-xs text-gray-500 font-medium">Самое позднее</div>
                <div className="font-bold text-gray-900 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {stats.arrival_time.max}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const SupplierViewModal: React.FC<SupplierViewModalProps> = ({ 
  open, 
  onOpenChange, 
  supplier, 
  onEdit 
}) => {
  const [stats, setStats] = useState<any | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (supplier && open) {
      fetchSupplierStats(supplier.id);
    } else {
      setStats(null);
      setActiveTab('info');
    }
  }, [supplier, open]);

  const fetchSupplierStats = async (supplierId: string | number) => {
    setIsLoadingStats(true);
    try {
      const data = await suppliersApi.getSupplierStats(String(supplierId));
      setStats(data);
    } catch (error) {
      console.error('Error fetching supplier stats:', error);
      setStats(null);
    } finally {
      setIsLoadingStats(false);
    }
  };

  if (!supplier) return null;

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Неизвестно';
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch {
      return 'Неверный формат';
    }
  };

  const getShortId = (id: string | number) => {
    const idStr = String(id);
    return idStr.length > 8 ? idStr.substring(0, 8) + '...' : idStr;
  };

  const coeffColor = stats ? 
    (stats.price?.rescheduled_coef || 0) <= COEFFICIENT_CONFIG.green.max ? COEFFICIENT_CONFIG.green :
    (stats.price?.rescheduled_coef || 0) <= COEFFICIENT_CONFIG.yellow.max ? COEFFICIENT_CONFIG.yellow :
    COEFFICIENT_CONFIG.red : null;

  const hasPrediction = stats?.arrival_prediction && stats.arrival_prediction.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        {/* Заголовок (фиксированный) */}
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  {supplier.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={supplier.is_everyday_supply ? "default" : "secondary"}>
                    {supplier.is_everyday_supply ? 'Ежедневная поставка' : 'Обычная поставка'}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Hash className="h-3 w-3" />
                    ID: {getShortId(supplier.id)}
                  </div>
                  {hasPrediction && (
                    <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">
                      <Target className="h-3 w-3 mr-1" />
                      Прогноз доступен
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Основной контент с прокруткой */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Информация
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Статистика
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6 focus:outline-none">
              {/* Основная информация */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Название и описание */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Название компании</h3>
                      <div className="text-lg font-bold text-primary break-words">{supplier.name}</div>
                    </div>

                    {supplier.description && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Описание
                        </h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap break-words">
                          {supplier.description}
                        </p>
                      </div>
                    )}

                    <Separator />

                    {/* Контактная информация */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Контактное лицо */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Контактное лицо
                        </h3>
                        <InfoRow 
                          icon={User} 
                          label="ФИО" 
                          value={supplier.supervisor}
                          className="bg-blue-50/50 rounded-lg px-3"
                        />
                        <InfoRow 
                          icon={Phone} 
                          label="Телефон" 
                          value={supplier.supervisor_pn}
                          className="bg-blue-50/50 rounded-lg px-3"
                        />
                      </div>

                      {/* Представитель */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          Представитель
                        </h3>
                        <InfoRow 
                          icon={User} 
                          label="ФИО" 
                          value={supplier.representative}
                          className="bg-purple-50/50 rounded-lg px-3"
                        />
                        <InfoRow 
                          icon={Phone} 
                          label="Телефон" 
                          value={supplier.representative_pn}
                          className="bg-purple-50/50 rounded-lg px-3"
                        />
                      </div>

                      {/* Доставка */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Доставка
                        </h3>
                        <InfoRow 
                          icon={User} 
                          label="ФИО" 
                          value={supplier.delivery}
                          className="bg-green-50/50 rounded-lg px-3"
                        />
                        <InfoRow 
                          icon={Phone} 
                          label="Телефон" 
                          value={supplier.delivery_pn}
                          className="bg-green-50/50 rounded-lg px-3"
                        />
                      </div>

                      {/* Системная информация */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          Системная информация
                        </h3>
                        <InfoRow 
                          icon={Calendar} 
                          label="Дата добавления" 
                          value={formatDateTime(supplier.date_added)}
                          className="bg-gray-50 rounded-lg px-3"
                        />
                        <InfoRow 
                          icon={Clock} 
                          label="Последний доступ" 
                          value={supplier.last_accessed ? formatDateTime(supplier.last_accessed) : 'Никогда'}
                          className="bg-gray-50 rounded-lg px-3"
                        />
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Badge className="h-4 w-4 p-0 flex items-center justify-center">
                            {supplier.is_everyday_supply ? '✓' : '•'}
                          </Badge>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-500 mb-1">Тип поставки</div>
                            <Badge variant={supplier.is_everyday_supply ? "default" : "outline"}>
                              {supplier.is_everyday_supply ? 'Ежедневная' : 'Обычная'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Краткая статистика */}
              {stats && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Краткая статистика
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xs text-gray-600 font-medium">Поставок</div>
                        <div className="text-2xl font-bold text-gray-900">{stats.price?.count || 0}</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-xs text-gray-600 font-medium">Коэффициент</div>
                        <div 
                          className="text-2xl font-bold" 
                          style={{ color: coeffColor?.textColor }}
                        >
                          {(stats.price?.rescheduled_coef || 0).toFixed(2)}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xs text-gray-600 font-medium">Ср. цена</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {(stats.price?.avg || 0).toFixed(0)} ₸
                        </div>
                      </div>
                    </div>
                    {hasPrediction && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Наиболее вероятное время прибытия
                            </span>
                          </div>
                          <Badge className="text-base px-4 py-1 bg-indigo-100 text-indigo-700 border-indigo-200">
                            {stats.arrival_prediction[0].interval}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-6 focus:outline-none">
              <SupplierStatsDisplay stats={stats} isLoading={isLoadingStats} />

              {/* Уведомления и рекомендации */}
              {stats && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Анализ и рекомендации
                    </h3>
                    
                    <div className="space-y-4">
                      {(stats.price?.rescheduled_coef || 0) >= 1 && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <div>
                              <div className="font-medium text-red-800">Внимание: Высокий риск</div>
                              <p className="text-sm text-red-700 mt-1">
                                Коэффициент переносов {(stats.price.rescheduled_coef || 0).toFixed(2)} превышает допустимый порог. 
                                {hasPrediction && (
                                  <> Используйте прогноз времени ({stats.arrival_prediction[0].interval}) для точного планирования.</>
                                )}
                                Рекомендуется рассмотреть альтернативных поставщиков.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {(stats.price?.rescheduled_coef || 0) <= 0.4 && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="font-medium text-green-800">Надежный поставщик</div>
                              <p className="text-sm text-green-700 mt-1">
                                Низкий коэффициент переносов ({(stats.price.rescheduled_coef || 0).toFixed(2)}). 
                                {hasPrediction && (
                                  <> Прогноз прибытия: {stats.arrival_prediction[0].interval} (вероятность {stats.arrival_prediction[0].probability}%). </>
                                )}
                                Отличная стабильность поставок. Рекомендуется к приоритетному сотрудничеству.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {(stats.price?.rescheduled_coef || 0) > 0.4 && (stats.price?.rescheduled_coef || 0) < 1 && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Info className="h-5 w-5 text-yellow-600" />
                            <div>
                              <div className="font-medium text-yellow-800">Средняя стабильность</div>
                              <p className="text-sm text-yellow-700 mt-1">
                                Коэффициент {(stats.price.rescheduled_coef || 0).toFixed(2)}. 
                                {hasPrediction && (
                                  <> Ориентируйтесь на прогноз: {stats.arrival_prediction.map((p: any) => p.interval).join(', ')}.</>
                                )}
                                Требуется мониторинг поставок. Рекомендуется договориться о строгих сроках.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Футер (фиксированный) */}
        <DialogFooter className="px-6 py-4 border-t bg-gray-50 shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-500">
              {stats ? (
                <>
                  Показано {stats.price?.count || 0} поставок
                  {hasPrediction && (
                    <span className="ml-2 text-indigo-600">
                      • Прогноз доступен
                    </span>
                  )}
                </>
              ) : 'Нет данных'}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Закрыть
              </Button>
              <Button onClick={onEdit} className="gap-2">
                <Edit className="h-4 w-4" />
                Редактировать
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Вспомогательная функция для работы с классами
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};