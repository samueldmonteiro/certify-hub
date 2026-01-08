import { beforeEach, describe, it, expect, vi, Mocked } from 'vitest';
import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { SaveCertificateFileUseCase } from './save-certificate-file.use-case';
import { StorageFileCertificate } from '@/src/core/domain/services/storage-file-certificate';
import { FileCertificateGenerator } from '@/src/core/domain/services/file-certificate-generator';
import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';
import { RegistrationNumber } from '@/src/core/domain/value-objects/registration-number.value-object';
import { CertificatePage } from '@/src/core/domain/value-objects/certificate-page.value-object';
import { randomUUID } from 'node:crypto';
import { PTSBook } from '@/src/core/domain/value-objects/pts-book.value-object';

const storageFileCertificateMock: Mocked<StorageFileCertificate> = {
  storage: vi.fn(),
};

const fileGeneratorMock: Mocked<FileCertificateGenerator> = {
  generate: vi.fn(),
};

let sut: SaveCertificateFileUseCase;

beforeEach(() => {
  fileGeneratorMock.generate.mockReset();
  storageFileCertificateMock.storage.mockReset();

  sut = new SaveCertificateFileUseCase(
    fileGeneratorMock,
    storageFileCertificateMock,
  );
});

describe('SaveCertificateFileUseCase (Unit)', () => {

  it('should save a certificate successfully', async () => {
    
    fileGeneratorMock.generate.mockResolvedValue(Buffer.from('test'));
    storageFileCertificateMock.storage.mockResolvedValue('file-url-test');

    const certificate = new Certificate({
      id: randomUUID(),
      studentName: 'Test Student',
      courseName: 'Course test',
      cpf: new CPF('88888888888'),
      workload: 80,
      completionDate: new Date('2025-01-01'),
      page: new CertificatePage('001/2026'),
      registrationNumber: new RegistrationNumber('0001/2026'),
      ptsBook: new PTSBook('001/2026'),
      createdAt: new Date(),
      fileURL: 'file-url-test.com',
    });

    const response = await sut.execute(certificate);

    expect(fileGeneratorMock.generate).toHaveBeenCalledWith(certificate);
    expect(storageFileCertificateMock.storage).toHaveBeenCalledWith(
      Buffer.from('test'),
    );
    expect(response.fileURL).toBeDefined();
    expect(response.fileURL).toBe('file-url-test');
  });
});
