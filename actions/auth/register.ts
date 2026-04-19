'use server'

// Server Action untuk registrasi user baru
// Dipanggil langsung dari form di halaman register — tidak perlu API route terpisah

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { sendVerificationEmail } from '@/lib/email/send-verification'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  })

type State = { error?: string; success?: string } | null

export async function registerUser(
  prevState: State,
  formData: FormData
): Promise<State> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  }

  // Validasi format input — akses error via parsed.error.issues (Zod v4)
  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { name, email, password } = parsed.data

  try {
    // Cek apakah email sudah terdaftar
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return { error: 'Email ini sudah terdaftar. Silakan login atau gunakan email lain.' }
    }

    // Buat user baru (emailVerified masih null = belum aktif)
    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    })

    // Buat token verifikasi yang berlaku 24 jam
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const verificationToken = await prisma.verificationToken.create({
      data: { userId: user.id, expiresAt },
    })

    // Kirim email — jika RESEND_API_KEY kosong, link tampil di console
    await sendVerificationEmail({
      name,
      email,
      token: verificationToken.token,
    })

    return {
      success:
        'Akun berhasil dibuat! Cek email kamu untuk link verifikasi (berlaku 24 jam).',
    }
  } catch {
    return { error: 'Terjadi kesalahan server. Coba lagi dalam beberapa saat.' }
  }
}
