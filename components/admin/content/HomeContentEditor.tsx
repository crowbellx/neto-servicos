'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updateHomeSection } from '@/app/actions/settings';
import { Save, Home, Hash, Star, CheckCircle2, Zap, Phone, Plus, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type HomeSectionData = {
  hero?: any;
  counters?: any;
  diferenciais?: any;
  cta?: any;
  processo?: any;
  contato?: any;
} | null;

const TABS = [
  { id: 'hero',         label: 'Hero',         icon: Home },
  { id: 'counters',     label: 'Contadores',   icon: Hash },
  { id: 'diferenciais', label: 'Diferenciais', icon: Star },
  { id: 'cta',          label: 'CTA',          icon: Zap },
  { id: 'processo',     label: 'Processo',     icon: CheckCircle2 },
  { id: 'contato',      label: 'Contato',      icon: Phone },
];

export default function HomeContentEditor({ initialData }: { initialData: HomeSectionData }) {
  const [activeTab, setActiveTab] = useState('hero');
  const [isPending, startTransition] = useTransition();

  // Hero state
  const [hero, setHero] = useState({
    badge:       initialData?.hero?.badge       || 'Gráfica · Design · Digital',
    line1:       initialData?.hero?.line1       || 'Do físico ao',
    highlight:   initialData?.hero?.highlight   || 'digital.',
    line3:       initialData?.hero?.line3       || 'Em um só lugar.',
    subtitle:    initialData?.hero?.subtitle    || 'Gráfica, design e tecnologia integrados para construir a identidade completa da sua marca — do cartão de visita à loja virtual.',
    cta1Label:   initialData?.hero?.cta1Label   || 'Solicitar Orçamento Grátis →',
    cta1Link:    initialData?.hero?.cta1Link    || '#contato',
    cta2Label:   initialData?.hero?.cta2Label   || 'Ver Portfólio',
    cta2Link:    initialData?.hero?.cta2Link    || '/portfolio',
    stats:       initialData?.hero?.stats       || '+200 projetos entregues',
  });

  // Counters state
  const [counters, setCounters] = useState<{ value: number; suffix: string; label: string }[]>(
    initialData?.counters?.items || [
      { value: 200, suffix: '+', label: 'Projetos entregues' },
      { value: 8,   suffix: '+', label: 'Anos de experiência' },
      { value: 98,  suffix: '%', label: 'Clientes satisfeitos' },
      { value: 50,  suffix: '+', label: 'Cidades atendidas' },
    ]
  );

  // Diferenciais state
  const [diferenciais, setDiferenciais] = useState({
    title:    initialData?.diferenciais?.title    || 'Mais do que serviços. Uma parceria.',
    subtitle: initialData?.diferenciais?.subtitle || 'Nossos diferenciais',
    image:    initialData?.diferenciais?.image    || '',
    items:    initialData?.diferenciais?.items    || [
      'Tudo em um só lugar — sem intermediários ou retrabalho',
      'Equipe multidisciplinar com anos de experiência real',
      'Prazo cumprido: assumimos o compromisso e honramos',
      'Do briefing à entrega, você acompanha tudo',
      'Atendimento personalizado, sem tickets e sem robôs',
      'Revisões incluídas no processo, sem custo extra',
      'Suporte pós-entrega para dúvidas e ajustes',
    ] as string[],
  });

  // CTA state
  const [cta, setCta] = useState({
    title:         initialData?.cta?.title         || 'Pronto para levar sua marca ao próximo nível?',
    subtitle:      initialData?.cta?.subtitle      || 'Fale com a gente hoje. Orçamento gratuito e sem compromisso.',
    whatsappLink:  initialData?.cta?.whatsappLink  || 'https://wa.me/5511999999999',
    whatsappLabel: initialData?.cta?.whatsappLabel || 'Solicitar Orçamento pelo WhatsApp',
  });

  // Processo state
  const [processo, setProcesso] = useState({
    title:    initialData?.processo?.title    || 'Simples do início ao fim.',
    subtitle: initialData?.processo?.subtitle || 'Nosso processo',
    steps:    initialData?.processo?.steps   || [
      { title: 'Briefing',  description: 'Você nos conta tudo sobre o projeto, público-alvo, prazos e objetivos.' },
      { title: 'Proposta',  description: 'Elaboramos uma proposta comercial detalhada com valores, prazos e escopo completo.' },
      { title: 'Criação',   description: 'Nossa equipe entra em ação com foco total na qualidade e identidade da sua marca.' },
      { title: 'Revisão',   description: 'Você avalia, pedimos feedback e refinamos até que tudo esteja exatamente como imaginou.' },
      { title: 'Entrega',   description: 'Entregamos os arquivos finais ou publicamos online. Suporte pós-entrega incluído.' },
    ] as { title: string; description: string }[],
  });

  // Contato state
  const [contato, setContato] = useState({
    whatsapp: initialData?.contato?.whatsapp || '(11) 99999-9999',
    email:    initialData?.contato?.email    || 'contato@netoservicos.com.br',
    address:  initialData?.contato?.address  || 'Rua Exemplo, 123 - Centro',
    hours:    initialData?.contato?.hours    || 'Seg–Sex 8h–18h | Sáb 8h–12h',
    mapLink:  initialData?.contato?.mapLink  || '',
  });

  function saveSection(key: string, data: any) {
    startTransition(async () => {
      const res = await updateHomeSection(key, data);
      if (res.success) {
        toast.success('Seção salva! O site será atualizado em instantes.');
      } else {
        toast.error(res.error || 'Erro ao salvar. Tente novamente.');
      }
    });
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-laranja focus:ring-1 focus:ring-laranja transition-colors';
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1';
  const cardCls  = 'bg-white rounded-xl border border-gray-100 shadow-sm p-6';

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conteúdo da Home</h1>
          <p className="text-sm text-gray-500">Edite os textos e informações de cada seção da página inicial.</p>
        </div>
        <Link href="/" target="_blank" className="flex items-center gap-2 text-sm text-gray-500 hover:text-laranja px-3 py-2 border border-gray-200 rounded-lg hover:border-laranja transition-colors">
          <ExternalLink size={16} /> Ver site
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-laranja shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">

        {/* ─── HERO ─── */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className={cardCls}>
              <h3 className="font-bold text-gray-900 mb-4">Texto Principal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Badge (texto do selo)</label>
                  <input className={inputCls} value={hero.badge} onChange={e => setHero(p => ({ ...p, badge: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Estatística abaixo dos avatares</label>
                  <input className={inputCls} value={hero.stats} onChange={e => setHero(p => ({ ...p, stats: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Linha 1 do título</label>
                  <input className={inputCls} value={hero.line1} onChange={e => setHero(p => ({ ...p, line1: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Palavra em destaque (itálico laranja)</label>
                  <input className={inputCls} value={hero.highlight} onChange={e => setHero(p => ({ ...p, highlight: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Linha 3 do título</label>
                  <input className={inputCls} value={hero.line3} onChange={e => setHero(p => ({ ...p, line3: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Subtítulo</label>
                  <textarea className={inputCls} rows={3} value={hero.subtitle} onChange={e => setHero(p => ({ ...p, subtitle: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className={cardCls}>
              <h3 className="font-bold text-gray-900 mb-4">Botões de Ação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Botão 1 — Texto</label>
                  <input className={inputCls} value={hero.cta1Label} onChange={e => setHero(p => ({ ...p, cta1Label: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Botão 1 — Link</label>
                  <input className={inputCls} value={hero.cta1Link} onChange={e => setHero(p => ({ ...p, cta1Link: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Botão 2 — Texto</label>
                  <input className={inputCls} value={hero.cta2Label} onChange={e => setHero(p => ({ ...p, cta2Label: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Botão 2 — Link</label>
                  <input className={inputCls} value={hero.cta2Link} onChange={e => setHero(p => ({ ...p, cta2Link: e.target.value }))} />
                </div>
              </div>
            </div>
            <button onClick={() => saveSection('home_hero', hero)} disabled={isPending} className="flex items-center gap-2 px-6 py-3 bg-laranja text-white rounded-lg font-semibold hover:bg-[#D4651A] transition-colors disabled:opacity-70">
              <Save size={18} /> {isPending ? 'Salvando...' : 'Salvar Hero'}
            </button>
          </div>
        )}

        {/* ─── CONTADORES ─── */}
        {activeTab === 'counters' && (
          <div className="space-y-4">
            <div className={cardCls}>
              <h3 className="font-bold text-gray-900 mb-4">Números em Destaque</h3>
              <div className="space-y-3">
                {counters.map((c, i) => (
                  <div key={i} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Número</label>
                      <input type="number" className={inputCls} value={c.value}
                        onChange={e => setCounters(prev => prev.map((item, idx) => idx === i ? { ...item, value: Number(e.target.value) } : item))} />
                    </div>
                    <div className="w-24">
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Sufixo</label>
                      <select className={inputCls} value={c.suffix}
                        onChange={e => setCounters(prev => prev.map((item, idx) => idx === i ? { ...item, suffix: e.target.value } : item))}>
                        <option value="+">+</option>
                        <option value="%">%</option>
                        <option value="x">x</option>
                        <option value="">nenhum</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Label</label>
                      <input className={inputCls} value={c.label}
                        onChange={e => setCounters(prev => prev.map((item, idx) => idx === i ? { ...item, label: e.target.value } : item))} />
                    </div>
                    <button onClick={() => setCounters(prev => prev.filter((_, idx) => idx !== i))} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-4">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {counters.length < 6 && (
                <button onClick={() => setCounters(prev => [...prev, { value: 0, suffix: '+', label: 'Novo contador' }])}
                  className="mt-3 flex items-center gap-2 text-sm text-laranja font-medium hover:underline">
                  <Plus size={16} /> Adicionar contador
                </button>
              )}
            </div>
            <button onClick={() => saveSection('home_counters', { items: counters })} disabled={isPending} className="flex items-center gap-2 px-6 py-3 bg-laranja text-white rounded-lg font-semibold hover:bg-[#D4651A] transition-colors disabled:opacity-70">
              <Save size={18} /> {isPending ? 'Salvando...' : 'Salvar Contadores'}
            </button>
          </div>
        )}

        {/* ─── DIFERENCIAIS ─── */}
        {activeTab === 'diferenciais' && (
          <div className="space-y-6">
            <div className={cardCls}>
              <h3 className="font-bold text-gray-900 mb-4">Textos da Seção</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Badge (ex: "Nossos diferenciais")</label>
                  <input className={inputCls} value={diferenciais.subtitle} onChange={e => setDiferenciais(p => ({ ...p, subtitle: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>URL da imagem lateral</label>
                  <input className={inputCls} placeholder="https://..." value={diferenciais.image} onChange={e => setDiferenciais(p => ({ ...p, image: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Título principal</label>
                  <input className={inputCls} value={diferenciais.title} onChange={e => setDiferenciais(p => ({ ...p, title: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className={cardCls}>
              <h3 className="font-bold text-gray-900 mb-4">Lista de Diferenciais</h3>
              <div className="space-y-2">
                {diferenciais.items.map((item: string, i: number) => (
                  <div key={i} className="flex gap-2 items-center">
                    <CheckCircle2 size={18} className="text-roxo shrink-0" />
                    <input className={inputCls} value={item}
                      onChange={e => setDiferenciais(p => ({ ...p, items: p.items.map((v: string, idx: number) => idx === i ? e.target.value : v) }))} />
                    <button onClick={() => setDiferenciais(p => ({ ...p, items: p.items.filter((_: string, idx: number) => idx !== i) }))}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => setDiferenciais(p => ({ ...p, items: [...p.items, 'Novo diferencial'] }))}
                className="mt-3 flex items-center gap-2 text-sm text-laranja font-medium hover:underline">
                <Plus size={16} /> Adicionar item
              </button>
            </div>
            <button onClick={() => saveSection('home_diferenciais', diferenciais)} disabled={isPending} className="flex items-center gap-2 px-6 py-3 bg-laranja text-white rounded-lg font-semibold hover:bg-[#D4651A] transition-colors disabled:opacity-70">
              <Save size={18} /> {isPending ? 'Salvando...' : 'Salvar Diferenciais'}
            </button>
          </div>
        )}

        {/* ─── CTA ─── */}
        {activeTab === 'cta' && (
          <div className="space-y-6">
            <div className={cardCls}>
              <h3 className="font-bold text-gray-900 mb-4">Seção de Chamada para Ação</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Título</label>
                  <input className={inputCls} value={cta.title} onChange={e => setCta(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Subtítulo</label>
                  <textarea className={inputCls} rows={2} value={cta.subtitle} onChange={e => setCta(p => ({ ...p, subtitle: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Texto do botão WhatsApp</label>
                  <input className={inputCls} value={cta.whatsappLabel} onChange={e => setCta(p => ({ ...p, whatsappLabel: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Link completo do WhatsApp (com mensagem)</label>
                  <input className={inputCls} placeholder="https://wa.me/55..." value={cta.whatsappLink} onChange={e => setCta(p => ({ ...p, whatsappLink: e.target.value }))} />
                  <p className="text-xs text-gray-400 mt-1">Ex: https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20um%20orçamento</p>
                </div>
              </div>
            </div>
            <button onClick={() => saveSection('home_cta', cta)} disabled={isPending} className="flex items-center gap-2 px-6 py-3 bg-laranja text-white rounded-lg font-semibold hover:bg-[#D4651A] transition-colors disabled:opacity-70">
              <Save size={18} /> {isPending ? 'Salvando...' : 'Salvar CTA'}
            </button>
          </div>
        )}

        {/* ─── PROCESSO ─── */}
        {activeTab === 'processo' && (
          <div className="space-y-6">
            <div className={cardCls}>
              <h3 className="font-bold text-gray-900 mb-4">Cabeçalho da Seção</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Badge (ex: "Nosso processo")</label>
                  <input className={inputCls} value={processo.subtitle} onChange={e => setProcesso(p => ({ ...p, subtitle: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Título</label>
                  <input className={inputCls} value={processo.title} onChange={e => setProcesso(p => ({ ...p, title: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className={cardCls}>
              <h3 className="font-bold text-gray-900 mb-4">Passos do Processo</h3>
              <div className="space-y-4">
                {processo.steps.map((step: { title: string; description: string }, i: number) => (
                  <div key={i} className="p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-7 h-7 rounded-full bg-laranja text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <input className={`${inputCls} font-semibold`} placeholder="Título do passo"
                        value={step.title}
                        onChange={e => setProcesso(p => ({ ...p, steps: p.steps.map((s: { title: string; description: string }, idx: number) => idx === i ? { ...s, title: e.target.value } : s) }))} />
                    </div>
                    <textarea className={inputCls} rows={2} placeholder="Descrição..."
                      value={step.description}
                      onChange={e => setProcesso(p => ({ ...p, steps: p.steps.map((s: { title: string; description: string }, idx: number) => idx === i ? { ...s, description: e.target.value } : s) }))} />
                  </div>
                ))}
              </div>
              {processo.steps.length < 7 && (
                <button onClick={() => setProcesso(p => ({ ...p, steps: [...p.steps, { title: 'Novo passo', description: '' }] }))}
                  className="mt-3 flex items-center gap-2 text-sm text-laranja font-medium hover:underline">
                  <Plus size={16} /> Adicionar passo
                </button>
              )}
            </div>
            <button onClick={() => saveSection('home_processo', processo)} disabled={isPending} className="flex items-center gap-2 px-6 py-3 bg-laranja text-white rounded-lg font-semibold hover:bg-[#D4651A] transition-colors disabled:opacity-70">
              <Save size={18} /> {isPending ? 'Salvando...' : 'Salvar Processo'}
            </button>
          </div>
        )}

        {/* ─── CONTATO ─── */}
        {activeTab === 'contato' && (
          <div className="space-y-6">
            <div className={cardCls}>
              <h3 className="font-bold text-gray-900 mb-4">Informações de Contato</h3>
              <p className="text-sm text-gray-500 mb-4">Estas informações aparecem na seção de contato da Home e na página /contato.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>WhatsApp (exibição)</label>
                  <input className={inputCls} placeholder="(11) 99999-9999" value={contato.whatsapp} onChange={e => setContato(p => ({ ...p, whatsapp: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>E-mail</label>
                  <input type="email" className={inputCls} value={contato.email} onChange={e => setContato(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Endereço</label>
                  <input className={inputCls} value={contato.address} onChange={e => setContato(p => ({ ...p, address: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Horário de funcionamento</label>
                  <input className={inputCls} placeholder="Seg–Sex 8h–18h | Sáb 8h–12h" value={contato.hours} onChange={e => setContato(p => ({ ...p, hours: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Link do Google Maps (embed)</label>
                  <input className={inputCls} placeholder="https://www.google.com/maps/embed?..." value={contato.mapLink} onChange={e => setContato(p => ({ ...p, mapLink: e.target.value }))} />
                </div>
              </div>
            </div>
            <button onClick={() => saveSection('contato_info', contato)} disabled={isPending} className="flex items-center gap-2 px-6 py-3 bg-laranja text-white rounded-lg font-semibold hover:bg-[#D4651A] transition-colors disabled:opacity-70">
              <Save size={18} /> {isPending ? 'Salvando...' : 'Salvar Contato'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
