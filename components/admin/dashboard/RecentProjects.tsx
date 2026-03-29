import Link from 'next/link';
import { Briefcase } from 'lucide-react';

type RecentProject = {
  id: string;
  title: string;
  category: string;
  date: string;
};

export default function RecentProjects({ projects }: { projects: RecentProject[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Projetos Recentes</h2>
        <Link href="/admin/portfolio" className="text-sm text-laranja hover:underline font-medium">
          Gerenciar portfólio &rarr;
        </Link>
      </div>
      
      <div className="p-0">
        <ul className="divide-y divide-gray-100">
          {projects.map((project) => (
            <li key={project.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                <Briefcase size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate" title={project.title}>
                  {project.title}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className={`px-2 py-0.5 rounded border border-gray-200 font-medium ${
                    project.category === 'Design' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    project.category === 'Digital' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-orange-50 text-orange-700 border-orange-200'
                  }`}>
                    {project.category}
                  </span>
                  <span>{project.date}</span>
                </div>
              </div>
            </li>
          ))}
          {projects.length === 0 && (
            <li className="p-6 text-sm text-gray-500">Nenhum projeto recente encontrado.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
