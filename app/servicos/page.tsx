import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Printer, MousePointerClick, Monitor } from 'lucide-react';

export const revalidate = 60;

const ICON_MAP: Record<string, any> = {
  'Gráfica': Printer,
  'Design': MousePointerClick,
  'Digital': Monitor,
};

// Dados de fallback para a página não ficar vazia se o banco estiver limpo
const DEFAULT_SERVICES = [
  {
    id: 's1',
    slug: 'grafica',
    title: 'Gráfica',
    category: 'Gráfica',
    description: 'Soluções completas em impressão offset e digital. De cartões de visita a banners de grandes formatos, garantimos a máxima qualidade cromática e acabamento impecável para sua marca no mundo físico.'
  },
  {
    id: 's2',
    slug: 'design',
    title: 'Design Estratégico',
    category: 'Design',
    description: 'Criação de identidades visuais memoráveis, logotipos, materiais institucionais e interfaces de usuário (UI/UX). Transformamos a essência do seu negócio em uma linguagem visual potente e coerente.'
  },
  {
    id: 's3',
    slug: 'digital',
    title: 'Desenvolvimento Digital',
    category: 'Digital',
    description: 'Criação de sites institucionais, landing pages de alta conversão, e-commerces e sistemas personalizados. Utilizamos as tecnologias mais modernas para garantir velocidade, segurança e resultados reais.'
  }
];

export default async function ServicosPage() {
  const dbServices = await prisma.service.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { order: 'asc' }
  });

  // Se o banco estiver vazio, usa os padrões. Se tiver dados, usa os do banco.
  const services = dbServices.length > 0 ? dbServices : DEFAULT_SERVICES;

  return (
    <div className="bg-branco min-h-screen">
      {/* Hero */}
      <section className="bg-grafite text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10 text-center">
          <div className="text-sm text-t-white-70 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Início</Link> / Serviços
          </div>
          <h1 className="text-5xl lg:text-6xl font-titulo font-bold mb-6">Nossos Serviços</h1>
          <p className="text-xl text-t-white-70 max-w-2xl mx-auto">Soluções integradas para sua marca.</p>
        </div>
      </section>

      <div className="container-custom py-24 space-y-32">
        {services.map((s) => {
          const Icon = ICON_MAP[s.category] || Printer;
          return (
            <section key={s.id} id={s.slug} className="scroll-mt-32">
              <div className="flex flex-col lg:flex-row items-start gap-12">
                <div className="lg:w-1/3">
                  <div className="inline-flex p-4 bg-laranja/10 text-laranja rounded-2xl mb-6">
                    <Icon size={40} />
                  </div>
                  <h2 className="text-4xl font-titulo font-bold text-t-primary mb-6">{s.title}</h2>
                  <div className="h-1.5 w-20 bg-laranja rounded-full" />
                </div>
                <div className="lg:w-2/3">
                  <p className="text-xl text-t-secondary mb-12 leading-relaxed">
                    {s.description}
                  </p>
                  <div className="bg-gray-50 rounded-3xl p-10 border border-black/5 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="text-left">
                      <h4 className="font-bold text-t-primary text-lg">Precisa de um projeto sob medida?</h4>
                      <p className="text-t-muted">Solicite um orçamento gratuito agora mesmo.</p>
                    </div>
                    <Link 
                      href="/contato" 
                      className="bg-laranja text-white px-8 py-4 rounded-full font-bold hover:bg-[#D4651A] hover:scale-105 transition-all shadow-cor whitespace-nowrap"
                    >
                      Solicitar Orçamento
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}