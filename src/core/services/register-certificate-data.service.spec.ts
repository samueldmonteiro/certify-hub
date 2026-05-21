import { beforeEach, describe, it, expect, vi, Mocked } from 'vitest';
import { RegisterCertificateDataService, RegisterCertificateRequest } from './register-certificate-data.service';
import { CertificateType } from '../enums/certificate-type.enum';
import { CertificateSequence } from '../entities/certificate-sequence.entity';
import { ICertificateRepository } from '../repositories/certificate.repository';
import { ICertificateSequenceRepository } from '../repositories/certificate-sequence.repository';

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
  findByYearAndType: vi.fn(),
  create: vi.fn(),
  save: vi.fn(),
};

let sut: RegisterCertificateDataService;
const currentYear = new Date().getFullYear();

function makeSequence(lastIndex: number, type: CertificateType): CertificateSequence {
  return new CertificateSequence({
    typeId: `seq-${type}`,
    lastRegistrationIndex: lastIndex,
    year: currentYear,
    type,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  sut = new RegisterCertificateDataService(certificateRepositoryMock, sequenceRepositoryMock);
});

describe('RegisterCertificateDataService (Unit)', () => {
  it('should register certificates of the same type with sequential registration numbers', async () => {
    const requests: RegisterCertificateRequest[] = [
      { studentName: 'Alice', cpf: '62910723356', date: new Date('2024-02-02'), hours: 8, type: CertificateType.BRIGADISTA },
      { studentName: 'Bob', cpf: '62910723356', date: new Date('2024-03-03'), hours: 12, type: CertificateType.BRIGADISTA },
    ];

    sequenceRepositoryMock.findByYearAndType.mockResolvedValueOnce(makeSequence(0, CertificateType.BRIGADISTA));

    const response = await sut.register(requests);

    expect(sequenceRepositoryMock.findByYearAndType).toHaveBeenCalledTimes(1);
    expect(certificateRepositoryMock.createMany).toHaveBeenCalledTimes(1);
    expect(response.certificates).toHaveLength(2);
    expect(response.certificates[0].registrationNumber.getValue()).toBe(`0001/${currentYear}`);
    expect(response.certificates[1].registrationNumber.getValue()).toBe(`0002/${currentYear}`);
    expect(response.certificates[0].ptsBook.getValue()).toBe(`001/${currentYear}`);
    expect(response.certificates[1].ptsBook.getValue()).toBe(`001/${currentYear}`);
  });

  it('should create a new sequence when it does not exist for the given type', async () => {
    const requests: RegisterCertificateRequest[] = [
      { studentName: 'Alice', cpf: '62910723356', date: new Date('2024-02-02'), hours: 8, type: CertificateType.CIPEIRO },
    ];

    sequenceRepositoryMock.findByYearAndType.mockResolvedValueOnce(null);

    const newSeq = makeSequence(0, CertificateType.CIPEIRO);
    sequenceRepositoryMock.create.mockResolvedValueOnce(newSeq);

    const response = await sut.register(requests);

    expect(sequenceRepositoryMock.findByYearAndType).toHaveBeenCalledTimes(1);
    expect(sequenceRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(certificateRepositoryMock.createMany).toHaveBeenCalledTimes(1);
    expect(response.certificates).toHaveLength(1);
  });

  it('should handle certificates of different types separately', async () => {
    const requests: RegisterCertificateRequest[] = [
      { studentName: 'Alice', cpf: '62910723356', date: new Date('2024-02-02'), hours: 8, type: CertificateType.BRIGADISTA },
      { studentName: 'Bob', cpf: '62910723356', date: new Date('2024-03-03'), hours: 12, type: CertificateType.CIPEIRO },
    ];

    sequenceRepositoryMock.findByYearAndType
      .mockResolvedValueOnce(makeSequence(0, CertificateType.BRIGADISTA))
      .mockResolvedValueOnce(makeSequence(0, CertificateType.CIPEIRO));

    const response = await sut.register(requests);

    expect(sequenceRepositoryMock.findByYearAndType).toHaveBeenCalledTimes(2);
    expect(certificateRepositoryMock.createMany).toHaveBeenCalledTimes(2);
    expect(response.certificates).toHaveLength(2);
    expect(response.certificates[0].type).toBe(CertificateType.BRIGADISTA);
    expect(response.certificates[1].type).toBe(CertificateType.CIPEIRO);
  });

  it('should propagate errors from the certificate repository', async () => {
    const requests: RegisterCertificateRequest[] = [
      { studentName: 'Alice', cpf: '62910723356', date: new Date('2024-02-02'), hours: 8, type: CertificateType.BRIGADISTA },
    ];

    sequenceRepositoryMock.findByYearAndType.mockResolvedValueOnce(makeSequence(0, CertificateType.BRIGADISTA));
    certificateRepositoryMock.createMany.mockRejectedValueOnce(new Error('Database error'));

    await expect(sut.register(requests)).rejects.toThrow('Database error');
  });
});
