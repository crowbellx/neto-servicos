import PortfolioContentEditor from '@/components/admin/content/PortfolioContentEditor';
import { getSectionSettings } from '@/app/actions/settings';

export const dynamic = 'force-dynamic';

export default async function AdminPortfolioContentPage() {
  const { data } = await getSectionSettings(['portfolio_header']);

  const formattedData = {
    header: data?.portfolio_header || null,
  };

  return <PortfolioContentEditor initialData={formattedData} />;
}
