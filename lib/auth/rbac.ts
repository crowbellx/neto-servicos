export const ROLES = ['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN'] as const;

export type Role = (typeof ROLES)[number];

const roleRank: Record<Role, number> = {
  VIEWER: 1,
  EDITOR: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

const routePermissions: Array<{ prefix: string; minRole: Role }> = [
  { prefix: '/admin/configuracoes/usuarios', minRole: 'ADMIN' },
  { prefix: '/admin/configuracoes/logs', minRole: 'ADMIN' },
  { prefix: '/admin/configuracoes/email', minRole: 'ADMIN' },
  { prefix: '/admin/configuracoes/integracoes', minRole: 'ADMIN' },
  { prefix: '/admin/configuracoes/seo', minRole: 'ADMIN' },
  { prefix: '/admin/configuracoes/geral', minRole: 'ADMIN' },
  { prefix: '/admin/analytics', minRole: 'VIEWER' },
  { prefix: '/admin/blog', minRole: 'EDITOR' },
  { prefix: '/admin/portfolio', minRole: 'EDITOR' },
  { prefix: '/admin/paginas', minRole: 'VIEWER' }, // Permitir que todos vejam a lista
];

export function normalizeRole(role?: string | null): Role {
  if (!role) return 'VIEWER';
  const r = String(role).toUpperCase();
  return (ROLES as readonly string[]).includes(r) ? (r as Role) : 'VIEWER';
}

export function hasRequiredRole(userRole: string | null | undefined, minRole: Role) {
  return roleRank[normalizeRole(userRole)] >= roleRank[minRole];
}

export function canAccessAdminPath(pathname: string, role: string | undefined | null) {
  const match = routePermissions.find((rule) => pathname.startsWith(rule.prefix));
  if (!match) return true;
  return hasRequiredRole(role, match.minRole);
}