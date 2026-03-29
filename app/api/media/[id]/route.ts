import { auth } from '@/auth';
import { deleteMedia } from '@/app/actions/media';
import { hasRequiredRole } from '@/lib/auth/rbac';
import { NextResponse } from 'next/server';

type Params = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, { params }: Params) {
  const session = await auth();
  const user = session?.user as any;

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  if (!hasRequiredRole(user.role, 'EDITOR')) {
    return NextResponse.json({ error: 'Sem permissão para excluir mídia' }, { status: 403 });
  }

  const { id } = await params;
  const result = await deleteMedia(id);

  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Falha ao excluir' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}