import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

import AppShell from '@/components/layout/AppShell';
import { getSettings } from '@/app/actions/settings';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-corpo',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const { data: seoSettings } = await getSettings('seo');
  const seo = seoSettings?.data ? JSON.parse(seoSettings.data) : {};

  return {
    title: seo.metaTitle || 'Neto Serviços e Soluções | Gráfica, Design e Desenvolvimento Digital',
    description: seo.metaDescription || 'Do físico ao digital em um só lugar. Serviços de gráfica, design e desenvolvimento web integrados. Solicite orçamento grátis.',
    keywords: seo.keywords || 'gráfica, design, desenvolvimento web, criação de sites, identidade visual, impressão',
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || 'Neto Serviços e Soluções',
      description: seo.ogDescription || seo.metaDescription || 'Do físico ao digital em um só lugar.',
      images: seo.ogImage ? [{ url: seo.ogImage }] : [],
    },
    robots: {
      index: seo.allowIndexing !== false,
      follow: seo.allowIndexing !== false,
    }
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: integrationsSettings } = await getSettings('integrations');
  const integrations = integrationsSettings?.data ? JSON.parse(integrationsSettings.data) : {};

  const { data: generalSettings } = await getSettings('general');
  const general = generalSettings?.data ? JSON.parse(generalSettings.data) : {};

  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        {integrations.gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${integrations.gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${integrations.gaId}');
                `,
              }}
            />
          </>
        )}
        {integrations.gtmId && (
          <Script
            id="gtm-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${integrations.gtmId}');
              `,
            }}
          />
        )}
        {integrations.fbPixelId && (
          <Script
            id="fb-pixel-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${integrations.fbPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
        {integrations.headScripts && (
          <div dangerouslySetInnerHTML={{ __html: integrations.headScripts }} />
        )}
      </head>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <AppShell general={general} integrations={integrations}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
