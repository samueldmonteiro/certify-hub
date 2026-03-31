import { GenerateCertificatePDFUseCase } from '../../application/use-cases/certificate/generate-certificate-pdf.use-case';
import { PrismaCertificateRepository } from '../database/prisma/prisma-certificate.repository';
import { PuppeteerPDFCertificateGenerator } from '../pdf/puppeteer-pdf-certificate-generator';

export const makeGenerateCertificatePDFUseCase = () => {
  return new GenerateCertificatePDFUseCase(
    new PrismaCertificateRepository(),
    new PuppeteerPDFCertificateGenerator(),
  );
};
