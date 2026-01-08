import 'dotenv/config';

import { randomUUID } from 'crypto';
import { StorageFileCertificate } from '../../domain/services/storage-file-certificate';
import { put } from '@vercel/blob';

export class VercelStoragePDFCertificate implements StorageFileCertificate {
  
  async storage(certificateFile: Buffer): Promise<string> {

    const path = `${process.env.NODE_ENV == 'test' ? 'tests' : 'certificates'}/certificate-${randomUUID()}.pdf`;

    const blob = await put(path, certificateFile, {
      access: 'public',
      contentType: 'application/pdf',
    });

    console.log('URL DO ARQUIVO', blob.url);
    return blob.url;
  }
}