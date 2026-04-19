import Link from 'next/link'

// Halaman beranda — placeholder sementara, akan diperbarui saat fitur auth selesai
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        {/* Logo / nama aplikasi */}
        <div className="space-y-2">
          <h1 className="font-serif text-5xl text-text-primary">Jalin</h1>
          <p className="text-text-secondary text-lg">Jago Lingo</p>
        </div>

        {/* Deskripsi singkat */}
        <p className="text-text-secondary text-base leading-relaxed">
          Platform latihan IELTS Academic Writing dengan penilaian AI yang mendetail.
          Latihan soal Part 1 & Part 2, dan pantau perkembangan skillmu dari waktu ke waktu.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="px-6 py-3 bg-primary text-surface font-medium rounded border border-primary-hover shadow-retro-primary hover:bg-primary-hover transition-colors"
          >
            Mulai Latihan
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-surface text-text-primary font-medium rounded border border-border shadow-retro hover:bg-background transition-colors"
          >
            Masuk
          </Link>
        </div>

        {/* Status placeholder */}
        <p className="text-text-secondary text-sm">
          ✦ Project sedang dalam tahap pembangunan
        </p>
      </div>
    </main>
  )
}
