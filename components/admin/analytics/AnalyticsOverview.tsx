'use client';

import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Point = {
  label: string;
  sessions: number;
  leads: number;
};

export default function AnalyticsOverview({
  points,
  totals,
}: {
  points: Point[];
  totals: {
    sessions: number;
    leads: number;
    conversionRate: number;
    publishedContent: number;
  };
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Sessões (proxy)" value={String(totals.sessions)} subtitle="estimativa por atividade" />
        <KpiCard title="Leads" value={String(totals.leads)} subtitle="capturados no período" />
        <KpiCard title="Taxa de conversão" value={`${totals.conversionRate.toFixed(1)}%`} subtitle="leads / sessões" />
        <KpiCard title="Publicações" value={String(totals.publishedContent)} subtitle="posts + projetos" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-900">Evolução do período</h2>
        <p className="text-sm text-gray-500 mb-4">Leads e sessões estimadas por dia</p>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sessionsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f07a2a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f07a2a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="sessions" stroke="#3b82f6" fill="url(#sessionsFill)" strokeWidth={2} />
              <Area type="monotone" dataKey="leads" stroke="#f07a2a" fill="url(#leadsFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}
