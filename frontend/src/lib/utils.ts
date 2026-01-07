import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (value: string): string => {
  // Remove all non-digit characters
  const numericValue = value.replace(/\D/g, '');
  // Add space as a thousand separator
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const capitalize = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// Removes thousand separators to get the raw numeric string
export const getNumericValue = (formattedValue: string): string => {
  return formattedValue.replace(/\s/g, '');
};

// В @/lib/utils.ts добавьте:
export const formatDateTime = (dateTimeString: string): string => {
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    return dateTimeString;
  }
};
const capitalizeWords = (value: string) =>
  value.replace(/\p{L}+/gu, word =>
    word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
  );