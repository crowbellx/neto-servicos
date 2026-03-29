import Link from 'next/link';
import { FileText, Eye } from 'lucide-react';

type RecentPost = {
  id: string;
  title: string;
  status: string;
  date: string;
  views: number;
};

export default function RecentPosts({ posts }: { posts: RecentPost[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Posts Recentes</h2>
        <Link href="/admin/blog" className="text-sm text-laranja hover:underline font-medium">
          Gerenciar blog &rarr;
        </Link>
      </div>
      
      <div className="p-0">
        <ul className="divide-y divide-gray-100">
          {posts.map((post) => (
            <li key={post.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate" title={post.title}>
                  {post.title}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    post.status === 'Publicado' ? 'bg-green-100 text-green-700' :
                    post.status === 'Rascunho' ? 'bg-gray-100 text-gray-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {post.status}
                  </span>
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {post.views}
                  </span>
                </div>
              </div>
            </li>
          ))}
          {posts.length === 0 && (
            <li className="p-6 text-sm text-gray-500">Nenhum post recente encontrado.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
