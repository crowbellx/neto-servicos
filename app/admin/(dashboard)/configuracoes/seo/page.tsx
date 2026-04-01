import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getSettings } from '@/app/actions/settings';
import SeoSettingsForm from '@/components/admin/settings/SeoSettingsForm';

export default async function SeoSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: setting } = await getSettings('seo');
  let parsedSettings: any = {};
  if (setting?.data) {
    try {
      if (typeof setting.data === 'string') {
        parsedSettings = JSON.parse(setting.data);
      } else {
        parsedSettings = setting.data;
      }
    } catch (error) {
      console.error('Error parsing seo settings:', error);
    }
  }

  return <SeoSettingsForm settings={parsedSettings} />;
}