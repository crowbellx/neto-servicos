'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { createPage, updatePage } from '@/app/actions/pages';
import TipTapEditor from '@/components/admin/editor/TipTapEditor';
import { toast } from 'sonner';

const pageSchema = z.object({
  title: z.string().min(2, 'Título deve ter no mínimo 2 caracteres'),
  slug: z.string().min(1, 'Slug obrigatório'),
  content: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

type PageFormValues = z.infer<typeof pageSchema>;

interface PageFormProps {
  initialData?: any;
}

export default function PageForm({ initialData }: PageFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      content: initialData?.content || '',
      status: initialData?.status || 'DRAFT',
      seoTitle: initialData?.seoTitle || '',
      seoDesc: initialData?.seoDesc || '',
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const onSubmit = async (data: PageFormValues) => {
    setIsSaving(true);
    try {
      const payload = { ...data };
      const result = initialData?.id ? await updatePage(initialData.id, payload) : await createPage(payload);

      if (!result.success) {
        toast.error(result.error || 'Falha ao salvar página');
        return;
      }

      toast.success(initialData?.id ? 'Página atualizada com sucesso.' : 'Página criada com sucesso.');
      router.push('/admin/paginas');
      router.refresh();
    } catch (error) {
      toast.error('Erro inesperado ao salvar página.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/paginas" className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{initialData ? 'Editar Página' : 'Nova Página'}</h1>
            <p className="text-sm text-gray-500">{initialData ? 'Atualize o conteúdo da página' : 'Cadastre uma nova página estática'}</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-laranja text-white rounded-lg text-sm font-medium hover:bg-[#D4651A] transition-colors disabled:opacity-70"
        >
          <CheckCircle2 size={18} />
          {isSaving ? 'Salvando...' : 'Salvar Página'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input {...register('title')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja" />
              {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
              <input {...register('slug')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-mono focus:ring-2 focus:ring-laranja/20 focus:border-laranja" />
              {errors.slug && <span className="text-red-500 text-xs">{errors.slug.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo</label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TipTapEditor value={field.value || ''} onChange={field.onChange} placeholder="<p>Escreva o conteúdo da página...</p>" />
                )}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
          <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Configurações</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select {...register('status')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja">
                <option value="DRAFT">Rascunho</option>
                <option value="PUBLISHED">Publicado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
              <input {...register('seoTitle')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
              <textarea {...register('seoDesc')} rows={4} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja" />
              <p className="text-xs text-gray-400 mt-1">{watch('seoDesc')?.length || 0} caracteres</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
