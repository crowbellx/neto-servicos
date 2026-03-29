'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function DiferenciaisSection() {
  const diferenciais = [
    'Tudo em um só lugar — sem intermediários ou retrabalho',
    'Equipe multidisciplinar com anos de experiência real',
    'Prazo cumprido: assumimos o compromisso e honramos',
    'Do briefing à entrega, você acompanha tudo',
    'Atendimento personalizado, sem tickets e sem robôs',
    'Revisões incluídas no processo, sem custo extra',
    'Suporte pós-entrega para dúvidas e ajustes',
  ];

  return (
    <section id="diferenciais" className="section-py bg-branco relative">
      <div className="container-custom grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-roxo-light text-roxo px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            Nossos diferenciais
          </div>
          <h2 className="text-4xl lg:text-5xl font-titulo font-bold text-t-primary mb-8">
            Mais do que serviços. Uma parceria.
          </h2>
          
          <ul className="space-y-4 mb-10">
            {diferenciais.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 size={24} className="text-roxo shrink-0 mt-0.5" />
                <span className="text-t-secondary leading-relaxed">{item}</span>
              </motion.li>
            ))}
          </ul>

          <Link
            href="/sobre"
            className="inline-flex items-center text-roxo font-medium hover:underline underline-offset-4 transition-all"
          >
            Conheça nossa história →
          </Link>
        </motion.div>

        {/* Right Content (Image) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-xl"
        >
          <Image
            src="https://picsum.photos/seed/equipe/800/1000"
            alt="Nossa Equipe"
            fill
            className="object-cover"
            sizes="(max-w-1024px) 100vw, 50vw"
            referrerPolicy="no-referrer"
          />
          
          {/* Floating Card */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-10 left-10 bg-white p-6 rounded-2xl shadow-lg border border-black/5 flex items-center gap-4 max-w-[280px]"
          >
            <div className="w-12 h-12 bg-ambar/20 rounded-full flex items-center justify-center text-ambar text-2xl">
              ★
            </div>
            <div>
              <div className="font-titulo font-bold text-t-primary text-lg">Nota 5.0</div>
              <div className="text-sm text-t-muted">Média de avaliações dos nossos clientes</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
