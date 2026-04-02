import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Users, Search, Filter, Building2, Phone, Mail, Link2 } from 'lucide-react';
import { getClients } from '@/app/actions/clients';
import ClientsHeader from './ClientsHeader';
import ClientActions from '@/components/admin/clients/ClientActions';

export default async function ClientesPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const { success, data: clients } = await getClients();
  const list = success && clients ? clients : [];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-laranja" /> Clientes
          </h1>
          <p className="text-sm text-gray-500">
            {list.length} cliente{list.length !== 1 ? 's' : ''} cadastrado{list.length !== 1 ? 's' : ''}
          </p>
        </div>
        <ClientsHeader />
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Buscar por nome, empresa ou e-mail..." 
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-laranja/20 focus:border-laranja transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
          <Filter size={16} /> Filtros
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        {list.length > 0 ? (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="font-semibold p-4">Cliente</th>
                  <th className="font-semibold p-4">Contato</th>
                  <th className="font-semibold p-4">Empresa</th>
                  <th className="font-semibold p-4">Origem</th>
                  <th className="font-semibold p-4">Status</th>
                  <th className="font-semibold p-4">Cadastro</th>
                  <th className="font-semibold p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {list.map((client: any) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-laranja/10 flex items-center justify-center text-laranja font-bold text-sm flex-shrink-0">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{client.name}</p>
                          {client.document && <p className="text-xs text-gray-400">{client.document}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        {client.email && (
                          <p className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail size={11} /> {client.email}
                          </p>
                        )}
                        {client.phone && (
                          <p className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone size={11} /> {client.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {client.company ? (
                        <div className="flex items-center gap-1 text-gray-700 text-sm">
                          <Building2 size={14} className="text-gray-400" /> {client.company}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      {client.leadId ? (
                        <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium w-fit">
                          <Link2 size={10} /> Lead Fechado
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium w-fit">
                          Manual
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {client.status === 'ACTIVE' ? (
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-medium">Ativo</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-0.5 rounded-full font-medium">Inativo</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-500 text-xs">
                      {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <ClientActions client={client} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8 max-w-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum cliente cadastrado</h3>
              <p className="text-gray-500 text-sm mb-6">
                Clientes aparecem aqui automaticamente quando você fecha um Lead, ou você pode adicioná-los manualmente.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
