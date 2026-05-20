import { Certificate } from '../../entities/certificate.entity';

export interface IMakeCertificatePdfProvider {
    generatePDF(data: Certificate): Promise<Buffer>;
} 