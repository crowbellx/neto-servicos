'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { updateQuote, deleteQuote } from '@/app/actions/quotes';
import { Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function QuoteListActions({ quote }: { quote: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      try {
        const payload = { ...quote, status: 'APPROVED' };
        const res = await updateQuote(quote.id, payload);
        if (res.success) {
          toast.success('Orçamento aprovado! Receita lançada no financeiro.', { duration: 4000 });
          router.refresh();
        } else {
          toast.error(res.error || 'Erro ao aprovar.');
        }
      } catch (e) {
        toast.error('Erro inesperado.');
      }
    });
  };

  const handleDelete = () => {
    if (!confirm('Excluir este orçamento definitivamente?')) return;
    startTransition(async () => {
      try {
        const res = await deleteQuote(quote.id);
        if (res.success) {
          toast.success('Excluído com sucesso.');
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
      {quote.status !== 'APPROVED' && (
        <button 
          onClick={handleApprove}
          disabled={isPending}
          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          title="Aprovar e Gerar Receita"
        >
          <CheckCircle2 size={16} />
        </button>
      )}
      <Link 
        href={`/admin/orcamentos/${quote.id}`}
        className="p-1.5 text-gray-500 hover:text-laranja hover:bg-gray-50 rounded-lg transition-colors"
        title="Editar"
      >
        <Edit2 size={16} />
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Excluir"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
