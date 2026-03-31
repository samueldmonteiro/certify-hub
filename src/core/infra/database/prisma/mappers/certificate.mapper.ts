import { Certificate as PrismaCertificate } from '@/generated/prisma/client';
import { Certificate, CertificateProps } from '@/src/core/domain/entities/certificate.entity';
import { CertificatePage } from '@/src/core/domain/value-objects/certificate-page.value-object';
import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';
import { PTSBook } from '@/src/core/domain/value-objects/pts-book.value-object';
import { RegistrationNumber } from '@/src/core/domain/value-objects/registration-number.value-object';

// Tipos auxiliares para relacionamentos
type PrismaCertificateWithRelations = PrismaCertificate & {
  //posts?: PrismaPost[];
  //roles?: (PrismaCertificateRole & { role: PrismaRole })[];
};

export class CertificateMapper {

  static toDomain(prismaCertificate: PrismaCertificateWithRelations): Certificate {
    const userProps: CertificateProps = {
      id: prismaCertificate.id,
      studentName: prismaCertificate.studentName,
      courseName: prismaCertificate.courseName,
      completionDate: prismaCertificate.completionDate,
      cpf: new CPF(prismaCertificate.cpf),
      createdAt: prismaCertificate.createdAt,
      page: new CertificatePage(prismaCertificate.page),
      ptsBook: new PTSBook(prismaCertificate.ptsBook),
      registrationNumber: new RegistrationNumber(prismaCertificate.registrationNumber),
      workload: prismaCertificate.workload,
      message: prismaCertificate.message ?? undefined,
    };
    return new Certificate(userProps);
  }

  static toDomainMany(prismaCertificates: PrismaCertificateWithRelations[]): Certificate[] {
    return prismaCertificates.map(user => this.toDomain(user));
  }

  static toPrismaCreate(certificate: Certificate): Omit<PrismaCertificate, 'createdAt'> {
    return {
      id: certificate.id,
      completionDate: certificate.completionDate,
      courseName: certificate.courseName,
      cpf: certificate.cpf.getValue(),
      page: certificate.page.getValue(),
      registrationNumber: certificate.registrationNumber.getValue(),
      ptsBook: certificate.ptsBook.getValue(),
      studentName: certificate.studentName,
      workload: certificate.workload,
      message: certificate.message ?? null,
    };
  }

  static toPrismaUpdate(certificate: Certificate): Partial<Omit<PrismaCertificate, 'id' | 'createdAt'>> {
    return {
      completionDate: certificate.completionDate,
      courseName: certificate.courseName,
      cpf: certificate.cpf.getValue(),
      page: certificate.page.getValue(),
      registrationNumber: certificate.registrationNumber.getValue(),
      ptsBook: certificate.ptsBook.getValue(),
      studentName: certificate.studentName,
      workload: certificate.workload,
      message: certificate.message ?? null,
    };
  }
}
