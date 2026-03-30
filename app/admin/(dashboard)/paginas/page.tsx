import Link from 'next/link';
import { LayoutTemplate, Edit, Eye, Plus, Settings } from 'lucide-react';
import { getPages } from '@/app/actions/pages';
import DeletePageButton from '@/components/admin/ui/DeletePageButton';

export default async function PagesPage() {
  // A segurança já é tratada pelo layout.tsx e middleware.ts
  const { data: dbPages } = await getPages();
  
  const corePages = [
    { title: 'Início (Home)', slug: '/' },
    { title: 'Sobre Nós', slug: 'sobre' },
    { title: 'Serviços', slug: 'servicos' },
    { title: 'Portfólio', slug: 'portfolio' },
    { title: 'Blog', slug: 'blog' },
    { title: 'Contato', slug: 'contato' },
    { title: 'Privacidade', slug: 'privacidade' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Páginas</h1>
          <p className="text-sm text-gray-500">Configure o conteúdo e o SEO das páginas do site</p>
        </div>
        <Link 
          href="/admin/paginas/nova"
          className="bg-laranja text-white px-4 py-2 rounded-lg font-medium hover:bg-[#D4651A] transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Criar Nova Página
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">Nome da Página</th>
                <th scope="col" className="px-6 py-3 font-medium">URL / Slug</th>
                <th scope="col" className="px-6 py-3 font-medium">Status</th>
                <th scope="col" className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dbPages?.map((page) => (
                <tr key={page.id} className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-laranja/10 flex items-center justify-center text-laranja">
                        <LayoutTemplate size={16} />
                      </div>
                      <span className="font-bold text-gray-900">{page.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">/{page.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${page.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {page.status === 'PUBLISHED' ? 'ATIVO' : 'RASCUNHO'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/paginas/${page.id}`} className="p-2 text-gray-400 hover:text-laranja hover:bg-orange-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </Link>
                      <Link href={`/${page.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={16} />
                      </Link>
                      <DeletePageButton id={page.id} title={page.title} />
                    </div>
                  </td>
                </tr>
              ))}

              <tr className="bg-gray-50/50">
                <td colSpan={4} className="px-6 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Sugestões de páginas do sistema para configurar
                </td>
              </tr>
              {corePages.filter(cp => !dbPages?.some(p => p.slug === cp.slug)).map((cp, idx) => (
                <tr key={idx} className="bg-white opacity-60 hover:opacity-100 transition-opacity">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                        <Settings size={16} />
                      </div>
                      <span className="font-medium text-gray-600">{cp.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">/{cp.slug}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-gray-400">NÃO CONFIGURADO</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/paginas/nova?slug=${cp.slug}&title=${cp.title}`}
                      className="text-xs font-bold text-laranja hover:underline"
                    >
                      Configurar Página
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}