import { beforeEach, describe, it, expect, vi, Mocked } from 'vitest';
import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';
import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { RegisterMultipleCertificatesUseCase } from './register-multiple-certificates.use-case';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';

const certificateRepositoryMock: Mocked<ICertificateRepository> = {
  create: vi.fn(),
  findById: vi.fn(),
};

let sut: RegisterMultipleCertificatesUseCase;

beforeEach(() => {
  certificateRepositoryMock.create.mockReset();

  sut = new RegisterMultipleCertificatesUseCase(
    certificateRepositoryMock,
  );
});

describe('RegisterMultipleCertificatesUseCase (Unit)', () => {

  it('should register a certificate successfully', async () => {
    certificateRepositoryMock.create.mockImplementation(
      async (certificate: Certificate) => certificate,
    );

    const certDrafts: CertificateDraft[] = [
      {
        completionDate: new Date('2024-02-02'),
        courseName: 'Course 1',
        cpf: new CPF('62910723356'),
        studentName: 'Student 1',
        workload: 8,
        fileUrl: 'url1',
      },
      {
        completionDate: new Date('2024-04-04'),
        courseName: 'Course 2',
        cpf: new CPF('62910723356'),
        studentName: 'Student 2',
        workload: 9,
        fileUrl: 'url2',
      },
    ];

    const response = await sut.execute(certDrafts);

    expect(certificateRepositoryMock.create).toHaveBeenCalledTimes(2);
    expect(response.certificates[0]).instanceOf(Certificate);
    expect(response.certificates[0].fileURL).toBe('url1');
  });
});
