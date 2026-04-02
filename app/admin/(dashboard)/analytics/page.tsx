import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { 
  TrendingUp, 
  Users, 
  MousePointer2, 
  BarChart3,
  Calendar,
  Filter
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import DashboardCharts from '@/components/admin/dashboard/DashboardChartsWrapper';
import { unstable_cache } from 'next/cache';

// Cache global stats for 5 minutes
const getGlobalStats = unstable_cache(
  async () => {
    const [leads, posts, projects] = await Promise.all([
      prisma.lead.count({ where: { deletedAt: null } }),
      prisma.post.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
      prisma.project.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
    ]);
    return { leads, posts, projects };
  },
  ['admin-global-stats'],
  { revalidate: 300, tags: ['stats'] }
);

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Stats from cache or DB
  const stats = await getGlobalStats();
  
  // Real-time data for the current period (not cached)
  const [recentLeadsData, sourcesCount, topPosts, topProjects] = await Promise.all([
    prisma.lead.findMany({
      where: { createdAt: { gte: thirtyDaysAgo }, deletedAt: null },
      select: { createdAt: true, status: true }
    }),
    prisma.lead.groupBy({
      by: ['source'],
      where: { deletedAt: null },
      _count: { _all: true }
    }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      orderBy: { views: 'desc' },
      take: 3,
      select: { title: true, views: true }
    }),
    prisma.project.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      orderBy: { views: 'desc' },
      take: 3,
      select: { title: true, views: true }
    })
  ]);

  // Lead Conversion Stats
  const convertedLeads = stats.leads > 0 ? await prisma.lead.count({ where: { status: 'CLOSED', deletedAt: null } }) : 0;
  const conversionRate = stats.leads > 0 
    ? ((convertedLeads / stats.leads) * 100).toFixed(1) 
    : '0';

  // Preparing data for the chart (last 7 days)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [leadsByDayData, contentByDayData] = await Promise.all([
     prisma.lead.groupBy({
       by: ['createdAt'],
       where: { createdAt: { gte: sevenDaysAgo }, deletedAt: null },
       _count: { _all: true }
     }),
     Promise.all([
        prisma.post.findMany({ where: { createdAt: { gte: sevenDaysAgo }, status: 'PUBLISHED' }, select: { createdAt: true } }),
        prisma.project.findMany({ where: { createdAt: { gte: sevenDaysAgo }, status: 'PUBLISHED' }, select: { createdAt: true } })
     ])
  ]);

  const chartData = days.map(date => {
    const dayStr = date.toISOString().split('T')[0];
    const leadsCount = recentLeadsData.filter(l => l.createdAt.toISOString().split('T')[0] === dayStr).length;
    const publishedCount = [...contentByDayData[0], ...contentByDayData[1]].filter(c => c.createdAt.toISOString().split('T')[0] === dayStr).length;
    
    return {
      name: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      leads: leadsCount,
      publicados: publishedCount
    };
  });

  const totalSources = sourcesCount.reduce((acc, curr) => acc + curr._count._all, 0);
  const sourcesPercentages = sourcesCount.map(s => ({
    label: s.source || 'Indefinido',
    percentage: totalSources > 0 ? Math.round((s._count._all / totalSources) * 100) : 0
  })).sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="space-y-4 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Performance</h1>
          <p className="text-sm text-gray-500">Visão detalhada do seu ROI e conversões.</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Calendar size={16} /> Últimos 30 dias
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-laranja text-white rounded-lg text-sm font-medium hover:bg-[#D4651A] transition-colors">
            <Filter size={16} /> Filtros
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard 
          title="Taxa de Conversão" 
          value={`${conversionRate}%`} 
          description="Leads fechados / Leads totais"
          icon={TrendingUp} 
          color="text-green-600"
          bg="bg-green-50"
        />
        <AnalyticsCard 
          title="Total de Leads" 
          value={String(stats.leads)} 
          description="Contatos recebidos via site"
          icon={Users} 
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <AnalyticsCard 
          title="Conteúdo Ativo" 
          value={String(stats.posts + stats.projects)} 
          description="Posts e Projetos online"
          icon={BarChart3} 
          color="text-purple-600"
          bg="bg-purple-50"
        />
        <AnalyticsCard 
          title="Engajamento" 
          value="Alta" 
          description="Baseado nas visualizações"
          icon={MousePointer2} 
          color="text-laranja"
          bg="bg-laranja/10"
        />
      </div>

      {/* Performance Chart Area */}
      <DashboardCharts 
        data={chartData} 
        totalLeads={recentLeadsData.filter(l => l.createdAt >= sevenDaysAgo).length}
        totalPublicados={[...contentByDayData[0], ...contentByDayData[1]].length}
      />

      {/* Detailed Insights Section Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Fontes de Leads</h3>
          <div className="space-y-4">
            {sourcesPercentages.length > 0 ? sourcesPercentages.map((s, idx) => (
              <SourceBar 
                key={idx} 
                label={s.label} 
                percentage={s.percentage} 
                color={idx === 0 ? 'bg-laranja' : idx === 1 ? 'bg-blue-500' : 'bg-gray-400'} 
              />
            )) : (
              <p className="text-sm text-gray-500 italic">Nenhuma fonte registrada.</p>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Recomendadas</h3>
          <ul className="space-y-3">
            <RecommendationItem 
              text="Você tem leads sem resposta há 48h. Aumente sua conversão entrando em contato."
              action="Ver Leads"
              link="/admin/leads"
            />
            <RecommendationItem 
              text="Mantenha seu Blog e Portfólio atualizados para melhorar o SEO orgânico."
              action="Criar Post"
              link="/admin/blog/novo"
            />
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-12">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Conteúdos mais Populares</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Top 3 Blog</h4>
              <div className="space-y-3">
                 {topPosts.map((p, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 truncate mr-4">{p.title}</span>
                      <span className="text-xs font-bold text-laranja bg-laranja/10 px-2 py-1 rounded">{p.views} views</span>
                   </div>
                 ))}
                 {topPosts.length === 0 && <p className="text-xs text-gray-500 italic">Nenhum post no radar.</p>}
              </div>
           </div>
           <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Top 3 Portfólio</h4>
              <div className="space-y-3">
                 {topProjects.map((p, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 truncate mr-4">{p.title}</span>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{p.views} views</span>
                   </div>
                 ))}
                 {topProjects.length === 0 && <p className="text-xs text-gray-500 italic">Nenhum projeto no radar.</p>}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({ title, value, description, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
        <Icon size={24} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm font-bold text-gray-900 mt-1">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}

function SourceBar({ label, percentage, color }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function RecommendationItem({ text, action, link }: any) {
  return (
    <li className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
      <div className="w-2 h-2 rounded-full bg-laranja mt-1.5 shrink-0" />
      <div>
        <p className="text-sm text-gray-800">{text}</p>
        <a href={link} className="text-xs font-bold text-laranja hover:underline mt-2 inline-block">
          {action} &rarr;
        </a>
      </div>
    </li>
  );
}
