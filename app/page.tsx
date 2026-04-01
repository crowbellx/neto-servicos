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
  TAGS
} from '@/lib/data-fetching';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export const revalidate = 3600;

// Adding specific home-view caches
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
  async () => prisma.service.findMany({ where: { status: 'ACTIVE' }, orderBy: { order: 'asc' } }),
  ['home-services'],
  { tags: [TAGS.SERVICES], revalidate: 3600 }
);

const getCachedHomePageData = unstable_cache(
  async () => prisma.page.findFirst({ where: { slug: '/', status: 'PUBLISHED' } }),
  ['home-page-data'],
  { tags: ['pages'], revalidate: 3600 }
);

export default async function Home() {
  const [projects, testimonials, services, pageData] = await Promise.all([
    getCachedPublishedProjects(),
    getCachedTestimonials(),
    getCachedServices(),
    getCachedHomePageData()
  ]);

  return (
    <>
      <HeroSection />
      <CountersSection />
      
      {/* Se houver conteúdo customizado para a Home no Admin, renderiza aqui */}
      {pageData?.content && (
        <section className="py-16 bg-white">
          <div className="container-custom prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: pageData.content }} />
        </section>
      )}

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