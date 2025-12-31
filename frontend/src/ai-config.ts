// @/config/ai-config.ts
export const AI_CONFIG = {
  ENABLED: false, // Включить/выключить AI обработку
  MAX_IMAGE_SIZE_KB: 3000, // Максимальный размер сжатого изображения
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  PROCESS_TIMEOUT_MS: 30000, // Таймаут обработки файла
} as const;