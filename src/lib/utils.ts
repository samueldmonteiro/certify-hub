import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCutName(fullname: string) {
  const phrases = fullname.split(' ');

  const cutName = phrases.map(palavra => {
    return palavra.charAt(0).toUpperCase();
  });

  return cutName.join('');
}