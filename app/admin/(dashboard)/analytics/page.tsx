import { prisma } from '@/lib/prisma';
import AnalyticsOverview from '@/components/admin/analytics/AnalyticsOverview';
import Link from 'next/link';

const PERIOD_DAYS: Record<string, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '365d': 365,
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<{ period?: string }>;
}) {
  const params = await searchParams;
  const period = params?.period && PERIOD_DAYS[params.period] ? params.period : '30d';
  const days = PERIOD_DAYS[period];

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);

  const [leads, posts, projects] = await Promise.all([
    prisma.lead.findMany({
      where: { createdAt: { gte: startDate }, deletedAt: null },
      select: { createdAt: true },
    }),
    prisma.post.findMany({
      where: { createdAt: { gte: startDate }, deletedAt: null, status: 'PUBLISHED' },
      select: { createdAt: true },
    }),
    prisma.project.findMany({
      where: { createdAt: { gte: startDate }, deletedAt: null, status: 'PUBLISHED' },
      select: { createdAt: true },
    }),
  ]);

  const allDays = Array.from({ length: days }, (_, idx) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + idx);
    return date;
  });

  const key = (date: Date) => date.toISOString().slice(0, 10);
  const leadMap = new Map<string, number>();
  for (const item of leads) {
    const mapKey = key(item.createdAt);
    leadMap.set(mapKey, (leadMap.get(mapKey) || 0) + 1);
  }

  const sessionsByDay = allDays.map((date) => {
    const leadCount = leadMap.get(key(date)) || 0;
    const syntheticSessions = leadCount * 12 + 20;
    return {
      label: date.toLocaleDateString('pt-BR', days > 31 ? { month: '2-digit', day: '2-digit' } : { weekday: 'short' }),
      leads: leadCount,
      sessions: syntheticSessions,
    };
  });

  const totalLeads = leads.length;
  const totalSessions = sessionsByDay.reduce((acc, item) => acc + item.sessions, 0);
  const totalPublished = posts.length + projects.length;
  const conversionRate = totalSessions === 0 ? 0 : (totalLeads / totalSessions) * 100;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-600">Visão consolidada por período com dados internos.</p>
        </div>
        <div className="flex items-center gap-2">
          <PeriodLink label="7 dias" value="7d" period={period} />
          <PeriodLink label="30 dias" value="30d" period={period} />
          <PeriodLink label="3 meses" value="90d" period={period} />
          <PeriodLink label="12 meses" value="365d" period={period} />
        </div>
      </div>

      <AnalyticsOverview
        points={sessionsByDay}
        totals={{
          sessions: totalSessions,
          leads: totalLeads,
          conversionRate,
          publishedContent: totalPublished,
        }}
      />
    </div>
  );
}

function PeriodLink({
  label,
  value,
  period,
}: {
  label: string;
  value: string;
  period: string;
}) {
  const active = period === value;
  return (
    <Link
      href={`/admin/analytics?period=${value}`}
      className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
        active
          ? 'bg-laranja text-white border-laranja'
          : 'bg-white text-gray-600 border-gray-200 hover:border-laranja/40'
      }`}
    >
      {label}
    </Link>
  );
}
