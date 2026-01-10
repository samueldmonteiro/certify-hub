'use client';

import { Button } from '@/src/app/_components/ui/button';
import { FileText } from 'lucide-react';

interface GenerateButtonProps {
  selectedCount: number;
  isGenerating: boolean;
  onGenerate: () => void;
}

export default function GenerateButton({
  selectedCount,
  isGenerating,
  onGenerate,
}: GenerateButtonProps) {
  return (
    <div className="flex justify-end">
      <Button
        size="lg"
        onClick={onGenerate}
        disabled={selectedCount === 0 || isGenerating}
        className="min-w-50"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
            Gerando...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Gerar {selectedCount} Certificado{selectedCount !== 1 ? 's' : ''}
          </>
        )}
      </Button>
    </div>
  );
}