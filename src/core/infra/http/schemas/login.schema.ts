import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string('Senha inválida'),
});

export type LoginErrorsSchema = z.ZodFormattedError<z.infer<typeof LoginSchema>>;