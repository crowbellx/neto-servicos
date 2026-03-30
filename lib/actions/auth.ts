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
    // Se for um redirecionamento do Next.js (comum no signIn com sucesso), 
    // precisamos relançar o erro sem logar como falha no console.
    if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }

    // Log detalhado apenas para erros reais
    console.error('[AUTH_ACTION_ERROR]:', error);

    if (error instanceof Error) {
      const message = error.message || '';

      if (message.startsWith('INVALID_CREDENTIALS:')) {
        const remaining = message.split(':')[1];
        return `Credenciais inválidas. ${remaining} tentativa(s) restante(s).`;
      }
      if (message === 'INVALID_CREDENTIALS') {
        return 'Credenciais inválidas ou usuário não encontrado.';
      }
      if (message.startsWith('ACCOUNT_LOCKED:')) {
        const lockUntilIso = message.split(':').slice(1).join(':');
        const lockUntil = new Date(lockUntilIso);
        const lockTime = Number.isNaN(lockUntil.getTime())
          ? 'alguns minutos'
          : lockUntil.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return `Conta bloqueada. Tente novamente às ${lockTime}.`;
      }
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'E-mail ou senha incorretos.';
        case 'CallbackRouteError':
          return 'Erro de comunicação com o banco de dados.';
        default:
          return 'Ocorreu um erro inesperado na autenticação.';
      }
    }

    return 'Erro ao conectar ao servidor de autenticação.';
  }
}