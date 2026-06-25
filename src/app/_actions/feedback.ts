'use server';

import { CertificateType } from '@/src/core/enums/certificate-type.enum';
import { prisma } from '@/src/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const feedbackSchema = z.object({
  studentName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  course: z.nativeEnum(CertificateType, {
    message: 'Curso inválido',
  }),
  stars: z.coerce.number().min(1, 'Selecione pelo menos 1 estrela').max(5, 'Máximo de 5 estrelas'),
  message: z.string().min(2, 'A mensagem deve ter pelo menos 2 caracteres'),
});

export async function createFeedbackAction(
  prevState: any,
  formData: FormData,
) {
  try {
    const rawData = {
      studentName: formData.get('studentName'),
      course: formData.get('course'),
      stars: formData.get('stars'),
      message: formData.get('message'),
    };

    const validatedData = feedbackSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: 'Erro de validação. Verifique os campos.',
      };
    }

    await prisma.feedback.create({
      data: validatedData.data,
    });

    return {
      success: true,
      message: 'Feedback enviado com sucesso! Agradecemos sua avaliação.',
    };
  } catch (error) {
    console.error('Feedback creation error:', error);
    return {
      success: false,
      message: 'Ocorreu um erro ao enviar seu feedback. Tente novamente mais tarde.',
    };
  }
}

export async function deleteFeedbackAction(id: string) {
  try {
    await prisma.feedback.delete({
      where: { id },
    });

    revalidatePath('/dashboard/feedbacks');

    return {
      success: true,
      message: 'Feedback excluído com sucesso!',
    };
  } catch (error) {
    console.error('Feedback deletion error:', error);
    return {
      success: false,
      message: 'Ocorreu um erro ao excluir o feedback.',
    };
  }
}
