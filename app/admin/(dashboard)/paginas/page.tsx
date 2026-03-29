import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutTemplate, Search, Filter, Edit, Eye, Plus } from 'lucide-react';
import { getPages } from '@/app/actions/pages';
import DeletePageButton from '@/components/admin/ui/DeletePageButton';

export default async function PagesPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: pages } = await getPages();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Páginas</h1>
          <p className="text-sm text-gray-500">Gerencie o conteúdo das páginas estáticas do site</p>
        </div>
        <Link 
          href="/admin/paginas/nova"
          className="bg-laranja text-white px-4 py-2 rounded-lg font-medium hover:bg-[#D4651A] transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Nova Página
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar páginas..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-laranja/20 focus:border-laranja transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <Filter size={16} /> Filtros
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">Título da Página</th>
                <th scope="col" className="px-6 py-3 font-medium">Slug (URL)</th>
                <th scope="col" className="px-6 py-3 font-medium">Status</th>
                <th scope="col" className="px-6 py-3 font-medium">Última Atualização</th>
                <th scope="col" className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pages?.map((page) => (
                <tr key={page.id} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                        <LayoutTemplate size={20} />
                      </div>
                      <div className="font-medium text-gray-900">
                        {page.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">
                    {page.slug}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      page.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {page.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(page.updatedAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/paginas/${page.id}`} className="p-1.5 text-gray-400 hover:text-laranja hover:bg-orange-50 rounded-md transition-colors" title="Editar">
                        <Edit size={16} />
                      </Link>
                      <Link
                        href={page.slug.startsWith('/') ? page.slug : `/${page.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Ver no site"
                      >
                        <Eye size={16} />
                      </Link>
                      <DeletePageButton id={page.id} title={page.title} />
                    </div>
                  </td>
                </tr>
              ))}
              {(!pages || pages.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma página encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
