import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import {
  ICertificateRepository,
  CertificateSearchParams,
  PaginatedResult,
} from '@/src/core/domain/repositories/certificate.repository';
import { prisma } from '@/src/lib/prisma';
import { CertificateMapper } from './mappers/certificate.mapper';
import { CertificateWhereInput } from '@/generated/prisma/models';

export class PrismaCertificateRepository implements ICertificateRepository {
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
      ...(studentName &&{
        studentName: {
          contains: studentName,
          mode: 'insensitive',
        } }),

      ...(courseName &&{
        courseName: {
          contains: courseName,
          mode: 'insensitive',
        } }),

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
