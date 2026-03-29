'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function DepoimentosSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Mariana Silva',
      role: 'CEO',
      company: 'TechCorp',
      service: 'Design',
      color: 'roxo',
      avatar: 'https://picsum.photos/seed/mariana/100/100',
      text: 'A Neto Serviços transformou a identidade da nossa empresa. O processo foi super transparente e o resultado final superou todas as expectativas. Recomendo de olhos fechados!',
    },
    {
      id: 2,
      name: 'Carlos Mendes',
      role: 'Diretor de Marketing',
      company: 'Moda Viva',
      service: 'Digital',
      color: 'azul',
      avatar: 'https://picsum.photos/seed/carlos/100/100',
      text: 'Nossa nova loja virtual está voando! A equipe entendeu perfeitamente a nossa necessidade de performance e design. As vendas aumentaram 40% no primeiro mês.',
    },
    {
      id: 3,
      name: 'Ana Paula',
      role: 'Fundadora',
      company: 'Café Premium',
      service: 'Gráfica',
      color: 'teal',
      avatar: null,
      text: 'A qualidade da impressão das nossas embalagens é impecável. Eles cuidaram de cada detalhe, desde a escolha do papel até o acabamento. Nossos clientes sempre elogiam.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isHovered, testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="depoimentos" className="section-py bg-grafite relative overflow-hidden">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block bg-grafite-mid text-t-white-70 px-4 py-1.5 rounded-full text-sm font-bold mb-4"
          >
            Quem fez, aprovou
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-titulo font-bold text-white mb-6"
          >
            O que nossos clientes dizem.
          </motion.h2>
        </div>

        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative h-[300px] md:h-[250px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-grafite-mid rounded-3xl p-8 md:p-12 shadow-lg border border-white/5 flex flex-col justify-center items-center text-center"
              >
                <div className="flex items-center gap-4 mb-6">
                  {testimonials[currentIndex].avatar ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
                      <Image
                        src={testimonials[currentIndex].avatar}
                        alt={testimonials[currentIndex].name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-full bg-${testimonials[currentIndex].color} flex items-center justify-center text-white font-bold text-xl`}>
                      {testimonials[currentIndex].name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left">
                    <div className="font-titulo font-semibold text-white text-lg">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-sm text-t-white-70">
                      {testimonials[currentIndex].role} · {testimonials[currentIndex].company}
                    </div>
                  </div>
                  <div className={`ml-4 bg-${testimonials[currentIndex].color} text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}>
                    {testimonials[currentIndex].service}
                  </div>
                </div>

                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className="fill-ambar text-ambar" />
                  ))}
                </div>

                <p className="font-display italic text-xl md:text-2xl text-t-white-70 leading-relaxed max-w-2xl">
                  &quot;{testimonials[currentIndex].text}&quot;
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows (visible on hover) */}
          <button
            onClick={handlePrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white text-grafite rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all z-10 ${isHovered ? 'opacity-100' : 'opacity-0'} hidden md:flex`}
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 bg-white text-grafite rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all z-10 ${isHovered ? 'opacity-100' : 'opacity-0'} hidden md:flex`}
            aria-label="Próximo"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-laranja w-8' : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Ir para depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
