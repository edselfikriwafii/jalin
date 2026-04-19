'use server'

// Server Action untuk memverifikasi email menggunakan token dari URL
// Dipanggil dari halaman /verify-email saat halaman pertama kali dibuka

import { prisma } from '@/lib/prisma'

type VerifyResult =
  | { success: true }
  | { success: false; error: string }

export async function verifyEmail(token: string): Promise<VerifyResult> {
  if (!token) {
    return { success: false, error: 'Token tidak ditemukan di URL.' }
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  })

  // Token tidak ada di database (sudah dipakai atau tidak valid)
  if (!record) {
    return { success: false, error: 'Link verifikasi tidak valid atau sudah pernah digunakan.' }
  }

  // Token sudah kadaluarsa
  if (record.expiresAt < new Date()) {
    // Hapus token yang expired agar database tetap bersih
    await prisma.verificationToken.delete({ where: { id: record.id } })
    return {
      success: false,
      error: 'Link verifikasi sudah kadaluarsa (berlaku 24 jam). Silakan daftar ulang.',
    }
  }

  // Semua valid — tandai email sebagai terverifikasi
  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: new Date() },
  })

  // Hapus token setelah dipakai — tidak bisa digunakan dua kali
  await prisma.verificationToken.delete({ where: { id: record.id } })

  return { success: true }
}
