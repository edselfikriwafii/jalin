'use server'

// Server Action untuk login
// Memanggil NextAuth signIn — jika berhasil, NextAuth akan throw NEXT_REDIRECT
// (ini normal, bukan error sungguhan)

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

type State = { error?: string } | null

export async function loginUser(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/dashboard',
    })

    // Baris ini tidak pernah tercapai — signIn selalu throw redirect saat sukses
    return null
  } catch (error) {
    // AuthError = email/password salah, email belum diverifikasi, dll.
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            error:
              'Email atau password salah. Pastikan email sudah diverifikasi.',
          }
        default:
          return { error: 'Login gagal. Coba lagi.' }
      }
    }

    // Selain AuthError harus di-throw kembali — ini adalah redirect dari Next.js
    throw error
  }
}
