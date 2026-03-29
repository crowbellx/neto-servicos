import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Save, Search, Globe, Share2 } from 'lucide-react';
import { getSettings, updateSettings } from '@/app/actions/settings';

export default async function SeoSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: settings } = await getSettings('seo');
  const parsedSettings = settings?.data ? JSON.parse(settings.data) : {};

  const saveAction = async (formData: FormData) => {
    'use server';
    const data = Object.fromEntries(formData.entries());
    data.allowIndexing = formData.get('allowIndexing') === 'on';
    await updateSettings('seo', data);
  };

  return (
    <form action={saveAction} className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações de SEO</h1>
          <p className="text-sm text-gray-500">Otimize como seu site aparece no Google e redes sociais</p>
        </div>
        <button type="submit" className="bg-laranja text-white px-4 py-2 rounded-lg font-medium hover:bg-[#D4651A] transition-colors flex items-center gap-2">
          <Save size={18} /> Salvar Alterações
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="max-w-4xl space-y-6 pb-10">
          
          {/* SEO Global */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Search size={20} className="text-laranja" />
              SEO Global (Página Inicial)
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Título do Site (Meta Title)</label>
                <input 
                  type="text" 
                  name="metaTitle"
                  defaultValue={parsedSettings.metaTitle || "Neto Serviços | Gráfica e Design"}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Recomendado: 50-60 caracteres.</p>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Descrição do Site (Meta Description)</label>
                <textarea 
                  rows={3}
                  name="metaDescription"
                  defaultValue={parsedSettings.metaDescription || "A Neto Serviços oferece as melhores soluções em design gráfico, impressão e desenvolvimento web para sua empresa decolar."}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none resize-none"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Recomendado: 150-160 caracteres.</p>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Palavras-chave (Keywords)</label>
                <input 
                  type="text" 
                  name="keywords"
                  defaultValue={parsedSettings.keywords || "gráfica, design, site, são paulo, impressão"}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Separe por vírgulas. (Nota: o Google dá menos peso a isso hoje em dia).</p>
              </div>
            </div>
          </div>

          {/* Redes Sociais (Open Graph) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Share2 size={20} className="text-laranja" />
              Compartilhamento Social (Open Graph)
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-gray-900 mb-2 block">Título para Redes Sociais</label>
                  <input 
                    type="text" 
                    name="ogTitle"
                    defaultValue={parsedSettings.ogTitle || ""}
                    placeholder="Pode ser igual ao Meta Title"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-900 mb-2 block">Imagem de Compartilhamento (OG Image)</label>
                  <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between bg-gray-50">
                    <span className="text-sm text-gray-500 truncate">{parsedSettings.ogImage || "Nenhuma imagem selecionada"}</span>
                    <button type="button" className="text-sm font-medium text-laranja hover:underline whitespace-nowrap">Escolher Imagem</button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Recomendado: 1200x630px (Facebook, LinkedIn, WhatsApp).</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Descrição para Redes Sociais</label>
                <textarea 
                  rows={2}
                  name="ogDescription"
                  defaultValue={parsedSettings.ogDescription || ""}
                  placeholder="Pode ser igual à Meta Description"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Indexação e Robôs */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Globe size={20} className="text-laranja" />
              Indexação e Robôs
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="mt-1">
                  <input type="checkbox" name="allowIndexing" defaultChecked={parsedSettings.allowIndexing !== false} className="w-4 h-4 text-laranja bg-gray-100 border-gray-300 rounded focus:ring-laranja" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Permitir que motores de busca indexem este site</div>
                  <div className="text-xs text-gray-500 mt-0.5">Se desmarcado, adiciona a tag &quot;noindex&quot; ao site, desencorajando o Google de listá-lo.</div>
                </div>
              </label>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block mt-4">robots.txt Personalizado</label>
                <textarea 
                  rows={4}
                  name="robotsTxt"
                  defaultValue={parsedSettings.robotsTxt || "User-agent: *\nAllow: /\nDisallow: /admin/"}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none font-mono"
                ></textarea>
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
