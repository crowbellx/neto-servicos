'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4);
}

export async function createProject(formData: FormData) {
  try {
    const session = await auth();
    if (!session) return { success: false, error: 'Não autorizado' };

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      tags: formData.get('tags') as string || '[]',
      images: formData.get('images') as string || '[]',
      status: formData.get('status') as string || 'DRAFT',
      featured: formData.get('featured') === 'true',
      seoTitle: formData.get('seoTitle') as string || null,
      seoDesc: formData.get('seoDesc') as string || null,
    };

    const project = await prisma.project.create({
      data: {
        ...data,
        slug: generateSlug(data.title),
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
      },
    });
    
    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    revalidatePath('/');
    return { success: true, data: project };
  } catch (error) {
    return { success: false, error: 'Falha ao salvar no banco' };
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session) return { success: false, error: 'Não autorizado' };

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      tags: formData.get('tags') as string || '[]',
      images: formData.get('images') as string || '[]',
      status: formData.get('status') as string || 'DRAFT',
      featured: formData.get('featured') === 'true',
      seoTitle: formData.get('seoTitle') as string || null,
      seoDesc: formData.get('seoDesc') as string || null,
    };

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    
    revalidatePath('/admin/portfolio');
    revalidatePath(`/portfolio/${project.slug}`);
    revalidatePath('/portfolio');
    revalidatePath('/');
    
    return { success: true, data: project };
  } catch (error) {
    return { success: false, error: 'Erro ao atualizar' };
  }
}

export async function deleteProject(id: string) {
  try {
    const session = await auth();
    if (!session) return { success: false, error: 'Não autorizado' };

    await prisma.project.delete({ where: { id } });
    
    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Erro ao excluir' };
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id, deletedAt: null },
    });
    return { success: true, data: project };
  } catch (error) {
    return { success: false, error: 'Não encontrado' };
  }
}