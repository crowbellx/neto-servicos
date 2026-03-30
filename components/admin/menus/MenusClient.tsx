'use client';

import { useState } from 'react';
import { Plus, GripVertical, Edit2, Trash2, Save, X } from 'lucide-react';
import { createMenu, updateMenu, deleteMenu } from '@/app/actions/menus';
import { toast } from 'sonner';

export default function MenusClient({ initialMenus }: { initialMenus: any[] }) {
  const [menus, setMenus] = useState(initialMenus);
  const [selectedMenu, setSelectedMenu] = useState<any | null>(menus[0] || null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const location = formData.get('location') as string;

    const res = await createMenu({ name, location, items: '[]' });
    if (res.success) {
      setMenus([res.data, ...menus]);
      setSelectedMenu(res.data);
      setIsCreating(false);
      toast.success('Menu criado!');
    }
  };

  const handleSaveItems = async () => {
    if (!selectedMenu) return;
    setIsSaving(true);
    const res = await updateMenu(selectedMenu.id, { items: selectedMenu.items });
    setIsSaving(false);
    if (res.success) toast.success('Menu salvo!');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este menu?')) return;
    const res = await deleteMenu(id);
    if (res.success) {
      setMenus(menus.filter(m => m.id !== id));
      setSelectedMenu(menus[0] || null);
      toast.success('Menu excluído');
    }
  };

  const addItem = (label: string, url: string) => {
    if (!selectedMenu) return;
    const items = JSON.parse(selectedMenu.items || '[]');
    items.push({ label, url });
    setSelectedMenu({ ...selectedMenu, items: JSON.stringify(items) });
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Lista de Menus */}
      <div className="w-80 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Menus</h2>
          <button onClick={() => setIsCreating(true)} className="p-1.5 bg-laranja/10 text-laranja rounded-md hover:bg-laranja/20">
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-2 overflow-y-auto">
          {menus.map((menu) => (
            <div 
              key={menu.id} 
              onClick={() => setSelectedMenu(menu)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedMenu?.id === menu.id ? 'bg-orange-50 border-laranja/30' : 'bg-white border-gray-100 hover:border-gray-200'}`}
            >
              <div className="flex justify-between items-start">
                <h3 className={`font-bold text-sm ${selectedMenu?.id === menu.id ? 'text-laranja' : 'text-gray-900'}`}>{menu.name}</h3>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(menu.id); }} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-wider">{menu.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editor de Itens */}
      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
        {selectedMenu ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Editando: {selectedMenu.name}</h2>
                <p className="text-sm text-gray-500">Gerencie os links deste menu</p>
              </div>
              <button onClick={handleSaveItems} disabled={isSaving} className="bg-laranja text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                <Save size={18} /> {isSaving ? 'Salvando...' : 'Salvar Menu'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-sm text-gray-900 mb-4">Adicionar Link</h3>
                  <div className="space-y-3">
                    <input id="new-label" placeholder="Texto do Link" className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none" />
                    <input id="new-url" placeholder="URL (ex: /sobre)" className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none" />
                    <button 
                      onClick={() => {
                        const l = document.getElementById('new-label') as HTMLInputElement;
                        const u = document.getElementById('new-url') as HTMLInputElement;
                        if (l.value && u.value) {
                          addItem(l.value, u.value);
                          l.value = ''; u.value = '';
                        }
                      }}
                      className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold"
                    >
                      Adicionar ao Menu
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-2 overflow-y-auto pr-2">
                {JSON.parse(selectedMenu.items || '[]').map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl group hover:border-laranja/30">
                    <GripVertical size={18} className="text-gray-300 cursor-move" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.url}</p>
                    </div>
                    <button 
                      onClick={() => {
                        const items = JSON.parse(selectedMenu.items);
                        items.splice(idx, 1);
                        setSelectedMenu({ ...selectedMenu, items: JSON.stringify(items) });
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Plus size={48} className="mb-4 opacity-20" />
            <p>Selecione ou crie um menu para começar</p>
          </div>
        )}
      </div>

      {/* Modal Novo Menu */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Novo Menu</h3>
              <button type="button" onClick={() => setIsCreating(false)}><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Nome do Menu</label>
                <input name="name" required placeholder="Ex: Menu Principal" className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-laranja" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Localização (Slug)</label>
                <input name="location" required placeholder="Ex: header-main" className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-laranja font-mono" />
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-bold text-gray-500">Cancelar</button>
              <button type="submit" className="px-6 py-2 bg-laranja text-white rounded-lg font-bold text-sm">Criar Menu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}