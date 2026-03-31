import { beforeEach, describe, it, expect, vi, Mocked } from 'vitest';
import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';
import { RegisterCertificatesUseCase } from './register-certificates.use-case';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';
import { ICertificateSequenceRepository } from '@/src/core/domain/repositories/certificate-sequence.repository';
import { CertificateSequence } from '@/src/core/domain/entities/certificate-sequence.entity';

const certificateRepositoryMock: Mocked<ICertificateRepository> = {
  create: vi.fn(),
  createMany: vi.fn(),
  findById: vi.fn(),
  search: vi.fn(),
  lastCreated: vi.fn(),
  delete: vi.fn(),
  deleteMany: vi.fn(),
  update: vi.fn(),
};

const sequenceRepositoryMock: Mocked<ICertificateSequenceRepository> = {
  findByYear: vi.fn(),
  create: vi.fn(),
  save: vi.fn(),
};

let sut: RegisterCertificatesUseCase;
const currentYear = new Date().getFullYear();

function makeSequence(lastIndex: number): CertificateSequence {
  return new CertificateSequence({
    id: `singleton-${currentYear}`,
    lastRegistrationIndex: lastIndex,
    year: currentYear,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  sut = new RegisterCertificatesUseCase(certificateRepositoryMock, sequenceRepositoryMock);
});

describe('RegisterCertificatesUseCase (Unit)', () => {
  it('should register multiple certificates by calling repository createMany', async () => {
    const draftCerts: CertificateDraft[] = [
      { completionDate: new Date('2024-02-02'), courseName: 'Course 1', cpf: new CPF('62910723356'), studentName: 'Student 1', workload: 8 },
      { completionDate: new Date('2024-04-04'), courseName: 'Course 2', cpf: new CPF('62910723356'), studentName: 'Student 2', workload: 9 },
    ];

    // Mock sequence existing check
    sequenceRepositoryMock.findByYear.mockResolvedValueOnce(makeSequence(0));

    const response = await sut.execute(draftCerts);

    expect(certificateRepositoryMock.createMany).toHaveBeenCalledTimes(1);
    expect(response.certificates).toHaveLength(2);
    expect(response.certificates[0].registrationNumber.getValue()).toBe(`0001/${currentYear}`);
    expect(response.certificates[1].registrationNumber.getValue()).toBe(`0002/${currentYear}`);
  });

  it('should propagate errors from the repository', async () => {
    const draftCerts: CertificateDraft[] = [
      { completionDate: new Date('2024-02-02'), courseName: 'Course 1', cpf: new CPF('62910723356'), studentName: 'Student 1', workload: 8 },
    ];

    sequenceRepositoryMock.findByYear.mockResolvedValueOnce(makeSequence(0));
    certificateRepositoryMock.createMany.mockRejectedValueOnce(new Error('Repository Error'));

    await expect(sut.execute(draftCerts)).rejects.toThrow('Repository Error');
  });
});
