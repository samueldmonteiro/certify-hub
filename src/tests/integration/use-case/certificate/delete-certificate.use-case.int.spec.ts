import { DeleteCertificateUseCase } from '@/src/core/application/use-cases/certificate/delete-certificate.use-case';
import { PrismaCertificateRepository } from '@/src/core/infra/database/prisma/prisma-certificate.repository';
import { prisma } from '@/src/lib/prisma';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';

let sut: DeleteCertificateUseCase;

beforeEach(async () => {
  sut = new DeleteCertificateUseCase(new PrismaCertificateRepository());

  await prisma.certificate.deleteMany({});
});

describe('DeleteManyCertificatesUseCase (Int)', () => {

  it('should delete many certificates', async () => {
    const randomIds = Array.from({ length: 1 }, () => randomUUID());

    const certificates = [
      {
        id: randomIds[0],
        completionDate: new Date('2024-02-02'),
        courseName: 'course 1',
        cpf: '62910223334',
        page: '001/2026',
        ptsBook: '001/2026',
        registrationNumber: '0001/2026',
        studentName: 'Samuel Davi',
        workload: 8,
      },
    ];

    await prisma.certificate.createMany({ data: certificates });

    const response = await sut.execute(randomIds[0]);
    expect(response).toBeUndefined();
  });

  it('should not delete certificate', async () => {

    const certificates = [
      {
        id: randomUUID(),
        completionDate: new Date('2024-02-02'),
        courseName: 'course 1',
        cpf: '62910223334',
        page: '001/2026',
        ptsBook: '001/2026',
        registrationNumber: '0001/2026',
        studentName: 'Samuel Davi',
        workload: 8,
      },
    ];

    await prisma.certificate.createMany({ data: certificates });

    expect(async () => {
      await sut.execute('non-existent-id');
    }).rejects.toThrowError();
  });
});