import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { FileSignature, Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { getQuotes } from '@/app/actions/quotes';

export default async function OrcamentosPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { success, data: quotes } = await getQuotes();
  const list = success && quotes ? quotes : [];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileSignature className="text-laranja" /> Orçamentos
          </h1>
          <p className="text-sm text-gray-500">Crie e gerencie propostas comerciais</p>
        </div>
        <Link href="/admin/orcamentos/novo" className="flex items-center gap-2 bg-laranja text-white px-4 py-2 rounded-lg font-medium hover:bg-[#D4651A] transition-colors shadow-sm">
          <Plus size={18} /> Novo Orçamento
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar orçamentos..." 
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-laranja/20 focus:border-laranja transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
          <Filter size={16} /> Status
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        {list.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="font-semibold p-4">Número</th>
                  <th className="font-semibold p-4">Cliente</th>
                  <th className="font-semibold p-4">Serviço/Produto</th>
                  <th className="font-semibold p-4">Valor</th>
                  <th className="font-semibold p-4">Status</th>
                  <th className="font-semibold p-4 text-right">Cadastrado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {list.map((quote: any) => (
                  <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 whitespace-nowrap font-medium text-gray-900">
                      <Link href={`/admin/orcamentos/${quote.id}`} className="hover:text-laranja hover:underline">
                        {quote.number}
                      </Link>
                    </td>
                    <td className="p-4">{quote.clientName || quote.client?.name || '-'}</td>
                    <td className="p-4">{quote.service}</td>
                    <td className="p-4 font-medium text-gray-900">{formatCurrency(quote.value || 0)}</td>
                    <td className="p-4">
                      {quote.status === 'PENDING' && <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded font-medium">Rascunho</span>}
                      {quote.status === 'SENT' && <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded font-medium">Enviado</span>}
                      {quote.status === 'APPROVED' && <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded font-medium">Aprovado</span>}
                      {quote.status === 'REJECTED' && <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded font-medium">Rejeitado</span>}
                    </td>
                    <td className="p-4 text-right text-gray-500">
                      {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-8 m-auto max-w-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileSignature size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sem propostas ativas</h3>
            <p className="text-gray-500 text-sm mb-6">Os orçamentos enviados a partir dos seus leads aparecerão aqui.</p>
            <Link href="/admin/orcamentos/novo" className="text-laranja font-medium text-sm hover:underline">
              Criar o primeiro orçamento
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
