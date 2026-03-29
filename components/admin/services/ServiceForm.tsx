'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, CheckCircle2, Save } from 'lucide-react';
import Link from 'next/link';
import { createService, updateService } from '@/app/actions/services';
import { toast } from 'sonner';

const serviceSchema = z.object({
  title: z.string().min(2, 'Título deve ter no mínimo 2 caracteres'),
  slug: z.string().min(2, 'Slug obrigatório'),
  description: z.string().optional(),
  category: z.string().min(1, 'Categoria obrigatória'),
  price: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  icon: z.string().optional(),
  order: z.coerce.number().int().min(0),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

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
      order: initialData?.order || 0,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const onSubmit = async (data: ServiceFormValues) => {
    setIsSaving(true);
    try {
      const payload = { ...data };
      const result = initialData?.id ? await updateService(initialData.id, payload) : await createService(payload);

      if (!result.success) {
        toast.error(result.error || 'Falha ao salvar serviço');
        return;
      }

      toast.success(initialData?.id ? 'Serviço atualizado com sucesso.' : 'Serviço criado com sucesso.');
      router.push('/admin/servicos');
      router.refresh();
    } catch (error) {
      toast.error('Erro inesperado ao salvar serviço.');
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
            <p className="text-sm text-gray-500">{initialData ? 'Atualize os dados do serviço' : 'Cadastre um novo serviço para o site'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => form.setValue('status', 'INACTIVE')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Save size={18} />
            Salvar Inativo
          </button>
          <button
            type="submit"
            disabled={isSaving}
            onClick={() => form.setValue('status', 'ACTIVE')}
            className="flex items-center gap-2 px-4 py-2 bg-laranja text-white rounded-lg text-sm font-medium hover:bg-[#D4651A] transition-colors disabled:opacity-70"
          >
            <CheckCircle2 size={18} />
            {isSaving ? 'Salvando...' : 'Salvar Serviço'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input {...register('title')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja" />
          {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input {...register('slug')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-mono focus:ring-2 focus:ring-laranja/20 focus:border-laranja" />
          {errors.slug && <span className="text-red-500 text-xs">{errors.slug.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <input {...register('category')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja" />
          {errors.category && <span className="text-red-500 text-xs">{errors.category.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preço Base</label>
          <input {...register('price')} placeholder="Ex: A partir de R$ 250" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ícone</label>
          <input {...register('icon')} placeholder="Ex: Settings" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
          <input type="number" {...register('order')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja" />
          {errors.order && <span className="text-red-500 text-xs">{errors.order.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select {...register('status')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja">
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja"
          />
          <p className="text-xs text-gray-400 mt-1">{watch('description')?.length || 0} caracteres</p>
        </div>
      </div>
    </form>
  );
}
