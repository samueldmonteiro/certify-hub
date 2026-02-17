export interface StorageFile {

  storage(file: Buffer, path: string): Promise<string>
}