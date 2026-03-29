import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

export const BLOG_PUBLIC_CACHE_TAG = 'blog-public';

const authorSelect = { select: { name: true, avatar: true } } as const;

export const getCachedPublishedPostsList = unstable_cache(
  async () => {
    return prisma.post.findMany({
      where: { deletedAt: null, status: 'PUBLISHED' },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      include: { author: authorSelect },
    });
  },
  ['blog-published-list-v1'],
  { tags: [BLOG_PUBLIC_CACHE_TAG], revalidate: 120 }
);

/**
 * Um único wrapper `unstable_cache` (como a lista acima). O Next.js inclui os
 * argumentos da chamada na chave de cache (`JSON.stringify(args)`), então cada
 * `slug` continua com entrada separada — sem recriar o cache a cada request.
 */
export const getCachedPublishedPostBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.post.findFirst({
      where: { slug, deletedAt: null, status: 'PUBLISHED' },
      include: { author: authorSelect },
    });
  },
  ['blog-post-by-slug-v1'],
  { tags: [BLOG_PUBLIC_CACHE_TAG], revalidate: 120 }
);
