'use client';

import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/src/app/_components/ui/card';
import { Alert, AlertDescription } from '@/src/app/_components/ui/alert';
import * as XLSX from 'xlsx';
import { RegisterCertificateRequest } from '@/src/core/services/register-certificate-data.service';
import { CertificateType } from '@/src/core/enums/certificate-type.enum';

interface FileUploadSectionProps {
  onFileProcessed: (data: RegisterCertificateRequest[]) => void;
}

export default function FileUploadSection({ onFileProcessed }: FileUploadSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseBrDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const date = String(dateStr).trim();

    // DD/MM/YYYY ou DD/MM/YY
    const brRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;
    const match = date.match(brRegex);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1; // 0-based
      let year = parseInt(match[3], 10);
      if (year < 100) year += 2000;

      // Usa o construtor com componentes para evitar ambiguidade de fuso
      const d = new Date(year, month, day);
      if (d.getDate() === day && d.getMonth() === month && d.getFullYear() === year) {
        return d;
      }
      return null;
    }

    // YYYY-MM-DD (ISO) — parseado manualmente para evitar UTC vs local
    const isoRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const isoMatch = date.match(isoRegex);
    if (isoMatch) {
      const year = parseInt(isoMatch[1], 10);
      const month = parseInt(isoMatch[2], 10) - 1; // 0-based
      const day = parseInt(isoMatch[3], 10);
      const d = new Date(year, month, day);
      if (d.getDate() === day && d.getMonth() === month && d.getFullYear() === year) {
        return d;
      }
      return null;
    }

    // Fallback: número serial do Excel (caso XLSX entregue como string numérica)
    const serial = Number(date);
    if (!isNaN(serial) && serial > 1) {
      // Epoch do Excel: 1 = 1900-01-01, com o bug do dia 29/02/1900
      const excelEpoch = new Date(1899, 11, 30);
      const d = new Date(excelEpoch.getTime() + serial * 86400000);
      if (!isNaN(d.getTime())) return d;
    }

    return null;
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { cellDates: false }); // lê datas como raw para controlarmos o parse
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        dateNF: 'dd/mm/yyyy',
      });

      // Validação dos dados
      const students: RegisterCertificateRequest[] = [];
      const errors: string[] = [];

      jsonData.forEach((row: any, index: number) => {
        const rowNum = index + 2; // +2 porque começa do 1 e tem o header
        const rowErrors: string[] = [];

        // 1. Validar Nome
        if (!row.NOME_ALUNO || String(row.NOME_ALUNO).trim().length < 2) {
          rowErrors.push('Nome ausente ou curto demais');
        }

        // 2. Validar CPF
        const cpfStr = String(row.CPF || '').replace(/[^\d]/g, '');
        if (!cpfStr || cpfStr.length !== 11) {
          rowErrors.push(`CPF inválido (deve ter 11 dígitos): '${row.CPF || ''}'`);
        }

        // 3. Validar Duração
        const workload = Number(row.DURACAO_CURSO_HRS);
        if (!row.DURACAO_CURSO_HRS || isNaN(workload) || workload <= 0) {
          rowErrors.push(`Duração/Workload inválida: '${row.DURACAO_CURSO_HRS || ''}'`);
        }

        // 4. Validar Data
        const dateStr = String(row.DATA_CONCLUSAO || '').trim();
        const parsedDate = parseBrDate(dateStr);
        console.log(dateStr, parsedDate);
        if (!dateStr || !parsedDate) {
          rowErrors.push(`Data inválida: '${dateStr}' (formato esperado: DD/MM/YY ou DD/MM/YYYY)`);
        }

        if (rowErrors.length > 0) {
          errors.push(`Linha ${rowNum}: ${rowErrors.join(', ')}`);
        } else {
          // Se não houver erros na linha, adiciona ao array de sucesso
          students.push({
            studentName: String(row.NOME_ALUNO).trim(),
            cpf: cpfStr,
            date: parsedDate!,
            hours: workload,
            type: CertificateType.BRIGADISTA,
          });
        }
      });

      if (errors.length > 0) {
        setError(`Foram encontrados erros na planilha:\n\n${errors.slice(0, 15).join('\n')}${errors.length > 15 ? `\n... e mais ${errors.length - 15} erros.` : ''}`);
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
      <CardContent className='pt-6'>
        <div className='space-y-4'>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isLoading ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary'}`}
            onClick={!isLoading ? handleClick : undefined}
          >
            <input
              ref={fileInputRef}
              type='file'
              accept='.xlsx,.xls'
              onChange={handleFileChange}
              className='hidden'
              disabled={isLoading}
            />

            {isLoading ? (
              <div className='space-y-3'>
                <div className='animate-spin mx-auto h-12 w-12 border-4 border-primary border-t-transparent rounded-full' />
                <p className='text-sm text-muted-foreground'>Processando arquivo...</p>
              </div>
            ) : (
              <div className='space-y-3'>
                <div className='mx-auto h-12 w-12 text-muted-foreground'>
                  {fileName ? (
                    <FileSpreadsheet className='h-full w-full' />
                  ) : (
                    <Upload className='h-full w-full' />
                  )}
                </div>
                <div>
                  <p className='text-sm font-medium'>
                    {fileName || 'Clique para selecionar ou arraste um arquivo'}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Arquivo Excel (.xlsx, .xls) com colunas: nome, cpf, completionDate
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription className='whitespace-pre-line'>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}