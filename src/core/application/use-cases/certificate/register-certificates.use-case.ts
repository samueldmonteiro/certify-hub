import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { CertificateSequence } from '@/src/core/domain/entities/certificate-sequence.entity';
import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';
import { ICertificateSequenceRepository } from '@/src/core/domain/repositories/certificate-sequence.repository';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { CertificatePage } from '@/src/core/domain/value-objects/certificate-page.value-object';
import { PTSBook } from '@/src/core/domain/value-objects/pts-book.value-object';
import { RegistrationNumber } from '@/src/core/domain/value-objects/registration-number.value-object';
import { randomUUID } from 'node:crypto';

export interface RegisterCertificatesResponse {
  certificates: Certificate[]
}

export class RegisterCertificatesUseCase {
  constructor(
    private certificateRepo: ICertificateRepository,
    private sequenceRepo: ICertificateSequenceRepository,
  ) { }

  /**
   * Gets or initializes the sequence for the current year.
   * The sequence is a singleton per year — never goes back down on deletion.
   */
  private async getOrInitSequence(year: number): Promise<CertificateSequence> {
    const existing = await this.sequenceRepo.findByYear(year);
    if (existing) return existing;

    const newSequence = new CertificateSequence({
      id: 'singleton-' + year,
      lastRegistrationIndex: 0,
      year,
    });

    return this.sequenceRepo.create(newSequence);
  }

  async execute(draftCertificates: CertificateDraft[]): Promise<RegisterCertificatesResponse> {
    const currentYear = new Date().getFullYear();
    
    // Garantir que a sequence existe
    const sequence = await this.getOrInitSequence(currentYear);

    const certificates: Certificate[] = [];

    for (const certificateDraft of draftCertificates) {
      // Advance the sequence counter — this returns the next registration index
      const nextIndex = sequence.nextRegistrationIndex();

      const regNumberStr = String(nextIndex).padStart(4, '0') + '/' + currentYear;
      const pageIndex = Math.ceil(nextIndex / 50);
      const pageStr = String(pageIndex).padStart(3, '0') + '/' + currentYear;
      const ptsBookStr = `001/${currentYear}`;

      const newCert = new Certificate({
        id: randomUUID(),
        completionDate: certificateDraft.completionDate,
        courseName: certificateDraft.courseName,
        cpf: certificateDraft.cpf,
        createdAt: new Date(),
        studentName: certificateDraft.studentName,
        workload: certificateDraft.workload,
        message: certificateDraft.message,
        registrationNumber: new RegistrationNumber(regNumberStr),
        page: new CertificatePage(pageStr),
        ptsBook: new PTSBook(ptsBookStr),
      });

      certificates.push(newCert);
    }

    // Persistir de forma atômica através do repositório
    await this.certificateRepo.createMany(certificates, sequence);

    return { certificates };
  }
}
