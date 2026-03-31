import { makeGenerateCertificatePDFUseCase } from '@/src/core/infra/factories/make-generate-certificate-pdf.use-case.factory';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const { buffer, filename } = await makeGenerateCertificatePDFUseCase().execute(id);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.message === 'Certificado não encontrado' ? 404 : 500 },
    );
  }
}
