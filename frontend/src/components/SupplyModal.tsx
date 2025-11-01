// @/components/SupplyModal.tsx

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
import { Trash, FileText, Loader2, Eye, Camera, Upload } from "lucide-react";
import { formatPrice, getNumericValue } from '@/lib/utils';

// --- ИНТЕРФЕЙС ПРОПСОВ ---
interface SupplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleDeleteSupply: (id: string) => void;
  supply?: Supply | null;
  onSubmit: (data: Omit<AddSupplyForm, 'images'>) => Promise<void>;
  suppliers: Array<{ id: string; name: string }>;
}

// --- ВАЖНО: Вставьте ваш API-ключ сюда ---
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ;
// alert(GEMINI_API_KEY)

// --- КОМПОНЕНТ ---
export const SupplyModal: React.FC<SupplyModalProps> = ({
  open,
  onOpenChange,
  handleDeleteSupply,
  supply,
  onSubmit,
  suppliers,
}) => {
  const { toast } = useToast();

  // --- РЕФЫ ДЛЯ СКРЫТЫХ ПОЛЕЙ ВВОДА ---
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- СОСТОЯНИЕ КОМПОНЕНТА ---
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [existingInvoiceUrl, setExistingInvoiceUrl] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); // Новое состояние для модального окна предпросмотра
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState<Omit<AddSupplyForm, 'images'>>({
    supplier: '',
    paymentType: 'cash',
    price_cash: '0',
    price_bank: '0',
    bonus: 0,
    exchange: 0,
    delivery_date: new Date().toISOString().split('T')[0],
    comment: '',
    is_confirmed: false,
    invoice: null,
    invoice_html: '',
  });

  const today = new Date().toISOString().split('T')[0];
  const plus7 = new Date(Date.now() + 7 * 864e5).toISOString().split('T')[0];
  const isToday = formData.delivery_date === today;

  // --- ЭФФЕКТЫ ---
  useEffect(() => {
    const mobileCheck = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);
  }, []);

  useEffect(() => {
    if (open) {
      if (supply) {
        let paymentType: 'cash' | 'bank' | 'mixed' = 'cash';
        if (supply.price_cash > 0 && supply.price_bank > 0) paymentType = 'mixed';
        else if (supply.price_bank > 0) paymentType = 'bank';

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
          invoice: null,
          invoice_html: supply.invoice_html || '',
        });
        setExistingInvoiceUrl(supply.invoice || null);
      } else {
        setFormData({
          supplier: '', paymentType: 'cash', price_cash: '0',
          price_bank: '0', bonus: 0, exchange: 0,
          delivery_date: new Date().toISOString().split('T')[0],
          comment: '', is_confirmed: false, invoice: null, invoice_html: '',
        });
        setExistingInvoiceUrl(null);
      }
    }
  }, [supply, open]);

  // --- ФУНКЦИИ ---

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) resolve(base64String);
        else reject(new Error("Не удалось конвертировать файл"));
      };
      reader.onerror = error => reject(error);
    });
  };

  const processFileWithGemini = async (file: File) => {
    if (!GEMINI_API_KEY) {
      toast({ title: 'Ошибка', description: 'API-ключ Gemini не настроен', variant: 'destructive' });
      return;
    }

    setIsProcessingFile(true);
    try {
      const base64Data = await fileToBase64(file);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;
      
      const requestBody = {
        contents: [{
          parts: [
            { text: "Проанализируй этот файл (PDF или изображение). Найди в нем основную таблицу и преобразуй ее в HTML-код. Предоставь только HTML-код таблицы без лишних слов или тегов ```html." },
            { inline_data: { mime_type: file.type, data: base64Data } }
          ]
        }]
      };

      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || `Ошибка API: ${response.status}`);
      }

      const responseData = await response.json();
      const htmlResult = responseData.candidates[0].content.parts[0].text;
      
      setFormData(prev => ({ ...prev, invoice_html: htmlResult }));
      toast({ title: 'Файл обработан', description: 'Таблица успешно извлечена.', variant: 'default', className: "bg-green-500 text-white" });

    } catch (error: any) {
      toast({ title: 'Ошибка обработки файла', description: error.message, variant: 'destructive' });
      setFormData(prev => ({ ...prev, invoice_html: '' }));
    } finally {
      setIsProcessingFile(false);
    }
  };

  // --- ОБРАБОТЧИКИ СОБЫТИЙ ---

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData(prev => ({ ...prev, invoice: file, invoice_html: supply?.invoice_html || '' }));
    if (file) {
      processFileWithGemini(file);
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        price_cash: getNumericValue(formData.price_cash),
        price_bank: getNumericValue(formData.price_bank),
      });
      toast({ title: supply ? 'Поставка обновлена' : 'Поставка добавлена', variant: "default", className: "bg-green-500 text-white" });
      onOpenChange(false);
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось сохранить поставку', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // (Остальные обработчики без изменений)
  const handleFocus = (field: keyof Omit<AddSupplyForm, 'images' | 'invoice' | 'invoice_html'>) => {
    setFormData(prev => ({ ...prev, [field]: (prev[field] === '0' || prev[field] === 0) ? '' : prev[field] }));
  };
  const handleBlur = (field: 'price_cash' | 'price_bank' | 'bonus' | 'exchange') => {
    setFormData(prev => ({ ...prev, [field]: prev[field] === '' ? ((field === 'price_cash' || field === 'price_bank') ? '0' : 0) : prev[field] }));
  };
  const handlePriceChange = (field: 'price_cash' | 'price_bank', value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, [field]: formatPrice(numericValue) }));
  };
  const handleNumericInputChange = (field: 'bonus' | 'exchange', value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 3);
    setFormData(prev => ({ ...prev, [field]: Number(numericValue) || 0 }));
  };
  const handlePaymentTypeChange = (newPaymentType: 'cash' | 'bank' | 'mixed') => {
    setFormData(prev => {
      const totalValue = Number(getNumericValue(prev.price_cash)) + Number(getNumericValue(prev.price_bank));
      let newCash = '0', newBank = '0';
      if (newPaymentType === 'cash') newCash = formatPrice(totalValue.toString());
      else if (newPaymentType === 'bank') newBank = formatPrice(totalValue.toString());
      else { newCash = prev.price_cash; newBank = prev.price_bank; }
      return { ...prev, paymentType: newPaymentType, price_cash: newCash, price_bank: newBank };
    });
  };

  // --- JSX РАЗМЕТКА ---
  return (
    <>
      {/* ОСНОВНОЕ МОДАЛЬНОЕ ОКНО */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-screen h-screen max-w-2xl  max-h-[650px] rounded-none border-none overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{supply ? 'Редактировать поставку' : 'Добавить поставку'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <Label htmlFor="supplier">Поставщик</Label>
                <SupplierSearchCombobox value={formData.supplier} onValueChange={(value) => setFormData(prev => ({ ...prev, supplier: value }))} placeholder="Выберите поставщика..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentType">Тип оплаты</Label>
                <Select value={formData.paymentType} onValueChange={handlePaymentTypeChange}>
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
                <Input id="cashAmount" type="text"inputMode="numeric" placeholder="0" value={formData.price_cash} onChange={(e) => handlePriceChange('price_cash', e.target.value)} disabled={formData.paymentType === 'bank'} onFocus={() => handleFocus('price_cash')} onBlur={() => handleBlur('price_cash')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAmount">Сумма банком (₸)</Label>
                <Input id="bankAmount" type="text"inputMode="numeric" placeholder="0" value={formData.price_bank} onChange={(e) => handlePriceChange('price_bank', e.target.value)} disabled={formData.paymentType === 'cash'} onFocus={() => handleFocus('price_bank')} onBlur={() => handleBlur('price_bank')} />
              </div>
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2"><Label htmlFor="bonus">Бонус</Label><Input id="bonus" type="number" max="999"inputMode="numeric" value={formData.bonus} onChange={(e) => handleNumericInputChange('bonus', e.target.value)} onFocus={() => handleFocus('bonus')} onBlur={() => handleBlur('bonus')} /></div>
                  <div className="space-y-2"><Label htmlFor="exchange">Обмен</Label><Input id="exchange" type="number" max="999" inputMode="numeric"value={formData.exchange} onChange={(e) => handleNumericInputChange('exchange', e.target.value)} onFocus={() => handleFocus('exchange')} onBlur={() => handleBlur('exchange')} /></div>
                  <div className="space-y-2 md:col-span-2"><Label htmlFor="deliveryDate">Дата поставки</Label><Input id="deliveryDate" type="date" min={today} max={plus7} value={formData.delivery_date} onChange={(e) => setFormData(prev => ({ ...prev, delivery_date: e.target.value }))} /></div>
                </div>
                {!isToday && (<p className="text-sm text-amber-600 mt-2">⚠️ Подтверждение и загрузка документов доступны только для сегодняшней даты.</p>)}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="comment">Комментарий</Label>
                <Textarea id="comment" value={formData.comment} onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))} rows={3} />
              </div>

              {/* БЛОК ЗАГРУЗКИ ФАЙЛА */}
              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between items-center">
                  <Label>Счет-фактура (PDF или Фото)</Label>
                  {formData.invoice_html && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsPreviewModalOpen(true)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Показать таблицу
                    </Button>
                  )}
                </div>
                
                {supply && existingInvoiceUrl && (
                  <div className="my-2"><a href={existingInvoiceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:underline"><FileText className="w-4 h-4 mr-2" />Просмотреть текущий счет-фактуру</a></div>
                )}

                <div className="flex flex-wrap gap-2">
                  {/* {isMobile && (
                    <Button type="button" onClick={() => cameraInputRef.current?.click()} disabled={!isToday || isProcessingFile}>
                      <Camera className="w-4 h-4 mr-2" />
                      Сделать фото
                    </Button>
                  )} */}
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={!isToday || isProcessingFile}>
                    <Upload className="w-4 h-4 mr-2" />
                    {isMobile ? 'Выбрать файл' : 'Выберите файл'}
                  </Button>
                </div>

                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
                <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileSelect} className="hidden" />
                 
                {isProcessingFile && (<div className="flex items-center text-sm text-blue-600 mt-2"><Loader2 className="w-4 h-4 mr-2 animate-spin" />Обработка файла с помощью AI...</div>)}
                {formData.invoice && !isProcessingFile && <p className="text-sm text-muted-foreground mt-1">Выбран новый файл: {formData.invoice.name}</p>}
              </div>

              <div className="flex items-center space-x-2 md:col-span-2">
                <Checkbox id="isConfirmed" checked={formData.is_confirmed} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_confirmed: Boolean(checked) }))} disabled={!isToday} />
                <Label htmlFor="isConfirmed" className={!isToday ? 'text-muted-foreground' : ''}>Подтверждена</Label>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                {supply && (<Button type="button" variant="destructive" onClick={() => handleDeleteSupply(supply.id)} disabled={isLoading}><Trash className="w-4 h-4 mr-2" />Удалить</Button>)}
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Отмена</Button>
                <Button type="submit" disabled={isLoading || isProcessingFile || !formData.supplier}>
                  {isLoading ? 'Сохранение...' : (supply ? 'Обновить' : 'Добавить')}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* НОВОЕ МОДАЛЬНОЕ ОКНО ДЛЯ ПРЕДПРОСМОТРА ТАБЛИЦЫ */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Предпросмотр счета-фактуры</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-auto p-1 border rounded-md bg-gray-50">
            <style>{`.invoice-table-preview table{width:100%;border-collapse:collapse}.invoice-table-preview th,.invoice-table-preview td{border:1px solid #ddd;padding:8px;text-align:left;font-size:.875rem}.invoice-table-preview th{background-color:#f2f2f2;font-weight:600}.invoice-table-preview tr:nth-child(even){background-color:#fafafa}`}</style>
            <div className="invoice-table-preview" dangerouslySetInnerHTML={{ __html: formData.invoice_html }} />
          </div>
          <DialogFooter className="mt-4">
              <Button onClick={() => setIsPreviewModalOpen(false)}>Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};