// Halaman aturan ujian — ditampilkan sebelum timer dimulai
// Hanya menampilkan topik soal (BUKAN isi soal atau grafik)
// Isi soal baru terlihat setelah user klik "Mulai Ujian" dan masuk ke write page

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getQuestion } from '@/lib/questions'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const question = await getQuestion(id)
  if (!question) return { title: 'Soal Tidak Ditemukan — Jalin' }
  return { title: `Aturan Ujian — ${question.topic} — Jalin` }
}

// Aturan ujian dan durasi timer sesuai tipe soal
const EXAM_RULES = {
  PART1: {
    duration: '60 menit',
    minWords: '150 kata',
    task: 'Deskripsikan, rangkum, atau jelaskan informasi dari grafik, diagram, tabel, atau proses.',
    tips: [
      'Identifikasi tren utama dan perbandingan penting — tidak perlu sebut semua angka',
      'Tulis setidaknya 150 kata; di bawah minimum akan mempengaruhi skor Task Achievement',
      'Gunakan bahasa formal dan hindari opini pribadi',
      'Sertakan overview (gambaran umum) di paragraf pertama atau kedua',
    ],
  },
  PART2: {
    duration: '40 menit',
    minWords: '250 kata',
    task: 'Tulis esai menanggapi sudut pandang, argumen, atau permasalahan yang diberikan.',
    tips: [
      'Jawab semua bagian dari pertanyaan secara langsung',
      'Tulis setidaknya 250 kata; di bawah minimum akan mempengaruhi skor Task Response',
      'Susun esai dengan paragraf yang jelas: pendahuluan, isi, kesimpulan',
      'Dukung setiap argumen dengan alasan atau contoh yang relevan',
    ],
  },
} as const

export default async function ExamRulesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const question = await getQuestion(id)

  if (!question) notFound()

  const rules = EXAM_RULES[question.type]

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      {/* Kembali ke daftar soal ujian */}
      <Link
        href="/questions/exam"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        ← Kembali ke Daftar Soal
      </Link>

      {/* Identitas soal — topik saja, BUKAN isi soal */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
            question.type === 'PART1' ? 'bg-secondary text-surface' : 'bg-primary text-surface'
          }`}>
            {question.type === 'PART1' ? 'Part 1' : 'Part 2'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded font-medium border border-border text-text-secondary">
            {rules.duration}
          </span>
        </div>
        <h1 className="font-serif text-2xl text-text-primary">{question.topic}</h1>
        <p className="text-text-secondary text-sm">
          Baca aturan di bawah sebelum memulai. Soal baru akan terlihat setelah timer dimulai.
        </p>
      </div>

      {/* Kotak aturan ujian */}
      <div className="bg-surface border border-border rounded-lg shadow-retro p-6 space-y-5">
        <h2 className="font-serif text-lg text-text-primary">Aturan Ujian</h2>

        {/* Tugas */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">Tugas</p>
          <p className="text-text-primary text-sm">{rules.task}</p>
        </div>

        {/* Detail */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded p-3 space-y-0.5">
            <p className="text-xs text-text-secondary">Durasi</p>
            <p className="font-medium text-text-primary">{rules.duration}</p>
          </div>
          <div className="bg-background rounded p-3 space-y-0.5">
            <p className="text-xs text-text-secondary">Minimum Kata</p>
            <p className="font-medium text-text-primary">{rules.minWords}</p>
          </div>
        </div>

        {/* Tips */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">Yang Perlu Diperhatikan</p>
          <ul className="space-y-1.5">
            {rules.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                <span className="text-primary mt-0.5 shrink-0">·</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Peringatan timer */}
        <div className="border-t border-border pt-4">
          <p className="text-xs text-text-secondary">
            Timer dimulai saat kamu klik <strong className="text-text-primary">Mulai Ujian</strong>.
            Jawaban akan otomatis terkirim saat waktu habis.
          </p>
        </div>
      </div>

      {/* Tombol mulai */}
      <Link
        href={`/write/${id}?mode=EXAM`}
        className="block w-full text-center px-6 py-3 bg-primary text-surface font-medium rounded border border-primary-hover shadow-retro-primary hover:bg-primary-hover transition-colors"
      >
        Mulai Ujian — Timer Dimulai
      </Link>
    </div>
  )
}
