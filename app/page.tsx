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

export const revalidate = 60;

export default async function Home() {
  let projects: any[] = [];
  let testimonials: any[] = [];
  let services: any[] = [];
  let pageData: any = null;

  try {
    const [fetchedProjects, fetchedTestimonials, fetchedServices, fetchedPageData] = await Promise.all([
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
      }),
      prisma.page.findFirst({
        where: { slug: '/', status: 'PUBLISHED' }
      })
    ]);
    projects = fetchedProjects;
    testimonials = fetchedTestimonials;
    services = fetchedServices;
    pageData = fetchedPageData;
  } catch (error) {
    console.error('[Build] Erro ao buscar dados da Home:', error);
  }

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