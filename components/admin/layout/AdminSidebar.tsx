'use client';

import { useState, type ComponentType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Users, 
  Mail, 
  FileSignature, 
  UserSquare2, 
  Files, 
  Settings, 
  Image as ImageIcon, 
  MenuSquare,
  ChevronLeft,
  ChevronRight,
  Globe,
  PenSquare,
  DollarSign,
} from 'lucide-react';
import { hasRequiredRole } from '@/lib/auth/rbac';

type NavItem = {
  name: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  badgeKey?: 'leads';
  minRole?: 'VIEWER' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';
};

const navItems: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'Performance',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'Comercial & Vendas',
    items: [
      { name: 'Leads & Mensagem', href: '/admin/leads', icon: Mail, badgeKey: 'leads' },
      { name: 'Orçamentos', href: '/admin/orcamentos', icon: FileSignature, minRole: 'EDITOR' },
      { name: 'Clientes', href: '/admin/clientes', icon: Users, minRole: 'EDITOR' },
      { name: 'Financeiro', href: '/admin/financeiro', icon: DollarSign, minRole: 'ADMIN' },
    ]
  },
  {
    title: 'Gestão de Conteúdo',
    items: [
      { name: 'Páginas do Site', href: '/admin/paginas', icon: Globe, minRole: 'EDITOR' },
      { name: 'Serviços', href: '/admin/servicos', icon: Settings, minRole: 'VIEWER' },
      { name: 'Portfólio', href: '/admin/portfolio', icon: Briefcase, minRole: 'EDITOR' },
      { name: 'Blog / Notícias', href: '/admin/blog', icon: FileText, minRole: 'EDITOR' },
      { name: 'Depoimentos', href: '/admin/depoimentos', icon: MessageSquare, minRole: 'EDITOR' },
    ]
  },
  {
    title: 'Administração',
    items: [
      { name: 'Mídia', href: '/admin/midia', icon: ImageIcon, minRole: 'EDITOR' },
      { name: 'Menus & Rodapé', href: '/admin/menus', icon: MenuSquare, minRole: 'ADMIN' },
      { name: 'Equipe', href: '/admin/equipe', icon: UserSquare2, minRole: 'ADMIN' },
      { name: 'Configurações', href: '/admin/configuracoes/geral', icon: Settings, minRole: 'ADMIN' },
      { name: 'Logs de Sistema', href: '/admin/configuracoes/logs', icon: Files, minRole: 'ADMIN' },
    ]
  }
];

export default function AdminSidebar({
  userRole,
  unreadLeadCount = 0,
}: {
  userRole?: string;
  unreadLeadCount?: number;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const badges = {
    leads: unreadLeadCount,
  };

  return (
    <aside className={`bg-[#1A1C1E] text-white transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'} border-r border-white/5 shadow-2xl z-40`}>
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-laranja rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-laranja/20">N</div>
            <span className="font-bold text-lg tracking-tight text-white/90">Painel Neto</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all ${collapsed ? 'mx-auto' : ''}`}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 scrollbar-none hover:scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {navItems.map((section, i) => (
          <div key={i} className="mb-8">
            {!collapsed && (
              <h3 className="px-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1 px-3">
              {section.items.map((item, j) => {
                if (item.minRole && !hasRequiredRole(userRole, item.minRole)) {
                  return null;
                }

                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                const Icon = item.icon;
                const badgeValue = item.badgeKey ? badges[item.badgeKey] : 0;
                
                return (
                  <li key={j}>
                    <Link 
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                        isActive 
                          ? 'bg-laranja text-white shadow-lg shadow-laranja/10' 
                          : 'text-white/40 hover:bg-white/[0.03] hover:text-white'
                      }`}
                      title={collapsed ? item.name : undefined}
                    >
                      <Icon size={20} className={`shrink-0 ${isActive ? 'text-white' : 'text-white/30 group-hover:text-white group-hover:scale-110 transition-transform'}`} />
                      
                      {!collapsed && (
                        <span className="ml-3 text-sm font-medium truncate flex-1 tracking-tight">
                          {item.name}
                        </span>
                      )}

                      {!collapsed && badgeValue > 0 && (
                        <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-laranja' : 'bg-laranja text-white'}`}>
                          {badgeValue}
                        </span>
                      )}

                      {collapsed && badgeValue > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-laranja rounded-full ring-2 ring-[#1A1C1E]"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-white/5 bg-black/10">
        {!collapsed ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Versão 1.5.0</span>
              <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Online</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        )}
      </div>
    </aside>
  );
}