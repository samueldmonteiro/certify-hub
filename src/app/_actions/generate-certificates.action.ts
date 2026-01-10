'use server';

import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { makeRegisterMultipleCertificatesUseCase } from '@/src/core/infra/factories/make-register-multiple-certificates.use-case.factory';
import { makeSaveMultipleCertificatesFileUseCase } from '@/src/core/infra/factories/make-save-multiple-certificates-file.use-case.factory copy';
import { CertificateDraftArraySchema, CertificateDraftErrorsSchema } from '@/src/core/infra/http/schemas/certificate-student-data.schema';
import z from 'zod';

export interface GenerateCertificatesResponse {
  success: boolean,
  data?: Certificate[],
  errors?: CertificateDraftErrorsSchema
  message?: string
}

export const generateCertificates = async (
  _prevState: any,
  data: CertificateDraft[]): Promise<GenerateCertificatesResponse> => {
  const parsed = CertificateDraftArraySchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: z.formatError(parsed.error),
    };
  }

  try {
    const saveFiles = await makeSaveMultipleCertificatesFileUseCase().execute(data);
    const registerCertificates = await makeRegisterMultipleCertificatesUseCase().execute(saveFiles.draftCertificates);
    return {
      success: true,
      data: registerCertificates.certificates,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};