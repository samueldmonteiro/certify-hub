'use client';

import { useState } from 'react';
import { Button } from '@/src/app/_components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/app/_components/ui/tooltip';
import { Trash2 } from 'lucide-react';
import { deleteAttendancePresenceAction } from '@/src/app/_actions/attendance';
import { toast } from 'sonner';

interface DeleteAttendancePresenceButtonProps {
  id: string;
  callId: string;
}

export function DeleteAttendancePresenceButton({ id, callId }: DeleteAttendancePresenceButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este registro de presença? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteAttendancePresenceAction(id, callId);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsDeleting(false);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Excluir</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Excluir registro de presença</TooltipContent>
    </Tooltip>
  );
}
