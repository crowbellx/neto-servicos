import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import QuoteForm from '@/components/admin/quotes/QuoteForm';
import { getClients } from '@/app/actions/clients';
import { getQuoteById } from '@/app/actions/quotes';

export default async function EditarOrcamentoPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const [clientsRes, quoteRes] = await Promise.all([
    getClients(),
    getQuoteById(params.id)
  ]);

  const clients = (clientsRes.success ? clientsRes.data : []) || [];
  const quote = quoteRes.success ? quoteRes.data : null;

  if (!quote) {
    return <div className="p-10 text-center">Orçamento não encontrado.</div>;
  }

  return (
    <div className="h-full">
      <QuoteForm clients={clients} initialData={quote} />
    </div>
  );
}
