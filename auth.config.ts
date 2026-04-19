// Konfigurasi NextAuth yang AMAN untuk Edge Runtime
// File ini diimport oleh middleware.ts yang berjalan di Edge
// PENTING: Jangan import apapun yang menggunakan Node.js (Prisma, bcrypt, fs, dll.)

import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  session: { strategy: 'jwt' as const },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    // authorized: dipanggil oleh middleware untuk setiap request
    // Memutuskan apakah user boleh akses URL yang diminta
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const pathname = nextUrl.pathname

      const isAuthPage =
        pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/verify-email')

      // Halaman yang boleh diakses tanpa login
      const isPublicPath = isAuthPage || pathname === '/'

      // Sudah login + coba akses halaman auth → lempar ke dashboard
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      // Belum login + coba akses halaman protected → NextAuth redirect ke /login
      if (!isLoggedIn && !isPublicPath) {
        return false
      }

      return true
    },
  },

  // Providers diisi di auth.ts (membutuhkan Prisma & bcrypt, tidak bisa di Edge)
  providers: [],
} satisfies NextAuthConfig
