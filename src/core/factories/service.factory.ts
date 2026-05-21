import { Argon2PasswordHasher } from '../providers/hasher/argon2-password-hasher';
import { AuthService } from '../services/auth.service';
import { PrismaUserRepository } from '../repositories/prisma/prisma-user.repository';
import { RegisterCertificateDataService } from '../services/register-certificate-data.service';
import { PrismaCertificateRepository } from '../repositories/prisma/prisma-certificate.repository';
import { PrismaCertificateSequenceRepository } from '../repositories/prisma/prisma-certificate-sequence.repository';
import { CertificateService } from '../services/certificate.service';
import { PuppeteerMakeCertificatePdfProvider } from '../providers/make-certificate-pdf/puppeteer-make-certificate-pdf.provider';

export const authServiceFactory = () => {
  return new AuthService(
    new PrismaUserRepository(),
    new Argon2PasswordHasher(),
  );
};

export const registerCertificateDataServiceFactory = () => {
  return new RegisterCertificateDataService(
    new PrismaCertificateRepository(),
    new PrismaCertificateSequenceRepository(),
  );
};

export const certificateServiceFactory = () => {
  return new CertificateService(
    new PrismaCertificateRepository(),
    new PuppeteerMakeCertificatePdfProvider(),
  );
};