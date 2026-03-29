'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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
      update: {
        data: JSON.stringify(data),
      },
      create: {
        key,
        data: JSON.stringify(data),
      },
    });
    revalidatePath('/admin/configuracoes/geral');
    revalidatePath('/admin/configuracoes/seo');
    revalidatePath('/admin/configuracoes/integracoes');
    return { success: true, data: setting };
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    return { success: false, error: 'Failed to update setting' };
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
    return { success: true, data: config };
  } catch (error) {
    console.error('Error updating site config:', error);
    return { success: false, error: 'Failed to update site config' };
  }
}
