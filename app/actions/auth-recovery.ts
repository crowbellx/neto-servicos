'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Para fins de segurança, sempre retornamos sucesso para não expor quais emails existem
      return { success: true };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        recoveryToken: token,
        recoveryExpiresAt: expiresAt,
      },
    });

    // TODO: Integrar com Resend ou outro serviço de SMTP real
    console.log(`[EMAIL SEND MOCK] Link de recuperação para ${email}: http://localhost:3000/admin/nova-senha/${token}`);

    return { success: true };
  } catch (error) {
    console.error('Erro na solicitação de redefinição de senha:', error);
    return { success: false, error: 'Ocorreu um erro no servidor' };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    if (!token || !newPassword) {
      return { success: false, error: 'Token ou senha não fornecidos' };
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'A senha deve ter no mínimo 6 caracteres' };
    }

    const user = await prisma.user.findFirst({
      where: {
        recoveryToken: token,
        recoveryExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return { success: false, error: 'Token inválido ou expirado' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        recoveryToken: null,
        recoveryExpiresAt: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return { success: false, error: 'Ocorreu um erro ao atualizar a senha' };
  }
}
