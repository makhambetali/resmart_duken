// Альтернативная версия ImageViewer без Dialog
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, RotateCcw } from 'lucide-react';

interface ImageData {
  id: number;
  image: string;
}

interface ImageViewerProps {
  images: ImageData[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Сброс состояния при закрытии
  useEffect(() => {
    if (!open) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [open, initialIndex]);

  // Обновление currentIndex при изменении initialIndex
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, open]);

  // Навигация с помощью клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'Escape':
          onOpenChange(false);
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRotateRight();
          break;
        case '0':
          e.preventDefault();
          setScale(1);
          setPosition({ x: 0, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, currentIndex, images.length, onOpenChange]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, [images.length]);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  }, []);

  const handleRotateRight = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleRotateLeft = useCallback(() => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1 && rotation === 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.max(0.5, Math.min(3, prev + delta)));
    }
  };

  if (!open || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center">
      {/* Панель управления */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
          <span className="text-white text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Кнопки поворота */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRotateLeft}
            className="text-white hover:bg-white/20"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRotateRight}
            className="text-white hover:bg-white/20"
          >
            <RotateCw className="h-5 w-5" />
          </Button>

          {/* Кнопки масштабирования */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className="text-white hover:bg-white/20"
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          
          <div className="text-white text-sm min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            className="text-white hover:bg-white/20"
            disabled={scale >= 3}
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Навигационные кнопки */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Контейнер изображения */}
      <div 
        className="flex items-center justify-center w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="relative transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
          }}
        >
          <img
            src={currentImage.image}
            alt={`Изображение ${currentIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain select-none"
            draggable="false"
          />
        </div>
      </div>

      {/* Миниатюры */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-center gap-2 overflow-x-auto py-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setScale(1);
                  setPosition({ x: 0, y: 0 });
                  setRotation(0);
                }}
                className={`relative flex-shrink-0 transition-all ${index === currentIndex ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'}`}
              >
                <img
                  src={image.image}
                  alt={`Миниатюра ${index + 1}`}
                  className="w-16 h-16 object-cover rounded"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Горячие клавиши */}
      <div className="absolute bottom-4 left-4 text-white/60 text-xs hidden md:block">
        <div>← → для навигации</div>
        <div>+ - для масштабирования</div>
        <div>R для поворота вправо</div>
        <div>ESC для выхода</div>
      </div>
    </div>
  );
};