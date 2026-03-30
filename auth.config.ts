import type { NextAuthConfig } from 'next-auth';
import { canAccessAdminPath } from '@/lib/auth/rbac';
 
export const authConfig = {
  // Se AUTH_SECRET não estiver no .env, usamos um fallback para evitar que a sessão falhe no preview
  secret: process.env.AUTH_SECRET || 'neto-servicos-super-secret-key-123',
  trustHost: true, // Importante para ambientes de preview/cloud
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
        
        const userRole = (auth?.user as any)?.role || 'VIEWER';
        
        if (!canAccessAdminPath(nextUrl.pathname, userRole)) {
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