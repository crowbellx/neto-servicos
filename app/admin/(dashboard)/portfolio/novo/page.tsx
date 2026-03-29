import ProjectForm from '@/components/admin/portfolio/ProjectForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function NewProjectPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="h-full">
      <ProjectForm />
    </div>
  );
}
