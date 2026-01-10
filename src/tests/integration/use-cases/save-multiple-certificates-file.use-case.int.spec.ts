import { beforeEach, describe, it, expect } from 'vitest';
import { CPF } from '@/src/core/domain/value-objects/cpf.value-object';
import { CertificateDraft } from '@/src/core/domain/value-objects/certificate-draft.value-object';
import { SaveMultipleCertificatesFileUseCase } from '@/src/core/application/use-cases/certificate/save-multiple-certificates-file.use-case';
import { PlaywrightPDFCertificateGenerator } from '@/src/core/infra/pdf/playwright-pdf-certify-generator';
import { VercelStoragePDFCertificate } from '@/src/core/infra/storage/vercel-storage-pdf-certificate';


let sut: SaveMultipleCertificatesFileUseCase;

beforeEach(() => {

  sut = new SaveMultipleCertificatesFileUseCase(
    new PlaywrightPDFCertificateGenerator,
    new VercelStoragePDFCertificate(),
  );
});

describe('SaveMultipleCertificatesFileUseCase (Int)', () => {
  it('should generate and store files for all certificates and attach fileUrl', async () => {
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

    expect(response.draftCertificates[0].fileUrl).toMatch(/^https?:\/\//);
    expect(response.draftCertificates[1].fileUrl).toMatch(/^https?:\/\//);

    expect(response.draftCertificates[0].fileUrl).toContain('vercel');
    expect(response.draftCertificates[1].fileUrl).toContain('vercel');

    expect(response.draftCertificates[0].courseName).toBe('Course 1');
    expect(response.draftCertificates[1].courseName).toBe('Course 2');
  });
});