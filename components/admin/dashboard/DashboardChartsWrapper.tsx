'use client';

import dynamic from 'next/dynamic';

const Charts = dynamic(() => import('./DashboardCharts'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-50 animate-pulse rounded-xl" />
});

export default function DashboardChartsWrapper(props: any) {
  return <Charts {...props} />;
}
