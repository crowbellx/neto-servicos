import { getCachedProjectBySlug, getCachedPublishedProjects } from '@/lib/data-fetching';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getCachedPublishedProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const project = await getCachedProjectBySlug(slug);

  if (!project) notFound();

  const images = JSON.parse(project.images || '[]');
  const color = project.category === 'Design' ? 'roxo' : project.category === 'Digital' ? 'azul' : 'teal';

  return (
    <div className="bg-branco min-h-screen pb-24">
      <section className="bg-grafite text-white pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-t-white-70 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft size={16} /> Voltar para Portfólio
          </Link>
          <div className="max-w-3xl">
            <div className={`inline-block bg-${color} text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6`}>
              {project.category}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display italic text-white mb-8 leading-tight">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="container-custom -mt-8 relative z-20">
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
           {images[0] && <Image src={images[0]} alt={project.title} fill className="object-cover" priority />}
        </div>
      </div>

      <div className="container-custom mt-16 max-w-4xl">
        <div className="prose prose-lg max-w-none prose-headings:font-titulo text-t-primary" dangerouslySetInnerHTML={{ __html: project.content }} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {images.slice(1).map((img: string, idx: number) => (
            <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
              <Image src={img} alt={`${project.title} gallery ${idx}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}