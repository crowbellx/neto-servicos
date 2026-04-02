'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createQuote, updateQuote, deleteQuote } from '@/app/actions/quotes';
import { ArrowLeft, Save, Send, Share2, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface QuoteFormProps {
  initialData?: any;
  clients: any[];
}

export default function QuoteForm({ initialData, clients }: QuoteFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    defaultValues: {
      number: initialData?.number || '',
      clientId: initialData?.clientId || '',
      clientName: initialData?.clientName || '',
      clientEmail: initialData?.clientEmail || '',
      clientPhone: initialData?.clientPhone || '',
      service: initialData?.service || '',
      description: initialData?.description || '',
      value: initialData?.value || 0,
      costMaterial: initialData?.costMaterial || 0,
      costLabor: initialData?.costLabor || 0,
      deliveryTime: initialData?.deliveryTime || '',
      status: initialData?.status || 'PENDING',
    }
  });

  const clientId = watch('clientId');
  const watchStatus = watch('status');
  const watchedValue = watch('value');
  const watchedMaterial = watch('costMaterial');
  const watchedLabor = watch('costLabor');

  const grossRevenue = parseFloat(watchedValue?.toString() || '0');
  const totalCost = parseFloat(watchedMaterial?.toString() || '0') + parseFloat(watchedLabor?.toString() || '0');
  const netProfit = grossRevenue - totalCost;
  const profitMargin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0.0';

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setValue('clientId', id);
    if (id) {
      const client = clients.find(c => c.id === id);
      if (client) {
        setValue('clientName', client.name);
        setValue('clientEmail', client.email || '');
        setValue('clientPhone', client.phone || '');
      }
    } else {
      setValue('clientName', '');
      setValue('clientEmail', '');
      setValue('clientPhone', '');
    }
  };

  const onSubmit = async (data: any) => {
    startTransition(async () => {
      try {
        const payload = {
          ...data,
          value: parseFloat(data.value),
          costMaterial: parseFloat(data.costMaterial),
          costLabor: parseFloat(data.costLabor),
        };

        const res = initialData?.id 
          ? await updateQuote(initialData.id, payload) 
          : await createQuote(payload);

        if (res.success) {
          toast.success(initialData?.id ? 'Orçamento atualizado!' : 'Orçamento criado!');
          if (data.status === 'APPROVED' && (!initialData || initialData.status !== 'APPROVED')) {
            toast.success('Receita registrada no módulo Financeiro!', { duration: 4000 });
          }
          router.push('/admin/orcamentos');
          router.refresh();
        } else {
          toast.error(res.error || 'Erro ao salvar o orçamento.');
        }
      } catch (err) {
        toast.error('Ocorreu um erro inesperado.');
      }
    });
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm('Tem certeza que deseja excluir este orçamento? Isso não afetará as receitas/despesas já lançadas no financeiro, mas removerá o registro daqui.')) return;
    
    startTransition(async () => {
      try {
        const res = await deleteQuote(initialData.id);
        if (res.success) {
          toast.success('Orçamento excluído com sucesso.');
          router.push('/admin/orcamentos');
          router.refresh();
        } else {
          toast.error(res.error || 'Erro ao excluir orçamento.');
        }
      } catch (err) {
        toast.error('Erro inesperado ao excluir.');
      }
    });
  };

  const formatWhatsAppMessage = () => {
    const data = watch();
    const val = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(data.value!.toString()) || 0);
    return encodeURIComponent(`Olá ${data.clientName},\n\nAqui está o seu orçamento para *${data.service}*:\n\n*Detalhes*: ${data.description}\n*Valor Total*: ${val}\n\nAguardamos seu retorno para prosseguirmos!`);
  };

  const notifyWhatsApp = () => {
    const phone = watch('clientPhone');
    if (!phone) return toast.error("Cliente sem telefone cadastrado.");
    const number = phone.replace(/\D/g, '');
    const url = `https://wa.me/55${number}?text=${formatWhatsAppMessage()}`;
    window.open(url, '_blank');
  };

  const notifyEmail = () => {
    const email = watch('clientEmail');
    if (!email) return toast.error("Cliente sem e-mail cadastrado.");
    
    // Fallback nativo simples
    const subject = encodeURIComponent(`Orçamento: ${watch('service')}`);
    const body = formatWhatsAppMessage();
    const url = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(url, '_blank');
    toast.info("Aberto no aplicativo de e-mail local (Outlook / Mail).");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/orcamentos" className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {initialData ? `Orçamento ${initialData.number}` : 'Novo Orçamento'}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {initialData && (
             <button 
               type="button"
               onClick={handleDelete}
               disabled={isPending}
               className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-50"
             >
                <Trash2 size={18} /> Excluir
             </button>
          )}
          <button 
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-laranja text-white rounded-lg font-medium hover:bg-[#D4651A]"
          >
             <Save size={18} /> Salvar & Emitir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Destinatário</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente Vinculado</label>
              <select 
                {...register('clientId')}
                onChange={handleClientChange}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm"
              >
                <option value="">Selecione um cliente (opcional)</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.company || 'Pessoa Física'})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Padrão</label>
                <input {...register('clientName')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input type="email" {...register('clientEmail')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                <input {...register('clientPhone')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Proposta</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serviço/Produto</label>
              <input {...register('service')} placeholder="Ex: Criação de Identidade Visual" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Comercial</label>
              <textarea {...register('description')} className="w-full border border-gray-200 rounded-lg p-3 text-sm h-32" placeholder="Descreva os entregáveis e os termos do serviço..." required />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Prazo de Entrega Estimado</label>
                 <input {...register('deliveryTime')} placeholder="Ex: 15 dias úteis" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Valor Final Kobrado (R$)</label>
                 <input type="number" step="0.01" {...register('value')} className="w-full border border-gray-200 rounded-lg p-2.5 text-xl font-medium text-laranja text-right" required />
               </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center justify-between">
              Custos e Metas (Apenas Interno)
              {netProfit > 0 ? (
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold">
                  {profitMargin}% Margem Real
                </span>
              ) : (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-bold">
                  Déficit
                </span>
              )}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custo C/ Terceiros/Material (R$)</label>
                <input type="number" step="0.01" {...register('costMaterial')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custo C/ Mão de Obra (R$)</label>
                <input type="number" step="0.01" {...register('costLabor')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" />
              </div>
            </div>

            <div className="pt-2">
               <div className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Lucro Líquido Estimado:</span>
                  <span className={`text-lg font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(netProfit)}
                  </span>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Gerenciamento</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status da Proposta</label>
              <select {...register('status')} className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm font-bold ${watchStatus === 'APPROVED' ? 'text-emerald-600 bg-emerald-50' : ''}`}>
                <option value="PENDING">Rascunho</option>
                <option value="SENT">Enviado</option>
                <option value="APPROVED">Aprovado (Gera Receita)</option>
                <option value="REJECTED">Rejeitado</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-3">
             <p className="text-sm font-medium text-gray-700 mb-4">Compartilhamento Rápido</p>
             <button type="button" onClick={notifyWhatsApp} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
               <Share2 size={16} /> Enviar no WhatsApp
             </button>
             <button type="button" onClick={notifyEmail} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
               <Send size={16} /> Enviar por E-mail
             </button>
          </div>
        </div>
      </div>
    </form>
  );
}
