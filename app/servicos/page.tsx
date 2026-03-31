import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Printer, MousePointerClick, Monitor, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await prisma.page.findFirst({ where: { slug: 'servicos', status: 'PUBLISHED' } });
    return {
      title: page?.seoTitle || 'Serviços | Neto Serviços',
      description: page?.seoDesc || 'Conheça nossas especialidades em Gráfica, Design e Digital.',
    };
  } catch (error) {
    return {
      title: 'Serviços | Neto Serviços',
      description: 'Conheça nossas especialidades em Gráfica, Design e Digital.',
    };
  }
}

const ICON_MAP: Record<string, any> = {
  'Gráfica': Printer,
  'Design': MousePointerClick,
  'Digital': Monitor,
};

const COLOR_MAP: Record<string, string> = {
  'Gráfica': 'teal',
  'Design': 'roxo',
  'Digital': 'azul',
};

export default async function ServicosPage() {
  let dbServices: any[] = [];
  let pageData: any = null;

  try {
    const [fetchedServices, fetchedPageData] = await Promise.all([
      prisma.service.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { order: 'asc' }
      }),
      prisma.page.findFirst({
        where: { slug: 'servicos', status: 'PUBLISHED' }
      })
    ]);
    dbServices = fetchedServices;
    pageData = fetchedPageData;
  } catch (error) {
    console.error('[Build] Erro ao buscar dados de Serviços:', error);
  }

  return (
    <div className="bg-branco min-h-screen">
      <section className="bg-grafite text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-5xl lg:text-7xl font-titulo font-bold mb-8 leading-tight">
            {pageData?.title || 'Nossas Especialidades'}
          </h1>
          <p className="text-xl text-t-white-70 max-w-2xl mx-auto leading-relaxed">
            {pageData?.seoDesc || 'Do físico ao digital, cuidamos de cada detalhe da sua marca com excelência técnica e visão estratégica.'}
          </p>
        </div>
      </section>

      <div className="container-custom py-24 lg:py-32 space-y-32 lg:space-y-48">
        {dbServices.map((s, index) => {
          const Icon = ICON_MAP[s.category] || Printer;
          const color = COLOR_MAP[s.category] || 'laranja';
          const isEven = index % 2 === 0;

          return (
            <section key={s.id} id={s.slug} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24 scroll-mt-32`}>
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group">
                  <img src={`https://picsum.photos/seed/${s.slug}/800/600`} alt={s.title} className="w-full h-full object-cover" />
                  <div className="absolute top-6 left-6">
                    <div className={`w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-${color}`}><Icon size={32} /></div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-8">
                <div className={`inline-block bg-${color}-light text-${color} px-4 py-1 rounded-full text-sm font-bold`}>{s.category}</div>
                <h2 className="text-4xl lg:text-5xl font-titulo font-bold text-t-primary">{s.title}</h2>
                <p className="text-lg text-t-secondary">{s.description}</p>
                <div className="pt-6">
                  <Link href="/contato" className={`inline-flex items-center gap-3 bg-${color} text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all`}>
                    Solicitar Orçamento <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}