'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Printer, MousePointerClick, Monitor } from 'lucide-react';

interface ServicosSectionProps {
  initialServices?: any[];
}

const ICON_MAP: Record<string, any> = {
  'Gráfica': Printer,
  'Design': MousePointerClick,
  'Digital': Monitor,
};

const COLOR_MAP: Record<string, string> = {
  'Gráfica': 'teal',
  'Design': 'roxo',
  'Digital': 'azul',
};

const FALLBACK_SERVICES = [
  { id: 'f1', slug: 'grafica', title: 'Gráfica', category: 'Gráfica', description: 'Impressão de alta qualidade, banners, cartões e materiais promocionais com acabamento premium.' },
  { id: 'f2', slug: 'design', title: 'Design', category: 'Design', description: 'Identidade visual, logotipos e design estratégico para destacar sua empresa no mercado.' },
  { id: 'f3', slug: 'digital', title: 'Digital', category: 'Digital', description: 'Criação de sites modernos, e-commerces e presença digital completa para o seu negócio.' },
];

export default function ServicosSection({ initialServices = [] }: ServicosSectionProps) {
  // Se não vier nada do banco, usamos os fallbacks para o site não ficar feio
  const servicesToDisplay = initialServices.length > 0 ? initialServices.slice(0, 3) : FALLBACK_SERVICES;

  return (
    <section id="servicos" className="section-py bg-branco relative">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block bg-laranja-light text-laranja px-4 py-1.5 rounded-full text-sm font-bold mb-4"
          >
            Por que Neto?
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-titulo font-bold text-t-primary mb-6"
          >
            Uma empresa. Três especialidades.
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {servicesToDisplay.map((service, index) => {
            const Icon = ICON_MAP[service.category] || Printer;
            const color = COLOR_MAP[service.category] || 'laranja';
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-black/5 relative overflow-hidden group transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-xl bg-${color}-light text-${color} flex items-center justify-center mb-8`}>
                  <Icon size={32} />
                </div>

                <h3 className="text-2xl font-titulo font-bold text-t-primary mb-4">{service.title}</h3>
                <p className="text-t-secondary mb-8 leading-relaxed line-clamp-3">
                  {service.description}
                </p>

                <Link
                  href={`/servicos#${service.slug}`}
                  className={`inline-flex items-center text-${color} font-medium hover:underline underline-offset-4 transition-all`}
                >
                  Ver detalhes →
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}