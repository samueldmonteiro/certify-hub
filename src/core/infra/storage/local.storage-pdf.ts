import fs from 'node:fs';
import path from 'node:path';
import { StorageFile } from '../../domain/services/storage-file';

export class LocalStoragePDF implements StorageFile {

  async storage(file: Buffer, filePath: string): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'public');
    const fullPath = path.join(uploadDir, filePath);
    const directory = path.dirname(fullPath);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(fullPath, file);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const urlPath = filePath.split(path.sep).join('/');
    const url = `${baseUrl}/${urlPath}`;

    console.log('URL DO ARQUIVO LOCAL', url);
    return url;
  }
}
