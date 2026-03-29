'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getPages() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: pages };
  } catch (error) {
    console.error('Error fetching pages:', error);
    return { success: false, error: 'Failed to fetch pages' };
  }
}

export async function getPageById(id: string) {
  try {
    const page = await prisma.page.findUnique({
      where: { id },
    });
    if (!page) return { success: false, error: 'Page not found' };
    return { success: true, data: page };
  } catch (error) {
    console.error('Error fetching page:', error);
    return { success: false, error: 'Failed to fetch page' };
  }
}

export async function createPage(data: any) {
  try {
    const page = await prisma.page.create({
      data: {
        ...data,
      },
    });
    revalidatePath('/admin/paginas');
    return { success: true, data: page };
  } catch (error) {
    console.error('Error creating page:', error);
    return { success: false, error: 'Failed to create page' };
  }
}

export async function updatePage(id: string, data: any) {
  try {
    const page = await prisma.page.update({
      where: { id },
      data: {
        ...data,
      },
    });
    revalidatePath('/admin/paginas');
    revalidatePath(`/admin/paginas/${id}`);
    return { success: true, data: page };
  } catch (error) {
    console.error('Error updating page:', error);
    return { success: false, error: 'Failed to update page' };
  }
}

export async function deletePage(id: string) {
  try {
    await prisma.page.delete({
      where: { id },
    });
    revalidatePath('/admin/paginas');
    return { success: true };
  } catch (error) {
    console.error('Error deleting page:', error);
    return { success: false, error: 'Failed to delete page' };
  }
}
