import { X, Download, User, BookOpen, Calendar, Clock, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { CertificateTypeLabels } from '@/src/core/enums/certificate-type.enum';

interface ViewCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: any | null;
  onDownload: (id: string, name: string) => Promise<void>;
}

export function ViewCertificateModal({
  isOpen,
  onClose,
  certificate,
  onDownload,
}: ViewCertificateModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !certificate) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload(certificate.id, certificate.studentName);
    } finally {
      setIsDownloading(false);
    }
  };

  const typeLabel = CertificateTypeLabels[certificate.type as keyof typeof CertificateTypeLabels] || certificate.type;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background text-foreground rounded-xl shadow-lg border border-border w-full max-w-lg overflow-hidden flex flex-col">
        <div className="bg-muted px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center">
            Detalhes do Certificado
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start border-b border-border pb-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Aluno
              </p>
              <h3 className="text-lg font-bold">{certificate.studentName}</h3>
              <p className="text-sm text-muted-foreground mt-1">CPF: {certificate.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</p>
            </div>
            <div className="text-right space-y-1">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                Reg: {certificate.registrationNumber}
              </span>
              <div className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ml-1">
                {typeLabel}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Curso
              </p>
              <p className="font-medium">{certificate.courseName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Carga Horária
              </p>
              <p className="font-medium">{certificate.workload} horas</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Conclusão
              </p>
              <p className="font-medium">{formatDate(certificate.completionDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Emissão
              </p>
              <p className="font-medium">{formatDate(certificate.createdAt)}</p>
            </div>
          </div>

          <div className="flex gap-2 text-xs text-muted-foreground pt-2 flex-wrap items-center">
            <span>Página: <strong className="text-foreground">{certificate.page}</strong></span>
            <span className="text-border">|</span>
            <span>Livro PTS: <strong className="text-foreground">{certificate.ptsBook}</strong></span>
            <span className="text-border">|</span>
            <span>ID: <code className="text-[10px] bg-muted/50 px-1 rounded">{certificate.id}</code></span>
          </div>
        </div>

        <div className="px-6 py-4 bg-muted/30 flex justify-end gap-3 border-t border-border mt-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Fechar
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Baixar Certificado
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
