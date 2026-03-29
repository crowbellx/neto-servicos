'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Printer, MousePointerClick, Monitor, Check } from 'lucide-react';

export default function ServicosPage() {
  const servicos = [
    {
      id: 'grafica',
      title: 'Gráfica',
      description: 'Qualidade gráfica que impressiona.',
      icon: Printer,
      color: 'teal',
      items: [
        { name: 'Impressão Digital', desc: 'Folhetos, flyers, cartazes em alta resolução' },
        { name: 'Impressão Offset', desc: 'Para grandes tiragens com custo otimizado' },
        { name: 'Banners e Lonas', desc: 'Comunicação visual de impacto' },
        { name: 'Papelaria Corporativa', desc: 'Cartões, envelopes, pastas, blocos' },
        { name: 'Embalagens', desc: 'Design e impressão de caixas e rótulos' },
        { name: 'Adesivos e Vinil', desc: 'Recorte e impressão para qualquer superfície' },
        { name: 'Brindes Personalizados', desc: 'Canetas, canecas, camisetas e mais' },
        { name: 'Sinalização', desc: 'Placas, fachadas e comunicação visual' },
      ]
    },
    {
      id: 'design',
      title: 'Design',
      description: 'Identidade visual que comunica.',
      icon: MousePointerClick,
      color: 'roxo',
      items: [
        { name: 'Criação de Logotipo', desc: 'Identidade profissional e única' },
        { name: 'Manual de Identidade Visual', desc: 'Guia completo da marca' },
        { name: 'Design de Embalagem', desc: 'Do rótulo à caixa de transporte' },
        { name: 'Material de Marketing', desc: 'Anúncios, flyers e apresentações' },
        { name: 'Social Media', desc: 'Arte para posts, stories e campanhas' },
        { name: 'UI/UX Design', desc: 'Interfaces para apps e sistemas' },
        { name: 'Design Editorial', desc: 'Revistas, catálogos e e-books' },
        { name: 'Apresentações', desc: 'Pitch decks e apresentações corporativas' },
      ]
    },
    {
      id: 'digital',
      title: 'Desenvolvimento Digital',
      description: 'Presença online que gera resultado.',
      icon: Monitor,
      color: 'azul',
      items: [
        { name: 'Sites Institucionais', desc: 'Sua empresa online com credibilidade' },
        { name: 'Landing Pages', desc: 'Páginas de conversão para campanhas' },
        { name: 'Lojas Virtuais', desc: 'E-commerce completo e integrado' },
        { name: 'Sistemas Web', desc: 'Soluções customizadas para sua operação' },
        { name: 'Manutenção de Sites', desc: 'Atualizações, segurança e performance' },
        { name: 'Hospedagem', desc: 'Servidor rápido e seguro com suporte' },
        { name: 'SEO', desc: 'Ranqueamento orgânico no Google' },
        { name: 'Integrações', desc: 'APIs, ERPs, CRMs e automações' },
      ]
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-branco min-h-screen">
      {/* Hero */}
      <section className="bg-grafite text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10 text-center">
          <div className="text-sm text-t-white-70 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Início</Link> / Serviços
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-titulo font-bold mb-6"
          >
            Nossos Serviços
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-t-white-70 max-w-2xl mx-auto"
          >
            Soluções completas e integradas para a sua marca.
          </motion.p>
        </div>
      </section>

      {/* Sticky Navigation */}
      <div className="sticky top-[88px] z-40 bg-white/90 backdrop-blur-md border-b border-black/5 shadow-sm">
        <div className="container-custom py-4 flex justify-center gap-4 overflow-x-auto no-scrollbar">
          {servicos.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors bg-grafite-soft/5 text-t-secondary hover:bg-${s.color}-light hover:text-${s.color}`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="container-custom py-16 space-y-32">
        {servicos.map((s, index) => (
          <section key={s.id} id={s.id} className="scroll-mt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className={`inline-flex items-center gap-2 bg-${s.color}-light text-${s.color} px-4 py-1.5 rounded-full text-sm font-bold mb-4`}>
                <s.icon size={16} />
                {s.title}
              </div>
              <h2 className="text-4xl font-titulo font-bold text-t-primary mb-4">{s.description}</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {s.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${s.color}-light text-${s.color} flex items-center justify-center mb-4`}>
                    <s.icon size={24} />
                  </div>
                  <h3 className="text-xl font-titulo font-bold text-t-primary mb-2">{item.name}</h3>
                  <p className="text-t-secondary text-sm leading-relaxed mb-4">{item.desc}</p>
                  <Link href="/contato" className={`text-sm font-medium text-${s.color} hover:underline underline-offset-4`}>
                    Saiba mais →
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center bg-grafite-soft/5 rounded-3xl p-12">
              <h3 className="text-2xl font-titulo font-bold text-t-primary mb-6">
                Precisa de {s.title}? Vamos conversar.
              </h3>
              <Link
                href="/contato"
                className={`inline-flex bg-${s.color} text-white px-8 py-4 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-lg`}
              >
                Solicitar Orçamento
              </Link>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
