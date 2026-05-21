'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CertificateType, CertificateTypeLabels } from '@/src/core/enums/certificate-type.enum';

interface UpdateCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: any) => Promise<void>;
  certificate: any | null;
}

export function UpdateCertificateModal({
  isOpen,
  onClose,
  onUpdate,
  certificate,
}: UpdateCertificateModalProps) {
  const [formData, setFormData] = useState(() => ({
    studentName: certificate?.studentName || '',
    cpf: certificate?.cpf || '',
    courseName: certificate?.courseName || '',
    workload: certificate?.workload ? String(certificate.workload) : '',
    completionDate: certificate?.completionDate
      ? new Date(certificate.completionDate).toISOString().split('T')[0]
      : '',
    page: certificate?.page || '',
    ptsBook: certificate?.ptsBook || '',
    registrationNumber: certificate?.registrationNumber || '',
    type: certificate?.type || CertificateType.BRIGADISTA,
  }));

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !certificate) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onUpdate(certificate.id, {
        studentName: formData.studentName,
        cpf: formData.cpf,
        courseName: formData.courseName,
        workload: Number(formData.workload),
        completionDate: new Date(formData.completionDate + 'T00:00:00'),
        page: formData.page || undefined,
        ptsBook: formData.ptsBook || undefined,
        registrationNumber: formData.registrationNumber || undefined,
        type: formData.type,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background text-foreground rounded-xl border border-border shadow-lg w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-background z-10">
          <h2 className="text-xl font-bold">Editar Certificado</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="update-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Nome do Aluno</Label>
              <Input
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
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

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3 space-y-2">
                <Label htmlFor="courseName">Nome do Curso</Label>
                <Input
                  id="courseName"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workload">C. Horária</Label>
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
              <Label htmlFor="type">Tipo de Certificado</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {Object.entries(CertificateTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="page">Página</Label>
                <Input
                  id="page"
                  name="page"
                  placeholder="Ex: 001/2025"
                  value={formData.page}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Nº Registro</Label>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  placeholder="Ex: 0001/2025"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ptsBook">Livro PTS</Label>
                <Input
                  id="ptsBook"
                  name="ptsBook"
                  value={formData.ptsBook}
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-3 sticky bottom-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="update-form"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
