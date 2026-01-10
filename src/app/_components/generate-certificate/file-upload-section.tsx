'use client';

import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/src/app/_components/ui/card';
import { Alert, AlertDescription } from '@/src/app/_components/ui/alert';
import * as XLSX from 'xlsx';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';

interface FileUploadSectionProps {
  onFileProcessed: (data: CertificateDraft[]) => void;
}

export default function FileUploadSection({ onFileProcessed }: FileUploadSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    return cleanCPF.length === 11;
  };

  const validateDate = (date: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/;
    return dateRegex.test(date);
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        dateNF: 'yyyy-mm-dd',
      });

      // Validação dos dados
      const students: CertificateDraft[] = [];
      const errors: string[] = [];

      jsonData.forEach((row: any, index: number) => {
        const rowNum = index + 2; // +2 porque começa do 1 e tem o header

        console.log('JOSN DATA', jsonData);
        if (!row.Nome || typeof row.Nome !== 'string') {
          errors.push(`Linha ${rowNum}: Nome inválido ou ausente`);
        }
        if (!row.CPF || !validateCPF(String(row.CPF))) {
          errors.push(`Linha ${rowNum}: CPF inválido ou ausente`);
        }
        if (!row.DATA || !validateDate(String(row.DATA))) {
          errors.push(`Linha ${rowNum}: Data inválida (use formato YYYY-MM-DD ou DD/MM/YYYY)`);
        }

        if (row.Nome && row.CPF && row.DATA) {
          students.push({
            studentName: row.Nome,
            cpf: new CPF(String(row.CPF)),
            completionDate: new Date(row.DATA),
            workload: 8,
            courseName: 'Brigada de Incêncio e Emergência',
          });
        }
      });

      if (errors.length > 0) {
        setError(errors.join('\n'));
        setIsLoading(false);
        return;
      }

      if (students.length === 0) {
        setError('Nenhum dado válido encontrado no arquivo. Certifique-se de que as colunas são: nome, cpf, completionDate');
        setIsLoading(false);
        return;
      }

      // Simula carregamento
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('STUDENTS', students);
      onFileProcessed(students);
      setIsLoading(false);
    } catch {
      setError('Erro ao processar arquivo. Verifique se o formato está correto.');
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isLoading ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary'
            }`}
            onClick={!isLoading ? handleClick : undefined}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />

            {isLoading ? (
              <div className="space-y-3">
                <div className="animate-spin mx-auto h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
                <p className="text-sm text-muted-foreground">Processando arquivo...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto h-12 w-12 text-muted-foreground">
                  {fileName ? (
                    <FileSpreadsheet className="h-full w-full" />
                  ) : (
                    <Upload className="h-full w-full" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {fileName || 'Clique para selecionar ou arraste um arquivo'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Arquivo Excel (.xlsx, .xls) com colunas: nome, cpf, completionDate
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

