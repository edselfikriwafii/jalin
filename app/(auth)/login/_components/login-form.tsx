'use client'

// Komponen form login — perlu 'use client' karena pakai useActionState & useFormStatus

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { loginUser } from '@/actions/auth/login'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 px-4 bg-primary text-surface font-medium rounded border border-primary-hover shadow-retro-primary hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Masuk...' : 'Masuk'}
    </button>
  )
}

export function LoginForm({ verified }: { verified?: boolean }) {
  const [state, action] = useActionState(loginUser, null)

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl text-text-primary">Masuk</h1>
        <p className="text-text-secondary text-sm">
          Belum punya akun?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Daftar gratis
          </Link>
        </p>
      </div>

      {/* Pesan sukses setelah verifikasi email */}
      {verified && (
        <div className="p-3 bg-surface border border-success rounded text-success text-sm">
          Email berhasil diverifikasi! Silakan login.
        </div>
      )}

      {/* Pesan error dari Server Action */}
      {state?.error && (
        <div className="p-3 bg-surface border border-error rounded text-error text-sm">
          {state.error}
        </div>
      )}

      <div className="space-y-4">
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
            autoComplete="current-password"
            placeholder="Password kamu"
            className="w-full px-3 py-2.5 bg-surface border border-border rounded text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  )
}
