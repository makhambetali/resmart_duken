import React from 'react';
import { X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SupplyImage {
  id: string;
  image: string;
  supply: string;
}

interface ImagePreviewProps {
  images: (File | SupplyImage)[];
  onRemove: (index: number) => void;
  onRemoveExisting?: (imageId: string) => void;
  disabled?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  images,
  onRemove,
  onRemoveExisting,
  disabled = false,
}) => {
  const getImageUrl = (image: File | SupplyImage): string => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image.image;
  };

  const isExistingImage = (image: File | SupplyImage): image is SupplyImage => {
    return !(image instanceof File);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
      {images.map((image, index) => (
        <div key={isExistingImage(image) ? image.id : index} className="relative group">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
            <img
              src={getImageUrl(image)}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {!disabled && (
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={() => {
                  if (isExistingImage(image) && onRemoveExisting) {
                    onRemoveExisting(image.id);
                  } else {
                    onRemove(index);
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={() => {
                  const url = getImageUrl(image);
                  window.open(url, '_blank');
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-black/50 text-white text-xs px-2 py-1 rounded text-center">
              {isExistingImage(image) ? 'Загружено' : 'Новое'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};