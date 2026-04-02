import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import QuoteForm from '@/components/admin/quotes/QuoteForm';
import { getClients } from '@/app/actions/clients';

export default async function NovoOrcamentoPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const clientsRes = await getClients();
  const clients = (clientsRes.success ? clientsRes.data : []) || [];

  return (
    <div className="h-full">
      <QuoteForm clients={clients} />
    </div>
  );
}
