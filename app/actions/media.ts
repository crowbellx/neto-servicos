'use server';

import { prisma } from '@/lib/prisma';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

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

export async function uploadSettingsImage(formData: FormData) {
  try {
    const file = formData.get('file') as unknown;
    
    // Defensive check: Ensure we have a valid File object
    if (!file || !(file instanceof File)) {
      console.error('[Upload] Invalid or missing file in FormData');
      return { success: false, error: 'O arquivo enviado é inválido ou não foi encontrado.' };
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'media';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Fail-Safe check for environment variables
    if (!supabaseUrl || !supabaseKey) {
      console.error('[Upload] Missing Supabase configuration (URL or Roles Key)');
      return { 
        success: false, 
        error: 'Configuração do servidor incompleta (Missing Supabase Credentials). Por favor, verifique as variáveis de ambiente.' 
      };
    }

    const supabase = createSupabaseAdminClient();
    
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `settings/${fileName}`;

    /** 
     * MIME Type Fallback: 
     * Browsers often send empty type for .ico or .svg. 
     * Supabase storage requires a valid content type for proper delivery and browser rendering.
     */
    let contentType = file.type;
    if (!contentType || contentType === 'application/octet-stream') {
      if (fileExt === 'ico') contentType = 'image/x-icon';
      else if (fileExt === 'svg') contentType = 'image/svg+xml';
      else if (['jpg', 'jpeg'].includes(fileExt || '')) contentType = 'image/jpeg';
      else if (fileExt === 'png') contentType = 'image/png';
      else if (fileExt === 'webp') contentType = 'image/webp';
    }

    // Convert File to Buffer safety
    let buffer: Buffer;
    try {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } catch (e) {
      console.error('[Upload] Buffer conversion failed:', e);
      return { success: false, error: 'Não foi possível ler o conteúdo do arquivo.' };
    }

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error('[Upload] Supabase Error:', uploadError);
      return { success: false, error: `Supabase: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('[Upload] Critical server failure:', error);
    return { 
      success: false, 
      error: `Erro interno no servidor: ${error?.message || 'Falha catastrófica'}` 
    };
  }
}
export async function createSignedUploadUrl(path: string) {
  try {
    const session = await auth();
    if (!session) return { success: false, error: 'Não autorizado' };

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'media';
    const supabase = createSupabaseAdminClient();
    
    // Generate a signed URL for a specific bucket path
    // expiresIn: 60 seconds is enough for a standard upload
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);
      
    if (error) {
      console.error('[SignedURL] Error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, signedUrl: data.signedUrl, token: data.token, path: data.path };
  } catch (error: any) {
    console.error('[SignedURL] Critical Failure:', error);
    return { success: false, error: 'Falha ao gerar URL de upload' };
  }
}

/**
 * Após o upload direto para o Supabase pelo cliente, chamamos esta ação 
 * para registrar a mídia no nosso banco de dados Prisma.
 */
export async function recordMedia(data: {
  url: string;
  filename: string;
  type: string;
  size: number;
}) {
  try {
    const session = await auth();
    if (!session) return { success: false, error: 'Não autorizado' };

    const user = session?.user as any;

    const media = await prisma.media.create({
      data: {
        ...data,
        uploadedBy: user.id || user.email || 'system',
      },
    });

    revalidatePath('/admin/midia');
    return { success: true, data: media };
  } catch (error) {
    console.error('[RecordMedia] Error:', error);
    return { success: false, error: 'Falha ao registrar mídia no banco' };
  }
}
