// @/components/AI/AITableExtractor.tsx
import React, { useState, useEffect } from 'react';
import { AI_CONFIG } from '@/ai-config';
import { Button } from '@/components/ui/button';
import { Loader2, Brain, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AITableExtractorProps {
  files: File[];
  onProcessingComplete: (results: Array<{ file: File; html: string }>) => void;
  disabled?: boolean;
}

export const AITableExtractor: React.FC<AITableExtractorProps> = ({
  files,
  onProcessingComplete,
  disabled = false,
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Функция для конвертации файла в base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) resolve(base64String);
        else reject(new Error('Failed to convert file to base64'));
      };
      reader.onerror = error => reject(error);
    });
  };

  // Основная функция обработки через Gemini AI
  const processWithGeminiAI = async (file: File): Promise<string> => {
    if (!AI_CONFIG.ENABLED) {
      throw new Error('AI обработка отключена в настройках');
    }

    if (!AI_CONFIG.GEMINI_API_KEY) {
      throw new Error('API ключ Gemini не настроен');
    }

    const base64Data = await fileToBase64(file);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${AI_CONFIG.GEMINI_API_KEY}`;
    
    const prompt = await loadPrompt();
    
    const requestBody = {
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: file.type, data: base64Data } }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      }
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.PROCESS_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const responseData = await response.json();
      const htmlResult = responseData.candidates[0].content.parts[0].text;
      
      // Очистка HTML от возможных лишних тегов
      const cleanHtml = htmlResult
        .replace(/```html|```/g, '')
        .replace(/^[\s\S]*?<table>/i, '<table>')
        .replace(/<\/table>[\s\S]*$/i, '</table>')
        .trim();

      return cleanHtml;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Таймаут обработки файла');
      }
      throw error;
    }
  };

  const loadPrompt = async (): Promise<string> => {
    try {
      const res = await fetch('/invoice_table_extraction.prompt');
      if (res.ok) {
        return await res.text();
      }
    } catch (error) {
      console.error('Failed to load prompt:', error);
    }
    
    // Fallback prompt
    return `Извлеки таблицу из изображения накладной. Верни только HTML код таблицы без объяснений.
Используй теги: <table>, <thead>, <tbody>, <tr>, <th>, <td>
Сохрани все числовые данные как есть.`;
  };

  const handleProcessFiles = async () => {
    if (!AI_CONFIG.ENABLED) {
      toast({
        title: 'AI обработка отключена',
        description: 'Включите AI_CONFIG.ENABLED в настройках',
        variant: 'destructive',
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: 'Нет файлов для обработки',
        description: 'Сначала выберите изображения',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const results: Array<{ file: File; html: string }> = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        try {
          const html = await processWithGeminiAI(files[i]);
          results.push({ file: files[i], html });
          toast({
            title: 'Файл обработан',
            description: `${files[i].name} успешно обработан AI`,
            variant: 'default',
          });
        } catch (error: any) {
          console.error(`Error processing ${files[i].name}:`, error);
          toast({
            title: 'Ошибка обработки',
            description: `${files[i].name}: ${error.message}`,
            variant: 'destructive',
          });
          results.push({ file: files[i], html: '' });
        }
        
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      onProcessingComplete(results);
      
      toast({
        title: 'Обработка завершена',
        description: `Обработано ${results.filter(r => r.html).length} из ${files.length} файлов`,
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Критическая ошибка',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {!AI_CONFIG.ENABLED && (
        <div className="p-3 border border-amber-200 bg-amber-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              <p className="font-medium">AI обработка отключена</p>
              <p className="mt-1">
                Для включения установите AI_CONFIG.ENABLED = true в файле конфигурации
              </p>
            </div>
          </div>
        </div>
      )}

      <Button
        type="button"
        variant={AI_CONFIG.ENABLED ? "default" : "outline"}
        onClick={handleProcessFiles}
        disabled={disabled || !AI_CONFIG.ENABLED || files.length === 0 || isProcessing}
        className="gap-2 w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Обработка AI... {progress}%
          </>
        ) : (
          <>
            <Brain className="w-4 h-4" />
            Обработать через AI (отключено)
          </>
        )}
      </Button>

      {isProcessing && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};