import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';
import { prisma } from '@/src/lib/prisma';
import { CertificateMapper } from './mappers/certificate.mapper';

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

}