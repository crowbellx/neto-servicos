import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getSettings } from '@/app/actions/settings';
import GeneralSettingsForm from '@/components/admin/settings/GeneralSettingsForm';
import { prisma } from '@/lib/prisma';

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

  // Busca configuração de limpeza de leads
  const cleanupSetting = await prisma.setting.findUnique({ where: { key: 'lead_cleanup' } });
  const leadCleanupConfig = cleanupSetting?.data ? JSON.parse(cleanupSetting.data) : {};

  return <GeneralSettingsForm settings={parsedSettings} leadCleanupConfig={leadCleanupConfig} />;
}

