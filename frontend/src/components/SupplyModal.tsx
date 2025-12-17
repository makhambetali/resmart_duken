// @/components/SupplyModal.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Camera, 
  Upload, 
  X, 
  CalendarClock,
  RefreshCw
} from "lucide-react";
import { formatPrice, getNumericValue } from '@/lib/utils';
import { EditableInvoiceTable } from '@/components/EditableInvoiceTable';

interface SupplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleDeleteSupply: (id: string) => void;
  supply?: Supply | null;
  onSubmit: (data: Omit<AddSupplyForm, 'images'>) => Promise<void>;
  suppliers: Array<{ id: string; name: string }>;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const SupplyModal: React.FC<SupplyModalProps> = ({
  open,
  onOpenChange,
  handleDeleteSupply,
  supply,
  onSubmit,
  suppliers,
}) => {
  const { toast } = useToast();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processedFiles, setProcessedFiles] = useState<Array<{
    file: File;
    html: string;
    isProcessing: boolean;
  }>>([]);

  const [hasExistingHtml, setHasExistingHtml] = useState(false);
  const [isProcessingAnyFile, setIsProcessingAnyFile] = useState(false);
  const [createdAt, setCreatedAt] = useState<string>('');
  const [isRescheduled, setIsRescheduled] = useState<boolean>(false);
  const [currentHtmlForTable, setCurrentHtmlForTable] = useState<string>('');
  const [tableHasChanges, setTableHasChanges] = useState<boolean>(false);

  const today = new Date().toLocaleDateString('en-CA');
  const plus7 = new Date(
    Date.now() + 7 * 864e5
  ).toLocaleDateString('en-CA');

  const isToday = formData.delivery_date === today;

  useEffect(() => {
    const mobileCheck = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);
  }, []);
const [prompt, setPrompt] = useState<string>('');

