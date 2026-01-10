import { beforeEach, describe, it, expect, vi, Mocked } from 'vitest';
import { StorageFileCertificate } from '@/src/core/domain/services/storage-file-certificate';
import { FileCertificateGenerator } from '@/src/core/domain/services/file-certificate-generator';
import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';
import { SaveMultipleCertificatesFileUseCase } from './save-multiple-certificates-file.use-case';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';

const storageFileCertificateMock: Mocked<StorageFileCertificate> = {
  storage: vi.fn(),
};

const fileGeneratorMock: Mocked<FileCertificateGenerator> = {
  generate: vi.fn(),
};

let sut: SaveMultipleCertificatesFileUseCase;

beforeEach(() => {
  fileGeneratorMock.generate.mockReset();
  storageFileCertificateMock.storage.mockReset();

  sut = new SaveMultipleCertificatesFileUseCase(
    fileGeneratorMock,
    storageFileCertificateMock,
  );
});

describe('SaveMultipleCertificatesFileUseCase (Unit)', () => {
  it('should generate and store files for all certificates and attach fileUrl', async () => {
    const bufferMock = Buffer.from('pdf-content');

    fileGeneratorMock.generate.mockResolvedValue(bufferMock);
    storageFileCertificateMock.storage
      .mockResolvedValueOnce('file-url-1')
      .mockResolvedValueOnce('file-url-2');

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

    expect(fileGeneratorMock.generate).toHaveBeenNthCalledWith(1, draftCerts[0]);
    expect(fileGeneratorMock.generate).toHaveBeenNthCalledWith(2, draftCerts[1]);

    expect(storageFileCertificateMock.storage).toHaveBeenNthCalledWith(1, bufferMock);
    expect(storageFileCertificateMock.storage).toHaveBeenNthCalledWith(2, bufferMock);

    expect(response.draftCertificates[0].fileUrl).toBe('file-url-1');
    expect(response.draftCertificates[1].fileUrl).toBe('file-url-2');
    expect(response.draftCertificates[0].courseName).toBe('Course 1');
  });
});