'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, User } from 'lucide-react';

export default function DepoimentosSection({ initialTestimonials = [] }: { initialTestimonials: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!initialTestimonials.length) return null;

  const current = initialTestimonials[currentIndex];

  return (
    <section className="section-py bg-grafite relative overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-titulo font-bold text-white">O que nossos clientes dizem</h2>
        </div>

        <div className="relative max-w-4xl mx-auto h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute inset-0 bg-grafite-mid rounded-3xl p-8 md:p-12 border border-white/5 flex flex-col items-center text-center"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                  {current.avatar ? <Image src={current.avatar} alt={current.name} width={64} height={64} className="object-cover" /> : <User size={32} className="text-gray-500" />}
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">{current.name}</div>
                  <div className="text-sm text-t-white-70">{current.role} @ {current.company}</div>
                </div>
              </div>
              <div className="flex gap-1 mb-6">
                {Array.from({ length: current.rating }).map((_, i) => <Star key={i} size={16} className="fill-ambar text-ambar" />)}
              </div>
              <p className="italic text-xl text-t-white-70 leading-relaxed">&quot;{current.text}&quot;</p>
            </motion.div>
          </AnimatePresence>

          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
             <button onClick={() => setCurrentIndex((v) => (v - 1 + initialTestimonials.length) % initialTestimonials.length)} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20"><ChevronLeft /></button>
             <button onClick={() => setCurrentIndex((v) => (v + 1) % initialTestimonials.length)} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20"><ChevronRight /></button>
          </div>
        </div>
      </div>
    </section>
  );
}