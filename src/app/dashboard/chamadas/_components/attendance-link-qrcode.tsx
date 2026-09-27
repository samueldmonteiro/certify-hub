'use client';

import { useId } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/src/app/_components/ui/button';
import { Input } from '@/src/app/_components/ui/input';
import { Download, QrCode } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/app/_components/ui/dialog';

interface AttendanceLinkQRCodeProps {
  url: string;
  fileName: string;
  triggerLabel?: string;
  triggerVariant?: 'default' | 'outline' | 'ghost';
  triggerSize?: 'default' | 'icon';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}

export function AttendanceLinkQRCode({
  url,
  fileName,
  triggerLabel = 'QR Code',
  triggerVariant = 'outline',
  triggerSize = 'default',
  open,
  onOpenChange,
  hideTrigger = false,
}: AttendanceLinkQRCodeProps) {
  const canvasId = useId();

  const downloadQRCode = () => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${fileName}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className="flex items-center gap-2"
            title="Gerar QR Code"
          >
            <QrCode className="w-4 h-4" />
            {triggerLabel}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code da Chamada</DialogTitle>
          <DialogDescription>
            Compartilhe este QR Code ou o link abaixo para que os alunos possam registrar presença.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-2 gap-6">
          <div className="p-4 bg-white rounded-xl shadow-sm border">
            {url && (
              <QRCodeCanvas
                id={canvasId}
                value={url}
                size={220}
                bgColor={'#ffffff'}
                fgColor={'#000000'}
                level={'H'}
                includeMargin={false}
              />
            )}
          </div>
          <Input readOnly value={url} onFocus={(e) => e.target.select()} className="text-center" />
          <Button onClick={downloadQRCode} className="w-full flex items-center gap-2">
            <Download className="w-4 h-4" />
            Baixar QR Code (PNG)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
