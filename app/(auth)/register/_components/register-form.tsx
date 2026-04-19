'use client'

// Komponen form register — perlu 'use client' karena pakai useActionState & useFormStatus

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { registerUser } from '@/actions/auth/register'

// Tombol submit terpisah agar bisa menggunakan useFormStatus
// useFormStatus hanya bisa dipakai di dalam komponen yang berada di dalam <form>
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 px-4 bg-primary text-surface font-medium rounded border border-primary-hover shadow-retro-primary hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Membuat akun...' : 'Buat Akun'}
    </button>
  )
}

export function RegisterForm() {
  // useActionState: hubungkan form dengan Server Action
  // state = hasil terakhir dari Server Action (error atau success message)
  const [state, action] = useActionState(registerUser, null)

  // Jika registrasi berhasil, tampilkan pesan sukses
  if (state?.success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto text-surface text-xl">
          ✓
        </div>
        <h2 className="font-serif text-xl text-text-primary">Cek Email Kamu!</h2>
        <p className="text-text-secondary text-sm leading-relaxed">{state.success}</p>
        <p className="text-text-secondary text-xs">
          Sudah verifikasi?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Login sekarang
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl text-text-primary">Buat Akun</h1>
        <p className="text-text-secondary text-sm">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>

      {/* Pesan error dari Server Action */}
      {state?.error && (
        <div className="p-3 bg-surface border border-error rounded text-error text-sm">
          {state.error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium text-text-primary">
            Nama Lengkap
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Contoh: Budi Santoso"
            className="w-full px-3 py-2.5 bg-surface border border-border rounded text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-text-primary">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="kamu@email.com"
            className="w-full px-3 py-2.5 bg-surface border border-border rounded text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-text-primary">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            className="w-full px-3 py-2.5 bg-surface border border-border rounded text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary">
            Konfirmasi Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Ulangi password"
            className="w-full px-3 py-2.5 bg-surface border border-border rounded text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  )
}
