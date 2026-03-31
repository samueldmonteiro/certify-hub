import { GenerateCertificatesBatchUseCase } from '../../application/use-cases/certificate/generate-certificates-batch.use-case';
import { PrismaCertificateRepository } from '../database/prisma/prisma-certificate.repository';
import { PuppeteerPDFCertificateGenerator } from '../pdf/puppeteer-pdf-certificate-generator';

export const makeGenerateCertificatesBatchUseCase = () => {
  return new GenerateCertificatesBatchUseCase(
    new PrismaCertificateRepository(),
    new PuppeteerPDFCertificateGenerator(),
  );
};
