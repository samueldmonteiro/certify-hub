import { randomUUID } from 'crypto';
import { Certificate } from '../entities/certificate.entity';
import { CertificateSequence } from '../entities/certificate-sequence.entity';
import { CertificateType, CertificateTypeLabels } from '../enums/certificate-type.enum';
import { ICertificateSequenceRepository } from '../repositories/certificate-sequence.repository';
import { ICertificateRepository } from '../repositories/certificate.repository';
import { CertificatePage } from '../value-objects/certificate-page.value-object';
import { CPF } from '../value-objects/cpf.value-object';
import { PTSBook } from '../value-objects/pts-book.value-object';
import { RegistrationNumber } from '../value-objects/registration-number.value-object';

export interface RegisterCertificateRequest {
  studentName: string;
  cpf: string;
  date: Date;
  hours: number;
  type: CertificateType;
}

export class RegisterCertificateDataService {
  constructor(
    private readonly certificateRepository: ICertificateRepository,
    private readonly sequenceRepository: ICertificateSequenceRepository,
  ) { }

  private async getOrInitSequence(year: number, type: CertificateType): Promise<CertificateSequence> {
    const existing = await this.sequenceRepository.findByYearAndType(year, type);
    if (existing) return existing;

    const newSequence = new CertificateSequence({
      typeId: randomUUID(),
      lastRegistrationIndex: 0,
      year,
      type,
    });

    return this.sequenceRepository.create(newSequence);
  }

  async register(data: RegisterCertificateRequest[]) {
    const currentYear = new Date().getFullYear();

    const sequencesCache = new Map<CertificateType, CertificateSequence>();
    const certificatesByType = new Map<CertificateType, Certificate[]>();

    const getSequenceForType = async (type: CertificateType) => {
      let seq = sequencesCache.get(type);
      if (!seq) {
        seq = await this.getOrInitSequence(currentYear, type);
        sequencesCache.set(type, seq);
      }
      return seq;
    };

    for (const certificateDraft of data) {
      const sequence = await getSequenceForType(certificateDraft.type);

      // Advance the sequence counter — this returns the next registration index
      sequence.nextRegistrationIndex();

      const regNumberStr = sequence.currentRegistrationNumber();
      const pageStr = sequence.currentPage();
      const ptsBookStr = `001/${sequence.year}`;

      const newCert = new Certificate({
        id: randomUUID(),
        completionDate: certificateDraft.date,
        courseName: CertificateTypeLabels[certificateDraft.type] || 'Curso',
        cpf: new CPF(certificateDraft.cpf),
        createdAt: new Date(),
        studentName: certificateDraft.studentName,
        workload: certificateDraft.hours,
        type: certificateDraft.type,
        registrationNumber: new RegistrationNumber(regNumberStr),
        page: new CertificatePage(pageStr),
        ptsBook: new PTSBook(ptsBookStr),
      });

      let certs = certificatesByType.get(certificateDraft.type);
      if (!certs) {
        certs = [];
        certificatesByType.set(certificateDraft.type, certs);
      }
      certs.push(newCert);
    }

    // Persistir de forma atômica através do repositório
    const allCertificates: Certificate[] = [];
    for (const [type, certs] of certificatesByType.entries()) {
      const sequence = sequencesCache.get(type)!;
      await this.certificateRepository.createMany(certs, sequence);
      allCertificates.push(...certs);
    }

    return { certificates: allCertificates };
  }
}