'use server';

import { CertificatePresenter } from '@/src/core/application/presenters/certificate.presenter';
import { CertificateViewModel } from '@/src/core/application/view-models/certificate.view-model';
import { CertificateSearchParams, PaginatedResult } from '@/src/core/domain/repositories/certificate.repository';
import { makeSearchCertificatesUseCase } from '@/src/core/infra/factories/make-search-certificates.use-case.factory';

export interface SearchCertificatesActionResponse {
  success?: boolean
  message?: string
  data?: PaginatedResult<CertificateViewModel>
}

export const searchCertificatesAction =
  async (_prevState: any, params: CertificateSearchParams): Promise<SearchCertificatesActionResponse> => {

    try {
      const response = await makeSearchCertificatesUseCase().execute(params);

      const certificatesViewModel = CertificatePresenter.toManyViewModel(response.items);
      
      return {
        success: true,
        data: {
          ...response,
          items: certificatesViewModel,
        },
      };

    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      };
    }
  };