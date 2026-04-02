import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import CountersSection from '@/components/home/CountersSection';
import ServicosSection from '@/components/home/ServicosSection';

const ProcessoSection = dynamic(() => import('@/components/home/ProcessoSection'));
const PortfolioPreview = dynamic(() => import('@/components/home/PortfolioPreview'));
const DepoimentosSection = dynamic(() => import('@/components/home/DepoimentosSection'));
const DiferenciaisSection = dynamic(() => import('@/components/home/DiferenciaisSection'));
const CTASection = dynamic(() => import('@/components/home/CTASection'));
const ContatoSection = dynamic(() => import('@/components/contato/ContatoSection'));

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
  const [projects, testimonials, services, homeContent] = await Promise.all([
    getCachedPublishedProjects(),
    getCachedTestimonials(),
    getCachedServices(),
    getCachedHomeContent(),   
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