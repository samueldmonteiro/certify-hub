import { CertificateDraft } from '../value-objects/certificate-draft.value-object';

export interface FileCertificateGenerator {
  generate(data: CertificateDraft): Promise<Buffer>
}