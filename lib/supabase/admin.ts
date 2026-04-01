import 'server-only';
import { createClient } from '@supabase/supabase-js';

function getEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value) {
    console.warn(`[Supabase Admin] Missing environment variable: ${name}`);
    return undefined;
  }
  return value;
}

export function createSupabaseAdminClient() {
  return createClient(
    getEnv('NEXT_PUBLIC_SUPABASE_URL') || '',
    getEnv('SUPABASE_SERVICE_ROLE_KEY') || '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
