'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { X, Save, Building2, UserCircle2 } from 'lucide-react';
import { createClient, updateClient } from '@/app/actions/clients';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export default function ClientModal({ isOpen, onClose, initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      document: formData.get('document') as string,
      address: formData.get('address') as string,
      status: formData.get('status') as string,
    };

    startTransition(async () => {
      try {
        let res;
        if (initialData?.id) {
           res = await updateClient(initialData.id, data);
        } else {
           res = await createClient(data);
        }
        
        if (res.success) {
          toast.success(`Cliente ${initialData?.id ? 'atualizado' : 'cadastrado'}!`);
          router.refresh();
          onClose();
        } else {
          toast.error(res.error || 'Erro ao salvar.');
        }
      } catch (err) {
        toast.error('Erro inesperado.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {initialData?.company ? <Building2 size={20} className="text-laranja" /> : <UserCircle2 size={20} className="text-laranja" />}
            {initialData ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 rounded hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-left max-h-[70vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
               <input name="name" required defaultValue={initialData?.name} placeholder="Ex: João Silva" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-laranja" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
               <input name="email" type="email" defaultValue={initialData?.email} placeholder="joao@example.com" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-laranja" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
               <input name="phone" defaultValue={initialData?.phone} placeholder="(11) 99999-9999" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-laranja" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa (Opcional)</label>
               <input name="company" defaultValue={initialData?.company} placeholder="Sua Empresa LTDA" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-laranja" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">CPF ou CNPJ</label>
               <input name="document" defaultValue={initialData?.document} placeholder="000.000.000-00" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-laranja" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
               <select name="status" defaultValue={initialData?.status || 'ACTIVE'} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-laranja bg-white">
                 <option value="ACTIVE">Ativo</option>
                 <option value="INACTIVE">Inativo</option>
               </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Endereço (Opcional)</label>
             <input name="address" defaultValue={initialData?.address} placeholder="Rua Três, 123 - Centro..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-laranja" />
          </div>

          <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} disabled={isPending} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="px-4 py-2 text-sm font-medium text-white bg-laranja rounded-lg hover:bg-[#D4651A] flex items-center gap-2">
              <Save size={16} /> Salvar Cliente
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
