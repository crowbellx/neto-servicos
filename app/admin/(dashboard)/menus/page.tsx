import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getMenus } from '@/app/actions/menus';
import MenusClient from '@/components/admin/menus/MenusClient';

export default async function MenusPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: menus } = await getMenus();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menus</h1>
          <p className="text-sm text-gray-500">Gerencie a navegação do seu site</p>
        </div>
      </div>

      <MenusClient initialMenus={menus || []} />
    </div>
  );
}
