'use client';

import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

const Counter = ({ end, suffix = '', label }: { end: number; suffix?: string; label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000; // 2 seconds
      const increment = end / (duration / 16); // 60fps

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center text-center">
      <div className="font-titulo font-extrabold text-5xl text-laranja mb-2 flex items-baseline">
        {count === end && suffix === '+' && <span className="text-3xl mr-1">+</span>}
        {count}
        {count === end && suffix === '%' && <span className="text-3xl ml-1">%</span>}
      </div>
      <div className="text-sm text-t-white-70 font-corpo max-w-[120px] leading-snug">
        {label}
      </div>
    </div>
  );
};

export default function CountersSection() {
  const counters = [
    { end: 200, suffix: '+', label: 'Projetos entregues' },
    { end: 8, suffix: '+', label: 'Anos no mercado de experiência' },
    { end: 98, suffix: '%', label: 'Clientes satisfeitos' },
    { end: 50, suffix: '+', label: 'Cidades atendidas' },
  ];

  return (
    <section id="numeros" className="bg-grafite py-16 lg:py-24 relative overflow-hidden">
      <div className="container-custom grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {counters.map((counter, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Counter end={counter.end} suffix={counter.suffix} label={counter.label} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
