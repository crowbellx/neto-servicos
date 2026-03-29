'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { projects } from '@/lib/data';

export default function PortfolioPreview() {
  const previewProjects = projects.slice(0, 6);

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
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-t-secondary leading-relaxed"
            >
              Uma amostra do que entregamos para nossos clientes.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center text-roxo font-medium hover:underline underline-offset-4 transition-all"
            >
              Ver portfólio completo →
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {previewProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-grafite-soft/10 shadow-sm cursor-pointer"
            >
              <Link href={`/portfolio/${project.slug}`} className="block w-full h-full">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                  referrerPolicy="no-referrer"
                />
                
                {/* Badge */}
                <div className={`absolute top-4 left-4 bg-${project.color} text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10 shadow-sm`}>
                  {project.category}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-grafite/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 z-20">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <h3 className="text-2xl font-titulo font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-t-white-70 mb-6 line-clamp-2">
                      {project.description}
                    </p>
                    <span className="inline-flex items-center justify-center border border-white/30 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-grafite transition-colors">
                      Ver Case →
                    </span>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/portfolio"
              className="inline-flex bg-transparent border-2 border-roxo text-roxo px-8 py-4 rounded-full font-medium text-center hover:bg-roxo hover:text-white hover:scale-105 active:scale-95 transition-all"
            >
              Ver todos os projetos
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
