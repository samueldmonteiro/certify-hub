import { CertificateDraftArraySchema, CertificateDraftErrorsSchema, CertificateDraftSchemaDTO } from '@/src/core/validations/certificate-student-data.schema';
import { NextResponse } from 'next/server';
import { registerCertificateDataServiceFactory } from '@/src/core/factories/service.factory';
import { RegisterCertificateRequest } from '@/src/core/services/register-certificate-data.service';
import { CertificateType } from '@/src/core/enums/certificate-type.enum';
import { CertificateViewModel } from '@/src/core/entities/certificate.entity';

export type RegisterCertificatesResponse = {
  success: true;
  data: CertificateViewModel[];
} | {
  success: false;
  message: string;
  errors?: CertificateDraftErrorsSchema
}
export async function POST(req: Request) {
  const body = await req.json() as CertificateDraftSchemaDTO[];

  const parsed = CertificateDraftArraySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Dados de entrada inválidos.',
        errors: parsed.error.format(),
      },
      { status: 400 },
    );
  }

  const data: RegisterCertificateRequest[] = [];
  body.forEach(d => {
    data.push({
      date: new Date(d.date),
      cpf: d.cpf,
      studentName: d.studentName,
      hours: d.hours,
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

