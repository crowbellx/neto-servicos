'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { MessageCircle, Mail } from 'lucide-react';

export default function CTASection() {
  return (
    <section id="cta" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0 bg-grafite">
        <div className="absolute inset-0 bg-g-marca opacity-90 mix-blend-multiply" />
      </div>

      <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl lg:text-6xl font-titulo font-extrabold text-white mb-6 leading-tight"
        >
          Pronto para levar sua marca ao próximo nível?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-t-white-70 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Fale com a gente hoje. Orçamento gratuito e sem compromisso.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a
            href="https://wa.me/5511999999999?text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20um%20orçamento."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white text-grafite px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto justify-center shadow-lg"
          >
            <MessageCircle size={24} className="text-[#25D366]" />
            Solicitar Orçamento pelo WhatsApp
          </a>

          <Link
            href="#contato"
            className="flex items-center gap-3 bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all w-full sm:w-auto justify-center"
          >
            <Mail size={24} />
            Ou envie um e-mail →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
