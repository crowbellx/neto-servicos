'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { createUser, updateUser } from '@/app/actions/users';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').optional().or(z.literal('')),
  role: z.enum(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  active: z.boolean(),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function UserForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      role: initialData?.role || 'EDITOR',
      active: initialData?.active ?? true,
    }
  });

  const onSubmit = async (data: UserFormValues) => {
    if (!initialData && !data.password) {
      toast.error('Senha é obrigatória para novos usuários');
      return;
    }

    setIsSaving(true);
    try {
      const res = initialData 
        ? await updateUser(initialData.id, data)
        : await createUser(data);

      if (res.success) {
        toast.success(initialData ? 'Usuário atualizado!' : 'Usuário criado!');
        router.push('/admin/configuracoes/usuarios');
        router.refresh();
      } else {
        toast.error(res.error || 'Erro ao salvar usuário');
      }
    } catch (err) {
      toast.error('Erro inesperado');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/configuracoes/usuarios" className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Editar Usuário' : 'Novo Usuário'}
          </h1>
        </div>
        <button type="submit" disabled={isSaving} className="bg-laranja text-white px-6 py-2 rounded-lg font-bold hover:bg-[#D4651A] transition-all flex items-center gap-2 disabled:opacity-70">
          <Save size={18} /> {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
            <input {...register('name')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-laranja focus:border-laranja outline-none" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
            <input {...register('email')} type="email" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-laranja focus:border-laranja outline-none" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Função (Role)</label>
            <select {...register('role')} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-laranja focus:border-laranja outline-none">
              <option value="VIEWER">Visualizador</option>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Administrador</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Senha {initialData && '(deixe em branco para manter)'}</label>
            <input {...register('password')} type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-laranja focus:border-laranja outline-none" />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input {...register('active')} type="checkbox" className="w-4 h-4 text-laranja border-gray-300 rounded focus:ring-laranja" />
            <label className="text-sm font-medium text-gray-700">Usuário Ativo</label>
          </div>
        </div>
      </div>
    </form>
  );
}