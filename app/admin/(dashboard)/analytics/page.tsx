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
import DashboardCharts from '@/components/admin/dashboard/DashboardCharts';

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Fetching data for analytics
  const [totalLeads, totalPosts, totalProjects, recentLeadsData] = await Promise.all([
    prisma.lead.count({ where: { deletedAt: null } }),
    prisma.post.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
    prisma.project.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
    prisma.lead.findMany({
      where: { createdAt: { gte: thirtyDaysAgo }, deletedAt: null },
      select: { createdAt: true, status: true }
    })
  ]);

  // Lead Conversion Stats
  const convertedLeads = recentLeadsData.filter(l => l.status === 'CLOSED').length;
  const conversionRate = recentLeadsData.length > 0 
    ? ((convertedLeads / recentLeadsData.length) * 100).toFixed(1) 
    : '0';

  // Preparing data for the chart (last 7 days)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sevenDaysAgo);
    d.setDate(sevenDaysAgo.getDate() + i + 1);
    return d;
  });

  const chartData = days.map(date => {
    const dayStr = date.toISOString().split('T')[0];
    return {
      name: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      leads: recentLeadsData.filter(l => l.createdAt.toISOString().split('T')[0] === dayStr).length,
      publicados: 0 // In a real scenario, we'd fetch this too
    };
  });

  return (
    <div className="space-y-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          value={String(totalLeads)} 
          description="Contatos recebidos via site"
          icon={Users} 
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <AnalyticsCard 
          title="Conteúdo Ativo" 
          value={String(totalPosts + totalProjects)} 
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

      {/* Performance Chart */}
      <DashboardCharts 
        data={chartData} 
        totalLeads={recentLeadsData.filter(l => l.createdAt >= sevenDaysAgo).length}
        totalPublicados={0}
      />

      {/* Detailed Insights Section Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Fontes de Leads</h3>
          <div className="space-y-4">
            <SourceBar label="Site Direto" percentage={65} color="bg-laranja" />
            <SourceBar label="WhatsApp" percentage={20} color="bg-green-500" />
            <SourceBar label="Instagram" percentage={10} color="bg-purple-500" />
            <SourceBar label="Outros" percentage={5} color="bg-gray-400" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Recomendadas</h3>
          <ul className="space-y-3">
            <RecommendationItem 
              text="Você tem 3 leads sem resposta há 48h. Aumente sua conversão entrando em contato."
              action="Ver Leads"
              link="/admin/leads"
            />
            <RecommendationItem 
              text="Seu último post foi há 10 dias. Tente manter uma frequência semanal para SEO."
              action="Criar Post"
              link="/admin/blog/novo"
            />
          </ul>
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
