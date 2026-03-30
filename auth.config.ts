import type { NextAuthConfig } from 'next-auth';
import { canAccessAdminPath } from '@/lib/auth/rbac';
 
const AUTH_SECRET = process.env.AUTH_SECRET || 'neto-servicos-estrat-123456789';

export const authConfig = {
  secret: AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      
      if (isOnAdmin) {
        const isPublicAdminRoute = 
          nextUrl.pathname === '/admin/login' || 
          nextUrl.pathname === '/admin/recuperar-senha' ||
          nextUrl.pathname.startsWith('/admin/nova-senha/');

        if (isPublicAdminRoute) {
          if (isLoggedIn) return Response.redirect(new URL('/admin', nextUrl));
          return true;
        }
        
        if (!isLoggedIn) return false;
        
        // Verificação de permissões
        const userRole = (auth?.user as any)?.role;
        if (!canAccessAdminPath(nextUrl.pathname, userRole)) {
          // Se não tem permissão para a sub-rota, manda para a home do admin em vez do login
          if (nextUrl.pathname !== '/admin') {
            return Response.redirect(new URL('/admin', nextUrl));
          }
        }

        return true;
      }
      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }
      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;