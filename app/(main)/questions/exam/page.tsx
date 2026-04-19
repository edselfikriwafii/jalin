// Halaman daftar soal untuk Mode Ujian
// Klik soal → ke halaman rules ujian (/questions/[id]/exam)
// Isi soal TIDAK ditampilkan di sini — user baru bisa lihat setelah timer dimulai

import type { Metadata } from 'next'
import Link from 'next/link'
import { getQuestions } from '@/lib/questions'
import type { QuestionType } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Mode Ujian — Jalin',
}

const DIFFICULTY_LABEL: Record<string, string> = {
  EASY: 'Mudah',
  MEDIUM: 'Sedang',
  HARD: 'Sulit',
}

const DIFFICULTY_CLASS: Record<string, string> = {
  EASY: 'bg-success text-surface',
  MEDIUM: 'bg-warning text-surface',
  HARD: 'bg-error text-surface',
}

export default async function ExamQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const params = await searchParams
  const typeFilter: QuestionType | undefined =
    params.type === 'PART1' || params.type === 'PART2'
      ? (params.type as QuestionType)
      : undefined

  const questions = await getQuestions({ type: typeFilter })

  const filterTabs = [
    { label: 'Semua', href: '/questions/exam', active: typeFilter === undefined },
    { label: 'Part 1 — Grafik', href: '/questions/exam?type=PART1', active: typeFilter === 'PART1' },
    { label: 'Part 2 — Esai', href: '/questions/exam?type=PART2', active: typeFilter === 'PART2' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <Link
          href="/questions"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          ← Ganti Mode
        </Link>
        <h1 className="font-serif text-3xl text-text-primary">Mode Ujian</h1>
        <p className="text-text-secondary text-sm">
          Pilih soal — kamu akan membaca aturan ujian sebelum timer dimulai
        </p>
      </div>

      {/* Filter tipe */}
      <div className="flex gap-2 flex-wrap">
        {filterTabs.map(({ label, href, active }) => (
          <Link
            key={label}
            href={href}
            className={`px-3 py-1.5 text-sm rounded border transition-colors ${
              active
                ? 'bg-primary text-surface border-primary'
                : 'border-border text-text-secondary hover:bg-background'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Daftar soal — hanya tampilkan topik, bukan isi soal */}
      {questions.length === 0 ? (
        <p className="text-text-secondary text-sm py-10 text-center">
          Tidak ada soal ditemukan.
        </p>
      ) : (
        <ul className="space-y-3">
          {questions.map((q) => (
            <li key={q.id}>
              {/* Menuju rules page — bukan langsung ke write */}
              <Link
                href={`/questions/${q.id}/exam`}
                className="block bg-surface border border-border rounded-lg shadow-retro p-5 hover:shadow-retro-lg hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        q.type === 'PART1' ? 'bg-secondary text-surface' : 'bg-primary text-surface'
                      }`}>
                        {q.type === 'PART1' ? 'Part 1' : 'Part 2'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${DIFFICULTY_CLASS[q.difficulty]}`}>
                        {DIFFICULTY_LABEL[q.difficulty]}
                      </span>
                    </div>
                    <p className="text-text-primary font-medium group-hover:text-primary transition-colors truncate">
                      {q.topic}
                    </p>
                  </div>
                  <span className="text-text-secondary text-xs whitespace-nowrap shrink-0 mt-0.5">
                    {q._count.submissions === 0
                      ? 'Belum dikerjakan'
                      : `${q._count.submissions}× dikerjakan`}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
