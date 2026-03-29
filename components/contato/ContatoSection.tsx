'use client';

import { motion } from 'motion/react';
import { MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import FormContato from './FormContato';

export default function ContatoSection() {
  const contactCards = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      info: '(11) 99999-9999',
      desc: 'Respondemos em até 1h',
      color: 'text-[#25D366]',
      hoverBorder: 'hover:border-l-[#25D366]',
    },
    {
      icon: Mail,
      title: 'E-mail',
      info: 'contato@netoservicos.com.br',
      desc: 'Respondemos em até 24h',
      color: 'text-laranja',
      hoverBorder: 'hover:border-l-laranja',
    },
    {
      icon: MapPin,
      title: 'Endereço',
      info: 'Rua Exemplo, 123 - Centro',
      desc: 'Atendimento presencial com hora marcada',
      color: 'text-roxo',
      hoverBorder: 'hover:border-l-roxo',
    },
    {
      icon: Clock,
      title: 'Horário',
      info: 'Seg–Sex 8h–18h',
      desc: 'Sáb 8h–12h',
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197368558778!2d-46.65888892466981!3d-23.56133746158529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização"
            ></iframe>
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
