import UserForm from '@/components/admin/users/UserForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { hasRequiredRole } from '@/lib/auth/rbac';

export default async function NewUserPage() {
  const session = await auth();
  const user = session?.user as any;

  if (!user || !hasRequiredRole(user.role, 'ADMIN')) {
    redirect('/admin');
  }

  return <UserForm />;
}