'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2, Edit2 } from 'lucide-react';
import { deleteClient } from '@/app/actions/clients';
import ClientModal from './ClientModal';

interface Props {
  client: any;
}

export default function ClientActions({ client }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    if (!confirm('Excluir este cliente? Essa ação é irreversível.')) return;
    startTransition(async () => {
      try {
        const res = await deleteClient(client.id);
        if (res.success) {
          toast.success('Cliente excluído com sucesso.');
          router.refresh();
        } else {
          toast.error(res.error || 'Erro ao excluir.');
        }
      } catch (e) {
        toast.error('Erro inesperado.');
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-1.5 text-gray-400 hover:text-laranja hover:bg-orange-50 rounded-lg transition-colors"
          title="Editar Cliente"
        >
          <Edit2 size={16} />
        </button>
        
        <button 
          onClick={handleDelete}
          disabled={isPending}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Excluir"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <ClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={client} 
      />
    </>
  );
}
