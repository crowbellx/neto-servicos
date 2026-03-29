import { getPageById } from '@/app/actions/pages';
import PageForm from '@/components/admin/pages/PageForm';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const { success, data } = await getPageById(id);

  if (!success || !data) {
    notFound();
  }

  return <PageForm initialData={data} />;
}
