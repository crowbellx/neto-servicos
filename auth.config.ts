import type { NextAuthConfig } from 'next-auth';
import { canAccessAdminPath } from '@/lib/auth/rbac';
 
export const authConfig = {
  secret: process.env.AUTH_SECRET || 'secret-for-development-only',
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      
      if (isOnAdmin) {
        // Rotas públicas no admin
        const isPublicAdminRoute = 
          nextUrl.pathname === '/admin/login' || 
          nextUrl.pathname === '/admin/recuperar-senha' ||
          nextUrl.pathname.startsWith('/admin/nova-senha/');

        if (isPublicAdminRoute) {
          if (isLoggedIn) return Response.redirect(new URL('/admin', nextUrl));
          return true;
        }
        
        if (!isLoggedIn) return false; // Redireciona para o login
        
        const userRole = (auth as any).user?.role || 'VIEWER';
        if (!canAccessAdminPath(nextUrl.pathname, userRole)) {
          return Response.redirect(new URL('/admin', nextUrl));
        }

        return true;
      } else if (isLoggedIn && nextUrl.pathname === '/admin/login') {
        return Response.redirect(new URL('/admin', nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
