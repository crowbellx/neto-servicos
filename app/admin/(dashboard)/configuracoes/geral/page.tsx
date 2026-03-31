import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Save, Upload, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { getSettings, updateSettings } from '@/app/actions/settings';
import ImageUploadField from '@/components/admin/settings/ImageUploadField';

export default async function GeneralSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: settings } = await getSettings('general');
  const parsedSettings = settings?.data ? JSON.parse(settings.data) : {};

  const saveAction = async (formData: FormData) => {
    'use server';
    const data = Object.fromEntries(formData.entries());
    await updateSettings('general', data);
  };

  return (
    <form action={saveAction} className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações Gerais</h1>
          <p className="text-sm text-gray-500">Informações básicas da empresa e do site</p>
        </div>
        <button type="submit" className="bg-laranja text-white px-4 py-2 rounded-lg font-medium hover:bg-[#D4651A] transition-colors flex items-center gap-2">
          <Save size={18} /> Salvar Alterações
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="max-w-4xl space-y-6 pb-10">
          
          {/* Informações da Empresa */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 size={20} className="text-laranja" />
              Informações da Empresa
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-gray-900 mb-2 block">Nome da Empresa</label>
                <input 
                  type="text" 
                  name="companyName"
                  defaultValue={parsedSettings.companyName || "Neto Serviços"}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">CNPJ</label>
                <input 
                  type="text" 
                  name="cnpj"
                  defaultValue={parsedSettings.cnpj || ""}
                  placeholder="00.000.000/0000-00"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Slogan</label>
                <input 
                  type="text" 
                  name="slogan"
                  defaultValue={parsedSettings.slogan || ""}
                  placeholder="Sua frase de efeito"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Identidade Visual */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Upload size={20} className="text-laranja" />
              Identidade Visual
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploadField 
                label="Logotipo Principal" 
                name="logo" 
                defaultValue={parsedSettings.logo}
                helperText="PNG transparente recomendado"
              />
              <ImageUploadField 
                label="Favicon (Ícone da Aba)" 
                name="favicon" 
                defaultValue={parsedSettings.favicon}
                helperText="Formato ICO ou PNG 32x32"
              />
            </div>
          </div>

          {/* Contatos */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Phone size={20} className="text-laranja" />
              Contatos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" /> E-mail Principal
                </label>
                <input 
                  type="email" 
                  name="email"
                  defaultValue={parsedSettings.email || "contato@netoservicos.com.br"}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" /> Telefone / WhatsApp
                </label>
                <input 
                  type="text" 
                  name="phone"
                  defaultValue={parsedSettings.phone || "(11) 99999-9999"}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-laranja" />
              Endereço
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-gray-900 mb-2 block">Rua / Avenida</label>
                <input 
                  type="text" 
                  name="street"
                  defaultValue={parsedSettings.street || ""}
                  placeholder="Ex: Av. Paulista"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Número</label>
                <input 
                  type="text" 
                  name="number"
                  defaultValue={parsedSettings.number || ""}
                  placeholder="Ex: 1000"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Bairro</label>
                <input 
                  type="text" 
                  name="neighborhood"
                  defaultValue={parsedSettings.neighborhood || ""}
                  placeholder="Ex: Bela Vista"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Cidade</label>
                <input 
                  type="text" 
                  name="city"
                  defaultValue={parsedSettings.city || ""}
                  placeholder="Ex: São Paulo"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Estado (UF)</label>
                <input 
                  type="text" 
                  name="state"
                  defaultValue={parsedSettings.state || ""}
                  placeholder="Ex: SP"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
