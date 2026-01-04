'use client';

import { useActionState, useState } from 'react';
import Image from 'next/image';

import { cn } from '@/src/lib/utils';
import { Button } from '@/src/app/_components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/src/app/_components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/src/app/_components/ui/field';
import { Input } from '@/src/app/_components/ui/input';
import { ModeToggle } from './mode-toggle';

import logo from '@/src/app/assets/logo_whitout_title.png';
import { loginAction } from '../_actions/login.action';
import { Alert } from './custom/alert';
import { redirect } from 'next/navigation';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  if(state?.success){
    redirect('/dashboard');
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <div className="absolute top-4 right-4">
            <ModeToggle />
          </div>

          <div className="flex justify-center">
            <Image width={70} src={logo} alt="logo" />
          </div>

          <CardDescription className="text-center text-[16px] font-bold">
            Preservar <br />
            Serviços e Treinamentos
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-4">
            <FieldGroup>
              {state?.message && (
                <div className="-mt-2.5 -mb-2.5 text-center text-sm text-red-500">
                  <Alert title={'Credenciais inválidas, tente novamente!'} variant='error' />
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!state?.errors?.email}
                  required
                />

                {state?.errors?.email && (
                  <p className="text-sm text-red-500">
                    {state.errors.email[0]}
                  </p>
                )}
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>

                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!state?.errors?.password}
                  required
                />

                {state?.errors?.password && (
                  <p className="text-sm text-red-500">
                    {state.errors.password[0]}
                  </p>
                )}
              </Field>

              <Field>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Entrando...
                    </span>
                  ) : (
                    'Acessar'
                  )}
                </Button>

                <FieldDescription className="text-center">
                  Somente para administradores!
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}