import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Save, Plug, BarChart2, MessageSquare } from 'lucide-react';
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
    const data: Record<string, any> = Object.fromEntries(formData.entries());
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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart2 size={20} className="text-laranja" />
              Google Analytics e Tag Manager
            </h2>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">ID do Google Analytics (GA4)</label>
                <input type="text" name="gaId" defaultValue={parsedSettings.gaId || ""} placeholder="G-XXXXXXXXXX" className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none font-mono" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">ID do Google Tag Manager (GTM)</label>
                <input type="text" name="gtmId" defaultValue={parsedSettings.gtmId || ""} placeholder="GTM-XXXXXXX" className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none font-mono" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plug size={20} className="text-laranja" />
              Meta Pixel (Facebook)
            </h2>
            <div>
              <label className="text-sm font-bold text-gray-900 mb-2 block">ID do Pixel do Facebook</label>
              <input type="text" name="fbPixelId" defaultValue={parsedSettings.fbPixelId || ""} placeholder="123456789012345" className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none font-mono" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="text-laranja" />
              WhatsApp
            </h2>
            <div className="space-y-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" name="whatsappEnabled" defaultChecked={parsedSettings.whatsappEnabled !== false} className="w-4 h-4 text-laranja bg-gray-100 border-gray-300 rounded focus:ring-laranja mt-1" />
                <div>
                  <div className="text-sm font-bold text-gray-900">Ativar botão do WhatsApp</div>
                  <div className="text-xs text-gray-500">Exibe o ícone flutuante no site.</div>
                </div>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-gray-900 mb-2 block">Número</label>
                  <input type="text" name="whatsappNumber" defaultValue={parsedSettings.whatsappNumber || "5511999999999"} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-900 mb-2 block">Mensagem Padrão</label>
                  <input type="text" name="whatsappMessage" defaultValue={parsedSettings.whatsappMessage || "Olá!"} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}