export interface StorageFileCertificate {

  storage(certificateFile: Buffer): Promise<string>
}