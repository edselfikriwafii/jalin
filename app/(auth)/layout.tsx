// Layout untuk semua halaman autentikasi (register, login, verify-email)
// Menampilkan konten di tengah layar dengan card bergaya retro

import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Nama aplikasi di atas card */}
      <div className="mb-8 text-center">
        <Link href="/" className="font-serif text-3xl text-text-primary hover:text-primary transition-colors">
          Jalin
        </Link>
        <p className="text-text-secondary text-sm mt-1">Jago Lingo</p>
      </div>

      {/* Card utama */}
      <div className="w-full max-w-md bg-surface border border-border rounded-lg shadow-retro p-8">
        {children}
      </div>
    </div>
  )
}
