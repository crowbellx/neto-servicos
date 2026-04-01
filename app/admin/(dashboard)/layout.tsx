import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminTopbar from '@/components/admin/layout/AdminTopbar';
import { prisma } from '@/lib/prisma';
import { Toaster } from 'sonner';

// Importante para garantir que a sessão seja verificada em tempo real em cada navegação
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Verificação de segurança redundante ao Middleware
  if (!session?.user) {
    redirect('/admin/login');
  }

  const sessionUser = session.user as { id?: string; role?: string; name?: string | null; email?: string | null };
  const userId = sessionUser.id || '';
  const userRole = sessionUser.role || 'VIEWER';

  const [unreadLeadCount, unreadNotificationCount, latestNotifications] = await Promise.all([
    prisma.lead.count({ where: { status: 'NEW', deletedAt: null } }).catch(() => 0),
    prisma.notification
      .count({ where: { userId, read: false } })
      .catch(() => 0),
    prisma.notification
      .findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      })
      .catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        userRole={userRole}
        unreadLeadCount={unreadLeadCount}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar
          user={session.user}
          unreadNotificationCount={unreadNotificationCount}
          notifications={latestNotifications.map((notification) => ({
            id: notification.id,
            title: notification.title,
            when: new Date(notification.createdAt).toLocaleString('pt-BR', {
              dateStyle: 'short',
              timeStyle: 'short',
            }),
            href: notification.link || '/admin/notificacoes',
            tone: notification.type === 'ERROR' ? 'danger' : 'default',
          }))}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}