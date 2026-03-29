import { getServiceById } from '@/app/actions/services';
import ServiceForm from '@/components/admin/services/ServiceForm';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const { success, data } = await getServiceById(id);

  if (!success || !data) {
    notFound();
  }

  return <ServiceForm initialData={data} />;
}
