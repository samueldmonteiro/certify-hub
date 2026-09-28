'use client';

import { Button } from '@/src/app/_components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/app/_components/ui/tooltip';
import { Link2 } from 'lucide-react';
import { toast } from 'sonner';

interface CopyLinkButtonProps {
  url: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'icon';
  label?: string;
}

export function CopyLinkButton({ url, variant = 'ghost', size = 'icon', label }: CopyLinkButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copiado para a área de transferência!');
    } catch {
      toast.error('Não foi possível copiar o link.');
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={size}
          className="flex items-center gap-2"
          onClick={handleCopy}
        >
          <Link2 className="w-4 h-4" />
          {label}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copiar link do formulário</TooltipContent>
    </Tooltip>
  );
}
