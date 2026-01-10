'use client';

import { useState } from 'react';
import { FileSpreadsheet, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/app/_components/ui/tabs';
import FileUploadSection from '@/src/app/_components/generate-certificate/file-upload-section';
import StudentTable from '@/src/app/_components/generate-certificate/student-table';
import SingleStudentForm from '@/src/app/_components/generate-certificate/single-student-form';
import GenerateButton from '@/src/app/_components/generate-certificate/generate-button';
import { Alert } from '@/src/app/_components/custom/alert';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { GenerateCertificatesResponse } from '@/src/app/api/certificates/generate/route';
import { formatDateToPTBR } from '@/src/lib/utils';

export default function CertificadosPage() {
  const [students, setStudents] = useState<CertificateDraft[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [studentsDataError, setStudentsDataError] = useState<string | null>(null);

  const handleFileProcessed = (data: CertificateDraft[]) => {
    setStudents(data);
    setSelectedStudents([]);
  };

  const handleSelectionChange = (selected: string[]) => {
    setSelectedStudents(selected);
  };

  function getFirstZodError(
    errors: any,
  ): string | null {
    if (!errors) return null;

    // Caso direto: {_errors: [...]}
    if (Array.isArray(errors._errors) && errors._errors.length > 0) {
      return errors._errors[0];
    }

    // Percorre recursivamente
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

    // Mock - simula geração
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsGenerating(false);

    console.log('ESTUDANTES ENVIADOS', students);

    //const generate = await generateCertificates(null, students);

    const dataRequest: any[] = [];
    students.forEach(d => {
      dataRequest.push({
        studentName: d.studentName,
        courseName: d.courseName,
        completionDate: formatDateToPTBR(d.completionDate),
        cpf: d.cpf.getValue(),
        workload: d.workload,
      });
    });

    const res = await fetch('/api/certificates/generate', {
      method: 'POST',
      body: JSON.stringify(dataRequest),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const generate = await res.json() as GenerateCertificatesResponse;

    if (generate.errors) {
      console.log('ERRO MOSTRADO', getFirstZodError(generate.errors));
      setStudentsDataError('Erro em algum dos dados do arquivo: ' + getFirstZodError(generate.errors));
    }

    console.log('RESULTADO', generate);
  };

  const handleGenerateSingle = async (student: CertificateDraft) => {
    setIsGenerating(true);
    // Mock - simula geração
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    alert(`Certificado gerado para ${student.studentName}!`);
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
    </div>
  );
}