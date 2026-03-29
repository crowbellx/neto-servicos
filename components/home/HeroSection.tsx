'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowDown } from 'lucide-react';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden bg-branco">
      {/* Background Gradients & Patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(123,45,139,0.06)_0%,transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMxQTFBMkUiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50" />
      </div>

      <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.div variants={itemVariants} className="mb-8 inline-flex items-center gap-2 bg-laranja-light text-laranja px-4 py-1.5 rounded-full text-sm font-bold">
            <Star size={16} className="fill-current" />
            <span>Gráfica · Design · Digital</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-[72px] leading-[1.1] font-titulo font-extrabold text-t-primary mb-6 tracking-tight">
            <motion.div variants={itemVariants}>Do físico ao</motion.div>
            <motion.div variants={itemVariants} className="font-display italic text-[80px] text-laranja leading-[0.9] my-2">
              digital.
            </motion.div>
            <motion.div variants={itemVariants}>Em um só lugar.</motion.div>
          </h1>

          <motion.p variants={itemVariants} className="text-lg text-t-secondary max-w-[520px] mb-10 leading-relaxed">
            Gráfica, design e tecnologia integrados para construir a identidade completa da sua marca — do cartão de visita à loja virtual.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="#contato"
              className="bg-laranja text-white px-8 py-4 rounded-full font-medium text-center hover:bg-[#D4651A] hover:scale-105 active:scale-95 transition-all shadow-cor"
            >
              Solicitar Orçamento Grátis →
            </Link>
            <Link
              href="/portfolio"
              className="bg-transparent border-2 border-roxo text-roxo px-8 py-4 rounded-full font-medium text-center hover:bg-roxo-light hover:scale-105 active:scale-95 transition-all"
            >
              Ver Portfólio
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative w-10 h-10 rounded-full border-2 border-branco bg-grafite-soft overflow-hidden">
                  <Image src={`https://picsum.photos/seed/avatar${i}/100/100`} alt="Avatar" fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <div className="text-sm text-t-muted font-medium">
              +200 projetos entregues · <span className="text-ambar">★★★★★</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Visual Elements (Desktop Only) */}
        <div className="hidden lg:block relative h-[600px] w-full perspective-1000">
          <motion.div
            animate={{ y: [-10, 10, -10], rotateY: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 left-10 w-64 h-40 bg-white rounded-xl shadow-xl border border-black/5 p-4 flex flex-col justify-between"
          >
            <div className="w-12 h-12 bg-teal-light rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-teal rounded-sm" />
            </div>
            <div>
              <div className="h-3 w-24 bg-grafite-soft/10 rounded-full mb-2" />
              <div className="h-2 w-16 bg-grafite-soft/10 rounded-full" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10], rotateY: [5, -5, 5] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-20 right-10 w-48 h-80 bg-grafite rounded-3xl shadow-2xl border-4 border-grafite-mid p-2 overflow-hidden"
          >
            <div className="w-full h-full bg-white rounded-2xl p-4">
              <div className="flex justify-between items-center mb-6">
                <div className="w-8 h-8 bg-azul-light rounded-full" />
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-t-muted rounded-full" />
                  <div className="w-1 h-1 bg-t-muted rounded-full" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-24 bg-azul-light rounded-xl" />
                <div className="h-4 w-3/4 bg-grafite-soft/10 rounded-full" />
                <div className="h-4 w-1/2 bg-grafite-soft/10 rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.a
        href="#numeros"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-t-muted hover:text-laranja transition-colors"
      >
        <ArrowDown size={24} />
      </motion.a>
    </section>
  );
}
