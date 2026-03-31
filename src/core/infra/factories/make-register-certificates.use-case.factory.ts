import { RegisterCertificatesUseCase } from '../../application/use-cases/certificate/register-certificates.use-case';
import { PrismaCertificateRepository } from '../database/prisma/prisma-certificate.repository';
import { PrismaCertificateSequenceRepository } from '../database/prisma/prisma-certificate-sequence.repository';

export const makeRegisterCertificatesUseCase = () => {
  return new RegisterCertificatesUseCase(
    new PrismaCertificateRepository(),
    new PrismaCertificateSequenceRepository(),
  );
};
