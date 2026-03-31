import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await prisma.page.findFirst({ where: { slug: 'privacidade', status: 'PUBLISHED' } });
    return {
      title: page?.seoTitle || 'Política de Privacidade | Neto Serviços',
      description: page?.seoDesc || 'Como tratamos e protegemos os seus dados.',
    };
  } catch (error) {
    return {
      title: 'Política de Privacidade | Neto Serviços',
      description: 'Como tratamos e protegemos os seus dados.',
    };
  }
}

export default async function PrivacidadePage() {
  let page = null;
  try {
    page = await prisma.page.findFirst({ where: { slug: 'privacidade', status: 'PUBLISHED' } });
  } catch (error) {
    console.error('[Build] Erro ao buscar dados de Privacidade:', error);
  }

  return (
    <div className="bg-branco min-h-screen pb-24">
      <section className="bg-grafite text-white pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-t-white-70 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft size={16} /> Voltar para o Início
          </Link>
          <h1 className="text-4xl md:text-5xl font-display italic text-white mb-6">
            {page?.title || 'Política de Privacidade'}
          </h1>
        </div>
      </section>

      <div className="container-custom mt-16 max-w-4xl">
        {page?.content ? (
          <div className="prose prose-lg prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
        ) : (
          <div className="prose prose-lg prose-slate max-w-none">
            <h2>1. Coleta de Dados</h2>
            <p>Coletamos informações que você nos fornece diretamente, como quando preenche nosso formulário de contato.</p>
          </div>
        )}
      </div>
    </div>
  );
}