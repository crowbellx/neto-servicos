import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Save, Plug, BarChart2, MessageSquare, Mail } from 'lucide-react';
import { getSettings, updateSettings } from '@/app/actions/settings';

export default async function IntegrationsSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: settings } = await getSettings('integrations');
  const parsedSettings = settings?.data ? JSON.parse(settings.data) : {};

  const saveAction = async (formData: FormData) => {
    'use server';
    const data = Object.fromEntries(formData.entries());
    data.whatsappEnabled = formData.get('whatsappEnabled') === 'on';
    await updateSettings('integrations', data);
  };

  return (
    <form action={saveAction} className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrações</h1>
          <p className="text-sm text-gray-500">Conecte seu site com ferramentas externas</p>
        </div>
        <button type="submit" className="bg-laranja text-white px-4 py-2 rounded-lg font-medium hover:bg-[#D4651A] transition-colors flex items-center gap-2">
          <Save size={18} /> Salvar Alterações
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="max-w-4xl space-y-6 pb-10">
          
          {/* Analytics */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart2 size={20} className="text-laranja" />
              Google Analytics e Tag Manager
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">ID de Acompanhamento do Google Analytics (GA4)</label>
                <input 
                  type="text" 
                  name="gaId"
                  defaultValue={parsedSettings.gaId || ""}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">Insira apenas o ID (ex: G-1234567890). O código será inserido automaticamente no &lt;head&gt;.</p>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">ID do Google Tag Manager (GTM)</label>
                <input 
                  type="text" 
                  name="gtmId"
                  defaultValue={parsedSettings.gtmId || ""}
                  placeholder="GTM-XXXXXXX"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">Se você usa o GTM, insira o ID aqui. Recomendamos não usar GA4 e GTM ao mesmo tempo se o GA4 já estiver dentro do GTM.</p>
              </div>
            </div>
          </div>

          {/* Facebook Pixel */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plug size={20} className="text-laranja" />
              Meta Pixel (Facebook)
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">ID do Pixel do Facebook</label>
                <input 
                  type="text" 
                  name="fbPixelId"
                  defaultValue={parsedSettings.fbPixelId || ""}
                  placeholder="123456789012345"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">Apenas os números do ID do seu Pixel.</p>
              </div>
            </div>
          </div>

          {/* WhatsApp / Chat */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="text-laranja" />
              Botão Flutuante do WhatsApp
            </h2>
            
            <div className="space-y-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="mt-1">
                  <input type="checkbox" name="whatsappEnabled" defaultChecked={parsedSettings.whatsappEnabled !== false} className="w-4 h-4 text-laranja bg-gray-100 border-gray-300 rounded focus:ring-laranja" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Ativar botão do WhatsApp no site</div>
                  <div className="text-xs text-gray-500 mt-0.5">Exibe um ícone flutuante no canto inferior direito para contato rápido.</div>
                </div>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="text-sm font-bold text-gray-900 mb-2 block">Número do WhatsApp</label>
                  <input 
                    type="text" 
                    name="whatsappNumber"
                    defaultValue={parsedSettings.whatsappNumber || "5511999999999"}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Apenas números, com código do país (ex: 55 para Brasil).</p>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-900 mb-2 block">Mensagem Padrão (Opcional)</label>
                  <input 
                    type="text" 
                    name="whatsappMessage"
                    defaultValue={parsedSettings.whatsappMessage || "Olá! Gostaria de um orçamento."}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Texto que já vem preenchido quando o cliente clica.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scripts Personalizados */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CodeIcon size={20} className="text-laranja" />
              Scripts Personalizados
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Scripts no &lt;head&gt;</label>
                <textarea 
                  rows={4}
                  name="headScripts"
                  defaultValue={parsedSettings.headScripts || ""}
                  placeholder="<!-- Cole aqui scripts como Hotjar, RD Station, etc -->"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none font-mono text-xs"
                ></textarea>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Scripts no final do &lt;body&gt;</label>
                <textarea 
                  rows={4}
                  name="bodyScripts"
                  defaultValue={parsedSettings.bodyScripts || ""}
                  placeholder="<!-- Scripts que não precisam carregar imediatamente -->"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none font-mono text-xs"
                ></textarea>
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}

function CodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}
