import { prisma } from '@/lib/prisma';
import PortfolioClient from '@/components/portfolio/PortfolioClient';
import Link from 'next/link';
import { motion } from 'motion/react';

export const revalidate = 60;

export default async function PortfolioPage() {
  const projects = await prisma.project.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-branco min-h-screen">
      <section className="bg-grafite text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10 text-center">
          <div className="text-sm text-t-white-70 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Início</Link> / Portfólio
          </div>
          <h1 className="text-5xl lg:text-6xl font-titulo font-bold mb-6">Nosso Portfólio</h1>
          <p className="text-xl text-t-white-70 max-w-2xl mx-auto">Trabalhos que falam por si.</p>
        </div>
      </section>

      <div className="container-custom py-12">
        <PortfolioClient initialProjects={projects.map(p => ({
          ...p,
          image: JSON.parse(p.images || '[]')[0] || 'https://picsum.photos/seed/placeholder/800/600',
          color: p.category === 'Design' ? 'roxo' : p.category === 'Digital' ? 'azul' : 'teal'
        }))} />
      </div>
    </div>
  );
}