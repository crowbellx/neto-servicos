'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2, CheckCircle2, Clock } from 'lucide-react';
import { updateTransactionStatus, deleteTransaction } from '@/app/actions/finance';

interface Props {
  transaction: any;
}

export default function TransactionActions({ transaction }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = () => {
    const newStatus = transaction.status === 'PAID' ? 'PENDING' : 'PAID';
    startTransition(async () => {
      try {
        const res = await updateTransactionStatus(transaction.id, newStatus);
        if (res.success) {
          toast.success(`Transação marcada como ${newStatus === 'PAID' ? 'Liquidada' : 'Pendente'}`);
          router.refresh();
        } else {
          toast.error(res.error || 'Erro ao alterar status.');
        }
      } catch (e) {
        toast.error('Erro inesperado.');
      }
    });
  };

  const handleDelete = () => {
    if (!confirm('Excluir esta transação? Isso afetará os relatórios financeiros do mês.')) return;
    startTransition(async () => {
      try {
        const res = await deleteTransaction(transaction.id);
        if (res.success) {
          toast.success('Excluída com sucesso.');
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
    <div className="flex items-center justify-end gap-2">
      {transaction.status === 'PENDING' ? (
        <button 
          onClick={handleToggleStatus}
          disabled={isPending}
          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Marcar como Liquidado (Recebido/Pago)"
        >
          <CheckCircle2 size={16} /> Dar Baixa
        </button>
      ) : (
        <button 
          onClick={handleToggleStatus}
          disabled={isPending}
          className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
          title="Reverter para Pendente"
        >
          <Clock size={16} />
        </button>
      )}
      
      {!transaction.quoteId && (
        <button 
          onClick={handleDelete}
          disabled={isPending}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Excluir Lançamento Manual"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
