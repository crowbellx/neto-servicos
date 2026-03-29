'use client';

import { useState } from 'react';
import { Menu as MenuIcon, Plus, GripVertical, Edit2, Trash2, Save } from 'lucide-react';
import { Menu } from '@prisma/client';

interface MenusClientProps {
  initialMenus: Menu[];
}

export default function MenusClient({ initialMenus }: MenusClientProps) {
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(menus[0] || null);

  const parsedItems = selectedMenu && selectedMenu.items ? JSON.parse(selectedMenu.items) : [];

  return (
    <div className="flex-1 flex gap-6 min-h-0">
      {/* Coluna Esquerda - Lista de Menus */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Seus Menus</h2>
          <button className="text-laranja hover:bg-orange-50 p-1.5 rounded-md transition-colors" title="Criar novo menu">
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-2">
          {menus.map((menu) => {
            const itemsCount = menu.items ? JSON.parse(menu.items).length : 0;
            return (
              <div 
                key={menu.id} 
                onClick={() => setSelectedMenu(menu)}
                className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                  selectedMenu?.id === menu.id ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-bold ${selectedMenu?.id === menu.id ? 'text-laranja' : 'text-gray-900'}`}>{menu.name}</h3>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{menu.location}</span>
                </div>
                <p className="text-sm text-gray-500">{itemsCount} itens</p>
              </div>
            );
          })}
          {menus.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              Nenhum menu encontrado.
            </div>
          )}
        </div>
      </div>

      {/* Coluna Direita - Editor do Menu Selecionado */}
      {selectedMenu ? (
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Editando: {selectedMenu.name}</h2>
                <p className="text-sm text-gray-500">Arraste e solte para reordenar os itens</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-laranja text-white rounded-lg text-sm font-medium hover:bg-[#D4651A] transition-colors shadow-sm">
                <Save size={16} /> Salvar Menu
              </button>
            </div>

            <div className="flex gap-6">
              {/* Adicionar Itens */}
              <div className="w-64 flex-shrink-0 space-y-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-3 border-b border-gray-200 font-medium text-gray-900 text-sm">
                    Adicionar Páginas
                  </div>
                  <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="rounded text-laranja focus:ring-laranja" /> Início
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="rounded text-laranja focus:ring-laranja" /> Sobre Nós
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="rounded text-laranja focus:ring-laranja" /> Serviços
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="rounded text-laranja focus:ring-laranja" /> Contato
                    </label>
                  </div>
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <button className="w-full py-1.5 bg-white border border-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                      Adicionar ao Menu
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-3 border-b border-gray-200 font-medium text-gray-900 text-sm">
                    Link Personalizado
                  </div>
                  <div className="p-3 space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">URL</label>
                      <input type="url" placeholder="https://" className="w-full border border-gray-200 rounded p-1.5 text-sm focus:ring-laranja focus:border-laranja outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Texto do Link</label>
                      <input type="text" placeholder="Ex: Meu Link" className="w-full border border-gray-200 rounded p-1.5 text-sm focus:ring-laranja focus:border-laranja outline-none" />
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <button className="w-full py-1.5 bg-white border border-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                      Adicionar ao Menu
                    </button>
                  </div>
                </div>
              </div>

              {/* Estrutura do Menu */}
              <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-4 min-h-[400px]">
                <div className="space-y-2">
                  {parsedItems.map((item: any, index: number) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between group hover:border-laranja transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="cursor-move text-gray-400 hover:text-gray-600">
                          <GripVertical size={18} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{item.label}</div>
                          <div className="text-xs text-gray-500 font-mono">{item.url}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-400 hover:text-laranja hover:bg-orange-50 rounded transition-colors" title="Editar">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Remover">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {parsedItems.length === 0 && (
                    <div className="text-center py-12 text-gray-500 text-sm">
                      Nenhum item neste menu.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-center text-gray-500">
            <MenuIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p>Selecione um menu para editar ou crie um novo.</p>
          </div>
        </div>
      )}
    </div>
  );
}
