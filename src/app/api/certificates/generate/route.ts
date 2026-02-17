import { CertificatePresenter } from '@/src/core/application/presenters/certificate.presenter';
import { CertificateViewModel } from '@/src/core/application/view-models/certificate.view-model';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';
import { makeSaveMultipleCertificatesFileUseCase } from '@/src/core/infra/factories/make-save-multiple-certificates-file.use-case.factory';
import { CertificateDraftArraySchema, CertificateDraftErrorsSchema, CertificateDraftSchemaDTO } from '@/src/core/infra/http/schemas/certificate-student-data.schema';
import { NextResponse } from 'next/server';
import z from 'zod';

export interface GenerateCertificatesResponse {
  success: boolean,
  data?: CertificateViewModel[],
  errors?: CertificateDraftErrorsSchema
  message?: string
}

export async function POST(req: Request) {
  const body = await req.json() as CertificateDraftSchemaDTO[];

  const parsed = CertificateDraftArraySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: z.formatError(parsed.error) },
      { status: 400 },
    );
  }

  const data: CertificateDraft[] = [];
  body.forEach(d => {
    data.push({
      completionDate: new Date(d.completionDate),
      courseName: d.courseName,
      cpf: new CPF(d.cpf),
      studentName: d.studentName,
      workload: d.workload,
      summary: d.summary,
    });
  });

  try {
    const saveFiles = await makeSaveMultipleCertificatesFileUseCase().execute(data);

    return NextResponse.json({
      success: true,
      data: CertificatePresenter.toManyViewModel(saveFiles.certificates),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
