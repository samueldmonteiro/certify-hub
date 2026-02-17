import { StorageFile } from '../../domain/services/storage-file';
import { put } from '@vercel/blob';

export class VercelStoragePDF implements StorageFile {

  async storage(file: Buffer, path: string): Promise<string> {

    const blob = await put(path, file, {
      access: 'public',
      contentType: 'application/pdf',
    });

    console.log('URL DO ARQUIVO', blob.url);
    return blob.url;
  }
}