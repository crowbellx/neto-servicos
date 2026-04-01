'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';
import { SETTINGS_CACHE_TAG } from '@/lib/cache/settings';

export async function getSettings(key: string) {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key },
    });
    return { success: true, data: setting };
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return { success: false, error: 'Failed to fetch setting' };
  }
}

export async function updateSettings(key: string, data: any) {
  try {
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { data: JSON.stringify(data) },
      create: { key, data: JSON.stringify(data) },
    });
    revalidatePath('/admin/configuracoes/geral');
    revalidatePath('/admin/configuracoes/seo');
    revalidatePath('/admin/configuracoes/integracoes');
    revalidateTag(SETTINGS_CACHE_TAG);
    // Garante que mudanças em configurações globais reflitam em TODO o site (layout e páginas)
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/sobre');
    revalidatePath('/servicos');
    revalidatePath('/portfolio');
    revalidatePath('/contato');
    revalidatePath('/blog');
    revalidatePath('/admin', 'layout');
    return { success: true, data: setting };
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    return { success: false, error: 'Failed to update setting' };
  }
}

/**
 * Busca múltiplas settings da Home de uma vez (single query).
 * Usado pelo painel de edição de conteúdo da Home.
 */
export async function getHomeSections() {
  try {
    const keys = ['home_hero', 'home_counters', 'home_diferenciais', 'home_cta', 'home_processo', 'contato_info'];
    const rows = await prisma.setting.findMany({
      where: { key: { in: keys } },
      select: { key: true, data: true },
    });
    const map = new Map(rows.map((r) => [r.key, r.data ? JSON.parse(r.data) : null]));
    return {
      success: true,
      data: {
        hero: map.get('home_hero') || null,
        counters: map.get('home_counters') || null,
        diferenciais: map.get('home_diferenciais') || null,
        cta: map.get('home_cta') || null,
        processo: map.get('home_processo') || null,
        contato: map.get('contato_info') || null,
      },
    };
  } catch (error) {
    console.error('Error fetching home sections:', error);
    return { success: false, data: null, error: 'Failed to fetch home sections' };
  }
}

/**
 * Salva uma seção específica da Home e invalida o cache da página pública.
 */
export async function updateHomeSection(key: string, data: any) {
  try {
    await prisma.setting.upsert({
      where: { key },
      update: { data: JSON.stringify(data) },
      create: { key, data: JSON.stringify(data) },
    });
    // Invalida o cache da página pública imediatamente
    revalidatePath('/');
    if (key === 'contato_info') revalidatePath('/contato');
    revalidateTag('home-content');
    return { success: true };
  } catch (error) {
    console.error(`Error updating home section ${key}:`, error);
    return { success: false, error: 'Falha ao salvar seção' };
  }
}

export async function getSiteConfig() {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: 'singleton' },
    });
    return { success: true, data: config };
  } catch (error) {
    console.error('Error fetching site config:', error);
    return { success: false, error: 'Failed to fetch site config' };
  }
}

export async function updateSiteConfig(data: any) {
  try {
    const config = await prisma.siteConfig.upsert({
      where: { id: 'singleton' },
      update: {
        data: JSON.stringify(data),
      },
      create: {
        id: 'singleton',
        data: JSON.stringify(data),
      },
    });
    revalidatePath('/admin/configuracoes/geral');
    revalidatePath('/admin/configuracoes/seo');
    revalidatePath('/admin/configuracoes/integracoes');
    revalidateTag(SETTINGS_CACHE_TAG);
    
    // Invalidação global para garantir que logo/favicon atualizem
    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'layout');
    
    return { success: true, data: config };
  } catch (error) {
    console.error('Error updating site config:', error);
    return { success: false, error: 'Failed to update site config' };
  }
}

/**
 * Busca múltiplas chaves de configuração de uma vez.
 * Usado para carregar dados de editores de conteúdo de páginas específicas.
 */
export async function getSectionSettings(keys: string[]) {
  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: keys } },
      select: { key: true, data: true },
    });
    const map = new Map(rows.map((r) => [r.key, r.data ? JSON.parse(r.data) : null]));
    return { success: true, data: Object.fromEntries(map) };
  } catch (error) {
    console.error('Error fetching section settings:', error);
    return { success: false, error: 'Falha ao buscar configurações das seções' };
  }
}

/**
 * Atualiza uma seção de conteúdo e invalida os caches necessários.
 */
export async function updateContentSection(key: string, data: any, pathsToRevalidate: string[] = ['/']) {
  try {
    await prisma.setting.upsert({
      where: { key },
      update: { data: JSON.stringify(data) },
      create: { key, data: JSON.stringify(data) },
    });
    
    // Invalida caminhos específicos
    pathsToRevalidate.forEach(path => revalidatePath(path));
    
    // Invalida tags globais
    revalidateTag(SETTINGS_CACHE_TAG);
    revalidateTag('home-content'); // Mantenha compatibilidade com o cache da home
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating content section ${key}:`, error);
    return { success: false, error: 'Falha ao salvar conteúdo' };
  }
}
