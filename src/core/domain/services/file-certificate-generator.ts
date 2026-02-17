import { Certificate } from '../entities/certificate.entity';
import { CertificateDraft } from '../value-objects/certificate-draft.value-object';

export interface FileCertificateGenerator {
  generate(data: Certificate, draft: CertificateDraft): Promise<Buffer>
} 