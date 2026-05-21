'use client';

import { useState } from 'react';
import { FileSpreadsheet, Plus, FileCheck, Loader2, X, Eye, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/app/_components/ui/tabs';
import FileUploadSection from '@/src/app/_components/generate-certificate/file-upload-section';
import StudentTable from '@/src/app/_components/generate-certificate/student-table';
import SingleStudentForm from '@/src/app/_components/generate-certificate/single-student-form';
import RegisterButton from '@/src/app/_components/generate-certificate/register-button';
import { Alert } from '@/src/app/_components/custom/alert';
import { useRouter, useSearchParams } from 'next/navigation';
import { RegisterCertificateRequest } from '@/src/core/services/register-certificate-data.service';
import { CertificateType } from '@/src/core/enums/certificate-type.enum';
import { RegisterCertificatesResponse } from '@/src/app/api/certificates/generate/route';

function RegistrationSuccessModal({
  isOpen,
  onClose,
  totalCertificates,
}: {
  isOpen: boolean;
  onClose: () => void;
  totalCertificates: number;
}) {
  const router = useRouter();
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
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75" />
            <div className="relative bg-green-700 rounded-full p-4">
              <FileCheck className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-gray-700 text-2xl font-bold text-center mb-2">
          Cadastro Realizado!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {totalCertificates}{' '}
          {totalCertificates === 1
            ? 'aluno foi cadastrado'
            : 'alunos foram cadastrados'}{' '}
          com sucesso. Os certificados podem ser baixados na página de listagem.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/dashboard/certificados')}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="h-5 w-5" />
            {totalCertificates === 1
              ? 'Ver Certificado'
              : 'Ver Certificados'}
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Cadastrar Mais
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisteringOverlay({
  isRegistering,
  progress,
  currentCount,
  totalCount,
}: {
  isRegistering: boolean;
  progress: number;
  currentCount: number;
  totalCount: number;
}) {
  if (!isRegistering) return null;

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
          Cadastrando Alunos
        </h3>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-blue-900">
            <span className="font-semibold text-lg">
              {currentCount} de {totalCount}
            </span>
          </div>
          <p className="text-center text-blue-700 text-sm mt-1">
            {currentCount === totalCount
              ? 'Finalizando...'
              : 'registros processados'}
          </p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-center text-sm text-gray-500">{progress}% concluído</p>

        <p className="text-center text-xs text-gray-400 mt-4">
          Por favor, não feche esta janela
        </p>
      </div>
    </div>
  );
}

function ErrorModal({
  isOpen,
  onClose,
  errorMessage,
  studentName,
  registeredCount,
  totalCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  studentName?: string;
  registeredCount: number;
  totalCount: number;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

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
          Erro no Cadastro
        </h2>

        {registeredCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-900 text-sm text-center">
              <span className="font-semibold">
                {registeredCount} de {totalCount}
              </span>{' '}
              alunos foram cadastrados antes do erro
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

        <button
          onClick={onClose}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}

export default function CertificadosEmitirPage() {
  const [students, setStudents] = useState<RegisterCertificateRequest[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<RegisterCertificateRequest[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorStudentName, setErrorStudentName] = useState('');
  const [registeredCount, setRegisteredCount] = useState(0);
  const [studentsDataError, setStudentsDataError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const certificateType =
    (Object.values(CertificateType) as string[]).includes(searchParams.get('tipo') ?? '')
      ? (searchParams.get('tipo') as CertificateType)
      : CertificateType.BRIGADISTA;

  const handleFileProcessed = (data: RegisterCertificateRequest[]) => {
    setStudents(data);
    setSelectedStudents([]);
    setStudentsDataError(null);
  };

  const handleSelectionChange = (selected: RegisterCertificateRequest[]) => {
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

  const handleRegister = async () => {
    setIsRegistering(true);
    setStudentsDataError(null);
    setProgress(0);
    setCurrentCount(0);
    setRegisteredCount(0);

    const batchSize = 30;
    const batches: any[][] = [];

    for (let i = 0; i < selectedStudents.length; i += batchSize) {
      const batchStudents = selectedStudents.slice(i, i + batchSize);
      const batchData = batchStudents.map(d => ({
        studentName: d.studentName,
        date: d.date.toISOString(),
        cpf: d.cpf,
        hours: d.hours,
        type: d.type,
      }));
      batches.push(batchData);
    }

    setProgress(5);

    try {
      let successCount = 0;

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];

        const res = await fetch('/api/certificates/generate', {
          method: 'POST',
          body: JSON.stringify(batch),
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await res.json() as RegisterCertificatesResponse;

        if (!result.success) {
          const errorMsg =
            getFirstZodError(result.errors) || result.message || 'Erro desconhecido ao cadastrar';
          const studentName = batch[0]?.studentName || 'Aluno desconhecido';

          setIsRegistering(false);
          setErrorMessage(errorMsg);
          setErrorStudentName(studentName);
          setRegisteredCount(successCount);
          setShowErrorModal(true);
          return;
        }

        if (result.data) {
          successCount += result.data.length;
          setCurrentCount(successCount);
        }

        const progressPercent = Math.floor(((i + 1) / batches.length) * 90) + 5;
        setProgress(progressPercent);
      }

      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));

      setIsRegistering(false);
      setRegisteredCount(successCount);
      setShowSuccessModal(true);
    } catch (error) {
      setIsRegistering(false);
      setErrorMessage(
        'Erro de conexão ao cadastrar. Verifique sua internet e tente novamente.',
      );
      setErrorStudentName('');
      setRegisteredCount(currentCount);
      setShowErrorModal(true);
      console.error('Erro ao cadastrar:', error);
    }
  };

  const handleRegisterSingle = async (student: RegisterCertificateRequest) => {
    setIsRegistering(true);
    setStudentsDataError(null);
    setProgress(15);
    setCurrentCount(0);
    setRegisteredCount(0);

    await new Promise(resolve => setTimeout(resolve, 200));
    setProgress(50);

    const dataRequest = [
      {
        studentName: student.studentName,
        date: student.date.toISOString(),
        cpf: student.cpf,
        hours: student.hours,
        type: student.type,
      },
    ];

    try {
      const res = await fetch('/api/certificates/generate', {
        method: 'POST',
        body: JSON.stringify(dataRequest),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await res.json() as RegisterCertificatesResponse;

      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsRegistering(false);

      if (!response.success) {
        const errorMsg =
          getFirstZodError(response.errors) || response.message || 'Erro desconhecido';
        setErrorMessage(errorMsg);
        setErrorStudentName(student.studentName);
        setRegisteredCount(0);
        setShowErrorModal(true);
      } else {
        setCurrentCount(1);
        setRegisteredCount(1);
        setShowSuccessModal(true);
      }
    } catch (error) {
      setIsRegistering(false);
      setErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.');
      setErrorStudentName(student.studentName);
      setRegisteredCount(0);
      setShowErrorModal(true);
      console.error('Erro ao cadastrar:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Emitir Certificados</h1>
        <p className="text-muted-foreground">
          Importe uma planilha ou preencha os dados manualmente para cadastrar alunos.
          Os certificados PDF podem ser baixados a qualquer momento na listagem.
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
          <FileUploadSection
            onFileProcessed={handleFileProcessed}
            certificateType={certificateType}
          />

          {students.length > 0 && (
            <>
              {studentsDataError && (
                <Alert title={studentsDataError} variant="warning" />
              )}
              <StudentTable
                students={students}
                selectedStudents={selectedStudents}
                onSelectionChange={handleSelectionChange}
              />

              <RegisterButton
                selectedCount={selectedStudents.length}
                isRegistering={isRegistering}
                onRegister={handleRegister}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="single" className="space-y-6">
          {studentsDataError && (
            <Alert title={studentsDataError} variant="warning" />
          )}
          <SingleStudentForm
            onSubmit={handleRegisterSingle}
            isRegistering={isRegistering}
            certificateType={certificateType}
          />
        </TabsContent>
      </Tabs>

      <RegisteringOverlay
        isRegistering={isRegistering}
        progress={progress}
        currentCount={currentCount}
        totalCount={selectedStudents.length}
      />

      <RegistrationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        totalCertificates={registeredCount}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
        studentName={errorStudentName}
        registeredCount={registeredCount}
        totalCount={selectedStudents.length}
      />
    </div>
  );
}