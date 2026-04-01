import AboutContentEditor from '@/components/admin/content/AboutContentEditor';
import { getSectionSettings } from '@/app/actions/settings';

export const dynamic = 'force-dynamic';

export default async function AdminAboutContentPage() {
  const { data } = await getSectionSettings(['about_header', 'about_story', 'about_values']);

  const formattedData = {
    header: data?.about_header || null,
    story:  data?.about_story  || null,
    values: data?.about_values || null,
  };

  return <AboutContentEditor initialData={formattedData} />;
}
