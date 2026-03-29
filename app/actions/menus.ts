'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getMenus() {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: menus };
  } catch (error) {
    console.error('Error fetching menus:', error);
    return { success: false, error: 'Failed to fetch menus' };
  }
}

export async function getMenuById(id: string) {
  try {
    const menu = await prisma.menu.findUnique({
      where: { id },
    });
    if (!menu) return { success: false, error: 'Menu not found' };
    return { success: true, data: menu };
  } catch (error) {
    console.error('Error fetching menu:', error);
    return { success: false, error: 'Failed to fetch menu' };
  }
}

export async function createMenu(data: any) {
  try {
    const menu = await prisma.menu.create({
      data: {
        ...data,
      },
    });
    revalidatePath('/admin/menus');
    return { success: true, data: menu };
  } catch (error) {
    console.error('Error creating menu:', error);
    return { success: false, error: 'Failed to create menu' };
  }
}

export async function updateMenu(id: string, data: any) {
  try {
    const menu = await prisma.menu.update({
      where: { id },
      data: {
        ...data,
      },
    });
    revalidatePath('/admin/menus');
    revalidatePath(`/admin/menus/${id}`);
    return { success: true, data: menu };
  } catch (error) {
    console.error('Error updating menu:', error);
    return { success: false, error: 'Failed to update menu' };
  }
}

export async function deleteMenu(id: string) {
  try {
    await prisma.menu.delete({
      where: { id },
    });
    revalidatePath('/admin/menus');
    return { success: true };
  } catch (error) {
    console.error('Error deleting menu:', error);
    return { success: false, error: 'Failed to delete menu' };
  }
}
