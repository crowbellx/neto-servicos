'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ChartPoint = {
  name: string;
  leads: number;
  publicados: number;
};

export default function DashboardCharts({
  data,
  totalLeads,
  totalPublicados,
}: {
  data: ChartPoint[];
  totalLeads: number;
  totalPublicados: number;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Atividade do painel</h2>
          <p className="text-sm text-gray-500">Leads e publicações nos últimos 7 dias</p>
        </div>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
          Atualização em tempo real
        </span>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f07a2a" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#f07a2a" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPublicados" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#1f2937', fontWeight: 500 }}
            />
            <Area type="monotone" dataKey="leads" stroke="#f07a2a" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
            <Area type="monotone" dataKey="publicados" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPublicados)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div>
          <p className="text-sm text-gray-500">Leads (7 dias)</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{totalLeads}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Publicações (7 dias)</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{totalPublicados}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Média leads/dia</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {(totalLeads / 7).toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Média publicações/dia</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {(totalPublicados / 7).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
