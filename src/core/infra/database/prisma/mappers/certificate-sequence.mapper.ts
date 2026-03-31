import { CertificateSequence as PrismaCertificateSequence } from '@/generated/prisma/client';
import { CertificateSequence } from '@/src/core/domain/entities/certificate-sequence.entity';

export class CertificateSequenceMapper {
  static toDomain(prisma: PrismaCertificateSequence): CertificateSequence {
    return new CertificateSequence({
      id: prisma.id,
      lastRegistrationIndex: prisma.lastRegistrationIndex,
      year: prisma.year,
    });
  }

  static toPrismaCreate(sequence: CertificateSequence): PrismaCertificateSequence {
    return {
      id: sequence.id,
      lastRegistrationIndex: sequence.lastRegistrationIndex,
      year: sequence.year,
    };
  }

  static toPrismaUpdate(sequence: CertificateSequence): Omit<PrismaCertificateSequence, 'id' | 'year'> {
    return {
      lastRegistrationIndex: sequence.lastRegistrationIndex,
    };
  }
}
