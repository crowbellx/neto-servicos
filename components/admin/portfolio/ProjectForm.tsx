'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import TipTapEditor from '@/components/admin/editor/TipTapEditor';
import ImageUploadDropzone from '@/components/admin/ui/ImageUploadDropzone';
import { toast } from 'sonner';
import { createProject, updateProject } from '@/app/actions/portfolio';
import { ArrowLeft, Save, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const projectSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().max(160, 'Resumo deve ter até 160 caracteres'),
  content: z.string().min(10, 'O conteúdo detalhado é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  tags: z.string(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']),
  featured: z.boolean(),
  images: z.array(z.string()),
  seoTitle: z.string().max(60).optional().or(z.literal('')),
  seoDesc: z.string().max(160).optional().or(z.literal('')),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: any;
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  let defaultImages: string[] = [];
  try {
    if (initialData?.images && typeof initialData.images === 'string') {
      defaultImages = JSON.parse(initialData.images);
    } else if (Array.isArray(initialData?.images)) {
      defaultImages = initialData.images;
    }
  } catch (e) {}

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      content: initialData?.content || '',
      category: initialData?.category || 'Gráfica',
      tags: initialData?.tags || '',
      status: initialData?.status || 'DRAFT',
      featured: !!initialData?.featured,
      images: defaultImages,
      seoTitle: initialData?.seoTitle || '',
      seoDesc: initialData?.seoDesc || '',
    }
  });

  const { register, handleSubmit, control, watch, formState: { errors } } = form;

  const onSubmit = async (data: ProjectFormValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'images') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        });

        const res = initialData?.id ? await updateProject(initialData.id, formData) : await createProject(formData);

        if (res.success) {
          toast.success(initialData?.id ? 'Projeto atualizado com sucesso!' : 'Projeto criado com sucesso!');
          router.push('/admin/portfolio');
          router.refresh();
        } else {
          toast.error(res.error || 'Erro ao salvar o projeto.');
        }
      } catch (err) {
        toast.error('Erro inesperado ao salvar o projeto.');
        console.error('Project submit error:', err);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/portfolio" className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{initialData ? 'Editar Projeto' : 'Novo Projeto'}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => { form.setValue('status', 'DRAFT'); handleSubmit(onSubmit)(); }} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"><Save size={18} /> Rascunho</button>
          <button type="submit" disabled={isPending} className="px-4 py-2 bg-laranja text-white rounded-lg text-sm font-medium hover:bg-[#D4651A] transition-colors disabled:opacity-70" onClick={() => form.setValue('status', 'PUBLISHED')}><CheckCircle2 size={18} /> {isPending ? 'Salvando...' : 'Publicar'}</button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 items-start pb-10">
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-5">
            <input {...register('title')} placeholder="Título" className="w-full text-3xl font-bold text-gray-900 border-none focus:ring-0 p-0" />
            <textarea {...register('description')} placeholder="Resumo" className="w-full border border-gray-200 rounded-lg p-3 text-sm" />
            <Controller name="content" control={control} render={({ field }) => <TipTapEditor value={field.value} onChange={field.onChange} />} />
            <Controller name="images" control={control} render={({ field }) => (
              <ImageUploadDropzone 
                value={field.value} 
                onChange={(val) => field.onChange(Array.isArray(val) ? val : [val])} 
                multiple={true} 
                maxFiles={10}
                folder="portfolio" 
              />
            )} />
          </div>
        </div>
        <div className="w-80 flex-shrink-0 flex flex-col gap-6 sticky top-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <select {...register('category')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm mb-4">
              <option value="Gráfica">Gráfica</option>
              <option value="Design">Design</option>
              <option value="Digital">Digital</option>
            </select>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register('featured')} className="w-4 h-4 text-laranja border-gray-300 rounded" /><span className="text-sm font-medium text-gray-700">Destaque</span></label>
          </div>
        </div>
      </div>
    </form>
  );
}