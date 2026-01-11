import { Certificate } from '../entities/certificate.entity';

export interface CertificateSearchParams {
  studentName?: string
  cpf?: string
  courseName?: string
  page?: number
  perPage?: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  perPage: number
}

export interface ICertificateRepository {
  findById(id: string): Promise<Certificate | null>
  create(certificate: Certificate): Promise<Certificate>

  search(
    params: CertificateSearchParams
  ): Promise<PaginatedResult<Certificate>>
}
