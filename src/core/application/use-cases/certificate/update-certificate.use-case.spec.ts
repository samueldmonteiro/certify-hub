import { beforeEach, describe, it, expect, vi, Mocked } from 'vitest';
import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';
import { UpdateCertificateUseCase } from './update-certificate.use-case';
import { ICertificateRepository } from '@/src/core/domain/repositories/certificate.repository';
import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { RegistrationNumber } from '@/src/core/domain/value-objects/registration-number.value-object';
import { CertificatePage } from '@/src/core/domain/value-objects/certificate-page.value-object';
import { PTSBook } from '@/src/core/domain/value-objects/pts-book.value-object';

const certificateRepositoryMock: Mocked<ICertificateRepository> = {
  create: vi.fn(),
  findById: vi.fn(),
  search: vi.fn(),
  lastCreated: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  deleteMany: vi.fn(),
  createMany: vi.fn(),
};

let sut: UpdateCertificateUseCase;

beforeEach(() => {
  certificateRepositoryMock.findById.mockReset();
  certificateRepositoryMock.update.mockReset();

  sut = new UpdateCertificateUseCase(certificateRepositoryMock);
});

describe('UpdateCertificateUseCase (Unit)', () => {
  it('should update a certificate', async () => {
    const currentYear = new Date().getFullYear();

    const existingCert = new Certificate({
      id: 'cert-1',
      completionDate: new Date('2024-02-02'),
      courseName: 'Course 1',
      cpf: new CPF('62910723356'),
      studentName: 'Student 1',
      workload: 8,
      registrationNumber: new RegistrationNumber(`0001/${currentYear}`),
      page: new CertificatePage(`001/${currentYear}`),
      ptsBook: new PTSBook(`001/${currentYear}`),
      createdAt: new Date(),
    });

    certificateRepositoryMock.findById.mockResolvedValueOnce(existingCert);
    certificateRepositoryMock.update.mockResolvedValueOnce(existingCert);

    const request = {
      id: 'cert-1',
      studentName: 'Student Updated',
      courseName: 'Course Updated',
      cpf: '33301019080',
      workload: 10,
      completionDate: new Date('2024-05-05'),
    };

    const response = await sut.execute(request);

    expect(certificateRepositoryMock.findById).toHaveBeenCalledWith('cert-1');
    expect(certificateRepositoryMock.update).toHaveBeenCalledWith(existingCert);

    expect(response.certificate.studentName).toBe('Student Updated');
    expect(response.certificate.courseName).toBe('Course Updated');
    expect(response.certificate.cpf.getValue()).toBe('33301019080');
    expect(response.certificate.workload).toBe(10);
    expect(response.certificate.completionDate).toEqual(new Date('2024-05-05'));
  });

  it('should throw DomainError when certificate is not found', async () => {
    certificateRepositoryMock.findById.mockResolvedValueOnce(null);

    const request = {
      id: 'cert-1',
      studentName: 'Student Updated',
    };

    await expect(sut.execute(request)).rejects.toThrow('Certificate not found');
  });

  it('should update certificate message', async () => {
    const currentYear = new Date().getFullYear();

    const existingCert = new Certificate({
      id: 'cert-1',
      completionDate: new Date('2024-02-02'),
      courseName: 'Course 1',
      cpf: new CPF('62910723356'),
      studentName: 'Student 1',
      workload: 8,
      registrationNumber: new RegistrationNumber(`0001/${currentYear}`),
      page: new CertificatePage(`001/${currentYear}`),
      ptsBook: new PTSBook(`001/${currentYear}`),
      createdAt: new Date(),
    });

    certificateRepositoryMock.findById.mockResolvedValueOnce(existingCert);
    certificateRepositoryMock.update.mockResolvedValueOnce(existingCert);

    const request = {
      id: 'cert-1',
      message: 'New custom message',
    };

    const response = await sut.execute(request);

    expect(response.certificate.message).toBe('New custom message');
  });
});
