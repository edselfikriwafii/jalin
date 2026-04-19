// Layout untuk semua halaman utama — halaman yang butuh login
// Middleware sudah handle redirect, tapi ada double-check di sini untuk keamanan

import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { signOut } from '@/auth'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-border bg-surface">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-xl text-text-primary hover:text-primary transition-colors">
            Jalin
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/questions"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Soal Latihan
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary hidden sm:block">
                {session.user.name}
              </span>

              {/* Tombol logout — Server Action inline */}
              <form
                action={async () => {
                  'use server'
                  await signOut({ redirectTo: '/login' })
                }}
              >
                <button
                  type="submit"
                  className="text-sm px-3 py-1.5 border border-border rounded hover:bg-background transition-colors text-text-secondary"
                >
                  Keluar
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Konten halaman */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
