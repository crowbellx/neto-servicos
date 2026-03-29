import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LeadsClient from '@/components/admin/leads/LeadsClient';
import { getLeads } from '@/app/actions/leads';

export default async function LeadsPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: leads } = await getLeads();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads & Mensagens</h1>
          <p className="text-sm text-gray-500">Gerencie contatos e orçamentos</p>
        </div>
      </div>

      <LeadsClient initialLeads={leads || []} />
    </div>
  );
}
