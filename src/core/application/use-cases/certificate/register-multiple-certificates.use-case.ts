import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { CertificatePage } from '@/src/core/domain/value-objects/certificate-page.value-object';
import { PTSBook } from '@/src/core/domain/value-objects/pts-book.value-object';
import { RegistrationNumber } from '@/src/core/domain/value-objects/registration-number.value-object';
import { randomInt, randomUUID } from 'crypto';

export interface RegisterMultipleCertificatesResponse {
  certificates: Certificate[]
}

export class RegisterMultipleCertificatesUseCase {
  constructor(
    private certificateRepo: ICertificateRepository,
  ) { }

  async execute(data: CertificateDraft[]): Promise<RegisterMultipleCertificatesResponse> {

    const certificates: Certificate[] = [];

    data.forEach(certData => {

      certificates.push(
        new Certificate({
          id: randomUUID(),
          completionDate: certData.completionDate,
          courseName: certData.courseName,
          cpf: certData.cpf,
          createdAt: new Date(),
          studentName: certData.studentName,
          workload: certData.workload,
          fileURL: certData.fileUrl,
          registrationNumber: new RegistrationNumber(`0${randomInt(400)}/2026`),
          page: new CertificatePage('001/2026'),
          ptsBook: new PTSBook('001/2026'),
        }),
      );
    });

    const newCertificates: Certificate[] = [];

    for (const certData of certificates) {
      const newCert = await this.certificateRepo.create(certData);
      newCertificates.push(
        newCert,
      );
    }

    return {
      certificates: newCertificates,
    };
  }
}