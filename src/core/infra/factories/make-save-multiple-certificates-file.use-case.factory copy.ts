import { SaveMultipleCertificatesFileUseCase } from '../../application/use-cases/certificate/save-multiple-certificates-file.use-case';
import { PlaywrightPDFCertificateGenerator } from '../pdf/playwright-pdf-certify-generator';
import { VercelStoragePDFCertificate } from '../storage/vercel-storage-pdf-certificate';

export const makeSaveMultipleCertificatesFileUseCase = ()=>{
  return new SaveMultipleCertificatesFileUseCase(
    new PlaywrightPDFCertificateGenerator(),
    new VercelStoragePDFCertificate(),
  );
};