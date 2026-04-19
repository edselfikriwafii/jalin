import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { verifyEmail } from '@/actions/auth/verify-email'

export const metadata: Metadata = {
  title: 'Verifikasi Email — Jalin',
}

// Halaman ini adalah Server Component yang langsung menjalankan verifikasi
// saat dibuka — user hanya perlu klik link, tidak perlu klik tombol apapun
export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  // Token tidak ada di URL → tampilkan instruksi
  if (!token) {
    return (
      <div className="text-center space-y-4">
        <h1 className="font-serif text-2xl text-text-primary">Verifikasi Email</h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          Link verifikasi tidak valid. Pastikan kamu membuka link yang dikirim ke email kamu.
        </p>
        <Link
          href="/register"
          className="inline-block text-primary hover:underline text-sm"
        >
          Kembali ke halaman daftar
        </Link>
      </div>
    )
  }

  // Jalankan verifikasi
  const result = await verifyEmail(token)

  // Jika berhasil, redirect ke login dengan pesan sukses
  if (result.success) {
    redirect('/login?verified=true')
  }

  // Jika gagal, tampilkan pesan error yang jelas
  return (
    <div className="text-center space-y-4">
      <div className="w-12 h-12 bg-error rounded-full flex items-center justify-center mx-auto text-surface text-xl">
        ✕
      </div>
      <h1 className="font-serif text-2xl text-text-primary">Verifikasi Gagal</h1>
      <p className="text-text-secondary text-sm leading-relaxed">{result.error}</p>
      <div className="space-y-2">
        <Link
          href="/register"
          className="block text-primary hover:underline text-sm"
        >
          Daftar ulang dengan email yang sama
        </Link>
        <Link
          href="/login"
          className="block text-text-secondary hover:underline text-sm"
        >
          Sudah punya akun? Login
        </Link>
      </div>
    </div>
  )
}
