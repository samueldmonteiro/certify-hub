'use server';

import { certificateServiceFactory } from '@/src/core/factories/service.factory';
import { revalidatePath } from 'next/cache';

export interface DeleteCertificateResponse {
  success: boolean;
  message?: string;
}

export const deleteCertificateAction = async (id: string): Promise<DeleteCertificateResponse> => {
  try {
    await certificateServiceFactory().delete(id);
    revalidatePath('/dashboard/certificados');

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deleteManyCertificatesAction = async (ids: string[]): Promise<DeleteCertificateResponse> => {
  try {
    await certificateServiceFactory().deleteMany(ids);
    revalidatePath('/dashboard/certificados');

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      message: 'Erro ao deletar certificados',
    };
  }
};