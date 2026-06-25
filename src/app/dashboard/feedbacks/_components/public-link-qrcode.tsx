'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/src/app/_components/ui/button';
import { Download, QrCode } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/app/_components/ui/dialog';
import { useEffect, useState } from 'react';

export function PublicLinkQRCode() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(`${window.location.origin}/avaliar`);
  }, []);

  const downloadQRCode = () => {
    const canvas = document.getElementById('public-link-qrcode') as HTMLCanvasElement;
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'qrcode-avaliar.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <QrCode className="w-4 h-4" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code do Formulário</DialogTitle>
          <DialogDescription>
            Compartilhe este QR Code para que os alunos possam acessar o formulário de avaliação.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 gap-6">
          <div className="p-4 bg-white rounded-xl shadow-sm border">
            {url && (
              <QRCodeCanvas
                id="public-link-qrcode"
                value={url}
                size={220}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={false}
              />
            )}
          </div>
          <Button onClick={downloadQRCode} className="w-full flex items-center gap-2">
            <Download className="w-4 h-4" />
            Baixar Imagem (PNG)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
