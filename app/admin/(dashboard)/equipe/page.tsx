import { getUsers } from '@/app/actions/users';
import { Users, Mail, Shield, Edit } from 'lucide-react';
import Link from 'next/link';

export default async function EquipePage() {
  const { data: users } = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipe Interna</h1>
          <p className="text-sm text-gray-500">Membros com acesso ao painel administrativo</p>
        </div>
        <Link href="/admin/configuracoes/usuarios/novo" className="bg-laranja text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <Plus size={18} /> Convidar Membro
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {users?.map((member) => (
          <div key={member.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group">
            <div className="h-24 bg-g-marca opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="px-6 pb-6 -mt-12 text-center">
              <div className="w-20 h-20 rounded-full bg-white p-1 mx-auto mb-4 shadow-md">
                <div className="w-full h-full rounded-full bg-laranja/10 flex items-center justify-center text-laranja font-bold text-2xl">
                  {member.name?.charAt(0)}
                </div>
              </div>
              <h3 className="font-bold text-gray-900">{member.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{member.role}</p>
              
              <div className="space-y-2 text-left border-t border-gray-50 pt-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Mail size={14} className="text-gray-400" /> {member.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Shield size={14} className="text-gray-400" /> {member.active ? 'Acesso Ativo' : 'Acesso Suspenso'}
                </div>
              </div>

              <Link href={`/admin/configuracoes/usuarios/${member.id}`} className="mt-6 w-full py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                <Edit size={14} /> Editar Perfil
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}