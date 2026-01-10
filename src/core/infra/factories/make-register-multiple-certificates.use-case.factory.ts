import { RegisterMultipleCertificatesUseCase } from '../../application/use-cases/certificate/register-multiple-certificates.use-case';
import { PrismaCertificateRepository } from '../database/prisma/prisma-certificate.repository';

export const makeRegisterMultipleCertificatesUseCase = ()=>{
  return new RegisterMultipleCertificatesUseCase(
    new PrismaCertificateRepository(),
  );
};