import { beforeEach, describe, it, expect, vi, Mocked } from 'vitest';
import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';
import { GenerateCertificatePDFUseCase } from './generate-certificate-pdf.use-case';
import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';
import { FileCertificateGenerator } from '@/src/core/domain/services/file-certificate-generator';
import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { RegistrationNumber } from '@/src/core/domain/value-objects/registration-number.value-object';
import { CertificatePage } from '@/src/core/domain/value-objects/certificate-page.value-object';
import { PTSBook } from '@/src/core/domain/value-objects/pts-book.value-object';
import { DomainError } from '@/src/core/domain/errors/domain.error';

const certificateRepositoryMock: Mocked<ICertificateRepository> = {
  create: vi.fn(),
  findById: vi.fn(),
  search: vi.fn(),
  lastCreated: vi.fn(),
  delete: vi.fn(),
  deleteMany: vi.fn(),
  update: vi.fn(),
};

const fileGeneratorMock: Mocked<FileCertificateGenerator> = {
  generate: vi.fn(),
};

let sut: GenerateCertificatePDFUseCase;

beforeEach(() => {
  certificateRepositoryMock.findById.mockReset();
  fileGeneratorMock.generate.mockReset();

  sut = new GenerateCertificatePDFUseCase(
    certificateRepositoryMock,
    fileGeneratorMock,
  );
});

const makeCertificate = (overrides: Partial<ConstructorParameters<typeof Certificate>[0]> = {}) =>
  new Certificate({
    id: 'cert-1',
    completionDate: new Date('2024-02-02'),
    courseName: 'Brigada de Incêndio',
    cpf: new CPF('62910723356'),
    studentName: 'João Silva',
    workload: 8,
    registrationNumber: new RegistrationNumber('0001/2024'),
    page: new CertificatePage('001/2024'),
    ptsBook: new PTSBook('001/2024'),
    createdAt: new Date(),
    ...overrides,
  });

describe('GenerateCertificatePDFUseCase (Unit)', () => {
  it('should generate a PDF buffer for an existing certificate', async () => {
    const certificate = makeCertificate();
    const pdfBuffer = Buffer.from('pdf-mock-content');

    certificateRepositoryMock.findById.mockResolvedValue(certificate);
    fileGeneratorMock.generate.mockResolvedValue(pdfBuffer);

    const result = await sut.execute('cert-1');

    expect(certificateRepositoryMock.findById).toHaveBeenCalledWith('cert-1');
    expect(fileGeneratorMock.generate).toHaveBeenCalledWith(
      certificate,
      expect.objectContaining({
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        workload: certificate.workload,
        message: undefined,
      }),
    );
    expect(result.buffer).toBe(pdfBuffer);
    expect(result.filename).toContain('certificado_');
    expect(result.filename).toMatch(/\.pdf$/);
  });

  it('should pass message from certificate to the generator', async () => {
    const certificate = makeCertificate({ message: 'Mensagem personalizada' });
    const pdfBuffer = Buffer.from('pdf-content');

    certificateRepositoryMock.findById.mockResolvedValue(certificate);
    fileGeneratorMock.generate.mockResolvedValue(pdfBuffer);

    await sut.execute('cert-1');

    expect(fileGeneratorMock.generate).toHaveBeenCalledWith(
      certificate,
      expect.objectContaining({ message: 'Mensagem personalizada' }),
    );
  });

  it('should throw DomainError if certificate is not found', async () => {
    certificateRepositoryMock.findById.mockResolvedValue(null);

    await expect(sut.execute('non-existent')).rejects.toThrow(DomainError);
    await expect(sut.execute('non-existent')).rejects.toThrow('Certificado não encontrado');
    expect(fileGeneratorMock.generate).not.toHaveBeenCalled();
  });
});
