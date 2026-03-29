import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FileText, Search, Filter, MoreHorizontal, Plus } from 'lucide-react';
import { getPosts } from '@/app/actions/blog';

export default async function BlogPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: posts } = await getPosts();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-sm text-gray-500">Gerencie os artigos do site</p>
        </div>
        <Link 
          href="/admin/blog/novo"
          className="bg-laranja text-white px-4 py-2 rounded-lg font-medium hover:bg-[#D4651A] transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Novo Post
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar posts..." 
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
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-laranja bg-gray-100 border-gray-300 rounded focus:ring-laranja" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 font-medium">Título</th>
                <th scope="col" className="px-6 py-3 font-medium">Autor</th>
                <th scope="col" className="px-6 py-3 font-medium">Categoria</th>
                <th scope="col" className="px-6 py-3 font-medium">Status</th>
                <th scope="col" className="px-6 py-3 font-medium">Data</th>
                <th scope="col" className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts?.map((post) => (
                <tr key={post.id} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 w-4">
                    <div className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-laranja bg-gray-100 border-gray-300 rounded focus:ring-laranja" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="font-medium text-gray-900 line-clamp-2 max-w-md" title={post.title}>
                        {post.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {post.author?.name || 'Desconhecido'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-200">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      post.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                      post.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {post.status === 'PUBLISHED' ? 'Publicado' : post.status === 'DRAFT' ? 'Rascunho' : post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors" title="Mais ações">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {(!posts || posts.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Nenhum post encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>Mostrando {posts?.length || 0} posts</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}
