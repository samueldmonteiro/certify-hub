'use server';

import { revalidatePath } from 'next/cache';
import { makeUpdateCertificateUseCase } from '@/src/core/infra/factories/make-update-certificate.use-case.factory';

export async function updateCertificateAction(id: string, data: {
  studentName?: string;
  courseName?: string;
  cpf?: string;
  workload?: number;
  completionDate?: Date;
  message?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const useCase = makeUpdateCertificateUseCase();

    // convert message empty string to undefined so it can clear? Or just let user keep it.
    // If message is "", we might want to clear it, but let's just pass it as is.
    
    await useCase.execute({
      id,
      studentName: data.studentName,
      courseName: data.courseName,
      cpf: data.cpf,
      workload: data.workload,
      completionDate: data.completionDate,
      message: data.message,
    });

    revalidatePath('/dashboard/certificados');
    return { success: true, message: 'Certificado atualizado com sucesso!' };
  } catch (error: any) {
    console.error('Error updating certificate:', error);
    return { success: false, message: error.message || 'Erro ao atualizar certificado' };
  }
}
