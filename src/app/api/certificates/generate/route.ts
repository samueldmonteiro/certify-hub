import { CertificateDraft } from '@/src/core/value-objects/certificate-draft.value-object';
import { CPF } from '@/src/core/value-objects/cpf.value-object';
import { CertificateDraftArraySchema, CertificateDraftErrorsSchema, CertificateDraftSchemaDTO } from '@/src/core/validations/certificate-student-data.schema';
import { NextResponse } from 'next/server';
import z from 'zod';
import { registerCertificateDataServiceFactory } from '@/src/core/factories/service.factory';
import { RegisterCertificateRequest } from '@/src/core/services/register-certificate-data.service';
import { CertificateType } from '@/src/core/enums/certificate-type.enum';
import { CertificateViewModel } from '@/src/core/entities/certificate.entity';

export interface RegisterCertificatesResponse {
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

  const data: RegisterCertificateRequest[] = [];
  body.forEach(d => {
    data.push({
      date: new Date(d.completionDate),
      cpf: d.cpf,
      studentName: d.studentName,
      hours: d.workload,
      type: d.type as CertificateType,
    });
  });

  try {
    console.log(data);
    const result = await registerCertificateDataServiceFactory().register(data);

    return NextResponse.json({
      success: true,
      data: result.certificates.map((certificate) => certificate.toViewModel()),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

