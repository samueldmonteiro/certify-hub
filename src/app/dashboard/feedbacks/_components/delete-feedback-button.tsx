'use client';

import { useState } from 'react';
import { Button } from '@/src/app/_components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteFeedbackAction } from '@/src/app/_actions/feedback';
import { toast } from 'sonner';

interface DeleteFeedbackButtonProps {
  id: string;
}

export function DeleteFeedbackButton({ id }: DeleteFeedbackButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este feedback? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteFeedbackAction(id);

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
      title="Excluir feedback"
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Excluir</span>
    </Button>
  );
}
