import ServicesContentEditor from '@/components/admin/content/ServicesContentEditor';
import { getSectionSettings } from '@/app/actions/settings';

export const dynamic = 'force-dynamic';

export default async function AdminServicesContentPage() {
  const { data } = await getSectionSettings(['services_header']);

  const formattedData = {
    header: data?.services_header || null,
  };

  return <ServicesContentEditor initialData={formattedData} />;
}
