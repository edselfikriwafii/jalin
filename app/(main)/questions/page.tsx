// Halaman pilih mode — titik masuk sebelum memilih soal
// Mode Latihan → /questions/practice
// Mode Ujian   → /questions/exam

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mulai Latihan — Jalin',
}

export default function QuestionsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-1">
        <h1 className="font-serif text-3xl text-text-primary">Pilih Mode</h1>
        <p className="text-text-secondary text-sm">
          Tentukan bagaimana kamu ingin berlatih hari ini
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Mode Latihan */}
        <Link
          href="/questions/practice"
          className="block bg-surface border border-border rounded-lg shadow-retro p-6 hover:shadow-retro-lg hover:-translate-y-0.5 transition-all space-y-3"
        >
          <div className="text-2xl">📖</div>
          <div>
            <div className="font-serif text-xl text-text-primary">Mode Latihan</div>
            <p className="text-text-secondary text-sm mt-1">
              Tanpa batas waktu. Kerjakan soal dengan santai, pelajari soal sebelum mulai,
              dan pahami feedback AI secara mendalam.
            </p>
          </div>
          <div className="text-primary text-sm font-medium">Pilih soal →</div>
        </Link>

        {/* Mode Ujian */}
        <Link
          href="/questions/exam"
          className="block bg-primary text-surface border border-primary-hover rounded-lg shadow-retro-primary p-6 hover:-translate-y-0.5 transition-all space-y-3"
        >
          <div className="text-2xl">⏱</div>
          <div>
            <div className="font-serif text-xl">Mode Ujian</div>
            <p className="text-sm opacity-80 mt-1">
              Dengan countdown timer. Simulasi kondisi ujian IELTS nyata — soal
              baru terlihat setelah timer dimulai.
            </p>
          </div>
          <div className="text-sm font-medium opacity-90">Pilih soal →</div>
        </Link>
      </div>
    </div>
  )
}
