import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

export const BLOG_PUBLIC_CACHE_TAG = 'blog-public';

const authorSelect = { select: { name: true, avatar: true } } as const;

export const getCachedPublishedPostsList = unstable_cache(
  async () => {
    try {
      return await prisma.post.findMany({
        where: { deletedAt: null, status: 'PUBLISHED' },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        include: { author: authorSelect },
      });
    } catch (error) {
      console.error('[Cache Blog] Erro ao buscar lista de posts:', error);
      return [];
    }
  },
  ['blog-published-list-v1'],
  { tags: [BLOG_PUBLIC_CACHE_TAG], revalidate: 120 }
);

export const getCachedPublishedPostBySlug = unstable_cache(
  async (slug: string) => {
    try {
      return await prisma.post.findFirst({
        where: { slug, deletedAt: null, status: 'PUBLISHED' },
        include: { author: authorSelect },
      });
    } catch (error) {
      console.error(`[Cache Blog] Erro ao buscar post ${slug}:`, error);
      return null;
    }
  },
  ['blog-post-by-slug-v1'],
  { tags: [BLOG_PUBLIC_CACHE_TAG], revalidate: 120 }
);