export class FailFileCertificateGeneratorError extends Error {
  constructor(message = 'Erro ao gerar pdf do certificado'){
    super(message);
  }
}