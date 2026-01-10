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

export const formatDateToPTBR = (date: Date)=>{
  
  const opcoes: Intl.DateTimeFormatOptions = {
    day: '2-digit', // Para garantir dois dígitos (ex: 01)
    month: '2-digit', // Para garantir dois dígitos (ex: 01)
    year: 'numeric', // Para o ano completo (ex: 2026)
  };

  // 'pt-BR' garante o formato dia/mês/ano
  return date.toLocaleDateString('pt-BR', opcoes);
};

