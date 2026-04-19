// Middleware — berjalan di Edge Runtime untuk setiap request
// Hanya mengimport auth.config.ts (Edge-safe, tanpa Prisma/bcrypt)
// Logika redirect ada di authConfig.callbacks.authorized

import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

// Buat middleware dari konfigurasi Edge-safe
export default NextAuth(authConfig).auth

export const config = {
  // Jalankan middleware untuk semua path kecuali: API auth, static files, gambar
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
