'use client';

import { useActionState, useState } from 'react';
import { createAttendancePresenceAction } from '@/src/app/_actions/attendance';
import { CertificateType, CertificateTypeLabels } from '@/src/core/enums/certificate-type.enum';
import { Button } from '@/src/app/_components/ui/button';
import { Input } from '@/src/app/_components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/app/_components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/app/_components/ui/card';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/src/app/_components/ui/field';
import { CheckCircle2 } from 'lucide-react';
import { Alert } from '@/src/app/_components/custom/alert';

interface AttendanceFormProps {
  callId: string;
}

function formatCPF(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function AttendanceForm({ callId }: AttendanceFormProps) {
  const [state, formAction, isPending] = useActionState(createAttendancePresenceAction, undefined);
  const [cpf, setCpf] = useState('');

  const trainings = (Object.entries(CertificateTypeLabels) as [CertificateType, string][]).map(
    ([value, label]) => ({
      value,
      label,
    }),
  );

  return (
    <Card className="w-full mx-auto shadow-sm">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">Lista de Presença</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para confirmar sua presença no treinamento.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {state?.success ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-green-600 dark:text-green-500">Presença registrada!</h3>
            <p className="text-muted-foreground">{state.message}</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-6">
            <FieldGroup>
              {state?.message && !state?.success && (
                <div className="mb-4">
                  <Alert title={state.message} variant="error" />
                </div>
              )}

              <input type="hidden" name="callId" value={callId} />

              <Field>
                <FieldLabel htmlFor="course" className="font-medium">Treinamento</FieldLabel>
                <Select name="course" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o treinamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainings.map((training) => (
                      <SelectItem key={training.value} value={training.value}>
                        {training.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {state?.errors?.course && (
                  <p className="text-sm text-red-500 mt-1">{state.errors.course[0]}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="trainingDate" className="font-medium">Data do Treinamento</FieldLabel>
                <Input
                  id="trainingDate"
                  name="trainingDate"
                  type="date"
                  required
                />
                {state?.errors?.trainingDate && (
                  <p className="text-sm text-red-500 mt-1">{state.errors.trainingDate[0]}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="location" className="font-medium">Local do Treinamento</FieldLabel>
                <Input
                  id="location"
                  name="location"
                  placeholder="Ex: Filial São Paulo - Auditório"
                  required
                />
                {state?.errors?.location && (
                  <p className="text-sm text-red-500 mt-1">{state.errors.location[0]}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="studentName" className="font-medium">Nome do Participante</FieldLabel>
                <Input
                  id="studentName"
                  name="studentName"
                  placeholder="Ex: João da Silva"
                  required
                />
                {state?.errors?.studentName && (
                  <p className="text-sm text-red-500 mt-1">{state.errors.studentName[0]}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="cpf" className="font-medium">CPF do Participante</FieldLabel>
                <Input
                  id="cpf"
                  name="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  maxLength={14}
                  required
                />
                {state?.errors?.cpf && (
                  <p className="text-sm text-red-500 mt-1">{state.errors.cpf[0]}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="branchNumber" className="font-medium">Número da Filial do Participante</FieldLabel>
                <Input
                  id="branchNumber"
                  name="branchNumber"
                  placeholder="Ex: 12"
                  inputMode="numeric"
                  required
                />
                {state?.errors?.branchNumber && (
                  <p className="text-sm text-red-500 mt-1">{state.errors.branchNumber[0]}</p>
                )}
              </Field>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full mt-4"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Enviando...
                  </span>
                ) : (
                  'Confirmar Presença'
                )}
              </Button>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
