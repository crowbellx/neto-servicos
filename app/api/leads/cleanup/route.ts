import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { purgeOldLeads } from '@/app/actions/leads';

/**
 * POST /api/leads/cleanup
 *
 * Executa a exclusão permanente de leads LOST mais antigos que o período
 * configurado. Aceita:
 * - Chamada autenticada do painel admin
 * - Chamada via Vercel Cron com header Authorization: Bearer <CRON_SECRET>
 */
export async function POST(request: NextRequest) {
  // 1. Verifica autenticação via sessão (uso manual pelo admin)
  const session = await auth();

  // 2. Verifica autenticação via CRON_SECRET (uso automático por cron)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const isValidCron = cronSecret && authHeader === `Bearer ${cronSecret}`;

  if (!session && !isValidCron) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await purgeOldLeads();

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    deleted: (result.data as any)?.deleted ?? 0,
    timestamp: new Date().toISOString(),
  });
}
