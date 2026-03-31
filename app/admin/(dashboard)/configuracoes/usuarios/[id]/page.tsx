import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { hasRequiredRole } from '@/lib/auth/rbac';
import { getUserById } from '@/app/actions/users';
import UserForm from '@/components/admin/users/UserForm';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: Props) {
  const session = await auth();
  const currentUser = session?.user as any;

  if (!currentUser || !hasRequiredRole(currentUser.role, 'ADMIN')) {
    redirect('/admin');
  }

  const { id } = await params;
  const { data: userToEdit } = await getUserById(id);

  if (!userToEdit) {
    notFound();
  }

  return <UserForm initialData={userToEdit} />;
}
