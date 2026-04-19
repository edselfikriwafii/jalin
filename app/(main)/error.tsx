'use client'

// Error boundary untuk semua halaman utama (di dalam layout dengan navbar)
// Berbeda dari app/error.tsx — ini muncul di dalam layout sehingga navbar tetap terlihat

import { useEffect } from 'react'
import Link from 'next/link'

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[MainError]', error)
  }, [error])

  return (
    <div className="flex items-center justify-center px-4 py-24">
      <div className="text-center space-y-4 max-w-sm">
        <p className="font-serif text-5xl text-error">!</p>
        <h1 className="font-serif text-xl text-text-primary">Terjadi kesalahan</h1>
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
          <Link
            href="/dashboard"
            className="px-5 py-2.5 border border-border text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors text-sm"
          >
            Ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
