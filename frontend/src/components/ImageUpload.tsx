// @/components/ImageUpload/ImageUpload.tsx
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Eye, Image as ImageIcon } from 'lucide-react';
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

const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad/i.test(navigator.userAgent);

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

  /* =======================
     VALIDATION
  ======================= */

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
    ];

    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Неверный формат',
        description: `Формат ${file.type} не поддерживается`,
        variant: 'destructive',
      });
      return false;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast({
        title: 'Файл слишком большой',
        description: `Макс: ${maxSizeMB}MB`,
        variant: 'destructive',
      });
      return false;
    }

    if (selectedFiles.length >= maxFiles) {
      toast({
        title: 'Лимит файлов',
        description: `Максимум ${maxFiles}`,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  /* =======================
     FILE HANDLER
  ======================= */

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fromCamera: boolean
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const incoming = Array.from(files).filter(validateFile);
    if (incoming.length === 0) return;

    setIsCompressing(true);

    try {
      let processedFiles: File[];

      // ❗ НЕ сжимаем фото с камеры на мобильных (iOS баги)
      if (fromCamera && isMobile) {
        processedFiles = incoming;
      } else {
        processedFiles = await Promise.all(
          incoming.map((file) => compressImage(file))
        );
      }

      onFilesChange([...selectedFiles, ...processedFiles]);

      toast({
        title: 'Файлы добавлены',
        description: `Добавлено: ${processedFiles.length}`,
      });
    } catch (err) {
      console.error('Image upload error:', err);
      toast({
        title: 'Ошибка обработки',
        description: 'Попробуйте выбрать фото из галереи',
        variant: 'destructive',
      });
    } finally {
      setIsCompressing(false);
      e.target.value = ''; // 🔴 КРИТИЧНО
    }
  };

  /* =======================
     ACTIONS
  ======================= */

  const openFilePicker = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.value = ''; // 🔴 КРИТИЧНО
    fileInputRef.current.click();
  };

  const openCamera = () => {
    if (!cameraInputRef.current) return;
    cameraInputRef.current.value = ''; // 🔴 КРИТИЧНО
    cameraInputRef.current.click();
  };

  const removeFile = (index: number) => {
    const copy = [...selectedFiles];
    copy.splice(index, 1);
    onFilesChange(copy);
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* =======================
     RENDER
  ======================= */

  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            onClick={openFilePicker}
            disabled={disabled || !isToday || isCompressing}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isCompressing ? 'Обработка…' : 'Выбрать файлы'}
          </Button>

          {isMobile && (
            <Button
              type="button"
              variant="outline"
              onClick={openCamera}
              disabled={disabled || !isToday || isCompressing}
            >
              📷 Камера
            </Button>
          )}
        </div>

        {/* INPUTS */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, false)}
        />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFileSelect(e, true)}
        />

        {/* FILE LIST */}
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {selectedFiles.map((file, i) => (
              <div key={`${file.name}-${i}`} className="border rounded-lg p-3">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2 truncate">
                    <ImageIcon className="w-4 h-4" />
                    <span className="truncate text-sm">{file.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(i)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{(file.size / 1024).toFixed(1)} KB</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => previewFile(file)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Просмотр
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full">
            <div className="flex justify-between p-3 border-b">
              <span className="font-medium">Просмотр</span>
              <Button size="sm" variant="ghost" onClick={() => setPreviewImage(null)}>
                <X />
              </Button>
            </div>
            <img src={previewImage} className="max-w-full max-h-[80vh] m-auto p-4" />
          </div>
        </div>
      )}
    </>
  );
};
