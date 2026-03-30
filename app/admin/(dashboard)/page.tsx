import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { 
  Users,
  Mail, 
  Briefcase, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight,
  AlertCircle
} from 'lucide-react';
import DashboardCharts from '@/components/admin/dashboard/DashboardCharts';
import RecentLeads from '@/components/admin/dashboard/RecentLeads';
import RecentPosts from '@/components/admin/dashboard/RecentPosts';
import RecentProjects from '@/components/admin/dashboard/RecentProjects';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  // Reduzi a simultaneidade extrema para evitar fadiga do pooler de conexões
  const [counts, recentData, trendData] = await Promise.all([
    // Agrupando contagens simples
    Promise.all([
      prisma.lead.count({ where: { createdAt: { gte: todayStart }, deletedAt: null } }),
      prisma.lead.count({ where: { createdAt: { gte: yesterdayStart, lt: todayStart }, deletedAt: null } }),
      prisma.lead.count({ where: { deletedAt: null } }),
      prisma.project.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
      prisma.post.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
      prisma.lead.count({
        where: {
          status: { in: ['NEW', 'CONTACTED'] },
          createdAt: { lt: fortyEightHoursAgo },
          deletedAt: null,
        },
      }),
    ]),
    // Buscando listagens recentes
    Promise.all([
      prisma.lead.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.post.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, status: true, publishedAt: true, createdAt: true, views: true },
      }),
      prisma.project.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { id: true, title: true, category: true, publishedAt: true, createdAt: true },
      }),
    ]),
    // Dados do gráfico
    Promise.all([
      prisma.lead.findMany({
        where: { createdAt: { gte: sevenDaysAgo }, deletedAt: null },
        select: { createdAt: true },
      }),
      prisma.project.findMany({
        where: { createdAt: { gte: sevenDaysAgo }, deletedAt: null, status: 'PUBLISHED' },
        select: { createdAt: true },
      }),
      prisma.post.findMany({
        where: { createdAt: { gte: sevenDaysAgo }, deletedAt: null, status: 'PUBLISHED' },
        select: { createdAt: true },
      }),
    ])
  ]);

  const [leadsToday, leadsYesterday, totalLeads, publishedProjects, publishedPosts, staleLeads] = counts;
  const [recentLeadsRaw, recentPostsRaw, recentProjectsRaw] = recentData;
  const [last7DaysLeads, last7DaysProjects, last7DaysPosts] = trendData;

  const statusMap: Record<string, { label: string; color: string }> = {
    NEW: { label: 'Novo', color: 'bg-laranja animate-pulse' },
    CONTACTED: { label: 'Em contato', color: 'bg-blue-500' },
    QUOTED: { label: 'Orçamento enviado', color: 'bg-purple-500' },
    CLOSED: { label: 'Fechado', color: 'bg-green-500' },
    LOST: { label: 'Sem interesse', color: 'bg-gray-400' },
  };

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + index);
    return date;
  });
  const dayKey = (date: Date) => date.toISOString().slice(0, 10);

  const leadsByDay = new Map<string, number>();
  for (const item of last7DaysLeads) {
    const key = dayKey(item.createdAt);
    leadsByDay.set(key, (leadsByDay.get(key) || 0) + 1);
  }
  const publishedByDay = new Map<string, number>();
  for (const item of [...last7DaysProjects, ...last7DaysPosts]) {
    const key = dayKey(item.createdAt);
    publishedByDay.set(key, (publishedByDay.get(key) || 0) + 1);
  }

  const chartData = days.map((date) => {
    const key = dayKey(date);
    return {
      name: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      leads: leadsByDay.get(key) || 0,
      publicados: publishedByDay.get(key) || 0,
    };
  });

  const leadTrend = leadsYesterday === 0 ? (leadsToday > 0 ? 100 : 0) : ((leadsToday - leadsYesterday) / leadsYesterday) * 100;
  const leadTrendLabel = `${leadTrend >= 0 ? '+' : ''}${leadTrend.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Bem-vindo, {session.user?.name}</p>
      </div>

      {staleLeads > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start gap-3">
          <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-sm font-bold text-amber-800">Leads sem resposta há mais de 48h</h3>
            <p className="text-sm text-amber-700 mt-1">{staleLeads} lead(s) precisam de acompanhamento no CRM.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Leads hoje" value={String(leadsToday)} trend={leadTrendLabel} trendUp={leadTrend >= 0} icon={Mail} color="bg-laranja" />
        <MetricCard title="Leads totais" value={String(totalLeads)} trend={`${leadsToday} hoje`} trendUp={true} icon={Users} color="bg-blue-500" />
        <MetricCard title="Projetos publicados" value={String(publishedProjects)} trend="conteúdo ativo" trendUp={true} icon={Briefcase} color="bg-purple-500" />
        <MetricCard title="Posts publicados" value={String(publishedPosts)} trend="conteúdo ativo" trendUp={true} icon={FileText} color="bg-green-500" />
      </div>

      <DashboardCharts data={chartData} totalLeads={last7DaysLeads.length} totalPublicados={last7DaysProjects.length + last7DaysPosts.length} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentLeads
            leads={recentLeadsRaw.map((lead) => ({
              id: lead.id,
              name: lead.name,
              company: lead.company,
              service: lead.service,
              preferredContact: lead.preferredContact,
              statusLabel: statusMap[lead.status]?.label || lead.status,
              statusColor: statusMap[lead.status]?.color || 'bg-gray-400',
              receivedAt: lead.createdAt.toLocaleDateString('pt-BR'),
            }))}
          />
        </div>
        <div className="space-y-6">
          <RecentPosts
            posts={recentPostsRaw.map((post) => ({
              id: post.id,
              title: post.title,
              status: post.status === 'PUBLISHED' ? 'Publicado' : post.status === 'SCHEDULED' ? 'Agendado' : post.status === 'ARCHIVED' ? 'Arquivado' : 'Rascunho',
              date: (post.publishedAt || post.createdAt).toLocaleDateString('pt-BR'),
              views: post.views,
            }))}
          />
          <RecentProjects
            projects={recentProjectsRaw.map((project) => ({
              id: project.id,
              title: project.title,
              category: project.category,
              date: (project.publishedAt || project.createdAt).toLocaleDateString('pt-BR'),
            }))}
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, trendUp, icon: Icon, color }: { title: string; value: string; trend: string; trendUp: boolean; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-white shadow-sm`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {trend}
        </div>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
    </div>
  );
}