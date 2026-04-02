'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updateContentSection } from '@/app/actions/settings';
import { Save, Info, Target, Eye, Heart, Plus, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import ImageUploadField from '@/components/admin/settings/ImageUploadField';

type AboutSectionData = {
  header?: any;
  story?: any;
  values?: any;
} | null;

const TABS = [
  { id: 'header', label: 'Cabeçalho', icon: Info },
  { id: 'story',  label: 'História',   icon: Info },
  { id: 'values', label: 'M.V.V.',   icon: Target },
];

export default function AboutContentEditor({ initialData }: { initialData: AboutSectionData }) {
  const [activeTab, setActiveTab] = useState('header');
  const [isPending, startTransition] = useTransition();

  // Header state
  const [header, setHeader] = useState({
    title: initialData?.header?.title || 'Nossa História',
    subtitle: initialData?.header?.subtitle || 'Conheça a Neto Serviços',
    backgroundImage: initialData?.header?.backgroundImage || '',
  });

  // Story state
  const [story, setStory] = useState({
    title: initialData?.story?.title || 'Nascemos da necessidade de simplificar.',
    content: initialData?.story?.content || '<p>Reunimos especialistas de Gráfica, Design e Desenvolvimento Digital sob o mesmo teto para garantir que sua marca tenha uma identidade forte e coerente.</p>',
    image: initialData?.story?.image || 'https://picsum.photos/seed/escritorio/800/1000',
  });

  // Values state
  const [values, setValues] = useState(
    initialData?.values || [
      { id: 'missao', title: 'Missão', desc: 'Simplificar a comunicação das empresas com excelência.', icon: 'target' },
      { id: 'visao',  title: 'Visão',   desc: 'Ser a principal parceira estratégica de negócios no Brasil.', icon: 'eye' },
      { id: 'valores', title: 'Valores', desc: 'Transparência, compromisso, criatividade e foco no cliente.', icon: 'heart' },
    ]
  );

  function saveSection(key: string, data: any) {
    startTransition(async () => {
      const res = await updateContentSection(key, data, ['/sobre', '/']);
      if (res.success) {
        toast.success('Conteúdo de "Sobre Nós" atualizado!');
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
          <h1 className="text-2xl font-bold text-gray-900">Página Sobre Nós</h1>
          <p className="text-sm text-gray-500">Gerencie a história, missão e valores da empresa.</p>
        </div>
        <Link href="/sobre" target="_blank" className="flex items-center gap-2 text-sm text-gray-500 hover:text-laranja px-3 py-2 border border-gray-200 rounded-lg hover:border-laranja transition-colors">
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
                  <label className={labelCls}>Subtítulo / Introdução rápida</label>
                  <input className={inputCls} value={header.subtitle} onChange={e => setHeader(p => ({ ...p, subtitle: e.target.value }))} />
                </div>
                <div>
                  <ImageUploadField 
                    label="Imagem de Fundo do Cabeçalho (Opcional)"
                    defaultValue={header.backgroundImage}
                    onChange={url => setHeader(p => ({ ...p, backgroundImage: url }))}
                    helperText="Recomendado: 1920x1080px. Evite imagens com muito texto, pois ela será usada como fundo."
                  />
                </div>
              </div>
            </div>
            <button onClick={() => saveSection('about_header', header)} disabled={isPending} className="flex items-center gap-2 px-6 py-3 bg-laranja text-white rounded-lg font-semibold hover:bg-[#D4651A] transition-colors disabled:opacity-70">
              <Save size={18} /> {isPending ? 'Salvando...' : 'Salvar Cabeçalho'}
            </button>
          </div>
        )}

        {activeTab === 'story' && (
          <div className="space-y-6">
            <div className={cardCls}>
              <h3 className="font-bold text-gray-900 mb-4">Nossa História</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Título da Seção</label>
                  <input className={inputCls} value={story.title} onChange={e => setStory(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Conteúdo (HTML/Rich Text)</label>
                  <textarea className={`${inputCls} font-mono`} rows={8} value={story.content} onChange={e => setStory(p => ({ ...p, content: e.target.value }))} />
                  <p className="text-[10px] text-gray-400 mt-1">Suporta tags HTML como &lt;p&gt;, &lt;strong&gt;, &lt;br&gt;, etc.</p>
                </div>
                <div>
                  <ImageUploadField 
                    label="Imagem da Nossa História"
                    defaultValue={story.image}
                    onChange={url => setStory(p => ({ ...p, image: url }))}
                    helperText="Recomendado: 800x1000px ou quadrado."
                  />
                </div>
              </div>
            </div>
            <button onClick={() => saveSection('about_story', story)} disabled={isPending} className="flex items-center gap-2 px-6 py-3 bg-laranja text-white rounded-lg font-semibold hover:bg-[#D4651A] transition-colors disabled:opacity-70">
              <Save size={18} /> {isPending ? 'Salvando...' : 'Salvar História'}
            </button>
          </div>
        )}

        {activeTab === 'values' && (
          <div className="space-y-6">
            <div className={cardCls}>
              <h3 className="font-bold text-gray-900 mb-4">Missão, Visão e Valores</h3>
              <div className="grid gap-4">
                {values.map((v: any, i: number) => (
                  <div key={v.id || i} className="p-4 border border-gray-100 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-gray-900 uppercase text-xs tracking-wider">
                        {v.id === 'missao' && <Target size={14} className="text-teal" />}
                        {v.id === 'visao' && <Eye size={14} className="text-roxo" />}
                        {v.id === 'valores' && <Heart size={14} className="text-laranja" />}
                        {v.title}
                      </div>
                    </div>
                    <textarea className={inputCls} rows={2} value={v.desc} onChange={e => setValues((p: any) => p.map((item: any, idx: number) => idx === i ? { ...item, desc: e.target.value } : item))} />
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => saveSection('about_values', values)} disabled={isPending} className="flex items-center gap-2 px-6 py-3 bg-laranja text-white rounded-lg font-semibold hover:bg-[#D4651A] transition-colors disabled:opacity-70">
              <Save size={18} /> {isPending ? 'Salvando...' : 'Salvar Valores'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
