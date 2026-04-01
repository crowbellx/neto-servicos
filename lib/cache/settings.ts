import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { TAGS } from '../data-fetching';

/** Tag para invalidar ao salvar em Configurações (SEO, integrações, geral). */
export const SETTINGS_CACHE_TAG = TAGS.SETTINGS;

export type PublicSettingsBundle = {
  seo: Record<string, unknown>;
  integrations: Record<string, unknown>;
  general: Record<string, unknown>;
  about?: any;
  services?: any;
  portfolio?: any;
  contact?: any;
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
 * Adicionado try/catch para não quebrar o build se o DATABASE_URL estiver ausente.
 */
export const getCachedPublicSettingsBundle = unstable_cache(
  async (): Promise<PublicSettingsBundle> => {
    try {
      const keys = [
        'seo', 'integrations', 'general',
        'about_header', 'about_story', 'about_values',
        'services_header', 'portfolio_header', 'contact_header', 'contato_info'
      ];
      const rows = await prisma.setting.findMany({
        where: { key: { in: keys } },
        select: { key: true, data: true },
      });
      const map = new Map(rows.map((r) => [r.key, r.data]));
      
      return {
        seo: safeParse(map.get('seo')),
        integrations: safeParse(map.get('integrations')),
        general: safeParse(map.get('general')),
        about: {
          header: safeParse(map.get('about_header')),
          story:  safeParse(map.get('about_story')),
          values: safeParse(map.get('about_values')),
        },
        services: {
          header: safeParse(map.get('services_header')),
        },
        portfolio: {
          header: safeParse(map.get('portfolio_header')),
        },
        contact: {
          header: safeParse(map.get('contact_header')),
          info:   safeParse(map.get('contato_info')),
        }
      };
    } catch (error) {
      console.error('[Cache Settings] Erro ao buscar configurações:', error);
      return { seo: {}, integrations: {}, general: {} };
    }
  },
  ['public-settings-bundle-v3'],
  { tags: [SETTINGS_CACHE_TAG], revalidate: 3600 }
);