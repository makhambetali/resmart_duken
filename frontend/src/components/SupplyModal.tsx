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
import { Trash, FileText, Loader2, Eye, Camera, Upload, X } from "lucide-react";
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
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
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

  // ++ НОВОЕ СОСТОЯНИЕ ДЛЯ МНОЖЕСТВЕННЫХ ФАЙЛОВ ++
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processedFiles, setProcessedFiles] = useState<Array<{
    file: File;
    html: string;
    isProcessing: boolean;
  }>>([]);

  // ++ СОСТОЯНИЕ ДЛЯ СУЩЕСТВУЮЩЕГО HTML ++
  const [hasExistingHtml, setHasExistingHtml] = useState(false);

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
        
        // ОБНОВЛЕНО: Проверяем наличие существующего HTML
        const existingHtml = supply.invoice_html || '';
        setHasExistingHtml(!!existingHtml && existingHtml.length > 0);
        
        // СБРАСЫВАЕМ ОБРАБОТАННЫЕ ФАЙЛЫ ПРИ РЕДАКТИРОВАНИИ СУЩЕСТВУЮЩЕЙ ПОСТАВКИ
        setSelectedFiles([]);
        setProcessedFiles([]);
      } else {
        setFormData({
          supplier: '', paymentType: 'cash', price_cash: '0',
          price_bank: '0', bonus: 0, exchange: 0,
          delivery_date: new Date().toISOString().split('T')[0],
          comment: '', is_confirmed: false, invoice: null, invoice_html: '',
        });
        setExistingInvoiceUrl(null);
        setSelectedFiles([]);
        setProcessedFiles([]);
        setHasExistingHtml(false);
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

  const processFileWithGemini = async (file: File, index: number) => {
    if (!GEMINI_API_KEY) {
      toast({ title: 'Ошибка', description: 'API-ключ Gemini не настроен', variant: 'destructive' });
      return;
    }

    // ++ ОБНОВЛЯЕМ СТАТУС ОБРАБОТКИ ДЛЯ КОНКРЕТНОГО ФАЙЛА ++
    setProcessedFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, isProcessing: true } : item
    ));

    try {
      const base64Data = await fileToBase64(file);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
      
      const requestBody = {
        contents: [{
          parts: [
            { 
              text: `Проанализируй этот файл (PDF или изображение) и преобразуй содержимое ВСЕГО документа в чистый HTML-код. 
Сохрани структуру таблиц, данные и форматирование. Если в документе несколько страниц или таблиц, создай единый HTML с пагинацией.
Используй CSS для стилизации. Предоставь только чистый HTML-код без пояснений.

Пример структуры для многостраничных документов:
<div class="invoice-document">
  <div class="page">
    <!-- содержимое страницы 1 -->
  </div>
  <div class="page">
    <!-- содержимое страницы 2 -->
  </div>
</div>

Начни с \`<div class="invoice-document">\`` 
            },
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
      
      // ++ ОБНОВЛЯЕМ РЕЗУЛЬТАТ ДЛЯ КОНКРЕТНОГО ФАЙЛА ++
      setProcessedFiles(prev => prev.map((item, i) => 
        i === index ? { ...item, html: htmlResult, isProcessing: false } : item
      ));

      toast({ title: 'Файл обработан', description: `"${file.name}" успешно обработан.`, variant: 'default', className: "bg-green-500 text-white" });

    } catch (error: any) {
      toast({ title: 'Ошибка обработки файла', description: `"${file.name}": ${error.message}`, variant: 'destructive' });
      // ++ ОБНОВЛЯЕМ СТАТУС ПРИ ОШИБКЕ ++
      setProcessedFiles(prev => prev.map((item, i) => 
        i === index ? { ...item, html: '', isProcessing: false } : item
      ));
    }
  };

  // --- ОБРАБОТЧИКИ СОБЫТИЙ ---

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    
    // ++ ДОБАВЛЯЕМ НОВЫЕ ФАЙЛЫ К СУЩЕСТВУЮЩИМ ++
    setSelectedFiles(prev => [...prev, ...newFiles]);
    
    // ++ СОЗДАЕМ ЗАПИСИ ДЛЯ ОБРАБОТКИ ++
    const newProcessedFiles = newFiles.map(file => ({
      file,
      html: '',
      isProcessing: true
    }));
    
    setProcessedFiles(prev => [...prev, ...newProcessedFiles]);
    
    // ++ ЗАПУСКАЕМ ОБРАБОТКУ ДЛЯ КАЖДОГО НОВОГО ФАЙЛА ++
    newProcessedFiles.forEach((item, index) => {
      const globalIndex = processedFiles.length + index;
      processFileWithGemini(item.file, globalIndex);
    });

    e.target.value = '';
  };

  // ++ ФУНКЦИЯ ДЛЯ УДАЛЕНИЯ ФАЙЛА ++
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setProcessedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // ++ ФУНКЦИЯ ДЛЯ ГЕНЕРАЦИИ ОБЩЕГО HTML ++
  const generateCombinedHtml = (): string => {
    const filesWithHtml = processedFiles.filter(item => item.html);
    
    if (filesWithHtml.length > 0) {
      // Если есть новые обработанные файлы, объединяем их
      return `
        <div class="combined-invoice-document">
          ${filesWithHtml.map((item, index) => `
            <div class="invoice-file-section" data-file-name="${item.file.name}">
              <div class="file-header" style="padding: 10px; background: #f5f5f5; margin-bottom: 20px; border-radius: 4px;">
                <h3 style="margin: 0; font-size: 16px; color: #333;">Документ: ${item.file.name}</h3>
              </div>
              ${item.html}
            </div>
          `).join('')}
        </div>
      `;
    } else if (hasExistingHtml && formData.invoice_html) {
      // Если нет новых файлов, но есть существующий HTML
      return formData.invoice_html;
    }
    
    return '';
  };

  // ++ ФУНКЦИЯ ДЛЯ ПРЕДПРОСМОТРА ОБЩЕГО HTML ++
  const handlePreviewCombinedHtml = () => {
    const combinedHtml = generateCombinedHtml();
    
    // ОБНОВЛЕНО: Проверяем наличие HTML более тщательно
    const hasHtmlContent = combinedHtml && 
                          combinedHtml.length > 0 && 
                          combinedHtml.replace(/<\/?[^>]+(>|$)/g, "").trim().length > 0;

    if (!hasHtmlContent) {
      toast({ 
        title: 'Нет данных для просмотра', 
        description: 'Файлы еще не обработаны или нет HTML данных', 
        variant: 'destructive' 
      });
      return;
    }
    setIsPreviewModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // ++ ГЕНЕРИРУЕМ ОБЩИЙ HTML ИЗ ВСЕХ ОБРАБОТАННЫХ ФАЙЛОВ ++
      // ПРИ АПДЕЙТЕ: новые файлы полностью заменяют старый invoice_html
      const combinedHtml = generateCombinedHtml();

      await onSubmit({
        ...formData,
        price_cash: getNumericValue(formData.price_cash),
        price_bank: getNumericValue(formData.price_bank),
        invoice_html: combinedHtml, // ЗАМЕНЯЕМ старый HTML на новый
      });
      toast({ 
        title: supply ? 'Поставка обновлена' : 'Поставка добавлена', 
        variant: "default", 
        className: "bg-green-500 text-white" 
      });
      onOpenChange(false);
    } catch (error) {
      toast({ 
        title: 'Ошибка', 
        description: 'Не удалось сохранить поставку', 
        variant: 'destructive' 
      });
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

  // ++ ПОЛУЧИТЬ ОБРАБОТАННЫЕ ФАЙЛЫ С HTML ++
  const processedFilesWithHtml = processedFiles.filter(item => item.html);
  const hasNewProcessedFiles = processedFilesWithHtml.length > 0;

  // ++ ЕСТЬ ЛИ ЧТО-ТО ДЛЯ ПРЕДПРОСМОТРА ++
  const hasPreviewContent = hasNewProcessedFiles || hasExistingHtml;

  // --- JSX РАЗМЕТКА ---
  return (
    <>
      {/* ОСНОВНОЕ МОДАЛЬНОЕ ОКНО */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-screen h-screen max-w-2xl max-h-[650px] rounded-none border-none overflow-y-auto">
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

              {/* ++ ОБНОВЛЕННЫЙ БЛОК ЗАГРУЗКИ ФАЙЛА С МНОЖЕСТВЕННЫМ ВЫБОРОМ ++ */}
              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between items-center">
                  <Label>Счет-фактура (PDF или Фото)</Label>
                  {hasPreviewContent && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={handlePreviewCombinedHtml}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Показать таблицу
                      {hasNewProcessedFiles && ` (${processedFilesWithHtml.length})`}
                    </Button>
                  )}
                </div>
                
                {supply && existingInvoiceUrl && (
                  <div className="my-2">
                    <a 
                      href={existingInvoiceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center text-sm text-blue-600 hover:underline"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Просмотреть текущий счет-фактуру
                    </a>
                  </div>
                )}

                {/* ++ ИНФОРМАЦИЯ О СТАТУСЕ ++ */}
                {hasNewProcessedFiles && (
                  <div className="mt-4 p-3 border rounded-lg bg-green-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-green-800">
                          Обработанные файлы: {processedFilesWithHtml.length}
                        </h4>
                        <p className="text-sm text-green-600 mt-1">
                          {supply ? 'Новые файлы заменят существующий HTML документ' : 'Все файлы будут объединены в один HTML документ'}
                        </p>
                      </div>
                      <div className="text-sm text-green-700 font-medium">
                        ✓ Готово
                      </div>
                    </div>
                  </div>
                )}

                {hasExistingHtml && !hasNewProcessedFiles && (
                  <div className="mt-4 p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-800">
                          Существующий HTML документ
                        </h4>
                        <p className="text-sm text-blue-600 mt-1">
                          {supply ? 'Загрузите новые файлы чтобы заменить текущий документ' : 'Используется существующий HTML'}
                        </p>
                      </div>
                      <div className="text-sm text-blue-700 font-medium">
                        ✓ Загружен
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={!isToday || isProcessingFile}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isMobile ? 'Выбрать файлы' : 'Выберите файлы'}
                  </Button>
                  
                  {isMobile && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => cameraInputRef.current?.click()} 
                      disabled={!isToday || isProcessingFile}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Сфотографировать
                    </Button>
                  )}
                </div>

                <input 
                  ref={cameraInputRef} 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  onChange={handleFileSelect} 
                  className="hidden" 
                />
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept="image/*,.pdf" 
                  multiple
                  onChange={handleFileSelect} 
                  className="hidden" 
                />
                 
                {/* ++ СПИСОК ВЫБРАННЫХ ФАЙЛОВ ++ */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <Label className="text-sm">Выбранные файлы:</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-muted/20">
                          <div className="flex items-center space-x-2 flex-1">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm truncate">{file.name}</span>
                            {processedFiles[index]?.isProcessing && (
                              <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                            )}
                            {processedFiles[index]?.html && !processedFiles[index]?.isProcessing && (
                              <span className="text-xs text-green-600">✓ Обработан</span>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isProcessingFile && (
                  <div className="flex items-center text-sm text-blue-600 mt-2">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Обработка файлов с помощью AI...
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
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || isProcessingFile || !formData.supplier}
                >
                  {isLoading ? 'Сохранение...' : (supply ? 'Обновить' : 'Добавить')}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* МОДАЛЬНОЕ ОКНО ДЛЯ ПРЕДПРОСМОТРА ОБЩЕГО HTML */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Предпросмотр счета-фактуры
              {hasNewProcessedFiles && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({processedFilesWithHtml.length} файл{processedFilesWithHtml.length > 1 ? 'а' : ''})
                </span>
              )}
              {!hasNewProcessedFiles && hasExistingHtml && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (существующий документ)
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-auto p-1 border rounded-md bg-gray-50">
            <style>{`
              .combined-invoice-document { font-family: Arial, sans-serif; }
              .invoice-file-section { margin-bottom: 40px; }
              .file-header { padding: 12px; background: #e8f4fd; margin-bottom: 20px; border-radius: 6px; border-left: 4px solid #1890ff; }
              .invoice-table-preview table { width: 100%; border-collapse: collapse; margin: 10px 0; }
              .invoice-table-preview th, .invoice-table-preview td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; font-size: 14px; }
              .invoice-table-preview th { background-color: #f3f4f6; font-weight: 600; color: #374151; }
              .invoice-table-preview tr:nth-child(even) { background-color: #f9fafb; }
              .invoice-table-preview tr:hover { background-color: #f0f9ff; }
              .page { margin-bottom: 30px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            `}</style>
            <div 
              className="invoice-table-preview" 
              dangerouslySetInnerHTML={{ 
                __html: generateCombinedHtml() 
              }} 
            />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => setIsPreviewModalOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};