'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/app/_components/ui/card';
import { Button } from '@/src/app/_components/ui/button';
import { Input } from '@/src/app/_components/ui/input';
import { Label } from '@/src/app/_components/ui/label';
import { RegisterCertificateRequest } from '@/src/core/services/register-certificate-data.service';
import { CertificateType } from '@/src/core/enums/certificate-type.enum';

interface SingleStudentFormProps {
  onSubmit: (student: RegisterCertificateRequest) => void;
  isRegistering: boolean;
  certificateType: CertificateType;
}

export default function SingleStudentForm({ onSubmit, isRegistering, certificateType }: SingleStudentFormProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    cpf: '',
    completionDate: '',
    hours: 8,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      cpf: formData.cpf,
      studentName: formData.studentName,
      hours: Number(formData.hours),
      date: new Date(formData.completionDate),
      type: certificateType,
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
        <CardTitle>Cadastrar Aluno Individual</CardTitle>
        <CardDescription>
          Preencha os dados do aluno para cadastrar um certificado único
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

          <div className="space-y-2">
            <Label htmlFor="hours">Carga Horária (horas)</Label>
            <Input
              id="hours"
              name="hours"
              type="number"
              min="1"
              value={formData.hours}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isRegistering}>
            {isRegistering ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                Cadastrando...
              </>
            ) : (
              'Cadastrar Aluno'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}