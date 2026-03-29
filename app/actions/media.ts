'use server';

import { prisma } from '@/lib/prisma';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getMedia() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: media };
  } catch (error) {
    console.error('Error fetching media:', error);
    return { success: false, error: 'Failed to fetch media' };
  }
}

export async function getMediaById(id: string) {
  try {
    const media = await prisma.media.findUnique({
      where: { id },
    });
    if (!media) return { success: false, error: 'Media not found' };
    return { success: true, data: media };
  } catch (error) {
    console.error('Error fetching media:', error);
    return { success: false, error: 'Failed to fetch media' };
  }
}

export async function createMedia(data: any) {
  try {
    const media = await prisma.media.create({
      data: {
        ...data,
      },
    });
    revalidatePath('/admin/midia');
    return { success: true, data: media };
  } catch (error) {
    console.error('Error creating media:', error);
    return { success: false, error: 'Failed to create media' };
  }
}

export async function deleteMedia(id: string) {
  try {
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return { success: false, error: 'Media not found' };
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'media';
    const looksLikeStoragePath = media.filename.includes('/');

    if (looksLikeStoragePath) {
      const supabase = createSupabaseAdminClient();
      await supabase.storage.from(bucket).remove([media.filename]);
    }

    await prisma.media.delete({
      where: { id },
    });

    revalidatePath('/admin/midia');
    return { success: true };
  } catch (error) {
    console.error('Error deleting media:', error);
    return { success: false, error: 'Failed to delete media' };
  }
}
