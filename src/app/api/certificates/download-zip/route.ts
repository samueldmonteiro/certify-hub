import { certificateServiceFactory } from '@/src/core/factories/service.factory';
import { NextResponse } from 'next/server';
import archiver from 'archiver';

export async function POST(req: Request) {
  try {
    const body = await req.json() as { ids: string[] };

    if (!Array.isArray(body.ids) || body.ids.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Nenhum ID de certificado fornecido.' },
        { status: 400 },
      );
    }

    if (body.ids.length > 100) {
      return NextResponse.json(
        { success: false, message: 'Máximo de 100 certificados por vez.' },
        { status: 400 },
      );
    }

    const service = certificateServiceFactory();
    const pdfs = await service.generateManyPdf(body.ids);

    const archive = archiver('zip', { zlib: { level: 6 } });

    for (const { buffer, filename } of pdfs) {
      archive.append(buffer, { name: filename });
    }
    archive.finalize();

    // Stream the ZIP straight to the response instead of buffering it into a
    // single Buffer: Vercel Functions cap non-streaming response bodies at
    // 4.5MB, which a 10+ certificate ZIP can easily exceed.
    const zipStream = new ReadableStream<Uint8Array>({
      start(controller) {
        archive.on('data', (chunk: Buffer) => controller.enqueue(chunk));
        archive.on('end', () => controller.close());
        archive.on('error', (err) => controller.error(err));
      },
    });

    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const zipFilename = `certificados_${timestamp}.zip`;

    return new NextResponse(zipStream, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
      },
    });
  } catch (error: any) {
    console.error('[download-zip] Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao gerar arquivo ZIP.' },
      { status: 500 },
    );
  }
}
