import { Certificate } from '../../entities/certificate.entity';
import { CertificateSequence } from '../../entities/certificate-sequence.entity';
import {
  ICertificateRepository,
  CertificateSearchParams,
  PaginatedResult,
} from '../certificate.repository';
import { prisma } from '@/src/lib/prisma';
import { CertificateMapper } from '../../mappers/certificate.mapper';
import { CertificateWhereInput } from '@/src/generated/prisma/models';
import { RegistrationNumber } from '../../value-objects/registration-number.value-object';
import { CertificatePage } from '../../value-objects/certificate-page.value-object';

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
      // Re-lê a sequência dentro da transação para evitar condição de corrida
      const freshSeq = await tx.certificateSequence.findUnique({
        where: {
          type_year: {
            type: sequence.type as any,
            year: sequence.year,
          },
        },
      });

      if (!freshSeq) {
        throw new Error('Sequence not found for type/year');
      }

      let index = freshSeq.lastRegistrationIndex;

      for (const cert of certificates) {
        index += 1;

        const regNumber = `${String(index).padStart(4, '0')}/${sequence.year}`;
        const pageIndex = Math.ceil(index / 50);
        const page = `${String(pageIndex).padStart(3, '0')}/${sequence.year}`;

        cert.changeRegistrationNumber(new RegistrationNumber(regNumber));
        cert.changePage(new CertificatePage(page));

        const data = CertificateMapper.toPrismaCreate(cert);
        await tx.certificate.create({ data });
      }

      await tx.certificateSequence.update({
        where: {
          type_year: {
            type: sequence.type as any,
            year: sequence.year,
          },
        },
        data: { lastRegistrationIndex: index },
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
