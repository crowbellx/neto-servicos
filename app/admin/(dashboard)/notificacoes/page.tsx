import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, Trash2 } from 'lucide-react';

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const sessionUser = session.user as { id?: string };
  const userId = sessionUser.id || '';

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
          <p className="text-sm text-gray-500">Acompanhe alertas e atualizações do sistema.</p>
        </div>
        <button className="text-sm font-medium text-laranja hover:underline flex items-center gap-2">
          <CheckCircle2 size={16} /> Marcar todas como lidas
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-500 font-medium">Nenhuma notificação por enquanto.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <div key={n.id} className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}>
                <div className="mt-1">
                  <NotificationIcon type={n.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm font-bold truncate ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {n.title}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(n.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                  {n.link && (
                    <a href={n.link} className="text-xs font-bold text-laranja hover:underline mt-2 inline-block">
                      Ver detalhes &rarr;
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                   {!n.read && (
                     <button className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="Marcar como lida">
                       <CheckCircle2 size={18} />
                     </button>
                   )}
                   <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Excluir">
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case 'SUCCESS':
      return <CheckCircle2 className="text-green-500" size={20} />;
    case 'WARNING':
      return <AlertTriangle className="text-amber-500" size={20} />;
    case 'ERROR':
      return <XCircle className="text-red-500" size={20} />;
    default:
      return <Info className="text-blue-500" size={20} />;
  }
}
