import PostForm from '@/components/admin/blog/PostForm';
import { getPostById } from '@/app/actions/blog';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const { success, data: post } = await getPostById(id);

  if (!success || !post) {
    notFound();
  }

  return (
    <div className="h-full">
      <PostForm initialData={post} />
    </div>
  );
}
