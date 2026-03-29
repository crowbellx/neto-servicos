import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials, request) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const ip =
          request?.headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ??
          request?.headers?.get('x-real-ip') ??
          null;
        const userAgent = request?.headers?.get('user-agent') ?? null;

        // 20 tentativas por IP em 1 hora.
        if (ip) {
          const ipAttempts = await prisma.authAttempt.count({
            where: {
              ip,
              createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
            },
          });

          if (ipAttempts >= 20) {
            await prisma.authAttempt.create({
              data: { email, ip, userAgent, success: false, reason: 'IP_RATE_LIMIT' },
            });
            throw new Error('RATE_LIMIT_IP');
          }
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.active) {
          await prisma.authAttempt.create({
            data: { email, ip, userAgent, success: false, reason: 'USER_NOT_FOUND_OR_INACTIVE' },
          });
          throw new Error('INVALID_CREDENTIALS');
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          await prisma.authAttempt.create({
            data: { email, ip, userAgent, success: false, reason: 'ACCOUNT_LOCKED' },
          });
          throw new Error(`ACCOUNT_LOCKED:${user.lockedUntil.toISOString()}`);
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
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
      },
    }),
  ],
});
