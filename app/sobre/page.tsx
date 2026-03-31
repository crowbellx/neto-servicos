import { prisma } from '@/lib/prisma';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Target, Eye, Heart, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await prisma.page.findFirst({ where: { slug: 'sobre', status: 'PUBLISHED' } });
    return {
      title: page?.seoTitle || 'Sobre Nós | Neto Serviços',
      description: page?.seoDesc || 'Conheça a história e os valores da Neto Serviços.',
    };
  } catch (error) {
    return {
      title: 'Sobre Nós | Neto Serviços',
      description: 'Conheça a história e os valores da Neto Serviços.',
    };
  }
}

export default async function SobrePage() {
  let page = null;
  try {
    page = await prisma.page.findFirst({ where: { slug: 'sobre', status: 'PUBLISHED' } });
  } catch (error) {
    console.error('[Build] Erro ao buscar dados de Sobre:', error);
  }

  const valores = [
    { icon: Target, title: 'Missão', desc: 'Simplificar a comunicação das empresas com excelência.', color: 'text-teal', bg: 'bg-teal-light' },
    { icon: Eye, title: 'Visão', desc: 'Ser a principal parceira estratégica de negócios no Brasil.', color: 'text-roxo', bg: 'bg-roxo-light' },
    { icon: Heart, title: 'Valores', desc: 'Transparência, compromisso, criatividade e foco no cliente.', color: 'text-laranja', bg: 'bg-laranja-light' },
  ];

  return (
    <div className="bg-branco min-h-screen">
      <section className="bg-grafite text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10 text-center">
          <div className="text-sm text-t-white-70 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Início</Link> / Sobre Nós
          </div>
          <h1 className="text-5xl lg:text-6xl font-titulo font-bold mb-6">
            {page?.title || 'Nossa História'}
          </h1>
        </div>
      </section>

      <section className="section-py container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            {page?.content ? (
              <div className="prose prose-lg max-w-none text-t-secondary" dangerouslySetInnerHTML={{ __html: page.content }} />
            ) : (
              <>
                <h2 className="text-4xl lg:text-5xl font-titulo font-bold text-t-primary mb-6">Nascemos da necessidade de simplificar.</h2>
                <div className="space-y-4 text-lg text-t-secondary leading-relaxed">
                  <p>Reunimos especialistas de Gráfica, Design e Desenvolvimento Digital sob o mesmo teto para garantir que sua marca tenha uma identidade forte e coerente.</p>
                </div>
              </>
            )}
          </div>
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-xl bg-gray-100">
            <Image src="https://picsum.photos/seed/escritorio/800/1000" alt="Nosso Escritório" fill className="object-cover" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {valores.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-black/5">
              <div className={`w-16 h-16 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-6`}>
                <item.icon size={32} />
              </div>
              <h3 className="text-2xl font-titulo font-bold text-t-primary mb-4">{item.title}</h3>
              <p className="text-t-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}