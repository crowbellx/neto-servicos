'use client';

import { useState } from 'react';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { deleteUser } from '@/app/actions/users';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function UserActions({ userId, userName }: { userId: string, userName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${userName}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteUser(userId);
      if (res.success) {
        toast.success('Usuário excluído com sucesso');
        router.refresh();
      } else {
        toast.error(res.error || 'Erro ao excluir usuário');
      }
    } catch (error) {
      toast.error('Erro inesperado ao excluir usuário');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link 
        href={`/admin/configuracoes/usuarios/${userId}`}
        className="p-1.5 text-gray-400 hover:text-laranja hover:bg-orange-50 rounded-md transition-colors"
      >
        <Edit size={16} />
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
      >
        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
}
