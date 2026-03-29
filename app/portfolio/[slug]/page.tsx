'use client';

import { useParams, notFound } from 'next/navigation';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { projects } from '@/lib/data';

export default function CasePage() {
  const params = useParams();
  const slug = params?.slug as string;

  if (!slug) {
    return null; // Wait for params to be populated
  }

  const project = projects.find(p => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-branco min-h-screen pb-24">
      {/* Header */}
      <section className="bg-grafite text-white pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-t-white-70 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft size={16} />
            Voltar para Portfólio
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className={`inline-block bg-${project.color} text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6`}>
                {project.category}
              </div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl lg:text-6xl font-display italic text-white mb-8 leading-tight"
              >
                {project.title}
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-t-white-70"
              >
                <div>
                  <span className="block text-white/50 mb-1">Cliente</span>
                  <span className="font-medium text-white">{project.client}</span>
                </div>
                <div>
                  <span className="block text-white/50 mb-1">Ano</span>
                  <span className="font-medium text-white">{project.year}</span>
                </div>
                <div>
                  <span className="block text-white/50 mb-1">Serviços</span>
                  <span className="font-medium text-white">{project.services}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative w-full h-[40vh] md:h-[60vh] -mt-8 z-20 container-custom"
      >
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>

      {/* Content */}
      <div className="container-custom mt-16 lg:mt-24">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-2 space-y-8">
            {project.gallery.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5 }}
                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-grafite-soft/5"
              >
                <Image
                  src={img}
                  alt={`Galeria ${index + 1}`}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-1 space-y-12 lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-titulo font-bold text-t-primary mb-4">Sobre o Projeto</h3>
              <p className="text-t-secondary leading-relaxed">{project.about}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-2xl font-titulo font-bold text-t-primary mb-4">O Desafio</h3>
              <p className="text-t-secondary leading-relaxed">{project.challenge}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-titulo font-bold text-t-primary mb-4">A Solução</h3>
              <p className="text-t-secondary leading-relaxed">{project.solution}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-titulo font-bold text-t-primary mb-4">O Resultado</h3>
              <p className="text-t-secondary leading-relaxed">{project.result}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-sm font-titulo font-bold text-t-muted uppercase tracking-wider mb-4">Tecnologias & Ferramentas</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className="bg-grafite-soft/5 text-t-secondary px-3 py-1.5 rounded-md text-xs font-medium border border-black/5">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className={`bg-${project.color}-light p-8 rounded-2xl text-center mt-12`}
            >
              <h4 className={`text-xl font-titulo font-bold text-${project.color} mb-4`}>Quer um projeto assim?</h4>
              <Link
                href="/contato"
                className={`inline-block bg-${project.color} text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform shadow-md`}
              >
                Fale Conosco →
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
