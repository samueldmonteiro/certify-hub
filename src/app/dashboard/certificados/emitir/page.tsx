'use client';

import { useState } from 'react';
import { FileSpreadsheet, Plus, FileCheck, Loader2, X, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';
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
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isDownloading ? onClose : undefined}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          disabled={isDownloading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="h-5 w-5" />
        </button>

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
            <Eye className="h-5 w-5" />
            {totalCertificates === 1 ? 'Visualizar Certificado' : 'Visualizar Certificados'}
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

function GeneratingOverlay({ 
  isGenerating, 
  progress, 
  currentCount, 
  totalCount, 
}: { 
  isGenerating: boolean; 
  progress: number;
  currentCount: number;
  totalCount: number;
}) {
  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-100 rounded-full animate-pulse" />
            <div className="relative">
              <Loader2 className="h-16 w-16 text-orange-600 animate-spin" />
            </div>
          </div>
        </div>

        <h3 className="text-xl text-gray-700 font-bold text-center mb-2">
          Gerando Certificados
        </h3>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-blue-900">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-lg">
              {currentCount} de {totalCount}
            </span>
          </div>
          <p className="text-center text-blue-700 text-sm mt-1">
            {currentCount === totalCount 
              ? 'Finalizando processamento...' 
              : 'certificados gerados'}
          </p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-shimmer" />
          </div>
        </div>
        
        <p className="text-center text-sm text-gray-500">
          {progress}% concluído
        </p>

        <p className="text-center text-xs text-gray-400 mt-4">
          Por favor, não feche esta janela
        </p>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

function ErrorModal({
  isOpen,
  onClose,
  errorMessage,
  studentName,
  generatedCount,
  totalCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  studentName?: string;
  generatedCount: number;
  totalCount: number;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="bg-red-100 rounded-full p-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
        </div>

        <h2 className="text-gray-700 text-2xl font-bold text-center mb-2">
          Erro na Geração
        </h2>

        {generatedCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-900 text-sm text-center">
              <span className="font-semibold">{generatedCount} de {totalCount}</span> certificados foram gerados antes do erro
            </p>
          </div>
        )}

        {studentName && (
          <p className="text-center text-gray-600 mb-2">
            Erro ao processar: <span className="font-semibold">{studentName}</span>
          </p>
        )}

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">
            <span className="font-semibold">Detalhes do erro:</span>
            <br />
            {errorMessage}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CertificadosPage() {
  const [students, setStudents] = useState<CertificateDraft[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<CertificateDraft[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorStudentName, setErrorStudentName] = useState('');
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
    setCurrentCount(0);
    setGeneratedCertificates([]);
    setGeneratedCount(0);

    const totalStudents = selectedStudents.length;
    const batchSize = 2;
    const batches: any[][] = [];
    
    for (let i = 0; i < selectedStudents.length; i += batchSize) {
      const batchStudents = selectedStudents.slice(i, i + batchSize);
      const batchData = batchStudents.map(d => ({
        studentName: d.studentName,
        courseName: d.courseName,
        completionDate: formatDateToPTBR(d.completionDate),
        cpf: d.cpf.getValue(),
        workload: d.workload,
      }));
      batches.push(batchData);
    }

    setProgress(5);

    try {
      let successCount = 0;
      const allCertificates: any[] = [];

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

        if (generate.errors || !generate.success) {
          const errorMsg = getFirstZodError(generate.errors) || 'Erro desconhecido ao processar certificado';
          const studentName = batch[0]?.studentName || 'Aluno desconhecido';
          
          setIsGenerating(false);
          setErrorMessage(errorMsg);
          setErrorStudentName(studentName);
          setGeneratedCount(successCount);
          setShowErrorModal(true);
          return;
        } 
        
        if (generate.data) {
          successCount += generate.data.length;
          allCertificates.push(...generate.data);
          setCurrentCount(successCount);
        }

        const progressPercent = Math.floor(((i + 1) / batches.length) * 90) + 5;
        setProgress(progressPercent);
      }

      setProgress(95);
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 400));

      setIsGenerating(false);
      setGeneratedCertificates(allCertificates);
      setGeneratedCount(successCount);
      setShowSuccessModal(true);

    } catch (error) {
      setIsGenerating(false);
      setErrorMessage('Erro de conexão ao gerar certificados. Verifique sua internet e tente novamente.');
      setErrorStudentName('');
      setGeneratedCount(currentCount);
      setShowErrorModal(true);
      console.error('Erro ao gerar certificados:', error);
    }
  };

  const handleGenerateSingle = async (student: CertificateDraft) => {
    setIsGenerating(true);
    setStudentsDataError(null);
    setGeneratedCertificates([]);
    setProgress(15);
    setCurrentCount(0);
    setGeneratedCount(0);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    setProgress(30);

    const dataRequest = [{
      studentName: student.studentName,
      courseName: student.courseName,
      completionDate: formatDateToPTBR(student.completionDate),
      cpf: student.cpf.getValue(),
      workload: student.workload,
    }];

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

      setProgress(90);
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setIsGenerating(false);

      if (response.errors || !response.success) {
        const errorMsg = getFirstZodError(response.errors) || 'Erro desconhecido ao gerar certificado';
        setErrorMessage(errorMsg);
        setErrorStudentName(student.studentName);
        setGeneratedCount(0);
        setShowErrorModal(true);
      } else if (response.data) {
        setCurrentCount(1);
        setGeneratedCertificates(response.data);
        setGeneratedCount(response.data.length);
        setShowSuccessModal(true);
      }
    } catch (error) {
      setIsGenerating(false);
      setErrorMessage('Erro de conexão ao gerar certificado. Verifique sua internet e tente novamente.');
      setErrorStudentName(student.studentName);
      setGeneratedCount(0);
      setShowErrorModal(true);
      console.error('Erro ao gerar certificado:', error);
    }
  };

  const handleDownloadAll = async () => {
    if (generatedCertificates.length === 0) return;

    setIsDownloading(true);

    try {
      if (generatedCertificates.length === 1) {
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
        for (const cert of generatedCertificates) {
          if (cert.fileURL) {
            const link = document.createElement('a');
            link.href = cert.fileURL;
            link.download = `certificado_${cert.studentName.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
      }

      setIsDownloading(false);
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

      <GeneratingOverlay 
        isGenerating={isGenerating} 
        progress={progress}
        currentCount={currentCount}
        totalCount={selectedStudents.length}
      />
      
      <GenerationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        totalCertificates={generatedCount}
        onDownloadAll={handleDownloadAll}
        isDownloading={isDownloading}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
        studentName={errorStudentName}
        generatedCount={generatedCount}
        totalCount={selectedStudents.length}
      />
    </div>
  );
}