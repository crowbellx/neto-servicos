import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

/** Tag para invalidar ao salvar em Configurações (SEO, integrações, geral). */
export const SETTINGS_CACHE_TAG = 'settings';

type PublicSettingsBundle = {
  seo: Record<string, unknown>;
  integrations: Record<string, unknown>;
  general: Record<string, unknown>;
};

function safeParse(json: string | null | undefined): Record<string, unknown> {
  if (!json) return {};
  try {
    const v = JSON.parse(json) as unknown;
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/**
 * Uma única query Prisma para SEO + integrações + geral, com cache entre requisições.
 * Reduz waterfall e tempo de resposta do layout.
 */
export const getCachedPublicSettingsBundle = unstable_cache(
  async (): Promise<PublicSettingsBundle> => {
    const rows = await prisma.setting.findMany({
      where: { key: { in: ['seo', 'integrations', 'general'] } },
      select: { key: true, data: true },
    });
    const map = new Map(rows.map((r) => [r.key, r.data]));
    return {
      seo: safeParse(map.get('seo')),
      integrations: safeParse(map.get('integrations')),
      general: safeParse(map.get('general')),
    };
  },
  ['public-settings-bundle-v1'],
  { tags: [SETTINGS_CACHE_TAG], revalidate: 120 }
);
