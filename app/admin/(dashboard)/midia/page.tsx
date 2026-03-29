import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Search, Folder } from 'lucide-react';
import { getMedia } from '@/app/actions/media';
import MediaLibraryClient from '@/components/admin/media/MediaLibraryClient';

export default async function MediaPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: media } = await getMedia();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Mídia</h1>
          <p className="text-sm text-gray-500">Gerencie imagens, documentos e outros arquivos</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar arquivos..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-laranja/20 focus:border-laranja transition-all"
            />
          </div>
          <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2 outline-none">
            <option value="">Todos os tipos</option>
            <option value="image">Imagens</option>
            <option value="document">Documentos</option>
            <option value="video">Vídeos</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <Folder size={16} /> Nova Pasta
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex-1 overflow-y-auto">
        {/* Breadcrumb de pastas mock */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button className="hover:text-laranja transition-colors">Início</button>
          <span>/</span>
          <button className="hover:text-laranja transition-colors">Uploads 2025</button>
          <span>/</span>
          <span className="text-gray-900 font-medium">Março</span>
        </div>

        <MediaLibraryClient media={media || []} />
      </div>
    </div>
  );
}
