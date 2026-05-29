import { certificateServiceFactory } from '@/src/core/factories/service.factory';
import { NextResponse } from 'next/server';
import archiver from 'archiver';
import { PassThrough } from 'node:stream';

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

    // Build a ZIP archive in memory using archiver + PassThrough stream
    const passthrough = new PassThrough();
    const archive = archiver('zip', { zlib: { level: 6 } });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(passthrough);

    for (const { buffer, filename } of pdfs) {
      archive.append(buffer, { name: filename });
    }

    await archive.finalize();

    // Collect the piped chunks from PassThrough
    const chunks: Buffer[] = [];
    for await (const chunk of passthrough) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const zipBuffer = Buffer.concat(chunks);

    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const zipFilename = `certificados_${timestamp}.zip`;

    return new NextResponse(zipBuffer.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
        'Content-Length': zipBuffer.length.toString(),
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
