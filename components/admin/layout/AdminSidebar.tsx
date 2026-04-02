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
  ChevronDown,
  LayoutTemplate,
  Phone,
  Info,
} from 'lucide-react';
import { hasRequiredRole } from '@/lib/auth/rbac';

type NavItem = {
  name: string;
  href?: string; // Optional for groups
  icon: ComponentType<{ size?: number; className?: string }>;
  badgeKey?: 'leads';
  minRole?: 'VIEWER' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';
  subItems?: NavItem[];
};

const navItems: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'Monitoramento',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'Operação CRM',
    items: [
      { name: 'Leads & Mensagens', href: '/admin/leads', icon: Mail, badgeKey: 'leads' },
      { name: 'Orçamentos', href: '/admin/orcamentos', icon: FileSignature, minRole: 'EDITOR' },
      { name: 'Clientes', href: '/admin/clientes', icon: Users, minRole: 'EDITOR' },
      { name: 'Financeiro', href: '/admin/financeiro', icon: DollarSign, minRole: 'ADMIN' },
    ]
  },
  {
    title: 'Editor de Site',
    items: [
      {
        name: 'Páginas Fixas',
        icon: Globe,
        minRole: 'EDITOR',
        subItems: [
          { name: 'Início (Home)', href: '/admin/conteudo/home', icon: LayoutTemplate },
          { name: 'Sobre Nós', href: '/admin/conteudo/sobre', icon: Info },
          { name: 'Serviços', href: '/admin/conteudo/servicos', icon: Settings },
          { name: 'Portfólio', href: '/admin/conteudo/portfolio', icon: Briefcase },
          { name: 'Contato', href: '/admin/conteudo/contato', icon: Phone },
        ]
      },
      { name: 'Páginas Livres', href: '/admin/paginas', icon: PenSquare, minRole: 'EDITOR' },
      { name: 'Blog / Notícias', href: '/admin/blog', icon: FileText, minRole: 'EDITOR' },
      { name: 'Portfólio Real', href: '/admin/portfolio', icon: Briefcase, minRole: 'EDITOR' },
      { name: 'Depoimentos', href: '/admin/depoimentos', icon: MessageSquare, minRole: 'EDITOR' },
    ]
  },
  {
    title: 'Sistema',
    items: [
      { name: 'Arquivos/Mídia', href: '/admin/midia', icon: ImageIcon, minRole: 'EDITOR' },
      { name: 'Equipe Admin', href: '/admin/equipe', icon: UserSquare2, minRole: 'ADMIN' },
      { name: 'Ajustes Gerais', href: '/admin/configuracoes/geral', icon: Settings, minRole: 'ADMIN' },
      { name: 'Logs & Auditoria', href: '/admin/configuracoes/logs', icon: Files, minRole: 'ADMIN' },
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
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Páginas Fixas': true // Start Home group open by default
  });

  const badges = {
    leads: unreadLeadCount,
  };

  const toggleGroup = (name: string) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenGroups(prev => ({ ...prev, [name]: true }));
      return;
    }
    setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const isItemActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || (href !== '/admin' && pathname.startsWith(href));
  };

  const isGroupActive = (item: NavItem) => {
    if (item.href && isItemActive(item.href)) return true;
    if (item.subItems) {
      return item.subItems.some(sub => sub.href && isItemActive(sub.href));
    }
    return false;
  };

  return (
    <aside className={`bg-[#1A1C1E] text-white transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'} border-r border-white/5 shadow-2xl z-40 fixed lg:static h-full`}>
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-black/5">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-laranja rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-laranja/30 ring-2 ring-laranja/10">N</div>
            <span className="font-bold text-lg tracking-tight text-white/90">Painel Neto</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all ${collapsed ? 'mx-auto' : ''}`}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 scrollbar-none hover:scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent space-y-8">
        {navItems.map((section, i) => (
          <div key={i}>
            {!collapsed && (
              <h3 className="px-6 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1.5 px-3">
              {section.items.map((item, j) => {
                if (item.minRole && !hasRequiredRole(userRole, item.minRole)) {
                  return null;
                }

                const isActive = isItemActive(item.href);
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isOpen = !collapsed && !!openGroups[item.name];
                const activeGroup = isGroupActive(item);
                const Icon = item.icon;
                const badgeValue = item.badgeKey ? badges[item.badgeKey] : 0;
                
                return (
                  <li key={j} className="relative">
                    {hasSubItems ? (
                      <div>
                        <button 
                          onClick={() => toggleGroup(item.name)}
                          className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                            activeGroup ? 'text-white bg-white/5' : 'text-white/40 hover:bg-white/[0.03] hover:text-white'
                          }`}
                        >
                          <Icon size={20} className={`shrink-0 ${activeGroup ? 'text-laranja' : 'text-white/20 group-hover:text-white transition-colors'}`} />
                          {!collapsed && (
                            <>
                              <span className="ml-3 text-sm font-medium truncate flex-1 text-left tracking-tight">{item.name}</span>
                              <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-white/20`} />
                            </>
                          )}
                        </button>
                        
                        {isOpen && (
                          <ul className="mt-1 ml-4 border-l border-white/5 pl-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                            {item.subItems!.map((sub, k) => {
                              const SubIcon = sub.icon;
                              const isSubActive = isItemActive(sub.href);
                              return (
                                <li key={k}>
                                  <Link 
                                    href={sub.href!}
                                    className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all ${
                                      isSubActive ? 'text-laranja font-bold bg-laranja/5' : 'text-white/30 hover:text-white hover:bg-white/5'
                                    }`}
                                  >
                                    <SubIcon size={16} className="mr-3 opacity-50" />
                                    {sub.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link 
                        href={item.href!}
                        className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                          isActive 
                            ? 'bg-laranja text-white shadow-lg shadow-laranja/10' 
                            : 'text-white/40 hover:bg-white/[0.03] hover:text-white'
                        }`}
                        title={collapsed ? item.name : undefined}
                      >
                        <Icon size={20} className={`shrink-0 ${isActive ? 'text-white' : 'text-white/20 group-hover:text-white transition-transform duration-200'}`} />
                        
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
                          <span className="absolute top-2 right-2 w-2 h-2 bg-laranja rounded-full ring-2 ring-[#1A1C1E] animate-pulse"></span>
                        )}
                      </Link>
                    )}
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
              <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest">Painel v1.5.4</span>
              <div className="flex items-center gap-1.5 bg-green-500/5 px-2 py-0.5 rounded-full border border-green-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                <span className="text-[9px] font-bold text-green-500 uppercase tracking-tighter">Conectado</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          </div>
        )}
      </div>
    </aside>
  );
}