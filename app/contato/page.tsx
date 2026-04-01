import { getCachedPublicSettingsBundle } from '@/lib/cache/settings';
import Link from 'next/link';
import ContatoSection from '@/components/contato/ContatoSection';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { seo, contact } = await getCachedPublicSettingsBundle();
  return {
    title: (seo.metaTitle as string) || contact?.header?.title || 'Contato | Neto Serviços',
    description: (seo.metaDescription as string) || contact?.header?.subtitle || 'Estamos prontos para ouvir sobre o seu projeto.',
  };
}

export default async function ContatoPage() {
  const { contact } = await getCachedPublicSettingsBundle();
  
  const header = (contact?.header && Object.keys(contact.header).length > 0) ? contact.header : { 
    title: 'Fale Conosco', 
    subtitle: 'Estamos prontos para ouvir sobre o seu projeto.' 
  };

  return (
    <div className="bg-branco min-h-screen">
      {/* Hero */}
      <section className="bg-grafite text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10 text-center">
          <div className="text-sm text-t-white-70 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Início</Link> / Contato
          </div>
          <h1 className="text-5xl lg:text-6xl font-titulo font-bold mb-6">
            {header.title}
          </h1>
          <p className="text-xl text-t-white-70 max-w-2xl mx-auto">
            {header.subtitle}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-16">
        <ContatoSection data={contact?.info} />
      </div>
    </div>
  );
}
