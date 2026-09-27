'use client';

import { useState } from 'react';
import { Button } from '@/src/app/_components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteAttendanceCallAction } from '@/src/app/_actions/attendance';
import { toast } from 'sonner';

interface DeleteAttendanceCallButtonProps {
  id: string;
}

export function DeleteAttendanceCallButton({ id }: DeleteAttendanceCallButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta chamada? Todos os registros de presença vinculados a ela também serão excluídos. Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteAttendanceCallAction(id);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsDeleting(false);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={handleDelete}
      disabled={isDeleting}
      title="Excluir chamada"
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Excluir</span>
    </Button>
  );
}
