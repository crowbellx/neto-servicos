'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function getAuditLogs() {
  try {
    const session = await auth();
    if (!session) return { success: false, error: 'Não autorizado' };

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });
    return { success: true, data: logs };
  } catch (error) {
    return { success: false, error: 'Falha ao buscar logs' };
  }
}

export async function getAuthAttempts() {
  try {
    const session = await auth();
    if (!session) return { success: false, error: 'Não autorizado' };

    const attempts = await prisma.authAttempt.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return { success: true, data: attempts };
  } catch (error) {
    return { success: false, error: 'Falha ao buscar tentativas de acesso' };
  }
}