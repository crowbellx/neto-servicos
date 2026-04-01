import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getSettings } from '@/app/actions/settings';
import GeneralSettingsForm from '@/components/admin/settings/GeneralSettingsForm';

export default async function GeneralSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: setting } = await getSettings('general');
  let parsedSettings: any = {};
  if (setting?.data) {
    try {
      if (typeof setting.data === 'string') {
        parsedSettings = JSON.parse(setting.data);
      } else {
        parsedSettings = setting.data;
      }
    } catch (error) {
      console.error('Error parsing general settings:', error);
    }
  }

  return <GeneralSettingsForm settings={parsedSettings} />;
}
