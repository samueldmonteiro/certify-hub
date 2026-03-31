'use client';

import { Button } from '@/src/app/_components/ui/button';
import { UserPlus } from 'lucide-react';

interface RegisterButtonProps {
  selectedCount: number;
  isRegistering: boolean;
  onRegister: () => void;
}

export default function RegisterButton({
  selectedCount,
  isRegistering,
  onRegister,
}: RegisterButtonProps) {
  return (
    <div className="flex justify-end">
      <Button
        size="lg"
        onClick={onRegister}
        disabled={selectedCount === 0 || isRegistering}
        className="min-w-50"
      >
        {isRegistering ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
            Cadastrando...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Cadastrar {selectedCount} Aluno{selectedCount !== 1 ? 's' : ''}
          </>
        )}
      </Button>
    </div>
  );
}
