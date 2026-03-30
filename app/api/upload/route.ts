import { auth } from '@/auth';
import { hasRequiredRole } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES_PER_REQUEST = 10;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop();
  return ext ? ext.toLowerCase() : 'bin';
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const user = session?.user as any;

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    if (!hasRequiredRole(user.role, 'EDITOR')) {
      return NextResponse.json({ error: 'Sem permissão para upload' }, { status: 403 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files');
    const folderRaw = (formData.get('folder')?.toString() || 'uploads').replace(/^\/+|\/+$/g, '');
    const folder = folderRaw.replace(/[^a-zA-Z0-9/_-]/g, '') || 'uploads';
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'media';

    if (!files.length) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    console.log(`[UPLOAD] Iniciando upload de ${files.length} arquivos para o bucket: ${bucket}`);

    const supabase = createSupabaseAdminClient();
    const uploaded: Array<{ url: string; path: string; name: string; size: number; type: string }> = [];

    for (const entry of files) {
      if (!(entry instanceof File)) continue;

      if (!ALLOWED_TYPES.has(entry.type)) {
        return NextResponse.json({ error: `Tipo não suportado: ${entry.type}` }, { status: 400 });
      }

      const ext = getFileExtension(entry.name);
      const filePath = `${folder}/${randomUUID()}.${ext}`;
      const bytes = await entry.arrayBuffer();

      const { data, error: uploadError } = await supabase.storage.from(bucket).upload(filePath, bytes, {
        contentType: entry.type,
        upsert: false,
      });

      if (uploadError) {
        console.error('[UPLOAD_ERROR] Erro no Supabase Storage:', uploadError);
        return NextResponse.json({ error: `Erro no Storage: ${uploadError.message}` }, { status: 500 });
      }

      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const publicUrl = publicData.publicUrl;

      uploaded.push({
        url: publicUrl,
        path: filePath,
        name: entry.name,
        size: entry.size,
        type: entry.type,
      });
    }

    if (uploaded.length) {
      await prisma.media.createMany({
        data: uploaded.map((file) => ({
          filename: file.path,
          url: file.url,
          type: file.type,
          size: file.size,
          uploadedBy: user.id || user.email || 'system',
        })),
      });
    }

    return NextResponse.json({ files: uploaded });
  } catch (error) {
    console.error('[UPLOAD_CRITICAL_ERROR]:', error);
    return NextResponse.json({ error: 'Erro interno no servidor de upload' }, { status: 500 });
  }
}