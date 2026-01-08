import { beforeEach, describe, it, expect } from 'vitest';
import { Certificate } from '@/src/core/domain/entities/certificate.entity';

import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';
import { RegistrationNumber } from '@/src/core/domain/value-objects/registration-number.value-object';
import { CertificatePage } from '@/src/core/domain/value-objects/certificate-page.value-object';
import { randomUUID } from 'node:crypto';
import { PTSBook } from '@/src/core/domain/value-objects/pts-book.value-object';
import { SaveCertificateFileUseCase } from '@/src/core/application/use-cases/certificate/save-certificate-file.use-case';
import { PlaywrightPDFCertificateGenerator } from '@/src/core/infra/pdf/playwright-pdf-certify-generator';
import { VercelStoragePDFCertificate } from '@/src/core/infra/storage/vercel-storage-pdf-certificate';


let sut: SaveCertificateFileUseCase;

beforeEach(() => {
  
  sut = new SaveCertificateFileUseCase(
    new PlaywrightPDFCertificateGenerator(),
    new VercelStoragePDFCertificate(),
  );
});

describe('SaveCertificateFileUseCase (Int)', () => {

  it('should save a certificate successfully', async () => {

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

    expect(response.fileURL).toBeDefined();
    expect(response.fileURL).toMatch(/^https?:\/\//);
    expect(response.fileURL).toContain('vercel');
  });
});
