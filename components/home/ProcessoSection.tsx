'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { MessageSquare, FileText, Paintbrush, Search, Rocket } from 'lucide-react';

export default function ProcessoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const steps = [
    {
      id: 1,
      title: 'Briefing',
      description: 'Você nos conta tudo sobre o projeto, público-alvo, prazos e objetivos.',
      icon: MessageSquare,
    },
    {
      id: 2,
      title: 'Proposta',
      description: 'Elaboramos uma proposta comercial detalhada com valores, prazos e escopo completo.',
      icon: FileText,
    },
    {
      id: 3,
      title: 'Criação',
      description: 'Nossa equipe entra em ação com foco total na qualidade e identidade da sua marca.',
      icon: Paintbrush,
    },
    {
      id: 4,
      title: 'Revisão',
      description: 'Você avalia, pedimos feedback e refinamos até que tudo esteja exatamente como imaginou.',
      icon: Search,
    },
    {
      id: 5,
      title: 'Entrega',
      description: 'Entregamos os arquivos finais ou publicamos online. Suporte pós-entrega incluído.',
      icon: Rocket,
    },
  ];

  return (
    <section id="processo" className="section-py bg-white relative overflow-hidden">
      <div className="container-custom" ref={containerRef}>
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block bg-laranja-light text-laranja px-4 py-1.5 rounded-full text-sm font-bold mb-4"
          >
            Nosso processo
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-titulo font-bold text-t-primary"
          >
            Simples do início ao fim.
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-1 bg-grafite-soft/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-g-marca origin-left"
              style={{ scaleX: pathLength }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-6 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="flex flex-col items-center text-center relative"
              >
                {/* Connecting Line (Mobile) */}
                {index !== steps.length - 1 && (
                  <div className="lg:hidden absolute top-16 bottom-[-48px] left-1/2 -translate-x-1/2 w-1 bg-grafite-soft/10 rounded-full" />
                )}

                <div className="w-16 h-16 rounded-full bg-g-marca flex items-center justify-center text-white font-titulo font-bold text-xl shadow-md mb-6 relative z-10 border-4 border-white">
                  {step.id}
                </div>
                
                <div className="w-12 h-12 rounded-full bg-branco flex items-center justify-center text-t-primary mb-4 shadow-sm">
                  <step.icon size={24} />
                </div>

                <h3 className="text-xl font-titulo font-semibold text-t-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-t-muted leading-relaxed max-w-[240px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
