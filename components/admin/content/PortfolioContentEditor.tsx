'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updateContentSection } from '@/app/actions/settings';
import { Save, Briefcase, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type PortfolioSectionData = {
  header?: any;
} | null;

export default function PortfolioContentEditor({ initialData }: { initialData: PortfolioSectionData }) {
  const [isPending, startTransition] = useTransition();

  // Header state
  const [header, setHeader] = useState({
    title: initialData?.header?.title || 'Nosso Portfólio',
    subtitle: initialData?.header?.subtitle || 'Trabalhos que falam por si.',
  });

  function saveSection(key: string, data: any) {
    startTransition(async () => {
      const res = await updateContentSection(key, data, ['/portfolio']);
      if (res.success) {
        toast.success('Conteúdo de "Portfólio" atualizado!');
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
          <h1 className="text-2xl font-bold text-gray-900">Página de Portfólio</h1>
          <p className="text-sm text-gray-500">Gerencie os textos introdutórios da página de portfólio.</p>
        </div>
        <Link href="/portfolio" target="_blank" className="flex items-center gap-2 text-sm text-gray-500 hover:text-laranja px-3 py-2 border border-gray-200 rounded-lg hover:border-laranja transition-colors">
          <ExternalLink size={16} /> Ver página
        </Link>
      </div>

      <div className="space-y-6">
        <div className={cardCls}>
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase size={18} className="text-laranja" />
            Cabeçalho e Introdução
          </h3>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Título Principal</label>
              <input className={inputCls} value={header.title} onChange={e => setHeader(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Texto de Introdução (Subtítulo)</label>
              <textarea className={inputCls} rows={4} value={header.subtitle} onChange={e => setHeader(p => ({ ...p, subtitle: e.target.value }))} />
            </div>
          </div>
        </div>

        <button onClick={() => saveSection('portfolio_header', header)} disabled={isPending} className="flex items-center gap-2 px-6 py-3 bg-laranja text-white rounded-lg font-semibold hover:bg-[#D4651A] transition-colors disabled:opacity-70">
          <Save size={18} /> {isPending ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
}
