import { auth } from '@/auth';
import { hasRequiredRole } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
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
    
    // Fallback para bucket 'media' se variável não estiver definida
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
        console.warn(`[UPLOAD] Tipo de arquivo não permitido: ${entry.type}`);
        return NextResponse.json({ error: `Tipo não suportado: ${entry.type}` }, { status: 400 });
      }

      if (entry.size > MAX_FILE_SIZE) {
        console.warn(`[UPLOAD] Arquivo muito grande: ${entry.size} bytes`);
        return NextResponse.json({ error: 'Arquivo excede o limite de 10MB' }, { status: 400 });
      }

      const ext = getFileExtension(entry.name);
      const filePath = `${folder}/${randomUUID()}.${ext}`;
      const bytes = await entry.arrayBuffer();

      console.log(`[UPLOAD] Enviando para Supabase: ${filePath}`);

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
      console.log(`[UPLOAD] Salvando ${uploaded.length} registros no banco de dados Prisma`);
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
  } catch (error: any) {
    console.error('[UPLOAD_CRITICAL_ERROR]:', error);
    return NextResponse.json({ 
      error: 'Erro interno no servidor de upload',
      details: error.message 
    }, { status: 500 });
  }
}