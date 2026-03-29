'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { projects } from '@/lib/data';

export default function PortfolioPage() {
  const [filter, setFilter] = useState('Todos');

  const filteredProjects = filter === 'Todos' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="bg-branco min-h-screen">
      {/* Hero */}
      <section className="bg-grafite text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10 text-center">
          <div className="text-sm text-t-white-70 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Início</Link> / Portfólio
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-titulo font-bold mb-6"
          >
            Nosso Portfólio
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-t-white-70 max-w-2xl mx-auto"
          >
            Trabalhos que falam por si.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <div className="container-custom py-12">
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {['Todos', 'Gráfica', 'Design', 'Digital'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === cat
                  ? 'bg-laranja text-white shadow-md'
                  : 'bg-grafite-soft/5 text-t-secondary hover:bg-grafite-soft/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
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
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
