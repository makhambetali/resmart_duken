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
