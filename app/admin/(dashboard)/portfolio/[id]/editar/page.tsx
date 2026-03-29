import ProjectForm from '@/components/admin/portfolio/ProjectForm';
import { getProjectById } from '@/app/actions/portfolio';
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { success, data } = await getProjectById(params.id);

  if (!success || !data) {
    notFound();
  }

  return (
    <div className="h-full">
      <ProjectForm initialData={data} />
    </div>
  );
}
