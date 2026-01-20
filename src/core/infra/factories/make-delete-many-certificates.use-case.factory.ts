import { DeleteManyCertificatesUseCase } from '../../application/use-cases/certificate/delete-many-certificates.use-case';
import { PrismaCertificateRepository } from '../database/prisma/prisma-certificate.repository';

export const makeDeleteManyCertificatesUseCase = () => {
  return new DeleteManyCertificatesUseCase(
    new PrismaCertificateRepository(),
  );
};