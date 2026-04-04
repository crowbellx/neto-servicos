'use client';

import { motion } from 'motion/react';
import { MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import FormContato from './FormContato';

type ContatoData = {
  whatsapp?: string;
  email?: string;
  address?: string;
  hours?: string;
} | null;

const DEFAULTS = {
  whatsapp: '(11) 99999-9999',
  email: 'contato@netoservicos.com.br',
  address: 'Rua Exemplo, 123 - Centro',
  hours: 'Seg–Sex 8h–18h | Sáb 8h–12h',
};

export default function ContatoSection({ data }: { data?: ContatoData }) {
  const d = { ...DEFAULTS, ...data };

  const contactCards = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      info: d.whatsapp,
      desc: 'Respondemos em até 1h',
      color: 'text-[#25D366]',
      hoverBorder: 'hover:border-l-[#25D366]',
    },
    {
      icon: Mail,
      title: 'E-mail',
      info: d.email,
      desc: 'Respondemos em até 24h',
      color: 'text-laranja',
      hoverBorder: 'hover:border-l-laranja',
    },
    {
      icon: MapPin,
      title: 'Endereço',
      info: d.address,
      desc: 'Atendimento presencial com hora marcada',
      color: 'text-roxo',
      hoverBorder: 'hover:border-l-roxo',
    },
    {
      icon: Clock,
      title: 'Horário',
      info: d.hours?.split('|')[0]?.trim() || d.hours,
      desc: d.hours?.split('|')[1]?.trim() || '',
      color: 'text-azul',
      hoverBorder: 'hover:border-l-azul',
    },
  ];

  return (
    <section id="contato" className="section-py bg-branco relative">
      <div className="container-custom grid lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left Column: Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-titulo font-bold text-t-primary mb-6">
            Vamos conversar?
          </h2>
          <p className="text-lg text-t-secondary mb-12 leading-relaxed">
            Preencha o formulário ou use um dos canais abaixo.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {contactCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`bg-white rounded-xl p-6 shadow-sm border border-black/5 border-l-4 border-l-transparent transition-all hover:bg-grafite-soft/5 ${card.hoverBorder} group cursor-pointer`}
              >
                <card.icon size={28} className={`${card.color} mb-4`} />
                <h4 className="font-titulo font-bold text-t-primary mb-1">{card.title}</h4>
                <div className="text-sm font-medium text-t-secondary mb-1">{card.info}</div>
                <div className="text-xs text-t-muted">{card.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* Map Embed */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-black/5 h-[240px] relative bg-grafite-soft/10">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(d.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização"
            />
          </div>
        </motion.div>

        {/* Right Column: Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FormContato />
        </motion.div>
      </div>
    </section>
  );
}
