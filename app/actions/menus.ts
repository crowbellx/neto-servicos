'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function getMenus() {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: menus };
  } catch (error) {
    return { success: false, error: 'Falha ao buscar menus' };
  }
}

export async function createMenu(data: { name: string; location: string; items: string }) {
  try {
    const session = await auth();
    if (!session) return { success: false, error: 'Não autorizado' };

    const menu = await prisma.menu.create({
      data,
    });
    revalidatePath('/admin/menus');
    return { success: true, data: menu };
  } catch (error) {
    return { success: false, error: 'Falha ao criar menu' };
  }
}

export async function updateMenu(id: string, data: any) {
  try {
    const session = await auth();
    if (!session) return { success: false, error: 'Não autorizado' };

    const menu = await prisma.menu.update({
      where: { id },
      data,
    });
    revalidatePath('/admin/menus');
    return { success: true, data: menu };
  } catch (error) {
    return { success: false, error: 'Falha ao atualizar menu' };
  }
}

export async function deleteMenu(id: string) {
  try {
    const session = await auth();
    if (!session) return { success: false, error: 'Não autorizado' };

    await prisma.menu.delete({ where: { id } });
    revalidatePath('/admin/menus');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Falha ao excluir menu' };
  }
}