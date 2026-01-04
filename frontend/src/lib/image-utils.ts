// @/lib/image-utils.ts

type CompressOptions = {
  maxSizeKB?: number;
  maxDimension?: number;
  maxIterations?: number;
};

export const compressImage = async (
  file: File,
  {
    maxSizeKB = 1000,
    maxDimension = 1600,
    maxIterations = 6,
  }: CompressOptions = {}
): Promise<File> => {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const maxBytes = maxSizeKB * 1024;

  if (file.size <= maxBytes) {
    return file;
  }

  // Определяем формат
  const isPng = file.type === 'image/png';
  const mimeType = isPng ? 'image/png' : 'image/jpeg';

  // Загружаем изображение с учётом EXIF-ориентации
  const bitmap = await createImageBitmap(file, {
    imageOrientation: 'from-image',
  });

  let width = bitmap.width;
  let height = bitmap.height;

  // Масштабируем с сохранением пропорций
  if (width > maxDimension || height > maxDimension) {
    const ratio = Math.min(maxDimension / width, maxDimension / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  ctx.drawImage(bitmap, 0, 0, width, height);

  let quality = 0.85;
  let outputBlob: Blob | null = null;

  for (let i = 0; i < maxIterations; i++) {
    outputBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(
        (blob) => resolve(blob),
        mimeType,
        isPng ? undefined : quality
      )
    );

    if (!outputBlob) break;

    if (outputBlob.size <= maxBytes * 1.05) {
      break;
    }

    // Понижаем качество постепенно
    quality -= 0.1;

    if (quality < 0.4) {
      break;
    }
  }

  if (!outputBlob) {
    return file;
  }

  return new File(
    [outputBlob],
    file.name.replace(/\.[^/.]+$/, '') +
      (mimeType === 'image/png' ? '.png' : '.jpg'),
    {
      type: mimeType,
      lastModified: Date.now(),
    }
  );
};
