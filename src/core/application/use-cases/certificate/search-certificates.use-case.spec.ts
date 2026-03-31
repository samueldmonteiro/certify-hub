import { SearchCertificatesUseCase } from '@/src/core/application/use-cases/certificate/search-certificates.use-case';
import {
  CertificateSearchParams,
  ICertificateRepository,
  PaginatedResult,
} from '@/src/core/domain/repositories/certificate.repository';
import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';
import { CertificatePage } from '@/src/core/domain/value-objects/certificate-page.value-object';
import { RegistrationNumber } from '@/src/core/domain/value-objects/registration-number.value-object';
import { PTSBook } from '@/src/core/domain/value-objects/pts-book.value-object';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it, Mocked, vi } from 'vitest';

const certificateRepoMock: Mocked<ICertificateRepository> = {
  search: vi.fn(),
  create: vi.fn(),
  findById: vi.fn(),
  delete: vi.fn(),
  deleteMany: vi.fn(),
  update: vi.fn(),
  lastCreated: vi.fn(),
};

let sut: SearchCertificatesUseCase;

describe('SearchCertificatesUseCase (Unit)', () => {
  beforeEach(() => {
    sut = new SearchCertificatesUseCase(certificateRepoMock);
  });

  it('should search certificates using repository and return paginated result', async () => {

    const params: CertificateSearchParams = {
      studentName: 'João',
      page: 1,
      perPage: 10,
    };

    const certificates = [
      new Certificate({
        id: randomUUID(),
        studentName: 'João Silva',
        courseName: 'React Avançado',
        cpf: new CPF('12345678909'),
        workload: 40,
        completionDate: new Date(),
        page: new CertificatePage('001/2026'),
        registrationNumber: new RegistrationNumber('0001/2026'),
        ptsBook: new PTSBook('001/2026'),
        createdAt: new Date(),
      }),
    ];

    const paginatedResult: PaginatedResult<Certificate> = {
      items: certificates,
      total: 1,
      page: 1,
      perPage: 10,
    };

    certificateRepoMock.search.mockResolvedValueOnce(paginatedResult);

    const result = await sut.execute(params);

    expect(certificateRepoMock.search).toHaveBeenCalledOnce();
    expect(certificateRepoMock.search).toHaveBeenCalledWith(params);

    expect(result).toEqual(paginatedResult);
  });
});
