import { z } from 'zod';
import { CertificateType } from '../enums/certificate-type.enum';

export const CertificateDraftSchema = z.object({
  studentName: z.string().min(1, 'Nome obrigatório'),
  cpf: z.string(),
  date: z.string(),
  hours: z.number(),
  type: z.enum([CertificateType.BRIGADISTA, CertificateType.CIPEIRO, CertificateType.DIRECAO_DEFENSIVA, CertificateType.BENZENO_NR20, CertificateType.NR06_EPI, CertificateType.DIRECAO_4X4]),
});

export type CertificateDraftSchemaDTO = z.infer<typeof CertificateDraftSchema>;

export const CertificateDraftArraySchema = z.array(CertificateDraftSchema);
export type CertificateDraftErrorsSchema =
  z.ZodFormattedError<z.infer<typeof CertificateDraftArraySchema>>;

