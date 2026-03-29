import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Users, Plus, Search, Filter } from 'lucide-react';

export default async function ClientesPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-laranja" /> Clientes
          </h1>
          <p className="text-sm text-gray-500">Gerencie sua carteira de clientes</p>
        </div>
        <button className="flex items-center gap-2 bg-laranja text-white px-4 py-2 rounded-lg font-medium hover:bg-[#D4651A] transition-colors shadow-sm">
          <Plus size={18} /> Novo Cliente
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nome, empresa ou CNPJ..." 
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-laranja/20 focus:border-laranja transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
          <Filter size={16} /> Filtros
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
        <div className="text-center p-8 max-w-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum cliente cadastrado</h3>
          <p className="text-gray-500 text-sm mb-6">Comece adicionando clientes a partir dos leads fechados ou cadastre-os manualmente.</p>
          <button className="text-laranja font-medium text-sm hover:underline">
            Adicionar primeiro cliente
          </button>
        </div>
      </div>
    </div>
  );
}
