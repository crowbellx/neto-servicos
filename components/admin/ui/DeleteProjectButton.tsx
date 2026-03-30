'use client';

import { deleteProject } from '@/app/actions/portfolio';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(`Excluir o projeto "${title}" permanentemente?`);
    if (!confirmed) return;

    const result = await deleteProject(id);
    if (result.success) {
      toast.success('Projeto excluído com sucesso.');
      router.refresh();
    } else {
      toast.error(result.error || 'Falha ao excluir projeto.');
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