import ContactContentEditor from '@/components/admin/content/ContactContentEditor';
import { getSectionSettings } from '@/app/actions/settings';

export const dynamic = 'force-dynamic';

export default async function AdminContactContentPage() {
  const { data } = await getSectionSettings(['contact_header', 'contato_info']);

  const formattedData = {
    header: data?.contact_header || null,
    info:   data?.contato_info   || null,
  };

  return <ContactContentEditor initialData={formattedData} />;
}
