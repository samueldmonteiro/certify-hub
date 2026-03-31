import { makeGenerateCertificatesBatchUseCase } from '@/src/core/infra/factories/make-generate-certificates-batch.use-case.factory';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const BatchDownloadSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, 'Selecione ao menos um certificado'),
});

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = BatchDownloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'IDs inválidos' },
      { status: 400 },
    );
  }

  try {
    const { buffer, filename } = await makeGenerateCertificatesBatchUseCase().execute(parsed.data.ids);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
