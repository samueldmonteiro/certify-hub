import { CertificateSequence } from '@/src/core/domain/entities/certificate-sequence.entity';
import { ICertificateSequenceRepository } from '@/src/core/domain/repositories/certificate-sequence.repository';
import { prisma } from '@/src/lib/prisma';
import { CertificateSequenceMapper } from './mappers/certificate-sequence.mapper';

export class PrismaCertificateSequenceRepository implements ICertificateSequenceRepository {
  async findByYear(year: number): Promise<CertificateSequence | null> {
    const data = await prisma.certificateSequence.findFirst({
      where: { year },
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
      where: { id: sequence.id },
      data,
    });
    return CertificateSequenceMapper.toDomain(updated);
  }
}
