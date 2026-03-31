import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { CertificateSequence } from '@/src/core/domain/entities/certificate-sequence.entity';
import {
  ICertificateRepository,
  CertificateSearchParams,
  PaginatedResult,
} from '@/src/core/domain/repositories/certificate.repository';
import { prisma } from '@/src/lib/prisma';
import { CertificateMapper } from './mappers/certificate.mapper';
import { CertificateSequenceMapper } from './mappers/certificate-sequence.mapper';
import { CertificateWhereInput } from '@/generated/prisma/models';

export class PrismaCertificateRepository implements ICertificateRepository {

  async delete(id: string): Promise<void> {
    await prisma.certificate.delete({ where: { id } });
  }

  async deleteMany(ids: string[]): Promise<void> {
    await prisma.certificate.deleteMany({ where: { id: { in: ids } } });
  }

  async lastCreated(): Promise<Certificate | null> {
    const lastCert = await prisma.certificate.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!lastCert) return null;
    return CertificateMapper.toDomain(lastCert);
  }

  async findById(id: string): Promise<Certificate | null> {
    const data = await prisma.certificate.findUnique({ where: { id } });
    if (!data) return null;
    return CertificateMapper.toDomain(data);
  }

  async create(certificate: Certificate): Promise<Certificate> {
    const certPrisma = CertificateMapper.toPrismaCreate(certificate);
    const created = await prisma.certificate.create({ data: certPrisma });
    return CertificateMapper.toDomain(created);
  }

  async createMany(certificates: Certificate[], sequence: CertificateSequence): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Usando create em loop para garantir que erros individuais
      // estourem a transação e causem rollback de tudo
      for (const cert of certificates) {
        const data = CertificateMapper.toPrismaCreate(cert);
        await tx.certificate.create({ data });
      }

      const sequencePrisma = CertificateSequenceMapper.toPrismaUpdate(sequence);
      await tx.certificateSequence.update({
        where: { id: sequence.id },
        data: sequencePrisma,
      });
    });
  }

  async update(certificate: Certificate): Promise<Certificate> {
    const certPrisma = CertificateMapper.toPrismaUpdate(certificate);
    const updated = await prisma.certificate.update({
      where: { id: certificate.id },
      data: certPrisma,
    });
    return CertificateMapper.toDomain(updated);
  }

  async search(
    params: CertificateSearchParams,
  ): Promise<PaginatedResult<Certificate>> {
    const {
      studentName,
      cpf,
      courseName,
      page = 1,
      perPage = 10,
    } = params;

    const where: CertificateWhereInput = {
      ...(studentName && {
        studentName: {
          contains: studentName,
          mode: 'insensitive',
        },
      }),

      ...(courseName && {
        courseName: {
          contains: courseName,
          mode: 'insensitive',
        },
      }),

      ...(cpf && { cpf }),
    };

    const skip = (page - 1) * perPage;

    const [total, data] = await Promise.all([
      prisma.certificate.count({ where }),
      prisma.certificate.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items: data.map(CertificateMapper.toDomain),
      total,
      page,
      perPage,
    };
  }
}
