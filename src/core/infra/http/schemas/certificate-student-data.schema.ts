import { z } from 'zod';

export const CertificateDraftSchema = z.object({
  studentName: z.string().min(1, 'Nome obrigatório'),
  courseName: z.string().min(1, 'Nome obrigatório'),
  cpf: z.string(),
  completionDate: z.string(),
  workload: z.number(),
  summary: z.string().optional(),
});

export type CertificateDraftSchemaDTO = z.infer<typeof CertificateDraftSchema>;

export const CertificateDraftArraySchema = z.array(CertificateDraftSchema);
export type CertificateDraftErrorsSchema =
  z.ZodFormattedError<z.infer<typeof CertificateDraftArraySchema>>;