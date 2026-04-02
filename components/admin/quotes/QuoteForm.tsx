'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createQuote, updateQuote } from '@/app/actions/quotes';
import { ArrowLeft, Save, Send, Share2 } from 'lucide-react';
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
      status: initialData?.status || 'PENDING',
    }
  });

  const clientId = watch('clientId');
  const watchStatus = watch('status');

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

            <div className="w-1/2">
               <label className="block text-sm font-medium text-gray-700 mb-1">Valor Final (R$)</label>
               <input type="number" step="0.01" {...register('value')} className="w-full border border-gray-200 rounded-lg p-2.5 text-xl font-medium text-laranja" required />
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
