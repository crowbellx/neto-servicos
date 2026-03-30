'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

export default function PortfolioClient({ initialProjects }: { initialProjects: any[] }) {
  const [filter, setFilter] = useState('Todos');
  const categories = ['Todos', ...Array.from(new Set(initialProjects.map(p => p.category)))];

  const filteredProjects = filter === 'Todos' 
    ? initialProjects 
    : initialProjects.filter(p => p.category === filter);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {categories.map((cat) => (
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

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-grafite-soft/10 shadow-sm"
            >
              <Link href={`/portfolio/${project.slug}`} className="block w-full h-full">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className={`absolute top-4 left-4 bg-${project.color} text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10 shadow-sm`}>
                  {project.category}
                </div>
                <div className="absolute inset-0 bg-grafite/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 z-20">
                  <h3 className="text-2xl font-titulo font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-sm text-t-white-70 mb-6 line-clamp-2">{project.description}</p>
                  <span className="inline-flex items-center justify-center border border-white/30 text-white px-6 py-2 rounded-full text-sm font-medium">Ver Case →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}