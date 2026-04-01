import { getCachedPublicSettingsBundle } from '@/lib/cache/settings';
import Link from 'next/link';
import Image from 'next/image';
import { Target, Eye, Heart } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { seo, about } = await getCachedPublicSettingsBundle();
  return {
    title: (seo.metaTitle as string) || about?.header?.title || 'Sobre Nós | Neto Serviços',
    description: (seo.metaDescription as string) || about?.header?.subtitle || 'Conheça a história e os valores da Neto Serviços.',
  };
}

export default async function SobrePage() {
  const { about } = await getCachedPublicSettingsBundle();
  
  const header = about?.header || { title: 'Nossa História', subtitle: 'Conheça a Neto Serviços' };
  const story = about?.story || { 
    title: 'Nascemos da necessidade de simplificar.', 
    content: '<p>Reunimos especialistas de Gráfica, Design e Desenvolvimento Digital sob o mesmo teto para garantir que sua marca tenha uma identidade forte e coerente.</p>',
    image: 'https://picsum.photos/seed/escritorio/800/1000'
  };
  
  const valoresData = Array.isArray(about?.values) ? about.values : [
    { id: 'missao', title: 'Missão', desc: 'Simplificar a comunicação das empresas com excelência.', icon: 'target' },
    { id: 'visao',  title: 'Visão',   desc: 'Ser a principal parceira estratégica de negócios no Brasil.', icon: 'eye' },
    { id: 'valores', title: 'Valores', desc: 'Transparência, compromisso, criatividade e foco no cliente.', icon: 'heart' },
  ];

  const ICON_MAP: Record<string, any> = { target: Target, eye: Eye, heart: Heart };
  const COLOR_MAP: Record<string, string> = { missao: 'text-teal', visao: 'text-roxo', valores: 'text-laranja' };
  const BG_MAP: Record<string, string> = { missao: 'bg-teal-light', visao: 'bg-roxo-light', valores: 'bg-laranja-light' };

  return (
    <div className="bg-branco min-h-screen">
      <section className="bg-grafite text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10 text-center">
          <div className="text-sm text-t-white-70 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Início</Link> / Sobre Nós
          </div>
          <h1 className="text-5xl lg:text-6xl font-titulo font-bold mb-6">
            {header.title}
          </h1>
          <p className="text-xl text-t-white-70 max-w-2xl mx-auto">{header.subtitle}</p>
        </div>
      </section>

      <section className="section-py container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-4xl lg:text-5xl font-titulo font-bold text-t-primary mb-6">{story.title}</h2>
            <div className="prose prose-lg max-w-none text-t-secondary" dangerouslySetInnerHTML={{ __html: story.content }} />
          </div>
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-xl bg-gray-100">
            <Image src={story.image} alt={story.title} fill className="object-cover" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {valoresData.map((item: any, index: number) => {
            const Icon = ICON_MAP[item.icon] || Heart;
            const color = COLOR_MAP[item.id] || 'text-laranja';
            const bg = BG_MAP[item.id] || 'bg-laranja-light';
            return (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-black/5">
                <div className={`w-16 h-16 rounded-xl ${bg} ${color} flex items-center justify-center mb-6`}>
                  <Icon size={32} />
                </div>
                <h3 className="text-2xl font-titulo font-bold text-t-primary mb-4">{item.title}</h3>
                <p className="text-t-secondary leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}