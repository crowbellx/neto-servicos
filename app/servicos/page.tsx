import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Printer, MousePointerClick, Monitor, ArrowRight, CheckCircle2 } from 'lucide-react';

export const revalidate = 60;

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

const DEFAULT_SERVICES = [
  {
    id: 's1',
    slug: 'grafica',
    title: 'Gráfica Premium',
    category: 'Gráfica',
    description: 'Soluções completas em impressão offset e digital. De cartões de visita com acabamentos especiais a banners de grandes formatos, garantimos a máxima fidelidade de cores e qualidade que sua marca merece no mundo físico.',
    features: ['Impressão de alta definição', 'Acabamentos especiais (UV, Hot Stamping)', 'Grandes formatos e sinalização', 'Papelaria corporativa completa']
  },
  {
    id: 's2',
    slug: 'design',
    title: 'Design Estratégico',
    category: 'Design',
    description: 'Criamos identidades visuais memoráveis que contam a história da sua marca. Nosso foco é design funcional e estético que comunica autoridade, confiança e modernidade em todos os pontos de contato.',
    features: ['Logotipos e Branding', 'Manual de Identidade Visual', 'Design para Redes Sociais', 'Materiais Institucionais']
  },
  {
    id: 's3',
    slug: 'digital',
    title: 'Desenvolvimento Digital',
    category: 'Digital',
    description: 'Sua presença online levada a sério. Desenvolvemos sites institucionais, landing pages de alta conversão e sistemas personalizados utilizando as tecnologias mais rápidas e seguras do mercado.',
    features: ['Sites Responsivos (Next.js)', 'Lojas Virtuais de Performance', 'SEO e Otimização de Velocidade', 'Sistemas e Dashboards']
  }
];

export default async function ServicosPage() {
  const dbServices = await prisma.service.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { order: 'asc' }
  });

  const services = dbServices.length > 0 ? dbServices : DEFAULT_SERVICES;

  return (
    <div className="bg-branco min-h-screen">
      {/* Hero Section */}
      <section className="bg-grafite text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-laranja/10 blur-[120px] rounded-full" />
        
        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-t-white-70 mb-6">
            Nossas Especialidades
          </div>
          <h1 className="text-5xl lg:text-7xl font-titulo font-bold mb-8 leading-tight">
            Soluções <span className="text-laranja">Integradas</span> <br className="hidden md:block" /> para o seu negócio.
          </h1>
          <p className="text-xl text-t-white-70 max-w-2xl mx-auto leading-relaxed">
            Do físico ao digital, cuidamos de cada detalhe da sua marca com excelência técnica e visão estratégica.
          </p>
        </div>
      </section>

      {/* Services List */}
      <div className="container-custom py-24 lg:py-32 space-y-32 lg:space-y-48">
        {services.map((s, index) => {
          const Icon = ICON_MAP[s.category] || Printer;
          const color = COLOR_MAP[s.category] || 'laranja';
          const isEven = index % 2 === 0;

          return (
            <section 
              key={s.id} 
              id={s.slug} 
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24 scroll-mt-32`}
            >
              {/* Image/Visual Side */}
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group">
                  <div className={`absolute inset-0 bg-${color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <img 
                    src={`https://picsum.photos/seed/${s.slug}/800/600`} 
                    alt={s.title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <div className={`w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-${color}`}>
                      <Icon size={32} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div>
                  <div className={`inline-block bg-${color}-light text-${color} px-4 py-1 rounded-full text-sm font-bold mb-4`}>
                    {s.category}
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-titulo font-bold text-t-primary leading-tight">
                    {s.title}
                  </h2>
                </div>

                <p className="text-lg text-t-secondary leading-relaxed">
                  {s.description}
                </p>

                {/* Features Grid (Fallback features or dynamic if added later) */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {((s as any).features || ['Qualidade Garantida', 'Prazo Cumprido', 'Atendimento Premium', 'Suporte Especializado']).map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full bg-${color}-light flex items-center justify-center text-${color} shrink-0`}>
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="text-sm font-medium text-t-secondary">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <Link 
                    href="/contato" 
                    className={`inline-flex items-center gap-3 bg-${color} text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-${color}/20`}
                  >
                    Solicitar Orçamento de {s.category} <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="bg-branco border-t border-black/5 py-24">
        <div className="container-custom">
          <div className="bg-grafite rounded-[40px] p-8 md:p-16 relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-g-marca opacity-10" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-titulo font-bold text-white mb-6">
                Não sabe qual solução é a ideal para o seu momento?
              </h3>
              <p className="text-lg text-t-white-70 mb-10">
                Nossa equipe de consultores está pronta para analisar seu projeto e propor a melhor estratégia integrada.
              </p>
              <Link 
                href="/contato" 
                className="inline-flex items-center gap-2 bg-laranja text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-[#D4651A] transition-all shadow-cor"
              >
                Falar com Especialista
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}