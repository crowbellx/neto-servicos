'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-branco min-h-screen flex items-center justify-center py-20">
      <div className="container-custom text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="w-32 h-32 bg-laranja-light text-laranja rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
        >
          <FileQuestion size={64} />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-titulo font-extrabold text-t-primary mb-4 tracking-tighter"
        >
          404
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-titulo font-bold text-t-secondary mb-6"
        >
          Página não encontrada.
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-t-muted mb-12 leading-relaxed"
        >
          A página que você procura pode ter sido movida, renomeada ou não existe mais.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="bg-laranja text-white px-8 py-4 rounded-full font-bold hover:bg-[#D4651A] hover:scale-105 active:scale-95 transition-all shadow-cor w-full sm:w-auto"
          >
            Voltar para o início
          </Link>
          <Link
            href="/portfolio"
            className="bg-transparent border-2 border-roxo text-roxo px-8 py-4 rounded-full font-bold hover:bg-roxo-light hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
          >
            Ir para o portfólio
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
