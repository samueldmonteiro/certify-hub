'use server';

import { certificateServiceFactory } from '@/src/core/factories/service.factory';
import { revalidatePath } from 'next/cache';

export async function updateCertificateAction(id: string, data: {
  studentName?: string;
  courseName?: string;
  cpf?: string;
  workload?: number;
  completionDate?: Date;
  message?: string;
  page?: string;
  ptsBook?: string;
  registrationNumber?: string;

}): Promise<{ success: boolean; message: string }> {
  try {

    await certificateServiceFactory().update({
      id,
      studentName: data.studentName,
      courseName: data.courseName,
      cpf: data.cpf,
      workload: data.workload,
      completionDate: data.completionDate,
      page: data.page,
      ptsBook: data.ptsBook,
      registrationNumber: data.registrationNumber,
    });

    revalidatePath('/dashboard/certificados');
    return { success: true, message: 'Certificado atualizado com sucesso!' };
  } catch (error: any) {
    console.error('Error updating certificate:', error);
    return { success: false, message: error.message || 'Erro ao atualizar certificado' };
  }
}
