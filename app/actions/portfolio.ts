'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4);
}

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      where: { deletedAt: null },
    });
    return { success: true, data: projects };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, error: 'Failed to fetch projects' };
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id, deletedAt: null },
    });
    if (!project) return { success: false, error: 'Project not found' };
    return { success: true, data: project };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { success: false, error: 'Failed to fetch project' };
  }
}

export async function createProject(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Não autorizado' };
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const images = formData.get('images') as string;
    const status = formData.get('status') as string || 'DRAFT';
    const featured = formData.get('featured') === 'true';
    
    const seoTitle = formData.get('seoTitle') as string || null;
    const seoDesc = formData.get('seoDesc') as string || null;
    const ogImage = formData.get('ogImage') as string || null;

    const project = await prisma.project.create({
      data: {
        title,
        slug: generateSlug(title),
        description,
        content,
        category,
        tags: tags || '[]',
        images: images || '[]',
        status,
        featured,
        seoTitle,
        seoDesc,
        ogImage,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });
    
    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    return { success: true, data: project };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: 'Failed to create project' };
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Não autorizado' };
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const images = formData.get('images') as string;
    const status = formData.get('status') as string || 'DRAFT';
    const featured = formData.get('featured') === 'true';
    
    const seoTitle = formData.get('seoTitle') as string || null;
    const seoDesc = formData.get('seoDesc') as string || null;
    const ogImage = formData.get('ogImage') as string || null;

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) return { success: false, error: 'Project not found' };

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        content,
        category,
        tags: tags || '[]',
        images: images || '[]',
        status,
        featured,
        seoTitle,
        seoDesc,
        ogImage,
        publishedAt: status === 'PUBLISHED' && existingProject.status !== 'PUBLISHED' ? new Date() : existingProject.publishedAt,
      },
    });
    
    revalidatePath('/admin/portfolio');
    revalidatePath(`/admin/portfolio/${id}/editar`);
    revalidatePath('/portfolio');
    
    return { success: true, data: project };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: 'Failed to update project' };
  }
}

export async function deleteProject(id: string) {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Não autorizado' };
    }

    await prisma.project.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    });
    
    revalidatePath('/admin/portfolio');
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: 'Failed to delete project' };
  }
}
