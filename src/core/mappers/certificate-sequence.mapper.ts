import { CertificateSequence as PrismaCertificateSequence } from '@/src/generated/prisma/client';
import { CertificateSequence } from '../entities/certificate-sequence.entity';
import { CertificateType } from '../enums/certificate-type.enum';

export class CertificateSequenceMapper {
  static toDomain(prisma: PrismaCertificateSequence): CertificateSequence {
    return new CertificateSequence({
      typeId: prisma.typeId,
      lastRegistrationIndex: prisma.lastRegistrationIndex,
      year: prisma.year,
      type: prisma.type as CertificateType,
    });
  }

  static toPrismaCreate(sequence: CertificateSequence): PrismaCertificateSequence {
    return {
      typeId: sequence.typeId,
      lastRegistrationIndex: sequence.lastRegistrationIndex,
      year: sequence.year,
      type: sequence.type as any,
    };
  }

  static toPrismaUpdate(sequence: CertificateSequence): Omit<PrismaCertificateSequence, 'typeId' | 'year' | 'type'> {
    return {
      lastRegistrationIndex: sequence.lastRegistrationIndex,
    };
  }
}

