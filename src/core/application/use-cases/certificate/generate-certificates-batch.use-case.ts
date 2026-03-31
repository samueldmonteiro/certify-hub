import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';
import { FileCertificateGenerator } from '@/src/core/domain/services/file-certificate-generator';
import { DomainError } from '@/src/core/domain/errors/domain.error';
import archiver from 'archiver';
import { Readable, PassThrough } from 'stream';

export interface GenerateCertificatesBatchResponse {
  buffer: Buffer;
  filename: string;
}

export class GenerateCertificatesBatchUseCase {
  constructor(
    private certificateRepo: ICertificateRepository,
    private fileGenerator: FileCertificateGenerator,
  ) { }

  async execute(certificateIds: string[]): Promise<GenerateCertificatesBatchResponse> {
    if (certificateIds.length === 0) {
      throw new DomainError('Nenhum certificado selecionado');
    }

    const passThrough = new PassThrough();
    const archive = archiver('zip', { zlib: { level: 6 } });

    archive.pipe(passThrough);

    const chunks: Buffer[] = [];
    passThrough.on('data', (chunk: Buffer) => chunks.push(chunk));

    const archiveFinished = new Promise<void>((resolve, reject) => {
      passThrough.on('end', resolve);
      passThrough.on('error', reject);
      archive.on('error', reject);
    });

    for (const id of certificateIds) {
      const certificate = await this.certificateRepo.findById(id);

      if (!certificate) {
        throw new DomainError(`Certificado com id "${id}" não encontrado`);
      }

      const pdfBuffer = await this.fileGenerator.generate(certificate, {
        studentName: certificate.studentName,
        cpf: certificate.cpf,
        completionDate: certificate.completionDate,
        courseName: certificate.courseName,
        workload: certificate.workload,
        message: certificate.message,
      });

      const safeName = certificate.studentName.replace(/\s+/g, '_').toLowerCase();
      archive.append(Readable.from(pdfBuffer), { name: `certificado_${safeName}.pdf` });
    }

    archive.finalize();
    await archiveFinished;

    const buffer = Buffer.concat(chunks);
    const filename = `certificados_${Date.now()}.zip`;

    return { buffer, filename };
  }
}
