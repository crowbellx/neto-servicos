import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { User, Mail, Lock, Save, AlertCircle } from 'lucide-react';
import { getUserById, updateUser } from '@/app/actions/users';

export default async function PerfilPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/admin/login');
  }

  const { data: user } = await getUserById(session.user.id);

  if (!user) {
    return <div>Usuário não encontrado.</div>;
  }

  const updateAction = async (formData: FormData) => {
    'use server';
    const id = session.user?.id;
    if (!id) return;

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password && password !== confirmPassword) {
      // Small hack to "show" error if passwords don't match in a simple server action
      // In a real app we'd use useActionState
      return; 
    }

    await updateUser(id, { name, email, password: password || undefined });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-sm text-gray-500">Gerencie suas informações pessoais e segurança</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <form action={updateAction} className="max-w-2xl space-y-6 pb-10">
          
          {/* Informações Pessoais */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-laranja" />
              Informações Pessoais
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    name="name"
                    defaultValue={user.name || ""}
                    required
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block pl-10 p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    name="email"
                    defaultValue={user.email || ""}
                    required
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block pl-10 p-2.5 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Lock size={20} className="text-laranja" />
              Alterar Senha
            </h2>
            <p className="text-xs text-gray-500 mb-6 flex items-center gap-2">
              <AlertCircle size={14} /> Deixe em branco para manter a senha atual.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Nova Senha</label>
                <input 
                  type="password" 
                  name="password"
                  minLength={8}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Confirmar Nova Senha</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  minLength={8}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-laranja text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#D4651A] transition-colors flex items-center gap-2 shadow-sm">
              <Save size={18} /> Salvar Alterações
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
