import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { hasRequiredRole } from '@/lib/auth/rbac';
import { getUserById } from '@/app/actions/users';
import UserForm from '@/components/admin/users/UserForm';

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const currentUser = session?.user as any;

  if (!currentUser || !hasRequiredRole(currentUser.role, 'ADMIN')) {
    redirect('/admin');
  }

  const { data: userToEdit } = await getUserById(params.id);

  if (!userToEdit) {
    notFound();
  }

  return <UserForm initialData={userToEdit} />;
}
