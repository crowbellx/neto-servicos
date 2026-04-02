'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { X, Save, TrendingUp, TrendingDown } from 'lucide-react';
import { createTransaction } from '@/app/actions/finance';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dateStr = formData.get('date') as string;
    
    // Add time component to raw date string to avoid timezone offset issues making it yesterday
    const date = new Date(`${dateStr}T12:00:00`);

    const data = {
      description: formData.get('description'),
      category: formData.get('category'),
      type,
      amount: parseFloat(formData.get('amount') as string),
      status: formData.get('status'),
      date: date
    };

    startTransition(async () => {
      try {
        const res = await createTransaction(data);
        if (res.success) {
          toast.success('Transação registrada!');
          onClose();
          router.refresh();
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Nova Transação</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 rounded hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-left">
          
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={() => setType('INCOME')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors border ${type === 'INCOME' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              <TrendingUp size={16} /> Receita
            </button>
            <button 
              type="button" 
              onClick={() => setType('EXPENSE')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors border ${type === 'EXPENSE' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              <TrendingDown size={16} /> Despesa
            </button>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
             <input name="description" required placeholder="Ex: Pagamento Hospedagem Servidor" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-laranja" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
               <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-medium outline-none focus:border-laranja" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
               <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-laranja" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Categoria (Opcional)</label>
               <select name="category" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-laranja bg-white">
                 <option value="">Sem categoria</option>
                 <option value="Infraestrutura">Infraestrutura</option>
                 <option value="Marketing">Marketing</option>
                 <option value="Salários">Salários</option>
                 <option value="Equipamentos">Equipamentos</option>
                 <option value="Impostos">Impostos</option>
                 <option value="Outros">Outros</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
               <select name="status" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-laranja bg-white font-medium">
                 <option value="PAID">Liquidado / Pago</option>
                 <option value="PENDING">Pendente</option>
               </select>
             </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} disabled={isPending} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="px-4 py-2 text-sm font-medium text-white bg-laranja rounded-lg hover:bg-[#D4651A] flex items-center gap-2">
              <Save size={16} /> Salvar Lançamento
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
