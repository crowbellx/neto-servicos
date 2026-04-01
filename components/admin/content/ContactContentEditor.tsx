'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updateContentSection } from '@/app/actions/settings';
import { Save, Phone, MapPin, Mail, Clock, ExternalLink, Layout } from 'lucide-react';
import Link from 'next/link';

type ContactSectionData = {
  header?: any;
  info?: any;
} | null;

const TABS = [
  { id: 'header', label: 'Cabeçalho', icon: Layout },
  { id: 'info',   label: 'Informações', icon: Phone },
];

export default function ContactContentEditor({ initialData }: { initialData: ContactSectionData }) {
  const [activeTab, setActiveTab] = useState('header');
  const [isPending, startTransition] = useTransition();

  // Header state
  const [header, setHeader] = useState({
    title: initialData?.header?.title || 'Fale Conosco',
    subtitle: initialData?.header?.subtitle || 'Estamos prontos para ouvir sobre o seu projeto.',
  });

  // Info state (Same as contato_info used in home)
  const [info, setInfo] = useState({
    whatsapp: initialData?.info?.whatsapp || '(11) 99999-9999',
    email:    initialData?.info?.email    || 'contato@netoservicos.com.br',
    address:  initialData?.info?.address  || 'Rua Exemplo, 123 - Centro',
    hours:    initialData?.info?.hours    || 'Seg–Sex 8h–18h | Sáb 8h–12h',
    mapLink:  initialData?.info?.mapLink  || '',
  });

  function saveSection(key: string, data: any) {
    startTransition(async () => {
      const res = await updateContentSection(key, data, ['/contato', '/']);
      if (res.success) {
        toast.success('Informações de contato atualizadas!');
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Página de Contato</h1>
          <p className="text-sm text-gray-500">Gerencie como os clientes podem te encontrar e falar com você.</p>
        </div>
        <Link href="/contato" target="_blank" className="flex items-center gap-2 text-sm text-gray-500 hover:text-laranja px-3 py-2 border border-gray-200 rounded-lg hover:border-laranja transition-colors">
          <ExternalLink size={16} /> Ver página
        </Link>
      </div>

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

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'header' && (
          <div className="space-y-6">
            <div className={cardCls}>
              <h3 className="font-bold text-gray-900 mb-4">Cabeçalho da Página</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Título Principal</label>
                  <input className={inputCls} value={header.title} onChange={e => setHeader(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Texto de Introdução (Subtítulo)</label>
                  <textarea className={inputCls} rows={2} value={header.subtitle} onChange={e => setHeader(p => ({ ...p, subtitle: e.target.value }))} />
                </div>
              </div>
            </div>
            <button onClick={() => saveSection('contact_header', header)} disabled={isPending} className="flex items-center gap-2 px-6 py-3 bg-laranja text-white rounded-lg font-semibold hover:bg-[#D4651A] transition-colors disabled:opacity-70">
              <Save size={18} /> {isPending ? 'Salvando...' : 'Salvar Cabeçalho'}
            </button>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className={cardCls}>
              <h3 className="font-bold text-gray-900 mb-4">Informações de Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>WhatsApp (exibição)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input className={`${inputCls} pl-10`} placeholder="(11) 99999-9999" value={info.whatsapp} onChange={e => setInfo(p => ({ ...p, whatsapp: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>E-mail de Contato</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="email" className={`${inputCls} pl-10`} value={info.email} onChange={e => setInfo(p => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Endereço Completo</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input className={`${inputCls} pl-10`} value={info.address} onChange={e => setInfo(p => ({ ...p, address: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Horário de Funcionamento</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input className={`${inputCls} pl-10`} placeholder="Seg–Sex 8h–18h" value={info.hours} onChange={e => setInfo(p => ({ ...p, hours: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Link Embed Google Maps</label>
                  <input className={inputCls} placeholder="https://www.google.com/maps/embed?..." value={info.mapLink} onChange={e => setInfo(p => ({ ...p, mapLink: e.target.value }))} />
                </div>
              </div>
            </div>
            <button onClick={() => saveSection('contato_info', info)} disabled={isPending} className="flex items-center gap-2 px-6 py-3 bg-laranja text-white rounded-lg font-semibold hover:bg-[#D4651A] transition-colors disabled:opacity-70">
              <Save size={18} /> {isPending ? 'Salvando...' : 'Salvar Informações'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
