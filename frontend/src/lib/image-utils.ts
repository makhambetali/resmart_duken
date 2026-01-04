// @/lib/image-utils.ts
export const compressImage = async (file: File, maxSizeKB = 3000): Promise<File> => {
  // Если не изображение, возвращаем как есть
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // Если размер уже меньше лимита, не сжимаем
  if (file.size <= maxSizeKB * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Рассчитываем новые размеры сохраняя пропорции
        let width = img.width;
        let height = img.height;
        const maxDimension = 1600; // Максимальный размер любой стороны

        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        // Настройка качества для разных форматов
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = 'image/jpeg'; // Всегда конвертируем в JPEG для лучшего сжатия
        const quality = Math.max(0.6, Math.min(0.9, maxSizeKB / 500)); // Адаптивное качество

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Blob creation failed'));
              return;
            }

            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '') + '.jpg',
              {
                type: mimeType,
                lastModified: Date.now(),
              }
            );

            // Рекурсивное сжатие если все еще слишком большой
            if (compressedFile.size > maxSizeKB * 1024 * 1.1) {
              compressImage(compressedFile, maxSizeKB).then(resolve).catch(reject);
            } else {
              resolve(compressedFile);
            }
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Image loading failed'));
      };
    };

    reader.onerror = () => {
      reject(new Error('File reading failed'));
    };
  });
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Убираем data:image/...;base64,
    };
    reader.onerror = error => reject(error);
  });
};