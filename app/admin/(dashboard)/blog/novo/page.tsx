import PostForm from '@/components/admin/blog/PostForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function NewPostPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="h-full">
      <PostForm />
    </div>
  );
}
