import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials, request) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.error('[AUTH] Erro na validação dos campos:', parsedCredentials.error.format());
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const ip =
          request?.headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ??
          request?.headers?.get('x-real-ip') ??
          null;
        const userAgent = request?.headers?.get('user-agent') ?? null;

        console.log(`[AUTH] Tentativa de login para: ${email} | IP: ${ip}`);

        try {
          // 1. Verificar conexão e buscar usuário
          const user = await prisma.user.findUnique({ where: { email } });
          
          if (!user) {
            console.warn(`[AUTH] Usuário não encontrado no banco: ${email}`);
            await prisma.authAttempt.create({
              data: { email, ip, userAgent, success: false, reason: 'USER_NOT_FOUND' },
            }).catch(() => {});
            throw new Error('INVALID_CREDENTIALS');
          }

          if (!user.active) {
            console.warn(`[AUTH] Usuário encontrado mas está inativo: ${email}`);
            throw new Error('INVALID_CREDENTIALS');
          }

          // 2. Verificar bloqueio de conta
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            console.warn(`[AUTH] Conta bloqueada até ${user.lockedUntil.toISOString()}: ${email}`);
            throw new Error(`ACCOUNT_LOCKED:${user.lockedUntil.toISOString()}`);
          }

          // 3. Comparar senhas
          console.log(`[AUTH] Comparando senha para: ${email}`);
          const passwordsMatch = await bcrypt.compare(password, user.password);
          
          if (!passwordsMatch) {
            console.warn(`[AUTH] Senha incorreta para: ${email}`);
            const now = new Date();
            const shouldResetWindow =
              !user.lastFailedLoginAt || now.getTime() - user.lastFailedLoginAt.getTime() > 15 * 60 * 1000;

            const nextAttempts = shouldResetWindow ? 1 : user.failedLoginAttempts + 1;
            const remaining = Math.max(0, 5 - nextAttempts);
            const lockUntil = nextAttempts >= 5 ? new Date(now.getTime() + 15 * 60 * 1000) : null;

            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: nextAttempts >= 5 ? 0 : nextAttempts,
                lastFailedLoginAt: now,
                lockedUntil: lockUntil,
              },
            });

            await prisma.authAttempt.create({
              data: { email, ip, userAgent, success: false, reason: lockUntil ? 'ACCOUNT_LOCKED' : 'INVALID_PASSWORD' },
            });

            if (lockUntil) {
              throw new Error(`ACCOUNT_LOCKED:${lockUntil.toISOString()}`);
            }
            throw new Error(`INVALID_CREDENTIALS:${remaining}`);
          }

          // 4. Sucesso
          console.log(`[AUTH] Login bem-sucedido: ${email}`);
          
          await prisma.authAttempt.create({
            data: { email, ip, userAgent, success: true, reason: 'LOGIN_SUCCESS' },
          });

          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: 'LOGIN',
              resource: 'AUTH',
              ip,
              userAgent,
            },
          });

          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: 0,
              lastFailedLoginAt: null,
              lockedUntil: null,
              lastLoginAt: new Date(),
            },
          });

          return user;
        } catch (error) {
          console.error('[AUTH] Erro crítico no authorize:', error);
          throw error;
        }
      },
    }),
  ],
});