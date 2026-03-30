import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Printer, MousePointerClick, Monitor } from 'lucide-react';

export const revalidate = 60;

const ICON_MAP: Record<string, any> = {
  'Gráfica': Printer,
  'Design': MousePointerClick,
  'Digital': Monitor,
};

export default async function ServicosPage() {
  const services = await prisma.service.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { order: 'asc' }
  });

  return (
    <div className="bg-branco min-h-screen">
      <section className="bg-grafite text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-5xl lg:text-6xl font-titulo font-bold mb-6">Nossos Serviços</h1>
          <p className="text-xl text-t-white-70 max-w-2xl mx-auto">Soluções integradas para sua marca.</p>
        </div>
      </section>

      <div className="container-custom py-24 space-y-32">
        {services.map((s) => {
          const Icon = ICON_MAP[s.category] || Printer;
          return (
            <section key={s.id} id={s.slug} className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-laranja/10 text-laranja rounded-2xl"><Icon size={32} /></div>
                <h2 className="text-4xl font-titulo font-bold text-t-primary">{s.title}</h2>
              </div>
              <p className="text-xl text-t-secondary mb-12 max-w-3xl leading-relaxed">{s.description}</p>
              <div className="bg-gray-50 rounded-3xl p-12 text-center">
                <Link href="/contato" className="bg-laranja text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-lg">Solicitar Orçamento</Link>
              </div>
            </section>
          );
        })}
        {!services.length && <p className="text-center text-gray-500 py-20">Nenhum serviço disponível no momento.</p>}
      </div>
    </div>
  );
}