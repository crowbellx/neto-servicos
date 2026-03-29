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
    const data: Record<string, any> = Object.fromEntries(formData.entries());
    data.allowIndexing = formData.get('allowIndexing') === 'on';
    await updateSettings('seo', data);
  };

  return (
    <form action={saveAction} className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações de SEO</h1>
          <p className="text-sm text-gray-500">Otimize como seu site aparece no Google</p>
        </div>
        <button type="submit" className="bg-laranja text-white px-4 py-2 rounded-lg font-medium hover:bg-[#D4651A] transition-colors flex items-center gap-2">
          <Save size={18} /> Salvar Alterações
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="max-w-4xl space-y-6 pb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Search size={20} className="text-laranja" />
              SEO Global
            </h2>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Título do Site</label>
                <input type="text" name="metaTitle" defaultValue={parsedSettings.metaTitle || ""} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Descrição do Site</label>
                <textarea rows={3} name="metaDescription" defaultValue={parsedSettings.metaDescription || ""} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Globe size={20} className="text-laranja" />
              Indexação
            </h2>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="allowIndexing" defaultChecked={parsedSettings.allowIndexing !== false} className="w-4 h-4 text-laranja bg-gray-100 border-gray-300 rounded focus:ring-laranja mt-1" />
              <div>
                <div className="text-sm font-bold text-gray-900">Permitir indexação</div>
                <div className="text-xs text-gray-500">Se desmarcado, adiciona a tag &quot;noindex&quot;.</div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}