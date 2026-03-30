import HeroSection from '@/components/home/HeroSection';
import CountersSection from '@/components/home/CountersSection';
import ServicosSection from '@/components/home/ServicosSection';
import ProcessoSection from '@/components/home/ProcessoSection';
import PortfolioPreview from '@/components/home/PortfolioPreview';
import DepoimentosSection from '@/components/home/DepoimentosSection';
import DiferenciaisSection from '@/components/home/DiferenciaisSection';
import CTASection from '@/components/home/CTASection';
import ContatoSection from '@/components/contato/ContatoSection';
import { prisma } from '@/lib/prisma';

export const revalidate = 60; // Revalida a cada minuto

export default async function Home() {
  // Buscamos dados reais do banco para popular a home
  const [projects, testimonials, services] = await Promise.all([
    prisma.project.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 6
    }),
    prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      take: 5
    }),
    prisma.service.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { order: 'asc' }
    })
  ]);

  return (
    <>
      <HeroSection />
      <CountersSection />
      <ServicosSection initialServices={services} />
      <ProcessoSection />
      <PortfolioPreview initialProjects={projects} />
      <DepoimentosSection initialTestimonials={testimonials} />
      <DiferenciaisSection />
      <CTASection />
      <ContatoSection />
    </>
  );
}