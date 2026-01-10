'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/app/_components/ui/card';
import { Button } from '@/src/app/_components/ui/button';
import { Input } from '@/src/app/_components/ui/input';
import { Label } from '@/src/app/_components/ui/label';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';

interface SingleStudentFormProps {
  onSubmit: (student: CertificateDraft) => void;
  isGenerating: boolean;
}

export default function SingleStudentForm({ onSubmit, isGenerating }: SingleStudentFormProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    cpf: '',
    completionDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      cpf: new CPF(formData.cpf),
      studentName: formData.studentName,
      courseName: 'Brigada de Incêncio e Emergência',
      workload: 8,
      completionDate: new Date(formData.completionDate),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerar Certificado Individual</CardTitle>
        <CardDescription>
          Preencha os dados do aluno para gerar um certificado único
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentName">Nome Completo</Label>
            <Input
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="João Silva"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="completionDate">Data de Conclusão</Label>
            <Input
              id="completionDate"
              name="completionDate"
              type="date"
              value={formData.completionDate}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                Gerando...
              </>
            ) : (
              'Gerar Certificado'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}