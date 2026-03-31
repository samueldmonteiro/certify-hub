import { Certificate } from '../entities/certificate.entity';
import { CertificateSequence } from '../entities/certificate-sequence.entity';

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
  createMany(certificates: Certificate[], sequence: CertificateSequence): Promise<void>;
  lastCreated(): Promise<Certificate | null>
  update(certificate: Certificate): Promise<Certificate>
  delete(id: string): Promise<void>
  deleteMany(ids: string[]): Promise<void>
  search(
    params: CertificateSearchParams
  ): Promise<PaginatedResult<Certificate>>
}
