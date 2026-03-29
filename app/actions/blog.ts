'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath, revalidateTag } from 'next/cache';
import { BLOG_PUBLIC_CACHE_TAG } from '@/lib/cache/blog-public';

function normalizeTagsInput(raw: string | null | undefined): string {
  if (!raw || !String(raw).trim()) return '[]';
  const trimmed = String(raw).trim();
  if (trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed);
      return trimmed;
    } catch {
      return '[]';
    }
  }
  const arr = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
  return JSON.stringify(arr);
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4);
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      where: { deletedAt: null },
      include: { author: { select: { name: true, avatar: true } } }
    });
    return { success: true, data: posts };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { success: false, error: 'Failed to fetch posts' };
  }
}

export async function getPostById(id: string) {
  try {
    const post = await prisma.post.findFirst({
      where: { id, deletedAt: null },
      include: { author: { select: { name: true, avatar: true } } },
    });

    if (!post) return { success: false, error: 'Post not found' };

    return { success: true, data: post };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { success: false, error: 'Failed to fetch post' };
  }
}

export async function getPublishedPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        deletedAt: null,
        status: 'PUBLISHED',
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      include: { author: { select: { name: true, avatar: true } } },
    });
    return { success: true, data: posts };
  } catch (error) {
    console.error('Error fetching published posts:', error);
    return { success: false, error: 'Failed to fetch posts' };
  }
}

export async function getPublishedPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        slug,
        deletedAt: null,
        status: 'PUBLISHED',
      },
      include: { author: { select: { name: true, avatar: true } } },
    });
    if (!post) return { success: false, error: 'Post not found' };
    return { success: true, data: post };
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return { success: false, error: 'Failed to fetch post' };
  }
}

export async function incrementPostViews(id: string) {
  try {
    await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function createPost(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Não autorizado' };
    }

    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const tags = normalizeTagsInput(formData.get('tags') as string);
    const status = formData.get('status') as string || 'DRAFT';
    const coverImage = formData.get('coverImage') as string;
    
    const seoTitle = formData.get('seoTitle') as string || null;
    const seoDesc = formData.get('seoDesc') as string || null;
    const focusKw = formData.get('focusKw') as string || null;
    
    const wordCount = content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const post = await prisma.post.create({
      data: {
        title,
        slug: generateSlug(title),
        excerpt,
        content,
        category,
        tags,
        status,
        coverImage,
        seoTitle,
        seoDesc,
        focusKw,
        readTime,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        authorId: session.user.id,
      }
    });

    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    revalidateTag(BLOG_PUBLIC_CACHE_TAG);
    return { success: true, data: post };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: 'Failed to create post' };
  }
}

export async function updatePost(id: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Não autorizado' };
    }

    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const tags = normalizeTagsInput(formData.get('tags') as string);
    const status = formData.get('status') as string || 'DRAFT';
    const coverImage = formData.get('coverImage') as string;
    
    const seoTitle = formData.get('seoTitle') as string || null;
    const seoDesc = formData.get('seoDesc') as string || null;
    const focusKw = formData.get('focusKw') as string || null;
    
    const wordCount = content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) return { success: false, error: 'Post not found' };

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        category,
        tags,
        status,
        coverImage,
        seoTitle,
        seoDesc,
        focusKw,
        readTime,
        publishedAt: status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED' ? new Date() : existingPost.publishedAt,
      }
    });

    revalidatePath('/admin/blog');
    revalidatePath(`/admin/blog/${id}/editar`);
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath(`/blog/${existingPost.slug}`);
    revalidateTag(BLOG_PUBLIC_CACHE_TAG);

    return { success: true, data: post };
  } catch (error) {
    console.error('Error updating post:', error);
    return { success: false, error: 'Failed to update post' };
  }
}

export async function deletePost(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Não autorizado' };
    }

    const existing = await prisma.post.findUnique({ where: { id } });
    await prisma.post.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    });

    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    if (existing?.slug) {
      revalidatePath(`/blog/${existing.slug}`);
    }
    revalidateTag(BLOG_PUBLIC_CACHE_TAG);
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: 'Failed to delete post' };
  }
}
