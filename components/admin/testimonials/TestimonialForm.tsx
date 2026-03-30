'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { createTestimonial } from '@/app/actions/testimonials';
import { ArrowLeft, Save, Star } from 'lucide-react';
import Link from 'next/link';

const schema = z.object({
  name: z.string().min(3, 'Nome é obrigatório'),
  role: z.string().min(2, 'Cargo é obrigatório'),
  company: z.string().min(2, 'Empresa é obrigatória'),
  service: z.string().min(2, 'Serviço é obrigatório'),
  rating: z.number().min(1).max(5),
  text: z.string().min(10, 'O texto deve ser mais longo'),
  active: z.boolean(),
});

export default function TestimonialForm() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: 5,
      active: true,
      service: 'Design'
    }
  });

  const rating = watch('rating');

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    const res = await createTestimonial({ ...data, order: 0 });
    setIsSaving(false);
    if (res.success) {
      toast.success('Depoimento salvo!');
      router.push('/admin/depoimentos');
      router.refresh();
    } else {
      toast.error('Erro ao salvar');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/depoimentos" className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Novo Depoimento</h1>
        </div>
        <button type="submit" disabled={isSaving} className="bg-laranja text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
          <Save size={18} /> {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Cliente</label>
            <input {...register('name')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Cargo</label>
            <input {...register('role')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="Ex: CEO, Diretor" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Empresa</label>
            <input {...register('company')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Serviço Prestado</label>
            <select {...register('service')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm">
              <option value="Design">Design</option>
              <option value="Digital">Digital</option>
              <option value="Gráfica">Gráfica</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Avaliação</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button key={num} type="button" onClick={() => setValue('rating', num)} className="focus:outline-none">
                <Star size={24} className={num <= rating ? 'fill-ambar text-ambar' : 'text-gray-300'} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Texto do Depoimento</label>
          <textarea {...register('text')} rows={4} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm resize-none" />
        </div>
      </div>
    </form>
  );
}