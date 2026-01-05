import { beforeEach, describe, it, expect, vi, Mocked } from 'vitest';
import { RegisterCertificateUseCase } from './register-certificate.use-case';
import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';
import { Certificate } from '@/src/core/domain/entities/certificate.entity';

const certificateRepositoryMock: Mocked<ICertificateRepository> = {
  create: vi.fn(),
  findById: vi.fn(),
};

let sut: RegisterCertificateUseCase;

beforeEach(() => {
  certificateRepositoryMock.create.mockReset();
  sut = new RegisterCertificateUseCase(certificateRepositoryMock);
});

describe('RegisterCertificateUseCase (Unit)', () => {

  it('should register a certificate successfully', async () => {
    certificateRepositoryMock.create.mockImplementation(
      async (certificate: Certificate) => certificate,
    );

    const response = await sut.execute({
      studentName: 'Test Student',
      courseName: 'Course test',
      cpf: '88888888888',
      workload: 80,
      completionDate: new Date('2025-01-01'),
      page: '001/2026',
      registrationNumber: '0001/2026',
    });

    expect(certificateRepositoryMock.create).toHaveBeenCalledTimes(1);

    expect(certificateRepositoryMock.create).toHaveBeenCalledWith(
      expect.any(Certificate),
    );

    expect(response.certificate).toBeInstanceOf(Certificate);
  });
});
