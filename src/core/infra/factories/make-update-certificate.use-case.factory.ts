import { PrismaCertificateRepository } from '../database/prisma/prisma-certificate.repository';
import { UpdateCertificateUseCase } from '../../application/use-cases/certificate/update-certificate.use-case';

export const makeUpdateCertificateUseCase = () => {
  return new UpdateCertificateUseCase(
    new PrismaCertificateRepository(),
  );
};
