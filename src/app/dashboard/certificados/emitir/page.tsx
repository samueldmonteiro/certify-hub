'use client';

import { useState } from 'react';
import { FileSpreadsheet, Plus, Download, FileCheck, Loader2, X, ShowerHead } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/app/_components/ui/tabs';
import FileUploadSection from '@/src/app/_components/generate-certificate/file-upload-section';
import StudentTable from '@/src/app/_components/generate-certificate/student-table';
import SingleStudentForm from '@/src/app/_components/generate-certificate/single-student-form';
import GenerateButton from '@/src/app/_components/generate-certificate/generate-button';
import { Alert } from '@/src/app/_components/custom/alert';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { GenerateCertificatesResponse } from '@/src/app/api/certificates/generate/route';
import { formatDateToPTBR } from '@/src/lib/utils';
import { redirect } from 'next/navigation';

function GenerationSuccessModal({
  isOpen,
  onClose,
  totalCertificates,
  onDownloadAll,
  isDownloading,
}: {
  isOpen: boolean;
  onClose: () => void;
  totalCertificates: number;
  onDownloadAll: () => void;
  isDownloading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isDownloading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          disabled={isDownloading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Ícone de Sucesso com Animação */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75" />
            <div className="relative bg-green-700 rounded-full p-4">
              <FileCheck className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-gray-700 text-2xl font-bold text-center mb-2">
          Certificados Gerados!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {totalCertificates} {totalCertificates === 1 ? 'certificado foi gerado' : 'certificados foram gerados'} com sucesso
        </p>

        <div className="space-y-3">
          <button
            onClick={() => redirect('/dashboard/certificados')}
            disabled={isDownloading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Baixando...
              </>
            ) :
              false ? (
                <>
                  <Download className="h-5 w-5" />
                  {totalCertificates === 1 ? 'Baixar Certificado' : 'Baixar Todos os Certificados'}
                </>
              ) : (
                <>
                  <ShowerHead className="h-5 w-5" />
                  {totalCertificates === 1 ? 'Visualizar Certificado' : 'Visualzar Certificados'}</>
              )
            }
          </button>

          <button
            onClick={onClose}
            disabled={isDownloading}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// Overlay de Geração com Animação
function GeneratingOverlay({ isGenerating, progress }: { isGenerating: boolean; progress: number }) {
  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Spinner Animado */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse" />
            <div className="relative">
              <Loader2 className="h-16 w-16 text-orange-600 animate-spin" />
            </div>
          </div>
        </div>

        <h3 className="text-xl text-gray-700 font-bold text-center mb-2">
          Gerando Certificados
        </h3>
        <p className="text-center text-gray-600 mb-6">
          Por favor, aguarde enquanto processamos seus certificados...
        </p>

        {/* Barra de Progresso */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-linear-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-[shimmer_1s_infinite]" />
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          {progress}%
        </p>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export default function CertificadosPage() {
  const [students, setStudents] = useState<CertificateDraft[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<CertificateDraft[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [studentsDataError, setStudentsDataError] = useState<string | null>(null);
  const [generatedCertificates, setGeneratedCertificates] = useState<any[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFileProcessed = (data: CertificateDraft[]) => {
    setStudents(data);
    setSelectedStudents([]);
    setStudentsDataError(null);
  };

  const handleSelectionChange = (selected: CertificateDraft[]) => {
    setSelectedStudents(selected);
  };

  function getFirstZodError(errors: any): string | null {
    if (!errors) return null;

    if (Array.isArray(errors._errors) && errors._errors.length > 0) {
      return errors._errors[0];
    }

    for (const key of Object.keys(errors)) {
      const value = errors[key];
      if (typeof value === 'object') {
        const found = getFirstZodError(value);
        if (found) return found;
      }
    }

    return null;
  }

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStudentsDataError(null);
    setProgress(0);
    setGeneratedCertificates([]);

    const dataRequest: any[] = [];
    selectedStudents.forEach(d => {
      dataRequest.push({
        studentName: d.studentName,
        courseName: d.courseName,
        completionDate: formatDateToPTBR(d.completionDate),
        cpf: d.cpf.getValue(),
        workload: d.workload,
      });
    });

    // Dividir em lotes de 2
    const batchSize = 2;
    const batches: any[][] = [];
    for (let i = 0; i < dataRequest.length; i += batchSize) {
      batches.push(dataRequest.slice(i, i + batchSize));
    }

    setProgress(5);

    try {
      let allErrors: any = null;
      let successCount = 0;
      const allCertificates: any[] = [];

      // Processar cada lote
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];

        const res = await fetch('/api/certificates/generate', {
          method: 'POST',
          body: JSON.stringify(batch),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const generate = await res.json() as GenerateCertificatesResponse;
        console.log('Batch response:', generate);

        // Atualizar progresso
        const progressPercent = Math.floor(((i + 1) / batches.length) * 85) + 5;
        setProgress(progressPercent);

        // Acumular erros se houver
        if (generate.errors || !generate.success) {
          if (!allErrors) {
            allErrors = generate.errors;
          }
          break; // Para no primeiro erro
        } else if (generate.data) {
          successCount += generate.data.length;
          allCertificates.push(...generate.data);
        }
      }

      // Progresso final
      setProgress(95);
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 400));

      setIsGenerating(false);

      if (allErrors) {
        setStudentsDataError('Erro em algum dos dados do arquivo: ' + getFirstZodError(allErrors));
      } else {
        setGeneratedCertificates(allCertificates);
        setGeneratedCount(successCount);
        setShowSuccessModal(true);
      }
    } catch (error) {
      setIsGenerating(false);
      setStudentsDataError('Erro ao gerar certificados. Tente novamente.');
      console.error('Erro ao gerar certificados:', error);
    }
  };

  const handleGenerateSingle = async (student: CertificateDraft) => {
    setIsGenerating(true);
    setStudentsDataError(null);
    setGeneratedCertificates([]);
    setProgress(15);
    await new Promise(resolve => setTimeout(resolve, 600));
    setProgress(30);

    const dataRequest: any[] = [];
    dataRequest.push({
      studentName: student.studentName,
      courseName: student.courseName,
      completionDate: formatDateToPTBR(student.completionDate),
      cpf: student.cpf.getValue(),
      workload: student.workload,
    });

    try {
      setProgress(50);
      const res = await fetch('/api/certificates/generate', {
        method: 'POST',
        body: JSON.stringify(dataRequest),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await res.json() as GenerateCertificatesResponse;
      console.log('Single student response:', response);

      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsGenerating(false);

      if (response.errors || !response.success) {
        setStudentsDataError('Erro ao gerar certificado: ' + (getFirstZodError(response.errors) || 'Erro desconhecido'));
      } else if (response.data) {
        setGeneratedCertificates(response.data);
        setGeneratedCount(response.data.length);
        setShowSuccessModal(true);
      }
    } catch (error) {
      setIsGenerating(false);
      setStudentsDataError('Erro ao gerar certificado. Tente novamente.');
      console.error('Erro ao gerar certificado:', error);
    }
  };

  const handleDownloadAll = async () => {
    if (generatedCertificates.length === 0) return;

    setIsDownloading(true);

    try {
      if (generatedCertificates.length === 1) {
        // Download único
        const cert = generatedCertificates[0];
        if (cert.fileURL) {
          const link = document.createElement('a');
          link.href = cert.fileURL;
          link.download = `certificado_${cert.studentName.replace(/\s+/g, '_')}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        // Download múltiplo
        for (const cert of generatedCertificates) {
          if (cert.fileURL) {
            const link = document.createElement('a');
            link.href = cert.fileURL;
            link.download = `certificado_${cert.studentName.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Pequeno delay entre downloads para não sobrecarregar o navegador
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
      }

      setIsDownloading(false);
      // Fecha a modal após o download
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao baixar certificados:', error);
      setIsDownloading(false);
      setStudentsDataError('Erro ao baixar certificados. Tente novamente.');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Brigada de Incêndio e Emergência - Gerar Certificados</h1>
        <p className="text-muted-foreground">
          Importe uma planilha ou preencha os dados manualmente para gerar certificados
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Importar Planilha
          </TabsTrigger>
          <TabsTrigger value="single" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Aluno Individual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <FileUploadSection onFileProcessed={handleFileProcessed} />

          {students.length > 0 && (
            <>
              {studentsDataError && (
                <Alert title={studentsDataError} variant='warning' />
              )}
              <StudentTable
                students={students}
                selectedStudents={selectedStudents}
                onSelectionChange={handleSelectionChange}
              />

              <GenerateButton
                selectedCount={selectedStudents.length}
                isGenerating={isGenerating}
                onGenerate={handleGenerate}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="single" className="space-y-6">
          {studentsDataError && (
            <Alert title={studentsDataError} variant='warning' />
          )}
          <SingleStudentForm
            onSubmit={handleGenerateSingle}
            isGenerating={isGenerating}
          />
        </TabsContent>
      </Tabs>

      {/* Overlays */}
      <GeneratingOverlay isGenerating={isGenerating} progress={progress} />
      <GenerationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        totalCertificates={generatedCount}
        onDownloadAll={handleDownloadAll}
        isDownloading={isDownloading}
      />
    </div>
  );
}