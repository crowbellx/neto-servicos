'use client';

import { deletePost } from '@/app/actions/blog';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(`Remover o post "${title}"? Ele deixará de aparecer no site.`);
    if (!confirmed) return;

    const result = await deletePost(id);
    if (result.success) {
      toast.success('Post removido.');
      router.refresh();
    } else {
      toast.error(result.error || 'Falha ao remover post.');
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
      title="Excluir"
    >
      <Trash2 size={16} />
    </button>
  );
}
