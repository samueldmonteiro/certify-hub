import { Certificate } from '@/src/core/domain/entities/certificate.entity';
import { CertificateSearchParams, ICertificateRepository, PaginatedResult } from '@/src/core/domain/repositories/certificate.repository';

export interface SearchCertificatesResponse {
  certificates: Certificate[]
}

export class SearchCertificatesUseCase {

  constructor(
    private certificateRepo: ICertificateRepository,
  ) { }

  async execute(params: CertificateSearchParams): Promise<PaginatedResult<Certificate>> {

    const search = await this.certificateRepo.search(params);

    return search;
  }
}
