// Halaman 404 — ditampilkan saat URL tidak cocok dengan route manapun
// Juga muncul saat kode memanggil notFound() dari next/navigation

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <p className="font-serif text-8xl text-border">404</p>
        <h1 className="font-serif text-2xl text-text-primary">Halaman tidak ditemukan</h1>
        <p className="text-text-secondary text-sm">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-primary text-surface font-medium rounded border border-primary-hover shadow-retro-primary hover:bg-primary-hover transition-colors text-sm"
          >
            Ke Dashboard
          </Link>
          <Link
            href="/questions"
            className="px-5 py-2.5 border border-border text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-colors text-sm"
          >
            Lihat Soal
          </Link>
        </div>
      </div>
    </div>
  )
}
