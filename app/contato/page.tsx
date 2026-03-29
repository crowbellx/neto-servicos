'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import ContatoSection from '@/components/contato/ContatoSection';

export default function ContatoPage() {
  return (
    <div className="bg-branco min-h-screen">
      {/* Hero */}
      <section className="bg-grafite text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10 text-center">
          <div className="text-sm text-t-white-70 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Início</Link> / Contato
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-titulo font-bold mb-6"
          >
            Fale Conosco
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-t-white-70 max-w-2xl mx-auto"
          >
            Estamos prontos para ouvir sobre o seu projeto.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-16">
        <ContatoSection />
      </div>
    </div>
  );
}
