'use client';

import { useActionState, useEffect, useId, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { createAttendanceCallAction } from '@/src/app/_actions/attendance';
import { Button } from '@/src/app/_components/ui/button';
import { Input } from '@/src/app/_components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/app/_components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/src/app/_components/ui/field';
import { Alert } from '@/src/app/_components/custom/alert';
import { CheckCircle2, Download, Plus } from 'lucide-react';
import { CopyLinkButton } from './copy-link-button';

function CreateCallForm({
  onCreated,
}: {
  onCreated: (call: { id: string; name: string }) => void;
}) {
  const [state, formAction, isPending] = useActionState(createAttendanceCallAction, undefined);

  useEffect(() => {
    if (state?.success && state.call) {
      onCreated(state.call);
    }
  }, [state, onCreated]);

  return (
    <form action={formAction} className="space-y-4">
      <FieldGroup>
        {state?.message && !state?.success && (
          <Alert title={state.message} variant="error" />
        )}
        <Field>
          <FieldLabel htmlFor="name" className="font-medium">Nome da Chamada</FieldLabel>
          <Input
            id="name"
            name="name"
            placeholder="Ex: Brigada de Incêndio - Filial SP - 27/09/2026"
            required
            autoFocus
          />
          {state?.errors?.name && (
            <p className="text-sm text-red-500 mt-1">{state.errors.name[0]}</p>
          )}
        </Field>
      </FieldGroup>
      <DialogFooter>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Criando...' : 'Criar Chamada'}
        </Button>
      </DialogFooter>
    </form>
  );
}

function CreatedCallResult({
  url,
  callName,
  onDone,
}: {
  url: string;
  callName: string;
  onDone: () => void;
}) {
  const canvasId = useId();

  const downloadQRCode = () => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `qrcode-chamada-${callName.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <p className="text-sm text-muted-foreground">
          Compartilhe o link ou o QR Code abaixo com os alunos para que registrem presença.
        </p>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-sm border">
        <QRCodeCanvas
          id={canvasId}
          value={url}
          size={220}
          bgColor={'#ffffff'}
          fgColor={'#000000'}
          level={'H'}
          includeMargin={false}
        />
      </div>

      <div className="flex w-full gap-2">
        <Input readOnly value={url} onFocus={(e) => e.target.select()} className="text-center" />
        <CopyLinkButton url={url} variant="outline" size="icon" />
      </div>

      <Button onClick={downloadQRCode} className="w-full flex items-center gap-2">
        <Download className="w-4 h-4" />
        Baixar QR Code (PNG)
      </Button>

      <Button variant="outline" onClick={onDone} className="w-full">
        Concluir
      </Button>
    </div>
  );
}

interface CreateAttendanceCallDialogProps {
  baseUrl: string;
}

export function CreateAttendanceCallDialog({ baseUrl }: CreateAttendanceCallDialogProps) {
  const [open, setOpen] = useState(false);
  const [createdCall, setCreatedCall] = useState<{ id: string; name: string } | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setCreatedCall(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Chamada
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{createdCall ? 'Chamada Criada' : 'Nova Chamada de Presença'}</DialogTitle>
          <DialogDescription>
            {createdCall
              ? createdCall.name
              : 'Dê um nome para identificar esta chamada. Um link e QR Code serão gerados para você enviar aos alunos.'}
          </DialogDescription>
        </DialogHeader>
        {createdCall ? (
          <CreatedCallResult
            url={`${baseUrl}/presenca/${createdCall.id}`}
            callName={createdCall.name}
            onDone={() => handleOpenChange(false)}
          />
        ) : (
          <CreateCallForm onCreated={setCreatedCall} />
        )}
      </DialogContent>
    </Dialog>
  );
}
