'use server';

import { UserViewModel } from '@/src/core/entities/user.entity';
import { authServiceFactory } from '@/src/core/factories/service.factory';
import { LoginErrorsSchema, LoginSchema } from '@/src/core/validations/login.schema';
import { createSession } from '@/src/lib/session';
import z from 'zod';

export interface LoginActionResponse {
  success: boolean,
  data?: { user: UserViewModel },
  errors?: LoginErrorsSchema
  message?: string
}

export const loginAction = async (_prevState: any, formData: FormData): Promise<LoginActionResponse> => {

  const raw = Object.fromEntries(formData);
  const parsed = LoginSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      errors: z.formatError(parsed.error),
    };
  }

  try {
    const response = await authServiceFactory().login(parsed.data);
    await createSession(response.user.id);

    return {
      success: true,
      data: {
        user: response.user.toViewModel(),
      },
    };

  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};