useEffect(() => {
  const loadPrompt = async () => {
    const res = await fetch('/invoice_table_extraction.prompt');
    const text = await res.text();
    setPrompt(text);
  };

  loadPrompt();
}, []);

  useEffect(() => {
    if (open) {
      if (supply) {
        let paymentType: 'cash' | 'bank' | 'mixed' = 'cash';
        if (supply.price_cash > 0 && supply.price_bank > 0) paymentType = 'mixed';
        else if (supply.price_bank > 0) paymentType = 'bank';

        setCreatedAt(supply.date_added || '');
        setIsRescheduled((supply as any).is_rescheduled || false);

        const existingHtml = supply.invoice_html || '';
        setHasExistingHtml(!!existingHtml && existingHtml.length > 0);
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
        
        setSelectedFiles([]);
        setProcessedFiles([]);
      } else {
        // Новая поставка - без дефолтной таблицы
        setCreatedAt('');
        setIsRescheduled(false);
        setCurrentHtmlForTable('');
        setTableHasChanges(false);

        setFormData({
          supplier: '', paymentType: 'cash', price_cash: '0',
          price_bank: '0', bonus: 0, exchange: 0,
          delivery_date: new Date().toLocaleDateString('en-CA'),
          comment: '', is_confirmed: false, invoice_html: '',
        });
        setSelectedFiles([]);
        setProcessedFiles([]);
        setHasExistingHtml(false);
      }
    }
  }, [supply, open]);

  // Обновляем currentHtmlForTable при обработке файлов
  useEffect(() => {
    const filesWithHtml = processedFiles.filter(item => item.html && !item.isProcessing);
    
    if (filesWithHtml.length > 0) {
      const combined = filesWithHtml.map(item => item.html).join('\n');
      setCurrentHtmlForTable(combined);
      setFormData(prev => ({ ...prev, invoice_html: combined }));
      setTableHasChanges(true); // Помечаем, что есть изменения
    }
  }, [processedFiles]);

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

  const fileToBase64 = useCallback((file: File): Promise<string> => {
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
  }, []);
 
  const processFileWithGemini = useCallback(async (file: File, index: number) => {
    if (!GEMINI_API_KEY) {
      toast({ 
        title: 'Ошибка', 
        description: 'API-ключ Gemini не настроен', 
        variant: 'destructive' 
      });
      return;
    }

    setProcessedFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, isProcessing: true } : item
    ));

    setIsProcessingAnyFile(true);

    try {
      const base64Data = await fileToBase64(file);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
      
      const requestBody = {
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: file.type, data: base64Data } }
          ]
        }]
      };

      const response = await fetch(url, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(requestBody) 
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || `Ошибка API: ${response.status}`);
      }

      const responseData = await response.json();
      const htmlResult = responseData.candidates[0].content.parts[0].text;
      
      setProcessedFiles(prev => prev.map((item, i) => 
        i === index ? { ...item, html: htmlResult, isProcessing: false } : item
      ));

      toast({ 
        title: 'Файл обработан', 
        description: `"${file.name}" успешно обработан.`, 
        variant: 'default', 
        className: "bg-green-500 text-white" 
      });

    } catch (error: any) {
      toast({ 
        title: 'Ошибка обработки файла', 
        description: `"${file.name}": ${error.message}`, 
        variant: 'destructive' 
      });
      
      setProcessedFiles(prev => prev.map((item, i) => 
        i === index ? { ...item, html: '', isProcessing: false } : item
      ));
    } finally {
      const stillProcessing = processedFiles.some((item, i) => 
        i !== index ? item.isProcessing : false
      );
      setIsProcessingAnyFile(stillProcessing);
    }
  }, [fileToBase64, toast, processedFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    
    const uniqueNewFiles = newFiles.filter(newFile => 
      !selectedFiles.some(existingFile => 
        existingFile.name === newFile.name && 
        existingFile.size === newFile.size
      )
    );
    
    if (uniqueNewFiles.length === 0) {
      toast({ 
        title: 'Файлы уже добавлены', 
        variant: 'default' 
      });
      return;
    }
    
    setSelectedFiles(prev => [...prev, ...uniqueNewFiles]);
    
    const newProcessedFiles = uniqueNewFiles.map(file => ({
      file,
      html: '',
      isProcessing: true
    }));
    
    setProcessedFiles(prev => [...prev, ...newProcessedFiles]);
    
    const processFilesSequentially = async () => {
      for (let i = 0; i < newProcessedFiles.length; i++) {
        const globalIndex = processedFiles.length + i;
        await processFileWithGemini(newProcessedFiles[i].file, globalIndex);
      }
    };
    
    processFilesSequentially();
    
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setProcessedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Если удаляем последний файл, сбрасываем HTML
    if (selectedFiles.length === 1) {
      setCurrentHtmlForTable('');
      setFormData(prev => ({ ...prev, invoice_html: '' }));
      setTableHasChanges(false);
    }
  };

  const handleHtmlChangeFromTable = (newHtml: string) => {
    setFormData(prev => ({ ...prev, invoice_html: newHtml }));
    setCurrentHtmlForTable(newHtml);
    setTableHasChanges(true);
  };

  const handleSaveAndCloseTableModal = () => {
    // Обновляем formData с изменениями из таблицы
    setFormData(prev => ({ ...prev, invoice_html: currentHtmlForTable }));
    
    toast({ 
      title: 'Изменения сохранены', 
      variant: "default",
      className: "bg-green-500 text-white" 
    });
    setIsPreviewModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isProcessingAnyFile) {
      toast({ 
        title: 'Пожалуйста, подождите', 
        description: 'Файлы все еще обрабатываются', 
        variant: 'destructive' 
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        price_cash: getNumericValue(formData.price_cash),
        price_bank: getNumericValue(formData.price_bank),
        invoice_html: formData.invoice_html,
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

  const handleFocus = (field: keyof Omit<AddSupplyForm, 'images' | 'invoice_html'>) => {
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

  const processedFilesWithHtml = processedFiles.filter(item => item.html && !item.isProcessing);
  const hasNewProcessedFiles = processedFilesWithHtml.length > 0;
  const hasPreviewContent = hasNewProcessedFiles || hasExistingHtml || currentHtmlForTable.length > 0;
  const isProcessingFiles = processedFiles.some(item => item.isProcessing) || isProcessingAnyFile;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-screen h-screen max-w-2xl max-h-[650px] rounded-none border-none overflow-y-auto">
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
                <Input 
                  id="cashAmount" 
                  type="text"
                  inputMode="numeric" 
                  placeholder="0" 
                  value={formData.price_cash} 
                  onChange={(e) => handlePriceChange('price_cash', e.target.value)} 
                  disabled={formData.paymentType === 'bank'} 
                  onFocus={() => handleFocus('price_cash')} 
                  onBlur={() => handleBlur('price_cash')} 
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
                  onChange={(e) => handlePriceChange('price_bank', e.target.value)} 
                  disabled={formData.paymentType === 'cash'} 
                  onFocus={() => handleFocus('price_bank')} 
                  onBlur={() => handleBlur('price_bank')} 
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
                      onChange={(e) => handleNumericInputChange('bonus', e.target.value)} 
                      onFocus={() => handleFocus('bonus')} 
                      onBlur={() => handleBlur('bonus')} 
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
                      onChange={(e) => handleNumericInputChange('exchange', e.target.value)} 
                      onFocus={() => handleFocus('exchange')} 
                      onBlur={() => handleBlur('exchange')} 
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

              {/* Блок загрузки файлов */}
              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between items-center">
                  <Label>Документы (PDF или Фото)</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsPreviewModalOpen(true)}
                    disabled={!hasPreviewContent || isProcessingFiles}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Редактировать таблицу
                    {hasNewProcessedFiles && ` (${processedFilesWithHtml.length})`}
                    {tableHasChanges && <span className="ml-1 text-green-600">*</span>}
                  </Button>
                </div>

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

                {!hasExistingHtml && !hasNewProcessedFiles && currentHtmlForTable.length > 0 && (
                  <div className="mt-4 p-3 border rounded-lg bg-amber-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-amber-800">
                          Таблица загружена
                        </h4>
                        <p className="text-sm text-amber-600 mt-1">
                          Нажмите "Редактировать таблицу" для просмотра и изменения
                        </p>
                      </div>
                      <div className="text-sm text-amber-700 font-medium">
                        ⓘ Загружено
                      </div>
                    </div>
                  </div>
                )}

                {!hasExistingHtml && !hasNewProcessedFiles && currentHtmlForTable.length === 0 && (
                  <div className="mt-4 p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Нет таблицы
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Загрузите файлы чтобы создать таблицу или создайте пустую таблицу в редакторе
                        </p>
                      </div>
                      <div className="text-sm text-gray-700 font-medium">
                        ⓘ Нет данных
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={!isToday || isProcessingFiles}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isMobile ? 'Выбрать файлы' : 'Выберите файлы'}
                  </Button>
                  
                  {isMobile && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => cameraInputRef.current?.click()} 
                      disabled={!isToday || isProcessingFiles}
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
                  disabled={isProcessingFiles}
                />
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept="image/*,.pdf" 
                  multiple
                  onChange={handleFileSelect} 
                  className="hidden" 
                  disabled={isProcessingFiles}
                />
                 
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
                            disabled={isProcessingFiles}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isProcessingFiles && (
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
                    disabled={isLoading || isProcessingFiles}
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
                  disabled={isProcessingFiles}
                >
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || isProcessingFiles || !formData.supplier}
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
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>Редактирование таблицы</span>
                {hasNewProcessedFiles && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({processedFilesWithHtml.length} файл{processedFilesWithHtml.length > 1 ? 'а' : ''})
                  </span>
                )}
                {!hasNewProcessedFiles && hasExistingHtml && (
                  <span className="text-sm font-normal text-muted-foreground">
                    (существующий документ)
                  </span>
                )}
                {tableHasChanges && (
                  <span className="text-sm font-normal text-green-600">
                    (есть изменения)
                  </span>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-auto bg-gray-50 p-4 print:p-0">
            <style>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                .invoice-print-container,
                .invoice-print-container * {
                  visibility: visible;
                }
                .invoice-print-container {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  padding: 0;
                  margin: 0;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}</style>
            
            <div className="invoice-print-container bg-white rounded-lg shadow-lg p-6 print:shadow-none print:rounded-none">
              <EditableInvoiceTable
                html={currentHtmlForTable}
                onHtmlChange={handleHtmlChangeFromTable}
              />
            </div>
          </div>
          <DialogFooter className="flex-shrink-0 px-6 py-4 border-t bg-white no-print">
            <div className="flex justify-between items-center w-full">
              <div className="text-sm text-muted-foreground">
                Используйте Ctrl+P для печати документа
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsPreviewModalOpen(false)}
                >
                  Закрыть
                </Button>
                <Button 
                  onClick={handleSaveAndCloseTableModal}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Сохранить
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};