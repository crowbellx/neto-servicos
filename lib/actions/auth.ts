'use server';

import { z } from 'zod';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const data = Object.fromEntries(formData);
    const validatedFields = loginSchema.safeParse(data);

    if (!validatedFields.success) {
      return 'Credenciais inválidas.';
    }

    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message || '';

      if (message.startsWith('INVALID_CREDENTIALS:')) {
        const remaining = message.split(':')[1];
        return `Credenciais inválidas. ${remaining} tentativa(s) restante(s).`;
      }
      if (message === 'INVALID_CREDENTIALS') {
        return 'Credenciais inválidas.';
      }
      if (message.startsWith('ACCOUNT_LOCKED:')) {
        const lockUntilIso = message.split(':').slice(1).join(':');
        const lockUntil = new Date(lockUntilIso);
        const lockTime = Number.isNaN(lockUntil.getTime())
          ? 'alguns minutos'
          : lockUntil.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return `Conta bloqueada. Tente novamente às ${lockTime}.`;
      }
      if (message === 'RATE_LIMIT_IP') {
        return 'Muitas tentativas neste IP. Tente novamente em alguns minutos.';
      }
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciais inválidas.';
        case 'CallbackRouteError': {
          const causeMessage =
            (error.cause as { err?: { message?: string } } | undefined)?.err?.message || '';

          if (causeMessage.startsWith('INVALID_CREDENTIALS:')) {
            const remaining = causeMessage.split(':')[1];
            return `Credenciais inválidas. ${remaining} tentativa(s) restante(s).`;
          }
          if (causeMessage === 'INVALID_CREDENTIALS') {
            return 'Credenciais inválidas.';
          }
          if (causeMessage.startsWith('ACCOUNT_LOCKED:')) {
            const lockUntilIso = causeMessage.split(':').slice(1).join(':');
            const lockUntil = new Date(lockUntilIso);
            const lockTime = Number.isNaN(lockUntil.getTime())
              ? 'alguns minutos'
              : lockUntil.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            return `Conta bloqueada. Tente novamente às ${lockTime}.`;
          }
          if (causeMessage === 'RATE_LIMIT_IP') {
            return 'Muitas tentativas neste IP. Tente novamente em alguns minutos.';
          }
          return 'Erro ao autenticar. Tente novamente.';
        }
        default:
          return 'Algo deu errado.';
      }
    }
    throw error;
  }
}
