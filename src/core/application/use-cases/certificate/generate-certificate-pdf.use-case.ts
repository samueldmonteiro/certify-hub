import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';
import { FileCertificateGenerator } from '@/src/core/domain/services/file-certificate-generator';
import { DomainError } from '@/src/core/domain/errors/domain.error';

export interface GenerateCertificatePDFResponse {
  buffer: Buffer;
  filename: string;
}

export class GenerateCertificatePDFUseCase {
  constructor(
    private certificateRepo: ICertificateRepository,
    private fileGenerator: FileCertificateGenerator,
  ) { }

  async execute(certificateId: string): Promise<GenerateCertificatePDFResponse> {
    const certificate = await this.certificateRepo.findById(certificateId);

    if (!certificate) {
      throw new DomainError('Certificado não encontrado');
    }

    const buffer = await this.fileGenerator.generate(certificate, {
      studentName: certificate.studentName,
      cpf: certificate.cpf,
      completionDate: certificate.completionDate,
      courseName: certificate.courseName,
      workload: certificate.workload,
      message: certificate.message,
    });

    const safeName = certificate.studentName.replace(/\s+/g, '_').toLowerCase();
    const filename = `certificado_${safeName}.pdf`;

    return { buffer, filename };
  }
}
