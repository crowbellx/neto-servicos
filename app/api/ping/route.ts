/**
 * 🏥 Health Check Anti-Pausa — Supabase Free Tier
 *
 * O Supabase pausa projetos gratuitos após 1 semana sem requisições.
 * Esta rota leve é chamada a cada 3 dias por um cron job externo (ex: cron-job.org)
 * para manter o banco ativo.
 *
 * Runtime: Edge — não consome GB-hora serverless, zero cold start.
 * URL de ping: https://<seu-domínio>.vercel.app/api/ping
 *
 * Configurar em: https://cron-job.org
 *   - URL: https://neto-servicos.vercel.app/api/ping
 *   - Frequência: a cada 3 dias (72 horas)
 *   - Método: GET
 */
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    // Usando a anon key pública — sem service_role no edge
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Query mínima — apenas verifica conectividade sem trazer dados
    const { error } = await supabase
      .from('settings') // tabela leve de configurações
      .select('key')
      .limit(1);

    if (error) {
      console.error('[Ping] Supabase error:', error.message);
      return NextResponse.json(
        { ok: false, error: error.message, ts: new Date().toISOString() },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      ts: new Date().toISOString(),
      message: 'Supabase alive — anti-pause ping successful',
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'Unknown error', ts: new Date().toISOString() },
      { status: 500 }
    );
  }
}
