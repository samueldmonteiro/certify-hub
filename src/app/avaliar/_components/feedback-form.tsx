'use client';

import { useActionState, useState } from 'react';
import { createFeedbackAction } from '@/src/app/_actions/feedback';
import { CertificateType, CertificateTypeLabels } from '@/src/core/enums/certificate-type.enum';
import { Button } from '@/src/app/_components/ui/button';
import { Input } from '@/src/app/_components/ui/input';
import { Textarea } from '@/src/app/_components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/app/_components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/app/_components/ui/card';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/src/app/_components/ui/field';
import { Star } from 'lucide-react';
import { Alert } from '@/src/app/_components/custom/alert';
import { cn } from '@/src/lib/utils';

export function FeedbackForm() {
  const [state, formAction, isPending] = useActionState(createFeedbackAction, undefined);
  const [stars, setStars] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);

  const courses = (Object.entries(CertificateTypeLabels) as [CertificateType, string][]).map(
    ([value, label]) => ({
      value,
      label,
    }),
  );

  return (
    <Card className="w-full mx-auto shadow-sm">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">Deixe seu Feedback</CardTitle>
        <CardDescription>
          Sua opinião é fundamental para melhorarmos nossos cursos.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {state?.success ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <h3 className="text-xl font-bold text-green-600 dark:text-green-500">Obrigado!</h3>
            <p className="text-muted-foreground">{state.message}</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-6">
            <FieldGroup>
              {state?.message && !state?.success && (
                <div className="mb-4">
                  <Alert title={state.message} variant="error" />
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="studentName" className="font-medium">Seu Nome Completo</FieldLabel>
                <Input
                  id="studentName"
                  name="studentName"
                  placeholder="Ex: João da Silva"
                  required
                />
                {state?.errors?.studentName && (
                  <p className="text-sm text-red-500 mt-1">{state.errors.studentName[0]}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="course" className="font-medium">Curso Realizado</FieldLabel>
                <Select name="course" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.value} value={course.value}>
                        {course.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {state?.errors?.course && (
                  <p className="text-sm text-red-500 mt-1">{state.errors.course[0]}</p>
                )}
              </Field>

              <Field>
                <FieldLabel className="font-medium">Avaliação</FieldLabel>
                <input type="hidden" name="stars" value={stars} />
                <div className="flex justify-center gap-1 py-4 bg-muted/30 border rounded-md">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none p-1"
                      onMouseEnter={() => setHoverStar(star)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => setStars(star)}
                    >
                      <Star
                        className={cn(
                          'w-8 h-8 transition-colors',
                          (hoverStar || stars) >= star
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground/30 hover:text-muted-foreground',
                        )}
                      />
                    </button>
                  ))}
                </div>
                {state?.errors?.stars && (
                  <p className="text-sm text-red-500 text-center mt-1">{state.errors.stars[0]}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="message" className="font-medium">Mensagem</FieldLabel>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Conte-nos o que achou do curso, o que aprendeu de mais interessante e o que podemos melhorar."
                  className="min-h-[120px] resize-y"
                  required
                />
                {state?.errors?.message && (
                  <p className="text-sm text-red-500 mt-1">{state.errors.message[0]}</p>
                )}
              </Field>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full mt-4"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Enviando...
                  </span>
                ) : (
                  'Enviar Feedback'
                )}
              </Button>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
