// @/components/ImageUpload/ImageUpload.tsx
import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera, X, Eye, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/lib/image-utils';

interface ImageUploadProps {
  selectedFiles: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
  isToday?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFiles,
  onFilesChange,
  disabled = false,
  isToday = true,
  maxFiles = 10,
  maxSizeMB = 5,
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    // Проверка типа файла
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Неверный формат файла',
        description: `Формат ${file.type} не поддерживается. Используйте JPEG, PNG, WebP или HEIC.`,
        variant: 'destructive',
      });
      return false;
    }

    // Проверка размера файла
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast({
        title: 'Слишком большой файл',
        description: `Максимальный размер: ${maxSizeMB}MB. Ваш файл: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
        variant: 'destructive',
      });
      return false;
    }

    // Проверка количества файлов
    if (selectedFiles.length >= maxFiles) {
      toast({
        title: 'Достигнут лимит файлов',
        description: `Максимальное количество файлов: ${maxFiles}`,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles: File[] = [];

    // Валидация всех файлов
    for (const file of newFiles) {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    // Сжатие изображений
    setIsCompressing(true);
    try {
      const compressedFiles = await Promise.all(
        validFiles.map(file => compressImage(file, 500)) // 500KB для загрузки
      );
      
      onFilesChange([...selectedFiles, ...compressedFiles]);
      
      toast({
        title: 'Файлы добавлены',
        description: `Добавлено ${validFiles.length} изображений`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Ошибка обработки файлов',
        description: 'Не удалось обработать изображения',
        variant: 'destructive',
      });
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  const handlePreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleFileUpload}
            disabled={disabled || !isToday || isCompressing}
            className="gap-1.5"
          >
            <Upload className="w-4 h-4" />
            {isCompressing ? 'Сжатие...' : 'Выбрать файлы'}
          </Button>
          
          {/* {isMobile && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCameraCapture}
              disabled={disabled || !isToday || isCompressing}
              className="gap-1.5"
            >
              <Camera className="w-4 h-4" />
              Сфотографировать
            </Button>
          )} */}
        </div>

        {/* Скрытые input'ы */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {/* Список файлов */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">
              Выбранные файлы ({selectedFiles.length}/{maxFiles}):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${file.size}-${index}`}
                  className="border rounded-lg p-3 hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <ImageIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      className="h-6 w-6 p-0 ml-2 flex-shrink-0"
                      disabled={disabled}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                    <div className="flex space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(file)}
                        className="h-6 px-2 text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Просмотр
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно предпросмотра */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">Просмотр изображения</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewImage(null)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};