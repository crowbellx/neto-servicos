import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Search, Filter, Plus, Edit } from 'lucide-react';
import { getProjects } from '@/app/actions/portfolio';
import DeleteProjectButton from '@/components/admin/ui/DeleteProjectButton';

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

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar projetos..." 
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="aspect-video bg-gray-100 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <Briefcase size={32} />
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded text-[10px] font-bold text-white shadow-sm ${
                  project.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-gray-500'
                }`}>
                  {project.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                </span>
              </div>
            </div>
            <div className="p-5">
              <span className="text-[10px] font-bold text-laranja uppercase tracking-widest">{project.category}</span>
              <h3 className="font-bold text-gray-900 text-lg mb-4 line-clamp-1">{project.title}</h3>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <Link
                  href={`/admin/portfolio/${project.id}/editar`}
                  className="p-1.5 text-gray-400 hover:text-laranja hover:bg-orange-50 rounded-md transition-colors"
                >
                  <Edit size={16} />
                </Link>
                <DeleteProjectButton id={project.id} title={project.title} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}