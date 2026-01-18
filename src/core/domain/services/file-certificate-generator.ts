import { Certificate } from '../entities/certificate.entity';

export interface FileCertificateGenerator {
  generate(data: Certificate): Promise<Buffer>
}