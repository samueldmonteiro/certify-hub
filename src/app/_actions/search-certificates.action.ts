'use server';

import { CertificateViewModel } from '@/src/core/entities/certificate.entity';
import { certificateServiceFactory } from '@/src/core/factories/service.factory';
import { CertificateSearchParams, PaginatedResult } from '@/src/core/repositories/certificate.repository';


export interface SearchCertificatesActionResponse {
  success?: boolean
  message?: string
  data?: PaginatedResult<CertificateViewModel>
}

export const searchCertificatesAction =
  async (_prevState: any, params: CertificateSearchParams): Promise<SearchCertificatesActionResponse> => {

    try {
      const response = await certificateServiceFactory().search(params);

      const certificatesViewModel = response.items.map((certificate) => certificate.toViewModel());
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