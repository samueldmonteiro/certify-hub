import { beforeEach, describe, it, expect, vi, Mocked } from 'vitest';
import { StorageFileCertificate } from '@/src/core/domain/services/storage-file-certificate';
import { FileCertificateGenerator } from '@/src/core/domain/services/file-certificate-generator';
import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';
import { SaveMultipleCertificatesFileUseCase } from './save-multiple-certificates-file.use-case';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';
import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { RegistrationNumber } from '@/src/core/domain/value-objects/registration-number.value-object';
import { CertificatePage } from '@/src/core/domain/value-objects/certificate-page.value-object';
import { PTSBook } from '@/src/core/domain/value-objects/pts-book.value-object';

const storageFileCertificateMock: Mocked<StorageFileCertificate> = {
  storage: vi.fn(),
};

const fileGeneratorMock: Mocked<FileCertificateGenerator> = {
  generate: vi.fn(),
};

const certificateRepositoryMock: Mocked<ICertificateRepository> = {
  create: vi.fn(),
  findById: vi.fn(),
  search: vi.fn(),
  lastCreated: vi.fn(),
  delete: vi.fn(),
  deleteMany: vi.fn(),
};

let sut: SaveMultipleCertificatesFileUseCase;

beforeEach(() => {
  fileGeneratorMock.generate.mockReset();
  storageFileCertificateMock.storage.mockReset();
  certificateRepositoryMock.create.mockReset();
  certificateRepositoryMock.lastCreated.mockReset();

  sut = new SaveMultipleCertificatesFileUseCase(
    fileGeneratorMock,
    storageFileCertificateMock,
    certificateRepositoryMock,
  );
});

