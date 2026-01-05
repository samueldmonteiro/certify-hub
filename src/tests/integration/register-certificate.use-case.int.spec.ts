import { beforeEach, describe, it, expect } from 'vitest';
import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { PrismaCertificateRepository } from '@/src/core/infra/database/prisma/prisma-certificate.repository';
import { RegisterCertificateUseCase } from '@/src/core/application/use-cases/certificate/register-certificate.use-case';


let sut: RegisterCertificateUseCase;

beforeEach(() => {
  sut = new RegisterCertificateUseCase(
    new PrismaCertificateRepository(),
  );
});

describe('RegisterCertificateUseCase (Unit)', () => {

  it('should register a certificate successfully', async () => {
   
    const response = await sut.execute({
      studentName: 'Test Student',
      courseName: 'Course test',
      cpf: '88888888888',
      workload: 80,
      completionDate: new Date('2025-01-01'),
      page: '001/2026',
      registrationNumber: '0001/2026',
    });

    expect(response.certificate).toBeInstanceOf(Certificate);
  });
});
