'use client'

// Error boundary global — menangkap semua error yang tidak tertangkap di level halaman manapun
// Harus 'use client' karena menggunakan useEffect dan props Error dari React

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Log error ke console agar bisa dilihat developer — di produksi bisa dikirim ke Sentry dll.
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <p className="font-serif text-5xl text-error">!</p>
        <h1 className="font-serif text-2xl text-text-primary">Terjadi kesalahan</h1>
        <p className="text-text-secondary text-sm">
          Sesuatu yang tidak terduga terjadi. Coba muat ulang halaman ini.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-primary text-surface font-medium rounded border border-primary-hover shadow-retro-primary hover:bg-primary-hover transition-colors text-sm"
          >
            Coba Lagi
          </button>
          <a
            href="/dashboard"
            className="px-5 py-2.5 border border-border text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-colors text-sm"
          >
            Ke Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
