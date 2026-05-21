export enum CertificateType {
  BRIGADISTA = 'BRIGADISTA',
  CIPEIRO = 'CIPEIRO',
  DIRECAO_DEFENSIVA = 'DIRECAO_DEFENSIVA',
  NR06_EPI = 'NR06_EPI',
  BENZENO_NR20 = 'BENZENO_NR20',
  DIRECAO_4X4 = 'DIRECAO_4X4',
  
}

export const CertificateTypeLabels = {
  [CertificateType.BRIGADISTA]: 'Brigada de Incêndio e Emergência',
  [CertificateType.CIPEIRO]: 'Curso de Formação para Cipeiros',
  [CertificateType.DIRECAO_DEFENSIVA]: 'Treinamento de Direção Defensiva e Preventiva',
  [CertificateType.NR06_EPI]: 'NR – 06 Uso de Equipamentos de Proteção Individual',
  [CertificateType.BENZENO_NR20]: 'Exposição Ocupacional ao Benzeno em Postos de Serviços Revendedores de Combustíveis Automotivos',
  [CertificateType.DIRECAO_4X4]: 'Treinamento de Direção Defensiva e Operacional para Veículos 4×4 em Áreas Remotas',
};
