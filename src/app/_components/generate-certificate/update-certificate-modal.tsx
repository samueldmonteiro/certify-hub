'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

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
  const [formData, setFormData] = useState({
    studentName: '',
    cpf: '',
    courseName: '',
    workload: '',
    completionDate: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (certificate) {
      setFormData({
        studentName: certificate.studentName || '',
        cpf: certificate.cpf || '',
        courseName: certificate.courseName || '',
        workload: certificate.workload ? String(certificate.workload) : '',
        completionDate: certificate.completionDate
          ? new Date(certificate.completionDate).toISOString().split('T')[0]
          : '',
        message: certificate.message || '',
      });
    }
  }, [certificate]);

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
        message: formData.message || undefined,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              <Label htmlFor="message">Mensagem Personalizada (Opcional)</Label>
              <Input
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
              />
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
