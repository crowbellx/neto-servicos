'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

export default function PortfolioPreview({ initialProjects = [] }: { initialProjects: any[] }) {
  return (
    <section id="portfolio-preview" className="section-py bg-branco relative">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 lg:mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-titulo font-bold text-t-primary mb-6"
            >
              Trabalhos que falam por si.
            </motion.h2>
          </div>
          <Link href="/portfolio" className="text-roxo font-medium hover:underline">Ver completo →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {initialProjects.map((project, index) => {
            const images = JSON.parse(project.images || '[]');
            const cover = images[0] || 'https://picsum.photos/seed/placeholder/800/600';
            const color = project.category === 'Design' ? 'roxo' : project.category === 'Digital' ? 'azul' : 'teal';

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-grafite-soft/10 shadow-sm"
              >
                <Link href={`/portfolio/${project.slug}`} className="block w-full h-full">
                  <Image src={cover} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className={`absolute top-4 left-4 bg-${color} text-white px-3 py-1 rounded-full text-xs font-bold uppercase z-10`}>
                    {project.category}
                  </div>
                  <div className="absolute inset-0 bg-grafite/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 z-20">
                    <h3 className="text-2xl font-titulo font-bold text-white mb-2">{project.title}</h3>
                    <span className="text-white text-sm">Ver Case →</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}