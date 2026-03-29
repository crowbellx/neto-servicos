import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Search, Filter, MoreHorizontal, Plus } from 'lucide-react';
import { getProjects } from '@/app/actions/portfolio';

export default async function PortfolioPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: projects } = await getProjects();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfólio</h1>
          <p className="text-sm text-gray-500">Gerencie os projetos exibidos no site</p>
        </div>
        <Link 
          href="/admin/portfolio/novo"
          className="bg-laranja text-white px-4 py-2 rounded-lg font-medium hover:bg-[#D4651A] transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Novo Projeto
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar projetos..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-laranja/20 focus:border-laranja transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <Filter size={16} /> Filtros
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-100 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <Briefcase size={32} />
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <span className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${
                  project.status === 'PUBLISHED' ? 'bg-green-500 text-white' :
                  project.status === 'DRAFT' ? 'bg-gray-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {project.status === 'PUBLISHED' ? 'Publicado' : project.status === 'DRAFT' ? 'Rascunho' : project.status}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                  project.category === 'Design' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  project.category === 'Digital' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  project.category === 'Gráfica' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                  'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                  {project.category}
                </span>
                <span className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-4 line-clamp-2" title={project.title}>
                {project.title}
              </h3>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button className="text-sm font-medium text-gray-600 hover:text-laranja transition-colors">Editar</button>
                <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {(!projects || projects.length === 0) && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nenhum projeto encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
