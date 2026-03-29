'use client';

import { useMemo, useState, useEffect } from 'react';
import { Search, Bell, ExternalLink, LogOut, User as UserIcon, Settings, Command, X } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type CommandItem = { label: string; href: string; category: string };

const commandItems: CommandItem[] = [
  { label: 'Dashboard', href: '/admin', category: 'Navegação' },
  { label: 'Analytics', href: '/admin/analytics', category: 'Navegação' },
  { label: 'Leads', href: '/admin/leads', category: 'Navegação' },
  { label: 'Portfólio', href: '/admin/portfolio', category: 'Navegação' },
  { label: 'Blog', href: '/admin/blog', category: 'Navegação' },
  { label: 'Novo projeto', href: '/admin/portfolio/novo', category: 'Ações' },
  { label: 'Novo post', href: '/admin/blog/novo', category: 'Ações' },
  { label: 'Configurações gerais', href: '/admin/configuracoes/geral', category: 'Navegação' },
];

type NotificationItem = {
  id: string;
  title: string;
  when: string;
  href: string;
  tone?: 'default' | 'danger';
};

export default function AdminTopbar({
  user,
  unreadNotificationCount = 0,
  notifications = [],
}: {
  user: any;
  unreadNotificationCount?: number;
  notifications?: NotificationItem[];
}) {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredCommands = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return commandItems;
    return commandItems.filter(
      (item) =>
        item.label.toLowerCase().includes(value) ||
        item.category.toLowerCase().includes(value),
    );
  }, [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setShowCommandPalette((v) => {
          const next = !v;
          if (next) {
            setQuery('');
            setActiveIndex(0);
          }
          return next;
        });
      }
      if (showCommandPalette && event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((idx) => Math.min(idx + 1, Math.max(filteredCommands.length - 1, 0)));
      }
      if (showCommandPalette && event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((idx) => Math.max(idx - 1, 0));
      }
      if (showCommandPalette && event.key === 'Enter' && filteredCommands[activeIndex]) {
        event.preventDefault();
        router.push(filteredCommands[activeIndex].href);
        setShowCommandPalette(false);
      }
      if (event.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, filteredCommands, router, showCommandPalette]);

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex-1 flex items-center">
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setActiveIndex(0);
              setShowCommandPalette(true);
            }}
            className="relative w-96 hidden md:flex items-center text-left pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-laranja/40 focus:outline-none focus:ring-2 focus:ring-laranja/20 focus:border-laranja transition-all"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            Buscar projetos, posts, leads, configurações...
            <span className="ml-auto inline-flex items-center gap-1 rounded border bg-white px-2 py-0.5 text-[11px] text-gray-500">
              <Command size={12} /> K
            </span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-laranja transition-colors font-medium"
          >
            Ver site <ExternalLink size={16} />
          </a>

          <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotificationMenu((v) => !v)}
              className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell size={20} />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-0.5 -right-1 min-w-5 h-5 px-1 rounded-full bg-laranja text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-sm font-semibold text-gray-900">Notificações</p>
                </div>
                {notifications.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-500">Sem notificações recentes.</p>
                ) : (
                  notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={notification.href}
                      className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <p className={`text-sm ${notification.tone === 'danger' ? 'text-red-600' : 'text-gray-800'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{notification.when}</p>
                    </Link>
                  ))
                )}
                <div className="h-px bg-gray-100 my-1" />
                <Link href="/admin/notificacoes" className="block px-4 py-2 text-sm text-laranja hover:bg-gray-50">
                  Ver todas as notificações
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-1 pr-2 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="w-8 h-8 rounded-full bg-grafite text-white flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-gray-100 mb-2">
                  <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                
                <Link href="/admin/perfil" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-laranja transition-colors">
                  <UserIcon size={16} /> Meu perfil
                </Link>
                <Link href="/admin/configuracoes/geral" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-laranja transition-colors">
                  <Settings size={16} /> Configurações
                </Link>
                
                <div className="h-px bg-gray-100 my-2"></div>
                
                <button 
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} /> Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showCommandPalette && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center px-4 pt-24" onClick={() => setShowCommandPalette(false)}>
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative border-b border-gray-100">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Buscar projetos, posts, leads, configurações..."
                className="w-full pl-11 pr-12 py-4 text-sm outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-gray-100 text-gray-500"
                onClick={() => setShowCommandPalette(false)}
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[420px] overflow-auto py-2">
              {filteredCommands.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-500">Nenhum resultado encontrado.</p>
              ) : (
                filteredCommands.map((item) => (
                  <Link
                    key={`${item.category}-${item.href}`}
                    href={item.href}
                    onClick={() => setShowCommandPalette(false)}
                    className={`flex items-center justify-between px-4 py-2.5 ${filteredCommands[activeIndex]?.href === item.href ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                  >
                    <span className="text-sm text-gray-800">{item.label}</span>
                    <span className="text-xs text-gray-400">{item.category}</span>
                  </Link>
                ))
              )}
            </div>
            <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
              Use <kbd className="px-1.5 py-0.5 border rounded">↑↓</kbd> para navegar e <kbd className="px-1.5 py-0.5 border rounded">Enter</kbd> para abrir.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
