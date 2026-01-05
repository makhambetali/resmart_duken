// @/components/ImageUpload/ImageUpload.tsx
import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Eye, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [previewType, setPreviewType] = useState<'file' | 'url'>('file');

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

    return true;
  };

  const processNewFiles = async (newFiles: File[]) => {
    if (selectedFiles.length + newFiles.length > maxFiles) {
      toast({
        title: 'Достигнут лимит файлов',
        description: `Максимальное количество файлов: ${maxFiles}. У вас уже ${selectedFiles.length}`,
        variant: 'destructive',
      });
      return false;
    }

    const validFiles: File[] = [];

    // Валидация всех файлов
    for (const file of newFiles) {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return false;

    // Сжатие изображений
    setIsCompressing(true);
    try {
      const compressedFiles = await Promise.all(
        validFiles.map(file => compressImage(file, 500)) // 500KB для загрузки
      );
      
      // Добавляем новые файлы к существующим
      const updatedFiles = [...selectedFiles, ...compressedFiles];
      onFilesChange(updatedFiles);
      
      toast({
        title: 'Файлы добавлены',
        description: `Добавлено ${validFiles.length} изображений. Всего: ${updatedFiles.length}/${maxFiles}`,
        variant: 'default',
      });
      
      // Показываем превью последнего добавленного файла
      if (validFiles.length === 1) {
        const lastFile = compressedFiles[0];
        handlePreview(lastFile, updatedFiles.length - 1);
      }
      
      return true;
    } catch (error) {
      console.error('Ошибка при сжатии файлов:', error);
      toast({
        title: 'Ошибка обработки файлов',
        description: 'Не удалось обработать изображения',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Делаем копию файлов до очистки input
    const newFiles = Array.from(files);
    
    // Обрабатываем файлы
    await processNewFiles(newFiles);
    
    // Важно: сбрасываем значение input, чтобы можно было выбрать тот же файл снова
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
    
    // Если удаляем файл, который в превью, закрываем превью или показываем другой
    if (previewImage && previewIndex === index) {
      if (newFiles.length > 0) {
        const newIndex = Math.min(index, newFiles.length - 1);
        handlePreview(newFiles[newIndex], newIndex);
      } else {
        setPreviewImage(null);
      }
    }
  };

  const handlePreview = (file: File, index: number) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
      setPreviewIndex(index);
      setPreviewType('file');
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCameraUpload = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handlePreviousImage = () => {
    if (previewIndex > 0) {
      const prevIndex = previewIndex - 1;
      handlePreview(selectedFiles[prevIndex], prevIndex);
    }
  };

  const handleNextImage = () => {
    if (previewIndex < selectedFiles.length - 1) {
      const nextIndex = previewIndex + 1;
      handlePreview(selectedFiles[nextIndex], nextIndex);
    }
  };

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
            {isCompressing ? 'Сжатие...' : 'Выбрать из галереи'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleCameraUpload}
            disabled={disabled || !isToday || isCompressing}
            className="gap-1.5"
          >
            <ImageIcon className="w-4 h-4" />
            {isCompressing ? 'Сжатие...' : 'Сделать фото'}
          </Button>
        </div>

        {/* Скрытый input для галереи */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {/* Отдельный input для камеры */}
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
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">
                Выбранные файлы ({selectedFiles.length}/{maxFiles}):
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedFiles.length > 0) {
                    handlePreview(selectedFiles[0], 0);
                  }
                }}
                className="text-xs"
              >
                Показать все
              </Button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                  className="relative group border rounded-lg overflow-hidden bg-gray-100 hover:border-primary transition-colors"
                >
                  <div className="aspect-square">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handlePreview(file, index)}
                    />
                  </div>
                  
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(index);
                      }}
                      className="h-6 w-6 p-0 bg-white/90 hover:bg-white"
                      disabled={disabled}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <div className="text-white text-xs truncate">
                      {file.name.length > 15 
                        ? `${file.name.substring(0, 12)}...${file.name.substring(file.name.lastIndexOf('.'))}`
                        : file.name}
                    </div>
                    <div className="text-white/80 text-xs">
                      {(file.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                  
                  {index === 0 && selectedFiles.length > 1 && (
                    <div className="absolute top-1 left-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {selectedFiles.length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Улучшенное модальное окно предпросмотра */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Кнопка закрытия */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 h-10 w-10 p-0 bg-black/50 hover:bg-black/70 text-white z-10"
            >
              <X className="w-5 h-5" />
            </Button>
            
            {/* Кнопки навигации */}
            {selectedFiles.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviousImage}
                  disabled={previewIndex === 0}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 bg-black/50 hover:bg-black/70 text-white z-10 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextImage}
                  disabled={previewIndex === selectedFiles.length - 1}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 bg-black/50 hover:bg-black/70 text-white z-10 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}
            
            {/* Информация о файле */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded-lg z-10">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {selectedFiles[previewIndex]?.name}
                  </div>
                  <div className="text-sm text-gray-300">
                    {(selectedFiles[previewIndex]?.size / 1024).toFixed(1)} KB • 
                    {previewIndex + 1} из {selectedFiles.length}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(previewImage, '_blank')}
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Открыть в новой вкладке
                </Button>
              </div>
            </div>
            
            {/* Изображение */}
            <div className="flex items-center justify-center h-full">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                onError={(e) => {
                  console.error('Ошибка загрузки изображения');
                  e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="16">Ошибка загрузки изображения</text></svg>';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};