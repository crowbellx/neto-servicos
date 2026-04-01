import LoginForm from '@/components/auth/LoginForm';
import { getCachedPublicSettingsBundle } from '@/lib/cache/settings';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { seo, general } = await getCachedPublicSettingsBundle();
  return {
    title: `Login Administrativo | ${general.companyName || 'Neto Serviços'}`,
    description: (seo.metaDescription as string) || 'Acesso restrito à área administrativa.',
  };
}

export default async function LoginPage() {
  const { general } = await getCachedPublicSettingsBundle();

  return (
    <LoginForm 
      logo={general.logo as string} 
      companyName={general.companyName as string} 
    />
  );
}
