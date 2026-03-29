'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Printer, MousePointerClick, Monitor, Check } from 'lucide-react';

export default function ServicosSection() {
  const cards = [
    {
      id: '01',
      title: 'Gráfica',
      description: 'Materiais impressos com qualidade profissional. Do banner de 3 metros ao cartão de visita mais sofisticado.',
      icon: Printer,
      color: 'teal',
      items: [
        'Impressão digital e offset',
        'Banners, lonas e adesivos',
        'Papelaria corporativa completa',
        'Embalagens personalizadas',
        'Brindes e uniformes',
      ],
      link: '/servicos#grafica',
      linkText: 'Ver serviços de Gráfica →',
      shadowColor: 'rgba(27,158,122,0.18)',
    },
    {
      id: '02',
      title: 'Design',
      description: 'Identidade visual que comunica o que sua empresa é e onde quer chegar. Do logo à campanha completa.',
      icon: MousePointerClick,
      color: 'roxo',
      items: [
        'Criação de logotipos',
        'Manual de identidade visual',
        'Material de marketing',
        'Social media e conteúdo',
        'Design de embalagem',
      ],
      link: '/servicos#design',
      linkText: 'Ver serviços de Design →',
      shadowColor: 'rgba(123,45,139,0.18)',
    },
    {
      id: '03',
      title: 'Desenvolvimento Digital',
      description: 'Presença online que gera resultado. Sites, lojas virtuais e sistemas feitos para converter visitantes em clientes.',
      icon: Monitor,
      color: 'azul',
      items: [
        'Sites institucionais',
        'Lojas virtuais (e-commerce)',
        'Sistemas web sob medida',
        'Manutenção e hospedagem',
        'SEO e performance',
      ],
      link: '/servicos#digital',
      linkText: 'Ver serviços Digitais →',
      shadowColor: 'rgba(26,95,158,0.18)',
    },
  ];

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
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-t-secondary leading-relaxed"
          >
            Chega de contratar gráfica aqui, designer ali e desenvolvedor acolá. Aqui você encontra tudo integrado, com uma equipe única.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const }}
              whileHover={{ y: -8, boxShadow: `0 16px 48px ${card.shadowColor}` }}
              className={`bg-white rounded-2xl p-8 shadow-sm border border-black/5 relative overflow-hidden group transition-all duration-300`}
              style={{ borderTop: `3px solid transparent` }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderTopColor = `var(--color-${card.color})`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderTopColor = 'transparent';
              }}
            >
              <div className="absolute top-4 right-4 font-titulo font-extrabold text-[80px] leading-none opacity-5 text-t-primary pointer-events-none select-none">
                {card.id}
              </div>
              
              <div className={`w-16 h-16 rounded-xl bg-${card.color}-light text-${card.color} flex items-center justify-center mb-8`}>
                <card.icon size={32} />
              </div>

              <h3 className="text-2xl font-titulo font-bold text-t-primary mb-4">{card.title}</h3>
              <p className="text-t-secondary mb-8 leading-relaxed min-h-[80px]">
                {card.description}
              </p>

              <ul className="space-y-4 mb-10 min-h-[200px]">
                {card.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={20} className={`text-${card.color} shrink-0 mt-0.5`} />
                    <span className="text-sm text-t-secondary">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={card.link}
                className={`inline-flex items-center text-${card.color} font-medium hover:underline underline-offset-4 transition-all`}
              >
                {card.linkText}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
