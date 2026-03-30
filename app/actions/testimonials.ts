'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function getTestimonials() {
  try {
    const data = await prisma.testimonial.findMany({
      orderBy: { order: 'asc' },
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Falha ao buscar depoimentos' };
  }
}

export async function createTestimonial(data: any) {
  try {
    const session = await auth();
    if (!session) return { success: false, error: 'Não autorizado' };

    const res = await prisma.testimonial.create({ data });
    revalidatePath('/admin/depoimentos');
    return { success: true, data: res };
  } catch (error) {
    return { success: false, error: 'Falha ao criar depoimento' };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    const session = await auth();
    if (!session) return { success: false, error: 'Não autorizado' };

    await prisma.testimonial.delete({ where: { id } });
    revalidatePath('/admin/depoimentos');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Falha ao excluir' };
  }
}