describe('SaveMultipleCertificatesFileUseCase (Unit)', () => {
  it('should generate and store files for all certificates and create them in repository', async () => {
    const bufferMock = Buffer.from('pdf-content');
    const currentYear = new Date().getFullYear();

    fileGeneratorMock.generate.mockResolvedValue(bufferMock);
    storageFileCertificateMock.storage
      .mockResolvedValueOnce('file-url-1')
      .mockResolvedValueOnce('file-url-2');

    certificateRepositoryMock.lastCreated.mockResolvedValue(null);

    const createdCert1 = new Certificate({
      id: expect.any(String),
      completionDate: new Date('2024-02-02'),
      courseName: 'Course 1',
      cpf: new CPF('62910723356'),
      studentName: 'Student 1',
      workload: 8,
      fileURL: 'file-url-1',
      registrationNumber: new RegistrationNumber('0001/2025'),
      page: new CertificatePage('001/2025'),
      ptsBook: new PTSBook(`001/${currentYear}`),
      createdAt: new Date(),
    });

    const createdCert2 = new Certificate({
      id: expect.any(String),
      completionDate: new Date('2024-04-04'),
      courseName: 'Course 2',
      cpf: new CPF('62910723356'),
      studentName: 'Student 2',
      workload: 9,
      fileURL: 'file-url-2',
      registrationNumber: new RegistrationNumber('0002/2025'),
      page: new CertificatePage('001/2025'),
      ptsBook: new PTSBook(`001/${currentYear}`),
      createdAt: new Date(),
    });

    certificateRepositoryMock.create
      .mockResolvedValueOnce(createdCert1)
      .mockResolvedValueOnce(createdCert2);

    certificateRepositoryMock.lastCreated
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(createdCert1);

    const draftCerts: CertificateDraft[] = [
      {
        completionDate: new Date('2024-02-02'),
        courseName: 'Course 1',
        cpf: new CPF('62910723356'),
        studentName: 'Student 1',
        workload: 8,
      },
      {
        completionDate: new Date('2024-04-04'),
        courseName: 'Course 2',
        cpf: new CPF('62910723356'),
        studentName: 'Student 2',
        workload: 9,
      },
    ];

    const response = await sut.execute(draftCerts);

    expect(fileGeneratorMock.generate).toHaveBeenCalledTimes(2);
    expect(storageFileCertificateMock.storage).toHaveBeenCalledTimes(2);
    expect(certificateRepositoryMock.create).toHaveBeenCalledTimes(2);
    expect(certificateRepositoryMock.lastCreated).toHaveBeenCalledTimes(2);

    expect(fileGeneratorMock.generate).toHaveBeenNthCalledWith(1, expect.objectContaining({
      courseName: 'Course 1',
      studentName: 'Student 1',
    }));
    expect(fileGeneratorMock.generate).toHaveBeenNthCalledWith(2, expect.objectContaining({
      courseName: 'Course 2',
      studentName: 'Student 2',
    }));

    expect(storageFileCertificateMock.storage).toHaveBeenNthCalledWith(1, bufferMock);
    expect(storageFileCertificateMock.storage).toHaveBeenNthCalledWith(2, bufferMock);

    expect(response.certificates).toHaveLength(2);
    expect(response.certificates[0].fileURL).toBe('file-url-1');
    expect(response.certificates[1].fileURL).toBe('file-url-2');
    expect(response.certificates[0].courseName).toBe('Course 1');
    expect(response.certificates[1].courseName).toBe('Course 2');
    expect(response.certificates[0].registrationNumber.getValue()).toBe('0001/2025');
    expect(response.certificates[1].registrationNumber.getValue()).toBe('0002/2025');
  });

  it('should generate sequential registration numbers when last certificate exists', async () => {
    const bufferMock = Buffer.from('pdf-content');
    const currentYear = new Date().getFullYear();

    fileGeneratorMock.generate.mockResolvedValue(bufferMock);
    storageFileCertificateMock.storage.mockResolvedValue('file-url');

    const existingCert = new Certificate({
      id: '1',
      completionDate: new Date('2024-02-02'),
      courseName: 'Course 1',
      cpf: new CPF('62910723356'),
      studentName: 'Student 1',
      workload: 8,
      fileURL: 'url1',
      registrationNumber: new RegistrationNumber('0050/2025'),
      page: new CertificatePage('001/2025'),
      ptsBook: new PTSBook('001/2025'),
      createdAt: new Date(),
    });

    const createdCert = new Certificate({
      id: expect.any(String),
      completionDate: new Date('2024-02-02'),
      courseName: 'New Course',
      cpf: new CPF('62910723356'),
      studentName: 'New Student',
      workload: 10,
      fileURL: 'file-url',
      registrationNumber: new RegistrationNumber('0051/2025'),
      page: new CertificatePage('002/2025'),
      ptsBook: new PTSBook(`001/${currentYear}`),
      createdAt: new Date(),
    });

    certificateRepositoryMock.lastCreated.mockResolvedValue(existingCert);
    certificateRepositoryMock.create.mockResolvedValue(createdCert);

    const draftCerts: CertificateDraft[] = [
      {
        completionDate: new Date('2024-02-02'),
        courseName: 'New Course',
        cpf: new CPF('62910723356'),
        studentName: 'New Student',
        workload: 10,
      },
    ];

    const response = await sut.execute(draftCerts);

    expect(response.certificates[0].registrationNumber.getValue()).toBe('0051/2025');
    expect(response.certificates[0].page.getValue()).toBe('002/2025');
  });

  it('should generate next registration number and page', () => {
    const lastCertificate = new Certificate({
      id: '1',
      completionDate: new Date('2024-02-02'),
      courseName: 'Course 1',
      cpf: new CPF('62910723356'),
      studentName: 'Student 1',
      workload: 8,
      fileURL: 'url1',
      registrationNumber: new RegistrationNumber('0050/2024'),
      page: new CertificatePage('001/2024'),
      ptsBook: new PTSBook('001/2024'),
      createdAt: new Date(),
    });

    const nextRegistrationNumber = sut.generateNextRegistrationNumberAndPage(lastCertificate);

    expect(nextRegistrationNumber.registrationNumber.getValue()).toBe('0051/2024');
    expect(nextRegistrationNumber.page.getValue()).toBe('002/2024');
  });

  it('should handle page transition at 50 certificates boundary', () => {
    const lastCertificate = new Certificate({
      id: '1',
      completionDate: new Date('2024-02-02'),
      courseName: 'Course 1',
      cpf: new CPF('62910723356'),
      studentName: 'Student 1',
      workload: 8,
      fileURL: 'url1',
      registrationNumber: new RegistrationNumber('0050/2024'),
      page: new CertificatePage('001/2024'),
      ptsBook: new PTSBook('001/2024'),
      createdAt: new Date(),
    });

    const nextRegistrationNumber = sut.generateNextRegistrationNumberAndPage(lastCertificate);

    expect(nextRegistrationNumber.registrationNumber.getValue()).toBe('0051/2024');
    expect(nextRegistrationNumber.page.getValue()).toBe('002/2024');
  });
});