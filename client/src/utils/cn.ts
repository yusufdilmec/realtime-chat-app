import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind sınıflarını güvenli bir şekilde birleştirmek için yardımcı fonksiyon
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
