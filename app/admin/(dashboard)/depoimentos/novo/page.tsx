import TestimonialForm from '@/components/admin/testimonials/TestimonialForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function NewTestimonialPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="h-full">
      <TestimonialForm />
    </div>
  );
}