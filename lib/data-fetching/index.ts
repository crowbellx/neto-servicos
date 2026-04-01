import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

/**
 * 🎯 CTO Architecture: Centralized Data Fetching Layer
 * Provides performance optimization, automatic deduplication, 
 * and granular caching tags for efficient ISR.
 */

// --- CACHE TAGS ---
export const TAGS = {
  SETTINGS: 'settings',
  BLOG: 'blog',
  PORTFOLIO: 'portfolio',
  SERVICES: 'services',
  LEADS: 'leads',
} as const;

// --- SETTINGS ---
export const getCachedSettings = (key: string) => 
  unstable_cache(
    async () => {
      try {
        const setting = await prisma.setting.findUnique({ where: { key } });
        return setting?.data ? JSON.parse(setting.data) : null;
      } catch (error) {
        console.error(`[Fetch Settings] Error:`, error);
        return null;
      }
    },
    [`settings-${key}`],
    { tags: [TAGS.SETTINGS], revalidate: 3600 }
  )();

// --- BLOG ---
export const getCachedPublishedPosts = unstable_cache(
  async () => {
    try {
      return await prisma.post.findMany({
        where: { status: 'PUBLISHED', deletedAt: null },
        orderBy: { publishedAt: 'desc' },
        include: { author: { select: { name: true, avatar: true } } }
      });
    } catch (error) {
      console.error(`[Fetch Posts] Error:`, error);
      return [];
    }
  },
  ['published-posts'],
  { tags: [TAGS.BLOG], revalidate: 3600 }
);

export const getCachedPostBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      try {
        return await prisma.post.findFirst({
          where: { slug, status: 'PUBLISHED', deletedAt: null },
          include: { author: { select: { name: true, avatar: true } } }
        });
      } catch (error) {
        console.error(`[Fetch Post ${slug}] Error:`, error);
        return null;
      }
    },
    [`post-${slug}`],
    { tags: [TAGS.BLOG, `post-${slug}`], revalidate: 3600 }
  )();

// --- PORTFOLIO ---
export const getCachedPublishedProjects = unstable_cache(
  async () => {
    try {
      return await prisma.project.findMany({
        where: { status: 'PUBLISHED', deletedAt: null },
        orderBy: { order: 'asc' }
      });
    } catch (error) {
      console.error(`[Fetch Projects] Error:`, error);
      return [];
    }
  },
  ['published-projects'],
  { tags: [TAGS.PORTFOLIO], revalidate: 3600 }
);

export const getCachedProjectBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      try {
        return await prisma.project.findFirst({
          where: { slug, status: 'PUBLISHED', deletedAt: null }
        });
      } catch (error) {
        console.error(`[Fetch Project ${slug}] Error:`, error);
        return null;
      }
    },
    [`project-${slug}`],
    { tags: [TAGS.PORTFOLIO, `project-${slug}`], revalidate: 3600 }
  )();
