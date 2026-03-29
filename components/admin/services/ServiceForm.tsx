'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, CheckCircle2, Save } from 'lucide-react';
import Link from 'next/link';
import { createService, updateService } from '@/app/actions/services';
import { toast } from 'sonner';

const serviceSchema = z.object({
  title: z.string().min(2, 'Título deve ter no mínimo 2 caracteres'),
  slug: z.string().min(2, 'Slug obrigatório'),
  description: z.string().optional().or(z.literal('')),
  category: z.string().min(1, 'Categoria obrigatória'),
  price: z.string().optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  icon: z.string().optional().or(z.literal('')),
  order: z.number().int().min(0),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  initialData?: any;
}

export default function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      price: initialData?.price || '',
      status: initialData?.status || 'ACTIVE',
      icon: initialData?.icon || '',
      order: Number(initialData?.order) || 0,
    },
  });

  const { register, handleSubmit, setValue } = form;

  const onSubmit: SubmitHandler<ServiceFormValues> = async (data) => {
    setIsSaving(true);
    try {
      const result = initialData?.id ? await updateService(initialData.id, data) : await createService(data);
      if (result.success) {
        toast.success('Serviço salvo!');
        router.push('/admin/servicos');
        router.refresh();
      } else {
        toast.error(result.error || 'Erro ao salvar.');
      }
    } catch (error) {
      toast.error('Erro inesperado.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/servicos" className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{initialData ? 'Editar Serviço' : 'Novo Serviço'}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => { 
              setValue('status', 'INACTIVE'); 
              void handleSubmit(onSubmit)(); 
            }} 
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Save size={18} /> Inativo
          </button>
          <button 
            type="submit" 
            disabled={isSaving} 
            className="px-4 py-2 bg-laranja text-white rounded-lg text-sm font-medium hover:bg-[#D4651A] transition-colors disabled:opacity-70" 
            onClick={() => setValue('status', 'ACTIVE')}
          >
            <CheckCircle2 size={18} /> {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input {...register('title')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input {...register('slug')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-mono" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <input {...register('category')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
          <input 
            type="number" 
            {...register('order', { valueAsNumber: true })} 
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" 
          />
        </div>
      </div>
    </form>
  );
}