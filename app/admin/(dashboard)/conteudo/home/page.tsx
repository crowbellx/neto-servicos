

import HomeContentEditor from '@/components/admin/content/HomeContentEditor';
import { getHomeSections } from '@/app/actions/settings';

export const dynamic = 'force-dynamic';

export default async function HomeContentPage() {
  const { data } = await getHomeSections();

  return <HomeContentEditor initialData={data} />;
}
