import { CertificateSequence } from '../../entities/certificate-sequence.entity';
import { ICertificateSequenceRepository } from '../certificate-sequence.repository';
import { prisma } from '@/src/lib/prisma';
import { CertificateSequenceMapper } from '../../mappers/certificate-sequence.mapper';
import { CertificateType } from '../../enums/certificate-type.enum';

export class PrismaCertificateSequenceRepository implements ICertificateSequenceRepository {
  async findByYear(year: number): Promise<CertificateSequence | null> {
    const data = await prisma.certificateSequence.findFirst({
      where: { year },
    });
    if (!data) return null;
    return CertificateSequenceMapper.toDomain(data);
  }

  async findByYearAndType(year: number, type: CertificateType): Promise<CertificateSequence | null> {
    const data = await prisma.certificateSequence.findUnique({
      where: {
        type_year: {
          type: type as any,
          year,
        },
      },
    });
    if (!data) return null;
    return CertificateSequenceMapper.toDomain(data);
  }

  async create(sequence: CertificateSequence): Promise<CertificateSequence> {
    const data = CertificateSequenceMapper.toPrismaCreate(sequence);
    const created = await prisma.certificateSequence.create({ data });
    return CertificateSequenceMapper.toDomain(created);
  }

  async save(sequence: CertificateSequence): Promise<CertificateSequence> {
    const data = CertificateSequenceMapper.toPrismaUpdate(sequence);
    const updated = await prisma.certificateSequence.update({
      where: {
        type_year: {
          type: sequence.type as any,
          year: sequence.year,
        },
      },
      data,
    });
    return CertificateSequenceMapper.toDomain(updated);
  }
}
