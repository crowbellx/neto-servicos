'use client';

import { deletePage } from '@/app/actions/pages';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DeletePageButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(`Excluir a página "${title}"? Esta ação não pode ser desfeita.`);
    if (!confirmed) return;

    const result = await deletePage(id);
    if (result.success) {
      toast.success('Página excluída.');
      router.refresh();
    } else {
      toast.error(result.error || 'Falha ao excluir página.');
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
