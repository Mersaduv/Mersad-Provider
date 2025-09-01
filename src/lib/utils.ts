import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate slug from Persian/English text
export function generateSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    // Replace Persian characters with their English equivalents
    .replace(/[آ]/g, 'a')
    .replace(/[ا]/g, 'a')
    .replace(/[ب]/g, 'b')
    .replace(/[پ]/g, 'p')
    .replace(/[ت]/g, 't')
    .replace(/[ث]/g, 'th')
    .replace(/[ج]/g, 'j')
    .replace(/[چ]/g, 'ch')
    .replace(/[ح]/g, 'h')
    .replace(/[خ]/g, 'kh')
    .replace(/[د]/g, 'd')
    .replace(/[ذ]/g, 'z')
    .replace(/[ر]/g, 'r')
    .replace(/[ز]/g, 'z')
    .replace(/[س]/g, 's')
    .replace(/[ش]/g, 'sh')
    .replace(/[ص]/g, 's')
    .replace(/[ض]/g, 'z')
    .replace(/[ط]/g, 't')
    .replace(/[ظ]/g, 'z')
    .replace(/[ع]/g, 'a')
    .replace(/[غ]/g, 'gh')
    .replace(/[ف]/g, 'f')
    .replace(/[ق]/g, 'gh')
    .replace(/[ک]/g, 'k')
    .replace(/[گ]/g, 'g')
    .replace(/[ل]/g, 'l')
    .replace(/[م]/g, 'm')
    .replace(/[ن]/g, 'n')
    .replace(/[و]/g, 'v')
    .replace(/[ه]/g, 'h')
    .replace(/[ی]/g, 'y')
    .replace(/[ئ]/g, 'e')
    .replace(/[ة]/g, 'h')
    .replace(/[ي]/g, 'y')
    .replace(/[ى]/g, 'a')
    .replace(/[ؤ]/g, 'o')
    .replace(/[إ]/g, 'e')
    .replace(/[أ]/g, 'a')
    .replace(/[ء]/g, 'a')
    // Replace spaces and special characters with hyphens
    .replace(/[\s\W]+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length
    .substring(0, 60);
}
export const phoneNumber = "+93702185538";