'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import TipTapEditor from '@/components/admin/editor/TipTapEditor';
import ImageUploadDropzone from '@/components/admin/ui/ImageUploadDropzone';
import { toast } from 'sonner';
import { createProject, updateProject } from '@/app/actions/portfolio';
import { ArrowLeft, Save, Eye, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const projectSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().max(160, 'Resumo deve ter até 160 caracteres'),
  content: z.string().min(10, 'O conteúdo detalhado é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  tags: z.string(), // comma separated
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']),
  featured: z.boolean().default(false),
  images: z.array(z.string()).default([]), // Base64 or URLs array
  seoTitle: z.string().max(60).optional(),
  seoDesc: z.string().max(160).optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: any;
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  
  // Parse images from JSON string if coming from DB
  let defaultImages: string[] = [];
  try {
    if (initialData?.images && typeof initialData.images === 'string') {
      defaultImages = JSON.parse(initialData.images);
    } else if (Array.isArray(initialData?.images)) {
      defaultImages = initialData.images;
    }
  } catch (e) {
     console.error("Failed to parse initial images array");
  }

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      content: initialData?.content || '',
      category: initialData?.category || 'Gráfica',
      tags: initialData?.tags || '',
      status: initialData?.status || 'DRAFT',
      featured: initialData?.featured || false,
      images: defaultImages,
      seoTitle: initialData?.seoTitle || '',
      seoDesc: initialData?.seoDesc ||'',
    }
  });

  const { register, handleSubmit, control, watch, formState: { errors } } = form;

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images') {
           formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      let res;
      if (initialData?.id) {
        res = await updateProject(initialData.id, formData);
      } else {
        res = await createProject(formData);
      }

      if (res.success) {
        toast.success(initialData?.id ? 'Projeto atualizado!' : 'Projeto criado com sucesso!');
        router.push('/admin/portfolio');
        router.refresh();
      } else {
        toast.error(res.error || 'Erro ao salvar o projeto.');
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
          <Link href="/admin/portfolio" className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Editar Projeto' : 'Novo Projeto'}
            </h1>
            <p className="text-sm text-gray-500">
              {initialData ? 'Modifique os detalhes do seu case' : 'Adicione um novo case de sucesso ao portfólio'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => {
               form.setValue('status', 'DRAFT');
               handleSubmit(onSubmit)();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex-shrink-0"
          >
            <Save size={18} />
            Rascunho
          </button>
          
          <button 
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-laranja text-white rounded-lg text-sm font-medium hover:bg-[#D4651A] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex-shrink-0"
            onClick={() => form.setValue('status', 'PUBLISHED')}
          >
            <CheckCircle2 size={18} />
            {isSaving ? 'Salvando...' : 'Publicar Agora'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 items-start pb-10">
        {/* COLUNA ESQUERDA - CONTEÚDO */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-5">
            <div>
              <input 
                {...register('title')}
                type="text" 
                placeholder="Ex Vulcan - Identidade Visual"
                className="w-full text-3xl font-bold text-gray-900 border-none focus:ring-0 p-0 placeholder-gray-300 bg-transparent"
              />
              {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
            </div>
            
            <div className="border-t border-gray-100 pt-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição Curta (Cards) <span className="text-red-500">*</span>
              </label>
              <textarea 
                {...register('description')}
                placeholder="Aparece no hover do grid do portfólio..."
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja resize-none h-20"
              />
              <div className="flex justify-between mt-1">
                {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
                <span className="text-xs text-gray-400">{watch('description')?.length || 0}/160</span>
              </div>
            </div>

            <div className="flex flex-col min-h-[400px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sobre o Projeto (Case Completo) <span className="text-red-500">*</span>
              </label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TipTapEditor 
                    value={field.value} 
                    onChange={field.onChange} 
                    placeholder="<p>Descreva o desafio, processo criativo e conclusão do projeto...</p>" 
                  />
                )}
              />
              {errors.content && <span className="text-red-500 text-sm mt-1">{errors.content.message}</span>}
            </div>
            
            <div className="border-t border-gray-100 pt-5">
               <h3 className="font-bold text-gray-900 mb-4">Galeria de Imagens</h3>
               <p className="text-xs text-gray-500 mb-4">A primeira imagem será usada como capa e thumbnail do grid.</p>
               <Controller
                 name="images"
                 control={control}
                 render={({ field }) => (
                   <ImageUploadDropzone 
                     value={field.value} 
                     onChange={(val) => field.onChange(Array.isArray(val) ? val : [val])} 
                     multiple={true}
                     maxFiles={10}
                     folder="portfolio"
                   />
                 )}
               />
               {errors.images && <span className="text-red-500 text-sm">{errors.images.message}</span>}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA - CONFIGURAÇÕES */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-6 sticky top-6">
          
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria Principal</label>
                <select 
                  {...register('category')}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja"
                >
                  <option value="Gráfica">Gráfica</option>
                  <option value="Design">Design</option>
                  <option value="Digital">Digital</option>
                  <option value="Múltiplos">Múltiplos</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input 
                    type="checkbox"
                    {...register('featured')}
                    className="w-4 h-4 text-laranja border-gray-300 rounded focus:ring-laranja"
                  />
                  <span className="text-sm font-medium text-gray-700">Projeto Destaque (Home)</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">Tecnologias/Tags</label>
                <input 
                  {...register('tags')}
                  placeholder="React, Figma, Next.js..."
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">SEO e Links</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input 
                  {...register('seoTitle')}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Descrição</label>
                <textarea 
                  {...register('seoDesc')}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-laranja/20 focus:border-laranja h-20 resize-none"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
