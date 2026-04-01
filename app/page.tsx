import HeroSection from '@/components/home/HeroSection';
import CountersSection from '@/components/home/CountersSection';
import ServicosSection from '@/components/home/ServicosSection';
import ProcessoSection from '@/components/home/ProcessoSection';
import PortfolioPreview from '@/components/home/PortfolioPreview';
import DepoimentosSection from '@/components/home/DepoimentosSection';
import DiferenciaisSection from '@/components/home/DiferenciaisSection';
import CTASection from '@/components/home/CTASection';
import ContatoSection from '@/components/contato/ContatoSection';
import { 
  getCachedPublishedProjects, 
  getCachedPublishedPosts,
  getCachedHomeContent,
  TAGS
} from '@/lib/data-fetching';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export const revalidate = 3600;

const getCachedTestimonials = unstable_cache(
  async () => prisma.testimonial.findMany({ 
    where: { active: true }, 
    orderBy: { createdAt: 'desc' }, 
    take: 5 
  }),
  ['home-testimonials'],
  { tags: ['testimonials'], revalidate: 3600 }
);

const getCachedServices = unstable_cache(
  async () => prisma.service.findMany({ 
    where: { status: 'ACTIVE' }, 
    orderBy: { order: 'asc' } 
  }),
  ['home-services'],
  { tags: [TAGS.SERVICES], revalidate: 3600 }
);

export default async function Home() {
  // Busca todos os dados em paralelo — single round-trip conceitual, cacheado 1h
  const [projects, testimonials, services, homeContent] = await Promise.all([
    getCachedPublishedProjects(),
    getCachedTestimonials(),
    getCachedServices(),
    getCachedHomeContent(),   // ← seções editáveis via admin
  ]);

  return (
    <>
      <HeroSection data={homeContent.hero} />
      <CountersSection data={homeContent.counters} />
      <ServicosSection initialServices={services} />
      <ProcessoSection data={homeContent.processo} />
      <PortfolioPreview initialProjects={projects} />
      <DepoimentosSection initialTestimonials={testimonials} />
      <DiferenciaisSection data={homeContent.diferenciais} />
      <CTASection data={homeContent.cta} />
      <ContatoSection data={homeContent.contato} />
    </>
  );
}