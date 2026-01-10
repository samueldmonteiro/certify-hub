'use client';

import { useState } from 'react';
import { FileSpreadsheet, Plus, Download, FileCheck, Loader2, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/app/_components/ui/tabs';
import FileUploadSection from '@/src/app/_components/generate-certificate/file-upload-section';
import StudentTable from '@/src/app/_components/generate-certificate/student-table';
import SingleStudentForm from '@/src/app/_components/generate-certificate/single-student-form';
import GenerateButton from '@/src/app/_components/generate-certificate/generate-button';
import { Alert } from '@/src/app/_components/custom/alert';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { GenerateCertificatesResponse } from '@/src/app/api/certificates/generate/route';
import { formatDateToPTBR } from '@/src/lib/utils';

// Modal de Sucesso com Animação
function GenerationSuccessModal({
  isOpen,
  onClose,
  totalCertificates,
  onDownloadAll,
}: {
  isOpen: boolean;
  onClose: () => void;
  totalCertificates: number;
  onDownloadAll: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
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
            onClick={() => {
              onDownloadAll();
              onClose();
            }}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="h-5 w-5" />
            Baixar Todos os Certificados
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
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

  const handleFileProcessed = (data: CertificateDraft[]) => {
    setStudents(data);
    setSelectedStudents([]);
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
        console.log('FOI UM', generate);

        // Atualizar progresso
        const progressPercent = Math.floor(((i + 1) / batches.length) * 85) + 5;
        setProgress(progressPercent);

        // Acumular erros se houver
        if (generate.errors) {
          if (!allErrors) {
            allErrors = generate.errors;
          }
          break; // Para no primeiro erro
        } else {
          successCount += batch.length;
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
    setProgress(0);

    setProgress(30);
    await new Promise(resolve => setTimeout(resolve, 600));

    setProgress(60);
    await new Promise(resolve => setTimeout(resolve, 700));

    setProgress(90);
    await new Promise(resolve => setTimeout(resolve, 400));

    setProgress(100);
    await new Promise(resolve => setTimeout(resolve, 300));

    setIsGenerating(false);

    setGeneratedCount(1);
    setShowSuccessModal(true);
  };

  const handleDownloadAll = () => {
    console.log('Baixando todos os certificados...');
    // Função que será implementada posteriormente
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Briga de Incêncio e Emergência - Gerar Certificados</h1>
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

        <TabsContent value="single">
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
      />
    </div>
  );
}