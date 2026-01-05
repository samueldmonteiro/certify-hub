import { Certificate } from '../entities/certificate.entity';

export interface ICertificateRepository {
  findById(id: string): Promise<Certificate | null>
  create(certificate: Certificate): Promise<Certificate>
}