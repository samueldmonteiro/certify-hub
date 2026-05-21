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
}

export default function SingleStudentForm({ onSubmit, isRegistering }: SingleStudentFormProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    cpf: '',
    completionDate: '',
    courseName: 'Brigada de Incêndio e Emergência',
    workload: '8',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      cpf: formData.cpf,
      studentName: formData.studentName,
      hours: Number(formData.workload),
      date: new Date(formData.completionDate),
      type: CertificateType.BRIGADISTA,
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="courseName">Nome do Curso</Label>
              <Input
                id="courseName"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                placeholder="Nome do Curso"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workload">Carga Horária (horas)</Label>
              <Input
                id="workload"
                name="workload"
                type="number"
                min="1"
                value={formData.workload}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem Personalizada (Opcional)</Label>
            <Input
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Ex: Treinamento realizado em conformidade com a NR-23"
            />
            <p className="text-xs text-muted-foreground">
              Esta mensagem aparecerá no corpo do certificado. Deixe em branco para usar o padrão.
            </p>
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