import { SaveMultipleCertificatesFileUseCase } from '../../application/use-cases/certificate/save-multiple-certificates-file.use-case';
import { PrismaCertificateRepository } from '../database/prisma/prisma-certificate.repository';
import { PuppeteerPDFCertificateGenerator } from '../pdf/puppeteer-pdf-certificate-generator';
import { VercelStoragePDFCertificate } from '../storage/vercel-storage-pdf-certificate';

export const makeSaveMultipleCertificatesFileUseCase = () => {
  return new SaveMultipleCertificatesFileUseCase(
    new PuppeteerPDFCertificateGenerator(),
    new VercelStoragePDFCertificate(),
    new PrismaCertificateRepository(),
  );
};