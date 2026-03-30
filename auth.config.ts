import type { NextAuthConfig } from 'next-auth';
import { canAccessAdminPath } from '@/lib/auth/rbac';
 
export const authConfig = {
  // Garantindo que o segredo exista, prioritariamente via ENV
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      
      if (isOnAdmin) {
        // Rotas que não exigem login
        const isPublicAdminRoute = 
          nextUrl.pathname === '/admin/login' || 
          nextUrl.pathname === '/admin/recuperar-senha' ||
          nextUrl.pathname.startsWith('/admin/nova-senha/');

        if (isPublicAdminRoute) {
          if (isLoggedIn) return Response.redirect(new URL('/admin', nextUrl));
          return true;
        }
        
        // Se não está logado e tenta acessar admin, NextAuth redireciona para login
        if (!isLoggedIn) return false;
        
        // Verificação de Role (RBAC)
        const userRole = (auth?.user as any)?.role || 'VIEWER';
        
        if (!canAccessAdminPath(nextUrl.pathname, userRole)) {
          console.warn(`[AUTH] Acesso negado para rota ${nextUrl.pathname} (Role: ${userRole})`);
          // Em vez de expulsar para o login, redireciona para o dashboard principal
          if (nextUrl.pathname !== '/admin') {
            return Response.redirect(new URL('/admin', nextUrl));
          }
        }

        return true;
      } else if (isLoggedIn && nextUrl.pathname === '/admin/login') {
        return Response.redirect(new URL('/admin', nextUrl));
      }
      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      // Suporte para atualização de sessão manual
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // Configurado em auth.ts
} satisfies NextAuthConfig;