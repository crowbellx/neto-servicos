import PostForm from '@/components/admin/blog/PostForm';
import { getPostById } from '@/app/actions/blog';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { success, data: post } = await getPostById(params.id);

  if (!success || !post) {
    notFound();
  }

  return (
    <div className="h-full">
      <PostForm initialData={post} />
    </div>
  );
}
