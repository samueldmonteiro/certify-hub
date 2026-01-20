import { DeleteCertificateUseCase } from '../../application/use-cases/certificate/delete-certificate.use-case';
import { PrismaCertificateRepository } from '../database/prisma/prisma-certificate.repository';

export const makeDeleteCertificateUseCase = () => {
  return new DeleteCertificateUseCase(
    new PrismaCertificateRepository(),
  );
};