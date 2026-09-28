'use server';

import { CertificateType } from '@/src/core/enums/certificate-type.enum';
import { prisma } from '@/src/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const attendanceCallSchema = z.object({
  name: z.string().min(3, 'O nome da chamada deve ter pelo menos 3 caracteres'),
});

export async function createAttendanceCallAction(
  prevState: any,
  formData: FormData,
) {
  try {
    const validatedData = attendanceCallSchema.safeParse({
      name: formData.get('name'),
    });

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: 'Erro de validação. Verifique os campos.',
      };
    }

    const call = await prisma.attendanceCall.create({
      data: validatedData.data,
    });

    revalidatePath('/dashboard/chamadas');

    return {
      success: true,
      message: 'Chamada criada com sucesso!',
      call: {
        id: call.id,
        name: call.name,
      },
    };
  } catch (error) {
    console.error('Attendance call creation error:', error);
    return {
      success: false,
      message: 'Ocorreu um erro ao criar a chamada. Tente novamente mais tarde.',
    };
  }
}

export async function deleteAttendanceCallAction(id: string) {
  try {
    await prisma.attendanceCall.delete({
      where: { id },
    });

    revalidatePath('/dashboard/chamadas');

    return {
      success: true,
      message: 'Chamada excluída com sucesso!',
    };
  } catch (error) {
    console.error('Attendance call deletion error:', error);
    return {
      success: false,
      message: 'Ocorreu um erro ao excluir a chamada.',
    };
  }
}

const attendancePresenceFields = {
  course: z.nativeEnum(CertificateType, {
    message: 'Selecione o treinamento',
  }),
  trainingDate: z.coerce.date({ message: 'Informe a data do treinamento' }),
  location: z.string().min(2, 'Informe o local do treinamento'),
  studentName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpf: z
    .string()
    .transform((value) => value.replace(/\D/g, ''))
    .refine((value) => value.length === 11, 'CPF inválido'),
  branchNumber: z.string().min(1, 'Informe o número da filial'),
};

const attendancePresenceSchema = z.object({
  callId: z.string().uuid('Chamada inválida'),
  ...attendancePresenceFields,
});

export async function createAttendancePresenceAction(
  prevState: any,
  formData: FormData,
) {
  try {
    const rawData = {
      callId: formData.get('callId'),
      course: formData.get('course'),
      trainingDate: formData.get('trainingDate'),
      location: formData.get('location'),
      studentName: formData.get('studentName'),
      cpf: formData.get('cpf'),
      branchNumber: formData.get('branchNumber'),
    };

    const validatedData = attendancePresenceSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: 'Erro de validação. Verifique os campos.',
      };
    }

    const call = await prisma.attendanceCall.findUnique({
      where: { id: validatedData.data.callId },
    });

    if (!call) {
      return {
        success: false,
        message: 'Esta chamada não existe ou foi encerrada.',
      };
    }

    await prisma.attendancePresence.create({
      data: validatedData.data,
    });

    return {
      success: true,
      message: 'Presença registrada com sucesso!',
    };
  } catch (error) {
    console.error('Attendance presence creation error:', error);
    return {
      success: false,
      message: 'Ocorreu um erro ao registrar sua presença. Tente novamente mais tarde.',
    };
  }
}

const attendancePresenceUpdateSchema = z.object({
  id: z.string().uuid('Registro inválido'),
  callId: z.string().uuid('Chamada inválida'),
  ...attendancePresenceFields,
});

export async function updateAttendancePresenceAction(
  prevState: any,
  formData: FormData,
) {
  try {
    const rawData = {
      id: formData.get('id'),
      callId: formData.get('callId'),
      course: formData.get('course'),
      trainingDate: formData.get('trainingDate'),
      location: formData.get('location'),
      studentName: formData.get('studentName'),
      cpf: formData.get('cpf'),
      branchNumber: formData.get('branchNumber'),
    };

    const validatedData = attendancePresenceUpdateSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: 'Erro de validação. Verifique os campos.',
      };
    }

    const { id, callId, ...data } = validatedData.data;

    await prisma.attendancePresence.update({
      where: { id },
      data,
    });

    revalidatePath(`/dashboard/chamadas/${callId}`);

    return {
      success: true,
      message: 'Registro atualizado com sucesso!',
    };
  } catch (error) {
    console.error('Attendance presence update error:', error);
    return {
      success: false,
      message: 'Ocorreu um erro ao atualizar o registro.',
    };
  }
}

export async function deleteAttendancePresenceAction(id: string, callId: string) {
  try {
    await prisma.attendancePresence.delete({
      where: { id },
    });

    revalidatePath(`/dashboard/chamadas/${callId}`);
    revalidatePath('/dashboard/chamadas');

    return {
      success: true,
      message: 'Registro de presença excluído com sucesso!',
    };
  } catch (error) {
    console.error('Attendance presence deletion error:', error);
    return {
      success: false,
      message: 'Ocorreu um erro ao excluir o registro.',
    };
  }
}
