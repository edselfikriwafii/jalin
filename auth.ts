// Konfigurasi NextAuth v5 LENGKAP — berjalan di Node.js, bukan Edge
// Mengextend authConfig dengan provider credentials yang butuh Prisma & bcrypt

import NextAuth, { type DefaultSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'
import { authConfig } from './auth.config'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/password'

// Tambahkan field `id` ke tipe Session.user
// Next-auth secara default tidak menyertakan `id` — kita deklarasikan sendiri
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await prisma.user.findUnique({ where: { email } })

        // Tolak login jika: user tidak ada, tidak punya password, atau belum verifikasi
        if (!user || !user.passwordHash || !user.emailVerified) return null

        const isValid = await comparePassword(password, user.passwordHash)
        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],

  callbacks: {
    // Salin callbacks dari authConfig, tambahkan jwt & session untuk menyertakan id
    ...authConfig.callbacks,

    // jwt: tambahkan `id` ke token saat pertama login
    jwt({ token, user }) {
      if (user?.id) token.id = user.id
      return token
    },

    // session: salin `id` dari token ke session agar bisa diakses di komponen
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
})
