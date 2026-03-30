import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Save, Mail, Server, ShieldCheck } from 'lucide-react';
import { getSettings, updateSettings } from '@/app/actions/settings';

export default async function EmailSettingsPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const { data: settings } = await getSettings('email');
  const config = settings?.data ? JSON.parse(settings.data) : {};

  const saveAction = async (formData: FormData) => {
    'use server';
    const data = Object.fromEntries(formData.entries());
    await updateSettings('email', data);
  };

  return (
    <form action={saveAction} className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações de E-mail</h1>
          <p className="text-sm text-gray-500">Configure como o sistema envia notificações e recuperações de senha</p>
        </div>
        <button type="submit" className="bg-laranja text-white px-6 py-2 rounded-lg font-bold hover:bg-[#D4651A] transition-all flex items-center gap-2">
          <Save size={18} /> Salvar Configurações
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Server size={18} className="text-laranja" /> Servidor SMTP
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Host SMTP</label>
              <input name="smtpHost" defaultValue={config.smtpHost} placeholder="smtp.exemplo.com" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-laranja focus:border-laranja" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Porta</label>
                <input name="smtpPort" defaultValue={config.smtpPort} placeholder="587" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-laranja focus:border-laranja" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Criptografia</label>
                <select name="smtpEncryption" defaultValue={config.smtpEncryption} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-laranja focus:border-laranja">
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">Nenhuma</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <ShieldCheck size={18} className="text-laranja" /> Autenticação
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuário / E-mail</label>
              <input name="smtpUser" defaultValue={config.smtpUser} placeholder="contato@empresa.com" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-laranja focus:border-laranja" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input name="smtpPass" type="password" defaultValue={config.smtpPass} placeholder="••••••••" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-laranja focus:border-laranja" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Mail size={18} className="text-laranja" /> Remetente Padrão
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Remetente</label>
              <input name="fromName" defaultValue={config.fromName} placeholder="Neto Serviços" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-laranja focus:border-laranja" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de Resposta (Reply-to)</label>
              <input name="replyTo" defaultValue={config.replyTo} placeholder="suporte@empresa.com" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-laranja focus:border-laranja" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}