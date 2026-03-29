import ProjectForm from '@/components/admin/portfolio/ProjectForm';
import { getProjectById } from '@/app/actions/portfolio';
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const { success, data } = await getProjectById(id);

  if (!success || !data) {
    notFound();
  }

  return (
    <div className="h-full">
      <ProjectForm initialData={data} />
    </div>
  );
}