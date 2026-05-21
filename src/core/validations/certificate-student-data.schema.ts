import { z } from 'zod';
import { CertificateType } from '../enums/certificate-type.enum';

export const CertificateDraftSchema = z.object({
  studentName: z.string().min(1, 'Nome obrigatório'),
  cpf: z.string(),
  completionDate: z.string(),
  workload: z.number(),
  type: z.enum([CertificateType.BRIGADISTA, CertificateType.CIPEIRO, CertificateType.DIRECAO_DEFENSIVA, CertificateType.GENERICO_1]),
});

export type CertificateDraftSchemaDTO = z.infer<typeof CertificateDraftSchema>;

export const CertificateDraftArraySchema = z.array(CertificateDraftSchema);
export type CertificateDraftErrorsSchema =
  z.ZodFormattedError<z.infer<typeof CertificateDraftArraySchema>>;