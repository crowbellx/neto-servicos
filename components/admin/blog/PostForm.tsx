'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import TipTapEditor from '@/components/admin/editor/TipTapEditor';
import ImageUploadDropzone from '@/components/admin/ui/ImageUploadDropzone';
import { toast } from 'sonner';
import { createPost, updatePost } from '@/app/actions/blog';
import { ArrowLeft, Save, Eye, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const postSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  excerpt: z.string().max(300, 'Resumo deve ter até 300 caracteres'),
  content: z.string().min(10, 'Conteúdo é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  tags: z.string(), // comma separated
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']),
  coverImage: z.string().optional(),
  seoTitle: z.string().max(60, 'Recomendado até 60 caracteres').optional(),
  seoDesc: z.string().max(160, 'Recomendado até 160 caracteres').optional(),
  focusKw: z.string().optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;

interface PostFormProps {
  initialData?: any;
}

export default function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      category: initialData?.category || 'Geral',
      tags: initialData?.tags || '',
      status: initialData?.status || 'DRAFT',
      coverImage: initialData?.coverImage || '',
      seoTitle: initialData?.seoTitle || '',
      seoDesc: initialData?.seoDesc || '',
      focusKw: initialData?.focusKw || '',
    }
  });

  const { register, handleSubmit, control, watch, formState: { errors } } = form;

  const onSubmit = async (data: PostFormValues) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      let res;
      if (initialData?.id) {
        res = await updatePost(initialData.id, formData);
      } else {
        res = await createPost(formData);
      }

      if (res.success) {
        toast.success(initialData?.id ? 'Post atualizado!' : 'Post criado com sucesso!');
        router.push('/admin/blog');
        router.refresh();
      } else {
        toast.error(res.error || 'Erro ao salvar o post.');
      }
    } catch (err) {
      toast.error('Ocorreu um erro inesperado.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Editar Post' : 'Novo Post'}
            </h1>
            <p className="text-sm text-gray-500">
              {initialData ? 'Modifique os dados do artigo' : 'Crie um novo artigo para o blog'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => form.setValue('status', 'DRAFT')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Save size={18} />
            Salvar Rascunho
          </button>
          
          <button 
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100"
          >
             <Eye size={18} />
             Pré-visualizar
          </button>
          
          <button 
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-laranja text-white rounded-lg text-sm font-medium hover:bg-[#D4651A] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={() => form.setValue('status', 'PUBLISHED')}
          >
            <CheckCircle2 size={18} />
            {isSaving ? 'Publicando...' : 'Publicar Agora'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start flex-1 pb-10">
        {/* COLUNA ESQUERDA - CONTEÚDO (2/3) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-5">
            <div>
              <input 
                {...register('title')}
                type="text" 
                placeholder="Título principal do Post"
                className="w-full text-3xl font-bold text-gray-900 border-none focus:ring-0 p-0 placeholder-gray-300 bg-transparent"
              />
              {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
            </div>
            
            <div className="border-t border-gray-100 pt-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resumo (Excerpt) <span className="text-red-500">*</span>
              </label>
              <textarea 
                {...register('excerpt')}
                placeholder="Um breve resumo que aparecerá nos cards do blog e na busca do Google..."
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja resize-none h-24"
              />
              <div className="flex justify-between mt-1">
                {errors.excerpt ? (
                  <span className="text-red-500 text-xs">{errors.excerpt.message}</span>
                ) : <span /> }
                <span className="text-xs text-gray-400">{watch('excerpt')?.length || 0}/300</span>
              </div>
            </div>

            <div className="flex flex-col min-h-[500px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conteúdo do Post <span className="text-red-500">*</span>
              </label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TipTapEditor 
                    value={field.value} 
                    onChange={field.onChange} 
                    placeholder="<p>Comece a escrever seu post incrível aqui...</p>" 
                  />
                )}
              />
              {errors.content && <span className="text-red-500 text-sm mt-1">{errors.content.message}</span>}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA - CONFIGURAÇÕES (1/3) */}
        <div className="xl:col-span-1 flex flex-col gap-6 sticky top-6">
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Configurações Base</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status de Publicação</label>
                <select 
                  {...register('status')}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja"
                >
                  <option value="DRAFT">Rascunho</option>
                  <option value="PUBLISHED">Publicado</option>
                  <option value="SCHEDULED">Agendado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <input 
                  {...register('category')}
                  placeholder="Ex: Gráfica, Dicas Digitais..."
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separadas por vírgula)</label>
                <input 
                  {...register('tags')}
                  placeholder="marketing, seo, site"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Mídia</h3>
            
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Capa</label>
               <Controller
                 name="coverImage"
                 control={control}
                 render={({ field }) => (
                   <ImageUploadDropzone 
                     value={field.value} 
                     onChange={(val) => field.onChange(val as string)} 
                     multiple={false}
                     folder="blog"
                   />
                 )}
               />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">SEO</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input 
                  {...register('seoTitle')}
                  placeholder="Título para o Google"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja"
                />
                <span className="text-xs text-gray-400 mt-1 block">{watch('seoTitle')?.length || 0}/60 chars</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea 
                  {...register('seoDesc')}
                  placeholder="Descrição amigável para SEO e Redes Sociais..."
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja h-20 resize-none"
                />
                <span className="text-xs text-gray-400 mt-1 block">{watch('seoDesc')?.length || 0}/160 chars</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Palavra-chave foco</label>
                <input 
                  {...register('focusKw')}
                  placeholder="Ex: agência de marketing"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
