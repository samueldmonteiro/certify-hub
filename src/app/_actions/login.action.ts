'use server';

import { LoginUseCaseResponse } from '@/src/core/application/use-cases/auth/login.use-case';
import { makeLoginUseCase } from '@/src/core/infra/factories/make-login.use-case.factory';
import { loginSchema } from '@/src/core/infra/http/schemas/login.schema';
import { createSession } from '@/src/lib/session';
import z from 'zod';

export interface LoginActionResponse {
  success: boolean,
  data?: LoginUseCaseResponse,
  errors?: {
    email?: string[] | undefined;
    password?: string[] | undefined;
  }
  message?: string
}
export const loginAction = async (_prevState: any, formData: FormData): Promise<LoginActionResponse> => {

  const raw = Object.fromEntries(formData);
  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    const response = await makeLoginUseCase().execute(parsed.data);
    await createSession(response.user.id);
    
    return {
      success: true,
      data: response,
    };

  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};