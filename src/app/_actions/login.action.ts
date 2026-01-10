'use server';

import { UserPresenter } from '@/src/core/application/presenters/user.presenter';
import { UserViewModel } from '@/src/core/application/view-models/user.view-model';
import { makeLoginUseCase } from '@/src/core/infra/factories/make-login.use-case.factory';
import { LoginErrorsSchema, LoginSchema } from '@/src/core/infra/http/schemas/login.schema';
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
    const response = await makeLoginUseCase().execute(parsed.data);
    await createSession(response.user.id);

    return {
      success: true,
      data: {
        user: UserPresenter.toViewModel(response.user),
      },
    };

  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};