import { SearchCertificatesUseCase } from '../../application/use-cases/certificate/search-certificates.use-case';
import { PrismaCertificateRepository } from '../database/prisma/prisma-certificate.repository';

export const makeSearchCertificatesUseCase = ()=>{
  return new SearchCertificatesUseCase(
    new PrismaCertificateRepository(),
  );  
};
