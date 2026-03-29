'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Target, Eye, Heart } from 'lucide-react';

export default function SobrePage() {
  const valores = [
    {
      icon: Target,
      title: 'Missão',
      desc: 'Simplificar a comunicação das empresas, oferecendo soluções integradas de gráfica, design e tecnologia com excelência e agilidade.',
      color: 'text-teal',
      bg: 'bg-teal-light',
    },
    {
      icon: Eye,
      title: 'Visão',
      desc: 'Ser a principal parceira estratégica de negócios no Brasil, reconhecida por transformar ideias em resultados reais do físico ao digital.',
      color: 'text-roxo',
      bg: 'bg-roxo-light',
    },
    {
      icon: Heart,
      title: 'Valores',
      desc: 'Transparência nas relações, compromisso com prazos, criatividade com propósito e foco absoluto no sucesso do cliente.',
      color: 'text-laranja',
      bg: 'bg-laranja-light',
    },
  ];

  const equipe = [
    { name: 'João Neto', role: 'Fundador & CEO', tags: ['Estratégia', 'Vendas'], image: 'https://picsum.photos/seed/joao/400/400' },
    { name: 'Maria Silva', role: 'Diretora de Arte', tags: ['Design', 'Branding'], image: 'https://picsum.photos/seed/maria/400/400' },
    { name: 'Pedro Santos', role: 'Tech Lead', tags: ['Web', 'Sistemas'], image: 'https://picsum.photos/seed/pedro/400/400' },
    { name: 'Ana Costa', role: 'Gerente de Produção', tags: ['Gráfica', 'Logística'], image: 'https://picsum.photos/seed/ana/400/400' },
  ];

  return (
    <div className="bg-branco min-h-screen">
      {/* Hero */}
      <section className="bg-grafite text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10 text-center">
          <div className="text-sm text-t-white-70 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Início</Link> / Sobre Nós
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-titulo font-bold mb-6"
          >
            Nossa História
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-t-white-70 max-w-2xl mx-auto"
          >
            Conheça quem faz a Neto Serviços acontecer.
          </motion.p>
        </div>
      </section>

      {/* História */}
      <section id="sobre" className="section-py container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block bg-laranja-light text-laranja px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              Nossa história
            </div>
            <h2 className="text-4xl lg:text-5xl font-titulo font-bold text-t-primary mb-6">
              Nascemos da necessidade de simplificar.
            </h2>
            <div className="space-y-4 text-lg text-t-secondary leading-relaxed">
              <p>
                Tudo começou quando percebemos a dificuldade que as empresas tinham em coordenar diferentes fornecedores. A gráfica atrasava, o designer não entendia o desenvolvedor, e o site não conversava com o material impresso.
              </p>
              <p>
                A Neto Serviços e Soluções nasceu para acabar com essa dor de cabeça. Reunimos especialistas de três áreas fundamentais — Gráfica, Design e Desenvolvimento Digital — sob o mesmo teto.
              </p>
              <p>
                Hoje, somos mais que prestadores de serviço; somos parceiros estratégicos. Cuidamos de toda a sua comunicação, garantindo que a sua marca tenha uma identidade forte e coerente, seja em um cartão de visita entregue em mãos ou em uma loja virtual acessada do outro lado do mundo.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[500px] rounded-3xl overflow-hidden shadow-xl"
          >
            <Image
              src="https://picsum.photos/seed/escritorio/800/1000"
              alt="Nosso Escritório"
              fill
              className="object-cover"
              sizes="(max-w-1024px) 100vw, 50vw"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Missão, Visão, Valores */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {valores.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-black/5"
            >
              <div className={`w-16 h-16 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-6`}>
                <item.icon size={32} />
              </div>
              <h3 className="text-2xl font-titulo font-bold text-t-primary mb-4">{item.title}</h3>
              <p className="text-t-secondary leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Equipe */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-titulo font-bold text-t-primary mb-4">Nossa Equipe</h2>
          <p className="text-lg text-t-secondary">Os talentos por trás dos nossos projetos.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {equipe.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 text-center group"
            >
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-titulo font-bold text-t-primary mb-1">{member.name}</h3>
              <p className="text-sm text-t-muted mb-4">{member.role}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {member.tags.map((tag, i) => (
                  <span key={i} className="bg-grafite-soft/5 text-t-secondary px-3 py-1 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
