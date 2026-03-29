'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import ScrollProgress from '@/components/layout/ScrollProgress';
import { usePathname } from 'next/navigation';

interface AppShellProps {
  children: React.ReactNode;
  general: any;
  integrations: any;
}

export default function AppShell({ children, general, integrations }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {integrations.gtmId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${integrations.gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
      )}
      <ScrollProgress />
      <Header general={general} />
      <main className="flex-grow pt-24">{children}</main>
      <Footer general={general} />
      {integrations.whatsappEnabled !== false && (
        <WhatsAppButton number={integrations.whatsappNumber} message={integrations.whatsappMessage} />
      )}
      {integrations.bodyScripts && <div dangerouslySetInnerHTML={{ __html: integrations.bodyScripts }} />}
    </>
  );
}
