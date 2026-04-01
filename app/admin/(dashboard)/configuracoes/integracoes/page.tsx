import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getSettings } from '@/app/actions/settings';
import IntegrationsSettingsForm from '@/components/admin/settings/IntegrationsSettingsForm';

export default async function IntegrationsSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: setting } = await getSettings('integrations');
  let parsedSettings: any = {};
  if (setting?.data) {
    try {
      if (typeof setting.data === 'string') {
        parsedSettings = JSON.parse(setting.data);
      } else {
        parsedSettings = setting.data;
      }
    } catch (error) {
      console.error('Error parsing integrations settings:', error);
    }
  }

  return <IntegrationsSettingsForm settings={parsedSettings} />;
}