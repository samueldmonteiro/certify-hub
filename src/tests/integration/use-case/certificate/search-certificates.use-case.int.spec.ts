import { SearchCertificatesUseCase } from '@/src/core/application/use-cases/certificate/search-certificates.use-case';
import { CertificateSearchParams } from '@/src/core/domain/repositories/certificate.repository';
import { PrismaCertificateRepository } from '@/src/core/infra/database/prisma/prisma-certificate.repository';
import { prisma } from '@/src/lib/prisma';
import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

let sut: SearchCertificatesUseCase;

describe('SearchCertificatesUseCase (Int)', () => {

  beforeEach(async () => {

    sut = new SearchCertificatesUseCase(
      new PrismaCertificateRepository(),
    );

    await prisma.certificate.createMany({
      data: [
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

        {
          id: randomUUID(),
          completionDate: new Date('2024-02-02'),
          courseName: 'course 1',
          cpf: '44441414444',
          page: '001/2026',
          ptsBook: '001/2026',
          registrationNumber: '0002/2026',
          studentName: 'Ananda Pinheiros',
          workload: 8,
        },

        {
          id: randomUUID(),
          completionDate: new Date('2024-02-02'),
          courseName: 'course 2',
          cpf: '44444444444',
          page: '001/2026',
          ptsBook: '001/2026',
          registrationNumber: '0003/2026',
          studentName: 'Davi Silva',
          workload: 8,
        },
      ],
    });
  });

  afterEach(async()=>{
    await prisma.certificate.deleteMany({});
  });

  it('deve ser possível buscar os certificados sem parâmetros', async () => {

    const params: CertificateSearchParams = {};

    const response = await sut.execute(params);

    expect(response.items.length).toBe(3);
    expect(response.total).toBe(3);
  });

  it('deve ser possível buscar os certificados defindo parâmetros de paginação', async () => {

    const params: CertificateSearchParams = {
      perPage: 1,
      page: 2,
    };

    const response = await sut.execute(params);

    expect(response.items.length).toBe(1);
    expect(response.total).toBe(3);
    expect(response.perPage).toBe(1);
    expect(response.page).toBe(2);
  });

  it('deve ser possível buscar os certificados filtrando pelo cpf', async () => {

    const params: CertificateSearchParams = {
      cpf: '44444444444',
    };

    const response = await sut.execute(params);

    expect(response.items[0].cpf.getValue()).toBe('44444444444');
    expect(response.items[0].studentName).toBe('Davi Silva');
    expect(response.items.length).toBe(1);

  });
});