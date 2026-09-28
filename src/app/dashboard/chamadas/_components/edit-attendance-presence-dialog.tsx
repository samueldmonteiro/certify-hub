'use client';

import { useActionState, useEffect, useState } from 'react';
import { updateAttendancePresenceAction } from '@/src/app/_actions/attendance';
import { CertificateType, CertificateTypeLabels } from '@/src/core/enums/certificate-type.enum';
import type { AttendancePresence } from '@/src/generated/prisma/client';
import { Button } from '@/src/app/_components/ui/button';
import { Input } from '@/src/app/_components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/app/_components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/app/_components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/src/app/_components/ui/field';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/app/_components/ui/tooltip';
import { Alert } from '@/src/app/_components/custom/alert';
import { Pencil } from 'lucide-react';

function formatCPF(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function toDateInputValue(date: Date) {
  return new Date(date).toISOString().slice(0, 10);
}

function EditPresenceForm({
  presence,
  onSuccess,
}: {
  presence: AttendancePresence;
  onSuccess: () => void;
}) {
  const [cpf, setCpf] = useState(formatCPF(presence.cpf));
  const [state, formAction, isPending] = useActionState(updateAttendancePresenceAction, undefined);

  useEffect(() => {
    if (state?.success) {
      onSuccess();
    }
  }, [state, onSuccess]);

  const trainings = (Object.entries(CertificateTypeLabels) as [CertificateType, string][]).map(
    ([value, label]) => ({ value, label }),
  );

  return (
    <form action={formAction} className="space-y-4">
      <FieldGroup>
        {state?.message && !state?.success && (
          <Alert title={state.message} variant="error" />
        )}

        <input type="hidden" name="id" value={presence.id} />
        <input type="hidden" name="callId" value={presence.callId} />

        <Field>
          <FieldLabel htmlFor="course" className="font-medium">Treinamento</FieldLabel>
          <Select name="course" defaultValue={presence.course} required>
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
            defaultValue={toDateInputValue(presence.trainingDate)}
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
            defaultValue={presence.location}
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
            defaultValue={presence.studentName}
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
            inputMode="numeric"
            maxLength={14}
            required
          />
          {state?.errors?.cpf && (
            <p className="text-sm text-red-500 mt-1">{state.errors.cpf[0]}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="branchNumber" className="font-medium">Número da Filial</FieldLabel>
          <Input
            id="branchNumber"
            name="branchNumber"
            defaultValue={presence.branchNumber}
            inputMode="numeric"
            required
          />
          {state?.errors?.branchNumber && (
            <p className="text-sm text-red-500 mt-1">{state.errors.branchNumber[0]}</p>
          )}
        </Field>
      </FieldGroup>
      <DialogFooter>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </DialogFooter>
    </form>
  );
}

interface EditAttendancePresenceDialogProps {
  presence: AttendancePresence;
}

export function EditAttendancePresenceDialog({ presence }: EditAttendancePresenceDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Pencil className="w-4 h-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Editar registro de presença</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Presença</DialogTitle>
          <DialogDescription>
            Atualize os dados registrados por {presence.studentName}.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <EditPresenceForm presence={presence} onSuccess={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
