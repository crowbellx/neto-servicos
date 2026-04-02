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
    title: 'Principal',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'Conteúdo do Site',
    items: [
      { name: 'Página Inicial', href: '/admin/conteudo/home', icon: Globe, minRole: 'EDITOR' as const },
      { name: 'Sobre Nós', href: '/admin/conteudo/sobre', icon: PenSquare, minRole: 'EDITOR' as const },
      { name: 'Serviços (Intro)', href: '/admin/conteudo/servicos', icon: PenSquare, minRole: 'EDITOR' as const },
      { name: 'Portfólio (Intro)', href: '/admin/conteudo/portfolio', icon: PenSquare, minRole: 'EDITOR' as const },
      { name: 'Contato', href: '/admin/conteudo/contato', icon: PenSquare, minRole: 'EDITOR' as const },
      { name: 'Páginas Fixas', href: '/admin/paginas', icon: PenSquare, minRole: 'EDITOR' as const },
    ]
  },
  {
    title: 'Conteúdo',
    items: [
      { name: 'Portfólio', href: '/admin/portfolio', icon: Briefcase, minRole: 'EDITOR' as const },
      { name: 'Blog', href: '/admin/blog', icon: FileText, minRole: 'EDITOR' as const },
      { name: 'Depoimentos', href: '/admin/depoimentos', icon: MessageSquare, minRole: 'EDITOR' as const },
      { name: 'Equipe', href: '/admin/equipe', icon: Users, minRole: 'ADMIN' as const },
    ]
  },
  {
    title: 'Gestão',
    items: [
      { name: 'Leads & Mensagens', href: '/admin/leads', icon: Mail, badgeKey: 'leads' },
      { name: 'Orçamentos', href: '/admin/orcamentos', icon: FileSignature, minRole: 'EDITOR' },
      { name: 'Financeiro', href: '/admin/financeiro', icon: DollarSign, minRole: 'ADMIN' },
      { name: 'Clientes', href: '/admin/clientes', icon: UserSquare2, minRole: 'EDITOR' },
    ]
  },
  {
    title: 'Site',
    items: [
      { name: 'Serviços', href: '/admin/servicos', icon: Settings, minRole: 'VIEWER' as const },
      { name: 'Mídia', href: '/admin/midia', icon: ImageIcon, minRole: 'EDITOR' as const },
      { name: 'Menus', href: '/admin/menus', icon: MenuSquare, minRole: 'ADMIN' as const },
    ]
  },
  {
    title: 'Configurações',
    items: [
      { name: 'Geral', href: '/admin/configuracoes/geral', icon: Settings, minRole: 'ADMIN' },
      { name: 'SEO', href: '/admin/configuracoes/seo', icon: Settings, minRole: 'ADMIN' },
      { name: 'Integrações', href: '/admin/configuracoes/integracoes', icon: Settings, minRole: 'ADMIN' },
      { name: 'E-mail', href: '/admin/configuracoes/email', icon: Mail, minRole: 'ADMIN' },
      { name: 'Usuários', href: '/admin/configuracoes/usuarios', icon: Users, minRole: 'ADMIN' },
      { name: 'Logs & Auditoria', href: '/admin/configuracoes/logs', icon: FileText, minRole: 'ADMIN' },
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
    <aside className={`bg-grafite text-white transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-60'} border-r border-white/10`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        {!collapsed && <span className="font-bold text-lg font-titulo">Neto Admin</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {navItems.map((section, i) => (
          <div key={i} className="mb-6">
            {!collapsed && (
              <h3 className="px-4 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item, j) => {
                if (item.minRole && !hasRequiredRole(userRole, item.minRole)) {
                  return null;
                }

                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                const badgeValue = item.badgeKey ? badges[item.badgeKey] : 0;
                
                return (
                  <li key={j}>
                    <Link 
                      href={item.href}
                      className={`flex items-center px-4 py-2.5 mx-2 rounded-lg transition-colors group relative ${
                        isActive 
                          ? 'bg-laranja/15 text-laranja' 
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                      title={collapsed ? item.name : undefined}
                    >
                      <Icon size={20} className={`shrink-0 ${isActive ? 'text-laranja' : 'text-white/40 group-hover:text-white'}`} />
                      
                      {!collapsed && (
                        <span className="ml-3 text-sm font-medium truncate flex-1">
                          {item.name}
                        </span>
                      )}

                      {!collapsed && badgeValue > 0 && (
                        <span className="ml-auto bg-laranja text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {badgeValue}
                        </span>
                      )}

                      {collapsed && badgeValue > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-laranja rounded-full"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/10 text-xs text-white/40 flex items-center justify-between">
        {!collapsed && <span>Admin v1.0.0</span>}
        <div className="flex items-center gap-2" title="API Online">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {!collapsed && <span>Online</span>}
        </div>
      </div>
    </aside>
  );
}