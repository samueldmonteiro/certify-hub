'use server';

import { makeDeleteCertificateUseCase } from '@/src/core/infra/factories/make-delete-certificate.use-case.factory';
import { makeDeleteManyCertificatesUseCase } from '@/src/core/infra/factories/make-delete-many-certificates.use-case.factory';
import { revalidatePath } from 'next/cache';

export interface DeleteCertificateResponse {
  success: boolean;
  message?: string;
}

export const deleteCertificateAction = async (id: string): Promise<DeleteCertificateResponse> => {
  try {
    await makeDeleteCertificateUseCase().execute(id);
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
    await makeDeleteManyCertificatesUseCase().execute(ids);
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