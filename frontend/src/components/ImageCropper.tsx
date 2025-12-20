// @/components/ImageCropper.tsx
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Crop, 
  RotateCw, 
  ZoomIn, 
  ZoomOut,
  Check,
  X
} from 'lucide-react';

interface ImageCropperProps {
  image: File;
  onCrop: (croppedFile: File) => void;
  onCancel: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCrop,
  onCancel
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleCrop = async () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Устанавливаем размер канваса как размер обрезки
    canvas.width = crop.width;
    canvas.height = crop.height;
    
    // Очищаем канвас
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем обрезанную область
    ctx.drawImage(
      imageRef.current,
      crop.x, crop.y, crop.width, crop.height, // source
      0, 0, crop.width, crop.height // destination
    );
    
    // Конвертируем в File
    canvas.toBlob(async (blob) => {
      if (blob) {
        const croppedFile = new File(
          [blob],
          `cropped_${image.name}`,
          { type: 'image/jpeg', lastModified: Date.now() }
        );
        onCrop(croppedFile);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold flex items-center gap-2">
            <Crop className="w-5 h-5" />
            Обрежьте таблицу накладной
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button size="sm" onClick={handleCrop}>
              <Check className="w-4 h-4 mr-2" />
              Сохранить обрезку
            </Button>
          </div>
        </div>
        
        <div className="p-4 overflow-auto">
          <div className="relative border-2 border-dashed border-blue-400">
            <img
              ref={imageRef}
              src={URL.createObjectURL(image)}
              alt="Для обрезки"
              className="max-w-full max-h-[60vh] object-contain"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`
              }}
            />
            
            {/* Selection rectangle */}
            {isCropping && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-500/20"
                style={{
                  left: `${crop.x}px`,
                  top: `${crop.y}px`,
                  width: `${crop.width}px`,
                  height: `${crop.height}px`,
                  cursor: 'move'
                }}
              />
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                <ZoomIn className="w-4 h-4 inline mr-2" />
                Масштаб
              </label>
              <Slider
                value={[scale]}
                min={0.5}
                max={3}
                step={0.1}
                onValueChange={([value]) => setScale(value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                <RotateCw className="w-4 h-4 inline mr-2" />
                Поворот
              </label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation(r => r - 90)}
                >
                  -90°
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation(0)}
                >
                  Сброс
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation(r => r + 90)}
                >
                  +90°
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                <Crop className="w-4 h-4 inline mr-2" />
                Режим обрезки
              </label>
              <Button
                variant={isCropping ? "default" : "outline"}
                size="sm"
                onClick={() => setIsCropping(!isCropping)}
              >
                {isCropping ? 'Завершить выделение' : 'Начать обрезку'}
              </Button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>💡 <strong>Совет:</strong> Выделите только область с таблицей, без фона и лишних деталей.</p>
            <p>📊 <strong>Экономия:</strong> Обрезка снизит стоимость обработки на 80-90%!</p>
          </div>
        </div>
      </div>
    </div>
  );
};